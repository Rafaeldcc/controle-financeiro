"use client";

export default function Dividas() {
  return (
    <div className="p-4 text-white">
      <h1 className="text-2xl font-bold mb-4">💳 Dívidas</h1>

      <div className="bg-slate-800 p-4 rounded-xl">
        <p>Controle suas dívidas:</p>

        <ul className="mt-2 space-y-2 text-sm">
          <li>📅 Parcelas</li>
          <li>💸 Total devedor</li>
          <li>⚠️ Alertas de vencimento</li>
        </ul>
      </div>
    </div>
  );
}