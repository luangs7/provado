import BuscaLink from "@/components/BuscaLink";

export default function NaoEncontrado() {
  return (
    <div className="flex max-w-xl flex-col gap-4">
      <h1 className="text-4xl font-extrabold">Página não encontrada</h1>
      <p className="text-apagado">O endereço pode estar errado ou o produto ainda não tem página. Tente buscar pelo link do produto.</p>
      <BuscaLink />
    </div>
  );
}
