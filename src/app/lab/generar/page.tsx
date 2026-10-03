import Link from "next/link";
import GenerarClient from "@/components/GenerarClient";

export default function GenerarPage() {
  return (
    <main style={{ paddingTop: 24 }}>
      <div><span className="badge-ink">lab / generar</span></div>
      <h1 style={{ fontSize: 32, fontWeight: 700, marginTop: 8 }}>genera retos con IA</h1>
      <p style={{ color: "var(--body)", marginTop: 8, maxWidth: "68ch" }}>
        Describe el puesto o el tema y la IA crea un reto SQL con schema, seed y solución.
        Cada reto se <strong>auto-valida ejecutando la solución en SQLite real</strong> antes de mostrártelo.
      </p>
      <GenerarClient />
      <div style={{ marginTop: 24, fontSize: 14 }}><Link href="/sql">[←] volver a SQL</Link></div>
    </main>
  );
}


