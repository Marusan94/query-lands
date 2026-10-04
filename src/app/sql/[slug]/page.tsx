import { getChallenge, challenges, tiempoFor, xpFor } from "@/lib/curriculum";
import { unidadDe } from "@/lib/path";
import SqlRunner from "@/components/SqlRunner";
import LessonIntro from "@/components/LessonIntro";
import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";

export function generateStaticParams() {
  return challenges.map((c) => ({ slug: c.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const c = getChallenge(slug);
  if (!c) return { title: "reto no encontrado — Query Lands" };
  return {
    title: `[${String(c.order).padStart(2, "0")}] ${c.titulo} — Query Lands`,
    description: `${c.enunciado.slice(0, 150)} Patrón ${c.empresa_patron}.`,
  };
}

export default async function ChallengePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const c = getChallenge(slug);
  if (!c) notFound();
  const idx = challenges.findIndex((x) => x.id === slug);
  const prev = challenges[idx - 1];
  const next = challenges[idx + 1];
  const unidad = unidadDe(c.order);
  const piso = c.order - unidad.desde + 1;
  const pisos = unidad.hasta - unidad.desde + 1;

  return (
    <main style={{ paddingTop: 24 }}>
      <div style={{ fontSize: 14 }}><Link href="/">viaje</Link> / <Link href={`/sql/isla/${unidad.id}`}>{unidad.titulo}</Link> / <span className="badge-ink">{c.id}</span></div>
      <h1 style={{ fontSize: 28, marginTop: 8 }}>[{String(c.order).padStart(2, "0")}] {c.titulo}</h1>
      <div style={{ fontSize: 14, marginTop: 8, display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
        <span className="chip" style={{ background: "var(--bee-soft)", color: "var(--bee)" }}>[NIVEL {piso}/{pisos}]</span>
        <span className={`dif dif-${c.dificultad}`}>[{c.dificultad}]</span>
        <span style={{ color: "var(--mute)" }}>patrón {c.empresa_patron} · ~{tiempoFor(c)}min</span>
      </div>

      <LessonIntro titulo={c.titulo} xp={xpFor(c)} minutos={tiempoFor(c)} puntos={[c.enunciado, `Pista disponible: ${c.pista}`, "Validación automática + test oculto"]} />

      <div className="card-flat" style={{ padding: 16, marginTop: 16 }}>
        <div style={{ fontSize: 14, fontWeight: 500 }}>[&gt;] enunciado</div>
        <p style={{ marginTop: 8 }}>{c.enunciado}</p>
      </div>

      <div style={{ display: "grid", gap: 16, marginTop: 16 }}>
        <div>
          <div style={{ fontSize: 14, fontWeight: 500 }}>[~] schema</div>
          <pre className="codeblock" style={{ marginTop: 8 }}>{c.schema_sql}</pre>
        </div>
        <div>
          <div style={{ fontSize: 14, fontWeight: 500 }}>[~] pista</div>
          <pre className="codeblock" style={{ marginTop: 8 }}>{c.pista}</pre>
        </div>
      </div>

      <div style={{ marginTop: 24 }}>
        <SqlRunner key={c.id} challenge={c} siguiente={next ? { id: next.id, titulo: next.titulo } : undefined} />
      </div>

      <hr className="hr" style={{ marginTop: 48 }} />
      <div style={{ display: "flex", gap: 16, marginTop: 16, fontSize: 14 }}>
        {prev ? <Link href={`/sql/${prev.id}`}>[&lt;] {prev.titulo}</Link> : <span />}
        {next ? <Link href={`/sql/${next.id}`} style={{ marginLeft: "auto" }}>{next.titulo} [&gt;]</Link> : null}
      </div>
    </main>
  );
}
