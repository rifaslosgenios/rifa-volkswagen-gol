import { MercadoPagoConfig, Preference } from 'mercadopago';

export default async function handler(req, res) {
    // Solo permitimos peticiones POST (cuando alguien envía datos para comprar)
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Método no permitido' });
    }

    try {
        const { title, unit_price, quantity, orderId, buyerEmail } = req.body;

        // 1. Configuramos Mercado Pago usando una variable de entorno segura
        // (Esta clave la pondremos más adelante en Vercel, nunca en el código visible)
        const client = new MercadoPagoConfig({
            accessToken: process.env.MP_ACCESS_TOKEN
        });

        // 2. Creamos la "Preferencia" (el recibo de cobro digital)
        const preference = new Preference(client);

        const response = await preference.create({
            body: {
                items: [
                    {
                        id: orderId,
                        title: title,
                        quantity: Number(quantity),
                        unit_price: Number(unit_price),
                        currency_id: 'COP',
                    }
                ],
                payer: {
                    email: buyerEmail,
                },
                // A dónde redirige Mercado Pago al usuario después del proceso
                back_urls: {
                    success: `${req.headers.origin}?status=success&order=${orderId}`,
                    failure: `${req.headers.origin}?status=failure`,
                    pending: `${req.headers.origin}?status=pending`
                },
                auto_return: 'approved',

                // URL secreta donde Mercado Pago nos avisará cuando el pago sea exitoso (Webhook)
                notification_url: `${req.headers.origin}/api/webhook`,
                external_reference: orderId,
            }
        });

        // 3. Devolvemos el enlace de pago al frontend
        res.status(200).json({
            id: response.id,
            init_point: response.init_point // Este es el link oficial de pago
        });

    } catch (error) {
        console.error("Error al crear la preferencia de Mercado Pago:", error);
        res.status(500).json({ error: 'Error interno del servidor al procesar el pago' });
    }
}