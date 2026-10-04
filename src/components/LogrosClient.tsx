"use client";
import { useState } from "react";
import { logrosDe, semanasActividad } from "@/lib/logros";
import { loadProgress } from "@/lib/progress";

function iniciales() {
  if (typeof window === "undefined") return { l: logrosDe({}), s: [] as { fecha: string; n: number }[] };
  const p = loadProgress();
  return { l: logrosDe(p), s: semanasActividad(p) };
}

export default function LogrosClient() {
  const [estado, setEstado] = useState(iniciales);
  const logros = estado.l;
  const n = logros.filter((l) => l.ok).length;
  return (
    <div>
      <div className="card-flat" style={{ padding: 16, marginTop: 16, display: "flex", gap: 12, alignItems: "center" }}>
        <span style={{ fontWeight: 700 }}>[{n}/{logros.length}] desbloqueados</span>
        <button className="btn btn-secondary" style={{ height: 32, fontSize: 14, marginLeft: "auto" }} onClick={() => { const p = loadProgress(); setEstado({ l: logrosDe(p), s: semanasActividad(p) }); }}>[recargar]</button>
      </div>
      <div style={{ marginTop: 16 }}>
        <div style={{ fontSize: 14, fontWeight: 500 }}>[~] actividad — últimas 8 semanas</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(28, 1fr)", gap: 3, marginTop: 8 }} role="img" aria-label="mapa de actividad de 8 semanas">
          {estado.s.map((d, i) => (
            <div key={i} title={`${d.fecha}: ${d.n}`} style={{ aspectRatio: "1", borderRadius: 2, background: d.n === 0 ? "var(--card)" : d.n === 1 ? "var(--accent-2-soft)" : "var(--accent-2)", border: "1px solid var(--hairline)" }} />
          ))}
        </div>
        <div style={{ fontSize: 12, color: "var(--mute)", marginTop: 4 }}>menos → más · cada cuadro es un día</div>
      </div>
      <div style={{ display: "grid", gap: 12, marginTop: 16 }}>
        {logros.map((l) => (
          <div key={l.id} className="card-flat" style={{ padding: 16, opacity: l.ok ? 1 : 0.75 }}>
            <div style={{ fontWeight: 700 }}>{l.ok ? l.titulo : l.titulo.replace("[+]", "[ ]")}</div>
            <div style={{ fontSize: 14, color: "var(--body)", marginTop: 4 }}>{l.detalle}</div>
          </div>
        ))}
      </div>
      {n === logros.length && (
        <div className="band-dark" style={{ padding: 24, marginTop: 24, borderTop: "4px solid var(--bee)" }}>
          <div className="st-bee" style={{ fontWeight: 700, fontSize: 20 }}>[★] CERTIFICADO QUERY LANDS</div>
          <p style={{ marginTop: 8, fontSize: 14 }}>Completaste SQL + JS. Imprime esta página (Ctrl+P) como constancia de práctica.</p>
        </div>
      )}
    </div>
  );
}
