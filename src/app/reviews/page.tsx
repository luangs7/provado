import Link from "next/link";
import { Suspense, type ReactNode } from "react";
import { CartaoReview } from "@/components/Cartoes";
import MinhasReviews from "@/components/MinhasReviews";
import { CATEGORIAS, buscarProduto, reviews } from "@/lib/dados";
import { ordenarPorDestaque } from "@/lib/pessoas";
import { categoriasComProdutos } from "@/lib/resumos";
import type { Categoria } from "@/lib/tipos";

export const metadata = { title: "Reviews" };

const ORDENS = {
  destaque: "Em destaque",
  recentes: "Mais recentes",
  curtidas: "Mais curtidas",
};
const POR_PAGINA = 12;

export default function Reviews(props: PageProps<"/reviews">) {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="flex max-w-2xl flex-col gap-2">
          <h1 className="text-4xl font-extrabold">Reviews de quem recebeu</h1>
          <p className="text-lg text-apagado">
            Fotos reais, tamanho pedido e como ficou no corpo de quem comprou. Curta as reviews que te ajudaram: as
            curtidas dão selos para quem escreveu.
          </p>
        </div>
        <Link href="/review/nova" className="rounded-md bg-cobalto px-4 py-2.5 font-semibold text-white hover:bg-cobalto-escuro">
          Publicar review
        </Link>
      </div>
      <MinhasReviews />
      <Suspense fallback={<p className="text-apagado">Carregando reviews…</p>}>
        <Lista searchParams={props.searchParams} />
      </Suspense>
    </div>
  );
}

async function Lista({ searchParams }: { searchParams: PageProps<"/reviews">["searchParams"] }) {
  const params = await searchParams;
  const ordem = typeof params.ordem === "string" && params.ordem in ORDENS ? (params.ordem as keyof typeof ORDENS) : "destaque";
  const tipo = typeof params.tipo === "string" && params.tipo in CATEGORIAS ? (params.tipo as Categoria) : undefined;
  const quantos = Math.max(POR_PAGINA, Number(params.mostrar) || POR_PAGINA);

  const doTipo = reviews.filter((r) => !tipo || buscarProduto(r.produtoId)?.categoria === tipo);
  const ordenadas =
    ordem === "destaque"
      ? ordenarPorDestaque(doTipo)
      : [...doTipo].sort((a, b) => (ordem === "curtidas" ? b.curtidas - a.curtidas : b.data.localeCompare(a.data)));
  const visiveis = ordenadas.slice(0, quantos);

  const link = (mudancas: Record<string, string | undefined>) => {
    const novo = new URLSearchParams();
    const atual = { ordem, tipo, ...mudancas };
    if (atual.ordem && atual.ordem !== "destaque") novo.set("ordem", atual.ordem);
    if (atual.tipo) novo.set("tipo", atual.tipo);
    if (mudancas.mostrar) novo.set("mostrar", mudancas.mostrar);
    const q = novo.toString();
    return q ? `/reviews?${q}` : "/reviews";
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3">
        <nav className="flex flex-wrap gap-2" aria-label="Tipo de produto">
          <Filtro href={link({ tipo: undefined })} ativo={!tipo}>
            Todos
          </Filtro>
          {categoriasComProdutos().map((c) => (
            <Filtro key={c} href={link({ tipo: c })} ativo={tipo === c}>
              {CATEGORIAS[c]}
            </Filtro>
          ))}
        </nav>
        <nav className="flex flex-wrap items-center gap-2 text-sm" aria-label="Ordenar">
          <span className="text-apagado">Ordenar:</span>
          {(Object.keys(ORDENS) as (keyof typeof ORDENS)[]).map((o) => (
            <Link
              key={o}
              href={link({ ordem: o })}
              aria-current={ordem === o ? "page" : undefined}
              className={ordem === o ? "font-semibold underline underline-offset-4" : "text-apagado hover:text-tinta"}
            >
              {ORDENS[o]}
            </Link>
          ))}
        </nav>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {visiveis.map((r) => (
          <CartaoReview key={r.id} review={r} produto={buscarProduto(r.produtoId)!} comProduto resumida />
        ))}
      </div>

      {visiveis.length < ordenadas.length && (
        <Link
          href={link({ mostrar: String(quantos + POR_PAGINA) })}
          scroll={false}
          className="self-center rounded-md border-2 border-tinta px-5 py-2.5 font-semibold hover:bg-cartao"
        >
          Ver mais reviews ({ordenadas.length - visiveis.length})
        </Link>
      )}
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
