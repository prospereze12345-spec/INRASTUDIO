"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Loader2, CheckCircle2, ImageIcon, Type, Video, ShieldCheck } from "lucide-react";
import { Logo } from "@/components/Logo";
import { apiFetch } from "@/lib/auth";

/* Same "Campaign Ticket" token system as login/dashboard. */
const ink = "#16140F";
const panel = "#1D1A14";
const rule = "#38321F";
const paper = "#EDE6D6";
const paperMuted = "#C9BFA4";
const marigold = "#E8A33D";
const signal = "#D6491F";
const textPrimary = "#F3ECDD";
const textMuted = "#8C8368";

const COUNTRIES = [
  "Nigeria", "United Kingdom", "United States", "Ghana", "Kenya", "South Africa", "Other",
];

const INCLUDED = [
  { icon: ImageIcon, label: "Flyer design" },
  { icon: Type,      label: "Social caption" },
  { icon: Video,     label: "Promo video" },
];

export default function SignupPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [country, setCountry] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  async function handleSubmit() {
    if (loading) return;

    setError("");
    const cleanEmail = email.trim().toLowerCase();
    const cleanName = fullName.trim();

    if (!cleanName) { setError("Your name is required."); return; }
    if (!cleanEmail) { setError("Email is required."); return; }
    if (!country) { setError("Please select a country."); return; }

    setLoading(true);

    try {
      // NOTE: the original code only included a login endpoint. This assumes
      // a matching signup endpoint that also issues a magic link — swap the
      // path/body below for whatever your API actually expects.
      await apiFetch("/api/auth/signup/", {
        method: "POST",
        body: JSON.stringify({ full_name: cleanName, email: cleanEmail, country }),
      });

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Sign up failed. Please try again.");
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

      {/* Toast */}
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
          <p className="font-semibold text-sm">Account ticket raised</p>
          <p className="font-mono text-[11px] mt-0.5" style={{ color: textMuted }}>CHECK YOUR INBOX TO CONFIRM</p>
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

          {/* LEFT — the form */}
          <div className="p-8 sm:p-10 flex flex-col justify-center">
            <span className="font-mono text-xs tracking-[0.2em]" style={{ color: textMuted }}>NEW ACCOUNT TICKET</span>
            <h1 className="font-display text-2xl sm:text-3xl font-semibold mt-2 leading-tight">
              Open your account.
            </h1>
            <p className="mt-3 text-sm sm:text-base max-w-sm" style={{ color: textMuted }}>
              A few details, then we&apos;ll send a link to confirm — same as logging in, no password to set.
            </p>

            {error && (
              <p className="mt-6 text-sm px-4 py-3 rounded-xl" style={{ background: "rgba(214,73,31,0.1)", border: `1px solid rgba(214,73,31,0.35)`, color: signal }}>
                {error}
              </p>
            )}

            <div className="mt-6 rounded-2xl p-1" style={{ background: paper }}>
              <div className="rounded-xl p-4 sm:p-5 flex flex-col gap-4" style={{ border: `2px dashed ${paperMuted}` }}>
                <div>
                  <label className="font-mono text-[11px] tracking-[0.15em]" style={{ color: "#6b6250" }} htmlFor="fullName">
                    FULL NAME
                  </label>
                  <input
                    id="fullName"
                    type="text"
                    placeholder="Ada Obi"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full mt-1.5 bg-transparent outline-none text-lg font-medium placeholder:opacity-40"
                    style={{ color: ink }}
                  />
                </div>
                <div style={{ borderTop: `1px dashed ${paperMuted}` }} className="pt-4">
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
                    className="w-full mt-1.5 bg-transparent outline-none text-lg font-medium placeholder:opacity-40"
                    style={{ color: ink }}
                  />
                </div>
                <div style={{ borderTop: `1px dashed ${paperMuted}` }} className="pt-4">
                  <label className="font-mono text-[11px] tracking-[0.15em]" style={{ color: "#6b6250" }} htmlFor="country">
                    COUNTRY
                  </label>
                  <select
                    id="country"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full mt-1.5 bg-transparent outline-none text-lg font-medium"
                    style={{ color: country ? ink : "#6b6250" }}
                  >
                    <option value="" disabled>Select your country</option>
                    {COUNTRIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <button
              onClick={handleSubmit}
              disabled={loading || !email.trim() || !fullName.trim() || !country}
              className="flex items-center justify-center gap-2 w-full mt-5 px-7 py-4 rounded-full font-bold transition-transform hover:-translate-y-0.5 active:translate-y-0 disabled:cursor-not-allowed min-h-[44px]"
              style={{
                background: loading || !email.trim() || !fullName.trim() || !country ? "#5A4A22" : marigold,
                color: loading || !email.trim() || !fullName.trim() || !country ? "#8C7C52" : ink,
              }}
            >
              {loading
                ? <><Loader2 className="w-4 h-4 animate-spin" /> Raising your ticket…</>
                : "Create my account"
              }
            </button>

            <p className="mt-6 text-sm" style={{ color: textMuted }}>
              Already have one?{" "}
              <Link href="/login" className="font-semibold" style={{ color: marigold }}>
                Log in instead
              </Link>
            </p>
          </div>

          {/* RIGHT — what's waiting once they're in, framed like the
              dashboard's "this campaign includes" checklist */}
          <div className="hidden lg:flex flex-col justify-center p-10" style={{ borderLeft: `1px dashed ${rule}` }}>
            <span className="font-mono text-xs tracking-[0.2em]" style={{ color: textMuted }}>WHAT'S WAITING FOR YOU</span>
            <h2 className="font-display text-xl font-semibold mt-3">One photo in, a full campaign out.</h2>
            <p className="text-sm mt-2" style={{ color: textMuted }}>
              Every account starts on a free trial. Upload a product photo and your first campaign includes:
            </p>
            <div className="mt-6 flex flex-col gap-1">
              {INCLUDED.map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-3 px-4 py-3 rounded-xl" style={{ background: ink, border: `1px solid ${rule}` }}>
                  <Icon className="w-4 h-4 shrink-0" style={{ color: marigold }} />
                  <span className="text-sm font-medium">{label}</span>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-2 mt-6 font-mono text-[11px] tracking-[0.1em]" style={{ color: textMuted }}>
              <ShieldCheck className="w-3.5 h-3.5" style={{ color: marigold }} /> NO CARD NEEDED TO START
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}