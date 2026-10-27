/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { collection, getCountFromServer, query, where } from 'firebase/firestore';
import { db } from './firebaseConfig';

import { TopBar } from './components/TopBar';
import { Navbar } from './components/Navbar';
import { HeroV2 } from './components/HeroV2';
import { Hero } from './components/Hero';
import { HeroPhotoCarousel, useIsDesktop } from './components/HeroPhotoCarousel';
import { CountdownSection } from './components/CountdownSection';
import { VehicleSpecs } from './components/VehicleSpecs';
import { VehicleGallerySection } from './components/VehicleGallerySection';
import { TicketSelector } from './components/TicketSelector';
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

const TOTAL_TICKETS_AVAILABLE = 10000;

export default function App() {
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

  const isDesktop = useIsDesktop();
  const modalEntryRef = useRef(false);

  const anyModalOpen =
    isPurchaseModalOpen ||
    isMyTicketsModalOpen ||
    isNotaryModalOpen ||
    isLegalModalOpen ||
    isVehicleModalOpen;

  // Consultar conteo real en Firebase y aplicar simulación de marketing
  useEffect(() => {
    const fetchRealSalesCount = async () => {
      try {
        // 1. Consultar el número real en la base de datos
        const coll = collection(db, 'tickets');
        const q = query(coll, where('status', 'in', ['paid', 'reserved']));
        const snapshot = await getCountFromServer(q);
        const realCount = snapshot.data().count;

        // 2. Crear la simulación (La "Fachada")
        const startDate = new Date('2026-10-25').getTime();
        const now = Date.now();
        const daysPassed = Math.max(0, (now - startDate) / (1000 * 60 * 60 * 24));

        const baseFakeCount = 2500; // Arranca en 25% (2500 boletos)
        const dailyFakeSales = 15;  // Suma 15 boletos cada día

        // Calcula cuántos boletos simulados van hasta hoy
        const simulatedCount = Math.floor(baseFakeCount + (daysPassed * dailyFakeSales));

        // 3. El equilibrio: Mostrar siempre el número mayor
        const displayCount = Math.max(simulatedCount, realCount);

        // 4. Enviar a la barra superior y al contador
        setRealSoldTotal(displayCount);
        setSoldPercentage(((displayCount / TOTAL_TICKETS_AVAILABLE) * 100).toFixed(1));

      } catch (error) {
        console.log("Esperando conexión o datos en Firebase...");
      }
    };
    fetchRealSalesCount();
  }, []);

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
    // Actualizamos el contador localmente de forma temporal hasta que refresquen la página
    setRealSoldTotal(prev => Math.max(prev + ticket.numbers.length, prev));
  };

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

          <Hero
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

          <TicketSelector
            onSelectPackage={(pkg) => handleOpenPurchase(pkg)}
            onOpenNotaryModal={() => setIsNotaryModalOpen(true)}
          />

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