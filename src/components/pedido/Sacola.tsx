"use client";
import { useEffect, useState } from "react";
import { AVISOS, brl } from "@/data/cardapio";
import { SITE } from "@/data/site";
import { statusAgora } from "@/data/horarios";
import { Bag, Instagram, WhatsApp } from "../Icons";
import Modal from "./Modal";
import { usePedido } from "./PedidoContext";
import { montarMensagem, totais, type Checkout } from "./mensagem";

const VAZIO: Checkout = { nome: "", tipo: "retirada", endereco: "", numero: "", bairro: "", complemento: "", pagamento: "Pix", troco: "", obs: "" };
const STORAGE = "portinha:cliente:v1";

/** Barra flutuante da sacola (aparece com itens) */
export function SacolaBar() {
  const { qtdTotal, subtotal, temConsulta, setSacolaAberta } = usePedido();
  if (!qtdTotal) return null;
  return (
    <button
      type="button"
      onClick={() => setSacolaAberta(true)}
      className="fixed bottom-[max(1rem,env(safe-area-inset-bottom))] left-1/2 z-40 flex h-16 w-[min(92vw,440px)] -translate-x-1/2 items-center gap-4 rounded-full bg-fire pl-5 pr-6 text-cream shadow-[0_16px_50px_-10px_rgb(229_83_58/.7)] transition-colors hover:bg-leather"
    >
      <span className="relative">
        <Bag size={26} />
        <span className="absolute -right-2 -top-2 grid h-5 min-w-5 place-items-center rounded-full bg-cheddar px-1 text-[12px] font-bold text-night">{qtdTotal}</span>
      </span>
      <span className="flex-1 text-left text-[15px] font-semibold uppercase tracking-[0.1em]">Ver sacola</span>
      <span className="font-display text-[26px] leading-none">{brl(subtotal)}{temConsulta ? "+" : ""}</span>
    </button>
  );
}

export default function Sacola() {
  const { linhas, alterarQtd, remover, limpar, sacolaAberta, setSacolaAberta } = usePedido();
  const [etapa, setEtapa] = useState<"itens" | "dados" | "enviado">("itens");
  const [c, setC] = useState<Checkout>(VAZIO);
  const [erros, setErros] = useState<Partial<Record<keyof Checkout, string>>>({});
  const [copiado, setCopiado] = useState(false);
  const t = totais(linhas);
  const [fechado, setFechado] = useState<string | null>(null);
  useEffect(() => { if (etapa === "dados") { const s = statusAgora(); setFechado(s.aberto ? null : s.texto); } }, [etapa]);

  // Lembra nome/endereço do cliente neste navegador
  useEffect(() => {
    try { const raw = localStorage.getItem(STORAGE); if (raw) setC((v) => ({ ...v, ...JSON.parse(raw), obs: "", troco: "" })); } catch {}
  }, []);

  const set = <K extends keyof Checkout>(k: K, v: Checkout[K]) => { setC((x) => ({ ...x, [k]: v })); setErros((e) => ({ ...e, [k]: undefined })); };

  const validar = () => {
    const e: typeof erros = {};
    if (c.nome.trim().length < 2) e.nome = "Informe seu nome.";
    if (c.tipo === "entrega") {
      if (!c.endereco.trim()) e.endereco = "Informe a rua.";
      if (!c.numero.trim()) e.numero = "Informe o número.";
      if (!c.bairro.trim()) e.bairro = "Informe o bairro.";
    }
    setErros(e);
    const first = Object.keys(e)[0];
    if (first) document.getElementById(`ck-${first}`)?.focus();
    return !first;
  };

  const enviar = async () => {
    if (!validar()) return;
    try { const { nome, tipo, endereco, numero, bairro, complemento, pagamento } = c; localStorage.setItem(STORAGE, JSON.stringify({ nome, tipo, endereco, numero, bairro, complemento, pagamento })); } catch {}
    const msg = montarMensagem(linhas, c);
    if (SITE.whatsapp) {
      window.open(`https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(msg)}`, "_blank", "noopener,noreferrer");
    } else {
      // Sem número oficial ainda: copia o pedido e abre o Direct do Instagram
      try { await navigator.clipboard.writeText(msg); setCopiado(true); } catch { setCopiado(false); }
      window.open("https://ig.me/m/portinha_a_hamburgueria", "_blank", "noopener,noreferrer");
    }
    setEtapa("enviado");
  };

  const fechar = () => { setSacolaAberta(false); if (etapa === "enviado") { limpar(); setEtapa("itens"); } };
  const campo = "min-h-[48px] w-full rounded-xl border bg-night px-4 text-cream placeholder:text-smoke/70 focus:border-cheddar focus:outline-none";
  const borda = (k: keyof Checkout) => (erros[k] ? "border-ember" : "border-cream/20");
  const Erro = ({ k }: { k: keyof Checkout }) => (erros[k] ? <p id={`ck-${k}-erro`} className="mt-1 text-[14px] text-ember">{erros[k]}</p> : null);

  return (
    <Modal open={sacolaAberta} onClose={fechar} labelledBy="sacola-titulo" variant="sheet">
      <div className="flex h-full flex-col">
        <header className="flex items-center justify-between gap-4 border-b border-cream/10 px-6 py-5">
          <div>
            <p className="eyebrow text-cheddar">{etapa === "dados" ? "Passo 2 de 2" : etapa === "itens" ? "Passo 1 de 2" : "Pedido enviado"}</p>
            <h2 id="sacola-titulo" className="headline mt-1 text-[36px]">{etapa === "dados" ? "Seus dados" : etapa === "enviado" ? "Valeu!" : "Sua sacola"}</h2>
          </div>
          <button type="button" onClick={fechar} aria-label="Fechar sacola" className="grid h-11 w-11 place-items-center rounded-full hover:bg-cream/10">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" /></svg>
          </button>
        </header>

        {etapa === "enviado" ? (
          <div className="flex flex-1 flex-col justify-center gap-5 px-6 text-center">
            <p className="font-slab text-[24px] font-bold">Seu pedido foi montado.</p>
            {SITE.whatsapp ? (
              <p className="text-smoke">Abrimos o WhatsApp da poRtinha com tudo escrito. É só tocar em <b className="text-cream">enviar</b> por lá.</p>
            ) : (
              <p className="text-smoke">
                {copiado ? "Copiamos o pedido para você. " : ""}Abrimos o Direct da poRtinha no Instagram: {copiado ? <>é só <b className="text-cream">colar</b> e enviar.</> : "envie o pedido por lá."}
              </p>
            )}
            <button type="button" onClick={fechar} className="btn btn-line mx-auto">Fechar</button>
          </div>
        ) : !linhas.length ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
            <Bag size={40} className="text-smoke" />
            <p className="text-smoke">Sua sacola está vazia.</p>
            <a href="#cardapio" onClick={() => setSacolaAberta(false)} className="btn btn-fire">Ver cardápio</a>
          </div>
        ) : etapa === "itens" ? (
          <>
            <ul className="flex-1 divide-y divide-cream/10 overflow-y-auto px-6">
              {linhas.map((l) => (
                <li key={l.key} className="py-5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-slab text-[20px] font-bold leading-tight">{l.nome}{l.variante && <span className="font-sans text-[16px] font-normal text-smoke"> · {l.variante}</span>}</p>
                      {l.adicionais.map((a) => <p key={a.id} className="text-[15px] text-smoke">+ {a.label}{a.escolha ? `: ${a.escolha}` : ""}</p>)}
                      {l.obs && <p className="text-[15px] italic text-smoke">“{l.obs}”</p>}
                    </div>
                    <p className="whitespace-nowrap font-display text-[24px] leading-none">{l.unit != null ? brl(l.unit * l.qtd) : "Consultar"}</p>
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <div className="flex items-center rounded-full border border-cream/20" role="group" aria-label={`Quantidade de ${l.nome}`}>
                      <button type="button" onClick={() => alterarQtd(l.key, l.qtd - 1)} aria-label={l.qtd === 1 ? `Remover ${l.nome}` : "Diminuir"} className="grid h-11 w-11 place-items-center rounded-full text-[20px] hover:bg-cream/10">−</button>
                      <output aria-live="polite" className="w-7 text-center font-semibold">{l.qtd}</output>
                      <button type="button" onClick={() => alterarQtd(l.key, l.qtd + 1)} aria-label="Aumentar" className="grid h-11 w-11 place-items-center rounded-full text-[20px] hover:bg-cream/10">+</button>
                    </div>
                    <button type="button" onClick={() => remover(l.key)} className="min-h-[44px] px-2 text-[14px] font-semibold uppercase tracking-[0.1em] text-smoke underline-offset-4 hover:text-ember hover:underline">Remover</button>
                  </div>
                </li>
              ))}
            </ul>
            <footer className="space-y-4 border-t border-cream/10 px-6 py-5">
              <dl className="space-y-1 text-[16px]">
                <div className="flex justify-between text-smoke"><dt>Subtotal</dt><dd>{brl(t.subtotal)}</dd></div>
                <div className="flex justify-between text-smoke"><dt>Para viagem</dt><dd>{brl(AVISOS.viagem)}</dd></div>
                <div className="flex justify-between pt-1 text-[20px] font-semibold"><dt>Total</dt><dd>{brl(t.total)}{t.temConsulta && <span className="block text-right text-[13px] font-normal text-smoke">+ itens a consultar</span>}</dd></div>
              </dl>
              <button type="button" onClick={() => setEtapa("dados")} className="btn btn-fire w-full">Continuar</button>
            </footer>
          </>
        ) : (
          <form onSubmit={(e) => { e.preventDefault(); enviar(); }} noValidate className="flex flex-1 flex-col overflow-hidden">
            <div className="flex-1 space-y-6 overflow-y-auto px-6 py-6">
              {fechado && (
                <p role="status" className="rounded-xl border border-ember/40 bg-ember/10 px-4 py-3 text-[15px] text-cream">
                  <b>Estamos fechados agora</b> ({fechado.replace("Fechado · ", "")}). Você pode mandar o pedido: a gente responde assim que abrir.
                </p>
              )}
              <div>
                <label htmlFor="ck-nome" className="mb-1.5 block font-semibold">Seu nome</label>
                <input id="ck-nome" autoComplete="name" value={c.nome} onChange={(e) => set("nome", e.target.value)} aria-invalid={!!erros.nome} aria-describedby={erros.nome ? "ck-nome-erro" : undefined} className={`${campo} ${borda("nome")}`} />
                <Erro k="nome" />
              </div>

              <fieldset>
                <legend className="mb-2 font-semibold">Como você quer receber?</legend>
                <div className="grid grid-cols-2 gap-2">
                  {([["retirada", "Retirar no balcão"], ["entrega", "Entrega"]] as const).map(([v, lab]) => (
                    <label key={v} className="flex min-h-[52px] cursor-pointer items-center justify-center rounded-xl border border-cream/20 px-3 text-center font-semibold transition-colors has-[:checked]:border-cheddar has-[:checked]:bg-cheddar/10 has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-cheddar">
                      <input type="radio" name="tipo" value={v} checked={c.tipo === v} onChange={() => set("tipo", v)} className="sr-only" />
                      {lab}
                    </label>
                  ))}
                </div>
              </fieldset>

              {c.tipo === "entrega" && (
                <div className="grid grid-cols-[1fr_96px] gap-3">
                  <div className="col-span-2 sm:col-span-1">
                    <label htmlFor="ck-endereco" className="mb-1.5 block font-semibold">Rua</label>
                    <input id="ck-endereco" autoComplete="address-line1" value={c.endereco} onChange={(e) => set("endereco", e.target.value)} aria-invalid={!!erros.endereco} aria-describedby={erros.endereco ? "ck-endereco-erro" : undefined} className={`${campo} ${borda("endereco")}`} />
                    <Erro k="endereco" />
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <label htmlFor="ck-numero" className="mb-1.5 block font-semibold">Nº</label>
                    <input id="ck-numero" inputMode="numeric" value={c.numero} onChange={(e) => set("numero", e.target.value)} aria-invalid={!!erros.numero} aria-describedby={erros.numero ? "ck-numero-erro" : undefined} className={`${campo} ${borda("numero")}`} />
                    <Erro k="numero" />
                  </div>
                  <div className="col-span-2">
                    <label htmlFor="ck-bairro" className="mb-1.5 block font-semibold">Bairro</label>
                    <input id="ck-bairro" value={c.bairro} onChange={(e) => set("bairro", e.target.value)} aria-invalid={!!erros.bairro} aria-describedby={erros.bairro ? "ck-bairro-erro" : undefined} className={`${campo} ${borda("bairro")}`} />
                    <Erro k="bairro" />
                  </div>
                  <div className="col-span-2">
                    <label htmlFor="ck-complemento" className="mb-1.5 block font-semibold">Complemento / referência <span className="font-normal text-smoke">(opcional)</span></label>
                    <input id="ck-complemento" autoComplete="address-line2" value={c.complemento} onChange={(e) => set("complemento", e.target.value)} className={`${campo} border-cream/20`} />
                  </div>
                  <p className="col-span-2 text-[14px] text-smoke">A taxa de entrega é combinada no WhatsApp.</p>
                </div>
              )}

              <fieldset>
                <legend className="mb-2 font-semibold">Pagamento</legend>
                <div className="grid grid-cols-3 gap-2">
                  {(["Pix", "Cartão", "Dinheiro"] as const).map((p) => (
                    <label key={p} className="flex min-h-[52px] cursor-pointer items-center justify-center rounded-xl border border-cream/20 font-semibold transition-colors has-[:checked]:border-cheddar has-[:checked]:bg-cheddar/10 has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-cheddar">
                      <input type="radio" name="pagamento" value={p} checked={c.pagamento === p} onChange={() => set("pagamento", p)} className="sr-only" />
                      {p}
                    </label>
                  ))}
                </div>
                {c.pagamento === "Dinheiro" && (
                  <div className="mt-3">
                    <label htmlFor="ck-troco" className="mb-1.5 block font-semibold">Troco para quanto? <span className="font-normal text-smoke">(opcional)</span></label>
                    <input id="ck-troco" inputMode="decimal" placeholder="Ex.: R$ 100" value={c.troco} onChange={(e) => set("troco", e.target.value)} className={`${campo} border-cream/20`} />
                  </div>
                )}
              </fieldset>

              <div>
                <label htmlFor="ck-obs" className="mb-1.5 block font-semibold">Observações <span className="font-normal text-smoke">(opcional)</span></label>
                <textarea id="ck-obs" rows={2} value={c.obs} onChange={(e) => set("obs", e.target.value.slice(0, 200))} className={`${campo} resize-none border-cream/20 py-3`} />
              </div>
            </div>
            <footer className="space-y-3 border-t border-cream/10 px-6 py-5">
              <div className="flex justify-between text-[20px] font-semibold"><span>Total</span><span>{brl(t.total)}{t.temConsulta ? " +" : ""}</span></div>
              <button type="submit" className={`btn w-full ${SITE.whatsapp ? "bg-[#157a3f] text-white hover:bg-[#0f5c2f]" : "btn-fire"}`}>
                {SITE.whatsapp ? <WhatsApp size={20} /> : <Instagram size={20} />}
                <span>{SITE.whatsapp ? "Enviar pedido no WhatsApp" : "Enviar pedido pelo Direct"}</span>
              </button>
              <button type="button" onClick={() => setEtapa("itens")} className="min-h-[44px] w-full text-[14px] font-semibold uppercase tracking-[0.1em] text-smoke hover:text-cream">Voltar para a sacola</button>
            </footer>
          </form>
        )}
      </div>
    </Modal>
  );
}
