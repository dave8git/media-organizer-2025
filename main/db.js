const Database = require('better-sqlite3');
const path = require('path');
const { app } = require('electron');

let db = null;

function initDatabase() {
    const userDataPath = app.getPath('userData');
    const dbPath = path.join(userDataPath, 'ipc-playground.db');
    console.log('Database path:', 'ipc-playground.db');
    db = new Database(dbPath);
    db.pragma('journal_mode = WAL'); // WAL mode for better performance 
    db.exec(`
        CREATE TABLE IF NOT EXISTS ipc_logs (
            id INTEGER PRMARY KEY AUTOINCREMENT,
            timestamp TEXT NOT NULL,
            direction TEXT NOT NULL,
            channel TEXT NOT NULL,
            message TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS sessions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            started_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            ended_at DATETIME,
            total_messages INTEGER DEFAULT 0
        );

        CREATE TABLE IF NOT EXISTS settings (
            key TEXT PRIMARY KEY,
            value TEXT NOT NULL,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );

        CREATE INDEX IF NOT EXISTS idx_ipc_logs_timestamp ON ipc_logs(timestamp);
        CREATE INDEX IF NOT EXISTS idx_ipc_logs_channel ON ipc_logs(channel);
    `);

    console.log('Database initialized succesfully');
    return db;
}

function getDatabase() {
    if (!db) {
        throw new Error('Database not initilized. Call initDatabase() first.');
    }
    return db;
}

// Log IPC message
function logIPCMessage(direction, channel, message) {
    const stmt = db.prepare(`
         INSERT INTO ipc_logs (timestamp, direction, channel, message)
            VALUES (?, ?, ?, ?)
        `);

    const timestamp = new Date().toISOString();
    const messageStr = typeof message === 'object' ? JSON.stringify(message) : String(message);
    stmt.run(timestamp, direction, channel, messageStr);
}

function getRecentLogs(limit = 50) {
    const stmt = db.prepare(`
                    SELECT * FROM ipc_logs
                    ORDER BY id DESC
                    LIMIT ?
                `);

    return stmt.all(limit);
}

// Get logs by channel
function getLogsByChannel(channel) {
    const stmt = db.prepare(`
            SELECT * FROM ipc_logs
            WHERE channel = ?
            ORDER BY id DESC
        `);

        return stmt.all(channel);
}

function getStatistics() {
    const totalMessages = db.prepare('SELECT COUNT(*) as count FROM ipc_logs').get();
    const byChannel = db.prepare(`
        SELECT channel, COUNT(*) as count
        FROM ipc_logs
        GROUP BY channel
        `).all();
    const byDirection = db.prepare(`
        SELECT direction, COUNT(*) as count
        FROM ipc_logs
        GROUP BY direction
        `).all();

    return {
        totalMessages: totalMessages.count,
        byChannel,
        byDirection
    };
}

// Clear old logs (keep last N days)
function clearOldLogs(daysToKeep = 30) {
    const stmt = db.prepare(`
        DELETE FROM ipc_logs
        WHERE created_at < datetime('now', '-' || ? || ' days')
    `);
    const result = stmt.run(daysToKeep);
    return result.changes;
}

// Settings management
function gettingSetting(key, defaultValue = null) {
    const stmt = db.prepare('SELECT value FROM settings WHERE key = ?');
    const result = stmt.get(key);
}
