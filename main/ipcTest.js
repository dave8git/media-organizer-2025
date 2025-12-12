const { ipcMain } = require('electron');
const db = require('./db.js');

function testIPC(mainWindow) { // INICJALIZACJA - Test IPC /** Testuje połączenie z main process
     mainWindow.webContents.on('did-finish-load', () => {
        mainWindow.webContents.send('ping', "hello renderer 👋"); // main --> renderer (direction to from main to renderer)
        db.logIPCMessage('main->renderer', 'ping', "hello renderer 👋");
    })

    ipcMain.on('pong', (event, msg) => { // renderer --> main // ipcMain - only listens (direction from renderer to main)
        console.log("🟢 Renderer replied:", msg);
        db.logIPCMessage('renderer->main', 'pong', msg);
    });
}

module.exports = testIPC;