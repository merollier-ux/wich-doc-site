// Shared by the site and the Netlify functions, so the price shown and the
// price charged come from the same place. Plain values only — no React.

export const DISCOUNT_CODE = 'FIRSTRX';
export const DISCOUNT_PCT = 15;

// Not a Square catalog item yet, so the server prices it from here.
export const SUBSCRIPTION_ITEM = {
    id: 'sub_weekly_bread',
    variationId: 'sub_weekly_bread_v1',
    name: 'Weekly Bread Subscription — 3 Loaves',
    priceCents: 3000,
    isSubscription: true,
};
