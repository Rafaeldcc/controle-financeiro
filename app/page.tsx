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

  const [editando, setEditando] = useState<any>(null);
  const [editandoRec, setEditandoRec] = useState<any>(null);

  const [valor, setValor] = useState("");
  const [tipo, setTipo] = useState("saida");
  const [descricao, setDescricao] = useState("");
  const [categoria, setCategoria] = useState("");

  const [nomeRec, setNomeRec] = useState("");
  const [valorRec, setValorRec] = useState("");
  const [diaRec, setDiaRec] = useState("");

  const [mesSelecionado, setMesSelecionado] = useState(
    new Date().toISOString().slice(0, 7)
  );

  const [mensagem, setMensagem] = useState("");

  const { transacoes, adicionar, excluir, editar } = useTransacoes(user);
  const {
  recorrentes,
  adicionar: addRec,
  togglePago,
  excluir: excluirRec, // 🔥 AQUI
  editar: editarRec,
} = useRecorrentes(user);

  const meta = 5000;

  const formatar = (v: number) =>
    v.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });

  const categoriasEntrada = ["Salário", "Extra", "Freelance", "Investimentos", "Outros"];
  const categoriasSaida = ["Alimentação", "Transporte", "Empréstimo", "Cartaão", "Saúde", "Moradia", "Lazer"];

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (usuario) => {
      if (!usuario) window.location.href = "/login";
      else setUser(usuario);
    });

    return () => unsubscribe();
  }, []);

  // 🔁 RECORRENTE AUTOMÁTICO
  useEffect(() => {
    if (!user) return;

    const mesAtual = new Date().toISOString().slice(0, 7);

    recorrentes.forEach(async (r: any) => {
      const existe = recorrentes.find(
        (x: any) =>
          x.nome === r.nome &&
          x.mes === mesAtual
      );

      if (!existe) {
        await addRec({
          nome: r.nome,
          valor: r.valor,
          dia: r.dia,
          pago: false,
          mes: mesAtual,
        });
      }
    });
  }, [recorrentes]);

  const transacoesMes = transacoes.filter(
    (t) => t.mes === mesSelecionado
  );

  const entradas = transacoesMes
    .filter((t) => t.tipo === "entrada")
    .reduce((acc, t) => acc + t.valor, 0);

  const saidas = transacoesMes
    .filter((t) => t.tipo === "saida")
    .reduce((acc, t) => acc + t.valor, 0);

  const totalRecorrente = recorrentes
    .filter((r) => !r.pago)
    .reduce((acc, r) => acc + r.valor, 0);

  const saldo = entradas - saidas - totalRecorrente;

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
    });
  }

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

// 👇 ADICIONE AQUI
function abrirEdicaoRec(r: any) {
  setEditandoRec(r);
  setNomeRec(r.nome);
  setValorRec(String(r.valor));
  setDiaRec(String(r.dia));
}

  async function adicionarRecorrente() {
    const valorNumero = Number(valorRec);

    if (!nomeRec || isNaN(valorNumero) || !diaRec) return;

    if (editandoRec) {
      await editarRec(editandoRec.id, {
        nome: nomeRec,
        valor: valorNumero,
        dia: Number(diaRec),
      });

      setEditandoRec(null);
    } else {
      await addRec({
        nome: nomeRec,
        valor: valorNumero,
        dia: Number(diaRec),
        pago: false,
        mes: mesSelecionado,
      });
    }

    setNomeRec("");
    setValorRec("");
    setDiaRec("");
  }

  if (!user) return <p className="text-white">Carregando...</p>;

  return (
    <div className="min-h-screen bg-slate-900 text-white p-4">

      <MenuLateral aberto={menuAberto} fechar={() => setMenuAberto(false)} />

      <div className="flex justify-between mb-4">
        <button onClick={() => setMenuAberto(true)}>☰</button>
        <h1>Dashboard</h1>
        <button onClick={() => signOut(auth)}>Sair</button>
      </div>

      {totalRecorrente > 0 && (
        <div className="bg-red-500 p-3 rounded-xl mb-4">
          💳 Contas pendentes: {formatar(totalRecorrente)}
        </div>
      )}

      <div className="bg-green-600 p-4 rounded-xl mb-4">
        <h1>{formatar(saldo)}</h1>
      </div>

      <MetaFinanceira saldo={saldo} meta={meta} />

      <ListaRecorrentes
        lista={recorrentes}
        toggle={togglePago}
        excluir={excluirRec} // 🔥 AQUI
        editar={abrirEdicaoRec}
      />

      <div className="grid md:grid-cols-2 gap-4 mb-4">
        <GraficoCategorias dados={dadosCategorias} />
        <GraficoLinha dados={dadosLinha} />
      </div>

      <Insights entradas={entradas} saidas={saidas} />

      {/* LISTA BONITA COM EXCLUIR */}
      <div className="space-y-2">
  {transacoesMes.map((t) => (
    <div
      key={t.id}
      onClick={() => abrirEdicao(t)}
      className="bg-slate-800 p-3 rounded-xl flex justify-between items-center cursor-pointer hover:bg-slate-700 transition"
    >
      <div>
        <p className="font-bold">{t.descricao || "Sem descrição"}</p>
        <p className="text-xs opacity-60">{t.categoria}</p>
      </div>

      <div className="flex items-center gap-2">
        <p className={t.tipo === "entrada" ? "text-green-400" : "text-red-400"}>
          {formatar(t.valor)}
        </p>

        <button
          onClick={(e) => {
            e.stopPropagation();
            excluir(t.id);
          }}
          className="bg-red-500 px-2 rounded"
        >
          X
        </button>
      </div>
    </div>
  ))}
</div>

      <FabButton onClick={() => setModalAberto(true)} />

      <Modal aberto={modalAberto} fechar={() => setModalAberto(false)}>

        <h2 className="font-bold mb-2">
          {editando ? "Editar Transação" : "Nova Transação"}
        </h2>

        <input
          placeholder="Valor"
          value={valor}
          onChange={(e) => setValor(e.target.value)}
          className="bg-slate-700 p-2 w-full mb-2"
        />

        <select
          value={tipo}
          onChange={(e) => {
            setTipo(e.target.value);
            setCategoria("");
          }}
          className="bg-slate-700 p-2 w-full mb-2"
        >
          <option value="entrada">Entrada</option>
          <option value="saida">Saída</option>
        </select>

        <select
          value={categoria}
          onChange={(e) => setCategoria(e.target.value)}
          className="bg-slate-700 p-2 w-full mb-2"
        >
          <option value="">Categoria</option>
          {(tipo === "entrada" ? categoriasEntrada : categoriasSaida).map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>

        <input
          placeholder="Descrição"
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
          className="bg-slate-700 p-2 w-full mb-2"
        />

        <button onClick={adicionarTransacao} className="bg-green-500 w-full p-2 mb-4">
          {editando ? "Atualizar" : "Salvar"}
        </button>

        <hr className="my-3" />

        <h2 className="font-bold mb-2">Despesa Fixa</h2>

        <input
          placeholder="Nome"
          value={nomeRec}
          onChange={(e) => setNomeRec(e.target.value)}
          className="bg-slate-700 p-2 w-full mb-2"
        />

        <input
          placeholder="Valor"
          value={valorRec}
          onChange={(e) => setValorRec(e.target.value)}
          className="bg-slate-700 p-2 w-full mb-2"
        />

        <input
          placeholder="Dia"
          value={diaRec}
          onChange={(e) => setDiaRec(e.target.value)}
          className="bg-slate-700 p-2 w-full mb-2"
        />

        <button onClick={adicionarRecorrente} className="bg-blue-500 w-full p-2">
          Salvar Recorrente
        </button>

      </Modal>

    </div>
  );
}