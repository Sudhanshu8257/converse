"use client";

import { Clock } from "lucide-react";

type LimitModalProps = {
  open: boolean;
  onClose: () => void;
  resetInMs: number;
  hasPhoto: boolean;
  onDownload: () => void;
};

function formatReset(ms: number): string {
  const totalSec = Math.floor(ms / 1000);
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  return h > 0 ? `${h}h ${m}m` : `${m}m ${s}s`;
}

export function LimitModal({
  open,
  onClose,
  resetInMs,
  hasPhoto,
  onDownload,
}: LimitModalProps) {
  if (!open) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-opacity duration-300 ${
        open ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-md"
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className={`relative w-full max-w-sm bg-gradient-to-b from-[#0f0a04] to-[#0a0705] border border-white/8 rounded-3xl p-8 shadow-2xl text-[#f0e6d3] transition-all duration-300 transform ${
          open ? "opacity-100 scale-100" : "opacity-0 scale-95"
        }`}
      >
        {/* Icon Badge */}
        <div className="mb-6 flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 bg-[#e63946]/20 rounded-full blur-xl" />
            <div className="relative w-16 h-16 rounded-full bg-[#e63946]/10 border border-[#e63946]/30 flex items-center justify-center shadow-lg">
              <Clock className="w-7 h-7 text-[#e63946]" />
            </div>
          </div>
        </div>

        {/* Heading */}
        <h3 className="text-center text-2xl font-bold tracking-tight mb-3">
          Daily Limit Reached
        </h3>

        {/* Description */}
        <p className="text-center text-[#f0e6d3]/70 text-sm leading-relaxed mb-6">
          You&apos;ve used all 3 generations for today. Come back in:
        </p>

        {/* Timer Box */}
        <div className="relative mb-6 group">
          <div className="absolute inset-0 bg-gradient-to-r from-[#e63946]/20 to-[#e63946]/10 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="relative bg-gradient-to-b from-white/8 to-white/4 border border-white/10 rounded-2xl py-6 px-5 backdrop-blur-sm">
            <div className="text-4xl font-bold tracking-tight text-center text-[#e63946] font-mono tabular-nums">
              {resetInMs > 0 ? formatReset(resetInMs) : "soon"}
            </div>
          </div>
        </div>

        {/* Info Text */}
        <p className="text-center text-[#f0e6d3]/50 text-xs leading-relaxed mb-7 tracking-wide">
          Already happy with one of your images? You can still download your
          poster.
        </p>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 px-4 rounded-xl border border-white/15 text-sm font-semibold text-[#f0e6d3]/80 hover:bg-white/8 hover:border-white/25 active:bg-white/12 transition-all duration-200 hover:shadow-lg"
          >
            Close
          </button>
          {hasPhoto && (
            <button
              onClick={() => {
                onDownload();
                onClose();
              }}
              className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-[#e63946] to-[#c1121f] text-white text-sm font-bold hover:from-[#d62e38] hover:to-[#a80d1a] active:from-[#c1121f] active:to-[#8a0914] transition-all duration-200 shadow-lg hover:shadow-xl hover:shadow-[#e63946]/20"
            >
              Download $1.99
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
