import React, { useState, useEffect } from 'react';
import { Sparkles, X } from 'lucide-react';
import { RECENT_SALES } from '../data/mockData';

export const RecentSalesToast: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  // Sintetizador de sonido auténtico estilo caja registradora ("cha-ching")
  const playCashRegisterSound = () => {
    // Si la pestaña no está activa o visible, evitamos reproducir sonido
    if (document.hidden) return;

    try {
      const AudioContext = window.AudioContext || (window as unknown as { webkitAudioContext: typeof window.AudioContext }).webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();

      const now = ctx.currentTime;

      // 1. Golpe metálico inicial (caja abriéndose)
      const oscMetal = ctx.createOscillator();
      const gainMetal = ctx.createGain();
      oscMetal.type = 'triangle';
      oscMetal.frequency.setValueAtTime(300, now);
      oscMetal.frequency.exponentialRampToValueAtTime(120, now + 0.1);

      gainMetal.gain.setValueAtTime(0.2, now);
      gainMetal.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

      oscMetal.connect(gainMetal);
      gainMetal.connect(ctx.destination);
      oscMetal.start(now);
      oscMetal.stop(now + 0.15);

      // 2. Tintineo de monedas ("cha-ching" agudo)
      const frequencies = [1046.50, 1318.51, 1567.98, 2093.00];
      frequencies.forEach((freq, idx) => {
        const delay = 0.12 + (idx * 0.05);
        const oscCoin = ctx.createOscillator();
        const gainCoin = ctx.createGain();

        oscCoin.type = 'sine';
        oscCoin.frequency.setValueAtTime(freq, now + delay);

        gainCoin.gain.setValueAtTime(0.12, now + delay);
        gainCoin.gain.exponentialRampToValueAtTime(0.0001, now + delay + 0.3);

        oscCoin.connect(gainCoin);
        gainCoin.connect(ctx.destination);

        oscCoin.start(now + delay);
        oscCoin.stop(now + delay + 0.3);
      });
    } catch {
      // Ignorar si el navegador bloquea audio antes de la primera interacción
    }
  };

  useEffect(() => {
    if (isDismissed) return;

    // Intervalo espaciado entre notificaciones
    const interval = setInterval(() => {
      // Si el usuario cambió de pestaña, no disparamos notificaciones nuevas
      if (document.hidden) return;

      setIsVisible(false);
      setTimeout(() => {
        const nextIdx = Math.floor(Math.random() * RECENT_SALES.length);
        setCurrentIndex(nextIdx);
        setIsVisible(true);

        setTimeout(() => {
          playCashRegisterSound();
        }, 300);

        // Aumentado a 8.5 segundos visibles para dar tiempo perfecto de lectura
        setTimeout(() => {
          setIsVisible(false);
        }, 8500);
      }, 600);
    }, 24000);

    // Primera aparición a los 4 segundos
    const initialTimer = setTimeout(() => {
      if (!document.hidden) {
        setIsVisible(true);
        setTimeout(() => {
          playCashRegisterSound();
        }, 300);

        setTimeout(() => {
          setIsVisible(false);
        }, 8500);
      }
    }, 4000);

    return () => {
      clearInterval(interval);
      clearTimeout(initialTimer);
    };
  }, [isDismissed]);

  if (isDismissed) return null;

  const currentSale = RECENT_SALES[currentIndex];

  return (
    <div
      className={`fixed bottom-6 left-6 z-40 transition-all duration-700 transform ${isVisible ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-6 opacity-0 scale-95 pointer-events-none'
        }`}
    >
      <div className="bg-slate-900/95 text-white p-4.5 rounded-2xl shadow-2xl border border-slate-800 flex items-center gap-4 max-w-sm backdrop-blur-md">
        <div className="w-12 h-12 rounded-xl bg-[#C6F235] text-[#111827] flex items-center justify-center shrink-0 shadow-md">
          <Sparkles className="w-6 h-6 animate-pulse" />
        </div>

        <div className="flex-1 pr-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-widest text-[#C6F235]">
              ¡NUEVA COMPRA VERIFICADA!
            </span>
            <span className="text-[10px] text-slate-400 font-semibold">{currentSale.time}</span>
          </div>
          <p className="text-xs sm:text-sm font-bold text-white mt-0.5">
            {currentSale.name} ({currentSale.city})
          </p>
          <p className="text-xs text-slate-300 font-medium">
            Adquirió <span className="text-[#FF2D78] font-bold">{currentSale.pack}</span>
          </p>
        </div>

        <button
          onClick={() => setIsDismissed(true)}
          className="text-slate-400 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors cursor-pointer"
          aria-label="Cerrar notificación"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};