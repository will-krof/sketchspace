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
const pagedDocument = count => ({ title: 'Many pages', device: 'desktop', activePageId: `page-${count}`,
  pages: Array.from({ length: count }, (_, index) => ({ id: `page-${index + 1}`, name: `Page ${index + 1}`, canvases: {
    desktop: { items: index === count - 1 ? [{ id: 'vr', type: 'vrtabletframe', x: 10, y: 10, w: 420, h: 280, text: 'VR tablet' }] : [] },
    tablet: { items: [] }, mobile: { items: [] }
  } })) });

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

test('font, breadcrumb, and progress settings survive local storage validation', async t => {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'sketchspace-store-'));
  t.after(() => fs.rmSync(directory, { recursive: true, force: true }));
  const store = storage.createStore(directory);
  const wireframe = document('Styled');
  wireframe.pages.desktop.items = [
    { id: 'crumb', type: 'breadcrumb', x: 0, y: 0, w: 280, h: 35, text: 'Start › Work', breadcrumbFullText: true, fontFamily: 'Georgia' },
    { id: 'bar', type: 'progress', x: 0, y: 50, w: 270, h: 28, text: '75%', progress: 75, fontFamily: 'Segoe UI' }
  ];
  const entry = await store.create(wireframe);
  assert.deepEqual((await storage.createStore(directory).list()).items[0].document.pages.desktop.items, wireframe.pages.desktop.items);
  const invalidFont = structuredClone(wireframe);
  invalidFont.pages.desktop.items[0].fontFamily = 'url(evil)';
  assert.throws(() => store.update(entry.id, invalidFont), /Invalid wireframe/);
  const invalidProgress = structuredClone(wireframe);
  invalidProgress.pages.desktop.items[1].progress = 999;
  assert.throws(() => store.update(entry.id, invalidProgress), /Invalid wireframe/);
});

test('concurrent writes stay ordered and oversized local files are rejected', async t => {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'sketchspace-store-'));
  t.after(() => fs.rmSync(directory, { recursive: true, force: true }));
  const store = storage.createStore(directory);
  await Promise.all(Array.from({ length: 10 }, (_, index) => store.create(document(`Concurrent ${index}`))));
  assert.equal((await store.list()).items.length, 10);
  assert.equal((await storage.createStore(directory).list()).items.length, 10);
  fs.writeFileSync(path.join(directory, 'wireframes.json'), 'x'.repeat(3000001));
  await assert.rejects(storage.createStore(directory).list(), /too large/);
});

test('five pages and VR tablet persist while a sixth page is rejected', async t => {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'sketchspace-store-'));
  t.after(() => fs.rmSync(directory, { recursive: true, force: true }));
  const store = storage.createStore(directory);
  const five = pagedDocument(5);
  const created = await store.create(five);
  assert.deepEqual((await storage.createStore(directory).list()).items[0].document, five);
  assert.throws(() => store.update(created.id, pagedDocument(6)), /Invalid wireframe/);
  const missingActive = structuredClone(five); missingActive.activePageId = 'missing';
  assert.throws(() => store.update(created.id, missingActive), /Invalid wireframe/);
  assert.equal((await store.list()).items[0].document.pages.length, 5);
});

test('renamed pages and attached arrows persist; missing endpoints are rejected', async t => {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'sketchspace-store-'));
  t.after(() => fs.rmSync(directory, { recursive: true, force: true }));
  const store = storage.createStore(directory);
  const wireframe = pagedDocument(2);
  wireframe.pages[0].name = 'Checkout flow';
  wireframe.pages[0].canvases.desktop.items = [
    { id: 'start', type: 'box', x: 10, y: 20, w: 100, h: 80, text: '' },
    { id: 'end', type: 'box', x: 300, y: 20, w: 100, h: 80, text: '' },
    { id: 'connection', type: 'arrow', x: 120, y: 50, w: 180, h: 72, text: '', fromId: 'start', toId: 'end' }
  ];
  await store.create(wireframe);
  assert.deepEqual((await storage.createStore(directory).list()).items[0].document, wireframe);
  const invalid = structuredClone(wireframe);
  invalid.pages[0].canvases.desktop.items[2].toId = 'missing';
  assert.throws(() => store.create(invalid), /Invalid wireframe/);
  invalid.pages[0].canvases.desktop.items[2].toId = 'start';
  assert.throws(() => store.create(invalid), /Invalid wireframe/);
});
