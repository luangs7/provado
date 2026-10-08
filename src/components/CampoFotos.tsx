"use client";

import Image from "next/image";
import { useState, type ChangeEvent } from "react";
import { reduzirImagem } from "@/lib/imagens";

// Seleção de fotos com prévia. Devolve as fotos já reduzidas (data URL).
export default function CampoFotos({ fotos, onChange, maximo = 6 }: { fotos: string[]; onChange: (f: string[]) => void; maximo?: number }) {
  const [carregando, setCarregando] = useState(false);

  async function escolher(e: ChangeEvent<HTMLInputElement>) {
    const arquivos = Array.from(e.target.files ?? []).slice(0, maximo - fotos.length);
    if (!arquivos.length) return;
    setCarregando(true);
    const novas = await Promise.all(arquivos.map((a) => reduzirImagem(a)));
    onChange([...fotos, ...novas]);
    setCarregando(false);
    e.target.value = "";
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap gap-2">
        {fotos.map((f, i) => (
          <div key={i} className="relative size-20 overflow-hidden rounded-md border border-linha">
            <Image src={f} alt={`Foto ${i + 1}`} fill unoptimized className="object-cover" />
            <button
              type="button"
              onClick={() => onChange(fotos.filter((_, j) => j !== i))}
              className="absolute right-1 top-1 rounded bg-tinta/80 px-1.5 text-xs text-cartao"
              aria-label={`Remover foto ${i + 1}`}
            >
              Remover
            </button>
          </div>
        ))}
        {fotos.length < maximo && (
          <label className="grid size-20 cursor-pointer place-items-center rounded-md border-2 border-dashed border-linha bg-cartao text-center text-xs text-apagado hover:border-tinta has-[:focus-visible]:outline has-[:focus-visible]:outline-cobalto">
            {carregando ? "Carregando…" : "Adicionar fotos"}
            <input type="file" accept="image/*" multiple onChange={escolher} className="sr-only" />
          </label>
        )}
      </div>
    </div>
  );
}
