/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { TopBar } from './components/TopBar';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { CountdownSection } from './components/CountdownSection';
import { VehicleSpecs } from './components/VehicleSpecs';
import { VehicleGallerySection } from './components/VehicleGallerySection';
import { TicketSelector } from './components/TicketSelector';
import { FlashPromoBanner } from './components/FlashPromoBanner';
import { NotaryGuarantees } from './components/NotaryGuarantees';
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
import { NOTARY_INFO, TICKET_PACKAGES } from './data/mockData';
import { PurchasedTicket, TicketPackage, VehicleSpec } from './types';

export default function App() {
  // Stored Tickets State
  const [purchasedTickets, setPurchasedTickets] = useState<PurchasedTicket[]>(() => {
    try {
      const saved = localStorage.getItem('chic_glam_tickets');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Modal Visibility States
  const [isPurchaseModalOpen, setIsPurchaseModalOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<TicketPackage | null>(null);

  const [isMyTicketsModalOpen, setIsMyTicketsModalOpen] = useState(false);
  const [isNotaryModalOpen, setIsNotaryModalOpen] = useState(false);
  const [isLegalModalOpen, setIsLegalModalOpen] = useState(false);

  const [isVehicleModalOpen, setIsVehicleModalOpen] = useState(false);
  const [selectedVehicleSpec, setSelectedVehicleSpec] = useState<VehicleSpec | null>(null);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('chic_glam_tickets', JSON.stringify(purchasedTickets));
    } catch (e) {
      console.error('Error saving tickets:', e);
    }
  }, [purchasedTickets]);

  // Calculate live sold tickets count
  const extraTicketsSold = purchasedTickets.reduce(
    (sum, t) => sum + (t.numbers ? t.numbers.length : 1),
    0
  );
  const currentSoldTotal = NOTARY_INFO.soldNumbers + extraTicketsSold;

  const handleOpenPurchase = (pkg?: TicketPackage) => {
    setSelectedPackage(pkg || TICKET_PACKAGES[1]); // Default to Pack Super Star
    setIsPurchaseModalOpen(true);
  };

  const handleOpenSpecDetail = (spec: VehicleSpec) => {
    setSelectedVehicleSpec(spec);
    setIsVehicleModalOpen(true);
  };

  const handlePurchaseComplete = (ticket: PurchasedTicket) => {
    setPurchasedTickets((prev) => [ticket, ...prev]);
  };

  return (
    <div className="min-h-screen bg-[#FCFCFD] text-slate-800 font-sans antialiased selection:bg-[#FF2D78] selection:text-white flex flex-col justify-between">
      <div>
        {/* Top Announcement Bar */}
        <TopBar onOpenNotaryModal={() => setIsNotaryModalOpen(true)} />

        {/* Main Sticky Navbar */}
        <Navbar
          onOpenPurchaseModal={() => handleOpenPurchase()}
          onOpenMyTicketsModal={() => setIsMyTicketsModalOpen(true)}
          onOpenLegalModal={() => setIsLegalModalOpen(true)}
          ticketsCount={purchasedTickets.length}
        />

        <main>
          {/* Hero Section */}
          <Hero
            onOpenPurchaseModal={() => handleOpenPurchase()}
            onOpenVehicleModal={() => {
              setSelectedVehicleSpec(null);
              setIsVehicleModalOpen(true);
            }}
            onOpenNotaryModal={() => setIsNotaryModalOpen(true)}
          />

          {/* Live Countdown & Numbers Progress Bar */}
          <CountdownSection soldTicketsCount={currentSoldTotal} />

          {/* Vehicle Highlights & Specs (4 Cards) */}
          <VehicleSpecs onSelectSpec={handleOpenSpecDetail} />

          {/* Full Vehicle Gallery Section (40 Real Photos with Models) */}
          <VehicleGallerySection />

          {/* Ticket Selection Module (3 Tiers) */}
          <TicketSelector
            onSelectPackage={(pkg) => handleOpenPurchase(pkg)}
            onOpenNotaryModal={() => setIsNotaryModalOpen(true)}
          />

          {/* Flash Promo Banner (Neon Lime & Pink) */}
          <FlashPromoBanner onOpenPurchaseModal={() => handleOpenPurchase(TICKET_PACKAGES[1])} />

          {/* Notary Guarantees & Transparency */}
          <NotaryGuarantees
            onOpenNotaryModal={() => setIsNotaryModalOpen(true)}
            onOpenLegalModal={() => setIsLegalModalOpen(true)}
          />

          {/* Past Winners Testimonials */}
          <Testimonials />

          {/* FAQ Accordion */}
          <FaqSection />
        </main>
      </div>

      {/* Main Pink Footer */}
      <Footer
        onOpenLegalModal={() => setIsLegalModalOpen(true)}
        onOpenNotaryModal={() => setIsNotaryModalOpen(true)}
      />

      {/* MODALS */}
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

      {/* Recent Purchases Real-Time Notification Toast */}
      <RecentSalesToast />

      {/* Cookie Consent Banner */}
      <CookieConsent />
    </div>
  );
}