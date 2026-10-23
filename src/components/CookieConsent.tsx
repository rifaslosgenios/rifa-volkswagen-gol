import React, { useState, useEffect } from 'react';
import { Cookie } from 'lucide-react';

export const CookieConsent: React.FC = () => {
    const [accepted, setAccepted] = useState(true);

    useEffect(() => {
        const consent = localStorage.getItem('cookie_consent');
        if (!consent) {
            setAccepted(false);
        }
    }, []);

    const handleAccept = () => {
        localStorage.setItem('cookie_consent', 'true');
        setAccepted(true);
    };

    if (accepted) return null;

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-slate-900/95 backdrop-blur-md border-t border-slate-800 text-white shadow-2xl animate-in slide-in-from-bottom duration-500">
            <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#FF2D78]/20 text-[#FF2D78] flex items-center justify-center shrink-0">
                        <Cookie className="w-5 h-5" />
                    </div>
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                        Utilizamos cookies propias y de terceros para mejorar tu experiencia de navegación, analizar el tráfico y garantizar la seguridad de tus compras. Al continuar navegando, aceptas nuestra política de cookies.
                    </p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                    <button
                        onClick={handleAccept}
                        className="bg-[#FF2D78] hover:bg-[#E01A63] text-white font-heading font-bold text-xs uppercase tracking-wider px-6 py-2.5 rounded-full transition-all cursor-pointer shadow-md"
                    >
                        Aceptar Cookies
                    </button>
                </div>
            </div>
        </div>
    );
};