// Leitor de links: transforma qualquer link de produto em (plataforma, itemId).
// É a peça central do sistema, porque é ela que junta as reviews de um
// mesmo produto vindas de links diferentes. No backend, vira o LinkParser em Kotlin.

import type { Plataforma } from "./tipos";

export type LinkLido = { plataforma: Plataforma; itemId: string };

export const NOMES_PLATAFORMA: Record<Plataforma, string> = {
  taobao: "Taobao",
  weidian: "Weidian",
  "1688": "1688",
};

// Links de exemplo usados na tela inicial do protótipo
export const EXEMPLOS_DE_LINK = [
  { rotulo: "Link da Weidian", link: "https://weidian.com/item.html?itemID=7291054418" },
  { rotulo: "Link da CSSBuy", link: "https://www.cssbuy.com/item-702233198845.html" },
  { rotulo: "Link do 1688", link: "https://detail.1688.com/offer/651820394471.html" },
  { rotulo: "Produto sem reviews", link: "https://item.taobao.com/item.htm?id=640012345678" },
];


export function lerLink(texto: string): LinkLido | null {
  const bruto = texto.trim();
  if (!bruto) return null;

  let url: URL;
  try {
    url = new URL(/^https?:\/\//i.test(bruto) ? bruto : `https://${bruto}`);
  } catch {
    return null;
  }

  const host = url.hostname.toLowerCase();
  const caminho = url.pathname;

  // Taobao e Tmall: item.taobao.com/item.htm?id=123
  if (host.endsWith("taobao.com") || host.endsWith("tmall.com")) {
    const id = url.searchParams.get("id");
    if (id && /^\d+$/.test(id)) return { plataforma: "taobao", itemId: id };
  }

  // Weidian: weidian.com/item.html?itemID=123
  if (host.endsWith("weidian.com")) {
    const id = url.searchParams.get("itemID") ?? url.searchParams.get("itemId");
    if (id && /^\d+$/.test(id)) return { plataforma: "weidian", itemId: id };
  }

  // 1688: detail.1688.com/offer/123.html
  if (host.endsWith("1688.com")) {
    const m = caminho.match(/\/offer\/(\d+)\.html/);
    if (m) return { plataforma: "1688", itemId: m[1] };
  }

  // CSSBuy: item-123.html (Taobao), item-micro-123.html (Weidian), item-1688-123.html
  if (host.endsWith("cssbuy.com")) {
    const m = caminho.match(/item-(micro-|1688-)?(\d+)\.html/);
    if (m) {
      const plataforma: Plataforma = m[1] === "micro-" ? "weidian" : m[1] === "1688-" ? "1688" : "taobao";
      return { plataforma, itemId: m[2] };
    }
  }

  // Outros agentes costumam levar o link original no parâmetro "url"
  const original = url.searchParams.get("url");
  if (original) return lerLink(original); // searchParams já devolve o valor decodificado

  return null;
}
