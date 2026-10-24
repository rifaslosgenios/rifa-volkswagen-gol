import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { FAQ_ITEMS } from '../data/mockData';

// Variante para el encabezado
const headerVariant = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
};

// Variante para el contenedor de la lista (maneja la cascada)
const containerVariant = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.1 }
  }
};

// Variante individual para cada pregunta
const itemVariant = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }
};

export const FaqSection: React.FC = () => {
  const [openId, setOpenId] = useState<string | null>(FAQ_ITEMS[0].id);

  const toggleItem = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section className="py-16 bg-slate-50 overflow-hidden" data-purpose="faq-accordion-list" id="faq">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Encabezado animado */}
        <motion.div
          className="text-center mb-12"
          variants={headerVariant}
          initial="hidden"
          whileInView="show"
          exit="hidden"
          viewport={{ once: false, amount: 0.5 }}
        >
          <span className="text-xs font-black tracking-widest uppercase text-[#E60012]">
            RESOLVEMOS TUS DUDAS
          </span>
          <h2 className="font-heading font-black text-3xl text-[#111827] mt-2 tracking-tight">
            PREGUNTAS FRECUENTES
          </h2>
        </motion.div>

        {/* Contenedor en cascada de las preguntas */}
        <motion.div
          className="space-y-4"
          variants={containerVariant}
          initial="hidden"
          whileInView="show"
          exit="hidden"
          viewport={{ once: false, amount: 0.2 }}
        >
          {FAQ_ITEMS.map((item) => {
            const isOpen = openId === item.id;
            return (
              <motion.div
                key={item.id}
                variants={itemVariant}
                className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden transition-shadow hover:shadow-md"
              >
                <button
                  type="button"
                  onClick={() => toggleItem(item.id)}
                  className="w-full p-6 font-heading font-bold text-sm text-[#111827] flex items-center justify-between text-left hover:text-[#E60012] transition-colors focus:outline-none cursor-pointer"
                >
                  <span className="pr-4">{item.question}</span>
                  <span
                    className={`text-[#E60012] shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''
                      }`}
                  >
                    <ChevronDown className="w-5 h-5" />
                  </span>
                </button>

                {/* Animación fluida al abrir/cerrar la respuesta */}
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: 'easeInOut' }}
                    >
                      <div className="px-6 pb-6 pt-1 text-xs text-slate-500 leading-relaxed border-t border-slate-50">
                        {item.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

              </motion.div>
            );
          })}
        </motion.div>

      </div>
    </section>
  );
};