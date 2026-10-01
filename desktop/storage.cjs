const fs = require('node:fs');
const path = require('node:path');
const { randomUUID } = require('node:crypto');

const MAX_BYTES = 250000;
const MAX_STORE_BYTES = 3000000;
const MAX_WIREFRAMES = 10;
const DEVICES = ['desktop', 'tablet', 'mobile'];
const FONTS = new Set(['Comic Sans MS', 'Arial', 'Verdana', 'Georgia', 'Times New Roman', 'Trebuchet MS', 'Courier New', 'Segoe UI']);
const PROGRESS_VALUES = new Set([5, 20, 50, 75, 100]);
const TYPES = new Set(`heading text label button link box divider arrow icon navbar tabs breadcrumb sidebar pagination menubutton input textarea search dropdown checkbox radio toggle slider card image avatar badge list table progress alert browserbar hero modal toolbar appbar splitview bottombar statusbar mobileheader bottomnav fab iphoneframe samsungframe tabletframe vrtabletframe ui_house ui_search ui_menu ui_arrow-left ui_arrow-right ui_chevron-down ui_map-pin ui_external-link ui_plus ui_minus ui_check ui_x ui_pencil ui_trash ui_save ui_download ui_upload ui_share-2 ui_copy ui_funnel ui_ellipsis ui_user ui_users ui_mail ui_message-circle ui_phone ui_bell ui_image ui_calendar ui_clock ui_heart ui_star ui_info ui_circle-alert ui_lock ui_shopping-cart ui_settings ui_eye ui_bookmark brand_google brand_youtube brand_instagram brand_facebook brand_whatsapp brand_telegram brand_tiktok brand_spotify brand_github brand_discord brand_figma brand_notion brand_netflix brand_x`.split(' '));
const object = value => value !== null && typeof value === 'object' && !Array.isArray(value);
const text = (value, max) => typeof value === 'string' && value.length <= max;
const number = (value, min, max) => typeof value === 'number' && Number.isFinite(value) && value >= min && value <= max;
const labels = (value, max) => Array.isArray(value) && value.length >= 1 && value.length <= max && value.every(label => text(label, 120));

function validItem(item) {
  if (!object(item) || !text(item.id, 60) || !item.id || !TYPES.has(item.type) || !text(item.text, 500)) return false;
  if (!number(item.w, 24, 960) || !number(item.h, 12, 1024) || !number(item.x, 0, 960 - item.w) || !number(item.y, 0, 1024 - item.h)) return false;
  if (item.fontSize !== undefined && !number(item.fontSize, 7, 72)) return false;
  if (item.fontFamily !== undefined && !FONTS.has(item.fontFamily)) return false;
  if (item.type === 'progress' && item.progress !== undefined && !PROGRESS_VALUES.has(item.progress)) return false;
  if (item.type === 'breadcrumb' && item.breadcrumbFullText !== undefined && item.breadcrumbFullText !== true) return false;
  if (item.fontBaseW !== undefined && !number(item.fontBaseW, 24, 960)) return false;
  if (item.fontBaseH !== undefined && !number(item.fontBaseH, 12, 1024)) return false;
  if (item.type === 'list' && item.items !== undefined && !labels(item.items, 12)) return false;
  if (item.type === 'dropdown' && item.options !== undefined && !labels(item.options, 10)) return false;
  if (item.type === 'table' && item.cells !== undefined && (!Array.isArray(item.cells) || item.cells.length !== 4 || !item.cells.every(row => Array.isArray(row) && row.length === 3 && row.every(cell => text(cell, 120))))) return false;
  if (item.type === 'arrow' && ((item.fromId !== undefined && (!text(item.fromId, 60) || !item.fromId)) || (item.toId !== undefined && (!text(item.toId, 60) || !item.toId)))) return false;
  return true;
}

function validCanvases(canvases) {
  return object(canvases) && DEVICES.every(device => {
    const items = canvases[device]?.items;
    if (!Array.isArray(items) || items.length > 300 || !items.every(validItem) || new Set(items.map(item => item.id)).size !== items.length) return false;
    const targets = new Set(items.filter(item => item.type !== 'arrow').map(item => item.id));
    return items.every(item => item.type !== 'arrow' || ((!item.fromId || targets.has(item.fromId)) && (!item.toId || targets.has(item.toId)) && (!item.fromId || !item.toId || item.fromId !== item.toId)));
  });
}

function validDocument(document) {
  if (!object(document) || !text(document.title, 60) || !document.title.trim() || !DEVICES.includes(document.device)) return false;
  if (!Array.isArray(document.pages)) return validCanvases(document.pages); // Existing single-page files.
  const pages = document.pages;
  return pages.length >= 1 && pages.length <= 5 && text(document.activePageId, 60)
    && pages.every(page => object(page) && text(page.id, 60) && Boolean(page.id) && text(page.name, 40)
      && Boolean(page.name.trim()) && validCanvases(page.canvases))
    && new Set(pages.map(page => page.id)).size === pages.length
    && pages.some(page => page.id === document.activePageId);
}

function checkedDocument(document) {
  if (!validDocument(document)) throw Error('Invalid wireframe.');
  const serialized = JSON.stringify(document);
  if (Buffer.byteLength(serialized, 'utf8') > MAX_BYTES) throw Error('Wireframe is too large.');
  return JSON.parse(serialized);
}

function createStore(directory) {
  const file = path.join(directory, 'wireframes.json');
  let queue = Promise.resolve();
  let cached;
  async function read() {
    if (cached) return cached;
    let contents;
    try {
      const stats = await fs.promises.stat(file);
      if (stats.size > MAX_STORE_BYTES) throw Error('Local wireframe data is too large.');
      contents = await fs.promises.readFile(file, 'utf8');
    } catch (error) {
      if (error.code !== 'ENOENT') throw error;
      return { version: 1, items: [] };
    }
    const data = JSON.parse(contents);
    if (data?.version !== 1 || !Array.isArray(data.items) || data.items.length > MAX_WIREFRAMES || !data.items.every(item =>
      object(item) && typeof item.id === 'string' && /^[a-f0-9-]{36}$/.test(item.id) && Number.isSafeInteger(item.updatedAt) && validDocument(item.document))) {
      throw Error('Local wireframe data is invalid.');
    }
    cached = data;
    return cached;
  }
  async function write(data) {
    await fs.promises.mkdir(directory, { recursive: true });
    const temp = `${file}.${randomUUID()}.tmp`;
    try {
      await fs.promises.writeFile(temp, JSON.stringify(data), { encoding: 'utf8', flag: 'wx', mode: 0o600 });
      await fs.promises.rename(temp, file);
    } finally {
      await fs.promises.rm(temp, { force: true }).catch(() => {});
    }
  }
  function mutate(action) {
    const operation = queue.then(async () => {
      try {
        const data = await read();
        const result = action(data);
        await write(data);
        cached = data;
        return result;
      } catch (error) {
        cached = undefined;
        throw error;
      }
    });
    queue = operation.catch(() => {});
    return operation;
  }
  return {
    async list() {
      await queue;
      return { items: (await read()).items.slice().sort((a, b) => b.updatedAt - a.updatedAt) };
    },
    create(document) {
      const copy = checkedDocument(document);
      return mutate(data => {
        if (data.items.length >= MAX_WIREFRAMES) throw Error('You can save up to 10 wireframes.');
        const entry = { id: randomUUID(), title: copy.title.trim(), document: copy, updatedAt: Date.now() };
        data.items.push(entry);
        return { id: entry.id, updatedAt: entry.updatedAt };
      });
    },
    update(id, document) {
      const copy = checkedDocument(document);
      return mutate(data => {
        const entry = data.items.find(item => item.id === id);
        if (!entry) throw Error('Wireframe not found.');
        Object.assign(entry, { title: copy.title.trim(), document: copy, updatedAt: Date.now() });
        return { id, updatedAt: entry.updatedAt };
      });
    },
    remove(id) {
      return mutate(data => {
        const index = data.items.findIndex(item => item.id === id);
        if (index < 0) throw Error('Wireframe not found.');
        data.items.splice(index, 1);
        return { deleted: true };
      });
    }
  };
}

module.exports = { createStore, validDocument };
