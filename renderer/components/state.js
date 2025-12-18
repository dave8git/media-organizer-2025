/* STATE */

const appState = {
    currentFilter: 'all',
    currentSearchTerm: '',
    allFiles: [],
    selectedFolder: null
}

export function getCurrentFilter() {
    return appState.currentFilter;
}

export function getSearchTerm() {
    return appState.currentSearchTerm;
}

export function getAllFiles() {
    return appState.allFiles;
}

export function getSelectedFolder() {
    return appState.selectedFolder;
}

export function setCurrentFilter(filterType) {
    appState.currentFilter = filterType;
}

export function setSearchTerm(term) {
    appState.currentSearchTerm = term;
}

export function setAllFiles(files) {
    appState.allFiles = files;
}

export function setSelectedFolder(folderPath) {
    appState.selectedFolder = folderPath;
}

export function resetState() {
    appState.currentFilter = 'all';
    appState.currentSearchTerm = '';
    appState.allFiles = [];
    appState.selectedFolder = null;
}