"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

export default function MenuLateral({ aberto, fechar }: any) {
  const router = useRouter();

  function navegar(path: string) {
    router.push(path);
    fechar();
  }

  return (
    <AnimatePresence>
      {aberto && (
        <>
          {/* FUNDO ESCURO */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={fechar}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          />

          {/* MENU */}
          <motion.div
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            transition={{ duration: 0.3 }}
            className="fixed top-0 left-0 h-full w-72 bg-slate-900 text-white p-6 z-50 shadow-2xl"
          >
            {/* HEADER */}
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-xl font-bold">💰 Controle</h2>

              <button
                onClick={fechar}
                className="text-xl hover:scale-110 transition"
              >
                ✖
              </button>
            </div>

            {/* MENU ITEMS */}
            <div className="space-y-2">

              <button
                onClick={() => navegar("/")}
                className="flex items-center gap-3 w-full p-3 rounded-xl hover:bg-slate-800 transition"
              >
                🏠 <span>Dashboard</span>
              </button>

              <button
                onClick={() => navegar("/transacoes")}
                className="flex items-center gap-3 w-full p-3 rounded-xl hover:bg-slate-800 transition"
              >
                💸 <span>Transações</span>
              </button>

              <button
                onClick={() => navegar("/metas")}
                className="flex items-center gap-3 w-full p-3 rounded-xl hover:bg-slate-800 transition"
              >
                🎯 <span>Metas</span>
              </button>

              <button
                onClick={() => navegar("/relatorios")}
                className="flex items-center gap-3 w-full p-3 rounded-xl hover:bg-slate-800 transition"
              >
                📊 <span>Relatórios</span>
              </button>

              <button
                onClick={() => navegar("/config")}
                className="flex items-center gap-3 w-full p-3 rounded-xl hover:bg-slate-800 transition"
              >
                ⚙️ <span>Configurações</span>
              </button>

            </div>

            {/* RODAPÉ */}
            <div className="absolute bottom-6 left-6 right-6">
              <button className="w-full bg-red-500 p-3 rounded-xl hover:bg-red-600 transition">
                🚪 Sair
              </button>
            </div>

          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}