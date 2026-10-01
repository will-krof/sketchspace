const { app, BrowserWindow, dialog, ipcMain, Menu, net, protocol, session, shell, Tray } = require('electron');
const fs = require('node:fs');
const path = require('node:path');
const { pathToFileURL } = require('node:url');
const { CSP, resolveAssetPath } = require('./assets.cjs');
const { createStore } = require('./storage.cjs');

const ROOT = path.resolve(__dirname, '..', 'dist');
const APP_URL = 'sketchspace://app/';
if (process.platform !== 'win32') {
  console.error('Sketchspace supports Windows only.');
  app.exit(1);
  return;
}
app.setName('Sketchspace');
Menu.setApplicationMenu(null);

protocol.registerSchemesAsPrivileged([{ scheme: 'sketchspace', privileges: { standard: true, secure: true } }]);
app.setAppUserModelId('com.willkrof.sketchspace');
// The editor is a 2D DOM canvas; software compositing can reduce intermittent
// whole-window white flashes on affected Windows GPU/driver combinations.
app.disableHardwareAcceleration();

let window;
let tray;
let quitting = false;
let quitPending = false;
let finishQuitSave;
let autoUpdater;
let updaterState = { status: 'idle', version: app.getVersion() };

const hasSingleInstanceLock = app.requestSingleInstanceLock();
if (!hasSingleInstanceLock) app.quit();

function showWindow() {
  if (!app.isReady()) return;
  if (!window || window.isDestroyed()) { createWindow(); return; }
  if (window.isMinimized()) window.restore();
  window.show();
  window.focus();
}

async function flushBeforeQuit() {
  if (!window || window.isDestroyed() || window.webContents.isLoading()) return true;
  return new Promise(resolve => {
    const timeout = setTimeout(() => finishQuitSave?.(false), 10000);
    finishQuitSave = success => {
      clearTimeout(timeout);
      finishQuitSave = null;
      resolve(success);
    };
    window.webContents.send('app:flush-before-quit');
  });
}

async function quitApp() {
  if (quitting || quitPending) return;
  quitPending = true;
  try {
    const saved = await flushBeforeQuit();
    if (!saved) {
      showWindow();
      dialog.showErrorBox('Could not save wireframe', 'Sketchspace is still open. Try saving your wireframe before quitting.');
      return;
    }
    quitting = true;
    app.quit();
  } finally {
    quitPending = false;
  }
}

function createTray() {
  tray = new Tray(path.resolve(__dirname, '..', 'assets', 'icon.ico'));
  tray.setToolTip('Sketchspace');
  tray.setContextMenu(Menu.buildFromTemplate([
    { label: 'Open Sketchspace', click: showWindow },
    { type: 'separator' },
    { label: 'Quit Sketchspace', click: quitApp }
  ]));
  tray.on('click', showWindow);
  tray.on('double-click', showWindow);
}
function publishUpdate(state) {
  updaterState = { ...updaterState, ...state };
  if (window && !window.isDestroyed()) window.webContents.send('updates:state', updaterState);
}

async function checkForUpdates() {
  if (!app.isPackaged) return;
  publishUpdate({ status: 'checking', message: '' });
  try { await autoUpdater.checkForUpdates(); }
  catch (error) { publishUpdate({ status: 'idle', message: 'Could not check for updates.' }); console.warn('Update check failed:', error.message); }
}

function configureUpdates() {
  if (!app.isPackaged) return;
  try { ({ autoUpdater } = require('electron-updater')); }
  catch (error) { console.warn('Updater unavailable:', error.message); return; }
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
  void checkForUpdates();
}

function registerAssets() {
  protocol.handle('sketchspace', async request => {
    const asset = resolveAssetPath(request.url, request.method, ROOT);
    if (!asset) return new Response('Not found', { status: 404 });
    try {
      if (!(await fs.promises.stat(asset.file)).isFile()) return new Response('Not found', { status: 404 });
    } catch { return new Response('Not found', { status: 404 }); }
    const response = await net.fetch(pathToFileURL(asset.file).toString());
    return new Response(response.body, { status: response.status, headers: {
      'content-type': asset.mime,
      'content-security-policy': CSP,
      'x-content-type-options': 'nosniff',
      'referrer-policy': 'no-referrer'
    } });
  });
}

function createWindow() {
  const icon = path.resolve(__dirname, '..', 'assets', 'icon.png');
  window = new BrowserWindow({ width: 1520, height: 960, minWidth: 1050, minHeight: 680, show: false,
    title: 'Sketchspace', backgroundColor: '#eef1f3', icon, autoHideMenuBar: true,
    webPreferences: { preload: path.join(__dirname, 'preload.cjs'), sandbox: true, contextIsolation: true, nodeIntegration: false } });
  window.once('ready-to-show', () => window?.show());
  window.loadURL(APP_URL);
  window.on('close', event => {
    if (quitting) return;
    event.preventDefault();
    window.hide();
  });
  window.on('closed', () => { window = null; });
}

if (hasSingleInstanceLock) app.whenReady().then(() => {
  registerAssets();
  session.defaultSession.setPermissionRequestHandler((_contents, _permission, respond) => respond(false));
  session.defaultSession.setPermissionCheckHandler(() => false);
  app.on('web-contents-created', (_event, contents) => {
    contents.on('will-frame-navigate', (event, navigation) => {
      if (!navigation.isMainFrame || navigation.url !== APP_URL) event.preventDefault();
    });
    contents.setWindowOpenHandler(() => ({ action: 'deny' }));
    contents.on('will-attach-webview', event => event.preventDefault());
  });
  const store = createStore(app.getPath('userData'));
  const fromEditor = event => {
    if (!window || event.sender !== window.webContents || event.senderFrame !== window.webContents.mainFrame || event.senderFrame?.url !== APP_URL) {
      throw Error('Invalid request.');
    }
  };
  ipcMain.handle('wireframes:list', event => { fromEditor(event); return store.list(); });
  ipcMain.handle('wireframes:create', (event, document) => { fromEditor(event); return store.create(document); });
  ipcMain.handle('wireframes:update', (event, id, document) => { fromEditor(event); return store.update(id, document); });
  ipcMain.handle('wireframes:remove', (event, id) => { fromEditor(event); return store.remove(id); });
  ipcMain.handle('wireframes:show-in-folder', event => {
    fromEditor(event);
    const file = path.join(app.getPath('userData'), 'wireframes.json');
    if (!fs.existsSync(file)) throw Error('Local wireframe file not found.');
    shell.showItemInFolder(file);
  });
  ipcMain.on('app:flush-result', (event, success) => {
    if (event.sender === window?.webContents && event.senderFrame === window.webContents.mainFrame && event.senderFrame?.url === APP_URL) {
      finishQuitSave?.(success === true);
    }
  });
  ipcMain.handle('updates:state', event => { fromEditor(event); return updaterState; });
  ipcMain.handle('updates:action', async event => {
    fromEditor(event);
    if (updaterState.status === 'ready') {
      if (quitPending) return;
      quitPending = true;
      try {
        if (!(await flushBeforeQuit())) {
          showWindow();
          dialog.showErrorBox('Could not save wireframe', 'Sketchspace is still open. Try saving your wireframe before updating.');
          return;
        }
        quitting = true;
        try { autoUpdater.quitAndInstall(); }
        catch (error) {
          quitting = false;
          publishUpdate({ status: 'ready', message: 'Could not restart for update. Try again.' });
          throw error;
        }
      } finally {
        quitPending = false;
      }
      return;
    }
    if (updaterState.status !== 'available') return;
    publishUpdate({ status: 'downloading', percent: 0, message: '' });
    try { await autoUpdater.downloadUpdate(); }
    catch (error) { publishUpdate({ status: 'available', message: 'Download failed. Try again.' }); throw error; }
  });
  createTray();
  createWindow();
  if (app.isPackaged) setTimeout(configureUpdates, 4000);
});

app.on('second-instance', showWindow);
app.on('before-quit', event => {
  if (quitting) return;
  event.preventDefault();
  void quitApp();
});
app.on('window-all-closed', () => {});
