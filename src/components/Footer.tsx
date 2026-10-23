import React from 'react';
import {
  Sparkles,
  Phone,
  MapPin,
  Clock,
  Instagram,
  Send,
  MessageCircle,
} from 'lucide-react';

interface FooterProps {
  onOpenLegalModal: () => void;
  onOpenNotaryModal: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenLegalModal,
  onOpenNotaryModal,
}) => {
  return (
    <footer className="bg-[#FF2D78] text-white pt-12 pb-8" data-purpose="site-footer">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Upper Footer Row */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-white/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white text-[#FF2D78] flex items-center justify-center text-xl font-bold shadow-md">
              <Sparkles className="w-5 h-5 fill-[#FF2D78] text-[#FF2D78]" />
            </div>
            <div>
              <span className="font-heading font-black text-xl tracking-tight text-white block">
                RIFA LOS GENIOS
              </span>
              <span className="text-[10px] text-pink-100 uppercase tracking-widest font-semibold">
                Edición Oficial 10.000 Números • Volkswagen Gol 98
              </span>
            </div>
          </div>

          {/* Contact Pill Info */}
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs font-semibold text-pink-100">
            <a
              href="https://wa.me/573000000000"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 hover:text-white transition-colors"
            >
              <Phone className="w-4 h-4 text-pink-200" /> Soporte WhatsApp 24/7
            </a>
            <span className="hidden sm:inline opacity-40">•</span>
            <button
              onClick={onOpenNotaryModal}
              className="flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer text-left"
            >
              <MapPin className="w-4 h-4 text-pink-200" /> Organismo de Tránsito de Funza, Cundinamarca
            </button>
            <span className="hidden sm:inline opacity-40">•</span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-pink-200" /> Soporte L-D 08:00 - 20:00
            </span>
          </div>

          {/* Social Icons */}
          <div className="flex items-center gap-3">
            <a
              aria-label="Instagram"
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              className="w-9 h-9 rounded-full bg-white/10 hover:bg-white hover:text-[#FF2D78] text-white flex items-center justify-center text-base transition-colors"
            >
              <Instagram className="w-4 h-4" />
            </a>
            <a
              aria-label="Telegram"
              href="https://telegram.org"
              target="_blank"
              rel="noreferrer"
              className="w-9 h-9 rounded-full bg-white/10 hover:bg-white hover:text-[#FF2D78] text-white flex items-center justify-center text-base transition-colors"
            >
              <Send className="w-4 h-4" />
            </a>
            <a
              aria-label="WhatsApp"
              href="https://whatsapp.com"
              target="_blank"
              rel="noreferrer"
              className="w-9 h-9 rounded-full bg-white/10 hover:bg-white hover:text-[#FF2D78] text-white flex items-center justify-center text-base transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Bottom Copyright & Legal Links */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-[11px] text-pink-100/80 gap-4">
          <p>© 2026 Rifa los Genios - Colombia. Todos los derechos reservados. Juega con responsabilidad (+18).</p>
          <div className="flex flex-wrap gap-4">
            <button
              onClick={onOpenLegalModal}
              className="hover:text-white underline cursor-pointer"
            >
              Aviso Legal
            </button>
            <button
              onClick={onOpenLegalModal}
              className="hover:text-white underline cursor-pointer"
            >
              Política de Privacidad
            </button>
            <button
              onClick={onOpenNotaryModal}
              className="hover:text-white underline cursor-pointer"
            >
              Bases del Sorteo
            </button>
            <button
              onClick={onOpenLegalModal}
              className="hover:text-white underline cursor-pointer"
            >
              Cookies
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};