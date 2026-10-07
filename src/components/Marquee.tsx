import { Flame } from "./Icons";

/** Faixa de letreiro. O texto real é lido uma vez; a cópia que faz o loop fica oculta para leitores de tela. */
const WORDS = ["Hambúrguer artesanal raiz", "Feito na brasa", "Simples, bruto e saboroso", "Deveria ser crime", "Guarulhos · SP"];

export default function Marquee() {
  const row = (hidden: boolean) => (
    <ul aria-hidden={hidden || undefined} className="flex shrink-0 items-center">
      {WORDS.map((w) => (
        <li key={w} className="flex items-center">
          <span className="headline whitespace-nowrap px-6 text-[clamp(2rem,4.5vw,3.5rem)] leading-none">{w}</span>
          <Flame size={28} className="shrink-0 text-cheddar" />
        </li>
      ))}
    </ul>
  );
  return (
    <div className="marquee relative overflow-hidden border-y border-night/20 bg-fire py-5 text-cream">
      <div className="marquee-track flex w-max">
        {row(false)}
        {row(true)}
      </div>
    </div>
  );
}
