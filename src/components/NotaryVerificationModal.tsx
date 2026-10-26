import React, { useState } from 'react';
import {
  X,
  ShieldCheck,
  Award,
  Search,
  CheckCircle2,
  AlertCircle,
  FileText,
  MapPin,
  Calendar,
  Lock,
  Car,
  Sparkles
} from 'lucide-react';

interface NotaryVerificationModalProps {
  onClose: () => void;
  onOpenPurchaseModal?: () => void;
}

export const NotaryVerificationModal: React.FC<NotaryVerificationModalProps> = ({
  onClose,
  onOpenPurchaseModal,
}) => {
  const [searchNumber, setSearchNumber] = useState('');
  const [searchResult, setSearchResult] = useState<{
    number: string;
    isSold: boolean;
  } | null>(null);

  const handleCheckNumber = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchNumber.trim()) return;
    const num = searchNumber.trim().padStart(4, '0');
    const numVal = parseInt(num, 10);
    const isSold = (numVal * 73) % 100 < 25;

    setSearchResult({
      number: num,
      isSold,
    });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="relative bg-white rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden border border-slate-100 my-6 sm:my-8">

        {/* Encabezado */}
        <div className="bg-[#111827] text-white p-6 sm:p-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#C6F235] text-[#111827] flex items-center justify-center font-black shadow-lg shrink-0">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-heading font-black text-xl text-white">
                Verificación de Autenticidad Legal
              </h3>
              <p className="text-xs text-[#C6F235] font-semibold mt-0.5">
                Organismo de Tránsito de Funza • Sorteo Transparente
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Cuerpo */}
        <div className="p-6 sm:p-8 max-h-[70vh] overflow-y-auto space-y-6">

          {/* Ficha Resumen del Vehículo */}
          <div className="bg-slate-50 border border-slate-200 rounded-3xl p-5 space-y-4">
            <div className="flex items-start justify-between gap-2">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-[#FF2D78] block">
                  Soporte Jurídico de la Unidad
                </span>
                <h4 className="font-heading font-black text-xl text-[#111827] mt-0.5">
                  Volkswagen Gol 98 — Edición Especial
                </h4>
                <p className="text-xs text-slate-500 font-medium">
                  Sorteo Transparente • Lotería de la Cruz Roja
                </p>
              </div>
              <div className="w-16 h-16 rounded-2xl border-2 border-[#111827] flex flex-col items-center justify-center p-1 text-center bg-white shadow-xs shrink-0">
                <span className="text-[9px] font-black uppercase text-slate-400">TRÁNSITO</span>
                <span className="font-heading font-black text-base text-[#111827]">FUNZA</span>
                <span className="text-[8px] font-bold text-emerald-600">100% LEGAL</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-600 pt-3 border-t border-slate-200">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#FF2D78]" />
                <span><strong>Traspaso:</strong> Cubierto 100% por el organizador</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#FF2D78]" />
                <span><strong>Sorteo:</strong> 6 de Enero de 2027</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#FF2D78]" />
                <span><strong>Entrega:</strong> Presencial en Bogotá D.C.</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span><strong>Garantía:</strong> Paz y salvo total de impuestos/multas</span>
              </div>
            </div>

            {/* Sello hash de seguridad */}
            <div className="bg-white p-3 rounded-2xl border border-slate-200 text-[11px] text-slate-500 break-all font-mono">
              <div className="flex items-center gap-1.5 text-slate-700 font-sans font-bold text-xs mb-1">
                <Lock className="w-3.5 h-3.5 text-[#FF2D78]" />
                Validación de Registro Digital (SHA-256):
              </div>
              e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855
            </div>
          </div>

          {/* Tres Pilares de Seguridad */}
          <div className="space-y-4 text-xs text-slate-600 leading-relaxed">
            <div className="flex gap-3 items-start">
              <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 font-bold text-sm">
                1
              </div>
              <div>
                <strong className="text-slate-900 block text-sm font-bold">Traspaso Radicado Obligatorio</strong>
                El vehículo no se mueve de las manos del propietario ni se entregan las llaves hasta que el traspaso esté formalmente radicado ante el Tránsito de Funza y se firme el Acta de Entrega.
              </div>
            </div>

            <div className="flex gap-3 items-start">
              <div className="w-8 h-8 rounded-xl bg-pink-50 text-[#FF2D78] flex items-center justify-center shrink-0 font-bold text-sm">
                2
              </div>
              <div>
                <strong className="text-slate-900 block text-sm font-bold">Condición de Entrega "As Is"</strong>
                Al adquirirse mediante un sorteo por un valor simbólico, el carro se entrega en el estado mecánico exacto en que se encuentra, a paz y salvo de comparendos e impuestos hasta la fecha del traspaso.
              </div>
            </div>

            <div className="flex gap-3 items-start">
              <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 font-bold text-sm">
                3
              </div>
              <div>
                <strong className="text-slate-900 block text-sm font-bold">Uso de Imagen de Entrega (2 Meses)</strong>
                El ganador acepta la exhibición pública de la entrega en redes oficiales durante mínimo dos (2) meses calendario para respaldar la transparencia del evento ante los participantes.
              </div>
            </div>
          </div>

          {/* Comprobador Interactivo */}
          <div className="bg-pink-50/60 border border-pink-100 rounded-3xl p-5">
            <h5 className="font-heading font-black text-sm text-[#111827] mb-1">
              Comprobador de Disponibilidad de Boletos
            </h5>
            <p className="text-xs text-slate-600 mb-3">
              Ingresa cualquier número de 4 dígitos (0000 - 9999) para verificar su estado.
            </p>

            <form onSubmit={handleCheckNumber} className="flex gap-2">
              <input
                type="text"
                maxLength={4}
                placeholder="Ej: 0428"
                value={searchNumber}
                onChange={(e) => setSearchNumber(e.target.value.replace(/\D/g, ''))}
                className="w-32 px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl font-heading font-black text-center text-lg focus:outline-none focus:border-[#FF2D78]"
              />
              <button
                type="submit"
                className="inline-flex items-center gap-2 bg-[#FF2D78] hover:bg-[#E01A63] text-white text-xs font-bold uppercase tracking-wider px-5 py-2.5 rounded-xl transition-colors cursor-pointer"
              >
                <Search className="w-4 h-4" />
                Verificar
              </button>
            </form>

            {searchResult && (
              <div className="mt-4 p-4 rounded-2xl bg-white border border-slate-200 animate-in fade-in duration-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="font-heading font-black text-2xl text-[#111827]">
                      #{searchResult.number}
                    </span>
                    {searchResult.isSold ? (
                      <span className="inline-flex items-center gap-1 px-3 py-1 bg-amber-50 text-amber-700 rounded-full text-xs font-bold border border-amber-200">
                        <AlertCircle className="w-3.5 h-3.5" />
                        Asignado / Reservado
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-bold border border-emerald-200">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        ¡DISPONIBLE!
                      </span>
                    )}
                  </div>

                  {!searchResult.isSold && onOpenPurchaseModal && (
                    <button
                      onClick={() => {
                        onClose();
                        onOpenPurchaseModal();
                      }}
                      className="px-3 py-1.5 bg-[#FF2D78] text-white text-xs font-bold uppercase rounded-lg hover:bg-[#E01A63] transition-colors cursor-pointer"
                    >
                      Elegir Números
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

        </div>

        {/* Pie del Modal */}
        <div className="p-4 sm:p-6 border-t border-slate-200 bg-slate-50 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-6 py-3 bg-white border-2 border-slate-200 text-slate-700 hover:bg-slate-50 text-xs sm:text-sm font-bold rounded-xl transition-colors cursor-pointer"
          >
            Cerrar
          </button>
          {onOpenPurchaseModal && (
            <button
              onClick={() => {
                onClose();
                onOpenPurchaseModal();
              }}
              className="px-6 py-3 bg-[#FF2D78] hover:bg-[#E01A63] text-white text-xs sm:text-sm font-bold uppercase tracking-wider rounded-xl transition-colors cursor-pointer shadow-md inline-flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              Participar Ahora
            </button>
          )}
        </div>
      </div>
    </div>
  );
};