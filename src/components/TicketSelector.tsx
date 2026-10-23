import React from 'react';
import {
  Check,
  CheckCircle2,
  Lock,
  CreditCard,
  Scale,
  Sparkles,
} from 'lucide-react';
import { TICKET_PACKAGES } from '../data/mockData';
import { TicketPackage } from '../types';

interface TicketSelectorProps {
  onSelectPackage: (pkg: TicketPackage) => void;
  onOpenNotaryModal: () => void;
}

export const TicketSelector: React.FC<TicketSelectorProps> = ({
  onSelectPackage,
  onOpenNotaryModal,
}) => {
  return (
    <section className="py-20 bg-slate-50" data-purpose="ticket-selection-module" id="comprar">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-16">
          <span className="text-xs font-black tracking-widest uppercase text-[#FF2D78]">
            PAGO 100% SEGURO Y VERIFICADO
          </span>
          <h2 className="font-heading font-black text-3xl sm:text-5xl text-[#111827] mt-2 tracking-tight">
            ELIGE TU COMBINACIÓN
          </h2>
          <p className="text-slate-500 mt-2 text-sm sm:text-base">
            Cuantos más boletos elijas, mayor probabilidad y mejores descuentos obtienes. Recibe tus números al instante en tu email y WhatsApp.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch max-w-5xl mx-auto">
          {TICKET_PACKAGES.map((pkg) => {
            const isFeatured = pkg.isPopular;

            if (isFeatured) {
              return (
                <div
                  key={pkg.id}
                  className="bg-white rounded-3xl p-8 border-2 border-[#FF2D78] shadow-glow-card relative flex flex-col justify-between scale-105 z-10 transition-transform"
                >
                  {/* Top badge */}
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#FF2D78] text-white text-[11px] font-black uppercase tracking-widest px-4 py-1 rounded-full shadow-md whitespace-nowrap">
                    EL MÁS ELEGIDO ★
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-4 pt-1">
                      <span className="text-xs font-bold uppercase tracking-wider text-[#FF2D78]">
                        {pkg.tagline}
                      </span>
                      <span className="text-xs font-extrabold px-3 py-1 rounded-full bg-[#C6F235] text-[#111827]">
                        {pkg.badge}
                      </span>
                    </div>

                    <h3 className="font-heading font-extrabold text-2xl text-[#111827] mb-1">
                      {pkg.name}
                    </h3>
                    <p className="text-xs text-slate-500 mb-6">{pkg.description}</p>

                    <div className="flex items-baseline gap-2 mb-8">
                      <span className="font-heading font-black text-3xl sm:text-4xl text-[#FF2D78] tabular-nums">
                        ${pkg.price.toLocaleString('es-CO')} COP
                      </span>
                      {pkg.originalPrice && (
                        <span className="text-xs line-through text-slate-400 tabular-nums">
                          ${pkg.originalPrice.toLocaleString('es-CO')}
                        </span>
                      )}
                      {pkg.discountLabel && (
                        <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                          {pkg.discountLabel}
                        </span>
                      )}
                    </div>

                    {/* Perks */}
                    <ul className="space-y-3 text-xs text-slate-700 font-medium mb-8">
                      {pkg.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-[#FF2D78] shrink-0 mt-0.5" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <button
                    onClick={() => onSelectPackage(pkg)}
                    className="w-full py-4 rounded-full font-heading font-bold text-xs uppercase tracking-wider text-white bg-[#FF2D78] hover:bg-[#E01A63] transition-all shadow-glow-button hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
                    data-purpose="btn-buy-pack5"
                  >
                    {pkg.buttonText}
                  </button>
                </div>
              );
            }

            return (
              <div
                key={pkg.id}
                className="bg-white rounded-3xl p-8 border border-slate-200 shadow-glow-soft flex flex-col justify-between hover:border-[#FF2D78]/40 transition-all"
              >
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      {pkg.tagline}
                    </span>
                    <span className="text-xs font-bold px-3 py-1 rounded-full bg-slate-100 text-slate-600">
                      {pkg.badge}
                    </span>
                  </div>

                  <h3 className="font-heading font-extrabold text-2xl text-[#111827] mb-1">
                    {pkg.name}
                  </h3>
                  <p className="text-xs text-slate-500 mb-6">{pkg.description}</p>

                  <div className="flex items-baseline gap-2 mb-8">
                    <span className="font-heading font-black text-2xl sm:text-3xl text-[#111827] tabular-nums">
                      ${pkg.price.toLocaleString('es-CO')} COP
                    </span>
                    {pkg.originalPrice ? (
                      <span className="text-xs text-slate-400 line-through tabular-nums">
                        ${pkg.originalPrice.toLocaleString('es-CO')}
                      </span>
                    ) : (
                      <span className="text-xs text-slate-400">/ boleto</span>
                    )}
                  </div>

                  {/* Perks */}
                  <ul className="space-y-3 text-xs text-slate-600 font-medium mb-8">
                    {pkg.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-[#FF2D78] shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  onClick={() => onSelectPackage(pkg)}
                  className="w-full py-4 rounded-full font-heading font-bold text-xs uppercase tracking-wider text-[#111827] bg-slate-100 hover:bg-[#FF2D78] hover:text-white transition-all shadow-sm cursor-pointer"
                  data-purpose={`btn-buy-${pkg.id}`}
                >
                  {pkg.buttonText}
                </button>
              </div>
            );
          })}
        </div>

        {/* Trust Badges Under Pricing */}
        <div className="flex flex-wrap items-center justify-center gap-8 mt-12 text-slate-400 text-xs font-semibold">
          <div className="flex items-center gap-1.5">
            <Lock className="w-4 h-4 text-slate-600" />
            <span>Encriptación SSL 256-bit</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CreditCard className="w-4 h-4 text-slate-600" />
            <span>Nequi, Daviplata, PSE, Tarjetas</span>
          </div>
          <button
            onClick={onOpenNotaryModal}
            className="flex items-center gap-1.5 hover:text-slate-600 transition-colors cursor-pointer"
          >
            <Scale className="w-4 h-4 text-slate-600" />
            <span>Protocolo Oficial de Sorteo y Traspaso</span>
          </button>
        </div>
      </div>
    </section>
  );
};