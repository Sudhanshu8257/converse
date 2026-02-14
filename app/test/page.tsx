"use client";
import { useRef, useState, useEffect } from "react";

export default function WantedPosterGenerator() {
  const canvasRef = useRef(null);
  const [name, setName] = useState("");
  const [bounty, setBounty] = useState("");
  const [userImage, setUserImage] = useState(null);
useEffect(() => {
    // Make sure the file is in public/fonts/SouvenirDemi.otf
    const font = new FontFace('WantedFont', 'url(/fonts/SouvenirDemi.otf)');
    
    font.load().then((loadedFont) => {
      document.fonts.add(loadedFont);
      console.log("Font loaded successfully!");
    }).catch(err => {
      console.error("Failed to load font:", err);
    });
  }, []);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => setUserImage(img);
        img.src = event.target.result;
      };
      reader.readAsDataURL(file);
    }
  };

  // Helper: Simulates "object-fit: cover" for Canvas
  // This prevents the face from being stretched!
  // NEW helper function with manual ZOOM control
  const drawImageProp = (
    ctx,
    img,
    x,
    y,
    w,
    h,
    offsetX = 0.5,
    offsetY = 0.5,
    scale = 1,
  ) => {
    // 1. Calculate the Aspect Ratios
    const iw = img.width;
    const ih = img.height;
    const r = Math.min(w / iw, h / ih);

    // 2. Calculate the "Cover" dimensions (base size)
    let nw = iw * r;
    let nh = ih * r;

    // Logic to ensure it COVERS the hole (standard behavior)
    let ar = 1;
    if (nw < w) ar = w / nw;
    if (Math.abs(ar - 1) < 1e-14 && nh < h) ar = h / nh;
    nw *= ar;
    nh *= ar;

    // 3. APPLY YOUR MANUAL SCALE (The Fix!)
    // If you want to zoom out, we actually need to make the source rectangle LARGER
    // (It's counter-intuitive: "seeing more" means "drawing less of the image relative to the hole")
    // Let's keep it simple: We just multiply the drawn width/height.

    // Actually, the easiest way to "Zoom Out" in this specific math
    // is to change the 'ar' logic or just draw it slightly smaller and center it.

    // ALTERNATIVE SIMPLER LOGIC FOR "CONTAIN" OR "FIT":
    // If you want the whole face to show, use this simpler logic instead of the complex one above:

    // Calculate ratio to FIT the image entirely (Contain)
    const scaleFactor = Math.max(w / iw, h / ih);
    // Change Math.max to Math.min if you want "Contain" (bars on side)
    // Change Math.max to Math.max if you want "Cover" (crop)

    const finalWidth = iw * scaleFactor * scale;
    const finalHeight = ih * scaleFactor * scale;

    const finalX = x + (w - finalWidth) * offsetX;
    const finalY = y + (h - finalHeight) * offsetY;

    ctx.drawImage(img, finalX, finalY, finalWidth, finalHeight);
  };
  const generatePoster = () => {
    if (!canvasRef.current || !userImage) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    // Load your Template (The one with the hole)
    const template = new Image();
    template.src = "/assets/placeholder2.png";

    template.onload = () => {
      // Set Canvas to match Template Size
      canvas.width = template.width;
      canvas.height = template.height;

      // --- LAYER 1: The User's Image (Bottom) ---
      // We draw this FIRST.
      // Using your coordinates: 115, 347, 974, 781
      ctx.save();

      // Optional: Add Sepia filter to user photo to match the poster style
      //   ctx.filter = 'sepia(0.4) contrast(1.1)';

      // Use our helper to fill the hole perfectly without stretching
      drawImageProp(ctx, userImage, 69, 212, 590, 469);

      ctx.restore(); // Remove filter for the next layers

      // --- LAYER 2: The Template (Middle) ---
      // Draw the template on top. The "hole" will show the user image we just drew.
      ctx.drawImage(template, 0, 0);
// --- LAYER 3: The Text (Top) ---
      
      // 1. CONFIGURATION
      const nameBoxCenterX = 353;
      const nameBoxCenterY = 848;
      const maxNameWidth = 466; 
      
      // HOW MUCH TO STRETCH?
      // 1.0 = Normal, 1.5 = 50% Taller, 2.0 = Double Height
      const stretchFactor = 2; 

      ctx.save(); // Save state before we mess with the coordinate system

      ctx.fillStyle = '#35271E'; 
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle'; 
      
      // START FONT SIZE
      // Since we are stretching height, we might want a slightly smaller base size
      // so it doesn't look too massive.
      let fontSize = 120; 
      ctx.font = `${fontSize}px "WantedFont"`; 

      // SHRINK LOGIC (remains the same)
      while (ctx.measureText(name.toUpperCase()).width > maxNameWidth && fontSize > 20) {
        fontSize -= 5;
        ctx.font = `${fontSize}px "WantedFont"`;
      }

      // --- THE STRETCHING MAGIC ---
      // We scale the Height (Y) by stretchFactor.
      // We scale Width (X) by 1 (no change).
      ctx.scale(1, stretchFactor);

      // IMPORTANT: When you scale the coordinate system, your Y-coordinates move too!
      // If Y was 800, and you scale by 2, Y becomes 1600 effectively.
      // So we must DIVIDE the drawing position by the stretch factor to keep it in place.
      ctx.fillText(name.toUpperCase(), nameBoxCenterX, nameBoxCenterY / stretchFactor);

      ctx.restore(); // Reset scale so other things (like Bounty) don't get stretched
      
      // 2. Draw BOUNTY (Standard - Not Stretched)
      // ctx.textBaseline = 'alphabetic'; 
      // ctx.font = '65px "WantedFont"'; 
      // ctx.fillText(`$${bounty} -`, 353, 1000);
    };
  };

  return (
    <div className="flex flex-col items-center p-5 gap-6">
      <div className="flex flex-col gap-4 bg-white p-6 rounded shadow-md">
        <input
          type="text"
          placeholder="Name (e.g. ZORO)"
          className="border p-2 rounded"
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Bounty (e.g. 1,000,000)"
          className="border p-2 rounded"
          onChange={(e) => setBounty(e.target.value)}
        />
        <input type="file" accept="image/*" onChange={handleImageUpload} />
        <button
          onClick={generatePoster}
          className="bg-blue-600 text-white p-3 rounded font-bold"
        >
          Generate
        </button>
      </div>

      <div className="border shadow-xl">
        {/* Scale the canvas down with CSS so it fits on screen, but keeps high resolution */}
        <canvas
          ref={canvasRef}
          style={{ maxWidth: "100%", height: "auto", maxHeight: "600px" }}
        />
      </div>

      <button
        onClick={() => {
          const link = document.createElement("a");
          link.download = `${name || "wanted"}.png`;
          link.href = canvasRef.current.toDataURL();
          link.click();
        }}
        className="bg-green-600 text-white px-6 py-2 rounded font-bold"
      >
        Download
      </button>
    </div>
  );
}
