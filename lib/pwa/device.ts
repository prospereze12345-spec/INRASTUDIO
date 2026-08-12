// Lightweight, dependency-free UA/platform detection.
// Good enough for analytics buckets — not meant for feature-sniffing.

export type OSName = "iOS" | "iPadOS" | "Android" | "Windows" | "macOS" | "Linux" | "ChromeOS" | "Unknown";
export type BrowserName = "Chrome" | "Safari" | "Edge" | "Firefox" | "Samsung Internet" | "Opera" | "Unknown";
export type DeviceType = "mobile" | "tablet" | "desktop";

export interface DeviceInfo {
  os: OSName;
  browser: BrowserName;
  deviceType: DeviceType;
  isStandalone: boolean; // running as installed PWA right now
  canInstallNative: boolean; // Chromium beforeinstallprompt path
  isIOS: boolean;
  isSafari: boolean;
}

function safeUA(): string {
  if (typeof navigator === "undefined") return "";
  return navigator.userAgent || "";
}

export function detectOS(): OSName {
  const ua = safeUA();
  const platform = typeof navigator !== "undefined" ? navigator.platform || "" : "";

  // iPadOS 13+ reports as "MacIntel" but has touch support — disambiguate.
  const isIPadOS =
    /iPad/.test(ua) || (platform === "MacIntel" && typeof navigator !== "undefined" && navigator.maxTouchPoints > 1);

  if (/iPhone|iPod/.test(ua)) return "iOS";
  if (isIPadOS) return "iPadOS";
  if (/Android/.test(ua)) return "Android";
  if (/CrOS/.test(ua)) return "ChromeOS";
  if (/Windows/.test(ua)) return "Windows";
  if (/Mac OS X|Macintosh/.test(ua)) return "macOS";
  if (/Linux/.test(ua)) return "Linux";
  return "Unknown";
}

export function detectBrowser(): BrowserName {
  const ua = safeUA();
  if (/EdgA|Edg\//.test(ua)) return "Edge";
  if (/SamsungBrowser/.test(ua)) return "Samsung Internet";
  if (/OPR\/|Opera/.test(ua)) return "Opera";
  if (/Firefox|FxiOS/.test(ua)) return "Firefox";
  if (/CriOS|Chrome/.test(ua)) return "Chrome";
  if (/Safari/.test(ua)) return "Safari";
  return "Unknown";
}

export function detectDeviceType(): DeviceType {
  const os = detectOS();
  const ua = safeUA();
  if (os === "iPadOS" || /Tablet|PlayBook/.test(ua)) return "tablet";
  if (os === "iOS" || os === "Android" && /Mobile/.test(ua)) return "mobile";
  if (os === "Android") return /Mobile/.test(ua) ? "mobile" : "tablet";
  return "desktop";
}

export function isStandaloneDisplayMode(): boolean {
  if (typeof window === "undefined") return false;
  const mq = window.matchMedia?.("(display-mode: standalone)")?.matches;
  // iOS Safari-specific flag when launched from Home Screen
  const iosStandalone = (window.navigator as any).standalone === true;
  return Boolean(mq || iosStandalone);
}

export function getDeviceInfo(): DeviceInfo {
  const os = detectOS();
  const browser = detectBrowser();
  const isIOS = os === "iOS" || os === "iPadOS";
  const isSafari = browser === "Safari";
  return {
    os,
    browser,
    deviceType: detectDeviceType(),
    isStandalone: isStandaloneDisplayMode(),
    canInstallNative: !isIOS && (browser === "Chrome" || browser === "Edge" || browser === "Samsung Internet"),
    isIOS,
    isSafari,
  };
}
