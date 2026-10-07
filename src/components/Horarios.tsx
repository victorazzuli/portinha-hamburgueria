"use client";
import { useEffect, useState } from "react";
import { horariosAgrupados, statusAgora, type Status } from "@/data/horarios";

/** Selo "Aberto agora / Fechado" — calculado só no navegador (o HTML é estático). */
export function StatusAberto({ className = "" }: { className?: string }) {
  const [s, setS] = useState<Status | null>(null);
  useEffect(() => {
    const tick = () => setS(statusAgora());
    tick();
    const id = setInterval(tick, 60_000);
    return () => clearInterval(id);
  }, []);
  if (!s) return <span className={`inline-block h-[30px] ${className}`} aria-hidden="true" />;
  return (
    <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-[14px] font-semibold ${s.aberto ? "bg-[#157a3f]/20 text-[#7fdca4]" : "bg-ember/15 text-ember"} ${className}`}>
      <span aria-hidden="true" className={`h-2 w-2 rounded-full ${s.aberto ? "bg-[#4ade80]" : "bg-ember"}`} />
      {s.texto}
    </span>
  );
}

/** Tabela de horários com o dia de hoje destacado */
export default function Horarios() {
  const [hoje, setHoje] = useState<number | null>(null);
  useEffect(() => setHoje(statusAgora().dia), []);
  return (
    <div>
      <StatusAberto />
      <ul className="mt-4 space-y-1.5">
        {horariosAgrupados().map((g) => {
          const atual = hoje != null && g.dias.includes(hoje);
          return (
            <li key={g.label} className={`flex max-w-sm justify-between gap-6 ${atual ? "font-semibold text-cream" : "text-smoke"}`}>
              <span>{g.label}{atual && <span className="sr-only"> (hoje)</span>}</span>
              <span className="tabular-nums">{g.horario}</span>
            </li>
          );
        })}
      </ul>
      <p className="mt-3 text-[14px] text-smoke">Em feriados o horário pode mudar. Confira no Instagram.</p>
    </div>
  );
}
