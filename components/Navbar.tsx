"use client";

import { useEffect, useState } from "react";
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

    handleScroll();

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
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
          --ink: #15130F;
          --paper: #F2EEE2;
          --paper-dim: #E7E1CF;
          --signal: #FFC629;
          --muted: #A79A82;
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

      {/* =========================================================
          MAIN NAVIGATION
      ========================================================== */}

      <div className="inra-nav fixed left-0 right-0 top-0 z-50 px-3 pt-3 sm:px-5 sm:pt-5">
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
              overflow-visible
              border
              transition-all
              duration-500
              ${
                scrolled || isMenuOpen
                  ? "rounded-[18px] shadow-[0_14px_40px_rgba(21,19,15,0.16)]"
                  : "rounded-[22px]"
              }
            `}
            style={{
              background: "#F2EEE2",
              borderColor: "rgba(21,19,15,0.14)",
            }}
          >
            {/* =====================================================
                MAIN NAV ROW
            ====================================================== */}

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

              {/* =================================================
                  DESKTOP NAV
              ================================================== */}

              <div className="hidden flex-1 items-center justify-center gap-8 lg:flex">
                {navLinks.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="
                      inra-nav-mono
                      text-[10px]
                      font-semibold
                      tracking-[0.14em]
                      text-[#514B3E]
                      transition-colors
                      hover:text-[#15130F]
                    "
                  >
                    {item.label.toUpperCase()}
                  </Link>
                ))}
              </div>

              {/* =================================================
                  RIGHT ACTIONS
              ================================================== */}

              <div className="ml-auto flex items-center gap-2 pr-3 sm:gap-3 sm:pr-4">
                {/* LOGIN */}

                <Link
                  href="/login"
                  className="
                    hidden
                    px-3
                    inra-nav-mono
                    text-[10px]
                    font-semibold
                    tracking-[0.12em]
                    text-[#514B3E]
                    transition-colors
                    hover:text-[#15130F]
                    sm:inline-flex
                  "
                >
                  LOG IN
                </Link>

                {/* PRIMARY CTA */}

                <Link
                  href="/signup"
                  className="
                    hidden
                    h-11
                    items-center
                    justify-center
                    gap-2
                    rounded-[10px]
                    bg-[#FFC629]
                    px-5
                    inra-nav-display
                    text-xs
                    font-bold
                    text-[#15130F]
                    shadow-[3px_3px_0_0_rgba(21,19,15,0.22)]
                    transition-all
                    duration-300
                    hover:-translate-y-0.5
                    hover:shadow-[4px_4px_0_0_rgba(21,19,15,0.25)]
                    active:translate-y-0
                    active:shadow-[2px_2px_0_0_rgba(21,19,15,0.22)]
                    lg:inline-flex
                  "
                >
                  START CREATING
                  <ArrowUpRight className="h-3.5 w-3.5" />
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
                    flex
                    h-10
                    w-10
                    items-center
                    justify-center
                    rounded-[10px]
                    bg-[#15130F]
                    text-[#F2EEE2]
                    transition-transform
                    active:scale-95
                    lg:hidden
                  "
                >
                  {isMenuOpen ? (
                    <X className="h-5 w-5" />
                  ) : (
                    <Menu className="h-5 w-5" />
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
                  "linear-gradient(90deg, #FFC629 0%, #FFC629 18%, #15130F 18%, #15130F 82%, #FFC629 82%, #FFC629 100%)",
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
              className="fixed inset-0 z-40 lg:hidden"
              style={{
                background: "rgba(21,19,15,0.38)",
              }}
              onClick={closeMenu}
              aria-hidden="true"
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
                top-[82px]
                z-50
                overflow-hidden
                rounded-[20px]
                border
                shadow-[0_24px_60px_rgba(21,19,15,0.22)]
                lg:hidden
              "
              style={{
                background: "#F2EEE2",
                borderColor: "rgba(21,19,15,0.14)",
              }}
            >
              {/* MENU INTRO */}

              <div
                className="border-b px-5 pb-5 pt-6"
                style={{
                  borderColor: "rgba(21,19,15,0.12)",
                }}
              >
                <div
                  className="
                    inra-nav-mono
                    text-[9px]
                    tracking-[0.2em]
                  "
                  style={{
                    color: "#A79A82",
                  }}
                >
                  INRASTUDIO / NAVIGATION
                </div>

                <div
                  className="
                    inra-nav-display
                    mt-2
                    max-w-[330px]
                    text-[25px]
                    font-semibold
                    leading-[1.05]
                    tracking-[-0.035em]
                    sm:text-[29px]
                  "
                  style={{
                    color: "#15130F",
                  }}
                >
                  Make the next thing
                  <br />
                  worth stopping for.
                </div>
              </div>

              {/* NAV LINKS */}

              <div
                className="border-b px-5 py-3"
                style={{
                  borderColor: "rgba(21,19,15,0.12)",
                }}
              >
                {navLinks.map((item, index) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={closeMenu}
                    className="
                      group
                      flex
                      items-center
                      justify-between
                      border-b
                      py-4
                      last:border-b-0
                    "
                    style={{
                      borderColor: "rgba(21,19,15,0.09)",
                    }}
                  >
                    <span
                      className="
                        inra-nav-display
                        text-xl
                        font-medium
                        tracking-[-0.025em]
                        transition-colors
                        group-hover:text-[#15130F]
                        sm:text-2xl
                      "
                      style={{
                        color: "#15130F",
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
                        color: "#A79A82",
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
                  background: "rgba(231,225,207,0.45)",
                }}
              >
                <div className="flex items-center justify-between gap-4">
                  <Link
                    href="/login"
                    onClick={closeMenu}
                    className="
                      inra-nav-mono
                      text-[10px]
                      font-semibold
                      tracking-[0.15em]
                      text-[#514B3E]
                      transition-colors
                      hover:text-[#15130F]
                    "
                  >
                    LOG IN
                  </Link>

                  <Link
                    href="/signup"
                    onClick={closeMenu}
                    className="
                      flex
                      h-12
                      max-w-[200px]
                      flex-1
                      items-center
                      justify-center
                      gap-2
                      rounded-[10px]
                      bg-[#FFC629]
                      inra-nav-display
                      text-sm
                      font-bold
                      text-[#15130F]
                      shadow-[3px_3px_0_0_rgba(21,19,15,0.22)]
                      transition-transform
                      active:scale-[0.98]
                    "
                  >
                    START CREATING
                    <ArrowUpRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>

              {/* BOTTOM CAMPAIGN STRIP */}

              <div
                className="
                  flex
                  items-center
                  justify-between
                  px-5
                  py-3
                "
                style={{
                  background: "#15130F",
                  color: "#F2EEE2",
                }}
              >
                <span
                  className="
                    inra-nav-mono
                    text-[8px]
                    tracking-[0.18em]
                  "
                  style={{
                    color: "#A79A82",
                  }}
                >
                  ONE PHOTO
                </span>

                <span
                  className="text-sm font-bold"
                  style={{
                    color: "#FFC629",
                  }}
                >
                  →
                </span>

                <span
                  className="
                    inra-nav-mono
                    text-[8px]
                    tracking-[0.18em]
                    text-[#F2EEE2]
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


