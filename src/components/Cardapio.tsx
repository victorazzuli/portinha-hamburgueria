import { AVISOS, BURGER_DO_MES, CARDAPIO, aPartirDe, brl, precoBase, type Item } from "@/data/cardapio";
import { SITE } from "@/data/site";
import AddButton from "./pedido/AddButton";

const preco = (it: Item) => {
  const p = precoBase(it);
  if (p == null) return "Consultar";
  return `${aPartirDe(it) ? "a partir de " : ""}${brl(p)}`;
};

/** Variações listadas como texto (ex.: "Média R$ 17,90 · Grande R$ 26,90") */
function Variacoes({ it }: { it: Item }) {
  if (!it.variantes) return null;
  const precos = new Set(it.variantes.opcoes.map((o) => o.preco));
  return (
    <p className="mt-1 text-[15px] text-bark">
      {precos.size > 1
        ? it.variantes.opcoes.map((o) => `${o.label} ${o.preco != null ? brl(o.preco) : ""}`).join(" · ")
        : it.variantes.opcoes.map((o) => o.label).join(" · ")}
    </p>
  );
}

function Linha({ it }: { it: Item }) {
  return (
    <li className="flex items-center gap-4 py-5">
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline gap-3">
          <h4 className="font-slab text-[22px] font-bold leading-tight">{it.nome}</h4>
          <span aria-hidden="true" className="hidden min-w-6 flex-1 -translate-y-1 border-b border-dotted border-night/40 sm:block" />
          <span className="ml-auto whitespace-nowrap font-display text-[26px] leading-none text-leather sm:ml-0">{preco(it)}</span>
        </div>
        {it.descricao && <p className="mt-1 max-w-[56ch] text-[16px] leading-relaxed text-bark">{it.descricao}</p>}
        <Variacoes it={it} />
      </div>
      <AddButton itemId={it.id} nome={it.nome} />
    </li>
  );
}

export default function Cardapio() {
  const [burgers, ...outras] = CARDAPIO;
  const bm = BURGER_DO_MES;

  return (
    <section id="cardapio" aria-labelledby="cardapio-titulo" className="relative bg-cream py-[var(--space-section)] text-night">
      <div className="wrap">
        <div className="grid gap-8 lg:grid-cols-[1.2fr_.8fr] lg:items-end">
          <div>
            <p className="rv eyebrow text-leather">Cardápio · peça pelo site</p>
            <h2 id="cardapio-titulo" className="rv headline mt-4 text-[clamp(3.2rem,8vw,7rem)]" style={{ ["--d" as string]: "80ms" }}>
              Escolhe o seu. <span className="block text-leather">A brasa faz o resto.</span>
            </h2>
          </div>
          <p className="rv max-w-[42ch] text-[19px] text-bark lg:justify-self-end" style={{ ["--d" as string]: "160ms" }}>
            Monte seu pedido aqui, escolha combo e adicionais e envie direto pro nosso WhatsApp. Sem app, sem cadastro.
          </p>
        </div>

        {/* Burger do mês */}
        <article aria-labelledby="bm-titulo" className="rv mt-14 grid overflow-hidden rounded-[28px] bg-night text-cream lg:grid-cols-[1.05fr_.95fr]">
          <div aria-hidden="true" className="grain relative hidden place-items-center overflow-hidden bg-[radial-gradient(70%_70%_at_50%_45%,rgb(var(--fire)/.55),transparent_75%)] lg:grid">
            <div className="text-center">
              <p className="headline text-[clamp(7rem,14vw,12rem)] leading-[.8] text-cream">Dia 1º</p>
              <p className="accent mt-3 text-[28px] text-cheddar">burger novo todo mês</p>
            </div>
          </div>
          <div className="flex flex-col justify-center p-8 sm:p-12">
            <p className="eyebrow flex items-center gap-2 text-cheddar">
              <span className="rounded-full bg-cheddar px-2.5 py-0.5 text-night">{bm.mes}</span> Dia 1 é dia de burger novo
            </p>
            <h3 id="bm-titulo" className="headline mt-4 text-[clamp(3rem,6vw,5rem)]">Burger <span className="text-ember">do mês</span></h3>
            <p className="mt-4 max-w-[46ch] text-[18px] leading-relaxed text-cream/85">{bm.descricao}</p>
            <p className="mt-5 font-display text-[36px] leading-none text-cheddar">{bm.preco != null ? brl(bm.preco) : "Consultar valor"}</p>
            <div className="mt-8"><AddButton itemId={bm.id} nome={bm.nome} variant="wide" /></div>
          </div>
        </article>

        {/* Navegação por categoria */}
        <nav aria-label="Categorias do cardápio" className="mt-16 flex flex-wrap gap-2">
          {CARDAPIO.map((c) => (
            <a key={c.id} href={`#cat-${c.id}`} className="inline-flex min-h-[44px] items-center rounded-full border border-night/25 px-5 text-[14px] font-semibold uppercase tracking-[0.12em] transition-colors hover:border-night hover:bg-night hover:text-cream">
              {c.titulo}
            </a>
          ))}
        </nav>

        <div className="mt-10 grid gap-16 lg:grid-cols-[1.25fr_.75fr] lg:gap-20">
          <div id={`cat-${burgers.id}`} className="scroll-mt-28">
            <h3 className="headline border-b-2 border-night pb-3 text-[44px]">{burgers.titulo}</h3>
            {burgers.subtitulo && <p className="mt-3 font-slab text-[18px] italic text-leather">{burgers.subtitulo}</p>}
            <ul className="divide-y divide-night/15">{burgers.itens.map((it) => <Linha key={it.id} it={it} />)}</ul>
            <p className="mt-4 rounded-2xl bg-night/5 px-5 py-4 text-[16px] text-bark">
              <b className="text-night">Vira combo:</b> batata + refrigerante por mais {brl(17)}. Maionese caseira na batata por mais {brl(3)}.
            </p>
          </div>

          <div className="space-y-14">
            {outras.map((c) => (
              <div key={c.id} id={`cat-${c.id}`} className="scroll-mt-28">
                <h3 className="headline border-b-2 border-night pb-3 text-[44px]">{c.titulo}</h3>
                <ul className="divide-y divide-night/15">{c.itens.map((it) => <Linha key={it.id} it={it} />)}</ul>
              </div>
            ))}
          </div>
        </div>

        <ul className="mt-14 flex flex-col gap-2 border-t border-night/15 pt-6 text-[15px] text-bark sm:flex-row sm:flex-wrap sm:gap-x-8">
          <li>Acréscimo de {brl(AVISOS.viagem)} em pedidos para viagem.</li>
          <li>{AVISOS.servico}</li>
          <li>Valores sujeitos a alteração.</li>
        </ul>
        <p className="mt-4 text-[15px] text-bark">
          Prefere pedir por aplicativo?{" "}
          <a href={SITE.menudino} target="_blank" rel="noopener noreferrer" className="font-semibold text-leather underline decoration-2 underline-offset-4 hover:text-fire">Peça pelo MenuDino</a>.
        </p>
      </div>
    </section>
  );
}
