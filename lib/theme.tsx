"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import type { ReactNode } from "react";
import { Sun, Moon } from "lucide-react";

export type ThemeMode = "dark" | "light";

export interface ThemeTokens {
  ink: string;
  panel: string;
  panelSoft: string;
  rule: string;
  paper: string;
  paperMuted: string;
  marigold: string;
  signal: string;
  textPrimary: string;
  textMuted: string;
}

const DARK_TOKENS: ThemeTokens = {
  ink: "#16140F",
  panel: "#1D1A14",
  panelSoft: "#242019",
  rule: "#38321F",
  paper: "#EDE6D6",
  paperMuted: "#C9BFA4",
  marigold: "#E8A33D",
  signal: "#D6491F",
  textPrimary: "#F3ECDD",
  textMuted: "#8C8368",
};

const LIGHT_TOKENS: ThemeTokens = {
  ink: "#F7F3E8",
  panel: "#FFFFFF",
  panelSoft: "#F1ECDF",
  rule: "#E3DAC3",
  paper: "#1D1A14",
  paperMuted: "#413A28",
  marigold: "#B9791E",
  signal: "#B23A15",
  textPrimary: "#16140F",
  textMuted: "#6B6250",
};

const STORAGE_KEY = "inrastudio-theme";

interface ThemeContextValue {
  mode: ThemeMode;
  tokens: ThemeTokens;
  toggle: () => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<ThemeMode>("dark");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);

      if (stored === "light" || stored === "dark") {
        setMode(stored);
      }
    } catch {
      // Continue with the default theme if localStorage is unavailable.
    }

    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    try {
      window.localStorage.setItem(STORAGE_KEY, mode);
    } catch {
      // Theme switching still works if localStorage is unavailable.
    }
  }, [mode, mounted]);

  useEffect(() => {
    function handleStorage(event: StorageEvent) {
      if (
        event.key === STORAGE_KEY &&
        (event.newValue === "light" || event.newValue === "dark")
      ) {
        setMode(event.newValue);
      }
    }

    window.addEventListener("storage", handleStorage);

    return () => {
      window.removeEventListener("storage", handleStorage);
    };
  }, []);

  const toggle = useCallback(() => {
    setMode((currentMode) =>
      currentMode === "dark" ? "light" : "dark"
    );
  }, []);

  const tokens = mode === "dark" ? DARK_TOKENS : LIGHT_TOKENS;

  return (
    <ThemeContext.Provider value={{ mode, tokens, toggle }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("useTheme() must be called inside a <ThemeProvider>.");
  }

  return context;
}

interface ThemeToggleProps {
  className?: string;
  variant?: "fixed" | "inline";
  top?: string;
  left?: string;
}

export function ThemeToggle({
  className = "",
  variant = "fixed",
  top = "1rem",
  left = "1rem",
}: ThemeToggleProps) {
  const { mode, toggle } = useTheme();
  const isDark = mode === "dark";

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      aria-pressed={!isDark}
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className={`inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full shadow-md transition-transform active:scale-95 ${
        variant === "fixed" ? "fixed z-[60]" : ""
      } ${className}`}
      style={{
        ...(variant === "fixed" ? { top, left } : {}),
        background: isDark ? "#242019" : "#FFFFFF",
        border: `1px solid ${isDark ? "#38321F" : "#E3DAC3"}`,
        color: isDark ? "#F3ECDD" : "#16140F",
      }}
    >
      {isDark ? (
        <Sun className="h-5 w-5" />
      ) : (
        <Moon className="h-5 w-5" />
      )}
    </button>
  );
}