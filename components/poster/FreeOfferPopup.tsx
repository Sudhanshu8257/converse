"use client";
import { useState, useEffect } from "react";
import { X, Gift, Sparkles } from "lucide-react";
import { trackEvent } from "@/lib/analytics";

interface FreeOfferPopupProps {
  onStart: () => void;
  isLoading: boolean;
}

export default function FreeOfferPopup({ onStart, isLoading }: FreeOfferPopupProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShouldRender(true);
      setIsVisible(true);
      trackEvent("free_offer_popup_viewed");
    }, 3000); // 3-second delay

    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    trackEvent("free_offer_popup_closed");
    setTimeout(() => setShouldRender(false), 500); // Wait for animation
  };

  const handleAction = () => {
    trackEvent("free_offer_popup_clicked");
    onStart();
  };

  if (!shouldRender) return null;

  return (
    <div
      className={`fixed bottom-6 right-6 z-[100] w-[calc(100vw-3rem)] max-w-sm transition-all duration-500 ease-out transform 
        ${isVisible ? "translate-y-0 opacity-100 scale-100" : "translate-y-12 opacity-0 scale-95 pointer-events-none"}`}
    >
      <div className="relative bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-5 rounded-xl overflow-hidden">
        {/* Background Accent */}
        <div className="absolute top-0 right-0 p-2 opacity-10">
          <Gift size={80} className="rotate-12" />
        </div>

        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-3 right-3 p-1 hover:bg-gray-100 rounded-full transition-colors border border-transparent hover:border-black"
        >
          <X size={18} />
        </button>

        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2 text-red-600 font-black italic uppercase tracking-tighter">
            Limited Time Offer
          </div>

          <h3 className="text-2xl font-black leading-tight text-black">
            FREE POSTER <br />
            <span className="text-red-600">UNLOCKED!</span>
          </h3>

          <p className="text-gray-700 font-medium text-sm leading-relaxed">
            Congratulations! You&apos;ve been selected to create and download your
            legendary bounty poster <span className="font-bold underline italic">for free.</span>
          </p>

          <button
            onClick={handleAction}
            disabled={isLoading}
            className="group relative mt-2 bg-red-600 hover:bg-red-700 text-white font-black py-3 px-6 rounded-lg border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-1 active:translate-y-1 transition-all flex items-center justify-center gap-2 overflow-hidden"
          >
            <span className="relative z-10">CLAIM MY FREE POSTER</span>
            <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500 skew-x-12" />
          </button>
        </div>
      </div>
    </div>
  );
}