"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import { challenges, xpFor, tiempoFor } from "@/lib/curriculum";
import { loadProgress, clearProgress, streakDays, exportProgress } from "@/lib/progress";

function initialDone(): Record<string, boolean> {
  if (typeof window === "undefined") return {};
  return Object.fromEntries(Object.keys(loadProgress()).map((k) => [k, true]));
}

export default function SqlIndexClient() {
  const [done, setDone] = useState<Record<string, boolean>>(initialDone);
  const [q, setQ] = useState("");
  const [dif, setDif] = useState<string>("todas");
  const [emp, setEmp] = useState<string>("todas");

  const empresas = useMemo(() => {
    const set = new Set<string>();
    for (const c of challenges) {
      const first = c.empresa_patron.split("/")[0].trim();
      set.add(first);
    }
    return ["todas", ...[...set].sort()];
  }, []);

  const pct = Math.round((Object.keys(done).length / challenges.length) * 100);
  const xp = challenges.filter((c) => done[c.id]).reduce((s, c) => s + xpFor(c), 0);
  const [racha, setRacha] = useState(() => (typeof window === "undefined" ? 0 : streakDays(loadProgress())));

  const list = useMemo(() => challenges.filter((c) => {
    if (dif !== "todas" && c.dificultad !== dif) return false;
    if (emp !== "todas" && !c.empresa_patron.startsWith(emp)) return false;
    if (q && !(c.titulo + c.enunciado + c.id + c.empresa_patron).toLowerCase().includes(q.toLowerCase())) return false;
    return true;
  }), [q, dif, emp]);

  return (
    <div>
      <div className="card-flat" style={{ padding: 16, marginTop: 16 }}>
        <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
          <span style={{ fontWeight: 700, fontFamily: "var(--font-rpg)", textTransform: "uppercase" }}>[{Object.keys(done).length}/{challenges.length}] {pct}%</span>
          <div style={{ flex: 1, minWidth: 160, height: 10, background: "var(--card)", borderRadius: 999, overflow: "hidden", boxShadow: "inset 0 2px 8px rgba(0,0,0,0.3)" }}>
            <div style={{ width: `${pct}%`, height: "100%", background: "linear-gradient(90deg, var(--accent), #26a85a)", borderRadius: 999, boxShadow: "0 0 12px var(--accent-glow)" }} />
          </div>
          <button className="btn btn-secondary btn-rpg" style={{ height: 36, fontSize: 12 }} onClick={() => { clearProgress(); setDone({}); setRacha(0); }}>[🔄 RESET]</button>
          <button
            className="btn btn-secondary btn-rpg" style={{ height: 36, fontSize: 12 }}
            onClick={() => {
              const blob = new Blob([exportProgress()], { type: "application/json" });
              const a = document.createElement("a");
              a.href = URL.createObjectURL(blob);
              a.download = "til-progreso.json";
              a.click();
            }}
          >[💾 EXPORTAR]</button>
          <label className="btn btn-secondary btn-rpg" style={{ height: 36, fontSize: 12, cursor: "pointer" }}>
            [📥 IMPORTAR]
            <input
              type="file" accept="application/json" style={{ display: "none" }}
              onChange={async (e) => {
                const f = e.target.files?.[0];
                if (!f) return;
                try {
                  const text = await f.text();
                  const data = JSON.parse(text);
                  if (data.progress) localStorage.setItem("til-progress-v1", JSON.stringify(data.progress));
                  if (data.drafts) localStorage.setItem("til-drafts-v1", typeof data.drafts === "string" ? data.drafts : JSON.stringify(data.drafts));
                  const p = loadProgress();
                  setDone(Object.fromEntries(Object.keys(p).map((k) => [k, true])));
                  setRacha(streakDays(p));
                } catch { /* noop */ }
              }}
            />
          </label>
        </div>
        <div style={{ display: "flex", gap: 16, marginTop: 10, fontSize: 13, flexWrap: "wrap", fontFamily: "var(--font-rpg)", textTransform: "uppercase" }}>
          <span className="st-xp">[⚔ XP {xp}]</span><span className="st-racha">[🔥 RACHA {racha}d]</span><Link href="/sql/simulacro" style={{ color: "var(--accent)" }}>[🏰 SIMULACRO 45&apos;]</Link>
        </div>
        <div style={{ display: "flex", gap: 8, marginTop: 10, flexWrap: "wrap" }}>
          <input aria-label="buscar reto" className="input-mono" placeholder="$ buscar: join, window, likes..." value={q} onChange={(e) => setQ(e.target.value)} style={{ maxWidth: 320 }} />
          {(["todas", "facil", "media", "dificil"] as const).map((d) => (
            <button key={d} className={dif === d ? "btn btn-primary" : "btn btn-secondary"} style={{ height: 36, fontSize: 12 }} onClick={() => setDif(d)}>[{d.toUpperCase()}]</button>
          ))}
        </div>
        <div style={{ display: "flex", gap: 8, marginTop: 8, flexWrap: "wrap", alignItems: "center" }}>
          <label htmlFor="f-emp" style={{ fontSize: 12, color: "var(--mute)", fontFamily: "var(--font-rpg)", textTransform: "uppercase" }}>EMPRESA:</label>
          <select id="f-emp" className="input-mono" value={emp} onChange={(e) => setEmp(e.target.value)} style={{ maxWidth: 220, padding: "8px 12px" }}>
            {empresas.map((e) => <option key={e} value={e}>{e}</option>)}
          </select>
        </div>
      </div>

      <hr className="hr" style={{ marginTop: 28 }} />
      {pct === 100 && (
        <div className="band-dark" style={{ padding: 20, marginTop: 16, borderColor: "var(--accent)" }}>
          <div style={{ fontWeight: 700, fontFamily: "var(--font-rpg)", textTransform: "uppercase", color: "var(--accent)" }}>[✦] RUTA SQL COMPLETADA · {xp} XP</div>
          <div style={{ fontSize: 13, marginTop: 6, color: "var(--body)" }}>Ruta SQL dominada. Sigue con <Link href="/js" style={{ color: "var(--gem)" }}>[JS ALGORÍTMICO]</Link> o repite el <Link href="/sql/simulacro" style={{ color: "var(--accent)" }}>[SIMULACRO 45&apos;]</Link>.</div>
        </div>
      )}
      {list.length === 0 && <div style={{ padding: "28px 0", color: "var(--mute)" }}>[~] SIN RESULTADOS PARA {q}</div>}
      {list.map((c) => (
        <div key={c.id} style={{ padding: "18px 0", borderBottom: "1px solid var(--hairline)" }}>
          <div style={{ display: "flex", gap: 12, alignItems: "baseline", flexWrap: "wrap" }}>
            <span style={{ color: "var(--mute)", fontSize: 13, fontFamily: "var(--font-rpg)", textTransform: "uppercase" }}>{String(c.order).padStart(2, "0")}</span>
            <Link href={`/sql/${c.id}`} style={{ fontWeight: 700 }}>{done[c.id] ? "✦ " : "⚔ "}{c.titulo}</Link>
            <span className={`dif dif-${c.dificultad}`}>[{c.dificultad.toUpperCase()}]</span>
            <span style={{ fontSize: 12, color: "var(--mute)", fontFamily: "var(--font-rpg)" }}>{c.empresa_patron} · ⏱~{tiempoFor(c)}min</span>
          </div>
          <div style={{ fontSize: 13, color: "var(--body)", marginTop: 4 }}>{c.enunciado.slice(0, 140)}&hellip;</div>
        </div>
      ))}
    </div>
  );
}