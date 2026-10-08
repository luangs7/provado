// Peças comuns dos formulários

import type { ReactNode } from "react";

export const entrada = "w-full rounded-md border border-linha bg-cartao px-3 py-2";

export function Campo({ id, rotulo, children }: { id: string; rotulo: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="font-semibold">
        {rotulo}
      </label>
      {children}
    </div>
  );
}

// Nota de 1 a 5 como um grupo de botões de rádio
export function Nota({ nome, rotulo, valor, onChange }: { nome: string; rotulo: string; valor: number; onChange: (n: number) => void }) {
  return (
    <fieldset className="flex flex-wrap items-center justify-between gap-2">
      <legend className="float-left text-sm">{rotulo}</legend>
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((n) => (
          <label
            key={n}
            className={`grid size-9 cursor-pointer place-items-center rounded-md border font-semibold has-[:focus-visible]:outline has-[:focus-visible]:outline-cobalto ${
              n <= valor ? "border-cobalto bg-cobalto text-white" : "border-linha bg-cartao text-apagado"
            }`}
          >
            <input type="radio" name={nome} value={n} checked={valor === n} onChange={() => onChange(n)} className="sr-only" />
            {n}
          </label>
        ))}
      </div>
    </fieldset>
  );
}
