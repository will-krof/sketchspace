import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import storage from '../desktop/storage.cjs';

const document = title => ({ title, device: 'desktop', pages: {
  desktop: { items: [{ id: 'one', type: 'button', x: 0, y: 0, w: 150, h: 50, text: 'Click' }] },
  tablet: { items: [] }, mobile: { items: [] }
} });

test('desktop wireframes persist, update, delete, and enforce the 10-item limit', async t => {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'sketchspace-store-'));
  t.after(() => fs.rmSync(directory, { recursive: true, force: true }));
  const store = storage.createStore(directory);
  const first = await store.create(document('First'));
  assert.equal((await storage.createStore(directory).list()).items[0].title, 'First');
  await store.update(first.id, document('Renamed'));
  assert.equal((await store.list()).items[0].title, 'Renamed');
  for (let i = 1; i < 10; i++) await store.create(document(`Wireframe ${i}`));
  await assert.rejects(store.create(document('Eleventh')), /up to 10/);
  assert.equal((await store.list()).items.length, 10);
  await store.remove(first.id);
  assert.equal((await storage.createStore(directory).list()).items.length, 9);
  await assert.rejects(store.remove(first.id), /not found/);
});

test('invalid or oversized documents cannot replace local data', async t => {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'sketchspace-store-'));
  t.after(() => fs.rmSync(directory, { recursive: true, force: true }));
  const store = storage.createStore(directory);
  const first = await store.create(document('Safe'));
  const invalid = document('Bad'); invalid.pages.desktop.items[0].type = '__proto__';
  assert.throws(() => store.update(first.id, invalid), /Invalid wireframe/);
  const huge = document('Huge'); huge.pages.desktop.items = Array.from({ length: 300 }, (_, i) => ({
    id: `item-${i}`, type: 'text', x: 0, y: 0, w: 300, h: 50, text: 'X'.repeat(500)
  }));
  huge.pages.tablet.items = huge.pages.desktop.items.map(item => ({ ...item }));
  assert.throws(() => store.update(first.id, huge), /too large/);
  assert.equal((await store.list()).items[0].title, 'Safe');
});
