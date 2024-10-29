// main.js
const { app, BrowserWindow } = require('electron');
const path = require('path');

function createWindow() {
  // Create a navigation window
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, './preload.js'),
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  // Load react app builded
  mainWindow.loadFile(
    process.env.ELECTRON_START_URL || `file://${path.join(__dirname, '/build/index.html')}`
  );

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
