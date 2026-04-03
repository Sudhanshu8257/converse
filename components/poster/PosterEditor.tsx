"use client";

import { useEffect, useRef, useState, ChangeEvent } from "react";
import {
  Download,
  Loader2,
  ImagePlus,
  Type,
} from "lucide-react";
import { saveSession, uploadToAnimeApi } from "@/actions/posterAction";
import { toast } from "sonner";

import { GuideButton, HowItWorksSheet } from "./HowItWorksSheet";
import { LimitModal } from "./LimitModal";
import { GenerationsGrid } from "./GenerationsGrid";

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
  const [resetInMs, setResetInMs] = useState<number>(
    sessionData?.resetInMs ?? 0,
  );
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>(
    sessionData?.generatedImages || [],
  );
  const [activeImageUrl, setActiveImageUrl] = useState<string | null>(null);
  const [attemptsLeft, setAttemptsLeft] = useState<number>(
    sessionData?.attemptsLeft ?? 3,
  );

  // Cooldown timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (cooldown > 0)
      timer = setInterval(() => setCooldown((p) => p - 1), 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  // Live countdown for reset timer in modal
  useEffect(() => {
    if (!showLimitModal || resetInMs <= 0) return;
    const interval = setInterval(
      () => setResetInMs((p) => Math.max(0, p - 1000)),
      1000,
    );
    return () => clearInterval(interval);
  }, [showLimitModal, resetInMs]);

  // Prevent right click
  useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => e.preventDefault();
    document.addEventListener("contextmenu", handleContextMenu);
    return () => document.removeEventListener("contextmenu", handleContextMenu);
  }, []);

  // Custom Pinch-to-Zoom logic for mobile
  useEffect(() => {
    const container = containerRef.current;
    if (!container || isLoading) return;

    let initialDist = 0;
    let initialScaleX = 1;
    let initialScaleY = 1;

    const getDist = (touches: TouchList) =>
      Math.hypot(
        touches[0].clientX - touches[1].clientX,
        touches[0].clientY - touches[1].clientY,
      );

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 2) {
        e.preventDefault();
        initialDist = getDist(e.touches);
        const activeObj = fabricRef.current?.getActiveObject();
        if (activeObj && activeObj.name === "user_photo") {
          initialScaleX = activeObj.scaleX || 1;
          initialScaleY = activeObj.scaleY || 1;
        }
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 2) {
        e.preventDefault();
        const currentDist = getDist(e.touches);
        const scaleRatio = currentDist / initialDist;
        const activeObj = fabricRef.current?.getActiveObject();
        if (activeObj && activeObj.name === "user_photo") {
          activeObj.set({
            scaleX: initialScaleX * scaleRatio,
            scaleY: initialScaleY * scaleRatio,
          });
          fabricRef.current.requestRenderAll();
        }
      }
    };

    container.addEventListener("touchstart", handleTouchStart, { passive: false });
    container.addEventListener("touchmove", handleTouchMove, { passive: false });
    return () => {
      container.removeEventListener("touchstart", handleTouchStart);
      container.removeEventListener("touchmove", handleTouchMove);
    };
  }, [isLoading]);

  // Canvas init
  useEffect(() => {
    let isMounted = true;
    const init = async () => {
      if (!canvasEl.current) return;
      try {
        const { Canvas, FabricImage, IText, Rect, Group, Object: FabricObject } =
          await import("fabric");
        if (!isMounted) return;

        FabricObject.prototype.transparentCorners = false;
        FabricObject.prototype.cornerColor = "#e63946";
        FabricObject.prototype.borderColor = "#e63946";
        FabricObject.prototype.cornerStrokeColor = "#fff";
        FabricObject.prototype.cornerStyle = "circle";
        FabricObject.prototype.cornerSize = 12;

        const fontName = "WantedPrint";
        const printFont = new FontFace(fontName, "url(/fonts/Aldine.otf)");
        try {
          await printFont.load();
          document.fonts.add(printFont);
        } catch {
          console.warn("Font fallback.");
        }

        const canvas = new Canvas(canvasEl.current, {
          width: POSTER_WIDTH,
          height: POSTER_HEIGHT,
          backgroundColor: "#ffffff",
          preserveObjectStacking: true,
          selection: false,
        });
        fabricRef.current = canvas;

        canvas.on("text:editing:entered", () => {
          setIsEditingText(true);
          window.scrollTo(0, 0);
        });
        canvas.on("text:editing:exited", () => {
          setIsEditingText(false);
          window.scrollTo(0, 0);
        });

        const btnRect = new Rect({
          width: 640,
          height: 480,
          fill: "#f3f4f6",
          rx: 15,
          ry: 15,
          stroke: "#d1d5db",
          strokeWidth: 4,
          originX: "center",
          originY: "center",
        });
        const btnText = new IText("Tap to Upload", {
          fontFamily: "Georgia",
          fontSize: 30,
          fill: "#9ca3af",
          originX: "center",
          originY: "center",
        });
        const uploadGroup = new Group([btnRect, btnText], {
          left: PHOTO_X,
          top: PHOTO_Y,
          originX: "center",
          originY: "center",
          selectable: false,
          hoverCursor: "pointer",
          name: "upload_trigger",
        } as any);
        uploadGroup.on("mousedown", () => fileInputRef.current?.click());
        canvas.add(uploadGroup);

        const template = await FabricImage.fromURL("/assets/placeholder2.png");
        template.set({
          originX: "left",
          originY: "top",
          left: 0,
          top: 0,
          selectable: false,
          evented: false,
        });
        template.scaleToWidth(POSTER_WIDTH);
        template.scaleToHeight(POSTER_HEIGHT);
        canvas.add(template);

        const nameText = new IText("ENTER NAME", {
          fontFamily: fontName,
          fontSize: 90,
          fill: "#2F211A",
          left: 362,
          top: 845,
          scaleX: 0.86,
          scaleY: 1.73,
          originX: "center",
          textAlign: "center",
          editable: true,
          lockUniScaling: false,
          centeredScaling: true,
          cornerColor: "#e63946",
          borderColor: "#e63946",
          name: "poster_name",
        } as any);
        canvas.add(nameText);

        const stripColor = "#0046ad";
        const offset = 75;
        const createCornerLabel = (
          text: string,
          angle: number,
          left: number,
          top: number,
        ) => {
          const rect = new Rect({
            width: 300,
            height: 35,
            fill: stripColor,
            originX: "center",
            originY: "center",
          });
          const label = new IText(text, {
            fontFamily: "Arial",
            fontSize: 20,
            fontWeight: "bold",
            fill: "#ffffff",
            originX: "center",
            originY: "center",
            top: 1,
          });
          return new Group([rect, label], {
            angle,
            left,
            top,
            originX: "center",
            originY: "center",
            selectable: false,
            evented: false,
            opacity: 0.95,
            name: "watermark",
          } as any);
        };

        canvas.add(createCornerLabel("CONVERSE", -45, offset, offset));
        canvas.add(createCornerLabel("CONVERSE", 45, POSTER_WIDTH - offset, offset));
        canvas.add(createCornerLabel("CONVERSE", 45, offset, POSTER_HEIGHT - offset));
        canvas.add(createCornerLabel("CONVERSE", -45, POSTER_WIDTH - offset, POSTER_HEIGHT - offset));

        canvas.renderAll();
        setIsLoading(false);
        setTimeout(fitToScreen, 100);
      } catch (err) {
        console.error(err);
        setIsLoading(false);
      }
    };

    init();
    window.addEventListener("resize", fitToScreen);
    return () => {
      isMounted = false;
      window.removeEventListener("resize", fitToScreen);
      if (fabricRef.current) fabricRef.current.dispose();
    };
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
      img.set({
        left: 367,
        top: 446,
        scaleX: 0.61,
        scaleY: 0.62,
        originX: "center",
        originY: "center",
        transparentCorners: false,
        cornerColor: "#e63946",
        borderColor: "#e63946",
        name: "user_photo",
      } as any);
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
    if (cooldown > 0) {
      toast.error(`Wait ${cooldown}s before replacing.`);
      return;
    }
    if (attemptsLeft <= 0) {
      setShowLimitModal(true);
      return;
    }

    const file = e.target.files[0];
    e.target.value = "";
    setIsProcessing(true);

    const formData = new FormData();
    formData.append("image", file);
    formData.append("sessionId", sessionId);

    const result = await uploadToAnimeApi(formData);

    if (!result.success || !result.imageUrl) {
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

    const newImage: GeneratedImage = {
      url: result.imageUrl,
      fileId: result.fileId,
      createdAt: new Date().toISOString(),
    };

    // const newImage: GeneratedImage = {
    //   url: "https://ik.imagekit.io/r8pra5q2fr/anime-generated/anime_1774537787766_qpgUj8iHi.png?updatedAt=1774537790020",
    //   fileId: `${Date.now()}`,
    //   createdAt: new Date().toISOString(),
    // };

    setGeneratedImages((prev) => [...prev, newImage]);
    setAttemptsLeft((prev) => Math.max(0, prev - 1));
    await swapCanvasImage(newImage.url);
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

      const base64 = canvas.toDataURL({
        format: "png",
        multiplier: 1.5,
        quality: 1,
      });

      watermarks.forEach((w: any) => w.set("visible", true));
      canvas.requestRenderAll();

      const nameTextObj = objects.find((o: any) => o.name === "poster_name");
      const posterName = nameTextObj?.text?.trim() || "WANTED";

      const result = await saveSession({ posterBase64: base64, posterName });

      if (result.success && result.checkoutUrl) {
        toast.success("Redirecting to secure checkout...", { id: toastId });
        setTimeout(() => {
          window.location.href = result.checkoutUrl;
        }, 800);
      } else {
        throw new Error(result.error || "Failed to create checkout session");
      }
    } catch (err: any) {
      toast.error(err.message || "Something went wrong.", { id: toastId });
      setIsDownloading(false);
    }
  };

  const triggerUpload = () => {
    if (attemptsLeft <= 0) {
      setShowLimitModal(true);
      return;
    }
    if (cooldown > 0) return;
    fileInputRef.current?.click();
  };

  const isButtonDisabled = isLoading || isProcessing || isDownloading;

  return (
    <>
      {/* ─── GUIDE SHEET ─── */}
      <HowItWorksSheet open={showGuide} onOpenChange={setShowGuide} />

      {/* ─── LIMIT MODAL ─── */}
      <LimitModal
        open={showLimitModal}
        onClose={() => setShowLimitModal(false)}
        resetInMs={resetInMs}
        hasPhoto={hasPhoto}
        onDownload={download}
      />

      {/* ─── MAIN LAYOUT ─── */}
      <div
        className="w-full overflow-y-auto min-h-screen h-full flex items-center justify-center font-sans"
        style={{
          background:
            "linear-gradient(135deg, #d4c4a8 0%, #c9b896 50%, #bfac87 100%)",
        }}
      >
        <div
          className="absolute inset-0 opacity-30 pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
          }}
        />

        <div
          className={`relative w-full min-h-full overflow-y-auto flex flex-col items-center transition-all duration-300
            ${isEditingText ? "justify-start pt-4 px-4" : "justify-center px-4 py-6"}`}
        >
          <div className="flex flex-col lg:flex-row lg:bg-white/90 items-center lg:items-stretch justify-center w-fit rounded-xl max-w-5xl">
            {/* ─── CANVAS PANEL ─── */}
            <div className="flex-shrink-0 flex flex-col">
              <div
                ref={containerRef}
                className="relative bg-white rounded-lg border border-black/10 overflow-hidden touch-none"
                style={{ width: "min(420px, calc(100vw - 2rem))" }}
              >
                {isLoading && (
                  <div className="absolute inset-0 z-20 bg-[#faf8f5] flex flex-col items-center justify-center gap-3">
                    <Loader2 className="w-8 h-8 text-[#e63946] animate-spin" />
                    <p className="text-[#9a8a7a] font-semibold text-xs tracking-wide">
                      Loading editor…
                    </p>
                  </div>
                )}

                {isProcessing && (
                  <div className="absolute inset-0 z-50 flex flex-col items-center justify-center animate-in fade-in duration-300">
                    <div className="absolute inset-0 bg-[#0f0a04]/75 backdrop-blur-md" />
                    <div className="relative z-10 flex flex-col items-center gap-4 text-[#f0e6d3] p-6 text-center">
                      <div className="w-14 h-14 rounded-full border-2 border-[#e63946]/30 border-t-[#e63946] animate-spin" />
                      <div>
                        <p className="text-lg font-extrabold tracking-tight">
                          Animefying…
                        </p>
                        <p className="text-xs font-medium text-[#f0e6d3]/70 mt-1 tracking-wide">
                          This takes about 15 seconds
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {isDownloading && (
                  <div className="absolute inset-0 z-50 flex flex-col items-center justify-center animate-in fade-in duration-300">
                    <div className="absolute inset-0 bg-[#0f0a04]/75 backdrop-blur-md" />
                    <div className="relative z-10 flex flex-col items-center gap-4 text-[#f0e6d3] p-6 text-center">
                      <div className="w-14 h-14 rounded-full border-2 border-[#e63946]/30 border-t-[#e63946] animate-spin" />
                      <div>
                        <p className="text-lg font-extrabold tracking-tight">
                          Preparing poster…
                        </p>
                        <p className="text-xs font-medium text-[#f0e6d3]/70 mt-1 tracking-wide">
                          Redirecting to checkout
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="w-full h-full overflow-hidden">
                  <canvas ref={canvasEl} className="block" />
                </div>
              </div>
            </div>

            {/* ─── CONTROLS PANEL ─── */}
            <div className="flex flex-col lg:bg-white/90 w-full lg:w-[420px] lg:flex-shrink-0 backdrop-blur-sm rounded-b-xl lg:rounded-r-xl overflow-hidden">
              {!isEditingText && (
                <>
                  {/* Header */}
                  <div className="px-5 py-3 lg:pt-5 lg:pb-4 border-b border-black/5 flex justify-end lg:justify-between items-start">
                    <div className="hidden lg:block">
                      <p className="text-[10px] tracking-[0.2em] uppercase text-[#9a8a6a] font-extrabold mb-1">
                        One Piece
                      </p>
                      <h1 className="text-2xl font-extrabold tracking-tight text-[#1a1209] leading-none">
                        Wanted Maker
                      </h1>
                      <p className="text-xs font-semibold text-[#8a7a6a] mt-1.5 tracking-wide">
                        Turn your face into anime art
                      </p>
                    </div>
                    <GuideButton onClick={() => setShowGuide(true)} />
                  </div>

                  {/* Generations Grid */}
                  <GenerationsGrid
                    generatedImages={generatedImages}
                    activeImageUrl={activeImageUrl}
                    attemptsLeft={attemptsLeft}
                    resetInMs={resetInMs}
                    isButtonDisabled={isButtonDisabled}
                    onSelectImage={swapCanvasImage}
                    onTriggerUpload={triggerUpload}
                  />

                  {/* Download CTA */}
                  <div className="px-5 py-5">
                    <input
                      ref={fileInputRef}
                      type="file"
                      onChange={handleImageUpload}
                      className="hidden"
                      accept="image/*"
                      disabled={isButtonDisabled}
                    />

                    <button
                      onClick={download}
                      disabled={isButtonDisabled || !hasPhoto}
                      className="w-full bg-[#1a1209] hover:bg-[#2d2010] disabled:opacity-35 disabled:cursor-not-allowed text-[#f0e6d3] py-4 px-5 rounded-xl font-bold tracking-wide text-sm transition-all flex items-center justify-center gap-2.5 shadow-xl"
                    >
                      <Download className="w-4 h-4" />
                      <span>
                        {isDownloading
                          ? "Preparing…"
                          : "Download Poster — $1.99"}
                      </span>
                    </button>

                    {!hasPhoto && (
                      <button
                        onClick={triggerUpload}
                        disabled={isButtonDisabled || cooldown > 0}
                        className="w-full mt-3 border-2 border-dashed border-[#c4b494] hover:border-[#a49474] bg-[#faf6ef] hover:bg-[#f5f0e4] text-[#7a6a5a] py-3.5 px-5 rounded-xl font-bold tracking-wide text-sm transition-all flex items-center justify-center gap-2 disabled:opacity-40"
                      >
                        <ImagePlus className="w-4 h-4" />
                        <span>
                          {isProcessing
                            ? "Generating…"
                            : cooldown > 0
                              ? `Upload in ${cooldown}s`
                              : "Upload & Generate"}
                        </span>
                      </button>
                    )}

                    {hasPhoto && attemptsLeft > 0 && (
                      <button
                        onClick={triggerUpload}
                        disabled={isButtonDisabled || cooldown > 0}
                        className="w-full mt-3 border-2 border-[#d4c4a4] hover:border-[#b4a484] bg-transparent text-[#7a6a5a] py-3 px-5 rounded-xl font-bold tracking-wide text-xs transition-all flex items-center justify-center gap-2 disabled:opacity-40"
                      >
                        <ImagePlus className="w-4 h-4" />
                        <span>
                          {isProcessing
                            ? "Generating…"
                            : cooldown > 0
                              ? `Regenerate in ${cooldown}s`
                              : `Regenerate (${attemptsLeft} left)`}
                        </span>
                      </button>
                    )}

                    <p className="mt-4 font-semibold text-[#9a8a74] text-[11px] text-center leading-relaxed">
                      {!hasPhoto
                        ? "Upload a photo to get started · 3 AI generations per day"
                        : "Full-res poster delivered after secure checkout"}
                    </p>
                  </div>
                </>
              )}

              {isEditingText && (
                <div className="flex-1 flex flex-col items-center justify-center gap-3 p-8 text-center">
                  <div className="w-12 h-12 rounded-full bg-[#e8d8b8] flex items-center justify-center mb-2">
                    <Type className="w-5 h-5 text-[#9a8a6a]" />
                  </div>
                  <p className="text-base font-extrabold tracking-tight text-[#1a1209]">
                    Editing name…
                  </p>
                  <p className="text-sm font-medium text-[#8a7a6a] leading-relaxed">
                    Click anywhere outside the text to finish editing
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}