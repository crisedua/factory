// Netlify serverless function to create MercadoPago payment preference
// Environment variable required: MERCADOPAGO_ACCESS_TOKEN

export default async (request, context) => {
    // Only allow POST requests
    if (request.method !== 'POST') {
        return new Response(JSON.stringify({ error: 'Method not allowed' }), {
            status: 405,
            headers: { 'Content-Type': 'application/json' }
        });
    }

    const ACCESS_TOKEN = Deno.env.get('MERCADOPAGO_ACCESS_TOKEN');

    if (!ACCESS_TOKEN) {
        console.error('MERCADOPAGO_ACCESS_TOKEN not configured');
        return new Response(JSON.stringify({ error: 'Payment service not configured' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }

    try {
        // Get request body
        const body = await request.json().catch(() => ({}));

        // Get the site URL for success/failure redirects
        const siteUrl = Deno.env.get('URL') || 'https://fabricastartup.netlify.app';

        // Create preference payload
        const preference = {
            items: [
                {
                    id: 'fabricastartup-access',
                    title: 'Acceso a FabricaStartup',
                    description: 'Acceso temprano a FabricaStartup - Validación de startups',
                    quantity: 1,
                    currency_id: 'ARS',
                    unit_price: 100
                }
            ],
            payer: {
                email: body.email || ''
            },
            back_urls: {
                success: `${siteUrl}?payment=success`,
                failure: `${siteUrl}?payment=failure`,
                pending: `${siteUrl}?payment=pending`
            },
            auto_return: 'approved',
            statement_descriptor: 'FABRICASTARTUP',
            external_reference: `fs_${Date.now()}`
        };

        // Call MercadoPago API to create preference
        const mpResponse = await fetch('https://api.mercadopago.com/checkout/preferences', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${ACCESS_TOKEN}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(preference)
        });

        if (!mpResponse.ok) {
            const errorData = await mpResponse.text();
            console.error('MercadoPago API error:', errorData);
            return new Response(JSON.stringify({ error: 'Failed to create payment preference' }), {
                status: 500,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        const preferenceData = await mpResponse.json();

        // Return the preference ID and checkout URL
        return new Response(JSON.stringify({
            preferenceId: preferenceData.id,
            init_point: preferenceData.init_point,
            sandbox_init_point: preferenceData.sandbox_init_point
        }), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            }
        });

    } catch (error) {
        console.error('Error creating preference:', error);
        return new Response(JSON.stringify({ error: 'Internal server error' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
};
