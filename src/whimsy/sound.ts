// Tiny sounds made in the browser (no sound files): the danfo's horn and the arcade coin. Only ever played after a click.
let ctx: AudioContext | null = null;

function tone(freq: number, at: number, length: number, type: OscillatorType = "square", volume = 0.08) {
  ctx ??= new AudioContext();
  const t0 = ctx.currentTime + at;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  gain.gain.setValueAtTime(0.0001, t0);
  gain.gain.exponentialRampToValueAtTime(volume, t0 + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.0001, t0 + length);
  osc.connect(gain).connect(ctx.destination);
  osc.start(t0);
  osc.stop(t0 + length + 0.05);
}

/** "Poo-poo!": a danfo's two-note horn. */
export function honk() {
  try { tone(392, 0, 0.16); tone(311, 0.2, 0.22); } catch { /* no audio: fine */ }
}

/** A coin dropping into an arcade machine. */
export function clink() {
  try { tone(1760, 0, 0.08, "triangle", 0.12); tone(2637, 0.07, 0.18, "triangle", 0.1); } catch { /* no audio: fine */ }
}
