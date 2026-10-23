import React from 'react';
import { Stamp, Radio, Receipt, ExternalLink } from 'lucide-react';

interface NotaryGuaranteesProps {
  onOpenNotaryModal: () => void;
  onOpenLegalModal: () => void;
}

export const NotaryGuarantees: React.FC<NotaryGuaranteesProps> = ({
  onOpenNotaryModal,
  onOpenLegalModal,
}) => {
  return (
    <section className="py-16 bg-slate-50 border-t border-slate-200" data-purpose="legal-transparency" id="ventajas">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div
            onClick={onOpenNotaryModal}
            className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-start gap-4 hover:border-[#FF2D78]/50 hover:shadow-glow-soft transition-all cursor-pointer group"
          >
            <div className="w-12 h-12 rounded-xl bg-pink-50 text-[#FF2D78] flex-shrink-0 flex items-center justify-center text-2xl group-hover:bg-[#FF2D78] group-hover:text-white transition-colors">
              <Stamp className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 mb-1">
                <h4 className="font-heading font-bold text-base text-[#111827]">
                  Traspaso y Tránsito
                </h4>
                <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#FF2D78]" />
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                Registrado y avalado ante el Organismo de Tránsito Municipal de Funza, Cundinamarca. Transparencia legal garantizada.
              </p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-start gap-4 hover:shadow-glow-soft transition-all">
            <div className="w-12 h-12 rounded-xl bg-pink-50 text-[#FF2D78] flex-shrink-0 flex items-center justify-center text-2xl">
              <Radio className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-heading font-bold text-base text-[#111827] mb-1">
                Sorteo en Directo
              </h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Transmisión pública simultánea a través de YouTube Live e Instagram con los resultados oficiales de la Lotería Nacional.
              </p>
            </div>
          </div>

          <div
            onClick={onOpenLegalModal}
            className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-start gap-4 hover:border-[#FF2D78]/50 hover:shadow-glow-soft transition-all cursor-pointer group"
          >
            <div className="w-12 h-12 rounded-xl bg-pink-50 text-[#FF2D78] flex-shrink-0 flex items-center justify-center text-2xl group-hover:bg-[#FF2D78] group-hover:text-white transition-colors">
              <Receipt className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 mb-1">
                <h4 className="font-heading font-bold text-base text-[#111827]">
                  Cero Gastos Ocultos
                </h4>
                <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#FF2D78]" />
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                El vehículo incluye traspaso directo 100% pagado, SOAT y revisión tecnomecánica vigentes, e impuestos al día.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};