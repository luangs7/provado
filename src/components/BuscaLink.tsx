// Campo de busca: aceita o nome do produto ou o link (Taobao, Weidian, 1688, agente).
// Usa o <Form> do Next: envia por GET para /buscar, que decide entre busca e link.

import Form from "next/form";

export default function BuscaLink({ grande = false, valor = "" }: { grande?: boolean; valor?: string }) {
  return (
    <Form action="/buscar" className={`flex w-full flex-col gap-2 sm:flex-row ${grande ? "" : "max-w-md"}`}>
      <label htmlFor={grande ? "link-grande" : "link"} className="sr-only">
        Produto ou link
      </label>
      <input
        id={grande ? "link-grande" : "link"}
        name="link"
        type="text"
        required
        defaultValue={valor}
        placeholder="Busque um produto ou cole o link"
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
        Buscar
      </button>
    </Form>
  );
}
