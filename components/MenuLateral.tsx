"use client";

export default function MenuLateral({ aberto, fechar }: any) {
  if (!aberto) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50">
      <div className="bg-slate-900 w-64 h-full p-4 shadow-xl">
        <h2 className="text-xl font-bold mb-4">Menu</h2>

        <ul className="space-y-3">
          <li className="cursor-pointer hover:text-green-400">Dashboard</li>
          <li className="cursor-pointer hover:text-green-400">Relatórios</li>
          <li className="cursor-pointer hover:text-green-400">Configurações</li>
        </ul>

        <button
          onClick={fechar}
          className="mt-6 bg-red-500 px-3 py-2 rounded"
        >
          Fechar
        </button>
      </div>
    </div>
  );
}