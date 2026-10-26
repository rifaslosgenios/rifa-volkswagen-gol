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
import videoBolas from '../assets/animacion-bolas.mp4';
import vwLogo from '../assets/vw-logo.webp'; // Logo de Volkswagen para el título
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

  // En computador el carrusel de fotos va en la tercera columna del Hero.
  // En celular lo coloca App.tsx después de la galería oscura.
  const isDesktop = useIsDesktop();

  // Contador lento mostrando números disponibles
  useEffect(() => {
    const raffleInterval = setInterval(() => {
      const randomNum = Math.floor(Math.random() * (9999 - 1000 + 1) + 1000).toString();
      setRaffleDigits(randomNum.split(''));
    }, 3000);
    return () => clearInterval(raffleInterval);
  }, []);

  // Smooth Scroll a la galería de fotos (sección oscura con el carrusel)
  const scrollToVehicle = () => {
    const section = document.getElementById('galeria');
    if (section) {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Botones de acción. Se usan en dos sitios:
  // - celular: dentro de la columna derecha de la fila (junto al recuadro negro)
  // - computador: debajo del video
  const ActionButtons = ({ className }: { className: string }) => (
    <div className={className}>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onOpenPurchaseModal}
        className="w-full inline-flex items-center justify-center gap-1.5 lg:gap-2 bg-[#E60012] text-white text-[10px] lg:text-xs font-bold uppercase tracking-wide lg:tracking-wider px-2 lg:px-5 py-3 lg:py-4 rounded-full shadow-glow-button cursor-pointer"
      >
        <span>ELEGIR NÚMEROS</span>
        <Sparkles className="w-3.5 h-3.5 lg:w-4 lg:h-4 fill-white text-white shrink-0" />
      </motion.button>

      <motion.button
        whileHover={{ scale: 1.05, backgroundColor: "#f8fafc" }}
        whileTap={{ scale: 0.95 }}
        onClick={scrollToVehicle}
        className="w-full inline-flex items-center justify-center gap-1.5 lg:gap-2 bg-white text-[#111827] text-[10px] lg:text-xs font-bold uppercase tracking-wide lg:tracking-wider px-2 lg:px-5 py-3 lg:py-4 rounded-full border-2 border-slate-200 transition-colors cursor-pointer"
      >
        <span>VER VEHÍCULO</span>
        <ArrowDown className="w-3.5 h-3.5 lg:w-4 lg:h-4 shrink-0" />
      </motion.button>
    </div>
  );

  return (
    /* pb-10 / lg:pb-14: colchón blanco para que el Hero no toque la sección oscura
       (y para que el sello "$5.000" del carrusel quepa completo en computador) */
    <section className="relative pt-8 pb-10 lg:pt-20 lg:pb-14 overflow-hidden bg-white" data-purpose="hero-banner">

      {/* MASCOTA Y BURBUJA (Visible en celular y computadora) */}
      <motion.div
        initial={{ opacity: 0, x: -90 }}
        whileInView={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -90 }}
        viewport={{ once: false, amount: 0.1 }}
        transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
        className="absolute left-0 top-4 z-25 pointer-events-none w-28 sm:w-36 lg:w-56 xl:w-68 opacity-80 lg:opacity-100"
      >
        <div className="relative">
          <img
            src={mascotaImg}
            alt="Mascota Rifa"
            className="w-full h-auto object-contain drop-shadow-2xl origin-top-left"
          />
          {/* Burbuja: en celular es angosta y vertical (no tapa la cara); en computador es más grande */}
          <motion.div
            initial={{ opacity: 0, scale: 0.7 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: false, amount: 0.1 }}
            animate={{ rotate: [0, -1.5, 1.5, -1.5, 0], y: [0, -3, 0] }}
            transition={{ rotate: { repeat: Infinity, duration: 2.5, ease: "easeInOut" }, y: { repeat: Infinity, duration: 3, ease: "easeInOut" } }}
            className="absolute top-3 right-[-66px] max-w-[100px] sm:right-[-95px] sm:max-w-[135px] lg:right-[-110px] lg:max-w-[175px] xl:right-[-125px] xl:max-w-[190px] bg-white px-2 sm:px-4 py-2 sm:py-3 xl:px-5 xl:py-4 rounded-xl sm:rounded-2xl shadow-2xl border-2 border-slate-100 z-40 pointer-events-auto block"
          >
            <div className="absolute -left-2 top-4 w-4 h-4 bg-white border-l-2 border-b-2 border-slate-100 transform rotate-45"></div>
            <p className="text-[9px] sm:text-[11px] xl:text-[15px] font-black text-[#111827] uppercase tracking-tight leading-snug text-center">
              ¡A LA ORDEN, JOVEN! 🐶 <br />
              <span className="text-[#E60012] text-[10px] sm:text-xs xl:text-[17px]">¿CUÁNTOS NÚMEROS VA A LLEVAR?</span>
            </p>
          </motion.div>
        </div>
      </motion.div>

      <div className="max-w-[95rem] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* En computador las 3 columnas se estiran a la misma altura (items-stretch):
            la foto del vehículo termina a la altura de los botones bajo el video. */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-4 xl:gap-8 items-start lg:items-stretch pt-2 lg:pl-[240px] xl:pl-[300px]">

          {/* COLUMNA 1 (IZQUIERDA): TÍTULO, VIDEO Y (en computador) BOTONES */}
          <motion.div
            className="lg:col-span-5 w-full flex flex-col"
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            exit="hidden"
            viewport={{ once: false, amount: 0.1 }}
          >
            {/* TÍTULO: en celular va a la derecha del perro y de la burbuja; en computador sube a la altura de la burbuja */}
            <div className="relative z-10 ml-[172px] min-h-[150px] sm:ml-[232px] sm:min-h-[190px] lg:ml-4 lg:mt-12 lg:min-h-0 xl:ml-24 xl:-mt-14">
              <motion.h1
                variants={itemVariants}
                aria-label="¿Y si este Volkswagen Gol es tuyo? Boleta: 5.000 pesos"
                className="font-heading font-black text-[length:clamp(24px,7vw,34px)] sm:text-[40px] lg:text-[32px] xl:text-[48px] leading-[1.05] tracking-tight text-[#111827] mb-6 pt-2"
              >
                <span className="block whitespace-nowrap">
                  ¿Y SI ESTE
                  <img
                    src={vwLogo}
                    alt="Volkswagen"
                    className="inline-block ml-[0.15em]"
                    style={{ height: '0.85em', width: '0.85em', verticalAlign: '-0.05em' }}
                  />
                </span>
                <span className="block whitespace-nowrap">
                  <span className="text-[#E60012]">GOL</span> ES TUYO?
                </span>
                <span className="block whitespace-nowrap text-[0.85em] mt-1">
                  BOLETA: <span className="text-[#E60012]">$5.000</span>
                  <Sparkles className="inline-block w-[0.6em] h-[0.6em] ml-2 text-[#E60012] fill-[#E60012] animate-pulse" />
                </span>
              </motion.h1>
            </div>

            {/* VIDEO: en celular un poco más angosto (336px) y centrado, igual que la fila de abajo */}
            <motion.div
              variants={itemVariants}
              className="w-full max-w-[336px] mx-auto lg:max-w-none lg:mx-0 xl:max-w-[460px] aspect-video bg-white rounded-3xl overflow-hidden shadow-xl border-2 border-slate-100 mb-4 z-10 relative"
            >
              <video
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover"
              >
                <source src={videoBolas} type="video/mp4" />
              </video>
            </motion.div>

            {/* BOTONES (solo computador): debajo del video, uno al lado del otro */}
            <motion.div variants={itemVariants} className="hidden lg:block w-full xl:max-w-[460px] relative z-10">
              <ActionButtons className="flex flex-row gap-3 w-full [&>button]:flex-1" />
            </motion.div>
          </motion.div>

          {/* COLUMNA 2 (CENTRO)
              Celular: cuadrícula de 2 columnas con la misma altura (recuadro negro | botones + contador).
              Computador: recuadro negro y, justo debajo, el contador. */}
          <motion.div
            className="lg:col-span-3 z-10 w-full max-w-[336px] mx-auto lg:max-w-none lg:mx-0 grid grid-cols-2 gap-3 items-stretch lg:flex lg:flex-col lg:items-start lg:gap-5 lg:-mt-2 lg:ml-2 xl:ml-6"
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            exit="hidden"
            viewport={{ once: false, amount: 0.1 }}
          >
            {/* RECUADRO OSCURO: lo que recibe el ganador (sin inclinación en celular) */}
            <motion.div
              variants={itemVariants}
              whileHover={{ scale: 1.03, rotate: 0 }}
              className="relative z-20 w-full lg:max-w-[220px] xl:max-w-[240px]"
            >
              <div className="absolute -top-3 -right-2 lg:-top-4 lg:-right-4 text-[#C6F235] animate-[spin_4s_linear_infinite] z-30">
                <Sparkles className="w-6 h-6 lg:w-8 lg:h-8 fill-[#C6F235]" />
              </div>

              <div className="h-full bg-[#111827] text-white px-3 py-4 lg:px-5 lg:py-6 rounded-3xl shadow-[4px_4px_0px_#C6F235] lg:shadow-[6px_6px_0px_#C6F235] border-2 border-slate-800 lg:transform lg:-rotate-3 flex flex-col items-center justify-center text-center transition-all duration-300">
                <span className="text-[10px] lg:text-[11px] xl:text-xs font-black uppercase tracking-wider lg:tracking-widest text-slate-300 mb-3">
                  ¡Si ganas, recibes!
                </span>

                <ul className="w-full space-y-2 text-left">
                  {PRIZE_BENEFITS.map((item) => (
                    <li key={item} className="flex items-center gap-2 lg:gap-2.5">
                      <span className="shrink-0 w-5 h-5 rounded-full bg-[#C6F235] text-[#111827] flex items-center justify-center">
                        <Check className="w-3.5 h-3.5" strokeWidth={4} />
                      </span>
                      <span className="font-heading font-black text-[11px] lg:text-[13px] xl:text-sm uppercase tracking-tight text-white">
                        {item}
                      </span>
                    </li>
                  ))}
                  <li className="flex items-center gap-2 lg:gap-2.5">
                    <span className="shrink-0 w-5 h-5 rounded-full bg-[#C6F235] text-[#111827] flex items-center justify-center">
                      <MapPin className="w-3.5 h-3.5" strokeWidth={3} />
                    </span>
                    <span className="font-heading font-black text-[11px] lg:text-[13px] xl:text-sm uppercase tracking-tight text-white">
                      Entrega en Bogotá
                    </span>
                  </li>
                </ul>

                <span className="mt-4 inline-block bg-[#E60012] text-white font-heading font-black text-[11px] lg:text-sm xl:text-base uppercase tracking-wide px-3 py-1.5 lg:px-4 lg:py-2 rounded-full shadow-lg whitespace-nowrap">
                  TODO POR $5.000
                </span>
              </div>
            </motion.div>

            {/* Columna derecha en celular (botones + contador). En computador "desaparece" (contents)
                y solo queda el contador debajo del recuadro negro. */}
            <div className="flex flex-col gap-3 lg:contents">

              {/* Botones (solo celular) */}
              <motion.div variants={itemVariants} className="lg:hidden">
                <ActionButtons className="flex flex-col gap-2" />
              </motion.div>

              {/* CONTADOR: en celular crece (flex-1) para igualar la altura del recuadro negro */}
              <motion.div
                variants={itemVariants}
                className="flex-1 lg:flex-none bg-slate-900 rounded-3xl p-3 lg:p-4 shadow-2xl border-2 border-slate-800 w-full lg:max-w-[220px] xl:max-w-[240px] flex flex-col items-center justify-center gap-3"
              >
                <div className="flex flex-col items-center text-center px-1">
                  <span className="text-[10px] lg:text-xs text-[#C6F235] font-black tracking-wider lg:tracking-widest uppercase flex items-center justify-center text-center gap-1.5 leading-snug">
                    <Ticket className="w-4 h-4 shrink-0" /> LISTOS PARA COMPRAR YA MISMO
                  </span>
                </div>
                <div className="flex gap-1 lg:gap-1.5">
                  {raffleDigits.map((digit, idx) => (
                    <div key={idx} className="w-7 h-10 lg:w-10 lg:h-14 bg-black rounded-lg lg:rounded-xl border-2 border-slate-700 flex items-center justify-center overflow-hidden relative shadow-inner">
                      <span className="text-xl lg:text-3xl font-black text-white font-mono tabular-nums">{digit}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* COLUMNA 3 (DERECHA, solo computador): CARRUSEL DE FOTOS
              Se estira hasta la altura de la fila. En celular este carrusel
              lo coloca App.tsx después de la galería oscura. */}
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