"use client";

import { useEffect, useState } from "react";
import { db, auth } from "@/lib/firebase";
import {
  collection,
  onSnapshot,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

export default function Relatorios() {
  const [user, setUser] = useState<any>(null);
  const [transacoes, setTransacoes] = useState<any[]>([]);

  // 🔐 auth
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      if (!u) window.location.href = "/login";
      else setUser(u);
    });

    return () => unsubscribe();
  }, []);

  // 🔥 buscar dados
  useEffect(() => {
    if (!user) return;

    const unsubscribe = onSnapshot(
      collection(db, "usuarios", user.uid, "transacoes"),
      (snapshot) => {
        const lista: any[] = [];
        snapshot.forEach((doc) => {
          lista.push(doc.data());
        });
        setTransacoes(lista);
      }
    );

    return () => unsubscribe();
  }, [user]);

  // 📊 calcular por categoria
  const resumo: any = {};

  transacoes.forEach((t) => {
    if (t.tipo === "saida") {
      if (!resumo[t.categoria]) resumo[t.categoria] = 0;
      resumo[t.categoria] += t.valor;
    }
  });

  if (!user) return <p className="text-white">Carregando...</p>;

  return (
    <div className="min-h-screen bg-slate-900 text-white p-4">

      <h1 className="text-xl font-bold mb-4">📊 Relatórios</h1>

      {Object.keys(resumo).length === 0 && (
        <p className="text-gray-400">Sem dados ainda</p>
      )}

      <div className="space-y-2">
        {Object.entries(resumo).map(([cat, valor]: any) => (
          <div
            key={cat}
            className="bg-slate-800 p-3 rounded flex justify-between"
          >
            <span>{cat}</span>
            <span className="text-red-400">
              R$ {valor}
            </span>
          </div>
        ))}
      </div>

    </div>
  );
}