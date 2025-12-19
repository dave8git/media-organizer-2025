import { fileListContainer } from './dom.js';
import statsController from './stats.js';
//import { setAllFiles } from './state.js';
import { createFileRow } from './elements.js';
import playerController from './playerController.js';
import appState from './state.js';

class FileDisplayController {
    constructor() {
        // left here for consistency with other classes
    };
    displayFiles(files) {
        appState.setAllFiles(files);
        fileListContainer.innerHTML = '';

        files.forEach((file, index) => {
            const row = createFileRow(file, index);
            fileListContainer.appendChild(row);
        });

        const totalSize = files.reduce((sum, file) => sum + (file.size || 0), 0);

        statsController.update({
            count: files.length,
            size: totalSize,
            duration: 0
        });
        console.log('files from fileDisplay', files);
        playerController.updatePlaylist(files);
    }
}

const fileDisplayController = new FileDisplayController();
export default fileDisplayController;
export { FileDisplayController }
