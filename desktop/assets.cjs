const path = require('node:path');

const CSP = "default-src 'none'; script-src 'self'; style-src 'self'; img-src 'self' data:; font-src 'self'; connect-src 'none'; object-src 'none'; frame-src 'none'; worker-src 'none'; base-uri 'none'; form-action 'none'; frame-ancestors 'none'";
const MIME = Object.freeze({
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.txt': 'text/plain; charset=utf-8'
});

function resolveAssetPath(requestUrl, method, root) {
  let url;
  try { url = new URL(requestUrl); } catch { return null; }
  if (url.protocol !== 'sketchspace:' || url.host !== 'app' || url.username || url.password || url.port || method !== 'GET') return null;
  let pathname;
  try { pathname = decodeURIComponent(url.pathname === '/' ? '/index.html' : url.pathname); }
  catch { return null; }
  if (!pathname.startsWith('/') || pathname.includes('\0') || pathname.includes('\\')) return null;
  const file = path.resolve(root, `.${pathname}`);
  const relative = path.relative(root, file);
  if (!relative || relative === '..' || relative.startsWith(`..${path.sep}`) || path.isAbsolute(relative)) return null;
  const mime = MIME[path.extname(file)];
  return mime ? { file, mime } : null;
}

module.exports = { CSP, resolveAssetPath };
