import React, { useState, useEffect } from 'react';
import { VEHICLE_GALLERY_PHOTOS } from '../data/mockData';
import { Eye, X, ChevronLeft, ChevronRight } from 'lucide-react';

export const VehicleGallerySection: React.FC = () => {
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

    // Funciones para navegar en el modal ampliado
    const nextImage = (e?: React.MouseEvent) => {
        e?.stopPropagation();
        if (selectedIndex !== null) {
            setSelectedIndex((prev) => (prev! + 1) % VEHICLE_GALLERY_PHOTOS.length);
        }
    };

    const prevImage = (e?: React.MouseEvent) => {
        e?.stopPropagation();
        if (selectedIndex !== null) {
            setSelectedIndex((prev) => (prev! - 1 + VEHICLE_GALLERY_PHOTOS.length) % VEHICLE_GALLERY_PHOTOS.length);
        }
    };

    // Soporte de flechas del teclado dentro del modal
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (selectedIndex === null) return;
            if (e.key === 'ArrowRight') {
                setSelectedIndex((prev) => (prev! + 1) % VEHICLE_GALLERY_PHOTOS.length);
            } else if (e.key === 'ArrowLeft') {
                setSelectedIndex((prev) => (prev! - 1 + VEHICLE_GALLERY_PHOTOS.length) % VEHICLE_GALLERY_PHOTOS.length);
            } else if (e.key === 'Escape') {
                setSelectedIndex(null);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [selectedIndex]);

    return (
        <section className="py-20 bg-slate-900 text-white" id="galeria">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <span className="text-xs font-black tracking-widest uppercase text-[#FF2D78]">
                        GALERÍA EXCLUSIVA
                    </span>
                    <h2 className="font-heading font-black text-3xl sm:text-5xl text-white mt-2 tracking-tight">
                        CONOCE EL CLÁSICO Y SUS MODELOS
                    </h2>
                    <p className="text-slate-400 mt-3 text-sm sm:text-base">
                        Explora la sesión fotográfica completa en formato original. Haz clic en cualquier imagen para verla en alta definición y navegar entre ellas.
                    </p>
                </div>

                {/* Grid con proporción 9:16 exacta */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                    {VEHICLE_GALLERY_PHOTOS.map((photoUrl, index) => (
                        <div
                            key={index}
                            onClick={() => setSelectedIndex(index)}
                            className="group relative aspect-[9/16] rounded-2xl overflow-hidden bg-slate-800 cursor-pointer border border-slate-700 hover:border-[#FF2D78] transition-all shadow-xl"
                        >
                            <img
                                src={photoUrl}
                                alt={`Volkswagen Gol 98 - Foto ${index + 1}`}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                loading="lazy"
                                referrerPolicy="no-referrer"
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <span className="w-12 h-12 rounded-full bg-[#FF2D78] text-white flex items-center justify-center shadow-lg transform scale-75 group-hover:scale-100 transition-transform">
                                    <Eye className="w-6 h-6" />
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Modal Visor Ampliado con Controles de Navegación */}
            {selectedIndex !== null && (
                <div
                    className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4 backdrop-blur-md"
                    onClick={() => setSelectedIndex(null)}
                >
                    {/* Botón Cerrar Arriba */}
                    <button
                        onClick={() => setSelectedIndex(null)}
                        className="absolute top-6 right-6 text-white bg-white/10 hover:bg-[#FF2D78] p-3 rounded-full transition-colors cursor-pointer z-50 shadow-lg"
                        aria-label="Cerrar visor"
                    >
                        <X className="w-6 h-6" />
                    </button>

                    {/* Indicador de posición (Ej: 3 de 30) */}
                    <div className="absolute top-6 left-6 text-white/80 bg-white/10 px-4 py-1.5 rounded-full text-xs font-semibold tracking-wider z-50 backdrop-blur-sm">
                        {selectedIndex + 1} / {VEHICLE_GALLERY_PHOTOS.length}
                    </div>

                    {/* Botón Izquierda (Anterior) */}
                    <button
                        onClick={prevImage}
                        className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 text-white bg-black/50 hover:bg-[#FF2D78] p-4 rounded-full transition-colors cursor-pointer z-50 shadow-xl border border-white/10"
                        aria-label="Foto anterior"
                    >
                        <ChevronLeft className="w-8 h-8" />
                    </button>

                    {/* Contenedor de la Imagen */}
                    <div className="relative max-w-2xl w-full max-h-[90vh] flex items-center justify-center px-12" onClick={(e) => e.stopPropagation()}>
                        <img
                            src={VEHICLE_GALLERY_PHOTOS[selectedIndex]}
                            alt={`Vista ampliada ${selectedIndex + 1}`}
                            className="max-w-full max-h-[85vh] object-contain rounded-2xl border border-slate-700 shadow-2xl"
                        />
                    </div>

                    {/* Botón Derecha (Siguiente) */}
                    <button
                        onClick={nextImage}
                        className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 text-white bg-black/50 hover:bg-[#FF2D78] p-4 rounded-full transition-colors cursor-pointer z-50 shadow-xl border border-white/10"
                        aria-label="Siguiente foto"
                    >
                        <ChevronRight className="w-8 h-8" />
                    </button>
                </div>
            )}
        </section>
    );
};