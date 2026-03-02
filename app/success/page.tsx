
"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Loader2, Download, CheckCircle } from "lucide-react";

export default function SuccessPage() {
  const params = useSearchParams();
  const sessionId = params.get("session");
  const [posterUrl, setPosterUrl] = useState<string | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");

  useEffect(() => {
    if (!sessionId) return;

    // Poll backend until posterUrl is ready
    const interval = setInterval(async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/poster/session/${sessionId}`
        );
        const data = await res.json();

        if (data.status === "paid" && data.posterUrl) {
          setPosterUrl(data.posterUrl);
          setStatus("ready");
          clearInterval(interval);
        }
      } catch {
        setStatus("error");
        clearInterval(interval);
      }
    }, 2000); // poll every 2 seconds

    // Stop polling after 30 seconds
    const timeout = setTimeout(() => {
      clearInterval(interval);
      if (status === "loading") setStatus("error");
    }, 30000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [sessionId]);

  return (
    <div className="fixed inset-0 bg-[#E0CFBA] flex flex-col items-center justify-center p-6 text-center">
      {status === "loading" && (
        <>
          <Loader2 className="w-12 h-12 animate-spin text-gray-700 mb-4" />
          <h1 className="text-2xl font-bold text-gray-800">Generating your poster...</h1>
          <p className="text-gray-500 mt-2 text-sm">This takes just a few seconds</p>
        </>
      )}

      {status === "ready" && posterUrl && (
        <>
          <CheckCircle className="w-12 h-12 text-green-600 mb-4" />
          <h1 className="text-2xl font-bold text-gray-800 mb-1">Your poster is ready!</h1>
          <p className="text-gray-500 text-sm mb-6">A copy has also been sent to your email.</p>
          <a
            href={posterUrl}
            download="wanted-poster.png"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-red-600 hover:bg-red-700 text-white py-3 px-8 rounded-lg font-semibold flex items-center gap-2 transition-all"
          >
            <Download className="w-5 h-5" />
            Download Poster
          </a>
        </>
      )}

      {status === "error" && (
        <>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Something went wrong</h1>
          <p className="text-gray-500 text-sm mb-4">
            Dont worry — check your email for the download link, or contact support.
          </p>
        </>
      )}
    </div>
  );
}