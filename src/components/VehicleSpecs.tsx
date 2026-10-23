import React from 'react';
import { ArrowRight, Eye } from 'lucide-react';
import { VEHICLE_SPECS } from '../data/mockData';
import { VehicleSpec } from '../types';

interface VehicleSpecsProps {
  onSelectSpec: (spec: VehicleSpec) => void;
}

export const VehicleSpecs: React.FC<VehicleSpecsProps> = ({ onSelectSpec }) => {
  return (
    <section className="py-20 bg-white" data-purpose="vehicle-specifications" id="premio">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-black tracking-widest uppercase text-[#FF2D78]">
            CLÁSICO, CONFIABLE Y LISTO PARA RODAR
          </span>
          <h2 className="font-heading font-black text-3xl sm:text-5xl text-[#111827] mt-2 tracking-tight">
            DETALLES DEL CLÁSICO DE TUS SUEÑOS
          </h2>
          <p className="text-slate-600 mt-3 text-base sm:text-lg font-medium">
            Volkswagen Gol 98 (Placa CIY069) en excelente estado, matriculado directamente a nombre del ganador con todos los impuestos, traspaso legal y documentos al día.
          </p>
        </div>

        {/* 4 Spec Photo Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {VEHICLE_SPECS.map((spec) => (
            <div
              key={spec.id}
              onClick={() => onSelectSpec(spec)}
              className="group bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-glow-card transition-all duration-300 cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="relative h-48 overflow-hidden bg-slate-900">
                  <img
                    alt={spec.title}
                    referrerPolicy="no-referrer"
                    src={spec.image}
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                  <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-white">
                    <span className="font-heading font-bold text-sm tracking-wide uppercase">
                      {spec.title}
                    </span>
                    <span className="w-7 h-7 rounded-full bg-[#FF2D78] flex items-center justify-center text-xs group-hover:scale-110 transition-transform shadow-sm">
                      <ArrowRight className="w-3.5 h-3.5 text-white" />
                    </span>
                  </div>
                </div>

                <div className="p-5">
                  {/* Se aumentó a text-sm para mayor legibilidad sin hacer zoom */}
                  <p className="text-sm text-slate-700 font-medium leading-relaxed">
                    {spec.shortDesc}
                  </p>
                </div>
              </div>

              <div className="px-5 pb-5 pt-1 flex items-center justify-between text-xs font-bold text-[#FF2D78] group-hover:underline">
                <span className="flex items-center gap-1.5">
                  <Eye className="w-4 h-4" />
                  Ver especificación técnica
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};