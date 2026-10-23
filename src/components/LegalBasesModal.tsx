import React from 'react';
import { X, ShieldCheck, Scale, FileText, Download, CheckCircle2 } from 'lucide-react';
import { NOTARY_INFO } from '../data/mockData';

interface LegalBasesModalProps {
  onClose: () => void;
}

export const LegalBasesModal: React.FC<LegalBasesModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative bg-white rounded-3xl max-w-3xl w-full shadow-2xl overflow-hidden border border-slate-100 my-8">
        {/* Header */}
        <div className="bg-[#111827] text-white p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#FF2D78] flex items-center justify-center text-white">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-heading font-black text-lg text-white">
                Bases Legales Notariales Oficiales
              </h3>
              <p className="text-xs text-slate-400">
                {NOTARY_INFO.protocol} • Ilustre Colegio Notarial de Madrid
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
        <div className="p-6 max-h-[75vh] overflow-y-auto space-y-6 text-xs text-slate-600 leading-relaxed">
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
            <div className="flex items-center gap-2 text-slate-800 font-bold text-sm mb-1">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Depósito y Protocolización Jurídica
            </div>
            <p>
              Las presentes bases han sido protocolizadas con fecha 30 de junio de 2025 ante el Ilustre Notario del Colegio de Madrid, {NOTARY_INFO.notaryName}, con despacho profesional en {NOTARY_INFO.address}, bajo el {NOTARY_INFO.protocol}.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <h4 className="font-heading font-bold text-sm text-[#111827] mb-1">
                1. OBJETO Y DESCRIPCIÓN DEL PREMIO
              </h4>
              <p>
                El premio consiste en un automóvil de turismo nuevo a estrenar (0 km), modelo <strong>Mini Cooper Cabrio S</strong> acabado especial Glam Perlado, con cambio automático Steptronic de doble embrague de 7 velocidades y motor gasolina TwinPower Turbo 2.0L de 178 CV. El valor comercial oficial del premio asciende a cuarenta y cinco mil ochocientos noventa euros (45.890 €). Adicionalmente, incluye una tarjeta de carburante prepago por valor de mil quinientos euros (1.500 €) correspondiente a la estimación anual de combustible.
              </p>
            </div>

            <div>
              <h4 className="font-heading font-bold text-sm text-[#111827] mb-1">
                2. EXENCIÓN DE GASTOS Y TRIBUTACIÓN
              </h4>
              <p>
                La entidad organizadora asume íntegramente los gastos de matriculación oficial ante la Dirección General de Tráfico (DGT), la expedición del permiso de circulación, el pago del Impuesto de Transmisiones Patrimoniales o IVA según corresponda, la ITV en vigor y una póliza de seguro a todo riesgo durante los primeros 12 meses computados desde la entrega de llaves.
              </p>
            </div>

            <div>
              <h4 className="font-heading font-bold text-sm text-[#111827] mb-1">
                3. EMISIÓN DE BOLETOS Y NUMERACIÓN
              </h4>
              <p>
                La serie completa consta estrictamente de <strong>diez mil (10.000) números</strong> correlativos comprendidos entre el 0000 y el 9999, ambos inclusive. Cada boleto otorga a su poseedor una participación legalmente acreditada e indivisible. Ningún número será emitido por duplicado.
              </p>
            </div>

            <div>
              <h4 className="font-heading font-bold text-sm text-[#111827] mb-1">
                4. CELEBRACIÓN DEL SORTEO
              </h4>
              <p>
                El sorteo se efectuará en acto público y retransmitido en directo mediante streaming audiovisual. La extracción del número ganador se realizará ante notario mediante bombo electrónico criptográfico certificado por laboratorio acreditado. Si el primer número extraído no hubiera sido adjudicado a un participante válido, se procederá a extracciones sucesivas de reserva hasta obtener un participante registrado, garantizando siempre la entrega del premio.
              </p>
            </div>

            <div>
              <h4 className="font-heading font-bold text-sm text-[#111827] mb-1">
                5. ENTREGA DE LLAVES Y TRANSPORTE
              </h4>
              <p>
                El ganador será notificado de inmediato por teléfono, WhatsApp y correo electrónico certificado. La entrega del vehículo se realizará en la ciudad o domicilio del ganador dentro del territorio peninsular sin coste alguno mediante plataforma de transporte homologada, o en el concesionario oficial de su preferencia.
              </p>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
            <span className="text-[11px] text-slate-400">
              Chic &amp; Glam Sweepstakes S.L. • CIF B-88930192
            </span>
            <button
              onClick={() => {
                alert('Descargando copia legal certificada en formato PDF...');
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-[#111827] text-xs font-bold rounded-xl transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              Descargar Bases en PDF
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
