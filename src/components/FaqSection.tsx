import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

// Aquí integramos las preguntas directamente para no depender de mockData
const FAQ_ITEMS = [
  {
    id: "faq-1",
    question: "¿Cómo y cuándo se realiza el sorteo?",
    answer: "El sorteo consta de 10.000 números (del 0000 al 9999) y jugará con el Premio Mayor de la Lotería de la Cruz Roja el día 6 de enero de 2027. El ganador será quien tenga los 4 dígitos en estricto orden."
  },
  {
    id: "faq-2",
    question: "¿Qué pasa si no se alcanzan a vender los boletos?",
    answer: "Tenemos una meta de punto de equilibrio del 70% de la boletería vendida. Si no alcanzamos ese porcentaje para la fecha prevista, el sorteo se aplazará a la siguiente fecha oficial de la Lotería de la Cruz Roja hasta cumplir la meta. ¡Tus boletos conservan el 100% de su validez!"
  },
  {
    id: "faq-3",
    question: "¿Dónde y cómo me entregan el vehículo si gano?",
    answer: "La entrega física se realiza única y exclusivamente en Bogotá D.C. (los gastos de traslado desde otra ciudad corren por tu cuenta). Por seguridad de ambos, el vehículo y las llaves se entregan en el momento exacto en que el traspaso quede formalmente radicado ante el Tránsito de Funza."
  },
  {
    id: "faq-4",
    question: "¿Quién asume los gastos de traspaso e impuestos?",
    answer: "El organizador asume el 100% de los costos de radicación de traspaso y gastos notariales. El vehículo se te entrega a paz y salvo de multas e impuestos hasta ese día. Cualquier impuesto futuro, retención o afectación en declaración de renta será asumido por el ganador."
  },
  {
    id: "faq-5",
    question: "¿El carro cuenta con garantía mecánica?",
    answer: "Al tratarse de un vehículo usado obtenido mediante sorteo (por un valor ínfimo), el Volkswagen Gol 98 se entrega en las condiciones físicas y mecánicas en que se encuentra actualmente ('As is'). No aplican garantías mecánicas, eléctricas ni estructurales posteriores a la firma del acta de entrega."
  },
  {
    id: "faq-6",
    question: "¿Es seguro el proceso? ¿Cómo compruebo mis números?",
    answer: "Totalmente seguro. Una vez verificado tu pago, el sistema emitirá un PDF oficial de comprobante. Además, puedes verificar en tiempo real si tus números están asignados ingresando al 'Comprobador de Boletos' desde nuestra página."
  },
  {
    id: "faq-7",
    question: "¿Puedo pedir el reembolso si me arrepiento?",
    answer: "No. Al tratarse de un sorteo con cupos limitados, las compras son definitivas. No se realizan devoluciones ni reembolsos bajo ninguna circunstancia, por lo que tu participación es 100% voluntaria."
  }
];

const headerVariant = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
};

const containerVariant = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.1 }
  }
};

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
    <section className="pt-8 pb-16 bg-slate-50 overflow-hidden" data-purpose="faq-accordion-list" id="faq">
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