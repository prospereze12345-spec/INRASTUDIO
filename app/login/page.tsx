"use client";

import Link from "next/link";
import { Sparkles, Mail, MousePointerClick, Clock, CheckCircle } from "lucide-react";
import { Logo } from "@/components/Logo";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col text-slate-900 font-sans">
      {/* Simple Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 p-6 flex items-center">
        <Link href="/" className="flex items-center gap-2">
          <Logo className="w-8 h-8 rounded-lg" />
            <span className="font-display font-medium text-xl tracking-widest text-[#0a1128]">INRASTUDIO</span>
        </Link>
      </nav>

      <div className="flex-1 flex">
        {/* Left Column: Form */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 sm:px-16 lg:px-24 py-24">
          <div className="w-full max-w-md mx-auto relative">
            <h1 className="text-3xl sm:text-4xl font-display font-bold text-slate-900 mb-2 tracking-tight">
            Log in to your Account
          </h1>
          <p className="text-slate-500 mb-8 font-light text-base">
            Enter your email and we&apos;ll send you a magic link to log in. No passwords needed.
          </p>
          
          <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
            
            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-700" htmlFor="email">Email Address</label>
              <input 
                id="email"
                type="email" 
                placeholder="john@example.com"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 outline-none transition-all placeholder:text-slate-400"
              />
            </div>
            
            <button className="w-full py-4 rounded-xl bg-cyan-500 text-white font-semibold hover:bg-cyan-600 active:scale-[0.98] transition-all shadow-lg shadow-cyan-500/20">
              Send Magic Link
            </button>
            
          </form>

          <div className="mt-8 text-center text-sm text-slate-500">
            Don&apos;t have an account? <Link href="/signup" className="text-cyan-600 font-semibold hover:underline">Create an account</Link>
          </div>
        </div>
      </div>

      {/* Right Column: How it works */}
      <div className="hidden lg:flex w-1/2 bg-[#0a1128] relative overflow-hidden flex-col items-center justify-center p-12 text-white border-l border-white/5">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-cyan-900/20 via-[#0a1128] to-[#0a1128]" />
        
        <div className="relative z-10 w-full max-w-md">
          <h2 className="text-3xl font-display font-medium mb-10 text-center">How Magic Links Work</h2>
          
          <div className="space-y-8 relative before:absolute before:inset-0 before:ml-[1.4rem] before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-white/20 before:to-transparent">
            {/* Step 1 */}
            <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
              <div className="flex items-center justify-center w-12 h-12 rounded-full border-4 border-[#0a1128] bg-cyan-500 text-[#0a1128] shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                <Mail className="w-5 h-5" />
              </div>
              <div className="w-[calc(100%-4rem)] md:w-[calc(50%-3rem)] p-4 rounded-2xl border border-white/10 bg-white/5 backdrop-blur shadow-sm">
                <h3 className="font-semibold text-lg mb-1 text-white">Input Email</h3>
                <p className="text-slate-400 text-sm">Enter your registered email address in the field provided.</p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
              <div className="flex items-center justify-center w-12 h-12 rounded-full border-4 border-[#0a1128] bg-slate-800 text-cyan-400 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                <MousePointerClick className="w-5 h-5" />
              </div>
              <div className="w-[calc(100%-4rem)] md:w-[calc(50%-3rem)] p-4 rounded-2xl border border-white/10 bg-white/5 backdrop-blur shadow-sm">
                <h3 className="font-semibold text-lg mb-1 text-white">Send Link</h3>
                <p className="text-slate-400 text-sm">Click the send button to receive your secure login link.</p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
              <div className="flex items-center justify-center w-12 h-12 rounded-full border-4 border-[#0a1128] bg-slate-800 text-cyan-400 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                <Clock className="w-5 h-5" />
              </div>
              <div className="w-[calc(100%-4rem)] md:w-[calc(50%-3rem)] p-4 rounded-2xl border border-white/10 bg-white/5 backdrop-blur shadow-sm">
                <h3 className="font-semibold text-lg mb-1 text-white">Check Inbox</h3>
                <p className="text-slate-400 text-sm">Check your email. The magic link expires in 10 minutes for security.</p>
              </div>
            </div>

            {/* Step 4 */}
            <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
              <div className="flex items-center justify-center w-12 h-12 rounded-full border-4 border-[#0a1128] bg-cyan-500 text-[#0a1128] shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                <CheckCircle className="w-5 h-5" />
              </div>
              <div className="w-[calc(100%-4rem)] md:w-[calc(50%-3rem)] p-4 rounded-2xl border border-cyan-500/30 bg-cyan-500/10 backdrop-blur shadow-sm">
                <h3 className="font-semibold text-lg mb-1 text-white">You&apos;re In!</h3>
                <p className="text-slate-400 text-sm">Click the link and you&apos;ll be automatically securely logged in.</p>
              </div>
            </div>
          </div>

        </div>
      </div>

    </div>
  </div>
  );
}
