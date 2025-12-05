// main.js 
const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const ipcHandlers = require('./ipcHandlers');
let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1400,
        height: 900,
        minWidth: 1000,
        minHeight: 600,
        backgroundColor: '#0f1720',
        webPreferences: {
            preload: path.join(__dirname, '..', 'preload.js'),
            contextIsolation: true,
            nodeIntegration: false,
            enableRemoteModule: false
        },
        // autoHideMenuBar: true, // hide default menu
        // frame: false,
        // titleBarStyle: 'hidden'
    });
    mainWindow.loadFile(
        path.join(__dirname, '..', 'renderer', 'index.html') // goes one level up --> project-root/
    ); // załaduj index.html z katalogu Renderer

    if (process.env.NODE_ENV === 'development') { // open dev tools in development mode
        mainWindow.webContents.openDevTools();
    }

    mainWindow.on('closed', () => {
        mainWindow = null;
    });
}

// lifecycle

app.whenReady().then(() => {
    createWindow();

    // IPCs
    ipcHandlers(mainWindow);
});

app.on('before-quit', () => {
    console.log('Closing application...');
});

