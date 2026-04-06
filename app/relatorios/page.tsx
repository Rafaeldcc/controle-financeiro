"use client";

import Header from "@/components/Header";

export default function Relatorios() {
  return (
    <div className="p-4 text-white">

      <Header titulo="📊 Relatórios" />

      <div className="bg-slate-800 p-4 rounded-xl shadow">
        <p className="mb-2">Aqui você verá:</p>

        <ul className="space-y-2 text-sm">
          <li>📉 Gastos por categoria</li>
          <li>📈 Evolução mensal</li>
          <li>💰 Comparativo</li>
        </ul>
      </div>
    </div>
  );
}