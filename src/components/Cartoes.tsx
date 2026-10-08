// Cartões usados em várias telas: produto, QC e review.

import Link from "next/link";
import type { ReactNode } from "react";
import ArteProduto from "./ArteProduto";
import Carimbo from "./Carimbo";
import { faixaAltura, faixaPeso, notaDaReview, vereditoDoQc, NOMES_CRITERIOS } from "@/lib/calculos";
import { formatarData, formatarNota, formatarPorcentagem, plural } from "@/lib/formato";
import type { Criterios, DecisaoQc, Produto, Qc, Review } from "@/lib/tipos";
import type { resumoDoProduto } from "@/lib/resumos";

// ---------- Produto ----------

export function CartaoProduto({ resumo }: { resumo: ReturnType<typeof resumoDoProduto> }) {
  const { produto, loja, nota, totalReviews, rl } = resumo;
  return (
    <Link
      href={`/produto/${produto.id}`}
      className="group flex gap-3 rounded-lg border border-linha bg-cartao p-3 hover:border-tinta"
    >
      <ArteProduto categoria={produto.categoria} cor={produto.cor} className="w-20 shrink-0" />
      <div className="flex min-w-0 flex-col gap-1">
        <span className="font-semibold leading-snug group-hover:underline">{produto.titulo}</span>
        <span className="text-sm text-apagado">{loja.nome}</span>
        <span className="mt-auto flex flex-wrap gap-x-3 text-sm">
          <span className="font-semibold tabular-nums">{formatarNota(nota)}</span>
          <span className="text-apagado">{plural(totalReviews, "review", "reviews")}</span>
          {rl && <span className="text-apagado">RL {formatarPorcentagem(rl.taxa)}</span>}
        </span>
      </div>
    </Link>
  );
}

// ---------- QC ----------

export const NOMES_DECISAO: Record<DecisaoQc, string> = {
  aguardando: "No armazém",
  enviado: "Enviado",
  trocado: "Trocado com a loja",
  devolvido: "Devolvido",
  recebido: "Recebido",
};

export function PlacarQc({ qc }: { qc: Qc }) {
  const { gl, rl } = qc.votos;
  const total = gl + rl;
  if (!total) return <p className="text-sm text-apagado">Ainda sem votos</p>;
  return (
    <div className="flex h-6 overflow-hidden rounded text-xs font-semibold text-white" role="img" aria-label={`${gl} votos GL e ${rl} votos RL`}>
      {gl > 0 && (
        <span className="flex items-center bg-gl px-2" style={{ width: `${(gl / total) * 100}%` }}>
          GL {gl}
        </span>
      )}
      {rl > 0 && (
        <span className="flex items-center justify-end bg-rl px-2" style={{ width: `${(rl / total) * 100}%` }}>
          RL {rl}
        </span>
      )}
    </div>
  );
}

export function CartaoQc({ qc, produto, titulo }: { qc: Qc; produto?: Produto; titulo?: string }) {
  const veredito = vereditoDoQc(qc);
  const aguardando = qc.decisao === "aguardando";
  return (
    <Link
      href={`/qc/${qc.id}`}
      className="group relative flex flex-col gap-3 rounded-lg border border-linha bg-cartao p-3 hover:border-tinta"
    >
      <div className="grid grid-cols-4 gap-1">
        {qc.fotos.slice(0, 4).map((f, i) => (
          <ArteProduto key={i} categoria={produto?.categoria ?? "camisetas"} cor={produto?.cor ?? "#9aa6b8"} foto={f} />
        ))}
      </div>
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="font-semibold leading-snug group-hover:underline">{titulo ?? produto?.titulo ?? qc.tituloLivre}</p>
          <p className="text-sm text-apagado">
            Tam. {qc.tamanho}, {qc.autor}, {formatarData(qc.data)}
          </p>
        </div>
        {aguardando ? (
          <span className="shrink-0 rounded bg-fita px-2 py-0.5 text-xs font-semibold text-fita-tinta">No armazém</span>
        ) : (
          veredito && <Carimbo veredito={veredito} tamanho="p" />
        )}
      </div>
      <PlacarQc qc={qc} />
    </Link>
  );
}

// ---------- Review ----------

const NOMES_CAIMENTO = { pequeno: "Ficou pequeno", certo: "Tamanho certo", grande: "Ficou grande" };

export function CartaoReview({ review, produto, destaque = false }: { review: Review; produto: Produto; destaque?: boolean }) {
  const nota = notaDaReview(review);
  return (
    <article className={`flex flex-col gap-3 rounded-lg border bg-cartao p-4 ${destaque ? "border-cobalto" : "border-linha"}`}>
      <header className="flex flex-wrap items-baseline justify-between gap-2">
        <p>
          <span className="font-semibold">{review.autor}</span>
          <span className="text-sm text-apagado">, {formatarData(review.data)}</span>
          {destaque && <span className="ml-2 rounded bg-cobalto-claro px-1.5 py-0.5 text-xs font-semibold text-cobalto-escuro">Sua review</span>}
        </p>
        <span className="font-display text-lg font-bold tabular-nums">{formatarNota(nota)}</span>
      </header>

      <ul className="flex flex-wrap gap-1.5 text-xs">
        <Etiqueta>Tamanho {review.tamanho}</Etiqueta>
        {produto.tamanhos.length > 1 && (
          <Etiqueta tom={review.caimento === "certo" ? "gl" : "aviso"}>{NOMES_CAIMENTO[review.caimento]}</Etiqueta>
        )}
        {review.altura !== undefined && review.peso !== undefined && (
          <Etiqueta>
            {faixaAltura(review.altura)}, {faixaPeso(review.peso)}
          </Etiqueta>
        )}
        <Etiqueta>{review.canal}</Etiqueta>
      </ul>

      <p className="max-w-prose leading-relaxed">{review.texto}</p>

      {review.fotos.length > 0 && (
        <div className="flex gap-1.5">
          {review.fotos.map((f, i) => (
            <ArteProduto key={i} categoria={produto.categoria} cor={produto.cor} foto={f} className="w-16" />
          ))}
        </div>
      )}

      <footer className="flex flex-wrap gap-x-4 text-sm text-apagado">
        {review.qcId && (
          <Link href={`/qc/${review.qcId}`} className="underline underline-offset-2 hover:text-tinta">
            Começou como QC no armazém
          </Link>
        )}
        <span>{plural(review.util, "pessoa achou útil", "pessoas acharam útil")}</span>
      </footer>
    </article>
  );
}

function Etiqueta({ children, tom }: { children: ReactNode; tom?: "gl" | "aviso" }) {
  const cores = tom === "gl" ? "bg-gl-claro text-gl" : tom === "aviso" ? "bg-rl-claro text-rl" : "bg-papel text-tinta";
  return <li className={`rounded px-2 py-0.5 font-medium ${cores}`}>{children}</li>;
}

// ---------- Notas ----------

export function BarrasNotas({ notas }: { notas: Criterios }) {
  return (
    <dl className="flex flex-col gap-2">
      {(Object.keys(NOMES_CRITERIOS) as (keyof Criterios)[]).map((c) => (
        <div key={c} className="grid grid-cols-[9.5rem_1fr_2.2rem] items-center gap-3 text-sm">
          <dt className="text-apagado">{NOMES_CRITERIOS[c]}</dt>
          <dd className="h-2 overflow-hidden rounded-full bg-papel">
            <span className="block h-full rounded-full bg-cobalto" style={{ width: `${(notas[c] / 5) * 100}%` }} />
          </dd>
          <dd className="text-right font-semibold tabular-nums">{formatarNota(notas[c])}</dd>
        </div>
      ))}
    </dl>
  );
}
