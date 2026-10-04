"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { challenges } from "@/lib/curriculum";
import { loadProgress } from "@/lib/progress";

const TOTAL = 45 * 60;

function pick(): string[] {
  const pool = [...challenges];
  const out: string[] = [];
  const difs = ["facil", "media", "dificil", "media"] as const;
  for (const d of difs) {
    const i = pool.findIndex((c) => c.dificultad === d);
    if (i >= 0) out.push(pool.splice(i, 1)[0].id);
  }
  return out;
}

export default function SimulacroClient() {
  const [ids] = useState(pick);
  const [left, setLeft] = useState(TOTAL);
  const [done, setDone] = useState<Record<string, boolean>>({});
  const [reporte, setReporte] = useState("");
  const [corrigiendo, setCorrigiendo] = useState(false);
  const [corrErr, setCorrErr] = useState("");

  async function corregir() {
    setCorrErr(""); setReporte(""); setCorrigiendo(true);
    try {
      const drafts = JSON.parse(localStorage.getItem("til-drafts-v1") || "{}");
      const items = list.map((c) => ({ titulo: c.titulo, codigo: String(drafts[c.id] ?? "") }));
      const r = await fetch("/api/correccion", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ items }),
      });
      const j = await r.json();
      if (!r.ok) setCorrErr(j.error ?? "Falló la corrección.");
      else setReporte(j.text);
    } catch {
      setCorrErr("Sin conexión con la IA.");
    } finally {
      setCorrigiendo(false);
    }
  }

  useEffect(() => {
    const t = setInterval(() => setLeft((s) => (s > 0 ? s - 1 : 0)), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const tick = () => {
      const p = loadProgress();
      setDone(Object.fromEntries(ids.filter((id) => p[id]).map((id) => [id, true])));
    };
    tick();
    window.addEventListener("focus", tick);
    return () => window.removeEventListener("focus", tick);
  }, [ids]);

  const mm = `${String(Math.floor(left / 60)).padStart(2, "0")}:${String(left % 60).padStart(2, "0")}`;
  const list = ids
    .map((id) => challenges.find((c) => c.id === id))
    .filter((c) => c !== undefined);

  return (
    <div>
      <div className="band-dark" style={{ padding: 16, marginTop: 16, display: "flex", gap: 16, alignItems: "center", flexWrap: "wrap" }}>
        <span className={left <= 300 ? "timer-urgente" : "timer-ok"}>[{mm}]</span>
        <span className={Object.keys(done).length === list.length ? "st-ok" : ""}>[{Object.keys(done).length}/{list.length} resueltos]</span>
        <span style={{ fontSize: 13, opacity: 0.8, fontFamily: "var(--font-rpg)", textTransform: "uppercase", letterSpacing: "0.02em" }}>SIN SOLUCIÓN VISIBLE · SIN ESPERADO · COMO PRUEBA REAL</span>
      </div>
      {left === 0 && <div className="codeblock" style={{ marginTop: 16, borderColor: "var(--warning)" }}>[!] TIEMPO AGOTADO — ENVÍA LO QUE TENGAS CON [SUBMIT] EN CADA RETO.</div>}
      <div style={{ marginTop: 16, display: "grid", gap: 12 }}>
        {list.map((c, i) => (
          <div key={c.id} className="card-flat" style={{ padding: 16 }}>
            <div style={{ display: "flex", gap: 12, alignItems: "baseline", flexWrap: "wrap" }}>
              <span style={{ color: "var(--mute)", fontFamily: "var(--font-rpg)", textTransform: "uppercase" }}>RETO {i + 1}</span>
              <Link href={`/sql/${c.id}`} style={{ fontWeight: 700 }}>{done[c.id] ? "✦ " : "⚔ "}{c.titulo}</Link>
              <span className={`dif dif-${c.dificultad}`}>[{c.dificultad.toUpperCase()}]</span>
            </div>
            <div style={{ fontSize: 13, color: "var(--body)", marginTop: 4 }}>{c.enunciado.slice(0, 120)}...</div>
          </div>
        ))}
      </div>
      <div className="card-flat" style={{ padding: 16, marginTop: 16, borderTop: "3px solid var(--gem)" }}>
        <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
          <span style={{ fontSize: 13, fontWeight: 700, fontFamily: "var(--font-rpg)", textTransform: "uppercase" }}>💡 CORRECCIÓN IA</span>
          <span style={{ fontSize: 11, color: "var(--mute)" }}>RÚBRICA + PLAN DE REPASO CON TUS INTENTOS</span>
          <button className="btn btn-secondary btn-rpg" style={{ height: 36, fontSize: 11 }} disabled={corrigiendo} onClick={corregir}>
            {corrigiendo ? "[CORRIGIENDO...]" : "[💡 CORREGIR SIMULACRO]"}
          </button>
        </div>
        {corrErr && <div className="st-err" style={{ marginTop: 8, fontSize: 13 }}>[!] {corrErr}</div>}
        {reporte && <div style={{ marginTop: 8, fontSize: 13, whiteSpace: "pre-wrap" }}>{reporte}</div>}
      </div>
    </div>
  );
}