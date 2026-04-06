"use client";

import { useState } from "react";
import { auth } from "@/lib/firebase";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";

import { motion } from "framer-motion";

export default function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");

  function traduzirErro(msg: string) {
    if (msg.includes("auth/invalid-credential")) return "Email ou senha inválidos";
    if (msg.includes("auth/email-already-in-use")) return "Email já cadastrado";
    if (msg.includes("auth/weak-password")) return "Senha muito fraca (mínimo 6 caracteres)";
    return "Erro ao autenticar";
  }

  async function login() {
    try {
      setErro("");
      setLoading(true);
      await signInWithEmailAndPassword(auth, email, senha);
      window.location.href = "/";
    } catch (e: any) {
      setErro(traduzirErro(e.message));
    } finally {
      setLoading(false);
    }
  }

  async function cadastrar() {
    try {
      setErro("");
      setLoading(true);
      await createUserWithEmailAndPassword(auth, email, senha);
      setErro("Conta criada! Agora faça login.");
    } catch (e: any) {
      setErro(traduzirErro(e.message));
    } finally {
      setLoading(false);
    }
  }

  async function loginGoogle() {
    try {
      setErro("");
      setLoading(true);
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      window.location.href = "/";
    } catch (e: any) {
      setErro("Erro ao entrar com Google");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 p-4">

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-slate-800 p-6 rounded-2xl shadow-2xl w-full max-w-sm"
      >
        <h1 className="text-2xl font-bold mb-6 text-white text-center">
          Controle Financeiro 💰
        </h1>

        {/* ERRO */}
        {erro && (
          <div className="bg-red-500/20 text-red-400 p-2 rounded mb-3 text-sm text-center">
            {erro}
          </div>
        )}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && login()}
          className="bg-slate-700 text-white p-3 w-full mb-3 rounded-xl outline-none focus:ring-2 focus:ring-green-500"
        />

        <input
          type="password"
          placeholder="Senha"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && login()}
          className="bg-slate-700 text-white p-3 w-full mb-4 rounded-xl outline-none focus:ring-2 focus:ring-green-500"
        />

        {/* LOGIN */}
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={login}
          disabled={loading}
          className={`w-full p-3 rounded-xl font-semibold mb-2 transition ${
            loading
              ? "bg-green-400 cursor-not-allowed"
              : "bg-green-600 hover:bg-green-700 text-white"
          }`}
        >
          {loading ? "Entrando..." : "Entrar"}
        </motion.button>

        {/* CADASTRO */}
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={cadastrar}
          disabled={loading}
          className="bg-slate-600 hover:bg-slate-700 transition text-white w-full p-3 rounded-xl font-semibold mb-3"
        >
          Criar conta
        </motion.button>

        {/* DIVISOR */}
        <div className="text-center text-slate-400 text-sm mb-3">
          ou
        </div>

        {/* GOOGLE */}
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={loginGoogle}
          disabled={loading}
          className="bg-white hover:bg-gray-200 transition text-black w-full p-3 rounded-xl font-semibold flex items-center justify-center gap-2"
        >
          <span>🔵</span>
          Entrar com Google
        </motion.button>

        <p className="text-xs text-slate-500 mt-4 text-center">
          Acesse sua conta com segurança 🔐
        </p>
      </motion.div>
    </div>
  );
}