import { Wheat, RefreshCw, ShoppingCart, Check } from 'lucide-react';
import { useCart } from '../context/CartContext';

// Fake variation ID — replaced with real Square subscription product ID once wired
export const SUBSCRIPTION_ITEM = {
    id: 'sub_weekly_bread',
    variationId: 'sub_weekly_bread_v1',
    name: 'Weekly Bread Subscription — 3 Loaves',
    priceCents: 3000,
    isSubscription: true,
};

const LOAVES = [
    'Red Fife & Cheddar Farmer\'s Loaf',
    'Rotating seasonal loaf',
    'Ancient grain flatbread (Aish Baladi or Matnakash)',
];

const SubscriptionCard = ({ variant = 'default' }) => {
    const { addItem, cartItems } = useCart();
    const inCart = cartItems.some(i => i.variationId === SUBSCRIPTION_ITEM.variationId);

    const handleAdd = () => {
        if (!inCart) addItem(SUBSCRIPTION_ITEM);
    };

    // Compact variant for Menu page
    if (variant === 'compact') {
        return (
            <div className="bg-[#152238] border-4 border-[#c05621] rounded-2xl p-5 flex flex-col gap-4 text-[#f4ebd0] relative overflow-hidden">
                <div className="absolute top-0 right-0 bg-[#c05621] text-white text-[10px] font-bold px-3 py-1 uppercase tracking-widest">
                    Subscribe & Save
                </div>
                <div className="flex items-center gap-3 mt-2">
                    <RefreshCw size={20} className="text-[#c05621] flame-2 shrink-0" />
                    <div>
                        <h4 className="font-bold text-sm uppercase tracking-widest">Weekly Bread Box</h4>
                        <p className="text-[#f4ebd0]/60 text-xs mt-0.5">3 loaves · picked fresh · weekly</p>
                    </div>
                </div>
                <ul className="space-y-1">
                    {LOAVES.map((l, i) => (
                        <li key={i} className="flex items-start gap-2 text-xs text-[#f4ebd0]/80">
                            <Check size={10} className="text-[#c05621] mt-0.5 shrink-0" />
                            {l}
                        </li>
                    ))}
                </ul>
                <div className="flex items-center justify-between border-t border-[#f4ebd0]/10 pt-3">
                    <div>
                        <span className="text-2xl font-bold">$30</span>
                        <span className="text-[#f4ebd0]/40 text-xs ml-1">/ week</span>
                    </div>
                    <button
                        onClick={handleAdd}
                        disabled={inCart}
                        className="flex items-center gap-2 px-4 py-2 bg-[#c05621] text-white text-xs font-bold uppercase tracking-widest rounded hover:bg-[#a84615] transition-colors disabled:bg-[#f4ebd0]/20 disabled:text-[#f4ebd0]/40 flame-2 cursor-pointer disabled:cursor-default"
                    >
                        <ShoppingCart size={12} />
                        {inCart ? 'Added' : 'Subscribe'}
                    </button>
                </div>
            </div>
        );
    }

    // Full variant for Shop and Home pages
    return (
        <div className="bg-[#1a110d] texture-wood border-4 border-[#c05621] rounded-3xl overflow-hidden shadow-2xl">
            <div className="bg-[#c05621] px-8 py-5 border-b-4 border-[#1a110d] flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Wheat size={22} className="text-white" />
                    <div>
                        <h3 className="text-white font-bold uppercase tracking-widest text-sm">Weekly Bread Subscription</h3>
                        <p className="text-white/70 text-xs mt-0.5">Fresh from the kitchen. Every week.</p>
                    </div>
                </div>
                <span className="bg-[#1a110d] text-[#c05621] text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest flame-1">
                    New
                </span>
            </div>

            <div className="p-8 flex flex-col md:flex-row gap-8">
                <div className="flex-1 space-y-4">
                    <p className="text-[#f4ebd0]/80 text-sm leading-relaxed">
                        Three different loaves, baked the day before pickup. Anchored by a rotating seasonal selection — so you get variety without the guesswork.
                    </p>
                    <div className="space-y-2">
                        {LOAVES.map((loaf, i) => (
                            <div key={i} className="flex items-start gap-3 text-sm text-[#f4ebd0]">
                                <span className="text-[#c05621] flame-1 shrink-0 mt-0.5">✦</span>
                                <span>{loaf}</span>
                            </div>
                        ))}
                    </div>
                    <div className="pt-2 space-y-1">
                        {[
                            'Pickup Wednesday at Island Roots Market',
                            'Cancel or pause any time',
                            'First box includes a recipe card',
                        ].map((note, i) => (
                            <div key={i} className="flex items-center gap-2 text-xs text-[#f4ebd0]/50">
                                <Check size={10} className="text-[#c05621]/70 shrink-0" />
                                {note}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="flex flex-col items-center justify-center gap-4 bg-[#f4ebd0]/5 border-2 border-dashed border-[#c05621]/30 rounded-2xl px-8 py-6 shrink-0">
                    <div className="text-center">
                        <div className="text-4xl font-bold text-[#f4ebd0]">$30</div>
                        <div className="text-[#f4ebd0]/40 text-xs uppercase tracking-widest mt-1">per week</div>
                        <div className="text-[#c05621] text-xs font-bold mt-1">~$10 per loaf</div>
                    </div>
                    <button
                        onClick={handleAdd}
                        disabled={inCart}
                        className="flex items-center gap-2 px-6 py-3 bg-[#c05621] text-white font-bold uppercase tracking-widest text-xs rounded hover:bg-[#a84615] transition-colors flame-2 disabled:bg-[#f4ebd0]/20 disabled:text-[#f4ebd0]/40 w-full justify-center cursor-pointer disabled:cursor-default"
                    >
                        <ShoppingCart size={14} />
                        {inCart ? 'Added to Cart' : 'Add Subscription'}
                    </button>
                    <p className="text-[#f4ebd0]/30 text-[10px] text-center">
                        First charge at pickup.<br />Cancel any time.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default SubscriptionCard;
