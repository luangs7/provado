"use client";

// Curtir uma review ou opinião. Curtir significa "concordo / foi útil",
// e as curtidas contam para os selos de quem escreveu.

import { curtir, useDemo } from "@/lib/demo";

export default function BotaoCurtir({ id, curtidas, proprio = false }: { id: string; curtidas: number; proprio?: boolean }) {
  const demo = useDemo();
  const curtido = demo.curtidas.includes(id);
  const total = curtidas + (curtido ? 1 : 0);

  if (proprio) {
    return (
      <span className="inline-flex items-center gap-1.5 text-sm text-apagado">
        <Coracao cheio={false} />
        {total}
      </span>
    );
  }

  return (
    <button
      type="button"
      onClick={() => curtir(id)}
      aria-pressed={curtido}
      aria-label={`${curtido ? "Remover curtida" : "Curtir"}. ${total} curtidas`}
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-sm font-semibold ${
        curtido ? "border-rl bg-rl-claro text-rl" : "border-linha bg-cartao text-apagado hover:border-tinta hover:text-tinta"
      }`}
    >
      <Coracao cheio={curtido} />
      <span className="tabular-nums">{total}</span>
      <span className="sr-only sm:not-sr-only">{curtido ? "Curtiu" : "Curtir"}</span>
    </button>
  );
}

function Coracao({ cheio }: { cheio: boolean }) {
  return (
    <svg viewBox="0 0 16 16" className="size-4" aria-hidden>
      <path
        d="M8 14 C3 10 1 7.5 1 5 C1 3 2.6 1.5 4.5 1.5 C6 1.5 7.2 2.4 8 3.6 C8.8 2.4 10 1.5 11.5 1.5 C13.4 1.5 15 3 15 5 C15 7.5 13 10 8 14 Z"
        fill={cheio ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}
