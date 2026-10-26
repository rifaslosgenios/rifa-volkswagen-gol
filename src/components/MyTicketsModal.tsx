import React from 'react';
import { X, Ticket, QrCode, Download, ShieldCheck, Sparkles } from 'lucide-react';
import { PurchasedTicket } from '../types';

interface MyTicketsModalProps {
  tickets: PurchasedTicket[];
  onClose: () => void;
  onOpenPurchaseModal: () => void;
}

// Formatea 25000 -> $25.000
const formatPrice = (value: number | string): string => {
  const n = Math.round(Number(value) || 0);
  return '$' + String(n).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
};

export const MyTicketsModal: React.FC<MyTicketsModalProps> = ({
  tickets,
  onClose,
  onOpenPurchaseModal,
}) => {
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative bg-white rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden border border-slate-100 my-8">
        {/* Header */}
        <div className="bg-[#111827] text-white p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#FF2D78] flex items-center justify-center text-white">
              <Ticket className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-heading font-black text-lg text-white">
                Mis boletos registrados
              </h3>
              <p className="text-xs text-slate-400">
                {tickets.length > 0
                  ? `${tickets.length} pedido(s) registrado(s)`
                  : 'Aún no tienes números registrados'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[75vh] overflow-y-auto space-y-6">
          {tickets.length === 0 ? (
            <div className="py-12 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-pink-50 text-[#FF2D78] flex items-center justify-center mx-auto">
                <Ticket className="w-8 h-8" />
              </div>
              <h4 className="font-heading font-bold text-lg text-[#111827]">
                No tienes números todavía
              </h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Participa ahora por el Volkswagen Gol 98 y tus números aparecerán aquí de forma inmediata.
              </p>
              <div>
                <button
                  onClick={() => {
                    onClose();
                    onOpenPurchaseModal();
                  }}
                  className="inline-flex items-center gap-2 bg-[#FF2D78] hover:bg-[#E01A63] text-white text-xs font-bold uppercase tracking-wider px-6 py-3 rounded-full shadow-glow-button cursor-pointer"
                >
                  <Sparkles className="w-4 h-4" />
                  Elegir números ahora
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {tickets.map((t) => (
                <div
                  key={t.id}
                  className="bg-slate-50 border border-slate-200 rounded-3xl p-5 relative overflow-hidden shadow-sm"
                >
                  <div className="flex flex-wrap items-center justify-between border-b border-slate-200 pb-3 mb-3 gap-2">
                    <div>
                      <span className="font-heading font-black text-sm text-[#111827]">
                        {t.packageName}
                      </span>
                      <span className="text-[11px] text-slate-400 block">
                        Pedido {t.orderNumber} • {t.purchaseDate}
                      </span>
                    </div>
                    <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      Participación registrada
                    </span>
                  </div>

                  <div className="mb-4">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-2">
                      Números asignados:
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {t.numbers.map((num) => (
                        <span
                          key={num}
                          className="px-3 py-1 bg-[#FF2D78] text-white font-heading font-black text-sm rounded-xl shadow-xs"
                        >
                          #{num}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-200">
                    <div className="flex items-center gap-2">
                      <QrCode className="w-4 h-4 text-slate-700" />
                      <span className="text-[11px]">Titular: {t.buyerName} ({formatPrice(t.totalPrice)})</span>
                    </div>

                    <button
                      onClick={() => {
                        alert(`Descargando comprobante para el pedido ${t.orderNumber}...`);
                      }}
                      className="inline-flex items-center gap-1 text-[11px] font-bold text-[#FF2D78] hover:underline cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                      Descargar PDF
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};