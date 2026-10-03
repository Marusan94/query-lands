import { describe, it, expect } from "vitest";
import { compareResults } from "./engine";
import { challenges, xpFor } from "./curriculum";

describe("compareResults", () => {
  it("pass con mismo resultado desordenado cuando no hay ORDER BY", () => {
    const r = compareResults(
      ["nombre"], [{ nombre: "b" }, { nombre: "a" }],
      ["nombre"], [{ nombre: "a" }, { nombre: "b" }],
      "SELECT nombre FROM t"
    );
    expect(r.ok).toBe(true);
  });
  it("falla si columnas difieren", () => {
    const r = compareResults(["a"], [{ a: 1 }], ["b"], [{ b: 1 }], "SELECT b FROM t");
    expect(r.ok).toBe(false);
  });
  it("respeta ORDER BY", () => {
    const r = compareResults(
      ["n"], [{ n: "b" }, { n: "a" }],
      ["n"], [{ n: "a" }, { n: "b" }],
      "SELECT n FROM t ORDER BY n"
    );
    expect(r.ok).toBe(false);
  });
  it("tolera 1 vs '1' y floats con epsilon", () => {
    const r = compareResults(["v"], [{ v: 1 }], ["v"], [{ v: "1" }], "SELECT v FROM t");
    expect(r.ok).toBe(true);
    const r2 = compareResults(["v"], [{ v: 2.5000001 }], ["v"], [{ v: 2.5 }], "SELECT v FROM t");
    expect(r2.ok).toBe(true);
  });
  it("NULL == NULL y trim de strings", () => {
    const r = compareResults(["a"], [{ a: null }], ["a"], [{ a: null }], "SELECT a FROM t");
    expect(r.ok).toBe(true);
    const r2 = compareResults(["a"], [{ a: " x " }], ["a"], [{ a: "x" }], "SELECT a FROM t");
    expect(r2.ok).toBe(true);
  });
});

describe("curriculum integrity (ingeniería inversa)", () => {
  it("16 retos con ids únicos y orden 1..16", () => {
    expect(challenges).toHaveLength(16);
    const ids = new Set(challenges.map((c) => c.id));
    expect(ids.size).toBe(16);
    const orders = challenges.map((c) => c.order).sort((a, b) => a - b);
    expect(orders).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]);
  });
  it("cada reto tiene schema, seed, solución y pista", () => {
    for (const c of challenges) {
      expect(c.schema_sql).toMatch(/CREATE TABLE/i);
      expect(c.seed_sql).toMatch(/INSERT/i);
      expect(c.solucion_sql).toMatch(/SELECT/i);
      expect(c.pista.length).toBeGreaterThan(5);
      expect(c.enunciado.length).toBeGreaterThan(20);
    }
  });
  it("xp por dificultad y hidden tests en retos trampa", () => {
    expect(xpFor({ dificultad: "facil", xp: undefined })).toBe(10);
    expect(xpFor({ dificultad: "dificil", xp: undefined })).toBe(30);
    const withHidden = challenges.filter((c) => c.hidden_seed_sql);
    expect(withHidden.length).toBeGreaterThanOrEqual(8);
    for (const c of withHidden) expect(c.hidden_hint!.length).toBeGreaterThan(10);
  });
  it("cubre progresión SELECT → WINDOW", () => {
    const all = challenges.map((c) => c.solucion_sql).join("\n").toUpperCase();
    for (const kw of ["WHERE", "JOIN", "GROUP BY", "CASE", "WITH", "OVER"]) {
      expect(all).toContain(kw);
    }
  });
});
