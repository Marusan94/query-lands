"use client";
import { useState } from "react";
import Link from "next/link";
import { camino, UNIDADES, type Nodo } from "@/lib/path";
import { loadProgress } from "@/lib/progress";
import { loadMastery } from "@/lib/estado";

const OFFSETS = [0, 40, 68, 80, 68, 40, 0, -40, -68, -80, -68, -40, 0, 40, 68, 80];

const UNIDAD_CLASE: Record<string, string> = {
  salvia: "duo-u-salvia",
  azul: "duo-u-azul",
  llama: "duo-u-llama",
  abeja: "duo-u-abeja",
};

function iniciales(): Nodo[] {
  if (typeof window === "undefined") return camino({});
  try {
    return camino(loadProgress(), loadMastery());
  } catch {
    return camino({});
  }
}

function Icono({ nodo }: { nodo: Nodo }) {
  const { challenge: c, estado, tipo } = nodo;
  if (estado === "bloqueado") return <>🔒</>;
  if (estado === "actual") return <>▶</>;
  if (estado === "repaso") return <>⟳</>;
  if (estado === "maestro") return <>★</>;
  return <>{tipo === "desafio" ? "★" : String(c.order).padStart(2, "0")}</>;
}

function NodoView({ nodo, index }: { nodo: Nodo; index: number }) {
  const { challenge: c, estado } = nodo;
  const offset = OFFSETS[(c.order - 1) % OFFSETS.length];
  const delay = `${Math.min(index * 60, 700)}ms`;
  const size = estado === "actual" ? 84 : 72;
  const cls =
    estado === "actual" ? "duo-node duo-actual"
    : estado === "bloqueado" ? "duo-node duo-bloqueado"
    : estado === "repaso" ? "duo-node duo-hecho"
    : estado === "maestro" ? "duo-node duo-hecho"
    : "duo-node duo-hecho";
  const extra =
    estado === "maestro" ? { background: "var(--bee)", boxShadow: "0 6px 0 #7a5c00" }
    : estado === "repaso" ? { outline: "3px dashed var(--accent)", outlineOffset: 3 }
    : {};

  if (estado === "bloqueado") {
    return (
      <div title="Completa el reto anterior para desbloquear" aria-label={`${c.titulo} bloqueado`}
        className={cls} style={{ width: size, height: size, marginLeft: offset, animationDelay: delay, fontSize: 22 }}>
        <Icono nodo={nodo} />
      </div>
    );
  }
  if (estado === "actual") {
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginLeft: offset }}>
        <Link href={`/sql/${c.id}`} className="btn btn-accent duo-tip" style={{ marginBottom: 10 }}>[EMPEZAR]</Link>
        <Link href={`/sql/${c.id}`} aria-label={`continuar: ${c.titulo}`} className={cls}
          style={{ width: size, height: size, marginLeft: 0, fontSize: 26 }}>
          <Icono nodo={nodo} />
        </Link>
      </div>
    );
  }
  return (
    <Link href={`/sql/${c.id}`} aria-label={`${c.titulo} — ${estado}`} title={`${c.titulo}${estado === "repaso" ? " — conviene repasar" : ""}`}
      className={cls} style={{ width: size, height: size, marginLeft: offset, animationDelay: delay, fontSize: 18, ...extra }}>
      <Icono nodo={nodo} />
    </Link>
  );
}

export default function PathView() {
  const [nodos] = useState(iniciales);
  let global = 0;
  return (
    <div>
      {UNIDADES.map((u) => {
        const del = nodos.filter((n) => n.unidad.id === u.id);
        if (!del.length) return null;
        const hechos = del.filter((n) => ["hecho", "maestro"].includes(n.estado)).length;
        return (
          <section key={u.id} aria-label={u.titulo} style={{ marginTop: 20 }}>
            <div className={`duo-unit ${UNIDAD_CLASE[u.color]}`} style={{ padding: 16 }}>
              <div style={{ fontWeight: 800, fontSize: 17 }}>{u.titulo}</div>
              <div style={{ fontSize: 14, opacity: 0.9 }}>{u.descripcion}</div>
              <div style={{ height: 8, background: "rgba(255,255,255,.35)", borderRadius: 999, marginTop: 8 }}>
                <div style={{ width: `${Math.round((hechos / del.length) * 100)}%`, height: "100%", background: "#fff", borderRadius: 999 }} />
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 24, alignItems: "center", padding: "26px 0 6px" }}>
              {del.map((n) => {
                const i = global++;
                return <NodoView key={n.challenge.id} nodo={n} index={i} />;
              })}
            </div>
          </section>
        );
      })}
      <section aria-label="cofre final" style={{ marginTop: 4, display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
        <Link href="/sql/simulacro" aria-label="cofre: simulacro final" className="duo-chest" style={{ width: 80, height: 80, fontSize: 28 }}>
          ★
        </Link>
        <span style={{ fontSize: 14, color: "var(--mute)" }}>simulacro 45min</span>
      </section>
    </div>
  );
}
