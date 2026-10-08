import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import BuscaLink from "@/components/BuscaLink";
import { produtoPorLink } from "@/lib/dados";
import { lerLink, NOMES_PLATAFORMA } from "@/lib/link";

export const metadata = { title: "Buscar por link" };

// A página em si é estática; só o resultado depende do link da URL,
// por isso ele fica dentro do <Suspense> (exigência do Cache Components).
export default function Buscar(props: PageProps<"/buscar">) {
  return (
    <Suspense fallback={<p className="text-apagado">Lendo o link…</p>}>
      <Resultado searchParams={props.searchParams} />
    </Suspense>
  );
}

async function Resultado({ searchParams }: { searchParams: PageProps<"/buscar">["searchParams"] }) {
  const { link } = await searchParams;
  const texto = typeof link === "string" ? link : "";
  const lido = lerLink(texto);

  if (lido) {
    const produto = produtoPorLink(lido.plataforma, lido.itemId);
    if (produto) redirect(`/produto/${produto.id}`);
  }

  if (!lido) {
    return (
      <div className="flex max-w-2xl flex-col gap-5">
        <h1 className="text-3xl font-bold">Não reconhecemos esse link</h1>
        <p className="text-apagado">
          Use o link da página do produto no Taobao, Tmall, Weidian ou 1688, ou o link do produto na CSSBuy. Links de
          busca, de loja ou encurtados ainda não funcionam.
        </p>
        <BuscaLink valor={texto} />
      </div>
    );
  }

  const paraLink = encodeURIComponent(texto);
  return (
    <div className="flex max-w-2xl flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold">Ainda não há reviews deste produto</h1>
        <p className="text-apagado">
          Reconhecemos o item <span className="font-semibold text-tinta">{lido.itemId}</span> do{" "}
          {NOMES_PLATAFORMA[lido.plataforma]}. Ninguém publicou nada sobre ele por aqui ainda.
        </p>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <Link
          href={`/review/nova?link=${paraLink}`}
          className="flex flex-col gap-1 rounded-lg border-2 border-tinta bg-cartao p-4 hover:bg-papel"
        >
          <span className="font-semibold">Publicar a primeira review</span>
          <span className="text-sm text-apagado">Já recebeu o produto? Conte como chegou e ganhe até 50 pontos.</span>
        </Link>
        <Link
          href={`/qc/novo?link=${paraLink}`}
          className="flex flex-col gap-1 rounded-lg border border-linha bg-cartao p-4 hover:border-tinta"
        >
          <span className="font-semibold">Postar fotos de QC</span>
          <span className="text-sm text-apagado">Está no armazém do agente? A comunidade avalia as fotos antes do envio.</span>
        </Link>
      </div>
      <BuscaLink />
    </div>
  );
}
