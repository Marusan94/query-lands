"use client";
import { useMemo } from "react";

const COLORES = ["#2f9e44", "#1c7ed6", "#e8590c", "#f08c00", "#6d4fc2", "#0e7c6b"];

export default function Celebracion({ xp }: { xp: number }) {
  const piezas = useMemo(
    () =>
      Array.from({ length: 28 }, (_, i) => ({
        left: `${(i * 37) % 100}%`,
        delay: `${(i % 7) * 0.12}s`,
        color: COLORES[i % COLORES.length],
        w: 8 + ((i * 5) % 6),
      })),
    []
  );
  return (
    <>
      <div className="confetti-wrap" aria-hidden>
        {piezas.map((p, i) => (
          <span key={i} className="confetti-piece"
            style={{ left: p.left, background: p.color, width: p.w, animationDelay: p.delay }} />
        ))}
      </div>
      <div className="xp-float" aria-live="polite">+{xp} XP</div>
    </>
  );
}
