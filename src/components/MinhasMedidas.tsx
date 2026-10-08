"use client";

// Suas medidas, usadas no "serve em mim" da busca e no filtro por corpo parecido.

import { useState, type FormEvent } from "react";
import { salvarMedidas, useDemo } from "@/lib/demo";
import { faixaAltura, faixaPeso } from "@/lib/calculos";

export default function MinhasMedidas({ compacto = false }: { compacto?: boolean }) {
  const demo = useDemo();
  const [editando, setEditando] = useState(false);
  const [altura, setAltura] = useState("");
  const [peso, setPeso] = useState("");

  function salvar(e: FormEvent) {
    e.preventDefault();
    const a = Number(altura);
    const p = Number(peso);
    if (a < 120 || a > 230 || p < 30 || p > 250) return;
    salvarMedidas({ altura: a, peso: p });
    setEditando(false);
  }

  if (demo.medidas && !editando) {
    return (
      <div className={`flex flex-wrap items-center gap-x-3 gap-y-1 ${compacto ? "text-sm" : ""}`}>
        <span>
          Suas medidas: <span className="font-semibold">{demo.medidas.altura} cm, {demo.medidas.peso} kg</span>
        </span>
        <span className="text-apagado">
          (aparecem como {faixaAltura(demo.medidas.altura)}, {faixaPeso(demo.medidas.peso)})
        </span>
        <button
          type="button"
          onClick={() => {
            setAltura(String(demo.medidas!.altura));
            setPeso(String(demo.medidas!.peso));
            setEditando(true);
          }}
          className="font-semibold text-cobalto hover:underline"
        >
          Alterar
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={salvar} className="flex flex-wrap items-end gap-3">
      <label className="flex flex-col gap-1 text-sm">
        <span className="text-apagado">Altura (cm)</span>
        <input id="medida-altura" inputMode="numeric" required value={altura} onChange={(e) => setAltura(e.target.value)} placeholder="178" className="w-24 rounded-md border border-linha bg-cartao px-2.5 py-1.5" />
      </label>
      <label className="flex flex-col gap-1 text-sm">
        <span className="text-apagado">Peso (kg)</span>
        <input id="medida-peso" inputMode="numeric" required value={peso} onChange={(e) => setPeso(e.target.value)} placeholder="80" className="w-24 rounded-md border border-linha bg-cartao px-2.5 py-1.5" />
      </label>
      <button type="submit" className="rounded-md bg-tinta px-3 py-2 text-sm font-semibold text-cartao">
        Salvar medidas
      </button>
    </form>
  );
}
