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
      <div className="card-elev" style={{ padding: 16 }}>
        <div style={{ display: "flex", fontWeight: 700, fontFamily: "var(--font-rpg)", textTransform: "uppercase" }}><span>MISIONES DE HOY</span><span style={{ marginLeft: "auto", color: "var(--accent)" }}>{hechas}/3</span></div>
        <div style={{ display: "grid", gap: 12, marginTop: 12 }}>
          {d.quests.map((q) => (
            <div key={q.id} className="card-elev" style={{ padding: 12 }}>
              <div style={{ display: "flex", fontSize: 13, fontFamily: "var(--font-rpg)", textTransform: "uppercase" }}>
                <span>{q.lista ? "✦" : "⚔"} {q.titulo}</span>
                <span style={{ marginLeft: "auto", color: "var(--mute)", fontFamily: "var(--font-rpg)" }}>{q.actual}/{q.meta}</span>
              </div>
              <div style={{ height: 8, background: "var(--card)", borderRadius: 999, marginTop: 4 }}>
                <div style={{ width: `${Math.round((q.actual / q.meta) * 100)}%`, height: "100%", background: q.lista ? "var(--accent)" : "var(--bee)", borderRadius: 999 }} />
              </div>
            </div>
          ))}
        </div>
      </div>
      <div style={{ display: "grid", gap: 12, marginTop: 12 }}>
        <Link href="/sql/simulacro" className="card-elev" style={{ padding: 16, textDecoration: "none", color: "inherit", borderColor: "var(--accent)" }}>
          <strong style={{ color: "var(--accent)" }}>[🏰] SIMULACRO 45&apos;</strong>
          <div style={{ fontSize: 13, color: "var(--body)", marginTop: 4 }}>4 retos como en prueba real&apos;.</div>
        </Link>
        <Link href="/logros" className="card-elev" style={{ padding: 16, textDecoration: "none", color: "inherit", borderColor: "var(--bee)" }}>
          <strong style={{ color: "var(--bee)" }}>[👑] LOGROS · {d.logros}/6</strong>
          <div style={{ fontSize: 13, color: "var(--body)", marginTop: 4 }}>Racha actual: {d.racha} días.</div>
        </Link>
      </div>
    </div>
  );
}