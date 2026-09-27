import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

test('quit bridge waits for a renderer save and reports failures', async () => {
  const listeners = new Map();
  const sent = [];
  let desktop;
  const electron = {
    contextBridge: { exposeInMainWorld: (_name, api) => { desktop = api; } },
    ipcRenderer: {
      on: (channel, callback) => listeners.set(channel, callback),
      send: (channel, value) => sent.push([channel, value])
    }
  };
  const source = fs.readFileSync(new URL('../desktop/preload.cjs', import.meta.url), 'utf8');
  vm.runInNewContext(source, { require: name => {
    assert.equal(name, 'electron');
    return electron;
  } });

  let saved = false;
  desktop.app.onBeforeQuit(async () => { saved = true; return true; });
  await listeners.get('app:flush-before-quit')();
  assert.equal(saved, true);
  assert.deepEqual(sent.pop(), ['app:flush-result', true]);

  desktop.app.onBeforeQuit(async () => { throw Error('disk full'); });
  await listeners.get('app:flush-before-quit')();
  assert.deepEqual(sent.pop(), ['app:flush-result', false]);
});
