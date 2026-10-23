import React, { useState } from 'react';
import {
  X,
  CheckCircle2,
  Sparkles,
  CreditCard,
  Smartphone,
  Download,
  ArrowRight,
  Upload,
  ExternalLink,
} from 'lucide-react';
import { TICKET_PACKAGES, NOTARY_INFO } from '../data/mockData';
import { TicketPackage, PurchasedTicket } from '../types';

import { db } from '../firebaseConfig';
import { doc, getDoc, setDoc, updateDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

interface PurchaseModalProps {
  initialPackage?: TicketPackage | null;
  onClose: () => void;
  onPurchaseComplete: (ticket: PurchasedTicket) => void;
}

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

  // Form Fields
  const [buyerName, setBuyerName] = useState('');
  const [buyerPhone, setBuyerPhone] = useState('');
  const [buyerEmail, setBuyerEmail] = useState('');
  const [buyerDni, setBuyerDni] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'nequi' | 'daviplata' | 'mercadopago'>('mercadopago');

  // Estado para la aceptación obligatoria de términos, condiciones y habeas data
  const [acceptTerms, setAcceptTerms] = useState(false);

  const [paymentProof, setPaymentProof] = useState<string | null>(null);
  const [proofFileName, setProofFileName] = useState('');

  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState('');
  const [completedTicket, setCompletedTicket] = useState<PurchasedTicket | null>(null);

  const generateRandomNumbers = (count: number): string[] => {
    const numbers = new Set<string>();
    while (numbers.size < count) {
      const num = Math.floor(Math.random() * 10000)
        .toString()
        .padStart(4, '0');
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
      setManualInputError('Introduce un número de 1 a 4 dígitos (0000 a 9999)');
      return;
    }
    const formatted = cleaned.padStart(4, '0');
    if (manualNumbers.includes(formatted)) {
      setManualInputError(`El número #${formatted} ya está en tu lista`);
      return;
    }
    if (manualNumbers.length >= selectedPackage.totalNumbers) {
      setManualInputError(
        `Tu paquete incluye ${selectedPackage.totalNumbers} números. Ya has completado la selección.`
      );
      return;
    }
    setManualNumbers([...manualNumbers, formatted]);
    setCurrentManualInput('');
  };

  const handleRemoveManualNumber = (num: string) => {
    setManualNumbers(manualNumbers.filter((n) => n !== num));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProofFileName(file.name);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPaymentProof(reader.result as string);
      };
      reader.readAsDataURL(file);
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

    if ((paymentMethod === 'nequi' || paymentMethod === 'daviplata') && !paymentProof) {
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
    setProcessingStep('Registrando reserva en Firebase...');

    try {
      const expiresAt = new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString();

      for (const num of finalNumbers) {
        const ticketRef = doc(db, "tickets", num);
        const docSnap = await getDoc(ticketRef);

        const ticketData = {
          numero: num,
          estado: paymentMethod === 'mercadopago' ? "pendiente_pago" : "pendiente_pago",
          expiraEn: expiresAt,
          comprador: {
            nombre: buyerName,
            telefono: buyerPhone,
            email: buyerEmail,
            documento: buyerDni || 'No proporcionado',
            metodoPago: paymentMethod,
            comprobanteUrl: paymentProof || null,
            fecha: new Date().toISOString()
          }
        };

        if (docSnap.exists()) {
          await updateDoc(ticketRef, ticketData);
        } else {
          await setDoc(ticketRef, ticketData);
        }
      }

      setProcessingStep('Generando comprobante oficial...');
      setTimeout(() => {
        const orderNum = `ORD-${Math.floor(100000 + Math.random() * 900000)}`;
        const ticket: PurchasedTicket = {
          id: `TCK-${Date.now()}`,
          orderNumber: orderNum,
          packageName: selectedPackage.name,
          numbers: finalNumbers,
          totalPrice: selectedPackage.price,
          buyerName,
          buyerEmail,
          buyerPhone,
          buyerDni: buyerDni || 'No proporcionado',
          purchaseDate: new Date().toLocaleDateString('es-ES', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          }),
          notaryProtocol: `${NOTARY_INFO.protocol} / Acta #${Math.floor(1000 + Math.random() * 9000)}`,
          qrData: `NOTARY42:${orderNum}:${finalNumbers.join(',')}`,
          paymentMethod: paymentMethod === 'nequi' ? 'Nequi (Verificación en 2h)' : paymentMethod === 'daviplata' ? 'Daviplata (Verificación en 2h)' : 'Mercado Pago',
        };

        setCompletedTicket(ticket);
        setIsProcessing(false);
        onPurchaseComplete(ticket);
      }, 1000);

    } catch (error) {
      console.error("Error al registrar en Firebase:", error);
      alert("Hubo un error al guardar los boletos en la base de datos.");
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative bg-white rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden border border-slate-100 my-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#111827] to-slate-900 text-white p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#FF2D78] flex items-center justify-center text-white">
              <Sparkles className="w-5 h-5 fill-white" />
            </div>
            <div>
              <h3 className="font-heading font-black text-lg text-white">
                Comprar Boletos Oficiales
              </h3>
              <p className="text-xs text-slate-400">
                Reserva segura con control de inventario en tiempo real
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

        {/* Content Body */}
        <div className="p-6 max-h-[80vh] overflow-y-auto">
          {completedTicket ? (
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
                <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                  {paymentMethod === 'mercadopago'
                    ? 'Tus números están bloqueados temporalmente. Haz clic en el botón de abajo para ir a pagar de forma segura en Mercado Pago.'
                    : 'Tus números están reservados por 2 horas. Validaremos tu comprobante cargado para confirmarlos definitivamente.'}
                </p>
              </div>

              {paymentMethod === 'mercadopago' && (
                <div className="bg-[#FFF0F5] border-2 border-[#FF2D78] p-5 rounded-3xl space-y-3 shadow-md">
                  <p className="text-xs font-bold text-slate-800">
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
                  onClick={() => alert('Comprobante digital descargado.')}
                  className="inline-flex items-center gap-2 bg-[#111827] hover:bg-slate-800 text-white text-xs font-bold px-5 py-3 rounded-full transition-all cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  Descargar Comprobante
                </button>
                <button
                  onClick={onClose}
                  className="inline-flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold px-5 py-3 rounded-full transition-all cursor-pointer"
                >
                  Cerrar
                </button>
              </div>
            </div>
          ) : isProcessing ? (
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
              <p className="text-xs text-slate-500 font-medium animate-pulse">
                {processingStep}
              </p>
            </div>
          ) : (
            <form onSubmit={handlePayment} className="space-y-6">
              {/* Package Selector */}
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-slate-500 mb-2">
                  1. Selecciona tu Paquete de Boletos
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {TICKET_PACKAGES.map((pkg) => {
                    const isSelected = selectedPackage.id === pkg.id;
                    return (
                      <div
                        key={pkg.id}
                        onClick={() => {
                          setSelectedPackage(pkg);
                          setManualNumbers([]);
                        }}
                        className={`p-3.5 rounded-2xl border-2 transition-all cursor-pointer text-left relative ${isSelected
                          ? 'border-[#FF2D78] bg-[#FFF0F5]/50 shadow-sm'
                          : 'border-slate-200 bg-white hover:border-slate-300'
                          }`}
                      >
                        {pkg.isPopular && (
                          <span className="absolute -top-2.5 right-3 bg-[#FF2D78] text-white text-[9px] font-black uppercase px-2 py-0.5 rounded-full">
                            TOP VENTAS
                          </span>
                        )}
                        <span className="font-heading font-bold text-xs text-slate-900 block">
                          {pkg.name}
                        </span>
                        <div className="flex items-baseline gap-1 mt-1">
                          <span className="font-heading font-black text-lg text-[#FF2D78]">
                            ${pkg.price}
                          </span>
                        </div>
                        <span className="text-[11px] text-slate-500 block mt-1 font-medium">
                          {pkg.totalNumbers} números en sorteo
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Number Selection Mode */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-2">
                  2. Asignación de Números (0000 - 9999)
                </label>
                <div className="flex gap-2 mb-3">
                  <button
                    type="button"
                    onClick={() => {
                      setAssignmentMode('random');
                      setManualNumbers([]);
                    }}
                    className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${assignmentMode === 'random'
                      ? 'bg-[#111827] text-white shadow-sm'
                      : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                      }`}
                  >
                    🎲 Asignación Aleatoria
                  </button>
                  <button
                    type="button"
                    onClick={() => setAssignmentMode('manual')}
                    className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${assignmentMode === 'manual'
                      ? 'bg-[#111827] text-white shadow-sm'
                      : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                      }`}
                  >
                    ✨ Elegir Mis Números
                  </button>
                </div>

                {assignmentMode === 'random' ? (
                  <div className="pt-2">
                    <p className="text-[11px] text-slate-500 mb-2 font-medium">
                      Tus {selectedPackage.totalNumbers} números asignados aleatoriamente para este paquete:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {previewRandomNumbers.map((num) => (
                        <span
                          key={num}
                          className="px-3 py-1 bg-[#111827] text-white font-heading font-black text-sm rounded-lg tracking-wider"
                        >
                          #{num}
                        </span>
                      ))}
                    </div>
                    <button
                      type="button"
                      onClick={() => setPreviewRandomNumbers(generateRandomNumbers(selectedPackage.totalNumbers))}
                      className="mt-3 text-[11px] font-bold text-[#FF2D78] hover:underline cursor-pointer block"
                    >
                      🔄 Generar otros números aleatorios
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3 pt-2">
                    <p className="text-[11px] text-slate-500 font-medium">
                      Elige hasta {selectedPackage.totalNumbers} números manualmente (si eliges menos, el resto se completarán al azar):
                    </p>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        maxLength={4}
                        placeholder="0000"
                        value={currentManualInput}
                        onChange={(e) => setCurrentManualInput(e.target.value.replace(/\D/g, ''))}
                        className="w-28 px-3 py-2 bg-white border border-slate-300 rounded-xl font-heading font-black text-center text-lg focus:outline-none focus:border-[#FF2D78]"
                      />
                      <button
                        type="button"
                        onClick={handleAddManualNumber}
                        className="px-4 py-2 bg-[#FF2D78] hover:bg-[#E01A63] text-white text-xs font-bold uppercase rounded-xl transition-colors cursor-pointer"
                      >
                        Añadir
                      </button>
                    </div>

                    {manualInputError && (
                      <p className="text-[11px] text-red-500 font-semibold">{manualInputError}</p>
                    )}

                    {manualNumbers.length > 0 && (
                      <div className="flex flex-wrap gap-2 pt-2">
                        {manualNumbers.map((num) => (
                          <span
                            key={num}
                            className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#111827] text-white text-xs font-bold rounded-lg"
                          >
                            #{num}
                            <button
                              type="button"
                              onClick={() => handleRemoveManualNumber(num)}
                              className="text-slate-400 hover:text-white"
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

              {/* Buyer Contact Information */}
              <div className="space-y-3">
                <label className="block text-xs font-black uppercase tracking-wider text-slate-500">
                  3. Datos del Titular
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">Nombre y Apellidos *</label>
                    <input
                      type="text"
                      required
                      placeholder="Ej: Juan Pérez"
                      value={buyerName}
                      onChange={(e) => setBuyerName(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:border-[#FF2D78]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">Teléfono WhatsApp *</label>
                    <input
                      type="tel"
                      required
                      placeholder="300 000 0000"
                      value={buyerPhone}
                      onChange={(e) => setBuyerPhone(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:border-[#FF2D78]"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">Correo Electrónico *</label>
                    <input
                      type="email"
                      required
                      placeholder="tucorreo@ejemplo.com"
                      value={buyerEmail}
                      onChange={(e) => setBuyerEmail(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:border-[#FF2D78]"
                    />
                  </div>
                </div>
              </div>

              {/* Payment Method & Proof Upload */}
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-slate-500 mb-2">
                  4. Método de Pago y Comprobante
                </label>
                <div className="grid grid-cols-3 gap-2 mb-3">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('mercadopago')}
                    className={`p-3 rounded-2xl border text-center transition-all cursor-pointer ${paymentMethod === 'mercadopago'
                      ? 'border-[#FF2D78] bg-[#FFF0F5] font-bold text-[#FF2D78]'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                  >
                    <CreditCard className="w-5 h-5 mx-auto mb-1 text-[#111827]" />
                    <span className="text-xs block font-bold">Mercado Pago</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('nequi')}
                    className={`p-3 rounded-2xl border text-center transition-all cursor-pointer ${paymentMethod === 'nequi'
                      ? 'border-[#FF2D78] bg-[#FFF0F5] font-bold text-[#FF2D78]'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                  >
                    <Smartphone className="w-5 h-5 mx-auto mb-1 text-purple-600" />
                    <span className="text-xs block font-bold">Nequi</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('daviplata')}
                    className={`p-3 rounded-2xl border text-center transition-all cursor-pointer ${paymentMethod === 'daviplata'
                      ? 'border-[#FF2D78] bg-[#FFF0F5] font-bold text-[#FF2D78]'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                  >
                    <Smartphone className="w-5 h-5 mx-auto mb-1 text-red-600" />
                    <span className="text-xs block font-bold">Daviplata</span>
                  </button>
                </div>

                {paymentMethod === 'nequi' && (
                  <div className="bg-purple-50 border border-purple-200 p-4 rounded-2xl mb-3 space-y-1 text-xs text-purple-900">
                    <p className="font-bold">📲 Datos para transferencia Nequi:</p>
                    <p>Número / Llave: <strong className="text-purple-700 text-sm">300 000 0000</strong></p>
                    <p className="text-[11px] text-purple-600">Realiza tu transferencia y adjunta la captura del comprobante abajo.</p>
                  </div>
                )}

                {paymentMethod === 'daviplata' && (
                  <div className="bg-red-50 border border-red-200 p-4 rounded-2xl mb-3 space-y-1 text-xs text-red-900">
                    <p className="font-bold">📲 Datos para transferencia Daviplata:</p>
                    <p>Número / Llave: <strong className="text-red-700 text-sm">300 000 0000</strong></p>
                    <p className="text-[11px] text-red-600">Realiza tu transferencia y adjunta la captura del comprobante abajo.</p>
                  </div>
                )}

                {(paymentMethod === 'nequi' || paymentMethod === 'daviplata') && (
                  <div className="bg-slate-50 border-2 border-dashed border-slate-300 p-4 rounded-2xl space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-700">
                        Sube tu comprobante de transferencia ({paymentMethod.toUpperCase()}): *
                      </span>
                      <Upload className="w-4 h-4 text-[#FF2D78]" />
                    </div>
                    <input
                      type="file"
                      accept="image/*,application/pdf"
                      required
                      onChange={handleFileChange}
                      className="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-[#111827] file:text-white hover:file:bg-slate-800 cursor-pointer"
                    />
                    {proofFileName && (
                      <p className="text-[11px] text-emerald-600 font-semibold">
                        ✓ Archivo adjunto: {proofFileName}
                      </p>
                    )}
                    <p className="text-[10px] text-slate-400">
                      Tus números quedarán reservados por 2 horas mientras validamos el comprobante.
                    </p>
                  </div>
                )}
              </div>

              {/* Checkbox Obligatorio de Términos, Condiciones y Habeas Data */}
              <div className="flex items-start gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <input
                  type="checkbox"
                  id="terms"
                  checked={acceptTerms}
                  onChange={(e) => setAcceptTerms(e.target.checked)}
                  required
                  className="mt-0.5 w-4 h-4 text-[#FF2D78] rounded border-slate-300 focus:ring-[#FF2D78] cursor-pointer"
                />
                <label htmlFor="terms" className="text-xs text-slate-600 cursor-pointer leading-relaxed">
                  Acepto los <span className="font-bold text-slate-800">Términos, Condiciones</span> y autorizo el <span className="font-bold text-slate-800">Tratamiento de Datos Personales (Habeas Data)</span> para la validación de mi participación en el sorteo. *
                </label>
              </div>

              {/* Summary and Pay Button */}
              <div className="border-t border-slate-100 pt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <span className="text-xs text-slate-500 block">Total a pagar:</span>
                  <span className="font-heading font-black text-3xl text-[#FF2D78]">
                    ${selectedPackage.price}
                  </span>
                </div>

                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#FF2D78] hover:bg-[#E01A63] text-white font-heading font-bold text-xs uppercase tracking-wider px-8 py-4 rounded-full shadow-md transition-all cursor-pointer disabled:opacity-50"
                >
                  {isProcessing ? (
                    <span>Procesando en Firebase...</span>
                  ) : (
                    <>
                      <span>CONFIRMAR Y RESERVAR</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};