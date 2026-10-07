"use client";
import { useEffect, useRef, useState } from "react";
import { SITE, orderChannel } from "@/data/site";
import { StatusAberto } from "./Horarios";
import { ArrowRight, Bag, ChannelIcon, MapPin, Pause, Play } from "./Icons";

/**
 * Hero em vídeo ocupando a tela inteira.
 * - Desktop/tablet deitado: vídeo horizontal 1920×1080 montado com 3 cenas dos reels oficiais
 *   lado a lado (grelha · cozinha · neon) — cada cena nítida, sem esticar o vertical.
 * - Celular: o reel vertical em tela cheia (o formato já é o da tela).
 * - Poster sempre por baixo (carregamento, "reduzir movimento", economia de dados, falha).
 * - Pausa fora da tela e com a aba oculta; botão de pausa visível (WCAG 2.2.2).
 */
const VIDEO = {
  wide: { src: "/video/hero-wide.mp4", poster: "/video/hero-wide.jpg" },
  tall: { src: "/video/hero-720.mp4", poster: "/video/hero-poster.jpg" },
};

// Brasas: posições fixas (determinísticas) para não haver diferença entre servidor e cliente
// (gerador inteiro: Math.sin varia entre motores JS e quebraria a hidratação)
let seed = 7;
const rand = () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646;
const EMBERS = Array.from({ length: 22 }, () => {
  const v = [rand(), rand(), rand(), rand(), rand()];
  return { left: `${(v[0] * 100).toFixed(1)}%`, s: `${(2 + v[1] * 3).toFixed(1)}px`, t: `${(6 + v[2] * 7).toFixed(1)}s`, dl: `${(-v[3] * 12).toFixed(1)}s`, x: `${((v[4] - 0.5) * 120).toFixed(0)}px` };
});

type Mode = "wide" | "tall" | null;

export default function Hero() {
  const [mode, setMode] = useState<Mode>(null);
  const [playing, setPlaying] = useState(false);
  const [userPaused, setUserPaused] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const order = orderChannel();

  // Escolhe o vídeo pela orientação da tela (e acompanha a mudança)
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData;
    if (reduce || saveData) return;
    const mq = window.matchMedia("(min-aspect-ratio: 1/1) and (min-width: 768px)");
    const pick = () => { setPlaying(false); setMode(mq.matches ? "wide" : "tall"); };
    pick();
    mq.addEventListener("change", pick);
    return () => mq.removeEventListener("change", pick);
  }, []);

  // Reproduz só com o hero visível, aba ativa e sem pausa do usuário
  useEffect(() => {
    const section = sectionRef.current;
    const v = videoRef.current;
    if (!section || !v || !mode) return;
    let visible = true;
    const sync = () => (visible && !document.hidden && !userPaused ? v.play().catch(() => {}) : v.pause());
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; sync(); }, { threshold: 0.05 });
    io.observe(section);
    document.addEventListener("visibilitychange", sync);
    sync();
    return () => { io.disconnect(); document.removeEventListener("visibilitychange", sync); };
  }, [mode, userPaused]);

  return (
    <section ref={sectionRef} id="topo" aria-labelledby="hero-titulo" className="grain relative isolate flex min-h-[100svh] items-end overflow-hidden bg-night md:items-center">
      {/* ---------- Fundo em vídeo ---------- */}
      <div className="absolute inset-0 -z-10" aria-hidden="true">
        <picture>
          <source media="(min-aspect-ratio: 1/1) and (min-width: 768px)" srcSet={VIDEO.wide.poster} />
          <img src={VIDEO.tall.poster} alt="" fetchPriority="high" decoding="async" className="absolute inset-0 h-full w-full object-cover" />
        </picture>
        {mode && (
          <video
            key={mode}
            ref={videoRef}
            src={VIDEO[mode].src}
            muted
            loop
            playsInline
            autoPlay
            preload="auto"
            disablePictureInPicture
            tabIndex={-1}
            onPlaying={() => setPlaying(true)}
            onError={() => setMode(null)}
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-[1200ms] ease-cine ${playing ? "opacity-100" : "opacity-0"}`}
          />
        )}
        {/* Camadas escuras: contraste do texto em qualquer quadro */}
        <div className="absolute inset-0 bg-night/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-night via-night/40 to-night/50 md:bg-gradient-to-r md:from-night/90 md:via-night/50 md:to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-night to-transparent" />
        {/* Brasas */}
        <div className="pointer-events-none absolute inset-0 z-[2] overflow-hidden">
          {EMBERS.map((e, i) => (
            <span key={i} className="ember-dot" style={{ left: e.left, ["--s" as string]: e.s, ["--t" as string]: e.t, ["--dl" as string]: e.dl, ["--x" as string]: e.x }} />
          ))}
        </div>
      </div>

      {/* ---------- Conteúdo ---------- */}
      <div className="wrap relative z-[3] pb-14 pt-[calc(var(--header-h)+3rem)] md:py-[calc(var(--header-h)+3rem)]">
        <p className="hero-in eyebrow flex items-center gap-3 text-cheddar" style={{ ["--d" as string]: "100ms" }}>
          <span className="h-px w-10 bg-cheddar" aria-hidden="true" />
          Hambúrguer artesanal raiz<span className="hidden sm:inline"> · Guarulhos</span>
        </p>
        <h1 id="hero-titulo" className="headline mt-6 text-[clamp(4.2rem,14vw,12rem)] text-cream [text-shadow:0_4px_40px_rgb(0_0_0/.5)]">
          <span className="hero-in block" style={{ ["--d" as string]: "200ms" }}>Simples,</span>
          <span className="hero-in block text-ember" style={{ ["--d" as string]: "320ms" }}>bruto</span>
          <span className="hero-in block" style={{ ["--d" as string]: "440ms" }}>e saboroso.</span>
        </h1>
        <p className="hero-in mt-7 max-w-[34ch] font-slab text-[clamp(1.25rem,2.2vw,1.6rem)] italic leading-snug text-cream/90" style={{ ["--d" as string]: "560ms" }}>
          O “<span className="not-italic font-bold text-cheddar">R</span>” maiúsculo vem do sabo<span className="not-italic font-bold text-cheddar">R</span> do inte<span className="not-italic font-bold text-cheddar">R</span>io<span className="not-italic font-bold text-cheddar">R</span>.
        </p>
        <div className="hero-in mt-10 flex flex-col gap-3 sm:flex-row" style={{ ["--d" as string]: "680ms" }}>
          <a href="#cardapio" className="btn btn-fire">
            <Bag size={18} />
            <span>Montar meu pedido</span>
            <ArrowRight size={18} />
          </a>
          <a href={order.href} target="_blank" rel="noopener noreferrer" className="btn btn-line backdrop-blur-sm">
            <ChannelIcon kind={order.kind} size={18} />
            <span>{order.label}</span>
          </a>
        </div>
        <div className="hero-in mt-8 flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:gap-5" style={{ ["--d" as string]: "800ms" }}>
          <a href={SITE.mapsUrl} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-[44px] items-center gap-2 text-[15px] text-cream/80 transition-colors hover:text-cream">
            <MapPin size={18} className="text-ember" />
            <span className="link-u">{SITE.address.street} · {SITE.address.city}/{SITE.address.state}</span>
          </a>
          <StatusAberto />
        </div>
      </div>

      {/* Pausa do vídeo */}
      {mode && (
        <button
          type="button"
          onClick={() => setUserPaused((p) => !p)}
          aria-label={userPaused ? "Reproduzir vídeo de fundo" : "Pausar vídeo de fundo"}
          className="absolute right-5 top-[calc(var(--header-h)+1rem)] z-[4] grid h-11 w-11 place-items-center rounded-full border border-cream/40 bg-night/30 text-cream backdrop-blur-sm transition-colors hover:bg-cream hover:text-night sm:right-8 md:bottom-8 md:right-12 md:top-auto"
        >
          {userPaused ? <Play /> : <Pause />}
        </button>
      )}

      {/* Indicador de rolagem */}
      <a href="#a-casa" aria-label="Rolar para conhecer a casa" className="absolute bottom-6 left-1/2 z-[4] hidden h-14 w-11 -translate-x-1/2 items-start justify-center md:flex">
        <span aria-hidden="true" className="scroll-cue block h-12 w-px bg-cream/70" />
      </a>
    </section>
  );
}
