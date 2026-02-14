"use client";

import { useEffect, useRef, useState, ChangeEvent } from "react";
import { Download, Loader2, ImagePlus, Pencil } from "lucide-react";

// --- CONSTANTS ---
const POSTER_WIDTH = 724;
const POSTER_HEIGHT = 1080;
const PHOTO_X = 367;
const PHOTO_Y = 446;

export default function PosterEditor() {
  const canvasEl = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const fabricRef = useRef<any>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [hasPhoto, setHasPhoto] = useState(false);
  const [isEditingText, setIsEditingText] = useState(false); // New State to track keyboard

  // --- 1. PREVENT SCROLL & RIGHT CLICK ---
  useEffect(() => {
    // Lock body scroll prevents the "extra space" issue
    document.body.style.overflow = "hidden";
    document.body.style.position = "fixed";
    document.body.style.width = "100%";
    document.body.style.height = "100%";

    const handleContextMenu = (e: MouseEvent) => e.preventDefault();
    document.addEventListener("contextmenu", handleContextMenu);

    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
      // cleanup
      document.body.style.overflow = "";
      document.body.style.position = "";
      document.body.style.width = "";
      document.body.style.height = "";
    };
  }, []);

  // --- 2. INITIALIZATION ---
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

        // --- CUSTOMIZE CONTROLS ---
        FabricObject.prototype.transparentCorners = false;
        FabricObject.prototype.cornerColor = "#ff0000";
        FabricObject.prototype.borderColor = "#ff0000";
        FabricObject.prototype.cornerStrokeColor = "#ffffff";
        FabricObject.prototype.cornerStyle = "circle";
        FabricObject.prototype.cornerSize = 12;

        const fontName = "WantedPrint";
        const fontUrl = "url(/fonts/Aldine.otf)";
        const printFont = new FontFace(fontName, fontUrl);
        try {
          await printFont.load();
          document.fonts.add(printFont);
        } catch (e) {
          console.warn("Font fallback.");
        }

        // --- BUILD CANVAS ---
        const canvas = new Canvas(canvasEl.current, {
          width: POSTER_WIDTH,
          height: POSTER_HEIGHT,
          backgroundColor: "#ffffff",
          preserveObjectStacking: true,
          selection: false,
        });
        fabricRef.current = canvas;

        // --- EVENT LISTENERS FOR KEYBOARD ---
        // When user double clicks text, we know keyboard is coming
        canvas.on("text:editing:entered", () => {
          setIsEditingText(true);
          // Scroll to top to ensure visibility
          window.scrollTo(0, 0);
        });

        canvas.on("text:editing:exited", () => {
          setIsEditingText(false);
          window.scrollTo(0, 0);
        });

        // --- A. ADD "CLICK TO UPLOAD" BUTTON ---
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
        });

        uploadGroup.set("name", "upload_trigger");
        uploadGroup.on("mousedown", () => fileInputRef.current?.click());
        canvas.add(uploadGroup);

        // --- B. ADD TEMPLATE ---
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

        // --- C. ADD TEXT ---
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
        });

        canvas.add(nameText);
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

    const { FabricImage } = await import("fabric");
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = async (event) => {
      if (!event.target?.result) return;
      const imgUrl = event.target.result.toString();

      const objects = fabricRef.current.getObjects();
      const oldPhoto = objects.find((o: any) => o.name === "user_photo");
      const uploadBtn = objects.find((o: any) => o.name === "upload_trigger");

      if (oldPhoto) fabricRef.current.remove(oldPhoto);
      if (uploadBtn) fabricRef.current.remove(uploadBtn);

      const img = await FabricImage.fromURL(imgUrl);

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
      });

      img.set("name", "user_photo");

      fabricRef.current.add(img);
      fabricRef.current.sendObjectToBack(img);
      fabricRef.current.setActiveObject(img);

      fabricRef.current.requestRenderAll();
      setHasPhoto(true);
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const download = () => {
    if (!fabricRef.current) return;
    fabricRef.current.discardActiveObject();
    fabricRef.current.requestRenderAll();

    const link = document.createElement("a");
    link.download = "wanted-poster.png";
    link.href = fabricRef.current.toDataURL({
      format: "png",
      multiplier: 1,
      quality: 1,
    });
    link.click();
  };

  return (
    // MAIN WRAPPER: Fixed and Hidden Overflow
    <div className="fixed inset-0 w-full h-full bg-gray-50 font-sans overflow-hidden">
      {/* SCROLLABLE INNER: 
        This is where the magic happens.
        If isEditingText is TRUE (Keyboard open), we switch to 'justify-start' (Top alignment).
        If FALSE (Normal), we use 'justify-center' (Center alignment).
      */}
      <div
        className={`w-full h-full overflow-y-auto flex flex-col items-center p-4 transition-all duration-300 ${isEditingText ? "justify-start pt-4" : "justify-center"}`}
      >
        {/* H1 - Hidden when typing to save space on small screens */}
        {!isEditingText && (
          <h1 className="text-3xl font-extrabold mb-6 text-gray-800 tracking-tight shrink-0">
            WANTED MAKER
          </h1>
        )}

        {/* EDITOR */}
        <div
          ref={containerRef}
          className="relative w-full max-w-[340px] bg-white shadow-2xl rounded-sm border border-gray-200 shrink-0"
          // Start height (will be auto-scaled)
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

          <div className="w-full h-full overflow-hidden">
            <canvas ref={canvasEl} className="block" />
          </div>

          {hasPhoto && !isLoading && !isEditingText && (
            <button
              onClick={() => fileInputRef.current?.click()}
              className="absolute z-30 top-[58%] right-[12%] bg-white text-gray-700 p-2.5 rounded-full shadow-md border border-gray-200 hover:bg-gray-50 active:scale-95"
              title="Replace Photo"
            >
              <Pencil className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* CONTROLS - Hidden when typing to give maximum space to keyboard */}
        {!isEditingText && (
          <>
            <div className="flex gap-3 mt-6 w-full max-w-[340px] justify-center shrink-0">
              <input
                ref={fileInputRef}
                type="file"
                onChange={handleImageUpload}
                className="hidden"
                accept="image/*"
                disabled={isLoading}
              />

              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex-1 bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 py-3 px-4 rounded-lg font-semibold shadow-sm text-sm transition-all flex items-center justify-center gap-2"
              >
                <ImagePlus className="w-4 h-4" />
                <span>{hasPhoto ? "Change" : "Upload"}</span>
              </button>

              <button
                onClick={download}
                disabled={isLoading}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 px-4 rounded-lg font-semibold shadow-md text-sm transition-all flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" />
                <span>Download</span>
              </button>
            </div>

            <p className="mt-4 text-gray-400 text-xs text-center font-medium max-w-[300px] shrink-0 pb-10">
              Tap pencil to replace. Double tap text to edit.
            </p>
          </>
        )}
      </div>
    </div>
  );
}

/*
TODO
Retry button for user image with 60s delay
scaling box color changes for text 
edit and retry btn ui changes

api addition 

*/