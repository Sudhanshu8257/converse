import { getSession, getSessionState } from "@/actions/posterAction";
import PosterEditor from "@/components/poster/PosterEditor";
import { redirect } from "next/navigation";
import React from "react";

const page = async ({ params }: { params: { sessionId: string } }) => {
  const sessionId = params.sessionId;
  if (!sessionId) redirect("/one-piece-poster");

  const sessionData: any = await getSessionState(sessionId);
  if (sessionData && sessionData.data.status === "paid") {
    redirect(`/poster/success/${sessionId}`);
  }
  if (!sessionData || sessionData.data.status !== "active") {
    redirect("/one-piece-poster");
  }
  return (
    <div>
      <PosterEditor sessionId={sessionId} sessionData={sessionData.data} />
    </div>
  );
};

export default page;
