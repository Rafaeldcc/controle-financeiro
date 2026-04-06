"use client";

export default function Config() {
  return (
    <div className="p-4 text-white">
      <h1 className="text-2xl font-bold mb-4">⚙️ Configurações</h1>

      <div className="bg-slate-800 p-4 rounded-xl">
        <p>Configurações do sistema:</p>

        <ul className="mt-2 space-y-2 text-sm">
          <li>👤 Perfil</li>
          <li>💵 Moeda</li>
          <li>🔔 Notificações</li>
        </ul>
      </div>
    </div>
  );
}