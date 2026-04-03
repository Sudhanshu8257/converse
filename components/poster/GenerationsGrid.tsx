"use client";

import { useState } from "react";
import { ImagePlus, Images, X, Check } from "lucide-react";
import { AllImagesDrawer } from "./AllImagesDrawer";

type GeneratedImage = {
  url: string;
  fileId: string;
  createdAt: string;
};

type GenerationsGridProps = {
  generatedImages: GeneratedImage[];
  activeImageUrl: string | null;
  attemptsLeft: number;
  resetInMs: number;
  isButtonDisabled: boolean;
  onSelectImage: (url: string) => void;
  onTriggerUpload: () => void;
};

const VISIBLE_SLOTS = 3;

function formatReset(ms: number): string {
  const totalSec = Math.floor(ms / 1000);
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  return h > 0 ? `${h}h ${m}m` : `${m}m ${s}s`;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

// ─── Main Component ───────────────────────────────────────────────────────────
export function GenerationsGrid({
  generatedImages,
  activeImageUrl,
  attemptsLeft,
  resetInMs,
  isButtonDisabled,
  onSelectImage,
  onTriggerUpload,
}: GenerationsGridProps) {
  const [showAll, setShowAll] = useState(false);

  const hasOverflow = generatedImages.length > VISIBLE_SLOTS;
  // When overflow: show first 2 images + an "overflow" button in slot 3
  // When no overflow: show up to 3 images + 1 upload slot (if < 3 generated)
  const visibleImages = hasOverflow
    ? generatedImages.slice(0, 2)
    : generatedImages;

  const totalSlots = hasOverflow
    ? 3 // 2 images + 1 overflow button
    : Math.max(3, generatedImages.length + (generatedImages.length < 3 ? 1 : 0));

  return (
    <>
      <AllImagesDrawer
        open={showAll}
        onClose={() => setShowAll(false)}
        images={generatedImages}
        activeImageUrl={activeImageUrl}
        onSelect={onSelectImage}
      />

      <div className="px-5 py-5 lg:mt-auto border-b border-black/5">
        {/* Header row */}
        <div className="flex items-center justify-between mb-3.5">
          <p className="text-[11px] tracking-[0.15em] uppercase text-[#8a7a6a] font-extrabold">
            Your Generations
          </p>
          <div className="flex max-lg:flex-col items-center gap-2">
            {hasOverflow && (
              <button
                onClick={() => setShowAll(true)}
                className="text-[10px] font-bold tracking-wide text-[#5a4a3a] bg-[#f0e8d8] hover:bg-[#e8dcc8] border border-[#d4c4a4] rounded-full px-2.5 py-1 transition-colors flex items-center gap-1"
              >
                <Images className="w-3 h-3" />
                View all {generatedImages.length}
              </button>
            )}
            <span
              className={`text-[10px] font-bold tracking-wide px-2.5 py-1 rounded-full ${
                attemptsLeft > 0
                  ? "text-[#5a7a4a] bg-[#e8f2e0]"
                  : "text-[#e63946] bg-[#fde8e8]"
              }`}
            >
              {attemptsLeft > 0
                ? `${attemptsLeft} left today`
                : "Limit reached"}
            </span>
          </div>
        </div>

        {/* Slots row */}
        <div className="flex gap-3">
          {/* Render visible image slots */}
          {visibleImages.map((img, i) => {
            const isActive = img.url === activeImageUrl;
            return (
              <button
                key={img.fileId}
                onClick={() => onSelectImage(img.url)}
                disabled={isButtonDisabled}
                className={`relative flex-1 rounded-xl overflow-hidden transition-all active:scale-95
                  ${
                    isActive
                      ? "ring-2 ring-[#e63946] ring-offset-2 shadow-lg shadow-[#e63946]/20"
                      : "border-2 border-[#d4c4a4] hover:border-[#b4a484]"
                  }`}
                style={{ aspectRatio: "1" }}
                title="Use this image"
              >
                <img
                  src={img.url}
                  alt={`Gen ${i + 1}`}
                  className="w-full h-full object-cover"
                />
                {isActive && (
                  <div className="absolute bottom-1.5 right-1.5 w-3 h-3 rounded-full bg-[#e63946] border-2 border-white shadow" />
                )}
                <div className="absolute top-1.5 left-1.5 w-5 h-5 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center">
                  <span className="text-[10px] text-white font-bold">
                    {i + 1}
                  </span>
                </div>
              </button>
            );
          })}

          {/* Overflow "View all" slot — shown when > 3 images */}
          {hasOverflow && (
            <button
              onClick={() => setShowAll(true)}
              disabled={isButtonDisabled}
              className="relative flex-1 rounded-xl overflow-hidden border-2 border-[#d4c4a4] hover:border-[#b4a484] bg-[#faf6ef] hover:bg-[#f5f0e4] transition-all active:scale-95 group"
              style={{ aspectRatio: "1" }}
              title={`View all ${generatedImages.length} generations`}
            >
              {/* Stacked preview of hidden images */}
              <div className="absolute inset-0">
                {generatedImages.slice(2, 5).map((img, i) => (
                  <img
                    key={img.fileId}
                    src={img.url}
                    alt=""
                    className="absolute inset-0 w-full h-full object-cover"
                    style={{ opacity: 1 - i * 0.25 }}
                  />
                ))}
                <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px]" />
              </div>

              {/* Content */}
              <div className="relative z-10 w-full h-full flex flex-col items-center justify-center gap-1 py-3">
                <div className="w-7 h-7 rounded-full bg-white/20 border border-white/30 flex items-center justify-center">
                  <Images className="w-3.5 h-3.5 text-white" />
                </div>
                <span className="text-[10px] text-white font-bold tracking-wide leading-tight text-center px-1">
                  +{generatedImages.length - 2} more
                </span>
              </div>
            </button>
          )}

          {/* Empty upload slots — only shown when not overflowing */}
          {!hasOverflow &&
            Array.from({ length: totalSlots - generatedImages.length }).map(
              (_, i) => (
                <button
                  key={`empty-${i}`}
                  onClick={onTriggerUpload}
                  disabled={isButtonDisabled}
                  className="relative flex-1 rounded-xl overflow-hidden border-2 border-dashed border-[#c4b494] bg-[#faf6ef] hover:border-[#a49474] hover:bg-[#f5f0e4] transition-all active:scale-95"
                  style={{ aspectRatio: "1" }}
                  title="Generate image"
                >
                  <div className="w-full h-full flex flex-col items-center justify-center gap-2 py-4">
                    <div className="w-8 h-8 rounded-full bg-[#e8d8b8] flex items-center justify-center">
                      <ImagePlus className="w-4 h-4 text-[#9a8a6a]" />
                    </div>
                    <span className="text-[10px] text-[#9a8a6a] font-bold tracking-wide">
                      {attemptsLeft > 0 ? "Generate" : "No tries left"}
                    </span>
                  </div>
                </button>
              )
            )}
        </div>

        {attemptsLeft <= 0 && resetInMs > 0 && (
          <p className="text-xs font-medium text-[#9a7a6a] mt-3 text-center">
            Resets in {formatReset(resetInMs)}
          </p>
        )}
      </div>
    </>
  );
}
