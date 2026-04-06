export default function ListaRecorrentes({ lista, toggle }: any) {
  return (
    <div className="bg-slate-800 p-4 rounded-xl mb-4">

      <h2 className="mb-3 font-bold">💳 Despesas Fixas</h2>

      {lista.map((r: any) => (
        <div
          key={r.id}
          className="flex justify-between items-center mb-2"
        >
          <div>
            <p>{r.nome}</p>
            <p className="text-xs opacity-60">
              Dia {r.dia} - R$ {r.valor}
            </p>
          </div>

          <button
            onClick={() => toggle(r.id, r.pago)}
            className={`px-3 py-1 rounded ${
              r.pago ? "bg-green-500" : "bg-red-500"
            }`}
          >
            {r.pago ? "Pago" : "Pendente"}
          </button>
        </div>
      ))}
    </div>
  );
}