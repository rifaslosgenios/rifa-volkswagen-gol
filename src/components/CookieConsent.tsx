import React, { useState, useEffect } from 'react';
import { Cookie, ShieldAlert } from 'lucide-react';

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
        /* Fondo oscuro que bloquea la interacción con la página */
        <div className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm flex items-end sm:items-center justify-center animate-in fade-in duration-300">

            {/* Contenedor: Ocupa casi la mitad en móvil (bottom sheet) y un cuadro central en PC */}
            <div className="bg-slate-900 w-full sm:max-w-2xl sm:rounded-3xl rounded-t-3xl min-h-[45vh] sm:min-h-0 p-6 sm:p-8 flex flex-col justify-center shadow-[0_-10px_40px_rgba(0,0,0,0.5)] sm:shadow-2xl border-t sm:border border-slate-700 transition-all animate-in slide-in-from-bottom-8 duration-500">

                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 sm:gap-6">
                    <div className="w-16 h-16 sm:w-14 sm:h-14 rounded-2xl bg-[#FF2D78]/20 text-[#FF2D78] flex items-center justify-center shrink-0 shadow-lg">
                        <Cookie className="w-8 h-8 sm:w-7 sm:h-7" />
                    </div>

                    <div className="text-center sm:text-left flex-1 space-y-3">
                        <h3 className="font-heading font-black text-xl sm:text-2xl text-white">
                            Privacidad y Navegación
                        </h3>
                        <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                            Utilizamos cookies propias y de terceros para garantizar el correcto funcionamiento de la plataforma, analizar el tráfico y brindarte una experiencia de navegación 100% segura.
                        </p>
                        <div className="flex items-center justify-center sm:justify-start gap-2 text-xs text-slate-400 mt-2 bg-slate-800/50 p-3 rounded-xl border border-slate-700">
                            <ShieldAlert className="w-4 h-4 text-[#FF2D78] shrink-0" />
                            <span>Es un requisito aceptar las cookies para poder interactuar con la plataforma.</span>
                        </div>
                    </div>
                </div>

                <div className="mt-8 flex flex-col justify-end w-full border-t border-slate-800 pt-6">
                    <button
                        onClick={handleAccept}
                        className="w-full bg-[#FF2D78] hover:bg-[#E01A63] text-white font-heading font-black text-sm sm:text-base uppercase tracking-wider px-8 py-4 rounded-xl transition-all cursor-pointer shadow-[0_0_20px_rgba(255,45,120,0.3)]"
                    >
                        Aceptar Cookies y Continuar
                    </button>
                </div>
            </div>
        </div>
    );
};