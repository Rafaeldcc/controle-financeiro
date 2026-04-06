"use client";

import { useEffect, useState } from "react";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { useTransacoes } from "@/hooks/useTransacoes";
import Header from "@/components/Header";

import GraficoCategorias from "@/components/GraficoCategorias";
import GraficoLinha from "@/components/GraficoLinha";

export default function Relatorios() {
  const [user, setUser] = useState<any>(null);
  const [mesSelecionado, setMesSelecionado] = useState(
    new Date().toISOString().slice(0, 7)
  );

  useEffect(() => {
    onAuthStateChanged(auth, setUser);
  }, []);

  const { transacoes } = useTransacoes(user);

  // FILTRO
  const transacoesMes = transacoes.filter(
    (t) => t.mes === mesSelecionado
  );

  // 📊 CATEGORIAS
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

  // 📈 LINHA
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

  return (
    <div className="p-4 text-white">

      <Header titulo="📊 Relatórios" />

      {/* FILTRO */}
      <input
        type="month"
        value={mesSelecionado}
        onChange={(e) => setMesSelecionado(e.target.value)}
        className="bg-slate-800 p-3 rounded-xl mb-4 w-full"
      />

      {/* GRÁFICOS */}
      <div className="grid md:grid-cols-2 gap-4">

        <GraficoCategorias dados={dadosCategorias} />

        <GraficoLinha dados={dadosLinha} />

      </div>

      {/* RESUMO */}
      <div className="bg-slate-800 p-4 rounded-xl mt-4">
        <p className="text-sm opacity-70 mb-2">Resumo do mês</p>

        <p>Total de transações: {transacoesMes.length}</p>

        <p>
          Total movimentado: R${" "}
          {transacoesMes
            .reduce((acc, t) => acc + t.valor, 0)
            .toFixed(2)}
        </p>
      </div>

    </div>
  );
}