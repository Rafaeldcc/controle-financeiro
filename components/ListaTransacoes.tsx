export default function ListaTransacoes({
  transacoes,
  excluir,
  formatar,
}: any) {
  return (
    <div className="space-y-2">
      {transacoes.map((t: any) => (
        <div
          key={t.id}
          className="bg-slate-800 p-3 rounded-xl flex justify-between items-center shadow"
        >
          <div>
            <p className="font-bold">{t.descricao}</p>
            <p className="text-xs opacity-60">{t.categoria}</p>
          </div>

          <div className="flex items-center gap-2">
            <p
              className={
                t.tipo === "entrada"
                  ? "text-green-400 font-bold"
                  : "text-red-400 font-bold"
              }
            >
              {formatar(t.valor)}
            </p>

            <button
              onClick={() => excluir(t.id)}
              className="bg-red-500 px-2 rounded"
            >
              X
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}