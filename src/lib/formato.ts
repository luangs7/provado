// Formatação para exibição em português

const fusoBrasil = "America/Sao_Paulo";

export function formatarData(iso: string) {
  return new Intl.DateTimeFormat("pt-BR", { day: "numeric", month: "short", timeZone: fusoBrasil })
    .format(new Date(iso))
    .replace(".", "");
}

export const formatarNota = (n: number) => n.toFixed(1).replace(".", ",");

export const formatarPorcentagem = (n: number) => `${Math.round(n * 100)}%`;

// Cotação de exemplo. Na versão real, vem de uma API de câmbio.
export const COTACAO_YUAN = 0.78;

export function formatarPreco(yuan: number) {
  const reais = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 }).format(
    yuan * COTACAO_YUAN,
  );
  return { yuan: `¥ ${yuan}`, reais: `≈ ${reais}` };
}

export const plural = (n: number, singular: string, pluralTexto: string) =>
  `${n} ${n === 1 ? singular : pluralTexto}`;

// "comprado pela CSSBuy", "comprado por outro agente", "comprado direto com a loja"
export function comoComprou(canal: string) {
  if (canal === "Outro agente") return "comprado por outro agente";
  if (canal === "Direto com a loja") return "comprado direto com a loja";
  return `comprado pela ${canal}`;
}
