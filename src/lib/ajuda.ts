// Conteúdo da página de ajuda e do tutorial da tela inicial

import { CUSTO_DESBLOQUEIO, LIMITE_GRATUITO, PONTOS } from "./regras";

export const PASSOS = [
  {
    titulo: "Cole o link do produto",
    texto: "Pode ser do Taobao, Weidian, 1688 ou do agente. O site encontra todas as reviews daquele item, venham de qual link vierem.",
    acao: { rotulo: "Testar com um link", href: "/" },
  },
  {
    titulo: "Veja como chegou para quem já comprou",
    texto: "Notas por critério, fotos reais, o tamanho que cada pessoa pediu e como ficou no corpo dela.",
    acao: { rotulo: "Ver o ranking", href: "/ranking" },
  },
  {
    titulo: "Comprou por agente? Peça a avaliação do QC",
    texto:
      "Quando a peça chega no armazém, poste as fotos. A comunidade vota GL (pode enviar) ou RL (melhor trocar) antes de ela vir para o Brasil.",
    acao: { rotulo: "Ver peças no armazém", href: "/qc" },
  },
  {
    titulo: "Chegou? Conte como foi",
    texto: `Publique a review com fotos, tamanho e suas medidas. Uma review completa vale ${PONTOS.reviewCompleta} pontos.`,
    acao: { rotulo: "Ver seus pontos", href: "/perfil" },
  },
];

export const PERGUNTAS_FREQUENTES = [
  {
    pergunta: "Comprei direto com a loja. Preciso postar QC?",
    resposta:
      "Não. Fotos de QC só existem em compras por agente, porque é o agente que fotografa a peça no armazém. Quando o produto chegar, publique a review normalmente.",
  },
  {
    pergunta: "Por que só vejo algumas reviews de um produto?",
    resposta: `O plano gratuito mostra até ${LIMITE_GRATUITO} reviews por produto. Para ver todas, use ${CUSTO_DESBLOQUEIO} pontos naquele produto ou assine o Plus.`,
  },
  {
    pergunta: "Como ganho pontos?",
    resposta: `Review completa vale ${PONTOS.reviewCompleta}, review simples ${PONTOS.reviewSimples}, resposta a uma pergunta ${PONTOS.resposta}, voto no QC com motivo ${PONTOS.votoComMotivo} e voto simples ${PONTOS.votoSimples}. Votos e comentários têm limite diário.`,
  },
  {
    pergunta: "Minhas medidas aparecem para todo mundo?",
    resposta:
      "Altura e peso são opcionais e aparecem só em faixas, como 1,75–1,80 m e 70–80 kg. O valor exato nunca é mostrado.",
  },
  {
    pergunta: "Lojas parceiras aparecem melhor no ranking?",
    resposta:
      "Não. Lojas parceiras aparecem em espaços marcados como patrocinados, mas isso nunca muda notas, reviews, taxa de RL ou posição no ranking.",
  },
  {
    pergunta: "Como o ranking é calculado?",
    resposta:
      "O ranking considera a nota e a quantidade de reviews. Um produto com uma única nota 5 não passa na frente de outro com dezenas de reviews boas.",
  },
];
