"use client";

// Tutorial curto para quem chega pela primeira vez. Some depois de "Entendi".

import Link from "next/link";
import { PASSOS } from "@/lib/ajuda";
import { fecharTutorial, useDemo, useNoNavegador } from "@/lib/demo";

export default function BoasVindas() {
  const demo = useDemo();
  const noNavegador = useNoNavegador();
  if (!noNavegador || demo.tutorialVisto) return null;

  return (
    <section aria-labelledby="titulo-boas-vindas" className="flex flex-col gap-5 rounded-lg border-2 border-tinta bg-cartao p-5 sm:p-6">
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <h2 id="titulo-boas-vindas" className="text-2xl font-bold">
          Primeira vez por aqui?
        </h2>
        <div className="flex gap-2">
          <Link href="/ajuda" className="rounded-md border border-tinta px-3 py-1.5 text-sm font-semibold">
            Ver como funciona
          </Link>
          <button type="button" onClick={fecharTutorial} className="rounded-md bg-tinta px-3 py-1.5 text-sm font-semibold text-cartao">
            Entendi
          </button>
        </div>
      </div>
      <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {PASSOS.map((p, i) => (
          <li key={p.titulo} className="flex gap-3">
            <span className="font-display text-3xl font-extrabold leading-none text-cobalto">{i + 1}</span>
            <span className="flex flex-col gap-1">
              <span className="font-semibold leading-snug">{p.titulo}</span>
              <span className="text-sm text-apagado">{p.texto}</span>
            </span>
          </li>
        ))}
      </ol>
    </section>
  );
}
