/* Search */ 
import { searchInput } from "./dom.js";
import { setSearchTerm } from "./state.js";

// searchInput.addEventListener('input', (e) => {
//   currentSearchTerm = e.target.value.toLowerCase();
//   console.log('🔍 Szukaj:', currentSearchTerm);
//   // TODO FAZA 3: Filtrowanie wyników
// });

function handleSearch(searchValue) {
    const lowerCaseValue = searchValue.toLowerCase();
    setSearchTerm(lowerCaseValue);
    console.log(`Search term updated: ${lowerCaseValue}`);
}

function initSearch() {
    searchInput.addEventListener('input', (e) => {
        handleSearch(e.target.value);
    });
}

export {
    handleSearch,
    initSearch
}

// wyszukiwanie odbywa się w czasie rzeczywistym