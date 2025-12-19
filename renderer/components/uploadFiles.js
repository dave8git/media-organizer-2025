import { selectFolder, fileListContainer } from "./dom.js";
import { createFileRow } from "./elements.js";
//import { FileDisplayController } from "./fileDisplay.js";
//import { displayFiles } from "./fileDisplay.js";
import appState from "./state.js";
//import { fileListContainer } from "./fileDisplay.js";
import fileDisplayController from "./fileDisplay.js";

class FilePickerController {
    constructor() {
        this.init();
    }

    init() {
        if (!selectFolder) return;
        selectFolder.addEventListener('click', () => {
            this.handleSelectFiles();
        });
    }

    async handleSelectFiles() {
        try {
            const files = await window.electronAPI.uploadFiles();
            if (!files || files.length === 0) return;
            console.log('files', files);
            appState.setAllFiles(files);
            fileDisplayController.displayFiles(files);
        } catch (err) {
            console.error('File selection failed:', err);
        }
    }
}

const filePickerController = new FilePickerController();
export default filePickerController;
export { FilePickerController };
