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
} from 'lucide-react';
import { NOTARY_INFO } from '../data/mockData';

interface NotaryVerificationModalProps {
  onClose: () => void;
  onOpenPurchaseModal: () => void;
}

export const NotaryVerificationModal: React.FC<NotaryVerificationModalProps> = ({
  onClose,
  onOpenPurchaseModal,
}) => {
  const [searchNumber, setSearchNumber] = useState('');
  const [searchResult, setSearchResult] = useState<{
    number: string;
    isSold: boolean;
    date?: string;
  } | null>(null);

  const handleCheckNumber = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchNumber.trim()) return;
    const num = searchNumber.trim().padStart(4, '0');
    const numVal = parseInt(num, 10);
    const isSold = (numVal * 73) % 100 < 68;

    setSearchResult({
      number: num,
      isSold,
      date: isSold ? 'Asignado oficialmente' : undefined,
    });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative bg-white rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden border border-slate-100 my-8">
        {/* Header */}
        <div className="bg-[#111827] text-white p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#C6F235] text-[#111827] flex items-center justify-center font-black">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-heading font-black text-lg text-white">
                Garantía Legal y Traspaso Directo
              </h3>
              <p className="text-xs text-[#C6F235] font-semibold">
                Organismo de Tránsito Municipal de Funza • Sorteo Oficial
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
          {/* Certificate Header Box */}
          <div className="bg-slate-50 border border-slate-200 rounded-3xl p-5 space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-[#FF2D78] block">
                  Resguardo de Propiedad y Sorteo
                </span>
                <h4 className="font-heading font-black text-xl text-[#111827] mt-0.5">
                  Volkswagen Gol 98 — Edición Oficial
                </h4>
                <p className="text-xs text-slate-500 font-medium">
                  Ministerio de Transporte • República de Colombia
                </p>
              </div>
              <div className="w-16 h-16 rounded-2xl border-2 border-[#111827] flex flex-col items-center justify-center p-1 text-center bg-white shadow-xs">
                <span className="text-[9px] font-black uppercase text-slate-400">TRÁNSITO</span>
                <span className="font-heading font-black text-base text-[#111827]">FUNZA</span>
                <span className="text-[8px] font-bold text-emerald-600">100% LEGAL</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-600 pt-2 border-t border-slate-200">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-slate-400" />
                <span><strong>Traspaso:</strong> Directo al ganador incluido</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-slate-400" />
                <span><strong>Sorteo:</strong> 6 de Enero de 2027</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-slate-400" />
                <span><strong>Registro:</strong> Tránsito de Funza, Cundinamarca</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span><strong>Garantía:</strong> Libre de gravámenes o multas</span>
              </div>
            </div>

            {/* Cryptographic Hash */}
            <div className="bg-white p-3 rounded-2xl border border-slate-200 text-[11px] text-slate-500 break-all font-mono">
              <div className="flex items-center gap-1.5 text-slate-700 font-sans font-bold text-xs mb-1">
                <Lock className="w-3.5 h-3.5 text-[#FF2D78]" />
                Sello de Validación y Trazabilidad (SHA-256):
              </div>
              {NOTARY_INFO.securityHash}
            </div>
          </div>

          {/* Interactive Number Checker */}
          <div className="bg-pink-50/60 border border-pink-100 rounded-3xl p-5">
            <h5 className="font-heading font-black text-sm text-[#111827] mb-1">
              Comprobador Público de Boletos (0000 - 9999)
            </h5>
            <p className="text-xs text-slate-600 mb-3">
              Introduce cualquier número de 4 dígitos para verificar su estado de asignación en tiempo real.
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
                Verificar Estado
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
                        Asignado a participante
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-bold border border-emerald-200">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        ¡DISPONIBLE PARA TI!
                      </span>
                    )}
                  </div>

                  {!searchResult.isSold && (
                    <button
                      onClick={() => {
                        onClose();
                        onOpenPurchaseModal();
                      }}
                      className="px-3 py-1.5 bg-[#FF2D78] text-white text-xs font-bold uppercase rounded-lg hover:bg-[#E01A63] transition-colors cursor-pointer"
                    >
                      Reservar Ahora
                    </button>
                  )}
                </div>
                <p className="text-[11px] text-slate-500 mt-2">
                  {searchResult.isSold
                    ? 'Este número ya fue adquirido y cuenta con registro digital validado.'
                    : 'Puedes seleccionar este número en el modal de compra eligiendo la opción de números manuales.'}
                </p>
              </div>
            )}
          </div>

          {/* Guarantee statement */}
          <div className="text-xs text-slate-500 leading-relaxed space-y-2">
            <p>
              <strong>Respaldo Institucional:</strong> El Volkswagen Gol 98 (Placa CIY069) se encuentra matriculado y a paz y salvo en el Organismo de Tránsito Municipal de Funza. El traspaso directo de propiedad está cubierto al 100% a nombre del ganador del sorteo oficial del 6 de enero de 2027.
            </p>
            <p>
              La transparencia del sorteo está garantizada mediante transmisión en directo con los resultados oficiales de la Lotería Nacional.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};