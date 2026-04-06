export default function Insights({ entradas, saidas }: any) {
  return (
    <div className="bg-slate-800 p-4 rounded-xl mb-4 text-sm space-y-2">

      {saidas > entradas && (
        <p className="text-red-400">
          ⚠️ Você está gastando mais do que ganha
        </p>
      )}

      {saidas > entradas * 0.7 && (
        <p className="text-yellow-400">
          💡 Seus gastos estão altos
        </p>
      )}

      {entradas > saidas && (
        <p className="text-green-400">
          👍 Você está economizando bem
        </p>
      )}
    </div>
  );
}