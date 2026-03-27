"use client";

import { useEffect, useRef, useState, ChangeEvent } from "react";
import { Download, Loader2, ImagePlus, X, ChevronRight, Clock, Zap, Type, Move, CreditCard } from "lucide-react";
import { saveSession, uploadToAnimeApi } from "@/actions/posterAction";
import { toast } from "sonner";

// --- CONSTANTS ---
const POSTER_WIDTH = 724;
const POSTER_HEIGHT = 1080;
const PHOTO_X = 367;
const PHOTO_Y = 446;
const COOLDOWN_TIME = 60;

type GeneratedImage = {
  url: string;
  fileId: string;
  createdAt: string;
};

const HOW_IT_WORKS = [
  {
    icon: <ImagePlus className="w-4 h-4" />,
    title: "Upload your photo",
    desc: "Pick any clear face photo. The AI works best with good lighting.",
  },
  {
    icon: <Zap className="w-4 h-4" />,
    title: "AI animefies it",
    desc: "Gemini transforms your photo into One Piece anime art. You get 3 tries per day.",
  },
  {
    icon: <Type className="w-4 h-4" />,
    title: "Edit your name",
    desc: "Double-tap the name on the poster to edit it. Drag to reposition.",
  },
  {
    icon: <Move className="w-4 h-4" />,
    title: "Adjust the image",
    desc: "Drag and resize your anime portrait to fit perfectly on the poster.",
  },
  {
    icon: <CreditCard className="w-4 h-4" />,
    title: "Pay & download",
    desc: "Happy with the result? Pay $1.99 and get the full-res poster sent to your email.",
  },
];

export default function PosterEditor({
  sessionId,
  sessionData,
}: {
  sessionId: string;
  sessionData: any;
}) {
  const canvasEl = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const fabricRef = useRef<any>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [hasPhoto, setHasPhoto] = useState(false);
  const [isEditingText, setIsEditingText] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [showGuide, setShowGuide] = useState(false);
  const [showLimitModal, setShowLimitModal] = useState(false);
  const [resetInMs, setResetInMs] = useState<number>(sessionData?.resetInMs ?? 0);

  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>(
    sessionData?.generatedImages || []
  );
  const [activeImageUrl, setActiveImageUrl] = useState<string | null>(null);
  const [attemptsLeft, setAttemptsLeft] = useState<number>(sessionData?.attemptsLeft ?? 3);

  // Cooldown timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (cooldown > 0) timer = setInterval(() => setCooldown((p) => p - 1), 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  // Live countdown for reset timer in modal
  useEffect(() => {
    if (!showLimitModal || resetInMs <= 0) return;
    const interval = setInterval(() => setResetInMs((p) => Math.max(0, p - 1000)), 1000);
    return () => clearInterval(interval);
  }, [showLimitModal, resetInMs]);

  // Prevent scroll & right click`
  useEffect(() => {
    document.body.style.overflow = "hidden";
    document.body.style.position = "fixed";
    document.body.style.width = "100%";
    document.body.style.height = "100%";
    const handleContextMenu = (e: MouseEvent) => e.preventDefault();
    document.addEventListener("contextmenu", handleContextMenu);
    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
      document.body.style.overflow = "";
      document.body.style.position = "";
      document.body.style.width = "";
      document.body.style.height = "";
    };
  }, []);

  // Canvas init
  useEffect(() => {
    let isMounted = true;
    const init = async () => {
      if (!canvasEl.current) return;
      try {
        const { Canvas, FabricImage, IText, Rect, Group, Object: FabricObject } = await import("fabric");
        if (!isMounted) return;

        FabricObject.prototype.transparentCorners = false;
        FabricObject.prototype.cornerColor = "#e63946";
        FabricObject.prototype.borderColor = "#e63946";
        FabricObject.prototype.cornerStrokeColor = "#fff";
        FabricObject.prototype.cornerStyle = "circle";
        FabricObject.prototype.cornerSize = 12;

        const fontName = "WantedPrint";
        const printFont = new FontFace(fontName, "url(/fonts/Aldine.otf)");
        try { await printFont.load(); document.fonts.add(printFont); } catch { console.warn("Font fallback."); }

        const canvas = new Canvas(canvasEl.current, {
          width: POSTER_WIDTH, height: POSTER_HEIGHT,
          backgroundColor: "#ffffff", preserveObjectStacking: true, selection: false,
        });
        fabricRef.current = canvas;

        canvas.on("text:editing:entered", () => { setIsEditingText(true); window.scrollTo(0, 0); });
        canvas.on("text:editing:exited", () => { setIsEditingText(false); window.scrollTo(0, 0); });

        const btnRect = new Rect({ width: 640, height: 480, fill: "#f3f4f6", rx: 15, ry: 15, stroke: "#d1d5db", strokeWidth: 4, originX: "center", originY: "center" });
        const btnText = new IText("Tap to Upload", { fontFamily: "Georgia", fontSize: 30, fill: "#9ca3af", originX: "center", originY: "center" });
        const uploadGroup = new Group([btnRect, btnText], { left: PHOTO_X, top: PHOTO_Y, originX: "center", originY: "center", selectable: false, hoverCursor: "pointer", name: "upload_trigger" } as any);
        uploadGroup.on("mousedown", () => fileInputRef.current?.click());
        canvas.add(uploadGroup);

        const template = await FabricImage.fromURL("/assets/placeholder2.png");
        template.set({ originX: "left", originY: "top", left: 0, top: 0, selectable: false, evented: false });
        template.scaleToWidth(POSTER_WIDTH);
        template.scaleToHeight(POSTER_HEIGHT);
        canvas.add(template);

        const nameText = new IText("ENTER NAME", {
          fontFamily: fontName, fontSize: 90, fill: "#2F211A",
          left: 362, top: 845, scaleX: 0.86, scaleY: 1.73,
          originX: "center", textAlign: "center", editable: true,
          lockUniScaling: false, centeredScaling: true,
          cornerColor: "#e63946", borderColor: "#e63946", name: "poster_name",
        } as any);
        canvas.add(nameText);

        const stripColor = "#0046ad";
        const offset = 75;
        const createCornerLabel = (text: string, angle: number, left: number, top: number) => {
          const rect = new Rect({ width: 300, height: 35, fill: stripColor, originX: "center", originY: "center" });
          const label = new IText(text, { fontFamily: "Arial", fontSize: 20, fontWeight: "bold", fill: "#ffffff", originX: "center", originY: "center", top: 1 });
          return new Group([rect, label], { angle, left, top, originX: "center", originY: "center", selectable: false, evented: false, opacity: 0.95, name: "watermark" } as any);
        };

        canvas.add(createCornerLabel("CONVERSE", -45, offset, offset));
        canvas.add(createCornerLabel("CONVERSE", 45, POSTER_WIDTH - offset, offset));
        canvas.add(createCornerLabel("CONVERSE", 45, offset, POSTER_HEIGHT - offset));
        canvas.add(createCornerLabel("CONVERSE", -45, POSTER_WIDTH - offset, POSTER_HEIGHT - offset));

        canvas.renderAll();
        setIsLoading(false);
        setTimeout(fitToScreen, 100);
      } catch (err) { console.error(err); setIsLoading(false); }
    };

    init();
    window.addEventListener("resize", fitToScreen);
    return () => { isMounted = false; window.removeEventListener("resize", fitToScreen); if (fabricRef.current) fabricRef.current.dispose(); };
  }, []);

  const fitToScreen = () => {
    if (!containerRef.current || !canvasEl.current) return;
    const scale = containerRef.current.clientWidth / POSTER_WIDTH;
    const wrapper = canvasEl.current.parentElement;
    if (wrapper) {
      wrapper.style.transform = `scale(${scale})`;
      wrapper.style.transformOrigin = "top left";
      containerRef.current.style.height = `${POSTER_HEIGHT * scale}px`;
    }
  };

  const swapCanvasImage = async (imageUrl: string) => {
    if (!fabricRef.current || imageUrl === activeImageUrl) return;
    const { FabricImage } = await import("fabric");
    const imgElement = new Image();
    imgElement.crossOrigin = "anonymous";
    imgElement.src = imageUrl;
    imgElement.onload = () => {
      const img = new FabricImage(imgElement);
      const objects = fabricRef.current.getObjects();
      const oldPhoto = objects.find((o: any) => o.name === "user_photo");
      const uploadBtn = objects.find((o: any) => o.name === "upload_trigger");
      if (oldPhoto) fabricRef.current.remove(oldPhoto);
      if (uploadBtn) fabricRef.current.remove(uploadBtn);
      img.set({ left: 367, top: 446, scaleX: 0.61, scaleY: 0.62, originX: "center", originY: "center", transparentCorners: false, cornerColor: "#e63946", borderColor: "#e63946", name: "user_photo" } as any);
      fabricRef.current.add(img);
      fabricRef.current.sendObjectToBack(img);
      fabricRef.current.setActiveObject(img);
      fabricRef.current.requestRenderAll();
      setActiveImageUrl(imageUrl);
      setHasPhoto(true);
    };
  };

  const handleImageUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    if (!fabricRef.current || !e.target.files?.[0]) return;
    if (cooldown > 0) { toast.error(`Wait ${cooldown}s before replacing.`); return; }
    if (attemptsLeft <= 0) { setShowLimitModal(true); return; }

    const file = e.target.files[0];
    e.target.value = "";
    setIsProcessing(true);

    const formData = new FormData();
    formData.append("image", file);
    formData.append("sessionId", sessionId);

    const result = await uploadToAnimeApi(formData);

    if (!result.success || !result.imageUrl) {
      // If limit hit server-side, show modal
      if (result.resetInMs) {
        setResetInMs(result.resetInMs);
        setAttemptsLeft(0);
        setShowLimitModal(true);
      } else {
        toast.error("Failed to process image. Please try again.");
      }
      setIsProcessing(false);
      return;
    }

    // --- COMMENTED: hardcoded test image ---
    // const result = { success: true, imageUrl: "https://ik.imagekit.io/...", fileId: "112" };

    const newImage: GeneratedImage = {
      url: result.imageUrl,
      fileId: result.fileId,
      createdAt: new Date().toISOString(),
    };
    setGeneratedImages((prev) => [...prev, newImage]);
    setAttemptsLeft((prev) => Math.max(0, prev - 1));
    await swapCanvasImage(result.imageUrl);
    setCooldown(COOLDOWN_TIME);
    setIsProcessing(false);
  };

  const download = async () => {
    if (!fabricRef.current || !hasPhoto) return;
    setIsDownloading(true);
    const toastId = toast.loading("Preparing your high-res poster...");
    try {
      const canvas = fabricRef.current;
      canvas.discardActiveObject();
      const objects = canvas.getObjects();
      const watermarks = objects.filter((o: any) => o.name === "watermark");
      watermarks.forEach((w: any) => w.set("visible", false));
      canvas.requestRenderAll();

      const base64 = canvas.toDataURL({ format: "png", multiplier: 1.5, quality: 1 });

      watermarks.forEach((w: any) => w.set("visible", true));
      canvas.requestRenderAll();

      const nameTextObj = objects.find((o: any) => o.name === "poster_name");
      const posterName = nameTextObj?.text?.trim() || "WANTED";

      const result = await saveSession({ posterBase64: base64, posterName });

      if (result.success && result.checkoutUrl) {
        toast.success("Redirecting to secure checkout...", { id: toastId });
        setTimeout(() => { window.location.href = result.checkoutUrl; }, 800);
      } else {
        throw new Error(result.error || "Failed to create checkout session");
      }
    } catch (err: any) {
      toast.error(err.message || "Something went wrong.", { id: toastId });
      setIsDownloading(false);
    }
  };

  const triggerUpload = () => {
    if (attemptsLeft <= 0) { setShowLimitModal(true); return; }
    if (cooldown > 0) return;
    fileInputRef.current?.click();
  };

  const isButtonDisabled = isLoading || isProcessing || isDownloading;
  const totalSlots = Math.max(3, generatedImages.length + (generatedImages.length < 3 ? 1 : 0));

  // Format ms to h:mm:ss
  const formatReset = (ms: number) => {
    const totalSec = Math.floor(ms / 1000);
    const h = Math.floor(totalSec / 3600);
    const m = Math.floor((totalSec % 3600) / 60);
    const s = totalSec % 60;
    return h > 0 ? `${h}h ${m}m` : `${m}m ${s}s`;
  };

  return (
    <>
      {/* ─── GUIDE SIDEBAR ─────────────────────────────── */}
      {showGuide && (
        <div className="fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div className="flex-1 bg-black/40 backdrop-blur-sm" onClick={() => setShowGuide(false)} />
          {/* Panel */}
          <div className="w-[280px] bg-[#1a1209] text-[#f5e6c8] flex flex-col h-full shadow-2xl animate-in slide-in-from-right duration-300">
            <div className="flex items-center justify-between p-5 border-b border-[#f5e6c8]/10">
              <div>
                <p className="text-[10px] tracking-[0.2em] text-[#f5e6c8]/50 uppercase mb-0.5">One Piece</p>
                <h2 className="text-lg font-bold" style={{ fontFamily: "Georgia, serif" }}>How It Works</h2>
              </div>
              <button onClick={() => setShowGuide(false)} className="p-1.5 rounded-full hover:bg-white/10 transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-5">
              {HOW_IT_WORKS.map((step, i) => (
                <div key={i} className="flex gap-3">
                  <div className="flex-shrink-0 w-7 h-7 rounded-full bg-[#e63946]/20 border border-[#e63946]/30 flex items-center justify-center text-[#e63946]">
                    {step.icon}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#f5e6c8] mb-0.5">{step.title}</p>
                    <p className="text-xs text-[#f5e6c8]/50 leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-5 border-t border-[#f5e6c8]/10">
              <div className="bg-[#e63946]/10 border border-[#e63946]/20 rounded-xl p-3">
                <p className="text-xs text-[#f5e6c8]/70 leading-relaxed">
                  <span className="text-[#e63946] font-semibold">Tip:</span> Swap between your generated images using the slots below the poster. Pick the best one before downloading.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── LIMIT MODAL ───────────────────────────────── */}
      {showLimitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowLimitModal(false)} />
          <div className="relative bg-[#1a1209] border border-[#f5e6c8]/10 rounded-2xl p-6 max-w-[300px] w-full shadow-2xl text-[#f5e6c8]">
            <div className="w-12 h-12 rounded-full bg-[#e63946]/10 border border-[#e63946]/20 flex items-center justify-center mx-auto mb-4">
              <Clock className="w-6 h-6 text-[#e63946]" />
            </div>
            <h3 className="text-center font-bold text-lg mb-1" style={{ fontFamily: "Georgia, serif" }}>Daily Limit Reached</h3>
            <p className="text-center text-[#f5e6c8]/50 text-sm mb-4">
              You've used all 3 generations for today. Come back in:
            </p>
            <div className="bg-black/30 rounded-xl py-3 px-4 text-center mb-4">
              <span className="text-2xl font-bold tabular-nums text-[#e63946]">
                {resetInMs > 0 ? formatReset(resetInMs) : "soon"}
              </span>
            </div>
            <p className="text-center text-[#f5e6c8]/40 text-xs mb-5">
              Already happy with one of your images? You can still download your poster now.
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setShowLimitModal(false)}
                className="flex-1 py-2.5 rounded-xl border border-[#f5e6c8]/10 text-sm text-[#f5e6c8]/60 hover:bg-white/5 transition-colors"
              >
                Close
              </button>
              {hasPhoto && (
                <button
                  onClick={() => { setShowLimitModal(false); download(); }}
                  className="flex-1 py-2.5 rounded-xl bg-[#e63946] text-white text-sm font-semibold hover:bg-[#c1121f] transition-colors"
                >
                  Download $1.99
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ─── MAIN LAYOUT ───────────────────────────────── */}
      <div className="fixed inset-0 w-full h-full font-sans overflow-hidden" style={{ background: "#E0CFBA" }}>
        <div className={`w-full h-full overflow-y-auto flex flex-col items-center p-4 transition-all duration-300 ${isEditingText ? "justify-start pt-4" : "justify-center"}`}>

          {/* Header */}
          {!isEditingText && (
            <div className="flex items-center justify-between w-full max-w-[340px] mb-5 shrink-0">
              <div>
                <p className="text-[10px] tracking-[0.2em] text-gray-500 uppercase">One Piece</p>
                <h1 className="text-2xl font-bold text-gray-800" style={{ fontFamily: "Georgia, serif" }}>Wanted Maker</h1>
              </div>
              <button
                onClick={() => setShowGuide(true)}
                className="flex items-center gap-1.5 text-xs font-semibold text-gray-600 border border-gray-300 bg-white/70 rounded-full px-3 py-1.5 hover:bg-white transition-colors"
              >
                How it works <ChevronRight className="w-3 h-3" />
              </button>
            </div>
          )}

          {/* Canvas */}
          <div
            ref={containerRef}
            className="relative w-full max-w-[340px] bg-white shadow-2xl rounded-sm border border-gray-200 shrink-0 overflow-hidden"
            style={{ height: "500px" }}
          >
            {isLoading && (
              <div className="absolute inset-0 z-20 bg-gray-50 flex flex-col items-center justify-center gap-3">
                <Loader2 className="w-8 h-8 text-[#e63946] animate-spin" />
                <p className="text-gray-400 text-xs">Loading Editor...</p>
              </div>
            )}

            {isProcessing && (
              <div className="absolute inset-0 z-50 flex flex-col items-center justify-center animate-in fade-in duration-300">
                <div className="absolute inset-0 bg-[#1a1209]/70 backdrop-blur-md" />
                <div className="relative z-10 flex flex-col items-center gap-3 text-[#f5e6c8] p-6">
                  <Loader2 className="w-10 h-10 animate-spin text-[#e63946]" />
                  <div className="text-center">
                    <p className="text-base font-bold" style={{ fontFamily: "Georgia, serif" }}>Animefying...</p>
                    <p className="text-xs text-[#f5e6c8]/60 mt-1">This takes about 15 seconds</p>
                  </div>
                </div>
              </div>
            )}

            {isDownloading && (
              <div className="absolute inset-0 z-50 flex flex-col items-center justify-center animate-in fade-in duration-300">
                <div className="absolute inset-0 bg-[#1a1209]/70 backdrop-blur-md" />
                <div className="relative z-10 flex flex-col items-center gap-3 text-[#f5e6c8] p-6">
                  <Loader2 className="w-10 h-10 animate-spin text-[#e63946]" />
                  <div className="text-center">
                    <p className="text-base font-bold" style={{ fontFamily: "Georgia, serif" }}>Preparing poster...</p>
                    <p className="text-xs text-[#f5e6c8]/60 mt-1">Redirecting to checkout</p>
                  </div>
                </div>
              </div>
            )}

            <div className="w-full h-full overflow-hidden">
              <canvas ref={canvasEl} className="block" />
            </div>
          </div>

          {/* Image slots */}
          {!isEditingText && (
            <div className="mt-3 w-full max-w-[340px] shrink-0">
              <div className="flex items-center justify-between mb-2">
                <p className="text-[10px] tracking-[0.15em] uppercase text-gray-500 font-semibold">Your Generations</p>
                <p className={`text-[10px] font-semibold ${attemptsLeft > 0 ? "text-gray-500" : "text-[#e63946]"}`}>
                  {attemptsLeft > 0 ? `${attemptsLeft} left today` : "Limit reached · resets in " + (resetInMs > 0 ? formatReset(resetInMs) : "24h")}
                </p>
              </div>

              <div className="flex gap-2">
                {Array.from({ length: totalSlots }).map((_, i) => {
                  const img = generatedImages[i];
                  const isActive = img?.url === activeImageUrl;
                  return (
                    <button
                      key={i}
                      onClick={() => img ? swapCanvasImage(img.url) : triggerUpload()}
                      disabled={isButtonDisabled}
                      className={`relative flex-1 rounded-xl overflow-hidden border-2 transition-all active:scale-95
                        ${isActive
                          ? "border-[#e63946] shadow-lg shadow-[#e63946]/20"
                          : img
                          ? "border-gray-300 hover:border-gray-400"
                          : "border-dashed border-gray-300 bg-white/50 hover:border-gray-400"
                        }`}
                      style={{ aspectRatio: "1" }}
                      title={img ? "Use this image" : "Generate image"}
                    >
                      {img ? (
                        <>
                          <img src={img.url} alt={`Gen ${i + 1}`} className="w-full h-full object-cover" />
                          {isActive && (
                            <div className="absolute bottom-1 right-1 w-2.5 h-2.5 rounded-full bg-[#e63946] shadow-sm border border-white" />
                          )}
                          {/* Slot number */}
                          <div className="absolute top-1 left-1 w-4 h-4 rounded-full bg-black/40 flex items-center justify-center">
                            <span className="text-[8px] text-white font-bold">{i + 1}</span>
                          </div>
                        </>
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center gap-1 py-3">
                          <ImagePlus className="w-4 h-4 text-gray-400" />
                          <span className="text-[9px] text-gray-400 font-medium">
                            {attemptsLeft > 0 ? "Generate" : "No tries left"}
                          </span>
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Actions */}
          {!isEditingText && (
            <>
              <div className="flex gap-2.5 mt-3 w-full max-w-[340px] justify-center shrink-0">
                <input
                  ref={fileInputRef}
                  type="file"
                  onChange={handleImageUpload}
                  className="hidden"
                  accept="image/*"
                  disabled={isButtonDisabled}
                />

                <button
                  onClick={triggerUpload}
                  disabled={isButtonDisabled && attemptsLeft > 0}
                  className={`flex-1 border py-3 px-4 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2
                    ${attemptsLeft <= 0
                      ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
                      : cooldown > 0
                      ? "bg-white/60 text-gray-400 border-gray-200 cursor-not-allowed"
                      : "bg-white hover:bg-gray-50 text-gray-700 border-gray-300 shadow-sm"
                    }`}
                >
                  <ImagePlus className="w-4 h-4" />
                  <span>
                    {isProcessing ? "Generating..." :
                     cooldown > 0 ? `Wait ${cooldown}s` :
                     attemptsLeft <= 0 ? "Limit Reached" :
                     hasPhoto ? "Regenerate" : "Upload & Generate"}
                  </span>
                </button>

                <button
                  onClick={download}
                  disabled={isButtonDisabled || !hasPhoto}
                  className="flex-1 bg-[#e63946] hover:bg-[#c1121f] text-white py-3 px-4 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2 disabled:opacity-40 shadow-md shadow-[#e63946]/20"
                >
                  <Download className="w-4 h-4" />
                  <span>{isDownloading ? "Preparing..." : "Download $1.99"}</span>
                </button>
              </div>

              <p className="mt-3 text-gray-400 text-[10px] text-center max-w-[300px] shrink-0 pb-8">
                {!hasPhoto
                  ? "Upload a photo to get started • 3 AI generations per day"
                  : "Tap a slot to switch • Double-tap text to edit • Drag to reposition"}
              </p>
            </>
          )}
        </div>
      </div>
    </>
  );
}