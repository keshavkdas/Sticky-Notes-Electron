const { app, BrowserWindow, ipcMain, Menu, Tray, globalShortcut } = require('electron');
const path = require('path');
const fs = require('fs');
const Store = require('./notesStore');

const isMac = process.platform === 'darwin';
let tray = null;
const windows = new Map();

// Persist notes
const store = new Store({
  configName: 'notes',
  defaults: {
    notes: []
  }
});

function createNoteWindow(note) {
  const { x, y, width = 300, height = 220, opacity = 0.92, alwaysOnTop = true } = note;

  const win = new BrowserWindow({
    x, y, width, height,
    minWidth: 200,
    minHeight: 120,
    frame: false,
    transparent: true,
    resizable: true,
    alwaysOnTop,
    backgroundColor: '#00000000',
    show: false,
    hasShadow: true,
    roundedCorners: true,
    vibrancy: isMac ? 'under-window' : undefined,
    visualEffectState: isMac ? 'active' : undefined,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false,
      spellcheck: true
    }
  });

  try {
    if (process.platform === 'win32' && typeof win.setBackgroundMaterial === 'function') {
      win.setBackgroundMaterial('mica');
    }
  } catch (_) {}

  win.setOpacity(opacity);
  win.loadFile(path.join(__dirname, 'renderer', 'index.html'));

  win.webContents.once('did-finish-load', () => {
    win.webContents.send('note:init', note);
  });

  win.once('ready-to-show', () => win.showInactive());

  win.on('moved', () => updateBounds(note.id, win));
  win.on('resize', () => updateBounds(note.id, win));
  win.on('closed', () => {
    windows.delete(note.id);
  });

  windows.set(note.id, win);
  return win;
}

function updateBounds(id, win) {
  const [width, height] = win.getSize();
  const [x, y] = win.getPosition();
  const notes = store.get('notes');
  const i = notes.findIndex(n => n.id === id);
  if (i !== -1) {
    notes[i] = { ...notes[i], x, y, width, height };
    store.set('notes', notes);
  }
}

function newNote(partial = {}) {
  const note = {
    id: Date.now().toString(36) + Math.random().toString(36).slice(2, 7),
    content: '',
    opacity: 0.92,
    alwaysOnTop: true,
    width: 300,
    height: 220,
    ...partial
  };

  const notes = store.get('notes');
  notes.push(note);
  store.set('notes', notes);
  createNoteWindow(note);
}

function createTray() {
  let iconPath = app.isPackaged
    ? path.join(process.resourcesPath, 'tray.png') // from extraResources
    : path.join(__dirname, 'renderer', 'tray.png'); // dev mode

  if (!fs.existsSync(iconPath)) {
    console.warn("Tray icon missing, using default Electron icon");
    iconPath = path.join(process.resourcesPath, 'electron.ico'); // fallback
  }

  tray = new Tray(iconPath);

  const template = [
    { label: 'New Note (Ctrl/Cmd+Alt+N)', click: () => newNote() },
    { type: 'separator' },
    { label: 'Quit', role: 'quit' }
  ];
  tray.setToolTip('Sticky Notes');
  tray.setContextMenu(Menu.buildFromTemplate(template));
}

app.whenReady().then(() => {
  globalShortcut.register('CommandOrControl+Alt+N', () => newNote());

  createTray();

  const existing = store.get('notes');
  if (!existing || existing.length === 0) {
    newNote();
  } else {
    existing.forEach(n => createNoteWindow(n));
  }

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) newNote();
  });
});

app.on('window-all-closed', () => {
  if (!isMac) app.quit();
});

app.on('will-quit', () => {
  globalShortcut.unregisterAll();
});

// IPC
ipcMain.on('note:update', (e, { id, content }) => {
  const notes = store.get('notes');
  const i = notes.findIndex(n => n.id === id);
  if (i !== -1) {
    notes[i].content = content;
    store.set('notes', notes);
  }
});

ipcMain.on('note:set-opacity', (e, { id, opacity }) => {
  const win = windows.get(id);
  if (win) win.setOpacity(opacity);
  const notes = store.get('notes');
  const i = notes.findIndex(n => n.id === id);
  if (i !== -1) {
    notes[i].opacity = opacity;
    store.set('notes', notes);
  }
});

ipcMain.on('note:delete', (e, id) => {
  const win = windows.get(id);
  if (win) win.close();
  const notes = store.get('notes').filter(n => n.id !== id);
  store.set('notes', notes);
});

ipcMain.handle('note:get-all', () => store.get('notes'));