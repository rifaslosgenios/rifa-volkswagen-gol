import React from 'react';

interface TopBarProps {
  onOpenNotaryModal: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({ onOpenNotaryModal }) => {
  return (
    <div
      className="bg-[#111827] text-white text-xs sm:text-sm py-2 px-4 text-center font-medium tracking-wide flex items-center justify-center gap-2 relative z-40"
      data-purpose="announcement-bar"
    >
      <span className="inline-block w-2 h-2 rounded-full bg-[#C6F235] animate-pulse"></span>
      <span className="font-semibold">
        EDICIÓN LIMITADA A 10.000 BOLETOS • TRÁNSITO DE FUNZA • ¡MÁS DEL 68% YA ASIGNADOS!
      </span>
      <button
        onClick={onOpenNotaryModal}
        className="hidden md:inline font-bold text-[#C6F235] hover:text-[#d7ff4f] underline cursor-pointer ml-2 transition-colors focus:outline-none"
      >
        VERIFICAR GARANTÍA LEGAL
      </button>
    </div>
  );
};