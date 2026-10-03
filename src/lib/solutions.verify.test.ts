import { describe, it, expect } from "vitest";
import initSqlJs from "sql.js";
import { challenges } from "./curriculum";

describe("solutions ejecutan en SQLite", () => {
  it("las 16 soluciones retornan filas sin error", async () => {
    const SQL = await initSqlJs();
    for (const c of challenges) {
      const db = new SQL.Database();
      db.run(c.schema_sql);
      db.run(c.seed_sql);
      let res;
      try {
        res = db.exec(c.solucion_sql);
      } catch (e) {
        throw new Error(`[${c.id}] solución falla: ${e}`);
      }
      expect(res.length, `[${c.id}] sin resultados`).toBeGreaterThan(0);
      db.close();
    }
  }, 60000);
});
