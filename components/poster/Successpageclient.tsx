"use client";

import { useEffect } from "react";
import { Download } from "lucide-react";
import Link from "next/link";
import { trackEvent } from "@/lib/analytics";

export function SuccessTracker({
  posterName,
  amount,
  transactionId,
}: {
  posterName: string;
  amount: number;
  transactionId: string;
}) {
  useEffect(() => {
    trackEvent("purchase", {
      transaction_id: transactionId, 
      value: amount, 
      currency: "USD",
      items: [
        {
          item_id: "one_piece_poster",
          item_name: posterName,
          price: amount,
          quantity: 1,
        },
      ],
    });
  }, [posterName, amount, transactionId]);

  return null;
}

export function DownloadButton({
  posterUrl,
  posterName,
}: {
  posterUrl: string;
  posterName: string;
}) {
  return (
    <a
      href={posterUrl}
      download={`${posterName}_Wanted_Poster.png`}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() =>
        trackEvent("poster_download_clicked", {
          poster_name: posterName,
          content_type: "image",
        })
      }
      className="bg-red-600 hover:bg-red-700 text-white py-4 px-8 rounded-md font-bold flex items-center justify-center gap-3 shadow-[0_4px_0_0_rgba(0,0,0,1)] active:shadow-none active:translate-y-[2px] transition-all"
    >
      <Download className="w-5 h-5" />
      DOWNLOAD POSTER
    </a>
  );
}

export function CreateNewLink() {
  return (
    <Link
      href="/one-piece-poster"
      onClick={() =>
        trackEvent("create_new_poster_clicked", { location: "success_page" })
      }
      className="text-gray-500 hover:text-black text-xs uppercase tracking-widest font-bold transition-colors"
    >
      Create New Poster
    </Link>
  );
}
