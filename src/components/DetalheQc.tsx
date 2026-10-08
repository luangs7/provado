// Tela de uma peça no armazém (fotos de conferência antes do envio).
// Usada tanto para as peças do catálogo (renderizada no servidor)
// quanto para as que você postou (renderizada no navegador).

import Link from "next/link";
import ArteProduto from "./ArteProduto";
import Carimbo from "./Carimbo";
import { NOMES_DECISAO } from "./Cartoes";
import Galeria from "./Galeria";
import Opinioes from "./Opinioes";
import VotacaoQc from "./VotacaoQc";
import { buscarLoja, opinioesDo, produtosDaLoja, qcsDo } from "@/lib/dados";
import { taxaRl, vereditoDoQc } from "@/lib/calculos";
import { comoComprou, formatarData, formatarPorcentagem, plural } from "@/lib/formato";
import type { Produto, Qc } from "@/lib/tipos";

export default function DetalheQc({ qc, produto, meu = false }: { qc: Qc; produto?: Produto; meu?: boolean }) {
  const veredito = vereditoDoQc(qc);
  const outros = produto ? qcsDo(produto.id).filter((q) => q.id !== qc.id) : [];
  const loja = produto ? buscarLoja(produto.lojaId) : undefined;
  const rlLoja = loja ? taxaRl(produtosDaLoja(loja.id).flatMap((p) => qcsDo(p.id))) : null;
  const titulo = produto?.titulo ?? qc.tituloLivre ?? "Produto ainda sem página";

  return (
    <div className="flex flex-col gap-10">
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_24rem]">
        <div className="self-start">
          <Galeria
            fotos={qc.fotos}
            categoria={produto?.categoria ?? "camisetas"}
            cor={produto?.cor ?? "#9aa6b8"}
            formato="grade"
            titulo="Fotos do armazém"
          />
        </div>

        <div className="flex min-w-0 flex-col gap-6">
          <div className="flex flex-col gap-2">
            {qc.decisao === "aguardando" ? (
              <span className="self-start rounded bg-fita px-2 py-0.5 text-sm font-semibold text-fita-tinta">
                No armazém, esperando opiniões
              </span>
            ) : (
              <span className="self-start text-sm font-semibold text-apagado">{NOMES_DECISAO[qc.decisao]}</span>
            )}
            <h1 className="text-3xl font-extrabold leading-tight">
              {produto ? (
                <Link href={`/produto/${produto.id}`} className="hover:underline">
                  {titulo}
                </Link>
              ) : (
                titulo
              )}
            </h1>
            <p className="text-apagado">
              Peça de <span className="font-semibold text-tinta">{meu ? "Você" : qc.autor}</span>, fotos de {formatarData(qc.data)}.
              Tamanho {qc.tamanho}, {comoComprou(qc.canal)}.
            </p>
            {qc.link && !produto && <p className="break-all text-sm text-apagado">{qc.link}</p>}
          </div>

          {qc.observacao && (
            <blockquote className="border-l-4 border-fita bg-cartao px-4 py-3 leading-relaxed">{qc.observacao}</blockquote>
          )}

          {qc.decisao !== "aguardando" && veredito && (
            <div className="flex items-center gap-4">
              <Carimbo veredito={veredito} tamanho="g" />
              <p className="text-apagado">{veredito === "GL" ? "Aprovado pela comunidade: pode enviar." : "Reprovado pela comunidade: melhor trocar."}</p>
            </div>
          )}

          <div className="rounded-lg border border-linha bg-cartao p-4">
            <VotacaoQc qc={qc} meu={meu} />
          </div>

          {loja && rlLoja && (
            <p className="text-sm text-apagado">
              Na{" "}
              <Link href={`/loja/${loja.id}`} className="font-semibold text-tinta hover:underline">
                {loja.nome}
              </Link>
              , a comunidade reprovou {formatarPorcentagem(rlLoja.taxa)} das peças em{" "}
              {plural(rlLoja.total, "QC revisado", "QCs revisados")}.
            </p>
          )}
        </div>
      </div>

      <section className="flex max-w-3xl flex-col gap-4">
        <h2 className="text-2xl font-bold">Opiniões da comunidade</h2>
        <Opinioes qcId={qc.id} opinioes={opinioesDo(qc.id)} />
      </section>

      {produto && outros.length > 0 && (
        <section className="flex flex-col gap-4">
          <h2 className="text-2xl font-bold">Compare com outras unidades deste produto</h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {outros.map((o) => {
              const v = vereditoDoQc(o);
              return (
                <Link key={o.id} href={`/qc/${o.id}`} className="group flex flex-col gap-1.5">
                  <div className="relative">
                    <ArteProduto categoria={produto.categoria} cor={produto.cor} foto={o.fotos[0]} />
                    <span className="absolute right-2 top-2">
                      {o.decisao === "aguardando" ? (
                        <span className="rounded bg-fita px-1.5 py-0.5 text-xs font-semibold text-fita-tinta">Em aberto</span>
                      ) : (
                        v && <Carimbo veredito={v} tamanho="p" />
                      )}
                    </span>
                  </div>
                  <span className="text-sm text-apagado group-hover:text-tinta">
                    {o.autor}, tam. {o.tamanho}
                  </span>
                </Link>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}
