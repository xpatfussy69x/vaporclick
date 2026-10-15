/**
 * Vaporwave & Mechanical Web Audio API Synthesizer
 * Provides crisp click sounds, retro beeps, vaporwave dream chimes,
 * purchase triumph fanfares, and Android tactile haptics.
 */

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

export type SoundEffectType =
  | 'mechanical'
  | 'retro-beep'
  | 'synth-blip'
  | 'vapor-chime'
  | 'muted';

/**
 * Triggers Android device haptic vibration if supported by hardware
 */
export function triggerHaptic(durationMs: number = 15) {
  if (typeof window !== 'undefined' && 'navigator' in window && 'vibrate' in navigator) {
    try {
      navigator.vibrate(durationMs);
    } catch {
      // ignore
    }
  }
}

export function playClickSound(
  type: SoundEffectType = 'mechanical',
  volume: number = 0.5
) {
  if (type === 'muted' || volume <= 0) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const masterGain = ctx.createGain();
  masterGain.gain.setValueAtTime(volume * 0.4, now);
  masterGain.connect(ctx.destination);

  if (type === 'mechanical') {
    // Cherry MX Blue style snappy click
    const osc = ctx.createOscillator();
    const clickGain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(1400, now);
    osc.frequency.exponentialRampToValueAtTime(120, now + 0.025);

    clickGain.gain.setValueAtTime(1, now);
    clickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.035);

    const bufferSize = ctx.sampleRate * 0.02;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const whiteNoise = ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;

    const noiseFilter = ctx.createBiquadFilter();
    noiseFilter.type = 'bandpass';
    noiseFilter.frequency.value = 2200;
    noiseFilter.Q.value = 2.0;

    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0.3, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.01, now + 0.02);

    whiteNoise.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(masterGain);

    whiteNoise.start(now);
    whiteNoise.stop(now + 0.025);

    osc.connect(clickGain);
    clickGain.connect(masterGain);

    osc.start(now);
    osc.stop(now + 0.035);
  } else if (type === 'retro-beep') {
    // 8-bit classic arcade blip
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'square';
    osc.frequency.setValueAtTime(880, now);
    osc.frequency.setValueAtTime(1760, now + 0.015);

    gain.gain.setValueAtTime(0.4, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

    osc.connect(gain);
    gain.connect(masterGain);

    osc.start(now);
    osc.stop(now + 0.04);
  } else if (type === 'synth-blip') {
    // Smooth synth pop
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(520, now);
    osc.frequency.exponentialRampToValueAtTime(260, now + 0.05);

    gain.gain.setValueAtTime(0.7, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

    osc.connect(gain);
    gain.connect(masterGain);

    osc.start(now);
    osc.stop(now + 0.05);
  } else if (type === 'vapor-chime') {
    // Dreamy vaporwave bell chord
    const freqs = [587.33, 659.25, 880.0, 987.77];
    const freq = freqs[Math.floor(Math.random() * freqs.length)];
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now);

    gain.gain.setValueAtTime(0.5, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

    osc.connect(gain);
    gain.connect(masterGain);

    osc.start(now);
    osc.stop(now + 0.25);
  }
}

export function playStartStopSound(isStarting: boolean) {
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const masterGain = ctx.createGain();
  masterGain.gain.setValueAtTime(0.2, now);
  masterGain.connect(ctx.destination);

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = 'sawtooth';

  if (isStarting) {
    osc.frequency.setValueAtTime(523.25, now);
    osc.frequency.setValueAtTime(659.25, now + 0.06);
    osc.frequency.setValueAtTime(783.99, now + 0.12);

    gain.gain.setValueAtTime(0.4, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

    osc.connect(gain);
    gain.connect(masterGain);

    osc.start(now);
    osc.stop(now + 0.25);
  } else {
    osc.frequency.setValueAtTime(392.0, now);
    osc.frequency.setValueAtTime(261.63, now + 0.08);

    gain.gain.setValueAtTime(0.4, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

    osc.connect(gain);
    gain.connect(masterGain);

    osc.start(now);
    osc.stop(now + 0.2);
  }
}

/**
 * Majestic triumphant synth fanfare for the $2 USD one-off purchase unlock
 */
export function playPurchaseSuccessFanfare() {
  const ctx = getAudioContext();
  if (!ctx) return;

  triggerHaptic(50);
  const now = ctx.currentTime;
  const masterGain = ctx.createGain();
  masterGain.gain.setValueAtTime(0.35, now);
  masterGain.connect(ctx.destination);

  // Arpeggiated triumphal chord: C5 -> E5 -> G5 -> C6 shimmer
  const notes = [523.25, 659.25, 783.99, 1046.5];
  notes.forEach((freq, idx) => {
    const noteTime = now + idx * 0.1;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, noteTime);

    gain.gain.setValueAtTime(0.5, noteTime);
    gain.gain.exponentialRampToValueAtTime(0.001, noteTime + 0.6);

    osc.connect(gain);
    gain.connect(masterGain);

    osc.start(noteTime);
    osc.stop(noteTime + 0.65);
  });
}
