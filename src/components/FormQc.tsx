"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import ArteProduto from "./ArteProduto";
import CampoFotos from "./CampoFotos";
import { Campo, entrada } from "./Formulario";
import { AGENTES, ANGULOS, produtoPorLink, reviewsDo } from "@/lib/dados";
import { novoId, publicarQc } from "@/lib/demo";
import { lerLink } from "@/lib/link";
import type { Produto } from "@/lib/tipos";

export default function FormQc({ produto: produtoInicial, link: linkInicial = "" }: { produto?: Produto; link?: string }) {
  const router = useRouter();
  const [link, setLink] = useState(linkInicial);
  const [nome, setNome] = useState("");
  const [agente, setAgente] = useState(AGENTES[0]);
  const [tamanhoEscolhido, setTamanho] = useState("");
  const [fotos, setFotos] = useState<string[]>([]);
  const [observacao, setObservacao] = useState("");
  const [erro, setErro] = useState("");

  // Se o link colado for de um produto do catálogo, o QC vai para a página dele
  const lido = lerLink(link);
  const produto = produtoInicial ?? (lido ? produtoPorLink(lido.plataforma, lido.itemId) : undefined);
  const avisados = produto ? reviewsDo(produto.id).length : 0;
  const tamanho = tamanhoEscolhido || produto?.tamanhos[0] || "";

  function enviar(e: FormEvent) {
    e.preventDefault();
    if (!produto && !lido) return setErro("Cole o link do produto no Taobao, Weidian, 1688 ou na CSSBuy.");
    if (!tamanho.trim()) return setErro("Informe o tamanho que você pediu.");

    const id = novoId("qc");
    publicarQc({
      id,
      produtoId: produto?.id,
      link: produto ? undefined : link.trim(),
      tituloLivre: produto ? undefined : nome.trim() || "Produto sem nome",
      autor: "Você",
      data: new Date().toISOString(),
      tamanho: tamanho.trim(),
      canal: agente,
      observacao: observacao.trim(),
      fotos: fotos.length ? fotos : ANGULOS[produto?.categoria ?? "camisetas"],
      votos: { gl: 0, rl: 0, motivos: {} },
      decisao: "aguardando",
    });
    router.push(`/qc/${id}`);
  }

  return (
    <form onSubmit={enviar} className="flex max-w-2xl flex-col gap-6" noValidate>
      {produto ? (
        <div className="flex items-center gap-3 rounded-lg border border-linha bg-cartao p-3">
          <ArteProduto categoria={produto.categoria} cor={produto.cor} className="w-16 shrink-0" />
          <div>
            <p className="font-semibold">{produto.titulo}</p>
            <p className="text-sm text-apagado">Quem já avaliou este produto ({avisados} pessoas) recebe um aviso para votar.</p>
          </div>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          <Campo id="qc-link" rotulo="Link do produto">
            <input id="qc-link" value={link} onChange={(e) => setLink(e.target.value)} className={entrada} placeholder="https://weidian.com/item.html?itemID=…" />
          </Campo>
          <Campo id="qc-nome" rotulo="Nome do produto">
            <input id="qc-nome" value={nome} onChange={(e) => setNome(e.target.value)} className={entrada} placeholder="Ex.: Jaqueta jeans lavada" />
          </Campo>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <Campo id="qc-agente" rotulo="Agente">
          <select id="qc-agente" value={agente} onChange={(e) => setAgente(e.target.value)} className={entrada}>
            {AGENTES.map((a) => (
              <option key={a}>{a}</option>
            ))}
          </select>
        </Campo>
        <Campo id="qc-tamanho" rotulo="Tamanho pedido">
          {produto ? (
            <select id="qc-tamanho" value={tamanho} onChange={(e) => setTamanho(e.target.value)} className={entrada}>
              {produto.tamanhos.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
          ) : (
            <input id="qc-tamanho" value={tamanho} onChange={(e) => setTamanho(e.target.value)} className={entrada} placeholder="Ex.: L ou 42" />
          )}
        </Campo>
      </div>

      <div className="flex flex-col gap-2">
        <span className="font-semibold">Fotos do armazém</span>
        <p className="text-sm text-apagado">
          As fotos que o agente tirou: frente, costas, etiqueta e medidas. Sem fotos, a demonstração usa imagens de exemplo.
        </p>
        <CampoFotos fotos={fotos} onChange={setFotos} />
      </div>

      <Campo id="qc-obs" rotulo="O que você quer que a comunidade confira?">
        <textarea id="qc-obs" rows={3} value={observacao} onChange={(e) => setObservacao(e.target.value)} className={entrada} placeholder="Ex.: a costura da manga parece torta, o que acham?" />
      </Campo>

      {erro && (
        <p role="alert" className="rounded-md bg-rl-claro px-3 py-2 text-rl">
          {erro}
        </p>
      )}

      <div className="flex flex-wrap items-center gap-4">
        <button type="submit" className="rounded-md bg-cobalto px-5 py-2.5 font-semibold text-white hover:bg-cobalto-escuro">
          Postar QC
        </button>
        <p className="text-sm text-apagado">
          Comprou direto com a loja? Não há fotos de armazém.{" "}
          <Link href={produto ? `/review/nova?produto=${produto.id}` : "/review/nova"} className="font-semibold text-cobalto hover:underline">
            Publique uma review quando chegar
          </Link>
          .
        </p>
      </div>
    </form>
  );
}
