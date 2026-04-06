import { db } from "@/lib/firebase";
import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  query,
  orderBy,
  onSnapshot,
} from "firebase/firestore";

// 🔥 LISTENER REALTIME
export function escutarTransacoes(userId: string, callback: any) {
  const q = query(
    collection(db, "usuarios", userId, "transacoes"),
    orderBy("data", "desc")
  );

  return onSnapshot(q, (snapshot) => {
    const lista: any[] = [];
    snapshot.forEach((doc) => {
      lista.push({ id: doc.id, ...doc.data() });
    });
    callback(lista);
  });
}

// ➕ CRIAR
export async function criarTransacao(userId: string, data: any) {
  return addDoc(collection(db, "usuarios", userId, "transacoes"), data);
}

// ❌ DELETAR
export async function deletarTransacao(userId: string, id: string) {
  return deleteDoc(doc(db, "usuarios", userId, "transacoes", id));
}