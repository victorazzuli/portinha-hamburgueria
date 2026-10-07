import type { Config } from "tailwindcss";

// Design system "Brasa & Couro" — ver design-system/portinha-hamburgueria/MASTER.md
const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        night: "rgb(var(--night) / <alpha-value>)",
        coal: "rgb(var(--coal) / <alpha-value>)",
        cream: "rgb(var(--cream) / <alpha-value>)",
        smoke: "rgb(var(--smoke) / <alpha-value>)",
        ember: "rgb(var(--ember) / <alpha-value>)",
        fire: "rgb(var(--fire) / <alpha-value>)",
        cheddar: "rgb(var(--cheddar) / <alpha-value>)",
        leather: "rgb(var(--leather) / <alpha-value>)",
        bark: "rgb(var(--bark) / <alpha-value>)",
      },
      fontFamily: {
        display: ["'Bebas Neue'", "Impact", "'Arial Narrow'", "sans-serif"],
        slab: ["'Zilla Slab'", "Rockwell", "Georgia", "serif"],
        sans: ["'Source Sans 3'", "system-ui", "-apple-system", "'Segoe UI'", "sans-serif"],
      },
      fontSize: { xs: ["12px", { lineHeight: "1.5" }] },
      letterSpacing: { label: "0.2em" },
      transitionTimingFunction: { cine: "cubic-bezier(.16,1,.3,1)" },
      maxWidth: { site: "1440px" },
    },
  },
  plugins: [],
};
export default config;
