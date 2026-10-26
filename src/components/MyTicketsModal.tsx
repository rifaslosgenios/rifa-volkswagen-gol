import React, { useState } from 'react';
import { X, Ticket, QrCode, Download, ShieldCheck, Sparkles, Search } from 'lucide-react';
import jsPDF from 'jspdf';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { PurchasedTicket } from '../types';

interface MyTicketsModalProps {
  tickets: PurchasedTicket[];
  onClose: () => void;
  onOpenPurchaseModal: () => void;
}

const formatPrice = (value: number | string): string => {
  const n = Math.round(Number(value) || 0);
  return '$' + String(n).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
};

export const MyTicketsModal: React.FC<MyTicketsModalProps> = ({
  tickets: initialTickets,
  onClose,
  onOpenPurchaseModal,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchedTickets, setSearchedTickets] = useState<PurchasedTicket[]>(initialTickets);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  // Función para buscar boletos en Firebase por número de orden o celular
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    setHasSearched(true);

    try {
      const ordersRef = collection(db, 'orders');
      // Buscamos por orden o por teléfono
      const q = query(
        ordersRef,
        where('orderNumber', '==', searchQuery.trim().toUpperCase())
      );

      const querySnapshot = await getDocs(q);
      const results: PurchasedTicket[] = [];

      querySnapshot.forEach((docSnap) => {
        const data = docSnap.data();
        results.push({
          id: docSnap.id,
          orderNumber: data.orderNumber,
          packageName: data.packageName,
          numbers: data.numbers,
          totalPrice: data.totalPrice,
          buyerName: data.buyerName,
          buyerEmail: data.buyerEmail,
          buyerPhone: data.buyerPhone,
          buyerDni: data.buyerDni || 'No proporcionado',
          purchaseDate: new Date(data.createdAt).toLocaleDateString('es-ES', {
            day: '2-digit', month: 'long', year: 'numeric',
            hour: '2-digit', minute: '2-digit',
          }),
          notaryProtocol: 'Protocolo Notarial / Verificado',
          qrData: `NOTARY42:${data.orderNumber}:${data.numbers.join(',')}`,
          paymentMethod: data.paymentMethod,
        });
      });

      setSearchedTickets(results);
    } catch (error) {
      console.error("Error buscando boletos:", error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleDownloadPDF = (ticket: PurchasedTicket) => {
    const doc = new jsPDF();

    doc.setFillColor(17, 24, 39);
    doc.rect(0, 0, 210, 35, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.text("RIFA LOS GENIOS", 105, 18, { align: "center" });
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text("COMPROBANTE OFICIAL DE RESERVA", 105, 26, { align: "center" });

    doc.setTextColor(17, 24, 39);
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text(`¡Hola, ${ticket.buyerName}!`, 20, 55);

    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    doc.text("Aquí tienes el resumen oficial de tus números registrados:", 20, 65);

    doc.setFillColor(248, 250, 252);
    doc.rect(20, 75, 170, 50, 'F');

    doc.setFont("helvetica", "bold");
    doc.text("No. Orden:", 25, 85);
    doc.setFont("helvetica", "normal");
    doc.text(ticket.orderNumber, 60, 85);

    doc.setFont("helvetica", "bold");
    doc.text("Paquete:", 25, 95);
    doc.setFont("helvetica", "normal");
    doc.text(ticket.packageName, 60, 95);

    doc.setFont("helvetica", "bold");
    doc.text("Total:", 25, 105);
    doc.setFont("helvetica", "normal");
    doc.text(`$${ticket.totalPrice.toLocaleString('es-ES')}`, 60, 105);

    doc.setFont("helvetica", "bold");
    doc.text("Fecha:", 25, 115);
    doc.setFont("helvetica", "normal");
    doc.text(ticket.purchaseDate, 60, 115);

    doc.setFont("helvetica", "bold");
    doc.text("TUS NÚMEROS BLOQUEADOS:", 20, 140);

    doc.setFont("helvetica", "bold");
    doc.setTextColor(255, 45, 120);
    const numsText = ticket.numbers.map(n => `#${n}`).join('   ');
    const splitNums = doc.splitTextToSize(numsText, 170);
    doc.text(splitNums, 20, 150);

    doc.setTextColor(100, 100, 100);
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.text("Válido como soporte de reserva en la plataforma oficial Rifa Volkswagen Gol 98", 105, 275, { align: "center" });

    doc.save(`Reserva_Genios_${ticket.orderNumber}.pdf`);
  };

  const displayList = hasSearched ? searchedTickets : initialTickets;

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
                Consultar mis boletos
              </h3>
              <p className="text-xs text-slate-400">
                Busca tus números con tu número de orden
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

        {/* Search Bar Section */}
        <div className="p-4 bg-slate-50 border-b border-slate-200">
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Ej: ORD-849201"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white border-2 border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:outline-none focus:border-[#FF2D78]"
              />
            </div>
            <button
              type="submit"
              disabled={isSearching}
              className="bg-[#111827] hover:bg-slate-800 text-white px-5 py-3 rounded-xl text-sm font-bold uppercase tracking-wider transition-colors cursor-pointer disabled:opacity-50"
            >
              {isSearching ? 'Buscando...' : 'Buscar'}
            </button>
          </form>
          {hasSearched && (
            <div className="flex justify-between items-center mt-2 px-1">
              <span className="text-xs text-slate-500">
                Resultados encontrados: {displayList.length}
              </span>
              <button
                type="button"
                onClick={() => {
                  setHasSearched(false);
                  setSearchQuery('');
                  setSearchedTickets(initialTickets);
                }}
                className="text-xs text-[#FF2D78] font-bold hover:underline"
              >
                Ver mis boletos locales
              </button>
            </div>
          )}
        </div>

        {/* Content List */}
        <div className="p-6 max-h-[60vh] overflow-y-auto space-y-6">
          {displayList.length === 0 ? (
            <div className="py-10 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-pink-50 text-[#FF2D78] flex items-center justify-center mx-auto">
                <Ticket className="w-8 h-8" />
              </div>
              <h4 className="font-heading font-bold text-lg text-[#111827]">
                No encontramos registros
              </h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Verifica que el número de orden esté bien escrito o adquiere tu paquete para participar.
              </p>
              <div>
                <button
                  onClick={() => {
                    onClose();
                    onOpenPurchaseModal();
                  }}
                  className="inline-flex items-center gap-2 bg-[#FF2D78] hover:bg-[#E01A63] text-white text-xs font-bold uppercase tracking-wider px-6 py-3 rounded-full cursor-pointer shadow-md"
                >
                  <Sparkles className="w-4 h-4" />
                  Elegir números ahora
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {displayList.map((t) => (
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
                      Registrado
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
                      onClick={() => handleDownloadPDF(t)}
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