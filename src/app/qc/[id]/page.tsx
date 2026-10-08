import DetalheQc from "@/components/DetalheQc";
import QcLocal from "@/components/QcLocal";
import { buscarProduto, buscarQc, qcs } from "@/lib/dados";

export function generateStaticParams() {
  return qcs.map((q) => ({ id: q.id }));
}

export async function generateMetadata(props: PageProps<"/qc/[id]">) {
  const { id } = await props.params;
  const qc = buscarQc(id);
  const produto = qc?.produtoId ? buscarProduto(qc.produtoId) : undefined;
  return { title: produto ? `QC: ${produto.titulo}` : "QC" };
}

export default async function PaginaQc(props: PageProps<"/qc/[id]">) {
  const { id } = await props.params;
  const qc = buscarQc(id);

  // QC que não está no catálogo: pode ser um que você postou neste navegador
  if (!qc) return <QcLocal id={id} />;

  return <DetalheQc qc={qc} produto={qc.produtoId ? buscarProduto(qc.produtoId) : undefined} />;
}
