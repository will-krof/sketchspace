const { contextBridge, ipcRenderer } = require('electron');

ipcRenderer.on('app:flush-before-quit', async () => {
  let saved = false;
  try {
    saved = typeof window.sketchspaceFlushBeforeQuit === 'function' && await window.sketchspaceFlushBeforeQuit() === true;
  } catch { /* Keep the editor open when persistence fails. */ }
  ipcRenderer.send('app:flush-result', saved);
});

contextBridge.exposeInMainWorld('sketchspaceDesktop', {
  storage: {
    list: () => ipcRenderer.invoke('wireframes:list'),
    create: document => ipcRenderer.invoke('wireframes:create', document),
    update: (id, document) => ipcRenderer.invoke('wireframes:update', id, document),
    remove: id => ipcRenderer.invoke('wireframes:remove', id),
    showInFolder: () => ipcRenderer.invoke('wireframes:show-in-folder')
  },
  updates: {
    state: () => ipcRenderer.invoke('updates:state'),
    action: () => ipcRenderer.invoke('updates:action'),
    onChange: callback => {
      if (typeof callback !== 'function') return () => {};
      const listener = (_event, state) => callback(state);
      ipcRenderer.on('updates:state', listener);
      return () => ipcRenderer.removeListener('updates:state', listener);
    }
  }
});
