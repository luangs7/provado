"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { CartaoReview, NOMES_DECISAO } from "./Cartoes";
import { buscarProduto } from "@/lib/dados";
import { formatarData } from "@/lib/formato";
import { useDemo } from "@/lib/demo";
import { REGRAS_SELOS, type Estatisticas } from "@/lib/selos";
import MinhasMedidas from "./MinhasMedidas";
import { SeloChip } from "./Selos";
import type { DecisaoQc, Produto } from "@/lib/tipos";

// Etapas do pedido por agente: armazém → enviado → recebido
const ETAPAS: DecisaoQc[] = ["aguardando", "enviado", "recebido"];

export default function PainelPerfil() {
  const demo = useDemo();
  const totalVotos = Object.keys(demo.votos).length;
  const totalRespostas = Object.values(demo.respostas).flat().length;

  const minhasEstatisticas: Estatisticas = {
    reviews: demo.reviews.length,
    completas: demo.reviews.filter((r) => r.fotos.length > 0 && r.altura !== undefined).length,
    respostas: totalRespostas,
    opinioes: totalVotos,
    compras: demo.qcs.length + demo.reviews.filter((r) => !r.qcId).length,
    curtidasRecebidas: 0,
    maiorCurtida: 0,
  };

  return (
    <div className="flex flex-col gap-12">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div className="flex items-center gap-4">
          <span className="grid size-16 place-items-center rounded-full bg-tinta font-display text-2xl font-bold text-cartao">V</span>
          <div>
            <h1 className="text-3xl font-extrabold">Você</h1>
            <p className="text-apagado">
              Plano {demo.plano === "pago" ? "Plus" : "gratuito"}.{" "}
              <Link href="/planos" className="font-semibold text-cobalto hover:underline">
                Ver planos
              </Link>
            </p>
          </div>
        </div>
        <div className="text-right">
          <p className="font-display text-5xl font-extrabold tabular-nums">{demo.pontos}</p>
          <p className="text-apagado">pontos</p>
        </div>
      </div>

      <section className="flex flex-col gap-3">
        <h2 className="text-2xl font-bold">Suas medidas</h2>
        <p className="max-w-2xl text-apagado">
          Usadas para mostrar o tamanho que serve em você e as reviews de quem tem o corpo parecido. Nas suas reviews,
          aparecem só em faixas.
        </p>
        <MinhasMedidas />
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-2xl font-bold">Selos</h2>
        <p className="max-w-2xl text-apagado">
          As curtidas que suas reviews e opiniões recebem contam para os selos de avaliador. Quem tem selo aparece primeiro
          nas listas.
        </p>
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {REGRAS_SELOS.map((r) => {
            const ganhou = r.ganhou(minhasEstatisticas);
            return (
              <li
                key={r.id}
                className={`flex flex-col gap-1.5 rounded-lg border-2 p-4 ${ganhou ? "border-tinta bg-cartao" : "border-dashed border-linha"}`}
              >
                <SeloChip selo={r} />
                <span className="text-sm text-apagado">{r.descricao}</span>
                <span className="text-sm font-semibold">{ganhou ? "Conquistado" : r.progresso(minhasEstatisticas)}</span>
              </li>
            );
          })}
        </ul>
      </section>

      <section className="flex flex-col gap-3">
        <div className="flex items-baseline justify-between gap-4">
          <h2 className="text-2xl font-bold">Suas peças antes do envio</h2>
          <Link href="/qc/novo" className="text-sm font-semibold text-cobalto hover:underline">
            Mostrar uma peça
          </Link>
        </div>
        {demo.qcs.length === 0 ? (
          <Vazio>Nenhuma peça mostrada. Quando sua compra chegar no armazém do agente, poste as fotos para a comunidade dizer se pode enviar.</Vazio>
        ) : (
          <ul className="flex flex-col divide-y divide-linha rounded-lg border border-linha bg-cartao">
            {demo.qcs.map((qc) => {
              const produto = qc.produtoId ? buscarProduto(qc.produtoId) : undefined;
              const desvio = qc.decisao === "trocado" || qc.decisao === "devolvido";
              const etapaAtual = ETAPAS.indexOf(qc.decisao);
              return (
                <li key={qc.id} className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="min-w-0">
                    <Link href={`/qc/${qc.id}`} className="font-semibold hover:underline">
                      {produto?.titulo ?? qc.tituloLivre}
                    </Link>
                    <p className="text-sm text-apagado">
                      Tam. {qc.tamanho}, postado em {formatarData(qc.data)}
                    </p>
                  </div>
                  {desvio ? (
                    <span className="text-sm font-semibold text-rl">{NOMES_DECISAO[qc.decisao]}</span>
                  ) : (
                    <ol className="flex items-center gap-1 text-xs font-semibold" aria-label="Etapa do pedido">
                      {ETAPAS.map((e, i) => (
                        <li
                          key={e}
                          aria-current={i === etapaAtual ? "step" : undefined}
                          className={`rounded px-2 py-1 ${i <= etapaAtual ? "bg-tinta text-cartao" : "bg-papel text-apagado"}`}
                        >
                          {NOMES_DECISAO[e]}
                        </li>
                      ))}
                    </ol>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-2xl font-bold">Suas reviews</h2>
        {demo.reviews.length === 0 ? (
          <Vazio>Nenhuma review publicada. Abra a página de um produto que você já recebeu e conte como chegou.</Vazio>
        ) : (
          <div className="flex flex-col gap-4">
            {demo.reviews.map((r) => {
              const produto = buscarProduto(r.produtoId) ?? produtoGenerico(r.produtoId);
              return (
                <div key={r.id} className="flex flex-col gap-2">
                  {buscarProduto(r.produtoId) ? (
                    <Link href={`/produto/${produto.id}`} className="text-sm font-semibold text-cobalto hover:underline">
                      {produto.titulo}
                    </Link>
                  ) : (
                    <p className="text-sm text-apagado">{produto.titulo}. A página do produto é criada com a primeira review.</p>
                  )}
                  <CartaoReview review={r} produto={produto} minha />
                </div>
              );
            })}
          </div>
        )}
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-2xl font-bold">Extrato de pontos</h2>
        <ul className="flex flex-col divide-y divide-linha rounded-lg border border-linha bg-cartao">
          {demo.extrato.map((l, i) => (
            <li key={i} className="flex items-center justify-between gap-4 px-4 py-3">
              <span>
                {l.descricao}
                <span className="ml-2 text-sm text-apagado">{formatarData(l.data)}</span>
              </span>
              <span className={`font-semibold tabular-nums ${l.pontos < 0 ? "text-rl" : "text-gl"}`}>
                {l.pontos > 0 ? "+" : ""}
                {l.pontos}
              </span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

// Produto que ainda não está no catálogo (review feita a partir de um link novo)
function produtoGenerico(id: string): Produto {
  const itemId = id.split(":").pop() ?? "";
  return {
    id,
    titulo: `Item ${itemId}`,
    marca: "",
    categoria: "camisetas",
    lojaId: "",
    plataforma: "taobao",
    itemId,
    precoYuan: 0,
    cor: "#9aa6b8",
    corNome: "",
    tamanhos: ["P", "M"],
  };
}

function Vazio({ children }: { children: ReactNode }) {
  return <p className="rounded-lg border border-dashed border-linha p-6 text-apagado">{children}</p>;
}
