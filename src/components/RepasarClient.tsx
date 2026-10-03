"use client";
import Link from "next/link";
import { useState } from "react";
import { challenges } from "@/lib/curriculum";
import { jsChallenges } from "@/lib/curriculumJs";
import { loadProgress } from "@/lib/progress";
import { loadMastery, dominio, necesitaRepaso, marcaRepaso } from "@/lib/estado";

type Item = { id: string; href: string; titulo: string; dom: number; motivo: string };

function calcula(): { debiles: Item[]; programados: Item[]; rapida: Item | null } {
  const p = loadProgress();
  const m = loadMastery();
  const debiles: Item[] = [];
  const programados: Item[] = [];
  for (const c of challenges) {
    if (!p[c.id] || !necesitaRepaso(m, p, c.id)) continue;
    const it = { id: c.id, href: `/sql/${c.id}`, titulo: c.titulo, dom: dominio(m, c.id), motivo: (m[c.id]?.fallos ?? 0) > 0 ? "fallaste aquí" : "hace 6+ días" };
    ((m[c.id]?.fallos ?? 0) > 0 ? debiles : programados).push(it);
  }
  for (const c of jsChallenges) {
    const id = `js-${c.id}`;
    if (!p[id] || !necesitaRepaso(m, p, id)) continue;
    debiles.push({ id, href: `/js/${c.id}`, titulo: c.titulo, dom: dominio(m, id), motivo: "fallaste aquí" });
  }
  const todos = [...debiles, ...programados];
  return { debiles, programados, rapida: todos.length ? todos[(Date.now() + todos.length) % todos.length] : null };
}

function Tarjeta({ it, onIr }: { it: Item; onIr: () => void }) {
  return (
    <div className="card" style={{ padding: 16 }}>
      <strong>{it.titulo}</strong>
      <div style={{ fontSize: 13, color: "var(--body)", marginTop: 4 }}>Dominio {it.dom}% · {it.motivo}</div>
      <div style={{ height: 8, background: "var(--card)", borderRadius: 999, marginTop: 8 }}>
        <div style={{ width: `${it.dom}%`, height: "100%", background: it.dom < 70 ? "var(--streak)" : "var(--accent-2)", borderRadius: 999 }} />
      </div>
      <div style={{ marginTop: 12 }}><Link className="btn btn-secondary" href={it.href} onClick={onIr}>[repasar]</Link></div>
    </div>
  );
}

export default function RepasarClient() {
  const [d] = useState(() => (typeof window === "undefined" ? null : calcula()));
  if (!d) return <div className="skeleton" style={{ height: 120, marginTop: 16 }} />;
  const total = d.debiles.length + d.programados.length;
  const rapida = d.rapida;

  function ir(id: string) {
    marcaRepaso(id);
  }
  return (
    <div style={{ marginTop: 16 }}>
      {total === 0 ? (
        <div className="card" style={{ padding: 24 }}>
          <strong>Aún no tienes conceptos para repasar.</strong>
          <p style={{ color: "var(--body)", marginTop: 8 }}>Completa algunas lecciones y aparecerán aquí.</p>
          <div style={{ marginTop: 12 }}><Link className="btn btn-accent" href="/">[EMPEZAR]</Link></div>
        </div>
      ) : (
        <>
          {rapida && (
            <div className="card" style={{ padding: 16, background: "var(--accent-2-soft)" }}>
              <strong>[⚡] Repaso rápido · 3 min</strong>
              <div style={{ marginTop: 8 }}><Link className="btn btn-accent" href={rapida.href} onClick={() => ir(rapida.id)}>[practicar ahora]</Link></div>
            </div>
          )}
          {d.debiles.length > 0 && (
            <>
              <h2 style={{ fontSize: 20, marginTop: 24 }}>Necesita atención</h2>
              <div style={{ display: "grid", gap: 12, marginTop: 8 }}>
                {d.debiles.map((it) => <Tarjeta key={it.id} it={it} onIr={() => ir(it.id)} />)}
              </div>
            </>
          )}
          {d.programados.length > 0 && (
            <>
              <h2 style={{ fontSize: 20, marginTop: 24 }}>Repaso programado</h2>
              <div style={{ display: "grid", gap: 12, marginTop: 8 }}>
                {d.programados.map((it) => <Tarjeta key={it.id} it={it} onIr={() => ir(it.id)} />)}
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}
