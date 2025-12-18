import { selectFolder, fileListContainer } from "./dom.js";
import { createFileRow } from "./elements.js";
import { displayFiles } from "./fileDisplay.js";
import { updateStats } from "./stats.js";
let musicLibrary = [];

export function selectFiles() {
    selectFolder.addEventListener('click', async () => {
        const files = await window.electronAPI.uploadFiles();
        console.log('files', files);
        displayFiles(files);
    });
}



