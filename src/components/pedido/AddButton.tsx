"use client";
import { todosItens } from "@/data/cardapio";
import { usePedido } from "./PedidoContext";

/** Botão "adicionar" de um item do cardápio — abre o seletor de opções. */
export default function AddButton({ itemId, nome, variant = "round" }: { itemId: string; nome: string; variant?: "round" | "wide" }) {
  const { abrirItem } = usePedido();
  const open = () => { const it = todosItens().find((i) => i.id === itemId); if (it) abrirItem(it); };

  if (variant === "wide") {
    return (
      <button type="button" onClick={open} className="btn btn-fire">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14" /></svg>
        <span>Adicionar ao pedido</span>
      </button>
    );
  }
  return (
    <button
      type="button"
      onClick={open}
      aria-label={`Adicionar ${nome} ao pedido`}
      className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-fire text-cream shadow-md transition-[background-color,transform] duration-300 ease-cine hover:bg-leather active:scale-90"
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14" /></svg>
    </button>
  );
}
