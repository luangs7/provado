import { Suspense } from "react";
import FormQc from "@/components/FormQc";
import { buscarProduto } from "@/lib/dados";

export const metadata = { title: "Mostrar peça antes do envio" };

export default function NovoQc(props: PageProps<"/qc/novo">) {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex max-w-2xl flex-col gap-2">
        <h1 className="text-4xl font-extrabold">Mostrar peça antes do envio</h1>
        <p className="text-lg text-apagado">
          Sua peça chegou no armazém do agente? Poste as fotos que ele tirou e a comunidade diz se está tudo certo para
          enviar ou se vale pedir a troca.
        </p>
      </div>
      <Suspense fallback={<p className="text-apagado">Carregando formulário…</p>}>
        <Formulario searchParams={props.searchParams} />
      </Suspense>
    </div>
  );
}

async function Formulario({ searchParams }: { searchParams: PageProps<"/qc/novo">["searchParams"] }) {
  const { produto, link } = await searchParams;
  return (
    <FormQc
      produto={typeof produto === "string" ? buscarProduto(produto) : undefined}
      link={typeof link === "string" ? link : ""}
    />
  );
}
