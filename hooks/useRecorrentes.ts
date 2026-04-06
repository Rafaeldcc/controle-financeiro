import { useEffect, useState } from "react";
import {
  escutarRecorrentes,
  criarRecorrente,
  marcarPago,
} from "@/services/recorrentesService";

export function useRecorrentes(user: any) {
  const [recorrentes, setRecorrentes] = useState([]);

  useEffect(() => {
    if (!user) return;

    const unsub = escutarRecorrentes(user.uid, setRecorrentes);
    return () => unsub();
  }, [user]);

  async function adicionar(data: any) {
    await criarRecorrente(user.uid, data);
  }

  async function togglePago(id: string, atual: boolean) {
    await marcarPago(user.uid, id, !atual);
  }

  return {
    recorrentes,
    adicionar,
    togglePago,
  };
}