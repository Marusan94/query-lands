"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { savePerfil, type Perfil } from "@/lib/estado";

const PASOS = ["curso", "nivel", "meta", "nombre"] as const;

export default function EmpezarClient() {
  const router = useRouter();
  const [paso, setPaso] = useState(0);
  const [f, setF] = useState({ track: "sql", nivel: "principiante", metaDiaria: 30, nombre: "" });

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
      <div style={{ fontSize: 13, color: "var(--mute)" }}>paso {paso + 1} de {PASOS.length}</div>
      <div style={{ height: 8, background: "var(--card)", borderRadius: 999, marginTop: 6 }}>
        <div style={{ width: `${((paso + 1) / PASOS.length) * 100}%`, height: "100%", background: "var(--accent-2)", borderRadius: 999 }} />
      </div>

      {key === "curso" && (
        <div style={{ marginTop: 16 }}>
          <h2 style={{ fontSize: 24 }}>¿Qué quieres aprender?</h2>
          <div style={{ display: "grid", gap: 8, marginTop: 12 }}>
            {(["sql", "js"] as const).map((t) => (
              <button key={t} onClick={() => setF({ ...f, track: t })}
                className="card" style={{ padding: 16, textAlign: "left", borderColor: f.track === t ? "var(--accent)" : undefined, fontFamily: "inherit", fontSize: 16, cursor: "pointer", background: "var(--canvas)" }}>
                <strong>{t === "sql" ? "SQL para entrevistas" : "JavaScript de entrevistas"}</strong>
                <div style={{ fontSize: 14, color: "var(--body)" }}>{t === "sql" ? "16 retos · SELECT → window functions" : "3 retos · filtros clásicos frontend"}</div>
              </button>
            ))}
          </div>
        </div>
      )}
      {key === "nivel" && (
        <div style={{ marginTop: 16 }}>
          <h2 style={{ fontSize: 24 }}>¿Tu nivel?</h2>
          <div style={{ display: "grid", gap: 8, marginTop: 12 }}>
            {(["principiante", "intermedio", "avanzado"] as const).map((n) => (
              <button key={n} onClick={() => setF({ ...f, nivel: n })}
                className="card" style={{ padding: 16, textAlign: "left", borderColor: f.nivel === n ? "var(--accent)" : undefined, fontFamily: "inherit", fontSize: 16, cursor: "pointer", background: "var(--canvas)" }}>
                <strong>{n}</strong>
              </button>
            ))}
          </div>
        </div>
      )}
      {key === "meta" && (
        <div style={{ marginTop: 16 }}>
          <h2 style={{ fontSize: 24 }}>¿Tiempo diario?</h2>
          <div style={{ display: "grid", gap: 8, marginTop: 12 }}>
            {([20, 30, 50] as const).map((m) => (
              <button key={m} onClick={() => setF({ ...f, metaDiaria: m })}
                className="card" style={{ padding: 16, textAlign: "left", borderColor: f.metaDiaria === m ? "var(--accent)" : undefined, fontFamily: "inherit", fontSize: 16, cursor: "pointer", background: "var(--canvas)" }}>
                <strong>{m} XP</strong> <span style={{ color: "var(--body)" }}>≈ {m === 20 ? "10 min" : m === 30 ? "15 min" : "25 min"}</span>
              </button>
            ))}
          </div>
        </div>
      )}
      {key === "nombre" && (
        <div style={{ marginTop: 16 }}>
          <h2 style={{ fontSize: 24 }}>¿Cómo te llamas?</h2>
          <input aria-label="tu nombre" className="input-mono" value={f.nombre} onChange={(e) => setF({ ...f, nombre: e.target.value })}
            placeholder="Tu nombre" style={{ marginTop: 12 }} maxLength={24} />
        </div>
      )}

      <div style={{ display: "flex", gap: 8, marginTop: 24 }}>
        {paso > 0 && <button className="btn btn-secondary" onClick={() => setPaso(paso - 1)}>[atrás]</button>}
        <button className="btn btn-accent" style={{ flex: 1 }} onClick={siguiente} disabled={key === "nombre" && !f.nombre.trim()}>
          {paso === PASOS.length - 1 ? "[EMPEZAR →]" : "[CONTINUAR]"}
        </button>
      </div>
    </div>
  );
}
