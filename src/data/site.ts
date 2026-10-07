/**
 * Dados oficiais da poRtinha (bio do Instagram @portinha_a_hamburgueria).
 * Telefone/WhatsApp e horário: perfil da casa no Google (out/2026). O .env pode sobrescrever.
 */
const env = (v?: string) => (v && v.trim() ? v.trim() : null);

const address = {
  street: "Avenida Papa João XXIII, 60",
  city: "Guarulhos",
  state: "SP",
  postalCode: "07114-100",
};
const fullAddress = `${address.street} - ${address.city}/${address.state}, ${address.postalCode}`;

export const SITE = {
  name: "poRtinha A Hamburgueria",
  short: "poRtinha",
  url: (env(process.env.NEXT_PUBLIC_SITE_URL) || "https://portinha-hamburgueria.vercel.app").replace(/\/$/, ""),
  tagline: "Simples, bruto e saboroso.",
  description: "Hambúrguer artesanal raiz em Guarulhos. O “R” maiúsculo vem do saboR do inteRioR. Simples, bruto e saboroso.",
  logo: "/img/logo.png",
  instagram: { handle: "@portinha_a_hamburgueria", url: "https://www.instagram.com/portinha_a_hamburgueria/" },
  chef: { name: "Marco Ungaro", handle: "@marcoungaro.ofc", url: "https://www.instagram.com/marcoungaro.ofc/" },
  address,
  fullAddress,
  mapsUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`poRtinha A Hamburgueria, ${fullAddress}`)}`,
  // Endereço final do embed sem chave (o /maps?output=embed redireciona para cá)
  mapsEmbed: `https://www.google.com/maps/embed?origin=mfe&pb=!1m3!2m1!1s${encodeURIComponent(`${address.street}, ${address.city} ${address.state}`).replace(/%20/g, "+")}!6i17`,
  whatsapp: (env(process.env.NEXT_PUBLIC_WHATSAPP) || "5511978126042").replace(/\D/g, ""),
  ifood: env(process.env.NEXT_PUBLIC_IFOOD_URL),
  phone: env(process.env.NEXT_PUBLIC_PHONE) || "(11) 97812-6042",
  menudino: "https://portinhahamburgueria.menudino.com",
};

export type OrderChannel = { href: string; label: string; kind: "whatsapp" | "ifood" | "instagram" };

/** Melhor canal de pedido disponível: WhatsApp > iFood > Direct do Instagram. */
export function orderChannel(msg = "Olá, poRtinha! Quero fazer um pedido."): OrderChannel {
  if (SITE.whatsapp) return { href: `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(msg)}`, label: "Pedir no WhatsApp", kind: "whatsapp" };
  if (SITE.ifood) return { href: SITE.ifood, label: "Pedir no iFood", kind: "ifood" };
  return { href: "https://ig.me/m/portinha_a_hamburgueria", label: "Pedir pelo Direct", kind: "instagram" };
}

export const NAV = [
  { href: "#a-casa", label: "A casa" },
  { href: "#na-brasa", label: "Na brasa" },
  { href: "#cardapio", label: "Cardápio" },
  { href: "#onde", label: "Onde estamos" },
];
