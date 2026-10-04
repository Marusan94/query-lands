"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { loadPerfil } from "@/lib/estado";
import ThemeToggle from "@/components/ThemeToggle";

export default function TopBar() {
  const [nombre, setNombre] = useState("Estudiante");
  useEffect(() => {
    const lee = () => {
      try {
        const n = loadPerfil().nombre;
        if (n) setNombre(n);
      } catch { /* noop */ }
    };
    lee();
    const t = setInterval(lee, 3000);
    return () => clearInterval(t);
  }, []);
  const iniciales = nombre.trim().split(/\s+/).map((w) => w[0]).join("").slice(0, 2).toUpperCase() || "ES";
  return (
    <header className="site-chrome" style={{ borderBottom: "1px solid var(--hairline)", position: "sticky", top: 0, zIndex: 30 }}>
      <div style={{ marginInline: "auto", padding: "10px 24px", display: "flex", alignItems: "center", gap: 10 }} className="topbar-inner">
        <Link href="/" style={{ fontWeight: 800, textDecoration: "none", letterSpacing: 1 }} aria-label="inicio">
          Query<span style={{ color: "var(--accent-2)" }}> Lands</span>
        </Link>
        <span style={{ fontSize: 13, opacity: 0.75 }}>Islas de práctica</span>
        <div style={{ marginLeft: "auto", display: "flex", gap: 8, alignItems: "center" }}>
          <ThemeToggle />
          <Link href="/perfil" aria-label="tu perfil"
            style={{ display: "flex", gap: 8, alignItems: "center", textDecoration: "none", border: "1px solid var(--hairline-strong)", borderRadius: 999, padding: "4px 12px 4px 4px" }}>
            <span style={{ width: 28, height: 28, borderRadius: "50%", background: "var(--accent-2)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 800 }}>
              {iniciales}
            </span>
            <span style={{ fontSize: 13, fontWeight: 700 }}>{nombre}</span>
            <span style={{ fontSize: 11, opacity: 0.7 }}>(Estudiante)</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
