import { NextRequest, NextResponse } from "next/server";
import { aiModel, cacheGet, cacheSet, rateOk } from "@/lib/ai/provider";
import { promptPista, promptExplica } from "@/lib/ai/prompts";

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") ?? "local";
  if (!rateOk(ip)) return NextResponse.json({ error: "Límite: 12/min. Espera un poco." }, { status: 429 });
  let body: {
    mode?: "pista" | "explica";
    track?: string;
    titulo?: string;
    enunciado?: string;
    codigo?: string;
    error?: string;
    intentos?: number;
    examen?: boolean;
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  }
  if (!body.codigo || body.codigo.trim().length < 3) {
    return NextResponse.json({ error: "Escribe tu intento primero." }, { status: 400 });
  }
  const key = JSON.stringify([body.mode ?? "pista", body.titulo, body.codigo, body.error ?? ""]);
  const hit = cacheGet(key);
  if (hit) return NextResponse.json({ text: hit, cached: true });

  const prompt =
    body.mode === "explica"
      ? promptExplica({ track: body.track ?? "sql", codigo: body.codigo })
      : promptPista({
          track: body.track ?? "sql",
          titulo: body.titulo ?? "reto",
          enunciado: body.enunciado ?? "",
          codigo: body.codigo,
          error: body.error,
          intentos: body.intentos ?? 1,
          examen: body.examen,
        });
  try {
    const res = await aiModel().generateContent(prompt);
    const text = res.response.text().trim() || "Sin respuesta. Intenta de nuevo.";
    cacheSet(key, text);
    return NextResponse.json({ text });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    if (/API_KEY|API key/i.test(msg)) {
      return NextResponse.json({ error: "IA no configurada: falta GEMINI_API_KEY." }, { status: 500 });
    }
    return NextResponse.json({ error: "La IA falló. Revisa tu conexión e intenta de nuevo." }, { status: 502 });
  }
}
