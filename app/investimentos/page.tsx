"use client";

import { useState, useEffect } from "react";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { useInvestimentos } from "@/hooks/useInvestimentos";
import Header from "@/components/Header";

export default function Investimentos() {
  const [user, setUser] = useState<any>(null);

  const [nome, setNome] = useState("");
  const [valor, setValor] = useState("");
  const [rendimento, setRendimento] = useState("");

  useEffect(() => {
    onAuthStateChanged(auth, setUser);
  }, []);

  const { investimentos, adicionar, totalAtual, lucro } =
    useInvestimentos(user);

  async function salvar() {
    await adicionar({
      nome,
      valor: Number(valor),
      rendimento: Number(rendimento),
    });

    setNome("");
    setValor("");
    setRendimento("");
  }

  return (
    <div className="p-4 text-white">

      <Header titulo="💰 Investimentos" />

      <div className="bg-green-600 p-4 rounded-xl mb-4 shadow">
        <p>Total Atual: R$ {totalAtual.toFixed(2)}</p>
        <p>Lucro: R$ {lucro.toFixed(2)}</p>
      </div>

      <div className="bg-slate-800 p-4 rounded-xl mb-4 shadow">

        <input
          placeholder="Nome"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          className="bg-slate-700 p-3 w-full mb-2 rounded"
        />

        <input
          placeholder="Valor"
          value={valor}
          onChange={(e) => setValor(e.target.value)}
          className="bg-slate-700 p-3 w-full mb-2 rounded"
        />

        <input
          placeholder="% rendimento"
          value={rendimento}
          onChange={(e) => setRendimento(e.target.value)}
          className="bg-slate-700 p-3 w-full mb-2 rounded"
        />

        <button
          onClick={salvar}
          className="bg-green-500 w-full p-3 rounded font-bold hover:scale-105 transition"
        >
          Salvar
        </button>
      </div>

      {investimentos.map((i) => (
        <div key={i.id} className="bg-slate-800 p-3 mb-2 rounded shadow">
          <p className="font-bold">{i.nome}</p>
          <p>R$ {i.valor}</p>
        </div>
      ))}
    </div>
  );
}