<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Provado: contexto do projeto

Este arquivo reúne tudo o que foi decidido até aqui, para qualquer pessoa ou agente que for continuar o trabalho. Leia antes de mexer no código.

"Provado" é um **nome provisório**. O nome final ainda vai ser decidido com os sócios (outras opções levantadas: Chegou, Caimento, Recebi).

---

## 1. Sobre o dono do projeto e como trabalhar com ele

- **Luan**, desenvolvedor Android sênior (Kotlin), em Curitiba. Toca o projeto nas horas vagas e vai apresentá-lo a sócios.
- **Critério principal para qualquer solução técnica:** ele precisa conseguir montar e manter sozinho. Código que ele não escreveria do zero é ruim, porque ele não consegue dar manutenção depois. Na prática:
  - preferir o caminho simples e explícito, sem "mágica";
  - poucas dependências (hoje: Next.js, React, Tailwind e as fontes);
  - comentários curtos em português explicando o porquê;
  - nomes de domínio em português (`produto`, `review`, `qc`, `notaGeral`…).
- Analogias com Android/Compose ajudam: componente ≈ `@Composable`, `useState` ≈ `remember { mutableStateOf() }`, `src/lib/demo.ts` funciona como um StateFlow.
- Ele quer que o assistente consulte a data e hora atuais em cada conversa, em vez de supor.
- Idioma de tudo (código, interface, commits, documentação): **português do Brasil**.

---

## 1.1 Regra permanente de arquitetura

Pedido do Luan: toda decisão de estrutura deve seguir o **padrão de mercado atual**, pesquisado em fontes reais (documentação oficial, projetos com muitas estrelas no GitHub, comunidades). Nada de god class ou god file. Componentizar ao máximo. SOLID, DRY e design patterns são essenciais.

### Referências usadas (pesquisa de out. 2026)
- **Next.js (docs oficiais da versão instalada):** o framework não impõe estrutura, mas documenta "dividir os arquivos por feature ou rota", pastas privadas `_pasta` e **Data Access Layer** (camada de dados `server-only` que devolve DTOs mínimos) como recomendação para projetos novos.
- **bulletproof-react** (~35,8 mil estrelas): código organizado em `src/features/<feature>`; features **não importam umas das outras** (são compostas na camada `app`); fluxo de dependência em um só sentido **shared → features → app**, garantido por ESLint (`import/no-restricted-paths`); sem barrel files.
- **Feature-Sliced Design**: mesma ideia com mais camadas (`shared`, `entities`, `features`, `widgets`, `pages`, `app`). Avaliado e **não adotado** por enquanto: mais rígido e com mais cerimônia do que um projeto tocado por uma pessoa precisa. Se o time crescer, é o próximo passo natural.
- **Ktor (docs oficiais):** para aplicações médias, **agrupar por feature** (rotas, serviço e DTOs juntos); domínio sem dependência de Ktor ou banco; interfaces de repositório no domínio e implementações na infraestrutura; dependências injetadas nas funções de módulo e montadas no `Application.kt`.

### Arquitetura alvo do front (Next.js)
```
src/
  app/                    só rotas: page.tsx finas que buscam dados e compõem features
  features/
    produtos/             busca, página do produto, ranking
    reviews/              feed, review, publicar review
    antes-do-envio/       peças no armazém, opiniões GL/RL
    comunidade/           curtidas, selos, perfis
    perguntas/
    planos/               plano, pontos, desbloqueio
      (cada feature)  components/  hooks/  regras/ (funções puras)  dados/ (acesso a dados da feature)  tipos.ts
  shared/
    ui/                   componentes genéricos (Botao, Etiqueta, Cartao, Galeria, Campo…)
    lib/                  formatação, utilitários sem regra de negócio
  dados/                  camada de acesso a dados: interfaces de repositório + implementação de exemplo hoje, da API amanhã
```

### Regras
1. **Dependência em um só sentido:** `shared` → `features` → `app`. `shared` não conhece features; uma feature não importa outra (se duas precisam conversar, quem compõe é o `app` ou o dado sobe para `shared`). Garantir com regra de ESLint.
2. **Um componente por arquivo**, nome do arquivo igual ao do componente. Arquivos com mais de ~150 linhas são sinal de que algo precisa ser dividido.
3. **Página fina:** `page.tsx` busca os dados e monta a tela com componentes; não tem regra de negócio nem JSX longo.
4. **Regra de negócio em funções puras** (`regras/`), sem React, testáveis e fáceis de portar para Kotlin.
5. **Inversão de dependência (SOLID D):** telas e features dependem de interfaces de repositório (`ProdutoRepositorio`, `ReviewRepositorio`…), não de `dados.ts`. Hoje a implementação usa os dados de exemplo; depois, a API em Ktor, sem mexer nas telas.
6. **Responsabilidade única (SOLID S):** cada arquivo faz uma coisa: um componente, um hook, um conjunto de regras de um assunto, um repositório.
7. **DRY:** padrões repetidos (chips, botões, cartões, campos de formulário, listas com filtro) viram componentes em `shared/ui`. Antes de criar, procurar se já existe.
8. **Componentes de servidor por padrão;** `"use client"` só na menor parte que precisa de estado ou clique.
9. **Sem barrel files** (`index.ts` reexportando tudo): importar o arquivo direto.
10. **Estado do cliente isolado:** o estado da demonstração é dividido por assunto (pontos, curtidas, medidas…), com ações pequenas, em vez de um único store gigante.

### Micro frontend: avaliado e não adotado
- **O que é no Next.js:** Multi-Zones, ou seja, o site dividido em várias aplicações Next separadas, servidas no mesmo domínio e publicadas de forma independente (guia "Multi-zones" na documentação instalada).
- **Por que não agora:**
  - micro frontend resolve um problema de **times independentes**, e o projeto tem um desenvolvedor;
  - navegar entre zonas **recarrega a página inteira**, e o Provado é muito interligado (review → produto → peça antes do envio → perfil de quem escreveu), então quase toda navegação cruzaria zonas;
  - cabeçalho, login, pontos, plano, selos e componentes visuais teriam de virar pacotes compartilhados ou ser duplicados, o que vai contra o DRY;
  - vários builds, deploys e configurações para uma pessoa manter.
- **O que usamos no lugar:** a arquitetura por feature acima, que dá o mesmo isolamento dentro de uma única aplicação.
- **Quando reavaliar:** se houver times separados publicando partes diferentes do site, ou uma área com público, login e navegação próprios. O melhor candidato é um futuro painel para lojas parceiras. Como cada feature já fica isolada, ela poderia virar uma zona sem reescrever o resto.

### Arquitetura alvo do backend (Ktor)
```
backend/src/main/kotlin/
  Application.kt          monta dependências e instala módulos
  plugins/                serialização, autenticação, CORS, erros
  produto/  review/  antesdoenvio/  comunidade/  pergunta/   (uma pasta por feature)
    dominio/              modelos, regras e interfaces de repositório (sem Ktor, sem banco)
    dados/                implementação dos repositórios (Exposed)
    rotas/                rotas HTTP e DTOs
  compartilhado/          leitor de links, formatação, utilitários
```
Injeção de dependência pelas funções de módulo, sem framework no começo; Koin se a quantidade de dependências crescer.

---

## 2. O problema e a ideia

Pessoas que importam produtos da China (direto com a loja, por catálogo, ou por agentes como a CSSBuy) gravam vídeos, tiram fotos e escrevem relatos quando recebem os produtos. Isso acontece em comunidades de WhatsApp e Discord, e tem dois problemas:

1. **WhatsApp:** em grupos grandes, a review se perde. Ninguém acha a foto de três semanas atrás.
2. **Discord:** as dúvidas ficam presas à mensagem de quem postou. Se o autor não vê, ninguém responde.

**Ideia central:** a review deixa de estar presa a uma conversa e passa a estar presa a um **produto**. Tudo gira em torno de identificar o produto a partir do link (plataforma + ID do item), para juntar as reviews do mesmo item vindas de links diferentes.

**O carro-chefe são as reviews de produtos RECEBIDOS.** A conferência antes do envio (fotos de QC no armazém) é uma etapa secundária, que só existe para compras por agente.

---

## 3. Vocabulário da comunidade

| Termo | Significado | Como usar na interface |
|---|---|---|
| **QC** (Quality Check) | Fotos que o agente tira da peça no armazém antes de enviar ao Brasil | Nas descrições, dizer "fotos do armazém" ou "antes do envio" |
| **GL** (Green Light) | Sinal verde: a peça está boa, pode enviar | Só no carimbo, nos botões de voto e na ajuda, sempre com explicação ("pode enviar") |
| **RL** (Red Light) | Sinal vermelho: tem problema, melhor trocar | Idem ("melhor trocar"), com o motivo (costura, cor…) |
| **Agente** | Empresa que compra na China por você (ex.: CSSBuy) e guarda no armazém | |
| **Armazém** | Onde o agente guarda a peça até você mandar enviar | |
| **Caimento** | Como a peça vestiu: pequena, certa ou grande | |
| **Batch** (lote) | Lote de fabricação de um mesmo modelo. Lojas diferentes vendem batches diferentes, e um tênis pode ser ótimo num batch e ruim em outro ("XE Batch", "GT Batch") | Termo que a comunidade usa e procura; mostrar como "Batch" com explicação ("lote de fabricação") |
| **Linha de frete** | Método de envio do agente para o Brasil (BJ-EUB, HZ-EMS, SH-SAL, JD-EXP, FJ-BR, PostNL…) | Mostrar o código da linha, que é como a comunidade conhece |
| **Haul** | Pacote com várias compras que chegou junto | Na interface, "pacote recebido" |

**Regra de texto pedida pelo Luan:** priorizar linguagem comum. O uso contínuo de QC, GL e RL nas descrições deixa o texto maçante. Esses termos aparecem só onde a comunidade espera vê-los (carimbo, votação, glossário), e sempre com explicação. O componente `Termo` mostra a definição ao tocar.

**Nem toda compra passa pelo armazém.** Compras feitas direto com a loja não têm fotos de QC. A interface sempre trata a conferência antes do envio como etapa opcional, e toda review registra o canal da compra (agente ou "Direto com a loja").

---

## 4. Funcionalidades decididas

### 4.1 Reviews de produtos recebidos (principal)
- Cada review tem: tamanho pedido, caimento (pequeno/certo/grande), altura e peso opcionais, canal da compra, notas por critério, texto e fotos.
- **Notas por critério** (1 a 5): qualidade do material, fiel às fotos, tabela de tamanho, custo-benefício. Nota geral = média dos quatro.
- **Medidas aparecem só em faixas** (ex.: "1,75–1,80 m, 70–80 kg"), nunca o valor exato.
- Review completa (fotos + medidas) vale mais pontos.
- Uma review pode nascer de uma peça mostrada antes do envio: o dono marca "Enviei" e depois "Transformar em review".

### 4.2 Tamanho por corpo parecido e "serve em mim"
- **Corpo parecido:** até 6 cm de altura e 10 kg de diferença (`corpoParecido` em `calculos.ts`).
- **Serve em mim:** entre as pessoas de corpo parecido, o tamanho que mais ficou "certo" (`tamanhoQueServe`). Produtos de tamanho único ficam fora.
- A página do produto mostra a indicação geral de tamanho ("Veste pequeno, peça um acima") para todos.

### 4.3 Antes do envio (conferência no armazém)
- Quem comprou por agente mostra as fotos do armazém e pede opinião.
- A comunidade vota **GL** ou **RL**. No RL, marca o motivo (Costura, Cor diferente, Mancha ou sujeira, Medida fora da tabela, Defeito no material, Acabamento) e pode escrever um comentário.
- Comentários viram **opiniões** listadas na página da peça, com curtidas.
- O dono registra a decisão: enviou, trocou ou devolveu.
- Com o tempo, o site sabe a **taxa de peças reprovadas** por produto e por loja, um dado que não existe em nenhum outro lugar.
- **É gratuito para todos** (decisão do Luan): é a porta de entrada no momento da compra.

### 4.4 Curtidas, selos e destaque
- Dá para curtir reviews e opiniões. Curtir significa "concordo / foi útil".
- **As curtidas valem para quem escreveu:** contam para os selos e rendem pontos (+2 por curtida recebida).
- Selos (`src/lib/selos.ts`):
  - **Avaliador de ouro / prata / bronze:** uma contribuição com 100 / 50 / 20 curtidas. Só o maior aparece.
  - **Resenhista:** 20 reviews. **Detalhista:** 10 reviews completas. **Comprador frequente:** 25 compras. **Olho clínico:** 25 opiniões antes do envio. **Ajuda quem pergunta:** 10 respostas.
- **Destaque:** quem tem selo de avaliador aparece primeiro nas listas (ordem "Em destaque"), e o ouro ganha borda dourada.
- Cada pessoa tem perfil público (`/usuario/[nome]`) com selos e números. O seu perfil mostra o progresso de cada selo.

### 4.5 Perguntas
- Ficam no produto, não presas a uma review. Quem já avaliou o produto recebe aviso para responder. Responder vale pontos.

### 4.6 Busca de produtos
- Busca por nome, marca ou loja: **livre**.
- Filtros **do Plus**: tipo, marca, tamanho disponível, nota mínima e "serve em mim".
- Ordenações: mais bem avaliados (média bayesiana), mais reviews, menor preço. O antigo `/ranking` redireciona para `/produtos`.
- A caixa de busca da tela inicial aceita nome ou link: link vai para o produto; texto vai para a busca.

### 4.7 Ranking
- **Média bayesiana:** `nota = (C × média da categoria + soma das notas) ÷ (C + número de reviews)`, com C = 5. Um produto com uma única nota 5 não passa na frente de outro com dezenas de reviews boas.

### 4.8 Pontos (valores de exemplo, a calibrar, em `src/lib/regras.ts`)
| Ação | Pontos |
|---|---|
| Review completa (fotos + medidas) | +50 |
| Review simples | +20 |
| Resposta a uma pergunta | +10 |
| Opinião antes do envio com motivo ou comentário | +3 |
| Opinião sem comentário | +1 |
| Curtida recebida | +2 |
| Liberar todas as reviews de um produto | −100 |

Pontos servem para liberar reviews sem pagar, virar cupons em lojas parceiras (futuro) e alimentar o perfil. Votos e comentários devem ter limite diário (ainda não implementado).

### 4.9 Planos e receita
- **Gratuito:** até 10 reviews por produto, busca por nome, publicar, perguntar e opinar antes do envio.
- **Plus** (R$ 9,90/mês, valor de exemplo): todas as reviews, filtro por corpo parecido, filtros avançados (tamanho, caimento, agente) e os filtros da busca.
- Quem contribui consegue ver tudo usando pontos; o Plus é para quem só consulta.
- **Receita:** (1) parceria com lojas chinesas para divulgação (vitrine, destaque marcado como "Patrocinado", cupons); (2) plano Plus.
- **Regra inegociável:** patrocínio nunca altera notas, reviews, taxa de reprovação ou posição no ranking.

### 4.10 Ajuda e tutorial
- `/ajuda`: passo a passo em 4 etapas, legenda GL/RL com carimbos, glossário e perguntas frequentes.
- Tutorial curto "Primeira vez por aqui?" na tela inicial, que some com "Entendi".

### 4.11 Fotos
- Galeria em tela cheia com zoom no ponto tocado, + e −, setas do teclado e miniaturas (`Galeria.tsx`).

---

## 4.12 Backlog priorizado (vindo da análise da comunidade no Discord, out. 2026)

O Luan mostrou prints da comunidade Fugazzi Culture no Discord (canais `compras`, `review`, `pacotes-recebidos`, `pedir-link`, `dúvidas`, `chat-geral`). Estas são as funcionalidades que saíram dessa análise, para implementar depois, cada uma em branch própria e PRs pequenos.

### Prioridade 1: Batch (lote) do produto — **mais importante para o público**
O que a comunidade faz hoje: títulos como "Nike Vomero Premium — XE Batch" e "GT Batch", posts como "Review On Cloud — Análise de 5 batch diferentes" e respostas como "essa versão está vindo muito boa, bem consolidada". **Um mesmo modelo pode ser ótimo num batch e ruim em outro, e essa informação é ouro para quem compra.**
- O produto passa a ter **batches**: o produto é o modelo; cada batch tem nome, lojas que vendem, faixa de preço, nota, caimento e peças reprovadas próprios.
- Review e peça antes do envio passam a indicar o batch.
- **Comparação lado a lado** dos batches de um modelo: notas por critério, tamanho, preço, peças reprovadas e fotos.
- Página do produto mostra "melhor batch hoje" e alerta quando um batch piora (mais reprovações recentes).
- Filtro por batch nas reviews e na busca.
- Adicionar **Batch** ao glossário do site (`src/lib/glossario.ts`) e à ajuda.
- Risco: "batch" é vocabulário típico do mercado de réplicas. Reforça o item jurídico da seção 6.

### Prioridade 2: Pacotes recebidos, frete e taxação
O que a comunidade faz hoje: posts em `pacotes-recebidos` com peso, método de envio, data de envio e de chegada, se foi taxado e o valor, frete em ¥, e tags de região (Sudeste, Nordeste…), faixa de peso (0 a 3 kg, 3 a 5 kg…) e linha de frete. A pergunta mais comum nos canais de conversa é "qual frete está melhor?".
- Nova entidade **pacote**: reúne várias compras, com linha de frete, peso, região, datas, frete pago e taxa paga.
- **Página por linha de frete** com tempo médio até chegar, percentual de pacotes taxados e taxa média por kg, separados por região e faixa de peso.
- Filtros por região e faixa de peso.
- Sobre declaração e taxas (canais `ajuda-declaração` e `taxas-declaração`, muito movimentados): mostrar **dados da comunidade**, nunca orientação fiscal.

### Prioridade 3: Reviews com mais estrutura
- **Critérios por categoria** (ex.: óculos avaliam qualidade, peso, estojo e detalhes; tênis, conforto, acabamento, fidelidade…), em vez dos mesmos quatro critérios para tudo.
- **Estágio da review:** "Primeiras impressões" e "Usado e testado", com a possibilidade de **atualizar** a review depois de meses de uso (linha do tempo da review).
- Vídeo por link já previsto; aparece bastante.

### Prioridade 4: Pedir link (achar onde comprar)
O que a comunidade faz hoje: em `pedir-link`, a pessoa posta a foto de uma peça e pergunta onde comprar; outros respondem com links.
- Pedido com foto; respostas com links; cada link vira (ou aponta para) a página do produto e do batch.
- Alimenta o catálogo sozinho.

### Ajustes menores (podem entrar junto com os itens acima)
- **Leitor de links:** links curtos da CSSBuy (`cssb.uy/...`), Goofish/Xianyu e catálogos Yupoo de lojas.
- **Formulário guiado** no estilo do "Guia de postagem" fixado no Discord: campos certos por categoria (preço, tamanho, peso, link, tempo de espera, medidas).
- **Dados da compra** antes do envio: preço pago, faixa de preço e tempo de espera até chegar no armazém, gerando números por loja.
- **Seguir** produto, batch ou peça, com aviso de novidades.
- **Filtro por região** em reviews e pacotes.
- Eventos e sorteios da comunidade (o Discord tem canal de evento): avaliar depois.

## 5. Fora do MVP (próximas fases)

- **Provador virtual com IA:** depende de APIs pagas, custo por uso e resultado irregular. O filtro por corpo parecido com fotos reais entrega boa parte do valor por enquanto.
- Upload de vídeo próprio (no MVP, só link do YouTube/TikTok).
- Aplicativo mobile.
- Bot no Discord que transforma reviews postadas em páginas do site.
- Moderação avançada, compra verificada (print do pedido), seguir produto.

---

## 6. Riscos já identificados

- **Site vazio no lançamento:** começar por uma comunidade parceira, com 30 a 50 reviews reais publicadas antes da abertura.
- **Atrito para publicar:** criar review precisa ser quase tão rápido quanto postar no WhatsApp.
- **Réplicas e questões jurídicas:** parte desse mercado envolve réplicas. Receber dinheiro de lojas que vendem réplicas para divulgá-las é especialmente arriscado. Levar a um advogado antes de lançar. Por isso, os dados de exemplo usam **marcas e lojas fictícias**.
- **Dados pessoais (LGPD):** altura e peso são opcionais, exibidos em faixas, e o uso precisa estar claro nos termos, principalmente porque viraram recurso pago.
- **Limite de 10 reviews cedo demais:** no começo quase nenhum produto passa de 10; o paywall só faz sentido com volume.
- **Cobrar pelo que a comunidade escreveu:** quem contribui nunca precisa pagar para ler (pontos).
- **Credibilidade com lojas pagantes:** reviews ruins de lojas parceiras continuam visíveis; isso precisa estar no contrato.

**Métricas de validação:** perguntas respondidas em até 24 h (comparar com o Discord), reviews por semana na comunidade parceira, buscas por link que encontram ao menos uma review, tempo até a primeira opinião numa peça, quantas peças viram review.

**Decisões em aberto com os sócios:** nome, comunidade parceira de lançamento, política de conteúdo sobre réplicas, preços (Plus e lojas), quando o limite de 10 reviews passa a valer.

---

## 7. Estado atual: protótipo navegável (só front-end)

O que existe hoje é um **protótipo para vender a ideia**: todas as telas funcionam, mas os dados são de exemplo e o que a pessoa publica fica salvo só no navegador (`localStorage`). Não há backend.

### Stack
- **Next.js 16** (App Router) + **React 19** + **TypeScript** + **Tailwind CSS 4**.
- Fontes self-hosted via `@fontsource-variable` (Bricolage Grotesque para títulos, Instrument Sans para texto). Não usar `next/font/google`: o ambiente de build usado até aqui bloqueia o Google Fonts.
- Sem bibliotecas de estado, UI ou ícones. Ícones são SVGs pequenos escritos à mão.

### Convenções do Next.js 16 usadas (ler `node_modules/next/dist/docs/` antes de mudar)
- `cacheComponents: true` e `partialPrefetching: true` no `next.config.ts` (padrão do create-next-app).
- `params` e `searchParams` são **assíncronos** (`await props.params`). Tipos com os helpers globais `PageProps<"/rota">` e `LayoutProps<"/">`; rode `npx next typegen` ao criar rotas novas.
- Com Cache Components, a parte da página que lê `searchParams` fica dentro de `<Suspense>` (padrão: página síncrona + componente assíncrono `Resultado`/`Lista`/`Formulario` dentro do Suspense).
- Rotas dinâmicas do catálogo usam `generateStaticParams`. IDs fora do catálogo (coisas que você publicou no navegador) caem em componentes cliente de fallback (`QcLocal`).
- Componentes são de servidor por padrão; `"use client"` só onde há estado, clique ou `localStorage`.
- Páginas (`page.tsx`) não podem exportar nada além do componente, `metadata`, `generateMetadata` e `generateStaticParams`. Constantes vão para `src/lib`.
- Módulos importados por componentes de servidor não podem importar hooks do React. Por isso as regras de pontos ficam em `regras.ts`, separado de `demo.ts`.

### Estrutura
```
src/
  app/
    page.tsx               início: busca, reviews em alta, mais bem avaliados, avaliadores, antes do envio, lojas parceiras
    buscar/                recebe o texto da busca: link → produto; texto → /produtos?q=
    produtos/              busca de produtos (filtros do Plus)
    produto/[id]/          página do produto: galeria, notas, tamanho, serve em mim, abas (reviews, antes do envio, perguntas)
    reviews/               feed de reviews (tipo, ordem, "ver mais")
    review/[id]/           página de uma review
    review/nova/           publicar review (?produto=, ?link=, ?qc=)
    qc/                    antes do envio: lista, peça (/qc/[id]) e mostrar peça (/qc/novo)
    usuario/[nome]/        perfil público com selos
    perfil/                seu perfil: pontos, medidas, selos, peças, reviews, extrato
    loja/[id]/  planos/  ajuda/  ranking/ (redireciona)  not-found.tsx
  components/
    Cabecalho, BuscaLink, BoasVindas, Termo, Abas
    Cartoes (CartaoProduto, CartaoQc, PlacarQc, CartaoReview, BarrasNotas)
    Galeria (zoom), ArteProduto (foto de exemplo desenhada em SVG), Carimbo (GL/RL)
    Selos (SeloChip, Autor), BotaoCurtir, Opinioes (CartaoOpiniao)
    SecaoReviews (filtros Plus + limite gratuito), SecaoPerguntas, ServeEmMim, MinhasMedidas
    BuscaProdutos, VotacaoQc, DetalheQc, QcLocal, QcsLocais, MinhasReviews
    FormReview, FormQc, CampoFotos, Formulario, EscolhaPlano, PainelPerfil
  lib/
    tipos.ts      modelos (viram as data classes do backend)
    link.ts       leitor de links → (plataforma, itemId)
    calculos.ts   notas, média bayesiana, caimento, corpo parecido, serve em mim, taxa de reprovação
    regras.ts     pontos e limite do plano gratuito
    selos.ts      regras dos selos e nível de destaque
    pessoas.ts    estatísticas e selos de cada pessoa, ordenação "em destaque"
    dados.ts      dados de exemplo gerados com semente fixa
    resumos.ts    dados + cálculos prontos para as telas (ranking, resumo do produto)
    demo.ts       estado da demonstração no navegador (useDemo + ações)
    glossario.ts  ajuda.ts   textos da ajuda
    formato.ts    datas, notas, preço em ¥ e R$, plural
    imagens.ts    reduz fotos enviadas antes de guardar
```

### Leitor de links (`src/lib/link.ts`)
Peça central do sistema. Reconhece:
- Taobao/Tmall: `item.taobao.com/item.htm?id=123`
- Weidian: `weidian.com/item.html?itemID=123`
- 1688: `detail.1688.com/offer/123.html`
- CSSBuy: `item-123.html` (Taobao), `item-micro-123.html` (Weidian), `item-1688-123.html` (1688)
- Outros agentes: parâmetro `url=` com o link original.

### Dados de exemplo (`src/lib/dados.ts`)
- 6 lojas, 10 produtos, marcas e pessoas **fictícias**. Datas relativas a um "hoje" fixo (7 out. 2026).
- Reviews, peças no armazém, opiniões e histórico das pessoas são gerados com semente fixa (mulberry32), então saem iguais no servidor e no navegador.
- `POPULARIDADE` define quem recebe muitas curtidas (rafa.importa e bia.streetwear são ouro; marcelo.k e caio.br, prata; duda.santos e henrique, bronze).
- As fotos são desenhos SVG por categoria e ângulo (`ArteProduto`); fotos enviadas são reduzidas e guardadas como data URL.

### Estado da demonstração (`src/lib/demo.ts`)
- `useSyncExternalStore` + `localStorage` (chave `provado-demo-v2`). Servidor e primeiro render usam o estado inicial.
- Guarda: pontos (começa com 120), plano, extrato, votos, opiniões, curtidas, reviews, peças, perguntas, respostas, produtos liberados, medidas e tutorial visto.
- Ações: `votar`, `curtir`, `publicarReview`, `publicarQc`, `mudarDecisao`, `perguntar`, `responder`, `desbloquear`, `mudarPlano`, `salvarMedidas`, `fecharTutorial`, `recomecar`.
- Ao mudar o formato do estado, troque a versão da chave para não ler dados velhos.

### Identidade visual
- Tema de "galpão de conferência": fundo cinza-frio, tinta azul-marinho, cobalto para ações, amarelo de fita adesiva para status e patrocínio, carimbos GL (verde) e RL (vermelho) como elemento de identidade.
- Tokens em `src/app/globals.css` (`@theme`): `papel`, `cartao`, `tinta`, `apagado`, `linha`, `cobalto`, `fita`, `gl`, `rl`, `prata`, `bronze`.
- Tema claro apenas, por escolha, para simplificar.
- Evitar rótulos em caixa alta, listas numeradas sem sequência real e "→" em botões.

### Como rodar e verificar
```bash
npm install
npm run dev        # http://localhost:3000
npm run lint
npm run build
```
O README tem um roteiro de demonstração em 8 passos para apresentar aos sócios.

---

## 8. Próximos passos técnicos

Stack decidida para a versão real:
- **Front:** continua em Next.js (padrão de mercado; facilita trazer outros devs).
- **Backend:** **Kotlin + Ktor**, porque o Luan quer entender o que está sendo feito. Banco **PostgreSQL** com **Exposed**. Fotos no **Cloudflare R2** com upload direto por URL assinada. Login com Google ou Discord (OAuth do Ktor).
- O Next repassa `/api/*` para o Ktor (rewrites), para ficar tudo no mesmo domínio e o cookie de login funcionar sem CORS.

Ordem sugerida:
1. Portar `link.ts` e `calculos.ts` para Kotlin, com testes unitários usando links reais das comunidades.
2. Banco e endpoint `GET /api/produto?link=...`.
3. Trocar `dados.ts` por chamadas à API e `demo.ts` por login e dados reais.
4. Publicar no Vercel (front) para os sócios abrirem por link.

---

## 9. Repositório e fluxo

- GitHub: `luangs7/provado` (branch `main`). O repositório nasceu com um LICENSE; os commits do protótipo foram colocados por cima.
- Cópia local do Luan: `~/Development/provado`.
- Mensagens de commit em português, descrevendo o que mudou para quem usa.
- **Deploy:** o repositório está ligado ao Vercel (desde out. 2026). Com a integração padrão do Vercel com o GitHub, push na `main` publica em produção e push em outra branch gera uma prévia com link próprio.
- **Regra do Luan: ao terminar cada alteração, perguntar duas coisas antes de agir:**
  1. **Vamos subir?** Se sim, em uma branch nova ou direto na `main`?
  2. **Vamos fazer o deploy?**
  Não fazer push nem deploy sem as duas respostas.

### Branches, commits e PRs (regra do Luan)
- **Toda implementação em uma branch com nome da feature**, criada a partir da `main` atualizada:
  `feature/<nome>`, `fix/<nome>`, `refactor/<nome>`, `docs/<nome>`, `chore/<nome>`, `ci/<nome>` (nome em português, minúsculo, com hífen; ex.: `feature/curtidas-em-opinioes`).
- **Tudo em porções pequenas**, para facilitar revisão, visualização e rollback:
  - um commit por passo lógico (nada de "commit de tudo no fim");
  - um PR por assunto; PR grande deve ser quebrado em PRs encadeados;
  - referência de tamanho: até ~300 linhas alteradas por PR, fora arquivos gerados.
- **Mensagens no padrão Conventional Commits**, com descrição em português: `feat: curtidas em opiniões`, `fix: tamanho único fora do serve em mim`, `refactor: separa CartaoReview em arquivo próprio`, `docs:`, `test:`, `ci:`, `chore:`.
- **Merge na `main` só por PR**, com os gates da CI passando. Merge do tipo squash: cada PR vira um commit na `main`, e o rollback é reverter esse commit.

### CI/CD com GitHub Actions (planejado, ainda não implementado)
Objetivo: nada chega à produção sem passar pelos gates, e o deploy no Vercel é feito pela pipeline, não pela integração automática do Vercel.

**Gates do PR (`ci.yml`, em todo PR para a `main`), jobs em paralelo:**
1. **Qualidade:** `npm ci` com cache, ESLint (inclui a regra de fronteiras entre features), checagem de formatação (Prettier) e TypeScript (`tsc --noEmit`, depois de `next typegen`).
2. **Testes unitários:** Vitest nas regras puras (leitor de links, cálculos, selos, pontos), com relatório de cobertura.
3. **Build:** `next build`.
4. **Testes de ponta a ponta:** Playwright no build, cobrindo os fluxos principais (busca por link, review, curtir, opinião antes do envio, Plus e serve em mim), em desktop e celular.
5. **Segurança:** `npm audit` (falha em vulnerabilidade alta), Dependency Review nas dependências novas e CodeQL.
6. **Higiene do PR:** nome da branch no padrão, título no padrão Conventional Commits e aviso quando o PR passar do tamanho de referência.

**Deploy (`deploy.yml`), seguindo o guia oficial do Vercel para GitHub Actions:**
- **Prévia:** em cada PR, depois dos gates, `vercel pull --environment=preview`, `vercel build` e `vercel deploy --prebuilt`; o link da prévia é comentado no PR.
- **Produção:** no merge na `main`, depois dos gates, `vercel build --prod` e `vercel deploy --prebuilt --prod`, num GitHub Environment `production` com **aprovação manual** (é a resposta para "vamos fazer o deploy?").
- **Depois do deploy:** smoke test com Playwright contra a URL publicada. Se falhar, `vercel rollback` para a versão anterior.
- **Segredos:** `VERCEL_TOKEN`, `VERCEL_ORG_ID` e `VERCEL_PROJECT_ID` como secrets do repositório.
- **`vercel.json` com `"git": { "deploymentEnabled": false }`**, para o Vercel não publicar sozinho a cada push e não duplicar o deploy da pipeline.

**Proteção da `main` no GitHub:** exigir PR, exigir os checks da CI, exigir branch atualizada, bloquear push direto e force push.

**Manutenção:** Dependabot semanal para npm e para as actions, em PRs pequenos.

**Ordem de implementação (um PR por item):**
1. `ci/gates-de-qualidade`: workflow com lint, tipos e build.
2. `chore/prettier`: Prettier e checagem de formatação no CI.
3. `test/vitest-regras`: Vitest e testes das regras puras.
4. `test/playwright-fluxos`: testes de ponta a ponta e job no CI.
5. `ci/seguranca`: audit, Dependency Review, CodeQL e Dependabot.
6. `ci/higiene-de-pr`: checagem de nome de branch, título e tamanho.
7. `ci/deploy-vercel`: prévia por PR, produção com aprovação, smoke test e rollback; desliga o deploy automático do Vercel.
8. Configurar a proteção da `main` (feito pelo Luan nas configurações do GitHub).
- Antes de subir: `npm run lint` e `npm run build` sem erros.
