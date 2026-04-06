"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import {
  collection,
  addDoc,
  onSnapshot,
  deleteDoc,
  doc,
} from "firebase/firestore";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

export default function Home() {
  const [valor, setValor] = useState("");
  const [tipo, setTipo] = useState("saida");
  const [descricao, setDescricao] = useState("");
  const [categoria, setCategoria] = useState("");

  const [transacoes, setTransacoes] = useState<any[]>([]);
  const [recorrentes, setRecorrentes] = useState<any[]>([]);
  const [metas, setMetas] = useState<any[]>([]);

  const [mesSelecionado, setMesSelecionado] = useState(
    new Date().toISOString().slice(0, 7)
  );

  const formatar = (v: number) =>
    v.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });

  // 🔥 BUSCAR DADOS
  useEffect(() => {
    const unsub1 = onSnapshot(collection(db, "transacoes"), (snap) => {
      const lista: any[] = [];
      snap.forEach((d) => lista.push({ id: d.id, ...d.data() }));
      setTransacoes(lista);
    });

    const unsub2 = onSnapshot(collection(db, "recorrentes"), (snap) => {
      const lista: any[] = [];
      snap.forEach((d) => lista.push({ id: d.id, ...d.data() }));
      setRecorrentes(lista);
    });

    const unsub3 = onSnapshot(collection(db, "metas"), (snap) => {
      const lista: any[] = [];
      snap.forEach((d) => lista.push({ id: d.id, ...d.data() }));
      setMetas(lista);
    });

    return () => {
      unsub1();
      unsub2();
      unsub3();
    };
  }, []);

  // ➕ adicionar transação
  async function adicionar() {
    if (!valor || !categoria) return;

    await addDoc(collection(db, "transacoes"), {
      valor: Number(valor),
      tipo,
      descricao,
      categoria,
      mes: mesSelecionado,
      data: new Date(),
    });

    setValor("");
    setDescricao("");
    setCategoria("");
  }

  // 🔁 criar recorrente
  async function adicionarRecorrente() {
    await addDoc(collection(db, "recorrentes"), {
      valor: Number(valor),
      tipo,
      descricao,
      categoria,
      dia: 5,
    });
  }

  // 🎯 criar meta
  async function criarMeta() {
    await addDoc(collection(db, "metas"), {
      nome: "Nova Meta",
      valor: 1000,
      guardado: 0,
    });
  }

  // 💰 depositar na meta
  async function depositar(meta: any) {
    await addDoc(collection(db, "transacoes"), {
      valor: 100,
      tipo: "saida",
      descricao: "Depósito meta",
      categoria: "Meta",
      mes: mesSelecionado,
      data: new Date(),
    });
  }

  async function excluir(id: string) {
    await deleteDoc(doc(db, "transacoes", id));
  }

  const transacoesMes = transacoes.filter(
    (t) => t.mes === mesSelecionado
  );

  const entradas = transacoesMes
    .filter((t) => t.tipo === "entrada")
    .reduce((a, b) => a + b.valor, 0);

  const saidas = transacoesMes
    .filter((t) => t.tipo === "saida")
    .reduce((a, b) => a + b.valor, 0);

  const saldo = entradas - saidas;

  // 📊 gráfico linha
  const grafico = transacoesMes.map((t, i) => ({
    name: i,
    saldo:
      t.tipo === "entrada"
        ? t.valor
        : -t.valor,
  }));

  return (
    <div className="min-h-screen bg-slate-900 text-white p-4">

      {/* HEADER */}
      <div className="flex justify-between mb-4">
        <button onClick={() => window.history.back()}>←</button>
        <h1>Dashboard</h1>
        <button className="bg-red-500 px-2 rounded">Sair</button>
      </div>

      {/* SALDO */}
      <div className="bg-green-600 p-4 rounded-xl mb-4">
        <h2 className="text-2xl font-bold">{formatar(saldo)}</h2>

        <div className="text-sm mt-2">
          Entrada: {formatar(entradas)} | Saída: {formatar(saidas)}
        </div>
      </div>

      {/* GRÁFICO */}
      <div className="bg-slate-800 p-4 rounded-xl mb-4">
        <LineChart width={300} height={200} data={grafico}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="saldo" stroke="#22c55e" />
        </LineChart>
      </div>

      {/* FORM */}
      <div className="bg-slate-800 p-4 rounded-xl mb-4">
        <input
          placeholder="Valor"
          value={valor}
          onChange={(e) => setValor(e.target.value)}
          className="bg-slate-700 w-full mb-2 p-2 rounded"
        />

        <select
          value={tipo}
          onChange={(e) => setTipo(e.target.value)}
          className="bg-slate-700 w-full mb-2 p-2 rounded"
        >
          <option value="entrada">Entrada</option>
          <option value="saida">Saída</option>
        </select>

        <input
          placeholder="Categoria"
          value={categoria}
          onChange={(e) => setCategoria(e.target.value)}
          className="bg-slate-700 w-full mb-2 p-2 rounded"
        />

        <input
          placeholder="Descrição"
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
          className="bg-slate-700 w-full mb-2 p-2 rounded"
        />

        <button onClick={adicionar} className="bg-green-600 w-full p-2 rounded">
          Salvar
        </button>

        <button onClick={adicionarRecorrente} className="bg-purple-600 w-full p-2 rounded mt-2">
          Tornar recorrente
        </button>
      </div>

      {/* METAS */}
      <div className="mb-4">
        <h2>🎯 Metas</h2>

        <button onClick={criarMeta} className="bg-blue-500 p-2 rounded mb-2">
          Nova meta
        </button>

        {metas.map((m) => (
          <div key={m.id} className="bg-slate-800 p-3 rounded mb-2">
            <p>{m.nome}</p>
            <p>{formatar(m.valor)}</p>

            <button
              onClick={() => depositar(m)}
              className="bg-green-500 px-2 rounded mt-1"
            >
              Depositar
            </button>
          </div>
        ))}
      </div>

      {/* LISTA */}
      {transacoesMes.map((t) => (
        <div key={t.id} className="bg-slate-800 p-2 rounded mb-2 flex justify-between">
          <span>{t.descricao}</span>
          <span>{formatar(t.valor)}</span>
        </div>
      ))}

      {/* BOTÃO FLOAT */}
      <button className="fixed bottom-6 right-6 bg-green-500 w-14 h-14 rounded-full text-2xl">
        +
      </button>

    </div>
  );
}