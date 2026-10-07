"use client";
import { useEffect, useState } from "react";
import { brl, type Item } from "@/data/cardapio";
import Modal from "./Modal";
import { usePedido } from "./PedidoContext";

/** Seletor de opções do item: variação, adicionais (combo…), observação e quantidade. */
export default function ItemDialog() {
  const { itemAberto, fecharItem } = usePedido();
  return (
    <Modal open={!!itemAberto} onClose={fecharItem} labelledBy="item-titulo">
      {itemAberto && <Conteudo key={itemAberto.id} item={itemAberto} />}
    </Modal>
  );
}

function Conteudo({ item }: { item: Item }) {
  const { adicionar, fecharItem, setSacolaAberta } = usePedido();
  const [variante, setVariante] = useState<string | null>(item.variantes?.opcoes[0]?.label ?? null);
  const [marcados, setMarcados] = useState<Record<string, boolean>>({});
  const [escolhas, setEscolhas] = useState<Record<string, string>>({});
  const [obs, setObs] = useState("");
  const [qtd, setQtd] = useState(1);
  const [adicionado, setAdicionado] = useState(false);

  // Desmarcar o combo desmarca o que depende dele (maionese)
  useEffect(() => {
    setMarcados((m) => {
      let changed = false;
      const next = { ...m };
      item.adicionais?.forEach((a) => { if (a.requer && next[a.id] && !next[a.requer]) { next[a.id] = false; changed = true; } });
      return changed ? next : m;
    });
  }, [marcados, item.adicionais]);

  const precoVar = item.variantes ? item.variantes.opcoes.find((o) => o.label === variante)?.preco ?? null : item.preco ?? null;
  const ads = (item.adicionais || []).filter((a) => marcados[a.id]);
  const somaAds = ads.reduce((s, a) => s + a.preco, 0);
  const unit = precoVar == null ? null : precoVar + somaAds;

  const confirmar = () => {
    adicionar({
      itemId: item.id,
      nome: item.nome,
      variante: variante ?? undefined,
      adicionais: ads.map((a) => ({ id: a.id, label: a.label, preco: a.preco, escolha: a.escolha ? escolhas[a.id] || a.escolha.opcoes[0] : undefined })),
      obs: obs.trim() || undefined,
      qtd,
      unit,
    });
    setAdicionado(true);
  };

  if (adicionado) {
    return (
      <div className="p-7 text-center sm:p-9">
        <p className="eyebrow text-cheddar">Na sacola</p>
        <h2 id="item-titulo" className="headline mt-3 text-[44px]">{qtd}× {item.nome}</h2>
        <p className="mt-2 text-smoke">Adicionado ao seu pedido.</p>
        <div className="mt-8 grid gap-3 sm:grid-cols-2">
          <button type="button" onClick={fecharItem} className="btn btn-line">Continuar escolhendo</button>
          <button type="button" onClick={() => { fecharItem(); setSacolaAberta(true); }} className="btn btn-fire">Ver sacola</button>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={(e) => { e.preventDefault(); confirmar(); }}
      className="flex max-h-[92dvh] flex-col"
    >
      <div className="flex items-start justify-between gap-4 border-b border-cream/10 p-6 sm:p-7">
        <div>
          <h2 id="item-titulo" className="font-slab text-[28px] font-bold leading-tight">{item.nome}</h2>
          {item.descricao && <p className="mt-1.5 text-[16px] leading-relaxed text-smoke">{item.descricao}</p>}
        </div>
        <button type="button" onClick={fecharItem} aria-label="Fechar" className="grid h-11 w-11 shrink-0 place-items-center rounded-full text-cream hover:bg-cream/10">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" /></svg>
        </button>
      </div>

      <div className="flex-1 space-y-7 overflow-y-auto p-6 sm:p-7">
        {item.variantes && (
          <fieldset>
            <legend className="eyebrow mb-3 text-cheddar">{item.variantes.label} <span className="text-smoke">· obrigatório</span></legend>
            <div className="grid gap-2">
              {item.variantes.opcoes.map((o) => (
                <label key={o.label} className="flex min-h-[52px] cursor-pointer items-center gap-3 rounded-2xl border border-cream/15 px-4 transition-colors has-[:checked]:border-cheddar has-[:checked]:bg-cheddar/10">
                  <input type="radio" name="variante" value={o.label} checked={variante === o.label} onChange={() => setVariante(o.label)} className="h-5 w-5 accent-[rgb(232,169,58)]" />
                  <span className="flex-1 font-semibold">{o.label}</span>
                  <span className="text-smoke">{o.preco != null ? brl(o.preco) : "Consultar"}</span>
                </label>
              ))}
            </div>
          </fieldset>
        )}

        {item.adicionais && item.adicionais.length > 0 && (
          <fieldset>
            <legend className="eyebrow mb-3 text-cheddar">Adicionais <span className="text-smoke">· opcional</span></legend>
            <div className="grid gap-2">
              {item.adicionais.map((a) => {
                const bloqueado = !!a.requer && !marcados[a.requer];
                return (
                  <div key={a.id} className={`rounded-2xl border px-4 transition-colors ${marcados[a.id] ? "border-cheddar bg-cheddar/10" : "border-cream/15"} ${bloqueado ? "opacity-50" : ""}`}>
                    <label className={`flex min-h-[52px] items-center gap-3 ${bloqueado ? "cursor-not-allowed" : "cursor-pointer"}`}>
                      <input
                        type="checkbox"
                        checked={!!marcados[a.id]}
                        disabled={bloqueado}
                        onChange={(e) => setMarcados((m) => ({ ...m, [a.id]: e.target.checked }))}
                        className="h-5 w-5 accent-[rgb(232,169,58)]"
                      />
                      <span className="flex-1">{a.label}{bloqueado && <span className="block text-[14px] text-smoke">Disponível com o combo</span>}</span>
                      <span className="whitespace-nowrap text-smoke">+ {brl(a.preco)}</span>
                    </label>
                    {a.escolha && marcados[a.id] && (
                      <label className="block pb-4">
                        <span className="mb-1.5 block text-[14px] text-smoke">{a.escolha.label}</span>
                        <select
                          value={escolhas[a.id] || a.escolha.opcoes[0]}
                          onChange={(e) => setEscolhas((s) => ({ ...s, [a.id]: e.target.value }))}
                          className="min-h-[48px] w-full rounded-xl border border-cream/20 bg-night px-3 text-cream"
                        >
                          {a.escolha.opcoes.map((o) => <option key={o}>{o}</option>)}
                        </select>
                      </label>
                    )}
                  </div>
                );
              })}
            </div>
          </fieldset>
        )}

        <label className="block">
          <span className="eyebrow mb-3 block text-cheddar">Observação <span className="text-smoke">· opcional</span></span>
          <textarea
            value={obs}
            onChange={(e) => setObs(e.target.value.slice(0, 140))}
            rows={2}
            placeholder="Ex.: sem cebola, ponto da carne…"
            className="w-full resize-none rounded-2xl border border-cream/20 bg-night px-4 py-3 text-cream placeholder:text-smoke/70 focus:border-cheddar focus:outline-none"
          />
        </label>
      </div>

      <div className="flex items-center gap-3 border-t border-cream/10 p-5 sm:p-6">
        <div className="flex items-center rounded-full border border-cream/20" role="group" aria-label="Quantidade">
          <button type="button" onClick={() => setQtd((q) => Math.max(1, q - 1))} aria-label="Diminuir quantidade" className="grid h-12 w-12 place-items-center rounded-full text-[22px] hover:bg-cream/10 disabled:opacity-40" disabled={qtd <= 1}>−</button>
          <output aria-live="polite" className="w-8 text-center text-[18px] font-semibold">{qtd}</output>
          <button type="button" onClick={() => setQtd((q) => Math.min(99, q + 1))} aria-label="Aumentar quantidade" className="grid h-12 w-12 place-items-center rounded-full text-[22px] hover:bg-cream/10">+</button>
        </div>
        <button type="submit" className="btn btn-fire flex-1 !px-4">
          <span>Adicionar</span>
          <span className="font-display text-[22px] leading-none tracking-normal">{unit != null ? brl(unit * qtd) : "· a consultar"}</span>
        </button>
      </div>
    </form>
  );
}
