const { app, BrowserWindow, ipcMain, net, protocol, session } = require('electron');
const { autoUpdater } = require('electron-updater');
const fs = require('node:fs');
const path = require('node:path');
const { pathToFileURL } = require('node:url');
const { createStore } = require('./storage.cjs');

const ROOT = path.resolve(__dirname, '..', 'dist');
const APP_URL = 'sketchspace://app/';
const CSP = "default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data:; connect-src 'none'; font-src 'self'; object-src 'none'; base-uri 'none'; form-action 'none'; frame-ancestors 'none'";
const MIME = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.svg': 'image/svg+xml', '.txt': 'text/plain; charset=utf-8' };

protocol.registerSchemesAsPrivileged([{ scheme: 'sketchspace', privileges: { standard: true, secure: true, supportFetchAPI: true } }]);
app.setAppUserModelId('com.willkrof.sketchspace');

let window;
let updaterState = { status: 'idle', version: app.getVersion() };
let checkRunning = false;

function publishUpdate(state) {
  updaterState = { ...updaterState, ...state };
  if (window && !window.isDestroyed()) window.webContents.send('updates:state', updaterState);
}

async function checkForUpdates() {
  if (!app.isPackaged || checkRunning || ['downloading', 'ready'].includes(updaterState.status)) return;
  checkRunning = true;
  publishUpdate({ status: 'checking', message: '' });
  try { await autoUpdater.checkForUpdates(); }
  catch (error) { publishUpdate({ status: 'idle', message: 'Could not check for updates.' }); console.warn('Update check failed:', error.message); }
  finally { checkRunning = false; }
}

function configureUpdates() {
  if (!app.isPackaged) return;
  autoUpdater.autoDownload = false;
  autoUpdater.autoInstallOnAppQuit = false;
  autoUpdater.on('update-available', info => publishUpdate({ status: 'available', version: info.version, percent: 0 }));
  autoUpdater.on('update-not-available', () => publishUpdate({ status: 'idle', version: app.getVersion(), percent: 0 }));
  autoUpdater.on('download-progress', info => publishUpdate({ status: 'downloading', percent: Math.floor(info.percent) }));
  autoUpdater.on('update-downloaded', info => publishUpdate({ status: 'ready', version: info.version, percent: 100 }));
  autoUpdater.on('error', error => {
    const retry = ['available', 'downloading'].includes(updaterState.status);
    publishUpdate({ status: retry ? 'available' : 'idle', message: 'Update unavailable. Try again later.' });
    console.warn('Updater error:', error.message);
  });
  setTimeout(() => void checkForUpdates(), 4000);
  setInterval(() => void checkForUpdates(), 30 * 60 * 1000);
}

function registerAssets() {
  protocol.handle('sketchspace', async request => {
    let url;
    try { url = new URL(request.url); } catch { return new Response('Bad request', { status: 400 }); }
    if (url.host !== 'app' || request.method !== 'GET') return new Response('Not found', { status: 404 });
    let pathname;
    try { pathname = decodeURIComponent(url.pathname === '/' ? '/index.html' : url.pathname); }
    catch { return new Response('Bad request', { status: 400 }); }
    const file = path.resolve(ROOT, `.${pathname}`);
    const relative = path.relative(ROOT, file);
    if (!relative || relative.startsWith('..') || path.isAbsolute(relative) || !MIME[path.extname(file)] || !fs.existsSync(file) || !fs.statSync(file).isFile()) {
      return new Response('Not found', { status: 404 });
    }
    const response = await net.fetch(pathToFileURL(file).toString());
    return new Response(response.body, { status: response.status, headers: {
      'content-type': MIME[path.extname(file)],
      'content-security-policy': CSP,
      'x-content-type-options': 'nosniff'
    } });
  });
}

function createWindows() {
  const icon = path.resolve(__dirname, '..', 'assets', 'icon.png');
  window = new BrowserWindow({ width: 1520, height: 960, minWidth: 1050, minHeight: 680, show: false,
    title: 'Sketchspace', backgroundColor: '#17212b', icon, autoHideMenuBar: true,
    webPreferences: { preload: path.join(__dirname, 'preload.cjs'), sandbox: true, contextIsolation: true, nodeIntegration: false } });
  window.once('ready-to-show', () => window?.show());
  window.loadURL(APP_URL);
  window.on('closed', () => { window = null; });
}

app.whenReady().then(() => {
  registerAssets();
  session.defaultSession.setPermissionRequestHandler((_contents, _permission, respond) => respond(false));
  app.on('web-contents-created', (_event, contents) => {
    contents.on('will-navigate', (event, destination) => { if (!destination.startsWith(APP_URL)) event.preventDefault(); });
    contents.setWindowOpenHandler(() => ({ action: 'deny' }));
    contents.on('will-attach-webview', event => event.preventDefault());
  });
  const store = createStore(app.getPath('userData'));
  const fromEditor = event => { if (!window || event.sender !== window.webContents || !event.sender.getURL().startsWith(APP_URL)) throw Error('Invalid request.'); };
  ipcMain.handle('wireframes:list', event => { fromEditor(event); return store.list(); });
  ipcMain.handle('wireframes:create', (event, document) => { fromEditor(event); return store.create(document); });
  ipcMain.handle('wireframes:update', (event, id, document) => { fromEditor(event); return store.update(id, document); });
  ipcMain.handle('wireframes:remove', (event, id) => { fromEditor(event); return store.remove(id); });
  ipcMain.handle('updates:state', event => { fromEditor(event); return updaterState; });
  ipcMain.handle('updates:action', async event => {
    fromEditor(event);
    if (updaterState.status === 'ready') { autoUpdater.quitAndInstall(); return; }
    if (updaterState.status !== 'available') return;
    publishUpdate({ status: 'downloading', percent: 0, message: '' });
    try { await autoUpdater.downloadUpdate(); }
    catch (error) { publishUpdate({ status: 'available', message: 'Download failed. Try again.' }); throw error; }
  });
  createWindows();
  configureUpdates();
  app.on('activate', () => { if (BrowserWindow.getAllWindows().length === 0) createWindows(); });
});

app.on('window-all-closed', () => app.quit());
