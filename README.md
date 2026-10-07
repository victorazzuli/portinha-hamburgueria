# poRtinha A Hamburgueria — site

Next.js 15.5 (App Router) · TypeScript · Tailwind CSS. Sem bibliotecas de animação: reveal, parallax,
brasas, letreiro e vídeo são feitos com CSS + IntersectionObserver/rAF e respeitam `prefers-reduced-motion`.
Design system "Brasa & Couro": `design-system/portinha-hamburgueria/MASTER.md` (gerado com a skill
ui-ux-pro-max e adaptado às cores do logo).

## Rodar

```bash
npm install
cp .env.example .env.local   # preencha WhatsApp / iFood / horário
npm run dev                  # http://localhost:3000
npm run build && npm start   # produção (página estática)
```

## Vídeos

Tudo vem dos reels oficiais do Instagram, reprocessado sem áudio e com `faststart`. O site não usa fotos (só o logo).

| Arquivo | Uso | Peso |
|---|---|---|
| `public/video/hero-wide.mp4` | hero em tela cheia no desktop: 1920×1080, 3 cenas lado a lado (11 s) | ~2,6 MB |
| `public/video/hero-720.mp4` | hero em tela cheia no celular (vertical) | ~1,9 MB |
| `public/video/hero-wide.jpg` / `hero-poster.jpg` | posters (carregamento, reduzir movimento, economia de dados) | ~75 / 57 KB |
| `public/video/clip-*.mp4` | trechos em loop no lugar de fotos (casa, grelha, queijo, montagem, mural) | ~70–135 KB cada |

Os trechos só baixam quando chegam perto da tela e só tocam visíveis.

## Pedido pelo WhatsApp

O cliente monta a sacola no cardápio (combo, sabor, adicionais, observação), informa nome,
retirada/entrega e pagamento, e o site abre o WhatsApp com o pedido formatado e o total
(com o acréscimo de R$ 3,00 para viagem). O número fica em `src/data/site.ts`.
Fora do horário, o checkout avisa que a casa está fechada. A sacola fica salva no navegador do cliente.

## Antes de publicar

| Onde | O quê |
|---|---|
| `src/data/site.ts` | WhatsApp/telefone (11) 97812-6042 (perfil do Google). O `.env` pode sobrescrever. |
| `src/data/horarios.ts` | Horário de funcionamento: tabela, selo "Aberto agora" e Schema.org. |
| `.env` → `NEXT_PUBLIC_SITE_URL` | Domínio final (canonical, Open Graph, sitemap). |
| `src/data/cardapio.ts` | Cardápio oficial (transcrito do impresso). Atualizar o **Burger do mês** todo dia 1º. Conferir o preço do Chá (R$ 22,00 no impresso). |
| `.env` → `NEXT_PUBLIC_PREVIEW=1` | Link de prévia fora do Google. |
| `public/img/logo.png` | Recortado do avatar do Instagram (resolução limitada). Trocar pelo arquivo original. |
