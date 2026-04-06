import { db } from "@/lib/firebase";
import {
  collection,
  addDoc,
  onSnapshot,
} from "firebase/firestore";

export function escutarInvestimentos(userId: string, callback: any) {
  return onSnapshot(
    collection(db, "usuarios", userId, "investimentos"),
    (snapshot) => {
      const lista: any[] = [];
      snapshot.forEach((doc) => {
        lista.push({ id: doc.id, ...doc.data() });
      });
      callback(lista);
    }
  );
}

export async function criarInvestimento(userId: string, data: any) {
  return addDoc(collection(db, "usuarios", userId, "investimentos"), data);
}