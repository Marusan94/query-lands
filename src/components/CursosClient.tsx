"use client";
import Link from "next/link";
import { useState } from "react";
import { challenges } from "@/lib/curriculum";
import { jsChallenges } from "@/lib/curriculumJs";
import { loadProgress } from "@/lib/progress";
import { loadPerfil, savePerfil } from "@/lib/estado";

export default function CursosClient() {
  const [track, setTrack] = useState(() => (typeof window === "undefined" ? "sql" : loadPerfil().track));
  const p = typeof window === "undefined" ? {} : loadProgress();
  const sqlN = challenges.filter((c) => p[c.id]).length;
  const jsN = jsChallenges.filter((c) => p[`js-${c.id}`]).length;

  function elegir(t: "sql" | "js") {
    setTrack(t);
    const perfil = loadPerfil();
    savePerfil({ ...perfil, track: t });
  }
  return (
    <div style={{ display: "grid", gap: 12, marginTop: 16 }}>
      {([
        { t: "sql" as const, nombre: "SQL para entrevistas", n: sqlN, total: challenges.length },
        { t: "js" as const, nombre: "JavaScript de entrevistas", n: jsN, total: jsChallenges.length },
      ]).map((c) => (
        <div key={c.t} className="card" style={{ padding: 16, borderColor: track === c.t ? "var(--accent)" : undefined }}>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <span className={c.t === "sql" ? "track-sql" : "track-js"}>{c.t.toUpperCase()}</span>
            <strong>{c.nombre}</strong>
          </div>
          <div style={{ height: 10, background: "var(--card)", borderRadius: 999, marginTop: 8 }}>
            <div style={{ width: `${Math.round((c.n / c.total) * 100)}%`, height: "100%", background: "var(--accent-2)", borderRadius: 999 }} />
          </div>
          <div style={{ fontSize: 13, color: "var(--mute)", marginTop: 4 }}>{c.n}/{c.total} · {Math.round((c.n / c.total) * 100)}%</div>
          <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
            <Link className="btn btn-accent" href={c.t === "sql" ? "/sql" : "/js"}>[abrir]</Link>
            {track !== c.t && <button className="btn btn-secondary" onClick={() => elegir(c.t)}>[hacer mi curso]</button>}
          </div>
        </div>
      ))}
    </div>
  );
}
