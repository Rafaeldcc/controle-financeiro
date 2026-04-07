"use client";

import { useEffect, useState } from "react";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { useTransacoes } from "@/hooks/useTransacoes";

export default function Historico() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      if (u) setUser(u);
    });
    return () => unsubscribe();
  }, []);

  const { transacoes, excluir } = useTransacoes(user);

  if (!user) return <p className="text-white">Carregando...</p>;

  return (
    <div className="min-h-screen bg-slate-900 text-white p-4">
      <h1 className="text-xl font-bold mb-4">📊 Histórico</h1>

      <div className="space-y-2">
        {transacoes.map((t: any) => (
          <div
            key={t.id}
            className="bg-slate-800 p-3 rounded-xl flex justify-between items-center"
          >
            <div>
              <p className="font-bold">{t.descricao}</p>
              <p className="text-xs opacity-60">{t.categoria}</p>
            </div>

            <div className="flex items-center gap-2">
              <p className={t.tipo === "entrada" ? "text-green-400" : "text-red-400"}>
                {t.valor}
              </p>

              <button
                onClick={() => excluir(t.id)}
                className="bg-red-500 px-2 rounded"
              >
                X
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}