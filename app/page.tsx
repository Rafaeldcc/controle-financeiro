"use client";

import { useEffect, useState } from "react";
import { db, auth } from "@/lib/firebase";
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
  deleteDoc,
  doc,
} from "firebase/firestore";

import { onAuthStateChanged, signOut } from "firebase/auth";
import MenuLateral from "./components/MenuLateral";

export default function Home() {
  const [user, setUser] = useState<any>(null);
  const [menuAberto, setMenuAberto] = useState(false);

  const [valor, setValor] = useState("");
  const [tipo, setTipo] = useState("saida");
  const [descricao, setDescricao] = useState("");
  const [categoria, setCategoria] = useState("");

  const [transacoes, setTransacoes] = useState<any[]>([]);
  const [mesSelecionado, setMesSelecionado] = useState(
    new Date().toISOString().slice(0, 7)
  );

  const [mensagem, setMensagem] = useState("");

  const formatar = (v: number) =>
    v.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });

  const categoriasEntrada = ["Salário", "Freelance", "Investimentos", "Outros"];
  const categoriasSaida = ["Alimentação", "Transporte", "Empréstimo", "Cartão", "Médico","Moradia", "Lazer"];

  const categorias = tipo === "entrada" ? categoriasEntrada : categoriasSaida;

  // 🔐 AUTH
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (usuario) => {
      if (!usuario) window.location.href = "/login";
      else setUser(usuario);
    });

    return () => unsubscribe();
  }, []);

  // 🔥 BUSCAR DADOS
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

  // ➕ ADICIONAR
  async function adicionarTransacao() {
    if (!valor || !categoria) {
      setMensagem("⚠️ Preencha todos os campos");
      return;
    }

    await addDoc(
      collection(db, "usuarios", user.uid, "transacoes"),
      {
        valor: Number(valor),
        tipo,
        descricao,
        categoria,
        data: new Date(),
        mes: mesSelecionado,
      }
    );

    setValor("");
    setDescricao("");
    setCategoria("");

    setMensagem("✅ Transação salva!");
    setTimeout(() => setMensagem(""), 2000);
  }

  // ❌ EXCLUIR
  async function excluirTransacao(id: string) {
    await deleteDoc(doc(db, "usuarios", user.uid, "transacoes", id));
  }

  const transacoesMes = transacoes.filter((t) => t.mes === mesSelecionado);

  const entradas = transacoesMes
    .filter((t) => t.tipo === "entrada")
    .reduce((acc, t) => acc + t.valor, 0);

  const saidas = transacoesMes
    .filter((t) => t.tipo === "saida")
    .reduce((acc, t) => acc + t.valor, 0);

  const saldo = entradas - saidas;

  if (!user) return <p className="text-white">Carregando...</p>;

  return (
    <div className="min-h-screen bg-slate-900 text-white p-4">

      {/* MENU */}
      <MenuLateral aberto={menuAberto} fechar={() => setMenuAberto(false)} />

      {/* HEADER */}
      <div className="flex items-center justify-between mb-4">
        <button onClick={() => setMenuAberto(true)} className="text-2xl">☰</button>

        <h1 className="font-bold">Dashboard</h1>

        <button
          onClick={() => signOut(auth)}
          className="text-sm bg-red-500 px-3 py-1 rounded"
        >
          Sair
        </button>
      </div>

      {/* SALDO */}
      <div className="bg-gradient-to-br from-green-500 to-emerald-700 p-6 rounded-3xl shadow-xl mb-4">
        <p className="text-sm opacity-80">Saldo disponível</p>

        <h1 className="text-4xl font-bold mt-1">{formatar(saldo)}</h1>

        <div className="flex justify-between mt-4 text-sm opacity-90">
          <span>Entradas: {formatar(entradas)}</span>
          <span>Saídas: {formatar(saidas)}</span>
        </div>

        <div className="mt-4 text-xs opacity-70">{user.email}</div>
      </div>

      {/* ALERTA INTELIGENTE */}
      {mensagem && (
        <div className="mb-4 bg-slate-800 p-3 rounded-xl text-center">
          {mensagem}
        </div>
      )}

      {/* IA FINANCEIRA */}
      <div className="bg-slate-800 p-3 rounded-xl mb-4 text-sm">
        {saidas > entradas && (
          <p className="text-red-400">⚠️ Você está gastando mais do que ganha</p>
        )}
        {saidas > entradas * 0.7 && (
          <p className="text-yellow-400">💡 Seus gastos estão altos</p>
        )}
        {saldo > 0 && (
          <p className="text-green-400">👍 Você está no controle</p>
        )}
      </div>

      {/* FILTRO MÊS */}
      <input
        type="month"
        value={mesSelecionado}
        onChange={(e) => setMesSelecionado(e.target.value)}
        className="bg-slate-800 p-3 rounded-xl mb-4 w-full"
      />

      {/* FORM */}
      <div className="bg-slate-800 p-4 rounded-2xl mb-4 shadow">

        <input
          type="number"
          placeholder="Valor"
          value={valor}
          onChange={(e) => setValor(e.target.value)}
          className="bg-slate-700 p-3 w-full mb-2 rounded-xl"
        />

        <select
          value={tipo}
          onChange={(e) => {
            setTipo(e.target.value);
            setCategoria("");
          }}
          className="bg-slate-700 p-3 w-full mb-2 rounded-xl"
        >
          <option value="entrada">Entrada</option>
          <option value="saida">Saída</option>
        </select>

        <select
          value={categoria}
          onChange={(e) => setCategoria(e.target.value)}
          className="bg-slate-700 p-3 w-full mb-2 rounded-xl"
        >
          <option value="">Categoria</option>
          {categorias.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>

        <input
          type="text"
          placeholder="Descrição"
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
          className="bg-slate-700 p-3 w-full mb-2 rounded-xl"
        />

        <button
          onClick={adicionarTransacao}
          className="bg-green-500 w-full p-3 rounded-xl font-bold hover:scale-105 transition"
        >
          Salvar
        </button>
      </div>

      {/* LISTA */}
      <div className="space-y-2">
        {transacoesMes.map((t) => (
          <div
            key={t.id}
            className="bg-slate-800 p-3 rounded-xl flex justify-between items-center shadow"
          >
            <div>
              <p className="font-bold">{t.descricao}</p>
              <p className="text-xs opacity-60">{t.categoria}</p>
            </div>

            <div className="flex items-center gap-2">
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
  );
}