import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Scissors, ArrowRight, Check, Search, Shuffle, Snowflake, AlertCircle, Sparkles, MapPin, Ticket } from 'lucide-react';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { TICKET_PACKAGES, HERO_CAROUSEL_PHOTOS } from '../data/mockData';
import { TicketPackage } from '../types';
import mascotaImg from '../assets/mascota (1).png';
import vwLogo from '../assets/vw-logo.webp';

export interface TicketSelection {
    pkg: TicketPackage;
    numbers: string[];
    buyer: { name: string; email: string; phone: string };
}

interface HeroV2Props {
    onOpenPurchaseModal: (selection?: TicketSelection) => void;
    onOpenVehicleModal?: () => void;
    onOpenNotaryModal?: () => void;
}

const DRAW_DATE = 'Enero de 2027';
const LOTTERY = 'Lotería de Boyacá';
const TOTAL_NUMBERS = 10000;
const BOARD_SIZE = 20;
const UNIT_PRICE = 5000;
const PHOTO_DURATION_MS = 4000;

const PRIZE_BENEFITS = ['Traspaso', 'SOAT', 'Tecnomecánica', 'Tanque lleno'];

const BANK_LOGOS = [
    { name: 'Nequi', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/40/Nequi_Colombia_logo.svg/512px-Nequi_Colombia_logo.svg.png' },
    { name: 'Daviplata', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/Logo_Daviplata.png/512px-Logo_Daviplata.png' },
    { name: 'Bancolombia', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/Logo_Bancolombia.svg/512px-Logo_Bancolombia.svg.png' },
    { name: 'BBVA', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/31/BBVA_2019_logo.svg/512px-BBVA_2019_logo.svg.png' },
    { name: 'PSE', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Logo_PSE.svg/512px-Logo_PSE.svg.png' },
    { name: 'Efecty', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9f/Logo_efecty.png/512px-Logo_efecty.png' }
];

const FONTS_URL = 'https://fonts.googleapis.com/css2?family=Fredoka:wght@400;500;600;700&family=Mountains+of+Christmas:wght@700&family=Pacifico&display=swap';

const fontScript: React.CSSProperties = { fontFamily: "'Pacifico', 'Brush Script MT', cursive" };
const fontDisplay: React.CSSProperties = { fontFamily: "'Mountains of Christmas', 'Fredoka', cursive" };
const fontBody: React.CSSProperties = { fontFamily: "'Fredoka', ui-rounded, 'Nunito', system-ui, -apple-system, sans-serif" };

const pad4 = (n: number) => n.toString().padStart(4, '0');
const plural = (n: number) => (n === 1 ? 'número' : 'números');
const formatPrice = (value: number | string): string => {
    const n = Math.round(Number(value) || 0);
    return '$' + String(n).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
};

const BARS = [2, 1, 3, 1, 1, 2, 3, 1, 2, 1, 1, 3, 2, 1, 2, 3, 1, 1, 2, 1, 3, 1, 2, 2, 1, 3, 1, 1, 2, 3, 1, 2];
const labelClass = 'block text-[12px] font-semibold uppercase tracking-[0.08em] text-[#0B5D3B]';

const Holly: React.FC<{ className?: string }> = ({ className }) => (
    <svg viewBox="0 0 48 36" className={className} aria-hidden="true">
        <path d="M24 20C20 11 12 8 3 11c3 9 11 13 21 9z" fill="#0B5D3B" stroke="#FFF8EC" strokeWidth="1.2" />
        <path d="M24 20c4-9 12-12 21-9-3 9-11 13-21 9z" fill="#146B3A" stroke="#FFF8EC" strokeWidth="1.2" />
        <circle cx="19.5" cy="23" r="4.2" fill="#E11D2E" stroke="#FFF8EC" strokeWidth="1" />
        <circle cx="28.5" cy="23" r="4.2" fill="#E11D2E" stroke="#FFF8EC" strokeWidth="1" />
        <circle cx="24" cy="28.5" r="4.2" fill="#C8102E" stroke="#FFF8EC" strokeWidth="1" />
    </svg>
);

const TicketPhoto: React.FC = () => {
    const [index, setIndex] = useState(0);
    const total = HERO_CAROUSEL_PHOTOS.length;

    useEffect(() => {
        const timeout = setTimeout(() => setIndex((p) => (p + 1) % total), PHOTO_DURATION_MS);
        return () => clearTimeout(timeout);
    }, [index, total]);

    return (
        <div className="relative w-full aspect-[3/4] rounded-md overflow-hidden bg-slate-200 border-[3px] border-white shadow-md">
            <AnimatePresence initial={false}>
                <motion.img
                    key={index}
                    src={HERO_CAROUSEL_PHOTOS[index]}
                    alt="Volkswagen Gol con moño"
                    referrerPolicy="no-referrer"
                    className="absolute inset-0 w-full h-full object-cover"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.8, ease: 'easeInOut' }}
                    onError={() => setIndex((p) => (p + 1) % total)}
                />
            </AnimatePresence>
            <div className="absolute top-0 left-0 right-0 h-1 bg-white/30 z-10">
                <motion.div
                    key={index}
                    className="h-full bg-[#C8102E] origin-left"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: PHOTO_DURATION_MS / 1000, ease: 'linear' }}
                />
            </div>
        </div>
    );
};

const InfoItem: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
    <div>
        <span className={labelClass}>{label}</span>
        <span className="block text-[15px] sm:text-base font-semibold text-[#1D2B22] leading-snug">{children}</span>
    </div>
);

const FieldRow: React.FC<{
    label: string;
    type: string;
    value: string;
    placeholder: string;
    autoComplete: string;
    inputMode?: 'text' | 'email' | 'tel';
    onChange: (v: string) => void;
}> = ({ label, type, value, placeholder, autoComplete, inputMode, onChange }) => (
    <label className="grid grid-cols-[72px_1fr] items-center gap-2 border-b border-[#0B5D3B]/35 pb-0.5">
        <span className="text-[12px] font-semibold uppercase tracking-[0.08em] text-[#0B5D3B]">{label}</span>
        <input
            type={type}
            inputMode={inputMode}
            value={value}
            placeholder={placeholder}
            autoComplete={autoComplete}
            onChange={(e) => onChange(e.target.value)}
            className="w-full min-w-0 bg-transparent text-[16px] font-medium text-[#1D2B22] placeholder:text-[#1D2B22]/35 focus:outline-none py-1.5"
        />
    </label>
);

const CutLine: React.FC = () => {
    const notch = 'absolute z-20 w-6 h-6 rounded-full bg-white border border-[#E2CF9E]';
    return (
        <div aria-hidden className="relative z-10 shrink-0 h-0 lg:h-auto lg:w-0 border-t-2 lg:border-t-0 lg:border-l-2 border-dashed border-[#0B5D3B]/40">
            <span className={`${notch} lg:hidden -left-3 -top-3`} />
            <span className={`${notch} lg:hidden -right-3 -top-3`} />
            <span className={`${notch} hidden lg:block -left-3 -top-3`} />
            <span className={`${notch} hidden lg:block -left-3 -bottom-3`} />
            <span className="absolute z-20 flex items-center gap-1 bg-[#FFF8EC] px-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#0B5D3B]/70 whitespace-nowrap left-1/2 -translate-x-1/2 -top-[8px] lg:top-1/2 lg:left-0 lg:-translate-y-1/2 lg:px-0 lg:py-2 lg:[writing-mode:vertical-rl]">
                <Scissors className="w-3 h-3 lg:rotate-90" />
                Cortar aquí
            </span>
        </div>
    );
};

export const HeroV2: React.FC<HeroV2Props> = ({ onOpenPurchaseModal }) => {
    const [selectedPkg, setSelectedPkg] = useState<TicketPackage>(() => TICKET_PACKAGES[0]);
    const [isCustomMode, setIsCustomMode] = useState(false);

    const [selectedNumbers, setSelectedNumbers] = useState<string[]>([]);
    const [board, setBoard] = useState<string[]>([]);
    const [message, setMessage] = useState('');
    const [searchValue, setSearchValue] = useState('');

    const [buyerName, setBuyerName] = useState('');
    const [buyerEmail, setBuyerEmail] = useState('');
    const [buyerPhone, setBuyerPhone] = useState('');

    const [takenNumbers, setTakenNumbers] = useState<Set<string>>(new Set());
    const [formError, setFormError] = useState(false);

    const [raffleDigits, setRaffleDigits] = useState(['4', '6', '0', '0']);

    useEffect(() => {
        const raffleInterval = setInterval(() => {
            const randomNum = Math.floor(Math.random() * (9999 - 1000 + 1) + 1000).toString();
            setRaffleDigits(randomNum.split(''));
        }, 3000);
        return () => clearInterval(raffleInterval);
    }, []);

    // NUEVO: Sincronización en tiempo real con la memoria para que el botón PARTICIPAR de arriba funcione siempre
    useEffect(() => {
        if (selectedNumbers.length > 0) {
            const finalPkg = isCustomMode ? {
                ...selectedPkg,
                price: selectedNumbers.length * UNIT_PRICE,
                totalNumbers: selectedNumbers.length
            } : selectedPkg;

            const payload = {
                pkg: finalPkg,
                numbers: selectedNumbers,
                buyer: { name: buyerName.trim(), email: buyerEmail.trim(), phone: buyerPhone.trim() },
            };
            sessionStorage.setItem('ticketPayload', JSON.stringify(payload));
        } else {
            sessionStorage.removeItem('ticketPayload');
        }
    }, [selectedNumbers, buyerName, buyerEmail, buyerPhone, selectedPkg, isCustomMode]);

    useEffect(() => {
        const id = 'navidad-ticket-fonts';
        if (!document.getElementById(id)) {
            const link = document.createElement('link');
            link.id = id;
            link.rel = 'stylesheet';
            link.href = FONTS_URL;
            document.head.appendChild(link);
        }

        try {
            const unsubscribe = onSnapshot(collection(db, 'tickets'), (snapshot) => {
                const taken = new Set<string>();
                snapshot.forEach((doc) => {
                    const data = doc.data();
                    if (data.status !== 'available') {
                        taken.add(data.number);
                    }
                });
                setTakenNumbers(taken);
            });
            return () => unsubscribe();
        } catch (error) {
            console.error("Error conectando a Firebase:", error);
        }
    }, []);

    const generateBoard = () => {
        const set = new Set<string>();
        while (set.size < BOARD_SIZE) {
            const num = pad4(Math.floor(Math.random() * TOTAL_NUMBERS));
            if (!takenNumbers.has(num)) set.add(num);
        }
        setBoard(Array.from(set).sort());
        setSearchValue('');
        setMessage('');
    };

    useEffect(() => {
        if (board.length === 0) generateBoard();
    }, [takenNumbers]);

    const limit = isCustomMode ? 1000 : selectedPkg.totalNumbers;
    const currentPrice = isCustomMode ? Math.max(1, selectedNumbers.length) * UNIT_PRICE : (selectedNumbers.length > limit ? selectedNumbers.length * UNIT_PRICE : selectedPkg.price);

    const scrollToSection = (id: string) => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    const choosePackage = (pkg: TicketPackage) => {
        setIsCustomMode(false);
        setSelectedPkg(pkg);
        setSelectedNumbers((prev) => prev.slice(0, pkg.totalNumbers));
        setMessage('');
        scrollToSection('seccion-tus-numeros');
    };

    const handleCustomMode = () => {
        setIsCustomMode(true);
        setSelectedPkg({
            id: 'custom', name: 'Otra Cantidad', tagline: 'A tu medida', badge: '',
            price: UNIT_PRICE, description: 'Elige la cantidad de números que prefieras.',
            features: [], buttonText: 'Continuar', totalNumbers: 1, isPopular: false
        });
        setMessage('');
        scrollToSection('seccion-tus-numeros');
    };

    const toggleNumber = (num: string) => {
        setMessage('');
        let newNumbers = [];

        if (selectedNumbers.includes(num)) {
            newNumbers = selectedNumbers.filter((n) => n !== num);
        } else {
            newNumbers = [...selectedNumbers, num];
        }

        setSelectedNumbers(newNumbers);

        if (!isCustomMode && newNumbers.length > limit) {
            setIsCustomMode(true);
        }
    };

    const handleSearchChange = (val: string) => {
        const cleaned = val.replace(/\D/g, '').slice(0, 4);
        setSearchValue(cleaned);

        if (cleaned.length === 0) {
            setMessage('');
        } else if (cleaned.length < 4) {
            setMessage('Sigue escribiendo para completar los 4 dígitos...');
        } else if (cleaned.length === 4) {
            if (takenNumbers.has(cleaned)) {
                setMessage(`❌ Este número ya fue comprado por alguien más, pero tenemos muchos más que te van a dar la suerte.`);
            } else if (selectedNumbers.includes(cleaned)) {
                setMessage(`⚠️ El ${cleaned} ya lo habías agregado a tu boleto.`);
            } else {
                setMessage(`✅ ¡Felicitaciones! El número está disponible. Tócalo aquí abajo para agregarlo.`);
            }
        }
    };

    const addSearchedNumber = () => {
        if (searchValue.length < 4) {
            setMessage('Escribe los 4 dígitos completos antes de agregar.');
            return;
        }
        if (!takenNumbers.has(searchValue) && !selectedNumbers.includes(searchValue)) {
            toggleNumber(searchValue);
            setSearchValue('');
        }
    };

    const handleContinue = () => {
        // Modificado para que te lleve arriba si no has seleccionado números
        if (selectedNumbers.length === 0) {
            scrollToSection('ticket-details');
            return;
        }

        if (!buyerName.trim() || !buyerEmail.trim() || !buyerPhone.trim()) {
            setFormError(true);
            const formTop = document.getElementById('seccion-datos');
            if (formTop) {
                const y = formTop.getBoundingClientRect().top + window.scrollY - 20;
                window.scrollTo({ top: y, behavior: 'smooth' });
            }
            return;
        }

        setFormError(false);

        const finalPkg = isCustomMode ? {
            ...selectedPkg,
            price: selectedNumbers.length * UNIT_PRICE,
            totalNumbers: selectedNumbers.length
        } : selectedPkg;

        const payload = {
            pkg: finalPkg,
            numbers: selectedNumbers,
            buyer: { name: buyerName.trim(), email: buyerEmail.trim(), phone: buyerPhone.trim() },
        };

        sessionStorage.setItem('ticketPayload', JSON.stringify(payload));
        onOpenPurchaseModal(payload);
    };

    return (
        <section className="relative pt-4 pb-28 lg:pt-10 lg:pb-32 overflow-x-clip bg-white" data-purpose="hero-banner">
            <motion.div
                initial={{ opacity: 0, x: -90 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: false, amount: 0.1 }}
                transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
                className="hidden lg:block absolute left-0 top-4 pointer-events-none w-36 xl:w-44"
            >
                <div className="relative">
                    <img src={mascotaImg} alt="Mascota Rifa" className="w-full h-auto object-contain drop-shadow-2xl origin-top-left" />
                    <motion.div
                        animate={{ rotate: [0, -1.5, 1.5, -1.5, 0], y: [0, -3, 0] }}
                        transition={{ rotate: { repeat: Infinity, duration: 2.5 }, y: { repeat: Infinity, duration: 3 } }}
                        className="absolute top-3 right-[-100px] max-w-[140px] bg-white px-3 py-2.5 rounded-xl shadow-2xl border-2 border-slate-100 z-40 pointer-events-auto block"
                    >
                        <div className="absolute -left-2 top-4 w-4 h-4 bg-white border-l-2 border-b-2 border-slate-100 transform rotate-45"></div>
                        <p className="text-[11px] font-black text-[#111827] uppercase leading-snug text-center">
                            ¡A LA ORDEN, JOVEN! 🐶 <br />
                            <span className="text-[#C8102E] font-extrabold tracking-[0.05em] text-[12.5px] block mt-0.5">ELIJA SUS NÚMEROS</span>
                        </p>
                    </motion.div>
                </div>
            </motion.div>

            <div className="max-w-[95rem] mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col items-center">

                {/* CABECERA (Aplica para ambos) */}
                <div className="w-full max-w-[480px] lg:max-w-none mx-auto flex items-center justify-center gap-2.5 lg:block mb-4 lg:mb-8 relative">
                    <img src={mascotaImg} alt="Mascota Rifa" className="lg:hidden w-[78px] sm:w-24 h-auto object-contain drop-shadow-xl shrink-0" />

                    <div className="min-w-0 flex-1 lg:text-center relative">
                        <motion.div
                            animate={{ rotate: [0, -1.5, 1.5, -1.5, 0], y: [0, -2, 0] }}
                            transition={{ rotate: { repeat: Infinity, duration: 2.5 }, y: { repeat: Infinity, duration: 3 } }}
                            className="lg:hidden relative w-fit bg-white border-2 border-slate-100 rounded-xl px-2.5 py-1.5 shadow-md mb-2"
                        >
                            <div className="absolute -left-1.5 top-3 w-3 h-3 bg-white border-l-2 border-b-2 border-slate-100 transform rotate-45"></div>
                            <p className="text-[10px] font-black text-[#111827] uppercase leading-snug">
                                ¡A LA ORDEN, JOVEN! 🐶 <span className="text-[#C8102E] font-extrabold tracking-[0.05em] block sm:inline">ELIJA SUS NÚMEROS</span>
                            </p>
                        </motion.div>

                        <div className="relative inline-block w-fit text-left lg:text-center pr-[45px] sm:pr-[70px] lg:pr-[90px]">
                            <h1 className="font-heading font-black text-[length:clamp(22px,6.4vw,34px)] sm:text-[36px] lg:text-[52px] leading-[1.05] tracking-tight text-[#111827]">
                                <span className="block lg:inline-block whitespace-nowrap lg:mr-3">
                                    ¿Y SI ESTE
                                    <img src={vwLogo} alt="Volkswagen" className="inline-block mx-[0.15em]" style={{ height: '0.85em', width: '0.85em', verticalAlign: '-0.05em' }} />
                                </span>
                                <span className="block lg:inline-block whitespace-nowrap">
                                    <span className="text-[#E60012]">GOL</span> ES TUYO?
                                </span>
                            </h1>

                            <div className="absolute right-0 top-0 lg:top-[-15px] w-20 h-20 sm:w-28 sm:h-28 z-20 pointer-events-none translate-x-[20%] sm:translate-x-[40%]">
                                <motion.div
                                    animate={{ scale: [1, 1.1, 1] }}
                                    transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                                    className="w-full h-full relative"
                                >
                                    <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-lg">
                                        <path d="M50 5 L60 25 L85 20 L75 40 L95 55 L75 65 L80 85 L60 75 L45 95 L35 75 L10 80 L20 60 L5 45 L25 35 L15 15 L35 25 Z" fill="#FFC107" stroke="#1D2B22" strokeWidth="2" strokeLinejoin="round" />
                                    </svg>
                                    <div className="absolute inset-0 flex flex-col items-center justify-center -rotate-6">
                                        <span className="text-[#C8102E] font-black text-[16px] sm:text-[22px] leading-none tracking-tighter mt-1" style={{ textShadow: '1px 1px 0 #fff, -1px -1px 0 #fff, 1px -1px 0 #fff, -1px 1px 0 #fff' }}>
                                            $5.000
                                        </span>
                                        <span className="text-[#C8102E] font-extrabold text-[8px] sm:text-[11px] leading-none uppercase" style={{ textShadow: '1px 1px 0 #fff, -1px -1px 0 #fff, 1px -1px 0 #fff, -1px 1px 0 #fff' }}>
                                            Pesos
                                        </span>
                                    </div>
                                </motion.div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ESTRUCTURA PRINCIPAL (Contiene Ticket + Cajas Flotantes en Desktop) */}
                <div className="w-full flex flex-col lg:flex-row justify-center items-start gap-6 lg:gap-10 xl:gap-14">

                    {/* COLUMNA 1: TICKET PRINCIPAL */}
                    <div className="w-full max-w-[480px] lg:max-w-[1000px] flex-1">
                        <div className="relative flex flex-col bg-[#FFF8EC] rounded-2xl border border-[#E2CF9E] shadow-[0_18px_40px_rgba(11,61,42,0.22)] overflow-clip" style={fontBody}>
                            <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#0B5D3B 1px, transparent 1px)', backgroundSize: '14px 14px', opacity: 0.06 }} />

                            <div id="seccion-datos" className="relative z-10 overflow-hidden bg-gradient-to-b from-[#C8102E] to-[#9E0B22] px-3 py-2.5 sm:py-3.5 text-center scroll-mt-6">
                                <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#ffffff 1.4px, transparent 1.4px)', backgroundSize: '22px 22px', opacity: 0.22 }} />
                                <Holly className="absolute left-1 top-1/2 -translate-y-1/2 w-8 sm:w-12" />
                                <Holly className="absolute right-1 top-1/2 -translate-y-1/2 w-8 sm:w-12 -scale-x-100" />
                                <Snowflake className="hidden sm:block absolute left-16 top-2 w-4 h-4 text-white/70" />
                                <Snowflake className="hidden sm:block absolute right-16 bottom-2 w-4 h-4 text-white/70" />
                                <h2 style={fontScript} className="relative text-[30px] sm:text-[42px] lg:text-[52px] leading-[1.3] text-[#FFE9A8] drop-shadow-[0_2px_0_rgba(0,0,0,0.28)]">
                                    Sorteo de Reyes
                                </h2>
                            </div>
                            <div className="relative z-10 h-1.5 bg-gradient-to-r from-[#F2B33D] via-[#FFE08A] to-[#F2B33D]" />

                            <div className="relative z-10 flex flex-col lg:flex-row lg:items-stretch">

                                <div className="relative w-full lg:w-[32%] lg:min-w-[300px] flex flex-col bg-white/55 p-4 sm:p-5">
                                    <div className="flex items-start justify-between border-b-[3px] border-[#0B5D3B] pb-3 mb-4">
                                        <div className="pr-1">
                                            <h3 style={fontDisplay} className="text-[26px] leading-[1.05] font-black text-[#0B5D3B]">
                                                Tus números<br />ganadores
                                            </h3>
                                            <div className="lg:hidden mt-2">
                                                <motion.button
                                                    type="button"
                                                    animate={{ scale: [1, 1.05, 1] }}
                                                    transition={{ repeat: Infinity, duration: 1.8 }}
                                                    onClick={() => scrollToSection('seccion-ticket-superior')}
                                                    className="bg-[#0D7A4F] text-white text-[12px] uppercase font-bold px-4 py-2 rounded-full shadow-md flex items-center gap-1.5 cursor-pointer"
                                                >
                                                    Elegir tus números ↓
                                                </motion.button>
                                            </div>
                                        </div>

                                        <div className="text-right flex-1 flex flex-col items-end pl-2">
                                            {selectedNumbers.length === 0 ? (
                                                <>
                                                    <span className="block text-[11px] font-semibold uppercase tracking-[0.1em] text-[#0B5D3B] leading-none mb-1">Folio</span>
                                                    <span className="block text-[24px] font-bold text-[#C8102E] leading-none">#----</span>
                                                </>
                                            ) : (
                                                <>
                                                    <span className="block text-[10px] font-bold uppercase tracking-[0.1em] text-[#0B5D3B] leading-none mb-1.5">Tus números</span>
                                                    <div className="flex flex-wrap justify-end gap-x-1.5 gap-y-1 w-full max-w-[220px]">
                                                        {selectedNumbers.length > 4 ? (
                                                            <span className="font-black text-[#C8102E] text-[15px] leading-tight">
                                                                {selectedNumbers.length} números elegidos
                                                            </span>
                                                        ) : (
                                                            selectedNumbers.map(n => (
                                                                <span key={n} className="font-black text-[#C8102E] text-[18px] leading-none">
                                                                    {n}
                                                                </span>
                                                            ))
                                                        )}
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        {formError && (
                                            <div className="bg-[#C8102E]/10 border border-[#C8102E]/30 rounded-lg p-2.5 flex gap-2 items-start animate-pulse">
                                                <AlertCircle className="w-4 h-4 text-[#C8102E] shrink-0 mt-0.5" />
                                                <p className="text-[13px] text-[#C8102E] font-bold leading-tight">
                                                    No has colocado tu información, llena los datos para continuar.
                                                </p>
                                            </div>
                                        )}

                                        <FieldRow label="Nombre" type="text" value={buyerName} onChange={setBuyerName} placeholder="tu nombre completo" autoComplete="name" />
                                        <FieldRow label="Correo" type="email" inputMode="email" value={buyerEmail} onChange={setBuyerEmail} placeholder="tucorreo@ejemplo.com" autoComplete="email" />
                                        <FieldRow label="Celular" type="tel" inputMode="tel" value={buyerPhone} onChange={setBuyerPhone} placeholder="300 000 0000" autoComplete="tel" />

                                        <div className="grid grid-cols-[1fr_auto] items-end gap-3 pt-3">
                                            <div>
                                                <span className={labelClass}>Total a pagar</span>
                                                <span className="block text-[32px] font-bold text-[#1D2B22] leading-none mt-1">
                                                    {formatPrice(currentPrice)}
                                                </span>
                                            </div>
                                            <div className="flex items-stretch h-10 gap-[2px] opacity-80" aria-hidden>
                                                {BARS.map((w, i) => (
                                                    <span key={i} className="bg-[#1D2B22]" style={{ width: w * 1.3 }} />
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="hidden lg:flex mt-auto pt-6 flex-col items-center justify-end">
                                        <span className="block text-[11px] font-semibold uppercase tracking-[0.1em] text-[#0B5D3B] mb-3 opacity-80">Medios de pago oficiales</span>
                                        <div className="flex flex-wrap justify-center gap-3">
                                            {BANK_LOGOS.map(logo => (
                                                <img key={logo.name} src={logo.url} alt={logo.name} className="h-6 object-contain grayscale hover:grayscale-0 transition-all opacity-80 hover:opacity-100" />
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <CutLine />

                                <div className="relative flex-1 min-w-0 p-4 sm:p-5 flex flex-col gap-4" id="seccion-ticket-superior">
                                    <div className="grid grid-cols-[34%_1fr] sm:grid-cols-[150px_1fr] gap-3 sm:gap-4 items-start">
                                        <div className="-rotate-2">
                                            <TicketPhoto />
                                        </div>
                                        <div className="space-y-2 min-w-0">
                                            <InfoItem label="Fecha del sorteo">{DRAW_DATE}</InfoItem>
                                            <InfoItem label="Juega con la">{LOTTERY}</InfoItem>
                                            <InfoItem label="Premio">
                                                <span className="inline-flex items-center gap-1.5">
                                                    Un Volkswagen Gol
                                                    <img src={vwLogo} alt="" className="w-4 h-4 object-contain" />
                                                </span>
                                            </InfoItem>
                                            <div className="flex flex-wrap gap-1.5 pt-0.5">
                                                <span className="bg-[#F2B33D] text-[#3A2A00] text-[13px] font-bold px-3 py-1 rounded-full">
                                                    Cada número {formatPrice(UNIT_PRICE)}
                                                </span>
                                                <span className="border-2 border-[#0B5D3B]/60 text-[#0B5D3B] text-[13px] font-semibold px-3 py-0.5 rounded-full">
                                                    Edición limitada · 10.000
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="border-t-2 border-dashed border-[#0B5D3B]/30 pt-4 mt-2">
                                        <h4 style={fontDisplay} className="text-[22px] leading-none text-[#C8102E] mb-4 flex items-center gap-1.5">
                                            <Snowflake className="w-4 h-4 text-[#0B5D3B]" /> ¿Cuántos números?
                                        </h4>
                                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-2 gap-y-4 lg:max-w-[460px]">
                                            <button
                                                type="button"
                                                onClick={() => choosePackage(TICKET_PACKAGES[0])}
                                                className={`relative flex flex-col items-center justify-center min-h-[68px] rounded-xl border-2 py-2 transition-colors touch-manipulation shadow-sm cursor-pointer ${selectedPkg.id === TICKET_PACKAGES[0].id && !isCustomMode
                                                    ? 'bg-[#3b82f6] border-[#3b82f6] text-white'
                                                    : 'bg-[#f4f8ff] border-[#3b82f6]/40 text-[#1D2B22] hover:border-[#3b82f6]'
                                                    }`}
                                            >
                                                <span className="text-[28px] font-black leading-none">1</span>
                                                <span className="text-[16px] font-bold mt-1 tracking-tight">$5.000</span>
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() => choosePackage(TICKET_PACKAGES[1])}
                                                className={`relative flex flex-col items-center justify-center min-h-[68px] rounded-xl border-2 py-2 transition-colors touch-manipulation shadow-sm cursor-pointer ${selectedPkg.id === TICKET_PACKAGES[1].id && !isCustomMode
                                                    ? 'bg-[#ef4444] border-[#ef4444] text-white'
                                                    : 'bg-[#fff5f5] border-[#ef4444]/40 text-[#1D2B22] hover:border-[#ef4444]'
                                                    }`}
                                            >
                                                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#ef4444] text-white text-[9px] font-black px-2.5 py-0.5 rounded-full whitespace-nowrap shadow-sm">
                                                    EL MÁS ELEGIDO ★
                                                </span>
                                                <span className="text-[28px] font-black leading-none">5</span>
                                                <span className="text-[16px] font-bold mt-1 tracking-tight">$25.000</span>
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() => choosePackage(TICKET_PACKAGES[2])}
                                                className={`relative flex flex-col items-center justify-center min-h-[68px] rounded-xl border-2 py-2 transition-colors touch-manipulation shadow-sm cursor-pointer ${selectedPkg.id === TICKET_PACKAGES[2].id && !isCustomMode
                                                    ? 'bg-[#84cc16] border-[#84cc16] text-[#1D2B22]'
                                                    : 'bg-[#f7fee7] border-[#84cc16]/40 text-[#1D2B22] hover:border-[#84cc16]'
                                                    }`}
                                            >
                                                <span className="text-[28px] font-black leading-none">10</span>
                                                <span className="text-[16px] font-bold mt-1 tracking-tight">$50.000</span>
                                            </button>

                                            <button
                                                type="button"
                                                onClick={handleCustomMode}
                                                className={`relative flex flex-col items-center justify-center min-h-[68px] rounded-xl border-2 py-2 transition-colors touch-manipulation shadow-sm cursor-pointer ${isCustomMode
                                                    ? 'bg-[#0B5D3B] border-[#0B5D3B] text-white'
                                                    : 'bg-white border-[#0B5D3B]/40 text-[#1D2B22] hover:border-[#0B5D3B]'
                                                    }`}
                                            >
                                                <span className="text-[17px] font-black leading-tight text-center">Otra<br />cantidad</span>
                                            </button>
                                        </div>
                                    </div>

                                    <div id="seccion-tus-numeros" className="bg-white/70 p-3 rounded-xl border border-[#0B5D3B]/20 shadow-sm mt-2 lg:hidden scroll-mt-4">
                                        <span className="text-[12px] font-bold uppercase tracking-[0.08em] text-[#0B5D3B] block mb-2">Tus números</span>
                                        <div className="flex flex-wrap gap-1.5 items-center">
                                            {selectedNumbers.length === 0 ? (
                                                <span className="text-[14px] text-[#1D2B22]/50 italic">Aún no has elegido números abajo</span>
                                            ) : (
                                                selectedNumbers.map((n) => (
                                                    <button
                                                        key={n}
                                                        type="button"
                                                        onClick={() => toggleNumber(n)}
                                                        className="bg-[#0B5D3B] text-white text-[15px] font-bold px-2 py-1 rounded-md cursor-pointer hover:bg-[#C8102E] transition-colors touch-manipulation flex items-center gap-1 shadow-sm"
                                                    >
                                                        {n} <span className="text-[16px] leading-none mb-[2px]">×</span>
                                                    </button>
                                                ))
                                            )}
                                        </div>
                                    </div>

                                    <div className="mt-1" id="ticket-details">
                                        <div className="flex items-center justify-between gap-2 mb-3">
                                            <h4 style={fontDisplay} className="text-[22px] leading-none text-[#C8102E] flex items-center gap-1.5">
                                                <Snowflake className="w-4 h-4 text-[#0B5D3B]" /> Elige tus números
                                            </h4>
                                            <button
                                                type="button"
                                                onClick={generateBoard}
                                                className="inline-flex items-center gap-1.5 min-h-[38px] px-3 rounded-full border-2 border-[#0B5D3B] text-[#0B5D3B] text-[12px] font-bold hover:bg-[#0B5D3B] hover:text-white transition-colors cursor-pointer touch-manipulation"
                                            >
                                                <Shuffle className="w-3.5 h-3.5 shrink-0" />
                                                ¿No te gustan? Mira otros 20
                                            </button>
                                        </div>

                                        <div className="flex items-center gap-2 mb-4">
                                            <div className="relative flex-1 min-w-0">
                                                <Search className="w-4 h-4 text-[#0B5D3B]/60 absolute left-3 top-1/2 -translate-y-1/2" />
                                                <input
                                                    type="text"
                                                    inputMode="numeric"
                                                    maxLength={4}
                                                    placeholder="Busca números (0000-9999)"
                                                    value={searchValue}
                                                    onChange={(e) => handleSearchChange(e.target.value)}
                                                    className="w-full bg-white/90 border-2 border-[#0B5D3B]/30 text-[#1D2B22] placeholder:text-[#1D2B22]/45 text-[15px] rounded-full pl-9 pr-3 py-2 focus:outline-none focus:border-[#0B5D3B]"
                                                />
                                            </div>
                                            <button
                                                type="button"
                                                onClick={addSearchedNumber}
                                                className="bg-[#0B5D3B] hover:bg-[#094a2f] text-[#FFE08A] text-[13px] font-bold px-4 min-h-[42px] rounded-full cursor-pointer touch-manipulation"
                                            >
                                                Agregar
                                            </button>
                                        </div>

                                        <div className="min-h-[140px]">
                                            <p className={`mb-4 text-[13px] leading-snug font-bold ${message.includes('❌') || message.includes('⚠️') ? 'text-[#C8102E] bg-[#C8102E]/10 p-2.5 rounded-lg' : message.includes('✅') ? 'text-[#0B5D3B] bg-[#0B5D3B]/10 p-2.5 rounded-lg' : 'text-[#1D2B22]/65 font-normal'}`}>
                                                {message || 'Toca un número para elegirlo. Tócalo otra vez para quitarlo.'}
                                            </p>

                                            {searchValue.length > 0 ? (
                                                searchValue.length === 4 && !takenNumbers.has(searchValue) && (
                                                    <div className="flex justify-center mt-2 mb-6">
                                                        <motion.button
                                                            type="button"
                                                            animate={{ scale: [1, 1.1, 1] }}
                                                            transition={{ repeat: Infinity, duration: 1.5 }}
                                                            onClick={() => { toggleNumber(searchValue); setSearchValue(''); }}
                                                            className="relative w-[5rem] h-[5rem] bg-[#C8102E] border-2 border-[#9E0B22] text-white rounded-full text-[20px] font-black flex items-center justify-center shadow-lg ring-4 ring-[#F2B33D] cursor-pointer"
                                                        >
                                                            {selectedNumbers.includes(searchValue) && <Check className="w-5 h-5 absolute -top-1 -right-1 bg-[#F2B33D] text-[#7A0010] rounded-full p-0.5 border border-[#9E0B22]" strokeWidth={4} />}
                                                            {searchValue}
                                                        </motion.button>
                                                    </div>
                                                )
                                            ) : (
                                                <div className="grid grid-cols-[repeat(5,minmax(0,2.9rem))] lg:grid-cols-[repeat(10,2.4rem)] justify-between gap-y-2.5">
                                                    {board.map((num) => {
                                                        const isTaken = takenNumbers.has(num);
                                                        const isSelected = selectedNumbers.includes(num);
                                                        return (
                                                            <button
                                                                key={num}
                                                                type="button"
                                                                disabled={isTaken}
                                                                onClick={() => toggleNumber(num)}
                                                                className={`relative w-[2.9rem] h-[2.9rem] lg:w-[2.4rem] lg:h-[2.4rem] rounded-full text-[14px] lg:text-[13px] font-bold flex items-center justify-center border-2 transition-all touch-manipulation ${isTaken ? 'border-[#C8102E]/40 text-[#C8102E]/40 line-through cursor-not-allowed' : isSelected ? 'bg-[#C8102E] border-[#9E0B22] text-white scale-105 shadow-md ring-2 ring-[#F2B33D] cursor-pointer' : 'bg-white border-[#F2B33D] text-[#1D2B22] hover:bg-[#FFF1C9] hover:scale-105 cursor-pointer'}`}
                                                            >
                                                                {isSelected && <Check className="w-3.5 h-3.5 absolute -top-1 -right-1 bg-[#F2B33D] text-[#7A0010] rounded-full p-0.5 border border-[#9E0B22]" strokeWidth={4} />}
                                                                {num}
                                                            </button>
                                                        );
                                                    })}
                                                </div>
                                            )}
                                        </div>

                                        <div className="mt-5 lg:hidden bg-[#0B5D3B]/5 p-3 rounded-xl">
                                            <span className="block text-[11px] font-semibold uppercase tracking-[0.1em] text-[#0B5D3B] mb-2.5 text-center opacity-80">Medios de pago oficiales</span>
                                            <div className="flex flex-wrap justify-center items-center gap-3.5">
                                                {BANK_LOGOS.map(logo => (
                                                    <img key={logo.name} src={logo.url} alt={logo.name} className="h-5 object-contain grayscale opacity-70" />
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* COLUMNA 2: CAJAS FLOTANTES (Solo para WEB/Desktop) */}
                    <div className="hidden lg:flex flex-col gap-6 w-[240px] xl:w-[260px] shrink-0 sticky top-24 pt-4">

                        {/* RECUADRO OSCURO */}
                        <div className="relative z-20 w-full transform -rotate-2 hover:rotate-0 transition-all duration-300">
                            <div className="absolute -top-4 -right-4 text-[#C6F235] animate-[spin_4s_linear_infinite] z-30">
                                <Sparkles className="w-8 h-8 fill-[#C6F235]" />
                            </div>
                            <div className="h-full bg-[#111827] text-white px-5 py-6 rounded-3xl shadow-[6px_6px_0px_#C6F235] border-2 border-slate-800 flex flex-col items-center justify-center text-center">
                                <span className="text-[11px] xl:text-xs font-black uppercase tracking-widest text-slate-300 mb-3">
                                    ¡Si ganas, recibes!
                                </span>
                                <ul className="w-full space-y-2 text-left">
                                    {PRIZE_BENEFITS.map((item) => (
                                        <li key={item} className="flex items-center gap-2.5">
                                            <span className="shrink-0 w-5 h-5 rounded-full bg-[#C6F235] text-[#111827] flex items-center justify-center">
                                                <Check className="w-3.5 h-3.5" strokeWidth={4} />
                                            </span>
                                            <span className="font-heading font-black text-[13px] xl:text-sm uppercase tracking-tight text-white leading-none">
                                                {item}
                                            </span>
                                        </li>
                                    ))}
                                    <li className="flex items-center gap-2.5">
                                        <span className="shrink-0 w-5 h-5 rounded-full bg-[#C6F235] text-[#111827] flex items-center justify-center">
                                            <MapPin className="w-3.5 h-3.5" strokeWidth={3} />
                                        </span>
                                        <span className="font-heading font-black text-[13px] xl:text-sm uppercase tracking-tight text-white leading-none">
                                            Entrega en Bogotá
                                        </span>
                                    </li>
                                </ul>
                                <span className="mt-4 inline-block bg-[#E60012] text-white font-heading font-black text-sm xl:text-base uppercase tracking-wide px-4 py-2 rounded-full shadow-lg whitespace-nowrap">
                                    TODO POR $5.000
                                </span>
                            </div>
                        </div>

                        {/* CONTADOR BOLETOS */}
                        <div className="bg-slate-900 rounded-3xl p-4 shadow-2xl border-2 border-slate-800 w-full flex flex-col items-center justify-center gap-3">
                            <div className="flex flex-col items-center text-center px-1">
                                <span className="text-xs text-[#C6F235] font-black tracking-widest uppercase flex items-center justify-center text-center gap-1.5 leading-tight">
                                    <Ticket className="w-4 h-4 shrink-0" /> LISTOS PARA COMPRAR
                                </span>
                            </div>
                            <div className="flex gap-1.5">
                                {raffleDigits.map((digit, idx) => (
                                    <div key={idx} className="w-10 h-14 bg-black rounded-xl border-2 border-slate-700 flex items-center justify-center overflow-hidden relative shadow-inner">
                                        <span className="text-3xl font-black text-white font-mono tabular-nums">{digit}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                    </div>

                </div>
            </div>

            {/* SECCIÓN INFERIOR CON PALPITACIÓN Y DESPLAZAMIENTO SI NO HAY NÚMEROS */}
            <div className="fixed bottom-0 left-0 right-0 z-[60] flex items-center justify-center bg-[#0B3D2A] text-white shadow-[0_-8px_25px_rgba(0,0,0,0.25)] border-t-2 border-[#F2B33D]/60" style={fontBody}>
                <div className="w-full max-w-[1200px] px-4 sm:px-6 lg:px-8 py-3 lg:py-4 flex items-center justify-between gap-4">
                    <div
                        className={`min-w-0 cursor-pointer transition-all ${selectedNumbers.length === 0 ? 'animate-pulse hover:text-[#F2B33D]' : ''}`}
                        onClick={() => { if (selectedNumbers.length === 0) scrollToSection('ticket-details'); }}
                    >
                        <span className="block text-[12px] lg:text-[14px] text-[#FFE9A8] leading-none mb-0.5 lg:mb-1 font-bold">
                            {selectedNumbers.length === 0
                                ? '↑ Toca aquí para elegir números'
                                : isCustomMode
                                    ? `${selectedNumbers.length} ${plural(selectedNumbers.length)} elegidos`
                                    : `${selectedNumbers.length} de ${limit} elegidos`}
                        </span>
                        <span className="text-2xl lg:text-3xl font-bold leading-tight drop-shadow-sm">
                            {formatPrice(currentPrice)}
                        </span>
                    </div>
                    <motion.button
                        type="button"
                        animate={selectedNumbers.length === 0 ? { scale: [1, 1.05, 1] } : { scale: [1, 1.04, 1] }}
                        transition={{ repeat: Infinity, duration: selectedNumbers.length === 0 ? 1.5 : 1.2 }}
                        onClick={handleContinue}
                        className={`flex items-center gap-1.5 bg-[#F2B33D] hover:bg-[#E5A423] text-[#0B3D2A] px-5 lg:px-8 min-h-[46px] lg:min-h-[52px] rounded-xl text-base lg:text-lg font-bold uppercase tracking-wide cursor-pointer touch-manipulation shadow-lg transition-transform ${selectedNumbers.length === 0 ? 'opacity-90 border-2 border-white' : ''}`}
                    >
                        {selectedNumbers.length === 0 ? 'ELEGIR NÚMEROS' : 'Continuar'} <ArrowRight className="w-5 h-5 lg:w-6 lg:h-6" />
                    </motion.button>
                </div>
            </div>
        </section>
    );
};

export const Hero = HeroV2;