"use client";

export default function Relatorios() {
  return (
    <div className="p-4 text-white">
      <h1 className="text-2xl font-bold mb-4">📊 Relatórios</h1>

      <div className="bg-slate-800 p-4 rounded-xl">
        <p>Aqui você verá:</p>

        <ul className="mt-2 space-y-2 text-sm">
          <li>📉 Gastos por categoria</li>
          <li>📈 Evolução mensal</li>
          <li>💰 Comparativo</li>
        </ul>
      </div>
    </div>
  );
}