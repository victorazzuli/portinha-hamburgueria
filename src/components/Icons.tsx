/** Ícones SVG inline (traço 1.75, 24px). Decorativos por padrão: quem usa dá o rótulo ao botão/link. */
type P = { className?: string; size?: number };
const base = (size = 20) => ({
  width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor",
  strokeWidth: 1.75, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, "aria-hidden": true,
});

export const ArrowRight = ({ className = "", size }: P) => (
  <svg {...base(size)} className={`arrow ${className}`}><path d="M5 12h14M13 6l6 6-6 6" /></svg>
);
export const MapPin = ({ className, size }: P) => (
  <svg {...base(size)} className={className}><path d="M12 21s-7-6.1-7-11.5A7 7 0 0 1 19 9.5C19 14.9 12 21 12 21z" /><circle cx="12" cy="9.5" r="2.5" /></svg>
);
export const Clock = ({ className, size }: P) => (
  <svg {...base(size)} className={className}><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>
);
export const Flame = ({ className, size }: P) => (
  <svg {...base(size)} className={className}><path d="M12 22c4 0 7-2.7 7-7 0-4.5-3.5-7-4.5-11-2 2-3 4-3 6-1-1-1.5-2-1.5-3.5C7.5 9 5 11.5 5 15c0 4.3 3 7 7 7z" /><path d="M12 22c-1.7 0-3-1.3-3-3.2 0-2 1.5-3 3-5 1.5 2 3 3 3 5 0 1.9-1.3 3.2-3 3.2z" /></svg>
);
export const Phone = ({ className, size }: P) => (
  <svg {...base(size)} className={className}><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2" /></svg>
);
export const Instagram = ({ className, size }: P) => (
  <svg {...base(size)} className={className}><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r=".6" fill="currentColor" /></svg>
);
export const WhatsApp = ({ className, size = 20 }: P) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
    <path d="M12.04 2a9.9 9.9 0 0 0-8.5 15l-1.4 5 5.1-1.3A9.9 9.9 0 1 0 12.04 2zm0 18.1a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3a8.2 8.2 0 1 1 6.9 3.8zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.3-.4.7-1.4.1-.2 0-.3 0-.5l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 2.9 2.9 0 0 0-.9 2.2 5.1 5.1 0 0 0 1.1 2.7 11.6 11.6 0 0 0 4.4 3.9c1.6.7 2.3.8 3.1.6.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2-.1-.1-.3-.2-.5-.3z" />
  </svg>
);
export const Bag = ({ className, size }: P) => (
  <svg {...base(size)} className={className}><path d="M6 7h12l1 14H5L6 7z" /><path d="M9 7a3 3 0 0 1 6 0" /></svg>
);
export const Play = ({ className, size = 14 }: P) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="currentColor" aria-hidden="true" className={className}><path d="M4 2.5v11l9-5.5z" /></svg>
);
export const Pause = ({ className, size = 14 }: P) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="currentColor" aria-hidden="true" className={className}><path d="M4 2.5h3v11H4zM9 2.5h3v11H9z" /></svg>
);

/** Ícone do canal de pedido escolhido */
export function ChannelIcon({ kind, size }: { kind: "whatsapp" | "ifood" | "instagram"; size?: number }) {
  if (kind === "whatsapp") return <WhatsApp size={size} />;
  if (kind === "instagram") return <Instagram size={size} />;
  return <Bag size={size} />;
}
