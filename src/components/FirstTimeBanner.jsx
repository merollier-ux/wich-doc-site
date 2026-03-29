import { useState, useEffect } from 'react';
import { X, Tag } from 'lucide-react';
import { useAuth } from '../context/Authcontext';

const DISCOUNT_CODE = 'FIRSTRX';
const DISCOUNT_PCT = 15;

const FirstTimeBanner = () => {
    const { user, userProfile } = useAuth();
    const [dismissed, setDismissed] = useState(false);
    const [copied, setCopied] = useState(false);

    // Hide if user has completed first purchase
    const hasFirstPurchase = userProfile?.firstPurchaseComplete === true;

    // Also hide if they dismissed this session
    if (dismissed || hasFirstPurchase) return null;

    const handleCopy = () => {
        navigator.clipboard.writeText(DISCOUNT_CODE).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    };

    return (
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-[#152238] border-t-4 border-[#c05621] px-4 py-3 flex items-center justify-between gap-4 shadow-2xl">
            <div className="flex items-center gap-3 flex-wrap">
                <Tag size={16} className="text-[#c05621] shrink-0 flame-1" />
                <p className="text-[#f4ebd0] text-sm font-bold">
                    {user ? 'Welcome to the clinic.' : 'First visit?'}{' '}
                    <span className="text-[#f4ebd0]/70 font-normal">
                        Get {DISCOUNT_PCT}% off your first order.
                    </span>
                </p>
                <button
                    onClick={handleCopy}
                    className="bg-[#c05621] text-white text-xs font-bold px-3 py-1.5 rounded uppercase tracking-widest hover:bg-[#a84615] transition-colors flame-2 shrink-0"
                >
                    {copied ? 'Copied!' : DISCOUNT_CODE}
                </button>
                <span className="text-[#f4ebd0]/40 text-xs hidden sm:inline">
                    Apply at checkout
                </span>
            </div>
            <button
                onClick={() => setDismissed(true)}
                className="text-[#f4ebd0]/40 hover:text-[#f4ebd0] transition-colors shrink-0 p-1"
                aria-label="Dismiss"
            >
                <X size={16} />
            </button>
        </div>
    );
};

export { DISCOUNT_CODE, DISCOUNT_PCT };
export default FirstTimeBanner;
