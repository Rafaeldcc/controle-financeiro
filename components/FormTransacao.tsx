export default function FormTransacao({
  valor,
  setValor,
  tipo,
  setTipo,
  categoria,
  setCategoria,
  descricao,
  setDescricao,
  categorias,
  salvar,
}: any) {
  return (
    <div className="bg-slate-800 p-4 rounded-2xl mb-4 shadow">

      <input
        type="number"
        placeholder="Valor"
        value={valor}
        onChange={(e) => setValor(e.target.value)}
        className="bg-slate-700 p-3 w-full mb-2 rounded-xl"
      />

      <select
        value={tipo}
        onChange={(e) => {
          setTipo(e.target.value);
          setCategoria("");
        }}
        className="bg-slate-700 p-3 w-full mb-2 rounded-xl"
      >
        <option value="entrada">Entrada</option>
        <option value="saida">Saída</option>
      </select>

      <select
        value={categoria}
        onChange={(e) => setCategoria(e.target.value)}
        className="bg-slate-700 p-3 w-full mb-2 rounded-xl"
      >
        <option value="">Categoria</option>
        {categorias.map((c: string) => (
          <option key={c}>{c}</option>
        ))}
      </select>

      <input
        type="text"
        placeholder="Descrição"
        value={descricao}
        onChange={(e) => setDescricao(e.target.value)}
        className="bg-slate-700 p-3 w-full mb-2 rounded-xl"
      />

      <button
        onClick={salvar}
        className="bg-green-500 w-full p-3 rounded-xl font-bold"
      >
        Salvar
      </button>
    </div>
  );
}