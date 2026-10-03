import type { Metadata } from "next";
import { Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import Link from "next/link";
import TopBar from "@/components/TopBar";
import AppNav from "@/components/AppNav";
import "./globals.css";

const sans = Plus_Jakarta_Sans({ variable: "--font-sans", subsets: ["latin"] });
const mono = JetBrains_Mono({ variable: "--font-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "tech-interview-lab — pruebas técnicas",
  description: "Ruta guiada de pruebas técnicas reales: SQL y JS en tu browser, con racha, metas y repaso.",
};

const init = `(function(){try{var t=localStorage.getItem('til-theme');if(!t){t=window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';}document.documentElement.setAttribute('data-theme',t);if(localStorage.getItem('til-calm')==='on'){document.documentElement.setAttribute('data-calm','on');}var fs=localStorage.getItem('til-fuente');if(fs){document.documentElement.style.setProperty('--texto',fs+'px');}}catch(e){}})();`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${sans.variable} ${mono.variable} h-full`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: init }} />
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
                <span style={{ marginLeft: "auto" }}>© 2026 lab</span>
              </div>
            </footer>
          </div>
        </div>
      </body>
    </html>
  );
}
