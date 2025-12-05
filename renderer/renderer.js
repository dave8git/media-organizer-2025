// renderer.js - FAZA 1: Podstawy komunikacji IPC

// ===========================================
// DOM REFERENCES
// ===========================================

// Sidebar
const btnOpenFolder = document.getElementById('btn-open-folder');
const inputFolder = document.getElementById('input-folder');

// Filters
const filterAll = document.getElementById('filter-all');
const filterAudio = document.getElementById('filter-audio');
const filterVideo = document.getElementById('filter-video');
const filterFav = document.getElementById('filter-fav'); // POPRAWKA: było 'fitler-fav'

// Top actions
const btnScan = document.getElementById('btn-scan');
const btnRefresh = document.getElementById('btn-refresh');

// Search
const searchInput = document.getElementById('search-input');

// File list container
const fileListContainer = document.getElementById('file-list');

// Stats
const statFiles = document.getElementById('stat-files');
const statDuration = document.getElementById('stat-duration');
const statSize = document.getElementById('stat-size');

// ===========================================
// STATE
// ===========================================

let currentFilter = 'all';
let currentSearchTerm = '';
let allFiles = [];
let selectedFolder = null;

// ===========================================
// INICJALIZACJA - Test IPC
// ===========================================

/**
 * Testuje połączenie z main process
 */

async function testIPC() {
  try {
    console.log(window.electronAPI);
    const response = await window.electronAPI.ping();
    console.log('✅ IPC działa! Odpowiedź:', response);
    return true;
  } catch (error) {
    console.error('❌ IPC nie działa:', error);
    return false;
  }
}

// Uruchom test przy starcie
testIPC();

// ===========================================
// FOLDER SELECTION
// ===========================================

/**
 * Otwiera dialog wyboru folderu (poprzez IPC)
 * UWAGA: To będzie działać dopiero w FAZIE 2, 
 * kiedy dodamy handler w main.js
 */
btnOpenFolder.addEventListener('click', async () => {
  try {
    console.log('🔍 Otwieranie dialogu wyboru folderu...');
    
    // TODO FAZA 2: Odkomentuj dopiero po dodanieu handlera
    // const folderPath = await window.api.openFolderDialog();
    // if (folderPath) {
    //   selectedFolder = folderPath;
    //   console.log('✅ Wybrany folder:', folderPath);
    //   // Automatycznie zeskanuj
    //   await scanFolder(folderPath);
    // }
    
    // TYMCZASOWO: użyj input[webkitdirectory] jako fallback
    inputFolder.click();
    
  } catch (error) {
    console.error('❌ Błąd wyboru folderu:', error);
  }
});

/**
 * Fallback: lokalny wybór plików przez input
 * To działa bez backendu - tylko dla development
 */
inputFolder.addEventListener('change', (event) => {
  const files = Array.from(event.target.files);
  console.log('📁 Wybrane pliki (fallback):', files.length);
  
  // Wyświetl jako placeholder
  displayFilesPlaceholder(files);
});

/**
 * Wyświetla pliki w prostej formie (bez metadanych)
 * Tylko placeholder na czas development FAZY 1
 */
function displayFilesPlaceholder(files) {
  fileListContainer.innerHTML = '';
  
  files.forEach(file => {
    const row = document.createElement('div');
    row.className = 'file-row';
    
    row.innerHTML = `
      <div class="col name">
        <img class="thumb" src="" alt="" style="display:none" />
        <div>
          <div style="font-weight: 500">${file.name}</div>
          <div style="font-size: 12px; color: var(--muted)">${formatBytes(file.size)}</div>
        </div>
      </div>
      <div class="col meta">
        <span style="color: var(--muted)">Brak metadanych</span>
      </div>
      <div class="col tags">
        <span class="tag">nowy</span>
      </div>
      <div class="col actions">
        <button title="Odtwórz">▶</button>
        <button title="Szczegóły">ℹ</button>
      </div>
    `;
    
    fileListContainer.appendChild(row);
  });
  
  // Aktualizuj statystyki
  updateStats({
    count: files.length,
    size: files.reduce((sum, f) => sum + f.size, 0),
    duration: 0
  });
}

// ===========================================
// SCANNING (FAZA 2)
// ===========================================

/**
 * Skanuje wybrany folder
 * TODO FAZA 2: Implementacja
 */
async function scanFolder(folderPath) {
  console.log('🔄 Skanowanie folderu:', folderPath);
  // TODO FAZA 2
}

btnScan.addEventListener('click', async () => {
  if (!selectedFolder) {
    console.warn('⚠️ Nie wybrano folderu');
    return;
  }
  await scanFolder(selectedFolder);
});

// ===========================================
// FILTERS
// ===========================================

/**
 * Zmienia aktywny filtr
 */
function setFilter(filterType) {
  currentFilter = filterType;
  
  // Update UI
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.classList.remove('active');
  });
  document.querySelector(`[data-filter="${filterType}"]`)?.classList.add('active');
  
  // TODO FAZA 3: Filtrowanie rzeczywistych danych
  console.log('🔎 Filtr zmieniony na:', filterType);
}

filterAll.addEventListener('click', () => setFilter('all'));
filterAudio.addEventListener('click', () => setFilter('audio'));
filterVideo.addEventListener('click', () => setFilter('video'));
filterFav.addEventListener('click', () => setFilter('favourites'));

// Ustaw domyślny filtr
setFilter('all');

// ===========================================
// SEARCH
// ===========================================

/**
 * Wyszukiwanie w czasie rzeczywistym
 */
searchInput.addEventListener('input', (e) => {
  currentSearchTerm = e.target.value.toLowerCase();
  console.log('🔍 Szukaj:', currentSearchTerm);
  // TODO FAZA 3: Filtrowanie wyników
});

// ===========================================
// REFRESH
// ===========================================

btnRefresh.addEventListener('click', () => {
  console.log('🔄 Odświeżanie listy...');
  // TODO FAZA 3: Ponowne pobranie z bazy
});

// ===========================================
// STATS UPDATE
// ===========================================

/**
 * Aktualizuje statystyki w górnej części
 */
function updateStats(stats) {
  statFiles.textContent = stats.count || 0;
  statSize.textContent = formatBytes(stats.size || 0);
  statDuration.textContent = formatDuration(stats.duration || 0);
}

// ===========================================
// UTILS
// ===========================================

/**
 * Formatuje bajty na czytelną formę
 */
function formatBytes(bytes) {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

/**
 * Formatuje sekundy na MM:SS
 */
function formatDuration(seconds) {
  if (!seconds) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

