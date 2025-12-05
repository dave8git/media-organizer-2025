const { ipcMain } = require('electron');

function ipcHandlers() {
    ipcMain.handle('do-something', async (event, arg) => {
        console.log('Received:', arg);
        return 'done';
    });

    ipcMain.handle('ping', async (event, arg) => {
        console.log('Ping received', arg);
        //event.reply('pong', 'pong!');
        return 'pong';
    });
}

module.exports = ipcHandlers;