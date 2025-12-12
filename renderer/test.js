// Get DOM elements
const testPingBtn = document.getElementById('test-ping');
const testDbBtn = document.getElementById('test-db');
const loadStatsBtn = document.getElementById('load-stats');
const clearLogsBtn = document.getElementById('clear-logs');
const loadLogsBtn = document.getElementById('load-logs');
const channelFilter = document.getElementById('channel-filter');

const testOutput = document.getElementById('test-output');
const statsContainer = document.getElementById('stats-container');
const logsOutput = document.getElementById('logs-output');

// ===========================================
// UTILITY FUNCTIONS
// ===========================================

function log(message, type = 'info') {
    const timestamp = new Date().toLocaleTimeString();
    const color = type === 'success' ? 'success' : type === 'error' ? 'error' : 'info';
    const prefix = type === 'success' ? '✅' : type === 'error' ? '❌' : 'ℹ️';
    
    testOutput.innerHTML += `<span class="${color}">[${timestamp}] ${prefix} ${message}</span>\n`;
    testOutput.scrollTop = testOutput.scrollHeight;
}

function clearLog() {
    testOutput.innerHTML = '';
}

// ===========================================
// TEST FUNCTIONS
// ===========================================

async function testPing() {
    clearLog();
    log('Sending ping to main process...', 'info');
    
    try {
        const response = await window.electronAPI.test.ping({
            text: 'Hello from renderer!',
            timestamp: new Date().toISOString()
        });
        
        log(`Received response: ${JSON.stringify(response, null, 2)}`, 'success');
    } catch (error) {
        log(`Error: ${error.message}`, 'error');
    }
}

async function testDatabase() {
    clearLog();
    log('Testing database operations...', 'info');
    
    try {
        // Test 1: Get statistics
        log('1. Getting statistics...', 'info');
        const stats = await window.electronAPI.db.getStatistics();
        log(`Statistics: ${JSON.stringify(stats, null, 2)}`, 'success');
        
        // Test 2: Get recent logs
        log('2. Getting recent logs...', 'info');
        const logs = await window.electronAPI.db.getRecentLogs(5);
        log(`Found ${logs.length} recent logs`, 'success');
        
        // Test 3: Test settings
        log('3. Testing settings...', 'info');
        await window.electronAPI.db.setSetting('test_key', 'test_value');
        const value = await window.electronAPI.db.getSetting('test_key');
        log(`Setting test: ${value === 'test_value' ? 'PASSED' : 'FAILED'}`, 
            value === 'test_value' ? 'success' : 'error');
        
        log('All database tests completed!', 'success');
    } catch (error) {
        log(`Database test error: ${error.message}`, 'error');
    }
}

async function loadStatistics() {
    try {
        const stats = await window.electronAPI.db.getStatistics();
        
        statsContainer.innerHTML = `
            <div class="stat-card">
                <div class="stat-value">${stats.totalMessages}</div>
                <div class="stat-label">Total Messages</div>
            </div>
            <div class="stat-card">
                <div class="stat-value">${stats.byChannel.length}</div>
                <div class="stat-label">Unique Channels</div>
            </div>
            <div class="stat-card">
                <div class="stat-value">${stats.byDirection.length}</div>
                <div class="stat-label">Directions</div>
            </div>
        `;
        
        // Add channel breakdown
        if (stats.byChannel.length > 0) {
            const channelBreakdown = stats.byChannel
                .map(c => `<div class="stat-card"><div class="stat-value">${c.count}</div><div class="stat-label">${c.channel}</div></div>`)
                .join('');
            statsContainer.innerHTML += channelBreakdown;
        }
        
        log('Statistics loaded successfully', 'success');
    } catch (error) {
        log(`Error loading statistics: ${error.message}`, 'error');
    }
}

async function clearOldLogs() {
    try {
        const confirmed = confirm('Clear logs older than 30 days?');
        if (!confirmed) return;
        
        const deleted = await window.electronAPI.db.clearOldLogs(30);
        alert(`Deleted ${deleted} old log entries`);
        log(`Cleared ${deleted} old logs`, 'success');
        
        // Reload stats and logs
        await loadStatistics();
        await loadLogs();
    } catch (error) {
        log(`Error clearing logs: ${error.message}`, 'error');
    }
}

async function loadLogs() {
    try {
        const channel = channelFilter.value;
        let logs;
        
        if (channel) {
            logs = await window.electronAPI.db.getLogsByChannel(channel);
        } else {
            logs = await window.electronAPI.db.getRecentLogs(50);
        }
        
        if (logs.length === 0) {
            logsOutput.innerHTML = 'No logs found';
            return;
        }
        
        logsOutput.innerHTML = logs.map(log => {
            const time = new Date(log.created_at).toLocaleString();
            return `[${log.id}] ${time}
Direction: ${log.direction}
Channel: ${log.channel}
Message: ${log.message}
${'─'.repeat(60)}`;
        }).join('\n');
        
    } catch (error) {
        logsOutput.innerHTML = `Error loading logs: ${error.message}`;
    }
}

// ===========================================
// EVENT LISTENERS
// ===========================================

testPingBtn.addEventListener('click', testPing);
testDbBtn.addEventListener('click', testDatabase);
loadStatsBtn.addEventListener('click', loadStatistics);
clearLogsBtn.addEventListener('click', clearOldLogs);
loadLogsBtn.addEventListener('click', loadLogs);
channelFilter.addEventListener('change', loadLogs);

// Listen for pings from main
window.electronAPI.test.onMainPing((data) => {
    log(`📨 Received ping from main: ${data.message}`, 'info');
});

// ===========================================
// AUTO-LOAD ON STARTUP
// ===========================================

window.addEventListener('DOMContentLoaded', () => {
    log('Application started! Testing database connection...', 'info');
    setTimeout(() => {
        testDatabase();
        loadStatistics();
        loadLogs();
    }, 500);
});