import React from 'react';
import { motion } from 'framer-motion';
import {
  Check,
  CheckCircle2,
  Lock,
  CreditCard,
  Scale,
  Sparkles,
} from 'lucide-react';
import { TICKET_PACKAGES } from '../data/mockData';
import { TicketPackage } from '../types';

interface TicketSelectorProps {
  onSelectPackage: (pkg: TicketPackage) => void;
  onOpenNotaryModal: () => void;
}

// Variantes para el contenedor (Header y Trust badges)
const fadeUpVariant = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
};

// Función para obtener la animación de cada tarjeta
const getCardVariant = (index: number, isFeatured: boolean) => {
  if (isFeatured) {
    // Tarjeta central (Destacada): Entra desde abajo con un poco de zoom
    return {
      hidden: { opacity: 0, y: 50, scale: 0.95 },
      show: { opacity: 1, y: 0, scale: 1.05, transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.2 } }
    };
  } else if (index === 0) {
    // Tarjeta Izquierda
    return {
      hidden: { opacity: 0, x: -60 },
      show: { opacity: 1, x: 0, transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.1 } }
    };
  } else {
    // Tarjeta Derecha
    return {
      hidden: { opacity: 0, x: 60 },
      show: { opacity: 1, x: 0, transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.3 } }
    };
  }
};

export const TicketSelector: React.FC<TicketSelectorProps> = ({
  onSelectPackage,
  onOpenNotaryModal,
}) => {
  return (
    <section className="relative py-20 bg-slate-50 overflow-hidden" data-purpose="ticket-selection-module" id="comprar">

      {/* MASCOTA 5 ASOMÁNDOSE POR LA IZQUIERDA CON ESTRATEGIA DE NEUROMARKETING */}
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
            src="/src/assets/mascota (5).png"
            alt="Mascota Compra"
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
            className="absolute top-8 right-[-200px] xl:right-[-220px] bg-white px-5 py-4 rounded-3xl shadow-2xl border-3 border-slate-100 max-w-[210px] xl:max-w-[230px] z-30 pointer-events-auto"
          >
            <div className="absolute -left-3 top-6 w-4 h-4 bg-white border-l-3 border-b-3 border-slate-100 transform rotate-45"></div>
            <p className="text-xs sm:text-sm font-black text-[#111827] uppercase tracking-tight leading-snug text-center">
              ¿CUÁNTAS <span className="text-[#E60012] text-sm sm:text-base">20</span> BOLETAS <br />
              VAS A COMPRAR?
            </p>
          </motion.div>
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Header Animado */}
        <motion.div
          className="text-center max-w-xl mx-auto mb-16 relative z-10"
          variants={fadeUpVariant}
          initial="hidden"
          whileInView="show"
          exit="hidden"
          viewport={{ once: false, amount: 0.3 }}
        >
          <span className="text-xs font-black tracking-widest uppercase text-[#E60012]">
            PAGO 100% SEGURO Y VERIFICADO
          </span>
          <h2 className="font-heading font-black text-3xl sm:text-5xl text-[#111827] mt-2 tracking-tight">
            ELIGE TU COMBINACIÓN
          </h2>
          <p className="text-slate-500 mt-2 text-sm sm:text-base">
            Cuantos más boletos elijas, mayor probabilidad y mejores descuentos obtienes. Recibe tus números al instante en tu email y WhatsApp.
          </p>
        </motion.div>

        {/* Tarjetas de Precios Animadas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch max-w-5xl mx-auto relative z-10">
          {TICKET_PACKAGES.map((pkg, index) => {
            const isFeatured = pkg.isPopular;

            if (isFeatured) {
              return (
                <motion.div
                  key={pkg.id}
                  variants={getCardVariant(index, isFeatured)}
                  initial="hidden"
                  whileInView="show"
                  exit="hidden"
                  viewport={{ once: false, amount: 0.2 }}
                  className="bg-white rounded-3xl p-8 border-2 border-[#E60012] shadow-glow-card relative flex flex-col justify-between z-10 hover:shadow-2xl transition-shadow"
                >
                  {/* Top badge */}
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#E60012] text-white text-[11px] font-black uppercase tracking-widest px-4 py-1 rounded-full shadow-md whitespace-nowrap">
                    EL MÁS ELEGIDO ★
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-4 pt-1">
                      <span className="text-xs font-bold uppercase tracking-wider text-[#E60012]">
                        {pkg.tagline}
                      </span>
                      <span className="text-xs font-extrabold px-3 py-1 rounded-full bg-[#C6F235] text-[#111827]">
                        {pkg.badge}
                      </span>
                    </div>

                    <h3 className="font-heading font-extrabold text-2xl text-[#111827] mb-1">
                      {pkg.name}
                    </h3>
                    <p className="text-xs text-slate-500 mb-6">{pkg.description}</p>

                    <div className="flex items-baseline gap-2 mb-8">
                      <span className="font-heading font-black text-3xl sm:text-4xl text-[#E60012] tabular-nums">
                        ${pkg.price.toLocaleString('es-CO')} COP
                      </span>
                      {pkg.originalPrice && (
                        <span className="text-xs line-through text-slate-400 tabular-nums">
                          ${pkg.originalPrice.toLocaleString('es-CO')}
                        </span>
                      )}
                      {pkg.discountLabel && (
                        <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                          {pkg.discountLabel}
                        </span>
                      )}
                    </div>

                    {/* Perks */}
                    <ul className="space-y-3 text-xs text-slate-700 font-medium mb-8">
                      {pkg.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-[#E60012] shrink-0 mt-0.5" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <button
                    onClick={() => onSelectPackage(pkg)}
                    className="w-full py-4 rounded-full font-heading font-bold text-xs uppercase tracking-wider text-white bg-[#E60012] hover:bg-[#B3000E] transition-all shadow-glow-button hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
                    data-purpose="btn-buy-pack5"
                  >
                    {pkg.buttonText}
                  </button>
                </motion.div>
              );
            }

            return (
              <motion.div
                key={pkg.id}
                variants={getCardVariant(index, isFeatured)}
                initial="hidden"
                whileInView="show"
                exit="hidden"
                viewport={{ once: false, amount: 0.2 }}
                className="bg-white rounded-3xl p-8 border border-slate-200 shadow-glow-soft flex flex-col justify-between hover:border-[#E60012]/40 transition-colors"
              >
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      {pkg.tagline}
                    </span>
                    <span className="text-xs font-bold px-3 py-1 rounded-full bg-slate-100 text-slate-600">
                      {pkg.badge}
                    </span>
                  </div>

                  <h3 className="font-heading font-extrabold text-2xl text-[#111827] mb-1">
                    {pkg.name}
                  </h3>
                  <p className="text-xs text-slate-500 mb-6">{pkg.description}</p>

                  <div className="flex items-baseline gap-2 mb-8">
                    <span className="font-heading font-black text-2xl sm:text-3xl text-[#111827] tabular-nums">
                      ${pkg.price.toLocaleString('es-CO')} COP
                    </span>
                    {pkg.originalPrice ? (
                      <span className="text-xs text-slate-400 line-through tabular-nums">
                        ${pkg.originalPrice.toLocaleString('es-CO')}
                      </span>
                    ) : (
                      <span className="text-xs text-slate-400">/ boleto</span>
                    )}
                  </div>

                  {/* Perks */}
                  <ul className="space-y-3 text-xs text-slate-600 font-medium mb-8">
                    {pkg.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-[#E60012] shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  onClick={() => onSelectPackage(pkg)}
                  className="w-full py-4 rounded-full font-heading font-bold text-xs uppercase tracking-wider text-[#111827] bg-slate-100 hover:bg-[#E60012] hover:text-white transition-all shadow-sm cursor-pointer"
                  data-purpose={`btn-buy-${pkg.id}`}
                >
                  {pkg.buttonText}
                </button>
              </motion.div>
            );
          })}
        </div>

        {/* Trust Badges Under Pricing */}
        <motion.div
          className="flex flex-wrap items-center justify-center gap-8 mt-12 text-slate-400 text-xs font-semibold relative z-10"
          variants={fadeUpVariant}
          initial="hidden"
          whileInView="show"
          exit="hidden"
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