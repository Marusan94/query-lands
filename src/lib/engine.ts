export type Row = Record<string, unknown>;
export type RunResult = { columns: string[]; rows: Row[] };
export type CheckResult =
  | { ok: true; rows: Row[]; columns: string[] }
  | { ok: false; error?: string; expected?: Row[]; got?: Row[]; hint?: string };

function canonValue(v: unknown): unknown {
  if (v === null || v === undefined) return null;
  if (typeof v === "number") return Math.round(v * 1e6) / 1e6;
  if (typeof v === "string") {
    const t = v.trim();
    const n = Number(t);
    if (t !== "" && !Number.isNaN(n)) return Math.round(n * 1e6) / 1e6;
    return t;
  }
  if (typeof v === "bigint") return Number(v);
  return v;
}

export function normalizeRows(columns: string[], rows: Row[], orderMatters: boolean): string[] {
  const canon = rows.map((r) => {
    const o: Row = {};
    for (const c of columns) o[c.toLowerCase()] = canonValue(r[c]);
    return JSON.stringify(o, Object.keys(o).sort());
  });
  if (!orderMatters) canon.sort();
  return canon;
}

export function orderMattersIn(solutionSql: string): boolean {
  return /\border\s+by\b/i.test(solutionSql);
}

export function compareResults(
  userCols: string[],
  userRows: Row[],
  expCols: string[],
  expRows: Row[],
  solutionSql: string
): CheckResult {
  const norm = (s: string) => s.toLowerCase().trim();
  const uCols = userCols.map(norm).sort();
  const eCols = expCols.map(norm).sort();
  if (uCols.length !== eCols.length || !uCols.every((c, i) => c === eCols[i])) {
    return { ok: false, hint: `Columnas esperadas: [${eCols.join(", ")}], recibidas: [${uCols.join(", ")}]. Revisa alias y SELECT.`, expected: expRows, got: userRows };
  }
  if (userRows.length === 0 && expRows.length === 0) return { ok: true, rows: userRows, columns: userCols };
  const om = orderMattersIn(solutionSql);
  const u = normalizeRows(userCols, userRows, om);
  const e = normalizeRows(expCols, expRows, om);
  if (u.length !== e.length) {
    return { ok: false, hint: `Filas esperadas: ${e.length}, recibidas: ${u.length}. Revisa WHERE/JOIN/GROUP BY.`, expected: expRows, got: userRows };
  }
  for (let i = 0; i < u.length; i++) {
    if (u[i] !== e[i]) {
      const eu = JSON.stringify(expRows[Math.min(i, expRows.length - 1)]);
      const gu = JSON.stringify(userRows[Math.min(i, userRows.length - 1)]);
      return { ok: false, hint: `Difieren en fila ${i + 1}. Esperado: ${eu} — Recibido: ${gu}`, expected: expRows, got: userRows };
    }
  }
  return { ok: true, rows: userRows, columns: userCols };
}
