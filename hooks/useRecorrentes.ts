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

export function useRecorrentes(user: any) {
  const [recorrentes, setRecorrentes] = useState<Recorrente[]>([]);

  useEffect(() => {
    if (!user) return;

    const ref = collection(db, "usuarios", user.uid, "recorrentes");

    const unsub = onSnapshot(ref, (snapshot) => {
      const lista: Recorrente[] = [];

      snapshot.forEach((doc) =>
        lista.push({ id: doc.id, ...(doc.data() as Recorrente) })
      );

      setRecorrentes(lista);
    });

    return () => unsub();
  }, [user]);

  async function adicionar(data: Recorrente) {
    await addDoc(
      collection(db, "usuarios", user.uid, "recorrentes"),
      data
    );
  }

  async function togglePago(id: string, atual: boolean) {
    await updateDoc(
      doc(db, "usuarios", user.uid, "recorrentes", id),
      { pago: !atual }
    );
  }

  return { recorrentes, adicionar, togglePago };
}