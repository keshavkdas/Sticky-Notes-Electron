const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('notesAPI', {
  onInit: (cb) => ipcRenderer.once('note:init', (_e, note) => cb(note)),
  update: (payload) => ipcRenderer.send('note:update', payload),
  setOpacity: (payload) => ipcRenderer.send('note:set-opacity', payload),
  delete: (id) => ipcRenderer.send('note:delete', id),
  getAll: () => ipcRenderer.invoke('note:get-all')
});
