import { TicketPackage, VehicleSpec, FaqItem, TestimonialItem } from '../types';

// 1. Carrusel Superior: Exclusivamente las fotos con moño (M) para el Hero
export const HERO_CAROUSEL_PHOTOS = Array.from({ length: 28 }, (_, index) => {
  return new URL(`../assets/galeria/gol M (${index + 1}).jpeg`, import.meta.url).href;
});

// 2. Galería Completa Inferior: Intercaladas Femenino (F) y Masculino (H)
const femalePhotos = Array.from({ length: 17 }, (_, index) => {
  return new URL(`../assets/galeria/gol F (${index + 1}).jpeg`, import.meta.url).href;
});

const malePhotos = Array.from({ length: 13 }, (_, index) => {
  return new URL(`../assets/galeria/gol H (${index + 1}).jpeg`, import.meta.url).href;
});

// Mezcla intercalada: una de mujer y una de hombre de manera sucesiva
export const VEHICLE_GALLERY_PHOTOS: string[] = [];
const maxLength = Math.max(femalePhotos.length, malePhotos.length);
for (let i = 0; i < maxLength; i++) {
  if (i < femalePhotos.length) VEHICLE_GALLERY_PHOTOS.push(femalePhotos[i]);
  if (i < malePhotos.length) VEHICLE_GALLERY_PHOTOS.push(malePhotos[i]);
}

// Rutas estáticas para las tarjetas técnicas del vehículo
import motorImg from '../assets/galeria/gol H (2).jpeg';
import exteriorImg from '../assets/galeria/gol F (5).jpeg';
import papersImg from '../assets/galeria/gol H (4).jpeg';
import fuelImg from '../assets/galeria/gol M (1).jpeg';

export const NOTARY_INFO = {
  number: 1,
  notaryName: 'Sorteo Oficial de Lotería Nacional',
  college: 'Ministerio de Transporte - República de Colombia',
  protocol: 'Protocolo Legal / Traspaso Directo al Ganador',
  address: 'Organismo de Tránsito Municipal de Funza, Cundinamarca',
  date: '2027-01-06',
  license: 'Sorteo Oficial Día de Reyes 2027',
  securityHash: '8f7a29bc41d08e5473e659b8a09f3e12c478d10b78c93a02f65a19820bc6a47e',
  bomboType: 'Sorteo Oficial Lotería Nacional de Colombia',
  totalNumbers: 10000,
  soldNumbers: 6840,
  initialPercentage: 68.4,
};

export const TICKET_PACKAGES: TicketPackage[] = [
  {
    id: 'single',
    name: 'Boleto Genio',
    tagline: 'Opción Clásica',
    badge: '1 Número',
    badgeType: 'classic',
    description: 'Prueba tu suerte con una participación única y segura.',
    price: 5000,
    ticketCount: 1,
    bonusTickets: 0,
    totalNumbers: 1,
    features: [
      '1 número asignado al azar (0000 - 9999)',
      'Certificado digital con código QR de verificación',
      'Notificación instantánea por WhatsApp y Correo',
    ],
    buttonText: 'Seleccionar 1 Boleto',
  },
  {
    id: 'pack5',
    name: 'Pack Super Genio',
    tagline: 'Súper Oportunidad',
    badge: '5 Boletos (+1 GRATIS)',
    badgeType: 'featured',
    description: 'Multiplica tus posibilidades de conducir tu propio Volkswagen Gol.',
    price: 25000,
    originalPrice: 30000,
    discountLabel: '-17% AHORRO',
    ticketCount: 5,
    bonusTickets: 1,
    totalNumbers: 6,
    isPopular: true,
    features: [
      '6 números en total (5 pagados + 1 de regalo)',
      'Tanque lleno de gasolina de cortesía incluido',
      'Acceso al streaming en directo del sorteo',
      'Garantía de traspaso legal directo en Tránsito',
    ],
    buttonText: 'COMPRAR PACK ESTRELLA ($25.000 COP)',
  },
  {
    id: 'pack12',
    name: 'Pack Inversor Genio',
    tagline: 'Máxima Probabilidad',
    badge: '12 Números',
    badgeType: 'vip',
    description: 'Para quienes quieren asegurar al máximo las opciones de ganar.',
    price: 50000,
    originalPrice: 60000,
    discountLabel: '-20% AHORRO',
    ticketCount: 12,
    bonusTickets: 0,
    totalNumbers: 12,
    features: [
      '12 números únicos sin repetición',
      'Tanque lleno de gasolina incluido',
      'Prioridad en la entrega directa a domicilio',
      'Línea de soporte preferente 24/7 vía WhatsApp',
    ],
    buttonText: 'Seleccionar Pack ($50.000 COP)',
  },
];

export const VEHICLE_SPECS: VehicleSpec[] = [
  {
    id: 'motor',
    title: 'Mecánica y Motor Renovados',
    subtitle: 'Volkswagen Gol Mi 1.6L (Modelo 1998)',
    image: motorImg,
    shortDesc: 'Motor de 1.600 cc completamente optimizado con repuestos nuevos para máxima confiabilidad.',
    fullDesc: 'Este clásico Volkswagen Gol 98 (Placa CIY069, Color Negro Universal, Carrocería Coupé) ha recibido una renovación mecánica profunda para garantizar un rendimiento impecable en carretera colombiana.',
    features: [
      'Correa de repartición nueva',
      'Aceite y filtros nuevos',
      'Sensor de oxígeno nuevo',
      'Bomba y pila de la gasolina nuevas',
      'Instalación de bornes de batería nuevos y tapa del timer nueva',
    ],
    technicalData: {
      'Placa': 'CIY069',
      'Modelo': '1998',
      'Cilindrada': '1.600 cc',
      'Combustible': 'Gasolina',
      'Carrocería': 'Coupé (3 puertas)',
      'Color': 'Negro Universal',
    },
  },
  {
    id: 'exterior',
    title: 'Estética y Seguridad',
    subtitle: 'Llantas Nuevas, Rines de Lujo y Farolas',
    image: exteriorImg,
    shortDesc: 'Apariencia impecable equipada con rines de lujo, llantas nuevas y farolas traseras renovadas.',
    fullDesc: 'El vehículo luce radiante y seguro para rodar, incorporando componentes de iluminación y rodamiento completamente nuevos que realzan su estilo clásico.',
    features: [
      'Llantas nuevas de alta adherencia',
      'Rines de lujo deportivos',
      'Farolas traseras y bombillos nuevos',
      'Cuchillas del limpiaparabrisas nuevas',
    ],
    technicalData: {
      'Rodamiento': 'Llantas y rines nuevos',
      'Iluminación': 'Farolas y bombillos nuevos',
      'Visibilidad': 'Limpiaparabrisas nuevos',
    },
  },
  {
    id: 'papeles',
    title: 'Papeles al Día y Traspaso',
    subtitle: 'Tránsito de Funza - 100% Legal',
    image: papersImg,
    shortDesc: 'Documentación al día y traspaso legal cubierto directamente a nombre del ganador.',
    fullDesc: 'Cero complicaciones administrativas. El carro se entrega con SOAT, revisión tecnomecánica vigentes, impuestos al día y el traspaso inscrito directamente en el Organismo de Tránsito de Funza con todos los gastos cubiertos.',
    features: [
      'Traspaso legal a nombre del ganador cubierto al 100%',
      'Matriculado en el Tránsito de Funza, Cundinamarca',
      'SOAT y Tecnomecánica vigentes',
      'Impuestos municipales totalmente al día',
    ],
    technicalData: {
      'Organismo de Tránsito': 'Funza, Cundinamarca',
      'Traspaso': 'Incluido y pagado',
      'Estado Legal': 'Paz y salvo total',
    },
  },
  {
    id: 'regalo',
    title: 'Tanque Lleno de Cortesía',
    subtitle: '¡Listo para Rodar de Inmediato!',
    image: fuelImg,
    shortDesc: 'Te entregamos el carro con el tanque completamente lleno de gasolina.',
    fullDesc: 'Queremos que desde el primer segundo en que recibas tu Volkswagen Gol 98 disfrutes la experiencia al máximo sin preocuparte por tanquear. ¡Llave en mano y tanque lleno!',
    features: [
      'Tanque de combustible 100% lleno',
      'Kit de carretera reglamentario incluido',
      'Lavado general y detailing previo a entrega',
    ],
    technicalData: {
      'Obsequio': 'Tanque lleno de combustible',
      'Entrega': 'Llave en mano en todo el país',
    },
  },
];

export const TESTIMONIALS: TestimonialItem[] = [
  {
    id: 'carlos',
    name: 'Carlos Martínez',
    location: 'Medellín',
    role: 'Participante Verificado',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=200',
    quote: '"Compré mi boleto con fe en Rifa los Genios y recibí mis números al instante por WhatsApp y correo. Todo el proceso ha sido transparente y muy claro. ¡Recomendados!"',
    rating: 5,
    accentColor: '#FF2D78',
  },
  {
    id: 'andres',
    name: 'Andrés Parra',
    location: 'Bogotá',
    role: 'Participante Verificado',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&q=80&w=200',
    quote: '"La plataforma es súper fácil de usar, pagué por Nequi, subí mi comprobante y a los pocos minutos tenía mis boletos listos y guardados en la sección Mis Boletos."',
    rating: 5,
    accentColor: '#C6F235',
  },
  {
    id: 'diana',
    name: 'Diana Rojas',
    location: 'Cali',
    role: 'Participante Verificada',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200',
    quote: '"Un método muy económico y transparente. Con solo $5.000 pesos tener la oportunidad de ganarse un carro clásico es una gran iniciativa. ¡Ya tengo mis números para Reyes!"',
    rating: 5,
    accentColor: '#FF2D78',
  },
  {
    id: 'felipe',
    name: 'Felipe Ospina',
    location: 'Barranquilla',
    role: 'Participante Verificado',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=200',
    quote: '"Me dio mucha confianza ver que el sorteo se rige con la Lotería Nacional y que los pagos por Nequi y Daviplata son directos. ¡Excelente atención al cliente!"',
    rating: 5,
    accentColor: '#C6F235',
  },
  {
    id: 'laura',
    name: 'Laura Gómez',
    location: 'Bucaramanga',
    role: 'Participante Verificada',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=200',
    quote: '"Compré el pack de 6 números y el proceso fue clarísimo. Me llegó el PDF con el código QR al instante a mi correo. ¡Esperando con ansias el sorteo!"',
    rating: 5,
    accentColor: '#FF2D78',
  },
  {
    id: 'mateo',
    name: 'Mateo Henao',
    location: 'Pereira',
    role: 'Participante Verificado',
    avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&q=80&w=200',
    quote: '"Increíble que por tan poco dinero se pueda participar por un vehículo en tan buen estado. Muy serios y organizados en Rifa los Genios."',
    rating: 5,
    accentColor: '#C6F235',
  },
];

export const FAQ_ITEMS: FaqItem[] = [
  {
    id: 'faq1',
    question: '¿Cómo y cuándo recibiré mis números de participación?',
    answer: 'De forma inmediata tras completar tu pago y validar el comprobante. Recibirás un correo electrónico y un mensaje de WhatsApp con tu comprobante oficial en PDF, que incluye el código QR y tus números elegidos. Además, tus boletos quedan guardados en la sección "Mis Boletos" de esta misma página.',
  },
  {
    id: 'faq2',
    question: '¿Qué ocurre si no se vende la totalidad de los números?',
    answer: 'El sorteo se realiza de forma segura e ineludible en la fecha estipulada (6 de enero de 2027) tomando como referencia el premio mayor de la Lotería Nacional oficial de Colombia. ¡Siempre hay un ganador garantizado entre los boletos vendidos!',
  },
  {
    id: 'faq3',
    question: '¿Puedo participar si resido en cualquier ciudad de Colombia?',
    answer: '¡Por supuesto! Pueden participar mayores de 18 años desde cualquier departamento o municipio de Colombia. Si ganas, coordinamos la entrega directa del vehículo hasta la puerta de tu casa.',
  },
  {
    id: 'faq4',
    question: '¿Tengo que pagar impuestos adicionales o gastos de traspaso?',
    answer: 'No. El carro se entrega completamente matriculado a tu nombre en el Tránsito de Funza, con impuestos al día, SOAT y revisión tecnomecánica vigentes, además del tanque lleno de gasolina de cortesía. ¡Cero gastos ocultos para ti!',
  },
  {
    id: 'faq5',
    question: '¿Cómo se elige el número ganador?',
    answer: 'El ganador se determina de manera transparente y oficial mediante los resultados del sorteo de Lotería Nacional en la fecha programada. Podrás seguir la transmisión en directo a través de nuestros canales oficiales.',
  },
];

export const RECENT_SALES = [
  { name: 'Carlos Martínez', city: 'Medellín', pack: 'Pack Super Genio (5+1)', time: 'hace 1 min' },
  { name: 'Lucía Vásquez', city: 'Bogotá', pack: 'Pack Inversor Genio (12)', time: 'hace 3 min' },
  { name: 'Andrés Parra', city: 'Cali', pack: 'Pack Super Genio (5+1)', time: 'hace 5 min' },
  { name: 'Marta Giraldo', city: 'Barranquilla', pack: '1 Boleto Genio', time: 'hace 8 min' },
  { name: 'Javier Suárez', city: 'Bucaramanga', pack: 'Pack Super Genio (5+1)', time: 'hace 11 min' },
  { name: 'Nerea Cárdenas', city: 'Pereira', pack: 'Pack Inversor Genio (12)', time: 'hace 14 min' },
  { name: 'Esteban Restrepo', city: 'Manizales', pack: 'Pack Super Genio (5+1)', time: 'hace 17 min' },
  { name: 'Valeria Morales', city: 'Cartagena', pack: '1 Boleto Genio', time: 'hace 21 min' },
  { name: 'Santiago Rincón', city: 'Ibagué', pack: 'Pack Inversor Genio (12)', time: 'hace 25 min' },
  { name: 'Camila Torres', city: 'Villavicencio', pack: 'Pack Super Genio (5+1)', time: 'hace 30 min' },
];