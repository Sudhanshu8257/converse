// app/actions.ts
"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const API_URL = "http://localhost:4000";
const SESSION_COOKIE = "poster_session_id";

export async function uploadToAnimeApi(formData: FormData) {
  try {
    const response = await fetch(API_URL + "/api/v1/poster/generate-anime", {
      method: "POST",
      body: formData,
      // Note: Do not set Content-Type header manually when using FormData;
      // fetch sets it automatically with the boundary.
    });

    if (!response.ok) {
      throw new Error(`Upload failed: ${response.statusText}`);
    }

    const data = await response.json();
    console.log(data);
    // Assuming the API returns { imageUrl: "..." }
    return { success: true, imageUrl: `${data.imageUrl}` };
  } catch (error) {
    console.error("API Error:", error);
    return { success: false, error: "Failed to process image" };
  }
}

export const startPosterSession = async () => {
  console.log("called");
  const cookieStore = await cookies();

  // Read existing sessionId from cookie
  const existingSessionId = cookieStore.get(SESSION_COOKIE)?.value ?? null;

  // Call backend — passes existing sessionId or null
  const res = await fetch(`${API_URL}/api/v1/poster/new`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ sessionId: existingSessionId }),
  });

  if (!res.ok) {
    throw new Error("Failed to start session");
  }

  const data = await res.json();
  const sessionId = data.sessionId;

  // Store/update sessionId in cookie (7 days)
  cookieStore.set(SESSION_COOKIE, sessionId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: "/",
  });

  // Redirect to editor
  redirect(`/poster/${sessionId}`);
};

export const saveSession = async ({
  posterBase64,
  posterName,
}: {
  posterBase64: string;
  posterName: string;
}) => {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get(SESSION_COOKIE)?.value;

  if (!sessionId) {
    return { success: false, error: "No active session. Please start over." };
  }

  try {
    const res = await fetch(`${API_URL}/api/v1/poster/save`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId, posterBase64, posterName }),
    });

    const data = await res.json();

    if (!res.ok) {
      return {
        success: false,
        error: data.message || "Failed to save session",
      };
    }

    if (!data.checkoutUrl) {
      return { success: false, error: "No checkout URL returned" };
    }

    return { success: true, checkoutUrl: data.checkoutUrl };
  } catch (error) {
    console.error("saveSession error:", error);
    return { success: false, error: "Something went wrong. Please try again." };
  }
};

export const getDownloadSession = async (sessionId: string) => {
  try {
    const res = await fetch(`${API_URL}/api/v1/poster/download/${sessionId}`, {
      cache: "no-store",
      next: { revalidate: 0 }
    });

    const data = await res.json();

    if (!res.ok) {
      return { success: false, error: data.message || "Session not found" };
    }

    return {
      success: true,
      status: data.status,
      posterUrl: data.posterUrl,
      posterName: data.posterName,
    };
  } catch (error) {
    console.error("getSession error:", error);
    return { success: false, error: "Failed to fetch session status" };
  }
};

export const getSession = async (sessionId: string) => {
  try {
    const res = await fetch(`${API_URL}/api/v1/poster/download/${sessionId}`, {
      // No cache — always fetch fresh on each poll
      cache: "no-store",
    });

    const data = await res.json();

    if (!res.ok) {
      return { success: false, error: data.message || "Session not found" };
    }

    return {
      success: true,
      data,
    };
  } catch (error) {
    console.error("getSession error:", error);
    return { success: false, error: "Failed to fetch Session State" };
  }
};

export const getSessionState = async (sessionId: string) => {
  try {
    const res = await fetch(`${API_URL}/api/v1/poster/session/${sessionId}`, {
      // No cache — always fetch fresh on each poll
      cache: "no-store",
    });

    const data = await res.json();

    if (!res.ok) {
      return { success: false, error: data.message || "Session not found" };
    }

    return {
      success: true,
      data,
    };
  } catch (error) {
    console.error("getSession error:", error);
    return { success: false, error: "Failed to fetch Session State" };
  }
};