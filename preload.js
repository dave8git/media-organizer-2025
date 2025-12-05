const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    // Registers a callback that fires whenever
    // the main process sends a "ping" event.
    // (Main → Renderer)
    ping: (cb) => ipcRenderer.on('ping', (_, data) => cb(data)), // Whenever the event 'ping' happens in the future, run this function.
     // Sends a "pong" event to the main process.
    // (Renderer → Main)
    //  "cb" is a reference to the cunction created in renderer: (data) => { console.log(...)}, here preload only runs it
    // so as reference it's called here in preload but it will execute in renderer context
    // data is coming from main: mainWindow.webContents.send('ping', "hello renderer 👋");
    pong: (msg) => ipcRenderer.send('pong', msg),
}); 