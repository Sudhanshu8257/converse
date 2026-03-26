"use client";

import { useEffect, useRef, useState, ChangeEvent } from "react";
import { Download, Loader2, ImagePlus, Pencil, Lock } from "lucide-react";
import { saveSession, uploadToAnimeApi } from "@/actions/posterAction";
import { toast } from "sonner";

// --- CONSTANTS ---
const POSTER_WIDTH = 724;
const POSTER_HEIGHT = 1080;
const PHOTO_X = 367;
const PHOTO_Y = 446;
const COOLDOWN_TIME = 60;
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export default function PosterEditor({
  sessionId,
  sessionData,
}: {
  sessionId: string;
  sessionData: string;
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

  // --- TIMER LOGIC ---
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (cooldown > 0) {
      timer = setInterval(() => setCooldown((prev) => prev - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [cooldown]);

  // --- PREVENT SCROLL & RIGHT CLICK ---
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

  // --- INITIALIZATION ---
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
        FabricObject.prototype.cornerColor = "#ff0000";
        FabricObject.prototype.borderColor = "#ff0000";
        FabricObject.prototype.cornerStrokeColor = "#ffffff";
        FabricObject.prototype.cornerStyle = "circle";
        FabricObject.prototype.cornerSize = 12;

        const fontName = "WantedPrint";
        const printFont = new FontFace(fontName, "url(/fonts/Aldine.otf)");
        try {
          await printFont.load();
          document.fonts.add(printFont);
        } catch (e) {
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

        // Upload placeholder button
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

        const btnText = new IText("Click to Upload", {
          fontFamily: "Arial",
          fontSize: 32,
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

        // Poster template
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

        // Name text
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
          cornerColor: "#ff0000",
          borderColor: "#ff0000",
          name: "poster_name",
        } as any);
        canvas.add(nameText);

        // Watermarks
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

  const handleImageUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    if (!fabricRef.current || !e.target.files?.[0]) return;
    if (cooldown > 0) {
      alert(`Please wait ${cooldown} seconds before replacing.`);
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
    //   setIsProcessing(false);
    //   alert("Failed to process image. Please try again.");
    //   return;
    // }

    const { FabricImage } = await import("fabric");
    const imgElement = new Image();
    imgElement.crossOrigin = "anonymous";
    // imgElement.src = result.imageUrl;
    imgElement.src =
      "https://ik.imagekit.io/r8pra5q2fr/anime-generated/Generated%20Image%20March%2010,%202026%20-%208_50PM.png";

    imgElement.onload = async () => {
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
        cornerColor: "#ff0000",
        borderColor: "#ff0000",
        name: "user_photo",
      } as any);

      fabricRef.current.add(img);
      fabricRef.current.sendObjectToBack(img);
      fabricRef.current.setActiveObject(img);
      fabricRef.current.requestRenderAll();

      setHasPhoto(true);
      setIsProcessing(false);
      setCooldown(COOLDOWN_TIME);
    };

    imgElement.onerror = () => {
      setIsProcessing(false);
      alert("Error loading the generated image.");
    };
  };

  const download = async () => {
    if (!fabricRef.current || !hasPhoto) return;

    setIsDownloading(true);
    const toastId = toast.loading("Preparing your high-res poster...");

    try {
      const canvas = fabricRef.current;

      // 1. Prepare Canvas (Hide UI elements)
      canvas.discardActiveObject();
      const objects = canvas.getObjects();
      const watermarks = objects.filter((o: any) => o.name === "watermark");
      watermarks.forEach((w: any) => w.set("visible", false));
      canvas.requestRenderAll();

      // 2. Export Image
      const base64 = canvas.toDataURL({
        format: "png",
        multiplier: 1.5,
        quality: 1,
      });

      // 3. Restore UI
      watermarks.forEach((w: any) => w.set("visible", true));
      canvas.requestRenderAll();

      // 4. Extract Name
      const nameTextObj = objects.find((o: any) => o.name === "poster_name");
      const posterName = nameTextObj?.text?.trim() || "WANTED";

      // 5. Call the Server Action
      // No need for manual fetch or base64 stripping if your action handles it
      const result = await saveSession({
        posterBase64: base64, // Sending the full string is usually fine for Server Actions
        posterName,
      });

      if (result.success && result.checkoutUrl) {
        toast.success("Redirecting to secure checkout...", { id: toastId });
        // Small delay so they can see the success message
        setTimeout(() => {
          window.location.href = result.checkoutUrl;
        }, 800);
      } else {
        throw new Error(result.error || "Failed to create checkout session");
      }
    } catch (err: any) {
      console.error("Download Error:", err);
      toast.error(err.message || "Something went wrong. Please try again.", {
        id: toastId,
      });
      setIsDownloading(false);
    }
  };

  const triggerUpload = () => {
    if (cooldown > 0) return;
    fileInputRef.current?.click();
  };

  const isButtonDisabled = isLoading || isProcessing || isDownloading;

  return (
    <div className="fixed inset-0 w-full h-full bg-[#E0CFBA] font-sans overflow-hidden">
      <div
        className={`w-full h-full overflow-y-auto flex flex-col items-center p-4 transition-all duration-300 ${
          isEditingText ? "justify-start pt-4" : "justify-center"
        }`}
      >
        {!isEditingText && (
          <h1 className="text-3xl font-extrabold mb-6 text-gray-800 tracking-tight shrink-0">
            WANTED MAKER
          </h1>
        )}

        <div
          ref={containerRef}
          className="relative w-full max-w-[340px] bg-white shadow-2xl rounded-sm border border-gray-200 shrink-0 overflow-hidden"
          style={{ height: "500px" }}
        >
          {isLoading && (
            <div className="absolute inset-0 z-20 bg-gray-50 flex flex-col items-center justify-center gap-3">
              <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
              <p className="text-gray-500 font-medium text-xs">
                Loading Editor...
              </p>
            </div>
          )}

          {isProcessing && (
            <div className="absolute inset-0 z-50 flex flex-col items-center justify-center animate-in fade-in duration-300">
              <div className="absolute inset-0 bg-white/20 backdrop-blur-md" />
              <div className="relative z-10 flex flex-col items-center gap-4 text-black p-6">
                <Loader2 className="w-12 h-12 animate-spin text-black/90" />
                <div className="text-center">
                  <p className="text-lg font-bold tracking-wide">
                    Generating Anime Art
                  </p>
                  <p className="text-sm text-black/70">
                    Applying wanted poster filters...
                  </p>
                </div>
              </div>
            </div>
          )}

          {isDownloading && (
            <div className="absolute inset-0 z-50 flex flex-col items-center justify-center animate-in fade-in duration-300">
              <div className="absolute inset-0 bg-white/20 backdrop-blur-md" />
              <div className="relative z-10 flex flex-col items-center gap-4 text-black p-6">
                <Loader2 className="w-12 h-12 animate-spin text-black/90" />
                <div className="text-center">
                  <p className="text-lg font-bold tracking-wide">
                    Preparing your poster...
                  </p>
                  <p className="text-sm text-black/70">
                    Redirecting to checkout
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="w-full h-full overflow-hidden">
            <canvas ref={canvasEl} className="block" />
          </div>

          {hasPhoto &&
            !isLoading &&
            !isEditingText &&
            !isProcessing &&
            !isDownloading && (
              <button
                onClick={triggerUpload}
                disabled={cooldown > 0}
                className={`absolute z-30 top-[58%] right-[12%] p-2.5 rounded-full shadow-md border border-gray-200 transition-all
                ${
                  cooldown > 0
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : "bg-white text-gray-700 hover:bg-gray-50 active:scale-95"
                }`}
                title={cooldown > 0 ? `Wait ${cooldown}s` : "Replace Photo"}
              >
                {cooldown > 0 ? (
                  <span className="font-bold text-xs w-5 h-5 flex items-center justify-center">
                    {cooldown}
                  </span>
                ) : (
                  <Pencil className="w-5 h-5" />
                )}
              </button>
            )}
        </div>

        {!isEditingText && (
          <>
            <div className="flex gap-3 mt-6 w-full max-w-[340px] justify-center shrink-0">
              <input
                ref={fileInputRef}
                type="file"
                onChange={handleImageUpload}
                className="hidden"
                accept="image/*"
                disabled={isButtonDisabled || cooldown > 0}
              />

              <button
                onClick={triggerUpload}
                disabled={cooldown > 0 || isButtonDisabled}
                className={`flex-1 border py-3 px-4 rounded-lg font-semibold shadow-sm text-sm transition-all flex items-center justify-center gap-2
                  ${
                    cooldown > 0
                      ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
                      : "bg-white hover:bg-gray-50 text-gray-700 border-gray-300"
                  }`}
              >
                {cooldown > 0 ? (
                  <Lock className="w-4 h-4" />
                ) : (
                  <ImagePlus className="w-4 h-4" />
                )}
                <span>
                  {isProcessing
                    ? "Processing..."
                    : hasPhoto
                      ? cooldown > 0
                        ? `Wait ${cooldown}s`
                        : "Replace"
                      : "Upload"}
                </span>
              </button>

              <button
                onClick={download}
                disabled={isButtonDisabled || !hasPhoto}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 px-4 rounded-lg font-semibold shadow-md text-sm transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Download className="w-4 h-4" />
                <span>{isDownloading ? "Preparing..." : "Download $1.99"}</span>
              </button>
            </div>

            <p className="mt-4 text-gray-400 text-xs text-center font-medium max-w-[300px] shrink-0 pb-10">
              {cooldown > 0
                ? `You can upload a new photo in ${cooldown} seconds.`
                : "Tap pencil to replace. Double tap text to edit."}
            </p>
          </>
        )}
      </div>
    </div>
  );
}
