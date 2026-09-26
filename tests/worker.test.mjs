import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { DatabaseSync } from 'node:sqlite';
import worker from '../dist/server/index.js';

const database = new DatabaseSync(':memory:');
database.exec(fs.readFileSync(new URL('../drizzle/0000_woozy_salo.sql', import.meta.url), 'utf8').replaceAll('--> statement-breakpoint', ''));
const DB = { prepare(sql) { const statement = database.prepare(sql); return {
  bind(...args) { return {
    all: async () => ({ results: statement.all(...args) }),
    run: async () => ({ meta: { changes: statement.run(...args).changes } })
  }; }
}; } };
const origin = 'http://site.test';
const document = () => ({ title: 'Test', device: 'desktop', pages: {
  desktop: { items: [{ id: 'one', type: 'list', x: 0, y: 0, w: 265, h: 150, text: 'First item', items: ['First item', 'Second item'] }] },
  tablet: { items: [] }, mobile: { items: [] }
} });
const request = (path, method = 'GET', body, user = 'alice', headers = {}) => worker.fetch(new Request(`${origin}${path}`, {
  method, headers: { 'oai-authenticated-user-id': user, ...(body === undefined ? {} : { 'content-type': 'application/json', origin }), ...headers },
  body: body === undefined ? undefined : typeof body === 'string' ? body : JSON.stringify(body)
}), { DB });

test('static responses have restrictive security headers', async () => {
  const response = await request('/');
  assert.equal(response.status, 200);
  assert.match(response.headers.get('content-security-policy'), /script-src 'self'/);
  assert.equal(response.headers.get('x-content-type-options'), 'nosniff');
  assert.doesNotMatch(await response.text(), /onclick=/);
  const cached = await request('/', 'GET', undefined, 'alice', { 'if-none-match': response.headers.get('etag') });
  assert.equal(cached.status, 304);
});

test('writes reject unauthenticated and cross-origin requests', async () => {
  const payload = { document: document() };
  assert.equal((await request('/api/wireframes', 'POST', payload, '')).status, 401);
  assert.equal((await request('/api/wireframes', 'POST', payload, 'alice', { origin: 'https://other.test' })).status, 403);
  assert.equal((await request('/api/wireframes', 'POST', payload, 'alice', { origin: '' })).status, 403);
});

test('writes validate JSON content, size, and element shape', async () => {
  const path = '/api/wireframes';
  assert.equal((await request(path, 'POST', { document: document() }, 'alice', { 'content-type': 'text/plain' })).status, 415);
  assert.equal((await request(path, 'POST', 'null')).status, 400);
  assert.equal((await request(path, 'POST', ' '.repeat(250001))).status, 413);
  const invalid = document(); invalid.pages.desktop.items[0].type = '__proto__';
  assert.equal((await request(path, 'POST', { document: invalid })).status, 400);
  invalid.pages.desktop.items[0].type = 'list'; invalid.pages.desktop.items[0].x = 9999;
  assert.equal((await request(path, 'POST', { document: invalid })).status, 400);
});

test('saved wireframes remain scoped to their owner', async () => {
  const created = await request('/api/wireframes', 'POST', { document: document() });
  assert.equal(created.status, 201);
  const { id } = await created.json();
  assert.equal((await (await request('/api/wireframes')).json()).items.length, 1);
  assert.equal((await (await request('/api/wireframes', 'GET', undefined, 'bob')).json()).items.length, 0);
  assert.equal((await request(`/api/wireframes/${id}`, 'PUT', { document: document() }, 'bob')).status, 404);
  assert.equal((await request(`/api/wireframes/${id}`, 'DELETE', undefined, 'bob', { origin })).status, 404);
  assert.equal((await request(`/api/wireframes/${id}`, 'DELETE', undefined, 'alice', { origin })).status, 200);
});
