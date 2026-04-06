import { db } from "@/lib/firebase";
import {
  collection,
  addDoc,
  onSnapshot,
  updateDoc,
  doc,
} from "firebase/firestore";

export function escutarRecorrentes(userId: string, callback: any) {
  return onSnapshot(
    collection(db, "usuarios", userId, "recorrentes"),
    (snapshot) => {
      const lista: any[] = [];
      snapshot.forEach((doc) => {
        lista.push({ id: doc.id, ...doc.data() });
      });
      callback(lista);
    }
  );
}

export async function criarRecorrente(userId: string, data: any) {
  return addDoc(collection(db, "usuarios", userId, "recorrentes"), data);
}

export async function marcarPago(userId: string, id: string, pago: boolean) {
  return updateDoc(
    doc(db, "usuarios", userId, "recorrentes", id),
    { pago }
  );
}