import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, ChevronLeft, ChevronRight } from 'lucide-react';
import { VEHICLE_SPECS } from '../data/mockData';
import { VehicleSpec } from '../types';
// Importación para que Vite cargue la imagen también en Vercel
import mascotaEspecificacionesImg from '../assets/mascota (3).png';

// Ya no se usa: las tarjetas son solo informativas y no abren ninguna ventana.
// Se deja como opcional para que App.tsx siga funcionando sin cambios.
interface VehicleSpecsProps {
  onSelectSpec?: (spec: VehicleSpec) => void;
}

/* ───────────────────────── VIDEOS DE LAS TARJETAS ─────────────────────────
   Cada tarjeta reproduce su video cuando está en el centro del carrusel.
   Hoy las cuatro usan un video genérico de prueba.

   Para poner tus videos reales:
   1. Crea la carpeta  public/videos  (al lado de la carpeta src, en la raíz del proyecto).
   2. Guarda ahí los archivos: motor.mp4, exterior.mp4, papeles.mp4, regalo.mp4
   3. Cambia las líneas de abajo por la ruta, SIN escribir "public":
        motor: '/videos/motor.mp4',
   Formato recomendado: MP4 (H.264), horizontal 16:9, de 10 a 20 segundos, de 3 a 8 MB cada uno.
   ──────────────────────────────────────────────────────────────────────── */
const GENERIC_VIDEO = 'https://cdn.coverr.co/videos/coverr-driving-through-a-city-at-night-2646/1080p.mp4';

const SPEC_VIDEOS: Record<string, string> = {
  motor: GENERIC_VIDEO,     // cambiar por '/videos/motor.mp4'
  exterior: GENERIC_VIDEO,  // cambiar por '/videos/exterior.mp4'
  papeles: GENERIC_VIDEO,   // cambiar por '/videos/papeles.mp4'
  regalo: GENERIC_VIDEO,    // cambiar por '/videos/regalo.mp4'
};

// Tiempo que dura cada tarjeta antes de pasar a la siguiente
const SLIDE_DURATION_MS = 7000;

// CELULAR Y TABLET: los tres textos del encabezado tienen un solo tamaño (20 px celular, 28 px tablet).
// COMPUTADOR: cada texto vuelve a su tamaño original (se cambia con el prefijo lg:).
const HEADER_MOBILE_SIZE = 'text-[20px] sm:text-[28px]';

const headerVariants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
};

export const VehicleSpecs: React.FC<VehicleSpecsProps> = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const length = VEHICLE_SPECS.length;

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % length);
  }, [length]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + length) % length);
  }, [length]);

  // El temporizador se reinicia con cada cambio de tarjeta y se pausa al pasar el cursor
  useEffect(() => {
    if (isHovered) return;
    const timer = setTimeout(nextSlide, SLIDE_DURATION_MS);
    return () => clearTimeout(timer);
  }, [isHovered, currentIndex, nextSlide]);

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
    <section className="relative pt-10 lg:pt-12 pb-4 lg:pb-8 bg-white overflow-hidden" data-purpose="vehicle-specifications" id="premio">

      {/* MASCOTA 3 · SOLO COMPUTADOR (flotante a la izquierda, como estaba, pero más arriba) */}
      <motion.div
        initial={{ opacity: 0, x: -90 }}
        whileInView={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -90 }}
        viewport={{ once: false, amount: 0.1 }}
        transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
        className="absolute left-0 top-8 z-40 pointer-events-none hidden lg:block w-52 xl:w-64"
      >
        <div className="relative">
          <img
            src={mascotaEspecificacionesImg}
            alt="Mascota Especificaciones"
            className="w-full h-auto object-contain drop-shadow-2xl origin-top-left"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.7 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: false, amount: 0.1 }}
            animate={{
              rotate: [0, -1.5, 1.5, -1.5, 0],
              y: [0, -3, 0]
            }}
            transition={{
              duration: 0.8,
              delay: 0.3,
              ease: [0.16, 1, 0.3, 1],
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

        {/* ENCABEZADO
            Celular y tablet: gato a la izquierda (burbuja sobre su cabeza) y texto a la derecha.
            Computador: solo el texto centrado (el gato es el flotante de arriba). */}
        <div className="flex items-center gap-3 lg:block mb-3 lg:mb-6">

          {/* MASCOTA · SOLO CELULAR Y TABLET */}
          <motion.div
            initial={{ opacity: 0, x: -60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="lg:hidden shrink-0 w-[120px] sm:w-[170px] flex flex-col items-center pointer-events-none"
          >
            <motion.div
              animate={{ rotate: [0, -1.5, 1.5, -1.5, 0], y: [0, -3, 0] }}
              transition={{
                rotate: { repeat: Infinity, duration: 2.5, ease: "easeInOut" },
                y: { repeat: Infinity, duration: 3, ease: "easeInOut" }
              }}
              className="relative bg-white px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-xl shadow-2xl border-2 border-slate-100 max-w-[120px] sm:max-w-[170px] mb-2"
            >
              {/* Colita hacia abajo: apunta al gato */}
              <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-white border-r-2 border-b-2 border-slate-100 transform rotate-45"></div>
              <p className="text-[10px] sm:text-xs font-black text-[#111827] uppercase tracking-tight leading-snug text-center">
                ¡MUCHO LO BUENO <br />
                <span className="text-[#E60012] text-[11px] sm:text-sm">ESE CARRO! 🚗</span>
              </p>
            </motion.div>

            <img
              src={mascotaEspecificacionesImg}
              alt="Mascota Especificaciones"
              className="w-24 sm:w-32 h-auto object-contain drop-shadow-2xl"
            />
          </motion.div>

          {/* TEXTO DEL ENCABEZADO */}
          <motion.div
            className="flex-1 min-w-0 text-left lg:text-center lg:max-w-2xl lg:mx-auto relative z-10"
            initial="hidden"
            whileInView="show"
            exit="hidden"
            viewport={{ once: false, amount: 0.3 }}
            variants={headerVariants}
          >
            <span className={`block ${HEADER_MOBILE_SIZE} lg:text-xs font-black tracking-widest uppercase text-[#E60012] leading-tight`}>
              EL PREMIO
            </span>
            <h2 className={`font-heading font-extrabold ${HEADER_MOBILE_SIZE} lg:text-4xl text-[#111827] mt-1 lg:mt-3 tracking-tight leading-tight`}>
              Un carro con todo pago
            </h2>
            <p className={`${HEADER_MOBILE_SIZE} lg:text-base text-slate-600 mt-2 lg:mt-3 font-medium leading-snug lg:leading-relaxed`}>
              Impuestos y documentos al día, con traspaso legal a nombre del ganador.
            </p>
          </motion.div>
        </div>

        {/* Carrusel: todas las tarjetas se apilan en el mismo lugar, así la altura
            se ajusta sola a la tarjeta más alta (sin espacios en blanco). */}
        <motion.div
          initial={{ opacity: 0, x: 90 }}
          whileInView={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 90 }}
          viewport={{ once: false, amount: 0.1 }}
          transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          className="relative w-full grid items-stretch perspective-1000 group"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Flecha Izquierda (solo desde tablet; en celular van debajo, junto a los puntos) */}
          <button
            onClick={prevSlide}
            className="hidden sm:block absolute top-1/2 -translate-y-1/2 left-4 md:left-8 z-40 bg-white/90 shadow-xl border border-slate-200 hover:bg-[#E60012] text-slate-700 hover:text-white p-3 md:p-4 rounded-full transition-all duration-300 cursor-pointer"
            aria-label="Anterior"
          >
            <ChevronLeft className="w-6 h-6 sm:w-8 sm:h-8" />
          </button>

          {VEHICLE_SPECS.map((spec, index) => {
            const styles = getCardStyles(index);
            const isCenter = (index - currentIndex + length) % length === 0;
            const isVisible = styles.opacity > 0;

            return (
              <motion.div
                key={spec.id}
                initial={false}
                animate={styles}
                transition={{ duration: 0.6, ease: [0.32, 0.72, 0, 1] }}
                aria-hidden={!isVisible}
                /* La tarjeta central es solo informativa (no se puede abrir).
                   Las tarjetas de los lados sí sirven para avanzar o retroceder. */
                onClick={() => {
                  if (!isVisible || isCenter) return;
                  if ((index - currentIndex + length) % length === 1) nextSlide();
                  else prevSlide();
                }}
                className={`col-start-1 row-start-1 justify-self-center w-[85%] sm:w-[70%] md:w-[46%] max-w-lg bg-white rounded-3xl overflow-hidden border shadow-2xl transition-colors duration-300 flex flex-col ${isVisible ? '' : 'pointer-events-none'} ${isCenter ? 'border-slate-200 cursor-default' : 'border-transparent cursor-pointer'
                  }`}
              >
                {/* Barra superior tipo ventana */}
                <div className="bg-slate-100/80 px-4 py-3 border-b border-slate-200 flex items-center gap-2 shrink-0">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-400"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-400"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-400"></div>
                </div>

                {/* Video (solo en la tarjeta central) o foto (en las de los lados) */}
                <div className="relative aspect-video overflow-hidden bg-slate-900 shrink-0 pointer-events-none">
                  {isCenter ? (
                    <video
                      key={spec.id}
                      autoPlay
                      loop
                      muted
                      playsInline
                      preload="metadata"
                      poster={spec.image}
                      className="w-full h-full object-cover opacity-95"
                    >
                      <source src={SPEC_VIDEOS[spec.id] ?? GENERIC_VIDEO} type="video/mp4" />
                    </video>
                  ) : (
                    <img
                      src={spec.image}
                      alt={spec.title}
                      loading="lazy"
                      className="w-full h-full object-cover opacity-95"
                    />
                  )}

                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>

                  <div className="absolute bottom-3 left-5 right-5 text-white">
                    <span className="font-heading font-black text-base sm:text-lg tracking-wide uppercase drop-shadow-md">
                      {spec.title}
                    </span>
                  </div>
                </div>

                {/* Solo los puntos con el símbolo (sin subtítulo, sin párrafo y sin rótulo) */}
                <div className="p-4 sm:p-5 flex-1 bg-white pointer-events-none">
                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-3">
                      {spec.features.map((feature) => (
                        <li key={feature} className="flex items-start gap-2.5 text-[15px] text-slate-700 font-medium leading-snug">
                          <CheckCircle2 className="w-5 h-5 mt-0.5 shrink-0 text-[#FF2D78]" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            );
          })}

          {/* Flecha Derecha (solo desde tablet) */}
          <button
            onClick={nextSlide}
            className="hidden sm:block absolute top-1/2 -translate-y-1/2 right-4 md:right-8 z-40 bg-white/90 shadow-xl border border-slate-200 hover:bg-[#E60012] text-slate-700 hover:text-white p-3 md:p-4 rounded-full transition-all duration-300 cursor-pointer"
            aria-label="Siguiente"
          >
            <ChevronRight className="w-6 h-6 sm:w-8 sm:h-8" />
          </button>
        </motion.div>

        {/* Puntos indicadores (en celular, con flechas a los lados) */}
        <div className="flex justify-center items-center gap-4 mt-4">
          <button
            onClick={prevSlide}
            className="sm:hidden bg-white shadow-md border border-slate-200 text-slate-700 p-2 rounded-full cursor-pointer"
            aria-label="Anterior"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2">
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

          <button
            onClick={nextSlide}
            className="sm:hidden bg-white shadow-md border border-slate-200 text-slate-700 p-2 rounded-full cursor-pointer"
            aria-label="Siguiente"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

      </div>
    </section>
  );
};