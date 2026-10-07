import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const alt = "poRtinha A Hamburgueria — simples, bruto e saboroso";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OG() {
  const pub = join(process.cwd(), "public");
  const [logo, photo] = await Promise.all([readFile(join(pub, "img/logo.png")), readFile(join(pub, "video/hero-poster.jpg"))]);
  const src = (b: Buffer, t: string) => `data:${t};base64,${b.toString("base64")}`;
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", background: "#0f0c0a", color: "#f3e6d3" }}>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 72px" }}>
          <img src={src(logo, "image/png")} width={132} height={132} style={{ borderRadius: 999 }} />
          <div style={{ marginTop: 36, fontSize: 92, fontWeight: 800, lineHeight: 0.95, letterSpacing: -2, display: "flex", flexDirection: "column" }}>
            <span>SIMPLES,</span>
            <span style={{ color: "#e5533a" }}>BRUTO</span>
            <span>E SABOROSO.</span>
          </div>
          <div style={{ marginTop: 28, fontSize: 30, color: "#b8a896" }}>Hambúrguer artesanal raiz · Guarulhos/SP</div>
        </div>
        <img src={src(photo, "image/jpeg")} width={354} height={630} style={{ objectFit: "cover" }} />
      </div>
    ),
    size
  );
}
