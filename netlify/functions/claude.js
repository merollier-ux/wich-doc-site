import { menuData } from '../../src/data.js';

const MAX_INPUT_CHARS = 300;

// The site's three AI features. Prompts are built here, not in the browser,
// so this endpoint can't be used as a general-purpose AI proxy on our key.
const PROMPTS = {
    dose: () =>
        `Give me a short, witty medical-themed advice about eating sandwiches or bread. Max 1 sentence. Reply with only the sentence — no quotes, no extra text.`,
    triage: (input) =>
        `You are 'The Wich Doc', a witty medical-themed sandwich shop. A patient says: "${input}". Select exactly ONE item from this menu: ${JSON.stringify(menuData)}. Reply with ONLY a JSON object — no markdown, no extra text — using these fields: dishName (exact menu item name), diagnosis (short humorous medical phrase), reason (one prose sentence explaining why this cures the symptoms), dosage (funny serving instruction like "Two bites every 4 hours").`,
    trial: (input) =>
        `You are 'The Wich Doc', a mad scientist of gourmet sandwich craft. A customer craves: "${input}". Invent a completely original, medical-themed gourmet creation (sandwich, pastry, or dessert). Reply with ONLY a JSON object — no markdown, no extra text — using these fields: name (creative medical-themed dish name), ingredients (a single comma-separated string of 4-6 key ingredients), description (one prose sentence describing the dish's flavors and concept), warning (one funny medical-themed disclaimer sentence).`,
};

export const handler = async (event) => {
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    let mode, input;
    try {
        ({ mode, input = '' } = JSON.parse(event.body));
    } catch {
        return { statusCode: 400, body: JSON.stringify({ error: 'Invalid request body' }) };
    }

    const buildPrompt = Object.hasOwn(PROMPTS, mode) ? PROMPTS[mode] : null;
    if (!buildPrompt) {
        return { statusCode: 400, body: JSON.stringify({ error: 'Unknown request' }) };
    }
    if (typeof input !== 'string' || (mode !== 'dose' && !input.trim())) {
        return { statusCode: 400, body: JSON.stringify({ error: 'Missing input' }) };
    }
    if (input.length > MAX_INPUT_CHARS) {
        return { statusCode: 400, body: JSON.stringify({ error: `Please keep it under ${MAX_INPUT_CHARS} characters` }) };
    }

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
        return { statusCode: 500, body: JSON.stringify({ error: 'API key not configured' }) };
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 25000);

    try {
        const response = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': apiKey,
                'anthropic-version': '2023-06-01'
            },
            body: JSON.stringify({
                model: 'claude-haiku-4-5-20251001',
                max_tokens: 512,
                messages: [{ role: 'user', content: buildPrompt(input.trim()) }]
            }),
            signal: controller.signal
        });

        const data = await response.json();

        if (!response.ok) {
            return {
                statusCode: response.status,
                body: JSON.stringify({ error: data.error?.message || 'Claude API error' })
            };
        }

        const text = data.content?.[0]?.text;
        if (!text) {
            return { statusCode: 500, body: JSON.stringify({ error: 'Unexpected response format' }) };
        }

        return {
            statusCode: 200,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text })
        };
    } catch (err) {
        if (err.name === 'AbortError') {
            return { statusCode: 504, body: JSON.stringify({ error: 'Request timed out' }) };
        }
        return { statusCode: 502, body: JSON.stringify({ error: 'Failed to reach AI service' }) };
    } finally {
        clearTimeout(timeout);
    }
};
