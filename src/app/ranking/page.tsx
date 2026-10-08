import Link from "next/link";
import { Suspense, type ReactNode } from "react";
import ArteProduto from "@/components/ArteProduto";
import { CATEGORIAS } from "@/lib/dados";
import { PESO_MINIMO } from "@/lib/calculos";
import { formatarNota, formatarPorcentagem, plural } from "@/lib/formato";
import { categoriasComProdutos, ranking } from "@/lib/resumos";
import type { Categoria } from "@/lib/tipos";

export const metadata = { title: "Ranking" };

export default function Ranking(props: PageProps<"/ranking">) {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex max-w-2xl flex-col gap-2">
        <h1 className="text-4xl font-extrabold">Mais bem avaliados</h1>
        <p className="text-lg text-apagado">
          A posição considera a nota e a quantidade de reviews. Um produto com uma única nota 5 não passa na frente de
          outro com dezenas de reviews boas.
        </p>
      </div>
      <Suspense fallback={<p className="text-apagado">Carregando ranking…</p>}>
        <Lista searchParams={props.searchParams} />
      </Suspense>
      <p className="max-w-2xl text-sm text-apagado">
        Como calculamos: nota = (C × média da categoria + soma das notas) ÷ (C + número de reviews), com C = {PESO_MINIMO}.
        Lojas parceiras não pagam por posição.
      </p>
    </div>
  );
}

async function Lista({ searchParams }: { searchParams: PageProps<"/ranking">["searchParams"] }) {
  const { categoria } = await searchParams;
  const escolhida = typeof categoria === "string" && categoria in CATEGORIAS ? (categoria as Categoria) : undefined;
  const itens = ranking(escolhida);

  return (
    <div className="flex flex-col gap-5">
      <nav className="flex flex-wrap gap-2" aria-label="Categorias">
        <Filtro href="/ranking" ativo={!escolhida}>
          Todas
        </Filtro>
        {categoriasComProdutos().map((c) => (
          <Filtro key={c} href={`/ranking?categoria=${c}`} ativo={escolhida === c}>
            {CATEGORIAS[c]}
          </Filtro>
        ))}
      </nav>

      <ol className="flex flex-col divide-y divide-linha overflow-hidden rounded-lg border border-linha bg-cartao">
        {itens.map((item, i) => (
          <li key={item.produto.id}>
            <Link href={`/produto/${item.produto.id}`} className="grid grid-cols-[2rem_3.5rem_1fr_auto] items-center gap-4 px-4 py-3 hover:bg-papel">
              <span className="font-display text-2xl font-bold text-apagado tabular-nums">{i + 1}</span>
              <ArteProduto categoria={item.produto.categoria} cor={item.produto.cor} />
              <span className="min-w-0">
                <span className="block font-semibold">{item.produto.titulo}</span>
                <span className="text-sm text-apagado">
                  {item.loja.nome}, {plural(item.totalReviews, "review", "reviews")}, média simples {formatarNota(item.nota)}
                  {item.rl && `, ${formatarPorcentagem(item.rl.taxa)} reprovados no QC`}
                </span>
              </span>
              <span className="font-display text-2xl font-extrabold tabular-nums">{formatarNota(item.pontuacao)}</span>
            </Link>
          </li>
        ))}
      </ol>
    </div>
  );
}

function Filtro({ href, ativo, children }: { href: string; ativo: boolean; children: ReactNode }) {
  return (
    <Link
      href={href}
      aria-current={ativo ? "page" : undefined}
      className={`rounded-full border px-3 py-1 text-sm ${ativo ? "border-tinta bg-tinta text-cartao" : "border-linha bg-cartao hover:border-tinta"}`}
    >
      {children}
    </Link>
  );
}
