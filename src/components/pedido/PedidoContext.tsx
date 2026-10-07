"use client";
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { Item } from "@/data/cardapio";

/** Uma linha da sacola. `unit` null = item com valor a consultar (ex.: Burger do mês). */
export type Linha = {
  key: string;
  itemId: string;
  nome: string;
  variante?: string;
  adicionais: { id: string; label: string; preco: number; escolha?: string }[];
  obs?: string;
  qtd: number;
  unit: number | null;
};

type Ctx = {
  linhas: Linha[];
  qtdTotal: number;
  subtotal: number;
  temConsulta: boolean;
  adicionar: (l: Omit<Linha, "key">) => void;
  alterarQtd: (key: string, qtd: number) => void;
  remover: (key: string) => void;
  limpar: () => void;
  /** Item aberto no seletor de opções */
  itemAberto: Item | null;
  abrirItem: (it: Item) => void;
  fecharItem: () => void;
  sacolaAberta: boolean;
  setSacolaAberta: (v: boolean) => void;
};

const PedidoCtx = createContext<Ctx | null>(null);
const STORAGE = "portinha:sacola:v1";

// Mesma escolha = mesma linha (soma a quantidade)
const chave = (l: Omit<Linha, "key" | "qtd">) =>
  JSON.stringify([l.itemId, l.variante || "", l.adicionais.map((a) => `${a.id}:${a.escolha || ""}`).sort(), (l.obs || "").trim().toLowerCase()]);

export function PedidoProvider({ children }: { children: React.ReactNode }) {
  const [linhas, setLinhas] = useState<Linha[]>([]);
  const [carregado, setCarregado] = useState(false);
  const [itemAberto, setItemAberto] = useState<Item | null>(null);
  const [sacolaAberta, setSacolaAberta] = useState(false);

  // Sacola sobrevive a recarregar a página (só neste navegador)
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) setLinhas(parsed.filter((l) => l && typeof l.qtd === "number" && l.qtd > 0));
      }
    } catch {}
    setCarregado(true);
  }, []);
  useEffect(() => {
    if (!carregado) return;
    try { localStorage.setItem(STORAGE, JSON.stringify(linhas)); } catch {}
  }, [linhas, carregado]);

  const adicionar = useCallback((l: Omit<Linha, "key">) => {
    const key = chave(l);
    setLinhas((cur) => {
      const i = cur.findIndex((x) => x.key === key);
      if (i >= 0) return cur.map((x, j) => (j === i ? { ...x, qtd: Math.min(99, x.qtd + l.qtd) } : x));
      return [...cur, { ...l, key }];
    });
  }, []);
  const alterarQtd = useCallback((key: string, qtd: number) => {
    setLinhas((cur) => (qtd <= 0 ? cur.filter((x) => x.key !== key) : cur.map((x) => (x.key === key ? { ...x, qtd: Math.min(99, qtd) } : x))));
  }, []);
  const remover = useCallback((key: string) => setLinhas((cur) => cur.filter((x) => x.key !== key)), []);
  const limpar = useCallback(() => setLinhas([]), []);

  const value = useMemo<Ctx>(() => {
    const qtdTotal = linhas.reduce((s, l) => s + l.qtd, 0);
    const subtotal = linhas.reduce((s, l) => s + (l.unit ?? 0) * l.qtd, 0);
    return {
      linhas, qtdTotal, subtotal, temConsulta: linhas.some((l) => l.unit == null),
      adicionar, alterarQtd, remover, limpar,
      itemAberto, abrirItem: setItemAberto, fecharItem: () => setItemAberto(null),
      sacolaAberta, setSacolaAberta,
    };
  }, [linhas, adicionar, alterarQtd, remover, limpar, itemAberto, sacolaAberta]);

  return <PedidoCtx.Provider value={value}>{children}</PedidoCtx.Provider>;
}

export function usePedido() {
  const c = useContext(PedidoCtx);
  if (!c) throw new Error("usePedido precisa estar dentro de <PedidoProvider>");
  return c;
}
