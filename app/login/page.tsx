"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowUpRight,
  Loader2,
  CheckCircle2,
  Sparkles,
  Clock3,
  ShieldCheck,
} from "lucide-react";
import { Logo } from "@/components/Logo";
import { apiFetch } from "@/lib/auth";

const ink = "#16140F";
const panel = "#1D1A14";
const panelSoft = "#242019";
const rule = "#38321F";
const paper = "#EDE6D6";
const marigold = "#E8A33D";
const signal = "#D6491F";
const textPrimary = "#F3ECDD";
const textMuted = "#8C8368";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  async function handleSubmit() {
    if (loading) return;

    setError("");

    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail) {
      setError("Email is required.");
      return;
    }

    setLoading(true);

    try {
      await apiFetch("/api/auth/login/", {
        method: "POST",
        body: JSON.stringify({ email: cleanEmail }),
      });

      setSuccess(true);

      setTimeout(() => setSuccess(false), 3000);
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : "Login failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="min-h-screen flex flex-col overflow-x-hidden"
      style={{
        background: ink,
        color: textPrimary,
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=IBM+Plex+Mono:wght@400;500;600;700&display=swap');

        .font-display {
          font-family: 'Space Grotesk', ui-sans-serif, system-ui, sans-serif;
        }

        .font-mono {
          font-family: 'IBM Plex Mono', ui-monospace, monospace;
        }

        .login-input::placeholder {
          color: #756D5C;
        }

        .login-input:focus {
          outline: none;
        }
      `}</style>

      {/* SUCCESS TOAST */}
      <div
        role="status"
        aria-live="polite"
        className={`
          fixed
          top-5
          right-5
          sm:top-6
          sm:right-6
          z-50
          flex
          items-center
          gap-3
          rounded-xl
          px-4
          py-3.5
          shadow-2xl
          transition-all
          duration-500
          ${
            success
              ? "translate-y-0 opacity-100"
              : "-translate-y-3 pointer-events-none opacity-0"
          }
        `}
        style={{
          background: panel,
          border: `1px solid ${marigold}55`,
        }}
      >
        <CheckCircle2
          className="h-5 w-5 shrink-0"
          style={{ color: marigold }}
        />

        <div>
          <p className="font-display text-sm font-semibold">
            Link sent
          </p>

          <p
            className="font-mono mt-0.5 text-[10px] tracking-[0.08em]"
            style={{ color: textMuted }}
          >
            CHECK YOUR INBOX
          </p>
        </div>
      </div>

      {/* HEADER */}
      <header className="px-5 py-5 sm:px-8 sm:py-7">
        <div className="mx-auto flex max-w-[1180px] items-center justify-between">
          <Link
            href="/"
            className="group inline-flex items-center gap-3"
            style={{ color: textMuted }}
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />

            <Logo
              size="sm"
              showWordmark={false}
              className="h-8 w-8 rounded-lg"
            />

            <span className="font-mono text-[10px] tracking-[0.16em]">
              BACK TO HOME
            </span>
          </Link>

          <span
            className="hidden font-mono text-[9px] tracking-[0.18em] sm:block"
            style={{ color: "#625B4B" }}
          >
            INRASTUDIO / ACCESS
          </span>
        </div>
      </header>

      {/* MAIN */}
      <main className="flex flex-1 items-center px-5 pb-12 pt-5 sm:px-8 sm:pb-16 sm:pt-8">
        <div className="mx-auto grid w-full max-w-[1080px] grid-cols-1 gap-8 lg:grid-cols-[1fr_460px] lg:items-center lg:gap-20">

          {/* =====================================================
              LEFT — PRODUCT MESSAGE
          ====================================================== */}
          <section className="hidden lg:block">
            <div
              className="mb-7 flex items-center gap-4 font-mono text-[9px] tracking-[0.2em]"
              style={{ color: textMuted }}
            >
              <span>INRASTUDIO / 01</span>

              <span
                className="h-px w-20"
                style={{ background: rule }}
              />
            </div>

            <h1 className="font-display max-w-[620px] text-[clamp(4rem,6vw,6.8rem)] font-medium leading-[0.86] tracking-[-0.065em]">
              YOUR
              <br />
              <span style={{ color: marigold }}>
                STUDIO
              </span>
              <br />
              IS READY.
            </h1>

            <p
              className="font-display mt-8 max-w-[470px] text-xl leading-[1.18] tracking-[-0.025em]"
              style={{ color: "#B9B09C" }}
            >
              Sign in and pick up where you left off — from your next
              flyer to the campaign behind it.
            </p>

            <div className="mt-10 grid max-w-[470px] grid-cols-3 border-y" style={{ borderColor: rule }}>
              {[
                ["01", "FLYERS"],
                ["02", "CAPTIONS"],
                ["03", "VIDEO"],
              ].map(([number, label]) => (
                <div
                  key={number}
                  className="border-r px-3 py-4 last:border-r-0"
                  style={{ borderColor: rule }}
                >
                  <div
                    className="font-mono text-[8px]"
                    style={{ color: marigold }}
                  >
                    {number}
                  </div>

                  <div
                    className="font-mono mt-2 text-[8px] tracking-[0.12em]"
                    style={{ color: textMuted }}
                  >
                    {label}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* =====================================================
              RIGHT — LOGIN FORM
          ====================================================== */}
          <section
            className="rounded-[24px] p-1"
            style={{
              background: panelSoft,
              border: `1px solid ${rule}`,
            }}
          >
            <div
              className="rounded-[20px] p-6 sm:p-8 md:p-10"
              style={{
                background: panel,
              }}
            >
              {/* MOBILE BRAND MESSAGE */}
              <div className="mb-8 lg:hidden">
                <div
                  className="font-mono mb-4 text-[9px] tracking-[0.2em]"
                  style={{ color: textMuted }}
                >
                  INRASTUDIO / ACCESS
                </div>

                <h1 className="font-display text-[clamp(2.8rem,13vw,4.5rem)] font-medium leading-[0.88] tracking-[-0.06em]">
                  YOUR
                  <br />
                  <span style={{ color: marigold }}>
                    STUDIO
                  </span>
                  <br />
                  IS READY.
                </h1>

                <p
                  className="font-display mt-5 max-w-md text-base leading-[1.2]"
                  style={{ color: "#B9B09C" }}
                >
                  Sign in and continue creating marketing content
                  for your business.
                </p>
              </div>

              {/* FORM HEADER */}
              <div>
                <div
                  className="font-mono text-[9px] tracking-[0.18em]"
                  style={{ color: textMuted }}
                >
                  RETURNING CREATOR
                </div>

                <h2 className="font-display mt-2 text-2xl font-semibold tracking-[-0.025em] sm:text-3xl">
                  Welcome back.
                </h2>

                <p
                  className="mt-2 max-w-sm text-sm leading-relaxed"
                  style={{ color: textMuted }}
                >
                  Enter your email and we&apos;ll send you a secure
                  one-time sign-in link.
                </p>
              </div>

              {/* ERROR */}
              {error && (
                <div
                  role="alert"
                  className="mt-6 rounded-xl px-4 py-3 text-sm"
                  style={{
                    background: "rgba(214,73,31,0.1)",
                    border: "1px solid rgba(214,73,31,0.35)",
                    color: signal,
                  }}
                >
                  {error}
                </div>
              )}

              {/* EMAIL */}
              <div
                className="mt-7 rounded-2xl p-1"
                style={{ background: paper }}
              >
                <div
                  className="rounded-xl p-4 sm:p-5"
                  style={{
                    border: "1px dashed #B9AD91",
                  }}
                >
                  <label
                    htmlFor="email"
                    className="font-mono block text-[9px] tracking-[0.16em]"
                    style={{ color: "#6B6250" }}
                  >
                    EMAIL ADDRESS
                  </label>

                  <input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    autoComplete="email"
                    onChange={(e) => setEmail(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleSubmit();
                    }}
                    className="login-input font-display mt-2 w-full bg-transparent text-lg font-medium"
                    style={{ color: ink }}
                  />
                </div>
              </div>

              {/* CTA */}
              <button
                type="button"
                onClick={handleSubmit}
                disabled={loading || !email.trim()}
                className="
                  group
                  mt-4
                  flex
                  min-h-[56px]
                  w-full
                  items-center
                  justify-center
                  gap-3
                  rounded-[13px]
                  px-6
                  font-display
                  text-sm
                  font-bold
                  transition-all
                  duration-200
                  hover:-translate-y-0.5
                  active:translate-y-0
                  disabled:cursor-not-allowed
                  disabled:hover:translate-y-0
                "
                style={{
                  background:
                    loading || !email.trim()
                      ? "#5A4A22"
                      : marigold,
                  color:
                    loading || !email.trim()
                      ? "#8C7C52"
                      : ink,
                }}
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Sending link...
                  </>
                ) : (
                  <>
                    SEND MAGIC LINK
                    <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </>
                )}
              </button>

              {/* TRUST */}
              <div
                className="mt-6 flex items-start gap-3 border-t pt-5"
                style={{ borderColor: rule }}
              >
                <ShieldCheck
                  className="mt-0.5 h-4 w-4 shrink-0"
                  style={{ color: marigold }}
                />

                <p
                  className="font-mono text-[9px] leading-[1.5]"
                  style={{ color: textMuted }}
                >
                  SECURE SIGN-IN
                  <br />
                  Your magic link expires after 10 minutes.
                </p>
              </div>

              {/* SIGNUP */}
              <p
                className="mt-7 text-sm"
                style={{ color: textMuted }}
              >
                New to INRASTUDIO?{" "}
                <Link
                  href="/signup"
                  className="font-semibold transition-opacity hover:opacity-70"
                  style={{ color: marigold }}
                >
                  Create your studio
                </Link>
              </p>
            </div>
          </section>
        </div>
      </main>

      {/* FOOTER LINE */}
      <footer className="px-5 pb-6 sm:px-8">
        <div className="mx-auto flex max-w-[1180px] items-center justify-between">
          <span
            className="font-mono text-[8px] tracking-[0.14em]"
            style={{ color: "#514B3E" }}
          >
            ONE PHOTO / FULL CAMPAIGN
          </span>

          <div className="flex items-center gap-2">
            <Clock3 className="h-3 w-3" style={{ color: "#514B3E" }} />

            <span
              className="font-mono text-[8px] tracking-[0.1em]"
              style={{ color: "#514B3E" }}
            >
              10 MIN LINK
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}