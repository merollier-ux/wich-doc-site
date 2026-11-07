import { useState } from 'react';
import { createPortal } from 'react-dom';
import { Wheat, RefreshCw, Check, X, CheckCircle, AlertCircle } from 'lucide-react';

const LOAVES = [
    'Red Fife & Cheddar Farmer\'s Loaf',
    'Rotating seasonal loaf',
    'Ancient grain flatbread (Aish Baladi or Matnakash)',
];

// Reservations go to Netlify Forms (Dashboard → Forms → bread-subscription).
// No card is taken online — customers pay at pickup.
const ReserveModal = ({ onClose }) => {
    const [form, setForm] = useState({ name: '', email: '', phone: '', startDate: '', notes: '' });
    const [status, setStatus] = useState('idle');
    const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('loading');
        try {
            const resp = await fetch('/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: new URLSearchParams({ 'form-name': 'bread-subscription', ...form }).toString(),
            });
            setStatus(resp.ok ? 'success' : 'error');
        } catch {
            setStatus('error');
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-4 bg-black/80" onClick={onClose}>
            <div className="bg-[#f4ebd0] w-full max-w-md rounded-3xl overflow-hidden shadow-2xl border-4 border-[#1a110d] max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
                <div className="bg-[#152238] px-6 py-4 border-b-4 border-[#c05621] flex items-center justify-between shrink-0">
                    <h2 className="text-[#f4ebd0] font-bold uppercase tracking-widest text-sm flex items-center gap-2">
                        <Wheat size={14} className="text-[#c05621]" /> Reserve Your Bread Box
                    </h2>
                    <button onClick={onClose} aria-label="Close" className="text-[#f4ebd0]/50 hover:text-[#f4ebd0] cursor-pointer transition-colors">
                        <X size={18} />
                    </button>
                </div>
                <div className="overflow-y-auto p-6">
                    {status === 'success' ? (
                        <div className="text-center py-8 space-y-4">
                            <CheckCircle size={48} className="text-[#c05621] mx-auto" />
                            <h3 className="text-xl font-bold text-[#1a110d]">You're on the list!</h3>
                            <p className="text-sm text-[#1a110d]/60">
                                We'll confirm your first pickup at <strong>{form.email}</strong>. Pay $30 when you collect your box.
                            </p>
                            <button onClick={onClose} className="mt-4 px-8 py-3 bg-[#c05621] text-white font-bold uppercase tracking-widest rounded hover:bg-[#a84615] transition-colors cursor-pointer">
                                Done
                            </button>
                        </div>
                    ) : (
                        <form name="bread-subscription" onSubmit={handleSubmit} className="space-y-3">
                            <p className="text-sm text-[#1a110d]/70 leading-relaxed">
                                3 loaves every Wednesday at Island Roots Market. <strong>$30, paid at pickup</strong> — nothing is charged now. Pause or cancel any time.
                            </p>
                            <input className="input-field" type="text" placeholder="Full Name" value={form.name} onChange={set('name')} required maxLength={100} />
                            <input className="input-field" type="email" placeholder="Email address" value={form.email} onChange={set('email')} required maxLength={254} />
                            <input className="input-field" type="tel" placeholder="Phone (optional)" value={form.phone} onChange={set('phone')} maxLength={30} />
                            <label className="block text-[10px] font-bold uppercase tracking-widest text-[#1a110d]/40 pt-1">First pickup (optional)</label>
                            <input className="input-field" type="date" value={form.startDate} onChange={set('startDate')} />
                            <textarea className="input-field h-20 resize-none" placeholder="Allergies or notes (optional)" value={form.notes} onChange={set('notes')} maxLength={500} />
                            {status === 'error' && (
                                <div className="flex items-start gap-2 text-red-600 text-xs bg-red-50 border border-red-200 rounded p-3">
                                    <AlertCircle size={14} className="shrink-0 mt-0.5" />
                                    <span>Couldn't send your reservation. Please try again, or email chef@wichdocbakeshop.ca.</span>
                                </div>
                            )}
                            <button
                                type="submit"
                                disabled={status === 'loading'}
                                className="w-full py-4 bg-[#c05621] text-white font-bold uppercase tracking-widest rounded hover:bg-[#a84615] transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {status === 'loading' ? 'Sending…' : 'Reserve — Pay at Pickup'}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

const SubscriptionCard = ({ variant = 'default' }) => {
    const [reserving, setReserving] = useState(false);
    // Portal to <body>: the page's fade-in transform would otherwise trap the
    // modal under the fixed discount banner.
    const modal = reserving && createPortal(<ReserveModal onClose={() => setReserving(false)} />, document.body);

    // Compact variant for Menu page
    if (variant === 'compact') {
        return (
            <>
            {modal}
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
                        <span className="text-[#f4ebd0]/40 text-xs ml-1">/ week · pay at pickup</span>
                    </div>
                    <button
                        onClick={() => setReserving(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-[#c05621] text-white text-xs font-bold uppercase tracking-widest rounded hover:bg-[#a84615] transition-colors flame-2 cursor-pointer"
                    >
                        <RefreshCw size={12} /> Reserve
                    </button>
                </div>
            </div>
            </>
        );
    }

    // Full variant for Shop and Home pages
    return (
        <>
        {modal}
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
                        onClick={() => setReserving(true)}
                        className="flex items-center gap-2 px-6 py-3 bg-[#c05621] text-white font-bold uppercase tracking-widest text-xs rounded hover:bg-[#a84615] transition-colors flame-2 w-full justify-center cursor-pointer"
                    >
                        <RefreshCw size={14} /> Reserve My Box
                    </button>
                    <p className="text-[#f4ebd0]/30 text-[10px] text-center">
                        Nothing charged online.<br />Pay at pickup · cancel any time.
                    </p>
                </div>
            </div>
        </div>
        </>
    );
};

export default SubscriptionCard;
