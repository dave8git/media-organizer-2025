/* STATE */
class AppState {
    constructor() {
        this.reset();
    }

    /* Getters */
    getCurrentFilter() {
        return this.currentFilter;
    }

    getSearchTerm() {
        return this.currentSearchTerm;
    } 

    getAllFiles() {
        return this.allFiles;
    }

    getSelectedFolder() {
        this.selectedFolder;
    }

    /* Setters */
    setCurrentFilter(filterType) { 
        this.currentFilter = filterType;
    }

    setSearchTerm(term) {
        this.searchTerm = term;
    }

    setAllFiles(files) {
        this.allFiles = files;
    }

    setSelectedFolder(folderPath) {
        this.selectedFolder = folderPath;
    }

    /* Helpers */
    reset() {
        this.currentFilter = 'all';
        this.currentSearchTerm = '';
        this.allFiles = [];
        this.selectedFolder = null;
    }
}

const appState = new AppState();
export default appState;
export { AppState };
