import { getDeviceInfo } from "./device";
import { getDeviceId } from "./deviceId";

const API_BASE = process.env.NEXT_PUBLIC_DJANGO_API_URL || "https://api.inrastudio.com";

type PWAEventType =
  | "prompt_shown"
  | "prompt_accepted"
  | "prompt_dismissed"
  | "install" // fired on appinstalled / iOS heuristic confirmation
  | "session" // heartbeat, used for DAU + last_active + uninstall-signal-loss
  | "ios_instructions_shown";

interface TrackPayload {
  event: PWAEventType;
  device_id: string;
  os: string;
  browser: string;
  device_type: string;
  is_pwa: boolean; // running standalone right now
  user_id?: string | number | null;
  meta?: Record<string, unknown>;
}

async function post(path: string, body: unknown) {
  try {
    await fetch(`${API_BASE}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include", // send session/auth cookies so backend can attach user_id
      body: JSON.stringify(body),
      keepalive: true, // survives page unload, important for install/session pings
    });
  } catch {
    // Analytics must never break the app — swallow network errors.
  }
}

export function trackPWAEvent(
  event: PWAEventType,
  opts: { userId?: string | number | null; meta?: Record<string, unknown> } = {}
) {
  const info = getDeviceInfo();
  const payload: TrackPayload = {
    event,
    device_id: getDeviceId(),
    os: info.os,
    browser: info.browser,
    device_type: info.deviceType,
    is_pwa: info.isStandalone,
    user_id: opts.userId ?? null,
    meta: opts.meta,
  };
  return post("/api/pwa/track/", payload);
}

export function fetchPWAAnalytics(params: { from?: string; to?: string } = {}) {
  const qs = new URLSearchParams(params as Record<string, string>).toString();
  return fetch(`${API_BASE}/api/pwa/analytics/${qs ? `?${qs}` : ""}`, {
    credentials: "include",
  }).then((r) => {
    if (!r.ok) throw new Error(`Analytics fetch failed: ${r.status}`);
    return r.json();
  });
}
