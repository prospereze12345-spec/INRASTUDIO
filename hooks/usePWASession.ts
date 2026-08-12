"use client";

import { useEffect, useRef } from "react";
import { trackPWAEvent } from "../lib/pwa/api";

const HEARTBEAT_MS = 5 * 60 * 1000; // every 5 min while tab/app is active

/**
 * Mount once near the root (inside PWAProvider). Sends a "session" event on
 * load and on a heartbeat while the page is visible. This is what backs
 * DAU, last_active_at, and "pwa users vs browser users" — is_pwa is derived
 * from display-mode at send time.
 */
export function usePWASession(userId?: string | number | null) {
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    trackPWAEvent("session", { userId, meta: { context: "load" } });

    function startHeartbeat() {
      if (intervalRef.current) return;
      intervalRef.current = setInterval(() => {
        if (document.visibilityState === "visible") {
          trackPWAEvent("session", { userId, meta: { context: "heartbeat" } });
        }
      }, HEARTBEAT_MS);
    }

    function stopHeartbeat() {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    function onVisibilityChange() {
      if (document.visibilityState === "visible") {
        trackPWAEvent("session", { userId, meta: { context: "foreground" } });
        startHeartbeat();
      } else {
        stopHeartbeat();
      }
    }

    startHeartbeat();
    document.addEventListener("visibilitychange", onVisibilityChange);
    return () => {
      stopHeartbeat();
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, [userId]);
}
