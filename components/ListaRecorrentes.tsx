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
            {/* 🔥 CLIQUE AGORA PAGA */}
            <div
              className="cursor-pointer flex-1"
              onClick={() => onPagar(r)}
            >
              <p className="font-bold">{r.nome}</p>
              <p className="text-xs opacity-60">
                Dia {r.dia} • R$ {Number(r.valor) || 0}
              </p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => toggle(r.id, r.pago)}
                className={`px-3 py-1 rounded text-sm ${
                  r.pago
                    ? "bg-green-500"
                    : atrasado
                    ? "bg-yellow-500"
                    : "bg-red-500"
                }`}
              >
                {r.pago ? "Pago" : atrasado ? "Atrasado" : "Pendente"}
              </button>

              {/* 👇 editar separado */}
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