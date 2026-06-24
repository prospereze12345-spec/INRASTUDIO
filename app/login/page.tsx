"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Loader2,
  Mail,
  MousePointerClick,
  Clock,
  CheckCircle,
} from "lucide-react";
import { Logo } from "@/components/Logo";
import { apiFetch } from "@/lib/auth";

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
    <div className="min-h-screen bg-white flex flex-col text-slate-900 font-sans relative">

      {/* Toast — slides in, auto-dismisses after 3s */}
      <div
        className={`fixed top-6 right-6 z-50 flex items-center gap-3 bg-green-50 border border-green-200 text-green-700 px-5 py-3.5 rounded-2xl shadow-xl transition-all duration-500 ${
          success ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-3 pointer-events-none"
        }`}
      >
        <CheckCircle className="w-5 h-5 shrink-0" />
        <div>
          <p className="font-semibold text-sm">Magic link sent!</p>
          <p className="text-xs text-green-600 mt-0.5">Check your inbox — link expires in 10 min.</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 p-6 flex items-center">
        <Link href="/" className="flex items-center gap-2">
          <Logo className="w-8 h-8 rounded-lg" />
          <span className="font-display font-medium text-xl tracking-widest text-[#0a1128]">
            INRASTUDIO
          </span>
        </Link>
      </nav>

      <div className="flex-1 flex">

        {/* LEFT */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 sm:px-16 lg:px-24 py-24">
          <div className="w-full max-w-md mx-auto">

            <h1 className="text-3xl sm:text-4xl font-display font-bold text-slate-900 mb-2 tracking-tight">
              Log in to your Account
            </h1>
            <p className="text-slate-500 mb-8 font-light text-base">
              Enter your email and we&apos;ll send you a magic link to log in. No passwords needed.
            </p>

            {error && (
              <p className="mb-6 text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-3">
                {error}
              </p>
            )}

            <div className="space-y-6">
              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-700" htmlFor="email">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="john@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") handleSubmit(); }}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 outline-none transition-all placeholder:text-slate-400"
                />
              </div>

              <button
                onClick={handleSubmit}
                disabled={loading || !email.trim()}
                className="w-full py-4 rounded-xl bg-cyan-500 text-white font-semibold hover:bg-cyan-600 active:scale-[0.98] transition-all shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading
                  ? <><Loader2 className="w-4 h-4 animate-spin" /> Sending…</>
                  : "Send Magic Link"
                }
              </button>
            </div>

            <p className="mt-8 text-center text-sm text-slate-500">
              Don&apos;t have an account?{" "}
              <Link href="/signup" className="text-cyan-600 font-semibold hover:underline">
                Create an account
              </Link>
            </p>

          </div>
        </div>

        {/* RIGHT */}
        <div className="hidden lg:flex w-1/2 bg-[#0a1128] relative overflow-hidden flex-col items-center justify-center p-12 text-white border-l border-white/5">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-cyan-900/20 via-[#0a1128] to-[#0a1128]" />

          <div className="relative z-10 w-full max-w-md">
            <h2 className="text-3xl font-display font-medium mb-10 text-center">
              How Magic Links Work
            </h2>

            <div className="space-y-8 relative before:absolute before:inset-0 before:ml-[1.4rem] before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-white/20 before:to-transparent">
              {[
                { icon: Mail,             bg: "bg-cyan-500",  title: "Input Email",  desc: "Enter your registered email address in the field provided." },
                { icon: MousePointerClick, bg: "bg-slate-800", title: "Send Link",    desc: "Click the send button to receive your secure login link." },
                { icon: Clock,            bg: "bg-slate-800", title: "Check Inbox",  desc: "Check your email. The magic link expires in 10 minutes for security." },
                { icon: CheckCircle,      bg: "bg-cyan-500",  title: "You're In!",   desc: "Click the link and you'll be automatically securely logged in." },
              ].map(({ icon: Icon, bg, title, desc }) => (
                <div key={title} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                  <div className={`flex items-center justify-center w-12 h-12 rounded-full border-4 border-[#0a1128] ${bg} text-[#0a1128] shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="w-[calc(100%-4rem)] md:w-[calc(50%-3rem)] p-4 rounded-2xl border border-white/10 bg-white/5 backdrop-blur shadow-sm">
                    <h3 className="font-semibold text-lg mb-1 text-white">{title}</h3>
                    <p className="text-slate-400 text-sm">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
