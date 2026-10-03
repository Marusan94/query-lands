"use client";
import { useSyncExternalStore } from "react";

function subscribe(cb: () => void): () => void {
  const obs = new MutationObserver(cb);
  obs.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  return () => obs.disconnect();
}

function snapshot(): "light" | "dark" {
  return document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light";
}

export default function ThemeToggle() {
  const theme = useSyncExternalStore(subscribe, snapshot, () => "light" as const);

  function toggle() {
    const next = snapshot() === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    try {
      localStorage.setItem("til-theme", next);
    } catch { /* noop */ }
  }

  return (
    <button
      onClick={toggle}
      aria-label={theme === "dark" ? "cambiar a modo claro" : "cambiar a modo oscuro"}
      title={theme === "dark" ? "modo claro" : "modo oscuro"}
      style={{
        height: 32, minWidth: 32, padding: "0 8px", borderRadius: 999, display: "inline-flex", alignItems: "center", justifyContent: "center",
        border: "1px solid var(--hairline-strong)", background: "transparent",
        color: "inherit", cursor: "pointer", fontFamily: "inherit",
      }}
    >
      <span className={`yinyang${theme === "dark" ? " yinyang-rotado" : ""}`} style={{ width: 18, height: 18 }} aria-hidden />
    </button>
  );
}
