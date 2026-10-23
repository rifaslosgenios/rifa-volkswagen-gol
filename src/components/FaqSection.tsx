import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { FAQ_ITEMS } from '../data/mockData';

export const FaqSection: React.FC = () => {
  const [openId, setOpenId] = useState<string | null>(FAQ_ITEMS[0].id);

  const toggleItem = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section className="py-16 bg-slate-50" data-purpose="faq-accordion-list" id="faq">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="text-xs font-black tracking-widest uppercase text-[#FF2D78]">
            RESOLVEMOS TUS DUDAS
          </span>
          <h2 className="font-heading font-black text-3xl text-[#111827] mt-2 tracking-tight">
            PREGUNTAS FRECUENTES
          </h2>
        </div>

        <div className="space-y-4">
          {FAQ_ITEMS.map((item) => {
            const isOpen = openId === item.id;
            return (
              <div
                key={item.id}
                className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden transition-all"
              >
                <button
                  type="button"
                  onClick={() => toggleItem(item.id)}
                  className="w-full p-6 font-heading font-bold text-sm text-[#111827] flex items-center justify-between text-left hover:text-[#FF2D78] transition-colors focus:outline-none cursor-pointer"
                >
                  <span className="pr-4">{item.question}</span>
                  <span
                    className={`text-[#FF2D78] shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  >
                    <ChevronDown className="w-5 h-5" />
                  </span>
                </button>
                {isOpen && (
                  <div className="px-6 pb-6 pt-1 text-xs text-slate-500 leading-relaxed border-t border-slate-50">
                    {item.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
