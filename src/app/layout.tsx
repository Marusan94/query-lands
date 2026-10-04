import type { Metadata } from "next";
import { Plus_Jakarta_Sans, JetBrains_Mono, VT323 } from "next/font/google";
import Link from "next/link";
import TopBar from "@/components/TopBar";
import AppNav from "@/components/AppNav";
import "./globals.css";

const sans = Plus_Jakarta_Sans({ variable: "--font-sans", subsets: ["latin"], display: "swap" });
const mono = JetBrains_Mono({ variable: "--font-mono", subsets: ["latin"], display: "swap" });
const rpg = VT323({ variable: "--font-rpg", subsets: ["latin"], display: "swap", weight: "400" });

export const metadata: Metadata = {
  title: "Query Lands | Ruta Técnica",
  description: "Ruta guiada de desafíos técnicos reales: SQL y JS en tu browser, con racha, metas, repaso y compañero capibara.",
};

const init = `(function(){try{var t=localStorage.getItem('til-theme');if(!t){t=window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';}document.documentElement.setAttribute('data-theme',t);if(localStorage.getItem('til-calm')==='on'){document.documentElement.setAttribute('data-calm','on');}var fs=localStorage.getItem('til-fuente');if(fs){document.documentElement.style.setProperty('--texto',fs+'px');}}catch(e){}})();`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${sans.variable} ${mono.variable} ${rpg.variable} h-full`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: init }} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="min-h-full">
        <a className="skip-link" href="#contenido">[saltar al contenido]</a>
        <TopBar />
        <div className="app-shell">
          <AppNav />
          <div className="app-main">
            <div id="contenido" style={{ padding: "0 24px 48px" }}>{children}</div>
            <footer className="site-chrome" style={{ borderTop: "1px solid var(--hairline)" }}>
              <div style={{ padding: "16px 24px", fontSize: 13, display: "flex", gap: 16, opacity: 0.85 }}>
                <Link href="/cursos">cursos</Link><Link href="/ajustes">ajustes</Link>
                <span style={{ marginLeft: "auto" }}>⚔ 2026 Query Lands</span>
              </div>
            </footer>
          </div>
        </div>
      </body>
    </html>
  );
}