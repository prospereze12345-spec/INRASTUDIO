"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Menu, X, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { Logo } from "@/components/Logo";

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 24);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <>
      <style>{`
        .inra-nav {
          --ink: #16140F;
          --paper: #EEE7D8;
          --paper-dark: #DCD2BD;
          --signal: #D6491F;
          --marigold: #E8A33D;
          --muted: #8D836C;
        }

        .inra-nav * {
          -webkit-tap-highlight-color: transparent;
        }

        .inra-nav button,
        .inra-nav a {
          touch-action: manipulation;
        }

        .inra-nav-display {
          font-family:
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
          }
        }
      `}</style>

      {/* =========================================================
          NAVIGATION
      ========================================================== */}

      <div className="inra-nav fixed top-0 left-0 right-0 z-50 px-3 sm:px-5 pt-3 sm:pt-5">
        <motion.nav
          initial={{ y: -24, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{
            duration: 0.65,
            ease: [0.23, 1, 0.32, 1],
          }}
          className="mx-auto w-full max-w-[1180px]"
        >
          <div
            className={`
              relative
              border
              overflow-visible
              transition-all
              duration-500
              ${
                scrolled || isMenuOpen
                  ? "rounded-[20px] shadow-[0_14px_40px_rgba(22,20,15,0.14)]"
                  : "rounded-[24px]"
              }
            `}
            style={{
              background: "#EEE7D8",
              borderColor: "rgba(22,20,15,0.16)",
            }}
          >
            {/* =====================================================
                MAIN NAV ROW
            ====================================================== */}

            <div className="h-[68px] sm:h-[74px] flex items-center">
              {/* BRAND */}
              <div className="flex items-center pl-4 sm:pl-6 pr-4">
                <Link
                  href="/"
                  aria-label="INRASTUDIO home"
                  className="group flex items-center gap-3"
                >
                  <div
                    className="
                      w-9 h-9
                      sm:w-10 sm:h-10
                      rounded-[10px]
                      flex items-center justify-center
                      transition-transform
                      duration-300
                      group-hover:-rotate-3
                    "
                    style={{
                      background: "#16140F",
                    }}
                  >
                    <Logo className="w-7 h-7 sm:w-8 sm:h-8 rounded-[7px]" />
                  </div>

                  <div className="hidden sm:flex flex-col leading-none">
                    <span
                      className="
                        inra-nav-display
                        text-[15px]
                        font-bold
                        tracking-[-0.02em]
                      "
                      style={{
                        color: "#16140F",
                      }}
                    >
                      INRASTUDIO
                    </span>

                    <span
                      className="
                        inra-nav-mono
                        text-[8px]
                        tracking-[0.22em]
                        mt-1
                      "
                      style={{
                        color: "#8D836C",
                      }}
                    >
                      MARKETING STUDIO
                    </span>
                  </div>
                </Link>
              </div>

              {/* =================================================
                  DESKTOP NAV
              ================================================== */}

              <div className="hidden lg:flex flex-1 items-center justify-center gap-8">
                <Link
                  href="/contact"
                  className="
                    inra-nav-mono
                    text-[10px]
                    tracking-[0.14em]
                    font-semibold
                    transition-colors
                    hover:text-[#D6491F]
                  "
                  style={{
                    color: "#514B3E",
                  }}
                >
                  CONTACT
                </Link>

                <Link
                  href="/dashboard"
                  className="
                    inra-nav-mono
                    text-[10px]
                    tracking-[0.14em]
                    font-semibold
                    transition-colors
                    hover:text-[#D6491F]
                  "
                  style={{
                    color: "#514B3E",
                  }}
                >
                  DASHBOARD
                </Link>

                <Link
                  href="/pricing"
                  className="
                    inra-nav-mono
                    text-[10px]
                    tracking-[0.14em]
                    font-semibold
                    transition-colors
                    hover:text-[#D6491F]
                  "
                  style={{
                    color: "#514B3E",
                  }}
                >
                  PRICING
                </Link>
              </div>

              {/* =================================================
                  RIGHT ACTIONS
              ================================================== */}

              <div className="ml-auto flex items-center gap-2 sm:gap-3 pr-3 sm:pr-4">
                {/* LOGIN */}
                <Link
                  href="/login"
                  className="
                    hidden sm:inline-flex
                    items-center
                    px-3
                    inra-nav-mono
                    text-[10px]
                    tracking-[0.12em]
                    font-semibold
                    transition-colors
                    hover:text-[#D6491F]
                  "
                  style={{
                    color: "#514B3E",
                  }}
                >
                  LOG IN
                </Link>

                {/* DESKTOP CTA */}
                <Link
                  href="/signup"
                  className="
                    hidden lg:inline-flex
                    items-center
                    justify-center
                    gap-2
                    px-5
                    h-11
                    rounded-[11px]
                    inra-nav-display
                    text-xs
                    font-bold
                    transition-all
                    duration-300
                    hover:-translate-y-0.5
                    active:translate-y-0
                  "
                  style={{
                    background: "#D6491F",
                    color: "#F7F0E2",
                  }}
                >
                  START CREATING
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>

                {/* MOBILE MENU BUTTON */}
                <button
                  type="button"
                  onClick={() => setIsMenuOpen((open) => !open)}
                  aria-label={
                    isMenuOpen
                      ? "Close navigation"
                      : "Open navigation"
                  }
                  aria-expanded={isMenuOpen}
                  className="
                    lg:hidden
                    w-10
                    h-10
                    rounded-[10px]
                    flex
                    items-center
                    justify-center
                    transition-transform
                    active:scale-95
                  "
                  style={{
                    background: "#16140F",
                    color: "#EEE7D8",
                  }}
                >
                  {isMenuOpen ? (
                    <X className="w-5 h-5" />
                  ) : (
                    <Menu className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* =====================================================
                PRINT-STYLE BOTTOM RULE
            ====================================================== */}

            <div
              className="h-[2px] w-full"
              style={{
                background:
                  "linear-gradient(90deg, #D6491F 0%, #D6491F 14%, #16140F 14%, #16140F 82%, #E8A33D 82%, #E8A33D 100%)",
              }}
            />
          </div>
        </motion.nav>
      </div>

      {/* =========================================================
          MOBILE NAVIGATION
      ========================================================== */}

      <AnimatePresence>
        {isMenuOpen && (
          <>
            {/* BACKDROP */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="
                fixed
                inset-0
                z-40
                lg:hidden
              "
              style={{
                background: "rgba(22,20,15,0.35)",
              }}
              onClick={() => setIsMenuOpen(false)}
            />

            {/* MOBILE MENU PANEL */}
            <motion.div
              initial={{
                opacity: 0,
                y: -12,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              exit={{
                opacity: 0,
                y: -12,
              }}
              transition={{
                duration: 0.35,
                ease: [0.23, 1, 0.32, 1],
              }}
              className="
                inra-nav
                fixed
                left-3
                right-3
                top-[86px]
                z-50
                lg:hidden
                overflow-hidden
                rounded-[22px]
                border
                shadow-[0_24px_60px_rgba(22,20,15,0.22)]
              "
              style={{
                background: "#EEE7D8",
                borderColor: "rgba(22,20,15,0.16)",
              }}
            >
              {/* MENU INTRO */}
              <div
                className="px-5 pt-6 pb-5 border-b"
                style={{
                  borderColor: "rgba(22,20,15,0.13)",
                }}
              >
                <div
                  className="
                    inra-nav-mono
                    text-[9px]
                    tracking-[0.2em]
                  "
                  style={{
                    color: "#8D836C",
                  }}
                >
                  INRASTUDIO / NAVIGATION
                </div>

                <div
                  className="
                    inra-nav-display
                    text-[26px]
                    sm:text-[30px]
                    font-semibold
                    leading-[1.05]
                    tracking-[-0.035em]
                    mt-2
                    max-w-[330px]
                  "
                  style={{
                    color: "#16140F",
                  }}
                >
                  Make the next thing
                  <br />
                  worth stopping for.
                </div>
              </div>

              {/* NAV LINKS */}
              <div
                className="px-5 py-3 border-b"
                style={{
                  borderColor: "rgba(22,20,15,0.13)",
                }}
              >
                {[
                  {
                    label: "Contact",
                    href: "/contact",
                  },
                  {
                    label: "Dashboard",
                    href: "/dashboard",
                  },
                  {
                    label: "Pricing",
                    href: "/pricing",
                  },
                ].map((item, index) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsMenuOpen(false)}
                    className="
                      group
                      flex
                      items-center
                      justify-between
                      py-4
                      border-b
                      last:border-b-0
                    "
                    style={{
                      borderColor: "rgba(22,20,15,0.09)",
                    }}
                  >
                    <span
                      className="
                        inra-nav-display
                        text-xl
                        sm:text-2xl
                        font-medium
                        tracking-[-0.025em]
                        transition-colors
                        group-hover:text-[#D6491F]
                      "
                      style={{
                        color: "#16140F",
                      }}
                    >
                      {item.label}
                    </span>

                    <span
                      className="
                        inra-nav-mono
                        text-[9px]
                      "
                      style={{
                        color: "#A19883",
                      }}
                    >
                      0{index + 1}
                    </span>
                  </Link>
                ))}
              </div>

              {/* ACCOUNT + CTA */}
              <div
                className="px-5 py-5"
                style={{
                  background: "rgba(220,210,189,0.25)",
                }}
              >
                <div className="flex items-center justify-between gap-4">
                  <Link
                    href="/login"
                    onClick={() => setIsMenuOpen(false)}
                    className="
                      inra-nav-mono
                      text-[10px]
                      tracking-[0.15em]
                      font-semibold
                      hover:text-[#D6491F]
                      transition-colors
                    "
                    style={{
                      color: "#514B3E",
                    }}
                  >
                    LOG IN
                  </Link>

                  <Link
                    href="/signup"
                    onClick={() => setIsMenuOpen(false)}
                    className="
                      flex-1
                      max-w-[200px]
                      h-12
                      rounded-[11px]
                      flex
                      items-center
                      justify-center
                      gap-2
                      inra-nav-display
                      text-sm
                      font-bold
                      transition-transform
                      active:scale-[0.98]
                    "
                    style={{
                      background: "#D6491F",
                      color: "#F7F0E2",
                    }}
                  >
                    START CREATING
                    <ArrowUpRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>

              {/* BOTTOM CAMPAIGN STRIP */}
              <div
                className="
                  px-5
                  py-3
                  flex
                  items-center
                  justify-between
                "
                style={{
                  background: "#16140F",
                  color: "#EEE7D8",
                }}
              >
                <span
                  className="
                    inra-nav-mono
                    text-[8px]
                    tracking-[0.18em]
                  "
                  style={{
                    color: "#9D947F",
                  }}
                >
                  ONE PHOTO
                </span>

                <span
                  className="text-xs"
                  style={{
                    color: "#E8A33D",
                  }}
                >
                  →
                </span>

                <span
                  className="
                    inra-nav-mono
                    text-[8px]
                    tracking-[0.18em]
                  "
                >
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

