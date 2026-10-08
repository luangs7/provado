// Regras de negócio puras: notas, ranking, tamanho e taxa de RL.
// Sem dependência de tela, então dá para portar direto para Kotlin.

import type { Caimento, Criterios, Qc, Review, Veredito } from "./tipos";

export const NOMES_CRITERIOS: Record<keyof Criterios, string> = {
  material: "Qualidade do material",
  fidelidade: "Fiel às fotos",
  tamanho: "Tabela de tamanho",
  custoBeneficio: "Custo-benefício",
};

const media = (valores: number[]) =>
  valores.length ? valores.reduce((a, b) => a + b, 0) / valores.length : 0;

// Nota geral de uma review = média dos quatro critérios
export const notaDaReview = (r: Review) =>
  media([r.notas.material, r.notas.fidelidade, r.notas.tamanho, r.notas.custoBeneficio]);

export const notaGeral = (lista: Review[]) => media(lista.map(notaDaReview));

export function mediaPorCriterio(lista: Review[]): Criterios {
  return {
    material: media(lista.map((r) => r.notas.material)),
    fidelidade: media(lista.map((r) => r.notas.fidelidade)),
    tamanho: media(lista.map((r) => r.notas.tamanho)),
    custoBeneficio: media(lista.map((r) => r.notas.custoBeneficio)),
  };
}

// Média bayesiana: produtos com poucas reviews ficam perto da média da categoria
// até acumularem avaliações. C é o "peso" da média geral, em número de reviews.
export const PESO_MINIMO = 5;

export function notaRanking(lista: Review[], mediaCategoria: number, C = PESO_MINIMO) {
  const soma = lista.reduce((total, r) => total + notaDaReview(r), 0);
  return (C * mediaCategoria + soma) / (C + lista.length);
}

// ---------- Tamanho ----------

export function resumoCaimento(lista: Review[]) {
  const total = lista.length || 1;
  const conta = (c: Caimento) => lista.filter((r) => r.caimento === c).length;
  return {
    pequeno: conta("pequeno") / total,
    certo: conta("certo") / total,
    grande: conta("grande") / total,
  };
}

export function recomendacaoTamanho(lista: Review[]) {
  if (lista.length < 3) return "Ainda há poucas reviews para indicar o tamanho.";
  const r = resumoCaimento(lista);
  if (r.pequeno >= 0.4) return "Veste pequeno. A maioria recomenda pedir um tamanho acima.";
  if (r.grande >= 0.4) return "Veste grande. Quem prefere justo costuma pedir um abaixo.";
  return "Veste conforme a tabela da loja.";
}

// Faixas mostradas no lugar das medidas exatas
export function faixaAltura(cm: number) {
  const inicio = Math.floor(cm / 5) * 5;
  const m = (v: number) => (v / 100).toFixed(2).replace(".", ",");
  return `${m(inicio)}–${m(inicio + 5)} m`;
}

export function faixaPeso(kg: number) {
  const inicio = Math.floor(kg / 10) * 10;
  return `${inicio}–${inicio + 10} kg`;
}

// "Corpo parecido": até 6 cm e 10 kg de diferença
export const corpoParecido = (r: Review, altura: number, peso: number) =>
  r.altura !== undefined &&
  r.peso !== undefined &&
  Math.abs(r.altura - altura) <= 6 &&
  Math.abs(r.peso - peso) <= 10;

// "Serve em mim": entre as pessoas de corpo parecido, o tamanho que mais ficou certo
export function tamanhoQueServe(lista: Review[], altura: number, peso: number) {
  const parecidas = lista.filter((r) => corpoParecido(r, altura, peso));
  const certas = parecidas.filter((r) => r.caimento === "certo");
  if (!certas.length) return null;
  const contagem = new Map<string, number>();
  for (const r of certas) contagem.set(r.tamanho, (contagem.get(r.tamanho) ?? 0) + 1);
  const [tamanho, quantos] = [...contagem.entries()].sort((a, b) => b[1] - a[1])[0];
  return { tamanho, quantos, parecidas: parecidas.length };
}

// ---------- QC ----------

// Veredito da comunidade. Antes de 3 votos ainda não há veredito.
export function vereditoDoQc(qc: Qc): Veredito | null {
  const { gl, rl } = qc.votos;
  if (gl + rl < 3) return null;
  return rl > gl ? "RL" : "GL";
}

// Taxa de RL: entre os QCs já decididos, quantos a comunidade reprovou
export function taxaRl(lista: Qc[]) {
  const decididos = lista.filter((q) => q.decisao !== "aguardando" && vereditoDoQc(q));
  if (!decididos.length) return null;
  const reprovados = decididos.filter((q) => vereditoDoQc(q) === "RL").length;
  return { taxa: reprovados / decididos.length, total: decididos.length };
}

export function motivoPrincipal(qc: Qc) {
  const ordenados = Object.entries(qc.votos.motivos).sort((a, b) => (b[1] ?? 0) - (a[1] ?? 0));
  return ordenados.map(([motivo, n]) => ({ motivo, n: n ?? 0 }));
}
