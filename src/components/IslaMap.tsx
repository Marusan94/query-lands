"use client";
import { useState } from "react";
import Link from "next/link";
import { camino, UNIDADES, type Nodo } from "@/lib/path";
import { loadProgress } from "@/lib/progress";
import { loadMastery } from "@/lib/estado";

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

function Mar({ unidad, estado, onClick }: { 
  unidad: { id: string; color: string; titulo: string }; 
  estado: "bloqueado" | "actual" | "completado" | "maestro";
  onClick?: () => void;
}) {
  const iconos = UNIDUD_EMOJIS[unidad.color] || UNIDUD_EMOJIS.salvia;
  const icon = 
    estado === "bloqueado" ? iconos.bloqueado :
    estado === "actual" ? iconos.actual :
    estado === "maestro" ? "👑" : "✦";
    
  const cls = 
    estado === "bloqueado" ? "isla isla-bloqueada" :
    estado === "actual" ? "isla isla-actual" :
    estado === "maestro" ? "isla isla-maestra" :
    "isla isla-completada";
    
  return (
    <div 
      className={cls}
      onClick={onClick}
      style={{ cursor: onClick ? "pointer" : "default" }}
      aria-label={`${UNIDUD_ICONS[unidad.color]} ${unidad.titulo} · ${estado}`}
    >
      <span aria-hidden style={{ fontSize: 40 }}>{icon}</span>
      <div style={{ 
        fontSize: 9, 
        fontFamily: "var(--font-rpg)", 
        textTransform: "uppercase",
        letterSpacing: "0.05em",
        marginTop: 4,
        color: estado === "bloqueado" ? "var(--muted)" : "inherit"
      }}>
        {unidad.titulo.toUpperCase()}
      </div>
      {estado === "actual" && <div style={{ fontSize: 8, color: "var(--accent)", marginTop: 2 }}>[ACTIVA]</div>}
      {estado === "maestro" && <div style={{ fontSize: 8, color: "var(--bee)", marginTop: 2 }}>[MAESTRÍA]</div>}
    </div>
  );
}

export default function IslaMap() {
  const [nodos] = useState(iniciales);
  
  const estadoUnidad = (id: string) => {
    const nodosUnidad = nodos.filter(n => n.unidad?.id === id);
    if (nodosUnidad.length === 0) return "bloqueado";
    const completados = nodosUnidad.filter(n => ["hecho", "maestro"].includes(n.estado)).length;
    const maestros = nodosUnidad.filter(n => n.estado === "maestro").length;
    if (maestros === nodosUnidad.length) return "maestro";
    if (completados === nodosUnidad.length) return "completado";
    if (nodosUnidad.some(n => n.estado === "actual")) return "actual";
    return "bloqueado";
  };
  
  const unidadesOrden = ["salvia", "azul", "llama", "abeja"];

  return (
    <div className="isla-mapa">
      <h3 style={{ 
        fontFamily: "var(--font-rpg)", 
        fontSize: 14, 
        textTransform: "uppercase", 
        letterSpacing: "0.05em", 
        color: "var(--accent)",
        marginBottom: 16,
        textAlign: "center"
      }}>
        🏝 ARCHIPIÉLAGO DEL CONOCIMIENTO
      </h3>
      
      <div style={{ 
        display: "grid", 
        gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", 
        gap: 16 
      }}>
        {unidadesOrden.map(id => {
          const u = UNIDADES.find(x => x.id === id);
          if (!u) return null;
          const estado = estadoUnidad(id);
          const habilitado = estado !== "bloqueado";
          
          return (
            <Link 
              key={id} 
              href={`/sql?unidad=${id}`}
              className="duo-tip"
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <Mar 
                unidad={u} 
                estado={estado} 
                onClick={habilitado ? undefined : () => {}}
              />
              <div style={{ 
                marginTop: 8, 
                fontSize: 10, 
                color: "var(--muted)",
                textAlign: "center"
              }}>
                {nodos.filter(n => n.unidad?.id === id).length} retos
              </div>
            </Link>
          );
        })}
      </div>
      
      <p style={{ marginTop: 20, fontSize: 10, color: "var(--muted)", fontFamily: "var(--font-rpg)", textAlign: "center" }}>
        Las islas se desbloquean al completar la anterior · [🔒] Bloqueada · [✦] Completada · [🌱] Activa · [👑] Maestría
      </p>
    </div>
  );
}