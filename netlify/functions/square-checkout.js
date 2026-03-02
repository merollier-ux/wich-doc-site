export const handler = async (event) => {
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    let items;
    try {
        ({ items } = JSON.parse(event.body));
    } catch {
        return { statusCode: 400, body: JSON.stringify({ error: 'Invalid request body' }) };
    }

    if (!Array.isArray(items) || items.length === 0) {
        return { statusCode: 400, body: JSON.stringify({ error: 'No items provided' }) };
    }

    const accessToken = process.env.SQUARE_ACCESS_TOKEN;
    const locationId = process.env.SQUARE_LOCATION_ID;

    if (!accessToken || !locationId) {
        return { statusCode: 500, body: JSON.stringify({ error: 'Square not configured' }) };
    }

    const lineItems = items.map(({ name, price, quantity }) => ({
        name,
        quantity: String(quantity),
        base_price_money: {
            amount: Math.round(price * 100),
            currency: 'CAD',
        },
    }));

    const siteUrl = process.env.URL || 'https://wichdocbakeshop.ca';

    const payload = {
        idempotency_key: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
        order: {
            location_id: locationId,
            line_items: lineItems,
        },
        checkout_options: {
            redirect_url: `${siteUrl}/order`,
        },
    };

    try {
        const response = await fetch('https://connect.squareup.com/v2/online-checkout/payment-links', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${accessToken}`,
                'Square-Version': '2024-01-18',
            },
            body: JSON.stringify(payload),
        });

        const data = await response.json();

        if (!response.ok) {
            return {
                statusCode: response.status,
                body: JSON.stringify({ error: data.errors?.[0]?.detail || 'Square API error' }),
            };
        }

        const url = data.payment_link?.url;
        if (!url) {
            return { statusCode: 500, body: JSON.stringify({ error: 'No checkout URL returned' }) };
        }

        return {
            statusCode: 200,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ url }),
        };
    } catch {
        return { statusCode: 502, body: JSON.stringify({ error: 'Failed to reach Square' }) };
    }
};
