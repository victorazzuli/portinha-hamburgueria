"use client";
import { useEffect, useRef } from "react";

/**
 * Modal sobre o <dialog> nativo: foco preso, Esc fecha, fundo inerte e
 * o foco volta para quem abriu. `variant="sheet"` vira gaveta lateral no desktop.
 */
export default function Modal({
  open, onClose, labelledBy, variant = "center", children,
}: { open: boolean; onClose: () => void; labelledBy: string; variant?: "center" | "sheet"; children: React.ReactNode }) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) {
      d.showModal();
      document.documentElement.style.overflow = "hidden";
    } else if (!open && d.open) {
      d.close();
    }
    if (!open) document.documentElement.style.overflow = "";
  }, [open]);

  useEffect(() => () => { document.documentElement.style.overflow = ""; }, []);

  const pos =
    variant === "sheet"
      ? "m-0 ml-auto h-[100dvh] max-h-[100dvh] w-full max-w-[480px] sm:rounded-l-[28px]"
      : "mx-auto mb-0 mt-auto max-h-[92dvh] w-full max-w-[560px] rounded-t-[28px] sm:mb-auto sm:rounded-[28px]";

  return (
    <dialog
      ref={ref}
      aria-labelledby={labelledBy}
      onCancel={(e) => { e.preventDefault(); onClose(); }}
      onClick={(e) => { if (e.target === ref.current) onClose(); }}
      className={`modal ${pos} overflow-hidden bg-coal p-0 text-cream shadow-[0_30px_120px_-20px_rgb(0_0_0/.9)] ring-1 ring-cream/10`}
    >
      {open && children}
    </dialog>
  );
}
