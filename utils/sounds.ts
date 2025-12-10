// Sound utilities for 2048 Quantum
// Uses Web Audio API to generate sounds programmatically

class SoundManager {
    private audioContext: AudioContext | null = null;

    private getContext(): AudioContext {
        if (!this.audioContext) {
            this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        }
        return this.audioContext;
    }

    // Game Over / Failure sound - descending tone
    playGameOver(): void {
        try {
            const ctx = this.getContext();
            const oscillator = ctx.createOscillator();
            const gainNode = ctx.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(ctx.destination);

            oscillator.type = 'sine';
            oscillator.frequency.setValueAtTime(400, ctx.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(150, ctx.currentTime + 0.5);

            gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);

            oscillator.start(ctx.currentTime);
            oscillator.stop(ctx.currentTime + 0.5);
        } catch (e) {
            console.log('Audio not supported');
        }
    }

    // Victory / 2048 achieved - triumphant fanfare
    playVictory(): void {
        try {
            const ctx = this.getContext();
            const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
            const duration = 0.15;

            notes.forEach((freq, index) => {
                const oscillator = ctx.createOscillator();
                const gainNode = ctx.createGain();

                oscillator.connect(gainNode);
                gainNode.connect(ctx.destination);

                oscillator.type = 'sine';
                oscillator.frequency.setValueAtTime(freq, ctx.currentTime);

                const startTime = ctx.currentTime + index * duration;
                gainNode.gain.setValueAtTime(0, startTime);
                gainNode.gain.linearRampToValueAtTime(0.3, startTime + 0.02);
                gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + duration);

                oscillator.start(startTime);
                oscillator.stop(startTime + duration);
            });

            // Final sustained chord
            setTimeout(() => {
                const chordFreqs = [523.25, 659.25, 783.99];
                chordFreqs.forEach(freq => {
                    const oscillator = ctx.createOscillator();
                    const gainNode = ctx.createGain();

                    oscillator.connect(gainNode);
                    gainNode.connect(ctx.destination);

                    oscillator.type = 'sine';
                    oscillator.frequency.setValueAtTime(freq, ctx.currentTime);

                    gainNode.gain.setValueAtTime(0.2, ctx.currentTime);
                    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.8);

                    oscillator.start(ctx.currentTime);
                    oscillator.stop(ctx.currentTime + 0.8);
                });
            }, notes.length * duration * 1000);
        } catch (e) {
            console.log('Audio not supported');
        }
    }

    // Tile merge sound - quick pop
    playMerge(value: number): void {
        try {
            const ctx = this.getContext();
            const oscillator = ctx.createOscillator();
            const gainNode = ctx.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(ctx.destination);

            // Higher pitch for higher values
            const baseFreq = 200 + Math.min(value, 2048) * 0.5;

            oscillator.type = 'sine';
            oscillator.frequency.setValueAtTime(baseFreq, ctx.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(baseFreq * 1.5, ctx.currentTime + 0.05);

            gainNode.gain.setValueAtTime(0.1, ctx.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);

            oscillator.start(ctx.currentTime);
            oscillator.stop(ctx.currentTime + 0.1);
        } catch (e) {
            console.log('Audio not supported');
        }
    }
}

export const soundManager = new SoundManager();
