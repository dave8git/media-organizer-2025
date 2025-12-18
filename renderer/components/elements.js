import { formatBytes } from "../utils/utils.js";

export function createFileRow(file, index) {
    console.log('createFileRow');
    const row = document.createElement('div');
    row.className = 'file-row';
    row.dataset.index = index;

    const colName = document.createElement('div');
    colName.className = 'col name';

    const img = document.createElement('img');
    img.className = 'thumb';
    img.style.display = 'none';

    const nameWrapper = document.createElement('div');
    const fileName = document.createElement('div');
    fileName.style.fontWeight = '500';
    fileName.textContent = file.metadata?.common?.title || file.name || 'Unknown';

    const fileSize = document.createElement('div');
    fileSize.style.fontSize = '12px';
    fileSize.style.color = 'var(--muted)';
    fileSize.textContent = formatBytes(file.size);

    nameWrapper.appendChild(fileName);
    nameWrapper.appendChild(fileSize);

    colName.appendChild(img);
    colName.appendChild(nameWrapper);

    const colMeta = document.createElement('div');
    colMeta.className = 'col meta';

    const metaText = document.createElement('span');
    metaText.style.color = 'var(--muted)';
    //metaText.textContent = 'Brak metadanych';
     if (file.metadata?.common) {
        const artist = file.metadata.common.artist || '';
        const album = file.metadata.common.album || '';
        metaText.textContent = [artist, album].filter(Boolean).join(' • ') || 'Brak metadanych';
    } else {
        metaText.textContent = 'Brak metadanych';
    }

    colMeta.appendChild(metaText);

    const colTags = document.createElement('div');
    colTags.className = 'col tags';

    const tag = document.createElement('span');
    tag.className = 'tag';
    tag.textContent = 'nowy';

    colTags.appendChild(tag);

    const colActions = document.createElement('div');
    colActions.className = 'col actions';

    const playBtn = document.createElement('button');
    playBtn.dataset.action = 'play';
    playBtn.title = 'Odtwórz';
    playBtn.textContent = '▶';

    const infoBtn = document.createElement('button');
    infoBtn.dataset.action = 'info';
    infoBtn.title = 'Szczegóły';
    infoBtn.textContent = 'ℹ';

    colActions.appendChild(playBtn);
    colActions.appendChild(infoBtn);

    row.appendChild(colName);
    row.appendChild(colMeta);
    row.appendChild(colTags);
    row.appendChild(colActions);
    return row;
}