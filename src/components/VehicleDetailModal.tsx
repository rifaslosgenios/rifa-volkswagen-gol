import React, { useState } from 'react';
import { X, CheckCircle2, ArrowRight } from 'lucide-react';
import { VEHICLE_SPECS } from '../data/mockData';
import { VehicleSpec } from '../types';

interface VehicleDetailModalProps {
  initialSpec?: VehicleSpec | null;
  onClose: () => void;
  onOpenPurchaseModal: () => void;
}

export const VehicleDetailModal: React.FC<VehicleDetailModalProps> = ({
  initialSpec,
  onClose,
  onOpenPurchaseModal,
}) => {
  const [activeSpec, setActiveSpec] = useState<VehicleSpec>(
    initialSpec || VEHICLE_SPECS[0]
  );

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 py-6"
      onClick={onClose}
    >
      <div
        className="relative bg-white rounded-3xl max-w-4xl w-full shadow-2xl overflow-hidden border border-slate-100 my-auto max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with Specs Tabs */}
        <div className="bg-[#111827] text-white p-5 sm:p-6 pb-4 shrink-0">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#FF2D78]"></span>
              <span className="text-[11px] font-black uppercase tracking-wider text-[#FF2D78]">
                EDICIÓN OFICIAL 2026-2027 • VOLKSWAGEN GOL 98
              </span>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
              aria-label="Cerrar ventana"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <h3 className="font-heading font-black text-lg sm:text-2xl text-white mb-4">
            {activeSpec.title} — {activeSpec.subtitle}
          </h3>

          {/* Feature Tabs */}
          <div className="flex flex-wrap gap-2 pt-1 border-t border-slate-800">
            {VEHICLE_SPECS.map((spec) => {
              const isActive = spec.id === activeSpec.id;
              return (
                <button
                  key={spec.id}
                  onClick={() => setActiveSpec(spec)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border ${isActive
                      ? 'bg-[#FF2D78] text-white border-[#FF2D78] shadow-md scale-105'
                      : 'bg-slate-800/80 text-slate-300 border-slate-700 hover:bg-slate-700 hover:text-white'
                    }`}
                >
                  {spec.title}
                </button>
              );
            })}
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 flex-1">
          {/* Main Visual con fondo difuminado corregido */}
          <div className="relative h-80 sm:h-[420px] rounded-2xl overflow-hidden bg-slate-900 border border-slate-200 shadow-md flex items-center justify-center">
            {/* Fondo difuminado absoluto que cubre el 100% */}
            <img
              alt=""
              aria-hidden="true"
              referrerPolicy="no-referrer"
              src={activeSpec.image}
              className="absolute inset-0 w-full h-full object-cover filter blur-2xl opacity-50 scale-110 pointer-events-none"
            />
            {/* Capa de oscuridad sutil sobre el fondo para resaltar la foto central */}
            <div className="absolute inset-0 bg-black/40 pointer-events-none"></div>

            {/* Imagen principal nítida centrada */}
            <img
              alt={activeSpec.title}
              referrerPolicy="no-referrer"
              src={activeSpec.image}
              className="relative z-10 w-full h-full object-contain"
            />

            <div className="absolute bottom-4 left-6 right-6 z-20 text-white bg-black/60 backdrop-blur-md p-3 rounded-2xl border border-white/10 shadow-lg">
              <span className="text-[10px] font-black uppercase tracking-wider bg-[#FF2D78] px-2.5 py-0.5 rounded-full inline-block mb-1">
                EQUIPAMIENTO DE SERIE EXCLUSIVO
              </span>
              <h4 className="font-heading font-bold text-base sm:text-lg text-white">
                {activeSpec.title}
              </h4>
            </div>
          </div>

          {/* Description */}
          <div>
            <h5 className="font-heading font-black text-xs uppercase text-slate-700 tracking-wider mb-2">
              Descripción Detallada
            </h5>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              {activeSpec.fullDesc}
            </p>
          </div>

          {/* Key Features Checklist */}
          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200">
            <h5 className="font-heading font-black text-xs uppercase text-slate-700 tracking-wider mb-3">
              Puntos Destacados
            </h5>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {activeSpec.features.map((feat, idx) => (
                <div key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-[#FF2D78] shrink-0 mt-0.5" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Technical Data Table */}
          <div>
            <h5 className="font-heading font-black text-xs uppercase text-slate-700 tracking-wider mb-3">
              Ficha Técnica Específica
            </h5>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {Object.entries(activeSpec.technicalData).map(([key, val]) => (
                <div
                  key={key}
                  className="flex items-center justify-between p-3 rounded-xl bg-white border border-slate-200 text-xs sm:text-sm"
                >
                  <span className="text-slate-500 font-medium">{key}</span>
                  <span className="font-bold text-[#111827]">{val}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Call to Action */}
        <div className="p-4 sm:p-5 bg-white border-t border-slate-200 shrink-0 flex items-center justify-end shadow-inner">
          <button
            onClick={() => {
              onClose();
              onOpenPurchaseModal();
            }}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#FF2D78] hover:bg-[#E01A63] text-white font-heading font-bold text-xs sm:text-sm uppercase tracking-wider px-8 py-4 rounded-full shadow-glow-button hover:-translate-y-0.5 transition-all cursor-pointer"
          >
            <span>PARTICIPAR POR ESTE VEHÍCULO</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};