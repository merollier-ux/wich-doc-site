import { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, Plus, Minus, X, Trash2, CreditCard, CheckCircle, AlertCircle } from 'lucide-react';
import { useCart } from '../context/CartContext';

const fmt = (cents) => `$${(cents / 100).toFixed(2)}`;

// ── Checkout Modal ─────────────────────────────────────────────────────────────
const CheckoutModal = () => {
    const { cartItems, cartTotal, clearCart, setCheckoutOpen, setCartOpen } = useCart();
    const cardRef = useRef(null);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState('idle');
    const [errorMsg, setErrorMsg] = useState('');

    const onClose = () => setCheckoutOpen(false);

    useEffect(() => {
        if (!window.Square) {
            setErrorMsg('Square payment SDK not loaded. Please refresh and try again.');
            return;
        }
        const appId = import.meta.env.VITE_SQUARE_APPLICATION_ID;
        const locationId = import.meta.env.VITE_SQUARE_LOCATION_ID;

        if (!appId || !locationId) {
            const missing = [!appId && 'VITE_SQUARE_APPLICATION_ID', !locationId && 'VITE_SQUARE_LOCATION_ID']
                .filter(Boolean).join(' and ');
            setErrorMsg(`Missing env var(s): ${missing}. Restart netlify dev after adding them.`);
            return;
        }

        let cancelled = false;
        const init = async () => {
            try {
                const payments = window.Square.payments(appId, locationId);
                const card = await payments.card({
                    style: {
                        '.input-container': { borderColor: 'rgba(26,17,13,0.2)', borderRadius: '4px' },
                        '.input-container.is-focus': { borderColor: '#c05621' },
                    },
                });
                if (cancelled) { card.destroy(); return; }
                await card.attach('#card-container');
                cardRef.current = card;
            } catch (err) {
                if (!cancelled) setErrorMsg('Could not load payment form. Please refresh and try again.');
            }
        };
        init();
        return () => {
            cancelled = true;
            cardRef.current?.destroy?.();
            cardRef.current = null;
        };
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!cardRef.current) return;
        setStatus('loading');
        setErrorMsg('');
        try {
            const result = await cardRef.current.tokenize();
            if (result.status !== 'OK') {
                setStatus('error');
                setErrorMsg(result.errors?.[0]?.message ?? 'Card validation failed.');
                return;
            }
            const note = cartItems.map(i => `${i.qty}x ${i.name}`).join(', ') + ` | ${name} <${email}>`;
            const resp = await fetch('/.netlify/functions/square-payment', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ nonce: result.token, amountCents: cartTotal, note }),
            });
            const data = await resp.json();
            if (!resp.ok) {
                setStatus('error');
                setErrorMsg(data.error ?? 'Payment failed. Please try again.');
                return;
            }
            setStatus('success');
            clearCart();
            // Fire confirmation email — non-blocking, failure is silent
            fetch('/.netlify/functions/send-order-email', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ customerEmail: email, customerName: name, items: cartItems, totalCents: cartTotal }),
            }).catch(() => {});
        } catch {
            setStatus('error');
            setErrorMsg('Network error. Please check your connection and try again.');
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="bg-[#f4ebd0] w-full max-w-md rounded-3xl overflow-hidden shadow-2xl border-4 border-[#1a110d] max-h-[90vh] flex flex-col">
                <div className="bg-[#152238] px-6 py-4 border-b-4 border-[#c05621] flex items-center justify-between shrink-0">
                    <h2 className="text-[#f4ebd0] font-bold uppercase tracking-widest text-sm flex items-center gap-2">
                        <CreditCard size={14} className="text-[#c05621]" /> Secure Checkout
                    </h2>
                    <button onClick={onClose} className="text-[#f4ebd0]/50 hover:text-[#f4ebd0] cursor-pointer transition-colors">
                        <X size={18} />
                    </button>
                </div>
                <div className="overflow-y-auto p-6 space-y-5">
                    {status === 'success' ? (
                        <div className="text-center py-8 space-y-4">
                            <CheckCircle size={48} className="text-[#c05621] mx-auto" />
                            <h3 className="text-xl font-bold text-[#1a110d]">Order Placed!</h3>
                            <p className="text-sm text-[#1a110d]/60">We'll be in touch at <strong>{email}</strong> with your pickup details.</p>
                            <button onClick={onClose} className="mt-4 px-8 py-3 bg-[#c05621] text-white font-bold uppercase tracking-widest rounded hover:bg-[#a84615] transition-colors cursor-pointer">
                                Done
                            </button>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="bg-white rounded-xl border-2 border-[#1a110d]/10 p-4">
                                <p className="text-[10px] font-bold uppercase tracking-widest text-[#1a110d]/40 mb-3">Order Summary</p>
                                <div className="space-y-2">
                                    {cartItems.map(i => (
                                        <div key={i.variationId} className="flex justify-between text-sm text-[#1a110d]">
                                            <span>{i.qty}× {i.name}</span>
                                            <span className="font-bold">{fmt(i.priceCents * i.qty)}</span>
                                        </div>
                                    ))}
                                </div>
                                <div className="border-t border-dashed border-[#1a110d]/20 pt-2 mt-3 flex justify-between font-bold text-[#1a110d]">
                                    <span>Total</span>
                                    <span className="text-[#c05621]">{fmt(cartTotal)}</span>
                                </div>
                            </div>
                            <div className="space-y-3">
                                <p className="text-[10px] font-bold uppercase tracking-widest text-[#1a110d]/40">Contact Info</p>
                                <input className="input-field" type="text" placeholder="Full Name" value={name} onChange={e => setName(e.target.value)} required />
                                <input className="input-field" type="email" placeholder="Email address" value={email} onChange={e => setEmail(e.target.value)} required />
                            </div>
                            <div className="space-y-2">
                                <p className="text-[10px] font-bold uppercase tracking-widest text-[#1a110d]/40">Card Details</p>
                                <div id="card-container" className="bg-white border-2 border-[#1a110d]/20 rounded p-3 min-h-[80px]" />
                            </div>
                            {errorMsg && (
                                <div className="flex items-start gap-2 text-red-600 text-xs bg-red-50 border border-red-200 rounded p-3">
                                    <AlertCircle size={14} className="shrink-0 mt-0.5" />
                                    <span>{errorMsg}</span>
                                </div>
                            )}
                            <button
                                type="submit"
                                disabled={status === 'loading'}
                                className="w-full py-4 bg-[#c05621] text-white font-bold uppercase tracking-widest rounded hover:bg-[#a84615] transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {status === 'loading' ? 'Processing…' : `Pay ${fmt(cartTotal)}`}
                            </button>
                            <p className="text-center text-[10px] text-[#1a110d]/40 uppercase tracking-widest">
                                Secured by Square · Pickup only · Parksville, BC
                            </p>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

// ── Cart Panel ─────────────────────────────────────────────────────────────────
const CartPanel = () => {
    const { cartItems, cartTotal, itemCount, addItem, removeItem, setCartOpen, openCheckout } = useCart();
    const navigate = useNavigate();

    return (
        <div className="fixed inset-0 z-50 flex justify-end">
            <div className="absolute inset-0 bg-black/50" onClick={() => setCartOpen(false)} />
            <div className="relative w-full max-w-sm bg-[#f4ebd0] border-l-4 border-[#1a110d] flex flex-col shadow-2xl">
                <div className="bg-[#152238] px-5 py-4 border-b-4 border-[#c05621] flex items-center justify-between shrink-0">
                    <h2 className="text-[#f4ebd0] font-bold uppercase tracking-widest text-sm flex items-center gap-2">
                        <ShoppingCart size={14} className="text-[#c05621]" /> Cart ({itemCount})
                    </h2>
                    <button onClick={() => setCartOpen(false)} className="text-[#f4ebd0]/50 hover:text-[#f4ebd0] cursor-pointer transition-colors">
                        <X size={18} />
                    </button>
                </div>
                {cartItems.length === 0 ? (
                    <div className="flex-1 flex flex-col items-center justify-center text-center p-8 space-y-3">
                        <ShoppingCart size={40} className="text-[#1a110d]/20" />
                        <p className="text-sm font-bold text-[#1a110d]/40 uppercase tracking-widest">Your cart is empty</p>
                        <button onClick={() => { setCartOpen(false); navigate('/menu'); }} className="text-xs text-[#c05621] hover:underline cursor-pointer">Browse the menu</button>
                    </div>
                ) : (
                    <>
                        <div className="flex-1 overflow-y-auto p-5 space-y-3">
                            {cartItems.map(item => (
                                <div key={item.variationId} className="flex items-center gap-3 bg-white border-2 border-[#1a110d]/10 rounded-xl p-3">
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-bold text-[#1a110d] truncate">{item.name}</p>
                                        <p className="text-xs text-[#c05621]">{fmt(item.priceCents)} each</p>
                                    </div>
                                    <div className="flex items-center gap-1 shrink-0">
                                        <button onClick={() => removeItem(item.variationId)} className="w-7 h-7 rounded-full bg-[#1a110d]/10 flex items-center justify-center hover:bg-[#c05621] hover:text-white transition-colors cursor-pointer">
                                            {item.qty === 1 ? <Trash2 size={12} /> : <Minus size={12} />}
                                        </button>
                                        <span className="w-6 text-center text-sm font-bold text-[#1a110d]">{item.qty}</span>
                                        <button onClick={() => addItem(item)} className="w-7 h-7 rounded-full bg-[#1a110d]/10 flex items-center justify-center hover:bg-[#c05621] hover:text-white transition-colors cursor-pointer">
                                            <Plus size={12} />
                                        </button>
                                    </div>
                                    <span className="text-sm font-bold text-[#1a110d] w-16 text-right shrink-0">{fmt(item.priceCents * item.qty)}</span>
                                </div>
                            ))}
                        </div>
                        <div className="p-5 border-t-4 border-[#1a110d]/10 space-y-3 shrink-0">
                            <div className="flex justify-between text-base font-bold text-[#1a110d]">
                                <span>Subtotal</span>
                                <span className="text-[#c05621]">{fmt(cartTotal)}</span>
                            </div>
                            <p className="text-[10px] text-[#1a110d]/40 uppercase tracking-widest text-center">Pickup only · Parksville, BC</p>
                            <button
                                onClick={openCheckout}
                                className="w-full py-4 bg-[#c05621] text-white font-bold uppercase tracking-widest rounded hover:bg-[#a84615] transition-colors cursor-pointer flex items-center justify-center gap-2"
                            >
                                <CreditCard size={16} /> Checkout
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

// ── Single export that renders whichever overlay is active ─────────────────────
const CartOverlay = () => {
    const { cartOpen, checkoutOpen } = useCart();
    return (
        <>
            {cartOpen     && <CartPanel />}
            {checkoutOpen && <CheckoutModal />}
        </>
    );
};

export default CartOverlay;
