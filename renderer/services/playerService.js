class PlayerService {
    constructor() {
        this.audio = new Audio();
        this.state = {
            currentTrack: null,
            isPlaying: false,
            currentTime: 0,
            duration: 0,
            volume: 1,
            isMuted: false,
            isLooping: false,
            isShuffling: false,
            playList: [],
            currentIndex: -1
        };
        this.listeners = new Map();
        this.setupAudioListeners();
    }

    setupAudioListeners() {
        this.audio.addEventListener('loadedmetadata', () => {
            this.updateState({ duration: this.audio.duration });
        });
        this.audio.addEventListener('timeupdate', () => {
            this.updateState({ currentTime: this.audio.currentTime });
        });
        this.audio.addEventListener('ended', () => {
            this.handleTrackEnd();
        });
        this.audio.addEventListener('play', () => {
            this.updateState({ isPlaying: true });
        });
        this.audio.addEventListener('pause', () => {
            this.updateState({ isPlaying: false });
        });
        this.audio.addEventListener('error', (e) => {
            console.error('Audio error:', e);
            this.emit('error', e);
        });
    }
    on(event, callback) {
        if (!this.listeners.has(event)) {
            this.listeners.set(event, []);
        }
        this.listeners.get(event).push(callback);

        return () => {
            const callbacks = this.listeners.get(event);
            const index = callbacks.indexOf(callback);
            if (index > -1) callbacks.splice(index, 1);
        };
    }
    emit(event, data) {
        if (this.listeners.has(event)) {
            this.listeners.get(event).forEach(callback => callback(data));
        }
    }
    updateState(updates) {
        this.state = { ...this.state, ...updates };
        this.emit('stateChange', this.state);
    }
    async loadTrack(track, autoPlay = false) {
        try {
            this.audio.src = track.file;
            this.updateState({
                currentTrack: track,
                currentTime: 0
            });
            if (autoPlay) {
                await this.play();
            }
            this.emit('trackLoaded', track);
        } catch (error) {
            console.error('Error loading track:', error);
            this.emit('error', error);
        }
    }

    pause() {
        this.audio.pause();
        this.updateState({ isPlaying: false });
        this.emit('pause');
    }

    togglePlayPause() {
        if (this.state.isPlaying) {
            this.pause();
        } else {
            this.play();
        }
    }

    stop() {
        this.pause();
        this.audio.currentTime = 0;
        this.updateState({ currentTime: 0 });
        this.emit('stop');
    }

    seek(time) {
        this.audio.currentTime = time;
        this.updateState({ currentTime: time });
        this.emit('seek', time);
    }
    setVolume(volume) {
        this.audio.volume = Math.max(0, Math.min(1, volume));
        this.updateState({ volume: this.audio.volume });
        this.emit('volumeChange', this.audio.volume);
    }
    toggleMute() {
        this.audio.muted = !this.audio.muted;
        this.updateState({ isMuted: this.audio.muted });
        this.emit('muteChange', this.audio.muted);
    }

    setPlaylist(tracks, startIndex = 0) {
        this.updateState({
            playlist: tracks,
            currentIndex: startIndex
        });
        if (tracks.length > 0 && startIndex >= 0) {
            this.loadTrack(tracks[startIndex], false);
        }
        this.emit('playListChange', tracks);
    };
    async play() {
        try {
            await this.audio.play();
            this.updateState({ isPlaying: true });
            this.emit('play', this.state.currentTrack);
        } catch (error) {
            console.error('Error playing:', error);
            this.emit('error', error);
        }
    }
    playTrackAtIndex(index) {
        if (index >= 0 && index < this.state.playlist.length) {
            this.updateState({ currentIndex: index });
            this.loadTrack(this.state.playlist[index], true);
        }
    }
    next() {
        const { playlist, currentIndex, isShuffling } = this.state;
        if (playlist.length === 0) return;
        let nextIndex;
        if (isShuffling) {
            nextIndex = Math.floor(Math.random() * playlist.length);
        } else {
            nextIndex = (currentIndex + 1) % playlist.length;
        }

        this.playTrackAtIndex(nextIndex);
        this.emit('next', this.state.playlist[nextIndex]);
    }

    previous() {
        const { playlist, currentIndex } = this.state;
        if (playlist.length === 0) return;

        // If more than 3 secons playsed, restart current track
        if (this.audio.currentTime > 3) {
            this.seek(0);
            return;
        }
        const prevIndex = currentIndex - 1 < 0
            ? playlist.length - 1
            : currentIndex - 1;
        this.playTrackAtIndex(prevIndex);
        this.emit('previous', this.state.playlist[prevIndex]);
    }

    handleTrackEnd() {
        if (this.state.isLooping) {
            this.seek(0);
            this.play();
        } else {
            this.next();
        }
    }

    toggleLoop() {
        const newLoopState = !this.state.isLooping;
        this.updateState({ isLooping: newLoopState });
        this.emit('loopChange', newLoopState);
    }

    toggleShuffle() {
        const newShuffleState = !this.state.isShuffling;
        this.updateState({ isShuffling: new newShuffleState });
        this.emit('shuffleChange', new newShuffleState);
    }

    getState() {
        return { ...this.state };
    }

    getCurrentTrack() {
        return this.state.currentTrack;
    }

    isPlaying() {
        return this.state.isPlaying;
    }

    destroy() {
        this.stop();
        this.audio.src = '';
        this.listeners.clear();
    }
}

const playerService = new PlayerService();
export default playerService;