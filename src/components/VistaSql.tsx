"use client";
import { useState } from "react";
import PathView from "@/components/PathView";
import SqlIndexClient from "@/components/SqlIndexClient";

export default function VistaSql() {
  const [vista, setVista] = useState<"camino" | "lista">("camino");
  return (
    <div>
      <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
        <button className={vista === "camino" ? "btn btn-primary" : "btn btn-secondary"} style={{ height: 32, fontSize: 14 }} onClick={() => setVista("camino")}>[camino]</button>
        <button className={vista === "lista" ? "btn btn-primary" : "btn btn-secondary"} style={{ height: 32, fontSize: 14 }} onClick={() => setVista("lista")}>[lista libre]</button>
      </div>
      {vista === "camino" ? <PathView /> : <SqlIndexClient />}
    </div>
  );
}
