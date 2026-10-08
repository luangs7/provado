// Dados de exemplo do protótipo.
// Lojas, produtos e pessoas são fictícios. As reviews e os QCs são gerados
// a partir de uma semente fixa, então saem sempre iguais (no servidor e no navegador).
// Quando a API em Kotlin existir, este arquivo é substituído por chamadas a ela.

import type {
  Caimento,
  Categoria,
  Criterios,
  DecisaoQc,
  Loja,
  MotivoRl,
  Opiniao,
  Pergunta,
  Produto,
  Qc,
  Review,
  Usuario,
  Veredito,
} from "./tipos";

// "Hoje" fixo do protótipo, para as datas não mudarem a cada visita
export const HOJE = new Date("2026-10-07T12:00:00-03:00");

export const CATEGORIAS: Record<Categoria, string> = {
  tenis: "Tênis",
  camisetas: "Camisetas",
  moletons: "Moletons",
  jaquetas: "Jaquetas",
  calcas: "Calças",
  bones: "Bonés",
  mochilas: "Mochilas",
};

export const AGENTES = ["CSSBuy", "Outro agente"];
export const DIRETO = "Direto com a loja";

export const MOTIVOS_RL: MotivoRl[] = [
  "Costura",
  "Cor diferente",
  "Mancha ou sujeira",
  "Medida fora da tabela",
  "Defeito no material",
  "Acabamento",
];

export const lojas: Loja[] = [
  { id: "jiahe", nome: "Jiahe Sport", plataforma: "weidian", desde: 2019, parceira: true },
  { id: "ruyi", nome: "Ruyi Studio", plataforma: "taobao", desde: 2017, parceira: false },
  { id: "beifang", nome: "Beifang Outdoor", plataforma: "taobao", desde: 2020, parceira: true },
  { id: "mianhua", nome: "Mianhua Basics", plataforma: "1688", desde: 2016, parceira: false },
  { id: "xingyun", nome: "Xingyun Bags", plataforma: "weidian", desde: 2021, parceira: false },
  { id: "tiandi", nome: "Tiandi Caps", plataforma: "weidian", desde: 2022, parceira: false },
];

const TENIS = ["40", "41", "42", "43", "44"];
const ROUPA = ["S", "M", "L", "XL", "XXL"];
const UNICO = ["Único"];

export const produtos: Produto[] = [
  { id: "aero-knit", titulo: "Tênis de corrida Aero Knit", marca: "Velo", categoria: "tenis", lojaId: "jiahe", plataforma: "weidian", itemId: "7291054418", precoYuan: 289, cor: "#8fa3b8", corNome: "Cinza-azulado", tamanhos: TENIS },
  { id: "ridge-trilha", titulo: "Tênis de trilha Ridge", marca: "Trailform", categoria: "tenis", lojaId: "beifang", plataforma: "taobao", itemId: "684512937710", precoYuan: 340, cor: "#6b7b4f", corNome: "Verde-oliva", tamanhos: TENIS },
  { id: "court-couro", titulo: "Tênis casual Court em couro", marca: "Courtline", categoria: "tenis", lojaId: "ruyi", plataforma: "taobao", itemId: "698877120034", precoYuan: 259, cor: "#ecebe4", corNome: "Branco", tamanhos: TENIS },
  { id: "corta-vento", titulo: "Jaqueta corta-vento Ripstop", marca: "Northgale", categoria: "jaquetas", lojaId: "beifang", plataforma: "taobao", itemId: "702233198845", precoYuan: 219, cor: "#2f4a6d", corNome: "Azul-marinho", tamanhos: ROUPA },
  { id: "puffer-leve", titulo: "Jaqueta puffer leve", marca: "Northgale", categoria: "jaquetas", lojaId: "jiahe", plataforma: "weidian", itemId: "7319928841", precoYuan: 299, cor: "#6e2b33", corNome: "Vinho", tamanhos: ROUPA },
  { id: "camiseta-260", titulo: "Camiseta pesada 260g", marca: "Básico & Co.", categoria: "camisetas", lojaId: "mianhua", plataforma: "1688", itemId: "651820394471", precoYuan: 39, cor: "#e6dfcf", corNome: "Off-white", tamanhos: ROUPA },
  { id: "moletom-400", titulo: "Moletom com capuz 400g", marca: "Básico & Co.", categoria: "moletons", lojaId: "ruyi", plataforma: "taobao", itemId: "715530982216", precoYuan: 168, cor: "#7d6a5a", corNome: "Café", tamanhos: ROUPA },
  { id: "cargo-utility", titulo: "Calça cargo Utility", marca: "Utilis", categoria: "calcas", lojaId: "ruyi", plataforma: "taobao", itemId: "709981234567", precoYuan: 145, cor: "#4d4a42", corNome: "Grafite", tamanhos: ROUPA },
  { id: "dad-hat", titulo: "Boné dad hat lavado", marca: "Capstone", categoria: "bones", lojaId: "tiandi", plataforma: "weidian", itemId: "7188823410", precoYuan: 59, cor: "#c9b28a", corNome: "Areia", tamanhos: UNICO },
  { id: "rolltop-25", titulo: "Mochila rolltop 25L", marca: "Rolltek", categoria: "mochilas", lojaId: "xingyun", plataforma: "weidian", itemId: "7402219987", precoYuan: 198, cor: "#30343a", corNome: "Preta", tamanhos: UNICO },
];

// Como cada produto "se comporta" na geração dos dados de exemplo.
// vies: +1 = veste pequeno (precisa pedir um acima), -1 = veste grande.
type Perfil = { base: Criterios; vies: number; reviews: number; qcs: number; taxaRl: number };

const perfis: Record<string, Perfil> = {
  "aero-knit": { base: { material: 4.5, fidelidade: 4.7, tamanho: 4, custoBeneficio: 4.8 }, vies: 1, reviews: 16, qcs: 7, taxaRl: 0.12 },
  "ridge-trilha": { base: { material: 4.2, fidelidade: 4.1, tamanho: 4, custoBeneficio: 4 }, vies: 0, reviews: 9, qcs: 4, taxaRl: 0.2 },
  "court-couro": { base: { material: 3.7, fidelidade: 3.9, tamanho: 4, custoBeneficio: 4.1 }, vies: 0, reviews: 13, qcs: 6, taxaRl: 0.3 },
  "corta-vento": { base: { material: 4.4, fidelidade: 4.5, tamanho: 4, custoBeneficio: 4.6 }, vies: 1, reviews: 12, qcs: 4, taxaRl: 0.1 },
  "puffer-leve": { base: { material: 4.6, fidelidade: 4.4, tamanho: 4, custoBeneficio: 4.3 }, vies: 1, reviews: 3, qcs: 3, taxaRl: 0.15 },
  "camiseta-260": { base: { material: 4.6, fidelidade: 4.8, tamanho: 4, custoBeneficio: 5 }, vies: 0, reviews: 18, qcs: 2, taxaRl: 0.05 },
  "moletom-400": { base: { material: 4.3, fidelidade: 4.2, tamanho: 4, custoBeneficio: 4.4 }, vies: -1, reviews: 11, qcs: 4, taxaRl: 0.15 },
  "cargo-utility": { base: { material: 3.9, fidelidade: 4, tamanho: 4, custoBeneficio: 4.2 }, vies: 1, reviews: 7, qcs: 3, taxaRl: 0.2 },
  "dad-hat": { base: { material: 4.1, fidelidade: 4.3, tamanho: 4, custoBeneficio: 4.5 }, vies: 0, reviews: 6, qcs: 2, taxaRl: 0.1 },
  "rolltop-25": { base: { material: 3.6, fidelidade: 3.8, tamanho: 4, custoBeneficio: 3.9 }, vies: 0, reviews: 8, qcs: 3, taxaRl: 0.35 },
};

export const AUTORES = [
  "rafa.importa", "lucasfz", "bia.streetwear", "thi.go", "gabs", "marcelo.k",
  "joaopedro", "duda.santos", "caio.br", "fer.oliveira", "matheuslm", "pedrin",
  "nath.alves", "rodrigo.m", "leo_sp", "carol.tx", "henrique", "julia.r",
  "igor.cwb", "vitor.b", "amanda.l", "renan92", "tati.s", "felipe.dz",
];

// Algumas pessoas escrevem reviews que a comunidade curte muito.
// Isso define a faixa de curtidas que as contribuições delas recebem nos exemplos.
const POPULARIDADE: Record<string, "ouro" | "prata" | "bronze"> = {
  "rafa.importa": "ouro",
  "bia.streetwear": "ouro",
  "marcelo.k": "prata",
  "caio.br": "prata",
  "duda.santos": "bronze",
  henrique: "bronze",
};

function sortearCurtidas(s: () => number, autor: string) {
  const faixa = POPULARIDADE[autor];
  if (faixa === "ouro") return entre(s, 96, 190);
  if (faixa === "prata") return entre(s, 45, 95);
  if (faixa === "bronze") return entre(s, 18, 44);
  return entre(s, 0, 16);
}

export const ANGULOS: Record<Categoria, string[]> = {
  tenis: ["Frente", "Lateral", "Sola", "Etiqueta"],
  camisetas: ["Frente", "Costas", "Etiqueta", "Medida"],
  moletons: ["Frente", "Costas", "Etiqueta", "Medida"],
  jaquetas: ["Frente", "Costas", "Etiqueta", "Medida"],
  calcas: ["Frente", "Costas", "Etiqueta", "Medida"],
  bones: ["Frente", "Lateral", "Etiqueta", "Medida"],
  mochilas: ["Frente", "Costas", "Interior", "Etiqueta"],
};

// ---------- Gerador com semente (mulberry32) ----------

function criarSorteio(semente: number) {
  let s = semente >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function sementeDe(texto: string) {
  let h = 2166136261;
  for (const c of texto) h = Math.imul(h ^ c.charCodeAt(0), 16777619);
  return h >>> 0;
}

type Sorteio = () => number;
const escolher = <T,>(s: Sorteio, lista: T[]) => lista[Math.floor(s() * lista.length)];
const entre = (s: Sorteio, min: number, max: number) => Math.floor(min + s() * (max - min + 1));
const limitar = (n: number, min: number, max: number) => Math.min(max, Math.max(min, n));
const normal = (s: Sorteio, media: number, desvio: number) =>
  media + desvio * Math.sqrt(-2 * Math.log(s() || 1e-9)) * Math.cos(2 * Math.PI * s());

function diasAtras(dias: number, horas = 0) {
  return new Date(HOJE.getTime() - dias * 86_400_000 - horas * 3_600_000).toISOString();
}

// ---------- Textos de exemplo ----------

const ABERTURAS = [
  "Chegou em {dias} dias pela linha econômica.",
  "Demorou {dias} dias para chegar aqui.",
  "Primeira compra nessa loja.",
  "Segunda vez que compro dessa loja.",
  "Comprei depois de ver as reviews daqui.",
  "Veio bem embalado, sem amassar.",
];

const QUALIDADE = {
  alta: [
    "Material muito bom, melhor do que eu esperava pelo preço.",
    "Acabamento caprichado, costura reta e sem linha solta.",
    "Bem fiel às fotos do anúncio, inclusive a cor.",
    "Tecido encorpado, não parece nada de baixa qualidade.",
  ],
  media: [
    "Material ok pelo preço, nada de especial.",
    "Tinha umas linhas soltas, cortei e ficou tranquilo.",
    "A cor é um pouco mais escura do que nas fotos.",
    "Cheiro forte de cola quando chegou, saiu depois de uns dias.",
  ],
  baixa: [
    "O material é mais fino do que parece nas fotos.",
    "Veio com uma mancha pequena, saiu lavando.",
    "Acabamento deixa a desejar em alguns pontos.",
  ],
};

const TAMANHO: Record<Caimento, string[]> = {
  pequeno: [
    "Veste pequeno, pede um acima.",
    "Ficou justo, deveria ter pedido um número maior.",
    "A tabela da loja não bate, ficou apertado.",
  ],
  certo: [
    "Tamanho certinho, segui a tabela.",
    "Vestiu perfeito.",
    "Pedi meu tamanho de sempre e ficou bom.",
  ],
  grande: [
    "Ficou largo, dava pra pedir um abaixo.",
    "Modelagem grande. Se não gosta de oversized, pede um menor.",
  ],
};

const TAMANHO_UNICO: Partial<Record<Categoria, string[]>> = {
  bones: ["A regulagem atrás funciona bem.", "Aba firme, não deformou na viagem."],
  mochilas: ["Cabe notebook de 15 polegadas com folga.", "Os zíperes são firmes."],
};

// Detalhes que quem escreve reviews muito curtidas costuma incluir
const DETALHES = [
  "Medi a palmilha: 27 cm no 42, bate com a tabela da loja.",
  "Comparei com a peça que já tinha: tecido mais grosso e costura dupla na barra.",
  "O bordado do peito está alinhado e sem fio solto.",
  "Lavei duas vezes e não desbotou nem encolheu.",
  "As fotos estão com luz natural para mostrar a cor real.",
];

const OBSERVACOES_QC = [
  "Primeira compra nessa loja, quero conferir antes de enviar.",
  "Achei a costura do lado esquerdo estranha, o que acham?",
  "A cor parece mais clara do que no anúncio. Posso enviar?",
  "Pedi as medidas, estão nas fotos. Bate com a tabela?",
  "Vai junto com outras peças no mesmo pacote.",
  "Conferi a etiqueta e parece tudo certo.",
];

// ---------- Geração ----------

function indiceIdeal(categoria: Categoria, altura: number, peso: number) {
  if (categoria === "tenis") return limitar(Math.round((altura - 175) / 6 + 2), 0, 4);
  if (peso < 62) return 0;
  if (peso < 72) return 1;
  if (peso < 84) return 2;
  if (peso < 95) return 3;
  return 4;
}

function gerarReviews(produto: Produto, perfil: Perfil): Review[] {
  const s = criarSorteio(sementeDe("reviews-" + produto.id));
  const lista: Review[] = [];

  for (let i = 0; i < perfil.reviews; i++) {
    const altura = Math.round(limitar(normal(s, 175, 7), 158, 195));
    const peso = Math.round(limitar((altura - 100) * 0.95 + normal(s, 0, 9), 50, 120));
    const temMedidas = s() < 0.75;

    let tamanho = produto.tamanhos[0];
    let caimento: Caimento = "certo";
    if (produto.tamanhos.length > 1) {
      const ideal = indiceIdeal(produto.categoria, altura, peso);
      const r = s();
      const escolhido = limitar(ideal + (r < 0.15 ? -1 : r < 0.75 ? 0 : 1), 0, produto.tamanhos.length - 1);
      const certo = ideal + perfil.vies;
      tamanho = produto.tamanhos[escolhido];
      caimento = escolhido < certo ? "pequeno" : escolhido > certo ? "grande" : "certo";
    }

    const nota = (base: number) => Math.round(limitar(base + normal(s, 0, 0.6), 1, 5));
    const notas: Criterios = {
      material: nota(perfil.base.material),
      fidelidade: nota(perfil.base.fidelidade),
      tamanho: caimento === "certo" ? entre(s, 4, 5) : entre(s, 2, 3),
      custoBeneficio: nota(perfil.base.custoBeneficio),
    };

    const canal = s() < 0.25 ? DIRETO : escolher(s, AGENTES);
    const dias = entre(s, 2, 160);
    const nivel = notas.material >= 4 ? "alta" : notas.material === 3 ? "media" : "baixa";
    const frasesTamanho = TAMANHO_UNICO[produto.categoria] ?? TAMANHO[caimento];
    const autor = AUTORES[(i * 7 + sementeDe(produto.id)) % AUTORES.length];
    const detalhista = POPULARIDADE[autor] !== undefined;
    const texto = [
      escolher(s, ABERTURAS).replace("{dias}", String(entre(s, 12, 34))),
      escolher(s, QUALIDADE[nivel]),
      escolher(s, frasesTamanho),
      detalhista ? escolher(s, DETALHES) : "",
    ]
      .filter(Boolean)
      .join(" ");

    const angulos = ANGULOS[produto.categoria];
    lista.push({
      id: `${produto.id}-r${i + 1}`,
      produtoId: produto.id,
      autor,
      data: diasAtras(dias, entre(s, 0, 20)),
      tamanho,
      caimento,
      notas,
      texto,
      canal,
      fotos: detalhista ? angulos : angulos.slice(0, entre(s, 0, 3)),
      altura: temMedidas || detalhista ? altura : undefined,
      peso: temMedidas || detalhista ? peso : undefined,
      curtidas: sortearCurtidas(s, autor),
    });
  }

  return lista.sort((a, b) => b.data.localeCompare(a.data));
}

function gerarQcs(produto: Produto, perfil: Perfil): Qc[] {
  const s = criarSorteio(sementeDe("qcs-" + produto.id));
  const lista: Qc[] = [];

  for (let i = 0; i < perfil.qcs; i++) {
    // Os dois primeiros QCs dos produtos mais movimentados ainda estão no armazém
    const aguardando = i === 0 || (i === 1 && perfil.qcs >= 5);
    const reprovado = !aguardando && s() < perfil.taxaRl * 2.2;
    const total = aguardando ? entre(s, 2, 9) : entre(s, 7, 26);
    const proporcaoGl = reprovado ? 0.15 + s() * 0.3 : 0.78 + s() * 0.2;
    const gl = Math.round(total * proporcaoGl);
    const rl = total - gl;

    const motivos: Partial<Record<MotivoRl, number>> = {};
    for (let v = 0; v < rl; v++) {
      const m = escolher(s, MOTIVOS_RL);
      motivos[m] = (motivos[m] ?? 0) + 1;
    }

    let decisao: DecisaoQc = "aguardando";
    if (!aguardando) {
      decisao = reprovado ? (s() < 0.7 ? "trocado" : "devolvido") : s() < 0.6 ? "recebido" : "enviado";
    }

    lista.push({
      id: `${produto.id}-qc${i + 1}`,
      produtoId: produto.id,
      autor: AUTORES[(i * 5 + 3 + sementeDe(produto.id)) % AUTORES.length],
      data: aguardando ? diasAtras(0, entre(s, 2, 40)) : diasAtras(entre(s, 4, 120)),
      tamanho: escolher(s, produto.tamanhos),
      canal: escolher(s, AGENTES),
      observacao: escolher(s, OBSERVACOES_QC),
      fotos: ANGULOS[produto.categoria],
      votos: { gl, rl, motivos },
      decisao,
    });
  }

  return lista.sort((a, b) => b.data.localeCompare(a.data));
}

export const reviews: Review[] = produtos.flatMap((p) => gerarReviews(p, perfis[p.id]));
export const qcs: Qc[] = produtos.flatMap((p) => gerarQcs(p, perfis[p.id]));

// ---------- Opiniões escritas sobre as fotos do armazém ----------

const OPINIAO_GL = [
  "Costura reta e etiqueta bem posicionada. Pode mandar.",
  "A cor bate com as fotos do anúncio. Tranquilo para enviar.",
  "Medidas dentro da tabela, pode enviar.",
  "Comparei com o meu, que chegou mês passado: está igual.",
];

const OPINIAO_RL: Record<MotivoRl, string[]> = {
  Costura: [
    "A costura do símbolo está diferente das outras unidades que vi aqui. Eu pediria troca.",
    "A costura da lateral está torta, dá para ver na segunda foto.",
  ],
  "Cor diferente": ["Está bem mais clara que o anúncio. Se a cor importa para você, troca."],
  "Mancha ou sujeira": ["Tem uma mancha perto da gola na primeira foto. Pede para o agente olhar."],
  "Medida fora da tabela": ["A medida do peito deu 4 cm a menos que a tabela. Vai vestir apertado."],
  "Defeito no material": ["Parece ter um fio puxado na frente. Melhor pedir outra unidade."],
  Acabamento: ["O acabamento da barra está irregular. Vale pedir outra unidade."],
};

function gerarOpinioes(qc: Qc): Opiniao[] {
  const s = criarSorteio(sementeDe("opinioes-" + qc.id));
  const total = qc.votos.gl + qc.votos.rl;
  const quantidade = Math.min(total, entre(s, 1, 4));
  const motivos = Object.keys(qc.votos.motivos) as MotivoRl[];
  const lista: Opiniao[] = [];
  let rlRestantes = qc.votos.rl;

  for (let i = 0; i < quantidade; i++) {
    const veredito: Veredito = rlRestantes > 0 && (i === 0 || s() < 0.5) ? "RL" : "GL";
    if (veredito === "RL") rlRestantes--;
    const motivo: MotivoRl | undefined =
      veredito === "RL" ? escolher<MotivoRl>(s, motivos.length ? motivos : ["Acabamento"]) : undefined;
    const autor = AUTORES[(sementeDe(qc.id) + i * 11) % AUTORES.length];
    lista.push({
      id: `${qc.id}-op${i + 1}`,
      qcId: qc.id,
      autor: autor === qc.autor ? AUTORES[(AUTORES.indexOf(autor) + 1) % AUTORES.length] : autor,
      veredito,
      motivo,
      texto: escolher(s, motivo ? OPINIAO_RL[motivo] : OPINIAO_GL),
      data: new Date(new Date(qc.data).getTime() + (i + 1) * 3_600_000).toISOString(),
      curtidas: sortearCurtidas(s, autor),
    });
  }
  return lista;
}

export const opinioes: Opiniao[] = qcs.flatMap(gerarOpinioes);

// ---------- Pessoas ----------

// Histórico de contribuições de cada pessoa além do que aparece nos exemplos
export const usuarios: Usuario[] = AUTORES.map((nome) => {
  const s = criarSorteio(sementeDe("usuario-" + nome));
  const faixa = POPULARIDADE[nome];
  const frequente = !faixa && s() < 0.3; // compra bastante, mas suas reviews não viralizaram
  const reviewsAntigas = faixa === "ouro" ? entre(s, 22, 40) : faixa ? entre(s, 8, 18) : frequente ? entre(s, 16, 24) : entre(s, 0, 6);
  return {
    nome,
    desde: entre(s, 2021, 2026),
    historico: {
      reviews: reviewsAntigas,
      completas: Math.round(reviewsAntigas * (faixa ? 0.8 : 0.3)),
      respostas: faixa ? entre(s, 6, 20) : entre(s, 0, 5),
      opinioes: faixa ? entre(s, 15, 45) : entre(s, 0, 10),
      compras: reviewsAntigas + entre(s, 2, 10),
    },
  };
});

// Perguntas escritas à mão para os produtos principais
export const perguntas: Pergunta[] = [
  {
    id: "aero-knit-q1", produtoId: "aero-knit", autor: "igor.cwb", data: diasAtras(3),
    texto: "Calço 41 em tênis de corrida. Peço 42 nesse?",
    respostas: [
      { autor: "rafa.importa", texto: "Pede 42 sim. Calço 41 e o 41 ficou apertado no dedão.", data: diasAtras(3, -2), comprou: true },
      { autor: "duda.santos", texto: "Mesma coisa aqui, fui de 42 e ficou perfeito.", data: diasAtras(2), comprou: true },
    ],
  },
  {
    id: "aero-knit-q2", produtoId: "aero-knit", autor: "amanda.l", data: diasAtras(9),
    texto: "A sola é boa para correr na rua ou é mais para o dia a dia?",
    respostas: [
      { autor: "caio.br", texto: "Corro 5 km três vezes por semana com ele há dois meses. Aguentou bem.", data: diasAtras(8), comprou: true },
    ],
  },
  {
    id: "aero-knit-q3", produtoId: "aero-knit", autor: "renan92", data: diasAtras(0, 5),
    texto: "Alguém sabe se a cor cinza-azulado puxa mais para o azul ao vivo?",
    respostas: [],
  },
  {
    id: "corta-vento-q1", produtoId: "corta-vento", autor: "julia.r", data: diasAtras(6),
    texto: "Ela é impermeável ou só segura garoa?",
    respostas: [
      { autor: "henrique", texto: "Só garoa. Em chuva forte molha nas costuras.", data: diasAtras(5), comprou: true },
    ],
  },
  {
    id: "corta-vento-q2", produtoId: "corta-vento", autor: "leo_sp", data: diasAtras(14),
    texto: "Tenho 1,78 m e 80 kg. L ou XL?",
    respostas: [
      { autor: "marcelo.k", texto: "Tenho medidas parecidas e o L ficou curto na manga. Vai de XL.", data: diasAtras(13), comprou: true },
    ],
  },
  {
    id: "camiseta-260-q1", produtoId: "camiseta-260", autor: "tati.s", data: diasAtras(4),
    texto: "Encolhe na primeira lavagem?",
    respostas: [
      { autor: "fer.oliveira", texto: "Encolheu um pouco no comprimento, lavei em água fria.", data: diasAtras(4, -3), comprou: true },
      { autor: "gabs", texto: "A minha não encolheu, mas não uso secadora.", data: diasAtras(3), comprou: true },
    ],
  },
  {
    id: "moletom-400-q1", produtoId: "moletom-400", autor: "vitor.b", data: diasAtras(11),
    texto: "O capuz tem forro?",
    respostas: [
      { autor: "nath.alves", texto: "Tem, forro duplo. Fica bem estruturado.", data: diasAtras(10), comprou: true },
    ],
  },
  {
    id: "court-couro-q1", produtoId: "court-couro", autor: "felipe.dz", data: diasAtras(2),
    texto: "O couro amassa muito na ponta depois de usar?",
    respostas: [
      { autor: "thi.go", texto: "Amassa um pouco, normal de couro. Uso protetor de vinco.", data: diasAtras(1), comprou: true },
    ],
  },
  {
    id: "rolltop-25-q1", produtoId: "rolltop-25", autor: "carol.tx", data: diasAtras(7),
    texto: "A fivela é de plástico ou metal?",
    respostas: [],
  },
];

// ---------- Consultas ----------

export const buscarProduto = (id: string) => produtos.find((p) => p.id === id);
export const buscarLoja = (id: string) => lojas.find((l) => l.id === id);
export const buscarQc = (id: string) => qcs.find((q) => q.id === id);
export const buscarReview = (id: string) => reviews.find((r) => r.id === id);
export const buscarUsuario = (nome: string) => usuarios.find((u) => u.nome === nome);
export const opinioesDo = (qcId: string) => opinioes.filter((o) => o.qcId === qcId);
export const MARCAS = [...new Set(produtos.map((p) => p.marca))].sort();
export const reviewsDo = (produtoId: string) => reviews.filter((r) => r.produtoId === produtoId);
export const qcsDo = (produtoId: string) => qcs.filter((q) => q.produtoId === produtoId);
export const perguntasDo = (produtoId: string) => perguntas.filter((q) => q.produtoId === produtoId);
export const produtosDaLoja = (lojaId: string) => produtos.filter((p) => p.lojaId === lojaId);
export const produtoPorLink = (plataforma: string, itemId: string) =>
  produtos.find((p) => p.plataforma === plataforma && p.itemId === itemId);
