"use client";

// Opiniões escritas sobre uma peça no armazém, com curtidas.
// Quem tem selo de avaliador aparece primeiro e com destaque.

import Link from "next/link";
import BotaoCurtir from "./BotaoCurtir";
import Carimbo from "./Carimbo";
import { Autor } from "./Selos";
import { formatarData } from "@/lib/formato";
import { useDemo } from "@/lib/demo";
import { destaqueDoAutor, ordenarPorDestaque } from "@/lib/pessoas";
import type { Opiniao } from "@/lib/tipos";

export function CartaoOpiniao({ opiniao, minha = false, comLink = false }: { opiniao: Opiniao; minha?: boolean; comLink?: boolean }) {
  const ouro = !minha && destaqueDoAutor(opiniao.autor) === 3;
  return (
    <article className={`flex gap-4 rounded-lg border bg-cartao p-4 ${minha ? "border-cobalto" : ouro ? "border-2 border-fita" : "border-linha"}`}>
      <div className="shrink-0 pt-1">
        <Carimbo veredito={opiniao.veredito} tamanho="p" />
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <div className="flex flex-wrap items-baseline gap-x-2">
          <Autor nome={opiniao.autor} />
          <span className="text-sm text-apagado">{formatarData(opiniao.data)}</span>
        </div>
        {opiniao.motivo && (
          <span className="self-start rounded-full bg-rl-claro px-2.5 py-0.5 text-xs font-semibold text-rl">{opiniao.motivo}</span>
        )}
        <p className="leading-relaxed">{opiniao.texto}</p>
        <div className="flex flex-wrap items-center gap-3">
          <BotaoCurtir id={opiniao.id} curtidas={opiniao.curtidas} proprio={minha} />
          {comLink && (
            <Link href={`/qc/${opiniao.qcId}`} className="text-sm font-semibold text-cobalto hover:underline">
              Ver a peça
            </Link>
          )}
        </div>
      </div>
    </article>
  );
}

export default function Opinioes({ qcId, opinioes }: { qcId: string; opinioes: Opiniao[] }) {
  const demo = useDemo();
  const minhas = demo.opinioes.filter((o) => o.qcId === qcId);
  const ordenadas = ordenarPorDestaque(opinioes);

  if (!minhas.length && !ordenadas.length) {
    return <p className="text-apagado">Ninguém comentou ainda. Dê sua opinião e explique o que viu nas fotos.</p>;
  }

  return (
    <div className="flex flex-col gap-3">
      {minhas.map((o) => (
        <CartaoOpiniao key={o.id} opiniao={o} minha />
      ))}
      {ordenadas.map((o) => (
        <CartaoOpiniao key={o.id} opiniao={o} />
      ))}
    </div>
  );
}
