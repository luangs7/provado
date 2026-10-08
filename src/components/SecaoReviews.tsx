"use client";

// Lista de reviews de um produto com os filtros (plano Plus) e o limite do plano gratuito.

import Link from "next/link";
import { useState, type ReactNode } from "react";
import { CartaoReview } from "./Cartoes";
import { corpoParecido } from "@/lib/calculos";
import { ordenarPorDestaque } from "@/lib/pessoas";
import { CUSTO_DESBLOQUEIO, LIMITE_GRATUITO, desbloquear, mudarPlano, useDemo, veTudo } from "@/lib/demo";
import type { Caimento, Produto, Review } from "@/lib/tipos";

type Filtros = { altura: string; peso: string; tamanho: string; caimento: "" | Caimento; canal: string };
const SEM_FILTRO: Filtros = { altura: "", peso: "", tamanho: "", caimento: "", canal: "" };

export default function SecaoReviews({ produto, reviews }: { produto: Produto; reviews: Review[] }) {
  const demo = useDemo();
  const [filtros, setFiltros] = useState<Filtros>(SEM_FILTRO);
  const [ordem, setOrdem] = useState<"destaque" | "recentes" | "curtidas">("destaque");

  const plus = demo.plano === "pago";
  const liberado = veTudo(demo, produto.id);
  const minhas = demo.reviews.filter((r) => r.produtoId === produto.id);
  const canais = [...new Set(reviews.map((r) => r.canal))];

  const altura = Number(filtros.altura);
  const peso = Number(filtros.peso);
  const filtrando = plus && Object.values(filtros).some(Boolean);

  const filtradas = reviews
    .filter((r) => !plus || !altura || !peso || corpoParecido(r, altura, peso))
    .filter((r) => !plus || !filtros.tamanho || r.tamanho === filtros.tamanho)
    .filter((r) => !plus || !filtros.caimento || r.caimento === filtros.caimento)
    .filter((r) => !plus || !filtros.canal || r.canal === filtros.canal)
    .sort((a, b) => (ordem === "curtidas" ? b.curtidas - a.curtidas : b.data.localeCompare(a.data)));

  const ordenadas = ordem === "destaque" ? ordenarPorDestaque(filtradas) : filtradas;
  const visiveis = liberado ? ordenadas : ordenadas.slice(0, LIMITE_GRATUITO);
  const escondidas = filtradas.length - visiveis.length;
  const mudar = (campo: keyof Filtros, valor: string) => setFiltros({ ...filtros, [campo]: valor });

  return (
    <div className="flex flex-col gap-5">
      <fieldset className="relative flex flex-col gap-3 rounded-lg border border-linha bg-cartao p-4">
        <legend className="px-1 font-semibold">Filtrar reviews</legend>
        <div className={`grid gap-3 sm:grid-cols-2 lg:grid-cols-5 ${plus ? "" : "pointer-events-none opacity-40"}`} aria-hidden={!plus}>
          <Campo rotulo="Sua altura (cm)">
            <input id="filtro-altura" inputMode="numeric" placeholder="178" value={filtros.altura} onChange={(e) => mudar("altura", e.target.value)} disabled={!plus} className={entrada} />
          </Campo>
          <Campo rotulo="Seu peso (kg)">
            <input id="filtro-peso" inputMode="numeric" placeholder="80" value={filtros.peso} onChange={(e) => mudar("peso", e.target.value)} disabled={!plus} className={entrada} />
          </Campo>
          <Campo rotulo="Tamanho pedido">
            <select id="filtro-tamanho" value={filtros.tamanho} onChange={(e) => mudar("tamanho", e.target.value)} disabled={!plus} className={entrada}>
              <option value="">Todos</option>
              {produto.tamanhos.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
          </Campo>
          <Campo rotulo="Caimento">
            <select id="filtro-caimento" value={filtros.caimento} onChange={(e) => mudar("caimento", e.target.value)} disabled={!plus} className={entrada}>
              <option value="">Todos</option>
              <option value="pequeno">Ficou pequeno</option>
              <option value="certo">Tamanho certo</option>
              <option value="grande">Ficou grande</option>
            </select>
          </Campo>
          <Campo rotulo="Como comprou">
            <select id="filtro-canal" value={filtros.canal} onChange={(e) => mudar("canal", e.target.value)} disabled={!plus} className={entrada}>
              <option value="">Todos</option>
              {canais.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </Campo>
        </div>

        {plus ? (
          filtrando && (
            <p className="text-sm text-apagado">
              {filtradas.length} de {reviews.length} reviews. Corpo parecido considera até 6 cm e 10 kg de diferença.{" "}
              <button type="button" onClick={() => setFiltros(SEM_FILTRO)} className="font-semibold text-cobalto underline">
                Limpar filtros
              </button>
            </p>
          )
        ) : (
          <div className="flex flex-col gap-2 rounded-md bg-papel p-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm">
              O filtro por corpo parecido e os filtros avançados fazem parte do plano Plus.
            </p>
            <div className="flex shrink-0 gap-2">
              <Link href="/planos" className="rounded-md border border-tinta px-3 py-1.5 text-sm font-semibold">
                Ver planos
              </Link>
              <button type="button" onClick={() => mudarPlano("pago")} className="rounded-md bg-cobalto px-3 py-1.5 text-sm font-semibold text-white">
                Testar o Plus
              </button>
            </div>
          </div>
        )}
      </fieldset>

      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-apagado">
          {reviews.length + minhas.length} reviews
        </p>
        <label className="flex items-center gap-2 text-sm">
          Ordenar por
          <select id="ordem-reviews" value={ordem} onChange={(e) => setOrdem(e.target.value as typeof ordem)} className="rounded-md border border-linha bg-cartao px-2 py-1">
            <option value="destaque">Em destaque</option>
            <option value="recentes">Mais recentes</option>
            <option value="curtidas">Mais curtidas</option>
          </select>
        </label>
      </div>

      <div className="flex flex-col gap-3">
        {minhas.map((r) => (
          <CartaoReview key={r.id} review={r} produto={produto} minha />
        ))}
        {visiveis.map((r) => (
          <CartaoReview key={r.id} review={r} produto={produto} />
        ))}
        {filtrando && filtradas.length === 0 && (
          <p className="rounded-lg border border-dashed border-linha p-6 text-center text-apagado">
            Nenhuma review com esses filtros. Tente ampliar a faixa ou limpar algum filtro.
          </p>
        )}
      </div>

      {escondidas > 0 && <Bloqueio produtoId={produto.id} escondidas={escondidas} pontos={demo.pontos} />}
    </div>
  );
}

function Bloqueio({ produtoId, escondidas, pontos }: { produtoId: string; escondidas: number; pontos: number }) {
  const [erro, setErro] = useState("");
  const podePagar = pontos >= CUSTO_DESBLOQUEIO;

  return (
    <div className="flex flex-col gap-4 rounded-lg border-2 border-tinta bg-cartao p-5">
      <div className="flex flex-col gap-1">
        <h3 className="text-xl font-bold">Mais {escondidas} reviews deste produto</h3>
        <p className="text-apagado">
          O plano gratuito mostra até {LIMITE_GRATUITO} reviews por produto. Quem publica reviews e dá opinião sobre peças antes do envio ganha
          pontos para ver o resto sem pagar.
        </p>
      </div>
      <div className="flex flex-col gap-2 sm:flex-row">
        <button
          type="button"
          onClick={() => (desbloquear(produtoId) ? setErro("") : setErro(`Faltam ${CUSTO_DESBLOQUEIO - pontos} pontos. Publique uma review ou dê opinião sobre peças antes do envio para ganhar.`))}
          className={`rounded-md px-4 py-2 font-semibold ${podePagar ? "bg-cobalto text-white hover:bg-cobalto-escuro" : "border border-linha text-apagado"}`}
        >
          Desbloquear com {CUSTO_DESBLOQUEIO} pontos
        </button>
        <Link href="/planos" className="rounded-md border border-tinta px-4 py-2 text-center font-semibold">
          Assinar o Plus
        </Link>
      </div>
      <p className="text-sm text-apagado" role="status">
        {erro || `Você tem ${pontos} pontos.`}
      </p>
    </div>
  );
}

const entrada = "w-full rounded-md border border-linha bg-cartao px-2.5 py-1.5 text-sm";

function Campo({ rotulo, children }: { rotulo: string; children: ReactNode }) {
  return (
    <label className="flex flex-col gap-1 text-sm">
      <span className="text-apagado">{rotulo}</span>
      {children}
    </label>
  );
}
