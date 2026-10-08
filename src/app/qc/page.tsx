import Link from "next/link";
import { CartaoQc } from "@/components/Cartoes";
import QcsLocais from "@/components/QcsLocais";
import { buscarProduto, qcs } from "@/lib/dados";

export const metadata = { title: "Antes do envio" };

export default function Armazem() {
  const esperando = qcs.filter((q) => q.decisao === "aguardando");
  const decididos = qcs.filter((q) => q.decisao !== "aguardando").slice(0, 9);

  return (
    <div className="flex flex-col gap-12">
      <section className="flex flex-col gap-4">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="flex max-w-2xl flex-col gap-2">
            <h1 className="text-4xl font-extrabold">Antes do envio</h1>
            <p className="text-lg text-apagado">
              Quem compra por agente recebe fotos da peça no armazém antes de ela vir para o Brasil. Mostre as suas e a
              comunidade diz se está boa para enviar ou se é melhor trocar. Compras feitas direto com a loja não passam por
              esta etapa.
            </p>
          </div>
          <Link href="/qc/novo" className="rounded-md bg-cobalto px-4 py-2.5 font-semibold text-white hover:bg-cobalto-escuro">
            Mostrar minha peça
          </Link>
        </div>
      </section>

      <QcsLocais titulo="Suas peças" />

      <section className="flex flex-col gap-4">
        <h2 className="text-2xl font-bold">Esperando votos ({esperando.length})</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {esperando.map((qc) => (
            <CartaoQc key={qc.id} qc={qc} produto={qc.produtoId ? buscarProduto(qc.produtoId) : undefined} />
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-2xl font-bold">Decididos recentemente</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {decididos.map((qc) => (
            <CartaoQc key={qc.id} qc={qc} produto={qc.produtoId ? buscarProduto(qc.produtoId) : undefined} />
          ))}
        </div>
      </section>
    </div>
  );
}
