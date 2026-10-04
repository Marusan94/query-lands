"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { savePerfil, type Perfil } from "@/lib/estado";

const PASOS = ["curso", "nivel", "meta", "nombre"] as const;

export default function EmpezarClient() {
  const router = useRouter();
  const [paso, setPaso] = useState(0);
  const [f, setF] = useState({ track: "sql", nivel: "principiante", metaDiaria: 30, nombre: "", rachaActual: 0 });

  function siguiente() {
    if (paso < PASOS.length - 1) setPaso(paso + 1);
    else {
      const p: Perfil = { ...f, track: f.track as "sql" | "js", listo: true };
      savePerfil(p);
      router.push("/");
    }
  }
  const key = PASOS[paso];

  return (
    <div>
      <div style={{ fontSize: 12, color: "var(--mute)", fontFamily: "var(--font-rpg)", textTransform: "uppercase", letterSpacing: "0.03em" }}>PASO {paso + 1} DE {PASOS.length}</div>
      <div style={{ height: 10, background: "var(--card)", borderRadius: 999, marginTop: 6, boxShadow: "inset 0 2px 8px rgba(0,0,0,0.3)" }}>
        <div style={{ width: `${((paso + 1) / PASOS.length) * 100}%`, height: "100%", background: "linear-gradient(90deg, var(--accent), #26a85a)", borderRadius: 999, boxShadow: "0 0 12px var(--accent-glow)" }} />
      </div>

      {key === "curso" && (
        <div style={{ marginTop: 20 }}>
          <h2 style={{ fontSize: 22, fontFamily: "var(--font-rpg)", textTransform: "uppercase", letterSpacing: "0.03em" }}>⚔ ¿QUÉ RUTA ELIGES?</h2>
          <div style={{ display: "grid", gap: 10, marginTop: 14 }}>
            {(["sql", "js"] as const).map((t) => (
              <button key={t} onClick={() => setF({ ...f, track: t })}
                className="card-elev" style={{ padding: 18, textAlign: "left", borderColor: f.track === t ? "var(--accent)" : undefined, fontFamily: "inherit", fontSize: 15, cursor: "pointer" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                  <span style={{ fontSize: 24 }}>{t === "sql" ? "🌿" : "⚡"}</span>
                  <strong style={{ fontSize: 18, fontFamily: "var(--font-rpg)", textTransform: "uppercase" }}>{t === "sql" ? "SQL PARA RETOS" : "JS ALGORÍTMICO"}</strong>
                </div>
                <div style={{ fontSize: 13, color: "var(--body)" }}>{t === "sql" ? "16 retos · SELECT → window functions" : "3 retos · filtros frontend clásicos"}</div>
              </button>
            ))}
          </div>
        </div>
      )}

      {key === "nivel" && (
        <div style={{ marginTop: 20 }}>
          <h2 style={{ fontSize: 22, fontFamily: "var(--font-rpg)", textTransform: "uppercase", letterSpacing: "0.03em" }}>⚔ TU NIVEL ACTUAL</h2>
          <div style={{ display: "grid", gap: 10, marginTop: 14 }}>
            {(["principiante", "intermedio", "avanzado"] as const).map((n) => (
              <button key={n} onClick={() => setF({ ...f, nivel: n })}
                className="card-elev" style={{ padding: 18, textAlign: "left", borderColor: f.nivel === n ? "var(--accent)" : undefined, fontFamily: "inherit", fontSize: 15, cursor: "pointer" }}>
                <strong style={{ fontSize: 18, fontFamily: "var(--font-rpg)", textTransform: "uppercase" }}>{n.toUpperCase()}</strong>
                <div style={{ fontSize: 13, color: "var(--body)", marginTop: 4 }}>{n === "principiante" ? "Empezando de cero" : n === "intermedio" ? "Sé lo básico" : "Busco maestría"}</div>
              </button>
            ))}
          </div>
        </div>
      )}

      {key === "meta" && (
        <div style={{ marginTop: 20 }}>
          <h2 style={{ fontSize: 22, fontFamily: "var(--font-rpg)", textTransform: "uppercase", letterSpacing: "0.03em" }}>⚔ TU META DIARIA</h2>
          <div style={{ display: "grid", gap: 10, marginTop: 14 }}>
            {([20, 30, 50] as const).map((m) => (
              <button key={m} onClick={() => setF({ ...f, metaDiaria: m })}
                className="card-elev" style={{ padding: 18, textAlign: "left", borderColor: f.metaDiaria === m ? "var(--accent)" : undefined, fontFamily: "inherit", fontSize: 15, cursor: "pointer" }}>
                <strong style={{ fontSize: 20, color: "var(--accent)", fontFamily: "var(--font-rpg)" }}>{m} XP</strong>
                <span style={{ color: "var(--body)", fontSize: 13 }}>{m === 20 ? "⏱ ~10 min" : m === 30 ? "⏱ ~15 min" : "⏱ ~25 min"}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {key === "nombre" && (
        <div style={{ marginTop: 20 }}>
          <h2 style={{ fontSize: 22, fontFamily: "var(--font-rpg)", textTransform: "uppercase", letterSpacing: "0.03em" }}>⚔ TU NOMBRE DE RECLUTA</h2>
          <input aria-label="tu nombre" className="input-mono" value={f.nombre} onChange={(e) => setF({ ...f, nombre: e.target.value })}
            placeholder="Tu nombre" style={{ marginTop: 14 }} maxLength={24} />
          <p style={{ fontSize: 11, color: "var(--mute)", marginTop: 6, fontFamily: "var(--font-rpg)" }}>Máx 24 caracteres · se usa en el perfil y certificado</p>
        </div>
      )}

      <div style={{ display: "flex", gap: 10, marginTop: 28 }}>
        {paso > 0 && <button className="btn btn-secondary btn-rpg" onClick={() => setPaso(paso - 1)}>[⬅ ATRÁS]</button>}
        <button className="btn btn-accent btn-rpg" style={{ flex: 1, minHeight: 52 }} onClick={siguiente} disabled={f.nombre.trim() === ""}>
          {paso === PASOS.length - 1 ? "[⚔ EMPEZAR ENTRENAMIENTO]" : "[⚔ SEGUIR]"}
        </button>
      </div>
    </div>
  );
}