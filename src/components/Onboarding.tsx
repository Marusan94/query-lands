"use client";
import { useState } from "react";

function visto(): boolean {
  if (typeof window === "undefined") return true;
  try {
    return localStorage.getItem("til-onboarding") === "ok";
  } catch {
    return true;
  }
}

export default function Onboarding() {
  const [show, setShow] = useState(() => !visto());
  if (!show) return null;
  function cerrar() {
    try {
      localStorage.setItem("til-onboarding", "ok");
    } catch { /* noop */ }
    setShow(false);
  }
  return (
    <div className="card-flat" style={{ padding: 16, marginTop: 16, background: "var(--accent-2-soft)" }}>
      <div style={{ fontWeight: 700 }}>[?] cómo funciona en 3 pasos</div>
      <ol style={{ marginTop: 8, paddingLeft: 20, display: "grid", gap: 4, fontSize: 14 }}>
        <li><strong>Lee</strong> el enunciado y mira los datos de ejemplo.</li>
        <li><strong>Corre</strong> con [Run] (Ctrl+Enter) y compara con el esperado.</li>
        <li><strong>Envía</strong> con [Submit]: el test oculto califica como en entrevista.</li>
      </ol>
      <button className="btn btn-secondary" style={{ height: 32, fontSize: 14, marginTop: 12 }} onClick={cerrar}>[entendido]</button>
    </div>
  );
}
