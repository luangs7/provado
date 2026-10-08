"use client";

import Link from "next/link";
import DetalheQc from "./DetalheQc";
import { buscarProduto } from "@/lib/dados";
import { useDemo } from "@/lib/demo";

export default function QcLocal({ id }: { id: string }) {
  const demo = useDemo();
  const qc = demo.qcs.find((q) => q.id === id);

  if (!qc) {
    return (
      <div className="flex max-w-xl flex-col gap-3">
        <h1 className="text-3xl font-bold">QC não encontrado</h1>
        <p className="text-apagado">
          Este QC não existe ou foi postado em outro navegador. Nesta demonstração, o que você publica fica salvo só no
          navegador em que foi feito.
        </p>
        <Link href="/qc" className="font-semibold text-cobalto hover:underline">
          Ir para o armazém
        </Link>
      </div>
    );
  }

  return <DetalheQc qc={qc} produto={qc.produtoId ? buscarProduto(qc.produtoId) : undefined} meu />;
}
