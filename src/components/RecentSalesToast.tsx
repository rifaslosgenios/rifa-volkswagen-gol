import React, { useState, useEffect } from 'react';
import { Sparkles, X } from 'lucide-react';
import { collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { db } from '../firebaseConfig';

interface RealSale {
  name: string;
  pack: string;
  time: string;
}

export const RecentSalesToast: React.FC = () => {
  const [currentSale, setCurrentSale] = useState<RealSale | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  const playCashRegisterSound = () => {
    if (document.hidden) return;
    try {
      const AudioContext = window.AudioContext || (window as unknown as { webkitAudioContext: typeof window.AudioContext }).webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      const now = ctx.currentTime;

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
      // Ignorar si el navegador bloquea audio
    }
  };

  useEffect(() => {
    if (isDismissed) return;

    // Escuchar en tiempo real la última orden creada en Firebase
    const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'), limit(1));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === 'added') {
          const data = change.doc.data();

          // Solo mostramos notificaciones de compras hechas en los últimos 5 minutos
          // para no mostrar notificaciones viejas al recargar la página.
          const isRecent = data.createdAt > Date.now() - (5 * 60 * 1000);

          if (isRecent) {
            setCurrentSale({
              name: data.buyerName.split(' ')[0], // Solo el primer nombre por privacidad
              pack: data.packageName,
              time: 'Hace un momento'
            });

            setIsVisible(false);
            setTimeout(() => {
              setIsVisible(true);
              setTimeout(() => playCashRegisterSound(), 300);
              setTimeout(() => setIsVisible(false), 8500);
            }, 500);
          }
        }
      });
    });

    return () => unsubscribe();
  }, [isDismissed]);

  if (isDismissed || !currentSale) return null;

  return (
    <div
      className={`fixed bottom-6 left-6 z-40 transition-all duration-700 transform ${isVisible ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-6 opacity-0 scale-95 pointer-events-none'
        }`}
    >
      <div className="bg-slate-900/95 text-white p-4 rounded-2xl shadow-2xl border border-slate-800 flex items-center gap-3 max-w-[280px] backdrop-blur-md">
        <div className="w-12 h-12 rounded-xl bg-[#C6F235] text-[#111827] flex items-center justify-center shrink-0 shadow-md">
          <Sparkles className="w-6 h-6 animate-pulse" />
        </div>
        <div className="flex-1 pr-1 min-w-0">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-widest text-[#C6F235]">
              ¡NUEVA COMPRA!
            </span>
            <span className="text-[10px] text-slate-400 font-semibold">{currentSale.time}</span>
          </div>
          <p className="text-xs sm:text-sm font-bold text-white mt-0.5 leading-tight">
            {currentSale.name}
          </p>
          <p className="text-xs text-slate-300 font-medium mt-0.5">
            Adquirió <span className="text-[#FF2D78] font-bold">{currentSale.pack}</span>
          </p>
        </div>
        <button
          onClick={() => setIsDismissed(true)}
          className="text-slate-400 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors cursor-pointer shrink-0"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};