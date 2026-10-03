import RepasarClient from "@/components/RepasarClient";

export default function Repasar() {
  return (
    <main style={{ paddingTop: 24 }}>
      <h1 style={{ fontSize: 30 }}>Repasar</h1>
      <p style={{ color: "var(--body)" }}>Recupera lo débil antes de avanzar. La repetición espaciada fija el conocimiento.</p>
      <RepasarClient />
    </main>
  );
}
