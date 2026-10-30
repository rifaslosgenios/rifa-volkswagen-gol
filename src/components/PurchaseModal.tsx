import React, { useState, useEffect } from 'react';
import {
  X,
  CheckCircle2,
  Sparkles,
  Download,
  ArrowRight,
  Upload,
  AlertCircle,
  Scissors,
  Snowflake,
  Maximize2
} from 'lucide-react';
import jsPDF from 'jspdf';
import { NOTARY_INFO, TICKET_PACKAGES } from '../data/mockData';
import { TicketPackage, PurchasedTicket } from '../types';

// Importaciones para que Vite cargue las imágenes también en Vercel
import santaImg from '../assets/santa.jpg';
import vwLogo from '../assets/vw-logo.webp';

// Códigos QR guardados en la carpeta assets
import qrNequi1 from '../assets/qr-nequi-1.jpeg';
import qrNequi2 from '../assets/qr-nequi-2.jpeg';
import qrBancolombia from '../assets/qr-bancolombia.jpeg';
import qrDaviplata from '../assets/qr-daviplata.png';

// Logos de los bancos guardados en la carpeta assets
import logoNequi from '../assets/logo-nequi.jpeg';
import logoBancolombia from '../assets/logo-bancolombia.jpeg';
import logoDaviplata from '../assets/logo-daviplata.png';

import { db } from '../firebaseConfig';
import { doc, getDoc, setDoc, collection } from 'firebase/firestore';

interface PurchaseModalProps {
  initialPackage?: any;
  selection?: any;
  onClose: () => void;
  onPurchaseComplete: (ticket: PurchasedTicket) => void;
}

/* ───────── DATOS DEL TIQUETE ───────── */
const DRAW_DATE = '27 de marzo del 2027';
const LOTTERY = 'Lotería de Boyacá';

/* ───────── TIPOGRAFÍAS NAVIDEÑAS ───────── */
const FONTS_URL =
  'https://fonts.googleapis.com/css2?family=Fredoka:wght@400;500;600;700&family=Mountains+of+Christmas:wght@700&family=Pacifico&display=swap';
const fontScript: React.CSSProperties = { fontFamily: "'Pacifico', 'Brush Script MT', cursive" };
const fontDisplay: React.CSSProperties = { fontFamily: "'Mountains of Christmas', 'Fredoka', cursive" };
const fontBody: React.CSSProperties = {
  fontFamily: "'Fredoka', ui-rounded, 'Nunito', system-ui, -apple-system, sans-serif",
};

const formatPrice = (value: number | string): string => {
  const n = Math.round(Number(value) || 0);
  return '$' + String(n).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
};

const compressImage = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 800;
        const MAX_HEIGHT = 800;
        let width = img.width;
        let height = img.height;

        if (width > height && width > MAX_WIDTH) {
          height *= MAX_WIDTH / width;
          width = MAX_WIDTH;
        } else if (height > MAX_HEIGHT) {
          width *= MAX_HEIGHT / height;
          height = MAX_HEIGHT;
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', 0.7));
      };
    };
    reader.onerror = (error) => reject(error);
  });
};

type PaymentMethodType = 'nequi' | 'daviplata' | 'bancolombia';

const PAYMENT_OPTIONS: {
  id: PaymentMethodType;
  name: string;
  logo: string;
}[] = [
    { id: 'nequi', name: 'Nequi', logo: logoNequi },
    { id: 'bancolombia', name: 'Bancolombia', logo: logoBancolombia },
    { id: 'daviplata', name: 'Daviplata', logo: logoDaviplata },
  ];

const BARS = [2, 1, 3, 1, 1, 2, 3, 1, 2, 1, 1, 3, 2, 1, 2, 3, 1, 1, 2, 1, 3, 1, 2, 2, 1, 3, 1, 1, 2, 3, 1, 2];

const Holly: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 48 36" className={className} aria-hidden="true">
    <path d="M24 20C20 11 12 8 3 11c3 9 11 13 21 9z" fill="#0B5D3B" stroke="#FFF8EC" strokeWidth="1.2" />
    <path d="M24 20c4-9 12-12 21-9-3 9-11 13-21 9z" fill="#146B3A" stroke="#FFF8EC" strokeWidth="1.2" />
    <circle cx="19.5" cy="23" r="4.2" fill="#E11D2E" stroke="#FFF8EC" strokeWidth="1" />
    <circle cx="28.5" cy="23" r="4.2" fill="#E11D2E" stroke="#FFF8EC" strokeWidth="1" />
    <circle cx="24" cy="28.5" r="4.2" fill="#C8102E" stroke="#FFF8EC" strokeWidth="1" />
  </svg>
);

const TicketItem: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
  <div className="min-w-0">
    <span className="block text-[11px] font-semibold uppercase tracking-[0.08em] text-[#0B5D3B]">{label}</span>
    <span className="block text-[15px] sm:text-base font-semibold text-[#1D2B22] leading-snug break-words">{children}</span>
  </div>
);

const CutLine: React.FC = () => {
  const notch = 'absolute z-20 w-6 h-6 rounded-full bg-slate-50 border border-[#E2CF9E]';
  return (
    <div
      aria-hidden
      className="relative z-10 shrink-0 h-0 md:h-auto md:w-0 border-t-2 md:border-t-0 md:border-l-2 border-dashed border-[#0B5D3B]/40"
    >
      <span className={`${notch} md:hidden -left-3 -top-3`} />
      <span className={`${notch} md:hidden -right-3 -top-3`} />
      <span className={`${notch} hidden md:block -left-3 -top-3`} />
      <span className={`${notch} hidden md:block -left-3 -bottom-3`} />
      <span className="absolute z-20 flex items-center gap-1 bg-[#FFF8EC] px-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#0B5D3B]/70 whitespace-nowrap left-1/2 -translate-x-1/2 -top-[8px] md:top-1/2 md:left-0 md:-translate-y-1/2 md:px-0 md:py-2 md:[writing-mode:vertical-rl]">
        <Scissors className="w-3 h-3 md:rotate-90" />
        Cortar aquí
      </span>
    </div>
  );
};

const getNumberSizeClasses = (total: number) => {
  if (total <= 2) return 'text-2xl px-3 py-1.5';
  if (total <= 5) return 'text-xl px-2.5 py-1.5';
  if (total <= 10) return 'text-lg px-2.5 py-1';
  if (total <= 20) return 'text-base px-2 py-1';
  return 'text-sm px-1.5 py-0.5';
};

export const PurchaseModal: React.FC<PurchaseModalProps> = ({
  initialPackage,
  selection,
  onClose,
  onPurchaseComplete,
}) => {
  let incomingData = selection || initialPackage;

  if (!incomingData || !incomingData.numbers) {
    const stored = sessionStorage.getItem('ticketPayload');
    if (stored) {
      try {
        incomingData = JSON.parse(stored);
      } catch (e) { }
    }
  }

  const handleCloseModal = () => {
    sessionStorage.removeItem('ticketPayload');
    onClose();
  };

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodType>('nequi');
  const [paymentProof, setPaymentProof] = useState<string | null>(null);
  const [proofFileName, setProofFileName] = useState('');
  const [proofError, setProofError] = useState(false);

  const [expandedQR, setExpandedQR] = useState<string | null>(null);

  useEffect(() => {
    if (expandedQR) {
      window.history.pushState({ qrOpen: true }, '');
      const handlePopState = () => {
        setExpandedQR(null);
      };
      window.addEventListener('popstate', handlePopState);
      return () => {
        window.removeEventListener('popstate', handlePopState);
      };
    }
  }, [expandedQR]);

  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState('');
  const [completedTicket, setCompletedTicket] = useState<PurchasedTicket | null>(null);

  useEffect(() => {
    const id = 'navidad-ticket-fonts';
    if (document.getElementById(id)) return;
    const link = document.createElement('link');
    link.id = id;
    link.rel = 'stylesheet';
    link.href = FONTS_URL;
    document.head.appendChild(link);
  }, []);

  if (!incomingData) return null;

  const isFullSelection = incomingData && incomingData.numbers && incomingData.buyer && incomingData.pkg;
  const pkg: TicketPackage = isFullSelection ? incomingData.pkg : (incomingData.id ? incomingData : TICKET_PACKAGES[0]);
  const numbers: string[] = isFullSelection ? incomingData.numbers : [];
  const buyer = isFullSelection ? incomingData.buyer : { name: '', email: '', phone: '' };

  if (numbers.length === 0 || !buyer.name) {
    return (
      <div className="fixed inset-0 z-[9999] bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-sm text-center shadow-2xl relative overflow-hidden animate-in zoom-in-95 duration-200">
          <div className="w-16 h-16 bg-[#F2B33D]/20 text-[#0B5D3B] rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8" />
          </div>
          <h3 className="font-heading font-black text-2xl text-[#1D2B22] mb-2">¡Falta poco!</h3>
          <p className="text-slate-600 text-sm mb-6">
            Para proceder al pago, primero debes elegir tus números y colocar tus datos en el boleto de la pantalla principal.
          </p>
          <button
            onClick={() => {
              handleCloseModal();
              document.getElementById('seccion-datos')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="bg-[#0B5D3B] hover:bg-[#094A2F] text-[#FFF8EC] px-6 py-3.5 rounded-xl font-bold uppercase tracking-wide w-full transition-colors shadow-md cursor-pointer"
          >
            Ir a elegir números
          </button>
          <button onClick={handleCloseModal} className="mt-4 text-slate-400 hover:text-slate-600 text-sm font-semibold underline cursor-pointer">
            Cerrar esta ventana
          </button>
        </div>
      </div>
    );
  }

  const currentOption = PAYMENT_OPTIONS.find(p => p.id === paymentMethod);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProofFileName(file.name);
      setProofError(false);
      try {
        const compressedBase64 = await compressImage(file);
        setPaymentProof(compressedBase64);
      } catch (error) {
        console.error("Error comprimiendo imagen", error);
        alert("Hubo un error procesando la imagen. Intenta con otra.");
      }
    }
  };

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!paymentProof) {
      setProofError(true);
      const uploadZone = document.getElementById('zona-comprobante');
      if (uploadZone) {
        uploadZone.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    setProofError(false);
    setIsProcessing(true);
    setProcessingStep('Verificando disponibilidad...');

    try {
      const now = Date.now();

      for (const num of numbers) {
        const ticketRef = doc(db, "tickets", num);
        const docSnap = await getDoc(ticketRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          if (data.status === 'sold' || (data.status === 'reserved' && data.expiresAt > now)) {
            alert(`Lo sentimos, el número #${num} acaba de ser tomado por alguien más. Por favor, cierra esta ventana y elige otro número.`);
            setIsProcessing(false);
            return;
          }
        }
      }

      setProcessingStep('Asegurando tus números...');

      const orderNum = `ORD-${Math.floor(100000 + Math.random() * 900000)}`;
      const orderRef = doc(collection(db, "orders"));

      await setDoc(orderRef, {
        orderNumber: orderNum,
        buyerName: buyer.name,
        buyerEmail: buyer.email,
        buyerPhone: buyer.phone,
        packageName: pkg.name,
        totalAmount: pkg.price,
        numbers: numbers,
        status: 'pending',
        paymentMethod: currentOption?.name || 'Manual',
        receiptImageBase64: paymentProof || null,
        createdAt: now
      });

      for (const num of numbers) {
        const ticketRef = doc(db, "tickets", num);
        await setDoc(ticketRef, {
          status: 'reserved',
          orderId: orderRef.id,
          updatedAt: now
        }, { merge: true });
      }

      setProcessingStep('Generando comprobante oficial...');

      setTimeout(() => {
        const ticket: PurchasedTicket = {
          id: orderRef.id,
          orderNumber: orderNum,
          packageName: pkg.name,
          numbers: numbers,
          totalPrice: pkg.price,
          buyerName: buyer.name,
          buyerEmail: buyer.email,
          buyerPhone: buyer.phone,
          buyerDni: 'No proporcionado',
          purchaseDate: new Date().toLocaleDateString('es-ES', {
            day: '2-digit', month: 'long', year: 'numeric',
            hour: '2-digit', minute: '2-digit',
          }),
          notaryProtocol: `${NOTARY_INFO.protocol} / Acta #${Math.floor(1000 + Math.random() * 9000)}`,
          qrData: `NOTARY42:${orderNum}:${numbers.join(',')}`,
          paymentMethod: currentOption?.name || 'Manual',
        };

        setCompletedTicket(ticket);
        setIsProcessing(false);
        onPurchaseComplete(ticket);
      }, 1000);

    } catch (error) {
      console.error("Error al registrar en Firebase:", error);
      alert("Hubo un error de conexión al guardar tu compra. Por favor intenta de nuevo.");
      setIsProcessing(false);
    }
  };

  const handleDownloadPDF = () => {
    if (!completedTicket) return;

    try {
      const doc = new jsPDF();

      // Franja superior verde institucional
      doc.setFillColor(11, 93, 59);
      doc.rect(0, 0, 210, 40, 'F');

      // Título principal
      doc.setTextColor(255, 255, 255);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(24);
      doc.text("RIFA LOS GENIOS", 105, 18, { align: "center" });

      doc.setFontSize(11);
      doc.setFont("helvetica", "normal");
      doc.text("SORTEO DE REYES - VOLKSWAGEN GOL MODELO 98", 105, 28, { align: "center" });

      // Saludo al comprador
      doc.setTextColor(17, 24, 39);
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text(`¡Hola, ${completedTicket.buyerName}!`, 20, 55);

      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.text('Tus números han sido registrados y asegurados exitosamente:', 20, 63);

      // Caja de detalles de la orden
      doc.setFillColor(248, 250, 252);
      doc.setDrawColor(226, 207, 158);
      doc.roundedRect(20, 70, 170, 55, 3, 3, 'FD');

      doc.setFont("helvetica", "bold");
      doc.text("No. Orden:", 25, 82);
      doc.setFont("helvetica", "normal");
      doc.text(completedTicket.orderNumber, 65, 82);

      doc.setFont("helvetica", "bold");
      doc.text("Celular:", 25, 92);
      doc.setFont("helvetica", "normal");
      doc.text(completedTicket.buyerPhone, 65, 92);

      doc.setFont("helvetica", "bold");
      doc.text("Medio de Pago:", 25, 102);
      doc.setFont("helvetica", "normal");
      doc.text(completedTicket.paymentMethod, 65, 102);

      doc.setFont("helvetica", "bold");
      doc.text("Total Cancelado:", 25, 112);
      doc.setFont("helvetica", "normal");
      doc.text(`$${completedTicket.totalPrice.toLocaleString('es-ES')}`, 65, 112);

      doc.setFont("helvetica", "bold");
      doc.text("Fecha de Compra:", 25, 122);
      doc.setFont("helvetica", "normal");
      doc.text(completedTicket.purchaseDate, 65, 122);

      // Sección de números de la suerte
      doc.setFillColor(11, 93, 59);
      doc.roundedRect(20, 135, 170, 35, 3, 3, 'F');

      doc.setTextColor(255, 248, 236);
      doc.setFontSize(11);
      doc.setFont("helvetica", "bold");
      doc.text("TUS NÚMEROS OFICIALES DE LA SUERTE:", 105, 145, { align: "center" });

      doc.setFontSize(18);
      doc.setTextColor(242, 179, 61);
      const numsText = completedTicket.numbers.map(n => `#${n}`).join('    ');
      doc.text(numsText, 105, 160, { align: "center" });

      // Pie de página legal y notarial
      doc.setTextColor(100, 100, 100);
      doc.setFontSize(9);
      doc.setFont("helvetica", "normal");
      doc.text("Juega con la Lotería de Boyacá | Sorteo: 27 de marzo del 2027", 105, 255, { align: "center" });
      doc.text(`Certificado Notarial / Protocolo: ${completedTicket.notaryProtocol}`, 105, 263, { align: "center" });

      doc.save(`Tiquete_Genios_${completedTicket.orderNumber}.pdf`);

    } catch (error) {
      console.error("Error generando PDF:", error);
      alert("Hubo un error al generar el PDF. Intenta de nuevo.");
    }
  };

  const isFormView = !completedTicket && !isProcessing;

  return (
    <>
      {expandedQR && (
        <div className="fixed inset-0 z-[10000] bg-black/90 backdrop-blur-sm flex flex-col items-center justify-center p-4 transition-all" onClick={() => setExpandedQR(null)}>
          <button
            onClick={() => setExpandedQR(null)}
            className="absolute top-6 right-6 w-12 h-12 bg-black/80 hover:bg-black rounded-full flex items-center justify-center text-white border-2 border-white shadow-2xl transition-all cursor-pointer z-50"
            title="Cerrar QR"
          >
            <X className="w-7 h-7 stroke-[3]" />
          </button>
          <p className="text-white text-xl font-bold uppercase tracking-widest mb-6 animate-pulse text-center">
            Escanea para pagar
          </p>
          <img src={expandedQR} alt="QR Ampliado" className="w-full max-w-[400px] h-auto rounded-2xl shadow-2xl border-4 border-white object-contain bg-white p-2" onClick={(e) => e.stopPropagation()} />
          <p className="text-white/70 text-sm mt-6 font-semibold">Toca cualquier parte o presiona atrás para cerrar</p>
        </div>
      )}

      <div className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6">
        <div className={`relative bg-white rounded-3xl w-full ${isFormView ? 'max-w-4xl' : 'max-w-xl'} max-h-[92vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200`}>

          <div className="shrink-0 bg-[#1D2B22] text-[#FFF8EC] px-6 py-4 flex items-center justify-between border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#C8102E] flex items-center justify-center shrink-0 shadow-md">
                <Sparkles className="w-5 h-5 fill-current text-white" />
              </div>
              <div>
                <h3 className="font-heading font-black text-xl leading-none tracking-tight">Finaliza tu compra</h3>
                <p className="text-xs text-white/70 mt-1">Sorteo de Reyes - Volkswagen Gol Modelo 98</p>
              </div>
            </div>
            <button onClick={handleCloseModal} aria-label="Cerrar" className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors cursor-pointer">
              <X className="w-5 h-5" />
            </button>
          </div>

          {completedTicket ? (
            <div className="flex-1 overflow-y-auto p-6 sm:p-8">
              <div className="text-center space-y-6">
                <div className="w-20 h-20 bg-[#0B5D3B]/10 text-[#0B5D3B] rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-12 h-12" />
                </div>
                <div>
                  <span className="text-xs font-black uppercase tracking-widest text-[#0B5D3B]">¡Compra Confirmada!</span>
                  <h4 className="font-heading font-black text-2xl text-[#1D2B22] mt-2">¡Mucha suerte, {completedTicket.buyerName.split(' ')[0]}!</h4>
                  <p className="text-sm text-slate-500 mt-2 max-w-sm mx-auto">
                    Hemos bloqueado tus números exitosamente y validaremos tu comprobante a la brevedad.
                  </p>
                </div>

                <div className="bg-[#FFF8EC] border-2 border-dashed border-[#F2B33D] rounded-2xl p-5 text-left relative">
                  <div className="mb-3">
                    <span className="text-[11px] font-bold text-[#C8102E] uppercase tracking-wider block mb-1">Tus números oficiales:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {completedTicket.numbers.map((num) => (
                        <span key={num} className="px-2.5 py-1 bg-[#1D2B22] text-[#F2B33D] font-black text-sm rounded shadow-sm">#{num}</span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <button onClick={handleDownloadPDF} className="inline-flex justify-center items-center gap-2 bg-[#C8102E] hover:bg-[#9E0B22] text-white text-sm font-bold px-6 py-3.5 rounded-full transition-all cursor-pointer shadow-md">
                    <Download className="w-4 h-4" /> Descargar Tiquete
                  </button>
                  <button onClick={handleCloseModal} className="inline-flex justify-center items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-bold px-6 py-3.5 rounded-full transition-all cursor-pointer">
                    Volver al inicio
                  </button>
                </div>
              </div>
            </div>
          ) : isProcessing ? (
            <div className="flex-1 overflow-y-auto p-12 flex flex-col items-center justify-center space-y-5">
              <div className="relative w-24 h-24">
                <div className="absolute inset-0 rounded-full border-4 border-slate-100"></div>
                <div className="absolute inset-0 rounded-full border-4 border-[#0B5D3B] border-t-transparent animate-spin"></div>
                <Sparkles className="absolute inset-0 m-auto w-8 h-8 text-[#F2B33D] animate-pulse" />
              </div>
              <div className="text-center">
                <h4 className="font-heading font-black text-xl text-[#1D2B22]">Procesando compra...</h4>
                <p className="text-sm text-slate-500 font-medium mt-1">{processingStep}</p>
              </div>
            </div>
          ) : (
            <form onSubmit={handlePayment} className="flex flex-col flex-1 min-h-0">
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-50 space-y-6">

                <div
                  className="relative bg-[#FFF8EC] rounded-2xl border border-[#E2CF9E] shadow-[0_14px_34px_rgba(11,61,42,0.2)] overflow-clip"
                  style={fontBody}
                >
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{ backgroundImage: 'radial-gradient(#0B5D3B 1px, transparent 1px)', backgroundSize: '14px 14px', opacity: 0.06 }}
                  />

                  <div className="relative z-10 overflow-hidden bg-gradient-to-b from-[#C8102E] to-[#9E0B22] px-3 py-2 sm:py-3 text-center">
                    <div
                      className="absolute inset-0 pointer-events-none"
                      style={{ backgroundImage: 'radial-gradient(#ffffff 1.4px, transparent 1.4px)', backgroundSize: '22px 22px', opacity: 0.22 }}
                    />
                    <Holly className="absolute left-1 top-1/2 -translate-y-1/2 w-8 sm:w-11" />
                    <Holly className="absolute right-1 top-1/2 -translate-y-1/2 w-8 sm:w-11 -scale-x-100" />
                    <Snowflake className="hidden sm:block absolute left-14 top-2 w-4 h-4 text-white/70" />
                    <Snowflake className="hidden sm:block absolute right-14 bottom-2 w-4 h-4 text-white/70" />
                    <h4
                      style={fontScript}
                      className="relative text-[28px] sm:text-[38px] leading-[1.3] text-[#FFE9A8] drop-shadow-[0_2px_0_rgba(0,0,0,0.28)]"
                    >
                      Sorteo de Reyes
                    </h4>
                  </div>
                  <div className="relative z-10 h-1.5 bg-gradient-to-r from-[#F2B33D] via-[#FFE08A] to-[#F2B33D]" />

                  <div className="relative z-10 flex flex-col md:flex-row md:items-stretch">
                    <div className="flex-1 min-w-0 p-4 sm:p-5 flex flex-col gap-3">
                      <div className="grid grid-cols-[38%_1fr] sm:grid-cols-[170px_1fr] gap-3 sm:gap-5 items-center">
                        <div className="-rotate-2">
                          <div className="relative aspect-square rounded-md overflow-hidden border-[3px] border-white shadow-md bg-[#C8102E]">
                            <img
                              src={santaImg}
                              alt="Papá Noel"
                              className="absolute inset-0 w-full h-full object-cover"
                              style={{ objectPosition: '50% 30%' }}
                            />
                          </div>
                        </div>
                        <div className="space-y-2 min-w-0">
                          <TicketItem label="Comprador">{buyer.name}</TicketItem>
                          <TicketItem label="Celular">{buyer.phone}</TicketItem>
                          <TicketItem label="Fecha del sorteo">{DRAW_DATE}</TicketItem>
                          <TicketItem label="Juega con la">{LOTTERY}</TicketItem>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center justify-between gap-2 border-t-2 border-dashed border-[#0B5D3B]/30 pt-3">
                        <span className="inline-flex items-center gap-1.5 bg-[#F2B33D] text-[#3A2A00] text-[12px] sm:text-[13px] font-bold px-3 py-1 rounded-full shrink-0">
                          Premio: Un Volkswagen Gol Modelo 98
                          <img src={vwLogo} alt="" className="w-4 h-4 object-contain" />
                        </span>
                        <span className="border-2 border-[#0B5D3B]/60 text-[#0B5D3B] text-[12px] sm:text-[13px] font-semibold px-3 py-0.5 rounded-full shrink-0">
                          {numbers.length} {numbers.length === 1 ? 'número' : 'números'}
                        </span>
                      </div>
                    </div>

                    <CutLine />

                    <div className="w-full md:w-[38%] md:min-w-[240px] bg-white/55 p-4 sm:p-5 flex flex-col">
                      <div className="flex items-end justify-between border-b-[3px] border-[#0B5D3B] pb-2 mb-3">
                        <h5 style={fontDisplay} className="text-[22px] leading-[1.1] text-[#0B5D3B] max-w-[150px]">
                          Estos números te darán la suerte
                        </h5>
                        <div className="text-right">
                          <span className="block text-[18px] font-black text-[#C8102E] uppercase tracking-wider leading-none mt-0.5 animate-pulse">
                            ¡Suerte<br />Ganador!
                          </span>
                        </div>
                      </div>

                      <span className="block text-[11px] font-semibold uppercase tracking-[0.08em] text-[#0B5D3B] mb-1.5">
                        Tus números
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {numbers.map((n) => (
                          <span
                            key={n}
                            className={`bg-[#0B5D3B] text-[#FFE08A] font-bold rounded-md shadow-sm ${getNumberSizeClasses(numbers.length)}`}
                          >
                            {n}
                          </span>
                        ))}
                      </div>

                      <div className="mt-auto pt-4 grid grid-cols-[1fr_auto] items-end gap-3">
                        <div>
                          <span className="block text-[11px] font-semibold uppercase tracking-[0.08em] text-[#0B5D3B]">Total a pagar</span>
                          <span className="block text-[30px] font-bold text-[#1D2B22] leading-none mt-0.5">
                            {formatPrice(pkg.price)}
                          </span>
                        </div>
                        <div className="flex items-stretch h-9 gap-[2px] opacity-80" aria-hidden>
                          {BARS.map((w, i) => (
                            <span key={i} className="bg-[#1D2B22]" style={{ width: w }} />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-heading font-black text-base text-[#1D2B22] mb-1">Elige tu medio de pago</h4>
                  <p className="text-xs text-slate-500 mb-3">Selecciona el banco de tu preferencia para la transferencia.</p>

                  <div className="grid grid-cols-3 gap-3">
                    {PAYMENT_OPTIONS.map((option) => {
                      const isSelected = paymentMethod === option.id;
                      return (
                        <button
                          key={option.id}
                          type="button"
                          onClick={() => {
                            setPaymentMethod(option.id);
                            setProofError(false);
                            setTimeout(() => {
                              document.getElementById('zona-comprobante')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                            }, 150);
                          }}
                          className={`relative flex items-center justify-center p-3 sm:p-4 h-20 sm:h-24 rounded-2xl border-2 transition-all cursor-pointer bg-white ${isSelected
                            ? 'border-[#0B5D3B] ring-2 ring-[#0B5D3B]/20 shadow-md transform scale-[1.02]'
                            : 'border-slate-200 hover:border-[#0B5D3B]/40 hover:shadow-xs'
                            }`}
                        >
                          {isSelected && <div className="absolute top-2.5 right-2.5 w-2.5 h-2.5 rounded-full bg-[#0B5D3B] shadow-sm" />}
                          <img src={option.logo} alt={option.name} className="w-full h-full object-contain" />
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
                  <div className="space-y-4" id="zona-comprobante">
                    <div className="bg-slate-50 p-4 sm:p-6 rounded-xl border border-slate-100">
                      <p className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">Datos para transferencia a {currentOption?.name}:</p>

                      <div className="flex flex-col items-center justify-center my-6">
                        <div className="flex flex-col items-center gap-1 mb-4 animate-bounce">
                          <span className="text-sm font-black text-[#C8102E] uppercase tracking-widest px-4 py-1.5 bg-[#C8102E]/10 rounded-full">
                            ¡Escanea aquí para pagar!
                          </span>
                          <ArrowRight className="w-5 h-5 text-[#C8102E] rotate-90" />
                        </div>

                        <div className="flex flex-row items-center justify-center gap-4 sm:gap-6 w-full max-w-[400px]">
                          {paymentMethod === 'nequi' && (
                            <>
                              <div onClick={() => setExpandedQR(qrNequi1)} className="group relative cursor-pointer active:scale-95 transition-transform" title="Ampliar código QR">
                                <img src={qrNequi1} alt="QR Nequi Principal" className="w-32 h-32 sm:w-40 sm:h-40 object-contain rounded-2xl border-2 border-slate-200 shadow-md bg-white p-2 transition-transform transform group-hover:scale-105" />
                                <div className="absolute bottom-1 right-1 sm:bottom-2 sm:right-2 bg-[#0B5D3B] p-2 rounded-full shadow-lg animate-pulse z-10">
                                  <Maximize2 className="w-4 h-4 text-white" />
                                </div>
                                <div className="absolute inset-0 bg-black/40 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-xs">
                                  <span className="text-white font-bold text-sm bg-black/50 px-3 py-1 rounded-full">Ver grande</span>
                                </div>
                              </div>

                              <div onClick={() => setExpandedQR(qrNequi2)} className="group relative cursor-pointer active:scale-95 transition-transform" title="Ampliar código QR">
                                <img src={qrNequi2} alt="QR Nequi Secundario" className="w-32 h-32 sm:w-40 sm:h-40 object-contain rounded-2xl border-2 border-slate-200 shadow-md bg-white p-2 transition-transform transform group-hover:scale-105" />
                                <div className="absolute bottom-1 right-1 sm:bottom-2 sm:right-2 bg-[#0B5D3B] p-2 rounded-full shadow-lg animate-pulse z-10">
                                  <Maximize2 className="w-4 h-4 text-white" />
                                </div>
                                <div className="absolute inset-0 bg-black/40 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-xs">
                                  <span className="text-white font-bold text-sm bg-black/50 px-3 py-1 rounded-full">Ver grande</span>
                                </div>
                              </div>
                            </>
                          )}

                          {paymentMethod === 'bancolombia' && (
                            <div onClick={() => setExpandedQR(qrBancolombia)} className="group relative cursor-pointer active:scale-95 transition-transform" title="Ampliar código QR">
                              <img src={qrBancolombia} alt="QR Bancolombia" className="w-40 h-40 sm:w-48 sm:h-48 object-contain rounded-2xl border-2 border-slate-200 shadow-md bg-white p-2 transition-transform transform group-hover:scale-105" />
                              <div className="absolute bottom-1 right-1 sm:bottom-2 sm:right-2 bg-[#0B5D3B] p-2 rounded-full shadow-lg animate-pulse z-10">
                                <Maximize2 className="w-4 h-4 text-white" />
                              </div>
                              <div className="absolute inset-0 bg-black/40 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-xs">
                                <span className="text-white font-bold text-sm bg-black/50 px-3 py-1 rounded-full">Ver grande</span>
                              </div>
                            </div>
                          )}

                          {paymentMethod === 'daviplata' && (
                            <div onClick={() => setExpandedQR(qrDaviplata)} className="group relative cursor-pointer active:scale-95 transition-transform" title="Ampliar código QR">
                              <img src={qrDaviplata} alt="QR Daviplata" className="w-40 h-40 sm:w-48 sm:h-48 object-contain rounded-2xl border-2 border-slate-200 shadow-md bg-white p-2 transition-transform transform group-hover:scale-105" />
                              <div className="absolute bottom-1 right-1 sm:bottom-2 sm:right-2 bg-[#0B5D3B] p-2 rounded-full shadow-lg animate-pulse z-10">
                                <Maximize2 className="w-4 h-4 text-white" />
                              </div>
                              <div className="absolute inset-0 bg-black/40 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-xs">
                                <span className="text-white font-bold text-sm bg-black/50 px-3 py-1 rounded-full">Ver grande</span>
                              </div>
                            </div>
                          )}
                        </div>
                        <p className="text-slate-400 text-[10px] font-bold mt-4 uppercase">Toca cualquier código para ampliarlo</p>
                      </div>

                      <ul className="text-sm space-y-1 text-slate-600">
                        <li><span className="font-semibold text-slate-900">Tipo de cuenta:</span> Ahorros / Llave Bre-B</li>
                        {paymentMethod === 'bancolombia' ? (
                          <li><span className="font-semibold text-slate-900">Número:</span> @narcy419</li>
                        ) : paymentMethod === 'daviplata' ? (
                          <li><span className="font-semibold text-slate-900">Número:</span> @PLATA3163769990</li>
                        ) : null}
                        <li><span className="font-semibold text-slate-900">Titular:</span> Narcy Manosalva</li>
                      </ul>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                        Sube la captura de tu transferencia <span className="text-[#C8102E]">*</span>
                      </label>
                      <div className={`relative border-2 border-dashed rounded-xl p-4 text-center transition-colors ${proofError ? 'border-[#C8102E] bg-[#C8102E]/5 animate-pulse' : 'border-slate-300 hover:bg-slate-50'}`}>
                        <input
                          type="file"
                          accept="image/*,application/pdf"
                          onChange={handleFileChange}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                        <div className="flex flex-col items-center gap-1.5 pointer-events-none">
                          <Upload className={`w-6 h-6 ${proofError ? 'text-[#C8102E]' : 'text-[#0B5D3B]'}`} />
                          <span className={`text-xs font-bold ${proofError ? 'text-[#C8102E]' : 'text-slate-700'}`}>
                            {proofFileName ? <span className="text-[#0B5D3B]">✓ {proofFileName} cargado correctamente</span> : 'Toca aquí para subir tu comprobante de pago'}
                          </span>
                        </div>
                      </div>

                      {proofError && (
                        <p className="mt-2 text-xs font-bold text-[#C8102E] flex items-center gap-1 animate-pulse">
                          <AlertCircle className="w-4 h-4" /> No has cargado el comprobante de tu pago. Por favor, sube la captura para continuar.
                        </p>
                      )}
                    </div>
                  </div>
                </div>

              </div>

              <div className="shrink-0 bg-white border-t border-slate-200 px-5 py-3.5 sm:px-6 flex items-center justify-between gap-4">
                <div>
                  <span className="block text-[10px] uppercase text-slate-400 font-bold">Total a cancelar</span>
                  <span className="block text-xl font-black text-[#1D2B22] leading-none">{formatPrice(pkg.price)}</span>
                </div>
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="flex items-center justify-center gap-2 bg-[#F2B33D] hover:bg-[#E5A423] text-[#0B3D2A] px-6 sm:px-8 py-3 rounded-xl font-black text-sm uppercase tracking-wide transition-all shadow-md cursor-pointer disabled:opacity-50"
                >
                  <span>Confirmar Compra</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </>
  );
};