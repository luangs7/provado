"use client";

// Termo da comunidade (GL, RL, QC...) com a explicação ao tocar ou passar o mouse.

import Link from "next/link";
import { useState, type ReactNode } from "react";
import { buscarTermo } from "@/lib/glossario";

export default function Termo({ id, children }: { id: string; children?: ReactNode }) {
  const [aberto, setAberto] = useState(false);
  const termo = buscarTermo(id);
  if (!termo) return <>{children}</>;

  return (
    <span className="relative inline-block" onMouseEnter={() => setAberto(true)} onMouseLeave={() => setAberto(false)}>
      <button
        type="button"
        aria-expanded={aberto}
        aria-controls={`termo-${id}`}
        onClick={() => setAberto(!aberto)}
        onBlur={(e) => {
          if (!e.currentTarget.parentElement?.contains(e.relatedTarget)) setAberto(false);
        }}
        className="cursor-help underline decoration-dotted decoration-2 underline-offset-4"
      >
        {children ?? termo.termo}
      </button>
      {aberto && (
        <span
          id={`termo-${id}`}
          role="tooltip"
          className="absolute left-0 top-full z-20 mt-2 flex w-72 max-w-[80vw] flex-col gap-1.5 rounded-lg border border-tinta bg-cartao p-3 text-left text-sm font-normal leading-snug text-tinta shadow-lg"
        >
          <span className="font-semibold">
            {termo.termo}
            {termo.nome && <span className="font-normal text-apagado"> ({termo.nome})</span>}
          </span>
          <span>{termo.definicao}</span>
          <Link href={`/ajuda#${termo.id}`} className="font-semibold text-cobalto hover:underline">
            Ver todos os termos
          </Link>
        </span>
      )}
    </span>
  );
}
