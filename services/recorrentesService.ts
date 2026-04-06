import {
  collection,
  addDoc,
  onSnapshot,
  deleteDoc,
  doc,
  updateDoc, // 🔥 FALTAVA ISSO
} from "firebase/firestore";
import { db } from "@/lib/firebase";

// ❌ DELETAR
export async function deletarRecorrente(userId: string, id: string) {
  return deleteDoc(
    doc(db, "usuarios", userId, "recorrentes", id)
  );
}

// 🔁 LISTENER REALTIME
export function escutarRecorrentes(userId: string, callback: any) {
  return onSnapshot(
    collection(db, "usuarios", userId, "recorrentes"),
    (snapshot) => {
      const lista: any[] = [];

      snapshot.forEach((docSnap) => {
        lista.push({
          id: docSnap.id,
          ...docSnap.data(),
        });
      });

      callback(lista);
    }
  );
}

// ➕ CRIAR
export async function criarRecorrente(userId: string, data: any) {
  return addDoc(
    collection(db, "usuarios", userId, "recorrentes"),
    data
  );
}

// 🔁 MARCAR PAGO
export async function marcarPago(
  userId: string,
  id: string,
  pago: boolean
) {
  return updateDoc(
    doc(db, "usuarios", userId, "recorrentes", id),
    { pago }
  );
}