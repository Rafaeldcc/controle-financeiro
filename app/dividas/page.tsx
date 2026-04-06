"use client";

import { useState, useEffect } from "react";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { useDividas } from "@/hooks/useDividas";

export default function Dividas() {
  const [user, setUser] = useState<any>(null);

  const [nome, setNome] = useState("");
  const [valor, setValor] = useState("");

  useEffect(() => {
    onAuthStateChanged(auth, setUser);
  }, []);

  const { dividas, adicionar, total } = useDividas(user);

  async function salvar() {
    await adicionar({
      nome,
      valor: Number(valor),
    });

    setNome("");
    setValor("");
  }

  return (
    <div className="p-4 text-white">

      <h1 className="text-2xl font-bold mb-4">💳 Dívidas</h1>

      <div className="bg-red-600 p-4 rounded-xl mb-4">
        <p>Total Devedor: R$ {total.toFixed(2)}</p>
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

        <button onClick={salvar} className="bg-red-500 w-full p-2">
          Salvar
        </button>
      </div>

      {dividas.map((d) => (
        <div key={d.id} className="bg-slate-800 p-3 mb-2 rounded">
          <p>{d.nome}</p>
          <p>R$ {d.valor}</p>
        </div>
      ))}
    </div>
  );
}