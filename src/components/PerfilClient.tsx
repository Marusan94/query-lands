"use client";
import Link from "next/link";
import { useState } from "react";
import { loadProgress, streakDays } from "@/lib/progress";
import { xpTotal, nivelDe, leeTiempo, fmtTiempo, loadPerfil } from "@/lib/estado";
import { logrosDe, semanasActividad } from "@/lib/logros";

export default function PerfilClient() {
  const [d] = useState(() => {
    if (typeof window === "undefined") return null;
    const p = loadProgress();
    const xp = xpTotal(p);
    const n = nivelDe(xp);
    const dentro = xp - n.base;
    return {
      perfil: loadPerfil(), xp, n, dentro,
      racha: streakDays(p),
      logros: logrosDe(p).filter((l) => l.ok).length,
      tiempo: fmtTiempo(leeTiempo()),
      semana: semanasActividad(p, 1),
      total: Object.keys(p).length,
    };
  });
  if (!d) return <div className="skeleton" style={{ height: 200, marginTop: 16 }} />;
  return (
    <div style={{ marginTop: 16 }}>
      <div className="card-dark" style={{ padding: 20, textAlign: "center" }}>
        <div style={{ width: 64, height: 64, borderRadius: "50%", background: "var(--accent-2)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, fontWeight: 800, marginInline: "auto" }}>
          {(d.perfil.nombre || "?").slice(0, 1).toUpperCase()}
        </div>
        <h2 style={{ fontSize: 22, marginTop: 8 }}>{d.perfil.nombre || "Estudiante"}</h2>
        <div style={{ marginTop: 8, fontWeight: 700 }}>NIVEL {d.n.nivel}</div>
        <div style={{ height: 10, background: "var(--card)", borderRadius: 999, marginTop: 6 }}>
          <div style={{ width: `${Math.round((d.dentro / 100) * 100)}%`, height: "100%", background: "var(--accent-2)", borderRadius: 999 }} />
        </div>
        <div style={{ fontSize: 13, color: "var(--mute)", marginTop: 4 }}>{d.dentro}/100 XP al siguiente nivel</div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 12 }}>
        <div className="card" style={{ padding: 16, textAlign: "center" }}><div style={{ fontSize: 22 }}>🔥</div><strong>{d.racha} días</strong><div style={{ fontSize: 12, color: "var(--mute)" }}>racha</div></div>
        <div className="card" style={{ padding: 16, textAlign: "center" }}><div style={{ fontSize: 22 }}>★</div><strong>{d.xp} XP</strong><div style={{ fontSize: 12, color: "var(--mute)" }}>total</div></div>
        <div className="card" style={{ padding: 16, textAlign: "center" }}><div style={{ fontSize: 22 }}>🏆</div><strong>{d.logros}/6</strong><div style={{ fontSize: 12, color: "var(--mute)" }}>logros</div></div>
        <div className="card" style={{ padding: 16, textAlign: "center" }}><div style={{ fontSize: 22 }}>⏱</div><strong>{d.tiempo}</strong><div style={{ fontSize: 12, color: "var(--mute)" }}>aprendiendo</div></div>
      </div>
      <div className="card" style={{ padding: 16, marginTop: 12 }}>
        <strong>Esta semana</strong>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 6, marginTop: 8 }}>
          {d.semana.map((s, i) => (
            <div key={i} title={`${s.n} retos`} style={{ aspectRatio: "1", borderRadius: 8, background: s.n > 0 ? "var(--accent-2)" : "var(--card)", border: "1px solid var(--hairline)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, color: s.n > 0 ? "#fff" : "var(--mute)" }}>
              {s.n > 0 ? "✓" : "·"}
            </div>
          ))}
        </div>
        <div style={{ fontSize: 12, color: "var(--mute)", marginTop: 4 }}>L M M J V S D · {d.total} lecciones en total</div>
      </div>
      <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
        <Link className="btn btn-secondary" href="/logros">[logros]</Link>
        <Link className="btn btn-secondary" href="/ajustes">[ajustes]</Link>
      </div>
    </div>
  );
}
