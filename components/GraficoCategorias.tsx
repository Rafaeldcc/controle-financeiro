"use client";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const cores = ["#22c55e", "#ef4444", "#3b82f6", "#f59e0b", "#8b5cf6"];

export default function GraficoCategorias({ dados }: any) {
  return (
    <div className="bg-slate-800 p-4 rounded-xl h-72">

      <h2 className="mb-2 text-sm opacity-70">Gastos por categoria</h2>

      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={dados}
            dataKey="valor"
            nameKey="categoria"
            outerRadius={90}
          >
            {dados.map((_: any, index: number) => (
              <Cell key={index} fill={cores[index % cores.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}