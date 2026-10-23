import React from 'react';
import { Sparkles } from 'lucide-react';

interface FlashPromoBannerProps {
  onOpenPurchaseModal: () => void;
}

export const FlashPromoBanner: React.FC<FlashPromoBannerProps> = ({ onOpenPurchaseModal }) => {
  return (
    <section className="py-12 bg-white" data-purpose="bottom-highlight-banner">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#C6F235] rounded-3xl overflow-hidden p-8 sm:p-12 shadow-sm border border-[#A6D21B] flex flex-col md:flex-row items-center justify-between gap-8 relative">
          <div className="max-w-lg z-10">
            <span className="inline-block px-3 py-1 rounded-full bg-black/10 text-[#111827] text-xs font-black uppercase tracking-wider mb-3">
              VENTA FLASH • ÚLTIMOS CUPOS
            </span>
            <h3 className="font-heading font-black text-3xl sm:text-4xl text-[#111827] leading-tight">
              ¿LISTO PARA ESTRENAR UN <br />
              <span className="text-[#FF2D78]">LENDARIO CLÁSICO 1998?</span>
            </h3>
            <p className="text-[#111827]/80 text-sm mt-3 font-medium">
              Asegura tu boleto antes de que se agote la serie de 10.000 números. Cada boleto te da la misma probabilidad matemática real respaldada por el Tránsito de Funza.
            </p>
            <div className="mt-6">
              <button
                onClick={onOpenPurchaseModal}
                className="inline-flex items-center gap-2 bg-[#FF2D78] hover:bg-[#E01A63] text-white text-xs sm:text-sm font-bold uppercase tracking-wider px-6 py-3.5 rounded-full shadow-glow-button hover:-translate-y-0.5 transition-all cursor-pointer"
              >
                <span>CONSEGUIR BOLETO CON DESCUENTO</span>
                <Sparkles className="w-4 h-4 fill-white text-white" />
              </button>
            </div>
          </div>

          {/* Big graphic -25% round accent */}
          <div className="flex items-center gap-4 z-10">
            <div className="text-right">
              <span className="font-heading font-black text-6xl sm:text-7xl text-[#FF2D78] block leading-none">
                -25%
              </span>
              <span className="font-bold text-xs uppercase tracking-wider text-[#111827] block mt-1">
                EN PAQUETES DE 5 O MÁS
              </span>
            </div>
            <Sparkles className="w-12 h-12 text-[#FF2D78] fill-[#FF2D78] hidden sm:inline-block" />
          </div>
        </div>
      </div>
    </section>
  );
};