"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { recomecar, useDemo } from "@/lib/demo";

const LINKS = [
  { href: "/qc", rotulo: "Armazém" },
  { href: "/ranking", rotulo: "Ranking" },
  { href: "/planos", rotulo: "Planos" },
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

        <nav className="order-3 flex w-full gap-1 sm:order-none sm:w-auto" aria-label="Principal">
          {LINKS.map((l) => {
            const ativo = caminho.startsWith(l.href);
            return (
              <Link
                key={l.href}
                href={l.href}
                aria-current={ativo ? "page" : undefined}
                className={`rounded-md px-3 py-1.5 text-sm font-medium ${
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
            href="/qc/novo"
            className="hidden rounded-md border-2 border-tinta px-3 py-1.5 text-sm font-semibold hover:bg-papel sm:inline-block"
          >
            Postar QC
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
