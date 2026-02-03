type SoundType = 'move' | 'merge' | 'win' | 'gameover' | 'button';

class SoundManager {
  private enabled: boolean = true;
  private volume: number = 0.5;
  private audioContext: AudioContext | null = null;

  constructor() {
    this.enabled = localStorage.getItem('2048-sound-enabled') !== 'false';
    this.volume = parseFloat(localStorage.getItem('2048-sound-volume') || '0.5');
  }

  private getAudioContext(): AudioContext {
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return this.audioContext;
  }

  private playTone(frequency: number, duration: number, type: OscillatorType = 'sine'): void {
    if (!this.enabled) return;

    try {
      const ctx = this.getAudioContext();
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);

      oscillator.frequency.value = frequency;
      oscillator.type = type;

      gainNode.gain.setValueAtTime(this.volume * 0.3, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);

      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + duration);
    } catch (e) {
      console.warn('Sound play failed:', e);
    }
  }

  playMove(): void {
    this.playTone(200, 0.05, 'sine');
  }

  playMerge(value: number): void {
    const baseFreq = 300;
    const freq = baseFreq + Math.log2(value) * 100;
    this.playTone(freq, 0.15, 'triangle');
  }

  playWin(): void {
    if (!this.enabled) return;
    const ctx = this.getAudioContext();
    const notes = [523.25, 659.25, 783.99, 1046.50];
    notes.forEach((freq, i) => {
      setTimeout(() => this.playTone(freq, 0.3, 'sine'), i * 100);
    });
  }

  playGameOver(): void {
    if (!this.enabled) return;
    const ctx = this.getAudioContext();
    const notes = [440, 349.23, 293.66, 220];
    notes.forEach((freq, i) => {
      setTimeout(() => this.playTone(freq, 0.4, 'sawtooth'), i * 150);
    });
  }

  playButton(): void {
    this.playTone(800, 0.05, 'sine');
  }

  setEnabled(enabled: boolean): void {
    this.enabled = enabled;
    localStorage.setItem('2048-sound-enabled', enabled.toString());
  }

  isEnabled(): boolean {
    return this.enabled;
  }

  setVolume(volume: number): void {
    this.volume = Math.max(0, Math.min(1, volume));
    localStorage.setItem('2048-sound-volume', this.volume.toString());
  }

  getVolume(): number {
    return this.volume;
  }
}

export const soundManager = new SoundManager();
