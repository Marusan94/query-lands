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
    <div className="card-elev" style={{ padding: 20, marginTop: 16, background: "var(--accent-soft)", borderColor: "var(--accent)" }}>
      <div style={{ fontWeight: 700, fontFamily: "var(--font-rpg)", textTransform: "uppercase", color: "var(--accent)" }}>[⚔] CÓMO FUNCIONA EN 3 PASOS</div>
      <ol style={{ marginTop: 10, paddingLeft: 20, display: "grid", gap: 8, fontSize: 13, color: "var(--body)" }}>
        <li><strong>LEE</strong> el enunciado y examina los datos de ejemplo.</li>
        <li><strong>EJECUTA</strong> con [RUN] (Ctrl+Enter) y compara con el esperado.</li>
        <li><strong>ENVÍA</strong> con [SUBMIT]: el test oculto califica como prueba real.</li>
      </ol>
      <button className="btn btn-accent btn-rpg" style={{ height: 40, fontSize: 11, marginTop: 14 }} onClick={cerrar}>[⚔ ENTENDIDO]</button>
    </div>
  );
}