export default function ListaRecorrentes({
  lista,
  toggle,
  excluir,
  editar,
  onPagar,
}: any) {
  const hoje = new Date().getDate();

  return (
    <div className="bg-slate-800 p-4 rounded-xl mb-4">
      <h2 className="font-bold mb-3">💳 Despesas Fixas</h2>

      {lista.map((r: any) => {
        const atrasado = !r.pago && hoje > r.dia;

        return (
          <div
            key={r.id}
            className="flex justify-between items-center mb-2"
          >
            {/* 🔥 AREA PRINCIPAL */}
            <div className="flex-1">
              <p className="font-bold">{r.nome}</p>

              <p className="text-xs opacity-60">
                Dia {r.dia} • R$ {Number(r.valor) || r.valorPadrao || 0}
              </p>

              {r.parcelas && (
                <p className="text-xs text-blue-400">
                  {r.parcelaAtual || 1}/{r.parcelas}
                </p>
              )}

              {/* 🔥 INPUTS CORRIGIDOS */}
              <div className="flex gap-2 mt-1">
                <input
                  type="number"
                  placeholder="Valor"
                  defaultValue={r.valorTemp || ""}
                  onClick={(e) => e.stopPropagation()}
                  onChange={(e) => {
                    r.valorTemp = Number(e.target.value);

                    // 🔥 força atualização leve
                    r._temp = Date.now();
                  }}
                  className="bg-slate-700 px-2 py-1 rounded w-24"
                />

                <input
                  type="number"
                  placeholder="Parcelas"
                  defaultValue={r.parcelasTemp || r.parcelas || ""}
                  onClick={(e) => e.stopPropagation()}
                  onChange={(e) => {
                    r.parcelasTemp = Number(e.target.value);

                    // 🔥 NÃO sobrescreve o original
                    r._temp = Date.now();
                  }}
                  className="bg-slate-700 px-2 py-1 rounded w-20"
                />

                {/* 🔥 BOTÃO PAGAR */}
                <button
                  onClick={() => onPagar(r)}
                  className="bg-green-600 px-2 rounded"
                >
                  💰
                </button>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => onPagar(r)}
                className={`px-3 py-1 rounded text-sm ${
                  r.pago
                    ? "bg-green-500"
                    : atrasado
                    ? "bg-yellow-500"
                    : "bg-red-500"
                }`}
              >
                {r.pago ? "Pago" : "Pagar"}
              </button>

              <button
                onClick={() => editar(r)}
                className="bg-blue-500 px-2 rounded"
              >
                ✏️
              </button>

              <button
                onClick={() => excluir(r.id)}
                className="bg-red-600 px-2 rounded"
              >
                X
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}