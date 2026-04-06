"use client";

import { useEffect, useState } from "react";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import MenuLateral from "@/components/MenuLateral";
import { useTransacoes } from "@/hooks/useTransacoes";
import GraficoCategorias from "@/components/GraficoCategorias";
import GraficoLinha from "@/components/GraficoLinha";

import FabButton from "@/components/FabButton";
import MetaFinanceira from "@/components/MetaFinanceira";
import Insights from "@/components/Insights";
import Modal from "@/components/Modal";
import { useRecorrentes } from "@/hooks/useRecorrentes";
import ListaRecorrentes from "@/components/ListaRecorrentes";

export default function Home() {
  const [user, setUser] = useState<any>(null);
  const [menuAberto, setMenuAberto] = useState(false);
  const [modalAberto, setModalAberto] = useState(false);

  const [valor, setValor] = useState("");
  const [tipo, setTipo] = useState("saida");
  const [descricao, setDescricao] = useState("");
  const [categoria, setCategoria] = useState("");

  // ✅ STATES RECORRENTES (FALTAVA)
  const [nomeRec, setNomeRec] = useState("");
  const [valorRec, setValorRec] = useState("");
  const [diaRec, setDiaRec] = useState("");

  const [mesSelecionado, setMesSelecionado] = useState(
    new Date().toISOString().slice(0, 7)
  );

  const [mensagem, setMensagem] = useState("");

  const { transacoes, adicionar, excluir } = useTransacoes(user);
  const { recorrentes, adicionar: addRec, togglePago } = useRecorrentes(user);

  const meta = 5000;

  const formatar = (v: number) =>
    v.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });

  const categoriasEntrada = ["Salário", "Freelance", "Investimentos", "Outros"];
  const categoriasSaida = [
    "Alimentação",
    "Transporte",
    "Empréstimo",
    "Cartão",
    "Médico",
    "Moradia",
    "Lazer",
  ];

  const categorias = tipo === "entrada" ? categoriasEntrada : categoriasSaida;

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (usuario) => {
      if (!usuario) window.location.href = "/login";
      else setUser(usuario);
    });

    return () => unsubscribe();
  }, []);

  const transacoesMes = transacoes.filter(
    (t) => t.mes === mesSelecionado
  );

  const entradas = transacoesMes
    .filter((t) => t.tipo === "entrada")
    .reduce((acc, t) => acc + t.valor, 0);

  const saidas = transacoesMes
    .filter((t) => t.tipo === "saida")
    .reduce((acc, t) => acc + t.valor, 0);

  const saldo = entradas - saidas;

  const dadosCategorias = Object.values(
    transacoesMes.reduce((acc: any, t: any) => {
      if (t.tipo === "saida") {
        acc[t.categoria] = acc[t.categoria] || {
          categoria: t.categoria,
          valor: 0,
        };
        acc[t.categoria].valor += t.valor;
      }
      return acc;
    }, {})
  );

  const dadosLinhaMap: any = {};

  transacoesMes.forEach((t: any) => {
    const data = t.data?.seconds
      ? new Date(t.data.seconds * 1000)
      : new Date();

    const dia = data.getDate();

    if (!dadosLinhaMap[dia]) {
      dadosLinhaMap[dia] = { mes: dia, valor: 0 };
    }

    dadosLinhaMap[dia].valor += t.valor;
  });

  const dadosLinha = Object.values(dadosLinhaMap).sort(
    (a: any, b: any) => a.mes - b.mes
  );

  async function adicionarTransacao() {
    if (!valor || !categoria) {
      setMensagem("⚠️ Preencha todos os campos");
      return;
    }

    try {
      await adicionar({
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

      setMensagem("✅ Transação salva!");
      setTimeout(() => setMensagem(""), 2000);
    } catch {
      setMensagem("❌ Erro ao salvar");
    }
  }

  // ✅ FUNÇÃO AGORA NO LUGAR CERTO
  async function adicionarRecorrente() {
    if (!nomeRec || !valorRec || !diaRec) {
      setMensagem("⚠️ Preencha os campos da despesa fixa");
      return;
    }

    await addRec({
      nome: nomeRec,
      valor: Number(valorRec),
      dia: Number(diaRec),
      pago: false,
      mes: mesSelecionado,
    });

    setNomeRec("");
    setValorRec("");
    setDiaRec("");

    setMensagem("✅ Recorrente salva!");
    setTimeout(() => setMensagem(""), 2000);
  }

  if (!user) return <p className="text-white">Carregando...</p>;

  return (
    <div className="min-h-screen bg-slate-900 text-white p-4">

      <MenuLateral aberto={menuAberto} fechar={() => setMenuAberto(false)} />

      <div className="flex items-center justify-between mb-4">
        <button onClick={() => setMenuAberto(true)}>☰</button>
        <h1>Dashboard</h1>
        <button onClick={() => signOut(auth)}>Sair</button>
      </div>

      <div className="bg-green-600 p-4 rounded-xl mb-4">
        <h1>{formatar(saldo)}</h1>
      </div>

      <MetaFinanceira saldo={saldo} meta={meta} />

      <ListaRecorrentes lista={recorrentes} toggle={togglePago} />

      <div className="grid md:grid-cols-2 gap-4 mb-4">
        <GraficoCategorias dados={dadosCategorias} />
        <GraficoLinha dados={dadosLinha} />
      </div>

      <Insights entradas={entradas} saidas={saidas} />

      <div className="space-y-2">
        {transacoesMes.map((t) => (
          <div key={t.id}>
            {t.descricao} - {formatar(t.valor)}
          </div>
        ))}
      </div>

      <FabButton onClick={() => setModalAberto(true)} />

      <Modal aberto={modalAberto} fechar={() => setModalAberto(false)}>

        <input value={valor} onChange={(e) => setValor(e.target.value)} />
        <input value={descricao} onChange={(e) => setDescricao(e.target.value)} />

        <button onClick={adicionarTransacao}>Salvar</button>

        <hr className="my-4" />

        <input value={nomeRec} onChange={(e) => setNomeRec(e.target.value)} />
        <input value={valorRec} onChange={(e) => setValorRec(e.target.value)} />
        <input value={diaRec} onChange={(e) => setDiaRec(e.target.value)} />

        <button onClick={adicionarRecorrente}>
          Salvar Recorrente
        </button>

      </Modal>

    </div>
  );
}