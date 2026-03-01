import { useState } from 'react';
import { ShoppingBag, Download, Gift, Star, Package, ChefHat, BookOpen, Sparkles, ExternalLink, Tag } from 'lucide-react';
import { SOCIALS } from '../data';

const DIGITAL_PRODUCTS = [
    {
        id: 'recipe-vault',
        name: 'The Rx Vault — Digital Recipe Book',
        subtitle: 'Vol. 1: Breads & Ferments',
        price: '$18',
        originalPrice: '$24',
        tag: 'Best Seller',
        icon: BookOpen,
        description: 'Over 20 tested recipes covering sourdough starters, artisan loaves, focaccia, milk buns, and fermented condiments — with chef notes and technique breakdowns.',
        features: ['20+ step-by-step recipes', 'Chef Marc technique notes', 'Printable PDF format', 'Lifetime access & updates'],
        cta: 'Buy Digital Book',
        link: SOCIALS.membership,
        color: 'bg-[#c05621]',
    },
    {
        id: 'meal-plan',
        name: 'The Weekly Prescription',
        subtitle: 'Artisan Meal Plan Bundle',
        price: '$12',
        originalPrice: null,
        tag: 'New',
        icon: ChefHat,
        description: 'A 7-day meal plan built around The Wich Doc recipes. Includes a grocery list, prep schedule, and scaling guide for 2–6 people.',
        features: ['7-day structured plan', 'Grocery & prep lists', 'Scaling guide (2–6 people)', 'PDF + mobile-friendly'],
        cta: 'Get Meal Plan',
        link: SOCIALS.membership,
        color: 'bg-[#152238]',
    },
    {
        id: 'spice-guide',
        name: 'The Compound Formula',
        subtitle: 'House Spice Blend Recipes',
        price: '$8',
        originalPrice: null,
        tag: null,
        icon: Sparkles,
        description: 'The exact spice ratios behind our signature blends — za\'atar mix, smoked paprika rub, and fermented chili base.',
        features: ['3 signature blend formulas', 'Sourcing guide for BC', 'Jar & storage tips', 'PDF download'],
        cta: 'Buy Spice Guide',
        link: SOCIALS.membership,
        color: 'bg-[#1a110d]',
    },
];

const PHYSICAL_PRODUCTS = [
    {
        id: 'gift-card-25',
        name: 'Gift Card — $25',
        subtitle: 'The perfect prescription for a friend',
        price: '$25',
        icon: Gift,
        link: SOCIALS.order,
        description: 'Delivered digitally via email. Redeemable for any menu item or order.',
    },
    {
        id: 'gift-card-50',
        name: 'Gift Card — $50',
        subtitle: 'Treat them to a full experience',
        price: '$50',
        icon: Gift,
        link: SOCIALS.order,
        description: 'Delivered digitally via email. Never expires.',
    },
    {
        id: 'catering-deposit',
        name: 'Catering Deposit',
        subtitle: 'Lock in your event date',
        price: '$100',
        icon: Package,
        link: '/catering',
        description: 'Secure your catering booking with a refundable deposit. Full pricing provided after consultation.',
        internal: true,
    },
];

const AFFILIATE_TOOLS = [
    {
        name: 'Challenger Bread Lame',
        category: 'Baking Tools',
        desc: 'The exact scoring tool we use for every sourdough loaf.',
        badge: 'Used in the Kitchen',
        link: 'https://challengerbreadware.com',
    },
    {
        name: 'Maldon Sea Salt Flakes',
        category: 'Pantry',
        desc: 'Our go-to finishing salt for sandwiches and focaccia.',
        badge: 'Chef Approved',
        link: 'https://www.maldonsalt.com',
    },
    {
        name: 'Thermapen ONE',
        category: 'Thermometers',
        desc: 'Instant-read for perfect bread proofing temps every time.',
        badge: 'Essential Kit',
        link: 'https://www.thermoworks.com/thermapen-one',
    },
];

const ProductCard = ({ product }) => {
    const Icon = product.icon;
    return (
        <div className="bg-white border-4 border-[#1a110d] rounded-3xl overflow-hidden shadow-xl flex flex-col hover:-translate-y-1 transition-transform duration-300">
            <div className={`${product.color} px-6 py-5 text-white border-b-4 border-[#1a110d] relative`}>
                <div className="flex items-center justify-between">
                    <Icon size={24} />
                    {product.tag && (
                        <span className="bg-[#f4ebd0] text-[#1a110d] text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-widest">
                            {product.tag}
                        </span>
                    )}
                </div>
                <h3 className="text-lg font-bold mt-3 leading-tight">{product.name}</h3>
                <p className="text-white/70 text-xs mt-1">{product.subtitle}</p>
            </div>
            <div className="p-6 flex flex-col flex-grow">
                <p className="text-sm text-[#1a110d]/70 leading-relaxed mb-4">{product.description}</p>
                {product.features && (
                    <ul className="space-y-1 mb-5 flex-grow">
                        {product.features.map(f => (
                            <li key={f} className="flex items-center gap-2 text-xs text-[#1a110d]/80">
                                <span className="text-[#c05621] text-base leading-none">✦</span> {f}
                            </li>
                        ))}
                    </ul>
                )}
                <div className="flex items-center justify-between mt-auto pt-4 border-t-2 border-[#1a110d]/10">
                    <div>
                        <span className="text-2xl font-bold text-[#1a110d]">{product.price}</span>
                        {product.originalPrice && (
                            <span className="text-sm text-[#1a110d]/40 line-through ml-2">{product.originalPrice}</span>
                        )}
                    </div>
                    <a
                        href={product.link}
                        target={product.internal ? '_self' : '_blank'}
                        rel="noreferrer"
                        className="flex items-center gap-1 px-5 py-2 bg-[#c05621] text-white text-xs font-bold uppercase tracking-widest rounded hover:bg-[#a84615] transition-colors"
                    >
                        <Download size={12} /> {product.cta}
                    </a>
                </div>
            </div>
        </div>
    );
};

const GiftCard = ({ product }) => {
    const Icon = product.icon;
    return (
        <a
            href={product.link}
            target={product.internal ? '_self' : '_blank'}
            rel="noreferrer"
            className="block bg-[#f4ebd0] border-4 border-[#1a110d] rounded-2xl p-5 hover:border-[#c05621] transition-colors group"
        >
            <div className="flex items-center gap-3 mb-2">
                <Icon size={20} className="text-[#c05621] group-hover:scale-110 transition-transform" />
                <span className="text-2xl font-bold text-[#1a110d]">{product.price}</span>
            </div>
            <h4 className="font-bold text-[#1a110d] text-sm">{product.name}</h4>
            <p className="text-xs text-[#1a110d]/60 mt-1">{product.description}</p>
        </a>
    );
};

const Shop = () => {
    const [activeTab, setActiveTab] = useState('digital');

    return (
        <div className="animate-in texture-burlap min-h-screen">
            {/* Header */}
            <div className="bg-[#1a110d] texture-wood border-b-8 border-[#152238] py-16 px-4 text-center text-[#f4ebd0]">
                <div className="flex items-center justify-center gap-3 mb-4">
                    <ShoppingBag size={28} className="text-[#c05621] flame-1" />
                    <h1 className="text-4xl md:text-5xl font-bold uppercase tracking-tighter text-shadow-wood">The Dispensary</h1>
                </div>
                <p className="text-[#f4ebd0]/60 max-w-xl mx-auto text-sm">
                    Digital recipe books, meal plans, gift cards, and chef-approved kitchen tools — all curated by Chef Marc.
                </p>
            </div>

            {/* Tabs */}
            <div className="sticky top-16 z-30 bg-[#f4ebd0] border-b-4 border-[#1a110d]">
                <div className="max-w-4xl mx-auto flex">
                    {[
                        { id: 'digital', label: 'Digital Products', icon: Download },
                        { id: 'gifts', label: 'Gift Cards', icon: Gift },
                        { id: 'tools', label: 'Chef\'s Picks', icon: Star },
                    ].map(({ id, label, icon: Icon }) => (
                        <button
                            key={id}
                            onClick={() => setActiveTab(id)}
                            className={`flex-1 flex items-center justify-center gap-2 py-4 text-xs font-bold uppercase tracking-widest transition-colors cursor-pointer ${activeTab === id ? 'bg-[#c05621] text-white' : 'text-[#1a110d]/60 hover:text-[#1a110d]'}`}
                        >
                            <Icon size={14} /> <span className="hidden sm:inline">{label}</span>
                        </button>
                    ))}
                </div>
            </div>

            <div className="max-w-5xl mx-auto px-4 py-12">

                {/* Digital Products */}
                {activeTab === 'digital' && (
                    <div>
                        <div className="text-center mb-10">
                            <h2 className="text-2xl font-bold text-[#1a110d] uppercase tracking-tighter">Digital Downloads</h2>
                            <p className="text-sm text-[#1a110d]/60 mt-2">Buy once, keep forever. Instant delivery to your inbox.</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {DIGITAL_PRODUCTS.map(p => <ProductCard key={p.id} product={p} />)}
                        </div>

                        {/* Membership upsell */}
                        <div className="mt-12 bg-[#152238] bg-denim-patch border-4 border-[#c05621] rounded-3xl p-8 text-center text-[#f4ebd0]">
                            <Star size={24} className="text-[#c05621] flame-1 mx-auto mb-3" />
                            <h3 className="text-xl font-bold uppercase tracking-widest mb-2">Get Everything with a Membership</h3>
                            <p className="text-sm text-[#f4ebd0]/70 max-w-md mx-auto mb-6">
                                Members get full access to the Rx Vault, early menu drops, priority ordering, and all future recipe releases — for one flat fee.
                            </p>
                            <a
                                href={SOCIALS.membership}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-2 px-8 py-4 bg-[#c05621] text-white font-bold uppercase tracking-widest rounded hover:bg-[#a84615] transition-colors flame-2"
                            >
                                <Star size={16} /> Join as a Member
                            </a>
                        </div>
                    </div>
                )}

                {/* Gift Cards */}
                {activeTab === 'gifts' && (
                    <div>
                        <div className="text-center mb-10">
                            <h2 className="text-2xl font-bold text-[#1a110d] uppercase tracking-tighter">Gift Cards & Deposits</h2>
                            <p className="text-sm text-[#1a110d]/60 mt-2">The best prescription you can give someone.</p>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-2xl mx-auto">
                            {PHYSICAL_PRODUCTS.map(p => <GiftCard key={p.id} product={p} />)}
                        </div>
                        <p className="text-center text-xs text-[#1a110d]/40 mt-8 uppercase tracking-widest">
                            Gift cards delivered via Square. Catering deposit refundable within 14 days.
                        </p>
                    </div>
                )}

                {/* Chef's Picks / Affiliate */}
                {activeTab === 'tools' && (
                    <div>
                        <div className="text-center mb-10">
                            <h2 className="text-2xl font-bold text-[#1a110d] uppercase tracking-tighter">Chef's Picks</h2>
                            <p className="text-sm text-[#1a110d]/60 mt-2">Tools and ingredients we actually use in the kitchen.</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {AFFILIATE_TOOLS.map(tool => (
                                <a
                                    key={tool.name}
                                    href={tool.link}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="block bg-white border-4 border-[#1a110d] rounded-2xl p-6 hover:border-[#c05621] hover:-translate-y-1 transition-all group"
                                >
                                    <div className="flex items-start justify-between mb-3">
                                        <span className="text-[10px] bg-[#c05621] text-white font-bold px-2 py-1 rounded-full uppercase tracking-widest">
                                            {tool.badge}
                                        </span>
                                        <ExternalLink size={14} className="text-[#1a110d]/30 group-hover:text-[#c05621] transition-colors" />
                                    </div>
                                    <h4 className="font-bold text-[#1a110d] mb-1">{tool.name}</h4>
                                    <p className="text-[10px] text-[#c05621] uppercase tracking-widest font-bold mb-2">{tool.category}</p>
                                    <p className="text-xs text-[#1a110d]/70">{tool.desc}</p>
                                </a>
                            ))}
                        </div>
                        <p className="text-center text-xs text-[#1a110d]/30 mt-8 max-w-md mx-auto">
                            Some links may be affiliate links. We only recommend products we genuinely use. Purchasing through these links supports The Wich Doc at no extra cost to you.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Shop;
