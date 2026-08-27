"use client";

import { useState } from "react";
import Link from "next/link";
import { Logo } from "@/components/Logo";
import { apiFetch } from "@/lib/auth";
import { Loader2, Mail, User, Globe, CheckCircle, Sparkles, PenTool, Video, Zap } from "lucide-react";

// ─── Design tokens (same as dashboard) ────────────────────────────
const ink = "#16140F";
const panel = "#1D1A14";
const rule = "#38321F";
const paper = "#EDE6D6";
const paperMuted = "#C9BFA4";
const marigold = "#E8A33D";
const signal = "#D6491F";
const textPrimary = "#F3ECDD";
const textMuted = "#8C8368";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [country, setCountry] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  async function handleSubmit() {
    if (loading) return;
    setError("");
    if (!name.trim() || !email.trim() || !country.trim()) {
      setError("All fields are required.");
      return;
    }
    setLoading(true);
    try {
      await apiFetch("/api/auth/signup/", {
        method: "POST",
        body: JSON.stringify({ full_name: name, email: email.trim().toLowerCase(), country: country.trim() }),
      });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 4000);
      // After success, optionally redirect to login
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=IBM+Plex+Mono:wght@400;500;600;700&display=swap');
        .font-display { font-family: 'Space Grotesk', ui-sans-serif, system-ui, sans-serif; }
        .font-mono { font-family: 'IBM Plex Mono', ui-monospace, monospace; }
        .job-btn { transition: transform .15s ease; }
        .job-btn:hover:not(:disabled) { transform: translateY(-2px); }
        .job-btn:active:not(:disabled) { transform: translateY(0); }
        .stamp { border: 2px dashed ${signal}; transform: rotate(-6deg); }
      `}</style>

      <div className="min-h-screen flex items-center justify-center p-4" style={{ background: ink }}>
        <div className="w-full max-w-4xl rounded-3xl overflow-hidden" style={{ background: panel, border: `1px solid ${rule}` }}>

          {/* ─── Toast ─── */}
          <div
            className={`fixed top-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-xl transition-all duration-500 ${
              success ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-3 pointer-events-none"
            }`}
            style={{ background: paper, border: `1px solid ${paperMuted}`, color: ink }}
          >
            <div className="w-5 h-5 rounded-full flex items-center justify-center" style={{ background: "#5FA05F", color: ink }}>
              <CheckCircle className="w-4 h-4" />
            </div>
            <div>
              <p className="font-semibold text-sm">Account created!</p>
              <p className="text-xs" style={{ color: "#6b6250" }}>Check your email to verify.</p>
            </div>
          </div>

          {/* ─── Ticket header ─── */}
          <div className="p-6 sm:p-8 pb-5 flex flex-col sm:flex-row justify-between items-start gap-4">
            <div>
              <span className="font-mono text-[11px] tracking-[0.2em]" style={{ color: textMuted }}>
                CAMPAIGN TICKET · {new Date().toLocaleDateString("en-GB", { weekday: "short", day: "2-digit", month: "short" }).toUpperCase()}
              </span>
              <h1 className="font-display text-2xl sm:text-3xl font-semibold mt-1.5 leading-tight" style={{ color: textPrimary }}>
                Start your free trial
              </h1>
              <p className="mt-2 text-sm max-w-sm" style={{ color: textMuted }}>
                Create an account and start making flyers in minutes.
              </p>
            </div>
            <div className="stamp w-24 h-24 sm:w-28 sm:h-28 rounded-full flex flex-col items-center justify-center shrink-0">
              <span className="font-mono font-bold text-2xl sm:text-3xl" style={{ color: signal }}>✨</span>
              <span className="font-mono text-[9px] tracking-widest mt-1 text-center px-2" style={{ color: signal }}>FREE</span>
            </div>
          </div>

          {/* ─── Perforation ─── */}
          <div className="relative h-px mx-6 sm:mx-8">
            <div style={{ borderTop: `2px dashed ${rule}` }} />
            <div className="absolute -left-[10px] -top-[9px] w-[18px] h-[18px] rounded-full" style={{ background: ink }} />
            <div className="absolute -right-[10px] -top-[9px] w-[18px] h-[18px] rounded-full" style={{ background: ink }} />
          </div>

          {/* ─── Body ─── */}
          <div className="p-6 sm:p-8 pt-6">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-8">

              {/* Left – Form */}
              <div className="lg:col-span-3 space-y-4">
                <div className="space-y-1.5">
                  <label className="font-mono text-[11px] tracking-[0.2em]" style={{ color: textMuted }} htmlFor="signupName">
                    FULL NAME
                  </label>
                  <input
                    id="signupName"
                    type="text"
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border-2 outline-none transition-all"
                    style={{ background: paper, borderColor: paperMuted, color: ink }}
                    onFocus={(e) => e.currentTarget.style.borderColor = marigold}
                    onBlur={(e) => e.currentTarget.style.borderColor = paperMuted}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-mono text-[11px] tracking-[0.2em]" style={{ color: textMuted }} htmlFor="signupEmail">
                    EMAIL ADDRESS
                  </label>
                  <input
                    id="signupEmail"
                    type="email"
                    placeholder="john@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border-2 outline-none transition-all"
                    style={{ background: paper, borderColor: paperMuted, color: ink }}
                    onFocus={(e) => e.currentTarget.style.borderColor = marigold}
                    onBlur={(e) => e.currentTarget.style.borderColor = paperMuted}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-mono text-[11px] tracking-[0.2em]" style={{ color: textMuted }} htmlFor="signupCountry">
                    COUNTRY
                  </label>
                  <input
                    id="signupCountry"
                    type="text"
                    placeholder="United Kingdom"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border-2 outline-none transition-all"
                    style={{ background: paper, borderColor: paperMuted, color: ink }}
                    onFocus={(e) => e.currentTarget.style.borderColor = marigold}
                    onBlur={(e) => e.currentTarget.style.borderColor = paperMuted}
                  />
                </div>

                {error && (
                  <p className="text-sm px-4 py-3 rounded-xl" style={{ background: "rgba(214,73,31,0.08)", border: `1px solid rgba(214,73,31,0.25)`, color: signal }}>
                    {error}
                  </p>
                )}

                <button
                  onClick={handleSubmit}
                  disabled={loading || !name.trim() || !email.trim() || !country.trim()}
                  className="job-btn w-full py-4 rounded-full font-bold flex items-center justify-center gap-2 disabled:opacity-50"
                  style={{ background: loading || !name.trim() || !email.trim() || !country.trim() ? "#5A4A22" : marigold, color: ink }}
                >
                  {loading ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /> Creating…</>
                  ) : (
                    "Create account"
                  )}
                </button>

                <p className="text-center text-sm" style={{ color: textMuted }}>
                  Already have an account?{" "}
                  <Link href="/login" className="font-semibold hover:underline" style={{ color: marigold }}>
                    Log in
                  </Link>
                </p>
              </div>

              {/* Right – Perks */}
              <div className="lg:col-span-2 space-y-3 pt-1 lg:border-l lg:pl-6" style={{ borderColor: rule }}>
                <p className="font-mono text-[11px] tracking-[0.2em] mb-2" style={{ color: textMuted }}>WHAT YOU GET</p>

                {[
                  { icon: PenTool, label: "Flyer designs", desc: "Professional templates for any product." },
                  { icon: Sparkles, label: "AI captions", desc: "Ready‑to‑post copy in seconds." },
                  { icon: Video, label: "Promo videos", desc: "Short clips that sell." },
                  { icon: Zap, label: "5 free campaigns", desc: "No card required to start." },
                ].map(({ icon: Icon, label, desc }) => (
                  <div key={label} className="flex items-start gap-3 p-3 rounded-xl transition-colors" style={{ border: `1px solid rgba(255,255,255,0.06)`, background: "rgba(255,255,255,0.03)" }}>
                    <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0" style={{ background: marigold, color: ink }}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-semibold text-sm" style={{ color: textPrimary }}>{label}</p>
                      <p className="text-xs" style={{ color: textMuted }}>{desc}</p>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          </div>

          {/* ─── Footer perforation ─── */}
          <div className="relative h-px mx-6 sm:mx-8 mt-1">
            <div style={{ borderTop: `2px dashed ${rule}` }} />
            <div className="absolute -left-[10px] -top-[9px] w-[18px] h-[18px] rounded-full" style={{ background: ink }} />
            <div className="absolute -right-[10px] -top-[9px] w-[18px] h-[18px] rounded-full" style={{ background: ink }} />
          </div>

          <div className="px-6 sm:px-8 py-4 flex flex-col sm:flex-row justify-between items-center gap-2 text-[10px] font-mono tracking-wide" style={{ color: "#5A523F" }}>
            <span>CAMPAIGN TICKET · SIGNUP</span>
            <span>v1.0 · NO CREDIT CARD NEEDED</span>
          </div>
        </div>
      </div>
    </>
  );
}