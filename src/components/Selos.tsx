// Selos e nome do autor com o selo principal ao lado

import Link from "next/link";
import { selosDoAutor } from "@/lib/pessoas";
import type { NivelSelo, Selo } from "@/lib/selos";

const CORES: Record<NivelSelo, string> = {
  ouro: "bg-fita text-fita-tinta",
  prata: "bg-prata text-tinta",
  bronze: "bg-bronze text-bronze-tinta",
  comum: "border border-linha text-apagado",
};

export function SeloChip({ selo, grande = false }: { selo: Selo; grande?: boolean }) {
  return (
    <span
      title={selo.descricao}
      className={`inline-flex items-center gap-1 self-start rounded-full font-semibold ${CORES[selo.nivel]} ${
        grande ? "px-3 py-1 text-sm" : "px-2 py-0.5 text-[11px]"
      }`}
    >
      {selo.nivel !== "comum" && <Medalha />}
      {selo.nome}
    </span>
  );
}

function Medalha() {
  return (
    <svg viewBox="0 0 12 12" className="size-3" aria-hidden>
      <circle cx="6" cy="7" r="4" fill="currentColor" opacity="0.85" />
      <path d="M3.5 1 L6 4 L8.5 1" stroke="currentColor" strokeWidth="1.5" fill="none" />
    </svg>
  );
}

// Nome do autor (com link para o perfil) e o selo mais importante dele
export function Autor({ nome, selo = true }: { nome: string; selo?: boolean }) {
  if (nome === "Você") return <span className="font-semibold">Você</span>;
  const principal = selo ? selosDoAutor(nome)[0] : undefined;
  return (
    <span className="inline-flex flex-wrap items-center gap-x-2 gap-y-1">
      <Link href={`/usuario/${encodeURIComponent(nome)}`} className="font-semibold hover:underline">
        {nome}
      </Link>
      {principal && <SeloChip selo={principal} />}
    </span>
  );
}
