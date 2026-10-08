import EscolhaPlano from "@/components/EscolhaPlano";
import { CUSTO_DESBLOQUEIO, LIMITE_GRATUITO, PONTOS } from "@/lib/regras";

export const metadata = { title: "Planos" };

const LINHAS: { recurso: string; gratuito: string; plus: string }[] = [
  { recurso: "Reviews por produto", gratuito: `Até ${LIMITE_GRATUITO}`, plus: "Todas" },
  { recurso: "Filtro por corpo parecido", gratuito: "Não", plus: "Sim" },
  { recurso: "Filtros por tamanho, caimento e agente", gratuito: "Não", plus: "Sim" },
  { recurso: "Postar e votar em QCs", gratuito: "Sim", plus: "Sim" },
  { recurso: "Publicar reviews e perguntar", gratuito: "Sim", plus: "Sim" },
  { recurso: "Desbloquear reviews com pontos", gratuito: "Sim", plus: "Não precisa" },
];

const GANHOS = [
  { acao: "Review completa (fotos, tamanho e medidas)", pontos: PONTOS.reviewCompleta },
  { acao: "Review só com texto e notas", pontos: PONTOS.reviewSimples },
  { acao: "Resposta a uma pergunta", pontos: PONTOS.resposta },
  { acao: "Voto GL ou RL com motivo", pontos: PONTOS.votoComMotivo },
  { acao: "Voto GL ou RL simples", pontos: PONTOS.votoSimples },
];

export default function Planos() {
  return (
    <div className="flex flex-col gap-12">
      <div className="flex max-w-2xl flex-col gap-2">
        <h1 className="text-4xl font-extrabold">Planos</h1>
        <p className="text-lg text-apagado">
          A revisão de QC é gratuita para todo mundo. O Plus é para quem consulta muito e quer encontrar rápido as reviews
          de quem tem o corpo parecido.
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse overflow-hidden rounded-lg bg-cartao text-left text-sm sm:text-base">
          <thead>
            <tr className="border-b-2 border-tinta align-bottom">
              <th className="p-3 sm:p-4 font-normal text-apagado">Recurso</th>
              <th className="p-3 sm:p-4">
                <span className="block font-display text-2xl">Gratuito</span>
                <span className="text-sm font-normal text-apagado">R$ 0</span>
              </th>
              <th className="p-3 sm:p-4">
                <span className="block font-display text-2xl">Plus</span>
                <span className="text-sm font-normal text-apagado">R$ 9,90/mês, valor de exemplo</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {LINHAS.map((l) => (
              <tr key={l.recurso} className="border-b border-linha last:border-0">
                <td className="p-3 sm:p-4">{l.recurso}</td>
                <td className={`p-3 sm:p-4 ${l.gratuito === "Não" ? "text-apagado" : "font-semibold"}`}>{l.gratuito}</td>
                <td className="p-3 sm:p-4 font-semibold">{l.plus}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <EscolhaPlano />

      <section className="flex max-w-2xl flex-col gap-4">
        <h2 className="text-2xl font-bold">Como ganhar pontos</h2>
        <p className="text-apagado">
          Quem contribui não precisa pagar para ler: {CUSTO_DESBLOQUEIO} pontos liberam todas as reviews de um produto.
          Pontos de voto e de comentário têm limite diário.
        </p>
        <ul className="flex flex-col divide-y divide-linha rounded-lg border border-linha bg-cartao">
          {GANHOS.map((g) => (
            <li key={g.acao} className="flex items-center justify-between gap-4 px-4 py-3">
              <span>{g.acao}</span>
              <span className="font-display text-lg font-bold tabular-nums">+{g.pontos}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
