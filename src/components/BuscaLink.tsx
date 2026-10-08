// Campo "cole o link". Usa o <Form> do Next: envia por GET para /buscar
// e navega sem recarregar a página.

import Form from "next/form";

export default function BuscaLink({ grande = false, valor = "" }: { grande?: boolean; valor?: string }) {
  return (
    <Form action="/buscar" className={`flex w-full flex-col gap-2 sm:flex-row ${grande ? "" : "max-w-md"}`}>
      <label htmlFor={grande ? "link-grande" : "link"} className="sr-only">
        Link do produto
      </label>
      <input
        id={grande ? "link-grande" : "link"}
        name="link"
        type="text"
        required
        defaultValue={valor}
        placeholder="Cole o link do Taobao, Weidian, 1688 ou do agente"
        className={`w-full min-w-0 rounded-md sm:flex-1 border-2 border-tinta bg-cartao px-3 text-tinta placeholder:text-apagado ${
          grande ? "h-14 text-base sm:text-lg" : "h-10 text-sm"
        }`}
      />
      <button
        type="submit"
        className={`rounded-md bg-cobalto px-5 font-semibold text-white hover:bg-cobalto-escuro ${
          grande ? "h-14 text-base" : "h-10 text-sm"
        }`}
      >
        Ver reviews
      </button>
    </Form>
  );
}
