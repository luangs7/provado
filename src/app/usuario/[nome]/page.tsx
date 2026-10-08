import { notFound } from "next/navigation";
import { CartaoReview } from "@/components/Cartoes";
import { CartaoOpiniao } from "@/components/Opinioes";
import { SeloChip } from "@/components/Selos";
import { AUTORES, buscarProduto, buscarUsuario } from "@/lib/dados";
import { estatisticasDe, opinioesDoAutor, reviewsDoAutor, selosDoAutor } from "@/lib/pessoas";

export function generateStaticParams() {
  return AUTORES.map((nome) => ({ nome }));
}

export async function generateMetadata(props: PageProps<"/usuario/[nome]">) {
  const { nome } = await props.params;
  return { title: decodeURIComponent(nome) };
}

export default async function PerfilPublico(props: PageProps<"/usuario/[nome]">) {
  const { nome: bruto } = await props.params;
  const nome = decodeURIComponent(bruto);
  const usuario = buscarUsuario(nome);
  if (!usuario) notFound();

  const e = estatisticasDe(nome);
  const selos = selosDoAutor(nome);
  const reviews = reviewsDoAutor(nome);
  const opinioes = opinioesDoAutor(nome);

  return (
    <div className="flex flex-col gap-12">
      <header className="flex flex-col gap-4">
        <div className="flex items-center gap-4">
          <span className="grid size-16 place-items-center rounded-full bg-tinta font-display text-2xl font-bold uppercase text-cartao">
            {nome[0]}
          </span>
          <div>
            <h1 className="text-3xl font-extrabold">{nome}</h1>
            <p className="text-apagado">No Provado desde {usuario.desde}</p>
          </div>
        </div>
        {selos.length > 0 && (
          <ul className="flex flex-wrap gap-2">
            {selos.map((s) => (
              <li key={s.id}>
                <SeloChip selo={s} grande />
              </li>
            ))}
          </ul>
        )}
      </header>

      <dl className="grid grid-cols-2 gap-4 sm:grid-cols-5">
        <Numero rotulo="Reviews" valor={e.reviews} />
        <Numero rotulo="Curtidas recebidas" valor={e.curtidasRecebidas} />
        <Numero rotulo="Compras" valor={e.compras} />
        <Numero rotulo="Opiniões antes do envio" valor={e.opinioes} />
        <Numero rotulo="Respostas" valor={e.respostas} />
      </dl>

      {selos.length > 0 && (
        <section className="flex flex-col gap-3">
          <h2 className="text-2xl font-bold">Selos</h2>
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {selos.map((s) => (
              <li key={s.id} className="flex flex-col gap-1.5 rounded-lg border border-linha bg-cartao p-4">
                <SeloChip selo={s} />
                <span className="text-sm text-apagado">{s.descricao}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="flex flex-col gap-4">
        <h2 className="text-2xl font-bold">Reviews de produtos recebidos</h2>
        {reviews.length === 0 ? (
          <p className="text-apagado">Nenhuma review recente.</p>
        ) : (
          <div className="grid gap-4 lg:grid-cols-2">
            {reviews.map((r) => (
              <CartaoReview key={r.id} review={r} produto={buscarProduto(r.produtoId)!} comProduto resumida />
            ))}
          </div>
        )}
      </section>

      {opinioes.length > 0 && (
        <section className="flex flex-col gap-4">
          <h2 className="text-2xl font-bold">Opiniões sobre peças antes do envio</h2>
          <div className="grid gap-3 lg:grid-cols-2">
            {opinioes.map((o) => (
              <CartaoOpiniao key={o.id} opiniao={o} comLink />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function Numero({ rotulo, valor }: { rotulo: string; valor: number }) {
  return (
    <div className="flex flex-col gap-1 rounded-lg border border-linha bg-cartao p-4">
      <dt className="text-sm text-apagado">{rotulo}</dt>
      <dd className="font-display text-3xl font-extrabold tabular-nums">{valor}</dd>
    </div>
  );
}
