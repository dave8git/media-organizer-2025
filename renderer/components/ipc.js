/* IPC communication */

function testIPC() {
    window.electronAPI.ping((data) => {
        console.log("📨 ping:", data);  
    });

    window.electronAPI.pong("pong from renderer 🏓"); // Now renderer will send pong
}

function initIPC() {
    testIPC();
}

export { initIPC, testIPC };