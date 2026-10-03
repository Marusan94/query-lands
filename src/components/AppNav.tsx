"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const ITEMS = [
  { href: "/", label: "Aprender", icon: "▶" },
  { href: "/repasar", label: "Repasar", icon: "⟳" },
  { href: "/desafios", label: "Desafíos", icon: "★" },
  { href: "/cursos", label: "Cursos", icon: "▦" },
  { href: "/perfil", label: "Perfil", icon: "●" },
];

function actual(path: string, href: string): boolean {
  if (href === "/") return path === "/";
  return path.startsWith(href);
}

export default function AppNav() {
  const path = usePathname();
  return (
    <>
      <aside className="app-side" aria-label="navegación principal">
        <Link href="/" style={{ fontWeight: 800, fontSize: 18, padding: "8px 16px", textDecoration: "none", letterSpacing: 1 }}>
          LAB<span style={{ color: "var(--accent-2)" }}>.CORE</span>
        </Link>
        <div style={{ fontSize: 12, color: "var(--mute)", padding: "0 16px 8px" }}>Campus Central</div>
        {ITEMS.map((i) => (
          <Link key={i.href} href={i.href} className="side-link" aria-current={actual(path, i.href) ? "page" : undefined}>
            <span aria-hidden>{i.icon}</span> {i.label}
          </Link>
        ))}
        <div style={{ marginTop: "auto", padding: "0 16px", fontSize: 12, color: "var(--mute)" }}>
          <Link href="/ajustes">ajustes</Link> · <Link href="/lab/generar">generar IA</Link>
        </div>
      </aside>
      <nav className="bottom-nav" aria-label="navegación principal">
        {ITEMS.slice(0, 4).map((i) => (
          <Link key={i.href} href={i.href} aria-current={actual(path, i.href) ? "page" : undefined}>
            <span aria-hidden style={{ fontSize: 20 }}>{i.icon}</span>
            {i.label}
          </Link>
        ))}
      </nav>
    </>
  );
}
