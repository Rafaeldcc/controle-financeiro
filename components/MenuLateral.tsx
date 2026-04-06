"use client";

import { useRouter } from "next/navigation";

export default function MenuLateral({ aberto, fechar }: any) {
  const router = useRouter();

  if (!aberto) return null;

  function irPara(path: string) {
    router.push(path);
    fechar();
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50">
      <div className="bg-slate-900 w-64 h-full p-4 shadow-xl">

        <h2 className="text-xl font-bold mb-6">Menu</h2>

        <ul className="space-y-4">

          <li
            onClick={() => irPara("/")}
            className="cursor-pointer hover:text-green-400"
          >
            🏠 Dashboard
          </li>

          <li
            onClick={() => irPara("/investimentos")}
            className="cursor-pointer hover:text-green-400"
          >
            💰 Investimentos
          </li>

          <li
            onClick={() => irPara("/dividas")}
            className="cursor-pointer hover:text-green-400"
          >
            💳 Dívidas
          </li>

          <li
            onClick={() => irPara("/relatorios")}
            className="cursor-pointer hover:text-green-400"
          >
            📊 Relatórios
          </li>

          <li
            onClick={() => irPara("/config")}
            className="cursor-pointer hover:text-green-400"
          >
            ⚙️ Configurações
          </li>
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