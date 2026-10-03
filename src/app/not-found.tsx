import Link from "next/link";

export default function NotFound() {
  return (
    <main style={{ paddingTop: 64, paddingBottom: 64 }}>
      <div><span className="badge-ink">[!] 404</span></div>
      <h1 style={{ fontSize: 32, marginTop: 16 }}>esa query no retornó filas</h1>
      <p style={{ color: "var(--body)", marginTop: 8, maxWidth: "68ch" }}>
        La ruta no existe. Vuelve a tu ruta y sigue aprendiendo.
      </p>
      <div style={{ display: "flex", gap: 8, marginTop: 24 }}>
        <Link className="btn btn-accent" href="/">[CONTINUAR APRENDIENDO]</Link>
      </div>
    </main>
  );
}
