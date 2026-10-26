import React from 'react';
import {
  X,
  Scale,
  ShieldCheck,
  Car,
  Calendar,
  FileCheck,
  UserCheck,
  AlertTriangle,
  Building2,
  Lock,
  Award,
  Sparkles,
  HelpCircle
} from 'lucide-react';

interface LegalBasesModalProps {
  onClose: () => void;
}

export const LegalBasesModal: React.FC<LegalBasesModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="relative bg-white rounded-3xl max-w-3xl w-full shadow-2xl overflow-hidden border border-slate-100 my-6 sm:my-8">

        {/* Encabezado */}
        <div className="bg-[#111827] text-white p-6 sm:p-8 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#FF2D78] flex items-center justify-center text-white font-black shadow-lg shrink-0">
              <Scale className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-heading font-black text-xl sm:text-2xl text-white">
                Términos y Condiciones Oficiales
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
                Reglamento legal completo y marco normativo del sorteo
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer shrink-0"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Cuerpo con Scroll */}
        <div className="p-6 sm:p-8 max-h-[70vh] overflow-y-auto space-y-8 text-xs sm:text-sm text-slate-700 leading-relaxed">

          {/* Banner de Garantía */}
          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 flex items-start gap-3">
            <ShieldCheck className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
            <div className="text-xs text-slate-600">
              <strong className="text-slate-900 block font-bold text-sm mb-1">
                Aceptación de Reglamento y Transparencia
              </strong>
              El presente documento rige de manera obligatoria la participación en el sorteo del vehículo Volkswagen Gol 1998. Toda persona que adquiera uno o más números declara conocer, comprender y aceptar en su totalidad las siguientes bases legales.
            </div>
          </div>

          {/* Cláusula 1: Objeto y Condición Mechanical (As Is) */}
          <section className="space-y-2">
            <h4 className="flex items-center gap-2 font-heading font-black text-base text-[#111827] border-b border-slate-200 pb-2">
              <Car className="w-5 h-5 text-[#FF2D78]" />
              1. OBJETO DEL PREMIO Y EXONERACIÓN DE GARANTÍAS ("AS IS")
            </h4>
            <p>
              El premio principal e indivisible consiste en un vehículo usado marca <strong>Volkswagen Gol modelo 1998</strong>. El organizador garantiza que, al momento de la entrega, el vehículo se encuentra <strong>100% a paz y salvo</strong>, libre de gravámenes, embargos, pignoraciones, multas, comparendos, pleitos judiciales o cualquier limitación al dominio. Se entrega con SOAT, revisión técnico-mecánica e impuestos vehiculares vigentes hasta la fecha de radicación del traspaso.
            </p>
            <p className="bg-amber-50 p-4 rounded-xl border border-amber-200 text-amber-900 text-xs font-medium mt-2 leading-relaxed">
              <strong>Exención Explícita de Garantías (Saneamiento):</strong> Al tratarse de un vehículo usado obtenido por un valor ínfimo frente a su valor comercial, el ganador acepta recibirlo en el estado físico, estético y mecánico exacto en que se encuentra (modalidad <em>"As is"</em>). El ganador renuncia expresamente a la acción de saneamiento por vicios ocultos y exime al organizador de cualquier garantía mecánica, eléctrica o estructural posterior a la entrega. Se aconseja y es responsabilidad del ganador realizar las revisiones mecánicas preventivas de su preferencia antes de transitar trayectos largos.
            </p>
          </section>

          {/* Cláusula 2: Entrega, Traspaso en Funza y Traslado de Responsabilidad */}
          <section className="space-y-2">
            <h4 className="flex items-center gap-2 font-heading font-black text-base text-[#111827] border-b border-slate-200 pb-2">
              <FileCheck className="w-5 h-5 text-[#FF2D78]" />
              2. LUGAR DE ENTREGA, TRASPASO EN FUNZA Y TRASLADO DE RESPONSABILIDAD
            </h4>
            <p>
              El ganador dispone de un plazo máximo e improrrogable de <strong>treinta (30) días calendario</strong> contados a partir del sorteo para reclamar el premio. La entrega física del vehículo se realizará <strong>única y exclusivamente en Bogotá D.C.</strong> Si el ganador habita en otra ciudad o municipio, los costos de transporte, tiquetes o servicio de grúa corren 100% por su cuenta.
            </p>
            <p className="bg-slate-100 p-4 rounded-xl border border-slate-200 text-slate-800 text-xs font-medium mt-2">
              <strong>Condición Innegociable de Entrega:</strong> Por seguridad jurídica de ambas partes, el vehículo no se entregará ni se cederán sus llaves hasta que el traspaso cerrado esté <strong>formalmente radicado ante la Secretaría de Tránsito de Funza</strong> y se haya firmado el "Acta de Entrega y Recepción". A partir del momento exacto de la firma de dicha acta y recepción del vehículo, toda responsabilidad civil, penal, extracontractual, de tránsito y todo costo futuro corresponde única y exclusivamente al ganador.
            </p>
          </section>

          {/* Cláusula 3: Gastos e Impuestos */}
          <section className="space-y-2">
            <h4 className="flex items-center gap-2 font-heading font-black text-base text-[#111827] border-b border-slate-200 pb-2">
              <Building2 className="w-5 h-5 text-[#FF2D78]" />
              3. COBERTURA DE GASTOS LEGALES E IMPUESTOS
            </h4>
            <p>
              El organizador asume el <strong>100% de los costos correspondientes a los derechos de radicación del traspaso</strong> ante el Tránsito de Funza, así como los gastos notariales inherentes al trámite y las retenciones exigidas por la entidad de tránsito para efectuar la cesión de propiedad.
            </p>
            <p>
              Cualquier impuesto o costo posterior (impuesto vehicular de periodos siguientes a la entrega, ganancia ocasional, renta o afectaciones al patrimonio futuro del ganador) será asumido en su totalidad por el ganador.
            </p>
          </section>

          {/* Cláusula 4: Sorteo y Punto de Equilibrio (70%) */}
          <section className="space-y-2">
            <h4 className="flex items-center gap-2 font-heading font-black text-base text-[#111827] border-b border-slate-200 pb-2">
              <Calendar className="w-5 h-5 text-[#FF2D78]" />
              4. MECÁNICA, PUNTO DE EQUILIBRIO (70%) Y CONTINGENCIAS
            </h4>
            <p>
              El sorteo consta de 10.000 números (del 0000 al 9999). El ganador será el poseedor del boleto cuyas 4 cifras coincidan en estricto orden con el Premio Mayor de la <strong>Lotería de la Cruz Roja</strong> programado para el <strong>6 de enero de 2027</strong>.
            </p>
            <p>
              <strong>Punto de Equilibrio (70%):</strong> Se establece una meta mínima del <strong>70% de la boletería vendida</strong> para la realización del sorteo. En caso de no alcanzar dicho Porcentaje en la fecha estipulada, el sorteo se aplazará a la fecha oficial inmediatamente posterior de la misma lotería hasta completar la meta, conservando total validez todos los números previamente adquiridos. Si por fuerza mayor la Lotería de la Cruz Roja no juega, se utilizará el sorteo inmediatamente siguiente o la Lotería de Bogotá/Cundinamarca del día hábil posterior.
            </p>
          </section>

          {/* Cláusula 5: Requisitos y Tutor Legal */}
          <section className="space-y-2">
            <h4 className="flex items-center gap-2 font-heading font-black text-base text-[#111827] border-b border-slate-200 pb-2">
              <UserCheck className="w-5 h-5 text-[#FF2D78]" />
              5. REQUISITOS DE PARTICIPACIÓN Y TUTOR LEGAL
            </h4>
            <p>
              La adquisición de números es una decisión libre y voluntaria. Para reclamar el premio, el titular registrado debe ser mayor de 18 años y presentar su cédula original. Si un menor de edad resulta ganador, el trámite de traspaso y la titularidad del vehículo deberán ser asumidos obligatoriamente por su <strong>tutor legal debidamente certificado ante la ley colombiana</strong>.
            </p>
          </section>

          {/* Cláusula 6: Habeas Data y Cesión Obligatoria de Imagen (2 Meses) */}
          <section className="space-y-2">
            <h4 className="flex items-center gap-2 font-heading font-black text-base text-[#111827] border-b border-slate-200 pb-2">
              <Lock className="w-5 h-5 text-[#FF2D78]" />
              6. TRATAMIENTO DE DATOS (LEY 1581) Y DERECHOS DE IMAGEN
            </h4>
            <p>
              Los datos personales recolectados (nombre, cédula, teléfono, correo) serán protegidos bajo la Ley 1581 de 2012 de Habeas Data y se utilizarán exclusivamente para la logística del sorteo, verificación de compras y trámites de traspaso.
            </p>
            <p className="bg-pink-50 p-4 rounded-xl border border-pink-200 text-slate-800 text-xs font-medium mt-2 leading-relaxed">
              <strong>Cesión Obligatoria de Imagen para Transparencia:</strong> Para demostrar la veracidad del evento ante los participantes, el ganador acepta de manera obligatoria ceder los derechos de uso de su imagen (fotografía y video) de la entrega del premio para su publicación en las redes sociales y sitio web del organizador. El participante acepta de forma estricta un <strong>periodo mínimo obligatorio e innegociable de dos (2) meses calendario de permanencia pública</strong> del contenido contados desde la entrega. Vencido este plazo de 2 meses, el ganador podrá ejercer su derecho de petición si desea solicitar el retiro de dicho material de las plataformas.
            </p>
          </section>

          {/* Cláusula 7: Anti-Fraude, Fondos Lícitos y Fuerza Mayor */}
          <section className="space-y-2">
            <h4 className="flex items-center gap-2 font-heading font-black text-base text-[#111827] border-b border-slate-200 pb-2">
              <AlertTriangle className="w-5 h-5 text-[#FF2D78]" />
              7. PREVENCIÓN DE FRAUDE, FONDOS LÍCITOS Y FUERZA MAYOR
            </h4>
            <p>
              Solo participan los números cuyo pago se encuentre <strong>efectivamente reflejado y disponible en las cuentas del organizador</strong>. El comprador declara que sus fondos provienen de actividades lícitas. Los boletos no son reembolsables. La organización jamás solicitará dinero extra por "envíos", "seguros" o "pólizas" para entregar el vehículo.
            </p>
            <p>
              En caso de pérdida total, robo o destrucción del vehículo por fuerza mayor antes de la radicación del traspaso, el organizador entregará el valor comercial equivalente en efectivo al ganador o cancelará el evento devolviendo el valor de los boletos a todos los participantes.
            </p>
          </section>

          {/* Cláusula 8: Independencia de Marcas */}
          <section className="space-y-2">
            <h4 className="flex items-center gap-2 font-heading font-black text-base text-[#111827] border-b border-slate-200 pb-2">
              <Award className="w-5 h-5 text-[#FF2D78]" />
              8. DESCARGO DE ALIANZAS Y MARCAS
            </h4>
            <p>
              Este sorteo es una actividad privada e independiente. No existe ningún tipo de convenio, patrocinio, alianza ni vinculación comercial o gubernamental con la marca Volkswagen, la Secretaría de Tránsito de Funza, la Lotería de la Cruz Roja, ni con ninguna entidad pública o privada mencionada con fines informativos o de referencia.
            </p>
          </section>

        </div>

        {/* Footer */}
        <div className="p-4 sm:p-6 border-t border-slate-200 bg-slate-50 flex justify-end">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-8 py-3 bg-[#111827] hover:bg-slate-800 text-white text-xs sm:text-sm font-bold uppercase tracking-wider rounded-xl transition-colors cursor-pointer text-center"
          >
            Acepto Términos y Condiciones
          </button>
        </div>
      </div>
    </div>
  );
};