"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { loadPerfil, savePerfil, borraTodo, type Perfil } from "@/lib/estado";
import { exportProgress, clearProgress } from "@/lib/progress";
import { sonidoOn, setSonido } from "@/lib/sonido";

function fuenteActual(): number {
  if (typeof document === "undefined") return 16;
  return Number(getComputedStyle(document.documentElement).getPropertyValue("--texto")) || 16;
}

export default function AjustesClient() {
  const router = useRouter();
  const [perfil, setPerfil] = useState(() => (typeof window === "undefined" ? null : loadPerfil()));
  const [sonido, setSon] = useState(() => (typeof window === "undefined" ? true : sonidoOn()));
  const [fuente, setFuente] = useState(fuenteActual);
  const [tema, setTema] = useState(() => (typeof document === "undefined" ? "light" : document.documentElement.getAttribute("data-theme") ?? "light"));
  const [calma, setCalma] = useState(() => (typeof document === "undefined" ? false : document.documentElement.getAttribute("data-calm") === "on"));
  if (!perfil) return <div className="skeleton" style={{ height: 200, marginTop: 16 }} />;

  function guarda(p: Perfil) {
    setPerfil(p);
    savePerfil(p);
  }
  function cambiaTema(t: string) {
    setTema(t);
    document.documentElement.setAttribute("data-theme", t);
    try {
      localStorage.setItem("til-theme", t);
    } catch { /* noop */ }
  }
  function cambiaCalma(v: boolean) {
    setCalma(v);
    document.documentElement.setAttribute("data-calm", v ? "on" : "off");
    try {
      localStorage.setItem("til-calm", v ? "on" : "off");
    } catch { /* noop */ }
  }
  function cambiaFuente(px: number) {
    setFuente(px);
    document.documentElement.style.setProperty("--texto", `${px}px`);
    try {
      localStorage.setItem("til-fuente", String(px));
    } catch { /* noop */ }
  }

  return (
    <div style={{ display: "grid", gap: 16, marginTop: 16 }}>
      <section className="card" style={{ padding: 16 }}>
        <h2 style={{ fontSize: 18 }}>Aprendizaje</h2>
        <label style={{ display: "block", marginTop: 12, fontSize: 14, fontWeight: 700 }} htmlFor="aj-nombre">Nombre</label>
        <input id="aj-nombre" className="input-mono" value={perfil.nombre} onChange={(e) => guarda({ ...perfil, nombre: e.target.value })} maxLength={24} style={{ marginTop: 4 }} />
        <label style={{ display: "block", marginTop: 12, fontSize: 14, fontWeight: 700 }} htmlFor="aj-meta">Meta diaria (XP)</label>
        <select id="aj-meta" className="input-mono" value={perfil.metaDiaria} onChange={(e) => guarda({ ...perfil, metaDiaria: Number(e.target.value) })} style={{ marginTop: 4 }}>
          <option value={20}>20 XP · ~10 min</option>
          <option value={30}>30 XP · ~15 min</option>
          <option value={50}>50 XP · ~25 min</option>
        </select>
      </section>

      <section className="card" style={{ padding: 16 }}>
        <h2 style={{ fontSize: 18 }}>Accesibilidad</h2>
        <div style={{ display: "flex", gap: 8, marginTop: 12, alignItems: "center", flexWrap: "wrap" }}>
          <span style={{ fontSize: 14 }}>Texto:</span>
          {([14, 16, 19] as const).map((px) => (
            <button key={px} className={fuente === px ? "btn btn-primary" : "btn btn-secondary"} style={{ minHeight: 44 }} onClick={() => cambiaFuente(px)} aria-pressed={fuente === px}>
              {px === 14 ? "A" : px === 16 ? "A+" : "A++"}
            </button>
          ))}
        </div>
        <div style={{ display: "flex", gap: 8, marginTop: 8, flexWrap: "wrap", alignItems: "center" }}>
          <button className="btn btn-secondary" onClick={() => cambiaTema(tema === "dark" ? "light" : "dark")} aria-pressed={tema === "dark"} aria-label="alternar modo oscuro y claro">
            <span className={`yinyang${tema === "dark" ? " yinyang-rotado" : ""}`} aria-hidden />
            <span style={{ marginLeft: 8 }}>{tema === "dark" ? "oscuro" : "claro"}</span>
          </button>
          <button className="btn btn-secondary" onClick={() => cambiaCalma(!calma)} aria-pressed={calma}>
            {calma ? "[calma on]" : "[calma]"}
          </button>
          <button className="btn btn-secondary" onClick={() => { const v = !sonido; setSon(v); setSonido(v); }} aria-pressed={sonido}>
            {sonido ? "[sonido on]" : "[sonido off]"}
          </button>
        </div>
      </section>

      <section className="card" style={{ padding: 16 }}>
        <h2 style={{ fontSize: 18 }}>Datos</h2>
        <div style={{ display: "flex", gap: 8, marginTop: 12, flexWrap: "wrap" }}>
          <button className="btn btn-secondary" onClick={() => {
            const blob = new Blob([exportProgress()], { type: "application/json" });
            const a = document.createElement("a");
            a.href = URL.createObjectURL(blob);
            a.download = "til-progreso.json";
            a.click();
          }}>[exportar progreso]</button>
          <button className="btn btn-secondary" style={{ borderColor: "var(--danger)", color: "var(--danger)" }} onClick={() => {
            if (window.confirm("¿Borrar TODO tu progreso?")) { borraTodo(); clearProgress(); router.push("/"); }
          }}>[borrar todo]</button>
        </div>
      </section>
    </div>
  );
}
