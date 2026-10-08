import Link from "next/link";
import { notFound } from "next/navigation";
import Abas from "@/components/Abas";
import { BarrasNotas, CartaoQc } from "@/components/Cartoes";
import Galeria from "@/components/Galeria";
import QcsLocais from "@/components/QcsLocais";
import SecaoPerguntas from "@/components/SecaoPerguntas";
import SecaoReviews from "@/components/SecaoReviews";
import ServeEmMim from "@/components/ServeEmMim";
import Termo from "@/components/Termo";
import { ANGULOS, CATEGORIAS, buscarProduto, perguntasDo, produtos, qcsDo, reviewsDo } from "@/lib/dados";
import { mediaPorCriterio, recomendacaoTamanho, resumoCaimento } from "@/lib/calculos";
import { formatarNota, formatarPorcentagem, formatarPreco, plural } from "@/lib/formato";
import { NOMES_PLATAFORMA } from "@/lib/link";
import { resumoDoProduto } from "@/lib/resumos";

// Gera as páginas de todos os produtos do catálogo no build
export function generateStaticParams() {
  return produtos.map((p) => ({ id: p.id }));
}

export async function generateMetadata(props: PageProps<"/produto/[id]">) {
  const { id } = await props.params;
  const produto = buscarProduto(id);
  return { title: produto ? `${produto.titulo}: reviews` : "Produto não encontrado" };
}

export default async function PaginaProduto(props: PageProps<"/produto/[id]">) {
  const { id } = await props.params;
  const produto = buscarProduto(id);
  if (!produto) notFound();

  const { loja, nota, totalReviews, rl } = resumoDoProduto(produto);
  const reviews = reviewsDo(produto.id);
  const qcs = qcsDo(produto.id);
  const preco = formatarPreco(produto.precoYuan);
  const tamanhoUnico = produto.tamanhos.length === 1;
  const caimento = resumoCaimento(reviews);

  return (
    <div className="flex flex-col gap-10">
      <nav className="text-sm text-apagado" aria-label="Você está em">
        <Link href={`/produtos?q=${encodeURIComponent(CATEGORIAS[produto.categoria])}`} className="hover:text-tinta hover:underline">
          {CATEGORIAS[produto.categoria]}
        </Link>
      </nav>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,26rem)_1fr]">
        <Galeria fotos={ANGULOS[produto.categoria]} categoria={produto.categoria} cor={produto.cor} formato="produto" titulo={produto.titulo} />

        <div className="flex min-w-0 flex-col gap-6">
          <div className="flex flex-col gap-2">
            <p className="font-semibold text-apagado">{produto.marca}</p>
            <h1 className="text-3xl font-extrabold leading-tight sm:text-4xl">{produto.titulo}</h1>
            <p className="text-apagado">
              <Link href={`/loja/${loja.id}`} className="font-semibold text-tinta hover:underline">
                {loja.nome}
              </Link>{" "}
              no {NOMES_PLATAFORMA[produto.plataforma]}, item {produto.itemId}
            </p>
            <p>
              <span className="font-display text-2xl font-bold">{preco.yuan}</span>{" "}
              <span className="text-apagado">{preco.reais}</span>
              <span className="ml-3 text-sm text-apagado">Cor {produto.corNome.toLowerCase()}</span>
            </p>
          </div>

          <div className="grid gap-6 rounded-lg border border-linha bg-cartao p-5 sm:grid-cols-[auto_1fr]">
            <div className="flex flex-col">
              <span className="font-display text-6xl font-extrabold leading-none tabular-nums">{formatarNota(nota)}</span>
              <span className="mt-1 text-sm text-apagado">{plural(totalReviews, "review", "reviews")}</span>
              {rl && (
                <span className="mt-3 text-sm">
                  <span className="font-semibold">
                    <Termo id="taxa-rl">{formatarPorcentagem(rl.taxa)} reprovadas</Termo>
                  </span>
                  <span className="block text-apagado">
                    antes do envio, em {plural(rl.total, "peça conferida", "peças conferidas")}
                  </span>
                </span>
              )}
            </div>
            <BarrasNotas notas={mediaPorCriterio(reviews)} />
          </div>

          {!tamanhoUnico && (
            <div className="flex flex-col gap-3">
              <h2 className="text-lg font-bold">{recomendacaoTamanho(reviews)}</h2>
              <div className="flex h-7 overflow-hidden rounded text-xs font-semibold" role="img" aria-label={`Ficou pequeno ${formatarPorcentagem(caimento.pequeno)}, certo ${formatarPorcentagem(caimento.certo)}, grande ${formatarPorcentagem(caimento.grande)}`}>
                <Segmento valor={caimento.pequeno} cor="bg-rl-claro text-rl" rotulo="Pequeno" />
                <Segmento valor={caimento.certo} cor="bg-gl-claro text-gl" rotulo="Certo" />
                <Segmento valor={caimento.grande} cor="bg-cobalto-claro text-cobalto-escuro" rotulo="Grande" />
              </div>
            </div>
          )}

          {!tamanhoUnico && <ServeEmMim reviews={reviews} />}

          <div className="flex flex-wrap gap-2">
            <Link href={`/review/nova?produto=${produto.id}`} className="rounded-md bg-cobalto px-4 py-2.5 font-semibold text-white hover:bg-cobalto-escuro">
              Publicar review
            </Link>
            <Link href={`/qc/novo?produto=${produto.id}`} className="rounded-md border-2 border-tinta px-4 py-2 font-semibold hover:bg-cartao">
              Pedir opinião antes do envio
            </Link>
          </div>
        </div>
      </div>

      <Abas
        abas={[
          {
            id: "reviews",
            rotulo: `Reviews (${reviews.length})`,
            conteudo: <SecaoReviews produto={produto} reviews={reviews} />,
          },
          {
            id: "qc",
            rotulo: `Antes do envio (${qcs.length})`,
            conteudo: (
              <div className="flex flex-col gap-6">
                <p className="max-w-2xl text-apagado">
                  Fotos que o agente tirou de outras unidades deste produto no armazém, antes de enviar. Veja o que a
                  comunidade aprovou e reprovou e compare com a sua peça.
                </p>
                <QcsLocais produtoId={produto.id} titulo="Suas peças deste produto" />
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {qcs.map((qc) => (
                    <CartaoQc key={qc.id} qc={qc} produto={produto} titulo={`Peça de ${qc.autor}`} />
                  ))}
                </div>
              </div>
            ),
          },
          {
            id: "perguntas",
            rotulo: `Perguntas (${perguntasDo(produto.id).length})`,
            conteudo: <SecaoPerguntas produtoId={produto.id} perguntas={perguntasDo(produto.id)} avisados={totalReviews} />,
          },
        ]}
      />
    </div>
  );
}

function Segmento({ valor, cor, rotulo }: { valor: number; cor: string; rotulo: string }) {
  if (valor === 0) return null;
  return (
    <span className={`flex items-center px-2 ${cor}`} style={{ width: `${valor * 100}%` }}>
      <span className="truncate">
        {rotulo} {formatarPorcentagem(valor)}
      </span>
    </span>
  );
}
