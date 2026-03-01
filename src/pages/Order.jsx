import { ShoppingCart, Clock, MapPin, Star, ArrowRight, Phone } from 'lucide-react';
import { SOCIALS } from '../data';
import { menuData } from '../data';

const PICKUP_INFO = {
    location: 'Parksville, BC',
    hours: 'Wed – Sat, 11am – 3pm',
    leadTime: '24-hour advance order recommended',
    phone: '(250) 000-0000',
};

const Order = () => (
    <div className="animate-in texture-burlap min-h-screen">
        {/* Header */}
        <div className="bg-[#1a110d] texture-wood border-b-8 border-[#152238] py-16 px-4 text-center text-[#f4ebd0]">
            <div className="flex items-center justify-center gap-3 mb-4">
                <ShoppingCart size={28} className="text-[#c05621] flame-1" />
                <h1 className="text-4xl md:text-5xl font-bold uppercase tracking-tighter text-shadow-wood">Order Now</h1>
            </div>
            <p className="text-[#f4ebd0]/60 max-w-lg mx-auto text-sm">
                Place your order online. Pick up fresh. No waiting in line.
            </p>
            <a
                href={SOCIALS.order}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 mt-8 px-10 py-5 bg-[#c05621] text-white font-bold uppercase tracking-widest rounded-xl text-sm hover:bg-[#a84615] transition-colors shadow-2xl flame-2"
            >
                <ShoppingCart size={18} /> Place Order via Square <ArrowRight size={16} />
            </a>
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
            {/* Today's Menu Preview */}
            <section>
                <div className="text-center mb-10">
                    <h2 className="text-2xl font-bold text-[#1a110d] uppercase tracking-tighter">Prescription Menu</h2>
                    <p className="text-sm text-[#1a110d]/60 mt-2">Current signatures available for order.</p>
                </div>

                {/* Sandwiches */}
                <div className="mb-10">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-[#c05621] mb-4 flex items-center gap-2 flame-2">
                        <span className="h-px flex-1 bg-[#c05621]/30"></span> Sandwiches <span className="h-px flex-1 bg-[#c05621]/30"></span>
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {menuData.sandwiches.map(item => (
                            <MenuCard key={item.name} item={item} />
                        ))}
                    </div>
                </div>

                {/* Sides */}
                <div className="mb-10">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-[#c05621] mb-4 flex items-center gap-2 flame-2">
                        <span className="h-px flex-1 bg-[#c05621]/30"></span> Sides <span className="h-px flex-1 bg-[#c05621]/30"></span>
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {menuData.sides.map(item => (
                            <MenuCard key={item.name} item={item} compact />
                        ))}
                    </div>
                </div>

                {/* Breads */}
                <div className="mb-10">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-[#c05621] mb-4 flex items-center gap-2 flame-2">
                        <span className="h-px flex-1 bg-[#c05621]/30"></span> Fresh Breads <span className="h-px flex-1 bg-[#c05621]/30"></span>
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {menuData.breads.map(item => (
                            <MenuCard key={item.name} item={item} compact />
                        ))}
                    </div>
                </div>

                <div className="text-center mt-10">
                    <a
                        href={SOCIALS.order}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 px-10 py-5 bg-[#c05621] text-white font-bold uppercase tracking-widest rounded-xl text-sm hover:bg-[#a84615] transition-colors shadow-xl flame-2"
                    >
                        <ShoppingCart size={18} /> Order Now on Square <ArrowRight size={16} />
                    </a>
                </div>
            </section>

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
    </div>
);

const MenuCard = ({ item, compact }) => (
    <div className={`bg-white border-2 border-[#1a110d]/20 rounded-2xl ${compact ? 'p-4' : 'p-5'} hover:border-[#c05621] hover:shadow-md transition-all`}>
        <div className="flex items-start justify-between gap-2">
            <div className="flex-1">
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
    </div>
);

export default Order;
