"use client";

const PROGRESS_KEY = "til-progress-v1";
const DRAFT_KEY = "til-drafts-v1";

export type ProgressEntry = { status: "done"; at: number; xp: number };
export type ProgressMap = Record<string, ProgressEntry>;

const XP: Record<string, number> = { facil: 10, media: 20, dificil: 30 };

function dayKey(ts: number): string {
  const d = new Date(ts);
  return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
}

export function loadProgress(): ProgressMap {
  try {
    return JSON.parse(localStorage.getItem(PROGRESS_KEY) || "{}");
  } catch {
    return {};
  }
}

export function markDone(id: string, dificultad: string = "media", segundos = 60) {
  const prev = loadProgress();
  if (prev[id]) return;
  prev[id] = { status: "done", at: Date.now(), xp: XP[dificultad] ?? 20 };
  localStorage.setItem(PROGRESS_KEY, JSON.stringify(prev));
  try {
    localStorage.setItem("til-monedas", String(leeMonedas() + 5));
    const t = Number(localStorage.getItem("til-tiempo") || 0);
    localStorage.setItem("til-tiempo", String(t + Math.max(0, Math.round(segundos))));
  } catch { /* noop */ }
}

export function leeMonedas(): number {
  try {
    return Number(localStorage.getItem("til-monedas") || 0);
  } catch {
    return 0;
  }
}

export function totalXP(p: ProgressMap): number {
  return Object.values(p).reduce((s, e) => s + (e.xp ?? 0), 0);
}

export function streakDays(p: ProgressMap): number {
  const days = new Set(Object.values(p).map((e) => dayKey(e.at)));
  let streak = 0;
  const d = new Date();
  if (!days.has(dayKey(d.getTime()))) d.setDate(d.getDate() - 1);
  while (days.has(dayKey(d.getTime()))) {
    streak++;
    d.setDate(d.getDate() - 1);
  }
  return streak;
}

export function exportProgress(): string {
  return JSON.stringify({ progress: loadProgress(), drafts: localStorage.getItem(DRAFT_KEY) ?? "{}" }, null, 2);
}

export function loadDraft(id: string, fallback: string): string {
  try {
    const all = JSON.parse(localStorage.getItem(DRAFT_KEY) || "{}");
    return typeof all[id] === "string" ? all[id] : fallback;
  } catch {
    return fallback;
  }
}

export function saveDraft(id: string, sql: string) {
  try {
    const all = JSON.parse(localStorage.getItem(DRAFT_KEY) || "{}");
    all[id] = sql;
    localStorage.setItem(DRAFT_KEY, JSON.stringify(all));
  } catch {
    /* noop */
  }
}

export function clearProgress() {
  localStorage.removeItem(PROGRESS_KEY);
  localStorage.removeItem(DRAFT_KEY);
}
