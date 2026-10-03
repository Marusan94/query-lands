import Link from "next/link";
import LogrosClient from "@/components/LogrosClient";

export default function LogrosPage() {
  return (
    <main style={{ paddingTop: 24 }}>
      <div><span className="badge-ink">lab / logros</span></div>
      <h1 style={{ fontSize: 32, fontWeight: 700, marginTop: 8 }}>logros</h1>
      <p style={{ color: "var(--body)", marginTop: 8, maxWidth: "68ch" }}>Se calculan de tu progreso local. Sin cuenta, sin servidor.</p>
      <LogrosClient />
      <div style={{ marginTop: 24, fontSize: 14 }}><Link href="/sql">[←] volver a SQL</Link></div>
    </main>
  );
}


