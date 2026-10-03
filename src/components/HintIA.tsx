"use client";
import { useState } from "react";

export default function HintIA(props: {
  track: string;
  titulo: string;
  enunciado: string;
  getCodigo: () => string;
  getError: () => string;
  getIntentos: () => number;
  examen?: boolean;
}) {
  const [out, setOut] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState<"pista" | "explica" | null>(null);

  async function pedir(mode: "pista" | "explica") {
    setErr(""); setBusy(mode);
    try {
      const r = await fetch("/api/tutor", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          mode,
          track: props.track,
          titulo: props.titulo,
          enunciado: props.enunciado,
          codigo: props.getCodigo(),
          error: props.getError(),
          intentos: props.getIntentos(),
          examen: props.examen,
        }),
      });
      const j = await r.json();
      if (!r.ok) setErr(j.error ?? "Falló la IA.");
      else setOut(j.text);
    } catch {
      setErr("Sin conexión con la IA.");
    } finally {
      setBusy(null);
    }
  }

  return (
    <div className="card-flat" style={{ padding: 16, marginTop: 16, borderTop: "3px solid var(--gem)" }}>
      <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
        <span style={{ fontSize: 14, fontWeight: 700 }}>[✦] tutor IA</span>
        <span style={{ fontSize: 12, color: "var(--mute)" }}>nunca da la solución directa</span>
        <span style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
          <button className="btn btn-secondary" style={{ height: 32, fontSize: 14 }} disabled={busy !== null} onClick={() => pedir("pista")}>
            {busy === "pista" ? "[...]" : "[pista]"}
          </button>
          <button className="btn btn-secondary" style={{ height: 32, fontSize: 14 }} disabled={busy !== null} onClick={() => pedir("explica")}>
            {busy === "explica" ? "[...]" : "[explícame]"}
          </button>
        </span>
      </div>
      {err && <div style={{ marginTop: 8, fontSize: 14 }} className="st-err">[!] {err}</div>}
      {out && <div style={{ marginTop: 8, fontSize: 14, whiteSpace: "pre-wrap" }}>{out}</div>}
    </div>
  );
}
