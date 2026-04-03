"use client";

import {
  ImagePlus,
  Zap,
  Type,
  Move,
  CreditCard,
  Sparkles,
  ChevronRight,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

const HOW_IT_WORKS = [
  {
    icon: <ImagePlus className="w-4 h-4" />,
    step: "01",
    title: "Upload your photo",
    desc: "Pick any clear face photo. The AI works best with front-facing shots and good lighting.",
  },
  {
    icon: <Zap className="w-4 h-4" />,
    step: "02",
    title: "AI animefies it",
    desc: "Gemini transforms your photo into One Piece anime art. You get 3 tries per day.",
  },
  {
    icon: <Type className="w-4 h-4" />,
    step: "03",
    title: "Edit your name",
    desc: "Double-tap the name on the poster to edit it. Drag to reposition anywhere.",
  },
  {
    icon: <Move className="w-4 h-4" />,
    step: "04",
    title: "Adjust the image",
    desc: "Drag and resize your anime portrait to fit perfectly on the poster. Pinch to zoom on mobile.",
  },
  {
    icon: <CreditCard className="w-4 h-4" />,
    step: "05",
    title: "Pay & download",
    desc: "Happy with the result? Pay $1.99 and get the full-res poster sent to your email.",
  },
];

type HowItWorksSheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function HowItWorksSheet({ open, onOpenChange }: HowItWorksSheetProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="left"
        className="w-full lg:w-[500px] bg-gradient-to-b from-[#0f0a04] to-[#1a140a] text-[#f0e6d3] border-r border-[#c9a96e]/15 p-0 flex flex-col overflow-hidden"
      >
        {/* Header */}
        <SheetHeader className="px-8 py-8 border-b border-[#c9a96e]/20 text-left bg-[#0f0a04]/50 backdrop-blur-sm sticky top-0">
          <div className="space-y-2">
            <p className="text-xs font-extrabold tracking-[0.3em] text-[#c9a96e]/70 uppercase">
              One Piece · Wanted Poster
            </p>
            <SheetTitle className="text-3xl font-extrabold tracking-tight text-[#f0e6d3] leading-tight">
              How It Works
            </SheetTitle>
          </div>
        </SheetHeader>

        {/* Steps Content */}
        <div className="flex-1 overflow-y-auto px-8 py-8">
          <div className="space-y-8">
            {HOW_IT_WORKS.map((step, i) => (
              <div key={i} className="relative group">
                {/* Connecting line */}
                {i < HOW_IT_WORKS.length - 1 && (
                  <div className="absolute left-5 top-12 bottom-0 w-px bg-gradient-to-b from-[#c9a96e]/40 via-[#c9a96e]/20 to-transparent transition-all group-hover:from-[#c9a96e]/60" />
                )}

                <div className="flex gap-5">
                  {/* Step Circle */}
                  <div className="flex-shrink-0 flex flex-col items-center pt-1">
                    <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#c9a96e]/20 to-[#c9a96e]/5 border border-[#c9a96e]/40 flex items-center justify-center shadow-lg shadow-[#c9a96e]/10 group-hover:border-[#c9a96e]/60 group-hover:shadow-[#c9a96e]/20 transition-all duration-300">
                      <span className="text-[#c9a96e] text-sm font-bold">
                        {step.step}
                      </span>
                    </div>
                  </div>

                  {/* Text Content */}
                  <div className="pb-2 pt-1">
                    <p className="text-sm font-semibold text-[#f0e6d3] mb-2 leading-snug group-hover:text-white transition-colors">
                      {step.title}
                    </p>
                    <p className="text-xs font-normal text-[#d4c5a9]/70 leading-relaxed group-hover:text-[#d4c5a9]/85 transition-colors">
                      {step.desc}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Info Box */}
        <div className="px-8 pb-8 pt-4 border-t border-[#c9a96e]/15 bg-gradient-to-t from-[#0f0a04] to-transparent sticky bottom-0">
          <div className="rounded-xl bg-gradient-to-br from-[#c9a96e]/15 to-[#c9a96e]/5 border border-[#c9a96e]/25 p-4 backdrop-blur-sm hover:border-[#c9a96e]/40 transition-all duration-300 group">
            <div className="flex gap-3 items-start">
              <Sparkles className="w-4 h-4 text-[#c9a96e] mt-0.5 flex-shrink-0 group-hover:animate-pulse" />
              <p className="text-xs font-medium text-[#d4c5a9]/75 leading-relaxed group-hover:text-[#d4c5a9]/90 transition-colors">
                Swap between generated images using the slots below the poster.
                Pick the best one before downloading.
              </p>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

// Re-export the guide trigger button for convenience
export function GuideButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex-shrink-0 flex items-center gap-1.5 text-xs font-bold text-[#5a4a3a] bg-[#f0e8d8] hover:bg-[#e8dcc8] border border-[#d4c4a4] rounded-full px-4 py-2 transition-colors"
    >
      Guide <ChevronRight className="w-3.5 h-3.5" />
    </button>
  );
}
