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
}

module.exports = ipcHandlers;