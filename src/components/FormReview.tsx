"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import ArteProduto from "./ArteProduto";
import CampoFotos from "./CampoFotos";
import { Campo, Nota, entrada } from "./Formulario";
import { AGENTES, DIRETO, buscarProduto, produtoPorLink } from "@/lib/dados";
import { NOMES_CRITERIOS, faixaAltura, faixaPeso } from "@/lib/calculos";
import { PONTOS, mudarDecisao, novoId, publicarReview, useDemo } from "@/lib/demo";
import { ehImagemEnviada } from "@/lib/imagens";
import { lerLink } from "@/lib/link";
import type { Caimento, Criterios, Produto } from "@/lib/tipos";

type Props = { produto?: Produto; link?: string; qcId?: string };

export default function FormReview({ produto: produtoInicial, link: linkInicial = "", qcId }: Props) {
  const router = useRouter();
  const demo = useDemo();
  const qc = qcId ? demo.qcs.find((q) => q.id === qcId) : undefined;

  // O QC vem do navegador e pode chegar depois do primeiro render,
  // por isso os campos ligados a ele usam "valor digitado ou valor do QC".
  const [linkDigitado, setLink] = useState(linkInicial);
  const [canalEscolhido, setCanal] = useState("");
  const [tamanhoEscolhido, setTamanho] = useState("");
  const [caimento, setCaimento] = useState<Caimento>("certo");
  const [altura, setAltura] = useState("");
  const [peso, setPeso] = useState("");
  const [notas, setNotas] = useState<Criterios>({ material: 0, fidelidade: 0, tamanho: 0, custoBeneficio: 0 });
  const [fotos, setFotos] = useState<string[]>([]);
  const [usarFotosQc, setUsarFotosQc] = useState(true);
  const [texto, setTexto] = useState("");
  const [erro, setErro] = useState("");

  const link = linkDigitado || qc?.link || "";
  const canal = canalEscolhido || qc?.canal || AGENTES[0];
  const lido = lerLink(link);
  const produto =
    produtoInicial ??
    (qc?.produtoId ? buscarProduto(qc.produtoId) : undefined) ??
    (lido ? produtoPorLink(lido.plataforma, lido.itemId) : undefined);
  const tamanho = tamanhoEscolhido || qc?.tamanho || produto?.tamanhos[0] || "";
  const tamanhoUnico = produto?.tamanhos.length === 1;
  const fotosDoQc = qc && usarFotosQc ? qc.fotos.filter(ehImagemEnviada) : [];
  const todasFotos = [...fotosDoQc, ...fotos];

  const alturaNum = Number(altura);
  const pesoNum = Number(peso);
  const temMedidas = alturaNum > 100 && pesoNum > 30;
  const completa = todasFotos.length > 0 && temMedidas;

  function enviar(e: FormEvent) {
    e.preventDefault();
    if (!produto && !lido) return setErro("Cole o link do produto para a review ficar na página certa.");
    if (Object.values(notas).some((n) => n === 0)) return setErro("Dê uma nota de 1 a 5 para cada critério.");
    if (!texto.trim()) return setErro("Conte em poucas palavras como o produto chegou.");

    publicarReview({
      id: novoId("review"),
      produtoId: produto?.id ?? `link:${lido!.plataforma}:${lido!.itemId}`,
      autor: "Você",
      data: new Date().toISOString(),
      tamanho: tamanho || "Não informado",
      altura: temMedidas ? alturaNum : undefined,
      peso: temMedidas ? pesoNum : undefined,
      caimento: tamanhoUnico ? "certo" : caimento,
      notas,
      texto: texto.trim(),
      canal,
      fotos: todasFotos,
      util: 0,
      qcId,
    });
    if (qcId) mudarDecisao(qcId, "recebido");
    router.push(produto ? `/produto/${produto.id}` : "/perfil");
  }

  return (
    <form onSubmit={enviar} className="flex max-w-2xl flex-col gap-7" noValidate>
      {produto ? (
        <div className="flex items-center gap-3 rounded-lg border border-linha bg-cartao p-3">
          <ArteProduto categoria={produto.categoria} cor={produto.cor} className="w-16 shrink-0" />
          <div>
            <p className="font-semibold">{produto.titulo}</p>
            {qc && <p className="text-sm text-apagado">Esta review continua o seu QC no armazém.</p>}
          </div>
        </div>
      ) : (
        <Campo id="review-link" rotulo="Link do produto">
          <input id="review-link" value={link} onChange={(e) => setLink(e.target.value)} className={entrada} placeholder="https://item.taobao.com/item.htm?id=…" />
        </Campo>
      )}

      <fieldset className="flex flex-col gap-2">
        <legend className="mb-2 font-semibold">Como você comprou</legend>
        <div className="flex flex-wrap gap-2">
          {[...AGENTES, DIRETO].map((c) => (
            <label
              key={c}
              className={`cursor-pointer rounded-full border px-3 py-1.5 text-sm has-[:focus-visible]:outline has-[:focus-visible]:outline-cobalto ${
                canal === c ? "border-tinta bg-tinta text-cartao" : "border-linha bg-cartao"
              }`}
            >
              <input type="radio" name="canal" value={c} checked={canal === c} onChange={() => setCanal(c)} className="sr-only" />
              {c}
            </label>
          ))}
        </div>
      </fieldset>

      <div className="grid gap-4 sm:grid-cols-2">
        <Campo id="review-tamanho" rotulo="Tamanho pedido">
          {produto ? (
            <select id="review-tamanho" value={tamanho} onChange={(e) => setTamanho(e.target.value)} className={entrada}>
              {produto.tamanhos.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
          ) : (
            <input id="review-tamanho" value={tamanho} onChange={(e) => setTamanho(e.target.value)} className={entrada} placeholder="Ex.: L ou 42" />
          )}
        </Campo>
        {!tamanhoUnico && (
          <Campo id="review-caimento" rotulo="Como ficou">
            <select id="review-caimento" value={caimento} onChange={(e) => setCaimento(e.target.value as Caimento)} className={entrada}>
              <option value="pequeno">Ficou pequeno</option>
              <option value="certo">Tamanho certo</option>
              <option value="grande">Ficou grande</option>
            </select>
          </Campo>
        )}
      </div>

      <fieldset className="flex flex-col gap-3">
        <legend className="mb-1 font-semibold">Suas medidas (opcional)</legend>
        <p className="text-sm text-apagado">
          Ajudam quem tem o corpo parecido com o seu. Na review aparece só a faixa, nunca o valor exato.
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          <Campo id="review-altura" rotulo="Altura (cm)">
            <input id="review-altura" inputMode="numeric" value={altura} onChange={(e) => setAltura(e.target.value)} className={entrada} placeholder="178" />
          </Campo>
          <Campo id="review-peso" rotulo="Peso (kg)">
            <input id="review-peso" inputMode="numeric" value={peso} onChange={(e) => setPeso(e.target.value)} className={entrada} placeholder="80" />
          </Campo>
        </div>
        {temMedidas && (
          <p className="text-sm">
            Vai aparecer como: <span className="font-semibold">{faixaAltura(alturaNum)}, {faixaPeso(pesoNum)}</span>
          </p>
        )}
      </fieldset>

      <fieldset className="flex flex-col gap-3 rounded-lg border border-linha bg-cartao p-4">
        <legend className="px-1 font-semibold">Notas</legend>
        {(Object.keys(NOMES_CRITERIOS) as (keyof Criterios)[]).map((c) => (
          <Nota key={c} nome={`nota-${c}`} rotulo={NOMES_CRITERIOS[c]} valor={notas[c]} onChange={(n) => setNotas({ ...notas, [c]: n })} />
        ))}
      </fieldset>

      <div className="flex flex-col gap-2">
        <span className="font-semibold">Fotos</span>
        {qc && qc.fotos.some(ehImagemEnviada) && (
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={usarFotosQc} onChange={(e) => setUsarFotosQc(e.target.checked)} />
            Incluir as fotos do armazém
          </label>
        )}
        <CampoFotos fotos={fotos} onChange={setFotos} />
      </div>

      <Campo id="review-texto" rotulo="Como chegou?">
        <textarea id="review-texto" rows={4} value={texto} onChange={(e) => setTexto(e.target.value)} className={entrada} placeholder="Tempo de entrega, qualidade, se a cor bate com as fotos, dicas de tamanho…" />
      </Campo>

      {erro && (
        <p role="alert" className="rounded-md bg-rl-claro px-3 py-2 text-rl">
          {erro}
        </p>
      )}

      <div className="flex flex-wrap items-center gap-4">
        <button type="submit" className="rounded-md bg-cobalto px-5 py-2.5 font-semibold text-white hover:bg-cobalto-escuro">
          Publicar review
        </button>
        <p className="text-sm text-apagado">
          {completa
            ? `Review completa: +${PONTOS.reviewCompleta} pontos.`
            : `+${PONTOS.reviewSimples} pontos. Com fotos e medidas, a review vale ${PONTOS.reviewCompleta}.`}
        </p>
      </div>
    </form>
  );
}
