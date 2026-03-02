import { useState } from 'react';
import { ShoppingCart, Clock, MapPin, Star, ArrowRight, Phone, Plus, Minus, Trash2, X } from 'lucide-react';
import { SOCIALS } from '../data';
import { menuData } from '../data';

const PICKUP_INFO = {
    location: 'Parksville, BC',
    hours: 'Wed – Sat, 11am – 3pm',
    leadTime: '24-hour advance order recommended',
    phone: '(250) 000-0000',
};

// Prices per item (update these to match your actual Square prices)
const PRICES = {
    // Sandwiches
    'The Coastal Remedy': 18,
    'The Adrenaline Shot': 17,
    'The Vital Transfusion': 16,
    'The Parm-a-medic': 15,
    // Sides
    'Roasted Tomato Soup': 7,
    'Fried Pickle Chips': 6,
    'Caesar Potatoes': 7,
    // Desserts
    'The Local Anesthetic': 8,
    'The Midnight Shift': 8,
    // Breads
    "Garlic & Za'atar Focaccia": 10,
    "Doc's Farmers Loaf": 12,
    'Cheesy Milk Buns (4-Pack)': 9,
};

const Order = () => {
    const [cart, setCart] = useState({});
    const [showCart, setShowCart] = useState(false);
    const [checkoutLoading, setCheckoutLoading] = useState(false);

    const handleCheckout = async () => {
        setCheckoutLoading(true);
        try {
            const items = Object.entries(cart).map(([name, quantity]) => ({
                name,
                price: PRICES[name] || 0,
                quantity,
            }));
            const res = await fetch('/.netlify/functions/square-checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ items }),
            });
            const data = await res.json();
            if (!res.ok) {
                alert('Checkout error: ' + (data.error || 'Please try again.'));
                return;
            }
            window.location.href = data.url;
        } catch {
            alert('Could not reach checkout. Please try again or call us directly.');
        } finally {
            setCheckoutLoading(false);
        }
    };

    const cartCount = Object.values(cart).reduce((sum, qty) => sum + qty, 0);
    const cartTotal = Object.entries(cart).reduce((sum, [name, qty]) => sum + (PRICES[name] || 0) * qty, 0);

    const addItem = (name) => {
        setCart(prev => ({ ...prev, [name]: (prev[name] || 0) + 1 }));
    };

    const removeItem = (name) => {
        setCart(prev => {
            const next = { ...prev };
            if (next[name] <= 1) delete next[name];
            else next[name] -= 1;
            return next;
        });
    };

    const deleteItem = (name) => {
        setCart(prev => {
            const next = { ...prev };
            delete next[name];
            return next;
        });
    };

    const clearCart = () => setCart({});

    return (
        <div className="animate-in texture-burlap min-h-screen">
            {/* Header */}
            <div className="bg-[#1a110d] texture-wood border-b-8 border-[#152238] py-16 px-4 text-center text-[#f4ebd0]">
                <div className="flex items-center justify-center gap-3 mb-4">
                    <ShoppingCart size={28} className="text-[#c05621] flame-1" />
                    <h1 className="text-4xl md:text-5xl font-bold uppercase tracking-tighter text-shadow-wood">Order Now</h1>
                </div>
                <p className="text-[#f4ebd0]/60 max-w-lg mx-auto text-sm">
                    Build your order below, then head to Square to complete checkout.
                </p>
            </div>

            {/* Info bar */}
            <div className="bg-[#f4ebd0] border-b-4 border-[#1a110d] py-5 px-4">
                <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                    {[
                        { icon: MapPin, label: 'Location', value: PICKUP_INFO.location },
                        { icon: Clock, label: 'Hours', value: PICKUP_INFO.hours },
                        { icon: Clock, label: 'Lead Time', value: PICKUP_INFO.leadTime },
                        { icon: Phone, label: 'Phone', value: PICKUP_INFO.phone },
                    ].map(({ icon: Icon, label, value }) => (
                        <div key={label}>
                            <div className="flex items-center justify-center gap-1 mb-1 text-[#c05621]">
                                <Icon size={12} />
                                <span className="text-[10px] font-bold uppercase tracking-widest text-[#1a110d]/50">{label}</span>
                            </div>
                            <p className="text-xs font-bold text-[#1a110d]">{value}</p>
                        </div>
                    ))}
                </div>
            </div>

            <div className="max-w-5xl mx-auto px-4 py-12 space-y-16">
                {/* Sandwiches */}
                <MenuSection
                    title="Sandwiches"
                    items={menuData.sandwiches}
                    cart={cart}
                    onAdd={addItem}
                    onRemove={removeItem}
                />

                {/* Sides */}
                <MenuSection
                    title="Sides"
                    items={menuData.sides}
                    cart={cart}
                    onAdd={addItem}
                    onRemove={removeItem}
                    compact
                />

                {/* Fresh Breads */}
                <MenuSection
                    title="Fresh Breads"
                    items={menuData.breads}
                    cart={cart}
                    onAdd={addItem}
                    onRemove={removeItem}
                    compact
                />

                {/* Membership upsell */}
                <section className="bg-[#152238] bg-denim-patch border-4 border-[#c05621] rounded-3xl p-8 text-center text-[#f4ebd0]">
                    <Star size={24} className="text-[#c05621] flame-1 mx-auto mb-3" />
                    <h3 className="text-xl font-bold uppercase tracking-widest mb-2">Members Get Priority Orders</h3>
                    <p className="text-sm text-[#f4ebd0]/70 max-w-md mx-auto mb-6">
                        Skip the queue. Members receive priority pickup slots, early access to limited menu items, and exclusive member-only specials each week.
                    </p>
                    <a
                        href={SOCIALS.membership}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 px-8 py-4 bg-[#c05621] text-white font-bold uppercase tracking-widest rounded hover:bg-[#a84615] transition-colors flame-2"
                    >
                        <Star size={16} /> Become a Member
                    </a>
                </section>
            </div>

            {/* Sticky cart bar — shows when cart has items */}
            {cartCount > 0 && (
                <div className="fixed bottom-0 left-0 right-0 z-50 bg-[#1a110d] border-t-4 border-[#c05621] px-4 py-4 shadow-2xl">
                    <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
                        <button
                            onClick={() => setShowCart(true)}
                            className="flex items-center gap-3 text-[#f4ebd0] hover:text-[#c05621] transition-colors"
                        >
                            <div className="relative">
                                <ShoppingCart size={22} />
                                <span className="absolute -top-2 -right-2 bg-[#c05621] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                                    {cartCount}
                                </span>
                            </div>
                            <div className="text-left">
                                <p className="text-xs font-bold uppercase tracking-widest">{cartCount} item{cartCount !== 1 ? 's' : ''} in cart</p>
                                <p className="text-[10px] text-[#f4ebd0]/50">Tap to review your order</p>
                            </div>
                        </button>
                        <div className="flex items-center gap-3">
                            <span className="text-[#f4ebd0] font-bold text-lg">${cartTotal.toFixed(2)}</span>
                            <button
                                onClick={handleCheckout}
                                disabled={checkoutLoading}
                                className="flex items-center gap-2 px-6 py-3 bg-[#c05621] text-white font-bold uppercase tracking-widest text-xs rounded hover:bg-[#a84615] transition-colors flame-2 disabled:opacity-60 disabled:cursor-wait"
                            >
                                {checkoutLoading ? 'Loading…' : <><span>Checkout</span> <ArrowRight size={14} /></>}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Cart drawer */}
            {showCart && (
                <div className="fixed inset-0 z-50 flex justify-end">
                    <div className="absolute inset-0 bg-black/60" onClick={() => setShowCart(false)} />
                    <div className="relative bg-[#f4ebd0] w-full max-w-sm flex flex-col shadow-2xl border-l-4 border-[#1a110d]">
                        {/* Drawer header */}
                        <div className="flex items-center justify-between px-5 py-4 border-b-4 border-[#1a110d] bg-[#1a110d] text-[#f4ebd0]">
                            <div className="flex items-center gap-2">
                                <ShoppingCart size={18} className="text-[#c05621]" />
                                <span className="font-bold uppercase tracking-widest text-sm">Your Order</span>
                            </div>
                            <button onClick={() => setShowCart(false)} className="text-[#f4ebd0]/60 hover:text-[#f4ebd0]">
                                <X size={18} />
                            </button>
                        </div>

                        {/* Cart items */}
                        <div className="flex-grow overflow-y-auto px-5 py-4 space-y-3">
                            {Object.entries(cart).map(([name, qty]) => (
                                <div key={name} className="flex items-center gap-3 bg-white border-2 border-[#1a110d]/20 rounded-xl p-3">
                                    <div className="flex-grow min-w-0">
                                        <p className="text-xs font-bold text-[#1a110d] truncate">{name}</p>
                                        <p className="text-[10px] text-[#1a110d]/50">${PRICES[name] || '—'} each</p>
                                    </div>
                                    <div className="flex items-center gap-1 shrink-0">
                                        <button
                                            onClick={() => removeItem(name)}
                                            className="w-6 h-6 rounded-full bg-[#1a110d]/10 flex items-center justify-center hover:bg-[#c05621] hover:text-white transition-colors"
                                        >
                                            <Minus size={10} />
                                        </button>
                                        <span className="w-6 text-center text-sm font-bold text-[#1a110d]">{qty}</span>
                                        <button
                                            onClick={() => addItem(name)}
                                            className="w-6 h-6 rounded-full bg-[#1a110d]/10 flex items-center justify-center hover:bg-[#c05621] hover:text-white transition-colors"
                                        >
                                            <Plus size={10} />
                                        </button>
                                        <button
                                            onClick={() => deleteItem(name)}
                                            className="w-6 h-6 ml-1 rounded-full bg-[#1a110d]/10 flex items-center justify-center hover:bg-red-500 hover:text-white transition-colors"
                                        >
                                            <Trash2 size={10} />
                                        </button>
                                    </div>
                                    <span className="text-xs font-bold text-[#1a110d] w-12 text-right shrink-0">
                                        ${((PRICES[name] || 0) * qty).toFixed(2)}
                                    </span>
                                </div>
                            ))}
                        </div>

                        {/* Cart footer */}
                        <div className="border-t-4 border-[#1a110d] px-5 py-4 space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-bold text-[#1a110d] uppercase tracking-widest">Estimated Total</span>
                                <span className="text-xl font-bold text-[#1a110d]">${cartTotal.toFixed(2)}</span>
                            </div>
                            <p className="text-[10px] text-[#1a110d]/50 leading-relaxed">
                                Final total confirmed at checkout. Taxes and any add-ons applied on Square.
                            </p>
                            <button
                                onClick={handleCheckout}
                                disabled={checkoutLoading}
                                className="flex items-center justify-center gap-2 w-full py-4 bg-[#c05621] text-white font-bold uppercase tracking-widest text-sm rounded-xl hover:bg-[#a84615] transition-colors flame-2 disabled:opacity-60 disabled:cursor-wait"
                            >
                                {checkoutLoading
                                    ? 'Connecting to Square…'
                                    : <><ShoppingCart size={16} /> Proceed to Square <ArrowRight size={14} /></>
                                }
                            </button>
                            <button
                                onClick={clearCart}
                                className="w-full text-center text-xs text-[#1a110d]/40 hover:text-red-500 transition-colors uppercase tracking-widest"
                            >
                                Clear cart
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const MenuSection = ({ title, items, cart, onAdd, onRemove, compact }) => (
    <section>
        <h3 className="text-xs font-bold uppercase tracking-widest text-[#c05621] mb-4 flex items-center gap-2 flame-2">
            <span className="h-px flex-1 bg-[#c05621]/30"></span> {title} <span className="h-px flex-1 bg-[#c05621]/30"></span>
        </h3>
        <div className={`grid grid-cols-1 ${compact ? 'md:grid-cols-3' : 'md:grid-cols-2'} gap-4`}>
            {items.map(item => (
                <MenuCard key={item.name} item={item} qty={cart[item.name] || 0} onAdd={onAdd} onRemove={onRemove} compact={compact} />
            ))}
        </div>
    </section>
);

const MenuCard = ({ item, qty, onAdd, onRemove, compact }) => (
    <div className={`bg-white border-2 rounded-2xl ${compact ? 'p-4' : 'p-5'} transition-all ${qty > 0 ? 'border-[#c05621] shadow-md' : 'border-[#1a110d]/20 hover:border-[#c05621]'}`}>
        <div className="flex items-start gap-2 mb-3">
            <div className="flex-1 min-w-0">
                <h4 className={`font-bold text-[#1a110d] ${compact ? 'text-sm' : 'text-base'}`}>{item.name}</h4>
                <p className="text-[10px] font-bold uppercase tracking-widest text-[#c05621] mt-0.5 flame-2">{item.subtitle}</p>
                {!compact && <p className="text-xs text-[#1a110d]/70 mt-2 leading-relaxed">{item.description}</p>}
            </div>
            {item.tag && (
                <span className="shrink-0 text-[9px] bg-[#f4ebd0] border border-[#1a110d]/20 text-[#1a110d] font-bold px-2 py-0.5 rounded-full uppercase tracking-widest">
                    {item.tag}
                </span>
            )}
        </div>
        <div className="flex items-center justify-between mt-auto pt-3 border-t border-[#1a110d]/10">
            <span className="text-sm font-bold text-[#1a110d]">
                {PRICES[item.name] ? `$${PRICES[item.name]}` : '—'}
            </span>
            {qty === 0 ? (
                <button
                    onClick={() => onAdd(item.name)}
                    className="flex items-center gap-1 px-3 py-1.5 bg-[#1a110d] text-white text-xs font-bold uppercase tracking-widest rounded-lg hover:bg-[#c05621] transition-colors"
                >
                    <Plus size={12} /> Add
                </button>
            ) : (
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => onRemove(item.name)}
                        className="w-7 h-7 rounded-full bg-[#1a110d]/10 flex items-center justify-center hover:bg-[#c05621] hover:text-white transition-colors"
                    >
                        <Minus size={12} />
                    </button>
                    <span className="text-sm font-bold text-[#1a110d] w-4 text-center">{qty}</span>
                    <button
                        onClick={() => onAdd(item.name)}
                        className="w-7 h-7 rounded-full bg-[#c05621] text-white flex items-center justify-center hover:bg-[#a84615] transition-colors"
                    >
                        <Plus size={12} />
                    </button>
                </div>
            )}
        </div>
    </div>
);

export default Order;
