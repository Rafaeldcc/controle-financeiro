import { useEffect, useState } from "react";
import {
  escutarTransacoes,
  criarTransacao,
  deletarTransacao,
} from "@/services/transacoesService";

export function useTransacoes(user: any) {
  const [transacoes, setTransacoes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const unsubscribe = escutarTransacoes(user.uid, (data: any[]) => {
      setTransacoes(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  async function adicionar(data: any) {
    await criarTransacao(user.uid, data);
  }

  async function excluir(id: string) {
    await deletarTransacao(user.uid, id);
  }

  return {
    transacoes,
    adicionar,
    excluir,
    loading,
  };
}