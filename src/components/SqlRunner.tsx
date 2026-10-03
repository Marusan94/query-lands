"use client";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import type { Challenge } from "@/lib/curriculum";
import { compareResults, type Row } from "@/lib/engine";
import { loadDraft, saveDraft, markDone } from "@/lib/progress";
import { registraIntento } from "@/lib/estado";
import HintIA from "@/components/HintIA";
import Celebracion from "@/components/Celebracion";
import { sonido } from "@/lib/sonido";
import { xpFor } from "@/lib/curriculum";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let SQL: any = null;
async function loadSql() {
  if (SQL) return SQL;
  const init = (await import("sql.js")).default;
  SQL = await init({ locateFile: (f: string) => `/${f}` });
  return SQL;
}

function execAll(db: unknown, sql: string): { columns: string[]; rows: Row[] } {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const res = (db as any).exec(sql);
  if (!res || res.length === 0) return { columns: [], rows: [] };
  const first = res[res.length - 1];
  const { columns, values } = first;
  return { columns, rows: values.map((v: unknown[]) => Object.fromEntries(columns.map((c: string, i: number) => [c, v[i]]))) };
}

function DataTable({ columns, rows, cap = 50 }: { columns: string[]; rows: Row[]; cap?: number }) {
  if (columns.length === 0) return <div style={{ fontSize: 14, color: "var(--mute)" }}>[~] sin filas (¿UPDATE/DELETE?)</div>;
  return (
    <div className="card-flat" style={{ overflowX: "auto" }}>
      <table className="table-lab">
        <thead><tr>{columns.map((c) => <th key={c}>{c}</th>)}</tr></thead>
        <tbody>{rows.slice(0, cap).map((r, i) => <tr key={i}>{columns.map((c) => <td key={c}>{String(r[c] ?? "NULL")}</td>)}</tr>)}</tbody>
      </table>
    </div>
  );
}

export default function SqlRunner({ challenge, siguiente }: { challenge: Challenge; siguiente?: { id: string; titulo: string } }) {
  const [query, setQuery] = useState(() => loadDraft(challenge.id, challenge.default_query));
  const [out, setOut] = useState<{ columns: string[]; rows: Row[] } | null>(null);
  const [expected, setExpected] = useState<{ columns: string[]; rows: Row[] } | null>(null);
  const [samples, setSamples] = useState<{ name: string; columns: string[]; rows: Row[] }[]>([]);
  const [status, setStatus] = useState("[~] listo — Ctrl+Enter para [Run]");
  const [err, setErr] = useState("");
  const [attempts, setAttempts] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [showExpected, setShowExpected] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const [fiesta, setFiesta] = useState<number | null>(null);
  const [sheet, setSheet] = useState<"pass" | "fail" | null>(null);

  function celebrar() {
    const xp = xpFor(challenge);
    setFiesta(xp);
    setTimeout(() => setFiesta(null), 1200);
  }

  useEffect(() => {
    const t = setInterval(() => setElapsed((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, []);

  const mmss = useMemo(() => `${String(Math.floor(elapsed / 60)).padStart(2, "0")}:${String(elapsed % 60).padStart(2, "0")}`, [elapsed]);

  async function freshDb() {
    const Lib = await loadSql();
    const db = new Lib.Database();
    db.run(challenge.schema_sql);
    db.run(challenge.seed_sql);
    return db;
  }

  async function inspect() {
    try {
      const db = await freshDb();
      const tables = execAll(db, "SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%';");
      const s = [];
      for (const t of tables.rows.slice(0, 4)) {
        const name = String(t.name);
        try {
          const data = execAll(db, `SELECT * FROM "${name}" LIMIT 5;`);
          s.push({ name, columns: data.columns, rows: data.rows });
        } catch { /* noop */ }
      }
      setSamples(s);
    } catch { /* noop */ }
  }

  async function run(submit: boolean) {
    setErr(""); setSheet(null); setStatus("[~] ejecutando..."); setAttempts((a) => a + 1);
    try {
      const db = await freshDb();
      let user;
      try {
        user = execAll(db, query);
      } catch (e: unknown) {
        setErr(e instanceof Error ? e.message : String(e));
        setStatus("[!] error de sintaxis — revisa comillas y punto y coma");
        return;
      }
      setOut(user);
      const exp = execAll(db, challenge.solucion_sql);
      setExpected(exp);
      const cmp = compareResults(user.columns, user.rows, exp.columns, exp.rows, challenge.solucion_sql);
      if (!cmp.ok) {
        setStatus(submit ? "[!] fail — compara esperado vs recibido" : "[~] corre pero difiere del esperado");
        if (cmp.hint) setErr(cmp.hint);
        if (submit) {
          registraIntento(challenge.id, false);
          sonido.incorrecto();
          setSheet("fail");
        }
        return;
      }
      if (submit && challenge.hidden_seed_sql) {
        try {
          const hdb = await freshDb();
          hdb.run(challenge.hidden_seed_sql);
          const huser = execAll(hdb, query);
          const hexp = execAll(hdb, challenge.solucion_sql);
          const hcmp = compareResults(huser.columns, huser.rows, hexp.columns, hexp.rows, challenge.solucion_sql);
          if (!hcmp.ok) {
            setStatus("[!] pasa el ejemplo pero falla el test oculto");
            setErr(challenge.hidden_hint ?? "Revisa casos borde: duplicados, empates y fechas repetidas.");
            registraIntento(challenge.id, false);
            sonido.incorrecto();
            setSheet("fail");
            return;
          }
        } catch (e: unknown) {
          setStatus("[!] tu query falla en el test oculto (error SQL)");
          setErr(e instanceof Error ? e.message : String(e));
          registraIntento(challenge.id, false);
          sonido.incorrecto();
          setSheet("fail");
          return;
        }
      }
      if (!submit) sonido.correcto();
      setStatus(`[+] pass en intento ${attempts + 1} — ${mmss}`);
      if (submit) {
        registraIntento(challenge.id, true);
        markDone(challenge.id, challenge.dificultad, elapsed);
        sonido.completo();
        setSheet("pass");
        celebrar();
      }
    } catch (e: unknown) {
      setErr(e instanceof Error ? e.message : String(e));
      setStatus("[!] error interno");
    }
  }

  return (
    <div id="leccion" style={{ scrollMarginTop: 72 }}>
      <div className="terminal" style={{ padding: "24px 16px" }}>
        <div style={{ fontSize: 12, color: "#aaa4a4", marginBottom: 8, display: "flex", gap: 12 }}>
          <span>$ sqlite3 lab.db — {challenge.id}</span>
          <span style={{ marginLeft: "auto" }}>[{mmss}] · intento {attempts}</span>
        </div>
        <label htmlFor={`q-${challenge.id}`} style={{ fontSize: 12, color: "#aaa4a4" }}>tu query — Ctrl+Enter ejecuta</label>
        <textarea
          id={`q-${challenge.id}`}
          className="terminal-inner"
          value={query}
          onChange={(e) => { setQuery(e.target.value); saveDraft(challenge.id, e.target.value); }}
          onKeyDown={(e) => { if ((e.ctrlKey || e.metaKey) && e.key === "Enter") run(false); }}
          rows={9}
          spellCheck={false}
          style={{ width: "100%", color: "#fdfcfc", fontFamily: "inherit", fontSize: 14, border: "1px solid #3d3939", outline: "none", marginTop: 8 }}
        />
        <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 12 }}>
          <button className="btn btn-accent" style={{ width: "100%", minHeight: 52, fontSize: 17 }} onClick={() => run(true)}>[COMPROBAR]</button>
          <div style={{ display: "flex", gap: 8 }}>
            <button className="btn btn-secondary" style={{ flex: 1 }} onClick={() => run(false)}>probar</button>
            <button className="btn btn-secondary" style={{ flex: 1, color: "#fdfcfc", borderColor: "#3d3939" }} onClick={() => { setQuery(challenge.default_query); saveDraft(challenge.id, challenge.default_query); }}>reset</button>
            <button className="btn btn-secondary" style={{ flex: 1, color: "#fdfcfc", borderColor: "#3d3939" }} onClick={() => setShowExpected((v) => !v)}>{showExpected ? "ocultar" : "esperado"}</button>
          </div>
          <span style={{ fontSize: 13, color: "#aaa4a4" }} role="status">{status}</span>
        </div>
      </div>

      {samples.length === 0 ? (
        <div style={{ marginTop: 16 }}>
          <button className="btn btn-secondary" style={{ height: 32, fontSize: 14 }} onClick={inspect}>[ver] datos de ejemplo</button>
        </div>
      ) : (
        <div style={{ marginTop: 16 }}>
          <div style={{ fontSize: 14, fontWeight: 500 }}>[~] datos de ejemplo (primeras 5 filas)</div>
          <div style={{ display: "grid", gap: 12, marginTop: 8 }}>
            {samples.map((s) => (
              <div key={s.name}>
                <div style={{ fontSize: 12, color: "var(--mute)" }}>$ SELECT * FROM {s.name} LIMIT 5;</div>
                <div style={{ marginTop: 4 }}><DataTable columns={s.columns} rows={s.rows} cap={5} /></div>
              </div>
            ))}
          </div>
        </div>
      )}

      {sheet === "fail" && (
        <div className="sheet sheet-err" role="alert">
          <div style={{ fontWeight: 800, fontSize: 18 }} className="st-err">✕ Todavía no</div>
          <pre style={{ whiteSpace: "pre-wrap", margin: "8px 0 0", fontSize: 14 }}>{err}</pre>
          <button className="btn btn-primary" style={{ width: "100%", marginTop: 12 }} onClick={() => { setSheet(null); setErr(""); }}>[ENTENDÍ]</button>
        </div>
      )}

      {sheet === "pass" && (
        <div className="sheet sheet-ok" role="status">
          <div style={{ fontWeight: 800, fontSize: 18 }} className="st-ok">✓ Correcto · +{xpFor(challenge)} XP</div>
          {siguiente ? (
            <Link href={`/sql/${siguiente.id}`} className="btn btn-accent" style={{ width: "100%", marginTop: 12 }}>[CONTINUAR →]</Link>
          ) : (
            <Link href="/sql/simulacro" className="btn btn-accent" style={{ width: "100%", marginTop: 12 }}>[SIMULACRO FINAL →]</Link>
          )}
        </div>
      )}

      {out && (
        <div style={{ marginTop: 16 }}>
          <div style={{ fontSize: 14, color: "var(--mute)" }}>[&gt;] tu resultado — {out.rows.length} filas</div>
          <div style={{ marginTop: 8 }}><DataTable columns={out.columns} rows={out.rows} /></div>
        </div>
      )}

      {showExpected && expected && (
        <div style={{ marginTop: 16 }}>
          <div style={{ fontSize: 14, color: "var(--mute)" }}>[=] esperado — {expected.rows.length} filas</div>
          <div style={{ marginTop: 8 }}><DataTable columns={expected.columns} rows={expected.rows} /></div>
        </div>
      )}

      {!sheet && err && (
        <div className="codeblock" style={{ marginTop: 16, borderColor: "var(--danger)" }}>
          <pre style={{ whiteSpace: "pre-wrap", margin: 0, fontSize: 14 }}>{err}</pre>
        </div>
      )}

      <HintIA
        track="sql"
        titulo={challenge.titulo}
        enunciado={challenge.enunciado}
        getCodigo={() => query}
        getError={() => err}
        getIntentos={() => attempts}
      />

      <div className="card-flat" style={{ padding: 16, marginTop: 16 }}>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <span style={{ fontSize: 14, fontWeight: 500 }}>[?] solución</span>
          <button className="btn btn-secondary" style={{ height: 32, fontSize: 14 }} onClick={() => setShowSolution((v) => !v)}>{showSolution ? "[ocultar]" : "[revelar]"}</button>
          <span style={{ fontSize: 12, color: "var(--mute)" }}>úsala solo tras 3 intentos</span>
        </div>
        {showSolution && <pre className="codeblock" style={{ marginTop: 8 }}>{challenge.solucion_sql}</pre>}
      </div>
      {fiesta !== null && <Celebracion xp={fiesta} />}
    </div>
  );
}
