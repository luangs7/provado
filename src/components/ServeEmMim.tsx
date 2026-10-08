"use client";

// Mostra o tamanho que serviu em quem tem o corpo parecido com o seu (recurso do Plus)

import Link from "next/link";
import MinhasMedidas from "./MinhasMedidas";
import { tamanhoQueServe } from "@/lib/calculos";
import { mudarPlano, useDemo } from "@/lib/demo";
import type { Review } from "@/lib/tipos";

export default function ServeEmMim({ reviews }: { reviews: Review[] }) {
  const demo = useDemo();

  if (demo.plano !== "pago") {
    return (
      <div className="flex flex-col gap-2 rounded-lg border border-dashed border-tinta p-4 sm:flex-row sm:items-center sm:justify-between">
        <p>
          <span className="font-semibold">Qual tamanho serve em você?</span>{" "}
          <span className="text-apagado">O Plus mostra o tamanho que vestiu bem em quem tem o seu corpo.</span>
        </p>
        <div className="flex shrink-0 gap-2">
          <Link href="/planos" className="rounded-md border border-tinta px-3 py-1.5 text-sm font-semibold">
            Ver planos
          </Link>
          <button type="button" onClick={() => mudarPlano("pago")} className="rounded-md bg-cobalto px-3 py-1.5 text-sm font-semibold text-white">
            Testar o Plus
          </button>
        </div>
      </div>
    );
  }

  if (!demo.medidas) {
    return (
      <div className="flex flex-col gap-3 rounded-lg border border-cobalto bg-cobalto-claro p-4">
        <p className="font-semibold">Informe suas medidas para ver o tamanho que serve em você</p>
        <MinhasMedidas />
      </div>
    );
  }

  const resultado = tamanhoQueServe(reviews, demo.medidas.altura, demo.medidas.peso);
  return (
    <div className="flex flex-col gap-2 rounded-lg border border-cobalto bg-cobalto-claro p-4">
      {resultado ? (
        <p>
          <span className="text-apagado">Serve em você:</span>{" "}
          <span className="font-display text-2xl font-extrabold">tamanho {resultado.tamanho}</span>
          <span className="block text-sm text-apagado">
            {resultado.quantos} de {resultado.parecidas} pessoas com corpo parecido com o seu acharam esse tamanho certo.
          </span>
        </p>
      ) : (
        <p className="text-apagado">Ainda não há reviews de pessoas com corpo parecido com o seu neste produto.</p>
      )}
      <MinhasMedidas compacto />
    </div>
  );
}
