type Props = {
  saldo: number;
  entradas: number;
  saidas: number;
  formatar: (v: number) => string;
  email: string;
};

export default function CardSaldo({
  saldo,
  entradas,
  saidas,
  formatar,
  email,
}: Props) {
  return (
    <div className="bg-gradient-to-br from-green-500 to-emerald-700 p-6 rounded-3xl shadow-xl mb-4">
      <p className="text-sm opacity-80">Saldo disponível</p>

      <h1 className="text-4xl font-bold mt-1">{formatar(saldo)}</h1>

      <div className="flex justify-between mt-4 text-sm opacity-90">
        <span>Entradas: {formatar(entradas)}</span>
        <span>Saídas: {formatar(saidas)}</span>
      </div>

      <div className="mt-4 text-xs opacity-70">{email}</div>
    </div>
  );
}