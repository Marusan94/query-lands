"use client";
import { useState } from "react";
import Link from "next/link";
import { loadProgress } from "@/lib/progress";
import { loadPerfil, xpHoy } from "@/lib/estado";
import { siguienteJs } from "@/lib/home-utils";
import { siguienteReto } from "@/lib/path";
import IslaMap from "@/components/IslaMap";
import CapybaraCompanion, { CapybaraTip } from "@/components/CapybaraCompanion";

const TRACK_LABELS: Record<string, { label: string; desc: string }> = {
  sql: { label: "SQL PARA RETOS", desc: "Consultas reales de retos técnicos" },
  js: { label: "JS ALGORÍTMICO", desc: "Filtros frontend con tests ocultos" },
};

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
  const trackInfo = e?.perfil.track ? TRACK_LABELS[e.perfil.track] : TRACK_LABELS.sql;

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
  const nivelNum = parseInt(perfil.nivel) || 1;

  return (
    <div>
      {/* Capibara companion - aparece en la esquina */}
      <CapybaraCompanion xp={meta} streak={perfil.rachaActual} nivel={nivelNum} track={perfil.track} />

      {/* Header con track actual */}
      <div className="card-elev" style={{ padding: 20, marginTop: 16 }}>
        <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap", marginBottom: 16 }}>
          <span className={perfil.track === "sql" ? "track-sql" : "track-js"}>{trackInfo.label}</span>
          <strong style={{ fontSize: 18 }}>{trackInfo.desc}</strong>
          <Link href="/cursos" style={{ marginLeft: "auto", fontSize: 11, fontFamily: "var(--font-rpg)" }}>[CAMBIAR RUTA]</Link>
        </div>

        {/* Meta diaria con barra verde */}
        <div style={{ marginTop: 8 }}>
          <div style={{ display: "flex", fontSize: 13, fontWeight: 700, gap: 16 }}>
            <span>META DIARIA</span>
            <span style={{ marginLeft: "auto", color: "var(--accent)" }}>{meta} / {perfil.metaDiaria} XP</span>
          </div>
          <div style={{ height: 14, background: "var(--card)", borderRadius: 999, overflow: "hidden", marginTop: 8, boxShadow: "inset 0 2px 4px rgba(0,0,0,0.3)" }}>
            <div style={{ width: `${pct}%`, height: "100%", background: "linear-gradient(90deg, var(--accent), #26a85a)", borderRadius: 999, transition: "width 600ms cubic-bezier(.34,1.4,.64,1)" }} />
          </div>
          <div style={{ fontSize: 12, color: "var(--mute)", marginTop: 6, fontFamily: "var(--font-rpg)", textTransform: "uppercase", letterSpacing: "0.03em" }}>
            {falta === 0 ? "✦ META CUMPLIDA ⚔" : `FALTAN ${falta} XP PARA LA META`}
          </div>
        </div>
      </div>

      {/* Botón SEGUIR - verde principal */}
      {siguiente ? (
        <Link href={perfil.track === "js" && typeof siguiente === "object" && "firma" in siguiente ? `/js/${siguiente.id}` : `/sql/${(siguiente as { id: string }).id}`}
          className="btn btn-accent btn-rpg" style={{ width: "100%", marginTop: 16, minHeight: 56, fontSize: 12 }}>
          [⚔ SEGUIR · {siguiente.titulo.toUpperCase()}]
        </Link>
      ) : (
        <div className="card-elev" style={{ padding: 20, marginTop: 16, borderColor: "var(--accent)" }}>
          <strong style={{ color: "var(--accent)" }}>[✦ RUTA COMPLETADA]</strong>
          <p style={{ fontSize: 13, color: "var(--body)", marginTop: 8 }}>Repasa débiles, haz el simulacro o explora nuevos retos.</p>
          <div style={{ display: "flex", gap: 10, marginTop: 12 }}>
            <Link className="btn btn-secondary btn-rpg" href="/repasar" style={{ minHeight: 44 }}>[REPASAR]</Link>
            <Link className="btn btn-accent btn-rpg" href="/sql/simulacro" style={{ minHeight: 44 }}>[SIMULACRO 45&apos;]</Link>
          </div>
        </div>
      )}

      {/* Onboarding para nuevos reclutas */}
      {!perfil.listo && (
        <div className="card-elev" style={{ padding: 20, marginTop: 16, background: "var(--accent-soft)", borderColor: "var(--accent)" }}>
          <strong style={{ color: "var(--accent)" }}>[⚠ NUEVO RECLUTA DETECTADO]</strong>
          <p style={{ fontSize: 13, color: "var(--body)", marginTop: 8 }}>Cuéntanos tu objetivo en 30 segundos. El capibara te guiará.</p>
          <div style={{ marginTop: 12 }}>
            <Link className="btn btn-accent btn-rpg" href="/empezar" style={{ width: "100%", minHeight: 48 }}>[COMENZAR ENTRENAMIENTO]</Link>
          </div>
        </div>
      )}

      {/* Mapa del viaje */}
      <div style={{ marginTop: 28 }}>
        <h2 style={{ fontSize: 20, fontFamily: "var(--font-rpg)", letterSpacing: "0.03em", textTransform: "uppercase", color: "var(--ink)", marginBottom: 8 }}>TU VIAJE</h2>
        <p style={{ fontSize: 13, color: "var(--body)", maxWidth: "60ch" }}>Navega isla por isla. Al llegar, entra a la sala y sube de nivel piso por piso. El capibara te espera en cada reto.</p>
        {perfil.track === "sql" ? <IslaMap /> : (
          <div className="card-elev" style={{ padding: 20, marginTop: 16, borderColor: "var(--gem)", background: "var(--gem-soft)" }}>
            <strong style={{ color: "var(--gem)" }}><span className="track-js">JS</span> RUTA ALGORÍTMICA</strong>
            <p style={{ fontSize: 13, color: "var(--body)", marginTop: 6 }}>3 retos de filtros frontend con tests ocultos.</p>
            <Link href="/js" className="btn btn-accent btn-rpg" style={{ width: "100%", marginTop: 10, minHeight: 44 }}>[ABRIR RUTA JS ⚡]</Link>
          </div>
        )}

        {/* Capibara tip contextual */}
        <CapybaraTip track={perfil.track} />
      </div>
    </div>
  );
}