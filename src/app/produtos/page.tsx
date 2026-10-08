import { Suspense } from "react";
import BuscaProdutos, { type ItemBusca } from "@/components/BuscaProdutos";
import { CATEGORIAS, MARCAS, reviews } from "@/lib/dados";
import { categoriasComProdutos, ranking } from "@/lib/resumos";

export const metadata = { title: "Produtos" };

export default function Produtos(props: PageProps<"/produtos">) {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex max-w-2xl flex-col gap-2">
        <h1 className="text-4xl font-extrabold">Produtos</h1>
        <p className="text-lg text-apagado">Busque pelo nome, marca ou loja e veja como cada produto chegou para quem comprou.</p>
      </div>
      <Suspense fallback={<p className="text-apagado">Carregando produtos…</p>}>
        <Resultado searchParams={props.searchParams} />
      </Suspense>
    </div>
  );
}

async function Resultado({ searchParams }: { searchParams: PageProps<"/produtos">["searchParams"] }) {
  const { q } = await searchParams;
  const itens: ItemBusca[] = ranking().map((i) => ({
    produto: i.produto,
    loja: i.loja.nome,
    nota: i.nota,
    pontuacao: i.pontuacao,
    totalReviews: i.totalReviews,
    rl: i.rl ? i.rl.taxa : null,
  }));

  return (
    <BuscaProdutos
      itens={itens}
      reviews={reviews}
      categorias={categoriasComProdutos().map((id) => ({ id, nome: CATEGORIAS[id] }))}
      marcas={MARCAS}
      textoInicial={typeof q === "string" ? q : ""}
    />
  );
}
