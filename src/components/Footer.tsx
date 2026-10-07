import { NAV, SITE } from "@/data/site";
import { Instagram, MapPin } from "./Icons";

export default function Footer() {
  return (
    <footer className="border-t border-cream/10 bg-night pb-28 pt-16 sm:pb-16">
      <div className="wrap grid gap-12 md:grid-cols-[1.3fr_1fr_1fr]">
        <div>
          <div className="flex items-center gap-4">
            <img src={SITE.logo} alt="Logo poRtinha — Hamburgueres Artesanais" width={72} height={72} loading="lazy" className="h-[72px] w-[72px] rounded-full" />
            <p className="font-slab text-3xl font-bold leading-none">po<span className="text-ember">R</span>tinha</p>
          </div>
          <p className="mt-5 max-w-[32ch] text-smoke">{SITE.description}</p>
        </div>
        <nav aria-label="Rodapé">
          <h2 className="eyebrow text-cheddar">Navegue</h2>
          <ul className="mt-4">
            {NAV.map((n) => (
              <li key={n.href}><a href={n.href} className="link-u inline-flex min-h-[44px] items-center text-cream/85 hover:text-cream">{n.label}</a></li>
            ))}
          </ul>
        </nav>
        <div>
          <h2 className="eyebrow text-cheddar">Visite</h2>
          <ul className="mt-4 space-y-1 text-cream/85">
            <li>
              <a href={SITE.mapsUrl} target="_blank" rel="noopener noreferrer" className="flex min-h-[44px] items-start gap-2 py-2 hover:text-cream">
                <MapPin size={18} className="mt-1 shrink-0 text-ember" />
                <span className="link-u">{SITE.address.street}<br />{SITE.address.city}/{SITE.address.state} · {SITE.address.postalCode}</span>
              </a>
            </li>
            <li>
              <a href={SITE.instagram.url} target="_blank" rel="noopener noreferrer" className="flex min-h-[44px] items-center gap-2 hover:text-cream">
                <Instagram size={18} className="text-ember" />
                <span className="link-u">{SITE.instagram.handle}</span>
              </a>
            </li>
            <li>
              <a href={SITE.chef.url} target="_blank" rel="noopener noreferrer" className="flex min-h-[44px] items-center gap-2 hover:text-cream">
                <span className="text-smoke">Chef</span>
                <span className="link-u">{SITE.chef.handle}</span>
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="wrap mt-14 flex flex-col gap-2 border-t border-cream/10 pt-6 text-[14px] text-smoke sm:flex-row sm:justify-between">
        <p>© {new Date().getFullYear()} {SITE.name}. Todos os direitos reservados.</p>
        <p>Hambúrguer artesanal raiz em Guarulhos/SP</p>
      </div>
    </footer>
  );
}
