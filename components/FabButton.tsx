"use client";

export default function FabButton({ onClick }: any) {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-6 right-6 bg-green-500 w-14 h-14 rounded-full text-3xl flex items-center justify-center shadow-xl hover:scale-110 transition"
    >
      +
    </button>
  );
}