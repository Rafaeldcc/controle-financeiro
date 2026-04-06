"use client";

import { useRouter } from "next/navigation";

export default function Header({ titulo }: { titulo: string }) {
  const router = useRouter();

  return (
    <div className="flex items-center justify-between mb-6">

      <div className="flex items-center gap-3">
        <button
          onClick={() => router.back()}
          className="text-xl bg-slate-800 px-3 py-1 rounded"
        >
          ←
        </button>
      </div>

      <h1 className="font-bold text-lg">{titulo}</h1>

      <div className="w-10"></div>
    </div>
  );
}