
"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Menu, X, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { Logo } from "@/components/Logo";
import { ThemeToggle, useTheme } from "@/lib/theme";

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const { mode, tokens } = useTheme();
  const isDark = mode === "dark";

  const colors = {
    background: tokens.ink,
    panel: tokens.panel,
    panelSoft: tokens.panelSoft,
    border: tokens.rule,
    text: tokens.textPrimary,
    muted: tokens.textMuted,
    accent: tokens.marigold,
    signal: tokens.signal,
  };

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 24);

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const closeMenu = () => setIsMenuOpen(false);

  const navLinks = [
    { label: "Contact", href: "/contact" },
    { label: "Dashboard", href: "/dashboard" },
    { label: "Pricing", href: "/pricing" },
  ];

  return (
    <>
      <style>{`
        .inra-nav {
          --ink: ${colors.background};
          --paper: ${colors.text};
          --paper-dim: ${colors.panelSoft};
          --signal: ${colors.accent};
          --muted: ${colors.muted};
        }

        .inra-nav *,
        .inra-nav *::before,
        .inra-nav *::after {
          -webkit-tap-highlight-color: transparent;
        }

        .inra-nav button,
        .inra-nav a {
          touch-action: manipulation;
        }

        .inra-nav-display {
          font-family:
            "Archivo Black",
            "Space Grotesk",
            ui-sans-serif,
            system-ui,
            sans-serif;
        }

        .inra-nav-mono {
          font-family:
            "IBM Plex Mono",
            ui-monospace,
            SFMono-Regular,
            Menlo,
            monospace;
        }

        @media (prefers-reduced-motion: reduce) {
          .inra-nav *,
          .inra-nav *::before,
          .inra-nav *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
            scroll-behavior: auto !important;
          }
        }
      `}</style>

      {/* MAIN NAVIGATION */}
      <div className="inra-nav fixed left-0 right-0 top-0 z-50 px-3 pt-3 sm:px-5 sm:pt-5">
        <motion.nav
          initial={{ y: -24, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.65, ease: [0.23, 1, 0.32, 1] }}
          className="mx-auto w-full max-w-[1180px]"
        >
          <div
            className={`relative overflow-visible border transition-all duration-500 ${
              scrolled || isMenuOpen
                ? "rounded-[18px] shadow-[0_14px_40px_rgba(0,0,0,0.16)]"
                : "rounded-[22px]"
            }`}
            style={{
              background: colors.panel,
              borderColor: colors.border,
            }}
          >
            {/* MAIN NAV ROW */}
            <div className="flex h-[66px] items-center sm:h-[72px]">
              {/* BRAND */}
              <div className="flex items-center pl-4 pr-4 sm:pl-6">
                <Link
                  href="/"
                  aria-label="INRASTUDIO home"
                  className="group flex items-center"
                >
                  <Logo
                    size="md"
                    showWordmark={true}
                    className="h-9 w-9 sm:h-10 sm:w-10"
                  />
                </Link>
              </div>

              {/* DESKTOP NAV */}
              <div className="hidden flex-1 items-center justify-center gap-8 lg:flex">
                {navLinks.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="inra-nav-mono text-[10px] font-semibold tracking-[0.14em] transition-colors"
                    style={{ color: colors.muted }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = colors.text;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = colors.muted;
                    }}
                  >
                    {item.label.toUpperCase()}
                  </Link>
                ))}
              </div>

              {/* RIGHT ACTIONS */}
              <div className="ml-auto flex items-center gap-2 pr-3 sm:gap-3 sm:pr-4">
                {/* THEME TOGGLE */}
                <ThemeToggle
                  variant="inline"
                  className="h-10 w-10 shadow-none"
                />

                {/* LOGIN */}
                <Link
                  href="/login"
                  className="inra-nav-mono hidden px-3 text-[10px] font-semibold tracking-[0.12em] transition-colors sm:inline-flex"
                  style={{ color: colors.muted }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = colors.text;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = colors.muted;
                  }}
                >
                  LOG IN
                </Link>

                {/* PRIMARY CTA */}
                <Link
                  href="/signup"
                  className="inra-nav-display hidden h-11 items-center justify-center gap-2 rounded-[10px] px-5 text-xs font-bold shadow-[3px_3px_0_0_rgba(0,0,0,0.18)] transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0 lg:inline-flex"
                  style={{
                    background: colors.accent,
                    color: colors.background,
                  }}
                >
                  START CREATING
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </Link>

                {/* MOBILE MENU BUTTON */}
                <button
                  type="button"
                  onClick={() => setIsMenuOpen((open) => !open)}
                  aria-label={isMenuOpen ? "Close navigation" : "Open navigation"}
                  aria-expanded={isMenuOpen}
                  className="flex h-10 w-10 items-center justify-center rounded-[10px] transition-transform active:scale-95 lg:hidden"
                  style={{
                    background: colors.text,
                    color: colors.background,
                  }}
                >
                  {isMenuOpen ? (
                    <X className="h-5 w-5" />
                  ) : (
                    <Menu className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            {/* BOTTOM RULE */}
            <div
              className="h-[2px] w-full"
              style={{
                background: `linear-gradient(90deg, ${colors.accent} 0%, ${colors.accent} 18%, ${colors.text} 18%, ${colors.text} 82%, ${colors.accent} 82%, ${colors.accent} 100%)`,
              }}
            />
          </div>
        </motion.nav>
      </div>

      {/* MOBILE NAVIGATION */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            {/* BACKDROP */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 lg:hidden"
              style={{
                background: isDark
                  ? "rgba(0,0,0,0.55)"
                  : "rgba(21,19,15,0.38)",
              }}
              onClick={closeMenu}
              aria-hidden="true"
            />

            {/* MOBILE MENU PANEL */}
            <motion.div
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.35, ease: [0.23, 1, 0.32, 1] }}
              className="inra-nav fixed left-3 right-3 top-[82px] z-50 overflow-hidden rounded-[20px] border shadow-[0_24px_60px_rgba(0,0,0,0.22)] lg:hidden"
              style={{
                background: colors.panel,
                borderColor: colors.border,
              }}
            >
              {/* MENU INTRO */}
              <div
                className="border-b px-5 pb-5 pt-6"
                style={{ borderColor: colors.border }}
              >
                <div
                  className="inra-nav-mono text-[9px] tracking-[0.2em]"
                  style={{ color: colors.muted }}
                >
                  INRASTUDIO / NAVIGATION
                </div>

                <div
                  className="inra-nav-display mt-2 max-w-[330px] text-[25px] font-semibold leading-[1.05] tracking-[-0.035em] sm:text-[29px]"
                  style={{ color: colors.text }}
                >
                  Make the next thing
                  <br />
                  worth stopping for.
                </div>
              </div>

              {/* NAV LINKS */}
              <div
                className="border-b px-5 py-3"
                style={{ borderColor: colors.border }}
              >
                {navLinks.map((item, index) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={closeMenu}
                    className="group flex items-center justify-between border-b py-4 last:border-b-0"
                    style={{ borderColor: colors.border }}
                  >
                    <span
                      className="inra-nav-display text-xl font-medium tracking-[-0.025em] transition-colors sm:text-2xl"
                      style={{ color: colors.text }}
                    >
                      {item.label}
                    </span>

                    <span
                      className="inra-nav-mono text-[9px]"
                      style={{ color: colors.muted }}
                    >
                      0{index + 1}
                    </span>
                  </Link>
                ))}
              </div>

              {/* ACCOUNT + CTA */}
              <div
                className="px-5 py-5"
                style={{ background: colors.panelSoft }}
              >
                <div className="flex items-center justify-between gap-4">
                  <Link
                    href="/login"
                    onClick={closeMenu}
                    className="inra-nav-mono text-[10px] font-semibold tracking-[0.15em] transition-colors"
                    style={{ color: colors.muted }}
                  >
                    LOG IN
                  </Link>

                  <Link
                    href="/signup"
                    onClick={closeMenu}
                    className="inra-nav-display flex h-12 max-w-[200px] flex-1 items-center justify-center gap-2 rounded-[10px] text-sm font-bold shadow-[3px_3px_0_0_rgba(0,0,0,0.18)] transition-transform active:scale-[0.98]"
                    style={{
                      background: colors.accent,
                      color: colors.background,
                    }}
                  >
                    START CREATING
                    <ArrowUpRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>

              {/* BOTTOM CAMPAIGN STRIP */}
              <div
                className="flex items-center justify-between px-5 py-3"
                style={{
                  background: colors.background,
                  color: colors.text,
                }}
              >
                <span
                  className="inra-nav-mono text-[8px] tracking-[0.18em]"
                  style={{ color: colors.muted }}
                >
                  ONE PHOTO
                </span>

                <span
                  className="text-sm font-bold"
                  style={{ color: colors.accent }}
                >
                  →
                </span>

                <span className="inra-nav-mono text-[8px] tracking-[0.18em]">
                  FULL CAMPAIGN
                </span>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
