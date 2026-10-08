import Link from "next/link";
import Carimbo from "@/components/Carimbo";
import { PASSOS, PERGUNTAS_FREQUENTES } from "@/lib/ajuda";
import { GLOSSARIO } from "@/lib/glossario";

export const metadata = { title: "Como funciona" };

export default function Ajuda() {
  return (
    <div className="flex flex-col gap-16">
      <div className="flex max-w-2xl flex-col gap-3">
        <h1 className="text-4xl font-extrabold sm:text-5xl">Como funciona o Provado</h1>
        <p className="text-lg text-apagado">
          Um lugar para encontrar e publicar reviews de produtos importados da China, organizadas por produto. Tudo o que
          hoje se perde nos grupos de WhatsApp e Discord fica guardado na página certa.
        </p>
      </div>

      <section className="flex flex-col gap-5">
        <h2 className="text-2xl font-bold">Em quatro passos</h2>
        <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {PASSOS.map((p, i) => (
            <li key={p.titulo} className="flex flex-col gap-2 rounded-lg border border-linha bg-cartao p-5">
              <span className="font-display text-4xl font-extrabold text-cobalto">{i + 1}</span>
              <h3 className="text-lg font-bold leading-snug">{p.titulo}</h3>
              <p className="text-apagado">{p.texto}</p>
              <Link href={p.acao.href} className="mt-auto pt-2 font-semibold text-cobalto hover:underline">
                {p.acao.rotulo}
              </Link>
            </li>
          ))}
        </ol>
      </section>

      <section className="flex flex-col gap-5" aria-labelledby="titulo-qc">
        <h2 id="titulo-qc" className="text-2xl font-bold">
          GL e RL: a opinião antes do envio
        </h2>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="flex items-center gap-5 rounded-lg border-2 border-gl bg-gl-claro p-5">
            <Carimbo veredito="GL" tamanho="g" />
            <p>
              <span className="font-semibold">Green Light, sinal verde.</span> As fotos mostram que a peça está boa. Pode
              mandar enviar.
            </p>
          </div>
          <div className="flex items-center gap-5 rounded-lg border-2 border-rl bg-rl-claro p-5">
            <Carimbo veredito="RL" tamanho="g" />
            <p>
              <span className="font-semibold">Red Light, sinal vermelho.</span> Tem algum problema, como costura, cor ou
              medida. Melhor pedir a troca.
            </p>
          </div>
        </div>
        <p className="max-w-2xl text-apagado">
          São termos que as comunidades de importação já usam. Aqui eles viram opiniões: cada pessoa marca GL ou RL e, no
          caso de RL, diz o motivo. Com o tempo, isso mostra quais lojas costumam mandar peças com problema.
        </p>
      </section>

      <section className="flex flex-col gap-5">
        <h2 className="text-2xl font-bold">Glossário</h2>
        <dl className="grid gap-x-8 gap-y-5 md:grid-cols-2">
          {GLOSSARIO.map((t) => (
            <div key={t.id} id={t.id} className="flex scroll-mt-6 flex-col gap-1 border-t border-linha pt-4 target:border-cobalto">
              <dt className="font-display text-xl font-bold">
                {t.termo}
                {t.nome && <span className="ml-2 font-sans text-base font-normal text-apagado">{t.nome}</span>}
              </dt>
              <dd className="max-w-prose text-apagado">{t.definicao}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="flex flex-col gap-5">
        <h2 className="text-2xl font-bold">Perguntas frequentes</h2>
        <div className="flex max-w-3xl flex-col divide-y divide-linha rounded-lg border border-linha bg-cartao">
          {PERGUNTAS_FREQUENTES.map((p) => (
            <details key={p.pergunta} className="group px-5 py-4">
              <summary className="cursor-pointer list-none font-semibold marker:hidden">
                <span className="mr-2 inline-block text-cobalto transition-transform group-open:rotate-90">›</span>
                {p.pergunta}
              </summary>
              <p className="mt-2 pl-5 text-apagado">{p.resposta}</p>
            </details>
          ))}
        </div>
      </section>
    </div>
  );
}
