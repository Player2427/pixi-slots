import { Howl } from 'howler';

// Short synthesized WAV tones (data URI) so the demo has sound without assets.
function toneWav(freqStart: number, freqEnd: number, durMs: number): string {
  const sampleRate = 44100;
  const len = Math.floor((sampleRate * durMs) / 1000);
  const buffer = new ArrayBuffer(44 + len * 2);
  const view = new DataView(buffer);

  const writeStr = (offset: number, s: string) => {
    for (let i = 0; i < s.length; i++)
      view.setUint8(offset + i, s.charCodeAt(i));
  };

  writeStr(0, 'RIFF');
  view.setUint32(4, 36 + len * 2, true);
  writeStr(8, 'WAVE');
  writeStr(12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, 1, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * 2, true);
  view.setUint16(32, 2, true);
  view.setUint16(34, 16, true);
  writeStr(36, 'data');
  view.setUint32(40, len * 2, true);

  const attack = sampleRate * 0.005;
  const release = sampleRate * 0.05;
  for (let i = 0; i < len; i++) {
    const t = i / sampleRate;
    const freq = freqStart + (freqEnd - freqStart) * (i / len);
    let env = 1;
    if (i < attack) env = i / attack;
    else if (i > len - release) env = (len - i) / release;
    const sample = Math.sin(2 * Math.PI * freq * t) * env * 0.3;
    view.setInt16(44 + i * 2, sample * 32767, true);
  }

  let binary = '';
  const bytes = new Uint8Array(buffer);
  for (let i = 0; i < bytes.length; i++)
    binary += String.fromCharCode(bytes[i]);
  return `data:audio/wav;base64,${btoa(binary)}`;
}

type SoundName = 'spin' | 'reelStop' | 'win';

export class SoundManager {
  private sounds: Record<SoundName, Howl>;
  private muted = false;

  constructor() {
    this.sounds = {
      spin: new Howl({ src: [toneWav(320, 520, 180)], format: ['wav'] }),
      reelStop: new Howl({ src: [toneWav(200, 140, 90)], format: ['wav'] }),
      win: new Howl({ src: [toneWav(523, 988, 600)], format: ['wav'] }),
    };
  }

  play(name: SoundName): void {
    if (this.muted) return;
    this.sounds[name].play();
  }

  setMuted(muted: boolean): void {
    this.muted = muted;
  }
}
