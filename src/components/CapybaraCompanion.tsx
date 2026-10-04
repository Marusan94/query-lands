"use client";
import { useState, useEffect, useCallback, useRef } from "react";

interface CapybaraProps {
  xp: number;
  streak: number;
  nivel: number;
  track?: "sql" | "js";
}

const FRASES = {
  saludo: [
    "⚔ ¡BIENVENIDO, RECLUTA!",
    "✦ EL CAMINO TE ESPERA.",
    "🌿 LISTO PARA LA SIGUIENTE SALA?",
    "⚔ TU CAPIBARA ESTÁ LISTO.",
  ],
  xpBajo: [
    "🌿 UN POCO DE XP CADA DÍA... LA CONSTANCIA GANA.",
    "⚔ PEQUEÑOS PASOS, GRANDES LOGROS.",
    "🌿 EL CAPIBARA NO CORRE, PERO SIEMPRE LLEGA.",
  ],
  xpMedio: [
    "⚔ ¡BUEN RITMO! EL CAPIBARA ASIENTE.",
    "✦ LA RACHA CRECE. BIEN HECHO.",
    "🌿 NIVEL {nivel}... EL CAPIBARA ESTÁ ORGULLOSO.",
  ],
  xpAlto: [
    "⚔ ¡IMPARABLE! EL CAPIBARA BRILLA.",
    "✦ NIVEL {nivel}... MAESTRO DEL CAMINO.",
    "🌿 EL CAPIBARA TE OFRECE UNA HOJA DE EUCALIPTO DORADA.",
  ],
  racha: [
    "🔥 RACHA DE {streak} DÍAS. EL FUEGO ARDE.",
    "⚔ {streak} DÍAS SIN FALLAR. IMPARABLE.",
    "✦ LA DISCIPLINA SUPERA A LA MOTIVACIÓN.",
  ],
  pista: [
    "💡 ¿ATAScADO? PIDe UNA PISTA AL CAPIBARA.",
    "💡 EL CAPIBARA SABE SQL. PREGÚNTALE.",
    "💡 A VECES LA RESPUESTA ESTÁ EN EL ENUNCIADO.",
  ],
  noche: [
    "🌙 MODO FARO ACTIVADO. DESCANSA BIEN.",
    "🌙 EL CAPIBARA DUERME. MAÑANA CONTINUAMOS.",
    "🌙 LAS ESTRELLAS GUÍAN TU SQL.",
  ],
};

function getFraseContexto(xp: number, streak: number, nivel: number, hora: number) {
  if (hora >= 23 || hora < 6) {
    return FRASES.noche[Math.floor(Math.random() * FRASES.noche.length)];
  }
  if (streak >= 7) {
    return FRASES.racha[Math.floor(Math.random() * FRASES.racha.length)].replace("{streak}", String(streak));
  }
  if (xp >= 80) {
    return FRASES.xpAlto[Math.floor(Math.random() * FRASES.xpAlto.length)].replace("{nivel}", String(nivel));
  }
  if (xp >= 30) {
    return FRASES.xpMedio[Math.floor(Math.random() * FRASES.xpMedio.length)].replace("{nivel}", String(nivel));
  }
  if (xp > 0) {
    return FRASES.xpMedio[Math.floor(Math.random() * FRASES.xpMedio.length)].replace("{nivel}", String(nivel));
  }
  return FRASES.saludo[Math.floor(Math.random() * FRASES.saludo.length)];
}

function getEmojiForState(xp: number, streak: number, hora: number) {
  if (hora >= 23 || hora < 6) {
    return EMOJIS_SLEEP[Math.floor(Math.random() * EMOJIS_SLEEP.length)];
  }
  if (xp > 50 || streak > 5) {
    return EMOJIS_HAPPY[Math.floor(Math.random() * EMOJIS_HAPPY.length)];
  }
  return EMOJIS_IDLE[Math.floor(Math.random() * EMOJIS_IDLE.length)];
}

const EMOJIS_IDLE = ["🌿", "⚔", "✦", "🌿", "🌱", "⚔"];
const EMOJIS_HAPPY = ["⚔", "✦", "🌟", "💚", "🌿", "⚔"];
const EMOJIS_SLEEP = ["😴", "💤", "🌙", "😴", "💤"];

const POSICIONES = [
  { bottom: 120, right: 20 },
  { bottom: 120, left: 20 },
  { top: 100, right: 20 },
  { top: 100, left: 20 },
];

function randomChoice<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function computeInitialState(xp: number, streak: number, nivel: number) {
  const hora = new Date().getHours();
  return {
    frase: getFraseContexto(xp, streak, nivel, hora),
    emoji: getEmojiForState(xp, streak, hora),
    pos: POSICIONES[Math.floor(Math.random() * POSICIONES.length)],
  };
}

export default function CapybaraCompanion({ xp, streak, nivel }: CapybaraProps) {
  const [frase, setFrase] = useState(() => computeInitialState(xp, streak, nivel).frase);
  const [emoji, setEmoji] = useState(() => computeInitialState(xp, streak, nivel).emoji);
  const [animando, setAnimando] = useState(false);
  const [mostrarTip, setMostrarTip] = useState(false);
  const [pos] = useState(() => computeInitialState(xp, streak, nivel).pos);
  const initializedRef = useRef(false);

  const actualizarFrase = useCallback(() => {
    const hora = new Date().getHours();
    const nuevaFrase = getFraseContexto(xp, streak, nivel, hora);
    setFrase(nuevaFrase);
    setEmoji(getEmojiForState(xp, streak, hora));
    setAnimando(true);
    setTimeout(() => setAnimando(false), 600);
  }, [xp, streak, nivel]);

  useEffect(() => {
    if (!initializedRef.current) {
      initializedRef.current = true;
      return;
    }
    actualizarFrase();
  }, [actualizarFrase]);

  useEffect(() => {
    const interval = setInterval(() => {
      actualizarFrase();
    }, 30000);
    return () => clearInterval(interval);
  }, [actualizarFrase]);

  useEffect(() => {
    const interval = setInterval(() => {
      setMostrarTip(true);
      setTimeout(() => setMostrarTip(false), 8000);
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <style jsx global>{`
        @keyframes capy-breathe {
          0%, 100% { transform: scale(1) rotate(-1deg); }
          50% { transform: scale(1.03) rotate(1deg); }
        }
        @keyframes capy-bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }
        @keyframes capy-happy {
          0%, 100% { transform: scale(1) rotate(-2deg); }
          25% { transform: scale(1.08) rotate(3deg); }
          50% { transform: scale(1.05) rotate(-2deg); }
          75% { transform: scale(1.08) rotate(3deg); }
        }
        @keyframes capy-bubble-in {
          from { opacity: 0; transform: translateY(20px) scale(0.9); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes capy-tip-in {
          from { opacity: 0; transform: translateX(-20px) scale(0.9); }
          to { opacity: 1; transform: translateX(0) scale(1); }
        }
        @keyframes capy-tip-in-main {
          from { opacity: 0; transform: translateX(-20px) scale(0.9); }
          to { opacity: 1; transform: translateX(0) scale(1); }
        }
        .capybara {
          filter: drop-shadow(0 8px 24px rgba(0,0,0,0.5));
        }
        .capybara:hover {
          animation: capy-bounce 0.5s ease-in-out;
        }
        @keyframes capy-bounce {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          25% { transform: translateY(-8px) rotate(3deg); }
          50% { transform: translateY(-12px) rotate(-2deg); }
          75% { transform: translateY(-8px) rotate(3deg); }
        }
      `}</style>

      {/* Capibara principal - esquina */}
      <div
        className="capybara"
        style={{
          position: "fixed",
          zIndex: 30,
          pointerEvents: "none",
          transition: "transform 300ms cubic-bezier(.34,1.4,.64,1), opacity 200ms",
          transform: animando ? "scale(1) rotate(0deg)" : "scale(0.8) rotate(-5deg)",
          opacity: animando ? 1 : 0,
          ...pos,
        }}
        aria-hidden="true"
      >
        <div
          style={{
            width: 72,
            height: 72,
            background: "linear-gradient(180deg, #8b7355 0%, #6b5542 100%)",
            borderRadius: "50% 50% 50% 50% / 60% 60% 40% 40%",
            border: "3px solid #4a3a2e",
            boxShadow: "0 8px 24px rgba(0,0,0,0.5), inset 0 -4px 8px rgba(0,0,0,0.3)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 36,
            filter: "drop-shadow(0 4px 12px rgba(0,0,0,0.5))",
            animation: "capy-breathe 3s ease-in-out infinite",
          }}
        >
          {emoji}
        </div>
      </div>

      {/* Burbuja de diálogo */}
      <div
        className="capy-bubble"
        style={{
          position: "fixed",
          zIndex: 29,
          pointerEvents: "none",
          maxWidth: 220,
          bottom: 200,
          right: 24,
          background: "#151310",
          border: "3px solid #2a2620",
          borderRadius: "16px",
          padding: "14px 16px",
          boxShadow: "0 12px 40px rgba(0,0,0,0.6), 0 0 0 3px #1e8c4d",
          opacity: 0.95,
          animation: "capy-bubble-in 400ms cubic-bezier(.34,1.4,.64,1)",
          fontFamily: "var(--font-rpg)",
          fontSize: 10,
          lineHeight: 1.4,
          color: "#f4efe6",
          textTransform: "uppercase",
          letterSpacing: "0.02em",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
          <span style={{ fontSize: 16 }}>🌿</span>
          <strong style={{ color: "#1e8c4d", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.03em" }}>CAPIBARA</strong>
        </div>
        <p style={{ fontSize: 10, lineHeight: 1.4, color: "#c8c0b3" }}>{frase}</p>
      </div>

      {/* Tip contextual flotante */}
      {mostrarTip && (
        <div
          className="capy-tip"
          style={{
            position: "fixed",
            zIndex: 28,
            pointerEvents: "none",
            maxWidth: 260,
            bottom: 120,
            left: 24,
            background: "#0f342d",
            border: "3px solid #10b981",
            borderRadius: "16px",
            padding: "14px 16px",
            boxShadow: "0 12px 40px rgba(0,0,0,0.6), 0 0 0 3px #10b981",
            opacity: 0.95,
            animation: "capy-tip-in 400ms cubic-bezier(.34,1.4,.64,1)",
            fontFamily: "var(--font-rpg)",
            fontSize: 10,
            lineHeight: 1.4,
            color: "#f4efe6",
            textTransform: "uppercase",
            letterSpacing: "0.02em",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
            <span style={{ fontSize: 14 }}>💡</span>
            <strong style={{ color: "#10b981", fontSize: 10, textTransform: "uppercase" }}>PISTA CAPIBARA</strong>
          </div>
          <p style={{ fontSize: 10, lineHeight: 1.4, color: "#c8c0b3" }}>
            {randomChoice(FRASES.pista)}
          </p>
        </div>
      )}

      {/* Tip component para usar en HomeClient - SIN estilos anidados */}
      <style jsx global>{`
        .capybara {
          filter: drop-shadow(0 8px 24px rgba(0,0,0,0.5));
        }
        .capybara:hover {
          animation: capy-bounce 0.5s ease-in-out;
        }
        @keyframes capy-bounce {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          25% { transform: translateY(-8px) rotate(3deg); }
          50% { transform: translateY(-12px) rotate(-2deg); }
          75% { transform: translateY(-8px) rotate(3deg); }
        }
      `}</style>
    </>
  );
}

const TIPS_SQL = [
  "💡 USA EXPLAIN ANALYZE PARA VER EL PLAN DE EJECUCIÓN.",
  "💡 LOS ÍNDICES CUBREN WHERE + ORDER BY JUNTOS.",
  "💡 CTEs RECURSIVAS: UNION ALL + CONDICIÓN DE PARADA.",
  "💡 WINDOW FUNCTIONS: PARTITION BY ANTES QUE ORDER BY.",
  "💡 NULLS FIRST/LAST CONTROLA EL ORDEN DE NULOS.",
];

const TIPS_JS = [
  "💡 MAP/FILTER/REDUCE SON TUS ALIADOS. EVITA FOR.",
  "💡 SET ELIMINA DUPLICADOS EN O(1).",
  "💡 REDUCE CON OBJETO INICIAL AGRUPA Y PROMEDIA EN UNA PASADA.",
  "💡 DESTRUCTURING: CONST {A, B:C} = OBJ; REEMPLAZA AL VUELO.",
];

export function CapybaraTip({ track }: { track?: "sql" | "js" }) {
  const [tip, setTip] = useState("");
  const [visible, setVisible] = useState(false);
  const tipRef = useRef("");

  useEffect(() => {
    const tips = track === "js" ? TIPS_JS : TIPS_SQL;
    const selectedTip = tips[Math.floor(Math.random() * tips.length)];
    tipRef.current = selectedTip;
    setTip(selectedTip);
    setVisible(true);
    const t = setTimeout(() => setVisible(false), 10000);
    return () => clearTimeout(t);
  }, [track]);

  if (!visible) return null;

  return (
    <div
      style={{
        position: "fixed",
        zIndex: 28,
        pointerEvents: "none",
        maxWidth: 280,
        bottom: 140,
        left: 24,
        background: "#0f342d",
        border: "3px solid #10b981",
        borderRadius: "16px",
        padding: "14px 16px",
        boxShadow: "0 12px 40px rgba(0,0,0,0.6), 0 0 0 3px #10b981",
        opacity: 0.95,
        animation: "capy-tip-in-main 400ms cubic-bezier(.34,1.4,.64,1)",
        fontFamily: "var(--font-rpg)",
        fontSize: 10,
        lineHeight: 1.4,
        color: "#f4efe6",
        textTransform: "uppercase",
        letterSpacing: "0.02em",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
        <span style={{ fontSize: 14 }}>💡</span>
        <strong style={{ color: "#10b981", fontSize: 10, textTransform: "uppercase" }}>PISTA CAPIBARA</strong>
      </div>
      <p style={{ fontSize: 10, lineHeight: 1.4, color: "#c8c0b3" }}>{tip}</p>
    </div>
  );
}