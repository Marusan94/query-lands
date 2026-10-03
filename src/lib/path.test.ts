import { describe, it, expect } from "vitest";
import { camino, siguienteReto, UNIDADES } from "./path";

describe("camino estilo Duolingo", () => {
  it("4 unidades cubren 1..16 sin huecos", () => {
    expect(UNIDADES).toHaveLength(4);
    const cubiertos = UNIDADES.flatMap((u) => Array.from({ length: u.hasta - u.desde + 1 }, (_, i) => u.desde + i));
    expect(cubiertos).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]);
  });
  it("vacío: solo el 1 actual, resto bloqueado", () => {
    const nodos = camino({});
    expect(nodos[0].estado).toBe("actual");
    expect(nodos.slice(1).every((n) => n.estado === "bloqueado")).toBe(true);
    expect(siguienteReto({})?.order).toBe(1);
  });
  it("completar abre el siguiente y marca hechos", () => {
    const ahora = Date.now();
    const p = { "01-select-where": { status: "done" as const, at: ahora, xp: 10 }, "02-order-limit": { status: "done" as const, at: ahora, xp: 10 } };
    const nodos = camino(p);
    expect(nodos[0].estado).toBe("hecho");
    expect(nodos[1].estado).toBe("hecho");
    expect(nodos[2].estado).toBe("actual");
    expect(nodos[3].estado).toBe("bloqueado");
    expect(siguienteReto(p)?.order).toBe(3);
  });
  it("tipos y estados avanzados: desafio, repaso, maestro", () => {
    const p = {
      "05-page-sin-likes": { status: "done" as const, at: Date.now(), xp: 20 },
      "07-segundo-salario": { status: "done" as const, at: Date.now(), xp: 20 },
    };
    const m = {
      "05-page-sin-likes": { intentos: 1, fallos: 0, ultimo: Date.now() },
      "07-segundo-salario": { intentos: 3, fallos: 2, ultimo: Date.now() },
    };
    const nodos = camino(p, m);
    const n5 = nodos.find((n) => n.challenge.id === "05-page-sin-likes")!;
    const n7 = nodos.find((n) => n.challenge.id === "07-segundo-salario")!;
    expect(n5.tipo).toBe("desafio");
    expect(n7.estado).toBe("repaso");
    const m2 = { "06-group-having": { intentos: 1, fallos: 0, ultimo: Date.now() } };
    const p2 = { "06-group-having": { status: "done" as const, at: Date.now(), xp: 20 } };
    expect(camino(p2, m2).find((n) => n.challenge.id === "06-group-having")!.estado).toBe("maestro");
  });
  it("todo hecho reciente: sin actual, siguiente null", () => {
    const ahora = Date.now();
    const p = Object.fromEntries(
      ["01-select-where", "02-order-limit", "03-like-distinct", "04-join-pedidos", "05-page-sin-likes", "06-group-having", "07-segundo-salario", "08-case-when", "09-histograma-mes", "10-cte-retencion", "11-top3-depto", "12-rolling-avg", "13-mediana-busquedas", "14-crecimiento-yoy", "15-jefes-salario", "16-rachas-compras"].map((id) => [id, { status: "done" as const, at: ahora, xp: 10 }])
    );
    expect(camino(p).every((n) => n.estado === "hecho")).toBe(true);
    expect(siguienteReto(p)).toBeNull();
  });
});
