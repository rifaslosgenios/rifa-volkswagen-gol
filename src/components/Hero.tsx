import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  ArrowDown,
  Award,
  ShieldCheck,
  Fuel,
  Truck,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { HERO_CAROUSEL_PHOTOS } from '../data/mockData';

interface HeroProps {
  onOpenPurchaseModal: () => void;
  onOpenVehicleModal: () => void;
  onOpenNotaryModal: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  onOpenPurchaseModal,
  onOpenVehicleModal,
  onOpenNotaryModal,
}) => {
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

  const nextPhoto = () => {
    setCurrentPhotoIndex((prev) => (prev + 1) % HERO_CAROUSEL_PHOTOS.length);
  };

  const prevPhoto = () => {
    setCurrentPhotoIndex((prev) => (prev - 1 + HERO_CAROUSEL_PHOTOS.length) % HERO_CAROUSEL_PHOTOS.length);
  };

  // Carrusel automático cada 4 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      nextPhoto();
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  // Soporte para flechas del teclado
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        nextPhoto();
      } else if (e.key === 'ArrowLeft') {
        prevPhoto();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <section className="relative pt-8 pb-16 lg:py-20 overflow-hidden bg-white" data-purpose="hero-banner">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Copy & Value Proposition */}
          <div className="lg:col-span-7 z-10">
            {/* Tagline badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-100 border border-slate-200 mb-6">
              <span className="w-2.5 h-2.5 rounded-full bg-[#FF2D78]"></span>
              <span className="text-xs font-black tracking-wider uppercase text-[#111827]">
                TU SUEÑO EN MARCHA — EDICIÓN OFICIAL 2026 - 2027
              </span>
            </div>

            {/* Punchy Main Title */}
            <h1 className="font-heading font-black text-4xl sm:text-6xl lg:text-[68px] leading-[1.05] tracking-tight text-[#111827] mb-6">
              ESTRENA TU <br />
              <span className="text-[#FF2D78] inline-flex items-center gap-2">
                VOLKSWAGEN GOL
                <Sparkles className="w-8 h-8 sm:w-10 sm:h-10 text-[#FF2D78] fill-[#FF2D78]" />
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-600 max-w-xl font-normal leading-relaxed mb-8">
              Participa por un legendario <strong className="text-slate-800 font-bold">Volkswagen Gol 98</strong> en excelente estado. Sorteo oficial con la Lotería Nacional del Día de Reyes. Traspaso legal inmediato garantizado ante el Ministerio de Tránsito. ¡Asegura tus números hoy!
            </p>

            {/* Buttons Call to Action */}
            <div className="flex flex-wrap items-center gap-4 mb-10">
              <button
                onClick={onOpenPurchaseModal}
                className="inline-flex items-center justify-center gap-2 bg-[#FF2D78] hover:bg-[#E01A63] text-white text-sm font-bold uppercase tracking-wider px-8 py-4 rounded-full shadow-glow-button hover:-translate-y-0.5 transition-all cursor-pointer"
              >
                <span>ELEGIR MIS NÚMEROS</span>
                <Sparkles className="w-4 h-4 fill-white text-white" />
              </button>

              <button
                onClick={onOpenVehicleModal}
                className="inline-flex items-center justify-center gap-2 bg-white hover:bg-slate-50 text-[#111827] text-sm font-bold uppercase tracking-wider px-7 py-4 rounded-full border border-slate-300 hover:border-slate-400 transition-all cursor-pointer"
              >
                <span>VER EL VEHÍCULO</span>
                <ArrowDown className="w-4 h-4" />
              </button>
            </div>

            {/* Value Props List (4 Pillars) */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-slate-100">
              <button
                onClick={onOpenNotaryModal}
                className="flex flex-col items-center sm:items-start text-center sm:text-left group cursor-pointer"
              >
                <div className="w-10 h-10 rounded-xl bg-pink-50 flex items-center justify-center text-[#FF2D78] mb-2 group-hover:bg-[#FF2D78] group-hover:text-white transition-colors">
                  <Award className="w-5 h-5" />
                </div>
                <span className="font-heading font-bold text-xs uppercase tracking-tight text-[#111827] group-hover:text-[#FF2D78] transition-colors">
                  Sorteo Oficial
                </span>
                <span className="text-[11px] text-slate-500">Lotería Nacional</span>
              </button>

              <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
                <div className="w-10 h-10 rounded-xl bg-pink-50 flex items-center justify-center text-[#FF2D78] mb-2">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <span className="font-heading font-bold text-xs uppercase tracking-tight text-[#111827]">
                  Boleto Accesible
                </span>
                <span className="text-[11px] text-slate-500">A solo $5.000 COP</span>
              </div>

              <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
                <div className="w-10 h-10 rounded-xl bg-pink-50 flex items-center justify-center text-[#FF2D78] mb-2">
                  <Fuel className="w-5 h-5" />
                </div>
                <span className="font-heading font-bold text-xs uppercase tracking-tight text-[#111827]">
                  Tanque Lleno
                </span>
                <span className="text-[11px] text-slate-500">Listo para rodar</span>
              </div>

              <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
                <div className="w-10 h-10 rounded-xl bg-pink-50 flex items-center justify-center text-[#FF2D78] mb-2">
                  <Truck className="w-5 h-5" />
                </div>
                <span className="font-heading font-bold text-xs uppercase tracking-tight text-[#111827]">
                  Entrega Directa
                </span>
                <span className="text-[11px] text-slate-500">A todo el país</span>
              </div>
            </div>
          </div>

          {/* Right Column: Vehicle Display with Carousel & Navigation Controls */}
          <div className="lg:col-span-5 relative flex justify-center items-center py-6">
            {/* Large Vertical Chic Text in Background */}
            <div className="absolute -right-6 top-1/2 -translate-y-1/2 select-none pointer-events-none opacity-10">
              <span className="vertical-title font-heading font-black text-8xl lg:text-[140px] text-[#FF2D78] tracking-tighter">
                GOL 98
              </span>
            </div>

            {/* Organic Neon Lime Backdrop Blob */}
            <div className="blob-lime absolute w-72 sm:w-96 h-72 sm:h-96 bg-[#C6F235] -z-0 opacity-90 filter blur-[1px]"></div>

            {/* Main Car Carousel Container (9:16 Aspect Ratio) */}
            <div className="relative z-10 w-full max-w-sm mx-auto aspect-[9/16] rounded-3xl overflow-hidden border-4 border-white shadow-2xl bg-slate-900">
              <img
                key={currentPhotoIndex}
                alt="Volkswagen Gol 98 con Moño"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover transition-opacity duration-700 ease-in-out"
                src={HERO_CAROUSEL_PHOTOS[currentPhotoIndex]}
                onError={() => {
                  nextPhoto();
                }}
              />

              {/* Botones de navegación lateral */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  prevPhoto();
                }}
                className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 hover:bg-[#FF2D78] text-white flex items-center justify-center backdrop-blur-sm transition-colors cursor-pointer z-30 shadow-md"
                aria-label="Foto anterior"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  nextPhoto();
                }}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 hover:bg-[#FF2D78] text-white flex items-center justify-center backdrop-blur-sm transition-colors cursor-pointer z-30 shadow-md"
                aria-label="Siguiente foto"
              >
                <ChevronRight className="w-6 h-6" />
              </button>

              {/* Indicadores de carrusel en la parte inferior */}
              <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5 z-20">
                {HERO_CAROUSEL_PHOTOS.slice(0, 10).map((_, idx) => (
                  <span
                    key={idx}
                    className={`h-1.5 rounded-full transition-all ${currentPhotoIndex % 10 === idx ? 'w-6 bg-[#FF2D78]' : 'w-1.5 bg-white/60'
                      }`}
                  />
                ))}
              </div>

              {/* Floating Promo Round Badge en Relieve (Saliendo del marco inferior izquierdo) */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenPurchaseModal();
                }}
                className="absolute -bottom-5 -left-5 bg-[#FF2D78] hover:bg-[#E01A63] text-white w-32 h-32 sm:w-36 sm:h-36 rounded-full flex flex-col items-center justify-center text-center p-3 shadow-2xl rotate-[-8deg] border-4 border-white animate-bounce-slow cursor-pointer transition-transform hover:scale-105 z-40"
                title="Participar por solo $5.000 COP"
              >
                <span className="font-heading font-black text-xl sm:text-2xl leading-none">
                  $5.000
                </span>
                <span className="text-[11px] sm:text-xs font-bold uppercase leading-tight mt-1 tracking-wider text-pink-100">
                  ¡Boleto Único!
                </span>
              </button>

              {/* Floating Live Verified Pill */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenNotaryModal();
                }}
                className="absolute top-4 right-4 bg-white/95 backdrop-blur-md px-4 py-2 rounded-2xl shadow-lg border border-slate-100 flex items-center gap-2 hover:bg-slate-50 transition-colors cursor-pointer z-30"
              >
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                </span>
                <span className="text-xs font-bold text-slate-700">Traspaso Legal Tránsito</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};