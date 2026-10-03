"use client";
import Link from "next/link";
import { useState } from "react";
import { loadProgress, streakDays } from "@/lib/progress";
import { questsHoy } from "@/lib/estado";
import { logrosDe } from "@/lib/logros";

export default function DesafiosClient() {
  const [d] = useState(() => {
    if (typeof window === "undefined") return null;
    const p = loadProgress();
    return { quests: questsHoy(p), racha: streakDays(p), logros: logrosDe(p).filter((l) => l.ok).length };
  });
  if (!d) return <div className="skeleton" style={{ height: 120, marginTop: 16 }} />;
  const hechas = d.quests.filter((q) => q.lista).length;
  return (
    <div style={{ marginTop: 16 }}>
      <div className="card" style={{ padding: 16 }}>
        <div style={{ display: "flex", fontWeight: 700 }}><span>MISIONES DE HOY</span><span style={{ marginLeft: "auto" }}>{hechas}/3</span></div>
        <div style={{ display: "grid", gap: 12, marginTop: 12 }}>
          {d.quests.map((q) => (
            <div key={q.id}>
              <div style={{ display: "flex", fontSize: 14 }}>
                <span>{q.lista ? "☑" : "☐"} {q.titulo}</span>
                <span style={{ marginLeft: "auto", color: "var(--mute)" }}>{q.actual}/{q.meta}</span>
              </div>
              <div style={{ height: 8, background: "var(--card)", borderRadius: 999, marginTop: 4 }}>
                <div style={{ width: `${Math.round((q.actual / q.meta) * 100)}%`, height: "100%", background: q.lista ? "var(--accent-2)" : "var(--accent)", borderRadius: 999 }} />
              </div>
            </div>
          ))}
        </div>
      </div>
      <div style={{ display: "grid", gap: 12, marginTop: 12 }}>
        <Link href="/sql/simulacro" className="card" style={{ padding: 16, textDecoration: "none", color: "inherit" }}>
          <strong>[★] Simulacro 45 min</strong>
          <div style={{ fontSize: 14, color: "var(--body)" }}>4 retos como en entrevista real.</div>
        </Link>
        <Link href="/logros" className="card" style={{ padding: 16, textDecoration: "none", color: "inherit" }}>
          <strong>[🏆] Logros · {d.logros}/6</strong>
          <div style={{ fontSize: 14, color: "var(--body)" }}>Racha actual: {d.racha} días.</div>
        </Link>
      </div>
    </div>
  );
}
