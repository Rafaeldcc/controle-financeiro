"use client";

import { useEffect, useState } from "react";
import { db, auth } from "@/lib/firebase";
import {
  collection,
  addDoc,
  onSnapshot,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

export default function Metas() {
  const [user, setUser] = useState<any>(null);
  const [metas, setMetas] = useState<any[]>([]);
  const [transacoes, setTransacoes] = useState<any[]>([]);

  const [nome, setNome] = useState("");
  const [valor, setValor] = useState("");
  const [deposito, setDeposito] = useState("");

  const formatar = (v: number) =>
    v.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });

  // 🔐 AUTH
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      if (!u) window.location.href = "/login";
      else setUser(u);
    });
    return () => unsub();
  }, []);

  // 🔥 METAS
  useEffect(() => {
    if (!user) return;

    const unsub = onSnapshot(
      collection(db, "usuarios", user.uid, "metas"),
      (snap) => {
        const lista: any[] = [];
        snap.forEach((doc) =>
          lista.push({ id: doc.id, ...doc.data() })
        );
        setMetas(lista);
      }
    );

    return () => unsub();
  }, [user]);

  // 🔥 TRANSAÇÕES
  useEffect(() => {
    if (!user) return;

    const unsub = onSnapshot(
      collection(db, "usuarios", user.uid, "transacoes"),
      (snap) => {
        const lista: any[] = [];
        snap.forEach((doc) => lista.push(doc.data()));
        setTransacoes(lista);
      }
    );

    return () => unsub();
  }, [user]);

  // ➕ CRIAR META
  async function criarMeta() {
    if (!nome || !valor) return;

    await addDoc(collection(db, "usuarios", user.uid, "metas"), {
      nome,
      valor: Number(valor),
      atual: 0,
    });

    setNome("");
    setValor("");
  }

  // 💰 DEPOSITAR
  async function depositar(id: string, atual: number) {
    if (!deposito) return;

    await updateDoc(doc(db, "usuarios", user.uid, "metas", id), {
      atual: atual + Number(deposito),
    });

    setDeposito("");
  }

  // ❌ EXCLUIR
  async function excluir(id: string) {
    await deleteDoc(doc(db, "usuarios", user.uid, "metas", id));
  }

  // 🔗 ECONOMIA AUTOMÁTICA
  const economiaAutomatica = transacoes
    .filter((t) => t.categoria === "Economia")
    .reduce((acc, t) => acc + t.valor, 0);

  // 🤖 IA
  const gastos = transacoes
    .filter((t) => t.tipo === "saida")
    .reduce((a, t) => a + t.valor, 0);

  const sugestao = Math.floor(gastos * 0.2);

  // 🏆 GAMIFICAÇÃO
  const totalGuardado =
    metas.reduce((a, m) => a + (m.atual || 0), 0) + economiaAutomatica;

  const nivel = Math.floor(totalGuardado / 1000) + 1;

  if (!user) return null;

  return (
    <div className="min-h-screen bg-slate-900 text-white p-4">

      <h1 className="text-xl font-bold mb-4">🎯 Metas Inteligentes</h1>

      {/* 🏆 NÍVEL */}
      <div className="bg-slate-800 p-3 rounded mb-4">
        🏆 Nível {nivel} | Total guardado: {formatar(totalGuardado)}
      </div>

      {/* 🤖 IA */}
      <div className="bg-slate-800 p-3 rounded mb-4 text-sm">
        💡 Sugestão: guarde {formatar(sugestao)} por mês
      </div>

      {/* 🔗 AUTOMÁTICO */}
      <div className="bg-green-900 p-3 rounded mb-4 text-sm">
        🔗 Economia automática: {formatar(economiaAutomatica)}
      </div>

      {/* FORM */}
      <div className="bg-slate-800 p-4 rounded mb-4">
        <input
          placeholder="Nome da meta"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          className="bg-slate-700 p-2 w-full mb-2 rounded"
        />

        <input
          type="number"
          placeholder="Valor objetivo"
          value={valor}
          onChange={(e) => setValor(e.target.value)}
          className="bg-slate-700 p-2 w-full mb-2 rounded"
        />

        <button
          onClick={criarMeta}
          className="bg-green-500 w-full p-2 rounded"
        >
          Criar meta
        </button>
      </div>

      {/* LISTA */}
      <div className="space-y-3">
        {metas.map((m) => {
          const total = m.atual + economiaAutomatica;
          const progresso = Math.min((total / m.valor) * 100, 100);

          return (
            <div key={m.id} className="bg-slate-800 p-4 rounded">

              <div className="flex justify-between mb-2">
                <div>
                  <p className="font-bold">{m.nome}</p>
                  <p className="text-sm text-gray-400">
                    {formatar(total)} / {formatar(m.valor)}
                  </p>
                </div>

                <button onClick={() => excluir(m.id)}>❌</button>
              </div>

              {/* PROGRESSO */}
              <div className="bg-gray-700 h-2 rounded mb-2">
                <div
                  className="bg-green-500 h-2 rounded"
                  style={{ width: `${progresso}%` }}
                />
              </div>

              {/* DEPOSITO */}
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="Depositar"
                  value={deposito}
                  onChange={(e) => setDeposito(e.target.value)}
                  className="bg-slate-700 p-2 rounded w-full"
                />

                <button
                  onClick={() => depositar(m.id, m.atual)}
                  className="bg-green-500 px-3 rounded"
                >
                  +
                </button>
              </div>

              {progresso === 100 && (
                <p className="text-green-400 mt-2">🎉 Meta concluída!</p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}