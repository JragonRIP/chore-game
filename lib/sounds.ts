/** Web Audio beeps — no audio files required. */

let ctx: AudioContext | null = null;

function audio(): AudioContext | null {
  if (typeof window === "undefined") return null;
  try {
    if (!ctx) {
      const AC =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext;
      ctx = new AC();
    }
    if (ctx.state === "suspended") void ctx.resume();
    return ctx;
  } catch {
    return null;
  }
}

function tone(
  freq: number,
  duration: number,
  type: OscillatorType = "sine",
  gain = 0.08,
  delay = 0,
) {
  const c = audio();
  if (!c) return;
  const t0 = c.currentTime + delay;
  const osc = c.createOscillator();
  const g = c.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t0);
  g.gain.setValueAtTime(0.0001, t0);
  g.gain.exponentialRampToValueAtTime(gain, t0 + 0.02);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + duration);
  osc.connect(g);
  g.connect(c.destination);
  osc.start(t0);
  osc.stop(t0 + duration + 0.02);
}

export function playClick() {
  tone(520, 0.05, "triangle", 0.05);
}

export function playQuestComplete() {
  tone(523, 0.1, "sine", 0.09);
  tone(659, 0.12, "sine", 0.08, 0.08);
  tone(784, 0.18, "sine", 0.09, 0.16);
}

export function playLevelUp() {
  tone(392, 0.1, "square", 0.05);
  tone(523, 0.1, "square", 0.05, 0.08);
  tone(659, 0.1, "square", 0.055, 0.16);
  tone(784, 0.22, "square", 0.06, 0.24);
}

export function playChestOpen() {
  tone(180, 0.15, "sawtooth", 0.04);
  tone(240, 0.2, "triangle", 0.06, 0.12);
  tone(480, 0.15, "sine", 0.07, 0.28);
}

export function playFanfare() {
  tone(523, 0.12, "sine", 0.08);
  tone(659, 0.12, "sine", 0.08, 0.1);
  tone(784, 0.12, "sine", 0.08, 0.2);
  tone(1046, 0.28, "sine", 0.09, 0.32);
}

export function playEvolve() {
  tone(300, 0.15, "sine", 0.06);
  tone(450, 0.15, "sine", 0.07, 0.12);
  tone(600, 0.15, "sine", 0.08, 0.24);
  tone(900, 0.3, "triangle", 0.09, 0.4);
}

export function playEncounter() {
  tone(200, 0.12, "sawtooth", 0.05);
  tone(160, 0.15, "sawtooth", 0.05, 0.1);
}

export function playWin() {
  tone(600, 0.1, "sine", 0.07);
  tone(800, 0.2, "sine", 0.08, 0.1);
}

export function playIdleClaim() {
  tone(660, 0.1, "triangle", 0.06);
  tone(880, 0.15, "triangle", 0.07, 0.08);
}
