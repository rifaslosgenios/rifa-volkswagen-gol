import React from 'react';
import { motion } from 'framer-motion';

interface TopBarProps {
  onOpenNotaryModal: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({ onOpenNotaryModal }) => {
  // Creamos el bloque de texto como una constante para poder duplicarlo fácilmente
  const AnnouncementContent = () => (
    <div className="flex items-center gap-3 px-4 whitespace-nowrap">
      <span className="inline-block w-2 h-2 rounded-full bg-[#C6F235] animate-pulse"></span>
      <span className="font-semibold tracking-wide">
        EDICIÓN LIMITADA A 10.000 BOLETOS • TRÁNSITO DE FUNZA • ¡MÁS DEL 68% YA ASIGNADOS!
      </span>
      <button
        onClick={onOpenNotaryModal}
        className="font-bold text-[#C6F235] hover:text-[#d7ff4f] underline cursor-pointer transition-colors focus:outline-none"
      >
        VERIFICAR GARANTÍA LEGAL
      </button>
    </div>
  );

  return (
    <div
      className="bg-[#111827] text-white text-xs sm:text-sm py-2 overflow-hidden relative z-40 flex items-center"
      data-purpose="announcement-bar"
    >
      {/* Contenedor animado que se desplaza infinitamente */}
      <motion.div
        className="flex whitespace-nowrap"
        animate={{ x: ["0%", "-50%"] }}
        transition={{
          repeat: Infinity,
          ease: "linear",
          duration: 15, // Ajusta este número si quieres que vaya más rápido (menor número) o más lento (mayor número)
        }}
      >
        {/* Duplicamos el contenido varias veces para que el bucle no tenga espacios vacíos */}
        <AnnouncementContent />
        <AnnouncementContent />
        <AnnouncementContent />
        <AnnouncementContent />
      </motion.div>
    </div>
  );
};