const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { performance } = require('node:perf_hooks');
const { createStore } = require('../desktop/storage.cjs');

const tempRoot = path.resolve(os.tmpdir());
const directory = fs.mkdtempSync(path.join(tempRoot, 'sketchspace-benchmark-'));
const item = (index, device) => ({
  id: `${device}-${index}`, type: 'text', x: 0, y: 0, w: 300, h: 50,
  text: `Element ${index}: ${'Wireframe content '.repeat(5)}`
});
const document = title => ({ title, device: 'desktop', pages: Object.fromEntries(
  ['desktop', 'tablet', 'mobile'].map(device => [device, { items: Array.from({ length: 300 }, (_, index) => item(index, device)) }])
) });

(async () => {
  const store = createStore(directory);
  const entries = [];
  for (let index = 0; index < 10; index++) entries.push(await store.create(document(`Wireframe ${index}`)));
  const current = document('Wireframe 0');
  const start = performance.now();
  for (let index = 0; index < 30; index++) await store.update(entries[0].id, current);
  const elapsed = performance.now() - start;
  console.log(JSON.stringify({ updates: 30, totalMs: Math.round(elapsed), averageMs: Math.round(elapsed / 30 * 10) / 10,
    fileBytes: fs.statSync(path.join(directory, 'wireframes.json')).size }));
})().catch(error => { console.error(error); process.exitCode = 1; }).finally(() => {
  if (path.dirname(path.resolve(directory)) !== tempRoot || !path.basename(directory).startsWith('sketchspace-benchmark-')) {
    throw Error('Refusing to remove a directory outside the benchmark area.');
  }
  fs.rmSync(directory, { recursive: true, force: true });
});
