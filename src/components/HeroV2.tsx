import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Scissors, ArrowRight, Check, Search, Shuffle, Snowflake } from 'lucide-react';
import { TICKET_PACKAGES, HERO_CAROUSEL_PHOTOS } from '../data/mockData';
import { TicketPackage } from '../types';
import mascotaImg from '../assets/mascota (1).png';
import vwLogo from '../assets/vw-logo.webp';

/* Lo que el boleto le entrega a la ventana de compra al pulsar "Continuar" */
export interface TicketSelection {
    pkg: TicketPackage;
    numbers: string[];
    buyer: { name: string; email: string; phone: string };
}

interface HeroV2Props {
    // Recibe la selección (opcional): si App.tsx no la usa todavía, simplemente se ignora.
    onOpenPurchaseModal: (selection?: TicketSelection) => void;
    onOpenVehicleModal?: () => void;
    onOpenNotaryModal?: () => void;
}

/* ───────── DATOS DEL BOLETO (cámbialos aquí) ───────── */
// IMPORTANTE: la Lotería de Boyacá juega los SÁBADOS. Cuando tengas la fecha exacta del sorteo,
// escríbela aquí (por ejemplo '9 de enero de 2027').
const DRAW_DATE = 'Enero de 2027';
const LOTTERY = 'Lotería de Boyacá';

const TOTAL_NUMBERS = 10000;
const BOARD_SIZE = 20; // números que se muestran a la vez
const UNIT_PRICE = 5000;
const PHOTO_DURATION_MS = 4000;

// Números ocupados. Por ahora vacío (todos disponibles); cuando conectemos Firebase se llena desde allí.
const TAKEN_NUMBERS = new Set<string>();

/* ───────── TIPOGRAFÍAS NAVIDEÑAS (se cargan solas desde Google Fonts) ───────── */
const FONTS_URL =
    'https://fonts.googleapis.com/css2?family=Fredoka:wght@400;500;600;700&family=Mountains+of+Christmas:wght@700&family=Pacifico&display=swap';
// Letra de caligrafía: solo para el título grande
const fontScript: React.CSSProperties = { fontFamily: "'Pacifico', 'Brush Script MT', cursive" };
// Letra decorativa navideña: para los títulos de cada zona (siempre en tamaño grande, para que se lea)
const fontDisplay: React.CSSProperties = { fontFamily: "'Mountains of Christmas', 'Fredoka', cursive" };
// Letra redonda y muy legible: para datos, números y textos
const fontBody: React.CSSProperties = {
    fontFamily: "'Fredoka', ui-rounded, 'Nunito', system-ui, -apple-system, sans-serif",
};

const pad4 = (n: number) => n.toString().padStart(4, '0');
const plural = (n: number) => (n === 1 ? 'número' : 'números');
const formatPrice = (value: number | string): string => {
    const n = Math.round(Number(value) || 0);
    return '$' + String(n).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
};

// 20 números al azar, sin repetir y ordenados
const randomBoard = (): string[] => {
    const set = new Set<string>();
    while (set.size < BOARD_SIZE) {
        const num = pad4(Math.floor(Math.random() * TOTAL_NUMBERS));
        if (!TAKEN_NUMBERS.has(num)) set.add(num);
    }
    return Array.from(set).sort();
};

// Barras decorativas del código de barras del talón
const BARS = [2, 1, 3, 1, 1, 2, 3, 1, 2, 1, 1, 3, 2, 1, 2, 3, 1, 1, 2, 1, 3, 1, 2, 2, 1, 3, 1, 1, 2, 3, 1, 2];

const labelClass = 'block text-[12px] font-semibold uppercase tracking-[0.08em] text-[#0B5D3B]';

/* Acebo (hojas verdes y bayas rojas), adorno del título */
const Holly: React.FC<{ className?: string }> = ({ className }) => (
    <svg viewBox="0 0 48 36" className={className} aria-hidden="true">
        <path d="M24 20C20 11 12 8 3 11c3 9 11 13 21 9z" fill="#0B5D3B" stroke="#FFF8EC" strokeWidth="1.2" />
        <path d="M24 20c4-9 12-12 21-9-3 9-11 13-21 9z" fill="#146B3A" stroke="#FFF8EC" strokeWidth="1.2" />
        <circle cx="19.5" cy="23" r="4.2" fill="#E11D2E" stroke="#FFF8EC" strokeWidth="1" />
        <circle cx="28.5" cy="23" r="4.2" fill="#E11D2E" stroke="#FFF8EC" strokeWidth="1" />
        <circle cx="24" cy="28.5" r="4.2" fill="#C8102E" stroke="#FFF8EC" strokeWidth="1" />
    </svg>
);

/* Foto pequeña del vehículo: cambia sola cada 4 segundos, con fundido y barra de progreso */
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

/* Dato del boleto: etiqueta pequeña + valor */
const InfoItem: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
    <div>
        <span className={labelClass}>{label}</span>
        <span className="block text-[15px] sm:text-base font-semibold text-[#1D2B22] leading-snug">{children}</span>
    </div>
);

/* Fila "ETIQUETA: ______" del talón */
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
            /* 16px en celular evita que el teléfono haga zoom al tocar el campo */
            className="w-full min-w-0 bg-transparent text-[16px] font-medium text-[#1D2B22] placeholder:text-[#1D2B22]/35 focus:outline-none py-1.5"
        />
    </label>
);

/* Línea de corte con muescas y tijeras: horizontal en celular, vertical en computador */
const CutLine: React.FC = () => {
    const notch = 'absolute z-20 w-6 h-6 rounded-full bg-white border border-[#E2CF9E]';
    return (
        <div
            aria-hidden
            className="relative z-10 shrink-0 h-0 lg:h-auto lg:w-0 border-t-2 lg:border-t-0 lg:border-l-2 border-dashed border-[#0B5D3B]/40"
        >
            {/* Muescas en celular (a los lados) */}
            <span className={`${notch} lg:hidden -left-3 -top-3`} />
            <span className={`${notch} lg:hidden -right-3 -top-3`} />
            {/* Muescas en computador (arriba y abajo) */}
            <span className={`${notch} hidden lg:block -left-3 -top-3`} />
            <span className={`${notch} hidden lg:block -left-3 -bottom-3`} />
            {/* Tijeras y texto */}
            <span className="absolute z-20 flex items-center gap-1 bg-[#FFF8EC] px-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#0B5D3B]/70 whitespace-nowrap left-1/2 -translate-x-1/2 -top-[8px] lg:top-1/2 lg:left-0 lg:-translate-y-1/2 lg:px-0 lg:py-2 lg:[writing-mode:vertical-rl]">
                <Scissors className="w-3 h-3 lg:rotate-90" />
                Cortar aquí
            </span>
        </div>
    );
};

export const HeroV2: React.FC<HeroV2Props> = ({ onOpenPurchaseModal }) => {
    // Paquete elegido (por defecto el más popular)
    const [selectedPkg, setSelectedPkg] = useState<TicketPackage>(
        () => TICKET_PACKAGES.find((p) => p.isPopular) ?? TICKET_PACKAGES[0]
    );
    const [selectedNumbers, setSelectedNumbers] = useState<string[]>([]);
    const [board, setBoard] = useState<string[]>(() => randomBoard());
    const [message, setMessage] = useState('');
    const [searchValue, setSearchValue] = useState('');
    const [buyerName, setBuyerName] = useState('');
    const [buyerEmail, setBuyerEmail] = useState('');
    const [buyerPhone, setBuyerPhone] = useState('');

    // Carga las tipografías navideñas una sola vez
    useEffect(() => {
        const id = 'navidad-ticket-fonts';
        if (document.getElementById(id)) return;
        const link = document.createElement('link');
        link.id = id;
        link.rel = 'stylesheet';
        link.href = FONTS_URL;
        document.head.appendChild(link);
    }, []);

    const limit = selectedPkg.totalNumbers;
    const remaining = limit - selectedNumbers.length;
    const folio = selectedNumbers[0] ?? '----';

    const limitMessage = () =>
        `Tu paquete incluye ${limit} ${plural(limit)}. Quita uno o cambia de paquete.`;

    const choosePackage = (pkg: TicketPackage) => {
        setSelectedPkg(pkg);
        setSelectedNumbers((prev) => prev.slice(0, pkg.totalNumbers));
        setMessage('');
    };

    const toggleNumber = (num: string) => {
        setMessage('');
        if (selectedNumbers.includes(num)) {
            setSelectedNumbers(selectedNumbers.filter((n) => n !== num));
            return;
        }
        if (selectedNumbers.length >= limit) {
            setMessage(limitMessage());
            return;
        }
        setSelectedNumbers([...selectedNumbers, num]);
    };

    // Escribes un número y se agrega directo a tu boleto
    const addSearchedNumber = () => {
        const cleaned = searchValue.replace(/\D/g, '');
        if (!cleaned) {
            setMessage('Escribe un número del 0000 al 9999.');
            return;
        }
        const num = pad4(Math.min(TOTAL_NUMBERS - 1, parseInt(cleaned, 10)));
        if (TAKEN_NUMBERS.has(num)) {
            setMessage(`El ${num} ya está ocupado. Prueba con otro.`);
            return;
        }
        if (selectedNumbers.includes(num)) {
            setMessage(`El ${num} ya está en tu boleto.`);
            return;
        }
        if (selectedNumbers.length >= limit) {
            setMessage(limitMessage());
            return;
        }
        setSelectedNumbers([...selectedNumbers, num]);
        setSearchValue('');
        setMessage('');
    };

    const handleContinue = () => {
        if (selectedNumbers.length === 0) return;
        onOpenPurchaseModal({
            pkg: selectedPkg,
            numbers: selectedNumbers,
            buyer: { name: buyerName.trim(), email: buyerEmail.trim(), phone: buyerPhone.trim() },
        });
    };

    return (
        <section
            className="relative pt-4 pb-10 lg:pt-10 lg:pb-20 overflow-x-clip bg-white"
            data-purpose="hero-banner"
        >
            {/* MASCOTA FLOTANTE (solo computador) */}
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
                        <p className="text-[11px] font-black text-[#111827] uppercase tracking-tight leading-snug text-center">
                            ¡A LA ORDEN, JOVEN! 🐶 <br />
                            <span className="text-[#E60012]">ELIGE TUS NÚMEROS</span>
                        </p>
                    </motion.div>
                </div>
            </motion.div>

            <div className="max-w-[95rem] mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col items-center">

                {/* MASCOTA + TÍTULO PRINCIPAL
                    Celular: la mascota va a la izquierda y el título a su derecha (sin espacios vacíos).
                    Computador: título centrado (la mascota flota a la izquierda). */}
                <div className="w-full max-w-[480px] lg:max-w-none mx-auto flex items-center gap-2.5 lg:block mb-3 lg:mb-8">
                    <img
                        src={mascotaImg}
                        alt="Mascota Rifa"
                        className="lg:hidden w-[78px] sm:w-24 h-auto object-contain drop-shadow-xl shrink-0"
                    />
                    <div className="min-w-0 flex-1 lg:text-center">
                        {/* Burbuja (solo celular) */}
                        <motion.div
                            animate={{ rotate: [0, -1.5, 1.5, -1.5, 0], y: [0, -2, 0] }}
                            transition={{ rotate: { repeat: Infinity, duration: 2.5 }, y: { repeat: Infinity, duration: 3 } }}
                            className="lg:hidden relative w-fit bg-white border-2 border-slate-100 rounded-xl px-2.5 py-1.5 shadow-md mb-1.5"
                        >
                            <div className="absolute -left-1.5 top-3 w-3 h-3 bg-white border-l-2 border-b-2 border-slate-100 transform rotate-45"></div>
                            <p className="text-[10px] font-black text-[#111827] uppercase tracking-tight leading-snug">
                                ¡A LA ORDEN, JOVEN! 🐶 <span className="text-[#E60012]">ELIGE TUS NÚMEROS</span>
                            </p>
                        </motion.div>

                        <h1 className="font-heading font-black text-[length:clamp(22px,6.4vw,34px)] sm:text-[36px] lg:text-[52px] leading-[1.05] tracking-tight text-[#111827]">
                            <span className="block lg:inline-block whitespace-nowrap lg:mr-3">
                                ¿Y SI ESTE
                                <img src={vwLogo} alt="Volkswagen" className="inline-block mx-[0.15em]" style={{ height: '0.85em', width: '0.85em', verticalAlign: '-0.05em' }} />
                            </span>
                            <span className="block lg:inline-block whitespace-nowrap">
                                <span className="text-[#E60012]">GOL</span> ES TUYO?
                            </span>
                        </h1>
                    </div>
                </div>

                {/* ════════════ BONO NAVIDEÑO ════════════
                    Orden en celular:  título → talón de control → línea de corte → cuerpo
                    Orden en computador: título arriba; debajo, talón a la izquierda y cuerpo a la derecha */}
                <div className="w-full max-w-[480px] lg:max-w-[1000px]">

                    <div
                        className="relative flex flex-col bg-[#FFF8EC] rounded-2xl border border-[#E2CF9E] shadow-[0_18px_40px_rgba(11,61,42,0.22)] overflow-clip"
                        style={fontBody}
                    >
                        {/* Textura de papel */}
                        <div
                            className="absolute inset-0 pointer-events-none"
                            style={{ backgroundImage: 'radial-gradient(#0B5D3B 1px, transparent 1px)', backgroundSize: '14px 14px', opacity: 0.06 }}
                        />

                        {/* ================= TÍTULO ================= */}
                        <div className="relative z-10 overflow-hidden bg-gradient-to-b from-[#C8102E] to-[#9E0B22] px-3 py-2.5 sm:py-3.5 text-center">
                            {/* Nieve */}
                            <div
                                className="absolute inset-0 pointer-events-none"
                                style={{ backgroundImage: 'radial-gradient(#ffffff 1.4px, transparent 1.4px)', backgroundSize: '22px 22px', opacity: 0.22 }}
                            />
                            <Holly className="absolute left-1 top-1/2 -translate-y-1/2 w-8 sm:w-12" />
                            <Holly className="absolute right-1 top-1/2 -translate-y-1/2 w-8 sm:w-12 -scale-x-100" />
                            <Snowflake className="hidden sm:block absolute left-16 top-2 w-4 h-4 text-white/70" />
                            <Snowflake className="hidden sm:block absolute right-16 bottom-2 w-4 h-4 text-white/70" />
                            <h2
                                style={fontScript}
                                className="relative text-[30px] sm:text-[42px] lg:text-[52px] leading-[1.3] text-[#FFE9A8] drop-shadow-[0_2px_0_rgba(0,0,0,0.28)]"
                            >
                                Sorteo de Reyes
                            </h2>
                        </div>
                        <div className="relative z-10 h-1.5 bg-gradient-to-r from-[#F2B33D] via-[#FFE08A] to-[#F2B33D]" />

                        {/* ================= FILA: TALÓN + CORTE + CUERPO ================= */}
                        <div className="relative z-10 flex flex-col lg:flex-row lg:items-stretch">

                            {/* ---------- TALÓN DE CONTROL (inmediatamente debajo del título) ---------- */}
                            <div className="relative w-full lg:w-[32%] lg:min-w-[300px] flex flex-col bg-white/55 p-4 sm:p-5">

                                <div className="flex items-end justify-between border-b-[3px] border-[#0B5D3B] pb-2 mb-3">
                                    <h3 style={fontDisplay} className="text-[24px] leading-none text-[#0B5D3B]">
                                        Talón de control
                                    </h3>
                                    <div className="text-right">
                                        <span className="block text-[11px] font-semibold uppercase tracking-[0.1em] text-[#0B5D3B] leading-none">Folio</span>
                                        <span className="block text-[28px] font-bold text-[#C8102E] leading-none mt-0.5">#{folio}</span>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    {/* Números elegidos */}
                                    <div className="grid grid-cols-[72px_1fr] items-start gap-2 border-b border-[#0B5D3B]/35 pb-1.5 min-h-[36px]">
                                        <span className="text-[12px] font-semibold uppercase tracking-[0.08em] text-[#0B5D3B] pt-1.5">Números</span>
                                        <div className="flex flex-wrap gap-1.5 items-center">
                                            {selectedNumbers.length === 0 ? (
                                                <span className="text-[15px] text-[#1D2B22]/45 pt-1">elige en el boleto</span>
                                            ) : (
                                                selectedNumbers.map((n) => (
                                                    <button
                                                        key={n}
                                                        type="button"
                                                        onClick={() => toggleNumber(n)}
                                                        aria-label={`Quitar el número ${n}`}
                                                        className="bg-[#0B5D3B] text-[#FFE08A] text-[14px] font-semibold px-2 py-1 rounded-md cursor-pointer hover:bg-[#C8102E] hover:text-white transition-colors touch-manipulation"
                                                    >
                                                        {n} ×
                                                    </button>
                                                ))
                                            )}
                                        </div>
                                    </div>
                                    {selectedNumbers.length > 0 && remaining > 0 && (
                                        <p className="text-[13px] text-[#1D2B22]/75 leading-snug">
                                            Te faltan {remaining}: los completamos al azar al reservar.
                                        </p>
                                    )}

                                    <FieldRow label="Nombre" type="text" value={buyerName} onChange={setBuyerName} placeholder="tu nombre completo" autoComplete="name" />
                                    <FieldRow label="Correo" type="email" inputMode="email" value={buyerEmail} onChange={setBuyerEmail} placeholder="tucorreo@ejemplo.com" autoComplete="email" />
                                    <FieldRow label="Celular" type="tel" inputMode="tel" value={buyerPhone} onChange={setBuyerPhone} placeholder="300 000 0000" autoComplete="tel" />

                                    {/* Total + código de barras decorativo */}
                                    <div className="grid grid-cols-[1fr_auto] items-end gap-3 pt-1">
                                        <div>
                                            <span className={labelClass}>Total</span>
                                            <span className="block text-[28px] font-bold text-[#1D2B22] leading-none mt-0.5">
                                                {formatPrice(selectedPkg.price)}
                                            </span>
                                        </div>
                                        <div className="flex items-stretch h-9 gap-[2px] opacity-80" aria-hidden>
                                            {BARS.map((w, i) => (
                                                <span key={i} className="bg-[#1D2B22]" style={{ width: w * 1.3 }} />
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Botón (solo computador; en celular está en la barra de abajo) */}
                                <div className="hidden lg:block mt-auto pt-5">
                                    <button
                                        type="button"
                                        onClick={handleContinue}
                                        disabled={selectedNumbers.length === 0}
                                        className="w-full flex items-center justify-center gap-2 bg-[#F2B33D] hover:bg-[#E5A423] disabled:opacity-50 disabled:cursor-not-allowed text-[#0B3D2A] px-4 py-3.5 rounded-xl text-base font-bold uppercase tracking-wide transition-colors shadow-md cursor-pointer"
                                    >
                                        Continuar <ArrowRight className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>

                            {/* ---------- LÍNEA DE CORTE ---------- */}
                            <CutLine />

                            {/* ---------- CUERPO DEL BONO ---------- */}
                            <div className="relative flex-1 min-w-0 p-4 sm:p-5 flex flex-col gap-4">

                                {/* Foto + datos del sorteo */}
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

                                {/* Paquete */}
                                <div className="border-t-2 border-dashed border-[#0B5D3B]/30 pt-3">
                                    <h4 style={fontDisplay} className="text-[22px] leading-none text-[#C8102E] mb-3 flex items-center gap-1.5">
                                        <Snowflake className="w-4 h-4 text-[#0B5D3B]" /> ¿Cuántos números?
                                    </h4>
                                    <div className="grid grid-cols-3 gap-2 lg:max-w-[380px]">
                                        {TICKET_PACKAGES.map((pkg) => {
                                            const isSel = selectedPkg.id === pkg.id;
                                            return (
                                                <button
                                                    key={pkg.id}
                                                    type="button"
                                                    onClick={() => choosePackage(pkg)}
                                                    aria-pressed={isSel}
                                                    aria-label={`${pkg.totalNumbers} ${plural(pkg.totalNumbers)} por ${formatPrice(pkg.price)}`}
                                                    className={`relative flex flex-col items-center justify-center min-h-[56px] rounded-xl border-2 py-1.5 cursor-pointer transition-colors touch-manipulation ${isSel
                                                        ? 'bg-[#0B5D3B] border-[#0B5D3B] text-[#FFE08A]'
                                                        : 'bg-white/90 border-[#0B5D3B]/35 text-[#1D2B22] hover:border-[#0B5D3B]'
                                                        }`}
                                                >
                                                    <span className="text-xl font-bold leading-none">{pkg.totalNumbers}</span>
                                                    <span className="text-[13px] font-semibold mt-0.5">{formatPrice(pkg.price)}</span>
                                                    {pkg.isPopular && (
                                                        <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-[#C8102E] text-white text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full whitespace-nowrap shadow">
                                                            Más elegido
                                                        </span>
                                                    )}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Números disponibles (bolas de Navidad) */}
                                <div>
                                    <div className="flex items-center justify-between gap-2 mb-3">
                                        <h4 style={fontDisplay} className="text-[22px] leading-none text-[#C8102E] flex items-center gap-1.5">
                                            <Snowflake className="w-4 h-4 text-[#0B5D3B]" /> Elige tus números
                                        </h4>
                                        <button
                                            type="button"
                                            onClick={() => setBoard(randomBoard())}
                                            className="inline-flex items-center gap-1.5 min-h-[40px] px-3.5 rounded-full border-2 border-[#0B5D3B] text-[#0B5D3B] text-[13px] font-bold hover:bg-[#0B5D3B] hover:text-white transition-colors cursor-pointer touch-manipulation"
                                        >
                                            <Shuffle className="w-4 h-4" />
                                            Otros {BOARD_SIZE}
                                        </button>
                                    </div>

                                    <div className="flex items-center gap-2 mb-3">
                                        <div className="relative flex-1 min-w-0">
                                            <Search className="w-4 h-4 text-[#0B5D3B]/60 absolute left-3 top-1/2 -translate-y-1/2" />
                                            <input
                                                type="text"
                                                inputMode="numeric"
                                                maxLength={4}
                                                placeholder="Busca tu número (0000 a 9999)"
                                                value={searchValue}
                                                onChange={(e) => setSearchValue(e.target.value.replace(/\D/g, ''))}
                                                onKeyDown={(e) => { if (e.key === 'Enter') addSearchedNumber(); }}
                                                className="w-full bg-white/90 border-2 border-[#0B5D3B]/30 text-[#1D2B22] placeholder:text-[#1D2B22]/40 text-[16px] lg:text-sm rounded-full pl-9 pr-3 py-2 focus:outline-none focus:border-[#0B5D3B]"
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

                                    {/* 20 números: 4 filas de 5 en celular · 2 filas de 10 en computador */}
                                    <div className="grid grid-cols-[repeat(5,minmax(0,2.9rem))] lg:grid-cols-[repeat(10,2.4rem)] justify-between gap-y-2.5">
                                        {board.map((num) => {
                                            const isTaken = TAKEN_NUMBERS.has(num);
                                            const isSelected = selectedNumbers.includes(num);
                                            return (
                                                <button
                                                    key={num}
                                                    type="button"
                                                    disabled={isTaken}
                                                    onClick={() => toggleNumber(num)}
                                                    aria-pressed={isSelected}
                                                    aria-label={isTaken ? `Número ${num} ocupado` : `Elegir el número ${num}`}
                                                    className={`relative w-[2.9rem] h-[2.9rem] lg:w-[2.4rem] lg:h-[2.4rem] rounded-full text-[14px] lg:text-[13px] font-semibold flex items-center justify-center border-2 transition-all touch-manipulation ${isTaken
                                                        ? 'border-[#C8102E]/40 text-[#C8102E]/40 line-through cursor-not-allowed'
                                                        : isSelected
                                                            ? 'bg-[#C8102E] border-[#9E0B22] text-white scale-105 shadow-md ring-2 ring-[#F2B33D] cursor-pointer'
                                                            : 'bg-white border-[#F2B33D] text-[#1D2B22] hover:bg-[#FFF1C9] hover:scale-105 cursor-pointer'
                                                        }`}
                                                >
                                                    {isSelected && (
                                                        <Check className="w-3.5 h-3.5 absolute -top-1 -right-1 bg-[#F2B33D] text-[#7A0010] rounded-full p-0.5 border border-[#9E0B22]" strokeWidth={4} />
                                                    )}
                                                    {num}
                                                </button>
                                            );
                                        })}
                                    </div>

                                    <p className={`mt-2.5 text-[13px] leading-snug ${message ? 'font-semibold text-[#C8102E]' : 'text-[#1D2B22]/65'}`}>
                                        {message || 'Toca un número para elegirlo. Tócalo otra vez para quitarlo.'}
                                    </p>
                                </div>

                                <p className="text-[12px] leading-snug text-[#1D2B22]/60 border-t border-[#0B5D3B]/20 pt-2.5">
                                    Válido únicamente para el sorteo oficial. Paga con Mercado Pago o Llave Bre-B.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Barra inferior fija (solo celular): se queda a la vista mientras eliges */}
                    <div
                        className="lg:hidden sticky bottom-[max(0.75rem,env(safe-area-inset-bottom))] z-30 mt-3 flex items-center justify-between gap-3 bg-[#0B3D2A] text-white rounded-2xl px-4 py-3 shadow-2xl border border-[#F2B33D]/50"
                        style={fontBody}
                    >
                        <div className="min-w-0">
                            <span className="block text-[12px] text-[#FFE9A8] leading-none">
                                {selectedNumbers.length === 0
                                    ? 'Elige tus números'
                                    : `${selectedNumbers.length} de ${limit} elegidos`}
                            </span>
                            <span className="text-2xl font-bold leading-tight">
                                {formatPrice(selectedPkg.price)}
                            </span>
                        </div>
                        <button
                            type="button"
                            onClick={handleContinue}
                            disabled={selectedNumbers.length === 0}
                            className="flex items-center gap-1.5 bg-[#F2B33D] hover:bg-[#E5A423] disabled:opacity-50 disabled:cursor-not-allowed text-[#0B3D2A] px-5 min-h-[46px] rounded-xl text-base font-bold uppercase tracking-wide cursor-pointer touch-manipulation"
                        >
                            Continuar <ArrowRight className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
};

// Alias para que App.tsx funcione tanto si importa "Hero" como "HeroV2"
export const Hero = HeroV2;