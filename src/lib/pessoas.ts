// Estatísticas e selos de cada pessoa, a partir do histórico e das contribuições de exemplo

import { buscarUsuario, opinioes, perguntas, qcs, reviews } from "./dados";
import { nivelDeDestaque, selosDe, type Estatisticas } from "./selos";

const VAZIO = { reviews: 0, completas: 0, respostas: 0, opinioes: 0, compras: 0 };
const cache = new Map<string, Estatisticas>();

export function estatisticasDe(nome: string): Estatisticas {
  const salvo = cache.get(nome);
  if (salvo) return salvo;

  const base = buscarUsuario(nome)?.historico ?? VAZIO;
  const suasReviews = reviews.filter((r) => r.autor === nome);
  const suasOpinioes = opinioes.filter((o) => o.autor === nome);
  const curtidas = [...suasReviews.map((r) => r.curtidas), ...suasOpinioes.map((o) => o.curtidas)];
  const respostas = perguntas.flatMap((p) => p.respostas).filter((r) => r.autor === nome).length;

  const e: Estatisticas = {
    reviews: base.reviews + suasReviews.length,
    completas: base.completas + suasReviews.filter((r) => r.fotos.length > 0 && r.altura !== undefined).length,
    respostas: base.respostas + respostas,
    opinioes: base.opinioes + suasOpinioes.length,
    compras: base.compras + suasReviews.length + qcs.filter((q) => q.autor === nome).length,
    curtidasRecebidas: curtidas.reduce((a, b) => a + b, 0),
    maiorCurtida: Math.max(0, ...curtidas),
  };
  cache.set(nome, e);
  return e;
}

export const selosDoAutor = (nome: string) => selosDe(estatisticasDe(nome));
export const destaqueDoAutor = (nome: string) => nivelDeDestaque(selosDoAutor(nome));

export const reviewsDoAutor = (nome: string) =>
  reviews.filter((r) => r.autor === nome).sort((a, b) => b.data.localeCompare(a.data));
export const opinioesDoAutor = (nome: string) => opinioes.filter((o) => o.autor === nome);

// Ordem "Em destaque": primeiro quem tem selo de avaliador (ouro, prata, bronze), depois as mais curtidas
export function ordenarPorDestaque<T extends { autor: string; curtidas: number }>(lista: T[]) {
  return [...lista].sort((a, b) => destaqueDoAutor(b.autor) - destaqueDoAutor(a.autor) || b.curtidas - a.curtidas);
}
