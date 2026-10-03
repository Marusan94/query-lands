"use client";
import { useState } from "react";
import Link from "next/link";
import { loadProgress } from "@/lib/progress";
import { loadPerfil, xpHoy } from "@/lib/estado";
import { siguienteJs } from "@/lib/home-utils";
import { siguienteReto } from "@/lib/path";
import IslaMap from "@/components/IslaMap";

function estadoInicial() {
  if (typeof window === "undefined") return null;
  const perfil = loadPerfil();
  const p = loadProgress();
  const cont = perfil.track === "js" ? siguienteJs(p) : null;
  const sql = siguienteReto(p);
  return { perfil, meta: xpHoy(p), siguiente: cont ?? sql };
}

export default function HomeClient() {
  const [e] = useState(estadoInicial);
  if (!e) {
    return (
      <div style={{ display: "grid", gap: 12, marginTop: 16 }}>
        <div className="skeleton" style={{ height: 88 }} />
        <div className="skeleton" style={{ height: 64 }} />
        <div className="skeleton" style={{ height: 200 }} />
      </div>
    );
  }
  const { perfil, meta, siguiente } = e;
  const falta = Math.max(0, perfil.metaDiaria - meta);
  const pct = Math.min(100, Math.round((meta / perfil.metaDiaria) * 100));
  return (
    <div>
      <div className="card" style={{ padding: 16, marginTop: 16 }}>
        <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
          <span className={perfil.track === "sql" ? "track-sql" : "track-js"}>{perfil.track.toUpperCase()}</span>
          <strong>{perfil.track === "sql" ? "SQL para entrevistas" : "JavaScript de entrevistas"}</strong>
          <Link href="/cursos" style={{ marginLeft: "auto", fontSize: 14 }}>[cambiar]</Link>
        </div>
        <div style={{ marginTop: 12 }}>
          <div style={{ display: "flex", fontSize: 14, fontWeight: 700 }}>
            <span>META DIARIA</span>
            <span style={{ marginLeft: "auto" }}>{meta} / {perfil.metaDiaria} XP</span>
          </div>
          <div style={{ height: 12, background: "var(--card)", borderRadius: 999, overflow: "hidden", marginTop: 6 }}>
            <div style={{ width: `${pct}%`, height: "100%", background: "var(--accent-2)", borderRadius: 999 }} />
          </div>
          <div style={{ fontSize: 13, color: "var(--mute)", marginTop: 4 }}>
            {falta === 0 ? "¡Meta cumplida por hoy! 🎉" : `Te faltan ${falta} XP.`}
          </div>
        </div>
      </div>

      {siguiente ? (
        <Link href={perfil.track === "js" && typeof siguiente === "object" && "firma" in siguiente ? `/js/${siguiente.id}` : `/sql/${(siguiente as { id: string }).id}`}
          className="btn btn-accent" style={{ width: "100%", marginTop: 16, minHeight: 52 }}>
          [CONTINUAR → {siguiente.titulo}]
        </Link>
      ) : (
        <div className="card" style={{ padding: 16, marginTop: 16 }}>
          <strong>[+] Curso completado.</strong> Repasa débiles o haz el simulacro.
          <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
            <Link className="btn btn-secondary" href="/repasar">[repasar]</Link>
            <Link className="btn btn-secondary" href="/sql/simulacro">[simulacro]</Link>
          </div>
        </div>
      )}

      {!perfil.listo && (
        <div className="card" style={{ padding: 16, marginTop: 16, background: "var(--accent-2-soft)" }}>
          <strong>[?] ¿Primera vez?</strong> Cuéntanos tu objetivo en 30 segundos.
          <div style={{ marginTop: 8 }}><Link className="btn btn-primary" href="/empezar">[empezar]</Link></div>
        </div>
      )}

      <div style={{ marginTop: 24 }}>
        <h2 style={{ fontSize: 22 }}>Tu viaje</h2>
        <p style={{ fontSize: 14, color: "var(--body)" }}>Navega isla por isla. Al llegar, entra a la sala y sube de nivel piso por piso.</p>
        {perfil.track === "sql" ? <IslaMap /> : (
      <div className="card-dark" style={{ padding: 16, marginTop: 16 }}>
            <strong><span className="track-js">js</span> Tu curso actual</strong>
            <p style={{ fontSize: 14, color: "var(--body)", marginTop: 4 }}>3 retos de filtros frontend con tests ocultos.</p>
            <Link href="/js" className="btn btn-accent" style={{ width: "100%", marginTop: 8 }}>[ABRIR TRACK JS →]</Link>
          </div>
        )}
      </div>
    </div>
  );
}
