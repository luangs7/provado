import Link from "next/link";
import { notFound } from "next/navigation";
import ArteProduto from "@/components/ArteProduto";
import BotaoCurtir from "@/components/BotaoCurtir";
import { BarrasNotas, CartaoReview } from "@/components/Cartoes";
import Galeria from "@/components/Galeria";
import { Autor, SeloChip } from "@/components/Selos";
import { buscarLoja, buscarProduto, buscarReview, reviews, reviewsDo } from "@/lib/dados";
import { faixaAltura, faixaPeso, notaDaReview } from "@/lib/calculos";
import { comoComprou, formatarData, formatarNota } from "@/lib/formato";
import { estatisticasDe, ordenarPorDestaque, reviewsDoAutor, selosDoAutor } from "@/lib/pessoas";

export function generateStaticParams() {
  return reviews.map((r) => ({ id: r.id }));
}

export async function generateMetadata(props: PageProps<"/review/[id]">) {
  const { id } = await props.params;
  const review = buscarReview(id);
  const produto = review ? buscarProduto(review.produtoId) : undefined;
  return { title: produto && review ? `${produto.titulo}: review de ${review.autor}` : "Review" };
}

const NOMES_CAIMENTO = { pequeno: "Ficou pequeno", certo: "Ficou no tamanho certo", grande: "Ficou grande" };

export default async function PaginaReview(props: PageProps<"/review/[id]">) {
  const { id } = await props.params;
  const review = buscarReview(id);
  const produto = review ? buscarProduto(review.produtoId) : undefined;
  if (!review || !produto) notFound();

  const loja = buscarLoja(produto.lojaId)!;
  const selos = selosDoAutor(review.autor);
  const autor = estatisticasDe(review.autor);
  const outrasDoProduto = ordenarPorDestaque(reviewsDo(produto.id).filter((r) => r.id !== review.id)).slice(0, 2);
  const outrasDoAutor = reviewsDoAutor(review.autor).filter((r) => r.id !== review.id).slice(0, 2);

  return (
    <div className="flex flex-col gap-12">
      <Link href={`/produto/${produto.id}`} className="group flex items-center gap-3 self-start">
        <ArteProduto categoria={produto.categoria} cor={produto.cor} className="w-14 shrink-0" />
        <span>
          <span className="block font-semibold group-hover:underline">{produto.titulo}</span>
          <span className="text-sm text-apagado">
            {produto.marca}, {loja.nome}. Ver todas as reviews do produto
          </span>
        </span>
      </Link>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,26rem)_1fr]">
        <div className="self-start">
          {review.fotos.length ? (
            <Galeria fotos={review.fotos} categoria={produto.categoria} cor={produto.cor} formato="produto" titulo={`Fotos de ${review.autor}`} />
          ) : (
            <p className="rounded-lg border border-dashed border-linha p-6 text-apagado">Esta review não tem fotos.</p>
          )}
        </div>

        <article className="flex min-w-0 flex-col gap-6">
          <header className="flex flex-wrap items-start justify-between gap-4">
            <div className="flex flex-col gap-1">
              <span className="text-lg">
                <Autor nome={review.autor} selo={false} />
              </span>
              <span className="text-sm text-apagado">
                Review de {formatarData(review.data)}, {comoComprou(review.canal)}
              </span>
            </div>
            <div className="text-right">
              <span className="font-display text-5xl font-extrabold leading-none tabular-nums">{formatarNota(notaDaReview(review))}</span>
              <span className="block text-sm text-apagado">nota geral</span>
            </div>
          </header>

          <dl className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            <Dado rotulo="Tamanho pedido" valor={review.tamanho} />
            {produto.tamanhos.length > 1 && <Dado rotulo="Como ficou" valor={NOMES_CAIMENTO[review.caimento]} />}
            {review.altura !== undefined && review.peso !== undefined && (
              <Dado rotulo="Quem vestiu" valor={`${faixaAltura(review.altura)}, ${faixaPeso(review.peso)}`} />
            )}
          </dl>

          <p className="max-w-prose text-lg leading-relaxed">{review.texto}</p>

          <div className="rounded-lg border border-linha bg-cartao p-4">
            <BarrasNotas notas={review.notas} />
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <BotaoCurtir id={review.id} curtidas={review.curtidas} />
            <span className="text-sm text-apagado">Curtir é dizer que a review ajudou. As curtidas contam para os selos de quem escreveu.</span>
          </div>

          {review.qcId && (
            <Link href={`/qc/${review.qcId}`} className="font-semibold text-cobalto hover:underline">
              Ver as fotos desta peça antes do envio
            </Link>
          )}

          <aside className="flex flex-col gap-3 rounded-lg border border-linha bg-cartao p-4">
            <p className="text-sm text-apagado">Sobre quem escreveu</p>
            <p>
              <Autor nome={review.autor} selo={false} />{" "}
              <span className="text-apagado">
                tem {autor.reviews} reviews e recebeu {autor.curtidasRecebidas} curtidas.
              </span>
            </p>
            {selos.length > 0 && (
              <ul className="flex flex-wrap gap-2">
                {selos.map((s) => (
                  <li key={s.id}>
                    <SeloChip selo={s} />
                  </li>
                ))}
              </ul>
            )}
          </aside>
        </article>
      </div>

      {outrasDoProduto.length > 0 && (
        <section className="flex flex-col gap-4">
          <h2 className="text-2xl font-bold">Outras reviews deste produto</h2>
          <div className="grid gap-4 lg:grid-cols-2">
            {outrasDoProduto.map((r) => (
              <CartaoReview key={r.id} review={r} produto={produto} resumida />
            ))}
          </div>
        </section>
      )}

      {outrasDoAutor.length > 0 && (
        <section className="flex flex-col gap-4">
          <h2 className="text-2xl font-bold">Mais reviews de {review.autor}</h2>
          <div className="grid gap-4 lg:grid-cols-2">
            {outrasDoAutor.map((r) => (
              <CartaoReview key={r.id} review={r} produto={buscarProduto(r.produtoId)!} comProduto resumida />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function Dado({ rotulo, valor }: { rotulo: string; valor: string }) {
  return (
    <div className="flex flex-col gap-0.5 rounded-lg border border-linha bg-cartao p-3">
      <dt className="text-sm text-apagado">{rotulo}</dt>
      <dd className="font-semibold">{valor}</dd>
    </div>
  );
}
