export default function MetaFinanceira({ saldo, meta }: any) {
  const porcentagem = Math.min((saldo / meta) * 100, 100);

  return (
    <div className="bg-slate-800 p-4 rounded-xl mb-4">
      <p className="text-sm mb-2">Meta mensal</p>

      <div className="w-full bg-slate-700 h-3 rounded-full">
        <div
          className="bg-green-500 h-3 rounded-full transition-all"
          style={{ width: `${porcentagem}%` }}
        />
      </div>

      <p className="text-xs mt-2">
        R$ {saldo.toFixed(2)} / R$ {meta}
      </p>
    </div>
  );
}