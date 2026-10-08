"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { recomecar, useDemo } from "@/lib/demo";

const LINKS = [
  { href: "/reviews", rotulo: "Reviews" },
  { href: "/produtos", rotulo: "Produtos" },
  { href: "/qc", rotulo: "Antes do envio" },
  { href: "/ajuda", rotulo: "Ajuda" },
];

export default function Cabecalho() {
  const caminho = usePathname();
  const demo = useDemo();

  return (
    <header className="border-b border-linha bg-cartao">
      <div className="bg-fita px-4 py-1.5 text-center text-xs text-fita-tinta sm:text-sm">
        Protótipo com dados de exemplo. O que você publicar fica salvo só neste navegador.{" "}
        <button type="button" onClick={recomecar} className="font-semibold underline underline-offset-2">
          Recomeçar demonstração
        </button>
      </div>

      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-6 gap-y-3 px-4 py-3">
        <Link href="/" className="font-display text-2xl font-extrabold tracking-tight">
          Provado
        </Link>

        <nav className="order-3 -mx-1 flex w-full gap-1 overflow-x-auto sm:order-none sm:mx-0 sm:w-auto" aria-label="Principal">
          {LINKS.map((l) => {
            const ativo = caminho.startsWith(l.href);
            return (
              <Link
                key={l.href}
                href={l.href}
                aria-current={ativo ? "page" : undefined}
                className={`shrink-0 rounded-md px-3 py-1.5 text-sm font-medium ${
                  ativo ? "bg-cobalto-claro text-cobalto-escuro" : "text-apagado hover:text-tinta"
                }`}
              >
                {l.rotulo}
              </Link>
            );
          })}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <Link
            href="/review/nova"
            className="rounded-md bg-cobalto px-3 py-2 text-sm font-semibold text-white hover:bg-cobalto-escuro"
          >
            <span className="sm:hidden">Publicar</span>
            <span className="hidden sm:inline">Publicar review</span>
          </Link>
          <Link
            href="/perfil"
            className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-papel"
            aria-label={`Seu perfil: ${demo.pontos} pontos, plano ${demo.plano}`}
          >
            <span className="tabular-nums font-semibold">{demo.pontos} pts</span>
            {demo.plano === "pago" && (
              <span className="rounded bg-tinta px-1.5 py-0.5 text-[11px] font-semibold text-cartao">Plus</span>
            )}
            <span className="grid size-8 place-items-center rounded-full bg-tinta font-display text-sm font-bold text-cartao">
              V
            </span>
          </Link>
        </div>
      </div>
    </header>
  );
}
