/* Search */ 
import { searchInput } from "./dom.js";
import appState from './state.js';

class SearchController {
    constructor() {
        this.init();
    }

    init() {
        if (!searchInput) return;
        searchInput.addEventListener('input', (e) => {
            this.handleSearch(e.target.value);
        });
    }
    handleSearch(searchValue) {
        const value = searchValue.toLowerCase();
        appState.setSearchTerm(value);
        console.log(`🔍 Search term updated: ${value}`);
    }
}

const searchController = new SearchController();
export default searchController;
export { SearchController };

// wyszukiwanie odbywa się w czasie rzeczywistym