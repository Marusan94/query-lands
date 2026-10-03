import { describe, it, expect } from "vitest";
import { nivelDe, fmtTiempo, dominio, necesitaRepaso, xpTotal } from "./estado";

describe("motor gamificación", () => {
  it("nivel cada 100 XP", () => {
    expect(nivelDe(0).nivel).toBe(1);
    expect(nivelDe(99).nivel).toBe(1);
    expect(nivelDe(100).nivel).toBe(2);
    expect(nivelDe(250)).toEqual({ nivel: 3, base: 200, siguiente: 300 });
  });
  it("fmtTiempo legible", () => {
    expect(fmtTiempo(90)).toBe("1m");
    expect(fmtTiempo(3700)).toBe("1h 1m");
  });
  it("dominio por intentos", () => {
    const m = { x: { intentos: 4, fallos: 1, ultimo: 1 } };
    expect(dominio(m, "x")).toBe(75);
    expect(dominio({}, "y")).toBe(0);
  });
  it("repaso: fallos o 6+ días", () => {
    const p = { x: { status: "done" as const, at: Date.now(), xp: 10 } };
    expect(necesitaRepaso({ x: { intentos: 2, fallos: 1, ultimo: Date.now() } }, p, "x")).toBe(true);
    expect(necesitaRepaso({ x: { intentos: 1, fallos: 0, ultimo: Date.now() } }, p, "x")).toBe(false);
    expect(necesitaRepaso({}, {}, "z")).toBe(false);
  });
  it("xpTotal vacío = 0", () => {
    expect(xpTotal({})).toBe(0);
  });
});
