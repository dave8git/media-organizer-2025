const { ipcMain } = require('electron');

function ipcHandlers(mainWindow) {
    ipcMain.handle('do-something', async (event, arg) => {
        console.log('Received:', arg);
        return 'done';
    });

    // BrowserWindow (whole window)
    // webContents (actual web page)

    mainWindow.webContents.on('did-finish-load', () => {
        mainWindow.webContents.send('ping', "hello renderer 👋"); // main --> renderer (direction to from main to renderer)
    })

    ipcMain.on('pong', (event, msg) => { // renderer --> main // ipcMain - only listens (direction from renderer to main)
        console.log("🟢 Renderer replied:", msg);
    });
}

module.exports = ipcHandlers;