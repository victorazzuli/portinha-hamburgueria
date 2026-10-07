/**
 * Horário de funcionamento (perfil da poRtinha no Google, out/2026).
 * dia: 0 = domingo … 6 = sábado. Horas no fuso de São Paulo.
 */
export const HORARIOS: { dia: number; abre: string; fecha: string }[] = [
  { dia: 1, abre: "17:30", fecha: "22:00" },
  { dia: 2, abre: "17:30", fecha: "22:00" },
  { dia: 3, abre: "17:30", fecha: "22:00" },
  { dia: 4, abre: "17:30", fecha: "22:00" },
  { dia: 5, abre: "17:30", fecha: "23:30" },
  { dia: 6, abre: "14:00", fecha: "23:30" },
  { dia: 0, abre: "14:00", fecha: "22:00" },
];

export const DIAS = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];
const SCHEMA_DIAS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

/** Linhas agrupadas para exibir: "Seg a Qui · 17h30 às 22h" */
export function horariosAgrupados() {
  const fmt = (h: string) => h.replace(":00", "h").replace(":", "h");
  const grupos: { dias: number[]; abre: string; fecha: string }[] = [];
  for (const h of HORARIOS) {
    const g = grupos[grupos.length - 1];
    if (g && g.abre === h.abre && g.fecha === h.fecha) g.dias.push(h.dia);
    else grupos.push({ dias: [h.dia], abre: h.abre, fecha: h.fecha });
  }
  const curto = (d: number) => DIAS[d].slice(0, 3);
  return grupos.map((g) => ({
    dias: g.dias,
    label: g.dias.length > 1 ? `${curto(g.dias[0])} a ${curto(g.dias[g.dias.length - 1])}` : DIAS[g.dias[0]],
    horario: `${fmt(g.abre)} às ${fmt(g.fecha)}`,
  }));
}

export const openingHoursLd = HORARIOS.map((h) => ({
  "@type": "OpeningHoursSpecification", dayOfWeek: SCHEMA_DIAS[h.dia], opens: h.abre, closes: h.fecha,
}));

/** Agora em São Paulo: dia da semana e minutos desde 0h */
function agoraSP(now = new Date()) {
  const parts = new Intl.DateTimeFormat("en-US", { timeZone: "America/Sao_Paulo", weekday: "short", hour: "2-digit", minute: "2-digit", hourCycle: "h23" }).formatToParts(now);
  const get = (t: string) => parts.find((p) => p.type === t)?.value || "0";
  const dia = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(get("weekday"));
  return { dia, min: Number(get("hour")) * 60 + Number(get("minute")) };
}
const toMin = (h: string) => { const [a, b] = h.split(":").map(Number); return a * 60 + b; };

export type Status = { aberto: boolean; texto: string; dia: number };

/** "Aberto agora · fecha às 22h" / "Fechado · abre hoje às 17h30" / "Fechado · abre sábado às 14h" */
export function statusAgora(now = new Date()): Status {
  const { dia, min } = agoraSP(now);
  const fmt = (h: string) => h.replace(":00", "h").replace(":", "h");
  const hoje = HORARIOS.find((h) => h.dia === dia);
  if (hoje && min >= toMin(hoje.abre) && min < toMin(hoje.fecha)) return { aberto: true, texto: `Aberto agora · fecha às ${fmt(hoje.fecha)}`, dia };
  if (hoje && min < toMin(hoje.abre)) return { aberto: false, texto: `Fechado · abre hoje às ${fmt(hoje.abre)}`, dia };
  for (let i = 1; i <= 7; i++) {
    const d = (dia + i) % 7;
    const h = HORARIOS.find((x) => x.dia === d);
    if (h) return { aberto: false, texto: `Fechado · abre ${i === 1 ? "amanhã" : DIAS[d].toLowerCase()} às ${fmt(h.abre)}`, dia };
  }
  return { aberto: false, texto: "Fechado", dia };
}
