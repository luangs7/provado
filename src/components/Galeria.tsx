"use client";

// Galeria de fotos com visualização em tela cheia e zoom.
// Clique na foto ampliada para dar zoom no ponto clicado; mova o mouse (ou o dedo) para percorrer a foto.

import { useRef, useState } from "react";
import ArteProduto from "./ArteProduto";
import { ehImagemEnviada } from "@/lib/imagens";
import type { Categoria } from "@/lib/tipos";

type Props = {
  fotos: string[];
  categoria: Categoria;
  cor: string;
  formato?: "linha" | "produto" | "grade";
  titulo?: string;
};

const NIVEIS_ZOOM = [1, 2, 3.5];

export default function Galeria({ fotos, categoria, cor, formato = "linha", titulo = "Fotos" }: Props) {
  const dialogo = useRef<HTMLDialogElement>(null);
  const [atual, setAtual] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [origem, setOrigem] = useState({ x: 50, y: 50 });

  if (!fotos.length) return null;

  const abrir = (i: number) => {
    setAtual(i);
    setZoom(1);
    dialogo.current?.showModal();
  };
  const irPara = (i: number) => {
    setAtual((i + fotos.length) % fotos.length);
    setZoom(1);
  };
  const posicao = (e: { clientX: number; clientY: number; currentTarget: HTMLElement }) => {
    const r = e.currentTarget.getBoundingClientRect();
    return { x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100 };
  };
  const nome = (f: string, i: number) => (ehImagemEnviada(f) ? `Foto ${i + 1}` : f);

  const miniatura = (f: string, i: number, classe = "") => (
    <button
      key={i}
      type="button"
      onClick={() => abrir(i)}
      aria-label={`Ampliar ${nome(f, i).toLowerCase()}`}
      className={`group relative block overflow-hidden rounded-md ${classe}`}
    >
      <ArteProduto categoria={categoria} cor={cor} foto={f} legenda={formato !== "linha"} />
      <span className="absolute right-1.5 top-1.5 grid size-7 place-items-center rounded-full bg-cartao/90 opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
        <Lupa />
      </span>
    </button>
  );

  return (
    <>
      {formato === "linha" && <div className="flex flex-wrap gap-1.5">{fotos.map((f, i) => miniatura(f, i, "w-16"))}</div>}

      {formato === "produto" && (
        <div className="flex flex-col gap-2">
          {miniatura(fotos[0], 0)}
          <div className="grid grid-cols-4 gap-2">{fotos.map((f, i) => miniatura(f, i))}</div>
        </div>
      )}

      {formato === "grade" && <div className="grid grid-cols-2 gap-2">{fotos.map((f, i) => miniatura(f, i))}</div>}

      <dialog
        ref={dialogo}
        aria-label={titulo}
        onClose={() => setZoom(1)}
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") irPara(atual + 1);
          if (e.key === "ArrowLeft") irPara(atual - 1);
        }}
        className="m-auto w-[min(94vw,46rem)] max-w-none rounded-lg bg-cartao p-0 text-tinta backdrop:bg-tinta/80"
      >
        <div className="flex items-center justify-between gap-3 border-b border-linha px-4 py-3">
          <p className="text-sm">
            <span className="font-semibold">{nome(fotos[atual], atual)}</span>
            <span className="text-apagado">
              {" "}
              ({atual + 1} de {fotos.length})
            </span>
          </p>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setZoom(NIVEIS_ZOOM[Math.max(0, NIVEIS_ZOOM.indexOf(zoom) - 1)])}
              disabled={zoom === 1}
              className="grid size-9 place-items-center rounded-md border border-linha text-lg font-bold disabled:opacity-40"
              aria-label="Diminuir zoom"
            >
              −
            </button>
            <button
              type="button"
              onClick={() => setZoom(NIVEIS_ZOOM[Math.min(NIVEIS_ZOOM.length - 1, NIVEIS_ZOOM.indexOf(zoom) + 1)])}
              disabled={zoom === NIVEIS_ZOOM[NIVEIS_ZOOM.length - 1]}
              className="grid size-9 place-items-center rounded-md border border-linha text-lg font-bold disabled:opacity-40"
              aria-label="Aumentar zoom"
            >
              +
            </button>
            <button
              type="button"
              onClick={() => dialogo.current?.close()}
              className="ml-2 rounded-md bg-tinta px-3 py-2 text-sm font-semibold text-cartao"
            >
              Fechar
            </button>
          </div>
        </div>

        <div
          className={`relative mx-auto aspect-square w-full max-w-[70vh] touch-none overflow-hidden ${zoom > 1 ? "cursor-zoom-out" : "cursor-zoom-in"}`}
          onClick={(e) => {
            setOrigem(posicao(e));
            setZoom(zoom > 1 ? 1 : 2.5);
          }}
          onPointerMove={(e) => zoom > 1 && setOrigem(posicao(e))}
        >
          <div
            className="h-full w-full transition-transform duration-150 motion-reduce:transition-none"
            style={{ transform: `scale(${zoom})`, transformOrigin: `${origem.x}% ${origem.y}%` }}
          >
            <ArteProduto categoria={categoria} cor={cor} foto={fotos[atual]} className="rounded-none!" />
          </div>
        </div>

        <div className="flex items-center gap-2 border-t border-linha p-3">
          <button type="button" onClick={() => irPara(atual - 1)} className="rounded-md border border-linha px-3 py-2 text-sm font-semibold" aria-label="Foto anterior">
            Anterior
          </button>
          <div className="flex min-w-0 flex-1 justify-center gap-1.5 overflow-x-auto">
            {fotos.map((f, i) => (
              <button
                key={i}
                type="button"
                onClick={() => irPara(i)}
                aria-label={`Ver ${nome(f, i).toLowerCase()}`}
                aria-current={i === atual}
                className={`w-12 shrink-0 overflow-hidden rounded border-2 ${i === atual ? "border-cobalto" : "border-transparent"}`}
              >
                <ArteProduto categoria={categoria} cor={cor} foto={f} className="rounded-none!" />
              </button>
            ))}
          </div>
          <button type="button" onClick={() => irPara(atual + 1)} className="rounded-md border border-linha px-3 py-2 text-sm font-semibold" aria-label="Próxima foto">
            Próxima
          </button>
        </div>
        <p className="px-4 pb-3 text-center text-xs text-apagado">Toque na foto para ampliar. Com zoom, mova para percorrer.</p>
      </dialog>
    </>
  );
}

function Lupa() {
  return (
    <svg viewBox="0 0 16 16" className="size-4 text-tinta" aria-hidden>
      <circle cx="7" cy="7" r="4.5" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <path d="M10.5 10.5 L14 14 M7 5 V9 M5 7 H9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}
