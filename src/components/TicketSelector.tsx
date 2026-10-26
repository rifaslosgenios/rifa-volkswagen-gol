import React from 'react';
import { motion, Variants } from 'framer-motion';
import {
  Check,
  Lock,
  CreditCard,
  Scale,
  Trophy,
} from 'lucide-react';
import { TICKET_PACKAGES } from '../data/mockData';
import { TicketPackage } from '../types';
// Importación para que Vite cargue la imagen también en Vercel
import mascotaCompraImg from '../assets/mascota (5).png';

interface TicketSelectorProps {
  onSelectPackage: (pkg: TicketPackage) => void;
  onOpenNotaryModal: () => void;
}

// Beneficio del premio, igual para los tres paquetes (se muestra destacado en cada tarjeta)
const WIN_BENEFIT = 'Si ganas, recibes todo pago: traspaso, SOAT, tecnomecánica y tanque lleno.';

// Colores de cada tarjeta. Se identifican por el id del paquete (mockData.ts).
// Las clases van escritas completas para que Tailwind las reconozca.
interface CardTheme {
  ribbon: string;
  ribbonClass: string;
  cardClass: string;
  priceClass: string;
  checkClass: string;
  buttonClass: string;
  winBoxClass: string;
}

const CARD_THEMES: Record<string, CardTheme> = {
  // AZUL
  single: {
    ribbon: 'PARA EMPEZAR',
    ribbonClass: 'bg-[#1D6FE8] text-white',
    cardClass: 'bg-[#F5F9FF] border-2 border-[#1D6FE8] shadow-[0_12px_32px_rgba(29,111,232,0.18)]',
    priceClass: 'text-[#1D6FE8]',
    checkClass: 'text-[#1D6FE8]',
    buttonClass: 'bg-[#1D6FE8] hover:bg-[#1558B8] text-white shadow-md',
    winBoxClass: 'bg-[#DBEAFE] border-[#93C5FD] text-[#1E3A8A]',
  },
  // ROJO (la del centro)
  pack5: {
    ribbon: 'EL MÁS ELEGIDO ★',
    ribbonClass: 'bg-[#E60012] text-white',
    cardClass: 'bg-white border-2 border-[#E60012] shadow-glow-card',
    priceClass: 'text-[#E60012]',
    checkClass: 'text-[#E60012]',
    buttonClass: 'bg-[#E60012] hover:bg-[#B3000E] text-white shadow-glow-button',
    winBoxClass: 'bg-red-50 border-red-200 text-[#7F0009]',
  },
  // VERDE LIMA (texto oscuro para que se lea bien)
  pack10: {
    ribbon: 'MÁS OPORTUNIDADES',
    ribbonClass: 'bg-[#C6F235] text-[#111827]',
    cardClass: 'bg-[#F9FDE8] border-2 border-[#A8D41F] shadow-[0_12px_32px_rgba(168,212,31,0.28)]',
    priceClass: 'text-[#111827]',
    checkClass: 'text-[#6B9A00]',
    buttonClass: 'bg-[#C6F235] hover:bg-[#B5E01F] text-[#111827] shadow-md',
    winBoxClass: 'bg-[#EEF9C4] border-[#C6F235] text-[#2F4A00]',
  },
};

// Variantes para el contenedor (Header y Trust badges)
const fadeUpVariant: Variants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
};

// Animación de cada tarjeta
const getCardVariant = (index: number, isFeatured: boolean): Variants => {
  if (isFeatured) {
    // Tarjeta central (destacada): entra desde abajo con un poco de zoom
    return {
      hidden: { opacity: 0, y: 50, scale: 0.95 },
      show: { opacity: 1, y: 0, scale: 1.05, transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.2 } }
    };
  } else if (index === 0) {
    // Tarjeta izquierda
    return {
      hidden: { opacity: 0, x: -60 },
      show: { opacity: 1, x: 0, transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.1 } }
    };
  }
  // Tarjeta derecha
  return {
    hidden: { opacity: 0, x: 60 },
    show: { opacity: 1, x: 0, transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.3 } }
  };
};

export const TicketSelector: React.FC<TicketSelectorProps> = ({
  onSelectPackage,
  onOpenNotaryModal,
}) => {
  return (
    <section className="relative pt-8 pb-8 lg:pt-12 lg:pb-24 bg-slate-50 overflow-hidden" data-purpose="ticket-selection-module" id="comprar">

      {/* MASCOTA 5 (solo computador, flotante a la izquierda) */}
      <motion.div
        initial={{ opacity: 0, x: -90 }}
        whileInView={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -90 }}
        viewport={{ once: false, amount: 0.1 }}
        transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
        className="absolute left-0 top-10 z-40 pointer-events-none hidden lg:block w-52 xl:w-64"
      >
        <div className="relative">
          <img
            src={mascotaCompraImg}
            alt="Mascota Compra"
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
            className="absolute top-8 right-[-200px] xl:right-[-220px] bg-white px-5 py-4 rounded-3xl shadow-2xl border-3 border-slate-100 max-w-[210px] xl:max-w-[230px] z-30 pointer-events-auto"
          >
            <div className="absolute -left-3 top-6 w-4 h-4 bg-white border-l-3 border-b-3 border-slate-100 transform rotate-45"></div>
            <p className="text-xs sm:text-sm font-black text-[#111827] uppercase tracking-tight leading-snug text-center">
              ¿CUÁNTOS <span className="text-[#E60012] text-sm sm:text-base">NÚMEROS</span> <br />
              VAS A LLEVAR?
            </p>
          </motion.div>
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Encabezado */}
        <motion.div
          className="text-center max-w-2xl mx-auto mb-8 lg:mb-14 relative z-10"
          variants={fadeUpVariant}
          initial="hidden"
          whileInView="show"
          viewport={{ once: false, amount: 0.3 }}
        >
          <span className="text-xs font-black tracking-widest uppercase text-[#E60012]">
            PAGO 100% SEGURO Y VERIFICADO
          </span>
          <h2 className="font-heading font-extrabold text-2xl sm:text-3xl lg:text-4xl text-[#111827] mt-3 tracking-tight leading-tight">
            Elige tu combinación
          </h2>
          <p className="text-slate-500 mt-3 text-sm sm:text-base leading-relaxed">
            Cada número cuesta $5.000. Tú decides cuántas oportunidades quieres. Los recibes al instante por WhatsApp y correo.
          </p>
        </motion.div>

        {/* MASCOTA EN CELULAR: fila propia entre el título y las tarjetas */}
        <motion.div
          initial={{ opacity: 0, x: -60 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: false, amount: 0.3 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="lg:hidden flex items-center justify-center gap-1 mb-10 pointer-events-none"
        >
          <img
            src={mascotaCompraImg}
            alt="Mascota Compra"
            className="w-24 sm:w-32 h-auto object-contain drop-shadow-2xl"
          />
          <motion.div
            animate={{ rotate: [0, -1.5, 1.5, -1.5, 0], y: [0, -3, 0] }}
            transition={{
              rotate: { repeat: Infinity, duration: 2.5, ease: "easeInOut" },
              y: { repeat: Infinity, duration: 3, ease: "easeInOut" }
            }}
            className="relative bg-white px-3 py-2.5 rounded-2xl shadow-2xl border-2 border-slate-100 max-w-[150px] sm:max-w-[190px] sm:px-4 sm:py-3"
          >
            <div className="absolute -left-1.5 top-5 w-3 h-3 bg-white border-l-2 border-b-2 border-slate-100 transform rotate-45"></div>
            <p className="text-[11px] sm:text-sm font-black text-[#111827] uppercase tracking-tight leading-snug text-center">
              ¿CUÁNTOS <span className="text-[#E60012]">NÚMEROS</span> <br />
              VAS A LLEVAR?
            </p>
          </motion.div>
        </motion.div>

        {/* Tarjetas de paquetes (en celular: una debajo de otra, la del centro primero) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch max-w-5xl mx-auto relative z-10">
          {TICKET_PACKAGES.map((pkg, index) => {
            const isFeatured = !!pkg.isPopular;
            const theme = CARD_THEMES[pkg.id] ?? CARD_THEMES.single;
            const unitPrice = Math.round(pkg.price / pkg.totalNumbers);

            return (
              <motion.div
                key={pkg.id}
                variants={getCardVariant(index, isFeatured)}
                initial="hidden"
                whileInView="show"
                viewport={{ once: false, amount: 0.2 }}
                className={`relative rounded-3xl p-6 sm:p-8 flex flex-col justify-between hover:shadow-2xl transition-shadow ${theme.cardClass} ${isFeatured ? 'z-10 order-first md:order-none' : ''}`}
              >
                {/* Etiqueta de color arriba */}
                <div className={`absolute -top-3.5 left-1/2 -translate-x-1/2 text-[11px] font-black uppercase tracking-widest px-4 py-1 rounded-full shadow-md whitespace-nowrap ${theme.ribbonClass}`}>
                  {theme.ribbon}
                </div>

                <div>
                  <h3 className="font-heading font-extrabold text-2xl text-[#111827] mt-2">
                    {pkg.name}
                  </h3>
                  <p className="text-sm font-semibold text-slate-600 mt-1 mb-5 leading-snug">
                    {pkg.description}
                  </p>

                  {/* Precio */}
                  <div className="flex items-baseline gap-1.5">
                    <span className={`font-heading font-black text-4xl tabular-nums ${theme.priceClass}`}>
                      ${pkg.price.toLocaleString('es-CO')}
                    </span>
                    <span className="text-xs font-bold text-slate-500">COP</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1 mb-6">
                    ${unitPrice.toLocaleString('es-CO')} cada número
                  </p>

                  {/* Beneficios (iguales en los tres paquetes) */}
                  <ul className="space-y-3 text-[13px] text-slate-700 font-medium mb-6">
                    {pkg.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <Check className={`w-4 h-4 shrink-0 mt-0.5 ${theme.checkClass}`} strokeWidth={3} />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Lo que recibe el ganador */}
                  <div className={`flex items-start gap-2.5 rounded-2xl border p-3.5 mb-8 text-[13px] font-bold leading-snug ${theme.winBoxClass}`}>
                    <Trophy className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>{WIN_BENEFIT}</span>
                  </div>
                </div>

                <button
                  onClick={() => onSelectPackage(pkg)}
                  className={`w-full py-4 rounded-full font-heading font-bold text-xs uppercase tracking-wider transition-all hover:-translate-y-0.5 active:translate-y-0 cursor-pointer ${theme.buttonClass}`}
                  data-purpose={`btn-buy-${pkg.id}`}
                >
                  {pkg.buttonText}
                </button>
              </motion.div>
            );
          })}
        </div>

        {/* Sellos de confianza bajo las tarjetas */}
        <motion.div
          className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 mt-8 lg:mt-16 text-slate-400 text-xs font-semibold relative z-10"
          variants={fadeUpVariant}
          initial="hidden"
          whileInView="show"
          viewport={{ once: false, amount: 0.5 }}
        >
          <div className="flex items-center gap-1.5">
            <Lock className="w-4 h-4 text-slate-600" />
            <span>Encriptación SSL 256-bit</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CreditCard className="w-4 h-4 text-slate-600" />
            <span>Nequi, Daviplata, PSE, Tarjetas</span>
          </div>
          <button
            onClick={onOpenNotaryModal}
            className="flex items-center gap-1.5 hover:text-slate-600 transition-colors cursor-pointer"
          >
            <Scale className="w-4 h-4 text-slate-600" />
            <span>Protocolo Oficial de Sorteo y Traspaso</span>
          </button>
        </motion.div>

      </div>
    </section>
  );
};