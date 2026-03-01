import { useState, useEffect } from 'react';
import { Download, X, Smartphone, Monitor, Apple } from 'lucide-react';

const InstallPrompt = () => {
    const [deferredPrompt, setDeferredPrompt] = useState(null);
    const [showPrompt, setShowPrompt] = useState(false);
    const [showIOSGuide, setShowIOSGuide] = useState(false);
    const [dismissed, setDismissed] = useState(false);

    const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent);
    const isInStandaloneMode = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone;

    useEffect(() => {
        if (isInStandaloneMode || dismissed) return;

        const handler = (e) => {
            e.preventDefault();
            setDeferredPrompt(e);
            setShowPrompt(true);
        };

        window.addEventListener('beforeinstallprompt', handler);

        // Show iOS guide after 10s if on iOS Safari and not installed
        if (isIOS && !isInStandaloneMode) {
            const timer = setTimeout(() => setShowIOSGuide(true), 10000);
            return () => { clearTimeout(timer); window.removeEventListener('beforeinstallprompt', handler); };
        }

        return () => window.removeEventListener('beforeinstallprompt', handler);
    }, [dismissed, isIOS, isInStandaloneMode]);

    const handleInstall = async () => {
        if (!deferredPrompt) return;
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        setDeferredPrompt(null);
        setShowPrompt(false);
        if (outcome === 'dismissed') setDismissed(true);
    };

    const handleDismiss = () => {
        setShowPrompt(false);
        setShowIOSGuide(false);
        setDismissed(true);
    };

    if (isInStandaloneMode || dismissed) return null;

    if (showIOSGuide) {
        return (
            <div className="fixed bottom-4 left-4 right-4 z-50 animate-in">
                <div className="bg-[#f4ebd0] border-4 border-[#1a110d] rounded-2xl shadow-2xl p-5 max-w-sm mx-auto">
                    <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                            <Apple size={18} className="text-[#c05621]" />
                            <span className="font-bold text-[#1a110d] text-sm uppercase tracking-widest">Install on iOS</span>
                        </div>
                        <button onClick={handleDismiss} className="text-[#1a110d]/40 hover:text-[#1a110d]"><X size={16} /></button>
                    </div>
                    <p className="text-xs text-[#1a110d]/70 leading-relaxed mb-3">
                        Tap the <strong>Share</strong> button in Safari, then select <strong>"Add to Home Screen"</strong> to install The Wich Doc as an app.
                    </p>
                    <div className="flex gap-2 text-[10px] text-[#1a110d]/50 uppercase tracking-widest">
                        <span className="bg-[#1a110d]/10 rounded px-2 py-1">1. Tap Share ↑</span>
                        <span className="bg-[#1a110d]/10 rounded px-2 py-1">2. Add to Home Screen</span>
                        <span className="bg-[#1a110d]/10 rounded px-2 py-1">3. Install</span>
                    </div>
                </div>
            </div>
        );
    }

    if (!showPrompt) return null;

    return (
        <div className="fixed bottom-4 left-4 right-4 z-50 animate-in">
            <div className="bg-[#1a110d] border-4 border-[#c05621] rounded-2xl shadow-2xl p-5 max-w-sm mx-auto">
                <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                        <Download size={18} className="text-[#c05621] flame-1" />
                        <span className="font-bold text-[#f4ebd0] text-sm uppercase tracking-widest">Install App</span>
                    </div>
                    <button onClick={handleDismiss} className="text-[#f4ebd0]/40 hover:text-[#f4ebd0]"><X size={16} /></button>
                </div>
                <p className="text-xs text-[#f4ebd0]/70 leading-relaxed mb-4">
                    Install The Wich Doc on your device for faster access, offline menus, and instant order notifications.
                </p>
                <div className="flex gap-2 mb-4">
                    <div className="flex items-center gap-1 text-[#f4ebd0]/40 text-[10px] uppercase tracking-widest">
                        <Smartphone size={10} /> Mobile
                    </div>
                    <div className="flex items-center gap-1 text-[#f4ebd0]/40 text-[10px] uppercase tracking-widest">
                        <Monitor size={10} /> Desktop
                    </div>
                </div>
                <button
                    onClick={handleInstall}
                    className="w-full py-3 bg-[#c05621] text-white font-bold uppercase tracking-widest text-xs rounded hover:bg-[#a84615] transition-colors flame-2"
                >
                    Install The Wich Doc
                </button>
            </div>
        </div>
    );
};

export default InstallPrompt;
