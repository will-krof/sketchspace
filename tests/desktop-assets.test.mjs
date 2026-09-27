import { test } from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import assets from '../desktop/assets.cjs';

const root = path.resolve('dist');

test('desktop protocol resolves only packaged, allowed asset paths', () => {
  assert.deepEqual(assets.resolveAssetPath('sketchspace://app/', 'GET', root), {
    file: path.join(root, 'index.html'), mime: 'text/html; charset=utf-8'
  });
  assert.deepEqual(assets.resolveAssetPath('sketchspace://app/icons/ui-save.svg?v=6', 'GET', root), {
    file: path.join(root, 'icons', 'ui-save.svg'), mime: 'image/svg+xml'
  });
  for (const url of [
    'https://app/index.html', 'sketchspace://elsewhere/index.html',
    'sketchspace://app/%5c..%5cprivate.js', 'sketchspace://app/%00bad.js',
    'sketchspace://app/secret.exe', 'sketchspace://user@app/index.html'
  ]) assert.equal(assets.resolveAssetPath(url, 'GET', root), null, url);
  assert.equal(assets.resolveAssetPath('sketchspace://app/index.html', 'POST', root), null);
});
