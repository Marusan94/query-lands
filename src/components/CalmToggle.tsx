"use client";
import { useSyncExternalStore } from "react";

function subscribe(cb: () => void): () => void {
  const obs = new MutationObserver(cb);
  obs.observe(document.documentElement, { attributes: true, attributeFilter: ["data-calm"] });
  return () => obs.disconnect();
}

function snapshot(): boolean {
  return document.documentElement.getAttribute("data-calm") === "on";
}

export default function CalmToggle() {
  const on = useSyncExternalStore(subscribe, snapshot, () => false);

  function toggle() {
    const next = !snapshot();
    document.documentElement.setAttribute("data-calm", next ? "on" : "off");
    try {
      localStorage.setItem("til-calm", next ? "on" : "off");
    } catch { /* noop */ }
  }

  return (
    <button
      onClick={toggle}
      aria-pressed={on}
      aria-label={on ? "desactivar modo calma" : "activar modo calma"}
      title="modo calma: más aire, menos estímulo"
      style={{
        height: 32, padding: "0 12px", borderRadius: 4, fontSize: 14,
        border: "1px solid var(--hairline-strong)", background: on ? "var(--accent-2-soft)" : "transparent",
        color: "inherit", cursor: "pointer", fontFamily: "inherit",
      }}
    >
      {on ? "[calma on]" : "[calma]"}
    </button>
  );
}
