"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Motor de movimento leve (sem dependências):
 *  - .rv / .rv-mask → reveal ao entrar na tela
 *  - [data-parallax="0.15"] → deslocamento vertical suave via rAF
 *  - [data-count="230"] → contador animado
 * Tudo respeita prefers-reduced-motion e o conteúdo fica visível sem JS.
 */
export default function Motion() {
  const pathname = usePathname();

  useEffect(() => {
    const root = document.documentElement;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    root.classList.add("js");

    // Elementos com clip-path total não "intersectam"; observamos o pai e marcamos o filho.
    const proxy = new WeakMap<Element, HTMLElement[]>();
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          const masked = proxy.get(e.target);
          if (masked) { masked.forEach((m) => m.classList.add("in")); proxy.delete(e.target); io.unobserve(e.target); return; }
          const el = e.target as HTMLElement;
          el.classList.add("in");
          if (el.dataset.count && !el.dataset.done) {
            el.dataset.done = "1";
            const target = Number(el.dataset.count);
            if (reduce) {
              el.textContent = target.toLocaleString("pt-BR");
            } else {
              const t0 = performance.now();
              const tick = (t: number) => {
                const p = Math.min(1, (t - t0) / 1600);
                const eased = 1 - Math.pow(1 - p, 4);
                el.textContent = Math.round(target * eased).toLocaleString("pt-BR");
                if (p < 1) requestAnimationFrame(tick);
              };
              requestAnimationFrame(tick);
            }
          }
          io.unobserve(el);
        }),
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
    );
    const scan = () => {
      document.querySelectorAll<HTMLElement>(".rv:not(.in), [data-count]:not([data-done])").forEach((el) => io.observe(el));
      document.querySelectorAll<HTMLElement>(".rv-mask:not(.in)").forEach((el) => {
        const host = el.parentElement || document.body;
        const list = proxy.get(host) || [];
        if (!list.includes(el)) list.push(el);
        proxy.set(host, list);
        io.observe(host);
      });
    };
    scan();
    const mo = new MutationObserver(scan);
    mo.observe(document.body, { childList: true, subtree: true });

    // Parallax
    let raf = 0;
    const layers = () => Array.from(document.querySelectorAll<HTMLElement>("[data-parallax]"));
    const update = () => {
      raf = 0;
      if (reduce) return;
      const vh = window.innerHeight;
      layers().forEach((el) => {
        const speed = Number(el.dataset.parallax || 0.15);
        const r = (el.parentElement || el).getBoundingClientRect();
        if (r.bottom < -200 || r.top > vh + 200) return;
        const offset = (r.top + r.height / 2 - vh / 2) * -speed;
        el.style.transform = `translate3d(0, ${offset.toFixed(1)}px, 0)`;
      });
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    update();

    return () => {
      io.disconnect();
      mo.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
  }, [pathname]);

  return null;
}
