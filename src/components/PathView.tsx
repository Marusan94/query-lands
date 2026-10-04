"use client";
import { useState } from "react";
import Link from "next/link";
import { camino, type Nodo } from "@/lib/path";
import { loadProgress } from "@/lib/progress";
import { loadMastery } from "@/lib/estado";

const OFFSETS = [0, 40, 68, 80, 68, 40, 0, -40, -68, -80, -68, -40, 0, 40, 68, 80];

const UNIDUD_ICONS: Record<string, string> = {
  salvia: "🌿",
  azul: "🌊",
  llama: "🔥",
  abeja: "🐝",
};

const UNIDUD_EMOJIS: Record<string, { completado: string; actual: string; bloqueado: string }> = {
  salvia: { completado: "✦", actual: "🌱", bloqueado: "🔒" },
  azul: { completado: "✦", actual: "🌊", bloqueado: "🔒" },
  llama: { completado: "✦", actual: "🔥", bloqueado: "🔒" },
  abeja: { completado: "✦", actual: "🐝", bloqueado: "🔒" },
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
  const color = nodo.unidad?.color || "salvia";
  const iconos = UNIDUD_EMOJIS[color] || UNIDUD_EMOJIS.salvia;
  
  if (estado === "bloqueado") return <span aria-hidden>{iconos.bloqueado}</span>;
  if (estado === "actual") return <span aria-hidden>{iconos.actual}</span>;
  if (estado === "repaso") return <span aria-hidden>🔄</span>;
  if (estado === "maestro") return <span aria-hidden>👑</span>;
  return <span aria-hidden>{tipo === "desafio" ? "⚔" : String(c.order).padStart(2, "0")}</span>;
}

function NodoView({ nodo, index }: { nodo: Nodo; index: number }) {
  const { challenge: c, estado } = nodo;
  const offset = OFFSETS[(c.order - 1) % OFFSETS.length];
  const delay = `${Math.min(index * 60, 700)}ms`;
  const size = estado === "actual" ? 88 : 76;
  const color = nodo.unidad?.color || "salvia";
  
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

  const unidadIcon = UNIDUD_ICONS[nodo.unidad?.color || "salvia"] || "⚔";
  const tooltipBase = `${unidadIcon} ${c.titulo} · ${c.empresa_patron} · +${c.xp || (c.dificultad === "facil" ? 10 : c.dificultad === "media" ? 20 : 30)} XP`;

  if (estado === "bloqueado") {
    return (
      <div title={tooltipBase} aria-label={`${tooltipBase} · bloqueado`}
        className={cls} style={{ width: size, height: size, marginLeft: offset, animationDelay: delay, fontSize: 24 }}>
      <Icono nodo={nodo} />
      </div>
    );
  }
  
  if (estado === "actual") {
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginLeft: offset }}>
        <Link href={`/sql/${c.id}`} className="btn btn-accent duo-tip btn-rpg" style={{ marginBottom: 10, minHeight: 40, fontSize: 10 }}>
          [⚔ ENTRAR]
        </Link>
        <Link href={`/sql/${c.id}`} aria-label={`${tooltipBase} · en progreso`} className={cls}
          style={{ width: size, height: size, marginLeft: 0, fontSize: 28 }}>
        <Icono nodo={nodo} />
        </Link>
      </div>
    );
  }
  
  return (
    <Link href={`/sql/${c.id}`} aria-label={`${tooltipBase} · ${estado}`} title={`${tooltipBase}${estado === "repaso" ? " · conviene repasar" : ""}`}
      className={cls} style={{ width: size, height: size, marginLeft: offset, animationDelay: delay, fontSize: 20, ...extra }}>
    <Icono nodo={nodo} />
    </Link>
  );
}

export default function PathView() {
  const [nodos] = useState(iniciales);
  
  const totalRetos = nodos.length;
  const completados = nodos.filter((n) => ["hecho", "maestro"].includes(n.estado)).length;
  const maestros = nodos.filter((n) => n.estado === "maestro").length;

  return (
    <div>
      {/* Header del camino con stats globales */}
      <div className="card-elev" style={{ padding: 20, marginBottom: 16, borderColor: "var(--accent)" }}>
        <div style={{ display: "flex", gap: 24, alignItems: "center", flexWrap: "wrap", marginBottom: 12 }}>
          <h2 style={{ fontFamily: "var(--font-rpg)", fontSize: 16, textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--accent)" }}>
            ⚔ CAMINO DEL RECLUTA
          </h2>
          <div style={{ display: "flex", gap: 20, fontSize: 12, fontFamily: "var(--font-rpg)", fontWeight: 700 }}>
            <span style={{ color: "var(--accent)" }}>⚔ {completados}/{totalRetos}</span>
            <span style={{ color: "var(--bee)" }}>👑 {maestros} MAESTRÍA</span>
            <span style={{ color: "var(--streak)" }}>🔥 RACHA</span>
          </div>
        </div>
        <div style={{ height: 10, background: "var(--card)", borderRadius: 999, overflow: "hidden", boxShadow: "inset 0 2px 8px rgba(0,0,0,0.4)" }}>
          <div style={{ 
            width: `${Math.round((completados / totalRetos) * 100)}%`, 
            height: "100%", 
            background: "linear-gradient(90deg, var(--accent), var(--bee))",
            transition: "width 0.6s ease-out" }}>
          </div>
        </div>
      </div>
      
      <div style={{ display: "flex", flexDirection: "column", gap: 8, alignItems: "flex-start" }}>
        {nodos.map((n, i) => <NodoView key={n.challenge.id} nodo={n} index={i} />)}
      </div>
      
      <p style={{ marginTop: 20, fontSize: 11, color: "var(--muted)", fontFamily: "var(--font-rpg)", textAlign: "center" }}>
        [⚔] Retos técnicos · [👑] Maestría · [🔄] Repaso · [🔒] Bloqueado
      </p>
    </div>
  );
}