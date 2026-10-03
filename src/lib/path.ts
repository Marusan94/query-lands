import { challenges, type Challenge } from "./curriculum";
import type { ProgressMap } from "./progress";
import { dominio, necesitaRepaso, type Mastery } from "./estado";

export type Unidad = {
  id: string;
  titulo: string;
  descripcion: string;
  color: "salvia" | "azul" | "llama" | "abeja";
  desde: number;
  hasta: number;
};

export const UNIDADES: Unidad[] = [
  { id: "u1", titulo: "Unidad 1 · Fundamentos", descripcion: "SELECT, WHERE, ORDER, LIKE", color: "salvia", desde: 1, hasta: 4 },
  { id: "u2", titulo: "Unidad 2 · Combinar y agrupar", descripcion: "JOIN, GROUP BY, subqueries, CASE", color: "azul", desde: 5, hasta: 9 },
  { id: "u3", titulo: "Unidad 3 · Ventanas", descripcion: "CTE, RANK, rolling AVG", color: "llama", desde: 10, hasta: 12 },
  { id: "u4", titulo: "Unidad 4 · Nivel entrevista", descripcion: "Mediana, YoY, rachas, self-joins", color: "abeja", desde: 13, hasta: 16 },
];

export type NodoEstado = "hecho" | "actual" | "bloqueado" | "repaso" | "maestro";
export type NodoTipo = "leccion" | "desafio";

export type Nodo = { challenge: Challenge; estado: NodoEstado; tipo: NodoTipo; unidad: Unidad };

export function unidadDe(order: number): Unidad {
  return UNIDADES.find((u) => order >= u.desde && order <= u.hasta) ?? UNIDADES[0];
}

// Desbloqueo estilo Duolingo: el reto N se abre al completar N-1. El 1 siempre abierto.
// Hechos con dominio perfecto = maestro; hechos que piden repaso = repaso;
// con tests ocultos = desafío. La ruta visual es fija (§45).
export function camino(p: ProgressMap, m: Mastery = {}): Nodo[] {
  const ordenados = [...challenges].sort((a, b) => a.order - b.order);
  let desbloqueadoHasta = 1;
  for (const c of ordenados) {
    if (p[c.id]) desbloqueadoHasta = c.order + 1;
    else break;
  }
  return ordenados.map((c) => {
    const tipo: NodoTipo = c.hidden_seed_sql ? "desafio" : "leccion";
    if (!p[c.id]) {
      return { challenge: c, unidad: unidadDe(c.order), tipo, estado: c.order === desbloqueadoHasta ? "actual" : "bloqueado" as NodoEstado };
    }
    if (necesitaRepaso(m, p, c.id)) return { challenge: c, unidad: unidadDe(c.order), tipo, estado: "repaso" as NodoEstado };
    if (dominio(m, c.id) === 100) return { challenge: c, unidad: unidadDe(c.order), tipo, estado: "maestro" as NodoEstado };
    return { challenge: c, unidad: unidadDe(c.order), tipo, estado: "hecho" as NodoEstado };
  });
}

export function siguienteReto(p: ProgressMap): Challenge | null {
  const nodos = camino(p);
  return nodos.find((n) => n.estado === "actual")?.challenge ?? null;
}
