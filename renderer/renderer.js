import { createFileRow } from './components/elements.js';
import { initFilters } from './components/filters.js';
import { testIPC } from './components/ipc.js';
import { initSearch } from './components/search.js';
import { updateStats } from './components/stats.js';

import { btnOpenFolder, btnRefresh, btnScan, inputFolder, fileListContainer } from './components/dom.js';

// Uruchom test przy starcie
testIPC();
initFilters();
initSearch();

btnOpenFolder.addEventListener('click', async () => {
  try {
    console.log('🔍 Otwieranie dialogu wyboru folderu...');
    inputFolder.click();
  } catch (error) {
    console.error('❌ Błąd wyboru folderu:', error);
  }
});

inputFolder.addEventListener('change', (event) => {
  const files = Array.from(event.target.files);
  console.log('📁 Wybrane pliki (fallback):', files.length);
  displayFilesPlaceholder(files);
});

function displayFilesPlaceholder(files) {
  fileListContainer.innerHTML = '';
  
  files.forEach(file => {
    const row = createFileRow(file);
    fileListContainer.appendChild(row);
  });
  
  updateStats({
    count: files.length,
    size: files.reduce((sum, f) => sum + f.size, 0),
    duration: 0
  });
}

async function scanFolder(folderPath) {
  console.log('🔄 Skanowanie folderu:', folderPath);
}

btnScan.addEventListener('click', async () => {
  if (!selectedFolder) {
    console.warn('⚠️ Nie wybrano folderu');
    return;
  }
  await scanFolder(selectedFolder);
});

btnRefresh.addEventListener('click', () => {
  console.log('🔄 Odświeżanie listy...');
});


