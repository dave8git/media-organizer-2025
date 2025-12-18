import playerService from "../services/playerService.js";
import { formatDuration } from "../utils/utils.js";

class PlayerController {
    constructor() {
        console.log('constructor in PlayerController works!');
        this.elements = {
            playBtn: document.getElementById('player-play'),
            prevBtn: document.getElementById('player-prev'),
            nextBtn: document.getElementById('player-next'),
            progressBar: document.getElementById('player-progress'),
            currentTime: document.getElementById('time-current'),
            totalTime: document.getElementById('time-total'),
            // Player info
            title: document.getElementById('player-title'),
            subtitle: document.getElementById('player-subtitle'),
            cover: document.getElementById('player-cover'),
            // Additional controls
            loopBtn: document.getElementById('btn-toggle-loop'),
            shuffleBtn: document.getElementById('btn-toggle-shuffle'),
            // File list for delegated events
            fileList: document.getElementById('file-list')
        };
        this.unsubscribers = [];
        this.init();
    }
    init() {
        this.setupEventListeners();
        this.subscribeToPlayerEvents();
    }
    setupEventListeners() {
        this.elements.playBtn?.addEventListener('click', () => playerService.togglePlayPause());
        this.elements.prevBtn?.addEventListener('click', () => playerService.previous());
        this.elements.nextBtn?.addEventListener('click', () => playerService.next());
        this.elements.progressBar?.addEventListener('input', (e) => {
            const time = (e.target.value / 100) * playerService.getState().duration;
            playerService.seek(time);
        });
        this.elements.loopBtn?.addEventListener('click', () => {
            playerService.toggleLoop();
        });
        this.elements.shuffleBtn?.addEventListener('click', () => playerService.toggleShuffle());
        this.elements.fileList?.addEventListener('click', (e) => {
            const playBtn = e.target.closest('[data-action="play"]');
            if(playBtn) {
                const fileRow = playBtn.closest('.file-row');
                const fileIndex = parseInt(fileRow.dataset.index);
                this.handlePlayClick(fileIndex);
            }
        });
    };
    subscribeToPlayerEvents() { // subscriber - pattern called observable
        const unsubStateChange = playerService.on('stateChange', (state) => this.updateUI(state));
        const unsubTrackLoaded = playerService.on('trackLoaded', (track) => this.updateTrackInfo(track));
        const unsubError = playerService.on('error', (error) => this.handleError(error));
        this.unsubscribers.push(unsubStateChange, unsubTrackLoaded, unsubError);
    }
    updateUI(state) {
        // Update play/pause button
        if(this.elements.playBtn) {
            this.elements.playBtn.textContent = state.isPlaying ? '⏸' : '▶';
            this.elements.playBtn.title = state.isPlaying ? 'Pause' : 'Play';
        }
        // Update progress bar
        if (this.elements.progressBar && state.duration > 0) {
            const progress = (state.currentTime /state.duration) * 100;
            this.elements.progressBar.value = progress;
        }
        // Update time displays
        if (this.elements.totalTime) {
            this.elements.currentTime.textContent = formatDuration(state.currentTime);
        }
        if (this.elements.totalTime) {
            this.elements.totalTime.textContent = formatDuration(state.duration);
        }
        // Update loop button state
        if (this.elements.loopBtn) {
            this.elements.loopBtn.classList.toggle('active', state.isLooping);
        }
        // Update shuffle button state
        if (this.elements.shuffleBtn) {
            this.elements.shuffleBtn.classList.toggle('active', state.isShuffling);
        }
        // Update file list playing state
        this.updateFileListPlayingState(state.currentIndex);
    }
    updateTrackInfo(track) {
        if(!track) return;
        // Update title and subtitle
        if (this.elements.title) {
            this.elements.title.textContent = track.metadata?.common?.title || track.name || '-';
        }
        if (this.elements.subtitle) {
            this.elements.subtitle.textContent = track.metadata?.common?.artist || '-';
        }
        // Update cover (if available)
        if (this.elements.cover && track.metadata?.common?.picture?.[0]) {
            const picture = track.metadata.common.picture[0];
            const blob = new Blob([picture.data], { type: picture.format });
            const url = URL.createObjectURL(blob);
            this.elements.cover.src = url;
        } else if (this.elements.cover) {
            this.elements.cover.src = ''; // tu wstawić defaultowy placeholder
        }
    }

    updateFileListPlayingState(currentIndex) {
        // Remove all playing states
        document.querySelectorAll('.file-row.playing').forEach(row => {
            row.classList.remove('playing');
            const playBtn = row.querySelector('[data-action="play"]');
            if (playBtn) {
                playBtn.textContent = '▶';
                playBtn.title = 'Odtwórz';
            }
        });
        if (currentIndex >= 0) {
            const currentRow = document.querySelector(`.file-row[data-index="${currentIndex}"]`);
            if (currentRow) {
                currentRow.classList.add('playing');
                const playBtn = currentRow.querySelector('[data-action="play"]');
                if (playBtn) {
                    const isPlaying = playerService.getState().isPlaying;
                    playBtn.textContent = isPlaying ? '⏸' : '▶';
                    playBtn.title = isPlaying ? 'Pause' : 'Odtwórz';
                }
            }
        }
    }
    handlePlayClick(fileIndex) {
        const state = playerService.getState();
        // If clicking on currently playing track, toggle play/pause
        if (state.currentIndex === fileIndex) {
            playerService.togglePlayPause();
        } else {
            // Otherwise, play the clicked track
            playerService.playTrackAtIndex(fileIndex);
        }
    }
    handleError(error) {
        console.error('Player error:', error);
    }
    // update playlist when files change
    updatePlaylist(files) {
        playerService.setPlaylist(files);j
    }
    
    destroy() {
        this.unsubscribers.forEach(unsub => unsub());
        this.unsubscribers = [];
    }
}

const playerController = new PlayerController(); // <-- Singleton
export default playerController;
export { PlayerController };