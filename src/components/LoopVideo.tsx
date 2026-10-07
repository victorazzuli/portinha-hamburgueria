"use client";
import { useEffect, useRef, useState } from "react";

/**
 * Trecho de vídeo em loop no lugar de foto.
 * Só baixa quando chega perto da tela, só toca visível, pausa fora dela.
 * Em "reduzir movimento" ou economia de dados fica só o poster.
 */
export default function LoopVideo({ src, poster, label, className = "" }: { src: string; poster: string; label: string; className?: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [ativo, setAtivo] = useState(false); // já pode carregar o vídeo
  const [visivel, setVisivel] = useState(false);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData;
    if (reduce || saveData) return;
    const io = new IntersectionObserver(([e]) => {
      setVisivel(e.isIntersecting);
      if (e.isIntersecting) setAtivo(true);
    }, { rootMargin: "200px 0px", threshold: 0.01 });
    io.observe(v);
    const onVis = () => {
      const r = v.getBoundingClientRect();
      setVisivel(!document.hidden && r.bottom > 0 && r.top < window.innerHeight);
    };
    document.addEventListener("visibilitychange", onVis);
    return () => { io.disconnect(); document.removeEventListener("visibilitychange", onVis); };
  }, []);

  useEffect(() => {
    const v = ref.current;
    if (!v || !ativo) return;
    if (visivel && !document.hidden) v.play().catch(() => {});
    else v.pause();
  }, [ativo, visivel]);

  return (
    <video
      ref={ref}
      src={ativo ? src : undefined}
      poster={poster}
      muted
      loop
      playsInline
      preload="none"
      disablePictureInPicture
      role="img"
      aria-label={label}
      className={`h-full w-full object-cover ${className}`}
    />
  );
}
