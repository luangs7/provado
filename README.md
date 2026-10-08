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

1. A tela inicial abre com **Reviews em alta**: reviews de produtos recebidos, com selo de quem escreveu. Quem tem selo de avaliador (ouro, prata, bronze) aparece primeiro e com borda dourada.
2. Clique numa foto: abre a galeria em tela cheia. Toque na foto para dar zoom e mova para percorrer.
3. Em **Ver review completa**, curta a review. As curtidas contam para os selos de quem escreveu. Clique no nome da pessoa para ver o perfil dela.
4. Digite "jaqueta" na busca da tela inicial ou abra **Produtos**. A busca por nome é livre. Clique em **Testar o Plus**, marque **Serve em mim** e informe altura e peso: cada produto mostra o tamanho que serviu em quem tem o seu corpo.
5. Na página de um produto, veja notas, tamanho, o quadro "Serve em você" e as reviews. No plano gratuito aparecem 10, e dá para liberar o resto com 100 pontos.
6. Em **Antes do envio**, abra uma peça, escolha GL ou RL, marque o motivo e escreva um comentário. Ele entra na lista de opiniões, que também pode receber curtidas.
7. **Publicar review** fica no topo de todas as telas. O **perfil** mostra pontos, suas medidas, os selos com o progresso e suas peças e reviews.
8. Em **Ajuda** estão o passo a passo, o glossário e as perguntas frequentes. A faixa amarela no topo tem **Recomeçar demonstração**, que zera tudo.

## Estrutura

```
src/
  app/                     telas (uma pasta por rota)
    page.tsx               início
    buscar/                resultado de "colar o link"
    produto/[id]/          página do produto
    qc/                    armazém, QC e postar QC
    review/nova/           publicar review
    reviews/               feed de reviews
    review/[id]/           página de uma review
    produtos/              busca de produtos (filtros do Plus)
    usuario/[nome]/        perfil público com selos
    loja/[id]/  planos/  perfil/  ajuda/
  components/              peças de tela reutilizáveis
  lib/
    tipos.ts               modelos (viram as data classes do backend)
    link.ts                leitor de links → (plataforma, itemId)
    calculos.ts            notas, média bayesiana, tamanho, taxa de RL
    regras.ts              pontos e limite do plano gratuito
    selos.ts               regras dos selos e nível de destaque
    pessoas.ts             estatísticas e selos de cada pessoa
    glossario.ts  ajuda.ts textos de ajuda: termos, passo a passo e perguntas frequentes
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

- Lojas, marcas, produtos e pessoas são fictícios. As fotos são desenhos gerados no código.
- Reviews e QCs são gerados a partir de uma semente fixa em `src/lib/dados.ts`.
- Pontos, plano, votos e o que você publica ficam no `localStorage`.
- Preço do Plus, valores de pontos e cotação do yuan são valores de exemplo.

## Próximos passos

1. Backend em Kotlin (Ktor + PostgreSQL) começando pelo leitor de links, que hoje está em `src/lib/link.ts`, e pelas regras de `src/lib/calculos.ts`.
2. Trocar `src/lib/dados.ts` por chamadas à API e `src/lib/demo.ts` por login de verdade.
3. Fotos enviadas indo para um armazenamento de arquivos (Cloudflare R2) em vez do navegador.
