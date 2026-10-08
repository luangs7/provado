// Estado da demonstração: pontos, plano, votos e o que você publicar.
// Fica salvo só neste navegador (localStorage). Na versão real, tudo isso
// vem da API e do banco de dados.
//
// Funciona como um StateFlow: um valor atual + quem está ouvindo.
// Os componentes leem com o hook useDemo() e mudam o estado pelas funções exportadas.

import { useSyncExternalStore } from "react";
import { CUSTO_DESBLOQUEIO, PONTOS } from "./regras";
import type { DecisaoQc, MotivoRl, Pergunta, Qc, Review, Veredito } from "./tipos";

export { CUSTO_DESBLOQUEIO, LIMITE_GRATUITO, PONTOS } from "./regras";

export type Lancamento = { data: string; descricao: string; pontos: number };

export type EstadoDemo = {
  pontos: number;
  plano: "gratuito" | "pago";
  extrato: Lancamento[];
  votos: Record<string, { veredito: Veredito; motivos: MotivoRl[] }>;
  reviews: Review[];
  qcs: Qc[];
  perguntas: Pergunta[];
  respostas: Record<string, { texto: string; data: string }[]>; // por id de pergunta
  desbloqueados: string[]; // produtos liberados com pontos
  tutorialVisto: boolean;
};

const INICIAL: EstadoDemo = {
  pontos: 120,
  plano: "gratuito",
  extrato: [{ data: "2026-10-01T10:00:00-03:00", descricao: "Bônus de boas-vindas", pontos: 120 }],
  votos: {},
  reviews: [],
  qcs: [],
  perguntas: [],
  respostas: {},
  desbloqueados: [],
  tutorialVisto: false,
};

const CHAVE = "provado-demo-v1";
let estado: EstadoDemo | null = null;
const ouvintes = new Set<() => void>();

function ler(): EstadoDemo {
  if (estado) return estado;
  try {
    const salvo = localStorage.getItem(CHAVE);
    estado = salvo ? { ...INICIAL, ...JSON.parse(salvo) } : INICIAL;
  } catch {
    estado = INICIAL;
  }
  return estado!;
}

function gravar(novo: EstadoDemo) {
  estado = novo;
  try {
    localStorage.setItem(CHAVE, JSON.stringify(novo));
  } catch {
    // Sem espaço ou navegação privada: o estado continua só em memória
  }
  ouvintes.forEach((avisar) => avisar());
}

function inscrever(avisar: () => void) {
  ouvintes.add(avisar);
  return () => ouvintes.delete(avisar);
}

// No servidor (e no primeiro render) o estado é o inicial; depois o React troca pelo salvo.
export function useDemo() {
  return useSyncExternalStore(inscrever, ler, () => INICIAL);
}

// true só depois que a página carregou no navegador (evita piscar conteúdo
// que depende do que está salvo, como o tutorial já fechado)
const nada = () => () => {};
export function useNoNavegador() {
  return useSyncExternalStore(nada, () => true, () => false);
}

const agora = () => new Date().toISOString();
export const novoId = (prefixo: string) => `${prefixo}-${Date.now().toString(36)}`;

function ganhar(atual: EstadoDemo, pontos: number, descricao: string): Partial<EstadoDemo> {
  return {
    pontos: atual.pontos + pontos,
    extrato: [{ data: agora(), descricao, pontos }, ...atual.extrato],
  };
}

// ---------- Ações ----------

export function votar(qcId: string, veredito: Veredito, motivos: MotivoRl[]) {
  const atual = ler();
  if (atual.votos[qcId]) return 0;
  const pontos = motivos.length ? PONTOS.votoComMotivo : PONTOS.votoSimples;
  gravar({
    ...atual,
    ...ganhar(atual, pontos, `Voto ${veredito} em um QC`),
    votos: { ...atual.votos, [qcId]: { veredito, motivos } },
  });
  return pontos;
}

export function publicarReview(review: Review) {
  const atual = ler();
  const completa = review.fotos.length > 0 && review.altura !== undefined;
  const pontos = completa ? PONTOS.reviewCompleta : PONTOS.reviewSimples;
  gravar({
    ...atual,
    ...ganhar(atual, pontos, completa ? "Review completa publicada" : "Review publicada"),
    reviews: [review, ...atual.reviews],
  });
  return pontos;
}

export function publicarQc(qc: Qc) {
  const atual = ler();
  gravar({ ...atual, qcs: [qc, ...atual.qcs] });
}

export function mudarDecisao(qcId: string, decisao: DecisaoQc) {
  const atual = ler();
  gravar({ ...atual, qcs: atual.qcs.map((q) => (q.id === qcId ? { ...q, decisao } : q)) });
}

export function perguntar(pergunta: Pergunta) {
  const atual = ler();
  gravar({ ...atual, perguntas: [pergunta, ...atual.perguntas] });
}

export function responder(perguntaId: string, texto: string) {
  const atual = ler();
  const anteriores = atual.respostas[perguntaId] ?? [];
  gravar({
    ...atual,
    ...ganhar(atual, PONTOS.resposta, "Resposta a uma pergunta"),
    respostas: { ...atual.respostas, [perguntaId]: [...anteriores, { texto, data: agora() }] },
  });
}

export function desbloquear(produtoId: string) {
  const atual = ler();
  if (atual.pontos < CUSTO_DESBLOQUEIO || atual.desbloqueados.includes(produtoId)) return false;
  gravar({
    ...atual,
    ...ganhar(atual, -CUSTO_DESBLOQUEIO, "Reviews desbloqueadas em um produto"),
    desbloqueados: [...atual.desbloqueados, produtoId],
  });
  return true;
}

export function mudarPlano(plano: EstadoDemo["plano"]) {
  gravar({ ...ler(), plano });
}

export function fecharTutorial() {
  gravar({ ...ler(), tutorialVisto: true });
}

export function recomecar() {
  gravar(INICIAL);
}

// Quem pode ver tudo de um produto: plano pago ou produto desbloqueado com pontos
export const veTudo = (e: EstadoDemo, produtoId: string) =>
  e.plano === "pago" || e.desbloqueados.includes(produtoId);
