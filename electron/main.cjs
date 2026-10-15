const { app, BrowserWindow, globalShortcut } = require('electron');
const path = require('path');
const fs = require('fs');

function createWindow() {
  const win = new BrowserWindow({
    width: 1240,
    height: 840,
    minWidth: 960,
    minHeight: 640,
    title: 'Vapor Clicker - Android Edition',
    backgroundColor: '#0d041a',
    autoHideMenuBar: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      webSecurity: false,
    },
  });

  const indexPath = path.join(__dirname, '..', 'dist', 'index.html');
  if (fs.existsSync(indexPath)) {
    win.loadFile(indexPath);
  } else {
    win.loadURL('http://localhost:3000').catch((err) => {
      console.error('Failed to load dev URL:', err);
    });
  }

  // Open devtools in development if needed
  if (process.env.DEBUG === 'true') {
    win.webContents.openDevTools();
  }
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
