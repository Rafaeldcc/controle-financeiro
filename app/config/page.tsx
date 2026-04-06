"use client";

import { useEffect, useState } from "react";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { onAuthStateChanged, signOut } from "firebase/auth";

export default function Config() {
  const [user, setUser] = useState<any>(null);
  const [meta, setMeta] = useState("");
  const [limite, setLimite] = useState("");
  const [mensagem, setMensagem] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (usuario) => {
      if (!usuario) return (window.location.href = "/login");

      setUser(usuario);

      const ref = doc(db, "usuarios", usuario.uid);
      const snap = await getDoc(ref);

      if (snap.exists()) {
        const data = snap.data();
        setMeta(data.meta || "");
        setLimite(data.limite || "");
      }
    });

    return () => unsubscribe();
  }, []);

  async function salvar() {
    await setDoc(
      doc(db, "usuarios", user.uid),
      {
        meta: Number(meta),
        limite: Number(limite),
      },
      { merge: true }
    );

    setMensagem("✅ Configurações salvas!");
    setTimeout(() => setMensagem(""), 2000);
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-slate-900 text-white p-4">

      <h1 className="text-xl font-bold mb-4">⚙️ Configurações</h1>

      {mensagem && (
        <div className="bg-slate-800 p-3 rounded mb-4 text-center">
          {mensagem}
        </div>
      )}

      {/* PERFIL */}
      <div className="bg-slate-800 p-4 rounded-xl mb-4">
        <h2 className="font-bold mb-2">👤 Perfil</h2>
        <p className="text-sm opacity-70">{user.email}</p>
      </div>

      {/* FINANCEIRO */}
      <div className="bg-slate-800 p-4 rounded-xl mb-4">
        <h2 className="font-bold mb-3">💰 Preferências</h2>

        <input
          type="number"
          placeholder="Meta mensal (R$)"
          value={meta}
          onChange={(e) => setMeta(e.target.value)}
          className="bg-slate-700 p-3 w-full mb-2 rounded"
        />

        <input
          type="number"
          placeholder="Limite de gastos (R$)"
          value={limite}
          onChange={(e) => setLimite(e.target.value)}
          className="bg-slate-700 p-3 w-full mb-2 rounded"
        />

        <button
          onClick={salvar}
          className="bg-green-500 w-full p-3 rounded font-bold"
        >
          Salvar
        </button>
      </div>

      {/* CONTA */}
      <div className="bg-slate-800 p-4 rounded-xl">
        <h2 className="font-bold mb-2">🔐 Conta</h2>

        <button
          onClick={() => signOut(auth)}
          className="bg-red-500 w-full p-3 rounded"
        >
          Sair
        </button>
      </div>

    </div>
  );
}