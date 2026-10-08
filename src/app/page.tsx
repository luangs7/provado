import Link from "next/link";
import BuscaLink from "@/components/BuscaLink";
import { CartaoQc, CartaoReview } from "@/components/Cartoes";
import { buscarProduto, lojas, produtosDaLoja, qcs, qcsDo, reviews } from "@/lib/dados";
import { taxaRl } from "@/lib/calculos";
import { formatarNota, formatarPorcentagem, plural } from "@/lib/formato";
import { ranking } from "@/lib/resumos";
import { EXEMPLOS_DE_LINK } from "@/lib/link";


export default function Inicio() {
  const noArmazem = qcs.filter((q) => q.decisao === "aguardando").slice(0, 4);
  const top = ranking().slice(0, 5);
  const recentes = [...reviews].sort((a, b) => b.data.localeCompare(a.data)).slice(0, 3);
  const parceiras = lojas.filter((l) => l.parceira);

  return (
    <div className="flex flex-col gap-16">
      <section className="flex max-w-3xl flex-col gap-5 pt-4">
        <h1 className="text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-6xl">
          Cole o link. Veja como chegou para quem já comprou.
        </h1>
        <p className="max-w-xl text-lg text-apagado">
          Reviews de produtos importados da China organizadas por produto, com fotos de QC, tamanho pedido e as medidas
          de quem vestiu.
        </p>
        <BuscaLink grande />
        <div className="flex flex-wrap items-center gap-2 text-sm">
          <span className="text-apagado">Testar com:</span>
          {EXEMPLOS_DE_LINK.map((e) => (
            <Link
              key={e.link}
              href={`/buscar?link=${encodeURIComponent(e.link)}`}
              className="rounded-full border border-linha bg-cartao px-3 py-1 hover:border-tinta"
            >
              {e.rotulo}
            </Link>
          ))}
        </div>
      </section>

      <div className="grid gap-10 lg:grid-cols-[1fr_24rem]">
        <section className="flex min-w-0 flex-col gap-4">
          <div className="flex items-baseline justify-between gap-4">
            <h2 className="text-2xl font-bold">Esperando GL ou RL</h2>
            <Link href="/qc" className="text-sm font-semibold text-cobalto hover:underline">
              Ver o armazém
            </Link>
          </div>
          <p className="-mt-2 text-apagado">
            Peças paradas no armazém do agente. Seu voto ajuda quem comprou a decidir se envia ou troca.
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            {noArmazem.map((qc) => (
              <CartaoQc key={qc.id} qc={qc} produto={qc.produtoId ? buscarProduto(qc.produtoId) : undefined} />
            ))}
          </div>
        </section>

        <section className="flex flex-col gap-4">
          <div className="flex items-baseline justify-between gap-4">
            <h2 className="text-2xl font-bold">Mais bem avaliados</h2>
            <Link href="/ranking" className="whitespace-nowrap text-sm font-semibold text-cobalto hover:underline">
              Ranking completo
            </Link>
          </div>
          <ol className="flex flex-col divide-y divide-linha rounded-lg border border-linha bg-cartao">
            {top.map((item, i) => (
              <li key={item.produto.id}>
                <Link href={`/produto/${item.produto.id}`} className="flex items-center gap-3 px-4 py-3 hover:bg-papel">
                  <span className="w-5 font-display text-lg font-bold text-apagado tabular-nums">{i + 1}</span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-medium">{item.produto.titulo}</span>
                    <span className="text-sm text-apagado">{plural(item.totalReviews, "review", "reviews")}</span>
                  </span>
                  <span className="font-display text-lg font-bold tabular-nums">{formatarNota(item.pontuacao)}</span>
                </Link>
              </li>
            ))}
          </ol>
        </section>
      </div>

      <section className="flex flex-col gap-4">
        <h2 className="text-2xl font-bold">Lojas parceiras</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {parceiras.map((loja) => {
            const doLoja = produtosDaLoja(loja.id);
            const rl = taxaRl(doLoja.flatMap((p) => qcsDo(p.id)));
            return (
              <Link
                key={loja.id}
                href={`/loja/${loja.id}`}
                className="flex flex-col gap-2 rounded-lg border border-linha bg-cartao p-4 hover:border-tinta"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-display text-xl font-bold">{loja.nome}</span>
                  <span className="rounded bg-fita px-2 py-0.5 text-xs font-semibold text-fita-tinta">Patrocinado</span>
                </div>
                <p className="text-sm text-apagado">
                  {plural(doLoja.length, "produto avaliado", "produtos avaliados")}
                  {rl && `, ${formatarPorcentagem(rl.taxa)} de RL no QC`}
                </p>
                <p className="text-sm">Cupom de 8% para quem chega pelo Provado.</p>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-2xl font-bold">Reviews recentes</h2>
        <div className="grid gap-4 lg:grid-cols-3">
          {recentes.map((r) => {
            const produto = buscarProduto(r.produtoId)!;
            return (
              <div key={r.id} className="flex flex-col gap-2">
                <Link href={`/produto/${produto.id}`} className="text-sm font-semibold text-cobalto hover:underline">
                  {produto.titulo}
                </Link>
                <CartaoReview review={r} produto={produto} />
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
