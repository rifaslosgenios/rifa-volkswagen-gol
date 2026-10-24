import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { VEHICLE_GALLERY_PHOTOS } from '../data/mockData';
import { Eye, X, ChevronLeft, ChevronRight } from 'lucide-react';

export const VehicleGallerySection: React.FC = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

    const length = VEHICLE_GALLERY_PHOTOS.length;

    const nextSlide = useCallback(() => {
        setCurrentIndex((prev) => (prev + 1) % length);
    }, [length]);

    const prevSlide = useCallback(() => {
        setCurrentIndex((prev) => (prev - 1 + length) % length);
    }, [length]);

    useEffect(() => {
        if (selectedIndex !== null) return;
        const timer = setInterval(() => {
            nextSlide();
        }, 2500);
        return () => clearInterval(timer);
    }, [selectedIndex, nextSlide]);

    const nextImageModal = (e?: React.MouseEvent) => {
        e?.stopPropagation();
        if (selectedIndex !== null) setSelectedIndex((prev) => (prev! + 1) % length);
    };

    const prevImageModal = (e?: React.MouseEvent) => {
        e?.stopPropagation();
        if (selectedIndex !== null) setSelectedIndex((prev) => (prev! - 1 + length) % length);
    };

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (selectedIndex === null) return;
            if (e.key === 'ArrowRight') nextImageModal();
            else if (e.key === 'ArrowLeft') prevImageModal();
            else if (e.key === 'Escape') setSelectedIndex(null);
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [selectedIndex]);

    const getCardStyles = (index: number) => {
        const diff = (index - currentIndex + length) % length;

        if (diff === 0) {
            return { x: '0%', scale: 1, zIndex: 30, opacity: 1 };
        } else if (diff === 1 || diff === -(length - 1)) {
            return { x: '75%', scale: 0.8, zIndex: 20, opacity: 0.6 };
        } else if (diff === length - 1 || diff === -1) {
            return { x: '-75%', scale: 0.8, zIndex: 20, opacity: 0.6 };
        }
        return { x: '0%', scale: 0.5, zIndex: 10, opacity: 0 };
    };

    return (
        <section className="relative py-20 bg-slate-900 text-white overflow-hidden" id="galeria">

            {/* MASCOTA 2 - BURBUJA PEGADA A LA IMAGEN */}
            <motion.div
                initial={{ opacity: 0, x: 90 }}
                whileInView={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 90 }}
                viewport={{ once: false, amount: 0.1 }}
                transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
                className="absolute right-0 top-32 z-40 pointer-events-none hidden lg:block w-56 xl:w-68"
            >
                <div className="relative">
                    <img
                        src="/src/assets/mascota (2).png"
                        alt="Mascota Galería"
                        className="w-full h-auto object-contain drop-shadow-2xl origin-top-right"
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.7 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: false, amount: 0.1 }}
                        transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                        animate={{
                            rotate: [0, 1.5, -1.5, 1.5, 0],
                            y: [0, -3, 0]
                        }}
                        transition={{
                            rotate: { repeat: Infinity, duration: 2.5, ease: "easeInOut" },
                            y: { repeat: Infinity, duration: 3, ease: "easeInOut" }
                        }}
                        /* Distancia reducida: left-[-130px] */
                        className="absolute top-16 left-[-130px] xl:left-[-150px] bg-white px-5 py-4 rounded-3xl shadow-2xl border-3 border-slate-100 max-w-[190px] z-30 pointer-events-auto"
                    >
                        <div className="absolute -right-2 top-6 w-4 h-4 bg-white border-t-3 border-r-3 border-slate-100 transform rotate-45"></div>
                        <p className="text-xs sm:text-sm font-black text-[#111827] uppercase tracking-tight leading-snug text-center">
                            ¡BONITO EL CARRO! 🚗 <br />
                            <span className="text-[#E60012] text-sm sm:text-base">¿CIERTO?</span>
                        </p>
                    </motion.div>
                </div>
            </motion.div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center max-w-2xl mx-auto mb-10">
                    <span className="text-xs font-black tracking-widest uppercase text-[#E60012]">
                        GALERÍA EXCLUSIVA
                    </span>
                    <h2 className="font-heading font-black text-3xl sm:text-5xl text-white mt-2 tracking-tight">
                        CONOCE EL CLÁSICO Y SUS MODELOS
                    </h2>
                    <p className="text-slate-400 mt-3 text-sm sm:text-base">
                        Explora la sesión fotográfica. Desliza para ver más y haz clic en la imagen central para verla en alta definición.
                    </p>
                </div>

                <div className="relative w-full h-[350px] sm:h-[420px] md:h-[500px] flex justify-center items-center">
                    <AnimatePresence initial={false}>
                        {VEHICLE_GALLERY_PHOTOS.map((photoUrl, index) => {
                            const styles = getCardStyles(index);
                            const isCenter = (index - currentIndex + length) % length === 0;

                            if (styles.opacity === 0) return null;

                            return (
                                <motion.div
                                    key={index}
                                    initial={styles}
                                    animate={styles}
                                    transition={{ duration: 0.6, ease: [0.32, 0.72, 0, 1] }}
                                    onClick={() => {
                                        if (isCenter) setSelectedIndex(index);
                                        else if ((index - currentIndex + length) % length === 1) nextSlide();
                                        else prevSlide();
                                    }}
                                    className={`absolute w-[55%] sm:w-[40%] md:w-[26%] aspect-[9/16] rounded-3xl overflow-hidden bg-slate-800 shadow-2xl border-2 transition-colors duration-300 ${isCenter ? 'border-slate-700 hover:border-[#E60012] cursor-pointer' : 'border-transparent cursor-pointer'
                                        }`}
                                >
                                    <img
                                        src={photoUrl}
                                        alt={`Volkswagen Gol 98 - Foto ${index + 1}`}
                                        className="w-full h-full object-cover"
                                        loading="lazy"
                                        referrerPolicy="no-referrer"
                                    />
                                    {isCenter && (
                                        <div className="absolute inset-0 bg-black/30 opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                            <span className="w-14 h-14 rounded-full bg-[#E60012] text-white flex items-center justify-center shadow-[0_0_20px_rgba(230,0,18,0.5)] transform scale-90 hover:scale-100 transition-transform duration-300">
                                                <Eye className="w-7 h-7" />
                                            </span>
                                        </div>
                                    )}
                                </motion.div>
                            );
                        })}
                    </AnimatePresence>
                </div>

                <div className="flex justify-center items-center gap-6 mt-8">
                    <button
                        onClick={prevSlide}
                        className="text-slate-400 hover:text-[#E60012] hover:bg-white/5 p-2 rounded-full transition-all duration-300 cursor-pointer"
                        aria-label="Anterior"
                    >
                        <ChevronLeft className="w-6 h-6 sm:w-8 sm:h-8" />
                    </button>

                    <div className="flex items-center gap-2 overflow-hidden max-w-[200px] sm:max-w-none">
                        {VEHICLE_GALLERY_PHOTOS.map((_, idx) => (
                            <button
                                key={idx}
                                onClick={() => setCurrentIndex(idx)}
                                className={`h-2 rounded-full transition-all duration-500 ${currentIndex === idx
                                    ? 'w-8 bg-[#E60012]'
                                    : 'w-2 bg-slate-700 hover:bg-slate-500'
                                    }`}
                                aria-label={`Ir a la foto ${idx + 1}`}
                            />
                        ))}
                    </div>

                    <button
                        onClick={nextSlide}
                        className="text-slate-400 hover:text-[#E60012] hover:bg-white/5 p-2 rounded-full transition-all duration-300 cursor-pointer"
                        aria-label="Siguiente"
                    >
                        <ChevronRight className="w-6 h-6 sm:w-8 sm:h-8" />
                    </button>
                </div>
            </div>

            {selectedIndex !== null && (
                <div
                    className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4 backdrop-blur-xl"
                    onClick={() => setSelectedIndex(null)}
                >
                    <button
                        onClick={() => setSelectedIndex(null)}
                        className="absolute top-6 right-6 text-white bg-white/10 hover:bg-[#E60012] p-3 rounded-full transition-colors cursor-pointer z-50 shadow-lg"
                    >
                        <X className="w-6 h-6" />
                    </button>

                    <div className="absolute top-6 left-6 text-white/80 bg-white/10 px-4 py-1.5 rounded-full text-xs font-semibold tracking-wider z-50 backdrop-blur-sm">
                        {selectedIndex + 1} / {length}
                    </div>

                    <button
                        onClick={prevImageModal}
                        className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 text-white bg-black/50 hover:bg-[#E60012] p-4 rounded-full transition-colors cursor-pointer z-50 shadow-xl border border-white/10"
                    >
                        <ChevronLeft className="w-8 h-8" />
                    </button>

                    <div className="relative max-w-3xl w-full max-h-[90vh] flex items-center justify-center px-12" onClick={(e) => e.stopPropagation()}>
                        <img
                            src={VEHICLE_GALLERY_PHOTOS[selectedIndex]}
                            alt={`Vista ampliada ${selectedIndex + 1}`}
                            className="max-w-full max-h-[85vh] object-contain rounded-2xl border border-slate-800 shadow-2xl"
                        />
                    </div>

                    <button
                        onClick={nextImageModal}
                        className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 text-white bg-black/50 hover:bg-[#E60012] p-4 rounded-full transition-colors cursor-pointer z-50 shadow-xl border border-white/10"
                    >
                        <ChevronRight className="w-8 h-8" />
                    </button>
                </div>
            )}
        </section>
    );
};