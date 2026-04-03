import { Check, X } from "lucide-react";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";

// Note: Ensure GeneratedImage and formatDate are imported in your actual file.

function formatDate(iso: string): string {
  return new Date(iso).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

type GeneratedImage = {
  url: string;
  fileId: string;
  createdAt: string;
};


export function AllImagesDrawer({
  open,
  onClose,
  images,
  activeImageUrl,
  onSelect,
}: {
  open: boolean;
  onClose: () => void;
  images: GeneratedImage[];
  activeImageUrl: string | null;
  onSelect: (url: string) => void;
}) {
  return (
    <Drawer 
      open={open} 
      onOpenChange={(isOpen) => {
        if (!isOpen) onClose();
      }}
    >
      {/* We apply your custom dark gradient and restrict width on larger screens */}
      <DrawerContent className="bg-gradient-to-b from-[#0f0a04] to-[#0a0705] border-white/10 text-[#f0e6d3] sm:max-w-md mx-auto">
        <div className="w-full max-h-[80vh] flex flex-col">
          
          {/* Header */}
          <DrawerHeader className="flex flex-row items-center justify-between text-left pb-4 px-6 pt-6">
            <div>
              <DrawerTitle className="text-lg font-bold tracking-tight">
                All Generations
              </DrawerTitle>
              <DrawerDescription className="text-xs text-[#f0e6d3]/50 mt-0.5">
                {images.length} image{images.length !== 1 ? "s" : ""} generated
              </DrawerDescription>
            </div>
            
            <DrawerClose asChild>
              <button
                className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/15 border border-white/10 flex items-center justify-center transition-colors"
                aria-label="Close Drawer"
              >
                <X className="w-4 h-4 text-[#f0e6d3]/70" />
              </button>
            </DrawerClose>
          </DrawerHeader>

          {/* Grid Content */}
          <div className="overflow-y-auto px-6 pb-6">
            <div className="grid grid-cols-3 gap-3">
              {images.map((img, i) => {
                const isActive = img.url === activeImageUrl;
                return (
                  <button
                    key={img.fileId}
                    onClick={() => {
                      onSelect(img.url);
                      onClose(); // Automatically close drawer on selection
                    }}
                    className={`relative rounded-xl overflow-hidden transition-all active:scale-95 group
                      ${
                        isActive
                          ? "ring-2 ring-[#e63946] ring-offset-2 ring-offset-[#0f0a04] shadow-lg shadow-[#e63946]/20"
                          : "border border-white/10 hover:border-white/25"
                      }`}
                    style={{ aspectRatio: "1" }}
                  >
                    <img
                      src={img.url}
                      alt={`Generation ${i + 1}`}
                      className="w-full h-full object-cover"
                    />

                    {/* Overlay on hover */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-200 flex items-center justify-center">
                      {isActive ? (
                        <div className="w-7 h-7 rounded-full bg-[#e63946] flex items-center justify-center shadow-lg">
                          <Check className="w-4 h-4 text-white" />
                        </div>
                      ) : (
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity w-7 h-7 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center">
                          <Check className="w-4 h-4 text-white" />
                        </div>
                      )}
                    </div>

                    {/* Index badge */}
                    <div className="absolute top-1.5 left-1.5 w-5 h-5 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center">
                      <span className="text-[10px] text-white font-bold leading-none">
                        {i + 1}
                      </span>
                    </div>

                    {/* Timestamp */}
                    <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/70 to-transparent px-1.5 pb-1.5 pt-4 opacity-0 group-hover:opacity-100 transition-opacity">
                      <p className="text-[9px] text-white/80 font-medium text-right">
                        {formatDate(img.createdAt)}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
          
        </div>
      </DrawerContent>
    </Drawer>
  );
}