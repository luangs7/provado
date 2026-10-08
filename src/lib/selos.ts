// Selos: reconhecem quem contribui. Os de avaliador vêm das curtidas
// e fazem as próximas contribuições da pessoa aparecerem com destaque.

import type { Historico } from "./tipos";

export type Estatisticas = Historico & {
  curtidasRecebidas: number;
  maiorCurtida: number; // curtidas da contribuição mais curtida
};

export type NivelSelo = "ouro" | "prata" | "bronze" | "comum";

export type Selo = { id: string; nome: string; descricao: string; nivel: NivelSelo };

type Regra = Selo & { ganhou: (e: Estatisticas) => boolean; progresso: (e: Estatisticas) => string };

// A ordem importa: o primeiro selo que a pessoa tem é o que aparece ao lado do nome
export const REGRAS_SELOS: Regra[] = [
  {
    id: "avaliador-ouro",
    nome: "Avaliador de ouro",
    nivel: "ouro",
    descricao: "Uma review ou opinião com 100 curtidas ou mais.",
    ganhou: (e) => e.maiorCurtida >= 100,
    progresso: (e) => `${Math.min(e.maiorCurtida, 100)} de 100 curtidas`,
  },
  {
    id: "avaliador-prata",
    nome: "Avaliador de prata",
    nivel: "prata",
    descricao: "Uma review ou opinião com 50 curtidas ou mais.",
    ganhou: (e) => e.maiorCurtida >= 50,
    progresso: (e) => `${Math.min(e.maiorCurtida, 50)} de 50 curtidas`,
  },
  {
    id: "avaliador-bronze",
    nome: "Avaliador de bronze",
    nivel: "bronze",
    descricao: "Uma review ou opinião com 20 curtidas ou mais.",
    ganhou: (e) => e.maiorCurtida >= 20,
    progresso: (e) => `${Math.min(e.maiorCurtida, 20)} de 20 curtidas`,
  },
  {
    id: "resenhista",
    nome: "Resenhista",
    nivel: "comum",
    descricao: "20 reviews de produtos recebidos.",
    ganhou: (e) => e.reviews >= 20,
    progresso: (e) => `${Math.min(e.reviews, 20)} de 20 reviews`,
  },
  {
    id: "detalhista",
    nome: "Detalhista",
    nivel: "comum",
    descricao: "10 reviews completas, com fotos, tamanho e medidas.",
    ganhou: (e) => e.completas >= 10,
    progresso: (e) => `${Math.min(e.completas, 10)} de 10 reviews completas`,
  },
  {
    id: "comprador-frequente",
    nome: "Comprador frequente",
    nivel: "comum",
    descricao: "25 compras registradas no site.",
    ganhou: (e) => e.compras >= 25,
    progresso: (e) => `${Math.min(e.compras, 25)} de 25 compras`,
  },
  {
    id: "olho-clinico",
    nome: "Olho clínico",
    nivel: "comum",
    descricao: "25 opiniões sobre peças antes do envio.",
    ganhou: (e) => e.opinioes >= 25,
    progresso: (e) => `${Math.min(e.opinioes, 25)} de 25 opiniões`,
  },
  {
    id: "ajuda-quem-pergunta",
    nome: "Ajuda quem pergunta",
    nivel: "comum",
    descricao: "10 respostas a perguntas sobre produtos.",
    ganhou: (e) => e.respostas >= 10,
    progresso: (e) => `${Math.min(e.respostas, 10)} de 10 respostas`,
  },
];

// Só o maior selo de avaliador aparece (quem é ouro não precisa mostrar prata e bronze)
export function selosDe(e: Estatisticas): Selo[] {
  const ganhos = REGRAS_SELOS.filter((r) => r.ganhou(e));
  const avaliador = ganhos.find((r) => r.nivel !== "comum");
  return ganhos
    .filter((r) => r.nivel === "comum" || r === avaliador)
    .map(({ id, nome, descricao, nivel }) => ({ id, nome, descricao, nivel }));
}

const PESO: Record<NivelSelo, number> = { ouro: 3, prata: 2, bronze: 1, comum: 0 };

// Quanto destaque as contribuições da pessoa recebem: 3 (ouro) a 0
export const nivelDeDestaque = (selos: Selo[]) => Math.max(0, ...selos.map((s) => PESO[s.nivel]));
