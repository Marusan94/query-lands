"use client";
import { useState } from "react";
import Link from "next/link";
import type { JsChallenge } from "@/lib/curriculumJs";
import { loadDraft, saveDraft, markDone } from "@/lib/progress";
import { registraIntento } from "@/lib/estado";
import { sonido } from "@/lib/sonido";
import HintIA from "@/components/HintIA";
import Celebracion from "@/components/Celebracion";

const XP_JS: Record<string, number> = { facil: 10, media: 20, dificil: 30 };

function deepEqual(a: unknown, b: unknown): boolean {
  return JSON.stringify(a) === JSON.stringify(b);
}

function runFn(code: string, fnName: string, args: unknown[]): unknown {
  const factory = new Function(`${code}; return ${fnName};`);
  const fn = factory() as (...a: unknown[]) => unknown;
  return fn(...args);
}

function fnNameOf(ch: JsChallenge): string {
  const m = ch.firma.match(/function\s+([A-Za-z_$][\w$]*)/);
  return m ? m[1] : "fn";
}

export default function JsRunner({ challenge, siguiente }: { challenge: JsChallenge; siguiente?: { id: string; titulo: string } }) {
  const [code, setCode] = useState(() => loadDraft(`js-${challenge.id}`, challenge.default_code));
  const [status, setStatus] = useState("[~] listo — [Run] corre tests visibles");
  const [lines, setLines] = useState<string[]>([]);
  const [attempts, setAttempts] = useState(0);
  const [fiesta, setFiesta] = useState<number | null>(null);
  const [sheet, setSheet] = useState<"pass" | "fail" | null>(null);

  function run(submit: boolean) {
    setAttempts((a) => a + 1);
    setSheet(null);
    const fn = fnNameOf(challenge);
    const out: string[] = [];
    let okVis = true;
    for (const t of challenge.tests) {
      try {
        const got = runFn(code, fn, t.args);
        const ok = deepEqual(got, t.esperado);
        out.push(`${ok ? "[+]" : "[!]"} ${t.nombre}`);
        if (!ok) { okVis = false; out.push(`    esperado ${JSON.stringify(t.esperado)} · recibido ${JSON.stringify(got)}`); }
      } catch (e) {
        okVis = false;
        out.push(`[!] ${t.nombre} — error: ${e instanceof Error ? e.message : String(e)}`);
      }
    }
    if (!okVis) {
      setLines(out);
      setStatus("[~] fallan tests visibles");
      if (submit) {
        registraIntento(`js-${challenge.id}`, false);
        sonido.incorrecto();
        setSheet("fail");
      }
      return;
    }
    if (submit) {
      for (const t of challenge.hidden_tests) {
        try {
          const got = runFn(code, fn, t.args);
          if (!deepEqual(got, t.esperado)) {
            setLines([...out, `[!] test oculto falla — revisa casos borde`]);
            setStatus("[!] pasa visibles, falla oculto");
            registraIntento(`js-${challenge.id}`, false);
            sonido.incorrecto();
            setSheet("fail");
            return;
          }
        } catch (e) {
          setLines([...out, `[!] test oculto lanza error: ${e instanceof Error ? e.message : String(e)}`]);
          setStatus("[!] falla oculto");
          registraIntento(`js-${challenge.id}`, false);
          sonido.incorrecto();
          setSheet("fail");
          return;
        }
      }
      registraIntento(`js-${challenge.id}`, true);
      markDone(`js-${challenge.id}`, challenge.dificultad);
      sonido.completo();
      setSheet("pass");
      const xp = XP_JS[challenge.dificultad] ?? 20;
      setFiesta(xp);
      setTimeout(() => setFiesta(null), 1200);
    }
    setLines(out);
    setStatus(submit ? "[+] pass — submit OK" : "[+] visibles OK — haz [Submit]");
  }

  return (
    <div id="leccion" style={{ scrollMarginTop: 72 }}>
      <div className="terminal" style={{ padding: "24px 16px" }}>
        <div style={{ fontSize: 12, color: "#aaa4a4", marginBottom: 8 }}>$ node {challenge.id}.js — {challenge.firma} ...</div>
        <textarea
          aria-label="tu código javascript"
          className="terminal-inner"
          value={code}
          onChange={(e) => { setCode(e.target.value); saveDraft(`js-${challenge.id}`, e.target.value); }}
          rows={10}
          spellCheck={false}
          style={{ width: "100%", color: "#fdfcfc", fontFamily: "inherit", fontSize: 14, border: "1px solid #3d3939", outline: "none" }}
        />
        <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 12 }}>
          <button className="btn btn-accent" style={{ width: "100%", minHeight: 52, fontSize: 17 }} onClick={() => run(true)}>[COMPROBAR]</button>
          <div style={{ display: "flex", gap: 8 }}>
            <button className="btn btn-secondary" style={{ flex: 1, color: "#fdfcfc", borderColor: "#3d3939" }} onClick={() => run(false)}>probar</button>
            <button className="btn btn-secondary" style={{ flex: 1, color: "#fdfcfc", borderColor: "#3d3939" }} onClick={() => { setCode(challenge.default_code); saveDraft(`js-${challenge.id}`, challenge.default_code); }}>reset</button>
          </div>
          <span style={{ fontSize: 13, color: "#aaa4a4" }} role="status">{status}</span>
        </div>
      </div>
      {lines.length > 0 && (
        <pre className="codeblock" style={{ marginTop: 16, whiteSpace: "pre-wrap" }}>{lines.join("\n")}</pre>
      )}
      {sheet === "fail" && (
        <div className="sheet sheet-err" role="alert">
          <div style={{ fontWeight: 800, fontSize: 18 }} className="st-err">✕ Todavía no</div>
          <div style={{ fontSize: 14, marginTop: 4 }}>Revisa el detalle arriba e inténtalo de nuevo.</div>
          <button className="btn btn-primary" style={{ width: "100%", marginTop: 12 }} onClick={() => setSheet(null)}>[ENTENDÍ]</button>
        </div>
      )}
      {sheet === "pass" && (
        <div className="sheet sheet-ok" role="status">
          <div style={{ fontWeight: 800, fontSize: 18 }} className="st-ok">✓ Correcto</div>
          {siguiente ? (
            <Link href={`/js/${siguiente.id}`} className="btn btn-accent" style={{ width: "100%", marginTop: 12 }}>[CONTINUAR →]</Link>
          ) : (
            <Link href="/sql" className="btn btn-accent" style={{ width: "100%", marginTop: 12 }}>[SIGUE CON SQL →]</Link>
          )}
        </div>
      )}
      <HintIA
        track="js"
        titulo={challenge.titulo}
        enunciado={challenge.enunciado}
        getCodigo={() => code}
        getError={() => lines.filter((l) => l.startsWith("[!]")).join("\n")}
        getIntentos={() => attempts}
      />
      {status.startsWith("[+]") && (
        <div className="card" style={{ marginTop: 16, borderColor: "var(--success)", background: "var(--success-soft)" }} role="status">
          <div style={{ padding: 16 }}>
            <div style={{ fontWeight: 700 }} className="st-ok">✓ Correcto</div>
            {siguiente ? (
              <a href={`/js/${siguiente.id}`} className="btn btn-accent" style={{ width: "100%", marginTop: 12 }}>[CONTINUAR → {siguiente.titulo}]</a>
            ) : (
              <div style={{ fontSize: 14, marginTop: 8 }}>Track completado. Sigue con SQL o repasa.</div>
            )}
          </div>
        </div>
      )}
      {fiesta !== null && <Celebracion xp={fiesta} />}
    </div>
  );
}
