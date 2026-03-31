"use client";

import { useEffect, useRef, useState, ChangeEvent } from "react";
import {
  Download,
  Loader2,
  ImagePlus,
  X,
  ChevronRight,
  Clock,
  Zap,
  Type,
  Move,
  CreditCard,
  Sparkles,
} from "lucide-react";
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
    desc: "Drag and resize your anime portrait to fit perfectly on the poster.",
  },
  {
    icon: <CreditCard className="w-4 h-4" />,
    step: "05",
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

  // Prevent scroll & right click
  useEffect(() => {
    // document.body.style.overflow = "hidden";
    // document.body.style.position = "fixed";
    // document.body.style.width = "100%";
    // document.body.style.height = "100%";
    const handleContextMenu = (e: MouseEvent) => e.preventDefault();
    document.addEventListener("contextmenu", handleContextMenu);
    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
      // document.body.style.overflow = "";
      // document.body.style.position = "";
      // document.body.style.width = "";
      // document.body.style.height = "";
    };
  }, []);

  // Canvas init
  useEffect(() => {
    let isMounted = true;
    const init = async () => {
      if (!canvasEl.current) return;
      try {
        const {
          Canvas,
          FabricImage,
          IText,
          Rect,
          Group,
          Object: FabricObject,
        } = await import("fabric");
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
        canvas.add(
          createCornerLabel("CONVERSE", 45, POSTER_WIDTH - offset, offset),
        );
        canvas.add(
          createCornerLabel("CONVERSE", 45, offset, POSTER_HEIGHT - offset),
        );
        canvas.add(
          createCornerLabel(
            "CONVERSE",
            -45,
            POSTER_WIDTH - offset,
            POSTER_HEIGHT - offset,
          ),
        );

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

    // const result = await uploadToAnimeApi(formData);

    // if (!result.success || !result.imageUrl) {
    //   if (result.resetInMs) {
    //     setResetInMs(result.resetInMs);
    //     setAttemptsLeft(0);
    //     setShowLimitModal(true);
    //   } else {
    //     toast.error("Failed to process image. Please try again.");
    //   }
    //   setIsProcessing(false);
    //   return;
    // }

    // const newImage: GeneratedImage = {
    //   url: result.imageUrl,
    //   fileId: result.fileId,
    //   createdAt: new Date().toISOString(),
    // };

    const newImage: GeneratedImage = {
      url: "https://ik.imagekit.io/r8pra5q2fr/anime-generated/anime_1774537787766_qpgUj8iHi.png?updatedAt=1774537790020",
      fileId: "111111",
      createdAt: new Date().toISOString(),
    };
    setGeneratedImages((prev) => [...prev, newImage]);
    setAttemptsLeft((prev) => Math.max(0, prev - 1));
    await swapCanvasImage(
      "https://ik.imagekit.io/r8pra5q2fr/anime-generated/anime_1774537787766_qpgUj8iHi.png?updatedAt=1774537790020",
    );
    // await swapCanvasImage(result.imageUrl);
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
  const totalSlots = Math.max(
    3,
    generatedImages.length + (generatedImages.length < 3 ? 1 : 0),
  );

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
          <div
            className="flex-1 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowGuide(false)}
          />
          {/* Panel */}
          <div className="w-[300px] bg-[#0f0a04] text-[#f0e6d3] flex flex-col h-full shadow-2xl">
            {/* Panel header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-white/8">
              <div>
                <p className="text-[9px] tracking-[0.25em] text-[#c9a96e]/60 uppercase mb-1">
                  One Piece · Wanted Poster
                </p>
                <h2
                  className="text-base font-bold tracking-tight"
                  style={{ fontFamily: "Georgia, serif" }}
                >
                  How It Works
                </h2>
              </div>
              <button
                onClick={() => setShowGuide(false)}
                className="w-8 h-8 rounded-full bg-white/6 hover:bg-white/12 transition-colors flex items-center justify-center"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Steps */}
            <div className="flex-1 overflow-y-auto px-6 py-6">
              <div className="space-y-0">
                {HOW_IT_WORKS.map((step, i) => (
                  <div key={i} className="relative flex gap-4">
                    {/* Vertical connector */}
                    {i < HOW_IT_WORKS.length - 1 && (
                      <div className="absolute left-[19px] top-10 bottom-0 w-px bg-gradient-to-b from-[#c9a96e]/30 to-transparent" />
                    )}
                    {/* Step number bubble */}
                    <div className="flex-shrink-0 flex flex-col items-center">
                      <div className="w-10 h-10 rounded-full bg-[#c9a96e]/10 border border-[#c9a96e]/25 flex items-center justify-center mb-1">
                        <span className="text-[#c9a96e] text-xs font-bold">
                          {step.step}
                        </span>
                      </div>
                    </div>
                    {/* Content */}
                    <div className="pb-7 pt-1.5">
                      <p className="text-sm font-semibold text-[#f0e6d3] mb-1 leading-tight">
                        {step.title}
                      </p>
                      <p className="text-xs text-[#f0e6d3]/45 leading-relaxed">
                        {step.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Tip footer */}
            <div className="px-6 pb-6">
              <div className="rounded-xl bg-[#c9a96e]/8 border border-[#c9a96e]/15 p-4">
                <div className="flex gap-2.5 items-start">
                  <Sparkles className="w-3.5 h-3.5 text-[#c9a96e] mt-0.5 flex-shrink-0" />
                  <p className="text-xs text-[#f0e6d3]/60 leading-relaxed">
                    Swap between generated images using the slots below the
                    poster. Pick the best one before downloading.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── LIMIT MODAL ───────────────────────────────── */}
      {showLimitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/65 backdrop-blur-sm"
            onClick={() => setShowLimitModal(false)}
          />
          <div className="relative bg-[#0f0a04] border border-white/8 rounded-2xl p-7 max-w-[320px] w-full shadow-2xl text-[#f0e6d3]">
            <div className="w-14 h-14 rounded-full bg-[#e63946]/10 border border-[#e63946]/20 flex items-center justify-center mx-auto mb-5">
              <Clock className="w-6 h-6 text-[#e63946]" />
            </div>
            <h3
              className="text-center font-bold text-lg mb-2"
              style={{ fontFamily: "Georgia, serif" }}
            >
              Daily Limit Reached
            </h3>
            <p className="text-center text-[#f0e6d3]/45 text-sm mb-5 leading-relaxed">
              You've used all 3 generations for today. Come back in:
            </p>
            <div className="bg-white/4 border border-white/8 rounded-xl py-4 px-4 text-center mb-5">
              <span className="text-3xl font-bold tabular-nums text-[#e63946]">
                {resetInMs > 0 ? formatReset(resetInMs) : "soon"}
              </span>
            </div>
            <p className="text-center text-[#f0e6d3]/35 text-xs mb-6 leading-relaxed">
              Already happy with one of your images? You can still download your
              poster.
            </p>
            <div className="flex gap-2.5">
              <button
                onClick={() => setShowLimitModal(false)}
                className="flex-1 py-3 rounded-xl border border-white/10 text-sm text-[#f0e6d3]/50 hover:bg-white/5 transition-colors"
              >
                Close
              </button>
              {hasPhoto && (
                <button
                  onClick={() => {
                    setShowLimitModal(false);
                    download();
                  }}
                  className="flex-1 py-3 rounded-xl bg-[#e63946] text-white text-sm font-semibold hover:bg-[#c1121f] transition-colors"
                >
                  Download $1.99
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ─── MAIN LAYOUT ───────────────────────────────── */}
      {/* Background */}
      <div
        className=" w-full overflow-y-auto min-h-screen h-full flex items-center justify-center font-sans"
        style={{
          background:
            "linear-gradient(135deg, #d4c4a8 0%, #c9b896 50%, #bfac87 100%)",
        }}
      >
        {/* Subtle noise texture overlay */}
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
          {/* ── DESKTOP: side-by-side layout ── */}
          {/* ── MOBILE: stacked layout ── */}
          <div className="flex flex-col lg:flex-row lg:bg-white/90 items-center lg:items-stretch justify-center w-fit rounded-xl max-w-5xl">
            {/* ─── CANVAS PANEL ─── */}
            <div className="flex-shrink-0 flex flex-col">
              {/* Canvas wrapper */}
              <div
                ref={containerRef}
                className="relative bg-white rounded-lg border border-black/10 overflow-hidden"
                style={{
                  width: "min(420px, calc(100vw - 2rem))",
                  /* height is set dynamically by fitToScreen */
                }}
              >
                {isLoading && (
                  <div className="absolute inset-0 z-20 bg-[#faf8f5] flex flex-col items-center justify-center gap-3">
                    <Loader2 className="w-8 h-8 text-[#e63946] animate-spin" />
                    <p className="text-[#9a8a7a] text-xs tracking-wide">
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
                        <p
                          className="text-base font-bold"
                          style={{ fontFamily: "Georgia, serif" }}
                        >
                          Animefying…
                        </p>
                        <p className="text-xs text-[#f0e6d3]/55 mt-1">
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
                        <p
                          className="text-base font-bold"
                          style={{ fontFamily: "Georgia, serif" }}
                        >
                          Preparing poster…
                        </p>
                        <p className="text-xs text-[#f0e6d3]/55 mt-1">
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
            <div
              className="flex flex-col lg:bg-white/90 w-full backdrop-blur-sm rounded-b-xl lg:rounded-r-xl  overflow-hidden"
             
            >
              {!isEditingText && (
                <>
                  {/* Header */}
                  <div className="px-5 max-lg:hidden pt-5 pb-4 border-b border-black/6">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-[9px] tracking-[0.2em] uppercase text-[#9a8a6a] font-semibold mb-0.5">
                          One Piece
                        </p>
                        <h1
                          className="text-2xl font-bold text-[#1a1209] leading-tight"
                          style={{ fontFamily: "Georgia, serif" }}
                        >
                          Wanted Maker
                        </h1>
                        <p className="text-xs text-[#8a7a6a] mt-1">
                          Turn your face into anime art
                        </p>
                      </div>
                      <button
                        onClick={() => setShowGuide(true)}
                        className="flex-shrink-0 flex items-center gap-1.5 text-[11px] font-semibold text-[#5a4a3a] bg-[#f0e8d8] hover:bg-[#e8dcc8] border border-[#d4c4a4] rounded-full px-3 py-1.5 transition-colors"
                      >
                        Guide <ChevronRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>

                  {/* Generations */}
                  <div className="px-5 py-4 lg:mt-auto border-b border-black/6">
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-[10px] tracking-[0.15em] uppercase text-[#8a7a6a] font-bold">
                        Your Generations
                      </p>
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
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

                    <div className="flex gap-2.5">
                      {Array.from({ length: totalSlots }).map((_, i) => {
                        const img = generatedImages[i];
                        const isActive = img?.url === activeImageUrl;
                        return (
                          <button
                            key={i}
                            onClick={() =>
                              img ? swapCanvasImage(img.url) : triggerUpload()
                            }
                            disabled={isButtonDisabled}
                            className={`relative flex-1 rounded-xl overflow-hidden transition-all active:scale-95
                              ${
                                isActive
                                  ? "ring-2 ring-[#e63946] ring-offset-1 shadow-lg shadow-[#e63946]/15"
                                  : img
                                    ? "border-2 border-[#d4c4a4] hover:border-[#b4a484]"
                                    : "border-2 border-dashed border-[#c4b494] bg-[#faf6ef] hover:border-[#a49474] hover:bg-[#f5f0e4]"
                              }`}
                            style={{ aspectRatio: "1" }}
                            title={img ? "Use this image" : "Generate image"}
                          >
                            {img ? (
                              <>
                                <img
                                  src={img.url}
                                  alt={`Gen ${i + 1}`}
                                  className="w-full h-full object-cover"
                                />
                                {isActive && (
                                  <div className="absolute bottom-1.5 right-1.5 w-3 h-3 rounded-full bg-[#e63946] border-2 border-white shadow" />
                                )}
                                <div className="absolute top-1.5 left-1.5 w-5 h-5 rounded-full bg-black/35 backdrop-blur-sm flex items-center justify-center">
                                  <span className="text-[9px] text-white font-bold">
                                    {i + 1}
                                  </span>
                                </div>
                              </>
                            ) : (
                              <div className="w-full h-full flex flex-col items-center justify-center gap-1.5 py-4">
                                <div className="w-7 h-7 rounded-full bg-[#e8d8b8] flex items-center justify-center">
                                  <ImagePlus className="w-3.5 h-3.5 text-[#9a8a6a]" />
                                </div>
                                <span className="text-[9px] text-[#9a8a6a] font-medium">
                                  {attemptsLeft > 0
                                    ? "Generate"
                                    : "No tries left"}
                                </span>
                              </div>
                            )}
                          </button>
                        );
                      })}
                    </div>

                    {attemptsLeft <= 0 && resetInMs > 0 && (
                      <p className="text-[10px] text-[#9a7a6a] mt-2 text-center">
                        Resets in {formatReset(resetInMs)}
                      </p>
                    )}
                  </div>

                  {/* Instructions */}
                  {/* <div className="px-5 py-4 border-b border-black/6 flex-1">
                    <p className="text-[10px] tracking-[0.15em] uppercase text-[#8a7a6a] font-bold mb-3">
                      Quick Tips
                    </p>
                    <div className="space-y-2.5">
                      {[
                        {
                          icon: "✦",
                          text: "Tap a slot above to switch between your generations",
                        },
                        {
                          icon: "✦",
                          text: "Double-tap the name text on the poster to edit it",
                        },
                        {
                          icon: "✦",
                          text: "Drag the portrait to reposition it on the poster",
                        },
                      ].map((tip, i) => (
                        <div key={i} className="flex gap-2 items-start">
                          <span className="text-[#c9a96e] text-[10px] mt-0.5 flex-shrink-0">
                            {tip.icon}
                          </span>
                          <p className="text-xs text-[#6a5a4a] leading-relaxed">
                            {tip.text}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div> */}

                  {/* Download CTA */}
                  <div className="px-5 py-4">
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
                      className="w-full bg-[#1a1209] hover:bg-[#2d2010] disabled:opacity-35 disabled:cursor-not-allowed text-[#f0e6d3] py-3.5 px-5 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2.5 shadow-lg"
                    >
                      <Download className="w-4 h-4" />
                      <span>
                        {isDownloading
                          ? "Preparing…"
                          : "Download Poster — $1.99"}
                      </span>
                    </button>

                    {/* Upload trigger — shown subtly below when no photo */}
                    {!hasPhoto && (
                      <button
                        onClick={triggerUpload}
                        disabled={isButtonDisabled}
                        className="w-full mt-2.5 border border-dashed border-[#c4b494] hover:border-[#a49474] bg-[#faf6ef] hover:bg-[#f5f0e4] text-[#7a6a5a] py-3 px-5 rounded-xl text-sm transition-all flex items-center justify-center gap-2 disabled:opacity-40"
                      >
                        <ImagePlus className="w-4 h-4" />
                        <span>
                          {isProcessing
                            ? "Generating…"
                            : cooldown > 0
                              ? `Wait ${cooldown}s`
                              : "Upload & Generate"}
                        </span>
                      </button>
                    )}

                    {hasPhoto && cooldown === 0 && attemptsLeft > 0 && (
                      <button
                        onClick={triggerUpload}
                        disabled={isButtonDisabled}
                        className="w-full mt-2.5 border border-[#d4c4a4] hover:border-[#b4a484] bg-transparent text-[#7a6a5a] py-2.5 px-5 rounded-xl text-xs transition-all flex items-center justify-center gap-2 disabled:opacity-40"
                      >
                        <ImagePlus className="w-3.5 h-3.5" />
                        <span>
                          {isProcessing
                            ? "Generating…"
                            : `Regenerate (${attemptsLeft} left)`}
                        </span>
                      </button>
                    )}

                    <p className="mt-3 text-[#9a8a74] text-[10px] text-center leading-relaxed">
                      {!hasPhoto
                        ? "Upload a photo to get started · 3 AI generations per day"
                        : "Full-res poster delivered after secure checkout"}
                    </p>
                  </div>
                </>
              )}

              {isEditingText && (
                <div className="flex-1 flex flex-col items-center justify-center gap-2 p-8 text-center">
                  <div className="w-10 h-10 rounded-full bg-[#e8d8b8] flex items-center justify-center mb-2">
                    <Type className="w-4 h-4 text-[#9a8a6a]" />
                  </div>
                  <p className="text-sm font-semibold text-[#1a1209]">
                    Editing name…
                  </p>
                  <p className="text-xs text-[#8a7a6a] leading-relaxed">
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

/*
1. Improve ui Font color and sizing (current layout looks good)
2. Show all the user generated images give option to user to view all with the today 3 images highlighted based on the generations attempts
3. Improve the guide section ui currently does not look good at all (seperate component cotrolled by props)
4. use shadcn ui components
5. decrease canvas size in mobile by 10%
6. pinch for sizing the image in mobile 
7. mobile ui 
*/