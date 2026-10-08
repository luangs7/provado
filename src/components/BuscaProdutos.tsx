"use client";

// Busca de produtos. O texto é livre para todos; os filtros (tipo, marca,
// tamanho, "serve em mim" e nota) fazem parte do plano Plus.

import Link from "next/link";
import { useState, type ReactNode } from "react";
import ArteProduto from "./ArteProduto";
import MinhasMedidas from "./MinhasMedidas";
import { tamanhoQueServe } from "@/lib/calculos";
import { mudarPlano, useDemo } from "@/lib/demo";
import { formatarNota, formatarPorcentagem, formatarPreco, plural } from "@/lib/formato";
import type { Categoria, Produto, Review } from "@/lib/tipos";

export type ItemBusca = {
  produto: Produto;
  loja: string;
  nota: number;
  pontuacao: number; // nota do ranking (média bayesiana)
  totalReviews: number;
  rl: number | null;
};

type Props = {
  itens: ItemBusca[];
  reviews: Review[];
  categorias: { id: Categoria; nome: string }[];
  marcas: string[];
  textoInicial: string;
};

const ORDENS = { ranking: "Mais bem avaliados", reviews: "Mais reviews", preco: "Menor preço" };

const semAcento = (t: string) => t.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

export default function BuscaProdutos({ itens, reviews, categorias, marcas, textoInicial }: Props) {
  const demo = useDemo();
  const plus = demo.plano === "pago";
  const [texto, setTexto] = useState(textoInicial);
  const [tipo, setTipo] = useState("");
  const [marca, setMarca] = useState("");
  const [tamanho, setTamanho] = useState("");
  const [serveEmMim, setServeEmMim] = useState(false);
  const [notaMinima, setNotaMinima] = useState(0);
  const [ordem, setOrdem] = useState<keyof typeof ORDENS>("ranking");
  const [filtrosAbertos, setFiltrosAbertos] = useState(false); // só no celular

  const tamanhos = [...new Set(itens.flatMap((i) => i.produto.tamanhos))].filter((t) => t !== "Único");
  const medidas = plus ? demo.medidas : null;
  const servem = new Map(
    medidas
      ? itens
          .filter((i) => i.produto.tamanhos.length > 1) // tamanho único serve em todo mundo
          .map((i) => [i.produto.id, tamanhoQueServe(reviews.filter((r) => r.produtoId === i.produto.id), medidas.altura, medidas.peso)])
      : [],
  );

  const termos = semAcento(texto).split(/\s+/).filter(Boolean);
  const resultado = itens
    .filter((i) => {
      const alvo = semAcento(`${i.produto.titulo} ${i.produto.marca} ${i.loja} ${categorias.find((c) => c.id === i.produto.categoria)?.nome}`);
      return termos.every((t) => alvo.includes(t));
    })
    .filter((i) => !plus || !tipo || i.produto.categoria === tipo)
    .filter((i) => !plus || !marca || i.produto.marca === marca)
    .filter((i) => !plus || !tamanho || i.produto.tamanhos.includes(tamanho))
    .filter((i) => !plus || !notaMinima || i.nota >= notaMinima)
    .filter((i) => !plus || !serveEmMim || !medidas || i.produto.tamanhos.length === 1 || servem.get(i.produto.id))
    .sort((a, b) =>
      ordem === "reviews" ? b.totalReviews - a.totalReviews : ordem === "preco" ? a.produto.precoYuan - b.produto.precoYuan : b.pontuacao - a.pontuacao,
    );

  const limpar = () => {
    setTipo("");
    setMarca("");
    setTamanho("");
    setServeEmMim(false);
    setNotaMinima(0);
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[17rem_1fr]">
      <aside className="flex flex-col gap-5 self-start rounded-lg border border-linha bg-cartao p-4 lg:sticky lg:top-4">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="busca-texto" className="font-semibold">
            Buscar
          </label>
          <input
            id="busca-texto"
            type="search"
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
            placeholder="Nome, marca ou loja"
            className="rounded-md border-2 border-tinta px-3 py-2"
          />
        </div>

        <button
          type="button"
          onClick={() => setFiltrosAbertos(!filtrosAbertos)}
          aria-expanded={filtrosAbertos}
          aria-controls="painel-filtros"
          className="flex items-center justify-between rounded-md border border-linha px-3 py-2 font-semibold lg:hidden"
        >
          {filtrosAbertos ? "Esconder filtros" : "Mostrar filtros"}
          {!plus && <span className="rounded bg-tinta px-1.5 py-0.5 text-[11px] font-semibold text-cartao">Plus</span>}
        </button>

        <div id="painel-filtros" className={`flex-col gap-4 ${filtrosAbertos ? "flex" : "hidden"} lg:flex`}>
          <div className="flex items-center justify-between">
            <span className="font-semibold">Filtros</span>
            {plus ? (
              <button type="button" onClick={limpar} className="text-sm font-semibold text-cobalto hover:underline">
                Limpar
              </button>
            ) : (
              <span className="rounded bg-tinta px-1.5 py-0.5 text-[11px] font-semibold text-cartao">Plus</span>
            )}
          </div>

          <fieldset disabled={!plus} className={`flex flex-col gap-4 ${plus ? "" : "opacity-50"}`}>
            <legend className="sr-only">Filtros do plano Plus</legend>

            <div className="flex flex-col gap-2 rounded-md bg-papel p-3">
              <label className="flex items-center gap-2 font-semibold">
                <input type="checkbox" checked={serveEmMim} onChange={(e) => setServeEmMim(e.target.checked)} className="size-4 accent-cobalto" />
                Serve em mim
              </label>
              <p className="text-sm text-apagado">Só produtos com reviews de quem tem o corpo parecido com o seu e achou o tamanho certo.</p>
              {plus && serveEmMim && <MinhasMedidas compacto />}
            </div>

            <Campo rotulo="Tipo">
              <select id="filtro-tipo" value={tipo} onChange={(e) => setTipo(e.target.value)} className={entrada}>
                <option value="">Todos</option>
                {categorias.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.nome}
                  </option>
                ))}
              </select>
            </Campo>
            <Campo rotulo="Marca">
              <select id="filtro-marca" value={marca} onChange={(e) => setMarca(e.target.value)} className={entrada}>
                <option value="">Todas</option>
                {marcas.map((m) => (
                  <option key={m}>{m}</option>
                ))}
              </select>
            </Campo>
            <Campo rotulo="Tamanho disponível">
              <select id="filtro-tamanho-produto" value={tamanho} onChange={(e) => setTamanho(e.target.value)} className={entrada}>
                <option value="">Todos</option>
                {tamanhos.map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
            </Campo>
            <Campo rotulo="Nota mínima">
              <select id="filtro-nota" value={notaMinima} onChange={(e) => setNotaMinima(Number(e.target.value))} className={entrada}>
                <option value={0}>Qualquer nota</option>
                <option value={4.5}>4,5 ou mais</option>
                <option value={4}>4,0 ou mais</option>
                <option value={3.5}>3,5 ou mais</option>
              </select>
            </Campo>
          </fieldset>

          {!plus && (
            <div className="flex flex-col gap-2 border-t border-linha pt-4">
              <p className="text-sm">Filtrar por tipo, marca, tamanho e pelo que serve em você faz parte do plano Plus.</p>
              <button type="button" onClick={() => mudarPlano("pago")} className="rounded-md bg-cobalto px-3 py-2 text-sm font-semibold text-white">
                Testar o Plus
              </button>
              <Link href="/planos" className="text-center text-sm font-semibold text-cobalto hover:underline">
                Ver planos
              </Link>
            </div>
          )}
        </div>
      </aside>

      <div className="flex min-w-0 flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-apagado" role="status">
            {plural(resultado.length, "produto encontrado", "produtos encontrados")}
          </p>
          <label className="flex items-center gap-2 text-sm">
            Ordenar por
            <select id="ordem-produtos" value={ordem} onChange={(e) => setOrdem(e.target.value as keyof typeof ORDENS)} className="rounded-md border border-linha bg-cartao px-2 py-1">
              {(Object.keys(ORDENS) as (keyof typeof ORDENS)[]).map((o) => (
                <option key={o} value={o}>
                  {ORDENS[o]}
                </option>
              ))}
            </select>
          </label>
        </div>

        {resultado.length === 0 ? (
          <div className="flex flex-col items-start gap-3 rounded-lg border border-dashed border-linha p-6">
            <p className="text-apagado">Nenhum produto com esses critérios. Tente outro nome ou limpe os filtros.</p>
            <Link href={`/review/nova`} className="font-semibold text-cobalto hover:underline">
              Comprou algo que não está aqui? Publique a primeira review
            </Link>
          </div>
        ) : (
          <ul className="flex flex-col gap-3">
            {resultado.map((i) => {
              const serve = servem.get(i.produto.id);
              const preco = formatarPreco(i.produto.precoYuan);
              return (
                <li key={i.produto.id}>
                  <Link href={`/produto/${i.produto.id}`} className="group flex gap-4 rounded-lg border border-linha bg-cartao p-3 hover:border-tinta">
                    <ArteProduto categoria={i.produto.categoria} cor={i.produto.cor} className="w-24 shrink-0" />
                    <div className="flex min-w-0 flex-1 flex-col gap-1">
                      <span className="text-sm font-semibold text-apagado">{i.produto.marca}</span>
                      <span className="font-semibold leading-snug group-hover:underline">{i.produto.titulo}</span>
                      <span className="text-sm text-apagado">
                        {i.loja}, {preco.yuan} ({preco.reais})
                      </span>
                      <span className="mt-auto flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
                        <span className="text-apagado">{plural(i.totalReviews, "review", "reviews")}</span>
                        {i.rl !== null && <span className="text-apagado">{formatarPorcentagem(i.rl)} reprovadas antes do envio</span>}
                        {serve && (
                          <span className="rounded bg-cobalto-claro px-2 py-0.5 font-semibold text-cobalto-escuro">
                            Serve em você: {serve.tamanho}
                          </span>
                        )}
                      </span>
                    </div>
                    <span className="font-display text-2xl font-extrabold tabular-nums">{formatarNota(i.pontuacao)}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
        <p className="text-sm text-apagado">
          &ldquo;Mais bem avaliados&rdquo; considera a nota e a quantidade de reviews: um produto com uma única nota 5 não passa na
          frente de outro com dezenas de reviews boas. Lojas parceiras não pagam por posição.
        </p>
      </div>
    </div>
  );
}

const entrada = "w-full rounded-md border border-linha bg-cartao px-2.5 py-1.5 text-sm";

function Campo({ rotulo, children }: { rotulo: string; children: ReactNode }) {
  return (
    <label className="flex flex-col gap-1 text-sm">
      <span className="font-semibold">{rotulo}</span>
      {children}
    </label>
  );
}
