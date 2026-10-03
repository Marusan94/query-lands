import { describe, it, expect } from "vitest";
import { promptPista, promptExplica, GENERADOR_SISTEMA } from "./prompts";

describe("prompts IA", () => {
  it("pista incluye guardarraíl anti-solución y modo examen", () => {
    const p = promptPista({
      track: "sql",
      titulo: "t",
      enunciado: "e",
      codigo: "SELECT 1",
      intentos: 1,
      examen: true,
    });
    expect(p).toMatch(/NUNCA/i);
    expect(p).toMatch(/MODO EXAMEN/);
  });
  it("generador exige JSON con campos SQL", () => {
    expect(GENERADOR_SISTEMA).toMatch(/schema_sql/);
    expect(GENERADOR_SISTEMA).toMatch(/solucion_sql/);
    expect(promptExplica({ track: "js", codigo: "x" })).toMatch(/NUNCA/);
  });
});
