"use client";

import Link from "next/link";
import { Sparkles } from "lucide-react";
import { Logo } from "@/components/Logo";

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      
      {/* Simple Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 p-6 flex items-center">
        <Link href="/" className="flex items-center gap-2">
          <Logo className="w-8 h-8 rounded-lg" />
            <span className="font-display font-medium text-xl tracking-widest text-[#0a1128]">INRASTUDIO</span>
        </Link>
      </nav>

      <div className="flex-1 flex items-center justify-center p-4 py-24">
        <div className="w-full max-w-md bg-white p-8 sm:p-12 rounded-3xl shadow-xl border border-slate-100">
          
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-slate-900 mb-2 text-center tracking-tight">
            Create an Account
          </h1>
          <p className="text-slate-500 mb-8 text-center text-sm font-light">
            Start generating high-converting AI marketing assets.
          </p>
        
        <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-700" htmlFor="name"> Name</label>
            <input 
              id="name"
              type="text" 
              placeholder="e.g. John"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 outline-none transition-all placeholder:text-slate-400"
            />
          </div>
          
          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-700" htmlFor="email">Email Address</label>
            <input 
              id="email"
              type="email" 
              placeholder="john@example.com"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 outline-none transition-all placeholder:text-slate-400"
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-700" htmlFor="country">Country</label>
            <div className="relative">
              <select 
                id="country"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 outline-none transition-all appearance-none text-slate-900"
                defaultValue=""
              >
                <option value="" disabled hidden>Select your country</option>
                <option value="NG">Nigeria</option>
                <option value="KE">Kenya</option>
                <option value="GH">Ghana</option>
                <option value="ZA">South Africa</option>
                <option value="EG">Egypt</option>
                <option value="OTHER">Other</option>
              </select>
              <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
              </div>
            </div>
          </div>
          
          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-700" htmlFor="password">Password</label>
            <input 
              id="password"
              type="password" 
              placeholder="••••••••"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 outline-none transition-all placeholder:text-slate-400"
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-700" htmlFor="confirm-password">Confirm Password</label>
            <input 
              id="confirm-password"
              type="password" 
              placeholder="••••••••"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 outline-none transition-all placeholder:text-slate-400"
            />
          </div>
          
          <button className="w-full py-4 rounded-xl bg-cyan-500 text-white font-semibold hover:bg-cyan-600 active:scale-[0.98] transition-all shadow-lg shadow-cyan-500/25 mt-6">
            Create account
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-slate-500">
          Already have an account? <Link href="/login" className="text-cyan-600 font-semibold hover:underline">Log in</Link>
        </div>
      </div>
     </div>
    </div>
  );
}
