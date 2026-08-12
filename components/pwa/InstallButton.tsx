"use client";

import { useCallback, useState } from "react";
import { usePWAInstall } from "../../hooks/usePWAInstall";
import { IOSInstallSheet } from "./IOSInstallSheet";

interface InstallButtonProps {
  userId?: string | number | null;
}

export function InstallButton({ userId }: InstallButtonProps) {
  const {
    device,
    uiState,
    promptInstall,
    markIOSInstructionsShown,
  } = usePWAInstall(userId);

  const [showSheet, setShowSheet] = useState(false);

  const handleClick = useCallback(async () => {
    switch (uiState) {
      case "native-available":
        await promptInstall();
        break;

      case "ios-manual":
      case "macos-safari-manual":
        markIOSInstructionsShown();
        setShowSheet(true);
        break;

      default:
        break;
    }
  }, [uiState, promptInstall, markIOSInstructionsShown]);

  const handleCloseSheet = useCallback(() => {
    setShowSheet(false);
  }, []);

  /*
   * Don't render anything while we're determining whether
   * this browser/device supports PWA installation.
   *
   * Also hide the button when:
   * - the app is already installed
   * - the browser doesn't support installation
   */
  if (
    uiState === "checking" ||
    uiState === "already-installed" ||
    uiState === "unsupported"
  ) {
    return null;
  }

  const isNativeInstall = uiState === "native-available";

  const installLabel = isNativeInstall
    ? "Install INRA Studio"
    : "Install INRA Studio";

  return (
    <>
      <button
        type="button"
        onClick={handleClick}
        aria-label="Install INRA Studio"
        className="
          flex
          w-full
          items-center
          justify-center
          gap-2
          rounded-full
          border
          border-white/10
          bg-white/5
          px-8
          py-4
          text-lg
          font-medium
          text-white
          transition-colors
          hover:bg-white/10
          focus:outline-none
          focus:ring-2
          focus:ring-cyan-400/50
          focus:ring-offset-2
          focus:ring-offset-[#030712]
          sm:w-auto
        "
      >
        {installLabel}
      </button>

      {showSheet && (
        <IOSInstallSheet
          platform={device?.os === "macOS" ? "macos" : "ios"}
          onClose={handleCloseSheet}
        />
      )}
    </>
  );
}