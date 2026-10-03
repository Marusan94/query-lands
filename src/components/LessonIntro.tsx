"use client";

export default function LessonIntro(props: { titulo: string; xp: number; minutos: number; puntos: string[] }) {
  return (
    <div className="card" style={{ padding: 20, marginTop: 16, background: "var(--accent-2-soft)" }}>
      <div style={{ fontSize: 13, fontWeight: 700, color: "var(--accent-2)" }}>HOY PRACTICARÁS · {props.titulo.toUpperCase()}</div>
      <ul style={{ marginTop: 8, paddingLeft: 20, display: "grid", gap: 4 }}>
        {props.puntos.map((p) => (
          <li key={p}>{p}</li>
        ))}
      </ul>
      <div style={{ display: "flex", gap: 16, marginTop: 12, fontSize: 14, flexWrap: "wrap" }}>
        <span>~{props.minutos} min</span>
        <span className="st-xp">+{props.xp} XP</span>
      </div>
      <a href="#leccion" className="btn btn-accent" style={{ width: "100%", marginTop: 12 }}>[COMENZAR]</a>
    </div>
  );
}
