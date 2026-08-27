"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Loader2, CheckCircle2, Mail, MousePointerClick, Clock, ShieldCheck } from "lucide-react";
import { Logo } from "@/components/Logo";
import { apiFetch } from "@/lib/auth";

/* ────────────────────────────────────────────────────────────────
   Same "Campaign Ticket" token system as the dashboard — kraft
   paper, marigold accent, mono labels, dashed perforation. Kept in
   one place so login/signup/dashboard never drift out of sync.
   ──────────────────────────────────────────────────────────────── */
const ink = "#16140F";
const panel = "#1D1A14";
const rule = "#38321F";
const paper = "#EDE6D6";
const paperMuted = "#C9BFA4";
const marigold = "#E8A33D";
const signal = "#D6491F";
const textPrimary = "#F3ECDD";
const textMuted = "#8C8368";

function Perforation() {
  return (
    <div className="relative h-px mx-8 sm:mx-10">
      <div style={{ borderTop: `2px dashed ${rule}` }} />
      <div className="absolute -left-[10px] -top-[9px] w-[18px] h-[18px] rounded-full" style={{ background: ink }} />
      <div className="absolute -right-[10px] -top-[9px] w-[18px] h-[18px] rounded-full" style={{ background: ink }} />
    </div>
  );
}

const STEPS = [
  { icon: Mail,               title: "Enter your email",  desc: "Type in the address your account is registered with." },
  { icon: MousePointerClick,  title: "Send the link",     desc: "We post a one-time link straight to your inbox." },
  { icon: Clock,              title: "Open within 10 min", desc: "The link stays live for ten minutes, then it expires." },
  { icon: ShieldCheck,        title: "You're through",    desc: "Click it once and you're back at your dashboard, signed in." },
];

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

      // Auto-hide toast after 3 seconds
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen font-sans flex flex-col relative" style={{ background: ink, color: textPrimary }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=IBM+Plex+Mono:wght@400;500;600;700&display=swap');
        .font-display { font-family: 'Space Grotesk', ui-sans-serif, system-ui, sans-serif; }
        .font-mono { font-family: 'IBM Plex Mono', ui-monospace, monospace; }
      `}</style>

      {/* Toast — slides in, auto-dismisses after 3s */}
      <div
        role="status"
        aria-live="polite"
        className={`fixed top-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-xl transition-all duration-500 ${
          success ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-3 pointer-events-none"
        }`}
        style={{ background: panel, border: `1px solid ${marigold}55`, color: textPrimary }}
      >
        <CheckCircle2 className="w-5 h-5 shrink-0" style={{ color: marigold }} />
        <div>
          <p className="font-semibold text-sm">Link sent to your inbox</p>
          <p className="font-mono text-[11px] mt-0.5" style={{ color: textMuted }}>EXPIRES IN 10 MINUTES</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="p-6 flex items-center">
        <Link href="/" className="inline-flex items-center gap-3" style={{ color: textMuted }}>
          <ArrowLeft className="w-4 h-4" />
          <Logo className="w-8 h-8 rounded-lg" />
          <span className="font-mono text-[11px] tracking-[0.15em]">BACK TO HOME</span>
        </Link>
      </nav>

      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 py-10">
        <div className="w-full max-w-4xl rounded-3xl overflow-hidden grid grid-cols-1 lg:grid-cols-2" style={{ background: panel, border: `1px solid ${rule}` }}>

          {/* LEFT — the actual form, on the same kraft-paper stock as the
              upload card on the dashboard, so the two moments feel related */}
          <div className="p-8 sm:p-10 flex flex-col justify-center">
            <span className="font-mono text-xs tracking-[0.2em]" style={{ color: textMuted }}>ACCESS TICKET</span>
            <h1 className="font-display text-2xl sm:text-3xl font-semibold mt-2 leading-tight">
              Log in with a magic link.
            </h1>
            <p className="mt-3 text-sm sm:text-base max-w-sm" style={{ color: textMuted }}>
              No password to remember. Enter your email and we&apos;ll post a one-time link straight to your inbox.
            </p>

            {error && (
              <p className="mt-6 text-sm px-4 py-3 rounded-xl" style={{ background: "rgba(214,73,31,0.1)", border: `1px solid rgba(214,73,31,0.35)`, color: signal }}>
                {error}
              </p>
            )}

            <div className="mt-6 rounded-2xl p-1" style={{ background: paper }}>
              <div className="rounded-xl p-4 sm:p-5" style={{ border: `2px dashed ${paperMuted}` }}>
                <label className="font-mono text-[11px] tracking-[0.15em]" style={{ color: "#6b6250" }} htmlFor="email">
                  EMAIL ADDRESS
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") handleSubmit(); }}
                  className="w-full mt-2 bg-transparent outline-none text-lg font-medium placeholder:opacity-40"
                  style={{ color: ink }}
                />
              </div>
            </div>

            <button
              onClick={handleSubmit}
              disabled={loading || !email.trim()}
              className="flex items-center justify-center gap-2 w-full mt-5 px-7 py-4 rounded-full font-bold transition-transform hover:-translate-y-0.5 active:translate-y-0 disabled:cursor-not-allowed min-h-[44px]"
              style={{
                background: loading || !email.trim() ? "#5A4A22" : marigold,
                color: loading || !email.trim() ? "#8C7C52" : ink,
              }}
            >
              {loading
                ? <><Loader2 className="w-4 h-4 animate-spin" /> Sending…</>
                : "Send my magic link"
              }
            </button>

            <p className="mt-6 text-sm" style={{ color: textMuted }}>
              New here?{" "}
              <Link href="/signup" className="font-semibold" style={{ color: marigold }}>
                Create an account
              </Link>
            </p>
          </div>

          {/* RIGHT — how it works, laid out like ticket stub steps rather
              than a generic numbered timeline */}
          <div className="hidden lg:flex flex-col justify-center p-10" style={{ borderLeft: `1px dashed ${rule}` }}>
            <span className="font-mono text-xs tracking-[0.2em]" style={{ color: textMuted }}>HOW IT WORKS</span>
            <div className="mt-6 flex flex-col">
              {STEPS.map((step, i) => (
                <div key={step.title}>
                  <div className="flex items-start gap-4 py-4">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0" style={{ border: `1px solid ${rule}`, background: ink }}>
                      <step.icon className="w-4 h-4" style={{ color: marigold }} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm">{step.title}</h3>
                      <p className="text-sm mt-1" style={{ color: textMuted }}>{step.desc}</p>
                    </div>
                  </div>
                  {i < STEPS.length - 1 && <Perforation />}
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}