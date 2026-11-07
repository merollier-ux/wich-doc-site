import { randomUUID } from 'crypto';
import { DISCOUNT_CODE, DISCOUNT_PCT } from '../../src/promo.js';
import { sendOrderEmail } from '../lib/order-email.js';

const SQUARE_API = 'https://connect.squareup.com/v2';
const MAX_LINES = 30;
const MAX_QTY = 20;

const json = (statusCode, body) => ({
    statusCode,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
});

// The browser only says WHAT to buy. Prices come from the Square catalog and
// Square computes the total, so a tampered request can't change what the card
// is charged.
export const handler = async (event) => {
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    let nonce, items, discountCode, name, email;
    try {
        ({ nonce, items, discountCode, name, email } = JSON.parse(event.body));
    } catch {
        return json(400, { error: 'Invalid request body' });
    }

    if (!nonce || typeof nonce !== 'string') {
        return json(400, { error: 'Missing payment details' });
    }
    if (!Array.isArray(items) || items.length === 0 || items.length > MAX_LINES) {
        return json(400, { error: 'Your cart is empty or too large' });
    }

    const lineItems = [];
    for (const { variationId, qty } of items) {
        if (typeof variationId !== 'string' || !Number.isInteger(qty) || qty < 1 || qty > MAX_QTY) {
            return json(400, { error: 'Invalid cart item' });
        }
        lineItems.push({ catalog_object_id: variationId, quantity: String(qty) });
    }

    const token = process.env.SQUARE_ACCESS_TOKEN;
    const locationId = process.env.SQUARE_LOCATION_ID || process.env.VITE_SQUARE_LOCATION_ID;
    if (!token || !locationId) {
        return json(500, { error: 'Square not configured' });
    }

    const applyDiscount = typeof discountCode === 'string'
        && discountCode.trim().toUpperCase() === DISCOUNT_CODE;

    const square = async (path, body) => {
        const resp = await fetch(`${SQUARE_API}${path}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Square-Version': '2024-01-17',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(body),
        });
        const data = await resp.json();
        if (!resp.ok) {
            console.error(`[square-payment] ${path} ${resp.status}`, JSON.stringify(data.errors));
            const err = new Error(data.errors?.[0]?.detail ?? 'Payment failed');
            err.status = resp.status;
            throw err;
        }
        return data;
    };

    const contact = [name, email].filter(Boolean).join(' ').slice(0, 200);

    try {
        const { order } = await square('/orders', {
            idempotency_key: randomUUID(),
            order: {
                location_id: locationId,
                line_items: lineItems,
                ...(applyDiscount && {
                    discounts: [{
                        uid: 'first-order',
                        name: DISCOUNT_CODE,
                        percentage: String(DISCOUNT_PCT),
                        scope: 'ORDER',
                    }],
                }),
                ...(contact && { metadata: { contact } }),
            },
        });

        const { payment } = await square('/payments', {
            source_id: nonce,
            idempotency_key: randomUUID(),
            amount_money: order.total_money,
            order_id: order.id,
            location_id: locationId,
            ...(email && { buyer_email_address: String(email).slice(0, 255) }),
            note: `Wich Doc online order${contact ? ` — ${contact}` : ''}`.slice(0, 500),
        });

        try {
            await sendOrderEmail({
                customerEmail: email,
                customerName: name,
                items: order.line_items.map(li => ({
                    name: li.name,
                    qty: Number(li.quantity),
                    totalCents: li.total_money.amount,
                })),
                totalCents: order.total_money.amount,
            });
        } catch (err) {
            // The customer has paid; a failed email must not look like a failed order.
            console.error('[square-payment] confirmation email failed:', err.message);
        }

        return json(200, { paymentId: payment.id, totalCents: order.total_money.amount });
    } catch (err) {
        if (err.status) return json(err.status, { error: err.message });
        console.error('[square-payment] request failed:', err);
        return json(502, { error: 'Failed to reach Square' });
    }
};
