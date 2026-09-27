const { contextBridge, ipcRenderer } = require('electron');

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
