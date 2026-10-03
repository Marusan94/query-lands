"use client";
import Link from "next/link";
import { useState } from "react";
import { camino, UNIDADES } from "@/lib/path";
import { loadProgress } from "@/lib/progress";
import { loadMastery } from "@/lib/estado";

function Mar({ children }: { children?: React.ReactNode }) {
  return (
    <>
      <span className="isla-mar isla-anim" style={{ bottom: 26, opacity: 0.45 }} />
      <span className="isla-mar isla-anim" style={{ bottom: 12, animationDelay: "1.1s" }} />
      {children}
    </>
  );
}

function Escena({ id, lock }: { id: string; lock: boolean }) {
  const cls = lock ? "isla-lock" : "";
  if (id === "u1") {
    return (
      <div className={`isla ${cls}`} style={{ background: "linear-gradient(180deg, #a8d8ee 0 52%, #7fc4de 52% 62%, #2e9bc4 62% 100%)", height: 172 }} aria-hidden>
        <span className="isla-sol isla-anim" style={{ top: 14, right: 26 }} />
        <span className="isla-nube isla-anim" style={{ width: 66, height: 18, top: 20, left: 28 }} />
        <span className="isla-nube isla-anim" style={{ width: 44, height: 13, top: 42, left: 120, animationDelay: "1.4s" }} />
        <span style={{ position: "absolute", top: 56, left: 60, fontSize: 13, letterSpacing: 6, opacity: 0.7 }}>〜 〜</span>
        <span className="isla-elipse" style={{ bottom: 26, width: "74%", height: 52, background: "#f2dfae" }} />
        <span className="isla-elipse" style={{ bottom: 44, width: "52%", height: 34, background: "#7fb069" }} />
        <span className="isla-palmera isla-anim" style={{ position: "absolute", bottom: 52, left: "42%", fontSize: 46 }}>🌴</span>
        <span style={{ position: "absolute", bottom: 50, right: "26%", fontSize: 26 }}>⛱</span>
        <Mar><span className="isla-bote isla-anim" style={{ bottom: 8, left: "16%", fontSize: 22 }}>⛵</span></Mar>
      </div>
    );
  }
  if (id === "u2") {
    return (
      <div className={`isla ${cls}`} style={{ background: "linear-gradient(180deg, #0e2c52 0 58%, #16457c 58% 68%, #0d2c4e 68% 100%)", height: 172 }} aria-hidden>
        <span className="isla-luna" style={{ top: 14, right: 30 }} />
        <span className="isla-brillo isla-anim" style={{ top: 20, left: 50, fontSize: 15 }}>✦</span>
        <span className="isla-brillo isla-anim" style={{ top: 48, left: 120, fontSize: 12, animationDelay: "0.8s" }}>✦</span>
        <span className="isla-brillo isla-anim" style={{ top: 34, right: 90, fontSize: 13, animationDelay: "1.5s" }}>✦</span>
        <span className="isla-elipse" style={{ bottom: 26, width: "66%", height: 46, background: "#5b6670" }} />
        <span className="isla-elipse" style={{ bottom: 42, width: "40%", height: 28, background: "#6e7a84" }} />
        <span style={{ position: "absolute", bottom: 52, left: "50%", transform: "translateX(-50%)", fontSize: 54 }}>🗼</span>
        <span className="isla-faro-luz isla-anim" style={{ top: 52 }} />
        <Mar><span className="isla-bote isla-anim" style={{ bottom: 8, right: "18%", fontSize: 22, animationDelay: "2s" }}>⛵</span></Mar>
      </div>
    );
  }
  if (id === "u3") {
    return (
      <div className={`isla ${cls}`} style={{ background: "linear-gradient(180deg, #5a2f52 0 50%, #331f38 50% 64%, #1d1226 64% 100%)", height: 172 }} aria-hidden>
        <span className="isla-sol isla-anim" style={{ top: 66, left: "50%", marginLeft: -22, background: "#ff7a45", animationDuration: "2.4s" }} />
        <span className="isla-humo isla-anim" style={{ top: 30, left: "47%" }} />
        <span className="isla-humo isla-anim" style={{ top: 34, left: "53%", animationDelay: "0.8s" }} />
        <span className="isla-humo isla-anim" style={{ top: 28, left: "44%", animationDelay: "1.6s" }} />
        <span className="isla-lava isla-anim" style={{ bottom: 40, left: "50%", marginLeft: -46, width: 92, height: 26 }} />
        <span style={{ position: "absolute", bottom: 44, left: "50%", transform: "translateX(-50%)", fontSize: 58 }}>🌋</span>
        <span className="isla-elipse" style={{ bottom: 26, width: "76%", height: 44, background: "#3a2b3f" }} />
        <Mar />
      </div>
    );
  }
  return (
    <div className={`isla ${cls}`} style={{ background: "linear-gradient(180deg, #0c2233 0 52%, #134b4a 52% 64%, #0b2e2b 64% 100%)", height: 172 }} aria-hidden>
      <span className="isla-aurora isla-anim" />
      <span className="isla-brillo isla-anim" style={{ top: 54, left: "22%", fontSize: 15 }}>✦</span>
      <span className="isla-brillo isla-anim" style={{ top: 66, right: "20%", fontSize: 13, animationDelay: "0.9s" }}>✦</span>
      <span className="isla-elipse" style={{ bottom: 26, width: "70%", height: 46, background: "#1d3a35" }} />
      <span className="isla-elipse" style={{ bottom: 42, width: "46%", height: 30, background: "#265049" }} />
      <span style={{ position: "absolute", bottom: 54, left: "50%", transform: "translateX(-50%)", fontSize: 50 }}>💎</span>
      <span style={{ position: "absolute", bottom: 50, left: "30%", fontSize: 24 }}>💠</span>
      <span style={{ position: "absolute", bottom: 52, right: "28%", fontSize: 24 }}>🔷</span>
      <Mar />
    </div>
  );
}

export default function IslaMap() {
  const [nodos] = useState(() => {
    if (typeof window === "undefined") return camino({});
    try {
      return camino(loadProgress(), loadMastery());
    } catch {
      return camino({});
    }
  });
  const total = nodos.length;
  const hechosTotal = nodos.filter((n) => ["hecho", "maestro"].includes(n.estado)).length;
  const avance = total ? hechosTotal / total : 0;
  return (
    <div className="mapa-marco">
      <div className="mapa-caption" aria-hidden>
        ☯ EL MAPA RESPIRA EN LA MITAD OPUESTA
      </div>
      <span className="mapa-olas" aria-hidden />
      <span className="mapa-ruta-avance" aria-hidden style={{ height: `calc((100% - 150px) * ${avance})` }} />
    <div className="viaje mapa" style={{ display: "flex", flexDirection: "column", gap: 4, marginTop: 8, position: "relative" }}>
      {UNIDADES.map((u, ui) => {
        const del = nodos.filter((n) => n.unidad.id === u.id);
        const hechos = del.filter((n) => ["hecho", "maestro"].includes(n.estado)).length;
        const desbloqueada = ui === 0 || nodos.some((n) => n.unidad.id === UNIDADES[ui - 1].id && ["hecho", "maestro", "repaso"].includes(n.estado)) || del.some((n) => n.estado !== "bloqueado");
        const actual = del.some((n) => n.estado === "actual");
        const pct = Math.round((hechos / Math.max(1, del.length)) * 100);
        const lado = ui % 2 === 0 ? "flex-start" : "flex-end";
        return (
          <div key={u.id} style={{ display: "flex", flexDirection: "column", alignItems: lado === "flex-start" ? "flex-start" : "flex-end" }}>
            <Link href={`/sql/isla/${u.id}`} aria-label={`${u.titulo}: ${hechos} de ${del.length}`}
              className="viaje-isla"
              style={{ textDecoration: "none", color: "inherit", width: "min(100%, 430px)", position: "relative" }}>
              {actual && (
                <span style={{ position: "absolute", top: -12, left: 12, zIndex: 2 }} className="chip duo-tip">
                  <span aria-hidden>📍</span> ESTÁS AQUÍ
                </span>
              )}
              <Escena id={u.id} lock={!desbloqueada} />
              <div className={`card${actual ? " isla-actual" : ""}`} style={{ padding: 14, marginTop: -20, position: "relative", background: "var(--canvas)" }}>
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <strong>{actual ? <span className="viajero" aria-hidden>⛵</span> : desbloqueada ? "○ " : "🔒 "}{u.titulo}</strong>
                  <span style={{ marginLeft: "auto", fontSize: 13, color: "var(--mute)" }}>{hechos}/{del.length} · {pct}%</span>
                </div>
                <div style={{ fontSize: 13, color: "var(--body)", marginTop: 2 }}>{u.descripcion}</div>
                <div style={{ height: 8, background: "var(--card)", borderRadius: 999, marginTop: 8 }}>
                  <div style={{ width: `${pct}%`, height: "100%", background: "var(--accent-2)", borderRadius: 999 }} />
                </div>
                <div style={{ fontSize: 13, fontWeight: 700, marginTop: 8, color: "var(--accent)" }}>
                  {desbloqueada ? "[ENTRAR A LA ISLA →]" : "[🔒 completa la anterior]"}
                </div>
              </div>
            </Link>
            {ui < UNIDADES.length - 1 && <span className="mapa-hito" aria-hidden>···</span>}
          </div>
        );
      })}
      <div className="tesoro" style={{ marginTop: 8 }}>
        <span className="tesoro-rayos" aria-hidden />
        {(() => {
          const u4 = nodos.filter((n) => n.unidad.id === "u4");
          const u4ok = u4.length > 0 && u4.every((n) => ["hecho", "maestro"].includes(n.estado));
          return (
            <>
              <Link href="/sql/simulacro" aria-label={u4ok ? "tesoro desbloqueado: simulacro final" : "tesoro bloqueado: completa la isla 4"}
                className={`tesoro-cofre${u4ok ? "" : " tesoro-lock"}`} style={{ position: "relative" }}>
                {u4ok ? "★" : "🔒"}
              </Link>
              <span className="chip" style={{ background: "var(--bee-soft)", color: "var(--bee)", position: "relative" }}>
                {u4ok ? "[TESORO DESBLOQUEADO]" : `[TESORO] ${u4.filter((n) => ["hecho", "maestro"].includes(n.estado)).length}/${u4.length} en isla 4`}
              </span>
              <span style={{ fontSize: 13, opacity: 0.75, position: "relative" }}>simulacro 45min · la prueba final</span>
            </>
          );
        })()}
      </div>
    </div>
    </div>
  );
}
