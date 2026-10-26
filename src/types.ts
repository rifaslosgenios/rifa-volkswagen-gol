export interface TicketPackage {
  id: string;
  name: string;
  badge?: string;
  badgeType?: 'classic' | 'featured' | 'vip';
  tagline: string;
  description: string;
  price: number;
  originalPrice?: number;
  discountLabel?: string;
  ticketCount: number;
  bonusTickets: number;
  totalNumbers: number;
  features: string[];
  isPopular?: boolean;
  buttonText: string;
}

export interface PurchasedTicket {
  id: string;
  orderNumber: string;
  packageName: string;
  numbers: string[];
  totalPrice: number;
  buyerName: string;
  buyerEmail: string;
  buyerPhone: string;
  buyerDni?: string;
  purchaseDate: string;
  notaryProtocol: string;
  qrData: string;
  paymentMethod: string;
}

// --- NUEVOS TIPOS PARA FIREBASE (ETAPA A) ---

// Representa un número individual en la base de datos (Dato público)
export interface TicketData {
  status: 'reserved' | 'paid';
  orderId: string;
  expiresAt: number; // Tiempo límite (timestamp) antes de que el número vuelva a quedar libre
}

// Representa la orden de compra con información sensible (Dato privado)
export interface OrderData {
  buyerName: string;
  buyerEmail: string;
  buyerPhone: string;
  buyerDni?: string;
  packageName: string;
  totalPrice: number;
  numbers: string[];
  status: 'pending' | 'paid';
  receiptImageBase64?: string; // Aquí guardaremos la foto comprimida (máx 150kb)
  createdAt: number;
}

// --------------------------------------------

export interface VehicleSpec {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  shortDesc: string;
  fullDesc: string;
  features: string[];
  technicalData: { [key: string]: string };
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export interface TestimonialItem {
  id: string;
  name: string;
  location: string;
  role: string;
  avatar: string;
  quote: string;
  rating: number;
  accentColor: string;
}