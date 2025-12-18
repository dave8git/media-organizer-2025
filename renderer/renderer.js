import { createFileRow } from './components/elements.js';
import { initFilters } from './components/filters.js';
import { testIPC } from './components/ipc.js';
import { initSearch } from './components/search.js';
import { updateStats } from './components/stats.js';
import { selectFiles } from './components/uploadFiles.js';
import { /*btnOpenFolder*/ btnRefresh, btnScan, inputFolder, fileListContainer } from './components/dom.js';
import { displayFiles } from './components/fileDisplay.js';

// Uruchom test przy starcie
testIPC();
initFilters();
initSearch();
initFilters();
selectFiles();
// // btnOpenFolder.addEventListener('click', async () => {
// //   try {
// //     console.log('🔍 Otwieranie dialogu wyboru folderu...');
// //     inputFolder.click();
// //   } catch (error) {
// //     console.error('❌ Błąd wyboru folderu:', error);
// //   }
// // });



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


