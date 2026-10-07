import { fileURLToPath } from "node:url";

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Há package-lock.json em pastas acima; fixa a raiz para o build não inferir a errada
  outputFileTracingRoot: fileURLToPath(new URL(".", import.meta.url)),
  reactStrictMode: true,
  poweredByHeader: false,
  images: { formats: ["image/avif", "image/webp"] },
  async headers() {
    // Vídeos e fotos têm nome fixo: cache longo no navegador/CDN
    return [
      { source: "/video/:path*", headers: [{ key: "Cache-Control", value: "public, max-age=604800, stale-while-revalidate=86400" }] },
      { source: "/img/:path*", headers: [{ key: "Cache-Control", value: "public, max-age=604800, stale-while-revalidate=86400" }] },
    ];
  },
};
export default nextConfig;
