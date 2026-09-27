(() => {
  'use strict';

  const STORAGE_KEY = 'sketchspace-wireframe-v2';
  const ACTIVE_KEY = 'sketchspace-active-wireframe-v1';
  const MIGRATION_KEY = 'sketchspace-cloud-migrated-v1';
  const LEGACY_KEY = 'prostir-wireframe-v1';
  const PRESETS = {
    desktop: { name: 'Desktop', w: 960, h: 640 },
    tablet: { name: 'Tablet', w: 768, h: 1024 },
    mobile: { name: 'Mobile', w: 390, h: 844 }
  };
  const CATEGORIES = [
    { id: 'basic', name: 'Basic' },
    { id: 'navigation', name: 'Navigation' },
    { id: 'forms', name: 'Forms' },
    { id: 'content', name: 'Content' },
    { id: 'device', name: 'Device' },
    { id: 'brands', name: 'Icons' }
  ];
  const ELEMENTS = {
    heading: { name: 'Heading', icon: 'T', category: 'basic', w: 300, h: 78, text: 'New heading' },
    text: { name: 'Paragraph', icon: '☰', category: 'basic', w: 290, h: 76, text: 'A short description of your idea' },
    label: { name: 'Label', icon: 'Aa', category: 'basic', w: 150, h: 32, text: 'Label' },
    button: { name: 'Button', icon: '▭', category: 'basic', w: 170, h: 49, text: 'Click here' },
    link: { name: 'Text link', icon: '↗', category: 'basic', w: 150, h: 32, text: 'Learn more' },
    box: { name: 'Rectangle', icon: '□', category: 'basic', w: 240, h: 150, text: '' },
    divider: { name: 'Divider', icon: '━', category: 'basic', w: 260, h: 12, text: '' },
    icon: { name: 'Icon', icon: '☆', category: 'basic', w: 54, h: 54, text: '☆' },
    navbar: { name: 'Navigation bar', icon: '☷', category: 'navigation', w: 470, h: 58, text: 'Brand' },
    tabs: { name: 'Tabs', icon: '▤', category: 'navigation', w: 310, h: 48, text: 'Overview' },
    breadcrumb: { name: 'Breadcrumbs', icon: '›', category: 'navigation', w: 270, h: 35, text: 'Current page' },
    sidebar: { name: 'Sidebar', icon: '▥', category: 'navigation', w: 210, h: 300, text: 'Menu' },
    pagination: { name: 'Pagination', icon: '①', category: 'navigation', w: 190, h: 36, text: '' },
    menubutton: { name: 'Menu button', icon: '☰', category: 'navigation', w: 48, h: 44, text: '☰' },
    input: { name: 'Text input', icon: '▤', category: 'forms', w: 250, h: 46, text: 'Enter text...' },
    textarea: { name: 'Text area', icon: '▧', category: 'forms', w: 290, h: 110, text: 'Write a message...' },
    search: { name: 'Search field', icon: '⌕', category: 'forms', w: 250, h: 46, text: 'Search...' },
    dropdown: { name: 'Dropdown', icon: '⌄', category: 'forms', w: 230, h: 154, text: 'Choose an option' },
    checkbox: { name: 'Checkbox', icon: '☑', category: 'forms', w: 190, h: 30, text: 'I agree' },
    radio: { name: 'Radio button', icon: '◉', category: 'forms', w: 190, h: 30, text: 'Option' },
    toggle: { name: 'Toggle', icon: '◉', category: 'forms', w: 170, h: 32, text: 'Enable setting' },
    slider: { name: 'Slider', icon: '━', category: 'forms', w: 240, h: 32, text: '' },
    card: { name: 'Card', icon: '▣', category: 'content', w: 230, h: 144, text: 'Card title' },
    image: { name: 'Image placeholder', icon: '▧', category: 'content', w: 270, h: 190, text: 'Image' },
    avatar: { name: 'Avatar', icon: '◉', category: 'content', w: 62, h: 62, text: 'AB' },
    badge: { name: 'Badge', icon: '▰', category: 'content', w: 95, h: 32, text: 'New' },
    list: { name: 'List', icon: '☷', category: 'content', w: 265, h: 150, text: 'First item' },
    table: { name: 'Table', icon: '▦', category: 'content', w: 360, h: 180, text: 'Name' },
    progress: { name: 'Progress bar', icon: '▰', category: 'content', w: 270, h: 28, text: '65%' },
    alert: { name: 'Alert', icon: '!', category: 'content', w: 290, h: 80, text: 'Something to keep in mind' },
    browserbar: { name: 'Browser bar', icon: '▤', category: 'device', devices: ['desktop'], w: 550, h: 46, text: 'example.com' },
    hero: { name: 'Hero section', icon: '▣', category: 'device', devices: ['desktop'], w: 510, h: 240, text: 'A clear headline' },
    modal: { name: 'Dialog', icon: '▣', category: 'device', devices: ['desktop'], w: 340, h: 210, text: 'Dialog title' },
    toolbar: { name: 'Toolbar', icon: '▤', category: 'device', devices: ['desktop', 'tablet'], w: 360, h: 52, text: 'Tools' },
    appbar: { name: 'App bar', icon: '☰', category: 'device', devices: ['tablet'], w: 420, h: 60, text: 'App title' },
    splitview: { name: 'Split view', icon: '◫', category: 'device', devices: ['tablet'], w: 450, h: 280, text: 'Overview' },
    bottombar: { name: 'Bottom bar', icon: '▤', category: 'device', devices: ['tablet'], w: 420, h: 70, text: 'Home' },
    statusbar: { name: 'Status bar', icon: '◕', category: 'device', devices: ['mobile'], w: 360, h: 30, text: '9:41' },
    mobileheader: { name: 'Mobile header', icon: '☰', category: 'device', devices: ['mobile'], w: 360, h: 56, text: 'Page title' },
    bottomnav: { name: 'Bottom navigation', icon: '▤', category: 'device', devices: ['mobile'], w: 360, h: 70, text: 'Home' },
    fab: { name: 'Floating button', icon: '+', category: 'device', devices: ['mobile'], w: 56, h: 56, text: '+' },
    iphoneframe: { name: 'iPhone frame', icon: '▯', category: 'device', w: 220, h: 440, text: 'iPhone' },
    samsungframe: { name: 'Samsung frame', icon: '▯', category: 'device', w: 220, h: 440, text: 'Samsung' },
    tabletframe: { name: 'Tablet frame', icon: '▤', category: 'device', w: 390, h: 520, text: 'Tablet' }
  };
  const BRANDS = [
    ['google', 'Google'], ['youtube', 'YouTube'], ['instagram', 'Instagram'], ['facebook', 'Facebook'],
    ['whatsapp', 'WhatsApp'], ['telegram', 'Telegram'], ['tiktok', 'TikTok'], ['spotify', 'Spotify'],
    ['github', 'GitHub'], ['discord', 'Discord'], ['figma', 'Figma'], ['notion', 'Notion'],
    ['netflix', 'Netflix'], ['x', 'X']
  ];
  const UI_ICONS = [
    ['Navigation', [['house', 'Home'], ['search', 'Search'], ['menu', 'Menu'], ['arrow-left', 'Arrow left'], ['arrow-right', 'Arrow right'], ['chevron-down', 'Chevron down'], ['map-pin', 'Map pin'], ['external-link', 'External link']]],
    ['Actions', [['plus', 'Plus'], ['minus', 'Minus'], ['check', 'Check'], ['x', 'Close'], ['pencil', 'Edit'], ['trash', 'Delete'], ['save', 'Save'], ['download', 'Download'], ['upload', 'Upload'], ['share-2', 'Share'], ['copy', 'Copy'], ['funnel', 'Filter'], ['ellipsis', 'More']]],
    ['People & messages', [['user', 'User'], ['users', 'Users'], ['mail', 'Mail'], ['message-circle', 'Message'], ['phone', 'Phone'], ['bell', 'Bell']]],
    ['Content & status', [['image', 'Image'], ['calendar', 'Calendar'], ['clock', 'Clock'], ['heart', 'Heart'], ['star', 'Star'], ['info', 'Info'], ['circle-alert', 'Alert'], ['lock', 'Lock'], ['shopping-cart', 'Cart'], ['settings', 'Settings'], ['eye', 'View'], ['bookmark', 'Bookmark']]]
  ];
  for (const [group, icons] of UI_ICONS) for (const [slug, name] of icons)
    ELEMENTS[`ui_${slug}`] = { name, icon: '◉', category: 'brands', group, w: 72, h: 72, text: name };
  for (const [slug, name] of BRANDS) ELEMENTS[`brand_${slug}`] = { name, icon: '◉', category: 'brands', group: 'Services', w: 72, h: 72, text: name };
  const isIcon = type => type.startsWith('brand_') || type.startsWith('ui_');
  const iconPath = type => type.startsWith('ui_') ? `./icons/ui-${type.slice(3)}.svg?v=6` : `./icons/${type.slice(6)}.svg?v=6`;
  const TABLE_DEFAULTS = [['Name', 'Status', 'Date'], ['Item one', 'Active', 'Today'], ['Item two', 'Draft', 'Yesterday'], ['Item three', 'Done', 'Monday']];
  const LIST_DEFAULTS = ['First item', 'Second item', 'Third item'];
  const DROPDOWN_DEFAULTS = ['First option', 'Second option', 'Third option'];
  const FONT_DEFAULTS = {
    heading: 31, text: 17, label: 14, button: 16, link: 16, icon: 32, navbar: 14, tabs: 14,
    breadcrumb: 14, sidebar: 17, menubutton: 17, input: 15, textarea: 15, search: 15, dropdown: 15,
    checkbox: 15, radio: 15, toggle: 15, card: 19, image: 14, avatar: 21, badge: 13, list: 14,
    table: 13, progress: 13, alert: 14, browserbar: 12, hero: 25, modal: 20, toolbar: 14,
    appbar: 17, statusbar: 13, mobileheader: 17, bottomnav: 12, bottombar: 12, fab: 28,
    iphoneframe: 18, samsungframe: 18, tabletframe: 18
  };
  const defaultFontSize = type => FONT_DEFAULTS[type] || 15;
  const hasText = type => !isIcon(type) && !['divider', 'slider', 'pagination'].includes(type);
  const STARTER = [
    { id: 'a1', type: 'heading', x: 62, y: 38, w: 210, h: 53, text: 'brand name' },
    { id: 'a2', type: 'text', x: 663, y: 52, w: 244, h: 34, text: 'About    Services    Contact' },
    { id: 'a3', type: 'heading', x: 62, y: 184, w: 454, h: 96, text: 'Your next big idea starts here' },
    { id: 'a4', type: 'text', x: 64, y: 301, w: 395, h: 76, text: 'A short description of your product and why it matters to people.' },
    { id: 'a5', type: 'button', x: 64, y: 407, w: 171, h: 50, text: 'Get started' },
    { id: 'a6', type: 'image', x: 559, y: 169, w: 321, h: 266, text: 'Image' },
    { id: 'a7', type: 'card', x: 64, y: 515, w: 250, h: 92, text: 'Fast and simple' },
    { id: 'a8', type: 'card', x: 348, y: 515, w: 250, h: 92, text: 'Made for teams' },
    { id: 'a9', type: 'card', x: 632, y: 515, w: 250, h: 92, text: 'Everything in one place' }
  ];
  const LEGACY_TEXT = new Map([
    ['назва бренду', 'brand name'], ['Про нас    Послуги    Контакти', 'About    Services    Contact'],
    ['Ваша велика ідея починається тут', 'Your next big idea starts here'],
    ['Короткий опис продукту, який пояснює головну користь для людей.', 'A short description of your product and why it matters to people.'],
    ['Почати', 'Get started'], ['Зображення', 'Image'], ['Швидко та просто', 'Fast and simple'],
    ['Зручно для команди', 'Made for teams'], ['Все на одному полотні', 'Everything in one place'],
    ['Новий заголовок', 'New heading'], ['Короткий опис вашої ідеї', 'A short description of your idea'],
    ['Натиснути', 'Click here'], ['Введіть текст...', 'Enter text...'], ['Назва картки', 'Card title']
  ]);

  const $ = selector => document.querySelector(selector);
  const canvas = $('#canvas'), mount = $('#canvasMount'), scroll = $('#canvasScroll');
  const inspector = $('#inspectorContent'), titleInput = $('#projectTitle');
  const clone = value => JSON.parse(JSON.stringify(value));
  const clamp = (n, min, max) => Math.min(max, Math.max(min, n));
  let doc = load(), library = [], activeId = null, ready = false, category = 'basic', selected = null, selection = new Set(), zoom = 1;
  let drag = null, marquee = null, pan = null, spaceHeld = false, toastTimer;
  let saveTimer = null, pendingSave = Promise.resolve();
  const itemNodes = new Map(), itemsById = new Map();
  const undo = [], redo = [];
  const page = () => doc.pages[doc.device].items;
  const size = () => PRESETS.desktop;
  const current = () => selection.size === 1 ? page().find(item => item.id === selected) : undefined;
  const selectedItems = () => page().filter(item => selection.has(item.id));
  const effectiveFontSize = item => {
    const base = item.fontSize || defaultFontSize(item.type);
    return clamp(Math.round(base * Math.min(1, item.w / (item.fontBaseW || item.w), item.h / (item.fontBaseH || item.h))), Math.min(10, base), 72);
  };
  const fitItemHeight = (item, height) => { item.h = Math.min(height, size().h); item.y = Math.min(item.y, size().h - item.h); };
  const el = (tag, className, text) => { const node = document.createElement(tag); if (className) node.className = className; if (text !== undefined) node.textContent = text; return node; };

  function normalize(value) {
    if (!value || typeof value !== 'object') throw Error('Invalid wireframe file');
    const sourcePages = value.pages || { desktop: { items: value.items } };
    const pages = {};
    for (const [device, preset] of Object.entries(PRESETS)) {
      const raw = sourcePages[device]?.items || [];
      if (!Array.isArray(raw)) throw Error('Invalid page');
      pages[device] = { items: raw.slice(0, 300).map((v, index) => {
        if (!v || typeof v.type !== 'string' || !Object.hasOwn(ELEMENTS, v.type)) throw Error('Unknown element type');
        const number = (n, fallback) => Number.isFinite(Number(n)) ? Number(n) : fallback;
        const w = clamp(number(v.w, ELEMENTS[v.type].w), 24, preset.w);
        const h = clamp(number(v.h, ELEMENTS[v.type].h) === 46 && v.type === 'dropdown' && !Array.isArray(v.options)
          ? ELEMENTS.dropdown.h : number(v.h, ELEMENTS[v.type].h), 12, preset.h);
        const item = { id: String(v.id || `item-${index}`).slice(0, 60), type: v.type,
          x: clamp(number(v.x, 0), 0, preset.w - w), y: clamp(number(v.y, 0), 0, preset.h - h),
          w, h, text: String(v.text ?? '').slice(0, 500),
          fontSize: clamp(number(v.fontSize, defaultFontSize(v.type)), 7, 72),
          fontBaseW: clamp(number(v.fontBaseW, w), 24, preset.w),
          fontBaseH: clamp(number(v.fontBaseH, h), 12, preset.h) };
        if (v.type === 'table') item.cells = TABLE_DEFAULTS.map((row, r) => row.map((fallback, c) => String(v.cells?.[r]?.[c] ?? (r === 0 && c === 0 ? item.text || fallback : fallback)).slice(0, 120)));
        if (v.type === 'list') item.items = (Array.isArray(v.items) && v.items.length ? v.items : [item.text || LIST_DEFAULTS[0], ...LIST_DEFAULTS.slice(1)]).slice(0, 12).map(entry => String(entry).slice(0, 120));
        if (v.type === 'dropdown') item.options = (Array.isArray(v.options) && v.options.length ? v.options : DROPDOWN_DEFAULTS).slice(0, 10).map(entry => String(entry).slice(0, 120));
        return item;
      }) };
    }
    return { title: String(value.title || 'Untitled').slice(0, 60),
      device: PRESETS[value.device] ? value.device : 'desktop', pages };
  }
  function load() {
    try { const raw = localStorage.getItem(STORAGE_KEY); if (raw) return normalize(JSON.parse(raw)); } catch (_) {}
    try {
      const raw = localStorage.getItem(LEGACY_KEY);
      if (raw) {
        const old = JSON.parse(raw);
        const migrated = normalize(old);
        if (migrated.title === 'Мій перший прототип') migrated.title = 'My first wireframe';
        if (migrated.title === 'Новий макет') migrated.title = 'New wireframe';
        for (const item of migrated.pages.desktop.items) if (LEGACY_TEXT.has(item.text)) item.text = LEGACY_TEXT.get(item.text);
        return migrated;
      }
    } catch (_) {}
    return { title: 'My first wireframe', device: 'desktop', pages: { desktop: { items: clone(STARTER) }, tablet: { items: [] }, mobile: { items: [] } } };
  }
  async function apiRequest(path, method = 'GET', body) {
    if (window.sketchspaceDesktop) {
      const storage = window.sketchspaceDesktop.storage;
      const match = /^\/api\/wireframes(?:\/([a-f0-9-]+))?$/.exec(path);
      if (!match) throw Error('Invalid storage request.');
      if (method === 'GET' && !match[1]) return storage.list();
      if (method === 'POST' && !match[1]) return storage.create(body.document);
      if (method === 'PUT' && match[1]) return storage.update(match[1], body.document);
      if (method === 'DELETE' && match[1]) return storage.remove(match[1]);
      throw Error('Invalid storage request.');
    }
    const response = await fetch(path, { method, headers: body ? { 'content-type': 'application/json' } : {}, body: body ? JSON.stringify(body) : undefined });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw Error(data.error || 'Could not reach wireframe storage.');
    return data;
  }
  function updateLibraryCount() {
    $('#libraryCount').textContent = `${library.length}/10`;
    $('#newWireframe').disabled = library.length >= 10;
    titleInput.disabled = !activeId;
  }
  function sendSave() {
    clearTimeout(saveTimer); saveTimer = null;
    const id = activeId, document = clone(doc);
    if (!ready || !id) return pendingSave;
    pendingSave = pendingSave.catch(() => {}).then(() => apiRequest(`/api/wireframes/${id}`, 'PUT', { document }))
      .then(data => { const entry = library.find(item => item.id === id); if (entry) entry.updatedAt = data.updatedAt; if (activeId === id && !saveTimer) $('#saveStatus').textContent = 'Saved'; })
      .catch(error => { $('#saveStatus').textContent = 'Save failed'; toast(error.message); throw error; });
    return pendingSave;
  }
  function save() {
    if (!ready || !activeId) return;
    const entry = library.find(item => item.id === activeId);
    if (entry) { entry.document = clone(doc); entry.title = doc.title; entry.updatedAt = Date.now(); }
    $('#saveStatus').textContent = 'Saving…';
    clearTimeout(saveTimer); saveTimer = setTimeout(() => { void sendSave().catch(() => {}); }, 350);
    if ($('#libraryDialog').open) renderLibrary();
  }
  async function flushSave() { if (saveTimer) sendSave(); await pendingSave; }
  function clearEditorHistory() { undo.length = 0; redo.length = 0; selected = null; selection.clear(); updateHistory(); }
  function activate(entry) {
    activeId = entry?.id || null; doc = entry ? normalize(entry.document) : normalize({ title: 'Untitled', device: 'desktop', pages: { desktop: { items: [] }, tablet: { items: [] }, mobile: { items: [] } } });
    try { if (activeId) localStorage.setItem(ACTIVE_KEY, activeId); else localStorage.removeItem(ACTIVE_KEY); } catch (_) {}
    clearEditorHistory(); titleInput.value = doc.title; render(); inspector.scrollTop = 0; fitZoom(); updateLibraryCount();
    $('#saveStatus').textContent = activeId ? 'Saved' : 'No wireframe selected';
  }
  async function initialize() {
    const started = performance.now();
    try {
      const data = await apiRequest('/api/wireframes');
      library = data.items.map(item => ({ id: item.id, title: item.title, document: normalize(item.document), updatedAt: item.updatedAt }));
      if (!library.length && !localStorage.getItem(MIGRATION_KEY)) {
        const imported = load();
        const created = await apiRequest('/api/wireframes', 'POST', { document: imported });
        library = [{ id: created.id, title: imported.title, document: imported, updatedAt: created.updatedAt }];
      }
      try { localStorage.setItem(MIGRATION_KEY, '1'); } catch (_) {}
      ready = true;
      const preferred = localStorage.getItem(ACTIVE_KEY);
      activate(library.find(item => item.id === preferred) || library[0]);
    } catch (error) {
      $('#saveStatus').textContent = 'Storage unavailable'; toast(error.message);
      document.body.classList.add('storage-error'); $('#loadingMessage').textContent = 'Could not load your wireframes.';
      $('#libraryButton').disabled = true;
      $('#newWireframe').disabled = true;
    } finally {
      if (window.sketchspaceDesktop) await new Promise(resolve => setTimeout(resolve, Math.max(0, 350 - (performance.now() - started))));
      document.body.classList.remove('loading');
    }
  }
  function snapshot() { undo.push(JSON.stringify(doc)); if (undo.length > 60) undo.shift(); redo.length = 0; updateHistory(); }
  function updateHistory() { $('#undoBtn').disabled = !undo.length; $('#redoBtn').disabled = !redo.length; }
  function historyStep(from, to) { if (!from.length) return; const device = doc.device; to.push(JSON.stringify(doc)); doc = normalize(JSON.parse(from.pop())); selected = null; selection.clear(); titleInput.value = doc.title; render(); if (device !== doc.device) fitZoom(); save(); }
  function toast(message) { const target = $('#toast'); target.textContent = message; target.classList.add('visible'); clearTimeout(toastTimer); toastTimer = setTimeout(() => target.classList.remove('visible'), 2500); }

  function setupDesktopUpdates() {
    const desktop = window.sketchspaceDesktop;
    if (!desktop) return;
    const button = $('#updateButton');
    const render = state => {
      const visible = ['available', 'downloading', 'ready'].includes(state.status);
      button.hidden = !visible;
      if (!visible) return;
      button.disabled = state.status === 'downloading';
      button.textContent = state.status === 'ready' ? 'Restart to update'
        : state.status === 'downloading' ? `Downloading ${state.percent || 0}%`
          : `Update to v${state.version}`;
      button.title = state.message || (state.status === 'ready' ? 'Install the downloaded update' : 'Download the latest release');
    };
    desktop.updates.onChange(render);
    desktop.updates.state().then(render).catch(() => {});
    button.addEventListener('click', () => desktop.updates.action().catch(error => toast(error.message || 'Update failed.')));
  }

  function categoryTypes(id = category) {
    return Object.entries(ELEMENTS).filter(([, def]) => def.category === id);
  }
  function renderPalette() {
    const tabs = $('#categoryTabs'), tools = $('#toolList'); tabs.replaceChildren(); tools.replaceChildren();
    const query = $('#toolSearch').value.trim().toLowerCase();
    for (const item of CATEGORIES) {
      const button = el('button', '', item.name); button.type = 'button'; button.setAttribute('role', 'tab');
      button.setAttribute('aria-selected', String(!query && item.id === category)); button.tabIndex = 0;
      button.addEventListener('click', () => { $('#toolSearch').value = ''; category = item.id; renderPalette(); }); tabs.append(button);
    }
    const entries = query ? Object.entries(ELEMENTS).filter(([, def]) => `${def.name} ${def.group || ''} ${CATEGORIES.find(item => item.id === def.category)?.name || ''}`.toLowerCase().includes(query)) : categoryTypes();
    let lastGroup = '';
    for (const [key, def] of entries) {
      const group = query ? `${CATEGORIES.find(item => item.id === def.category)?.name || ''}${def.group ? ` · ${def.group}` : ''}` : def.group;
      if (group && group !== lastGroup) {
        const divider = el('div', 'tool-divider', group);
        divider.setAttribute('role', 'separator');
        tools.append(divider); lastGroup = group;
      }
      const button = el('button', 'tool'); button.type = 'button'; button.dataset.add = key;
      const icon = el('span', 'tool-icon');
      if (isIcon(key)) { const image = el('img'); image.src = iconPath(key); image.alt = ''; icon.append(image); }
      else icon.textContent = def.icon;
      button.append(icon, el('span', '', def.name), el('span', 'tool-plus', '+'));
      button.addEventListener('click', () => add(key)); tools.append(button);
    }
    if (!entries.length) tools.append(el('p', 'tool-empty', 'No matching elements'));
    $('#toolCount').textContent = String(CATEGORIES.reduce((total, item) => total + categoryTypes(item.id).length, 0));
  }
  function buildContent(item, content) {
    const t = item.text;
    if (isIcon(item.type)) { const image = el('img', 'brand-image'); image.src = iconPath(item.type); image.alt = ''; content.append(image); return; }
    switch (item.type) {
      case 'image': content.append(el('span', 'image-symbol', '▧'), document.createTextNode(t)); break;
      case 'box': content.append(el('span', '', t)); break;
      case 'navbar': content.append(el('strong', '', t), el('span', 'nav-links', 'Home    About    Contact')); break;
      case 'tabs': for (const label of [t, 'Details', 'Reviews']) content.append(el('span', 'tab', label)); break;
      case 'breadcrumb': content.textContent = `Home  ›  Section  ›  ${t}`; break;
      case 'sidebar': content.append(el('div', 'side-title', t)); for (let i = 0; i < 5; i++) content.append(el('div', 'side-line')); break;
      case 'pagination': for (const label of ['‹', '1', '2', '3', '›']) content.append(el('span', 'page-pill', label)); break;
      case 'search': content.append(el('span', 'field-symbol', '⌕'), el('span', '', t)); break;
      case 'dropdown': {
        const trigger = el('div', 'dropdown-trigger');
        trigger.append(el('span', '', t), el('span', 'field-symbol', '⌄'));
        content.append(trigger);
        for (const option of item.options || DROPDOWN_DEFAULTS) content.append(el('div', 'dropdown-option', option));
        break;
      }
      case 'checkbox': case 'radio': case 'toggle': content.append(el('span', 'check-shape', item.type === 'checkbox' ? '✓' : ''), el('span', '', t)); break;
      case 'slider': content.append(el('span', 'slider-track')); break;
      case 'list': for (const label of item.items || LIST_DEFAULTS) { const row = el('div', 'list-row'); row.append(el('span', 'row-bullet'), document.createTextNode(label)); content.append(row); } break;
      case 'table': for (const rowText of item.cells || TABLE_DEFAULTS.map((row, r) => r === 0 ? [t || row[0], ...row.slice(1)] : row)) { const row = el('div', 'table-row'); rowText.forEach(cell => row.append(el('span', '', cell))); content.append(row); } break;
      case 'progress': content.append(el('span', 'progress-track'), el('span', '', t)); break;
      case 'browserbar': content.append(el('span', 'browser-dots', '● ● ●'), el('span', 'url-pill', t)); break;
      case 'hero': content.append(el('div', 'hero-title', t), el('div', 'hero-line'), el('div', 'hero-line')); break;
      case 'modal': { content.append(el('div', 'modal-title', t)); const lines = el('div', 'modal-lines'); lines.append(el('i'), el('i')); content.append(lines, el('div', 'modal-action', 'Continue')); break; }
      case 'toolbar': content.append(el('strong', '', t)); for (const symbol of ['↶', 'T', '▣', '⋯']) content.append(el('span', 'tool-square', symbol)); break;
      case 'splitview': for (const title of [t, 'Details']) { const panel = el('div', 'split-panel'); panel.append(el('strong', '', title), el('div', 'split-line'), el('div', 'split-line')); content.append(panel); } break;
      case 'appbar': content.append(el('span', '', '☰'), el('strong', '', t), el('span', '', '⋯')); break;
      case 'statusbar': content.append(el('span', '', t), el('span', '', '●  ▰  ▰')); break;
      case 'mobileheader': content.append(el('span', '', '‹'), el('strong', '', t), el('span', '', '⋯')); break;
      case 'bottomnav': case 'bottombar': for (const [icon, label] of [['⌂', t], ['⌕', 'Search'], ['♡', 'Saved'], ['◉', 'Profile']]) { const entry = el('span', 'bottom-entry'); entry.append(el('b', '', icon), el('span', '', label)); content.append(entry); } break;
      case 'iphoneframe': case 'samsungframe': case 'tabletframe': {
        const screen = el('div', 'device-screen');
        screen.append(el('span', 'device-camera'), el('span', 'device-name', t), el('span', 'device-indicator'));
        content.append(screen); break;
      }
      default: content.textContent = t;
    }
  }
  function createItemNode(item, index) {
      const node = el('div', `canvas-item ${item.type}${item.type.endsWith('frame') ? ' device-frame' : ''}${isIcon(item.type) ? ' brand-icon' : ''}${hasText(item.type) ? ' has-text' : ''}${selection.has(item.id) ? ' selected' : ''}`);
      node.dataset.id = item.id; node.style.left = `${item.x}px`; node.style.top = `${item.y}px`;
      node.style.width = `${item.w}px`; node.style.height = `${item.h}px`;
      node.style.zIndex = String(index + 1);
      node.style.setProperty('--item-font-size', `${effectiveFontSize(item)}px`);
      node.style.setProperty('--item-inset', `${Math.max(3, Math.round(17 * Math.min(1, item.w / (item.fontBaseW || item.w), item.h / (item.fontBaseH || item.h))))}px`);
      node.setAttribute('role', 'button'); node.tabIndex = 0; node.setAttribute('aria-pressed', String(selection.has(item.id)));
      node.setAttribute('aria-label', `${ELEMENTS[item.type].name}: ${item.text || 'no text'}`);
      const content = el('div', 'content'); buildContent(item, content);
      const handle = el('span', 'resize-handle'); handle.setAttribute('aria-hidden', 'true'); handle.title = 'Drag to resize. Hold Shift to keep proportions.';
      node.append(content, handle); return node;
  }
  function renderItems() {
    const fragment = document.createDocumentFragment(); itemNodes.clear(); itemsById.clear();
    canvas.classList.toggle('empty', !page().length); canvas.classList.toggle('no-document', !activeId);
    for (const [index, item] of page().entries()) {
      const node = createItemNode(item, index);
      itemNodes.set(item.id, node); itemsById.set(item.id, item); fragment.append(node);
    }
    canvas.replaceChildren(fragment);
  }
  function refreshItem(item) {
    const old = itemNodes.get(item.id); if (!old) { renderItems(); return; }
    const node = createItemNode(item, page().indexOf(item));
    old.replaceWith(node); itemNodes.set(item.id, node);
  }
  function renderInspector() {
    inspector.replaceChildren(); const item = current();
    if (!selection.size) { const wrap = el('div', 'no-selection'); wrap.append(el('span', 'selection-icon', '◫'), el('p', '', 'Click an element, or drag across the canvas to select several.')); inspector.append(wrap); return; }
    if (selection.size > 1) {
      inspector.append(el('div', 'selection-count', `${selection.size} elements selected`));
      inspector.append(el('p', 'selection-help', 'Drag any selected element to move the group. Press Delete to remove all selected elements.'));
      renderLayerActions();
      const remove = el('button', 'delete-btn', `Delete ${selection.size} elements`); remove.type = 'button'; remove.addEventListener('click', deleteSelected); inspector.append(remove);
      return;
    }
    const heading = el('div', 'selected-type'), symbol = el('span');
    if (isIcon(item.type)) { const image = el('img'); image.src = iconPath(item.type); image.alt = ''; symbol.append(image); }
    else symbol.textContent = ELEMENTS[item.type].icon;
    heading.append(symbol, document.createTextNode(ELEMENTS[item.type].name)); inspector.append(heading);
    if (hasText(item.type)) {
      if (item.type === 'list' || item.type === 'dropdown') {
        const isList = item.type === 'list', key = isList ? 'items' : 'options';
        if (!isList) {
          const label = el('label', 'field-label', 'Selected text'); label.htmlFor = 'itemText'; inspector.append(label);
          const input = el('input'); input.id = 'itemText'; input.type = 'text'; input.value = item.text; input.maxLength = 120; inspector.append(input);
          input.addEventListener('change', () => { if (input.value === item.text) return; snapshot(); item.text = input.value.slice(0, 120); refreshItem(item); save(); });
        }
        const label = el('span', 'field-label', isList ? 'List items' : 'Dropdown options'); inspector.append(label);
        if (!isList) {
          const countLabel = el('label', 'option-count-label'); countLabel.append(el('span', '', 'Number of options'));
          const count = el('input'); count.type = 'number'; count.min = '1'; count.max = '10'; count.step = '1'; count.value = String(item.options.length); count.setAttribute('aria-label', 'Number of options');
          count.addEventListener('change', () => {
            const next = clamp(Math.round(Number(count.value) || 1), 1, 10);
            if (next !== item.options.length) {
              snapshot();
              while (item.options.length < next) item.options.push(`Option ${item.options.length + 1}`);
              item.options.length = next;
              fitItemHeight(item, 46 + next * 36);
              refreshItem(item); renderInspector(); save();
            } else count.value = String(next);
          });
          countLabel.append(count); inspector.append(countLabel);
        }
        const entries = el('div', 'item-editor');
        item[key].forEach((value, index) => {
          const row = el('div', 'item-editor-row');
          const input = el('input'); input.type = 'text'; input.value = value; input.maxLength = 120;
          input.setAttribute('aria-label', `${isList ? 'List item' : 'Dropdown option'} ${index + 1}`);
          input.addEventListener('change', () => {
            if (input.value === item[key][index]) return;
            snapshot(); item[key][index] = input.value.slice(0, 120);
            if (isList && index === 0) item.text = item.items[0];
            refreshItem(item); save();
          });
          row.append(input);
          if (isList) {
            const remove = el('button', 'item-remove', '×'); remove.type = 'button'; remove.title = `Remove item ${index + 1}`; remove.setAttribute('aria-label', remove.title); remove.disabled = item.items.length === 1;
            remove.addEventListener('click', () => { snapshot(); item.items.splice(index, 1); item.text = item.items[0]; fitItemHeight(item, item.items.length * 50); refreshItem(item); renderInspector(); save(); });
            row.append(remove);
          }
          entries.append(row);
        });
        inspector.append(entries);
        if (isList) {
          const addItem = el('button', 'item-add', '+ Add item'); addItem.type = 'button'; addItem.disabled = item.items.length >= 12;
          addItem.addEventListener('click', () => { snapshot(); item.items.push(`Item ${item.items.length + 1}`); fitItemHeight(item, item.items.length * 50); refreshItem(item); renderInspector(); save(); });
          inspector.append(addItem);
        }
      } else if (item.type === 'table') {
        inspector.append(el('span', 'field-label', 'Table cells'));
        const tableEditor = el('div', 'table-editor');
        for (const [rowIndex, row] of item.cells.entries()) {
          const rowGroup = el('div', 'table-editor-row');
          rowGroup.append(el('span', 'table-editor-label', rowIndex === 0 ? 'Header' : `Row ${rowIndex}`));
          const inputs = el('div', 'table-editor-inputs');
          for (const [columnIndex, cell] of row.entries()) {
            const input = el('input'); input.type = 'text'; input.value = cell; input.maxLength = 120;
            input.setAttribute('aria-label', `${rowIndex === 0 ? 'Header' : `Row ${rowIndex}`}, column ${columnIndex + 1}`);
            input.addEventListener('change', () => {
              if (input.value === item.cells[rowIndex][columnIndex]) return;
              snapshot(); item.cells[rowIndex][columnIndex] = input.value.slice(0, 120);
              if (rowIndex === 0 && columnIndex === 0) item.text = item.cells[0][0];
              refreshItem(item); save();
            });
            inputs.append(input);
          }
          rowGroup.append(inputs); tableEditor.append(rowGroup);
        }
        inspector.append(tableEditor);
      } else {
        const label = el('label', 'field-label', 'Text'); label.htmlFor = 'itemText'; inspector.append(label);
        const input = el('textarea'); input.id = 'itemText'; input.value = item.text; input.placeholder = 'Element text'; inspector.append(input);
        input.addEventListener('change', () => { if (input.value === item.text) return; snapshot(); item.text = input.value.slice(0, 500); refreshItem(item); save(); });
      }
      const sizeLabel = el('label', 'field-label', 'Text size'); sizeLabel.htmlFor = 'itemFontSize'; inspector.append(sizeLabel);
      const fontInput = el('input'); fontInput.id = 'itemFontSize'; fontInput.type = 'number'; fontInput.min = '7'; fontInput.max = '72'; fontInput.step = '1'; fontInput.value = String(effectiveFontSize(item));
      fontInput.addEventListener('change', () => {
        const value = Number(fontInput.value); if (!Number.isFinite(value)) return;
        const next = clamp(Math.round(value), 7, 72);
        if (next !== effectiveFontSize(item)) { snapshot(); item.fontSize = next; item.fontBaseW = item.w; item.fontBaseH = item.h; refreshItem(item); save(); }
        fontInput.value = String(effectiveFontSize(item));
      });
      inspector.append(fontInput);
    }
    inspector.append(el('hr'));
    const grid = el('div', 'field-grid'); const bounds = size();
    for (const [key, name] of [['x','X'],['y','Y'],['w','Width'],['h','Height']]) {
      const label = el('label'); label.append(el('span', 'field-label', name));
      const input = el('input'); input.type = 'number'; input.value = String(Math.round(item[key])); input.min = key === 'w' ? '24' : key === 'h' ? '12' : '0'; input.max = String(key === 'x' || key === 'w' ? bounds.w : bounds.h);
      input.addEventListener('change', () => {
        const value = Number(input.value); if (!Number.isFinite(value)) return;
        const next = key === 'w' ? clamp(value, 24, bounds.w - item.x) : key === 'h' ? clamp(value, 12, bounds.h - item.y)
          : key === 'x' ? clamp(value, 0, bounds.w - item.w) : clamp(value, 0, bounds.h - item.h);
        if (next !== item[key]) { snapshot(); item[key] = next; refreshItem(item); renderInspector(); save(); }
        input.value = String(Math.round(item[key]));
      });
      label.append(input); grid.append(label);
    }
    inspector.append(grid);
    renderLayerActions();
    inspector.append(el('hr'));
    const remove = el('button', 'delete-btn', 'Delete element'); remove.type = 'button'; remove.addEventListener('click', deleteSelected); inspector.append(remove);
    inspector.append(el('p', 'inspector-note', 'Drag the corner to resize. Hold Shift for proportions. Use Delete to remove.'));
  }
  function renderLayerActions() {
    const panel = el('div', 'layer-panel'); panel.append(el('span', 'field-label', 'Layer order'));
    const actions = el('div', 'layer-actions');
    for (const [name, direction] of [['Send to back', 'back'], ['Back one', 'backward'], ['Forward one', 'forward'], ['Bring to front', 'front']]) {
      const button = el('button', '', name); button.type = 'button'; button.disabled = selection.size === page().length;
      button.addEventListener('click', () => moveLayer(direction)); actions.append(button);
    }
    panel.append(actions); inspector.append(panel);
  }
  function moveLayer(direction) {
    if (!selection.size) return;
    const before = page(), next = before.slice();
    if (direction === 'front' || direction === 'back') {
      const picked = next.filter(item => selection.has(item.id));
      const rest = next.filter(item => !selection.has(item.id));
      next.splice(0, next.length, ...(direction === 'front' ? [...rest, ...picked] : [...picked, ...rest]));
    } else if (direction === 'forward') {
      for (let i = next.length - 2; i >= 0; i--) if (selection.has(next[i].id) && !selection.has(next[i + 1].id)) [next[i], next[i + 1]] = [next[i + 1], next[i]];
    } else if (direction === 'backward') {
      for (let i = 1; i < next.length; i++) if (selection.has(next[i].id) && !selection.has(next[i - 1].id)) [next[i], next[i - 1]] = [next[i - 1], next[i]];
    }
    if (next.every((item, i) => item.id === before[i].id)) return;
    snapshot(); doc.pages[doc.device].items = next; renderItems(); renderInspector(); save(); toast('Layer order updated');
  }
  function renderSavedCanvasMenu() {
    const menu = el('div', 'saved-canvas-menu');
    const others = Object.entries(PRESETS).filter(([key]) => key !== doc.device && doc.pages[key].items.length);
    if (!others.length) return menu;
    menu.append(el('div', 'menu-caption', 'Previous canvases'));
    for (const [key, preset] of others) {
      const button = el('button', '', `Open saved ${preset.name} canvas (${doc.pages[key].items.length})`);
      button.type = 'button'; button.addEventListener('click', () => { switchDevice(key); $('#libraryDialog').close(); }); menu.append(button);
    }
    return menu;
  }
  function libraryIconButton(label, icon, onClick) {
    const button = el('button', 'library-icon-action'); button.type = 'button'; button.title = label; button.setAttribute('aria-label', label);
    const image = el('img'); image.src = iconPath(`ui_${icon}`); image.alt = ''; button.append(image);
    button.addEventListener('click', onClick); return button;
  }
  function renderLibrary() {
    const list = $('#libraryList'); list.replaceChildren(); updateLibraryCount();
    $('#libraryEmpty').textContent = library.length ? '' : 'No saved wireframes yet. Create one to get started.';
    for (const entry of [...library].sort((a, b) => b.updatedAt - a.updatedAt)) {
      const row = el('div', `library-row${entry.id === activeId ? ' active' : ''}`);
      const details = el('div', 'library-details');
      const title = el('strong', 'library-title', entry.title);
      const count = Object.values(entry.document.pages).reduce((total, sheet) => total + sheet.items.length, 0);
      details.append(title, el('span', 'library-meta', `${count} element${count === 1 ? '' : 's'} · ${new Date(entry.updatedAt).toLocaleString('en', { dateStyle: 'medium', timeStyle: 'short' })}`));
      const actions = el('div', 'library-actions');
      const open = el('button', 'library-open', entry.id === activeId ? 'Editing' : 'Open'); open.type = 'button'; open.disabled = entry.id === activeId;
      open.addEventListener('click', async () => { try { await flushSave(); activate(entry); $('#libraryDialog').close(); } catch (_) {} });
      actions.append(open);
      if (entry.id === activeId) {
        details.append(renderSavedCanvasMenu());
        const importButton = libraryIconButton('Import JSON', 'upload', () => { if (library.length >= 10) { toast('You can save up to 10 wireframes'); return; } $('#fileInput').click(); });
        importButton.disabled = library.length >= 10;
        actions.append(
          libraryIconButton('Save now', 'save', async () => { try { await flushSave(); toast('Wireframe saved'); } catch (_) {} }),
          libraryIconButton('Download JSON', 'download', () => { download(new Blob([JSON.stringify(doc, null, 2)], { type: 'application/json' }), filename('.json')); toast('Wireframe downloaded'); }),
          importButton,
          libraryIconButton('Export PNG', 'image', drawPng)
        );
      }
      const rename = libraryIconButton('Rename', 'pencil', () => {
        const input = el('input'); input.type = 'text'; input.maxLength = 60; input.value = entry.title; input.setAttribute('aria-label', `Rename ${entry.title}`);
        const saveName = el('button', '', 'Save name'), cancel = el('button', '', 'Cancel');
        saveName.type = cancel.type = 'button'; details.replaceChild(input, title); actions.replaceChildren(saveName, cancel); input.focus(); input.select();
        cancel.addEventListener('click', renderLibrary);
        input.addEventListener('keydown', event => { if (event.key === 'Enter') saveName.click(); if (event.key === 'Escape') { event.stopPropagation(); renderLibrary(); } });
        saveName.addEventListener('click', async () => {
          const name = input.value.trim().slice(0, 60); if (!name) { input.focus(); return; }
          try {
            await flushSave();
            const updated = clone(entry.document); updated.title = name;
            const result = await apiRequest(`/api/wireframes/${entry.id}`, 'PUT', { document: updated });
            entry.document = updated; entry.title = name; entry.updatedAt = result.updatedAt;
            if (entry.id === activeId) { doc.title = name; titleInput.value = name; }
            renderLibrary(); toast('Wireframe renamed');
          } catch (error) { toast(error.message); }
        });
      });
      const remove = libraryIconButton('Delete', 'trash', async () => {
        if (!confirm(`Delete “${entry.title}”? This cannot be undone.`)) return;
        try {
          await flushSave(); await apiRequest(`/api/wireframes/${entry.id}`, 'DELETE');
          library = library.filter(item => item.id !== entry.id);
          if (entry.id === activeId) activate(library[0]);
          renderLibrary(); toast('Wireframe deleted');
        } catch (error) { toast(error.message); }
      });
      remove.classList.add('library-delete'); actions.append(rename, remove); row.append(details, actions); list.append(row);
    }
  }
  async function createWireframe(document) {
    if (!ready) return;
    if (library.length >= 10) { toast('You can save up to 10 wireframes'); return; }
    try {
      await flushSave();
      const next = normalize(document || { title: `Wireframe ${library.length + 1}`, device: 'desktop', pages: { desktop: { items: [] }, tablet: { items: [] }, mobile: { items: [] } } });
      const result = await apiRequest('/api/wireframes', 'POST', { document: next });
      const entry = { id: result.id, title: next.title, document: next, updatedAt: result.updatedAt };
      library.unshift(entry); activate(entry); renderLibrary(); $('#libraryDialog').close(); toast('Wireframe created');
    } catch (error) { toast(error.message); }
  }
  function render() {
    const bounds = size(); canvas.style.width = `${bounds.w}px`; canvas.style.height = `${bounds.h}px`;
    $('#canvasSize').textContent = `${bounds.w} × ${bounds.h}`;
    renderPalette(); renderItems(); renderInspector(); setZoom(zoom); updateHistory();
  }
  function setSelection(ids) { selection = new Set(ids.filter(id => itemsById.has(id))); selected = selection.size === 1 ? selection.values().next().value : null; syncSelectionVisuals(); renderInspector(); inspector.scrollTop = 0; }
  function setSelected(id) { setSelection(id ? [id] : []); }
  function syncSelectionVisuals() { for (const [id, node] of itemNodes) { const active = selection.has(id); if (node.classList.contains('selected') !== active) { node.classList.toggle('selected', active); node.setAttribute('aria-pressed', String(active)); } } }
  function setZoom(value) {
    zoom = clamp(value, .4, 2);
    const bounds = size(); canvas.style.transform = `scale(${zoom})`;
    mount.style.width = `${bounds.w * zoom}px`; mount.style.height = `${bounds.h * zoom}px`;
    $('#zoomValue').textContent = `${Math.round(zoom * 100)}%`;
    $('#zoomSlider').value = String(Math.round(zoom * 100));
    $('#zoomOut').disabled = zoom <= .4; $('#zoomIn').disabled = zoom >= 2;
  }
  function fitZoom() {
    const bounds = size(), width = Math.max(260, scroll.clientWidth - 64), height = Math.max(220, scroll.clientHeight - 60);
    setZoom(Math.min(1, Math.floor(Math.min(width / bounds.w, height / bounds.h) * 10) / 10));
    scroll.scrollLeft = 0; scroll.scrollTop = 0;
  }
  function switchDevice(device) { if (!PRESETS[device] || device === doc.device) return; doc.device = device; selected = null; selection.clear(); render(); fitZoom(); save(); toast('Saved canvas opened'); }
  function add(type, x, y) {
    if (!activeId) { toast('Create a wireframe first'); return; }
    const def = ELEMENTS[type]; if (!def) return;
    const bounds = size(), offset = page().length % 5 * 16;
    const w = Math.min(def.w, bounds.w - 24), h = Math.min(def.h, bounds.h - 24);
    let px = x ?? scroll.scrollLeft / zoom + (doc.device === 'mobile' ? 18 : 100) + offset;
    let py = y ?? scroll.scrollTop / zoom + 90 + offset;
    if (x === undefined && y === undefined) {
      if (type === 'statusbar') { px = 15; py = 8; }
      if (type === 'mobileheader') { px = 15; py = 42; }
      if (type === 'bottomnav' || type === 'bottombar') { px = (bounds.w - w) / 2; py = bounds.h - h - 12; }
      if (type === 'fab') { px = bounds.w - w - 24; py = bounds.h - h - 100; }
      if (type === 'browserbar' || type === 'appbar') { px = 20; py = 16; }
    }
    snapshot();
    const item = { id: `item-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, type,
      x: Math.round(clamp(px, 0, bounds.w - w)), y: Math.round(clamp(py, 0, bounds.h - h)), w, h, text: def.text,
      fontSize: defaultFontSize(type), fontBaseW: w, fontBaseH: h };
    if (type === 'table') item.cells = clone(TABLE_DEFAULTS);
    if (type === 'list') item.items = clone(LIST_DEFAULTS);
    if (type === 'dropdown') item.options = clone(DROPDOWN_DEFAULTS);
    if (type.endsWith('frame')) page().unshift(item); else page().push(item);
    selection = new Set([item.id]); selected = item.id; renderItems(); renderInspector(); inspector.scrollTop = 0; save(); toast(`${def.name} added`); return item;
  }
  function deleteSelected() { if (!selection.size) return; const count = selection.size; snapshot(); doc.pages[doc.device].items = page().filter(item => !selection.has(item.id)); selection.clear(); selected = null; renderItems(); renderInspector(); save(); toast(`${count} element${count === 1 ? '' : 's'} deleted`); }

  function filename(extension) { return (doc.title.trim().replace(/[\\/:*?"<>|]/g, '-').replace(/\s+/g, '-') || 'wireframe') + extension; }
  function download(blob, name) { const url = URL.createObjectURL(blob), link = document.createElement('a'); link.href = url; link.download = name; document.body.append(link); link.click(); link.remove(); setTimeout(() => URL.revokeObjectURL(url), 2000); }
  async function drawPng() {
    const brandImages = new Map();
    await Promise.all([...new Set(page().filter(item => isIcon(item.type)).map(item => item.type))].map(type => new Promise(resolve => {
      const image = new Image(); image.onload = () => { brandImages.set(type, image); resolve(); }; image.onerror = resolve;
      image.src = iconPath(type);
    })));
    const bounds = size(), output = document.createElement('canvas'); output.width = bounds.w * 2; output.height = bounds.h * 2;
    const c = output.getContext('2d'); if (!c) { toast('Could not export PNG'); return; }
    c.scale(2, 2); c.fillStyle = '#ffffff'; c.fillRect(0, 0, bounds.w, bounds.h);
    const ink = '#35414b', muted = '#75858e', pale = '#f3f6f5';
    const rect = (x, y, w, h, fill = '#fff', stroke = ink) => { c.fillStyle = fill; c.fillRect(x, y, w, h); if (stroke) { c.strokeStyle = stroke; c.lineWidth = 2; c.strokeRect(x, y, w, h); } };
    const line = (x1, y1, x2, y2, color = ink, width = 2) => { c.beginPath(); c.moveTo(x1, y1); c.lineTo(x2, y2); c.strokeStyle = color; c.lineWidth = width; c.stroke(); };
    const write = (text, x, y, font = '16px Trebuchet MS, sans-serif', color = ink, max = 500, align = 'left') => { c.fillStyle = color; c.font = font; c.textAlign = align; c.textBaseline = 'middle'; c.fillText(String(text), x, y, max); };
    const wrapped = (text, x, y, maxWidth, lineHeight, maxY, font = '16px Trebuchet MS, sans-serif', color = ink) => {
      c.font = font; c.fillStyle = color; c.textAlign = 'left'; c.textBaseline = 'top';
      for (const paragraph of String(text).split('\n')) {
        let row = '';
        for (const word of paragraph.split(/\s+/)) {
          const test = row ? `${row} ${word}` : word;
          if (row && c.measureText(test).width > maxWidth) { if (y <= maxY) c.fillText(row, x, y); y += lineHeight; row = word; } else row = test;
        }
        if (row && y <= maxY) c.fillText(row, x, y); y += lineHeight;
      }
    };
    for (const item of page()) {
      const { x, y, w, h, text: t, type } = item;
      const fontSize = effectiveFontSize(item);
      c.save();
      if (type === 'heading') wrapped(t, x, y, w, fontSize * 1.25, y + h, `bold ${fontSize}px Trebuchet MS, sans-serif`);
      else if (type === 'text') wrapped(t, x, y, w, fontSize * 1.4, y + h, `${fontSize}px Trebuchet MS, sans-serif`);
      else if (type === 'label') write(t, x, y + h / 2, `bold ${fontSize}px Trebuchet MS, sans-serif`, ink, w);
      else if (type === 'link') { write(t, x, y + h / 2, `${fontSize}px Trebuchet MS, sans-serif`, '#425a66', w); line(x, y + h - 5, x + Math.min(w, c.measureText(t).width), y + h - 5, '#425a66', 1); }
      else if (type === 'divider') line(x, y + h / 2, x + w, y + h / 2);
      else if (type === 'icon') write(t, x + w / 2, y + h / 2, `${fontSize}px sans-serif`, ink, w, 'center');
      else if (isIcon(type)) {
        c.fillStyle = '#fff'; c.strokeStyle = '#d7e0e3'; c.lineWidth = 1;
        c.beginPath(); c.roundRect(x, y, w, h, 12); c.fill(); c.stroke();
        const image = brandImages.get(type), side = Math.min(w, h) * .62;
        if (image) c.drawImage(image, x + (w - side) / 2, y + (h - side) / 2, side, side);
        else write(t[0], x + w / 2, y + h / 2, 'bold 30px sans-serif', ink, w, 'center');
      }
      else if (['button', 'menubutton', 'fab'].includes(type)) { rect(x, y, w, h, '#eff1f0'); write(t, x + w / 2, y + h / 2, `bold ${fontSize}px Trebuchet MS, sans-serif`, ink, w - 12, 'center'); }
      else if (type === 'box') { rect(x, y, w, h, '#f8f9f7'); wrapped(t, x + 14, y + 14, w - 28, fontSize * 1.4, y + h - 10, `${fontSize}px Trebuchet MS, sans-serif`); }
      else if (type === 'card') { const inset = Math.max(3, Math.round(17 * Math.min(1, w / (item.fontBaseW || w), h / (item.fontBaseH || h)))); rect(x + 3, y + 3, w, h, '#dce1e3', null); rect(x, y, w, h); wrapped(t, x + inset, y + inset, w - inset * 2, fontSize * 1.2, y + h - inset, `bold ${fontSize}px Trebuchet MS, sans-serif`); }
      else if (type === 'image') { rect(x, y, w, h, '#f3f5f4', '#89979f'); write('▧', x + w / 2, y + h / 2 - 15, '36px sans-serif', muted, w, 'center'); write(t, x + w / 2, y + h / 2 + 21, `${fontSize}px sans-serif`, muted, w - 20, 'center'); }
      else if (type === 'dropdown') {
        rect(x, y, w, h); line(x, y + 46, x + w, y + 46, '#cad2d6', 1);
        write(t, x + 12, y + 23, `${fontSize}px Trebuchet MS, sans-serif`, muted, w - 46);
        write('⌄', x + w - 18, y + 23, '22px sans-serif', muted);
        (item.options || DROPDOWN_DEFAULTS).forEach((option, index) => {
          const rowY = y + 46 + index * 36;
          if (rowY + 18 > y + h) return;
          if (index) line(x + 10, rowY, x + w - 10, rowY, '#e1e6e8', 1);
          write(option, x + 12, rowY + 18, `${fontSize}px Trebuchet MS, sans-serif`, ink, w - 24);
        });
      }
      else if (['input', 'textarea', 'search'].includes(type)) { rect(x, y, w, h); if (type === 'search') write('⌕', x + 12, y + h / 2, '22px sans-serif', muted); wrapped(t, x + (type === 'search' ? 36 : 12), y + (type === 'textarea' ? 11 : h / 2 - fontSize * .7), w - 48, fontSize * 1.4, y + h - 8, `${fontSize}px Trebuchet MS, sans-serif`, muted); }
      else if (['checkbox', 'radio', 'toggle'].includes(type)) { rect(x, y + 5, type === 'toggle' ? 38 : 20, 20, '#e2e8e9'); if (type === 'checkbox') write('✓', x + 3, y + 15, 'bold 16px sans-serif'); if (type === 'radio') write('●', x + 4, y + 15, '12px sans-serif'); write(t, x + (type === 'toggle' ? 48 : 30), y + h / 2, `${fontSize}px Trebuchet MS, sans-serif`, ink, w - 48); }
      else if (type === 'slider') { line(x, y + h / 2, x + w, y + h / 2, '#9cabb3', 4); rect(x + w * .45, y + h / 2 - 8, 16, 16, '#fff'); }
      else if (type === 'avatar') { c.beginPath(); c.arc(x + w / 2, y + h / 2, Math.min(w, h) / 2 - 2, 0, Math.PI * 2); c.fillStyle = '#dce5e8'; c.fill(); c.strokeStyle = ink; c.lineWidth = 2; c.stroke(); write(t.slice(0, 3), x + w / 2, y + h / 2, `bold ${fontSize}px sans-serif`, ink, w, 'center'); }
      else if (type === 'badge') { rect(x, y, w, h, '#edf3dc'); write(t, x + w / 2, y + h / 2, `bold ${fontSize}px sans-serif`, ink, w - 12, 'center'); }
      else if (type === 'progress') { rect(x, y + 8, w - 45, 12, '#e4e9ea', '#a0adb4'); rect(x, y + 8, (w - 45) * .65, 12, '#a9c34c', null); write(t, x + w - 35, y + h / 2, `${fontSize}px sans-serif`); }
      else if (type === 'alert') { rect(x, y, w, h, '#f5f7ed'); write('!', x + 16, y + 21, 'bold 22px sans-serif'); wrapped(t, x + 38, y + 13, w - 50, fontSize * 1.4, y + h - 8, `${fontSize}px sans-serif`); }
      else if (type === 'list') { const entries = item.items || LIST_DEFAULTS; rect(x, y, w, h); entries.forEach((label, i) => { if (i) line(x, y + h * i / entries.length, x + w, y + h * i / entries.length, '#cad2d6', 1); write('●', x + 12, y + h * (i + .5) / entries.length, '14px sans-serif', muted); write(label, x + 35, y + h * (i + .5) / entries.length, `${fontSize}px sans-serif`, ink, w - 45); }); }
      else if (type === 'table') { rect(x, y, w, h); rect(x, y, w, h / 4, '#edf1f2', null); for (let i = 1; i < 4; i++) line(x, y + h * i / 4, x + w, y + h * i / 4, '#adb9bf', 1); for (let i = 1; i < 3; i++) line(x + w * i / 3, y, x + w * i / 3, y + h, '#adb9bf', 1); const rows = item.cells || TABLE_DEFAULTS; rows.forEach((row, i) => row.forEach((cell, j) => write(cell, x + w * j / 3 + 7, y + h * (i + .5) / 4, `${i ? '' : 'bold '}${fontSize}px sans-serif`, ink, w / 3 - 12))); }
      else if (['navbar', 'browserbar', 'appbar', 'mobileheader', 'statusbar', 'bottomnav', 'bottombar', 'toolbar'].includes(type)) {
        rect(x, y, w, h, '#f8f9f7', type === 'statusbar' ? null : ink);
        if (type === 'navbar') { write(t, x + 14, y + h / 2, `bold ${fontSize}px sans-serif`); write('Home    About    Contact', x + w - 14, y + h / 2, `${fontSize}px sans-serif`, muted, w * .6, 'right'); }
        if (type === 'browserbar') { write('● ● ●', x + 12, y + h / 2, '13px sans-serif', muted); rect(x + 76, y + 8, w - 88, h - 16, '#fff', '#b8c5cb'); write(t, x + 87, y + h / 2, `${fontSize}px sans-serif`, muted, w - 110); }
        if (type === 'appbar' || type === 'mobileheader') { write(type === 'appbar' ? '☰' : '‹', x + 15, y + h / 2, '20px sans-serif'); write(t, x + w / 2, y + h / 2, `bold ${fontSize}px sans-serif`, ink, w - 70, 'center'); write('⋯', x + w - 16, y + h / 2, '20px sans-serif', ink, 25, 'right'); }
        if (type === 'statusbar') { write(t, x + 10, y + h / 2, `bold ${fontSize}px sans-serif`); write('●  ▰  ▰', x + w - 10, y + h / 2, '13px sans-serif', ink, 80, 'right'); }
        if (type === 'bottomnav' || type === 'bottombar') { [['⌂', t], ['⌕', 'Search'], ['♡', 'Saved'], ['◉', 'Profile']].forEach(([symbol, label], i) => { const cx = x + w * (i + .5) / 4; write(symbol, cx, y + h * .35, '19px sans-serif', ink, w / 4, 'center'); write(label, cx, y + h * .73, '12px sans-serif', ink, w / 4, 'center'); }); }
        if (type === 'toolbar') { write(t, x + 12, y + h / 2, `bold ${fontSize}px sans-serif`); ['↶', 'T', '▣', '⋯'].forEach((symbol, i) => { const bx = x + w - 148 + i * 34; rect(bx, y + 10, 27, h - 20, '#fff', '#8d9aa2'); write(symbol, bx + 13, y + h / 2, '15px sans-serif', ink, 24, 'center'); }); }
      }
      else if (type === 'tabs') { [t, 'Details', 'Reviews'].forEach((label, i) => { write(label, x + 12 + i * w / 3, y + h / 2, `${i ? '' : 'bold '}${fontSize}px sans-serif`, ink, w / 3 - 16); line(x + i * w / 3, y + h - 3, x + (i + 1) * w / 3 - 4, y + h - 3, i ? '#c7d0d4' : ink, 2); }); }
      else if (type === 'breadcrumb') write(`Home  ›  Section  ›  ${t}`, x, y + h / 2, `${fontSize}px sans-serif`, muted, w);
      else if (type === 'sidebar') { rect(x, y, w, h, '#f7f9f8'); write(t, x + 14, y + 25, `bold ${fontSize}px sans-serif`); for (let i = 0; i < 5; i++) rect(x + 14, y + 55 + i * 42, w * (i % 2 ? .55 : .72), 11, '#c7d2d6', null); }
      else if (type === 'pagination') { ['‹', '1', '2', '3', '›'].forEach((label, i) => { rect(x + i * 36, y + 2, 30, h - 4, i === 1 ? '#e9f4b5' : '#fff', '#929fa6'); write(label, x + i * 36 + 15, y + h / 2, '13px sans-serif', ink, 25, 'center'); }); }
      else if (type === 'hero') { rect(x, y, w, h, '#f6f8f8'); write(t, x + 23, y + h / 2 - 36, `bold ${fontSize}px sans-serif`, ink, w - 46); rect(x + 23, y + h / 2 + 2, w * .64, 8, '#c9d3d6', null); rect(x + 23, y + h / 2 + 23, w * .53, 8, '#c9d3d6', null); }
      else if (type === 'modal') { rect(x + 4, y + 4, w, h, '#c6d0d4', null); rect(x, y, w, h); write(t, x + 18, y + 35, `bold ${fontSize}px sans-serif`); rect(x + 18, y + 70, w * .72, 8, '#d1dadc', null); rect(x + 18, y + 88, w * .56, 8, '#d1dadc', null); rect(x + w - 107, y + h - 50, 88, 29, '#e9edeb'); write('Continue', x + w - 63, y + h - 35, '13px sans-serif', ink, 80, 'center'); }
      else if (type === 'splitview') { rect(x, y, w, h); rect(x, y, w * .38, h, '#edf2f3'); write(t, x + 12, y + 26, `bold ${fontSize}px sans-serif`); write('Details', x + w * .38 + 12, y + 26, `${fontSize}px sans-serif`); for (let i = 0; i < 2; i++) { rect(x + 12, y + 55 + i * 22, w * .27, 8, '#c9d3d7', null); rect(x + w * .38 + 12, y + 55 + i * 22, w * .4, 8, '#c9d3d7', null); } }
      else if (type.endsWith('frame')) {
        const tablet = type === 'tabletframe', inset = tablet ? 10 : 8;
        c.fillStyle = '#2e3a44'; c.strokeStyle = '#1b2933'; c.lineWidth = 2;
        c.beginPath(); c.roundRect(x, y, w, h, tablet ? 21 : 30); c.fill(); c.stroke();
        c.fillStyle = '#fff'; c.beginPath(); c.roundRect(x + inset, y + inset, w - inset * 2, h - inset * 2, tablet ? 12 : 21); c.fill();
        if (type === 'iphoneframe') { c.fillStyle = '#2e3a44'; c.beginPath(); c.roundRect(x + w * .31, y + inset - 1, w * .38, 15, [0, 0, 12, 12]); c.fill(); }
        else { c.fillStyle = '#596a73'; c.beginPath(); c.arc(x + w / 2, y + inset + 5, tablet ? 3 : 4, 0, Math.PI * 2); c.fill(); }
        for (let i = 0; i < 6; i++) rect(x + w * .16, y + h * .28 + i * 29, w * .68, 3, '#edf1f2', null);
        write(t, x + w / 2, y + h * .43, `bold ${fontSize}px Trebuchet MS, sans-serif`, muted, w - 30, 'center');
        rect(x + w * .37, y + h - inset - 9, w * .26, 4, '#45545d', null);
      }
      c.restore();
    }
    output.toBlob(blob => { if (blob) { download(blob, filename(`-${doc.device}.png`)); toast('PNG downloaded'); } }, 'image/png');
  }

  $('#zoomOut').addEventListener('click', () => setZoom(Math.round((zoom - .1) * 10) / 10));
  $('#zoomIn').addEventListener('click', () => setZoom(Math.round((zoom + .1) * 10) / 10));
  $('#zoomSlider').addEventListener('input', event => setZoom(Number(event.target.value) / 100));
  $('#zoomFit').addEventListener('click', fitZoom);
  scroll.addEventListener('wheel', event => {
    if (!event.ctrlKey && !event.metaKey) return;
    event.preventDefault(); setZoom(Math.round((zoom + (event.deltaY < 0 ? .1 : -.1)) * 10) / 10);
  }, { passive: false });
  $('#undoBtn').addEventListener('click', () => historyStep(undo, redo));
  $('#redoBtn').addEventListener('click', () => historyStep(redo, undo));
  $('#libraryButton').addEventListener('click', () => { renderLibrary(); $('#libraryDialog').showModal(); });
  $('#closeLibrary').addEventListener('click', () => $('#libraryDialog').close());
  $('#newWireframe').addEventListener('click', () => createWireframe());
  $('#toolSearch').addEventListener('input', renderPalette);
  $('#fileInput').addEventListener('change', async event => {
    const file = event.target.files?.[0]; if (!file) return;
    try { if (file.size > 1000000) throw Error('Wireframe is too large'); const opened = normalize(JSON.parse(await file.text())); await createWireframe(opened); }
    catch (error) { toast(error.message === 'Wireframe is too large' ? error.message : 'Could not open the wireframe file'); }
    event.target.value = '';
  });
  $('#retryLoad').addEventListener('click', () => location.reload());
  titleInput.value = doc.title;
  titleInput.addEventListener('change', () => { if (!activeId) return; doc.title = titleInput.value.trim().slice(0, 60) || 'Untitled'; titleInput.value = doc.title; save(); });
  function canvasPoint(event) {
    const rect = canvas.getBoundingClientRect(), bounds = size();
    return { x: clamp((event.clientX - rect.left) / zoom, 0, bounds.w), y: clamp((event.clientY - rect.top) / zoom, 0, bounds.h) };
  }
  canvas.addEventListener('pointerdown', event => {
    if (spaceHeld || event.button !== 0) return;
    const target = event.target.closest('.canvas-item');
    if (!target) {
      const point = canvasPoint(event), overlay = el('div', 'selection-marquee'); canvas.append(overlay);
      marquee = { startX: point.x, startY: point.y, base: new Set(event.shiftKey ? selection : []), overlay, moved: false };
      if (!event.shiftKey) { selection.clear(); selected = null; syncSelectionVisuals(); renderInspector(); }
      event.preventDefault(); return;
    }
    const item = itemsById.get(target.dataset.id); if (!item) return;
    if (event.shiftKey && !event.target.classList.contains('resize-handle')) {
      if (selection.has(item.id)) selection.delete(item.id); else selection.add(item.id);
      selected = selection.size === 1 ? selection.values().next().value : null;
      syncSelectionVisuals(); renderInspector(); event.preventDefault(); return;
    }
    const mode = event.target.classList.contains('resize-handle') && selection.size === 1 ? 'resize' : 'move';
    if (!selection.has(item.id)) setSelected(item.id);
    const members = selectedItems().map(entry => ({ item: entry, node: itemNodes.get(entry.id), x: entry.x, y: entry.y, w: entry.w, h: entry.h }));
    drag = { device: doc.device, mode, startX: event.clientX, startY: event.clientY, members, started: false,
      left: Math.min(...members.map(entry => entry.x)), top: Math.min(...members.map(entry => entry.y)),
      right: Math.max(...members.map(entry => entry.x + entry.w)), bottom: Math.max(...members.map(entry => entry.y + entry.h)) };
    event.preventDefault();
  });
  window.addEventListener('pointermove', event => {
    if (pan) { scroll.scrollLeft = pan.left - (event.clientX - pan.x); scroll.scrollTop = pan.top - (event.clientY - pan.y); return; }
    if (marquee) {
      const point = canvasPoint(event), left = Math.min(marquee.startX, point.x), top = Math.min(marquee.startY, point.y);
      const width = Math.abs(point.x - marquee.startX), height = Math.abs(point.y - marquee.startY);
      marquee.moved ||= width + height > 3;
      Object.assign(marquee.overlay.style, { left: `${left}px`, top: `${top}px`, width: `${width}px`, height: `${height}px` });
      selection = new Set(marquee.base);
      if (marquee.moved) for (const item of page()) if (item.x < left + width && item.x + item.w > left && item.y < top + height && item.y + item.h > top) selection.add(item.id);
      selected = selection.size === 1 ? selection.values().next().value : null;
      syncSelectionVisuals(); return;
    }
    if (!drag || drag.device !== doc.device) return;
    const dx = Math.round((event.clientX - drag.startX) / zoom), dy = Math.round((event.clientY - drag.startY) / zoom);
    if (!drag.started && Math.abs(dx) + Math.abs(dy) < 2) return;
    if (!drag.started) { snapshot(); drag.started = true; }
    const bounds = size();
    const moveX = clamp(dx, -drag.left, bounds.w - drag.right), moveY = clamp(dy, -drag.top, bounds.h - drag.bottom);
    for (const origin of drag.members) {
      const item = origin.item;
      if (drag.mode === 'move') { item.x = origin.x + moveX; item.y = origin.y + moveY; }
      else if (event.shiftKey) {
        const minScale = Math.max(24 / origin.w, 12 / origin.h);
        const maxScale = Math.min((bounds.w - item.x) / origin.w, (bounds.h - item.y) / origin.h);
        const scale = clamp(1 + (Math.abs(dx / origin.w) >= Math.abs(dy / origin.h) ? dx / origin.w : dy / origin.h), minScale, maxScale);
        item.w = Math.round(origin.w * scale); item.h = Math.round(origin.h * scale);
      } else { item.w = clamp(origin.w + dx, 24, bounds.w - item.x); item.h = clamp(origin.h + dy, 12, bounds.h - item.y); }
      const node = origin.node;
      if (node) {
        node.style.left = `${item.x}px`; node.style.top = `${item.y}px`; node.style.width = `${item.w}px`; node.style.height = `${item.h}px`;
        node.style.setProperty('--item-font-size', `${effectiveFontSize(item)}px`);
        node.style.setProperty('--item-inset', `${Math.max(3, Math.round(17 * Math.min(1, item.w / (item.fontBaseW || item.w), item.h / (item.fontBaseH || item.h))))}px`);
      }
    }
  });
  window.addEventListener('pointerup', () => {
    if (marquee) { marquee.overlay.remove(); marquee = null; renderInspector(); }
    if (drag?.started) { renderInspector(); save(); }
    drag = null; pan = null; scroll.style.cursor = '';
  });
  canvas.addEventListener('dblclick', event => { const target = event.target.closest('.canvas-item'); if (!target) return; const item = itemsById.get(target.dataset.id); if (!item) return; setSelected(item.id); const input = $('#itemText') || inspector.querySelector('.item-editor input, .table-editor input'); input?.focus(); input?.select(); });
  canvas.addEventListener('keydown', event => { if (!['Enter', ' '].includes(event.key)) return; const target = event.target.closest('.canvas-item'); if (target) { event.preventDefault(); setSelected(target.dataset.id); } });
  scroll.addEventListener('pointerdown', event => { if (!spaceHeld) return; pan = { x: event.clientX, y: event.clientY, left: scroll.scrollLeft, top: scroll.scrollTop }; scroll.style.cursor = 'grabbing'; event.preventDefault(); });
  window.addEventListener('keydown', event => {
    const editing = ['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName);
    if (event.code === 'Space' && !editing) { spaceHeld = true; scroll.style.cursor = 'grab'; event.preventDefault(); }
    if ((event.ctrlKey || event.metaKey) && !editing && event.key.toLowerCase() === 'z') { event.preventDefault(); historyStep(event.shiftKey ? redo : undo, event.shiftKey ? undo : redo); }
    if ((event.ctrlKey || event.metaKey) && !editing && event.key.toLowerCase() === 'y') { event.preventDefault(); historyStep(redo, undo); }
    if ((event.ctrlKey || event.metaKey) && !editing && event.key.toLowerCase() === 'a') { event.preventDefault(); setSelection(page().map(item => item.id)); }
    if (!editing && selection.size && ['Delete', 'Backspace'].includes(event.key)) { event.preventDefault(); deleteSelected(); }
    if (!editing && selection.size && ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(event.key)) {
      event.preventDefault(); const items = selectedItems(), bounds = size(), step = event.shiftKey ? 10 : 1;
      const proposedX = event.key === 'ArrowLeft' ? -step : event.key === 'ArrowRight' ? step : 0;
      const proposedY = event.key === 'ArrowUp' ? -step : event.key === 'ArrowDown' ? step : 0;
      const dx = clamp(proposedX, -Math.min(...items.map(item => item.x)), bounds.w - Math.max(...items.map(item => item.x + item.w)));
      const dy = clamp(proposedY, -Math.min(...items.map(item => item.y)), bounds.h - Math.max(...items.map(item => item.y + item.h)));
      if (!dx && !dy) return;
      snapshot(); for (const item of items) { item.x += dx; item.y += dy; const node = itemNodes.get(item.id); if (node) { node.style.left = `${item.x}px`; node.style.top = `${item.y}px`; } }
      renderInspector(); save();
    }
    if (event.key === 'Escape' && !editing) setSelected(null);
  });
  window.addEventListener('keyup', event => { if (event.code === 'Space') { spaceHeld = false; scroll.style.cursor = ''; } });
  window.addEventListener('blur', () => { drag = null; if (marquee) marquee.overlay.remove(); marquee = null; pan = null; spaceHeld = false; scroll.style.cursor = ''; });

  document.body.classList.add('loading'); render(); fitZoom(); setupDesktopUpdates(); initialize();
  const context = document.modelContext;
  if (context?.registerTool) {
    const register = tool => { try { Promise.resolve(context.registerTool(tool)).catch(() => {}); } catch (_) {} };
    register({ name: 'get_wireframe_layout', title: 'View wireframe', description: 'Read the current canvas and saved wireframe data.', inputSchema: { type: 'object', properties: {}, additionalProperties: false }, annotations: { readOnlyHint: true }, execute: () => clone(doc) });
    register({ name: 'add_wireframe_element', title: 'Add element', description: 'Add an element to the canvas.', inputSchema: { type: 'object', properties: { type: { type: 'string', enum: Object.keys(ELEMENTS) }, text: { type: 'string' }, x: { type: 'number' }, y: { type: 'number' } }, required: ['type'], additionalProperties: false }, annotations: { readOnlyHint: false }, execute: input => { if (!input || !ELEMENTS[input.type]) throw Error('Invalid element type'); if (input.text !== undefined && typeof input.text !== 'string') throw Error('Invalid text'); for (const key of ['x', 'y']) if (input[key] !== undefined && !Number.isFinite(input[key])) throw Error('Invalid position'); const item = add(input.type, input.x, input.y); if (!item) throw Error('Create a wireframe first'); if (input.text !== undefined) { item.text = input.text.slice(0, 500); if (item.type === 'table') item.cells[0][0] = item.text; if (item.type === 'list') item.items[0] = item.text; renderItems(); renderInspector(); save(); } return clone(item); } });
  }
})();
