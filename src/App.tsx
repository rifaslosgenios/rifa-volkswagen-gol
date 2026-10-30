import React, { useState, useEffect, useRef } from 'react';
import { collection, getCountFromServer, query, where } from 'firebase/firestore';
import { db } from './firebaseConfig';
import { ShoppingCart, ArrowRight } from 'lucide-react';

import { TopBar } from './components/TopBar';
import { Navbar } from './components/Navbar';
import { HeroV2 } from './components/HeroV2';
import { HeroPhotoCarousel, useIsDesktop } from './components/HeroPhotoCarousel';
import { CountdownSection } from './components/CountdownSection';
import { VehicleSpecs } from './components/VehicleSpecs';
import { VehicleGallerySection } from './components/VehicleGallerySection';
import { Testimonials } from './components/Testimonials';
import { FaqSection } from './components/FaqSection';
import { Footer } from './components/Footer';
import { PurchaseModal } from './components/PurchaseModal';
import { MyTicketsModal } from './components/MyTicketsModal';
import { NotaryVerificationModal } from './components/NotaryVerificationModal';
import { VehicleDetailModal } from './components/VehicleDetailModal';
import { LegalBasesModal } from './components/LegalBasesModal';
import { RecentSalesToast } from './components/RecentSalesToast';
import { CookieConsent } from './components/CookieConsent';
import { TICKET_PACKAGES } from './data/mockData';
import { PurchasedTicket, TicketPackage, VehicleSpec } from './types';

// IMPORTAMOS EL NUEVO PANEL DE ADMINISTRACIÓN
import AdminDashboard from './components/AdminDashboard';

const TOTAL_TICKETS_AVAILABLE = 10000;

export default function App() {
  // ESTADO PARA LA RUTA OCULTA
  const [isAdminRoute, setIsAdminRoute] = useState(false);

  const [purchasedTickets, setPurchasedTickets] = useState<PurchasedTicket[]>(() => {
    try {
      const saved = localStorage.getItem('chic_glam_tickets');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [realSoldTotal, setRealSoldTotal] = useState(0);
  const [soldPercentage, setSoldPercentage] = useState("0.0");

  const [isPurchaseModalOpen, setIsPurchaseModalOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<TicketPackage | null>(null);
  const [isMyTicketsModalOpen, setIsMyTicketsModalOpen] = useState(false);
  const [isNotaryModalOpen, setIsNotaryModalOpen] = useState(false);
  const [isLegalModalOpen, setIsLegalModalOpen] = useState(false);
  const [isVehicleModalOpen, setIsVehicleModalOpen] = useState(false);
  const [selectedVehicleSpec, setSelectedVehicleSpec] = useState<VehicleSpec | null>(null);

  const [showRecoveryAlert, setShowRecoveryAlert] = useState(false);

  const isDesktop = useIsDesktop();
  const modalEntryRef = useRef(false);

  const anyModalOpen =
    isPurchaseModalOpen ||
    isMyTicketsModalOpen ||
    isNotaryModalOpen ||
    isLegalModalOpen ||
    isVehicleModalOpen;

  // DETECTOR DE RUTA SECRETA
  useEffect(() => {
    // Si la URL termina en esto, activamos el modo Administrador
    if (window.location.pathname === '/acceso-johan-privado') {
      setIsAdminRoute(true);
    }
  }, []);

  // DETECTOR DE CARRITO ABANDONADO AL INICIAR LA APP
  useEffect(() => {
    if (isAdminRoute) return; // No mostrar alertas en el panel admin
    const timer = setTimeout(() => {
      const savedCheckout = localStorage.getItem('pending_checkout');
      if (savedCheckout) {
        try {
          const parsed = JSON.parse(savedCheckout);
          if (parsed && parsed.numbers && parsed.numbers.length > 0) {
            setShowRecoveryAlert(true);
          }
        } catch (e) { }
      }
    }, 800);
    return () => clearTimeout(timer);
  }, [isAdminRoute]);

  useEffect(() => {
    if (isAdminRoute) return;
    const fetchRealSalesCount = async () => {
      const startDate = new Date('2026-10-25').getTime();
      const now = Date.now();
      const daysPassed = Math.max(0, (now - startDate) / (1000 * 60 * 60 * 24));

      const baseFakeCount = 2500;
      const dailyFakeSales = 15;

      const simulatedCount = Math.floor(baseFakeCount + (daysPassed * dailyFakeSales));
      let realCount = 0;

      try {
        const coll = collection(db, 'tickets');
        const q = query(coll, where('status', 'in', ['paid', 'reserved']));
        const snapshot = await getCountFromServer(q);
        realCount = snapshot.data().count;
      } catch (error) {
        console.log("Esperando conexión o datos en Firebase...");
      }

      const displayCount = Math.max(simulatedCount, realCount);

      setRealSoldTotal(displayCount);
      setSoldPercentage(((displayCount / TOTAL_TICKETS_AVAILABLE) * 100).toFixed(1));
    };

    fetchRealSalesCount();
  }, [isAdminRoute]);

  useEffect(() => {
    if (anyModalOpen && !modalEntryRef.current) {
      window.history.pushState({ modalOpen: true }, '');
      modalEntryRef.current = true;
    } else if (!anyModalOpen && modalEntryRef.current) {
      modalEntryRef.current = false;
      if (window.history.state && window.history.state.modalOpen) {
        window.history.back();
      }
    }
  }, [anyModalOpen]);

  useEffect(() => {
    const handlePopState = () => {
      if (modalEntryRef.current) {
        modalEntryRef.current = false;
        setIsPurchaseModalOpen(false);
        setIsMyTicketsModalOpen(false);
        setIsNotaryModalOpen(false);
        setIsLegalModalOpen(false);
        setIsVehicleModalOpen(false);
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('chic_glam_tickets', JSON.stringify(purchasedTickets));
    } catch (e) {
      console.error('Error saving tickets:', e);
    }
  }, [purchasedTickets]);

  const handleOpenPurchase = (pkg?: TicketPackage) => {
    setSelectedPackage(pkg || TICKET_PACKAGES[1]);
    setIsPurchaseModalOpen(true);
  };

  const handleOpenSpecDetail = (spec: VehicleSpec) => {
    setSelectedVehicleSpec(spec);
    setIsVehicleModalOpen(true);
  };

  const handlePurchaseComplete = (ticket: PurchasedTicket) => {
    setPurchasedTickets((prev) => [ticket, ...prev]);
    setRealSoldTotal(prev => Math.max(prev + ticket.numbers.length, prev));
    localStorage.removeItem('pending_checkout');
  };

  // SI ES LA RUTA SECRETA, MOSTRAMOS SOLO EL PANEL ADMIN
  if (isAdminRoute) {
    return <AdminDashboard />;
  }

  return (
    <div className="min-h-screen bg-[#FCFCFD] text-slate-800 font-sans antialiased selection:bg-[#E60012] selection:text-white flex flex-col justify-between">
      <div>
        <TopBar
          onOpenNotaryModal={() => setIsNotaryModalOpen(true)}
          soldPercentage={soldPercentage}
        />

        <Navbar
          onOpenPurchaseModal={() => handleOpenPurchase()}
          onOpenMyTicketsModal={() => setIsMyTicketsModalOpen(true)}
          onOpenLegalModal={() => setIsLegalModalOpen(true)}
          ticketsCount={purchasedTickets.length}
        />

        <main>
          <HeroV2
            onOpenPurchaseModal={() => handleOpenPurchase()}
            onOpenVehicleModal={() => {
              setSelectedVehicleSpec(null);
              setIsVehicleModalOpen(true);
            }}
            onOpenNotaryModal={() => setIsNotaryModalOpen(true)}
          />

          <VehicleGallerySection onOpenPurchaseModal={() => handleOpenPurchase()} />

          {!isDesktop && (
            <section className="relative bg-white py-12 overflow-hidden">
              <div className="max-w-[95rem] mx-auto px-4 sm:px-6">
                <HeroPhotoCarousel onOpenPurchaseModal={() => handleOpenPurchase()} />
              </div>
            </section>
          )}

          <VehicleSpecs onSelectSpec={handleOpenSpecDetail} />
          <Testimonials />

          <CountdownSection
            soldTicketsCount={realSoldTotal}
            totalTicketsCount={TOTAL_TICKETS_AVAILABLE}
          />

          <FaqSection />
        </main>
      </div>

      <Footer
        onOpenLegalModal={() => setIsLegalModalOpen(true)}
        onOpenNotaryModal={() => setIsNotaryModalOpen(true)}
      />

      {/* MODAL DE RECUPERACIÓN DE CARRITO */}
      {showRecoveryAlert && (
        <div className="fixed inset-0 z-[10000] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-sm w-full text-center shadow-2xl relative overflow-hidden animate-in zoom-in-95">
            <div className="w-16 h-16 bg-[#F2B33D]/20 text-[#0B5D3B] rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
              <ShoppingCart className="w-8 h-8" />
            </div>
            <h3 className="font-heading font-black text-2xl text-[#1D2B22] mb-2">¡Recuperamos tu carrito!</h3>
            <p className="text-slate-600 text-sm mb-6">
              Vimos que estabas a punto de pagar tus números. ¿Deseas continuar donde te quedaste para subir tu comprobante?
            </p>
            <button
              onClick={() => {
                setShowRecoveryAlert(false);
                setIsPurchaseModalOpen(true);
              }}
              className="bg-[#0B5D3B] hover:bg-[#094A2F] text-[#FFF8EC] px-6 py-3.5 rounded-xl font-bold uppercase tracking-wide w-full transition-colors shadow-md flex items-center justify-center gap-2 mb-3 cursor-pointer"
            >
              Continuar mi compra <ArrowRight className="w-5 h-5" />
            </button>
            <button
              onClick={() => {
                localStorage.removeItem('pending_checkout');
                setShowRecoveryAlert(false);
              }}
              className="text-slate-400 hover:text-[#C8102E] text-sm font-semibold underline transition-colors cursor-pointer"
            >
              No, empezar de nuevo
            </button>
          </div>
        </div>
      )}

      {isPurchaseModalOpen && (
        <PurchaseModal
          initialPackage={selectedPackage}
          onClose={() => setIsPurchaseModalOpen(false)}
          onPurchaseComplete={handlePurchaseComplete}
        />
      )}

      {isMyTicketsModalOpen && (
        <MyTicketsModal
          tickets={purchasedTickets}
          onClose={() => setIsMyTicketsModalOpen(false)}
          onOpenPurchaseModal={() => handleOpenPurchase()}
        />
      )}

      {isNotaryModalOpen && (
        <NotaryVerificationModal
          onClose={() => setIsNotaryModalOpen(false)}
          onOpenPurchaseModal={() => handleOpenPurchase()}
        />
      )}

      {isVehicleModalOpen && (
        <VehicleDetailModal
          initialSpec={selectedVehicleSpec}
          onClose={() => setIsVehicleModalOpen(false)}
          onOpenPurchaseModal={() => handleOpenPurchase()}
        />
      )}

      {isLegalModalOpen && (
        <LegalBasesModal onClose={() => setIsLegalModalOpen(false)} />
      )}

      <RecentSalesToast />
      <CookieConsent />
    </div>
  );
}