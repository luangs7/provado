// Junta dados e regras para as telas: o que a API devolveria já calculado.

import { CATEGORIAS, buscarLoja, produtos, qcsDo, reviews, reviewsDo } from "./dados";
import { notaGeral, notaRanking, taxaRl } from "./calculos";
import type { Categoria, Produto } from "./tipos";

export function resumoDoProduto(produto: Produto) {
  const lista = reviewsDo(produto.id);
  return {
    produto,
    loja: buscarLoja(produto.lojaId)!,
    nota: notaGeral(lista),
    totalReviews: lista.length,
    rl: taxaRl(qcsDo(produto.id)),
  };
}

export function mediaDaCategoria(categoria: Categoria) {
  const daCategoria = reviews.filter((r) => produtos.find((p) => p.id === r.produtoId)?.categoria === categoria);
  return notaGeral(daCategoria);
}

// Ranking com média bayesiana, opcionalmente filtrado por categoria
export function ranking(categoria?: Categoria) {
  const lista = categoria ? produtos.filter((p) => p.categoria === categoria) : produtos;
  return lista
    .map((p) => ({
      ...resumoDoProduto(p),
      pontuacao: notaRanking(reviewsDo(p.id), mediaDaCategoria(p.categoria)),
    }))
    .sort((a, b) => b.pontuacao - a.pontuacao);
}

export const categoriasComProdutos = () =>
  (Object.keys(CATEGORIAS) as Categoria[]).filter((c) => produtos.some((p) => p.categoria === c));
