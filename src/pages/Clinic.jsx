import { useState } from 'react';
import { Activity, Loader, Clock, AlertTriangle, FlaskConical, TestTube, Sparkles } from 'lucide-react';
import { callAI } from '../services/gemini';
import { menuData } from '../data';

// --- Sub-Component: Triage Section ---
const TriageSection = ({ symptomInput, setSymptomInput, handleConsultation, isDiagnosing, prescription }) => (
    <div className="bg-[#f4ebd0] rounded-3xl shadow-xl overflow-hidden border-4 border-[#1a110d] animate-in max-w-2xl mx-auto relative lantern-container">
        <div className="bg-[#152238] px-8 py-4 flex items-center justify-between text-[#f4ebd0] bg-denim-patch border-b-4 border-[#c05621]">
            <h3 className="font-bold uppercase tracking-wider text-sm flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#c05621] flame-3"></div>
                Symptom Checker Active
            </h3>
            <p className="text-[#f4ebd0]/60 text-xs font-mono">ID: PT-2026-WD</p>
        </div>
        <div className="p-8 flex flex-col gap-8 texture-burlap">
            <form onSubmit={handleConsultation} className="space-y-4">
                <label className="block text-sm font-bold text-[#152238] uppercase tracking-wide">Patient Complaints</label>
                <textarea 
                    value={symptomInput} 
                    onChange={(e) => setSymptomInput(e.target.value)} 
                    placeholder="Describe your current state... (e.g. 'I'm hangry and need something spicy')" 
                    className="w-full h-32 p-4 rounded-xl border-2 border-[#152238]/30 focus:border-[#c05621] focus:ring-0 transition-colors resize-none bg-white text-stone-800 shadow-inner font-serif italic" 
                />
                <button type="submit" disabled={isDiagnosing || !symptomInput} className="w-full py-4 bg-[#1a110d] hover:bg-[#2c1a12] disabled:bg-[#5d4037] text-[#f4ebd0] font-bold text-xl shadow-lg transform transition-all active:scale-95 flex items-center justify-center gap-3 border-2 border-dashed border-white/10 texture-wood flame-1 cursor-pointer">
                    {isDiagnosing ? <Loader className="animate-spin text-[#c05621]" /> : <Activity className="text-[#c05621]" />}
                    {isDiagnosing ? "Analyzing Vitals..." : "Get Prescription"}
                </button>
            </form>
            <div className="w-full relative">
                <div className="relative bg-white p-8 border-2 border-dashed border-[#1a110d]/40 shadow-md min-h-[250px] flex flex-col items-center justify-center text-center transform rotate-1 lantern-glow">
                    {!prescription ? (
                        <div className="text-[#1a110d]/40">
                            <Activity className="mx-auto mb-4 opacity-50" size={48} />
                            <p className="italic text-lg">"Tell me where it hurts...<br/>(in your stomach)"</p>
                        </div>
                    ) : (
                        <div className="w-full text-left animate-in">
                            <div className="border-b-2 border-[#1a110d] pb-4 mb-6 flex justify-between items-end">
                                <div>
                                    <h4 className="font-bold text-2xl text-[#1a110d]">Rx</h4>
                                    <p className="text-xs text-[#c05621] uppercase font-bold flame-2">The Wich Doc Clinic</p>
                                </div>
                                <div className="text-[#1a110d] font-bold text-sm bg-[#f4ebd0] border border-[#1a110d] px-2 py-1">VALID</div>
                            </div>
                            <div className="space-y-4 mb-8">
                                <div><p className="text-xs text-[#152238] uppercase font-bold">Diagnosis</p><p className="text-lg font-bold text-[#1a110d]">{prescription.diagnosis}</p></div>
                                <div><p className="text-xs text-[#152238] uppercase font-bold">Treatment</p><p className="text-2xl font-bold text-[#c05621] flame-3">{prescription.dishName}</p></div>
                                <div><p className="text-xs text-[#152238] uppercase font-bold">Clinical Reasoning</p><p className="italic text-stone-600 whitespace-pre-line">"{prescription.reason}"</p></div>
                            </div>
                            <div className="flex items-center gap-2 text-sm font-bold text-[#1a110d] border-t border-dashed border-[#1a110d]/30 pt-4">
                                <Clock size={14} /> Dosage: {prescription.dosage}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    </div>
);

// --- Sub-Component: Research Section ---
const ResearchSection = ({ trialRequest, setTrialRequest, runClinicalTrial, isDeveloping, trialResult }) => (
    <div className="bg-[#1a110d] rounded-3xl shadow-2xl overflow-hidden border-4 border-[#c05621] animate-in relative max-w-5xl mx-auto texture-wood lantern-container">
        <div className="hazard-stripes h-4 w-full"></div>
        <div className="p-8 md:p-12 flex flex-col md:flex-row gap-12 relative z-10">
            <div className="flex-1 space-y-6">
                <div className="space-y-2">
                    <h3 className="text-[#f4ebd0] font-bold text-2xl flex items-center gap-2"><TestTube className="text-[#c05621] flame-1" /> Clinical Trials</h3>
                    <p className="text-[#f4ebd0]/70 text-sm">Submit a craving for experimental analysis.</p>
                </div>
                <form onSubmit={runClinicalTrial} className="space-y-2">
                    <textarea value={trialRequest} onChange={(e) => setTrialRequest(e.target.value)} placeholder="e.g. I want something like a donut but spicy..." className="w-full h-32 p-4 rounded-lg border-2 border-[#c05621]/30 focus:border-[#c05621] focus:ring-1 focus:ring-[#c05621] transition-colors resize-none bg-[#152238] text-[#f4ebd0] placeholder-white/30 font-mono text-sm bg-denim-patch" />
                    <button type="submit" disabled={isDeveloping || !trialRequest} className="w-full py-4 bg-[#c05621] hover:bg-[#a84615] disabled:bg-[#5d4037] disabled:text-[#f4ebd0]/50 text-white rounded-lg font-bold text-lg shadow-lg transform transition-all active:scale-95 flex items-center justify-center gap-3 border-2 border-[#f4ebd0]/10 flame-2 cursor-pointer">
                        {isDeveloping ? <Loader className="animate-spin" /> : <FlaskConical />}
                        {isDeveloping ? "Synthesizing..." : "Initiate Protocol"}
                    </button>
                </form>
            </div>
            <div className="flex-1">
                <div className="h-full min-h-[300px] bg-[#152238]/50 rounded-xl border-2 border-dashed border-[#c05621]/50 p-6 flex flex-col relative overflow-hidden shadow-inner">
                    {!trialResult ? (
                        <div className="flex-1 flex flex-col items-center justify-center text-[#f4ebd0]/40">
                            <Sparkles className="opacity-50 mb-2 animate-pulse" />
                            <p className="font-mono text-xs uppercase tracking-widest text-center">Awaiting Input...</p>
                        </div>
                    ) : (
                        <div className="animate-in font-mono text-[#f4ebd0] space-y-6">
                            <div className="border-b border-dashed border-[#f4ebd0]/30 pb-4"><p className="text-[10px] text-[#c05621] uppercase tracking-widest mb-1 flame-1">Subject Name</p><h3 className="text-2xl font-bold text-white font-serif">{trialResult.name}</h3></div>
                            <div><p className="text-[10px] text-white/50 uppercase tracking-widest mb-1">Compound Analysis</p><p className="text-sm whitespace-pre-line">{trialResult.ingredients}</p></div>
                            <div className="bg-black/20 p-4 rounded border-l-4 border-[#c05621]"><p className="text-[10px] text-white/50 uppercase tracking-widest mb-1">Procedure</p><p className="text-sm italic whitespace-pre-line">"{trialResult.description}"</p></div>
                            <div className="mt-auto pt-4 flex items-start gap-3 text-[#c05621] flame-3"><AlertTriangle size={16} className="shrink-0 mt-0.5" /><p className="text-xs font-bold">{trialResult.warning}</p></div>
                        </div>
                    )}
                </div>
            </div>
        </div>
        <div className="hazard-stripes h-4 w-full"></div>
    </div>
);

// --- Main Clinic Page Component ---
const Clinic = () => {
    const [clinicMode, setClinicMode] = useState('triage');
    const [symptomInput, setSymptomInput] = useState('');
    const [prescription, setPrescription] = useState(null);
    const [isDiagnosing, setIsDiagnosing] = useState(false);
    const [trialRequest, setTrialRequest] = useState('');
    const [trialResult, setTrialResult] = useState(null);
    const [isDeveloping, setIsDeveloping] = useState(false);

    const handleConsultation = async (e) => {
        if (e) e.preventDefault();
        if (!symptomInput.trim()) return;
        setIsDiagnosing(true); setPrescription(null);
        
        const prompt = `You are 'The Wich Doc', a witty medical-themed sandwich shop. A patient says: "${symptomInput}". Select exactly ONE item from this menu: ${JSON.stringify(menuData)}. Reply with ONLY a JSON object — no markdown, no extra text — using these fields: dishName (exact menu item name), diagnosis (short humorous medical phrase), reason (one prose sentence explaining why this cures the symptoms), dosage (funny serving instruction like "Two bites every 4 hours").`;
        
        try {
            const text = await callAI(prompt);
            // Clean markdown code blocks if present
            const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();
            setPrescription(JSON.parse(cleanText));
        } catch {
            alert("Consultation temporarily unavailable. Please try again.");
        } finally {
            setIsDiagnosing(false);
        }
    };

    const runClinicalTrial = async (e) => {
        if (e) e.preventDefault();
        if (!trialRequest.trim()) return;
        setIsDeveloping(true); setTrialResult(null);
        
        const prompt = `You are 'The Wich Doc', a mad scientist of gourmet sandwich craft. A customer craves: "${trialRequest}". Invent a completely original, medical-themed gourmet creation (sandwich, pastry, or dessert). Reply with ONLY a JSON object — no markdown, no extra text — using these fields: name (creative medical-themed dish name), ingredients (a single comma-separated string of 4-6 key ingredients), description (one prose sentence describing the dish's flavors and concept), warning (one funny medical-themed disclaimer sentence).`;
        
        try {
            const text = await callAI(prompt);
            const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();
            setTrialResult(JSON.parse(cleanText));
        } catch {
            alert("Lab temporarily offline. Please try again.");
        } finally {
            setIsDeveloping(false);
        }
    };

    return (
        <section className="py-24 bg-[#f4ebd0] min-h-screen px-4 texture-burlap">
            <div className="max-w-4xl mx-auto flex justify-center gap-6 mb-12">
                <button onClick={() => setClinicMode('triage')} className={`px-8 py-3 rounded font-bold uppercase tracking-widest border-2 transition-all cursor-pointer ${clinicMode === 'triage' ? 'bg-[#1a110d] text-[#f4ebd0] border-[#1a110d] shadow-lg' : 'bg-transparent text-[#1a110d] border-[#1a110d]'}`}>Triage</button>
                <button onClick={() => setClinicMode('trials')} className={`px-8 py-3 rounded font-bold uppercase tracking-widest border-2 transition-all cursor-pointer ${clinicMode === 'trials' ? 'bg-[#c05621] text-white border-[#c05621] shadow-lg flame-3' : 'bg-transparent text-[#1a110d] border-[#1a110d]'}`}>R&D Lab</button>
            </div>
            {clinicMode === 'triage' ? (
                <TriageSection symptomInput={symptomInput} setSymptomInput={setSymptomInput} handleConsultation={handleConsultation} isDiagnosing={isDiagnosing} prescription={prescription} />
            ) : (
                <ResearchSection trialRequest={trialRequest} setTrialRequest={setTrialRequest} runClinicalTrial={runClinicalTrial} isDeveloping={isDeveloping} trialResult={trialResult} />
            )}
        </section>
    );
};

export default Clinic;