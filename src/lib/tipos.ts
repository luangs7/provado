// Modelos do domínio. Quando o backend em Kotlin existir, estes tipos
// espelham as data classes que a API vai devolver.

export type Plataforma = "taobao" | "weidian" | "1688";

export type Categoria =
  | "tenis"
  | "camisetas"
  | "moletons"
  | "jaquetas"
  | "calcas"
  | "bones"
  | "mochilas";

export type Loja = {
  id: string;
  nome: string;
  plataforma: Plataforma;
  desde: number;
  parceira: boolean;
};

export type Produto = {
  id: string;
  titulo: string;
  marca: string; // marcas fictícias no protótipo
  categoria: Categoria;
  lojaId: string;
  plataforma: Plataforma;
  itemId: string;
  precoYuan: number;
  cor: string; // cor usada na arte de exemplo
  corNome: string;
  tamanhos: string[];
};

// Notas de 1 a 5 por critério
export type Criterios = {
  material: number;
  fidelidade: number;
  tamanho: number;
  custoBeneficio: number;
};

export type Caimento = "pequeno" | "certo" | "grande";

// "Direto com a loja" ou o nome do agente (ex.: CSSBuy)
export type Canal = string;

export type Review = {
  id: string;
  produtoId: string;
  autor: string;
  data: string; // ISO
  tamanho: string;
  altura?: number; // cm
  peso?: number; // kg
  caimento: Caimento;
  notas: Criterios;
  texto: string;
  canal: Canal;
  fotos: string[]; // ângulos de exemplo ou imagens enviadas (data URL)
  curtidas: number;
  qcId?: string; // quando a review nasceu de uma conferência no armazém
};

export type Veredito = "GL" | "RL";

export type MotivoRl =
  | "Costura"
  | "Cor diferente"
  | "Mancha ou sujeira"
  | "Medida fora da tabela"
  | "Defeito no material"
  | "Acabamento";

export type DecisaoQc = "aguardando" | "enviado" | "trocado" | "devolvido" | "recebido";

export type Qc = {
  id: string;
  produtoId?: string; // vazio quando o produto ainda não está no catálogo
  link?: string;
  tituloLivre?: string;
  autor: string;
  data: string;
  tamanho: string;
  canal: Canal; // QC só existe em compra por agente
  observacao: string;
  fotos: string[];
  votos: { gl: number; rl: number; motivos: Partial<Record<MotivoRl, number>> };
  decisao: DecisaoQc;
};

// Opinião escrita sobre as fotos do armazém (o voto GL/RL com comentário)
export type Opiniao = {
  id: string;
  qcId: string;
  autor: string;
  veredito: Veredito;
  motivo?: MotivoRl;
  texto: string;
  data: string;
  curtidas: number;
};

// Contribuições anteriores ao recorte de exemplo, usadas nos selos
export type Historico = {
  reviews: number;
  completas: number;
  respostas: number;
  opinioes: number;
  compras: number;
};

export type Usuario = {
  nome: string;
  desde: number;
  historico: Historico;
};

export type Resposta = {
  autor: string;
  texto: string;
  data: string;
  comprou: boolean;
};

export type Pergunta = {
  id: string;
  produtoId: string;
  autor: string;
  data: string;
  texto: string;
  respostas: Resposta[];
};
