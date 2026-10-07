/**
 * Cardápio oficial da poRtinha (transcrito do cardápio impresso enviado pela casa).
 * O "Burger do mês" vem do reel de 01/10 no Instagram; valor do MenuDino ("Especial do mês").
 * Bebidas completadas com o MenuDino (sabores, Budweiser, Chá Baer).
 */

/** Adicional opcional (checkbox). `escolha` abre um seletor quando o adicional é marcado. */
export type Adicional = { id: string; label: string; preco: number; requer?: string; escolha?: { label: string; opcoes: string[] } };
/** Variação obrigatória (tamanho, sabor…) — cada uma com seu preço */
export type Variante = { label: string; preco: number | null };

export type Item = {
  id: string;
  nome: string;
  descricao?: string;
  /** Preço base quando não há variantes. null = consultar valor */
  preco?: number | null;
  variantes?: { label: string; opcoes: Variante[] };
  adicionais?: Adicional[];
  nota?: string;
};

export type Categoria = { id: string; titulo: string; subtitulo?: string; itens: Item[] };

const REFRIS = ["Coca-Cola", "Coca-Cola Zero", "Guaraná", "Guaraná Zero"];

const ADICIONAIS_BURGER: Adicional[] = [
  { id: "combo", label: "Combo: batata + refrigerante", preco: 17, escolha: { label: "Refrigerante do combo", opcoes: REFRIS } },
  { id: "maionese", label: "Maionese caseira na batata do combo", preco: 3, requer: "combo" },
];

export const CARDAPIO: Categoria[] = [
  {
    id: "burgers",
    titulo: "Burgers",
    subtitulo: "Todos com 200 g de carne e pão de brioche selado na manteiga.",
    itens: [
      { id: "baconzito", nome: "Baconzito", descricao: "American cheese, bacon fatiado, alface americana, cebola branca em rodelas e maionese da casa.", preco: 36.9, adicionais: ADICIONAIS_BURGER },
      { id: "italianinho", nome: "Italianinho", descricao: "Blue cheese, alface americana, bacon fatiado e molho pomodoro.", preco: 37.9, adicionais: ADICIONAIS_BURGER },
      { id: "queijudo", nome: "Queijudo", descricao: "Blend de hambúrguer e bacon fatiado, cortado ao meio em uma piscina de cheddar cremoso.", preco: 35.9, adicionais: ADICIONAIS_BURGER },
      { id: "pork", nome: "Pork", descricao: "Linguiça artesanal de porco Duroc (wagyu suíno) 150 g, blue cheese, abacaxi marinado no melaço de cana e cebola caramelizada.", preco: 37.9, adicionais: ADICIONAIS_BURGER },
      { id: "saladita", nome: "Saladita", descricao: "American cheese, alface americana, tomate grelhado, cebola branca em rodelas, pickles e maionese da casa.", preco: 34.9, adicionais: ADICIONAIS_BURGER },
      { id: "classico", nome: "Clássico", descricao: "Cheddar fatiado, cebola caramelizada, bacon fatiado e maionese da casa.", preco: 34.9, adicionais: ADICIONAIS_BURGER },
      { id: "simples-bem-feito", nome: "Simples Bem Feito", descricao: "O famoso cheese burger americano: 200 g de carne, maionese da casa e american cheese.", preco: 30.9, adicionais: ADICIONAIS_BURGER },
    ],
  },
  {
    id: "porcoes",
    titulo: "Porções",
    itens: [
      {
        id: "batata", nome: "Batata caseira", descricao: "Acompanha maionese caseira.",
        variantes: { label: "Tamanho", opcoes: [{ label: "Média", preco: 17.9 }, { label: "Grande", preco: 26.9 }] },
        adicionais: [{ id: "cheddar-farofa", label: "Cheddar e farofa de bacon", preco: 6 }],
      },
    ],
  },
  {
    id: "sobremesa",
    titulo: "Sobremesa",
    itens: [
      {
        id: "pao-de-mel", nome: "Pão de mel caseiro", descricao: "Recheado com doce de leite e coberto com caramelo salgado.",
        variantes: { label: "Farofa de bacon", opcoes: [{ label: "Com farofa de bacon", preco: 27.9 }, { label: "Sem farofa", preco: 27.9 }] },
      },
    ],
  },
  {
    id: "bebidas",
    titulo: "Bebidas",
    itens: [
      { id: "refrigerante", nome: "Refrigerante lata", variantes: { label: "Sabor", opcoes: REFRIS.map((r) => ({ label: r, preco: 8 })) } },
      { id: "cerveja", nome: "Cerveja long neck", variantes: { label: "Cerveja", opcoes: [{ label: "Heineken", preco: 15 }, { label: "Budweiser", preco: 15 }, { label: "Lagunitas IPA", preco: 22 }] } },
      { id: "suco", nome: "Suco Del Valle", variantes: { label: "Sabor", opcoes: [{ label: "Maracujá", preco: 9 }, { label: "Pêssego", preco: 9 }, { label: "Uva", preco: 9 }] } },
      { id: "cha", nome: "Chá Baer", variantes: { label: "Sabor", opcoes: [{ label: "Matcha", preco: 22 }, { label: "Mate", preco: 22 }] } },
      { id: "agua", nome: "Água", variantes: { label: "Tipo", opcoes: [{ label: "Com gás", preco: 5 }, { label: "Sem gás", preco: 5 }] } },
    ],
  },
];

export const BURGER_DO_MES: Item & { mes: string } = {
  id: "burger-do-mes",
  nome: "Burger do mês",
  mes: "Outubro",
  descricao: "Pão selado na manteiga, carne de 200 g, creme de queijo (catupiry, requeijão e raspa de limão) e uma talagada de bacon marinado no café.",
  preco: 40,
  adicionais: ADICIONAIS_BURGER,
};

export const AVISOS = {
  viagem: 3, // acréscimo por pedido para viagem
  servico: "Taxa de serviço de 5% no salão.",
};

export const brl = (v: number) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

/** Menor preço do item (para "a partir de") */
export function precoBase(it: Item): number | null {
  if (it.variantes) {
    const ps = it.variantes.opcoes.map((o) => o.preco).filter((p): p is number => p != null);
    return ps.length ? Math.min(...ps) : null;
  }
  return it.preco ?? null;
}
export const aPartirDe = (it: Item) => !!it.variantes && new Set(it.variantes.opcoes.map((o) => o.preco)).size > 1;

export const todosItens = (): Item[] => [...CARDAPIO.flatMap((c) => c.itens), BURGER_DO_MES];
