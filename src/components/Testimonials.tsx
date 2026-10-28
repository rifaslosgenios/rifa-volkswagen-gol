import React from 'react';
import { Star, User } from 'lucide-react';

// Datos locales con 6 testimonios: fotos más naturales, avatares genéricos y mezcla de 4/5 estrellas.
const TESTIMONIALS_DATA = [
  {
    id: 1,
    name: 'Carlos Martínez',
    location: 'Medellín',
    role: 'Cliente verificado',
    quote: 'Pagué por Nequi y descargué mi comprobante en PDF de una vez. Todo muy claro y rápido. Con la fe intacta para ese Golcito 🙏',
    rating: 5,
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg', // Foto más natural y casual
    accentColor: '#E60012'
  },
  {
    id: 2,
    name: 'Laura Gómez',
    location: 'Bogotá',
    role: 'Cliente verificada',
    quote: 'La página está súper fácil de usar, los números se seleccionan rápido. Me dio un poco de dudas al principio, pero vi los medios de pago oficiales y me dio confianza.',
    rating: 4,
    avatar: null, // Avatar genérico
    accentColor: '#FFC93C'
  },
  {
    id: 3,
    name: 'Andrés Felipe',
    location: 'Cali',
    role: 'Cliente verificado',
    quote: 'Excelente plataforma, pude elegir mis números de la suerte sin problema. La atención por WhatsApp también es muy buena, responden de una.',
    rating: 5,
    avatar: 'https://randomuser.me/api/portraits/men/68.jpg', // Foto más natural y casual
    accentColor: '#1D2B22'
  },
  {
    id: 4,
    name: 'Diana Marcela',
    location: 'Bucaramanga',
    role: 'Cliente verificada',
    quote: 'Me gustó la transparencia de todo. El proceso fue súper bien, la plataforma no se traba y el ticket llega al instante. Esperando el sorteo con ansias.',
    rating: 4,
    avatar: null, // Avatar genérico
    accentColor: '#0B5D3B'
  },
  {
    id: 5,
    name: 'Jorge Eliécer',
    location: 'Barranquilla',
    role: 'Cliente verificado',
    quote: 'Ya tengo mis 5 números. La compra con Daviplata fue en segundos y me llegó el correo confirmando mi participación. Súper recomendado.',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=150&h=150&fit=crop&q=80', // Foto tipo playa natural
    accentColor: '#E60012'
  },
  {
    id: 6,
    name: 'Valentina Ríos',
    location: 'Pereira',
    role: 'Cliente verificada',
    quote: 'Es la primera vez que participo en algo así. Todo el proceso se ve muy legal y seguro. ¡Ojalá me lo gane, está precioso el carro!',
    rating: 4,
    avatar: null, // Avatar genérico
    accentColor: '#FFC93C'
  }
];

export const Testimonials: React.FC = () => {
  return (
    <section className="pt-2 pb-6 lg:pt-6 lg:pb-10 bg-white" data-purpose="participants-testimonials">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* TÍTULO ACTUALIZADO Y MÁS COMPACTO */}
        <div className="text-center max-w-2xl mx-auto mb-8 lg:mb-10">
          <span className="text-[11px] lg:text-xs font-black tracking-widest uppercase text-[#E60012]">
            CONFIANZA Y TRANSPARENCIA
          </span>
          <h2 className="font-heading font-black text-2xl sm:text-3xl lg:text-4xl text-[#111827] mt-1.5 tracking-tight uppercase">
            ESTO DICEN NUESTROS CLIENTES
          </h2>
        </div>

        {/* GRILLA COMPACTA: 3 columnas en PC, 2 en Tablet, 1 en Celular */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5">
          {TESTIMONIALS_DATA.map((t) => (
            <div
              key={t.id}
              className="bg-slate-50 p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow-md transition-all"
            >
              <div>
                <div className="flex mb-3 gap-0.5">
                  {/* ESTRELLAS MÁS PEQUEÑAS */}
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${i < t.rating ? 'fill-amber-400 text-amber-400' : 'fill-slate-200 text-slate-200'}`}
                    />
                  ))}
                </div>
                {/* TEXTO CON MENOS MARGEN Y MÁS PEQUEÑO */}
                <p className="text-[13px] sm:text-[14px] text-slate-700 font-medium italic leading-snug mb-4">
                  "{t.quote}"
                </p>
              </div>

              <div className="flex items-center gap-3 pt-3 border-t border-slate-200/80 mt-auto">
                {/* FOTOS/AVATARES MÁS PEQUEÑOS (w-9 h-9) */}
                {t.avatar ? (
                  <img
                    alt={t.name}
                    referrerPolicy="no-referrer"
                    src={t.avatar}
                    className="w-9 h-9 rounded-full object-cover border-2 shrink-0"
                    style={{ borderColor: t.accentColor }}
                  />
                ) : (
                  <div
                    className="w-9 h-9 rounded-full bg-slate-200 flex items-center justify-center border-2 shrink-0 text-slate-400"
                    style={{ borderColor: t.accentColor }}
                  >
                    <User className="w-5 h-5" />
                  </div>
                )}

                <div className="min-w-0">
                  <span className="font-heading font-bold text-[13px] text-[#111827] block leading-tight truncate">
                    {t.name} <span className="font-normal text-slate-500 text-[11px]">({t.location})</span>
                  </span>
                  <span className="text-[11px] text-slate-500 font-semibold block mt-0.5">
                    {t.role}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};