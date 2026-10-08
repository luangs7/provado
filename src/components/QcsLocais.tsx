"use client";

// QCs que você postou nesta demonstração (salvos no navegador)

import { CartaoQc } from "./Cartoes";
import { buscarProduto } from "@/lib/dados";
import { useDemo } from "@/lib/demo";

export default function QcsLocais({ produtoId, titulo }: { produtoId?: string; titulo?: string }) {
  const demo = useDemo();
  const lista = demo.qcs.filter((q) => !produtoId || q.produtoId === produtoId);
  if (!lista.length) return null;

  return (
    <div className="flex flex-col gap-3">
      {titulo && <h2 className="text-xl font-bold">{titulo}</h2>}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {lista.map((qc) => (
          <CartaoQc key={qc.id} qc={qc} produto={qc.produtoId ? buscarProduto(qc.produtoId) : undefined} />
        ))}
      </div>
    </div>
  );
}
