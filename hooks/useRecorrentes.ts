import { useEffect, useState } from "react";
import {
  collection,
  onSnapshot,
  addDoc,
  updateDoc,
  doc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Recorrente } from "@/types/Recorrente";
import { deletarRecorrente } from "@/services/recorrentesService";

export function useRecorrentes(user: any) {
  const [recorrentes, setRecorrentes] = useState<Recorrente[]>([]);

  useEffect(() => {
    if (!user) return;

    const ref = collection(db, "usuarios", user.uid, "recorrentes");

    const unsub = onSnapshot(ref, (snapshot) => {
      const lista: Recorrente[] = [];

      snapshot.forEach((docSnap) =>
        lista.push({
          id: docSnap.id,
          ...(docSnap.data() as Recorrente),
        })
      );

      setRecorrentes(lista);
    });

    return () => unsub();
  }, [user]);

  // ➕ ADICIONAR
  async function adicionar(data: Recorrente) {
    if (!user) return;

    await addDoc(
      collection(db, "usuarios", user.uid, "recorrentes"),
      data
    );
  }

  // 🔁 TOGGLE PAGO
  async function togglePago(id: string, atual: boolean) {
    if (!user) return;

    await updateDoc(
      doc(db, "usuarios", user.uid, "recorrentes", id),
      { pago: !atual }
    );
  }

  // ❌ EXCLUIR
  async function excluir(id: string) {
    if (!user) return;

    await deletarRecorrente(user.uid, id);
  }

  // ✏️ EDITAR (🔥 NOVO)
  async function editar(id: string, data: Partial<Recorrente>) {
    if (!user) return;

    await updateDoc(
      doc(db, "usuarios", user.uid, "recorrentes", id),
      data
    );
  }

  return {
    recorrentes,
    adicionar,
    togglePago,
    excluir,
    editar, // 🔥 NOVO
  };
}