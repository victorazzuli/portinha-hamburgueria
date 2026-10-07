import type { Metadata, Viewport } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Motion from "@/components/Motion";
import OrderFab from "@/components/OrderFab";
import { SITE } from "@/data/site";
import { openingHoursLd } from "@/data/horarios";
import { PedidoProvider } from "@/components/pedido/PedidoContext";
import ItemDialog from "@/components/pedido/ItemDialog";
import Sacola, { SacolaBar } from "@/components/pedido/Sacola";

const title = "poRtinha A Hamburgueria | Hambúrguer artesanal na brasa em Guarulhos";

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: { default: title, template: "%s | poRtinha A Hamburgueria" },
  description: SITE.description,
  keywords: ["hamburgueria Guarulhos", "hambúrguer artesanal Guarulhos", "hambúrguer na brasa", "poRtinha", "hamburgueria artesanal"],
  openGraph: {
    type: "website", locale: "pt_BR", siteName: SITE.name, url: SITE.url, title, description: SITE.description,
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "poRtinha A Hamburgueria — simples, bruto e saboroso" }],
  },
  twitter: { card: "summary_large_image", title, description: SITE.description, images: ["/opengraph-image"] },
  formatDetection: { telephone: false },
  // Link de prévia para aprovação do cliente: fora dos buscadores
  robots: process.env.NEXT_PUBLIC_PREVIEW === "1" ? { index: false, follow: false } : undefined,
};

export const viewport: Viewport = { themeColor: "#0f0c0a", width: "device-width", initialScale: 1, viewportFit: "cover" };

const restaurantLd = {
  "@context": "https://schema.org",
  "@type": "Restaurant",
  name: SITE.name,
  url: SITE.url,
  logo: `${SITE.url}${SITE.logo}`,
  image: `${SITE.url}/video/hero-wide.jpg`,
  description: SITE.description,
  servesCuisine: ["Hambúrguer", "Hambúrguer artesanal"],
  telephone: SITE.phone || undefined,
  address: {
    "@type": "PostalAddress", streetAddress: SITE.address.street, addressLocality: SITE.address.city,
    addressRegion: SITE.address.state, postalCode: SITE.address.postalCode, addressCountry: "BR",
  },
  hasMap: SITE.mapsUrl,
  openingHoursSpecification: openingHoursLd,
  hasMenu: `${SITE.url}/#cardapio`,
  acceptsReservations: false,
  sameAs: [SITE.instagram.url],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Source+Sans+3:wght@400;600;700&family=Zilla+Slab:ital,wght@0,700;1,600&display=swap"
        />
        <link rel="preload" as="image" href="/video/hero-wide.jpg" media="(min-aspect-ratio: 1/1) and (min-width: 768px)" fetchPriority="high" />
        <link rel="preload" as="image" href="/video/hero-poster.jpg" media="not all and (min-aspect-ratio: 1/1), (max-width: 767px)" fetchPriority="high" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(restaurantLd).replace(/</g, "\\u003c") }} />
      </head>
      <body>
        <a href="#conteudo" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-cheddar focus:px-5 focus:py-3 focus:font-semibold focus:text-night">
          Pular para o conteúdo
        </a>
        <PedidoProvider>
          <Header />
          <main id="conteudo">{children}</main>
          <Footer />
          <OrderFab />
          <SacolaBar />
          <ItemDialog />
          <Sacola />
        </PedidoProvider>
        <Motion />
      </body>
    </html>
  );
}
