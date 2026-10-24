import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Eye, ChevronLeft, ChevronRight } from 'lucide-react';
import { VEHICLE_SPECS } from '../data/mockData';
import { VehicleSpec } from '../types';

interface VehicleSpecsProps {
  onSelectSpec: (spec: VehicleSpec) => void;
}

const headerVariants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
};

export const VehicleSpecs: React.FC<VehicleSpecsProps> = ({ onSelectSpec }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const length = VEHICLE_SPECS.length;

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % length);
  }, [length]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + length) % length);
  }, [length]);

  useEffect(() => {
    if (isHovered) return;
    const timer = setInterval(() => {
      nextSlide();
    }, 3500);
    return () => clearInterval(timer);
  }, [isHovered, nextSlide]);

  const getCardStyles = (index: number) => {
    const diff = (index - currentIndex + length) % length;

    if (diff === 0) {
      return { x: '0%', scale: 1, zIndex: 30, opacity: 1 };
    } else if (diff === 1) {
      return { x: '65%', scale: 0.85, zIndex: 20, opacity: 0.9 };
    } else if (diff === length - 1) {
      return { x: '-65%', scale: 0.85, zIndex: 20, opacity: 0.9 };
    }
    return { x: '0%', scale: 0.6, zIndex: 10, opacity: 0 };
  };

  return (
    <section className="relative py-24 bg-white overflow-hidden" data-purpose="vehicle-specifications" id="premio">

      {/* MASCOTA 3 */}
      <motion.div
        initial={{ opacity: 0, x: -90 }}
        whileInView={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -90 }}
        viewport={{ once: false, amount: 0.1 }}
        transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
        className="absolute left-0 top-20 z-40 pointer-events-none hidden lg:block w-52 xl:w-64"
      >
        <div className="relative">
          <img
            src="/src/assets/mascota (3).png"
            alt="Mascota Especificaciones"
            className="w-full h-auto object-contain drop-shadow-2xl origin-top-left"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.7 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: false, amount: 0.1 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            animate={{
              rotate: [0, -1.5, 1.5, -1.5, 0],
              y: [0, -3, 0]
            }}
            transition={{
              rotate: { repeat: Infinity, duration: 2.5, ease: "easeInOut" },
              y: { repeat: Infinity, duration: 3, ease: "easeInOut" }
            }}
            className="absolute top-16 right-[-110px] xl:right-[-130px] bg-white px-5 py-4 rounded-3xl shadow-2xl border-3 border-slate-100 max-w-[200px] z-30 pointer-events-auto"
          >
            <div className="absolute -left-3 top-6 w-4 h-4 bg-white border-l-3 border-b-3 border-slate-100 transform rotate-45"></div>
            <p className="text-xs sm:text-sm font-black text-[#111827] uppercase tracking-tight leading-snug text-center">
              ¡MUCHO LO BUENO <br />
              <span className="text-[#E60012] text-sm sm:text-base">ESE CARRO! 🚗</span>
            </p>
          </motion.div>
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Cabecera */}
        <motion.div
          className="text-center max-w-2xl mx-auto mb-16 relative z-10"
          initial="hidden"
          whileInView="show"
          exit="hidden"
          viewport={{ once: false, amount: 0.3 }}
          variants={headerVariants}
        >
          <span className="text-xs font-black tracking-widest uppercase text-[#E60012]">
            CLÁSICO, CONFIABLE Y LISTO PARA RODAR
          </span>
          <h2 className="font-heading font-black text-3xl sm:text-5xl text-[#111827] mt-2 tracking-tight">
            DETALLES DEL CLÁSICO DE TUS SUEÑOS
          </h2>
          <p className="text-slate-600 mt-4 text-base sm:text-lg font-medium leading-relaxed">
            Volkswagen Gol 98 (Placa CIY069) en excelente estado, matriculado directamente a nombre del ganador con todos los impuestos, traspaso legal y documentos al día.
          </p>
        </motion.div>

        {/* Carrusel Animado Deslizándose desde la Derecha */}
        <motion.div
          initial={{ opacity: 0, x: 90 }}
          whileInView={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 90 }}
          viewport={{ once: false, amount: 0.1 }}
          transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          className="relative w-full h-[480px] sm:h-[500px] md:h-[560px] flex justify-center items-center perspective-1000 group"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Flecha Izquierda (Ubicada al costado del carrusel) */}
          <button
            onClick={prevSlide}
            className="absolute left-0 sm:left-4 md:left-8 z-40 bg-white/90 shadow-xl border border-slate-200 hover:bg-[#E60012] text-slate-700 hover:text-white p-3 md:p-4 rounded-full transition-all duration-300 cursor-pointer"
            aria-label="Anterior"
          >
            <ChevronLeft className="w-6 h-6 sm:w-8 sm:h-8" />
          </button>

          <AnimatePresence initial={false}>
            {VEHICLE_SPECS.map((spec, index) => {
              const styles = getCardStyles(index);
              const isCenter = (index - currentIndex + length) % length === 0;

              if (styles.opacity === 0) return null;

              return (
                <motion.div
                  key={spec.id}
                  initial={styles}
                  animate={styles}
                  transition={{ duration: 0.6, ease: [0.32, 0.72, 0, 1] }}
                  onClick={() => {
                    if (isCenter) onSelectSpec(spec);
                    else if ((index - currentIndex + length) % length === 1) nextSlide();
                    else prevSlide();
                  }}
                  className={`absolute w-[80%] sm:w-[65%] md:w-[45%] max-w-lg bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-2xl transition-colors duration-300 flex flex-col ${isCenter ? 'border-slate-300 hover:border-[#E60012]/50 cursor-pointer shadow-[#E60012]/5' : 'border-transparent cursor-pointer'
                    }`}
                >
                  <div className="bg-slate-100/80 px-4 py-3 border-b border-slate-200 flex items-center gap-2 shrink-0">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-400"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-400"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-400"></div>
                  </div>

                  <div className="flex-1 flex flex-col pointer-events-none">
                    <div className="relative aspect-video overflow-hidden bg-slate-900 shrink-0">
                      <video
                        autoPlay
                        loop
                        muted
                        playsInline
                        poster={spec.image}
                        className="w-full h-full object-cover opacity-95"
                      >
                        <source src="https://cdn.coverr.co/videos/coverr-driving-through-a-city-at-night-2646/1080p.mp4" type="video/mp4" />
                      </video>

                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>

                      <div className="absolute bottom-3 left-5 right-5 flex items-center justify-between text-white">
                        <span className="font-heading font-black text-base sm:text-lg tracking-wide uppercase drop-shadow-md">
                          {spec.title}
                        </span>
                        <span className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#E60012] flex items-center justify-center text-xs shadow-lg">
                          <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                        </span>
                      </div>
                    </div>

                    <div className="p-5 sm:p-7 flex-1 bg-white">
                      <p className="text-sm sm:text-base text-slate-600 font-medium leading-relaxed">
                        {spec.shortDesc}
                      </p>
                    </div>
                  </div>

                  <div className="px-5 sm:px-7 pb-5 pt-0 flex items-center justify-between text-sm font-bold text-[#E60012] bg-white shrink-0 pointer-events-none">
                    <span className="flex items-center gap-2 bg-red-50 px-4 py-2 rounded-full">
                      <Eye className="w-4 h-4" />
                      Ver especificación
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>

          {/* Flecha Derecha (Ubicada al costado del carrusel) */}
          <button
            onClick={nextSlide}
            className="absolute right-0 sm:right-4 md:right-8 z-40 bg-white/90 shadow-xl border border-slate-200 hover:bg-[#E60012] text-slate-700 hover:text-white p-3 md:p-4 rounded-full transition-all duration-300 cursor-pointer"
            aria-label="Siguiente"
          >
            <ChevronRight className="w-6 h-6 sm:w-8 sm:h-8" />
          </button>
        </motion.div>

        {/* Puntos Indicadores Inferiores (Solo los puntos) */}
        <div className="flex justify-center items-center gap-2 mt-8">
          {VEHICLE_SPECS.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`h-2 rounded-full transition-all duration-500 ${currentIndex === idx
                ? 'w-8 bg-[#E60012]'
                : 'w-2 bg-slate-200 hover:bg-slate-300'
                }`}
              aria-label={`Ir a la especificación ${idx + 1}`}
            />
          ))}
        </div>

      </div>
    </section>
  );
};