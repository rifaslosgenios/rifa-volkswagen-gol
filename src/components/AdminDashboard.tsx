import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { CheckCircle2, XCircle, Clock, User, Phone, Landmark, ImageIcon, X } from 'lucide-react';

interface OrderData {
    id: string;
    buyerName: string;
    buyerPhone: string;
    numbers: string[];
    totalAmount: number;
    paymentMethod: string;
    receiptImageBase64: string;
    createdAt: any; // Timestamp de Firebase
}

export default function AdminDashboard() {
    const [password, setPassword] = useState('');
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [orders, setOrders] = useState<OrderData[]>([]);
    const [loading, setLoading] = useState(false);

    // Visor de imágenes en pantalla completa
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    // Intentar login
    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        // VITE_ADMIN_PASSWORD debe estar en tu archivo .env
        const correctPassword = import.meta.env.VITE_ADMIN_PASSWORD || 'genios2026*';
        if (password === correctPassword) {
            setIsAuthenticated(true);
            fetchPendingOrders();
        } else {
            alert('Contraseña incorrecta');
            setPassword('');
        }
    };

    // Buscar órdenes en Firebase
    const fetchPendingOrders = async () => {
        setLoading(true);
        try {
            const ordersRef = collection(db, 'orders');
            // Filtramos las que tengan estado pending
            const q = query(ordersRef, where('status', '==', 'pending'));
            const querySnapshot = await getDocs(q);

            const fetchedOrders: OrderData[] = [];
            querySnapshot.forEach((doc) => {
                fetchedOrders.push({ id: doc.id, ...doc.data() } as OrderData);
            });

            setOrders(fetchedOrders);
        } catch (error) {
            console.error("Error cargando órdenes:", error);
            alert("Error al conectar con la base de datos.");
        } finally {
            setLoading(false);
        }
    };

    // APROBAR
    const handleApprove = async (orderId: string) => {
        if (!window.confirm("¿Seguro que verificaste el dinero en tu banco y deseas APROBAR?")) return;
        try {
            const orderRef = doc(db, 'orders', orderId);
            await updateDoc(orderRef, {
                status: 'success'
            });

            // Nota: Si tienes una colección separada de 'tickets', 
            // aquí deberías hacer un batch update para pasar esos tickets de 'reserved' a 'sold' o 'paid'.

            setOrders(prev => prev.filter(o => o.id !== orderId));
            alert("¡Orden Aprobada con éxito!");
        } catch (error) {
            console.error("Error al aprobar:", error);
            alert("Hubo un error al aprobar la orden.");
        }
    };

    // RECHAZAR
    const handleReject = async (orderId: string) => {
        if (!window.confirm("¿Estás seguro de RECHAZAR esta orden y liberar los números?")) return;
        try {
            const orderRef = doc(db, 'orders', orderId);
            await updateDoc(orderRef, {
                status: 'rejected'
            });

            setOrders(prev => prev.filter(o => o.id !== orderId));
            alert("Orden Rechazada. Los números vuelven a estar disponibles.");
        } catch (error) {
            console.error("Error al rechazar:", error);
        }
    };

    // FORMATO DE FECHA
    const formatDate = (timestamp: any) => {
        if (!timestamp) return 'Fecha desconocida';
        const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
        return date.toLocaleString('es-CO', {
            day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit'
        });
    };

    // PANTALLA DE LOGIN
    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
                <div className="bg-white p-8 rounded-3xl shadow-2xl max-w-sm w-full text-center">
                    <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Landmark className="w-8 h-8 text-slate-700" />
                    </div>
                    <h2 className="font-heading font-black text-2xl text-slate-800 mb-2">Acceso Restringido</h2>
                    <p className="text-sm text-slate-500 mb-6">Panel de verificación de transferencias</p>
                    <form onSubmit={handleLogin}>
                        <input
                            type="password"
                            placeholder="Contraseña Maestra"
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl mb-4 text-center focus:ring-2 focus:ring-[#0B5D3B] outline-none"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            autoFocus
                        />
                        <button
                            type="submit"
                            className="w-full bg-[#111827] text-white font-bold py-3 rounded-xl hover:bg-black transition-colors"
                        >
                            Ingresar
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    // PANTALLA PRINCIPAL DEL PANEL
    return (
        <div className="min-h-screen bg-slate-50 p-4 md:p-8 font-sans">
            <div className="max-w-7xl mx-auto">

                {/* HEADER */}
                <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                    <div>
                        <h1 className="font-heading font-black text-2xl text-slate-800">Verificación de Pagos</h1>
                        <p className="text-slate-500 text-sm flex items-center gap-2 mt-1">
                            <Clock className="w-4 h-4" /> Tienes {orders.length} comprobantes pendientes por revisar
                        </p>
                    </div>
                    <button
                        onClick={fetchPendingOrders}
                        className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-6 py-2 rounded-xl font-bold transition-colors text-sm"
                    >
                        {loading ? 'Actualizando...' : 'Actualizar Bandeja'}
                    </button>
                </div>

                {/* LISTA DE ÓRDENES */}
                {orders.length === 0 && !loading ? (
                    <div className="text-center py-20 bg-white rounded-3xl border border-slate-200 border-dashed">
                        <CheckCircle2 className="w-16 h-16 text-green-400 mx-auto mb-4" />
                        <h3 className="font-heading font-bold text-xl text-slate-600">¡Todo al día!</h3>
                        <p className="text-slate-400 mt-2">No hay transferencias pendientes de verificación.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {orders.map(order => (
                            <div key={order.id} className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
                                <div className="flex flex-col md:flex-row gap-6">

                                    {/* DATOS DEL COMPRADOR */}
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <User className="w-4 h-4 text-slate-400" />
                                            <span className="font-bold text-slate-800">{order.buyerName}</span>
                                        </div>
                                        <div className="flex items-center gap-2 mb-4 text-sm text-slate-500">
                                            <Phone className="w-4 h-4 text-slate-400" />
                                            <span>{order.buyerPhone}</span>
                                            <span className="mx-2">•</span>
                                            <span>{formatDate(order.createdAt)}</span>
                                        </div>

                                        <div className="bg-slate-50 p-4 rounded-2xl mb-4 border border-slate-100">
                                            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">
                                                Números Reservados
                                            </span>
                                            <div className="flex flex-wrap gap-2">
                                                {order.numbers?.map(num => (
                                                    <span key={num} className="bg-[#111827] text-white text-xs font-bold px-2.5 py-1 rounded-md">
                                                        {num}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="flex justify-between items-center bg-green-50 text-green-800 p-3 rounded-xl font-bold">
                                            <span>Total reportado:</span>
                                            <span className="text-lg">${order.totalAmount?.toLocaleString('es-CO')}</span>
                                        </div>
                                    </div>

                                    {/* VISOR DE COMPROBANTE Y BOTONES */}
                                    <div className="w-full md:w-48 flex flex-col gap-3">
                                        <div
                                            className="bg-slate-100 h-40 rounded-2xl border border-slate-200 overflow-hidden relative group cursor-pointer flex items-center justify-center"
                                            onClick={() => setSelectedImage(order.receiptImageBase64)}
                                        >
                                            {order.receiptImageBase64 ? (
                                                <>
                                                    <img src={order.receiptImageBase64} alt="Comprobante" className="w-full h-full object-cover" />
                                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                        <span className="text-white text-xs font-bold">Ver Completo</span>
                                                    </div>
                                                </>
                                            ) : (
                                                <div className="text-slate-400 flex flex-col items-center">
                                                    <ImageIcon className="w-8 h-8 mb-1" />
                                                    <span className="text-xs">Sin imagen</span>
                                                </div>
                                            )}
                                        </div>

                                        <button
                                            onClick={() => handleApprove(order.id)}
                                            className="w-full bg-[#0B5D3B] hover:bg-[#094A2F] text-white font-bold py-2.5 rounded-xl transition-colors flex items-center justify-center gap-2 text-sm"
                                        >
                                            <CheckCircle2 className="w-4 h-4" /> Aprobar
                                        </button>
                                        <button
                                            onClick={() => handleReject(order.id)}
                                            className="w-full bg-slate-100 hover:bg-red-100 text-slate-600 hover:text-red-700 font-bold py-2.5 rounded-xl transition-colors flex items-center justify-center gap-2 text-sm"
                                        >
                                            <XCircle className="w-4 h-4" /> Rechazar
                                        </button>
                                    </div>

                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* MODAL PARA AMPLIAR IMAGEN */}
            {selectedImage && (
                <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4">
                    <button
                        onClick={() => setSelectedImage(null)}
                        className="absolute top-6 right-6 text-white hover:text-slate-300 transition-colors"
                    >
                        <X className="w-8 h-8" />
                    </button>
                    <img
                        src={selectedImage}
                        alt="Comprobante Ampliado"
                        className="max-w-full max-h-[90vh] rounded-lg object-contain"
                    />
                </div>
            )}
        </div>
    );
}