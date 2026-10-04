"use client";

import { challenges, xpFor } from "./curriculum";
import { jsChallenges } from "./curriculumJs";
import type { ProgressMap } from "./progress";

// ===== Helpers (definidos UNA sola vez al inicio) =====
function hoy(): string {
  const d = new Date();
  return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
}
function esHoy(ts: number): boolean {
  const d = new Date(ts);
  return hoy() === `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
}

// ===== Perfil / onboarding =====
export type Perfil = { 
  nombre: string; 
  track: "sql" | "js"; 
  nivel: string; 
  metaDiaria: number; 
  listo: boolean;
  rachaActual: number;
};

const PERFIL_KEY = "til-perfil";
export const PERFIL_DEFAULT: Perfil = { 
  nombre: "", 
  track: "sql", 
  nivel: "principiante", 
  metaDiaria: 30, 
  listo: false,
  rachaActual: 0,
};

export function loadPerfil(): Perfil {
  try {
    return { ...PERFIL_DEFAULT, ...JSON.parse(localStorage.getItem(PERFIL_KEY) || "{}") };
  } catch {
    return PERFIL_DEFAULT;
  }
}
export function savePerfil(p: Perfil) {
  localStorage.setItem(PERFIL_KEY, JSON.stringify(p));
}

// ===== Mastery (motor de repetición, ±21) =====
export type Mastery = Record<string, { intentos: number; fallos: number; ultimo: number }>;
const MASTERY_KEY = "til-mastery";

export function loadMastery(): Mastery {
  try {
    return JSON.parse(localStorage.getItem(MASTERY_KEY) || "{}");
  } catch {
    return {};
  }
}
export function registraIntento(id: string, ok: boolean) {
  const m = loadMastery();
  const e = m[id] ?? { intentos: 0, fallos: 0, ultimo: 0 };
  e.intentos++;
  if (!ok) e.fallos++;
  e.ultimo = Date.now();
  localStorage.setItem(MASTERY_KEY, JSON.stringify(m));
}
export function dominio(m: Mastery, id: string): number {
  const e = m[id];
  if (!e || e.intentos === 0) return 0;
  return Math.round(((e.intentos - e.fallos) / e.intentos) * 100);
}
// Necesita atención: falló alguna vez o lleva 6+ días sin tocarse
export function necesitaRepaso(m: Mastery, p: ProgressMap, id: string): boolean {
  const e = m[id];
  if (!p[id]) return false;
  if (e && e.fallos > 0) return true;
  const last = e?.ultimo ?? p[id].at;
  return Date.now() - last > 6 * 24 * 3600 * 1000;
}

// ===== Tiempo / monedas =====
const TIEMPO_KEY = "til-tiempo";
export function sumaTiempo(seg: number) {
  try {
    localStorage.setItem(TIEMPO_KEY, String((Number(localStorage.getItem(TIEMPO_KEY) || 0) + seg) | 0));
  } catch { /* noop */ }
}
export function leeTiempo(): number {
  try {
    return Number(localStorage.getItem(TIEMPO_KEY) || 0);
  } catch {
    return 0;
  }
}
export function fmtTiempo(seg: number): string {
  const h = Math.floor(seg / 3600);
  const m = Math.floor((seg % 3600) / 60);
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
}

// ===== Nivel / XP =====
export function xpTotal(p: ProgressMap): number {
  let xp = 0;
  for (const c of challenges) if (p[c.id]) xp += xpFor(c);
  const XP_JS: Record<string, number> = { facil: 10, media: 20, dificil: 30 };
  for (const c of jsChallenges) if (p[`js-${c.id}`]) xp += XP_JS[c.dificultad] ?? 20;
  return xp;
}
export function nivelDe(xp: number): { nivel: number; base: number; siguiente: number } {
  const nivel = Math.floor(xp / 100) + 1;
  return { nivel, base: (nivel - 1) * 100, siguiente: nivel * 100 };
}

// ===== Meta diaria / quests (≈18, ≈22) =====
export function xpHoy(p: ProgressMap): number {
  let xp = 0;
  for (const c of challenges) {
    const e = p[c.id];
    if (e && esHoy(e.at)) xp += xpFor(c);
  }
  return xp;
}
export function leccionesHoy(p: ProgressMap): number {
  return Object.values(p).filter((e) => esHoy(e.at)).length;
}
export type Quest = { id: string; titulo: string; actual: number; meta: number; lista: boolean };
export function questsHoy(p: ProgressMap): Quest[] {
  const rep = repasosHoy();
  return [
    { id: "q-lecciones", titulo: "Completa 2 lecciones", actual: Math.min(leccionesHoy(p), 2), meta: 2, lista: leccionesHoy(p) >= 2 },
    { id: "q-xp", titulo: "Gana 50 XP", actual: Math.min(xpHoy(p), 50), meta: 50, lista: xpHoy(p) >= 50 },
    { id: "q-repaso", titulo: "Repasa 1 concepto", actual: Math.min(rep, 1), meta: 1, lista: rep >= 1 },
  ];
}

// ===== Repasos clicados =====
const REPASO_KEY = "til-repasos";
export function marcaRepaso(id: string) {
  try {
    const arr = JSON.parse(localStorage.getItem(REPASO_KEY) || "[]") as number[];
    arr.push(Date.now());
    localStorage.setItem(REPASO_KEY, JSON.stringify(arr.slice(-50)));
    void id;
  } catch { /* noop */ }
}
export function repasosHoy(): number {
  try {
    const arr = JSON.parse(localStorage.getItem(REPASO_KEY) || "[]") as number[];
    return arr.filter(esHoy).length;
  } catch {
    return 0;
  }
}

// ===== Borrado total (ajustes) =====
export function borraTodo() {
  for (const k of ["til-progress-v1", "til-drafts-v1", "til-perfil", "til-mastery", "til-tiempo", "til-repasos", "til-custom", "til-theme", "til-calm", "til-onboarding", "til-sonido"]) {
    try {
      localStorage.removeItem(k);
    } catch { /* noop */ }
  }
}