"use client";

// Opinião sobre uma peça no armazém: GL (pode enviar) ou RL (melhor trocar).
// Quem marca o motivo ou escreve um comentário ganha mais pontos, e o comentário
// aparece na lista de opiniões para a comunidade curtir.

import Link from "next/link";
import { useState } from "react";
import Carimbo from "./Carimbo";
import { NOMES_DECISAO, PlacarQc } from "./Cartoes";
import { MOTIVOS_RL } from "@/lib/dados";
import { motivoPrincipal } from "@/lib/calculos";
import { PONTOS, mudarDecisao, useDemo, votar } from "@/lib/demo";
import type { DecisaoQc, MotivoRl, Qc, Veredito } from "@/lib/tipos";

export default function VotacaoQc({ qc, meu = false }: { qc: Qc; meu?: boolean }) {
  const demo = useDemo();
  const meuVoto = demo.votos[qc.id];
  const [escolha, setEscolha] = useState<Veredito | null>(null);
  const [motivos, setMotivos] = useState<MotivoRl[]>([]);
  const [ganhou, setGanhou] = useState(0);
  const [comentario, setComentario] = useState("");

  // O placar já conta o seu voto
  const comVoto: Qc = meuVoto
    ? {
        ...qc,
        votos: {
          ...qc.votos,
          gl: qc.votos.gl + (meuVoto.veredito === "GL" ? 1 : 0),
          rl: qc.votos.rl + (meuVoto.veredito === "RL" ? 1 : 0),
          motivos: somarMotivos(qc.votos.motivos, meuVoto.motivos),
        },
      }
    : qc;

  if (meu) return <DecisaoDoDono qc={qc} />;

  if (qc.decisao !== "aguardando") {
    return (
      <div className="flex flex-col gap-3">
        <p className="font-semibold">Opiniões encerradas: {NOMES_DECISAO[qc.decisao].toLowerCase()}.</p>
        <PlacarQc qc={comVoto} />
        <Motivos qc={comVoto} />
      </div>
    );
  }

  if (meuVoto) {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-4">
          <Carimbo veredito={meuVoto.veredito} tamanho="g" entrada={ganhou > 0} />
          <div>
            <p className="font-semibold">Sua opinião foi registrada.</p>
            <p className="text-sm text-apagado" role="status">
              {ganhou > 0 ? `+${ganhou} pontos.` : "Você já deu sua opinião sobre esta peça."}
              {meuVoto.motivos.length > 0 && ` Motivo: ${meuVoto.motivos.join(", ").toLowerCase()}.`}
            </p>
          </div>
        </div>
        <PlacarQc qc={comVoto} />
        <Motivos qc={comVoto} />
      </div>
    );
  }

  const pontosDoVoto = motivos.length || comentario.trim() ? PONTOS.votoComMotivo : PONTOS.votoSimples;
  const alternar = (m: MotivoRl) =>
    setMotivos(motivos.includes(m) ? motivos.filter((x) => x !== m) : [...motivos, m]);

  return (
    <div className="flex flex-col gap-4">
      <PlacarQc qc={qc} />
      <Motivos qc={qc} />
      <p className="font-semibold">Você enviaria esta peça?</p>
      <div className="grid grid-cols-2 gap-2">
        <BotaoVeredito veredito="GL" ativo={escolha === "GL"} onClick={() => { setEscolha("GL"); setMotivos([]); }} legenda="Sinal verde, pode enviar" />
        <BotaoVeredito veredito="RL" ativo={escolha === "RL"} onClick={() => setEscolha("RL")} legenda="Sinal vermelho, melhor trocar" />
      </div>
      <p className="text-sm text-apagado">
        GL e RL são de Green Light e Red Light, sinal verde e sinal vermelho.{" "}
        <Link href="/ajuda#gl" className="font-semibold text-cobalto hover:underline">
          Saiba mais
        </Link>
      </p>

      {escolha === "RL" && (
        <fieldset className="flex flex-col gap-2">
          <legend className="mb-2 text-sm text-apagado">O que está errado? Marcar o motivo ajuda quem comprou a pedir a troca.</legend>
          <div className="flex flex-wrap gap-2">
            {MOTIVOS_RL.map((m) => (
              <label
                key={m}
                className={`cursor-pointer rounded-full border px-3 py-1 text-sm has-[:focus-visible]:outline has-[:focus-visible]:outline-cobalto ${
                  motivos.includes(m) ? "border-rl bg-rl-claro text-rl" : "border-linha bg-cartao"
                }`}
              >
                <input type="checkbox" className="sr-only" checked={motivos.includes(m)} onChange={() => alternar(m)} />
                {m}
              </label>
            ))}
          </div>
        </fieldset>
      )}

      {escolha && (
        <div className="flex flex-col gap-1.5">
          <label htmlFor={`comentario-${qc.id}`} className="text-sm font-semibold">
            Comentário (opcional)
          </label>
          <textarea
            id={`comentario-${qc.id}`}
            rows={2}
            value={comentario}
            onChange={(e) => setComentario(e.target.value)}
            placeholder={escolha === "RL" ? "Ex.: a costura do símbolo está diferente das outras fotos" : "Ex.: costura reta e cor igual ao anúncio"}
            className="rounded-md border border-linha px-3 py-2"
          />
          <p className="text-xs text-apagado">Comentários aparecem na lista de opiniões e podem receber curtidas.</p>
        </div>
      )}

      {escolha && (
        <button
          type="button"
          onClick={() => setGanhou(votar(qc.id, escolha, motivos, comentario.trim()))}
          className="rounded-md bg-tinta px-4 py-2.5 font-semibold text-cartao"
        >
          Enviar opinião {escolha} (+{pontosDoVoto} {pontosDoVoto === 1 ? "ponto" : "pontos"})
        </button>
      )}
    </div>
  );
}

function somarMotivos(base: Qc["votos"]["motivos"], meus: MotivoRl[]) {
  const soma = { ...base };
  for (const m of meus) soma[m] = (soma[m] ?? 0) + 1;
  return soma;
}

function Motivos({ qc }: { qc: Qc }) {
  const lista = motivoPrincipal(qc);
  if (!lista.length) return null;
  return (
    <div className="flex flex-col gap-2">
      <p className="text-sm text-apagado">Motivos de quem achou melhor trocar</p>
      <ul className="flex flex-wrap gap-2 text-sm">
        {lista.map((m) => (
          <li key={m.motivo} className="rounded-full bg-rl-claro px-3 py-1 text-rl">
            {m.motivo} ({m.n})
          </li>
        ))}
      </ul>
    </div>
  );
}

function BotaoVeredito({ veredito, ativo, onClick, legenda }: { veredito: Veredito; ativo: boolean; onClick: () => void; legenda: string }) {
  const cor = veredito === "GL" ? "border-gl text-gl bg-gl-claro" : "border-rl text-rl bg-rl-claro";
  return (
    <button
      type="button"
      aria-pressed={ativo}
      onClick={onClick}
      className={`flex flex-col items-center gap-0.5 rounded-lg border-2 py-3 ${ativo ? cor : "border-linha bg-cartao hover:border-tinta"}`}
    >
      <span className="font-display text-3xl font-extrabold">{veredito}</span>
      <span className="text-sm">{legenda}</span>
    </button>
  );
}

// Para o dono do QC: registrar o que fez com a peça e, quando chegar, virar review
function DecisaoDoDono({ qc }: { qc: Qc }) {
  const demo = useDemo();
  const atual = demo.qcs.find((q) => q.id === qc.id)?.decisao ?? qc.decisao;
  const opcoes: { valor: DecisaoQc; rotulo: string }[] = [
    { valor: "enviado", rotulo: "Enviei" },
    { valor: "trocado", rotulo: "Pedi troca" },
    { valor: "devolvido", rotulo: "Devolvi" },
  ];

  return (
    <div className="flex flex-col gap-4">
      <PlacarQc qc={qc} />
      <p className="text-sm text-apagado">
        Esta peça é sua. Depois das opiniões, registre o que você decidiu.
      </p>
      <div className="flex flex-wrap gap-2">
        {opcoes.map((o) => (
          <button
            key={o.valor}
            type="button"
            aria-pressed={atual === o.valor}
            onClick={() => mudarDecisao(qc.id, o.valor)}
            className={`rounded-md border-2 px-3 py-1.5 font-semibold ${atual === o.valor ? "border-tinta bg-tinta text-cartao" : "border-linha bg-cartao"}`}
          >
            {o.rotulo}
          </button>
        ))}
      </div>
      {atual === "enviado" && (
        <Link
          href={`/review/nova?qc=${qc.id}`}
          className="rounded-md bg-cobalto px-4 py-2.5 text-center font-semibold text-white hover:bg-cobalto-escuro"
        >
          Chegou? Transformar em review
        </Link>
      )}
      {atual === "recebido" && <p className="font-semibold text-gl">Recebido e avaliado. Obrigado pela review.</p>}
    </div>
  );
}
