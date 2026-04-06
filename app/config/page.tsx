"use client";

import Header from "@/components/Header";

export default function Config() {
  return (
    <div className="p-4 text-white">

      <Header titulo="⚙️ Configurações" />

      <div className="bg-slate-800 p-4 rounded-xl shadow">
        <p className="mb-2">Configurações do sistema:</p>

        <ul className="space-y-2 text-sm">
          <li>👤 Perfil</li>
          <li>💵 Moeda</li>
          <li>🔔 Notificações</li>
        </ul>
      </div>
    </div>
  );
}