import { useNavigate } from 'react-router-dom';
import { Instagram, Facebook, Mail } from 'lucide-react';
import SmartImage from '../components/SmartImage';
import { SOCIALS } from '../data';
import { useAuth } from '../context/Authcontext';

const Links = () => {
    const navigate = useNavigate();
    const { user } = useAuth();

    return (
        <div className="min-h-screen bg-[#1a110d] texture-wood flex flex-col items-center justify-center p-4 animate-in">
            <div className="max-w-md w-full text-center space-y-10 relative z-10">

                {/* Logo */}
                <div className="w-40 h-40 bg-[#f4ebd0] rounded-3xl flex items-center justify-center border-4 border-[#c05621] mx-auto overflow-hidden shadow-2xl relative lantern-container">
                    <SmartImage src="/logo.png" alt="The Wich Doc Logo" className="w-full h-full object-cover" lazy={false} />
                </div>

                {/* Header */}
                <div className="space-y-2">
                    <h1 className="text-4xl font-bold text-[#f4ebd0] tracking-widest uppercase font-serif text-shadow-wood">The 'Wich Doc</h1>
                    <div className="flex items-center justify-center gap-3">
                        <span className="h-px w-8 bg-[#c05621]"></span>
                        <p className="text-[#c05621] font-bold text-xs uppercase tracking-[0.2em] flame-1">Parksville, BC</p>
                        <span className="h-px w-8 bg-[#c05621]"></span>
                    </div>
                </div>

                {/* Primary CTAs */}
                <div className="space-y-4">
                    <button
                        onClick={() => navigate('/home')}
                        className="block w-full py-5 bg-[#c05621] text-white rounded font-bold text-xl hover:bg-[#a84615] transition-all shadow-lg tracking-widest uppercase border-2 border-[#fff]/20 flame-2 cursor-pointer"
                    >
                        Enter Site
                    </button>

                    <button
                        onClick={() => navigate(user ? '/dashboard' : '/portal')}
                        className="block w-full py-4 bg-[#152238] bg-denim-patch text-[#f4ebd0] rounded font-bold hover:bg-[#1e293b] transition-all shadow-md uppercase tracking-widest text-sm cursor-pointer"
                    >
                        {user ? 'Member Dashboard' : 'Member Login / Sign Up'}
                    </button>
                </div>

                {/* Social links */}
                <div className="flex items-center justify-center gap-4">
                    <a href={SOCIALS.ig} target="_blank" rel="noreferrer"
                        className="p-4 bg-[#f4ebd0]/10 text-[#f4ebd0] rounded-full hover:bg-[#f4ebd0]/20 transition-all border border-dashed border-[#f4ebd0]/20 flex items-center justify-center"
                        aria-label="Instagram">
                        <Instagram size={20} />
                    </a>
                    <a href={SOCIALS.fb} target="_blank" rel="noreferrer"
                        className="p-4 bg-[#f4ebd0]/10 text-[#f4ebd0] rounded-full hover:bg-[#f4ebd0]/20 transition-all border border-dashed border-[#f4ebd0]/20 flex items-center justify-center"
                        aria-label="Facebook">
                        <Facebook size={20} />
                    </a>
                    <a href={`mailto:${SOCIALS.email}`}
                        className="p-4 bg-[#f4ebd0]/10 text-[#f4ebd0] rounded-full hover:bg-[#f4ebd0]/20 transition-all border border-dashed border-[#f4ebd0]/20 flex items-center justify-center"
                        aria-label="Email">
                        <Mail size={20} />
                    </a>
                </div>

                <p className="text-[#f4ebd0]/30 text-[10px]">Est. 2026 • Wich Doc Bake Shop</p>
            </div>
        </div>
    );
};

export default Links;
