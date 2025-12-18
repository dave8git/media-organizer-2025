const { ipcMain } = require('electron');
const db = require('./db.js');

function ipcDBHandlers() {
    ipcMain.handle('get-recent-logs', async (event, limit) => {
        try {
            const result = db.getRecentLogs(limit);
            return result;
        } catch (err) {
            console.log('err', err);
            return [];
        }
    });

    ipcMain.handle('get-statistics', async (event) => {
        try {
            const result = db.getStatistics();
            return result;
        } catch (err) {
            console.log('get-statistics error', err);
            return {
                totalMessages: 0,
                byChannel: [],
                byDirection: []
            }
        }
    });

    ipcMain.handle('clear-old-logs', async (event, days) => {
        try {
            const result = db.clearOldLogs(days);
            return { success: true, deletedCount: result }
        } catch (err) {
            console.log('clear-old-logs error: ', err);
            return { success: false, error: err.message }
        }
    });

    ipcMain.handle('get-setting', async (event, key) => {
        try {
            const result = db.getSetting(key);
            return result;
        } catch (err) {
            console.log('get-setting error: ', err);
            return null;
        }
    });

    ipcMain.handle('set-setting', async (event, data) => {
        try {
            db.setSetting(data.key, data.value);
            return { success: true }
        } catch (err) {
            console.log('set-setting error: ', err);
            return { success: false, error: err.message };
        }
    });
}

module.exports = ipcDBHandlers;