"use client";
import Link from "next/link";
import { useState } from "react";
import { camino, UNIDADES } from "@/lib/path";
import { loadProgress } from "@/lib/progress";
import { loadMastery, dominio } from "@/lib/estado";
import { xpFor } from "@/lib/curriculum";

const UNIDAD_ICONS: Record<string, string> = {
  salvia: "🌿",
  azul: "🌊",
  llama: "🔥",
  abeja: "🐝",
};

export default function SalaClient({ unidadId }: { unidadId: string }) {
  const [d] = useState(() => {
    if (typeof window === "undefined") return null;
    try {
      const p = loadProgress();
      const m = loadMastery();
      const u = UNIDADES.find((x) => x.id === unidadId)!;
      const nodos = camino(p, m).filter((n) => n.unidad.id === unidadId);
      return { u, nodos, m };
    } catch {
      return null;
    }
  });
  if (!d) return <div className="skeleton" style={{ height: 200, marginTop: 16 }} />;
  const { u, nodos, m } = d;
  const total = nodos.length;
  const pisos = [...nodos].reverse();

  const iconoUnidad = UNIDAD_ICONS[u.color] || "⚔";

  return (
    <div style={{ marginTop: 16 }}>
      <div className="card-elev" style={{ padding: 20, borderColor: "var(--accent)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
          <span style={{ fontSize: 28, filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.5))" }} aria-hidden>{iconoUnidad}</span>
          <div>
            <div style={{ fontWeight: 800, fontSize: 18, textTransform: "uppercase", letterSpacing: "0.02em", color: "var(--accent)", fontFamily: "var(--font-rpg)" }}>SALA {u.titulo.toUpperCase()}</div>
            <div style={{ fontSize: 13, color: "var(--body)", marginTop: 4, fontFamily: "var(--font-rpg)", textTransform: "uppercase" }}>{u.descripcion}. Sube piso por piso: cada nivel da XP.</div>
          </div>
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 16 }}>
        {pisos.map((n, i) => {
          const piso = total - i;
          const c = n.challenge;
          const dom = dominio(m, c.id);
          const esActual = n.estado === "actual";
          const color = n.unidad?.color || "salvia";
          const unidadIcon = UNIDAD_ICONS[color] || "⚔";
          
          return (
            <Link key={c.id} href={`/sql/${c.id}`} aria-label={`piso ${piso}: ${c.titulo}`}
              className="card-elev piso"
              style={{
                padding: 16, textDecoration: "none", color: "inherit",
                animationDelay: `${i * 90}ms`,
                borderColor: esActual ? "var(--accent)" : undefined,
                background: esActual ? "var(--accent-soft)" : undefined,
                opacity: n.estado === "bloqueado" ? 0.55 : 1,
              }}>
              <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
                <span style={{
                  minWidth: 60, height: 60, borderRadius: 16, display: "flex", alignItems: "center", justifyContent: "center",
                  fontWeight: 800, fontFamily: "var(--font-rpg)", textTransform: "uppercase",
                  background: n.estado === "bloqueado" ? "var(--card)" : "var(--ink)", color: n.estado === "bloqueado" ? "var(--mute)" : "var(--canvas)",
                  fontSize: 14,
                }}>
                  {n.estado === "bloqueado" ? "🔒" : `N${piso}`}
                </span>
                <span>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                    <span style={{ fontSize: 20 }} aria-hidden>{unidadIcon}</span>
                    <strong>{c.titulo}</strong>
                  </div>
                  <span style={{ display: "block", fontSize: 12, color: "var(--body)", fontFamily: "var(--font-rpg)", textTransform: "uppercase" }}>
                    <span className="st-xp">⚔ +{xpFor(c)} XP</span> · 🎯 dominio {dom}% · 🏢 {c.empresa_patron}
                  </span>
                </span>
                <span style={{ marginLeft: "auto", fontSize: 22 }} aria-hidden>
                  {n.estado === "actual" ? "⚔" : n.estado === "bloqueado" ? "" : n.estado === "repaso" ? "🔄" : n.tipo === "desafio" ? "⚔" : "👑"}
                </span>
              </div>
              {esActual && (
                <span className="btn btn-accent btn-rpg" style={{ width: "100%", marginTop: 10, minHeight: 44 }}>[⚔ SUBIR DE NIVEL]</span>
              )}
            </Link>
          );
        })}
      </div>
      <div style={{ fontSize: 12, color: "var(--mute)", marginTop: 18, fontFamily: "var(--font-rpg)", textTransform: "uppercase" }}>
        [⚔] <Link href="/" style={{ color: "var(--accent)" }}>VOLVER AL VIAJE</Link>
      </div>
    </div>
  );
}