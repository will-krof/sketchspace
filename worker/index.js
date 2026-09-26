const ASSETS = __EMBEDDED_ASSETS__;
const MAX_DOCUMENT_BYTES = 250000;
const DEVICES = new Set(['desktop', 'tablet', 'mobile']);
const ELEMENT_TYPES = new Set(`heading text label button link box divider icon navbar tabs breadcrumb sidebar pagination menubutton input textarea search dropdown checkbox radio toggle slider card image avatar badge list table progress alert browserbar hero modal toolbar appbar splitview bottombar statusbar mobileheader bottomnav fab iphoneframe samsungframe tabletframe ui_house ui_search ui_menu ui_arrow-left ui_arrow-right ui_chevron-down ui_map-pin ui_external-link ui_plus ui_minus ui_check ui_x ui_pencil ui_trash ui_save ui_download ui_upload ui_share-2 ui_copy ui_funnel ui_ellipsis ui_user ui_users ui_mail ui_message-circle ui_phone ui_bell ui_image ui_calendar ui_clock ui_heart ui_star ui_info ui_circle-alert ui_lock ui_shopping-cart ui_settings ui_eye ui_bookmark brand_google brand_youtube brand_instagram brand_facebook brand_whatsapp brand_telegram brand_tiktok brand_spotify brand_github brand_discord brand_figma brand_notion brand_netflix brand_x`.split(' '));
const SECURITY_HEADERS = {
  'content-security-policy': "default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data:; connect-src 'self'; font-src 'self'; object-src 'none'; base-uri 'none'; form-action 'none'; frame-ancestors 'self'",
  'x-content-type-options': 'nosniff',
  'referrer-policy': 'strict-origin-when-cross-origin',
  'x-frame-options': 'SAMEORIGIN',
  'permissions-policy': 'camera=(), microphone=(), geolocation=()'
};
const secure = response => { for (const [name, value] of Object.entries(SECURITY_HEADERS)) response.headers.set(name, value); return response; };
class RequestError extends Error { constructor(message, status) { super(message); this.status = status; } }
const json = (value, status = 200) => new Response(JSON.stringify(value), {
  status,
  headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' }
});

const object = value => value !== null && typeof value === 'object' && !Array.isArray(value);
const text = (value, max) => typeof value === 'string' && value.length <= max;
const number = (value, min, max) => typeof value === 'number' && Number.isFinite(value) && value >= min && value <= max;
const labels = (value, max) => Array.isArray(value) && value.length >= 1 && value.length <= max && value.every(label => text(label, 120));
function validItem(item) {
  if (!object(item) || !text(item.id, 60) || !item.id || !ELEMENT_TYPES.has(item.type) || !text(item.text, 500)) return false;
  const width = 960, height = 1024;
  if (!number(item.w, 24, width) || !number(item.h, 12, height) || !number(item.x, 0, width - item.w) || !number(item.y, 0, height - item.h)) return false;
  if (item.fontSize !== undefined && !number(item.fontSize, 7, 72)) return false;
  if (item.fontBaseW !== undefined && !number(item.fontBaseW, 24, width)) return false;
  if (item.fontBaseH !== undefined && !number(item.fontBaseH, 12, height)) return false;
  if (item.type === 'list' && item.items !== undefined && !labels(item.items, 12)) return false;
  if (item.type === 'dropdown' && item.options !== undefined && !labels(item.options, 10)) return false;
  if (item.type === 'table' && item.cells !== undefined && (!Array.isArray(item.cells) || item.cells.length !== 4 || !item.cells.every(row => Array.isArray(row) && row.length === 3 && row.every(cell => text(cell, 120))))) return false;
  return true;
}
function validDocument(value) {
  if (!object(value) || !text(value.title, 60) || !value.title.trim() || !DEVICES.has(value.device) || !object(value.pages)) return false;
  return [...DEVICES].every(device => {
    const items = value.pages[device]?.items;
    return Array.isArray(items) && items.length <= 300 && items.every(validItem) && new Set(items.map(item => item.id)).size === items.length;
  });
}

async function readDocument(request) {
  if (!/^application\/json(?:\s*;|$)/i.test(request.headers.get('content-type') || '')) throw new RequestError('Use application/json.', 415);
  if (Number(request.headers.get('content-length')) > MAX_DOCUMENT_BYTES) throw new RequestError('Wireframe is too large.', 413);
  if (!request.body) throw new RequestError('Invalid JSON.', 400);
  const reader = request.body.getReader(), chunks = []; let length = 0;
  while (true) {
    const { done, value } = await reader.read(); if (done) break;
    length += value.byteLength;
    if (length > MAX_DOCUMENT_BYTES) { await reader.cancel(); throw new RequestError('Wireframe is too large.', 413); }
    chunks.push(value);
  }
  const bytes = new Uint8Array(length); let offset = 0;
  for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.byteLength; }
  let raw;
  try { raw = new TextDecoder('utf-8', { fatal: true }).decode(bytes); }
  catch (_) { throw new RequestError('Invalid JSON.', 400); }
  const body = JSON.parse(raw);
  if (!object(body) || !validDocument(body.document)) throw new RequestError('Invalid wireframe.', 400);
  return body.document;
}

async function api(request, env, pathname) {
  const userId = request.headers.get('oai-authenticated-user-id');
  if (!userId) return json({ error: 'Sign in to manage your wireframes.' }, 401);
  if (!env.DB) return json({ error: 'Wireframe storage is unavailable.' }, 503);
  const origin = request.headers.get('origin');
  if (request.method !== 'GET' && origin !== new URL(request.url).origin) return json({ error: 'Invalid request origin.' }, 403);
  const match = /^\/api\/wireframes(?:\/([a-zA-Z0-9-]+))?$/.exec(pathname);
  if (!match) return json({ error: 'Not found' }, 404);
  const id = match[1];
  try {
    if (request.method === 'GET' && !id) {
      const rows = await env.DB.prepare('SELECT id, title, document, updated_at FROM wireframes WHERE user_id = ? ORDER BY updated_at DESC LIMIT 10').bind(userId).all();
      return json({ items: rows.results.map(row => ({ id: row.id, title: row.title, document: JSON.parse(row.document), updatedAt: row.updated_at })) });
    }
    if (request.method === 'POST' && !id) {
      const document = await readDocument(request);
      const newId = crypto.randomUUID(), now = Date.now();
      const result = await env.DB.prepare('INSERT INTO wireframes (id, user_id, title, document, updated_at) SELECT ?, ?, ?, ?, ? WHERE (SELECT COUNT(*) FROM wireframes WHERE user_id = ?) < 10')
        .bind(newId, userId, document.title.trim(), JSON.stringify(document), now, userId).run();
      if (!result.meta?.changes) return json({ error: 'You can save up to 10 wireframes.' }, 409);
      return json({ id: newId, updatedAt: now }, 201);
    }
    if (request.method === 'PUT' && id) {
      const document = await readDocument(request), now = Date.now();
      const result = await env.DB.prepare('UPDATE wireframes SET title = ?, document = ?, updated_at = ? WHERE id = ? AND user_id = ?')
        .bind(document.title.trim(), JSON.stringify(document), now, id, userId).run();
      if (!result.meta?.changes) return json({ error: 'Wireframe not found.' }, 404);
      return json({ id, updatedAt: now });
    }
    if (request.method === 'DELETE' && id) {
      const result = await env.DB.prepare('DELETE FROM wireframes WHERE id = ? AND user_id = ?').bind(id, userId).run();
      if (!result.meta?.changes) return json({ error: 'Wireframe not found.' }, 404);
      return json({ deleted: true });
    }
    return json({ error: 'Method not allowed' }, 405);
  } catch (error) {
    if (error instanceof SyntaxError) return json({ error: 'Invalid JSON.' }, 400);
    if (error instanceof RequestError) return json({ error: error.message }, error.status);
    console.error('Wireframe API failure', error);
    return json({ error: 'Wireframe storage is temporarily unavailable.' }, 503);
  }
}

export default {
  async fetch(request, env) {
    const pathname = new URL(request.url).pathname;
    if (pathname.startsWith('/api/')) return secure(await api(request, env, pathname));
    if (request.method !== 'GET' && request.method !== 'HEAD') return secure(new Response('Method not allowed', { status: 405 }));
    const asset = Object.hasOwn(ASSETS, pathname) ? ASSETS[pathname] : null;
    if (!asset) return secure(new Response('Not found', { status: 404 }));
    const headers = { 'content-type': asset.type, 'cache-control': pathname === '/' ? 'no-cache' : 'public, max-age=3600', etag: asset.etag };
    if (request.headers.get('if-none-match') === asset.etag) return secure(new Response(null, { status: 304, headers }));
    return secure(new Response(request.method === 'HEAD' ? null : asset.body, {
      headers
    }));
  }
};
