import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Stethoscope, Sparkles, Camera } from 'lucide-react';
import SmartImage from '../components/SmartImage';
import SubscriptionCard from '../components/SubscriptionCard';
import { callAI } from '../services/gemini';

const Home = () => {
    const navigate = useNavigate();
    const [dailyDose, setDailyDose] = useState('');
    const [isLoadingDose, setIsLoadingDose] = useState(false);

    const getDailyDose = async () => {
        setIsLoadingDose(true);
        try {
            const advice = await callAI("Give me a short, witty medical-themed advice about eating sandwiches or bread. Max 1 sentence. Reply with only the sentence — no quotes, no extra text.");
            setDailyDose(advice);
        } catch (err) {
            setDailyDose("A sandwich a day keeps the hunger away.");
        } finally {
            setIsLoadingDose(false);
        }
    };

    return (
        <div className="animate-in texture-burlap min-h-screen">
            {/* Hero Section */}
            <div className="relative bg-[#1a110d] text-white overflow-hidden border-b-8 border-[#152238] texture-wood">
                <div className="relative max-w-6xl mx-auto px-4 py-24 md:py-32 flex flex-col md:flex-row items-center">
                    <div className="md:w-1/2 space-y-6 text-left relative z-10">
                        <h1 className="text-5xl md:text-7xl font-bold leading-tight text-shadow-wood">
                            Prescriptions for your <span className="text-[#c05621] flame-1">Hunger.</span>
                        </h1>
                        <p className="text-xl text-[#f4ebd0]/80">Artisan sandwiches and fresh-baked breads daily.</p>
                        <div className="flex flex-wrap gap-4 pt-4">
                            <button onClick={() => navigate('/clinic')} className="px-8 py-4 bg-[#f4ebd0] hover:bg-white text-[#1a110d] rounded-lg font-bold flex items-center gap-2 border-2 border-[#152238] shadow-lg transition-all">
                                <Stethoscope size={20} /> Visit The Clinic
                            </button>
                            <button onClick={() => navigate('/menu')} className="px-8 py-4 bg-[#c05621] hover:bg-[#a84615] text-white rounded-lg font-bold border-2 border-[#fff]/20 shadow-lg flame-2 transition-all">
                                View Menu
                            </button>
                        </div>
                    </div>
                    <div className="md:w-1/2 mt-12 md:mt-0 flex justify-center relative z-10">
                        <div className="relative w-80 h-80 rounded-3xl flex items-center justify-center border-8 border-dashed border-[#f4ebd0]/30 shadow-2xl overflow-hidden bg-[#152238] lantern-container">
                            <SmartImage src="logo.png" alt="The Wich Doc Logo" className="w-full h-full object-cover" lazy={false} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Daily Dose AI Section */}
            <section className="bg-[#152238] py-12 text-center text-[#f4ebd0] border-b-8 border-[#f4ebd0] px-4 bg-denim-patch">
                <button onClick={getDailyDose} disabled={isLoadingDose} className="inline-flex items-center gap-2 text-[#c05621] hover:text-white font-bold uppercase tracking-widest text-sm mb-4 flame-3 transition-colors">
                    <Sparkles size={16} /> {isLoadingDose ? "Consulting..." : "Daily Advice"}
                </button>
                <p className="text-2xl font-serif italic min-h-[4rem] max-w-3xl mx-auto">
                    "{dailyDose || "A sandwich a day keeps the hunger away."}"
                </p>
            </section>

            {/* Weekly Bread Subscription */}
            <section className="py-16 px-4 max-w-4xl mx-auto">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-[#1a110d] uppercase tracking-tighter">
                        Never Run Out of Good Bread
                    </h2>
                    <p className="text-[#1a110d]/60 text-sm mt-2 max-w-md mx-auto">
                        A weekly rotation of three loaves, baked fresh and ready for pickup at Island Roots every Wednesday.
                    </p>
                </div>
                <SubscriptionCard variant="full" />
            </section>

            {/* Recent Procedures Grid */}
            <section className="py-16 px-4 max-w-6xl mx-auto">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-[#1a110d] flex items-center justify-center gap-2 uppercase tracking-tighter">
                        <Camera className="text-[#c05621] flame-1" /> Recent Procedures
                    </h2>
                    <div className="h-1 w-24 bg-[#c05621] mx-auto mt-4 rounded-full flame-2"></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {['/food1.png', '/food2.png', '/food3.png'].map((img, i) => (
                        <div key={i} className="aspect-square bg-white p-2 border-2 border-dashed border-[#1a110d]/20 shadow-xl transform hover:-translate-y-2 transition-transform duration-500">
                            <div className="w-full h-full overflow-hidden">
                                <SmartImage className="w-full h-full object-cover" src={img} alt={`Procedure ${i + 1}`} />
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default Home;
