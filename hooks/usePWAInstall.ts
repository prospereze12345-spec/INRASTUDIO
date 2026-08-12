"use client";

import { useCallback, useEffect, useState } from "react";
import { getDeviceInfo, type DeviceInfo } from "../lib/pwa/device";
import { trackPWAEvent } from "../lib/pwa/api";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
}

export type InstallUIState =
  | "checking"
  | "already-installed"
  | "native-available" // Chromium: show real "Install" button
  | "ios-manual" // Safari iOS/iPadOS: show Share -> Add to Home Screen instructions
  | "macos-safari-manual" // macOS Safari: has its own Add to Dock flow
  | "unsupported"; // old browsers etc.

export function usePWAInstall(userId?: string | number | null) {
  const [device, setDevice] = useState<DeviceInfo | null>(null);
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [uiState, setUiState] = useState<InstallUIState>("checking");

  useEffect(() => {
    const info = getDeviceInfo();
    setDevice(info);

    if (info.isStandalone) {
      setUiState("already-installed");
      // Confirms an install is still active every time the installed app is opened.
      trackPWAEvent("session", { userId, meta: { context: "app_open" } });
      return;
    }

    if (info.isIOS && info.isSafari) {
      setUiState("ios-manual");
      return;
    }

    if (info.os === "macOS" && info.isSafari) {
      setUiState("macos-safari-manual");
      return;
    }

    if (!info.canInstallNative) {
      setUiState("unsupported");
    }
    // else: wait for beforeinstallprompt below to flip to "native-available"
  }, [userId]);

  useEffect(() => {
    function onBeforeInstallPrompt(e: Event) {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setUiState("native-available");
      trackPWAEvent("prompt_shown", { userId });
    }

    function onAppInstalled() {
      setUiState("already-installed");
      setDeferredPrompt(null);
      trackPWAEvent("install", { userId, meta: { method: "native_prompt" } });
    }

    window.addEventListener("beforeinstallprompt", onBeforeInstallPrompt);
    window.addEventListener("appinstalled", onAppInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", onBeforeInstallPrompt);
      window.removeEventListener("appinstalled", onAppInstalled);
    };
  }, [userId]);

  const promptInstall = useCallback(async () => {
    if (!deferredPrompt) return null;
    await deferredPrompt.prompt();
    const choice = await deferredPrompt.userChoice;
    trackPWAEvent(choice.outcome === "accepted" ? "prompt_accepted" : "prompt_dismissed", {
      userId,
      meta: { platform: choice.platform },
    });
    setDeferredPrompt(null);
    return choice.outcome;
  }, [deferredPrompt, userId]);

  const markIOSInstructionsShown = useCallback(() => {
    trackPWAEvent("ios_instructions_shown", { userId });
  }, [userId]);

  return { device, uiState, promptInstall, markIOSInstructionsShown };
}
