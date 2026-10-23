import React, { useState } from 'react';
import { Sparkles, PlusCircle, Ticket, Menu, X, ShieldCheck } from 'lucide-react';

interface NavbarProps {
  onOpenPurchaseModal: () => void;
  onOpenMyTicketsModal: () => void;
  onOpenLegalModal: () => void;
  ticketsCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenPurchaseModal,
  onOpenMyTicketsModal,
  onOpenLegalModal,
  ticketsCount,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-[#EAEAEA] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Logo Branding */}
        <a href="#" className="flex items-center gap-2 group">
          <div className="w-10 h-10 rounded-2xl bg-[#FF2D78] flex items-center justify-center text-white text-xl shadow-glow-button group-hover:scale-105 transition-transform">
            <Sparkles className="w-5 h-5 fill-white text-white" />
          </div>
          <div>
            <span className="font-heading font-black text-xl tracking-tight text-[#111827] flex items-center">
              RIFA LOS GENIOS{' '}
              <span className="text-[#FF2D78] text-xs ml-1 font-semibold px-2 py-0.5 bg-[#FFF0F5] rounded-full">
                RIFA
              </span>
            </span>
            <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400 block -mt-1">
              Volkswagen Gol 98
            </span>
          </div>
        </a>

        {/* Desktop Navigation Menu */}
        <nav className="hidden lg:flex items-center gap-7 text-sm font-semibold tracking-wide text-slate-600">
          <a href="#premio" className="hover:text-[#FF2D78] transition-colors">
            EL PREMIO
          </a>
          <a href="#comprar" className="hover:text-[#FF2D78] transition-colors">
            COMPRAR BOLETOS
          </a>
          <a href="#ventajas" className="hover:text-[#FF2D78] transition-colors">
            BENEFICIOS
          </a>
          <button
            onClick={onOpenLegalModal}
            className="hover:text-[#FF2D78] transition-colors cursor-pointer text-left"
          >
            BASES LEGALES
          </button>
          <a href="#faq" className="hover:text-[#FF2D78] transition-colors">
            PREGUNTAS
          </a>
        </nav>

        {/* Action Buttons & My Tickets */}
        <div className="flex items-center gap-3">
          {ticketsCount > 0 && (
            <button
              onClick={onOpenMyTicketsModal}
              className="inline-flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-[#111827] text-xs sm:text-sm font-bold uppercase tracking-wider px-3.5 py-2.5 rounded-full border border-slate-300 transition-all cursor-pointer"
              title="Ver mis boletos comprados"
            >
              <Ticket className="w-4 h-4 text-[#FF2D78]" />
              <span className="hidden sm:inline">Mis Boletos</span>
              <span className="bg-[#FF2D78] text-white text-[11px] px-1.5 py-0.2 rounded-full font-bold">
                {ticketsCount}
              </span>
            </button>
          )}

          <button
            onClick={onOpenPurchaseModal}
            className="inline-flex items-center gap-2 bg-[#FF2D78] hover:bg-[#E01A63] text-white text-xs sm:text-sm font-bold uppercase tracking-wider px-5 py-3 rounded-full shadow-glow-button hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer"
          >
            <span>PARTICIPAR AHORA</span>
            <PlusCircle className="w-4 h-4" />
          </button>

          {/* Mobile hamburger button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-slate-600 hover:text-[#FF2D78] focus:outline-none"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-6 py-5 shadow-lg space-y-4 animate-in slide-in-from-top duration-200">
          <nav className="flex flex-col gap-3 font-semibold text-slate-700 text-sm">
            <a
              href="#premio"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 hover:text-[#FF2D78]"
            >
              EL PREMIO
            </a>
            <a
              href="#comprar"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 hover:text-[#FF2D78]"
            >
              COMPRAR BOLETOS
            </a>
            <a
              href="#ventajas"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 hover:text-[#FF2D78]"
            >
              BENEFICIOS
            </a>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenLegalModal();
              }}
              className="py-1 text-left hover:text-[#FF2D78]"
            >
              BASES LEGALES
            </button>
            <a
              href="#faq"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 hover:text-[#FF2D78]"
            >
              PREGUNTAS
            </a>
          </nav>
          <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
            {ticketsCount > 0 && (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenMyTicketsModal();
                }}
                className="w-full flex items-center justify-center gap-2 py-3 bg-slate-100 rounded-full font-bold text-xs uppercase text-slate-800"
              >
                <Ticket className="w-4 h-4 text-[#FF2D78]" />
                Mis Boletos ({ticketsCount})
              </button>
            )}
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenPurchaseModal();
              }}
              className="w-full flex items-center justify-center gap-2 py-3 bg-[#FF2D78] text-white rounded-full font-bold text-xs uppercase shadow-glow-button"
            >
              <PlusCircle className="w-4 h-4" />
              Comprar Boletos
            </button>
          </div>
        </div>
      )}
    </header>
  );
};