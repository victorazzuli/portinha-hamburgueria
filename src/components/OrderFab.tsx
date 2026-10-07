"use client";
import { useEffect, useState } from "react";
import { Bag } from "./Icons";
import { usePedido } from "./pedido/PedidoContext";

/** Botão flutuante "Fazer pedido": aparece depois do hero e dá lugar à barra da sacola quando há itens. */
export default function OrderFab() {
  const [show, setShow] = useState(false);
  const { qtdTotal } = usePedido();

  useEffect(() => {
    const onScroll = () => {
      const menu = document.getElementById("cardapio")?.getBoundingClientRect();
      const noCardapio = !!menu && menu.top < window.innerHeight * 0.5 && menu.bottom > window.innerHeight * 0.5;
      setShow(window.scrollY > window.innerHeight * 0.8 && !noCardapio);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const visivel = show && !qtdTotal;
  return (
    <a
      href="#cardapio"
      tabIndex={visivel ? 0 : -1}
      aria-hidden={!visivel || undefined}
      className={`fixed bottom-[max(1.25rem,env(safe-area-inset-bottom))] right-5 z-40 flex h-14 items-center gap-2 rounded-full bg-fire pl-4 pr-5 font-semibold uppercase tracking-[0.1em] text-cream shadow-[0_12px_40px_-8px_rgb(229_83_58/.6)] transition-all duration-500 ease-cine hover:bg-leather sm:right-8 ${
        visivel ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-6 opacity-0"
      }`}
    >
      <Bag size={22} />
      <span className="text-[14px]">Fazer pedido</span>
    </a>
  );
}
