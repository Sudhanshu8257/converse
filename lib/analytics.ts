import { logEvent } from "firebase/analytics";
import { analytics } from "./firebase";

/**
 * Custom wrapper for Firebase logEvent
 * @param eventName - The name of the event (e.g., 'purchase', 'join_group')
 * @param params - Optional object with extra data
 */
export const trackEvent = (eventName: string, params?: Record<string, any>) => {
  if (typeof window !== "undefined" && analytics) {
    logEvent(analytics, eventName, params);
  }
};