import { challenges, xpFor } from "./curriculum";
import { jsChallenges } from "./curriculumJs";
import type { ProgressMap } from "./progress";

export type Logro = { id: string; titulo: string; detalle: string; ok: boolean };

export function semanasActividad(p: ProgressMap, semanas = 8): { fecha: string; n: number }[] {
  const porDia = new Map<string, number>();
  for (const e of Object.values(p)) {
    const d = new Date(e.at);
    const k = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
    porDia.set(k, (porDia.get(k) ?? 0) + 1);
  }
  const out: { fecha: string; n: number }[] = [];
  const hoy = new Date();
  for (let i = semanas * 7 - 1; i >= 0; i--) {
    const d = new Date(hoy);
    d.setDate(d.getDate() - i);
    const k = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
    out.push({ fecha: `${d.getDate()}/${d.getMonth() + 1}`, n: porDia.get(k) ?? 0 });
  }
  return out;
}

export function logrosDe(p: ProgressMap): Logro[] {
  const sqlDone = challenges.filter((c) => p[c.id]).length;
  const jsDone = jsChallenges.filter((c) => p[`js-${c.id}`]).length;
  const xp = [...challenges.filter((c) => p[c.id]).map(xpFor)].reduce((a, b) => a + b, 0);
  const total = Object.keys(p).length;
  return [
    { id: "primer-paso", titulo: "[+] primer pass", detalle: "Completa tu primer reto", ok: total >= 1 },
    { id: "racha-sql", titulo: "[+] mitad SQL", detalle: `Lleva ${sqlDone}/16 en SQL`, ok: sqlDone >= 8 },
    { id: "sql-100", titulo: "[+] SQL dominado", detalle: "16/16 retos SQL", ok: sqlDone >= 16 },
    { id: "js-start", titulo: "[+] doble track", detalle: "1+ reto en JS", ok: jsDone >= 1 },
    { id: "xp-200", titulo: "[+] 200 XP", detalle: `Llevas ${xp} XP en SQL`, ok: xp >= 200 },
    { id: "fullstack", titulo: "[+] full-stack", detalle: "SQL 100% + JS 100%", ok: sqlDone >= 16 && jsDone >= jsChallenges.length },
  ];
}
