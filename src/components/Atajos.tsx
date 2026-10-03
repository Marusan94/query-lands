"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Atajos() {
  const router = useRouter();
  const [show, setShow] = useState(false);
  const [g, setG] = useState(false);

  useEffect(() => {
    let pending = false;
    function onKey(e: KeyboardEvent) {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === "TEXTAREA" || tag === "INPUT" || tag === "SELECT") return;
      if (e.key === "?") { setShow((v) => !v); return; }
      if (e.key === "g") { pending = true; setG(true); setTimeout(() => { pending = false; setG(false); }, 800); return; }
      if (pending) {
        pending = false; setG(false);
        if (e.key === "s") router.push("/sql");
        else if (e.key === "j") router.push("/js");
        else if (e.key === "l") router.push("/logros");
        else if (e.key === "h") router.push("/");
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [router]);

  return (
    <>
      <button
        onClick={() => setShow((v) => !v)} aria-label="ver atajos de teclado"
        style={{ height: 32, padding: "0 12px", borderRadius: 4, fontSize: 14, border: "1px solid var(--hairline-strong)", background: "transparent", color: "inherit", cursor: "pointer", fontFamily: "inherit" }}
      >[?]</button>
      {show && (
        <div role="dialog" aria-label="atajos de teclado" className="card-flat" style={{ position: "fixed", right: 16, bottom: 16, background: "var(--canvas)", padding: 16, zIndex: 40, minWidth: 240 }}>
          <div style={{ fontWeight: 700 }}>[?] atajos{g ? " — g…" : ""}</div>
          <div style={{ fontSize: 14, marginTop: 8, display: "grid", gap: 4 }}>
            <span>g s → track sql</span><span>g j → track js</span><span>g l → logros</span><span>g h → inicio</span><span>? → este panel</span>
          </div>
          <button className="btn btn-secondary" style={{ height: 32, fontSize: 14, marginTop: 12 }} onClick={() => setShow(false)}>[cerrar]</button>
        </div>
      )}
    </>
  );
}
