import Hero from "@/components/Hero";
import Marquee from "@/components/Marquee";
import Cardapio from "@/components/Cardapio";
import { ArrowRight, Clock, MapPin, Phone } from "@/components/Icons";
import LoopVideo from "@/components/LoopVideo";
import { SITE, orderChannel } from "@/data/site";
import Horarios from "@/components/Horarios";

export const metadata = { alternates: { canonical: "/" } };

const PASSOS = [
  { n: "01", clip: "clip-grelha", alt: "Vídeo: hambúrgueres na parrilla, com faíscas da brasa", titulo: "A brasa", texto: "Fogo de lenha e parrilla quente. Os 200 g de carne vão direto pro fogo e ganham a crosta que só a brasa dá." },
  { n: "02", clip: "clip-queijo", alt: "Vídeo: queijo derretendo sobre os hambúrgueres na grelha", titulo: "O queijo", texto: "Ainda na grelha, o queijo cai por cima e derrete no calor da carne. Sem pressa, no ponto." },
  { n: "03", clip: "clip-montagem", alt: "Vídeo: pães selados e o lanche sendo montado na tábua", titulo: "A montagem", texto: "Brioche selado na manteiga e lanche montado na hora, comanda por comanda. Do fogo direto pra sua mão." },
];


export default function Home() {
  const order = orderChannel();
  return (
    <>
      <Hero />
      <Marquee />

      {/* ---------- A casa ---------- */}
      <section id="a-casa" aria-labelledby="casa-titulo" className="relative overflow-hidden py-[var(--space-section)]">
        <div className="wrap grid items-center gap-14 lg:grid-cols-[1.05fr_.95fr] lg:gap-24">
          <div>
            <p className="rv eyebrow text-cheddar">A casa</p>
            <h2 id="casa-titulo" className="rv headline mt-4 text-[clamp(3.2rem,8vw,7.2rem)]" style={{ ["--d" as string]: "80ms" }}>
              Hambúrguer de verdade <span className="text-ember">não precisa de enfeite.</span>
            </h2>
            <div className="rv mt-8 max-w-[52ch] space-y-5 text-[19px] text-smoke" style={{ ["--d" as string]: "160ms" }}>
              <p>
                Na po<b className="font-bold text-cream">R</b>tinha o hambúrguer é feito do jeito raiz: 200 g de carne na parrilla, fogo de lenha,
                pão de brioche selado na manteiga e o tempero do interior. É daí que vem o “R” maiúsculo — do sabo<b className="font-bold text-cream">R</b> do inte<b className="font-bold text-cream">R</b>io<b className="font-bold text-cream">R</b>.
              </p>
              <p>
                Simples, bruto e saboroso. Sob o comando do chef{" "}
                <a href={SITE.chef.url} target="_blank" rel="noopener noreferrer" className="font-semibold text-cream underline decoration-ember decoration-2 underline-offset-4 hover:text-cheddar">
                  {SITE.chef.name}
                </a>
                , em Guarulhos.
              </p>
            </div>
            <div className="rv mt-10 grid max-w-lg grid-cols-3 border-y border-cream/15" style={{ ["--d" as string]: "240ms" }}>
              {[["Artesanal", "feito na hora"], ["Parrilla", "fogo de lenha"], ["Raiz", "sabor do interior"]].map(([t, s]) => (
                <div key={t} className="border-cream/15 py-5 pr-3 [&:not(:first-child)]:border-l [&:not(:first-child)]:pl-4">
                  <p className="headline text-[30px] text-cheddar sm:text-[36px]">{t}</p>
                  <p className="text-[14px] leading-snug text-smoke">{s}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="rv-mask relative mx-auto aspect-[4/5] w-full max-w-[520px] overflow-hidden rounded-[28px]">
              <div className="absolute inset-0">
                <LoopVideo src="/video/clip-casa.mp4" poster="/video/clip-casa.jpg" label="Vídeo: a equipe da poRtinha montando os lanches na cozinha" />
              </div>
            </div>
            <div className="rv absolute -bottom-8 -left-2 hidden w-44 rotate-[-6deg] rounded-[20px] bg-cream p-4 text-night shadow-2xl sm:block lg:-left-10" style={{ ["--d" as string]: "300ms" }}>
              <img src={SITE.logo} alt="" width={72} height={72} loading="lazy" className="mx-auto h-[72px] w-[72px] rounded-full" />
              <p className="mt-2 text-center font-slab text-[15px] font-bold leading-tight text-leather">Hambúrgueres artesanais</p>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- Na brasa ---------- */}
      <section id="na-brasa" aria-labelledby="brasa-titulo" className="grain relative overflow-hidden bg-coal py-[var(--space-section)]">
        <div className="wrap relative z-[2]">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <p className="rv eyebrow text-cheddar">Na brasa</p>
              <h2 id="brasa-titulo" className="rv headline mt-4 text-[clamp(3.2rem,8vw,7rem)]" style={{ ["--d" as string]: "80ms" }}>
                Do fogo <span className="text-ember">pra sua mão</span>
              </h2>
            </div>
            <p className="rv max-w-[38ch] text-smoke" style={{ ["--d" as string]: "160ms" }}>
              Parrilla, não chapa: a carne vai pro fogo de lenha e ganha aquela pegada defumada. Dá pra ver o fogo, sentir o cheiro e ouvir a carne chiando.
            </p>
          </div>

          <ol className="mt-16 grid gap-6 md:grid-cols-3">
            {PASSOS.map((p, i) => (
              <li key={p.n} className="rv group" style={{ ["--d" as string]: `${i * 120}ms` }}>
                <figure className="relative aspect-[3/4] overflow-hidden rounded-[24px] bg-night">
                  <div className="absolute inset-0 transition-transform duration-[1200ms] ease-cine group-hover:scale-[1.04]">
                    <LoopVideo src={`/video/${p.clip}.mp4`} poster={`/video/${p.clip}.jpg`} label={p.alt} />
                  </div>
                  <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-night via-night/30 to-transparent" />
                  <span aria-hidden="true" className="headline absolute right-5 top-4 text-[64px] text-cream/25">{p.n}</span>
                  <figcaption className="absolute inset-x-6 bottom-6">
                    <h3 className="headline text-[44px] text-cream">{p.titulo}</h3>
                    <p className="mt-2 text-[16px] leading-relaxed text-cream/80">{p.texto}</p>
                  </figcaption>
                </figure>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <Cardapio />

      {/* ---------- Deveria ser crime ---------- */}
      <section aria-labelledby="crime-titulo" className="grain relative isolate overflow-hidden py-[var(--space-section)]">
        <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[radial-gradient(60%_60%_at_75%_50%,rgb(var(--fire)/.28),transparent_70%)]" />
        <div className="wrap relative z-[2] grid items-center gap-14 lg:grid-cols-[1fr_.9fr] lg:gap-20">
          <div className="text-center lg:text-left">
            <p className="rv eyebrow text-cheddar">Tá escrito no muro</p>
            <h2 id="crime-titulo" className="rv headline mt-5 text-[clamp(4.5rem,13vw,11.5rem)] text-cream" style={{ ["--d" as string]: "80ms" }}>
              Deveria <span className="accent block text-[.42em] leading-[1.1] text-cheddar">ser</span> <span className="text-ember">crime.</span>
            </h2>
            <p className="rv mx-auto mt-6 max-w-[40ch] text-[19px] text-cream/85 lg:mx-0" style={{ ["--d" as string]: "160ms" }}>
              Vem conferir de perto: mesa no quintal, fila na porta e a brasa acesa.
            </p>
            <div className="rv mt-10 flex flex-col justify-center gap-3 sm:flex-row lg:justify-start" style={{ ["--d" as string]: "240ms" }}>
              <a href={SITE.mapsUrl} target="_blank" rel="noopener noreferrer" className="btn btn-cheddar">
                <MapPin size={18} />
                <span>Como chegar</span>
              </a>
              <a href={order.href} target="_blank" rel="noopener noreferrer" className="btn btn-line">
                <span>{order.label}</span>
                <ArrowRight size={18} />
              </a>
            </div>
          </div>
          <div className="rv-mask relative mx-auto aspect-[4/5] w-full max-w-[560px] overflow-hidden rounded-[28px] ring-1 ring-cream/10">
            <div className="absolute inset-0">
              <LoopVideo src="/video/clip-mural.mp4" poster="/video/clip-mural.jpg" label="Vídeo: fachada da poRtinha à noite, com o mural Deveria Ser Crime e clientes na fila" />
            </div>
          </div>
        </div>
      </section>

      {/* ---------- Onde estamos ---------- */}
      <section id="onde" aria-labelledby="onde-titulo" className="py-[var(--space-section)]">
        <div className="wrap grid gap-12 lg:grid-cols-[.9fr_1.1fr] lg:gap-20">
          <div>
            <p className="rv eyebrow text-cheddar">Onde estamos</p>
            <h2 id="onde-titulo" className="rv headline mt-4 text-[clamp(3.2rem,8vw,6.5rem)]" style={{ ["--d" as string]: "80ms" }}>
              Bate na <span className="accent block text-[.8em] leading-[1.15] text-ember">poRtinha</span>
            </h2>
            <dl className="rv mt-10 space-y-7" style={{ ["--d" as string]: "160ms" }}>
              <div className="flex gap-4">
                <dt><MapPin size={24} className="mt-1 text-ember" /><span className="sr-only">Endereço</span></dt>
                <dd>
                  <p className="text-[20px] font-semibold">{SITE.address.street}</p>
                  <p className="text-smoke">{SITE.address.city}/{SITE.address.state} · CEP {SITE.address.postalCode}</p>
                </dd>
              </div>
              <div className="flex gap-4">
                <dt><Clock size={24} className="mt-1 text-ember" /><span className="sr-only">Horário</span></dt>
                <dd className="flex-1"><Horarios /></dd>
              </div>
              {SITE.phone && (
                <div className="flex gap-4">
                  <dt><Phone size={24} className="mt-1 text-ember" /><span className="sr-only">Telefone</span></dt>
                  <dd><a href={`tel:+55${SITE.phone.replace(/\D/g, "")}`} className="text-[20px] font-semibold hover:text-cheddar">{SITE.phone}</a></dd>
                </div>
              )}
            </dl>
            <div className="rv mt-10 flex flex-col gap-3 sm:flex-row" style={{ ["--d" as string]: "240ms" }}>
              <a href={SITE.mapsUrl} target="_blank" rel="noopener noreferrer" className="btn btn-fire">
                <MapPin size={18} />
                <span>Abrir no mapa</span>
              </a>
              <a href={order.href} target="_blank" rel="noopener noreferrer" className="btn btn-line">
                <span>{order.label}</span>
                <ArrowRight size={18} />
              </a>
            </div>
          </div>
          <div className="rv relative min-h-[380px] overflow-hidden rounded-[28px] bg-coal ring-1 ring-cream/10 lg:min-h-[520px]" style={{ ["--d" as string]: "120ms" }}>
            <iframe
              title={`Mapa: ${SITE.name}, ${SITE.fullAddress}`}
              src={SITE.mapsEmbed}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="absolute inset-0 h-full w-full border-0 [filter:grayscale(.9)_invert(.92)_hue-rotate(180deg)_contrast(.9)]"
            />
          </div>
        </div>
      </section>
    </>
  );
}
