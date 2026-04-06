"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
  deleteDoc,
  doc,
} from "firebase/firestore";

export default function Home() {
  const [valor, setValor] = useState("");
  const [tipo, setTipo] = useState("saida");
  const [descricao, setDescricao] = useState("");
  const [categoria, setCategoria] = useState("");
  const [transacoes, setTransacoes] = useState<any[]>([]);
  const [mensagem, setMensagem] = useState("");

  const [mesSelecionado, setMesSelecionado] = useState(
    new Date().toISOString().slice(0, 7)
  );

  const [meta, setMeta] = useState("");
  const [premium, setPremium] = useState(false);

  const formatar = (v: number) =>
    v.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });

  const categoriasEntrada = ["Salário", "Freelance", "Investimentos"];
  const categoriasSaida = [
    "Alimentação",
    "Transporte",
    "Moradia",
    "Lazer",
    "Saúde",
    "Educação",
    "Carro",
  ];

  const categorias =
    tipo === "entrada" ? categoriasEntrada : categoriasSaida;

  // 🔥 BUSCAR DADOS
  useEffect(() => {
    const q = query(collection(db, "transacoes"), orderBy("data", "desc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const lista: any[] = [];
      snapshot.forEach((doc) => {
        lista.push({ id: doc.id, ...doc.data() });
      });
      setTransacoes(lista);
    });

    return () => unsubscribe();
  }, []);

  async function adicionarTransacao() {
    if (!valor || !categoria) {
      setMensagem("⚠️ Preencha valor e categoria");
      return;
    }

    await addDoc(collection(db, "transacoes"), {
      valor: Number(valor),
      tipo,
      descricao,
      categoria,
      data: new Date(),
      mes: mesSelecionado,
    });

    setValor("");
    setDescricao("");
    setCategoria("");
    setMensagem("✅ Salvo");

    setTimeout(() => setMensagem(""), 2000);
  }

  async function excluirTransacao(id: string) {
    await deleteDoc(doc(db, "transacoes", id));
  }

  // 📅 FILTRO POR MÊS
  const transacoesMes = transacoes.filter(
    (t) => t.mes === mesSelecionado
  );

  // 💰 CÁLCULOS
  const entradas = transacoesMes
    .filter((t) => t.tipo === "entrada")
    .reduce((acc, t) => acc + t.valor, 0);

  const saidas = transacoesMes
    .filter((t) => t.tipo === "saida")
    .reduce((acc, t) => acc + t.valor, 0);

  const saldo = entradas - saidas;

  // 📊 RESUMO
  const resumoCategorias: any = {};

  transacoesMes.forEach((t) => {
    if (t.tipo === "saida") {
      const cat = t.categoria || "Outros";
      resumoCategorias[cat] = (resumoCategorias[cat] || 0) + t.valor;
    }
  });

  const progressoMeta = meta ? (saldo / Number(meta)) * 100 : 0;

  return (
    <div className="min-h-screen bg-slate-900 text-white">

      {/* HEADER COM VOLTAR */}
      <div className="flex items-center justify-between p-4 bg-slate-800">
        <button
          onClick={() => window.history.back()}
          className="bg-slate-700 px-3 py-1 rounded"
        >
          ← Voltar
        </button>

        <h1 className="font-bold">Dashboard</h1>

        <button className="bg-red-500 px-3 py-1 rounded">
          Sair
        </button>
      </div>

      <div className="max-w-md mx-auto p-4">

        {/* SALDO */}
        <div className="bg-green-600 p-5 rounded-2xl mb-4">
          <p className="text-sm">Saldo</p>
          <p className="text-3xl font-bold">{formatar(saldo)}</p>

          <input
            type="month"
            value={mesSelecionado}
            onChange={(e) => setMesSelecionado(e.target.value)}
            className="mt-2 text-black p-1 rounded"
          />
        </div>

        {/* PREMIUM */}
        <button
          onClick={() => setPremium(!premium)}
          className="bg-purple-600 w-full p-2 rounded mb-4"
        >
          {premium ? "👑 Premium Ativo" : "Ativar Premium"}
        </button>

        {/* META */}
        {premium && (
          <div className="bg-slate-800 p-4 rounded-xl mb-4">
            <h2 className="font-bold mb-2">Meta 🎯</h2>

            <input
              type="number"
              placeholder="Meta (R$)"
              value={meta}
              onChange={(e) => setMeta(e.target.value)}
              className="bg-slate-700 p-2 w-full mb-2 rounded"
            />

            <div className="bg-slate-600 h-2 rounded">
              <div
                className="bg-green-500 h-2 rounded"
                style={{ width: `${Math.min(progressoMeta, 100)}%` }}
              />
            </div>

            <p className="text-sm mt-1">
              {Math.floor(progressoMeta)}%
            </p>
          </div>
        )}

        {/* ALERTA */}
        {mensagem && (
          <div className="bg-green-700 p-2 rounded mb-3 text-sm">
            {mensagem}
          </div>
        )}

        {/* FORM */}
        <div className="bg-slate-800 p-4 rounded-xl mb-4">
          <input
            type="number"
            placeholder="Valor"
            value={valor}
            onChange={(e) => setValor(e.target.value)}
            className="bg-slate-700 p-2 w-full mb-2 rounded"
          />

          <select
            value={tipo}
            onChange={(e) => {
              setTipo(e.target.value);
              setCategoria("");
            }}
            className="bg-slate-700 p-2 w-full mb-2 rounded"
          >
            <option value="entrada">Entrada</option>
            <option value="saida">Saída</option>
          </select>

          <select
            value={categoria}
            onChange={(e) => setCategoria(e.target.value)}
            className="bg-slate-700 p-2 w-full mb-2 rounded"
          >
            <option value="">Categoria</option>
            {categorias.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>

          <input
            placeholder="Descrição"
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            className="bg-slate-700 p-2 w-full mb-2 rounded"
          />

          <button
            onClick={adicionarTransacao}
            className="bg-green-600 w-full p-2 rounded font-bold"
          >
            Salvar
          </button>
        </div>

        {/* LISTA */}
        <div className="space-y-2">
          {transacoesMes.map((t) => (
            <div
              key={t.id}
              className="bg-slate-800 p-3 rounded flex justify-between"
            >
              <div>
                <p className="font-bold">{t.descricao || "Sem descrição"}</p>
                <p className="text-xs text-gray-400">
                  {t.tipo} • {t.categoria}
                </p>
              </div>

              <div className="flex gap-2">
                <p
                  className={
                    t.tipo === "entrada"
                      ? "text-green-400"
                      : "text-red-400"
                  }
                >
                  {formatar(t.valor)}
                </p>

                <button
                  onClick={() => excluirTransacao(t.id)}
                  className="bg-red-500 px-2 rounded"
                >
                  X
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}