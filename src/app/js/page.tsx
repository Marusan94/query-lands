import Link from "next/link";
import { jsChallenges } from "@/lib/curriculumJs";

export default function JsIndex() {
  return (
    <main style={{ paddingTop: 24 }}>
      <div><span className="badge-ink">lab / js</span></div>
      <h1 style={{ fontSize: 32, fontWeight: 700, marginTop: 8 }}>track js — {jsChallenges.length} retos</h1>
      <p style={{ color: "var(--body)", marginTop: 8, maxWidth: "68ch" }}>Filtros clásicos de entrevista frontend. Corre 100% en tu browser, con tests visibles + ocultos.</p>
      <hr className="hr" style={{ marginTop: 24 }} />
      {jsChallenges.map((c) => (
        <div key={c.id} style={{ padding: "16px 0", borderBottom: "1px solid var(--hairline)" }}>
          <div style={{ display: "flex", gap: 12, alignItems: "baseline", flexWrap: "wrap" }}>
            <span style={{ color: "var(--mute)", fontSize: 14 }}>{String(c.order).padStart(2, "0")}</span>
            <Link href={`/js/${c.id}`} style={{ fontWeight: 700 }}>{c.titulo}</Link>
            <span style={{ fontSize: 14, color: "var(--mute)" }}>[{c.dificultad}] · {c.empresa_patron}</span>
          </div>
          <div style={{ fontSize: 14, color: "var(--body)", marginTop: 4 }}>{c.enunciado.slice(0, 140)}…</div>
        </div>
      ))}
    </main>
  );
}


