"use client";
import { useEffect, useRef, useState } from "react";
import { NAV, SITE, orderChannel } from "@/data/site";
import { Bag, ChannelIcon, Instagram } from "./Icons";

/**
 * Cabeçalho fixo: transparente sobre o hero, sólido depois de rolar.
 * Menu mobile em tela cheia: Esc fecha, foco vai para o primeiro link e volta ao botão ao fechar.
 */
export default function Header() {
  const [solid, setSolid] = useState(false);
  const [open, setOpen] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);
  const firstLink = useRef<HTMLAnchorElement>(null);
  const order = orderChannel();

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    firstLink.current?.focus();
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
      btnRef.current?.focus();
    };
  }, [open]);

  return (
    <>
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-500 ease-cine ${
        solid || open ? "border-b border-cream/10 bg-night/85 backdrop-blur-md" : "border-b border-transparent"
      }`}
    >
      <div className="wrap flex h-[var(--header-h)] items-center justify-between gap-6">
        <a href="#topo" className="group flex items-center gap-3" aria-label={`${SITE.name} — início`}>
          <img src={SITE.logo} alt="" width={46} height={46} className="h-[46px] w-[46px] rounded-full transition-transform duration-500 ease-cine group-hover:rotate-[-8deg]" />
          <span className="font-slab text-[22px] font-bold leading-none tracking-tight text-cream">
            po<span className="text-ember">R</span>tinha
          </span>
        </a>

        <nav aria-label="Principal" className="hidden lg:block">
          <ul className="flex items-center gap-9">
            {NAV.map((n) => (
              <li key={n.href}>
                <a href={n.href} className="link-u py-2 text-[15px] font-semibold uppercase tracking-[0.14em] text-cream/85 transition-colors hover:text-cream">
                  {n.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <a
            href={SITE.instagram.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram da poRtinha (abre em nova aba)"
            className="hidden h-11 w-11 place-items-center rounded-full text-cream/85 transition-colors hover:bg-cream/10 hover:text-cream sm:grid"
          >
            <Instagram />
          </a>
          <a href="#cardapio" className="btn btn-fire hidden !min-h-[44px] !px-5 text-[13px] sm:inline-flex">
            <Bag size={18} />
            <span>Pedir agora</span>
          </a>
          <button
            ref={btnRef}
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-controls="menu-mobile"
            aria-label={open ? "Fechar menu" : "Abrir menu"}
            className="relative grid h-11 w-11 place-items-center rounded-full text-cream hover:bg-cream/10 lg:hidden"
          >
            <span aria-hidden="true" className="relative block h-3.5 w-6">
              <span className={`absolute left-0 h-[2px] w-6 bg-current transition-all duration-300 ${open ? "top-1/2 -translate-y-1/2 rotate-45" : "top-0"}`} />
              <span className={`absolute left-0 top-1/2 h-[2px] w-6 -translate-y-1/2 bg-current transition-opacity duration-200 ${open ? "opacity-0" : ""}`} />
              <span className={`absolute left-0 h-[2px] w-6 bg-current transition-all duration-300 ${open ? "top-1/2 -translate-y-1/2 -rotate-45" : "bottom-0"}`} />
            </span>
          </button>
        </div>
      </div>
    </header>

      {/* Menu mobile — fora do <header>: o backdrop-filter dele prenderia o position:fixed */}
      <div
        id="menu-mobile"
        hidden={!open}
        className="fixed inset-x-0 bottom-0 top-[var(--header-h)] z-[49] overflow-y-auto bg-night lg:hidden"
      >
        <nav aria-label="Menu" className="wrap flex min-h-full flex-col justify-between gap-10 py-10">
          <ul className="space-y-1">
            {NAV.map((n, i) => (
              <li key={n.href}>
                <a
                  ref={i === 0 ? firstLink : undefined}
                  href={n.href}
                  onClick={() => setOpen(false)}
                  className="headline flex min-h-[56px] items-center border-b border-cream/10 text-[44px] text-cream transition-colors hover:text-ember"
                >
                  {n.label}
                </a>
              </li>
            ))}
          </ul>
          <div className="space-y-3">
            <a href="#cardapio" onClick={() => setOpen(false)} className="btn btn-fire w-full">
              <Bag size={18} />
              <span>Montar meu pedido</span>
            </a>
            <a href={order.href} target="_blank" rel="noopener noreferrer" className="btn btn-line w-full">
              <ChannelIcon kind={order.kind} size={18} />
              <span>{order.label}</span>
            </a>
            <a href={SITE.instagram.url} target="_blank" rel="noopener noreferrer" className="btn btn-line w-full">
              <Instagram size={18} />
              <span>{SITE.instagram.handle}</span>
            </a>
          </div>
        </nav>
      </div>
    </>
  );
}
