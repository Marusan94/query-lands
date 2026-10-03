import { getJsChallenge, jsChallenges } from "@/lib/curriculumJs";
import JsRunner from "@/components/JsRunner";
import LessonIntro from "@/components/LessonIntro";
import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";

export function generateStaticParams() {
  return jsChallenges.map((c) => ({ slug: c.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const c = getJsChallenge(slug);
  if (!c) return { title: "reto no encontrado — tech-interview-lab" };
  return { title: `${c.titulo} — js — tech-interview-lab`, description: c.enunciado.slice(0, 150) };
}

export default async function JsChallengePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const c = getJsChallenge(slug);
  if (!c) notFound();
  const idx = jsChallenges.findIndex((x) => x.id === slug);
  const next = jsChallenges[idx + 1];
  const XP_JS: Record<string, number> = { facil: 10, media: 20, dificil: 30 };
  return (
    <main style={{ paddingTop: 24 }}>
      <div style={{ fontSize: 14 }}><Link href="/">aprender</Link> / <Link href="/js">js</Link> / <span className="badge-ink">{c.id}</span></div>
      <h1 style={{ fontSize: 28, marginTop: 8 }}>{c.titulo}</h1>
      <div style={{ fontSize: 14, marginTop: 8 }}><span className={`dif dif-${c.dificultad}`}>[{c.dificultad}]</span> <span style={{ color: "var(--mute)" }}>{c.empresa_patron}</span></div>
      <LessonIntro titulo={c.titulo} xp={XP_JS[c.dificultad] ?? 20} minutos={15} puntos={[c.enunciado, "Tests visibles + ocultos como en entrevista.", "Firma a implementar"]} />
      <div className="card-flat" style={{ padding: 16, marginTop: 16 }}>
        <div style={{ fontSize: 14, fontWeight: 500 }}>[&gt;] enunciado</div>
        <p style={{ marginTop: 8 }}>{c.enunciado}</p>
        <pre className="codeblock" style={{ marginTop: 8 }}>{c.firma} ...{"}"}</pre>
      </div>
      <div style={{ marginTop: 24 }}>
        <JsRunner key={c.id} challenge={c} siguiente={next ? { id: next.id, titulo: next.titulo } : undefined} />
      </div>
    </main>
  );
}
