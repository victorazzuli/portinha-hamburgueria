import { ArrowRight } from "@/components/Icons";

export const metadata = { title: "Página não encontrada", robots: { index: false } };

export default function NotFound() {
  return (
    <section className="grain relative flex min-h-[100svh] items-center overflow-hidden">
      <div className="wrap relative z-[2] py-32">
        <p className="eyebrow text-cheddar">Erro 404</p>
        <h1 className="headline mt-4 text-[clamp(4rem,14vw,11rem)]">Essa <span className="text-ember">queimou.</span></h1>
        <p className="mt-6 max-w-[40ch] text-[19px] text-smoke">A página que você procurou não existe. Mas a brasa continua acesa.</p>
        <a href="/" className="btn btn-fire mt-10"><span>Voltar ao início</span><ArrowRight size={18} /></a>
      </div>
    </section>
  );
}
