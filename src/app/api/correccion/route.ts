import { NextRequest, NextResponse } from "next/server";
import { aiModel, rateOk } from "@/lib/ai/provider";
import { CORRECCION_SISTEMA } from "@/lib/ai/prompts";

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") ?? "local";
  if (!rateOk(ip)) return NextResponse.json({ error: "Límite: 12/min. Espera un poco." }, { status: 429 });
  let body: { items?: { titulo: string; codigo: string }[] };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  }
  const items = (body.items ?? []).filter((i) => i.codigo && i.codigo.trim().length > 5).slice(0, 6);
  if (!items.length) {
    return NextResponse.json({ error: "No hay intentos que corregir. Resuelve al menos un reto." }, { status: 400 });
  }
  const prompt = `${CORRECCION_SISTEMA}\n\nIntentos del simulacro:\n${items.map((i, n) => `Q${n + 1} ${i.titulo}:\n\`\`\`\n${i.codigo.slice(0, 1200)}\n\`\`\``).join("\n")}`;
  try {
    const res = await aiModel().generateContent(prompt);
    return NextResponse.json({ text: res.response.text().trim() });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    if (/API_KEY|API key/i.test(msg)) {
      return NextResponse.json({ error: "IA no configurada: falta GEMINI_API_KEY." }, { status: 500 });
    }
    return NextResponse.json({ error: "La IA falló. Intenta de nuevo." }, { status: 502 });
  }
}
