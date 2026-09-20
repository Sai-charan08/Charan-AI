'use client';

import React, { useState, useEffect } from 'react';
import { Smartphone, Download, X, Share2, PlusSquare, CheckCircle2, Laptop } from 'lucide-react';
import { Logo } from '@/components/ui/Logo';

interface PWAInstallModalProps {
  isOpen: boolean;
  onClose: () => void;
  deferredPrompt?: any;
}

export const PWAInstallModal: React.FC<PWAInstallModalProps> = ({
  isOpen,
  onClose,
  deferredPrompt,
}) => {
  const [isIOS, setIsIOS] = useState(false);
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const userAgent = window.navigator.userAgent.toLowerCase();
      setIsIOS(/iphone|ipad|ipod/.test(userAgent));
      
      if (window.matchMedia('(display-mode: standalone)').matches) {
        setInstalled(true);
      }
    }
  }, []);

  if (!isOpen) return null;

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setInstalled(true);
        onClose();
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-md rounded-3xl bg-[#12151e] border border-[#2b3145] p-6 text-white shadow-2xl overflow-hidden">
        {/* Glowing Background Accent */}
        <div className="absolute -top-24 -right-24 w-48 h-48 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-48 h-48 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-gray-400 hover:text-white hover:bg-[#1f2433] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className="p-3 mb-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
            <Smartphone className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-white mb-1">
            Install Charan AI App
          </h2>
          <p className="text-xs text-gray-400 max-w-xs">
            Use Charan AI like a native app on your Mobile Phone or Laptop with full-screen experience!
          </p>
        </div>

        {installed ? (
          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center mb-4">
            <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
            <p className="text-sm font-semibold text-emerald-400">Charan AI is already installed!</p>
            <p className="text-xs text-gray-300 mt-1">You can open it directly from your Home Screen or Application launcher.</p>
          </div>
        ) : (
          <>
            {/* If native install trigger available */}
            {deferredPrompt ? (
              <div className="mb-6 space-y-3 text-center">
                <p className="text-xs text-amber-300 bg-amber-500/10 p-3 rounded-xl border border-amber-500/20">
                  Ready to install! Click below to add Charan AI directly to your device.
                </p>
                <button
                  onClick={handleInstallClick}
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-black font-bold text-sm shadow-lg shadow-amber-500/20 transition-all active:scale-95 flex items-center justify-center space-x-2"
                >
                  <Download className="w-4 h-4" />
                  <span>Install App Now</span>
                </button>
              </div>
            ) : isIOS ? (
              /* iOS Safari Instructions */
              <div className="mb-6 space-y-3 bg-[#181d2a] p-4 rounded-2xl border border-[#2b3145] text-xs">
                <div className="font-semibold text-amber-400 mb-2 flex items-center space-x-1.5">
                  <Smartphone className="w-4 h-4" />
                  <span>iPhone / iPad Installation Steps:</span>
                </div>
                <div className="flex items-start space-x-3 text-gray-300">
                  <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-[11px] shrink-0">1</span>
                  <span>Tap the <strong>Share</strong> button <Share2 className="w-3.5 h-3.5 inline text-amber-400" /> at the bottom of Safari.</span>
                </div>
                <div className="flex items-start space-x-3 text-gray-300">
                  <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-[11px] shrink-0">2</span>
                  <span>Scroll down and tap <strong>Add to Home Screen</strong> <PlusSquare className="w-3.5 h-3.5 inline text-amber-400" />.</span>
                </div>
                <div className="flex items-start space-x-3 text-gray-300">
                  <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-[11px] shrink-0">3</span>
                  <span>Tap <strong>Add</strong> in the top right corner.</span>
                </div>
              </div>
            ) : (
              /* Android Chrome & Laptop Instructions */
              <div className="mb-6 space-y-3 bg-[#181d2a] p-4 rounded-2xl border border-[#2b3145] text-xs">
                <div className="font-semibold text-amber-400 mb-2 flex items-center space-x-1.5">
                  <Laptop className="w-4 h-4" />
                  <span>Android & Laptop Installation Steps:</span>
                </div>
                <div className="flex items-start space-x-3 text-gray-300">
                  <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-[11px] shrink-0">1</span>
                  <span>Click browser menu <strong>(⋮)</strong> or the <strong>Install</strong> icon in the address bar.</span>
                </div>
                <div className="flex items-start space-x-3 text-gray-300">
                  <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-[11px] shrink-0">2</span>
                  <span>Select <strong>Install App</strong> or <strong>Add to Home screen</strong>.</span>
                </div>
              </div>
            )}
          </>
        )}

        <button
          onClick={onClose}
          className="w-full py-2.5 rounded-xl bg-[#1f2433] hover:bg-[#282e42] text-xs font-medium text-gray-300 transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  );
};
