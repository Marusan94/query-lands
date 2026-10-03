import Link from "next/link";
import SalaClient from "@/components/SalaClient";
import { UNIDADES } from "@/lib/path";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

export function generateStaticParams() {
  return UNIDADES.map((u) => ({ unidad: u.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ unidad: string }> }): Promise<Metadata> {
  const { unidad } = await params;
  const u = UNIDADES.find((x) => x.id === unidad);
  return { title: u ? `${u.titulo} — sala — tech-interview-lab` : "sala no encontrada" };
}

export default async function SalaPage({ params }: { params: Promise<{ unidad: string }> }) {
  const { unidad } = await params;
  const u = UNIDADES.find((x) => x.id === unidad);
  if (!u) notFound();
  return (
    <main style={{ paddingTop: 24 }}>
      <div style={{ fontSize: 14 }}><Link href="/">viaje</Link> / <span className="badge-ink">sala</span></div>
      <h1 style={{ fontSize: 28, marginTop: 8 }}>{u.titulo}</h1>
      <SalaClient unidadId={u.id} />
    </main>
  );
}
