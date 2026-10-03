import { GoogleGenerativeAI } from "@google/generative-ai";

let client: GoogleGenerativeAI | null = null;

export function aiClient(): GoogleGenerativeAI {
  if (client) return client;
  const key = process.env.GEMINI_API_KEY;
  if (!key) throw new Error("Falta GEMINI_API_KEY en .env.local");
  client = new GoogleGenerativeAI(key);
  return client;
}

export function aiModel() {
  return aiClient().getGenerativeModel({
    model: "gemini-flash-latest",
    generationConfig: { maxOutputTokens: 800, temperature: 0.4 },
  });
}

// Cache en memoria: evita pagar 2 veces la misma pista
const cache = new Map<string, string>();
export function cacheGet(k: string): string | undefined {
  return cache.get(k);
}
export function cacheSet(k: string, v: string) {
  if (cache.size > 200) {
    const first = cache.keys().next().value;
    if (first !== undefined) cache.delete(first);
  }
  cache.set(k, v);
}

// Rate-limit simple por IP: 12 req/min
const hits = new Map<string, number[]>();
export function rateOk(ip: string): boolean {
  const now = Date.now();
  const arr = (hits.get(ip) ?? []).filter((t) => now - t < 60_000);
  if (arr.length >= 12) return false;
  arr.push(now);
  hits.set(ip, arr);
  return true;
}
