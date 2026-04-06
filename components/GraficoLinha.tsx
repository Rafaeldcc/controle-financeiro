"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function GraficoLinha({ dados }: any) {
  return (
    <div className="bg-slate-800 p-4 rounded-xl h-72">

      <h2 className="mb-2 text-sm opacity-70">Evolução mensal</h2>

      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={dados}>
          <XAxis dataKey="mes" />
          <YAxis />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="valor"
            stroke="#22c55e"
            strokeWidth={3}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}