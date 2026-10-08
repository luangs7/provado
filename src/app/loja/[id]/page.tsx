import { notFound } from "next/navigation";
import { CartaoProduto } from "@/components/Cartoes";
import { buscarLoja, lojas, produtosDaLoja, qcsDo, reviewsDo } from "@/lib/dados";
import { notaGeral, taxaRl } from "@/lib/calculos";
import { formatarNota, formatarPorcentagem, plural } from "@/lib/formato";
import { NOMES_PLATAFORMA } from "@/lib/link";
import { resumoDoProduto } from "@/lib/resumos";

export function generateStaticParams() {
  return lojas.map((l) => ({ id: l.id }));
}

export async function generateMetadata(props: PageProps<"/loja/[id]">) {
  const { id } = await props.params;
  return { title: buscarLoja(id)?.nome ?? "Loja" };
}

export default async function PaginaLoja(props: PageProps<"/loja/[id]">) {
  const { id } = await props.params;
  const loja = buscarLoja(id);
  if (!loja) notFound();

  const produtos = produtosDaLoja(loja.id);
  const reviews = produtos.flatMap((p) => reviewsDo(p.id));
  const rl = taxaRl(produtos.flatMap((p) => qcsDo(p.id)));

  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-col gap-2">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-4xl font-extrabold">{loja.nome}</h1>
          {loja.parceira && (
            <span className="rounded bg-fita px-2 py-0.5 text-sm font-semibold text-fita-tinta">Loja parceira</span>
          )}
        </div>
        <p className="text-apagado">
          Loja no {NOMES_PLATAFORMA[loja.plataforma]} desde {loja.desde}.
          {loja.parceira && " A parceria não altera notas, reviews, taxa de reprovação nem a posição no ranking."}
        </p>
      </div>

      <dl className="grid gap-4 sm:grid-cols-3">
        <Numero rotulo="Nota média das reviews" valor={formatarNota(notaGeral(reviews))} detalhe={plural(reviews.length, "review", "reviews")} />
        <Numero
          rotulo="Peças reprovadas antes do envio"
          valor={rl ? formatarPorcentagem(rl.taxa) : "Sem dados"}
          detalhe={rl ? `em ${plural(rl.total, "peça conferida", "peças conferidas")}` : "Nenhuma peça conferida ainda"}
        />
        <Numero rotulo="Produtos avaliados" valor={String(produtos.length)} detalhe="com página no Provado" />
      </dl>

      <section className="flex flex-col gap-4">
        <h2 className="text-2xl font-bold">Produtos</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {produtos.map((p) => (
            <CartaoProduto key={p.id} resumo={resumoDoProduto(p)} />
          ))}
        </div>
      </section>
    </div>
  );
}

function Numero({ rotulo, valor, detalhe }: { rotulo: string; valor: string; detalhe: string }) {
  return (
    <div className="flex flex-col gap-1 rounded-lg border border-linha bg-cartao p-4">
      <dt className="text-sm text-apagado">{rotulo}</dt>
      <dd className="font-display text-4xl font-extrabold tabular-nums">{valor}</dd>
      <dd className="text-sm text-apagado">{detalhe}</dd>
    </div>
  );
}
