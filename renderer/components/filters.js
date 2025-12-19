//import { setCurrentFilter } from "./state.js";
import appState from "./state.js";
import { filterAll, filterAudio, filterVideo, filterFav } from "./dom.js";

function setFilter(filterType) {
  appState.setCurrentFilter(filterType);
  
  // Update UI
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.classList.remove('active');
  });
  document.querySelector(`[data-filter="${filterType}"]`)?.classList.add('active');
  
  console.log('🔎 Filtr zmieniony na:', filterType);
}

function initFilters() {
    filterAll.addEventListener('click', () => setFilter('all'));
    filterAudio.addEventListener('click', () => setFilter('audio'));
    filterVideo.addEventListener('click', () => setFilter('video'));
    filterFav.addEventListener('click', () => setFilter('favourites'));

    setFilter('all');
}

export {
    setFilter,
    initFilters
}
