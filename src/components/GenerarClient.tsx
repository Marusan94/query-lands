"use client";
import { useState } from "react";
import type { Challenge } from "@/lib/curriculum";
import SqlRunner from "@/components/SqlRunner";

export default function GenerarClient() {
  const [oferta, setOferta] = useState("");
  const [dif, setDif] = useState("media");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [gen, setGen] = useState<Challenge | null>(null);

  async function generar() {
    setErr(""); setBusy(true); setGen(null);
    try {
      const r = await fetch("/api/generar", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ oferta, dificultad: dif }),
      });
      const j = await r.json();
      if (!r.ok) setErr(j.error ?? "Falló la generación.");
      else {
        setGen(j.challenge);
        try {
          const prev = JSON.parse(localStorage.getItem("til-custom") || "[]");
          localStorage.setItem("til-custom", JSON.stringify([...prev, j.challenge]));
        } catch { /* noop */ }
      }
    } catch {
      setErr("Sin conexión con la IA.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <div className="card-flat" style={{ padding: 16, marginTop: 16 }}>
        <label htmlFor="oferta" style={{ fontSize: 14, fontWeight: 700 }}>[&gt;] pega la oferta o el tema</label>
        <textarea
          id="oferta"
          className="input-mono"
          rows={6}
          value={oferta}
          onChange={(e) => setOferta(e.target.value)}
          placeholder="Ej: Data Analyst con SQL avanzado: window functions, CTEs, reporting mensual..."
          style={{ marginTop: 8 }}
        />
        <div style={{ display: "flex", gap: 8, marginTop: 12, alignItems: "center", flexWrap: "wrap" }}>
          <label htmlFor="dif" style={{ fontSize: 14 }}>dificultad:</label>
          <select id="dif" className="input-mono" value={dif} onChange={(e) => setDif(e.target.value)} style={{ maxWidth: 160, padding: "6px 12px" }}>
            <option value="facil">facil</option>
            <option value="media">media</option>
            <option value="dificil">dificil</option>
          </select>
          <button className="btn btn-accent" disabled={busy} onClick={generar}>{busy ? "[generando...]" : "[✦ generar reto]"}</button>
        </div>
        {err && <div className="st-err" style={{ marginTop: 8, fontSize: 14 }}>[!] {err} <button className="btn btn-secondary" style={{ height: 32, fontSize: 14, marginLeft: 8 }} onClick={generar}>[reintentar]</button></div>}
      </div>
      {gen && (
        <div style={{ marginTop: 24 }}>
          <div><span className="badge-ink">reto generado + validado</span></div>
          <h2 style={{ fontSize: 24, fontWeight: 700, marginTop: 8 }}>{gen.titulo}</h2>
          <div className="card-flat" style={{ padding: 16, marginTop: 12 }}>
            <div style={{ fontSize: 14, fontWeight: 500 }}>[&gt;] enunciado</div>
            <p style={{ marginTop: 8 }}>{gen.enunciado}</p>
          </div>
          <div style={{ marginTop: 16 }}>
            <SqlRunner key={gen.id} challenge={gen} />
          </div>
        </div>
      )}
    </div>
  );
}
