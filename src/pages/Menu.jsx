import { useState, useEffect } from 'react';
import { AlertTriangle, Plus } from 'lucide-react';
import SmartImage from '../components/SmartImage';
import SubscriptionCard from '../components/SubscriptionCard';
import { menuData } from '../data';
import { useCart } from '../context/CartContext';

const fmt = (cents) => `$${(cents / 100).toFixed(2)}`;
const normalize = (s) => s.toLowerCase().trim().replace(/[^a-z0-9]/g, '');

const COMING_SOON_CATS = new Set(['sandwiches', 'sides']);

const categoryImageMap = {
    sandwiches: '/sandwich1.png',
    sides: '/sides1.png',
    desserts: '/dessert1.png',
    breads: '/bread1.png',
};

const Menu = () => {
    const [activeCategory, setActiveCategory] = useState('sandwiches');
    const [catalogItems, setCatalogItems] = useState([]);
    const { addItem } = useCart();

    useEffect(() => {
        fetch('/.netlify/functions/square-catalog')
            .then(r => r.json())
            .then(data => { if (Array.isArray(data)) setCatalogItems(data); })
            .catch(() => {});
    }, []);

    const findCatalogItem = (name) =>
        catalogItems.find(c => normalize(c.name) === normalize(name));

    const isComingSoon = COMING_SOON_CATS.has(activeCategory);
    const showSubscription = activeCategory === 'breads';

    return (
        <section className="py-20 px-4 max-w-5xl mx-auto animate-in texture-burlap min-h-screen">
            <div className="text-center mb-16">
                <h2 className="text-4xl font-bold text-[#1a110d]">The Prescriptions</h2>
                <p className="text-[#c05621] mt-2 font-bold uppercase tracking-widest text-sm flame-3">Compounded Daily</p>
            </div>

            {/* Category Tabs */}
            <div className="flex flex-wrap justify-center gap-4 mb-10">
                {['sandwiches', 'sides', 'desserts', 'breads'].map((cat) => (
                    <button
                        key={cat}
                        onClick={() => setActiveCategory(cat)}
                        className={`px-6 py-3 rounded-full font-bold capitalize transition-all border-2 ${
                            activeCategory === cat
                            ? 'bg-[#152238] text-white border-[#152238] shadow-lg flame-2'
                            : 'bg-transparent text-[#1a110d] border-[#1a110d] hover:bg-[#1a110d] hover:text-white'
                        }`}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {isComingSoon && (
                <div className="bg-[#c05621] text-white p-4 rounded mb-8 text-center font-bold tracking-widest flex items-center justify-center gap-4 uppercase border-2 border-white/20 flame-1 shadow-lg">
                    <AlertTriangle size={18} /> Brick &amp; Mortar Exclusive — Coming Soon <AlertTriangle size={18} />
                </div>
            )}

            {/* Menu Grid */}
            <div className="grid md:grid-cols-2 gap-8 mb-12">
                {menuData[activeCategory].map((item, index) => {
                    const catalogItem = !isComingSoon ? findCatalogItem(item.name) : null;
                    const variation = catalogItem?.variations?.[0];
                    const hasPrice = variation && variation.priceCents > 0;

                    return (
                        <div key={index} className="bg-white p-6 shadow-md border-2 border-[#1a110d]/10 group relative hover:shadow-xl transition-shadow flex flex-col">
                            <div className="absolute top-0 left-0 w-full h-1 bg-[#c05621] transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
                            <div className="flex justify-between items-start mb-2">
                                <div>
                                    <h3 className="text-xl font-bold text-[#1a110d] font-serif">{item.name}</h3>
                                    <p className="text-[#c05621] font-bold text-xs uppercase tracking-wide">{item.subtitle}</p>
                                </div>
                                {item.tag && (
                                    <span className="text-[10px] bg-[#1a110d] text-[#f4ebd0] px-2 py-1 uppercase tracking-widest font-bold shrink-0 ml-2">
                                        {item.tag}
                                    </span>
                                )}
                            </div>
                            <p className="text-stone-600 text-sm leading-relaxed border-t border-dashed border-[#1a110d]/20 pt-2 mt-2 flex-1">
                                {item.description}
                            </p>
                            {!isComingSoon && (
                                <div className="mt-4 flex items-center justify-between">
                                    <span className="text-sm font-bold text-[#1a110d]">
                                        {hasPrice
                                            ? fmt(variation.priceCents)
                                            : <span className="text-[#1a110d]/30 text-xs uppercase tracking-widest">Price TBD</span>}
                                    </span>
                                    <button
                                        onClick={() => addItem({ id: catalogItem.id, variationId: variation.id, name: item.name, priceCents: variation.priceCents })}
                                        disabled={!hasPrice}
                                        className="flex items-center gap-1 px-4 py-2 bg-[#1a110d] text-[#f4ebd0] text-xs font-bold uppercase tracking-widest rounded hover:bg-[#c05621] transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                                    >
                                        <Plus size={12} /> Add to Cart
                                    </button>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Subscription Card — breads only */}
            {showSubscription && (
                <div className="mb-12">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="h-px flex-1 bg-[#1a110d]/10" />
                        <p className="text-[10px] font-bold uppercase tracking-widest text-[#1a110d]/40">Can't pick just one?</p>
                        <div className="h-px flex-1 bg-[#1a110d]/10" />
                    </div>
                    <SubscriptionCard variant="compact" />
                </div>
            )}

            {/* Visual Evidence */}
            <div className="mt-4 flex justify-center">
                <div className="w-full max-w-2xl text-center">
                    <h3 className="font-bold text-[#1a110d] uppercase tracking-widest text-xs mb-6 flex items-center justify-center gap-4">
                        <span className="h-px w-12 bg-[#1a110d]/30" />
                        Visual Evidence
                        <span className="h-px w-12 bg-[#1a110d]/30" />
                    </h3>
                    <div className="aspect-video p-2 bg-white border-2 border-[#152238] shadow-2xl transform rotate-1 hover:rotate-0 transition-transform duration-500">
                        <SmartImage src={categoryImageMap[activeCategory]} alt={`${activeCategory} example`} className="w-full h-full object-cover" />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Menu;
