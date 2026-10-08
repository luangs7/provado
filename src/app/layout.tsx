import type { Metadata } from "next";
import Link from "next/link";
import Cabecalho from "@/components/Cabecalho";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Provado",
    template: "%s | Provado",
  },
  description:
    "Reviews de produtos importados da China organizadas por produto: fotos de QC, tamanho por corpo parecido e notas da comunidade.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pt-BR" className="h-full antialiased">
      <body className="flex min-h-full flex-col">
        <Cabecalho />
        <main className="mx-auto w-full max-w-6xl flex-1 px-4 pb-20 pt-8">{children}</main>
        <footer className="border-t border-linha bg-cartao">
          <div className="mx-auto flex max-w-6xl flex-wrap gap-x-6 gap-y-2 px-4 py-6 text-sm text-apagado">
            <span>Provado (nome provisório)</span>
            <Link href="/ajuda" className="hover:text-tinta">
              Como funciona
            </Link>
            <Link href="/planos" className="hover:text-tinta">
              Planos
            </Link>
            <Link href="/ranking" className="hover:text-tinta">
              Ranking
            </Link>
            <span>Patrocínio nunca altera notas, reviews ou ranking.</span>
          </div>
        </footer>
      </body>
    </html>
  );
}
