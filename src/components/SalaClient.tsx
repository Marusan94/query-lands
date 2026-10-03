"use client";
import Link from "next/link";
import { useState } from "react";
import { camino, UNIDADES } from "@/lib/path";
import { loadProgress } from "@/lib/progress";
import { loadMastery, dominio } from "@/lib/estado";
import { xpFor } from "@/lib/curriculum";

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

  return (
    <div style={{ marginTop: 16 }}>
      <div className="card" style={{ padding: 16 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: "var(--mute)" }}>SALA · {u.titulo.toUpperCase()}</div>
        <div style={{ fontSize: 14, color: "var(--body)", marginTop: 4 }}>{u.descripcion}. Sube piso por piso: cada nivel da XP.</div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 16 }}>
        {pisos.map((n, i) => {
          const piso = total - i;
          const c = n.challenge;
          const dom = dominio(m, c.id);
          const esActual = n.estado === "actual";
          return (
            <Link key={c.id} href={`/sql/${c.id}`} aria-label={`piso ${piso}: ${c.titulo}`}
              className="card piso"
              style={{
                padding: 14, textDecoration: "none", color: "inherit",
                animationDelay: `${i * 90}ms`,
                borderColor: esActual ? "var(--accent)" : undefined,
                background: esActual ? "var(--accent-soft)" : undefined,
                opacity: n.estado === "bloqueado" ? 0.65 : 1,
              }}>
              <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                <span style={{
                  minWidth: 56, height: 56, borderRadius: 16, display: "flex", alignItems: "center", justifyContent: "center",
                  fontWeight: 800, background: n.estado === "bloqueado" ? "var(--card)" : "var(--ink)", color: n.estado === "bloqueado" ? "var(--mute)" : "var(--canvas)",
                }}>
                  {n.estado === "bloqueado" ? "🔒" : `N${piso}`}
                </span>
                <span>
                  <strong>{c.titulo}</strong>
                  <span style={{ display: "block", fontSize: 13, color: "var(--body)" }}>
                    <span className="st-xp">+{xpFor(c)} XP</span> · dominio {dom}% · {c.empresa_patron}
                  </span>
                </span>
                <span style={{ marginLeft: "auto", fontSize: 20 }} aria-hidden>
                  {n.estado === "actual" ? "▶" : n.estado === "bloqueado" ? "" : n.estado === "repaso" ? "⟳" : n.tipo === "desafio" ? "★" : "✓"}
                </span>
              </div>
              {esActual && (
                <span className="btn btn-accent" style={{ width: "100%", marginTop: 10 }}>[SUBIR DE NIVEL →]</span>
              )}
            </Link>
          );
        })}
      </div>
      <div style={{ fontSize: 13, color: "var(--mute)", marginTop: 16 }}>
        [←] <Link href="/">volver al viaje</Link>
      </div>
    </div>
  );
}
