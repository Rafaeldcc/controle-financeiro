import { useEffect, useState } from "react";
import {
  escutarTransacoes,
  criarTransacao,
  deletarTransacao,
  atualizarTransacao, // 🔥 NOVO
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

  // ➕ ADICIONAR
  async function adicionar(data: any) {
    if (!user) return;

    await criarTransacao(user.uid, data);
  }

  // ❌ EXCLUIR
  async function excluir(id: string) {
    if (!user) return;

    await deletarTransacao(user.uid, id);
  }

  // ✏️ EDITAR (NOVO)
  async function editar(id: string, data: any) {
    if (!user) return;

    await atualizarTransacao(user.uid, id, data);
  }

  return {
    transacoes,
    adicionar,
    excluir,
    editar, // 🔥 NOVO
    loading,
  };
}