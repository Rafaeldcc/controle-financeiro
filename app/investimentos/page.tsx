"use client";

import { useState, useEffect } from "react";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { useInvestimentos } from "@/hooks/useInvestimentos";

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

      <h1 className="text-2xl font-bold mb-4">💰 Investimentos</h1>

      <div className="bg-green-600 p-4 rounded-xl mb-4">
        <p>Total Atual: R$ {totalAtual.toFixed(2)}</p>
        <p>Lucro: R$ {lucro.toFixed(2)}</p>
      </div>

      <div className="bg-slate-800 p-4 rounded-xl mb-4">
        <input
          placeholder="Nome"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          className="bg-slate-700 p-2 w-full mb-2"
        />

        <input
          placeholder="Valor"
          value={valor}
          onChange={(e) => setValor(e.target.value)}
          className="bg-slate-700 p-2 w-full mb-2"
        />

        <input
          placeholder="% rendimento"
          value={rendimento}
          onChange={(e) => setRendimento(e.target.value)}
          className="bg-slate-700 p-2 w-full mb-2"
        />

        <button onClick={salvar} className="bg-green-500 w-full p-2">
          Salvar
        </button>
      </div>

      {investimentos.map((i) => (
        <div key={i.id} className="bg-slate-800 p-3 mb-2 rounded">
          <p>{i.nome}</p>
          <p>R$ {i.valor}</p>
        </div>
      ))}
    </div>
  );
}