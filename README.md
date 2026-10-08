# Provado (nome provisório)

Protótipo navegável do site de reviews de produtos importados da China. Serve para apresentar a ideia: todas as telas funcionam, mas os dados são de exemplo e o que você publica fica salvo só no navegador.

## Como rodar

Precisa do Node.js 20.9 ou mais recente.

```bash
npm install
npm run dev
```

Abra http://localhost:3000.

Para conferir antes de subir: `npm run lint` e `npm run build`.

## Roteiro para demonstrar

1. Na tela inicial, clique em **Link da Weidian**. O link é reconhecido e abre a página do produto.
2. Veja as notas por critério, a indicação de tamanho e a taxa de RL. Role até o fim das reviews: o plano gratuito mostra 10, e dá para desbloquear o resto com 100 pontos.
3. Abra a aba **Fotos de QC**, entre em um QC que está no armazém e vote **RL** marcando um motivo. O carimbo aparece e você ganha pontos.
4. Clique em **Postar QC**, envie uma foto qualquer e publique. No QC, marque **Enviei** e depois **Transformar em review**: a review nasce já ligada ao QC.
5. Em **Planos**, assine o Plus (simulado) e volte a um produto: os filtros por corpo parecido e os filtros avançados passam a funcionar.
6. O **perfil** mostra pontos, selos, a etapa de cada pedido e o extrato.
7. A faixa amarela no topo tem **Recomeçar demonstração**, que zera tudo.

## Estrutura

```
src/
  app/                     telas (uma pasta por rota)
    page.tsx               início
    buscar/                resultado de "colar o link"
    produto/[id]/          página do produto
    qc/                    armazém, QC e postar QC
    review/nova/           publicar review
    ranking/  loja/[id]/  planos/  perfil/
  components/              peças de tela reutilizáveis
  lib/
    tipos.ts               modelos (viram as data classes do backend)
    link.ts                leitor de links → (plataforma, itemId)
    calculos.ts            notas, média bayesiana, tamanho, taxa de RL
    regras.ts              pontos e limite do plano gratuito
    dados.ts               dados de exemplo (lojas, produtos, reviews, QCs)
    resumos.ts             dados + cálculos prontos para as telas
    demo.ts                estado da demonstração no navegador
```

Algumas convenções do Next.js 16 usadas aqui:

- Componentes são do servidor por padrão. Os que têm `"use client"` no topo rodam no navegador (cliques, formulários, estado).
- `params` e `searchParams` são assíncronos (`await props.params`).
- Com o Cache Components ligado, a parte da página que lê `searchParams` fica dentro de um `<Suspense>`.
- `src/lib/demo.ts` funciona como um StateFlow: um valor atual, quem está ouvindo e funções que mudam o estado. Os componentes leem com `useDemo()`.

## O que é de exemplo

- Lojas, produtos e pessoas são fictícios. As fotos são desenhos gerados no código.
- Reviews e QCs são gerados a partir de uma semente fixa em `src/lib/dados.ts`.
- Pontos, plano, votos e o que você publica ficam no `localStorage`.
- Preço do Plus, valores de pontos e cotação do yuan são valores de exemplo.

## Próximos passos

1. Backend em Kotlin (Ktor + PostgreSQL) começando pelo leitor de links, que hoje está em `src/lib/link.ts`, e pelas regras de `src/lib/calculos.ts`.
2. Trocar `src/lib/dados.ts` por chamadas à API e `src/lib/demo.ts` por login de verdade.
3. Fotos enviadas indo para um armazenamento de arquivos (Cloudflare R2) em vez do navegador.
