import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Sparkles,
  ArrowDown,
  Check,
  MapPin,
  Ticket
} from 'lucide-react';
// Importaciones obligatorias para que Vite cargue los archivos en Vercel
import mascotaImg from '../assets/mascota (1).png';
import { HeroPhotoCarousel, useIsDesktop } from './HeroPhotoCarousel';

interface HeroProps {
  onOpenPurchaseModal: () => void;
  onOpenVehicleModal: () => void;
  onOpenNotaryModal: () => void;
}

const containerVariants = {
  hidden: { opacity: 0, x: -60 },
  show: {
    opacity: 1,
    x: 0,
    transition: { staggerChildren: 0.2, delayChildren: 0.1, duration: 1.2, ease: [0.16, 1, 0.3, 1] }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 1.2, ease: [0.16, 1, 0.3, 1] } }
};

const rightColumnVariants = {
  hidden: { opacity: 0, x: 60 },
  show: { opacity: 1, x: 0, transition: { duration: 1.5, ease: [0.16, 1, 0.3, 1], delay: 0.3 } }
};

// Beneficios que recibe el ganador (se muestran en el recuadro oscuro)
const PRIZE_BENEFITS = ['Traspaso', 'SOAT', 'Tecnomecánica', 'Tanque lleno'];

export const Hero: React.FC<HeroProps> = ({
  onOpenPurchaseModal,
}) => {
  const [raffleDigits, setRaffleDigits] = useState(['4', '6', '0', '0']);
  const isDesktop = useIsDesktop();

  // Contador lento mostrando números disponibles
  useEffect(() => {
    const raffleInterval = setInterval(() => {
      const randomNum = Math.floor(Math.random() * (9999 - 1000 + 1) + 1000).toString();
      setRaffleDigits(randomNum.split(''));
    }, 3000);
    return () => clearInterval(raffleInterval);
  }, []);

  // Smooth Scroll a la galería de fotos
  const scrollToVehicle = () => {
    const section = document.getElementById('galeria');
    if (section) {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Botones de acción súper compactos en móvil, tamaño normal en desktop
  const ActionButtons = ({ className }: { className: string }) => (
    <div className={className}>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onOpenPurchaseModal}
        className="w-full inline-flex items-center justify-center gap-1 lg:gap-2 bg-[#E60012] text-white text-[7.5px] sm:text-[9px] lg:text-xs font-bold uppercase tracking-tight lg:tracking-wider px-1.5 py-2 lg:px-5 lg:py-4 rounded-full shadow-glow-button cursor-pointer"
      >
        <span>ELEGIR NÚMEROS</span>
        <Sparkles className="w-2.5 h-2.5 lg:w-4 lg:h-4 fill-white text-white shrink-0" />
      </motion.button>

      <motion.button
        whileHover={{ scale: 1.05, backgroundColor: "#f8fafc" }}
        whileTap={{ scale: 0.95 }}
        onClick={scrollToVehicle}
        className="w-full inline-flex items-center justify-center gap-1 lg:gap-2 bg-white text-[#111827] text-[7.5px] sm:text-[9px] lg:text-xs font-bold uppercase tracking-tight lg:tracking-wider px-1.5 py-2 lg:px-5 lg:py-4 rounded-full border lg:border-2 border-slate-200 transition-colors cursor-pointer"
      >
        <span>VER VEHÍCULO</span>
        <ArrowDown className="w-2.5 h-2.5 lg:w-4 lg:h-4 shrink-0" />
      </motion.button>
    </div>
  );

  return (
    <section className="relative pt-4 pb-6 lg:pt-20 lg:pb-14 overflow-hidden bg-white min-h-[160px] lg:min-h-0" data-purpose="hero-banner">

      {/* MASCOTA Y BURBUJA (Achicados para móvil, fijos a la izquierda) */}
      <motion.div
        initial={{ opacity: 0, x: -90 }}
        whileInView={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -90 }}
        viewport={{ once: false, amount: 0.1 }}
        transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
        className="absolute left-[-2%] sm:left-0 top-3 lg:top-4 z-30 pointer-events-none w-[34%] sm:w-[25%] lg:w-56 xl:w-68 opacity-100"
      >
        <div className="relative">
          <img
            src={mascotaImg}
            alt="Mascota Rifa"
            className="w-full h-auto object-contain drop-shadow-xl lg:drop-shadow-2xl origin-top-left"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.7 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: false, amount: 0.1 }}
            animate={{ rotate: [0, -1.5, 1.5, -1.5, 0], y: [0, -3, 0] }}
            transition={{ rotate: { repeat: Infinity, duration: 2.5, ease: "easeInOut" }, y: { repeat: Infinity, duration: 3, ease: "easeInOut" } }}
            className="absolute top-0 right-[-80%] sm:right-[-90%] max-w-[100%] sm:max-w-[130px] lg:right-[-110px] lg:max-w-[175px] xl:right-[-125px] xl:max-w-[190px] bg-white px-1.5 py-1.5 sm:p-2 lg:px-5 lg:py-4 rounded-lg lg:rounded-2xl shadow-xl border border-slate-100 z-40 pointer-events-auto block"
          >
            <div className="absolute -left-1.5 lg:-left-2 top-2 lg:top-4 w-3 h-3 lg:w-4 lg:h-4 bg-white border-l lg:border-l-2 border-b lg:border-b-2 border-slate-100 transform rotate-45"></div>
            <p className="text-[7px] sm:text-[9px] lg:text-[11px] xl:text-[15px] font-black text-[#111827] uppercase tracking-tighter lg:tracking-tight leading-tight lg:leading-snug text-center">
              ¡A LA ORDEN, JOVEN! 🐶 <br />
              <span className="text-[#E60012] text-[7.5px] sm:text-[9.5px] lg:text-xs xl:text-[17px]">¿CUÁNTOS NÚMEROS VA A LLEVAR?</span>
            </p>
          </motion.div>
        </div>
      </motion.div>

      <div className="max-w-[95rem] mx-auto px-2 lg:px-8 relative z-10">

        {/* En móvil: Todo agrupado a la derecha usando Flex. En desktop: Grid normal */}
        <div className="flex justify-end lg:grid lg:grid-cols-12 gap-2 lg:gap-4 xl:gap-8 items-start lg:items-stretch pt-1 lg:pt-2 lg:pl-[240px] xl:pl-[300px]">

          {/* COLUMNA 1 (IZQUIERDA): Oculta en móvil. En Desktop muestra los botones */}
          <motion.div
            className="hidden lg:flex lg:col-span-5 w-full flex-col"
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            exit="hidden"
            viewport={{ once: false, amount: 0.1 }}
          >
            <motion.div variants={itemVariants} className="w-full xl:max-w-[460px] relative z-10 mt-auto">
              <ActionButtons className="flex flex-row gap-3 w-full [&>button]:flex-1" />
            </motion.div>
          </motion.div>

          {/* COLUMNA 2 (CENTRO/DERECHA MÓVIL): Caja de premios, botones y contador */}
          <motion.div
            className="w-[67%] sm:w-[72%] lg:w-full lg:col-span-3 grid grid-cols-2 gap-1.5 lg:flex lg:flex-col lg:items-start lg:gap-5 lg:-mt-2 lg:ml-2 xl:ml-6"
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            exit="hidden"
            viewport={{ once: false, amount: 0.1 }}
          >
            {/* RECUADRO OSCURO */}
            <motion.div
              variants={itemVariants}
              whileHover={{ scale: 1.03, rotate: 0 }}
              className="relative z-20 w-full lg:max-w-[220px] xl:max-w-[240px]"
            >
              <div className="absolute -top-2 -right-2 lg:-top-4 lg:-right-4 text-[#C6F235] animate-[spin_4s_linear_infinite] z-30">
                <Sparkles className="w-4 h-4 lg:w-8 lg:h-8 fill-[#C6F235]" />
              </div>

              <div className="h-full bg-[#111827] text-white px-1.5 py-3 sm:px-2 sm:py-4 lg:px-5 lg:py-6 rounded-2xl lg:rounded-3xl shadow-[3px_3px_0px_#C6F235] lg:shadow-[6px_6px_0px_#C6F235] border border-slate-800 lg:transform lg:-rotate-3 flex flex-col items-center justify-center text-center transition-all duration-300">
                <span className="text-[7px] sm:text-[9px] lg:text-[11px] xl:text-xs font-black uppercase tracking-wider lg:tracking-widest text-slate-300 mb-1.5 lg:mb-3">
                  ¡Si ganas, recibes!
                </span>

                <ul className="w-full space-y-1 lg:space-y-2 text-left">
                  {PRIZE_BENEFITS.map((item) => (
                    <li key={item} className="flex items-center gap-1 lg:gap-2.5">
                      <span className="shrink-0 w-3 h-3 lg:w-5 lg:h-5 rounded-full bg-[#C6F235] text-[#111827] flex items-center justify-center">
                        <Check className="w-2 h-2 lg:w-3.5 lg:h-3.5" strokeWidth={4} />
                      </span>
                      <span className="font-heading font-black text-[7px] sm:text-[8.5px] lg:text-[13px] xl:text-sm uppercase tracking-tight text-white leading-none">
                        {item}
                      </span>
                    </li>
                  ))}
                  <li className="flex items-center gap-1 lg:gap-2.5">
                    <span className="shrink-0 w-3 h-3 lg:w-5 lg:h-5 rounded-full bg-[#C6F235] text-[#111827] flex items-center justify-center">
                      <MapPin className="w-2 h-2 lg:w-3.5 lg:h-3.5" strokeWidth={3} />
                    </span>
                    <span className="font-heading font-black text-[7px] sm:text-[8.5px] lg:text-[13px] xl:text-sm uppercase tracking-tight text-white leading-none">
                      Entrega en Bogotá
                    </span>
                  </li>
                </ul>

                <span className="mt-2 lg:mt-4 inline-block bg-[#E60012] text-white font-heading font-black text-[7px] sm:text-[9px] lg:text-sm xl:text-base uppercase tracking-wide px-2 py-1 lg:px-4 lg:py-2 rounded-full shadow-md lg:shadow-lg whitespace-nowrap">
                  TODO POR $5.000
                </span>
              </div>
            </motion.div>

            {/* COLUMNA DERECHA MÓVIL (Botones + Contador) */}
            <div className="flex flex-col gap-1.5 lg:contents">
              {/* Botones (Solo celular) */}
              <motion.div variants={itemVariants} className="lg:hidden">
                <ActionButtons className="flex flex-col gap-1.5" />
              </motion.div>

              {/* CONTADOR */}
              <motion.div
                variants={itemVariants}
                className="flex-1 lg:flex-none bg-slate-900 rounded-2xl lg:rounded-3xl p-1.5 sm:p-2 lg:p-4 shadow-xl lg:shadow-2xl border border-slate-800 w-full lg:max-w-[220px] xl:max-w-[240px] flex flex-col items-center justify-center gap-1.5 lg:gap-3"
              >
                <div className="flex flex-col items-center text-center px-0.5">
                  <span className="text-[6px] sm:text-[7.5px] lg:text-xs text-[#C6F235] font-black tracking-wider lg:tracking-widest uppercase flex items-center justify-center text-center gap-0.5 lg:gap-1.5 leading-tight">
                    <Ticket className="w-2.5 h-2.5 lg:w-4 lg:h-4 shrink-0" /> LISTOS PARA COMPRAR YA MISMO
                  </span>
                </div>
                <div className="flex gap-0.5 sm:gap-1 lg:gap-1.5">
                  {raffleDigits.map((digit, idx) => (
                    <div key={idx} className="w-4 h-6 sm:w-6 sm:h-8 lg:w-10 lg:h-14 bg-black rounded sm:rounded-md lg:rounded-xl border border-slate-700 flex items-center justify-center overflow-hidden relative shadow-inner">
                      <span className="text-xs sm:text-base lg:text-3xl font-black text-white font-mono tabular-nums">{digit}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* COLUMNA 3 (DERECHA, solo computador): CARRUSEL DE FOTOS */}
          {isDesktop && (
            <motion.div
              className="lg:col-span-4 relative flex items-stretch pt-8 lg:-mt-20 xl:-mt-[105px]"
              variants={rightColumnVariants}
              initial="hidden"
              whileInView="show"
              exit="hidden"
              viewport={{ once: false, amount: 0.1 }}
            >
              <HeroPhotoCarousel onOpenPurchaseModal={onOpenPurchaseModal} />
            </motion.div>
          )}

        </div>
      </div>
    </section>
  );
};