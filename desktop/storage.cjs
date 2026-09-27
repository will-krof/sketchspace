const fs = require('node:fs');
const path = require('node:path');
const { randomUUID } = require('node:crypto');

const MAX_BYTES = 250000;
const MAX_WIREFRAMES = 10;
const DEVICES = ['desktop', 'tablet', 'mobile'];
const FONTS = new Set(['Comic Sans MS', 'Arial', 'Verdana', 'Georgia', 'Times New Roman', 'Trebuchet MS', 'Courier New', 'Segoe UI']);
const PROGRESS_VALUES = new Set([5, 20, 50, 75, 100]);
const TYPES = new Set(`heading text label button link box divider icon navbar tabs breadcrumb sidebar pagination menubutton input textarea search dropdown checkbox radio toggle slider card image avatar badge list table progress alert browserbar hero modal toolbar appbar splitview bottombar statusbar mobileheader bottomnav fab iphoneframe samsungframe tabletframe ui_house ui_search ui_menu ui_arrow-left ui_arrow-right ui_chevron-down ui_map-pin ui_external-link ui_plus ui_minus ui_check ui_x ui_pencil ui_trash ui_save ui_download ui_upload ui_share-2 ui_copy ui_funnel ui_ellipsis ui_user ui_users ui_mail ui_message-circle ui_phone ui_bell ui_image ui_calendar ui_clock ui_heart ui_star ui_info ui_circle-alert ui_lock ui_shopping-cart ui_settings ui_eye ui_bookmark brand_google brand_youtube brand_instagram brand_facebook brand_whatsapp brand_telegram brand_tiktok brand_spotify brand_github brand_discord brand_figma brand_notion brand_netflix brand_x`.split(' '));
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
  return true;
}

function validDocument(document) {
  return object(document) && text(document.title, 60) && Boolean(document.title.trim()) && DEVICES.includes(document.device) && object(document.pages)
    && DEVICES.every(device => {
      const items = document.pages[device]?.items;
      return Array.isArray(items) && items.length <= 300 && items.every(validItem) && new Set(items.map(item => item.id)).size === items.length;
    });
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
  function read() {
    if (!fs.existsSync(file)) return { version: 1, items: [] };
    const data = JSON.parse(fs.readFileSync(file, 'utf8'));
    if (data?.version !== 1 || !Array.isArray(data.items) || data.items.length > MAX_WIREFRAMES || !data.items.every(item =>
      object(item) && typeof item.id === 'string' && /^[a-f0-9-]{36}$/.test(item.id) && Number.isSafeInteger(item.updatedAt) && validDocument(item.document))) {
      throw Error('Local wireframe data is invalid.');
    }
    return data;
  }
  function write(data) {
    fs.mkdirSync(directory, { recursive: true });
    const temp = `${file}.${randomUUID()}.tmp`;
    try {
      fs.writeFileSync(temp, JSON.stringify(data), { encoding: 'utf8', flag: 'wx', mode: 0o600 });
      fs.renameSync(temp, file);
    } finally {
      if (fs.existsSync(temp)) fs.unlinkSync(temp);
    }
  }
  function mutate(action) {
    const operation = queue.then(() => {
      const data = read();
      const result = action(data);
      write(data);
      return result;
    });
    queue = operation.catch(() => {});
    return operation;
  }
  return {
    async list() {
      await queue;
      return { items: read().items.sort((a, b) => b.updatedAt - a.updatedAt) };
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
