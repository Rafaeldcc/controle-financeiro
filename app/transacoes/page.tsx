"use client";

import { useEffect, useState } from "react";
import { db, auth } from "@/lib/firebase";
import {
  collection,
  onSnapshot,
  query,
  orderBy,
  deleteDoc,
  doc,
} from "firebase/firestore";

import { onAuthStateChanged } from "firebase/auth";

export default function Transacoes() {
  const [user, setUser] = useState<any>(null);
  const [transacoes, setTransacoes] = useState<any[]>([]);

  // 🔐 autenticação
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (usuario) => {
      if (!usuario) window.location.href = "/login";
      else setUser(usuario);
    });

    return () => unsubscribe();
  }, []);

  // 🔥 buscar transações
  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, "usuarios", user.uid, "transacoes"),
      orderBy("data", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const lista: any[] = [];

      snapshot.forEach((doc) => {
        lista.push({ id: doc.id, ...doc.data() });
      });

      setTransacoes(lista);
    });

    return () => unsubscribe();
  }, [user]);

  // ❌ excluir
  async function excluir(id: string) {
    await deleteDoc(doc(db, "usuarios", user.uid, "transacoes", id));
  }

  const formatar = (v: number) =>
    v.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });

  if (!user) return <p className="text-white">Carregando...</p>;

  return (
    <div className="min-h-screen bg-slate-900 text-white p-4">

      <h1 className="text-xl font-bold mb-4">💸 Transações</h1>

      <div className="space-y-3">
        {transacoes.length === 0 && (
          <p className="text-gray-400">Nenhuma transação ainda</p>
        )}

        {transacoes.map((t) => (
          <div
            key={t.id}
            className="bg-slate-800 p-4 rounded-xl flex justify-between items-center"
          >
            <div>
              <p className="font-bold">{t.descricao}</p>
              <p className="text-xs text-gray-400">{t.categoria}</p>
            </div>

            <div className="flex items-center gap-3">
              <p
                className={
                  t.tipo === "entrada"
                    ? "text-green-400 font-bold"
                    : "text-red-400 font-bold"
                }
              >
                {formatar(t.valor)}
              </p>

              <button
                onClick={() => excluir(t.id)}
                className="bg-red-500 px-2 py-1 rounded text-sm"
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