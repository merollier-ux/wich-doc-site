import { Utensils, Wheat, FlaskConical } from 'lucide-react';
import SmartImage from '../components/SmartImage';

const About = () => {
    return (
        <div className="animate-in texture-burlap min-h-screen">
            {/* Hero Section with Fixed Background */}
            <div className="relative h-96 w-full overflow-hidden border-b-8 border-[#1a110d]">
                <SmartImage src="/vancouver-island-bg.webp" alt="Vancouver Island Background" className="absolute inset-0 w-full h-full object-cover" />
                
                {/* FIXED: Removed texture-wood and used semi-transparent black so image shows */}
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                    <div className="text-center border-4 border-dashed border-[#f4ebd0]/30 p-8">
                        <h2 className="text-5xl font-bold text-[#f4ebd0] tracking-tight font-serif italic">Roots Deep in the Island</h2>
                    </div>
                </div>
            </div>

            {/* Intro Text Section */}
            <section className="py-20 relative text-white bg-[#1a110d] texture-wood">
                <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
                    <p className="text-[#f4ebd0] text-lg leading-relaxed mb-8 font-serif">
                        To understand what we’re doing at The 'Wich Doc, you have to understand where we are. Nestled smack in the middle of Vancouver Island. Parksville isn't just a GPS coordinate where we clock in, it’s where we hang our hats. Being surrounded by the kind of crushing natural beauty—the ocean, the ancient timbers—the kind that forces you to check your ego at the door. Our job isn't to reinvent the wheel, We just take our cues from the ocean and the forest right outside our back door. We buy local because it tastes better, and because it supports the people keeping this community alive. We cook to reflect the landscape. No tricks. No smoke and mirrors. Just a clean, honest expression of where we are and what we love.
                    </p>
                    <div className="flex justify-center gap-12 text-[#c05621]">
                        <div className="flex flex-col items-center"><Utensils className="mb-2 flame-1"/><span className="text-sm font-bold text-white">Oceanside Soul</span></div>
                        <div className="flex flex-col items-center"><Wheat className="mb-2 flame-2"/><span className="text-sm font-bold text-white">Local Sourced</span></div>
                    </div>
                </div>
            </section>

            {/* Chef Bio Section */}
            <section className="py-20 bg-[#f4ebd0]">
                <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center gap-12">
                    <div className="md:w-1/3 p-2 bg-white border-2 border-dashed border-[#1a110d] shadow-xl transform -rotate-2">
                        <SmartImage src="/chef.webp" alt="Chef Marc" className="w-full aspect-square object-cover" />
                    </div>
                    <div className="md:w-2/3">
                        <h2 className="text-4xl font-bold mb-4 flex items-center gap-3 text-[#1a110d]"><FlaskConical className="text-[#c05621] flame-3" />Meet The Alchemist</h2>
                        <h3 className="text-xl text-[#c05621] font-bold uppercase tracking-wider mb-6 flame-1">Marc Rollier</h3>
                        <div className="text-stone-700 text-lg leading-relaxed space-y-4">
                            <p>To Chef Marc, a finished dish is just the final punctuation mark on a long sentence written in sweat and logistics. They call him "The Alchemist" because he finds order in the chaos. He is a man who has spent a lifetime in the heat, mastering the transmutation of simple elements—flour, water, smoke, and meat—into something that feeds the soul.</p>
                            <p>He believes that great food is the result of a discipline that most diners will never see. His goal now is to teach the next generation that the craft isn't about ego, it's about ownership. Dedicating his time on stressing the importance of the process over the prize, he offers a simple guarantee to anyone willing to sit at his table:</p>
                        </div>
                        <p className="text-[#152238] text-xl font-bold italic border-l-4 border-[#c05621] pl-6 my-8 font-serif">"Whether it is a five-star resort or a beachside cantina, give me a sharp knife, some fresh ingredients, and I will deliver a dining experience you would not soon forget."</p>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default About;