class SoundManager {
  private ctx: AudioContext | null = null;
  public isMuted: boolean = false;

  private init() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  private playTone(freq: number, type: OscillatorType, duration: number, vol: number = 0.1) {
    if (this.isMuted) return;
    try {
      this.init();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

      gain.gain.setValueAtTime(vol, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch (e) {
      console.error("Audio play failed", e);
    }
  }

  playCorrect() {
    // Short, high-pitched pop
    this.playTone(600, 'sine', 0.1, 0.05);
  }

  playIncorrect() {
    // Short, low-pitched buzz
    this.playTone(150, 'sawtooth', 0.15, 0.05);
  }

  playStart() {
    if (this.isMuted) return;
    // Ascending arpeggio
    [440, 554, 659, 880].forEach((freq, i) => {
      setTimeout(() => this.playTone(freq, 'sine', 0.2, 0.08), i * 100);
    });
  }

  playEnd() {
    if (this.isMuted) return;
    // Descending arpeggio
    [880, 659, 554, 440].forEach((freq, i) => {
      setTimeout(() => this.playTone(freq, 'sine', 0.3, 0.08), i * 150);
    });
  }

  playReward() {
    if (this.isMuted) return;
    // Happy jingle
    [523.25, 659.25, 783.99, 1046.50].forEach((freq, i) => {
      setTimeout(() => this.playTone(freq, 'sine', 0.4, 0.08), i * 100);
    });
  }
}

export const sounds = new SoundManager();
