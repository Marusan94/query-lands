import { NextRequest, NextResponse } from "next/server";
import initSqlJs from "sql.js";
import { aiModel, rateOk } from "@/lib/ai/provider";
import { GENERADOR_SISTEMA } from "@/lib/ai/prompts";

type Gen = {
  titulo: string;
  enunciado: string;
  schema_sql: string;
  seed_sql: string;
  solucion_sql: string;
  pista: string;
  dificultad: "facil" | "media" | "dificil";
};

function cleanJson(text: string): string {
  const t = text.trim().replace(/^```(?:json)?/i, "").replace(/```$/, "").trim();
  const a = t.indexOf("{");
  const b = t.lastIndexOf("}");
  return a >= 0 && b > a ? t.slice(a, b + 1) : t;
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") ?? "local";
  if (!rateOk(ip)) return NextResponse.json({ error: "Límite: 12/min. Espera un poco." }, { status: 429 });
  let body: { oferta?: string; dificultad?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  }
  if (!body.oferta || body.oferta.trim().length < 20) {
    return NextResponse.json({ error: "Pega una oferta o descripción (mínimo 20 caracteres)." }, { status: 400 });
  }
  const dif = ["facil", "media", "dificil"].includes(body.dificultad ?? "") ? body.dificultad : "media";
  try {
    const res = await aiModel().generateContent(
      `${GENERADOR_SISTEMA}\n\nOferta/descripción:\n${body.oferta.slice(0, 2000)}\n\nDificultad pedida: ${dif}`
    );
    let g: Gen;
    try {
      g = JSON.parse(cleanJson(res.response.text()));
    } catch {
      return NextResponse.json({ error: "La IA devolvió JSON inválido. Reintenta." }, { status: 502 });
    }
    for (const k of ["titulo", "enunciado", "schema_sql", "seed_sql", "solucion_sql", "pista"] as const) {
      if (!g[k] || typeof g[k] !== "string") return NextResponse.json({ error: `Falta campo ${k}. Reintenta.` }, { status: 502 });
    }
    // Auto-validación: la solución debe correr y retornar filas en SQLite real
    try {
      const SQL = await initSqlJs();
      const db = new SQL.Database();
      db.run(g.schema_sql);
      db.run(g.seed_sql);
      const out = db.exec(g.solucion_sql);
      db.close();
      if (!out.length || !out[0].values.length) {
        return NextResponse.json({ error: "La solución generada retorna 0 filas. Reintenta." }, { status: 502 });
      }
      return NextResponse.json({
        challenge: {
          ...g,
          dificultad: ["facil", "media", "dificil"].includes(g.dificultad) ? g.dificultad : dif,
          id: `gen-${Date.now().toString(36)}`,
          order: 900,
          empresa_patron: "IA generativa",
          default_query: "-- tu intento aquí\nSELECT 1;",
        },
      });
    } catch (e) {
      return NextResponse.json({ error: `SQL inválido en lo generado: ${e instanceof Error ? e.message : String(e)}. Reintenta.` }, { status: 502 });
    }
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    if (/API_KEY|API key/i.test(msg)) {
      return NextResponse.json({ error: "IA no configurada: falta GEMINI_API_KEY." }, { status: 500 });
    }
    return NextResponse.json({ error: "La IA falló. Intenta de nuevo." }, { status: 502 });
  }
}
