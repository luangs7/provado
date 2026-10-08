// Conteúdo da página de ajuda e do tutorial da tela inicial

import { CUSTO_DESBLOQUEIO, LIMITE_GRATUITO, PONTOS } from "./regras";

export const PASSOS = [
  {
    titulo: "Busque o produto ou cole o link",
    texto: "Pelo nome, pela marca ou pelo link do Taobao, Weidian, 1688 ou do agente. O site junta as reviews do mesmo item, venham de qual link vierem.",
    acao: { rotulo: "Buscar produtos", href: "/produtos" },
  },
  {
    titulo: "Veja como chegou para quem já comprou",
    texto: "Notas por critério, fotos reais, o tamanho que cada pessoa pediu e como ficou no corpo dela.",
    acao: { rotulo: "Ver reviews", href: "/reviews" },
  },
  {
    titulo: "Comprou por agente? Peça uma opinião antes do envio",
    texto:
      "Quando a peça chega no armazém, poste as fotos. A comunidade diz se pode enviar ou se é melhor trocar antes de ela vir para o Brasil.",
    acao: { rotulo: "Ver peças antes do envio", href: "/qc" },
  },
  {
    titulo: "Chegou? Conte como foi",
    texto: `Publique a review com fotos, tamanho e suas medidas. Uma review completa vale ${PONTOS.reviewCompleta} pontos.`,
    acao: { rotulo: "Ver seus pontos", href: "/perfil" },
  },
];

export const PERGUNTAS_FREQUENTES = [
  {
    pergunta: "Comprei direto com a loja. Preciso mostrar a peça antes do envio?",
    resposta:
      "Não. Essas fotos só existem em compras por agente, porque é o agente que fotografa a peça no armazém. Quando o produto chegar, publique a review normalmente.",
  },
  {
    pergunta: "Por que só vejo algumas reviews de um produto?",
    resposta: `O plano gratuito mostra até ${LIMITE_GRATUITO} reviews por produto. Para ver todas, use ${CUSTO_DESBLOQUEIO} pontos naquele produto ou assine o Plus.`,
  },
  {
    pergunta: "Como ganho pontos?",
    resposta: `Review completa vale ${PONTOS.reviewCompleta}, review simples ${PONTOS.reviewSimples}, resposta a uma pergunta ${PONTOS.resposta}, opinião antes do envio com comentário ${PONTOS.votoComMotivo}, sem comentário ${PONTOS.votoSimples}, e cada curtida que você recebe vale ${PONTOS.curtidaRecebida}. Opiniões e comentários têm limite diário.`,
  },
  {
    pergunta: "Para que servem as curtidas e os selos?",
    resposta:
      "Curtir uma review ou opinião é dizer que ela ajudou. As curtidas contam para os selos de avaliador (bronze, prata e ouro), e quem tem selo aparece primeiro nas listas. Também há selos por quantidade de reviews, compras e respostas.",
  },
  {
    pergunta: "Minhas medidas aparecem para todo mundo?",
    resposta:
      "Altura e peso são opcionais e aparecem só em faixas, como 1,75–1,80 m e 70–80 kg. O valor exato nunca é mostrado.",
  },
  {
    pergunta: "Lojas parceiras aparecem em primeiro?",
    resposta:
      "Não. Lojas parceiras aparecem em espaços marcados como patrocinados, mas isso nunca muda notas, reviews, peças reprovadas ou a ordem dos mais bem avaliados.",
  },
  {
    pergunta: "Como funciona a ordem \"Mais bem avaliados\"?",
    resposta:
      "Ela considera a nota e a quantidade de reviews. Um produto com uma única nota 5 não passa na frente de outro com dezenas de reviews boas.",
  },
];
