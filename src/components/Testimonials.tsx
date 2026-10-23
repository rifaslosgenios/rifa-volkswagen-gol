import React from 'react';
import { Star } from 'lucide-react';
import { TESTIMONIALS } from '../data/mockData';

export const Testimonials: React.FC = () => {
  return (
    <section className="py-20 bg-white" data-purpose="participants-testimonials">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-16">
          <span className="text-xs font-black tracking-widest uppercase text-[#FF2D78]">
            CONFIANZA Y TRANSPARENCIA
          </span>
          <h2 className="font-heading font-black text-3xl sm:text-4xl text-[#111827] mt-2 tracking-tight">
            PARTICIPANTES QUE YA TIENEN SUS NÚMEROS
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {TESTIMONIALS.map((t) => (
            <div
              key={t.id}
              className="bg-slate-50 p-8 rounded-3xl border border-slate-200 shadow-xs flex flex-col justify-between hover:shadow-glow-soft transition-all"
            >
              <div>
                <div className="flex text-amber-400 mb-4 text-base gap-1">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                {/* Se aumentó el tamaño de texto de text-xs a text-sm sm:text-base para mayor legibilidad */}
                <p className="text-sm sm:text-base text-slate-700 font-medium italic leading-relaxed mb-6">
                  {t.quote}
                </p>
              </div>

              <div className="flex items-center gap-3.5 pt-4 border-t border-slate-200/60">
                <img
                  alt={t.name}
                  referrerPolicy="no-referrer"
                  src={t.avatar}
                  className="w-11 h-11 rounded-full object-cover border-2"
                  style={{ borderColor: t.accentColor }}
                />
                <div>
                  <span className="font-heading font-bold text-sm text-[#111827] block">
                    {t.name} ({t.location})
                  </span>
                  <span className="text-xs text-slate-500 font-semibold">
                    {t.role}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};