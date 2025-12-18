const { ipcMain, dialog } = require('electron');
const db = require('./db.js'); 
const mm = require('music-metadata');
const fs = require('fs').promises; // async filesystem operations (here used: stat, readFile)

function ipcHandlers(mainWindow) {
    ipcMain.handle('do-something', async (event, arg) => {
        db.logIPCMessage('renderer->main', 'do-something', arg);
        return 'done';
    });

    ipcMain.handle('uploadFiles', async () => {
        const { filePaths } = await dialog.showOpenDialog(
            {
                properties: ['openFile', 'multiSelections'],
                filters: [
                    { name: 'Music', extensions: ['mp3'] },
                ]
            },
        );

        const metadata = await Promise.all(
            filePaths.map(file => mm.parseFile(file))
        );
        const filesData = await Promise.all(
            filePaths.map(async (file, index) => {
                const stats = await fs.stat(file);
                return {
                    file,
                    metadata: metadata[index],
                    size: stats.size,
                    sizeKB: (stats.size / 1024).toFixed(2),
                    sizeMB: (stats.size / (1024 * 1024)).toFixed(2)
                };
            })
        );
        return filesData;
    });
}

module.exports = ipcHandlers;