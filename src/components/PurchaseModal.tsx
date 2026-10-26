import React, { useState } from 'react';
import {
  X,
  CheckCircle2,
  Sparkles,
  CreditCard,
  Landmark,
  Download,
  ArrowRight,
  Upload,
  ExternalLink,
} from 'lucide-react';
import jsPDF from 'jspdf';
import { TICKET_PACKAGES, NOTARY_INFO } from '../data/mockData';
import { TicketPackage, PurchasedTicket } from '../types';

// Importaciones oficiales de NPM (Corregidas para Vercel)
import { db } from '../firebaseConfig';
import { doc, getDoc, setDoc, collection } from 'firebase/firestore';

interface PurchaseModalProps {
  initialPackage?: TicketPackage | null;
  onClose: () => void;
  onPurchaseComplete: (ticket: PurchasedTicket) => void;
}

const UNIT_PRICE = 5000;

const formatPrice = (value: number | string): string => {
  const n = Math.round(Number(value) || 0);
  return '$' + String(n).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
};

const StepTitle: React.FC<{ n: number; title: string; hint?: string }> = ({ n, title, hint }) => (
  <div className="flex items-start gap-3 mb-3">
    <span className="shrink-0 w-8 h-8 rounded-full bg-[#111827] text-white font-heading font-black text-base flex items-center justify-center">
      {n}
    </span>
    <div>
      <h4 className="font-heading font-black text-lg sm:text-xl text-[#111827] leading-tight">{title}</h4>
      {hint && <p className="text-sm text-slate-500 mt-0.5 leading-snug">{hint}</p>}
    </div>
  </div>
);

const inputClass =
  'w-full px-4 py-3.5 bg-slate-50 border-2 border-slate-200 rounded-xl text-base text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-[#FF2D78]';

// Función para comprimir la imagen del comprobante antes de enviarla a Firebase (Ahorra espacio y costos)
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
        // Formato JPEG a 70% de calidad asegura pesos menores a 150KB
        resolve(canvas.toDataURL('image/jpeg', 0.7));
      };
    };
    reader.onerror = (error) => reject(error);
  });
};

export const PurchaseModal: React.FC<PurchaseModalProps> = ({
  initialPackage,
  onClose,
  onPurchaseComplete,
}) => {
  const [selectedPackage, setSelectedPackage] = useState<TicketPackage>(
    initialPackage || TICKET_PACKAGES[1]
  );
  const [assignmentMode, setAssignmentMode] = useState<'random' | 'manual'>('random');
  const [manualNumbers, setManualNumbers] = useState<string[]>([]);
  const [currentManualInput, setCurrentManualInput] = useState('');
  const [manualInputError, setManualInputError] = useState('');
  const [previewRandomNumbers, setPreviewRandomNumbers] = useState<string[]>([]);

  const [buyerName, setBuyerName] = useState('');
  const [buyerPhone, setBuyerPhone] = useState('');
  const [buyerEmail, setBuyerEmail] = useState('');
  const [buyerDni, setBuyerDni] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'bbva' | 'bancolombia' | 'mercadopago'>('mercadopago');
  const [acceptTerms, setAcceptTerms] = useState(false);

  const [paymentProof, setPaymentProof] = useState<string | null>(null);
  const [proofFileName, setProofFileName] = useState('');

  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState('');
  const [completedTicket, setCompletedTicket] = useState<PurchasedTicket | null>(null);

  const generateRandomNumbers = (count: number): string[] => {
    const numbers = new Set<string>();
    while (numbers.size < count) {
      const num = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
      numbers.add(num);
    }
    return Array.from(numbers);
  };

  React.useEffect(() => {
    setPreviewRandomNumbers(generateRandomNumbers(selectedPackage.totalNumbers));
  }, [selectedPackage]);

  const handleAddManualNumber = () => {
    setManualInputError('');
    const cleaned = currentManualInput.trim();
    if (!/^\d{1,4}$/.test(cleaned)) {
      setManualInputError('Escribe un número de 1 a 4 dígitos (de 0000 a 9999)');
      return;
    }
    const formatted = cleaned.padStart(4, '0');
    if (manualNumbers.includes(formatted)) {
      setManualInputError(`El número #${formatted} ya está en tu lista`);
      return;
    }
    if (manualNumbers.length >= selectedPackage.totalNumbers) {
      setManualInputError(`Tu paquete incluye ${selectedPackage.totalNumbers} números. Ya completaste la selección.`);
      return;
    }
    setManualNumbers([...manualNumbers, formatted]);
    setCurrentManualInput('');
  };

  const handleRemoveManualNumber = (num: string) => {
    setManualNumbers(manualNumbers.filter((n) => n !== num));
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProofFileName(file.name);
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

    if (!buyerName.trim() || !buyerPhone.trim() || !buyerEmail.trim()) {
      alert('Por favor, completa los campos requeridos (Nombre, Teléfono y Email).');
      return;
    }
    if (!acceptTerms) {
      alert('Debes aceptar los Términos, Condiciones y la Política de Tratamiento de Datos (Habeas Data) para continuar.');
      return;
    }
    if ((paymentMethod === 'bbva' || paymentMethod === 'bancolombia') && !paymentProof) {
      alert('Por favor, carga el comprobante de pago para continuar.');
      return;
    }

    let finalNumbers: string[] = [];
    if (assignmentMode === 'manual') {
      if (manualNumbers.length < selectedPackage.totalNumbers) {
        const remainingNeeded = selectedPackage.totalNumbers - manualNumbers.length;
        const randoms = generateRandomNumbers(remainingNeeded);
        finalNumbers = [...manualNumbers, ...randoms];
      } else {
        finalNumbers = [...manualNumbers];
      }
    } else {
      finalNumbers = [...previewRandomNumbers];
    }

    setIsProcessing(true);
    setProcessingStep('Verificando disponibilidad de números...');

    try {
      // 1. Verificar que ninguno de los números esté ocupado
      const now = Date.now();
      for (const num of finalNumbers) {
        const ticketRef = doc(db, "tickets", num);
        const docSnap = await getDoc(ticketRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          if (data.status === 'paid' || (data.status === 'reserved' && data.expiresAt > now)) {
            alert(`Lo sentimos, el número #${num} acaba de ser reservado por alguien más. Por favor escoge otro o genera números al azar nuevos.`);
            setIsProcessing(false);
            return;
          }
        }
      }

      setProcessingStep('Registrando orden segura...');

      // 2. Crear la Orden (Datos Privados)
      const orderNum = `ORD-${Math.floor(100000 + Math.random() * 900000)}`;
      const orderRef = doc(collection(db, "orders"));

      await setDoc(orderRef, {
        orderNumber: orderNum,
        buyerName,
        buyerEmail,
        buyerPhone,
        buyerDni: buyerDni || 'No proporcionado',
        packageName: selectedPackage.name,
        totalPrice: selectedPackage.price,
        numbers: finalNumbers,
        status: 'pending',
        paymentMethod,
        receiptImageBase64: paymentProof || null,
        createdAt: now
      });

      // 3. Bloquear los números (Datos Públicos) - Vencimiento 2h
      const expiresAt = now + (2 * 60 * 60 * 1000);
      for (const num of finalNumbers) {
        const ticketRef = doc(db, "tickets", num);
        await setDoc(ticketRef, {
          status: 'reserved',
          orderId: orderRef.id,
          expiresAt: expiresAt
        });
      }

      setProcessingStep('Generando comprobante oficial...');

      // 4. Crear el comprobante de éxito local
      setTimeout(() => {
        const ticket: PurchasedTicket = {
          id: orderRef.id,
          orderNumber: orderNum,
          packageName: selectedPackage.name,
          numbers: finalNumbers,
          totalPrice: selectedPackage.price,
          buyerName,
          buyerEmail,
          buyerPhone,
          buyerDni: buyerDni || 'No proporcionado',
          purchaseDate: new Date().toLocaleDateString('es-ES', {
            day: '2-digit', month: 'long', year: 'numeric',
            hour: '2-digit', minute: '2-digit',
          }),
          notaryProtocol: `${NOTARY_INFO.protocol} / Acta #${Math.floor(1000 + Math.random() * 9000)}`,
          qrData: `NOTARY42:${orderNum}:${finalNumbers.join(',')}`,
          paymentMethod: paymentMethod === 'bbva' ? 'BBVA (Verificación en 2h)' : paymentMethod === 'bancolombia' ? 'Bancolombia (Verificación en 2h)' : 'Mercado Pago',
        };

        setCompletedTicket(ticket);
        setIsProcessing(false);
        onPurchaseComplete(ticket);
      }, 1000);

    } catch (error) {
      console.error("Error al registrar en Firebase:", error);
      alert("Hubo un error de conexión al guardar tu reserva. Por favor intenta de nuevo.");
      setIsProcessing(false);
    }
  };

  // Generador Real de PDF usando jsPDF
  const handleDownloadPDF = () => {
    if (!completedTicket) return;

    const doc = new jsPDF();

    // Header
    doc.setFillColor(17, 24, 39); // bg-slate-900
    doc.rect(0, 0, 210, 35, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.text("RIFA LOS GENIOS", 105, 18, { align: "center" });
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text("COMPROBANTE OFICIAL DE RESERVA", 105, 26, { align: "center" });

    // Body
    doc.setTextColor(17, 24, 39);
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text(`¡Hola, ${completedTicket.buyerName}!`, 20, 55);

    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    const msg = completedTicket.paymentMethod.includes('Mercado')
      ? 'Aquí tienes el resumen de tu reserva (Pendiente de pago exitoso):'
      : 'Tus números están reservados por 2 horas mientras validamos tu transferencia:';
    doc.text(msg, 20, 65);

    // Box details
    doc.setFillColor(248, 250, 252);
    doc.rect(20, 75, 170, 50, 'F');

    doc.setFont("helvetica", "bold");
    doc.text("No. Orden:", 25, 85);
    doc.setFont("helvetica", "normal");
    doc.text(completedTicket.orderNumber, 60, 85);

    doc.setFont("helvetica", "bold");
    doc.text("Paquete:", 25, 95);
    doc.setFont("helvetica", "normal");
    doc.text(completedTicket.packageName, 60, 95);

    doc.setFont("helvetica", "bold");
    doc.text("Total:", 25, 105);
    doc.setFont("helvetica", "normal");
    doc.text(`$${completedTicket.totalPrice.toLocaleString('es-ES')}`, 60, 105);

    doc.setFont("helvetica", "bold");
    doc.text("Fecha:", 25, 115);
    doc.setFont("helvetica", "normal");
    doc.text(completedTicket.purchaseDate, 60, 115);

    // Numbers
    doc.setFont("helvetica", "bold");
    doc.text("TUS NÚMEROS BLOQUEADOS:", 20, 140);

    doc.setFont("helvetica", "bold");
    doc.setTextColor(255, 45, 120); // Pink color
    const numsText = completedTicket.numbers.map(n => `#${n}`).join('   ');
    const splitNums = doc.splitTextToSize(numsText, 170);
    doc.text(splitNums, 20, 150);

    // Footer Legal
    doc.setTextColor(100, 100, 100);
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.text(`Certificado de Garantía / Protocolo: ${completedTicket.notaryProtocol}`, 105, 270, { align: "center" });
    doc.text("Válido como soporte de reserva en la plataforma oficial Rifa Volkswagen Gol 98", 105, 275, { align: "center" });

    doc.save(`Reserva_Genios_${completedTicket.orderNumber}.pdf`);
  };

  const isFormView = !completedTicket && !isProcessing;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4">
      <div
        className={`relative bg-white rounded-3xl w-full ${isFormView ? 'max-w-5xl' : 'max-w-2xl'} max-h-[94vh] flex flex-col shadow-2xl overflow-hidden border border-slate-100`}
      >
        {/* Header */}
        <div className="shrink-0 bg-gradient-to-r from-[#111827] to-slate-900 text-white px-5 py-4 sm:px-8 sm:py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-[#FF2D78] flex items-center justify-center text-white shrink-0">
              <Sparkles className="w-5 h-5 fill-white" />
            </div>
            <div>
              <h3 className="font-heading font-black text-lg sm:text-2xl text-white leading-tight">
                Compra tus boletos
              </h3>
              <p className="text-xs sm:text-sm text-slate-300">
                Solo 4 pasos sencillos y listo
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Cerrar"
            className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        {completedTicket ? (
          <div className="flex-1 overflow-y-auto p-6">
            <div className="text-center py-4 space-y-6 animate-in fade-in zoom-in-95 duration-300">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div>
                <span className="text-xs font-black uppercase tracking-widest text-[#FF2D78]">
                  ¡RESERVA REGISTRADA CON ÉXITO!
                </span>
                <h4 className="font-heading font-black text-2xl text-[#111827] mt-1">
                  ¡Enhorabuena, {completedTicket.buyerName}!
                </h4>
                <p className="text-sm text-slate-500 mt-1 max-w-md mx-auto">
                  {paymentMethod === 'mercadopago'
                    ? 'Tus números están bloqueados temporalmente. Haz clic en el botón de abajo para ir a pagar de forma segura en Mercado Pago.'
                    : 'Tus números están reservados por 2 horas. Validaremos tu comprobante cargado para confirmarlos definitivamente.'}
                </p>
              </div>

              {paymentMethod === 'mercadopago' && (
                <div className="bg-[#FFF0F5] border-2 border-[#FF2D78] p-5 rounded-3xl space-y-3 shadow-md">
                  <p className="text-sm font-bold text-slate-800">
                    Paso final: Realiza tu pago oficial en la plataforma segura de Mercado Pago.
                  </p>
                  <a
                    href="https://link.mercadopago.com.co/rifaslosgenios"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center gap-3 bg-[#FF2D78] hover:bg-[#E01A63] text-white font-heading font-black text-sm uppercase tracking-wider py-4 px-6 rounded-2xl shadow-lg transition-all transform hover:scale-[1.02] cursor-pointer"
                  >
                    <span>PAGAR AHORA EN MERCADO PAGO</span>
                    <ExternalLink className="w-5 h-5" />
                  </a>
                </div>
              )}

              {/* Pass Card */}
              <div className="bg-slate-50 border-2 border-dashed border-slate-300 rounded-3xl p-6 text-left relative overflow-hidden shadow-inner">
                <div className="flex items-center justify-between border-b border-slate-200 pb-3 mb-4">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
                      Certificado de Participación
                    </span>
                    <span className="font-heading font-bold text-sm text-[#111827]">
                      {completedTicket.notaryProtocol}
                    </span>
                  </div>
                  <div className="bg-[#C6F235] px-2.5 py-1 rounded-full text-[10px] font-black text-[#111827]">
                    SEGURO Y VERIFICADO
                  </div>
                </div>

                <div className="mb-4">
                  <span className="text-xs font-bold text-slate-500 block mb-2 uppercase">
                    Tus Números Bloqueados:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {completedTicket.numbers.map((num) => (
                      <span
                        key={num}
                        className="px-3 py-1.5 bg-[#FF2D78] text-white font-heading font-black text-base rounded-xl shadow-sm tracking-wider"
                      >
                        #{num}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-3 justify-center">
                <button
                  onClick={handleDownloadPDF}
                  className="inline-flex items-center gap-2 bg-[#111827] hover:bg-slate-800 text-white text-sm font-bold px-5 py-3 rounded-full transition-all cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  Descargar Comprobante PDF
                </button>
                <button
                  onClick={onClose}
                  className="inline-flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-bold px-5 py-3 rounded-full transition-all cursor-pointer"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        ) : isProcessing ? (
          <div className="flex-1 overflow-y-auto p-6">
            <div className="py-16 text-center space-y-4">
              <div className="relative w-20 h-20 mx-auto">
                <div className="absolute inset-0 rounded-full border-4 border-slate-200"></div>
                <div className="absolute inset-0 rounded-full border-4 border-[#FF2D78] border-t-transparent animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center text-[#FF2D78]">
                  <Sparkles className="w-8 h-8 animate-pulse" />
                </div>
              </div>
              <h4 className="font-heading font-black text-xl text-[#111827]">
                Sincronizando con Firebase...
              </h4>
              <p className="text-sm text-slate-500 font-medium animate-pulse">
                {processingStep}
              </p>
            </div>
          </div>
        ) : (
          <form onSubmit={handlePayment} className="flex flex-col flex-1 min-h-0">
            <div className="flex-1 overflow-y-auto px-4 py-5 sm:px-8 sm:py-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10">

                {/* ===== COLUMNA IZQUIERDA: boletos y números ===== */}
                <div className="space-y-7">
                  {/* PASO 1 */}
                  <div>
                    <StepTitle n={1} title="¿Cuántos boletos quieres?" hint="Toca el paquete que prefieras" />
                    <div className="space-y-3">
                      {TICKET_PACKAGES.map((pkg) => {
                        const isSelected = selectedPackage.id === pkg.id;
                        const freeTickets = Math.max(0, pkg.totalNumbers - Math.round(Number(pkg.price) / UNIT_PRICE));
                        return (
                          <button
                            type="button"
                            key={pkg.id}
                            onClick={() => {
                              setSelectedPackage(pkg);
                              setManualNumbers([]);
                            }}
                            className={`relative w-full text-left flex items-center gap-3 p-4 rounded-2xl border-2 transition-all cursor-pointer ${isSelected
                              ? 'border-[#FF2D78] bg-[#FFF0F5] shadow-sm'
                              : 'border-slate-200 bg-white hover:border-slate-300'
                              }`}
                          >
                            {pkg.isPopular && (
                              <span className="absolute -top-2.5 right-4 bg-[#FF2D78] text-white text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full">
                                TOP VENTAS
                              </span>
                            )}
                            <span
                              className={`shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center ${isSelected ? 'border-[#FF2D78] bg-[#FF2D78]' : 'border-slate-300 bg-white'
                                }`}
                            >
                              {isSelected && <span className="w-2.5 h-2.5 rounded-full bg-white" />}
                            </span>
                            <span className="flex-1">
                              <span className="font-heading font-bold text-base text-slate-900 block leading-tight">
                                {pkg.name}
                              </span>
                              <span className="text-sm text-slate-600 block mt-0.5">
                                {pkg.totalNumbers} {pkg.totalNumbers === 1 ? 'número' : 'números'} para el sorteo
                              </span>
                              {freeTickets > 0 && (
                                <span className="inline-block mt-1 text-xs font-black text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                                  🎁 ¡{freeTickets} {freeTickets === 1 ? 'boleto gratis' : 'boletos gratis'}!
                                </span>
                              )}
                            </span>
                            <span className="font-heading font-black text-xl text-[#FF2D78] shrink-0">
                              {formatPrice(pkg.price)}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* PASO 2 */}
                  <div className="bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200">
                    <StepTitle
                      n={2}
                      title="Tus números de la suerte"
                      hint="Del 0000 al 9999. Escoge cómo los quieres"
                    />
                    <div className="grid grid-cols-2 gap-2 mb-4">
                      <button
                        type="button"
                        onClick={() => {
                          setAssignmentMode('random');
                          setManualNumbers([]);
                        }}
                        className={`py-3 px-2 rounded-xl text-sm font-bold transition-all cursor-pointer ${assignmentMode === 'random'
                          ? 'bg-[#111827] text-white shadow-sm'
                          : 'bg-white border-2 border-slate-200 text-slate-700 hover:bg-slate-100'
                          }`}
                      >
                        🎲 Al azar
                      </button>
                      <button
                        type="button"
                        onClick={() => setAssignmentMode('manual')}
                        className={`py-3 px-2 rounded-xl text-sm font-bold transition-all cursor-pointer ${assignmentMode === 'manual'
                          ? 'bg-[#111827] text-white shadow-sm'
                          : 'bg-white border-2 border-slate-200 text-slate-700 hover:bg-slate-100'
                          }`}
                      >
                        ✨ Yo los elijo
                      </button>
                    </div>

                    {assignmentMode === 'random' ? (
                      <div>
                        <p className="text-sm text-slate-600 mb-3 font-medium">
                          Nosotros te damos {selectedPackage.totalNumbers} {selectedPackage.totalNumbers === 1 ? 'número' : 'números'} al azar:
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {previewRandomNumbers.map((num) => (
                            <span
                              key={num}
                              className="px-3.5 py-2 bg-[#111827] text-white font-heading font-black text-base rounded-xl tracking-wider"
                            >
                              #{num}
                            </span>
                          ))}
                        </div>
                        <button
                          type="button"
                          onClick={() => setPreviewRandomNumbers(generateRandomNumbers(selectedPackage.totalNumbers))}
                          className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-[#FF2D78] bg-white border-2 border-[#FF2D78] hover:bg-[#FFF0F5] px-4 py-2 rounded-full cursor-pointer"
                        >
                          🔄 Cambiar mis números
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <p className="text-sm text-slate-600 font-medium">
                          Escribe hasta {selectedPackage.totalNumbers} {selectedPackage.totalNumbers === 1 ? 'número' : 'números'} y toca “Añadir”. Si eliges menos, completamos el resto al azar.
                        </p>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            inputMode="numeric"
                            maxLength={4}
                            placeholder="0000"
                            value={currentManualInput}
                            onChange={(e) => setCurrentManualInput(e.target.value.replace(/\D/g, ''))}
                            className="w-32 px-3 py-3 bg-white border-2 border-slate-300 rounded-xl font-heading font-black text-center text-2xl focus:outline-none focus:border-[#FF2D78]"
                          />
                          <button
                            type="button"
                            onClick={handleAddManualNumber}
                            className="px-6 py-3 bg-[#FF2D78] hover:bg-[#E01A63] text-white text-sm font-bold uppercase rounded-xl transition-colors cursor-pointer"
                          >
                            Añadir
                          </button>
                        </div>

                        {manualInputError && (
                          <p className="text-sm text-red-600 font-semibold">{manualInputError}</p>
                        )}

                        {manualNumbers.length > 0 && (
                          <div className="flex flex-wrap gap-2 pt-1">
                            {manualNumbers.map((num) => (
                              <span
                                key={num}
                                className="inline-flex items-center gap-2 px-3.5 py-2 bg-[#111827] text-white text-base font-heading font-black rounded-xl"
                              >
                                #{num}
                                <button
                                  type="button"
                                  onClick={() => handleRemoveManualNumber(num)}
                                  aria-label={`Quitar el número ${num}`}
                                  className="text-slate-300 hover:text-white text-lg leading-none cursor-pointer"
                                >
                                  ×
                                </button>
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* ===== COLUMNA DERECHA: datos y pago ===== */}
                <div className="space-y-7">
                  {/* PASO 3 */}
                  <div>
                    <StepTitle n={3} title="Tus datos" hint="Para avisarte si resultas ganador" />
                    <div className="space-y-4">
                      <div>
                        <label htmlFor="buyer-name" className="block text-sm font-bold text-slate-700 mb-1.5">
                          Nombre y apellidos *
                        </label>
                        <input
                          id="buyer-name"
                          type="text"
                          required
                          autoComplete="name"
                          placeholder="Ej: Juan Pérez"
                          value={buyerName}
                          onChange={(e) => setBuyerName(e.target.value)}
                          className={inputClass}
                        />
                      </div>
                      <div>
                        <label htmlFor="buyer-phone" className="block text-sm font-bold text-slate-700 mb-1.5">
                          Celular (WhatsApp) *
                        </label>
                        <input
                          id="buyer-phone"
                          type="tel"
                          required
                          autoComplete="tel"
                          placeholder="300 000 0000"
                          value={buyerPhone}
                          onChange={(e) => setBuyerPhone(e.target.value)}
                          className={inputClass}
                        />
                      </div>
                      <div>
                        <label htmlFor="buyer-email" className="block text-sm font-bold text-slate-700 mb-1.5">
                          Correo electrónico *
                        </label>
                        <input
                          id="buyer-email"
                          type="email"
                          required
                          autoComplete="email"
                          placeholder="tucorreo@ejemplo.com"
                          value={buyerEmail}
                          onChange={(e) => setBuyerEmail(e.target.value)}
                          className={inputClass}
                        />
                      </div>
                    </div>
                  </div>

                  {/* PASO 4 */}
                  <div>
                    <StepTitle n={4} title="¿Cómo vas a pagar?" hint="Toca una opción" />
                    <div className="grid grid-cols-3 gap-2 mb-3">
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('mercadopago')}
                        className={`p-3 py-3.5 rounded-2xl border-2 text-center transition-all cursor-pointer flex flex-col justify-center ${paymentMethod === 'mercadopago'
                          ? 'border-[#FF2D78] bg-[#FFF0F5] text-[#FF2D78]'
                          : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                          }`}
                      >
                        <CreditCard className="w-6 h-6 mx-auto mb-1.5 text-[#111827]" />
                        <span className="text-sm block font-bold leading-tight">Mercado Pago</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setPaymentMethod('bbva')}
                        className={`p-3 py-3 rounded-2xl border-2 text-center transition-all cursor-pointer ${paymentMethod === 'bbva'
                          ? 'border-[#FF2D78] bg-[#FFF0F5] text-[#FF2D78]'
                          : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                          }`}
                      >
                        <Landmark className="w-6 h-6 mx-auto mb-1 text-blue-700" />
                        <span className="text-sm block font-bold leading-tight mb-1">(Llave Bre-B)</span>
                        <span className="text-sm block font-bold leading-tight">BBVA</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setPaymentMethod('bancolombia')}
                        className={`p-3 py-3 rounded-2xl border-2 text-center transition-all cursor-pointer ${paymentMethod === 'bancolombia'
                          ? 'border-[#FF2D78] bg-[#FFF0F5] text-[#FF2D78]'
                          : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                          }`}
                      >
                        <Landmark className="w-6 h-6 mx-auto mb-1 text-yellow-600" />
                        <span className="text-sm block font-bold leading-tight mb-1">(Llave Bre-B)</span>
                        <span className="text-sm block font-bold leading-tight">Bancolombia</span>
                      </button>
                    </div>

                    {paymentMethod === 'mercadopago' && (
                      <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl text-sm text-slate-700">
                        💳 Al terminar, te llevamos a la página segura de Mercado Pago para que pagues.
                      </div>
                    )}

                    {paymentMethod === 'bbva' && (
                      <div className="bg-blue-50 border border-blue-200 p-4 rounded-2xl mb-3 space-y-1 text-sm text-blue-900">
                        <p className="font-bold">🏦 Datos para transferencia BBVA:</p>
                        <p>Llave Bre-B: <strong className="text-blue-700 text-base">bbvanm4191</strong></p>
                        <p>Titular: <strong className="text-blue-700">Narcy Manosalva</strong></p>
                        <p className="text-xs text-blue-700 mt-1">Haz tu transferencia y sube abajo la captura del comprobante.</p>
                      </div>
                    )}

                    {paymentMethod === 'bancolombia' && (
                      <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-2xl mb-3 space-y-1 text-sm text-yellow-900">
                        <p className="font-bold">🏦 Datos para transferencia Bancolombia:</p>
                        <p>Llave Bre-B: <strong className="text-yellow-700 text-base">@narcy419</strong></p>
                        <p>Titular: <strong className="text-yellow-700">Narcy Manosalva</strong></p>
                        <p className="text-xs text-yellow-700 mt-1">Haz tu transferencia y sube abajo la captura del comprobante.</p>
                      </div>
                    )}

                    {(paymentMethod === 'bbva' || paymentMethod === 'bancolombia') && (
                      <div className="bg-slate-50 border-2 border-dashed border-slate-300 p-4 rounded-2xl space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-bold text-slate-700">
                            Sube tu comprobante de {paymentMethod === 'bbva' ? 'BBVA' : 'Bancolombia'}: *
                          </span>
                          <Upload className="w-5 h-5 text-[#FF2D78]" />
                        </div>
                        <input
                          type="file"
                          accept="image/*,application/pdf"
                          required
                          onChange={handleFileChange}
                          className="w-full text-sm text-slate-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-bold file:bg-[#111827] file:text-white hover:file:bg-slate-800 cursor-pointer"
                        />
                        {proofFileName && (
                          <p className="text-sm text-emerald-600 font-semibold">
                            ✓ Archivo adjunto: {proofFileName}
                          </p>
                        )}
                        <p className="text-xs text-slate-500">
                          Tus números quedan reservados por 2 horas mientras revisamos el comprobante.
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Términos y Habeas Data */}
                  <div className="flex items-start gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                    <input
                      type="checkbox"
                      id="terms"
                      checked={acceptTerms}
                      onChange={(e) => setAcceptTerms(e.target.checked)}
                      required
                      className="mt-0.5 w-6 h-6 shrink-0 text-[#FF2D78] rounded border-slate-300 focus:ring-[#FF2D78] cursor-pointer"
                    />
                    <label htmlFor="terms" className="text-sm text-slate-700 cursor-pointer leading-relaxed">
                      Acepto los <span className="font-bold text-slate-900">Términos y Condiciones</span> y autorizo el <span className="font-bold text-slate-900">Tratamiento de Datos Personales (Habeas Data)</span> para validar mi participación en el sorteo. *
                    </label>
                  </div>
                </div>

              </div>
            </div>

            {/* Barra fija abajo */}
            <div className="shrink-0 border-t border-slate-200 bg-white px-4 py-3 sm:px-8 sm:py-4 flex items-center justify-between gap-3 shadow-[0_-8px_24px_rgba(0,0,0,0.06)]">
              <div>
                <span className="text-xs sm:text-sm text-slate-500 block leading-none">Total a pagar</span>
                <span className="font-heading font-black text-2xl sm:text-3xl text-[#111827] leading-tight">
                  {formatPrice(selectedPackage.price)}
                </span>
              </div>

              <button
                type="submit"
                disabled={isProcessing}
                className="inline-flex items-center justify-center gap-2 bg-[#C6F235] hover:bg-[#B5E01F] text-[#111827] font-heading font-black text-sm sm:text-base uppercase tracking-wide px-5 sm:px-10 py-4 rounded-full shadow-lg transition-all cursor-pointer disabled:opacity-50"
              >
                {isProcessing ? (
                  <span>Procesando...</span>
                ) : (
                  <>
                    <span>CONFIRMAR Y RESERVAR</span>
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};