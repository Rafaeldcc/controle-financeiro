"use client";

import { useEffect, useState } from "react";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import MenuLateral from "@/components/MenuLateral";
import { useTransacoes } from "@/hooks/useTransacoes";
import GraficoCategorias from "@/components/GraficoCategorias";
import GraficoLinha from "@/components/GraficoLinha";

import FabButton from "@/components/FabButton";
import Insights from "@/components/Insights";
import Modal from "@/components/Modal";
import { useRecorrentes } from "@/hooks/useRecorrentes";
import ListaRecorrentes from "@/components/ListaRecorrentes";

export default function Home() {
  const [user, setUser] = useState<any>(null);
  const [menuAberto, setMenuAberto] = useState(false);
  const [modalAberto, setModalAberto] = useState(false);

  const [editando, setEditando] = useState<any>(null);
  const [editandoRec, setEditandoRec] = useState<any>(null);

  const [valor, setValor] = useState("");
  const [tipo, setTipo] = useState("saida");
  const [descricao, setDescricao] = useState("");
  const [categoria, setCategoria] = useState("");

  const [nomeRec, setNomeRec] = useState("");
  const [diaRec, setDiaRec] = useState("");

  const [valorRec, setValorRec] = useState("");
  const [parcelasRec, setParcelasRec] = useState("");

  const [mesSelecionado, setMesSelecionado] = useState(
    new Date().toISOString().slice(0, 7)
  );

  const [mensagem, setMensagem] = useState("");

  const { transacoes, adicionar, excluir, editar } = useTransacoes(user);

  const {
    recorrentes,
    adicionar: addRec,
    togglePago,
    excluir: excluirRec,
    editar: editarRec,
  } = useRecorrentes(user);

  const formatar = (v: number) =>
    v.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });

  const categoriasEntrada = [
    "Salário",
    "Extra",
    "Freelance",
    "Investimentos",
    "Outros",
  ];

  const categoriasSaida = [
    "Alimentação",
    "Transporte",
    "Empréstimo",
    "Cartão",
    "Telefone",
    "Saúde",
    "Moradia",
    "Lazer",
  ];

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
    .reduce((acc, t) => acc + (t.valor || 0), 0);

  const saidas = transacoesMes
    .filter((t) => t.tipo === "saida")
    .reduce((acc, t) => acc + (t.valor || 0), 0);

  const contasDoMes = recorrentes.map((r) => {
    const transacoesDaConta = transacoes.filter(
      (t) =>
        (t.descricao || "").includes(r.nome || "") &&
        t.tipo === "saida"
    );

    const jaExisteMes = transacoesMes.find(
      (t) => (t.descricao || "").includes(r.nome || "")
    );

    return {
      ...r,
      valor: jaExisteMes ? jaExisteMes.valor : r.valorPadrao || 0,
      pago: !!jaExisteMes,
      parcelaAtual: Math.min(
        transacoesDaConta.length,
        r.parcelas || transacoesDaConta.length || 1
      ),
    };
  });

  const totalRecorrente = contasDoMes
    .filter((r) => !r.pago)
    .reduce((acc, r) => acc + (r.valor || 0), 0);

  const saldo = entradas - saidas - totalRecorrente;

  const dadosCategorias = Object.values(
    transacoesMes.reduce((acc: any, t: any) => {
      if (t.tipo === "saida") {
        acc[t.categoria] = acc[t.categoria] || {
          categoria: t.categoria,
          valor: 0,
        };
        acc[t.categoria].valor += t.valor || 0;
      }
      return acc;
    }, {})
  );

  const dadosLinhaMap: any = {};

  transacoesMes.forEach((t: any) => {
    const data = t.data?.seconds
      ? new Date(t.data.seconds * 1000)
      : new Date(t.data || Date.now());

    const dia = data.getDate();

    if (!dadosLinhaMap[dia]) {
      dadosLinhaMap[dia] = { mes: dia, valor: 0 };
    }

    dadosLinhaMap[dia].valor += t.valor || 0;
  });

  const dadosLinha = Object.values(dadosLinhaMap).sort(
    (a: any, b: any) => a.mes - b.mes
  );

  // ✅ CORRIGIDO
  async function adicionarTransacao() {
    if (!valor || !categoria) {
      setMensagem("⚠️ Preencha os campos");
      return;
    }

    if (editando) {
      await editar(editando.id, {
        valor: Number(valor),
        tipo,
        descricao,
        categoria,
      });

      setEditando(null);
    } else {
      await adicionar({
        valor: Number(valor),
        tipo,
        descricao,
        categoria,
        data: new Date(),
        mes: mesSelecionado,
        recorrenteId: editandoRec?.id || "",
      });
    }

    setEditandoRec(null);
    setValor("");
    setDescricao("");
    setCategoria("");
    setModalAberto(false);
  }

  function abrirEdicao(t: any) {
    setEditando(t);
    setValor(String(t.valor));
    setTipo(t.tipo);
    setDescricao(t.descricao);
    setCategoria(t.categoria);
    setModalAberto(true);
  }

  function abrirEdicaoRec(r: any) {
    setEditandoRec(r);
    setNomeRec(r.nome);
    setDiaRec(String(r.dia));
    setValorRec(r.valorPadrao ? String(r.valorPadrao) : "");
    setParcelasRec(r.parcelas ? String(r.parcelas) : "");
    setModalAberto(true);
  }

  async function pagarConta(conta: any) {
    const valorFinal =
      conta.valorTemp || conta.valor || conta.valorPadrao;

    const parcelas =
      conta.parcelasTemp || conta.parcelas || 1;

    if (!valorFinal || valorFinal <= 0) {
      alert("Digite um valor antes de pagar");
      return;
    }

    await adicionar({
      descricao: conta.nome,
      valor: Number(valorFinal),
      tipo: "saida",
      categoria: "Moradia",
      data: new Date(),
      mes: mesSelecionado,
      parcelas: parcelas,
      parcelaAtual: (conta.parcelaAtual || 0) + 1,
    });
  }

  async function adicionarRecorrente() {
    if (!nomeRec || !diaRec) return;

    const dados = {
      nome: nomeRec,
      dia: Number(diaRec),
      valorPadrao: valorRec ? Number(valorRec) : 0,
      parcelas: parcelasRec ? Number(parcelasRec) : 1,
    };

    try {
      if (editandoRec) {
        await editarRec(editandoRec.id, dados);
        setEditandoRec(null);
      } else {
        await addRec(dados);
      }

      setNomeRec("");
      setDiaRec("");
      setValorRec("");
      setParcelasRec("");
    } catch (error) {
      console.error("Erro ao salvar recorrente:", error);
    }
  }

  function calcularPrevisao() {
    let saldoAtual = saldo;
    const futuros = [];

    for (let i = 1; i <= 3; i++) {
      const data = new Date(mesSelecionado + "-01");
      data.setMonth(data.getMonth() + i);

      const mes = data.toISOString().slice(0, 7);

      const transacoesFuturas = transacoes.filter((t) => t.mes === mes);

      const entradasFuturas = transacoesFuturas
        .filter((t) => t.tipo === "entrada")
        .reduce((acc, t) => acc + (t.valor || 0), 0);

      const saidasFuturas = transacoesFuturas
        .filter((t) => t.tipo === "saida")
        .reduce((acc, t) => acc + (t.valor || 0), 0);

      saldoAtual += entradasFuturas - saidasFuturas;

      futuros.push({ mes, saldo: saldoAtual });
    }

    return futuros;
  }

  const previsao = calcularPrevisao();

  if (!user) return <p className="text-white">Carregando...</p>;

  return (
    <div className="min-h-screen bg-slate-900 text-white p-4">
      <MenuLateral aberto={menuAberto} fechar={() => setMenuAberto(false)} />

      <div className="flex justify-between mb-4">
        <button onClick={() => setMenuAberto(true)}>☰</button>
        <h1>Dashboard</h1>
        <button onClick={() => signOut(auth)}>Sair</button>
      </div>

      <input
        type="month"
        value={mesSelecionado}
        onChange={(e) => setMesSelecionado(e.target.value)}
      />

      <h1>{formatar(saldo)}</h1>

      <ListaRecorrentes
        lista={contasDoMes}
        toggle={togglePago}
        excluir={excluirRec}
        editar={abrirEdicaoRec}
        onPagar={pagarConta}
      />
    </div>
  );
}