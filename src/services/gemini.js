// mode: 'dose' | 'triage' | 'trial' — prompts live in netlify/functions/claude.js
export const callAI = async (mode, input = '') => {
    const response = await fetch('/.netlify/functions/claude', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mode, input })
    });

    if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.error || `Server error ${response.status}`);
    }

    const data = await response.json();
    return data.text;
};
