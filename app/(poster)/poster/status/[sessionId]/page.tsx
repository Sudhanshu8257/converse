import { getDownloadSession } from "@/actions/posterAction";
import {
  SuccessTracker,
  DownloadButton,
  CreateNewLink,
} from "@/components/poster/Successpageclient";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import Link from "next/link";

export default async function SuccessPage({
  params,
}: {
  params: { sessionId: string };
}) {
  const { sessionId } = params;
  const result = await getDownloadSession(sessionId);

  if (!result.success) {
    return (
      <div className="fixed inset-0 bg-[#E0CFBA] flex flex-col items-center justify-center p-6 text-center">
        <XCircle className="w-12 h-12 text-red-600 mb-4" />
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Session Error</h1>
        <p className="text-gray-500 text-sm mb-6 max-w-xs">
          {result.error || "We couldn't retrieve your poster data."}
        </p>
        <Link
          href="/"
          className="px-6 py-2 bg-black text-white rounded-full text-sm"
        >
          Try Again
        </Link>
      </div>
    );
  }

  if (result.status !== "paid") {
    return (
      <div className="fixed inset-0 bg-[#E0CFBA] flex flex-col items-center justify-center p-6 text-center">
        {/* Standard HTML refresh to poll the server every 3 seconds */}
        <meta httpEquiv="refresh" content="3" />

        <Loader2 className="w-12 h-12 animate-spin text-gray-700 mb-4" />
        <h1 className="text-2xl font-bold text-gray-800">
          Finalizing Your Bounty...
        </h1>
        <p className="text-gray-500 mt-2 text-sm max-w-xs">
          We&apos;re confirming your payment with the Navy. This page will
          update automatically.
        </p>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-[#E0CFBA] flex flex-col items-center justify-center p-6 text-center">
      <SuccessTracker  posterName={result.posterName} amount={1.99} 
  transactionId={result.lemonSqueezyId} />

      <div className="mb-6 relative">
        <CheckCircle className="w-16 h-16 text-green-600 mx-auto" />
        <div className="absolute top-0 left-0 w-full h-full animate-ping rounded-full bg-green-100 -z-10"></div>
      </div>

      <h1 className="text-3xl font-black text-gray-900 mb-1 uppercase tracking-tight">
        Bounty Confirmed!
      </h1>
      <p className="text-gray-600 text-sm mb-8 font-medium">
        {result.posterName}, your high-definition wanted poster is ready.
      </p>

      <div className="flex flex-col gap-4 w-full max-w-xs">
        <DownloadButton
          posterUrl={result.posterUrl}
          posterName={result.posterName}
        />
        <CreateNewLink />
      </div>
    </div>
  );
}
