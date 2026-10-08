import { Suspense } from "react";
import FormReview from "@/components/FormReview";
import { buscarProduto } from "@/lib/dados";

export const metadata = { title: "Publicar review" };

export default function NovaReview(props: PageProps<"/review/nova">) {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex max-w-2xl flex-col gap-2">
        <h1 className="text-4xl font-extrabold">Publicar review</h1>
        <p className="text-lg text-apagado">
          Conte como o produto chegou. Tamanho pedido e medidas ajudam quem tem o corpo parecido com o seu a acertar na
          compra.
        </p>
      </div>
      <Suspense fallback={<p className="text-apagado">Carregando formulário…</p>}>
        <Formulario searchParams={props.searchParams} />
      </Suspense>
    </div>
  );
}

async function Formulario({ searchParams }: { searchParams: PageProps<"/review/nova">["searchParams"] }) {
  const { produto, link, qc } = await searchParams;
  return (
    <FormReview
      produto={typeof produto === "string" ? buscarProduto(produto) : undefined}
      link={typeof link === "string" ? link : ""}
      qcId={typeof qc === "string" ? qc : undefined}
    />
  );
}
