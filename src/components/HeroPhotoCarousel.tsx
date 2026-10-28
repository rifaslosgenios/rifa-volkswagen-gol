import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Sparkles, Check, MapPin } from 'lucide-react';
import { HERO_CAROUSEL_PHOTOS } from '../data/mockData';

// Tiempo que dura cada foto del carrusel (ms). La barra de progreso usa el mismo valor.
const PHOTO_DURATION_MS = 4000;

const PRIZE_BENEFITS = ['Traspaso', 'SOAT', 'Tecnomecánica', 'Tanque lleno'];

/**
 * Devuelve true cuando la pantalla es de computador (>= 1024px, el breakpoint "lg" de Tailwind).
 * Se usa para montar el carrusel en un solo sitio a la vez (así no corren dos temporizadores).
 */
export const useIsDesktop = (): boolean => {
    const query = '(min-width: 1024px)';
    const [isDesktop, setIsDesktop] = useState<boolean>(
        () => typeof window !== 'undefined' && window.matchMedia(query).matches
    );

    useEffect(() => {
        const mq = window.matchMedia(query);
        const handler = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
        setIsDesktop(mq.matches);
        mq.addEventListener('change', handler);
        return () => mq.removeEventListener('change', handler);
    }, []);

    return isDesktop;
};

interface HeroPhotoCarouselProps {
    onOpenPurchaseModal: () => void;
}

export const HeroPhotoCarousel: React.FC<HeroPhotoCarouselProps> = ({ onOpenPurchaseModal }) => {
    const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

    const nextPhoto = () => setCurrentPhotoIndex((prev) => (prev + 1) % HERO_CAROUSEL_PHOTOS.length);
    const prevPhoto = () => setCurrentPhotoIndex((prev) => (prev - 1 + HERO_CAROUSEL_PHOTOS.length) % HERO_CAROUSEL_PHOTOS.length);

    // El temporizador depende de la foto actual: cada cambio (automático o con las flechas)
    // reinicia el conteo, así la barra de progreso siempre dice la verdad.
    useEffect(() => {
        const timeout = setTimeout(nextPhoto, PHOTO_DURATION_MS);
        return () => clearTimeout(timeout);
    }, [currentPhotoIndex]);

    return (
        <div className="relative w-full flex flex-row items-stretch justify-center gap-3 sm:gap-6 lg:justify-end px-2 sm:px-6 lg:px-0">

            {/* Texto y blob de fondo decorativo */}
            <div className="absolute -right-6 top-1/3 -translate-y-1/2 select-none pointer-events-none opacity-10">
                <span className="vertical-title font-heading font-black text-8xl lg:text-[120px] text-[#E60012] tracking-tighter">
                    GOL 98
                </span>
            </div>
            <motion.div
                animate={{ scale: [1, 1.1, 1], rotate: [0, 10, -10, 0] }}
                transition={{ repeat: Infinity, duration: 10, ease: "easeInOut" }}
                className="blob-lime absolute w-64 sm:w-80 h-64 sm:h-80 bg-[#C6F235] -z-0 opacity-90 filter blur-[1px] top-10"
            />

            {/* RECUADRO OSCURO - SOLO MÓVIL (Acompaña la galería como se ve en la captura) */}
            <div className="lg:hidden relative z-20 flex-1 flex flex-col justify-center max-w-[155px] sm:max-w-[200px] shrink-0 py-4">
                <div className="absolute -top-1 -right-2 sm:-top-2 sm:-right-2 text-[#C6F235] animate-[spin_4s_linear_infinite] z-30">
                    <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 fill-[#C6F235]" />
                </div>
                <div className="bg-[#111827] text-white px-2 py-4 sm:px-4 sm:py-5 rounded-2xl shadow-[4px_4px_0px_#C6F235] border border-slate-800 flex flex-col items-center justify-center text-center h-full max-h-[300px]">
                    <span className="text-[8px] sm:text-[10px] font-black uppercase tracking-wider text-slate-300 mb-2 sm:mb-3">
                        ¡Si ganas, recibes!
                    </span>
                    <ul className="w-full space-y-1.5 sm:space-y-2 text-left">
                        {PRIZE_BENEFITS.map((item) => (
                            <li key={item} className="flex items-center gap-1.5 sm:gap-2">
                                <span className="shrink-0 w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-[#C6F235] text-[#111827] flex items-center justify-center">
                                    <Check className="w-2.5 h-2.5 sm:w-3 sm:h-3" strokeWidth={4} />
                                </span>
                                <span className="font-heading font-black text-[8.5px] sm:text-[10px] uppercase tracking-tight text-white leading-none">
                                    {item}
                                </span>
                            </li>
                        ))}
                        <li className="flex items-center gap-1.5 sm:gap-2">
                            <span className="shrink-0 w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-[#C6F235] text-[#111827] flex items-center justify-center">
                                <MapPin className="w-2.5 h-2.5 sm:w-3 sm:h-3" strokeWidth={3} />
                            </span>
                            <span className="font-heading font-black text-[8.5px] sm:text-[10px] uppercase tracking-tight text-white leading-none">
                                Entrega en Bogotá
                            </span>
                        </li>
                    </ul>
                    <span className="mt-3 sm:mt-4 inline-block bg-[#E60012] text-white font-heading font-black text-[8px] sm:text-[10px] uppercase tracking-wide px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-full shadow-lg whitespace-nowrap">
                        TODO POR $5.000
                    </span>
                </div>
            </div>

            {/* CARRUSEL DE FOTOS (Contenedor exterior sin overflow-hidden para que el sello no se corte) */}
            <div className="relative z-10 flex-1 w-full max-w-[200px] sm:max-w-[260px] lg:max-w-[356px] xl:max-w-[448px] aspect-[9/16] lg:aspect-auto lg:min-h-[460px]">

                {/* Marco de la foto */}
                <div className="absolute inset-0 rounded-2xl lg:rounded-3xl overflow-hidden border-2 lg:border-4 border-white shadow-2xl bg-slate-900">

                    {/* Fundido suave entre fotos */}
                    <AnimatePresence initial={false}>
                        <motion.img
                            key={currentPhotoIndex}
                            alt="Volkswagen Gol 98 con Moño"
                            referrerPolicy="no-referrer"
                            className="absolute inset-0 w-full h-full object-cover"
                            src={HERO_CAROUSEL_PHOTOS[currentPhotoIndex]}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.8, ease: 'easeInOut' }}
                            onError={() => nextPhoto()}
                        />
                    </AnimatePresence>

                    {/* Barra de progreso: se llena en 4 s y se reinicia con cada foto */}
                    <div className="absolute top-0 left-0 right-0 h-1 bg-white/25 z-30">
                        <motion.div
                            key={currentPhotoIndex}
                            className="h-full bg-[#E60012] origin-left"
                            initial={{ scaleX: 0 }}
                            animate={{ scaleX: 1 }}
                            transition={{ duration: PHOTO_DURATION_MS / 1000, ease: 'linear' }}
                        />
                    </div>

                    <button onClick={(e) => { e.stopPropagation(); prevPhoto(); }} className="absolute left-1.5 lg:left-3 top-1/2 -translate-y-1/2 w-8 h-8 lg:w-10 lg:h-10 rounded-full bg-black/50 hover:bg-[#E60012] text-white flex items-center justify-center backdrop-blur-sm transition-colors cursor-pointer z-30 shadow-md">
                        <ChevronLeft className="w-4 h-4 lg:w-6 lg:h-6" />
                    </button>
                    <button onClick={(e) => { e.stopPropagation(); nextPhoto(); }} className="absolute right-1.5 lg:right-3 top-1/2 -translate-y-1/2 w-8 h-8 lg:w-10 lg:h-10 rounded-full bg-black/50 hover:bg-[#E60012] text-white flex items-center justify-center backdrop-blur-sm transition-colors cursor-pointer z-30 shadow-md">
                        <ChevronRight className="w-4 h-4 lg:w-6 lg:h-6" />
                    </button>

                    <div className="absolute bottom-3 lg:bottom-4 left-0 right-0 flex justify-center gap-1.5 lg:gap-2 z-20">
                        {HERO_CAROUSEL_PHOTOS.slice(0, 10).map((_, idx) => (
                            <span key={idx} className={`h-1 lg:h-1.5 rounded-full transition-all ${currentPhotoIndex % 10 === idx ? 'w-4 lg:w-6 bg-[#E60012]' : 'w-1.5 bg-white/60'}`} />
                        ))}
                    </div>
                </div>

                {/* Sello $5.000 (fuera del marco para que no se corte; más pequeño en celular) */}
                <motion.button
                    initial={{ scale: 0, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    viewport={{ once: false }}
                    transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.6 }}
                    whileHover={{ scale: 1.1, rotate: -10 }}
                    onClick={(e) => { e.stopPropagation(); onOpenPurchaseModal(); }}
                    className="absolute -bottom-3 -left-3 sm:-bottom-4 sm:-left-4 lg:-bottom-5 lg:-left-5 bg-[#E60012] text-white w-[70px] h-[70px] sm:w-[84px] sm:h-[84px] lg:w-28 lg:h-28 xl:w-36 xl:h-36 rounded-full flex flex-col items-center justify-center text-center p-1 lg:p-2 shadow-2xl rotate-[-8deg] border-2 lg:border-4 border-white cursor-pointer z-40"
                >
                    <span className="font-heading font-black text-[13px] sm:text-[15px] lg:text-2xl xl:text-3xl leading-none">$5.000</span>
                    <span className="text-[6px] sm:text-[7px] lg:text-[10px] xl:text-xs font-bold uppercase leading-tight mt-0.5 lg:mt-1 tracking-wider text-red-100">¡Boleto Único!</span>
                </motion.button>
            </div>
        </div>
    );
};