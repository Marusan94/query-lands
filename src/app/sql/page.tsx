import VistaSql from "@/components/VistaSql";
import Onboarding from "@/components/Onboarding";

export default function SqlIndex() {
  return (
    <main style={{ paddingTop: 24 }}>
      <div><span className="badge-ink">lab / sql</span></div>
      <h1 style={{ fontSize: 32, fontWeight: 700, marginTop: 8 }}>track sql — 16 retos</h1>
      <p style={{ color: "var(--body)", marginTop: 8 }}>Avanza nodo por nodo como en Duolingo, o salta libre en [lista libre].</p>
      <Onboarding />
      <VistaSql />
    </main>
  );
}



