import Link from "next/link";
import SimulacroClient from "@/components/SimulacroClient";

export default function SimulacroPage() {
  return (
    <main style={{ paddingTop: 24 }}>
      <div style={{ fontSize: 14 }}><Link href="/">lab</Link> / <Link href="/sql">sql</Link> / <span className="badge-ink">simulacro</span></div>
      <h1 style={{ fontSize: 32, fontWeight: 700, marginTop: 8 }}>simulacro 45 minutos</h1>
      <p style={{ color: "var(--body)", marginTop: 8, maxWidth: "68ch" }}>
        4 retos (fácil + media + difícil + media), cronómetro visible y sin atajos.
        Resuelve cada uno con [Submit]; el test oculto califica como en entrevista.
      </p>
      <SimulacroClient />
    </main>
  );
}


