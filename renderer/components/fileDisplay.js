/* file Display */
import { fileListContainer } from './dom.js';
import { updateStats } from './stats.js';
import { setAllFiles } from './state.js';
import { createFileRow } from './elements.js';


export function displayFiles(files) {
    setAllFiles(files);

    fileListContainer.innerHTML = '';

    files.forEach(file => {
        const row = createFileRow(file);
        fileListContainer.appendChild(row);
    });
    const totalSize = files.reduce((sum, file) => sum + (file.size || 0), 0);

    updateStats({
        count: files.length,
        size: totalSize,
        duration: 0 
    });
};