import React, { useState, useEffect } from 'react';
import { ShieldCheck } from 'lucide-react';

interface CountdownSectionProps {
  soldTicketsCount: number;
  totalTicketsCount?: number;
}

export const CountdownSection: React.FC<CountdownSectionProps> = ({
  soldTicketsCount,
  totalTicketsCount = 10000,
}) => {
  // Función para calcular meses exactos, horas, minutos y segundos hasta el 6 de enero de 2027
  const calculateTimeLeft = () => {
    const targetDate = new Date('2027-01-06T00:00:00');
    const now = new Date();

    // Cálculo aproximado de meses y resto de tiempo
    let months = (targetDate.getFullYear() - now.getFullYear()) * 12 + (targetDate.getMonth() - now.getMonth());

    // Ajustar si la fecha del mes actual aún no ha alcanzado el día 6
    const tempDate = new Date(now);
    tempDate.setMonth(tempDate.getMonth() + months);
    if (tempDate > targetDate && months > 0) {
      months--;
      tempDate.setMonth(tempDate.getMonth() - 1);
    }

    const difference = targetDate.getTime() - tempDate.getTime();

    if (difference > 0) {
      return {
        months: months,
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }
    return { months: 0, hours: 0, minutes: 0, seconds: 0 };
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const percentage = ((soldTicketsCount / totalTicketsCount) * 100).toFixed(1);

  return (
    <section className="py-10 bg-slate-50 border-y border-slate-200" data-purpose="countdown-and-progress">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-glow-soft border border-slate-100 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Timer Display */}
          <div className="lg:col-span-5 flex flex-col items-center lg:items-start">
            <span className="text-xs font-extrabold uppercase tracking-widest text-[#FF2D78] mb-2">
              TIEMPO PARA EL SORTEO FINAL (6 DE ENERO 2027)
            </span>
            <div className="flex items-center gap-3">
              <div className="text-center bg-slate-100 px-3.5 py-2.5 rounded-2xl min-w-[64px] border border-slate-200/60">
                <span className="block font-heading font-black text-2xl text-[#111827] tabular-nums">
                  {String(timeLeft.months).padStart(2, '0')}
                </span>
                <span className="text-[10px] uppercase font-bold text-slate-400">Meses</span>
              </div>
              <span className="font-bold text-slate-300 text-xl">:</span>
              <div className="text-center bg-slate-100 px-3.5 py-2.5 rounded-2xl min-w-[64px] border border-slate-200/60">
                <span className="block font-heading font-black text-2xl text-[#111827] tabular-nums">
                  {String(timeLeft.hours).padStart(2, '0')}
                </span>
                <span className="text-[10px] uppercase font-bold text-slate-400">Horas</span>
              </div>
              <span className="font-bold text-slate-300 text-xl">:</span>
              <div className="text-center bg-slate-100 px-3.5 py-2.5 rounded-2xl min-w-[64px] border border-slate-200/60">
                <span className="block font-heading font-black text-2xl text-[#111827] tabular-nums">
                  {String(timeLeft.minutes).padStart(2, '0')}
                </span>
                <span className="text-[10px] uppercase font-bold text-slate-400">Min</span>
              </div>
              <span className="font-bold text-slate-300 text-xl">:</span>
              <div className="text-center bg-[#FFF0F5] px-3.5 py-2.5 rounded-2xl min-w-[64px] border border-pink-200/60">
                <span className="block font-heading font-black text-2xl text-[#FF2D78] tabular-nums">
                  {String(timeLeft.seconds).padStart(2, '0')}
                </span>
                <span className="text-[10px] uppercase font-bold text-[#FF2D78]">Seg</span>
              </div>
            </div>
          </div>

          {/* Progress Bar of Available Numbers */}
          <div className="lg:col-span-7">
            <div className="flex justify-between items-end mb-2">
              <div>
                <span className="text-xs font-bold text-slate-500 uppercase">Boletos Emitidos</span>
                <h4 className="font-heading font-black text-xl text-[#111827]">
                  {soldTicketsCount.toLocaleString('es-ES')} de {totalTicketsCount.toLocaleString('es-ES')} vendidos
                </h4>
              </div>
              <span className="text-sm font-extrabold text-[#FF2D78] bg-pink-50 px-3 py-1 rounded-full border border-pink-100">
                {percentage}% Completado
              </span>
            </div>
            <div className="w-full bg-slate-100 h-4 rounded-full overflow-hidden p-0.5 border border-slate-200">
              <div
                className="bg-gradient-to-r from-[#FF2D78] to-[#C6F235] h-full rounded-full transition-all duration-1000"
                style={{ width: `${Math.min(Number(percentage), 100)}%` }}
              ></div>
            </div>
            <p className="text-xs text-slate-400 mt-2 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>La rifa se celebrará en la fecha indicada independientemente del 100% vendido.</span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};