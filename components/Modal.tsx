"use client";

export default function Modal({ aberto, fechar, children }: any) {
  if (!aberto) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">

      <div className="bg-slate-900 p-6 rounded-2xl w-full max-w-md">

        {children}

        <button
          onClick={fechar}
          className="mt-4 bg-red-500 w-full p-2 rounded"
        >
          Fechar
        </button>
      </div>
    </div>
  );
}