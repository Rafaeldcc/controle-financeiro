import { useEffect, useState } from "react";
import {
  escutarInvestimentos,
  criarInvestimento,
} from "@/services/investimentosService";

export function useInvestimentos(user: any) {
  const [investimentos, setInvestimentos] = useState<any[]>([]);

  useEffect(() => {
    if (!user) return;

    const unsub = escutarInvestimentos(user.uid, setInvestimentos);
    return () => unsub();
  }, [user]);

  async function adicionar(data: any) {
    await criarInvestimento(user.uid, data);
  }

  const totalInvestido = investimentos.reduce((acc, i) => acc + i.valor, 0);

  const totalAtual = investimentos.reduce(
    (acc, i) => acc + i.valor * (1 + i.rendimento / 100),
    0
  );

  return {
    investimentos,
    adicionar,
    totalInvestido,
    totalAtual,
    lucro: totalAtual - totalInvestido,
  };
}