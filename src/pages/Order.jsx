import { MapPin, Clock, Phone, ShoppingCart } from 'lucide-react';
import { Link } from 'react-router-dom';

const PICKUP_INFO = [
    { icon: MapPin,  label: 'Location', value: 'Parksville, BC' },
    { icon: Clock,   label: 'Hours',    value: 'Wed – Sat, 11am – 3pm' },
    { icon: Clock,   label: 'Lead Time',value: '24-hour advance order recommended' },
    { icon: Phone,   label: 'Phone',    value: '672-922-0970' },
];

const Order = () => (
    <div className="animate-in texture-burlap min-h-screen flex flex-col items-center justify-center px-4 py-20 text-center">
        <ShoppingCart size={48} className="text-[#c05621] mb-6 flame-1" />
        <h1 className="text-4xl font-bold text-[#1a110d] uppercase tracking-tighter mb-2">Ready to Order?</h1>
        <p className="text-[#1a110d]/60 text-sm max-w-sm mb-10">
            Browse the menu, add items to your cart, and pay securely — all without leaving the page.
        </p>
        <Link
            to="/menu"
            className="inline-flex items-center gap-2 px-10 py-4 bg-[#c05621] text-white font-bold uppercase tracking-widest rounded-xl text-sm hover:bg-[#a84615] transition-colors shadow-2xl flame-2"
        >
            <ShoppingCart size={18} /> Browse &amp; Order
        </Link>

        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-2xl w-full">
            {PICKUP_INFO.map(({ icon: Icon, label, value }) => (
                <div key={label} className="bg-white/60 border-2 border-[#1a110d]/10 rounded-xl p-4">
                    <div className="flex items-center justify-center gap-1 mb-1 text-[#c05621]">
                        <Icon size={12} />
                        <span className="text-[10px] font-bold uppercase tracking-widest text-[#1a110d]/50">{label}</span>
                    </div>
                    <p className="text-xs font-bold text-[#1a110d]">{value}</p>
                </div>
            ))}
        </div>
    </div>
);

export default Order;
