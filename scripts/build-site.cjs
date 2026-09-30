const fs = require('node:fs');
const path = require('node:path');
const { createHash } = require('node:crypto');

const root = path.resolve(__dirname, '..');
const files = ['index.html', 'styles.css', 'editor.css', 'pages.css', 'library.css', 'app.js', 'LUCIDE-LICENSE.txt', ...fs.readdirSync(path.join(root, 'dist', 'icons')).map(name => `icons/${name}`)];
const assets = {};
for (const name of files) {
  const type = name.endsWith('.html') ? 'text/html; charset=utf-8'
    : name.endsWith('.css') ? 'text/css; charset=utf-8'
    : name.endsWith('.js') ? 'text/javascript; charset=utf-8'
    : name.endsWith('.txt') ? 'text/plain; charset=utf-8'
    : 'image/svg+xml';
  const body = fs.readFileSync(path.join(root, 'dist', name), 'utf8');
  assets[name === 'index.html' ? '/' : `/${name}`] = { body, type,
    etag: `"${createHash('sha256').update(body).digest('hex').slice(0, 24)}"` };
}
const source = fs.readFileSync(path.join(root, 'worker', 'index.js'), 'utf8');
const output = path.join(root, 'dist', 'server');
fs.mkdirSync(output, { recursive: true });
fs.writeFileSync(path.join(output, 'index.js'), source.replace('__EMBEDDED_ASSETS__', JSON.stringify(assets)));
fs.mkdirSync(path.join(root, 'dist', '.openai'), { recursive: true });
fs.copyFileSync(path.join(root, '.openai', 'hosting.json'), path.join(root, 'dist', '.openai', 'hosting.json'));
process.stdout.write('Worker built\n');
