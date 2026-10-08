"use client";

import { useState, type FormEvent } from "react";
import { formatarData } from "@/lib/formato";
import { PONTOS, novoId, perguntar, responder, useDemo } from "@/lib/demo";
import type { Pergunta } from "@/lib/tipos";

export default function SecaoPerguntas({
  produtoId,
  perguntas,
  avisados,
}: {
  produtoId: string;
  perguntas: Pergunta[];
  avisados: number;
}) {
  const demo = useDemo();
  const [texto, setTexto] = useState("");
  const [enviada, setEnviada] = useState(false);
  const todas = [...demo.perguntas.filter((p) => p.produtoId === produtoId), ...perguntas];

  function enviar(e: FormEvent) {
    e.preventDefault();
    if (!texto.trim()) return;
    perguntar({ id: novoId("pergunta"), produtoId, autor: "Você", data: new Date().toISOString(), texto: texto.trim(), respostas: [] });
    setTexto("");
    setEnviada(true);
  }

  return (
    <div className="flex flex-col gap-5">
      <form onSubmit={enviar} className="flex flex-col gap-2 rounded-lg border border-linha bg-cartao p-4">
        <label htmlFor="nova-pergunta" className="font-semibold">
          Pergunte para quem já comprou
        </label>
        <textarea
          id="nova-pergunta"
          rows={2}
          value={texto}
          onChange={(e) => {
            setTexto(e.target.value);
            setEnviada(false);
          }}
          placeholder="Ex.: tenho 1,78 m e 80 kg, peço L ou XL?"
          className="rounded-md border border-linha px-3 py-2"
        />
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-sm text-apagado" role="status">
            {enviada
              ? `Pergunta publicada. Avisamos as ${avisados} pessoas que já avaliaram este produto.`
              : `As ${avisados} pessoas que já avaliaram este produto recebem um aviso.`}
          </p>
          <button type="submit" className="rounded-md bg-cobalto px-4 py-2 font-semibold text-white hover:bg-cobalto-escuro">
            Publicar pergunta
          </button>
        </div>
      </form>

      {todas.length === 0 && <p className="text-apagado">Nenhuma pergunta ainda. Seja a primeira pessoa a perguntar.</p>}

      <ul className="flex flex-col gap-3">
        {todas.map((p) => (
          <ItemPergunta key={p.id} pergunta={p} minhasRespostas={demo.respostas[p.id] ?? []} />
        ))}
      </ul>
    </div>
  );
}

function ItemPergunta({
  pergunta,
  minhasRespostas,
}: {
  pergunta: Pergunta;
  minhasRespostas: { texto: string; data: string }[];
}) {
  const [aberto, setAberto] = useState(false);
  const [texto, setTexto] = useState("");
  const respostas = [...pergunta.respostas, ...minhasRespostas.map((r) => ({ ...r, autor: "Você", comprou: false }))];

  function enviar(e: FormEvent) {
    e.preventDefault();
    if (!texto.trim()) return;
    responder(pergunta.id, texto.trim());
    setTexto("");
    setAberto(false);
  }

  return (
    <li className="flex flex-col gap-3 rounded-lg border border-linha bg-cartao p-4">
      <div>
        <p className="font-semibold">{pergunta.texto}</p>
        <p className="text-sm text-apagado">
          {pergunta.autor}, {formatarData(pergunta.data)}
        </p>
      </div>

      {respostas.length > 0 ? (
        <ul className="flex flex-col gap-2 border-l-2 border-linha pl-4">
          {respostas.map((r, i) => (
            <li key={i}>
              <p>{r.texto}</p>
              <p className="text-sm text-apagado">
                {r.autor}
                {r.comprou && <span className="ml-1.5 rounded bg-gl-claro px-1.5 text-xs font-semibold text-gl">Comprou</span>}
                , {formatarData(r.data)}
              </p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-apagado">Sem respostas ainda.</p>
      )}

      {aberto ? (
        <form onSubmit={enviar} className="flex flex-col gap-2 sm:flex-row">
          <label htmlFor={`resposta-${pergunta.id}`} className="sr-only">
            Sua resposta
          </label>
          <input
            id={`resposta-${pergunta.id}`}
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
            className="min-w-0 flex-1 rounded-md border border-linha px-3 py-2"
            placeholder="Sua resposta"
            autoFocus
          />
          <button type="submit" className="rounded-md bg-cobalto px-4 py-2 font-semibold text-white">
            Responder (+{PONTOS.resposta} pts)
          </button>
        </form>
      ) : (
        <button type="button" onClick={() => setAberto(true)} className="self-start text-sm font-semibold text-cobalto hover:underline">
          Responder
        </button>
      )}
    </li>
  );
}
