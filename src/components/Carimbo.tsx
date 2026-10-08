import type { Veredito } from "@/lib/tipos";

const TAMANHOS = {
  p: "text-sm",
  m: "text-xl",
  g: "text-5xl",
};

// Carimbo de conferência. "entrada" anima quando o voto acabou de ser dado.
export default function Carimbo({
  veredito,
  tamanho = "m",
  entrada = false,
}: {
  veredito: Veredito;
  tamanho?: keyof typeof TAMANHOS;
  entrada?: boolean;
}) {
  const cor = veredito === "GL" ? "text-gl" : "text-rl";
  const titulo = veredito === "GL" ? "GL (Green Light): aprovado, pode enviar" : "RL (Red Light): reprovado, melhor trocar";
  return (
    <span className={`carimbo ${cor} ${TAMANHOS[tamanho]} ${entrada ? "carimbo-entrada" : ""}`} title={titulo}>
      {veredito}
    </span>
  );
}
