// main.js 
const { app, BrowserWindow, ipcMain } = require('electron');
const db = require('./db.js');
const path = require('path');
const ipcHandlers = require('./ipcHandlers');
const ipcDBHandlers = require('./ipcDBHandlers');
const testIPC = require('./ipcTest.js');
let mainWindow;
let currentSessionId = null;
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
    db.initDatabase();
    currentSessionId = db.startSession();
    console.log('currentSessionId', currentSessionId);
    createWindow();

    // IPCs
    testIPC(mainWindow);
    ipcHandlers(mainWindow);
    ipcDBHandlers();
});

app.on('before-quit', () => {
    if(currentSessionId) {
        db.endSession(currentSessionId);
    }
    db.closeDatabase();
    console.log('Closing application...');
});

