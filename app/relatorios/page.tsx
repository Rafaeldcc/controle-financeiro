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

  const [mesAtual, setMesAtual] = useState(
    new Date().toISOString().slice(0, 7)
  );

  const [mesAnterior, setMesAnterior] = useState(
    new Date(new Date().setMonth(new Date().getMonth() - 1))
      .toISOString()
      .slice(0, 7)
  );

  useEffect(() => {
    onAuthStateChanged(auth, setUser);
  }, []);

  const { transacoes } = useTransacoes(user);

  // FILTROS
  const atual = transacoes.filter((t) => t.mes === mesAtual);
  const anterior = transacoes.filter((t) => t.mes === mesAnterior);

  // RESUMOS
  const totalAtual = atual.reduce((acc, t) => acc + t.valor, 0);
  const totalAnterior = anterior.reduce((acc, t) => acc + t.valor, 0);

  const entradas = atual
    .filter((t) => t.tipo === "entrada")
    .reduce((acc, t) => acc + t.valor, 0);

  const saidas = atual
    .filter((t) => t.tipo === "saida")
    .reduce((acc, t) => acc + t.valor, 0);

  // 📊 CATEGORIAS
  const dadosCategorias = Object.values(
    atual.reduce((acc: any, t: any) => {
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

  // 🏆 TOP GASTOS
  const topCategorias = [...dadosCategorias]
    .sort((a: any, b: any) => b.valor - a.valor)
    .slice(0, 3);

  // 📈 LINHA
  const dadosLinhaMap: any = {};

  atual.forEach((t: any) => {
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

      <Header titulo="📊 Relatórios Avançados" />

      {/* COMPARAÇÃO */}
      <div className="grid md:grid-cols-2 gap-4 mb-4">

        <div className="bg-slate-800 p-4 rounded-xl">
          <p className="text-sm opacity-70">Mês atual</p>
          <h2 className="text-xl font-bold">
            R$ {totalAtual.toFixed(2)}
          </h2>
        </div>

        <div className="bg-slate-800 p-4 rounded-xl">
          <p className="text-sm opacity-70">Mês anterior</p>
          <h2 className="text-xl font-bold">
            R$ {totalAnterior.toFixed(2)}
          </h2>
        </div>

      </div>

      {/* ENTRADAS VS SAÍDAS */}
      <div className="bg-slate-800 p-4 rounded-xl mb-4">
        <p className="text-sm opacity-70 mb-2">Entradas vs Saídas</p>

        <div className="flex justify-between">
          <span className="text-green-400">
            Entradas: R$ {entradas.toFixed(2)}
          </span>

          <span className="text-red-400">
            Saídas: R$ {saidas.toFixed(2)}
          </span>
        </div>
      </div>

      {/* GRÁFICOS */}
      <div className="grid md:grid-cols-2 gap-4 mb-4">
        <GraficoCategorias dados={dadosCategorias} />
        <GraficoLinha dados={dadosLinha} />
      </div>

      {/* TOP GASTOS */}
      <div className="bg-slate-800 p-4 rounded-xl mb-4">
        <p className="text-sm opacity-70 mb-2">🏆 Maiores gastos</p>

        {topCategorias.map((c: any) => (
          <div key={c.categoria} className="flex justify-between text-sm mb-1">
            <span>{c.categoria}</span>
            <span>R$ {c.valor.toFixed(2)}</span>
          </div>
        ))}
      </div>

      {/* INSIGHTS */}
      <div className="bg-slate-800 p-4 rounded-xl text-sm space-y-2">

        {totalAtual > totalAnterior && (
          <p className="text-red-400">
            ⚠️ Seus gastos aumentaram em relação ao mês passado
          </p>
        )}

        {totalAtual < totalAnterior && (
          <p className="text-green-400">
            👍 Você reduziu seus gastos, ótimo trabalho!
          </p>
        )}

        {saidas > entradas && (
          <p className="text-yellow-400">
            💡 Suas saídas estão maiores que suas entradas
          </p>
        )}

      </div>

    </div>
  );
}