import { db } from "@/lib/firebase";
import { collection, addDoc, onSnapshot } from "firebase/firestore";

export function escutarDividas(userId: string, callback: any) {
  return onSnapshot(
    collection(db, "usuarios", userId, "dividas"),
    (snapshot) => {
      const lista: any[] = [];
      snapshot.forEach((doc) => {
        lista.push({ id: doc.id, ...doc.data() });
      });
      callback(lista);
    }
  );
}

export async function criarDivida(userId: string, data: any) {
  return addDoc(collection(db, "usuarios", userId, "dividas"), data);
}