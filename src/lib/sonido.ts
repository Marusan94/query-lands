"use client";

let ctx: AudioContext | null = null;
let on: boolean | null = null;

function enabled(): boolean {
  if (on !== null) return on;
  try {
    on = localStorage.getItem("til-sonido") !== "off";
  } catch {
    on = true;
  }
  return on;
}

export function setSonido(v: boolean) {
  on = v;
  try {
    localStorage.setItem("til-sonido", v ? "on" : "off");
  } catch { /* noop */ }
}
export function sonidoOn(): boolean {
  return enabled();
}

function beep(freq: number, ms: number, delay = 0, type: OscillatorType = "sine") {
  if (!enabled()) return;
  try {
    ctx ??= new AudioContext();
    const t = ctx.currentTime + delay;
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = type;
    o.frequency.value = freq;
    g.gain.setValueAtTime(0.12, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + ms / 1000);
    o.connect(g).connect(ctx.destination);
    o.start(t);
    o.stop(t + ms / 1000);
  } catch { /* noop */ }
}

export const sonido = {
  // Solo en respuesta a acciones del usuario, nunca en navegación
  correcto: () => beep(660, 120),
  incorrecto: () => beep(220, 180, 0, "triangle"),
  completo: () => {
    beep(523, 120);
    beep(659, 120, 0.12);
    beep(784, 200, 0.24);
  },
  desbloqueo: () => {
    beep(784, 120);
    beep(1046, 220, 0.12);
  },
};
