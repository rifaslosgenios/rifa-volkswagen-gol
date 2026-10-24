import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Sparkles,
  ArrowDown,
  Award,
  ShieldCheck,
  Fuel,
  Truck,
  ChevronLeft,
  ChevronRight,
  Ticket
} from 'lucide-react';
import { HERO_CAROUSEL_PHOTOS } from '../data/mockData';
// Importaciones obligatorias para que Vite cargue los archivos en Vercel
import mascotaImg from '../assets/mascota (1).png';
import videoBolas from '../assets/animacion-bolas.mp4';

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

export const Hero: React.FC<HeroProps> = ({
  onOpenPurchaseModal,
  onOpenNotaryModal,
}) => {
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [raffleDigits, setRaffleDigits] = useState(['4', '6', '0', '0']);

  const nextPhoto = () => setCurrentPhotoIndex((prev) => (prev + 1) % HERO_CAROUSEL_PHOTOS.length);
  const prevPhoto = () => setCurrentPhotoIndex((prev) => (prev - 1 + HERO_CAROUSEL_PHOTOS.length) % HERO_CAROUSEL_PHOTOS.length);

  useEffect(() => {
    const interval = setInterval(nextPhoto, 4000);
    return () => clearInterval(interval);
  }, []);

  // Contador lento mostrando números disponibles
  useEffect(() => {
    const raffleInterval = setInterval(() => {
      const randomNum = Math.floor(Math.random() * (9999 - 1000 + 1) + 1000).toString();
      setRaffleDigits(randomNum.split(''));
    }, 3000);
    return () => clearInterval(raffleInterval);
  }, []);

  // Smooth Scroll a Detalles del Vehículo
  const scrollToVehicle = () => {
    const section = document.getElementById('premio');
    if (section) {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section className="relative pt-8 pb-0 lg:pt-20 lg:pb-0 overflow-hidden bg-white" data-purpose="hero-banner">

      {/* MASCOTA Y BURBUJA (Visible en celular con tamaño reducido) */}
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
          <motion.div
            initial={{ opacity: 0, scale: 0.7 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: false, amount: 0.1 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            animate={{ rotate: [0, -1.5, 1.5, -1.5, 0], y: [0, -3, 0] }}
            transition={{ rotate: { repeat: Infinity, duration: 2.5, ease: "easeInOut" }, y: { repeat: Infinity, duration: 3, ease: "easeInOut" } }}
            className="absolute top-3 right-[-80px] sm:right-[-110px] xl:right-[-125px] bg-white px-2 sm:px-4 py-2 sm:py-3 rounded-xl sm:rounded-2xl shadow-2xl border-2 border-slate-100 max-w-[130px] sm:max-w-[175px] xl:max-w-[190px] z-30 pointer-events-auto hidden sm:block lg:block"
          >
            <div className="absolute -left-2 top-4 w-4 h-4 bg-white border-l-2 border-b-2 border-slate-100 transform rotate-45"></div>
            <p className="text-[9px] sm:text-[11px] font-black text-[#111827] uppercase tracking-tight leading-snug text-center">
              ¡A LA ORDEN, JOVEN! 🐶 <br />
              <span className="text-[#E60012] text-[10px] sm:text-xs">¿CUÁNTOS NÚMEROS VA A LLEVAR?</span>
            </p>
          </motion.div>
        </div>
      </motion.div>

      <div className="max-w-[95rem] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-4 xl:gap-8 items-start pt-2 lg:pl-[240px] xl:pl-[300px]">

          {/* COLUMNA 1 (IZQUIERDA) */}
          <motion.div
            className="lg:col-span-5 w-full flex flex-col"
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            exit="hidden"
            viewport={{ once: false, amount: 0.1 }}
          >
            {/* Título */}
            <div className="ml-16 sm:ml-24 lg:ml-12 xl:ml-16">
              <motion.div
                variants={itemVariants}
                className="font-heading font-black text-4xl sm:text-5xl lg:text-[42px] xl:text-[52px] leading-[1.05] tracking-tight text-[#111827] mb-6 pt-2"
              >
                ESTRENA TU <br className="hidden lg:block" />
                <span className="text-[#E60012]">VOLKSWAGEN GOL</span>
                <Sparkles className="inline-block w-8 h-8 sm:w-10 sm:h-10 ml-2 text-[#E60012] fill-[#E60012] animate-pulse" />
              </motion.div>
            </div>

            {/* VIDEO */}
            <motion.div variants={itemVariants} className="w-full xl:max-w-[460px] aspect-video bg-white rounded-3xl overflow-hidden shadow-xl border-2 border-slate-100 mb-4 z-10 relative">
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

            {/* ICONOS HORIZONTALES */}
            <motion.div variants={itemVariants} className="w-full xl:max-w-[460px] bg-slate-50/80 p-4 rounded-3xl border border-slate-100 shadow-sm backdrop-blur-sm">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <button onClick={onOpenNotaryModal} className="flex flex-col items-center text-center gap-1.5 group cursor-pointer">
                  <div className="w-10 h-10 rounded-xl bg-white shadow-sm border border-slate-200 flex items-center justify-center text-[#E60012] group-hover:bg-[#E60012] group-hover:text-white transition-colors">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <span className="font-heading font-black text-[10px] uppercase tracking-tight text-[#111827] group-hover:text-[#E60012] transition-colors leading-tight">Traspaso<br />Cubierto</span>
                </button>
                <div className="flex flex-col items-center text-center gap-1.5">
                  <div className="w-10 h-10 rounded-xl bg-white shadow-sm border border-slate-200 flex items-center justify-center text-[#E60012]">
                    <Award className="w-5 h-5" />
                  </div>
                  <span className="font-heading font-black text-[10px] uppercase tracking-tight text-[#111827] leading-tight">Sorteo<br />Oficial</span>
                </div>
                <div className="flex flex-col items-center text-center gap-1.5">
                  <div className="w-10 h-10 rounded-xl bg-white shadow-sm border border-slate-200 flex items-center justify-center text-[#E60012]">
                    <Fuel className="w-5 h-5" />
                  </div>
                  <span className="font-heading font-black text-[10px] uppercase tracking-tight text-[#111827] leading-tight">Tanque<br />Lleno</span>
                </div>
                <div className="flex flex-col items-center text-center gap-1.5">
                  <div className="w-10 h-10 rounded-xl bg-white shadow-sm border border-slate-200 flex items-center justify-center text-[#E60012]">
                    <Truck className="w-5 h-5" />
                  </div>
                  <span className="font-heading font-black text-[10px] uppercase tracking-tight text-[#111827] leading-tight">Envío<br />Nacional</span>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* COLUMNA 2 (CENTRO) */}
          <motion.div
            className="lg:col-span-3 z-10 w-full flex flex-col pt-0 lg:-mt-2 gap-5 items-start lg:ml-2 xl:ml-6"
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            exit="hidden"
            viewport={{ once: false, amount: 0.1 }}
          >
            {/* TEXTO LLAMATIVO */}
            <motion.div
              variants={itemVariants}
              whileHover={{ scale: 1.03, rotate: 0 }}
              className="relative z-20 w-full max-w-[220px] xl:max-w-[240px] cursor-pointer mt-4 lg:mt-0"
            >
              <div className="absolute -top-4 -right-4 text-[#C6F235] animate-[spin_4s_linear_infinite] z-30">
                <Sparkles className="w-8 h-8 fill-[#C6F235]" />
              </div>

              <div className="bg-[#111827] text-white px-4 py-5 rounded-3xl shadow-[6px_6px_0px_#C6F235] border-2 border-slate-800 transform -rotate-3 flex flex-col items-center justify-center text-center transition-all duration-300">
                <span className="text-[10px] xl:text-[11px] font-bold uppercase tracking-widest text-slate-300 mb-1">¡Asegura tu suerte!</span>
                <div className="font-heading font-black text-4xl xl:text-[44px] leading-none text-white drop-shadow-md">
                  $5.000
                </div>
                <span className="text-[#C6F235] font-black text-[10px] xl:text-xs tracking-widest uppercase mt-2 bg-white/10 px-3 py-1 rounded-full">
                  COP / BOLETA
                </span>
              </div>
            </motion.div>

            {/* Contenedor de Botones */}
            <motion.div variants={itemVariants} className="flex flex-col gap-3 w-full max-w-[220px] xl:max-w-[240px]">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onOpenPurchaseModal}
                className="w-full inline-flex items-center justify-center gap-2 bg-[#E60012] text-white text-xs font-bold uppercase tracking-wider px-5 py-4 rounded-full shadow-glow-button cursor-pointer"
              >
                <span>ELEGIR NÚMEROS</span>
                <Sparkles className="w-4 h-4 fill-white text-white" />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05, backgroundColor: "#f8fafc" }}
                whileTap={{ scale: 0.95 }}
                onClick={scrollToVehicle}
                className="w-full inline-flex items-center justify-center gap-2 bg-white text-[#111827] text-xs font-bold uppercase tracking-wider px-5 py-4 rounded-full border-2 border-slate-200 transition-colors cursor-pointer"
              >
                <span>VER VEHÍCULO</span>
                <ArrowDown className="w-4 h-4" />
              </motion.button>
            </motion.div>

            {/* CONTADOR */}
            <motion.div variants={itemVariants} className="bg-slate-900 rounded-3xl p-4 shadow-2xl border-2 border-slate-800 w-full max-w-[220px] xl:max-w-[240px] flex flex-col items-center gap-3">
              <div className="flex flex-col items-center text-center px-1">
                <span className="text-[11px] sm:text-xs text-[#C6F235] font-black tracking-widest uppercase flex items-center justify-center text-center gap-1.5 leading-snug">
                  <Ticket className="w-4 h-4 shrink-0" /> LISTOS PARA COMPRAR YA MISMO
                </span>
              </div>
              <div className="flex gap-1.5">
                {raffleDigits.map((digit, idx) => (
                  <div key={idx} className="w-9 h-12 sm:w-10 sm:h-14 bg-black rounded-xl border-2 border-slate-700 flex items-center justify-center overflow-hidden relative shadow-inner">
                    <span className="text-3xl font-black text-white font-mono tabular-nums">{digit}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>

          {/* COLUMNA 3 (DERECHA) */}
          <motion.div
            className="lg:col-span-4 relative flex justify-end items-start pt-8 lg:-mt-12 xl:-mt-20"
            variants={rightColumnVariants}
            initial="hidden"
            whileInView="show"
            exit="hidden"
            viewport={{ once: false, amount: 0.1 }}
          >
            <div className="absolute -right-6 top-1/3 -translate-y-1/2 select-none pointer-events-none opacity-10">
              <span className="vertical-title font-heading font-black text-8xl lg:text-[120px] text-[#E60012] tracking-tighter">
                GOL 98
              </span>
            </div>

            <motion.div
              animate={{ scale: [1, 1.1, 1], rotate: [0, 10, -10, 0] }}
              transition={{ repeat: Infinity, duration: 10, ease: "easeInOut" }}
              className="blob-lime absolute w-72 sm:w-80 h-72 sm:h-80 bg-[#C6F235] -z-0 opacity-90 filter blur-[1px] top-10"
            />

            <div className="relative z-10 w-[320px] lg:w-[380px] xl:w-[480px] max-w-none aspect-[9/16] rounded-3xl overflow-hidden border-4 border-white shadow-2xl bg-slate-900 ml-auto">
              <img
                key={currentPhotoIndex}
                alt="Volkswagen Gol 98 con Moño"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover transition-opacity duration-700 ease-in-out"
                src={HERO_CAROUSEL_PHOTOS[currentPhotoIndex]}
                onError={() => nextPhoto()}
              />

              <button onClick={(e) => { e.stopPropagation(); prevPhoto(); }} className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 hover:bg-[#E60012] text-white flex items-center justify-center backdrop-blur-sm transition-colors cursor-pointer z-30 shadow-md">
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button onClick={(e) => { e.stopPropagation(); nextPhoto(); }} className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 hover:bg-[#E60012] text-white flex items-center justify-center backdrop-blur-sm transition-colors cursor-pointer z-30 shadow-md">
                <ChevronRight className="w-6 h-6" />
              </button>

              <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-20">
                {HERO_CAROUSEL_PHOTOS.slice(0, 10).map((_, idx) => (
                  <span key={idx} className={`h-1.5 rounded-full transition-all ${currentPhotoIndex % 10 === idx ? 'w-6 bg-[#E60012]' : 'w-1.5 bg-white/60'}`} />
                ))}
              </div>

              <motion.button
                initial={{ scale: 0, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: false }}
                transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.6 }}
                whileHover={{ scale: 1.1, rotate: -10 }}
                onClick={(e) => { e.stopPropagation(); onOpenPurchaseModal(); }}
                className="absolute -bottom-5 -left-5 bg-[#E60012] text-white w-28 h-28 xl:w-36 xl:h-36 rounded-full flex flex-col items-center justify-center text-center p-2 shadow-2xl rotate-[-8deg] border-4 border-white cursor-pointer z-40"
              >
                <span className="font-heading font-black text-2xl xl:text-3xl leading-none">$5.000</span>
                <span className="text-[10px] xl:text-xs font-bold uppercase leading-tight mt-1 tracking-wider text-red-100">¡Boleto Único!</span>
              </motion.button>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};