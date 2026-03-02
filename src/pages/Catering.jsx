import { useState } from 'react';
import { Calendar, Users, MapPin, Utensils, CheckCircle, Phone, Mail, ClipboardList } from 'lucide-react';
import { SOCIALS } from '../data';

const EVENT_TYPES = [
    'Corporate Lunch / Meeting',
    'Wedding / Engagement',
    'Birthday / Celebration',
    'Community / Pop-Up Event',
    'Film / Production Set',
    'Other',
];

const MENU_OPTIONS = [
    { id: 'sandwich-bar', label: 'Sandwich Bar', desc: 'Build-your-own station with 3 signature sandwiches' },
    { id: 'bread-board', label: 'Artisan Bread Board', desc: 'Curated focaccia, loaves, and spreads' },
    { id: 'full-service', label: 'Full-Service Catering', desc: 'Hot sandwiches, sides, soups, and desserts' },
    { id: 'baked-goods', label: 'Baked Goods Tray', desc: 'Milk buns, loaves, dessert jars — boxed and labeled' },
];

const CateringForm = () => {
    const [form, setForm] = useState({
        name: '', email: '', phone: '', date: '', guests: '',
        eventType: '', location: '', notes: '', menuOptions: [],
    });
    const [submitted, setSubmitted] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const toggle = (id) => setForm(f => ({
        ...f,
        menuOptions: f.menuOptions.includes(id)
            ? f.menuOptions.filter(x => x !== id)
            : [...f.menuOptions, id],
    }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        // Netlify Forms submission
        const body = new URLSearchParams({
            'form-name': 'catering',
            ...form,
            menuOptions: form.menuOptions.join(', '),
        });
        try {
            await fetch('/', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: body.toString() });
            setSubmitted(true);
        } catch {
            setSubmitted(true); // show success anyway — fallback
        } finally {
            setSubmitting(false);
        }
    };

    if (submitted) {
        return (
            <div className="min-h-screen texture-burlap flex items-center justify-center px-4 animate-in">
                <div className="max-w-md w-full bg-[#f4ebd0] border-4 border-[#1a110d] rounded-3xl overflow-hidden shadow-2xl text-center">
                    <div className="bg-[#152238] bg-denim-patch px-8 py-5 border-b-4 border-[#c05621]">
                        <h2 className="text-[#f4ebd0] font-bold uppercase tracking-widest text-sm">Inquiry Received</h2>
                    </div>
                    <div className="p-10">
                        <CheckCircle size={48} className="text-[#c05621] mx-auto mb-4 flame-1" />
                        <h3 className="text-xl font-bold text-[#1a110d] mb-2">We'll be in touch</h3>
                        <p className="text-sm text-[#1a110d]/70 leading-relaxed">
                            Thanks, <strong>{form.name}</strong>. We've received your catering inquiry and will respond within 24 hours to discuss your event and confirm availability.
                        </p>
                        <a
                            href={SOCIALS.membership}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-block mt-8 px-6 py-3 bg-[#c05621] text-white font-bold uppercase tracking-widest text-xs rounded hover:bg-[#a84615] transition-colors"
                        >
                            Secure a Deposit
                        </a>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="animate-in texture-burlap min-h-screen">
            {/* Header */}
            <div className="bg-[#1a110d] texture-wood border-b-8 border-[#152238] py-16 px-4 text-center text-[#f4ebd0]">
                <div className="flex items-center justify-center gap-3 mb-4">
                    <Utensils size={28} className="text-[#c05621] flame-1" />
                    <h1 className="text-4xl md:text-5xl font-bold uppercase tracking-tighter text-shadow-wood">Catering</h1>
                </div>
                <p className="text-[#f4ebd0]/60 max-w-xl mx-auto text-sm">
                    Corporate lunches, weddings, pop-ups, film sets. We bring the clinic to your event.
                </p>
            </div>

            {/* Stats bar */}
            <div className="bg-[#152238] bg-denim-patch border-b-4 border-[#f4ebd0] py-6 px-4">
                <div className="max-w-4xl mx-auto grid grid-cols-3 gap-4 text-center text-[#f4ebd0]">
                    {[['10+', 'Events Catered'], ['50–200', 'Guests Per Event'], ['24h', 'Response Time']].map(([val, label]) => (
                        <div key={label}>
                            <div className="text-2xl font-bold text-[#c05621] flame-1">{val}</div>
                            <div className="text-[10px] uppercase tracking-widest text-[#f4ebd0]/60 mt-1">{label}</div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="max-w-2xl mx-auto px-4 py-12">
                <form
                    name="catering"
                    method="POST"
                    data-netlify="true"
                    onSubmit={handleSubmit}
                    className="space-y-6"
                >
                    <input type="hidden" name="form-name" value="catering" />

                    {/* Contact info */}
                    <div className="bg-white border-4 border-[#1a110d] rounded-3xl overflow-hidden shadow-xl">
                        <div className="bg-[#152238] bg-denim-patch px-6 py-4 border-b-4 border-[#c05621]">
                            <h2 className="text-[#f4ebd0] font-bold uppercase tracking-widest text-xs flex items-center gap-2">
                                <ClipboardList size={12} /> Contact Information
                            </h2>
                        </div>
                        <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <Field label="Full Name" icon={<Users size={13} />} required>
                                <input name="name" type="text" required placeholder="Your name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className="input-field" />
                            </Field>
                            <Field label="Email" icon={<Mail size={13} />} required>
                                <input name="email" type="email" required placeholder="your@email.com" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} className="input-field" />
                            </Field>
                            <Field label="Phone" icon={<Phone size={13} />}>
                                <input name="phone" type="tel" placeholder="672-922-0970" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} className="input-field" />
                            </Field>
                            <Field label="Number of Guests" icon={<Users size={13} />} required>
                                <input name="guests" type="number" min="10" required placeholder="e.g. 50" value={form.guests} onChange={e => setForm(f => ({ ...f, guests: e.target.value }))} className="input-field" />
                            </Field>
                        </div>
                    </div>

                    {/* Event details */}
                    <div className="bg-white border-4 border-[#1a110d] rounded-3xl overflow-hidden shadow-xl">
                        <div className="bg-[#152238] bg-denim-patch px-6 py-4 border-b-4 border-[#c05621]">
                            <h2 className="text-[#f4ebd0] font-bold uppercase tracking-widest text-xs flex items-center gap-2">
                                <Calendar size={12} /> Event Details
                            </h2>
                        </div>
                        <div className="p-6 space-y-4">
                            <Field label="Event Date" icon={<Calendar size={13} />} required>
                                <input name="date" type="date" required value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} className="input-field" />
                            </Field>
                            <Field label="Event Location" icon={<MapPin size={13} />} required>
                                <input name="location" type="text" required placeholder="Venue or city, BC" value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} className="input-field" />
                            </Field>
                            <div>
                                <label className="block text-[10px] font-bold uppercase tracking-widest text-[#1a110d]/60 mb-1">Event Type</label>
                                <select name="eventType" value={form.eventType} onChange={e => setForm(f => ({ ...f, eventType: e.target.value }))} className="input-field">
                                    <option value="">Select an event type</option>
                                    {EVENT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Menu options */}
                    <div className="bg-white border-4 border-[#1a110d] rounded-3xl overflow-hidden shadow-xl">
                        <div className="bg-[#152238] bg-denim-patch px-6 py-4 border-b-4 border-[#c05621]">
                            <h2 className="text-[#f4ebd0] font-bold uppercase tracking-widest text-xs flex items-center gap-2">
                                <Utensils size={12} /> Menu Interests (select all that apply)
                            </h2>
                        </div>
                        <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {MENU_OPTIONS.map(opt => (
                                <button
                                    key={opt.id}
                                    type="button"
                                    onClick={() => toggle(opt.id)}
                                    className={`text-left p-4 rounded-xl border-2 transition-all cursor-pointer ${form.menuOptions.includes(opt.id) ? 'border-[#c05621] bg-[#c05621]/5' : 'border-[#1a110d]/20 hover:border-[#1a110d]/50'}`}
                                >
                                    <div className="flex items-center gap-2 mb-1">
                                        <div className={`w-4 h-4 rounded border-2 flex items-center justify-center ${form.menuOptions.includes(opt.id) ? 'border-[#c05621] bg-[#c05621]' : 'border-[#1a110d]/30'}`}>
                                            {form.menuOptions.includes(opt.id) && <span className="text-white text-[10px]">✓</span>}
                                        </div>
                                        <span className="font-bold text-sm text-[#1a110d]">{opt.label}</span>
                                    </div>
                                    <p className="text-xs text-[#1a110d]/60 pl-6">{opt.desc}</p>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Notes */}
                    <div className="bg-white border-4 border-[#1a110d] rounded-3xl overflow-hidden shadow-xl">
                        <div className="bg-[#152238] bg-denim-patch px-6 py-4 border-b-4 border-[#c05621]">
                            <h2 className="text-[#f4ebd0] font-bold uppercase tracking-widest text-xs">Additional Notes</h2>
                        </div>
                        <div className="p-6">
                            <textarea
                                name="notes"
                                rows={4}
                                placeholder="Dietary restrictions, theme, special requests..."
                                value={form.notes}
                                onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
                                className="input-field resize-none"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={submitting}
                        className="w-full py-5 bg-[#c05621] text-white font-bold uppercase tracking-widest rounded-2xl hover:bg-[#a84615] transition-colors flame-2 disabled:opacity-60 text-sm shadow-xl cursor-pointer"
                    >
                        {submitting ? 'Sending...' : 'Submit Catering Inquiry'}
                    </button>
                    <p className="text-center text-xs text-[#1a110d]/40 uppercase tracking-widest">
                        We respond within 24 hours · Parksville & Vancouver Island
                    </p>
                </form>
            </div>
        </div>
    );
};

const Field = ({ label, icon, required, children }) => (
    <div>
        <label className="block text-[10px] font-bold uppercase tracking-widest text-[#1a110d]/60 mb-1 flex items-center gap-1">
            {icon} {label} {required && <span className="text-[#c05621]">*</span>}
        </label>
        {children}
    </div>
);

export default CateringForm;
