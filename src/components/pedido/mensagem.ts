import { AVISOS, brl } from "@/data/cardapio";
import type { Linha } from "./PedidoContext";

export type Checkout = {
  nome: string;
  tipo: "retirada" | "entrega";
  endereco: string;
  numero: string;
  bairro: string;
  complemento: string;
  pagamento: "Pix" | "Cartão" | "Dinheiro";
  troco: string;
  obs: string;
};

export function totais(linhas: Linha[]) {
  const subtotal = linhas.reduce((s, l) => s + (l.unit ?? 0) * l.qtd, 0);
  const viagem = linhas.length ? AVISOS.viagem : 0;
  return { subtotal, viagem, total: subtotal + viagem, temConsulta: linhas.some((l) => l.unit == null) };
}

/** Texto do pedido no formato do WhatsApp (*negrito*, _itálico_). */
export function montarMensagem(linhas: Linha[], c: Checkout) {
  const t = totais(linhas);
  const L: string[] = [];
  L.push("*Pedido pelo site — poRtinha*", "");
  L.push(`*Nome:* ${c.nome.trim()}`);
  if (c.tipo === "entrega") {
    L.push("*Tipo:* Entrega");
    L.push(`*Endereço:* ${c.endereco.trim()}, ${c.numero.trim()} — ${c.bairro.trim()}`);
    if (c.complemento.trim()) L.push(`*Complemento:* ${c.complemento.trim()}`);
  } else {
    L.push("*Tipo:* Retirada no balcão");
  }
  L.push("", "*Itens*");
  for (const l of linhas) {
    const preco = l.unit != null ? brl(l.unit * l.qtd) : "valor a consultar";
    L.push(`${l.qtd}x ${l.nome}${l.variante ? ` (${l.variante})` : ""} — ${preco}`);
    for (const a of l.adicionais) L.push(`   + ${a.label}${a.escolha ? `: ${a.escolha}` : ""}`);
    if (l.obs) L.push(`   _Obs.: ${l.obs}_`);
  }
  L.push("");
  L.push(`Subtotal: ${brl(t.subtotal)}`);
  L.push(`Para viagem: ${brl(t.viagem)}`);
  L.push(`*Total: ${brl(t.total)}*${t.temConsulta ? " + itens a consultar" : ""}`);
  if (c.tipo === "entrega") L.push("_Taxa de entrega a combinar._");
  L.push("");
  L.push(`*Pagamento:* ${c.pagamento}${c.pagamento === "Dinheiro" && c.troco.trim() ? ` (troco para ${c.troco.trim()})` : ""}`);
  if (c.obs.trim()) L.push(`*Observações:* ${c.obs.trim()}`);
  return L.join("\n");
}
