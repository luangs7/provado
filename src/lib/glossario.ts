// Termos da comunidade explicados em linguagem simples.
// Usado na página de ajuda e nas dicas que aparecem ao tocar num termo.

export type Termo = { id: string; termo: string; nome?: string; definicao: string };

export const GLOSSARIO: Termo[] = [
  {
    id: "qc",
    termo: "QC",
    nome: "Quality Check",
    definicao:
      "Conferência antes do envio. São as fotos que o agente tira da sua peça no armazém, antes de mandar para o Brasil. É a chance de conferir costura, cor e medidas.",
  },
  {
    id: "gl",
    termo: "GL",
    nome: "Green Light",
    definicao: "Sinal verde. Quem vota GL acha que a peça está boa e pode ser enviada.",
  },
  {
    id: "rl",
    termo: "RL",
    nome: "Red Light",
    definicao:
      "Sinal vermelho. Quem vota RL viu algum problema nas fotos e acha melhor pedir a troca ou devolver. O voto vem com o motivo, como costura ou cor diferente.",
  },
  {
    id: "taxa-rl",
    termo: "Peças reprovadas",
    definicao:
      "De todas as peças já conferidas antes do envio, quantas a comunidade reprovou. Quanto menor, menos chance de receber peça com defeito.",
  },
  {
    id: "agente",
    termo: "Agente",
    definicao:
      "Empresa que compra na China por você, como a CSSBuy. Ela recebe o produto no armazém, tira fotos para você conferir e envia para o Brasil.",
  },
  {
    id: "armazem",
    termo: "Armazém",
    definicao:
      "Onde o agente guarda a peça até você decidir enviar. Compras feitas direto com a loja não passam pelo armazém e não têm essas fotos.",
  },
  {
    id: "caimento",
    termo: "Caimento",
    definicao: "Como a peça vestiu: pequena, no tamanho certo ou grande, comparando com o tamanho que a pessoa pediu.",
  },
  {
    id: "corpo-parecido",
    termo: "Corpo parecido",
    definicao:
      "Reviews de quem tem até 6 cm de altura e 10 kg de diferença de você. As medidas aparecem só em faixas, nunca o valor exato.",
  },
  {
    id: "selos",
    termo: "Selos",
    definicao:
      "Reconhecem quem contribui. Os de avaliador (bronze, prata e ouro) vêm das curtidas que uma review ou opinião recebe, e fazem as próximas contribuições da pessoa aparecerem primeiro.",
  },
  {
    id: "pontos",
    termo: "Pontos",
    definicao:
      "Você ganha publicando reviews, respondendo perguntas, opinando sobre peças antes do envio e recebendo curtidas. Com 100 pontos, libera todas as reviews de um produto sem pagar.",
  },
  {
    id: "plus",
    termo: "Plus",
    definicao: "Plano pago que mostra todas as reviews e libera o filtro por corpo parecido e os filtros avançados.",
  },
];

export const buscarTermo = (id: string) => GLOSSARIO.find((t) => t.id === id);
