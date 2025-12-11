const { ipcMain } = require('electron');
const db = require('./db.js');

function ipcHandlers(mainWindow) {
    ipcMain.handle('do-something', async (event, arg) => {
        console.log('Received:', arg);
        db.logIPCMessage('renderer->main', 'do-something', arg);
        return 'done';
    });

    // BrowserWindow (whole window)
    // webContents (actual web page)

    mainWindow.webContents.on('did-finish-load', () => {
        mainWindow.webContents.send('ping', "hello renderer 👋"); // main --> renderer (direction to from main to renderer)
        db.logIPCMessage('main->renderer', 'ping', "hello renderer 👋");
    })

    ipcMain.on('pong', (event, msg) => { // renderer --> main // ipcMain - only listens (direction from renderer to main)
        console.log("🟢 Renderer replied:", msg);
        db.logIPCMessage('renderer->main', 'pong', msg);
    });

    
}

module.exports = ipcHandlers;