import type { Metadata } from "next";
import HomeClient from "@/components/HomeClient";

export const metadata: Metadata = {
  title: "Aprender — tech-interview-lab",
  description: "Tu ruta guiada: dónde estás, qué sigue y cuánto te falta.",
};

export default function Home() {
  return (
    <main style={{ paddingTop: 24 }}>
      <h1 style={{ fontSize: 30 }}>Aprender</h1>
      <HomeClient />
    </main>
  );
}
