"use client";

import { ArrowUpRight, Facebook, Instagram } from "lucide-react";
import { Logo } from "@/components/Logo";
import { Navbar } from "@/components/Navbar";
import Link from "next/link";

const ink = "#16140F";
const paper = "#EEE7D8";
const paperDark = "#DCD2BD";
const signal = "#D6491F";
const marigold = "#E8A33D";
const muted = "#756D5C";

function Footer() {
  return (
    <footer
      className="w-full border-t"
      style={{
        background: ink,
        borderColor: "rgba(238,231,216,0.12)",
      }}
    >
      <div className="max-w-[1180px] mx-auto px-5 sm:px-8 pt-16 sm:pt-24 pb-8">
        {/* FOOTER INTRO */}
        <div className="grid grid-cols-1 lg:grid-cols-[1.3fr_0.7fr] gap-14 lg:gap-24 pb-20">
          <div>
            <div
              className="font-mono text-[9px] tracking-[0.2em] mb-6"
              style={{ color: "#8D836C" }}
            >
              INRASTUDIO / 2026
            </div>

            <h2
              className="
                font-display
                text-[clamp(3rem,8vw,7rem)]
                font-medium
                leading-[0.88]
                tracking-[-0.055em]
              "
              style={{ color: paper }}
            >
              MAKE IT
              <br />
              <span style={{ color: marigold }}>NOTICE.</span>
            </h2>
          </div>

          <div className="lg:pt-10">
            <p
              className="font-display text-xl sm:text-2xl leading-[1.15] tracking-[-0.025em] max-w-md"
              style={{ color: "#C5BCAA" }}
            >
              Good marketing should earn attention before it asks for a sale.
            </p>
          </div>
        </div>

        {/* FOOTER NAVIGATION */}
        <div
          className="border-t border-b py-8 sm:py-10 grid grid-cols-1 sm:grid-cols-3 gap-10"
          style={{
            borderColor: "rgba(238,231,216,0.12)",
          }}
        >
          <div>
            <p
              className="font-mono text-[9px] tracking-[0.18em] mb-5"
              style={{ color: "#77705F" }}
            >
              (01) EXPLORE
            </p>

            <div className="flex flex-col gap-3">
              <Link
                href="/pricing"
                className="font-display text-base hover:opacity-70 transition-opacity"
                style={{ color: paper }}
              >
                Pricing
              </Link>

              <Link
                href="/dashboard"
                className="font-display text-base hover:opacity-70 transition-opacity"
                style={{ color: paper }}
              >
                Dashboard
              </Link>

              <Link
                href="/contact"
                className="font-display text-base hover:opacity-70 transition-opacity"
                style={{ color: paper }}
              >
                Contact
              </Link>
            </div>
          </div>

          <div>
            <p
              className="font-mono text-[9px] tracking-[0.18em] mb-5"
              style={{ color: "#77705F" }}
            >
              (02) CONNECT
            </p>

            <div className="flex flex-col gap-3">
              <a
                href="#"
                className="flex items-center gap-2 font-display text-base hover:opacity-70 transition-opacity"
                style={{ color: paper }}
              >
                <Instagram className="w-4 h-4" />
                Instagram
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>

              <a
                href="#"
                className="flex items-center gap-2 font-display text-base hover:opacity-70 transition-opacity"
                style={{ color: paper }}
              >
                <Facebook className="w-4 h-4" />
                Facebook
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          <div>
            <p
              className="font-mono text-[9px] tracking-[0.18em] mb-5"
              style={{ color: "#77705F" }}
            >
              (03) READ
            </p>

            <div className="flex flex-col gap-3">
              <Link
                href="/privacy"
                className="font-display text-base hover:opacity-70 transition-opacity"
                style={{ color: paper }}
              >
                Privacy Policy
              </Link>

              <Link
                href="/terms"
                className="font-display text-base hover:opacity-70 transition-opacity"
                style={{ color: paper }}
              >
                Terms & Conditions
              </Link>

              <Link
                href="/disclosure"
                className="font-display text-base hover:opacity-70 transition-opacity"
                style={{ color: paper }}
              >
                Disclosure
              </Link>
            </div>
          </div>
        </div>

        {/* FOOTER BASELINE */}
        <div className="pt-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
          <div className="flex items-center gap-3">
            <Logo
              size="sm"
              showWordmark={false}
              className="w-8 h-8 rounded-lg"
            />

            <span
              className="font-mono text-[9px] tracking-[0.16em]"
              style={{ color: "#8D836C" }}
            >
              INRASTUDIO
            </span>
          </div>

          <p
            className="font-mono text-[9px] tracking-[0.08em]"
            style={{ color: "#77705F" }}
          >
            © 2026 INRASTUDIO AI MARKETING STUDIO.
          </p>
        </div>
      </div>
    </footer>
  );
}
