import { TicketPackage, VehicleSpec, FaqItem, TestimonialItem } from '../types';

// 1. Carrusel Superior: Exclusivamente las fotos con moño (M) para el Hero
export const HERO_CAROUSEL_PHOTOS: string[] = [];
for (let i = 1; i <= 7; i++) {
  // Conservando los espacios originales y la extensión .jpeg / .webp
  HERO_CAROUSEL_PHOTOS.push(new URL(`../assets/galeria/gol MJP (${i}).jpeg`, import.meta.url).href);
  HERO_CAROUSEL_PHOTOS.push(new URL(`../assets/galeria/gol MW (${i}).webp`, import.meta.url).href);
}

// 2. Galería Completa Inferior: Intercaladas Femenino (F) y Masculino (H)
const femalePhotos: string[] = [];
for (let i = 1; i <= 6; i++) {
  femalePhotos.push(new URL(`../assets/galeria/gol FJP (${i}).jpeg`, import.meta.url).href);
}
for (let i = 1; i <= 13; i++) {
  femalePhotos.push(new URL(`../assets/galeria/gol FW (${i}).webp`, import.meta.url).href);
}

const malePhotos: string[] = [];
for (let i = 1; i <= 7; i++) {
  malePhotos.push(new URL(`../assets/galeria/gol HJP (${i}).jpeg`, import.meta.url).href);
}
for (let i = 1; i <= 6; i++) {
  malePhotos.push(new URL(`../assets/galeria/gol HW (${i}).webp`, import.meta.url).href);
}

// Mezcla intercalada: una de mujer y una de hombre de manera sucesiva
export const VEHICLE_GALLERY_PHOTOS: string[] = [];
const maxLength = Math.max(femalePhotos.length, malePhotos.length);
for (let i = 0; i < maxLength; i++) {
  if (i < femalePhotos.length) VEHICLE_GALLERY_PHOTOS.push(femalePhotos[i]);
  if (i < malePhotos.length) VEHICLE_GALLERY_PHOTOS.push(malePhotos[i]);
}

// Rutas estáticas para las tarjetas técnicas del vehículo
const motorImg = new URL(`../assets/galeria/gol HJP (2).jpeg`, import.meta.url).href;
const exteriorImg = new URL(`../assets/galeria/gol FW (5).webp`, import.meta.url).href;
const papersImg = new URL(`../assets/galeria/gol HJP (4).jpeg`, import.meta.url).href;
const fuelImg = new URL(`../assets/galeria/gol MJP (1).jpeg`, import.meta.url).href;

export const NOTARY_INFO = {
  number: 1,
  notaryName: 'Sorteo Oficial Lotería de la Cruz Roja',
  college: 'Ministerio de Transporte - República de Colombia',
  protocol: 'Protocolo Legal / Traspaso Directo al Ganador',
  address: 'Organismo de Tránsito Municipal de Funza, Cundinamarca',
  date: '2027-01-06',
  license: 'Sorteo Oficial Día de Reyes 2027',
  securityHash: '8f7a29bc41d08e5473e659b8a09f3e12c478d10b78c93a02f65a19820bc6a47e',
  bomboType: 'Sorteo Oficial Lotería de la Cruz Roja',
  totalNumbers: 10000,
  soldNumbers: 2500,
  initialPercentage: 25.0,
};

const PACKAGE_FEATURES = [
  'Elige tus números o déjalos al azar',
  'Descarga e imprime tu comprobante oficial en PDF',
  'Consulta tus números en el buscador público',
  'Transmisión en directo con Lotería de la Cruz Roja',
  'Soporte directo por WhatsApp',
];

export const TICKET_PACKAGES: TicketPackage[] = [
  {
    id: 'single',
    name: 'Un número',
    tagline: 'Para empezar',
    badge: '1 número',
    badgeType: 'classic',
    description: 'Tu primera oportunidad de llevarte el Gol.',
    price: 5000,
    ticketCount: 1,
    bonusTickets: 0,
    totalNumbers: 1,
    features: PACKAGE_FEATURES,
    buttonText: 'Quiero 1 número',
  },
  {
    id: 'pack5',
    name: 'Cinco números',
    tagline: 'Súper oportunidad',
    badge: '5 números',
    badgeType: 'featured',
    description: '5 veces más oportunidades que con un solo número.',
    price: 25000,
    ticketCount: 5,
    bonusTickets: 0,
    totalNumbers: 5,
    isPopular: true,
    features: PACKAGE_FEATURES,
    buttonText: 'Quiero 5 números',
  },
  {
    id: 'pack10',
    name: 'Diez números',
    tagline: 'Más oportunidades',
    badge: '10 números',
    badgeType: 'vip',
    description: '10 oportunidades de llevarte el Gol.',
    price: 50000,
    ticketCount: 10,
    bonusTickets: 0,
    totalNumbers: 10,
    features: PACKAGE_FEATURES,
    buttonText: 'Quiero 10 números',
  },
];

export const VEHICLE_SPECS: VehicleSpec[] = [
  {
    id: 'motor',
    title: 'MANTENIMIENTOS AL DÍA',
    subtitle: 'Volkswagen Gol Mi 1.6L (Modelo 1998)',
    image: motorImg,
    shortDesc: 'Componentes mecánicos revisados y mantenimientos ejecutados para el correcto funcionamiento.',
    fullDesc: 'Este clásico Volkswagen Gol 98 (Placa CIY069, Color Negro Universal, Carrocería Coupé) cuenta con sus mantenimientos al día para su correcto funcionamiento.',
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
    fullDesc: 'Cero complicaciones administrativas. El carro se entrega con SOAT, revisión tecnomecánica vigentes, impuestos al día y el traspaso inscrito directamente en el Organismo de Tránsito de Funza con todos los gastos de radicación cubiertos.',
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
    fullDesc: 'Queremos que desde el primer segundo en que recibas tu Volkswagen Gol 98 disfrutes la experiencia al máximo sin preocuparte por tanquear.',
    features: [
      'Tanque de combustible 100% lleno',
    ],
    technicalData: {
      'Obsequio': 'Tanque lleno de combustible',
      'Entrega': 'Presencial en Bogotá D.C.',
    },
  },
];

export const TESTIMONIALS: TestimonialItem[] = [
  {
    id: '1',
    name: 'Carlos Martínez',
    location: 'Medellín',
    role: 'Cliente verificado',
    quote: 'Pagué por Nequi y descargué mi comprobante en PDF de una vez. Todo muy claro y rápido. Con la fe intacta para ese Golcito 🙏',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    accentColor: '#E60012'
  },
  {
    id: '2',
    name: 'Laura Gómez',
    location: 'Bogotá',
    role: 'Cliente verificada',
    quote: 'La página está súper fácil de usar, los números se seleccionan rápido. Me dio un poco de dudas al principio, pero vi los medios de pago oficiales y me dio confianza.',
    rating: 4,
    avatar: null as unknown as string,
    accentColor: '#FFC93C'
  },
  {
    id: '3',
    name: 'Andrés Felipe',
    location: 'Cali',
    role: 'Cliente verificado',
    quote: 'Excelente plataforma, pude elegir mis números de la suerte sin problema. La atención por WhatsApp también es muy buena, responden de una.',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
    accentColor: '#1D2B22'
  },
  {
    id: '4',
    name: 'Diana Marcela',
    location: 'Bucaramanga',
    role: 'Cliente verificada',
    quote: 'Me gustó la transparencia de todo. El proceso fue súper bien, la plataforma no se traba y el ticket llega al instante. Esperando el sorteo con ansias.',
    rating: 4,
    avatar: null as unknown as string,
    accentColor: '#0B5D3B'
  },
  {
    id: '5',
    name: 'Jorge Eliécer',
    location: 'Barranquilla',
    role: 'Cliente verificado',
    quote: 'Ya tengo mis 5 números. La compra con Daviplata fue en segundos y me llegó el correo confirmando mi participación. Súper recomendado.',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=150&q=80',
    accentColor: '#E60012'
  },
  {
    id: '6',
    name: 'Valentina Ríos',
    location: 'Pereira',
    role: 'Cliente verificada',
    quote: 'Es la primera vez que participo en algo así. Todo el proceso se ve muy legal y seguro. ¡Ojalá me lo gane, está precioso el carro!',
    rating: 4,
    avatar: null as unknown as string,
    accentColor: '#FFC93C'
  }
];

export const FAQ_ITEMS: FaqItem[] = [
  {
    id: 'faq1',
    question: '¿Cómo y cuándo se realiza el sorteo?',
    answer: 'El sorteo consta de 10.000 números (del 0000 al 9999) y jugará con el Premio Mayor de la Lotería de la Cruz Roja el día 6 de enero de 2027. El ganador será quien coincida con las 4 cifras en estricto orden.',
  },
  {
    id: 'faq2',
    question: '¿Qué ocurre si no se alcanzan a vender los boletos?',
    answer: 'Tenemos fijada una meta del 70% de la boletería vendida (punto de equilibrio). Si no se alcanza esa meta para el 6 de enero de 2027, el sorteo se aplazará a la siguiente fecha oficial de la Lotería de la Cruz Roja hasta cumplir el porcentaje, manteniendo total validez tus boletos adquiridos.',
  },
  {
    id: 'faq3',
    question: '¿Dónde y cómo se realiza la entrega del vehículo?',
    answer: 'La entrega física del vehículo se realiza únicamente en Bogotá D.C. Por seguridad jurídica de ambas partes, las llaves y el carro se entregan en el momento exacto en que el traspaso cerrado quede formalmente radicado ante el Tránsito de Funza.',
  },
  {
    id: 'faq4',
    question: '¿Quién asume los gastos de traspaso e impuestos?',
    answer: 'El organizador asume el 100% de los costos de radicación de traspaso ante el Tránsito de Funza y gastos notariales. El vehículo se entrega a paz y salvo de multas e impuestos hasta la fecha del traspaso. Impuestos futuros o declaración de renta son asumidos por el ganador.',
  },
  {
    id: 'faq5',
    question: '¿El carro cuenta con garantía mecánica?',
    answer: 'Al ser un vehículo usado entregado mediante sorteo (por un valor simbólico), se entrega en la condición física y mecánica en que se encuentra actualmente ("As is"). El ganador asume las revisiones preventivas que desee realizarle posterior a la entrega.',
  },
  {
    id: 'faq6',
    question: '¿Cómo consulto mis números guardados?',
    answer: 'Puedes ingresar a la sección "Mis Boletos" en la barra superior de la página y buscar con tu número de orden o teléfono para ver tus números asignados y descargar tu comprobante PDF cuando quieras.',
  },
  {
    id: 'faq7',
    question: '¿Puedo pedir reembolso de mis boletos?',
    answer: 'No. Las compras de boletos son definitivas e irreversibles debido a la reserva inmediata de los números en el sistema.',
  },
];

export const RECENT_SALES = [
  { name: 'Carlos M.', city: 'Medellín', pack: 'Cinco números', time: 'hace un momento' },
  { name: 'Lucía V.', city: 'Bogotá', pack: 'Diez números', time: 'hace 3 min' },
  { name: 'Andrés P.', city: 'Cali', pack: 'Cinco números', time: 'hace 5 min' },
  { name: 'Marta G.', city: 'Barranquilla', pack: 'Un número', time: 'hace 8 min' },
  { name: 'Javier S.', city: 'Bucaramanga', pack: 'Cinco números', time: 'hace 11 min' },
];