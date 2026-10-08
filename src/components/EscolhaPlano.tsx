"use client";

import { mudarPlano, useDemo } from "@/lib/demo";

export default function EscolhaPlano() {
  const demo = useDemo();
  const plus = demo.plano === "pago";

  return (
    <div className="flex flex-col gap-3 rounded-lg border-2 border-tinta bg-cartao p-5 sm:flex-row sm:items-center sm:justify-between">
      <p role="status">
        {plus ? "Você está no plano Plus nesta demonstração." : "Você está no plano gratuito."}{" "}
        <span className="text-apagado">Nenhuma cobrança é feita no protótipo.</span>
      </p>
      <button
        type="button"
        onClick={() => mudarPlano(plus ? "gratuito" : "pago")}
        className={`shrink-0 rounded-md px-4 py-2.5 font-semibold ${plus ? "border border-tinta" : "bg-cobalto text-white hover:bg-cobalto-escuro"}`}
      >
        {plus ? "Voltar ao gratuito" : "Assinar o Plus"}
      </button>
    </div>
  );
}
