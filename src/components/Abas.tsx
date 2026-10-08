"use client";

import { useState, type ReactNode } from "react";

type Aba = { id: string; rotulo: string; conteudo: ReactNode };

// Abas simples. O conteúdo de cada aba pode vir pronto do servidor.
export default function Abas({ abas }: { abas: Aba[] }) {
  const [ativa, setAtiva] = useState(abas[0].id);

  return (
    <div className="flex flex-col gap-5">
      <div role="tablist" className="flex gap-1 overflow-x-auto border-b border-linha">
        {abas.map((a) => (
          <button
            key={a.id}
            id={`aba-${a.id}`}
            role="tab"
            type="button"
            aria-selected={ativa === a.id}
            aria-controls={`painel-${a.id}`}
            onClick={() => setAtiva(a.id)}
            className={`-mb-px shrink-0 border-b-[3px] px-4 py-2.5 font-semibold ${
              ativa === a.id ? "border-cobalto text-tinta" : "border-transparent text-apagado hover:text-tinta"
            }`}
          >
            {a.rotulo}
          </button>
        ))}
      </div>
      {abas.map((a) => (
        <div key={a.id} id={`painel-${a.id}`} role="tabpanel" aria-labelledby={`aba-${a.id}`} hidden={ativa !== a.id}>
          {a.conteudo}
        </div>
      ))}
    </div>
  );
}
