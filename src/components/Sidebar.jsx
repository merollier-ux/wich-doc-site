import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChefHat, Menu, X, Lock, ShoppingBag, UserCircle, Utensils, Star } from 'lucide-react';
import { useAuth } from '../context/Authcontext';
import { SOCIALS } from '../data';

const Sidebar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const location = useLocation();
    const { user, userProfile } = useAuth();

    const close = () => setIsOpen(false);
    const isActive = (path) => location.pathname === path;

    const navLinks = [
        { path: '/home',   label: 'Home' },
        { path: '/clinic', label: 'Clinic' },
        { path: '/menu',   label: 'Menu' },
        { path: '/about',  label: 'About Us' },
        { path: '/blog',   label: 'Lab Journal' },
        ...(userProfile?.isMember ? [{ path: '/recipes', label: 'Rx Vault' }] : []),
    ];

    const incomeLinks = [
        { path: '/order',    label: 'Order Online', icon: ShoppingBag },
        { path: '/shop',     label: 'Shop',          icon: Star },
        { path: '/catering', label: 'Catering',      icon: Utensils },
    ];

    return (
        <>
            {/* Hamburger toggle — always visible */}
            <button
                onClick={() => setIsOpen(true)}
                className="fixed top-5 left-5 z-40 p-3 bg-[#1a110d] text-[#f4ebd0] rounded-lg shadow-xl hover:bg-[#c05621] transition-colors border border-[#c05621]/30 cursor-pointer"
                aria-label="Open menu"
            >
                <Menu size={20} />
            </button>

            {/* Backdrop */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
                    onClick={close}
                />
            )}

            {/* Slide-in panel */}
            <div className={`fixed top-0 left-0 h-full z-50 w-72 texture-wood flex flex-col shadow-2xl border-r-2 border-[#c05621]/20 transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>

                {/* Panel header */}
                <div className="flex items-center justify-between px-5 py-5 border-b border-[#c05621]/20">
                    <Link to="/home" onClick={close} className="flex items-center gap-3 group">
                        <div className="bg-[#c05621] p-1.5 rounded-full border-2 border-[#f4ebd0]/20 group-hover:rotate-12 transition-transform flame-2">
                            <ChefHat className="h-5 w-5 text-white" />
                        </div>
                        <div>
                            <span className="text-sm font-bold tracking-widest uppercase text-[#f4ebd0] block">Wich Doc</span>
                            <span className="text-[8px] text-[#f4ebd0]/50 uppercase tracking-[0.2em]">Bake Shop</span>
                        </div>
                    </Link>
                    <button onClick={close} className="text-[#f4ebd0]/50 hover:text-[#f4ebd0] transition-colors cursor-pointer p-1">
                        <X size={18} />
                    </button>
                </div>

                {/* Nav links */}
                <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-0.5">
                    <p className="text-[9px] uppercase tracking-widest text-[#f4ebd0]/30 px-3 pb-2">Pages</p>
                    {navLinks.map(link => (
                        <Link
                            key={link.path}
                            to={link.path}
                            onClick={close}
                            className={`flex items-center px-3 py-3 rounded font-bold uppercase text-xs tracking-widest transition-colors ${
                                isActive(link.path)
                                    ? 'bg-[#c05621]/20 text-[#c05621] flame-1'
                                    : 'text-[#f4ebd0]/70 hover:text-[#f4ebd0] hover:bg-[#f4ebd0]/5'
                            }`}
                        >
                            {link.label}
                        </Link>
                    ))}

                    {/* Income / Commerce section */}
                    <div className="pt-5 pb-2">
                        <div className="border-t border-dashed border-[#c05621]/20 mb-4" />
                        <p className="text-[9px] uppercase tracking-widest text-[#f4ebd0]/30 px-3 pb-2 flex items-center gap-2">
                            <ShoppingBag size={9} /> Commerce
                        </p>
                    </div>

                    {incomeLinks.map(link => {
                        const Icon = link.icon;
                        return (
                            <Link
                                key={link.path}
                                to={link.path}
                                onClick={close}
                                className={`flex items-center gap-2 px-3 py-3 rounded font-bold uppercase text-xs tracking-widest transition-colors ${
                                    isActive(link.path)
                                        ? 'bg-[#c05621]/20 text-[#c05621] flame-1'
                                        : 'text-[#f4ebd0]/70 hover:text-[#f4ebd0] hover:bg-[#f4ebd0]/5'
                                }`}
                            >
                                <Icon size={11} /> {link.label}
                            </Link>
                        );
                    })}

                    <a
                        href={SOCIALS.membership}
                        target="_blank"
                        rel="noreferrer"
                        onClick={close}
                        className="flex items-center gap-2 px-3 py-3 rounded font-bold uppercase text-xs tracking-widest text-[#c05621] hover:text-[#e06030] transition-colors flame-3"
                    >
                        <Lock size={11} /> Membership
                    </a>
                </nav>

                {/* Account footer */}
                <div className="border-t border-[#c05621]/20 p-4">
                    <Link
                        to={user ? '/dashboard' : '/portal'}
                        onClick={close}
                        className="flex items-center justify-center gap-2 w-full py-3 bg-[#152238] text-[#f4ebd0] rounded font-bold text-xs uppercase tracking-widest hover:bg-[#1e293b] transition-colors border border-[#c05621]/20 bg-denim-patch"
                    >
                        <UserCircle size={14} />
                        {user ? 'Dashboard' : 'Member Portal'}
                    </Link>
                </div>
            </div>
        </>
    );
};

export default Sidebar;
