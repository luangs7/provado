"use client";

// Reviews que você publicou nesta demonstração, no topo do feed

import { CartaoReview } from "./Cartoes";
import { buscarProduto } from "@/lib/dados";
import { useDemo } from "@/lib/demo";

export default function MinhasReviews() {
  const demo = useDemo();
  const comProduto = demo.reviews.filter((r) => buscarProduto(r.produtoId));
  if (!comProduto.length) return null;

  return (
    <section className="flex flex-col gap-3">
      <h2 className="text-xl font-bold">Suas reviews</h2>
      <div className="grid gap-4 lg:grid-cols-2">
        {comProduto.map((r) => (
          <CartaoReview key={r.id} review={r} produto={buscarProduto(r.produtoId)!} comProduto minha resumida />
        ))}
      </div>
    </section>
  );
}
