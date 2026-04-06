import { useEffect, useState } from "react";
import {
  escutarDividas,
  criarDivida,
} from "@/services/dividasService";

export function useDividas(user: any) {
  const [dividas, setDividas] = useState<any[]>([]);

  useEffect(() => {
    if (!user) return;

    const unsub = escutarDividas(user.uid, setDividas);
    return () => unsub();
  }, [user]);

  async function adicionar(data: any) {
    await criarDivida(user.uid, data);
  }

  const total = dividas.reduce((acc, d) => acc + d.valor, 0);

  return {
    dividas,
    adicionar,
    total,
  };
}