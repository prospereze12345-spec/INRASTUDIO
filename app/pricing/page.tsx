"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Menu, X, CheckCircle, Sparkles, Image as ImageIcon, ArrowRight, Star, Facebook, Instagram } from "lucide-react";
import { Logo } from "@/components/Logo";
import { Navbar } from "@/components/Navbar";
import Link from "next/link";



function Footer() {
  return (
    <footer className="pt-24 pb-12 px-6 bg-[#030712] border-t border-white/5 relative overflow-hidden mt-12 w-full">
       <div className="max-w-7xl mx-auto flex flex-col lg:flex-row justify-between items-start gap-16 pb-40 relative z-20">
         {/* Big Text Block */}
         <div className="flex-1 max-w-3xl">
           <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-medium text-slate-200 tracking-tight leading-tight">
             Ready to create something cool together, or just explore our solutions.
           </h2>
         </div>

         {/* Navigation Links */}
                  <div className="flex flex-wrap gap-12 sm:gap-24 uppercase text-xs tracking-widest font-mono shrink-0">
            <div className="flex flex-col gap-5">
              <span className="text-slate-600 mb-2 font-bold">(EXPLORE)</span>
              <Link href="/privacy" className="text-slate-300 hover:text-white transition-colors">Privacy Policy</Link>
              <Link href="/terms" className="text-slate-300 hover:text-white transition-colors">Terms and Condition</Link>
              <Link href="/disclosure" className="text-slate-300 hover:text-white transition-colors">Disclosure</Link>
            </div>
            <div className="flex flex-col gap-5">
              <span className="text-slate-600 mb-2 font-bold">(CONNECT)</span>
              <a href="#" className="text-slate-300 hover:text-white transition-colors flex items-center gap-2 group"><Facebook className="w-4 h-4 text-slate-400" /> FACEBOOK <ArrowRight className="w-3 h-3 -rotate-45 group-hover:text-cyan-400 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" /></a>
              <a href="#" className="text-slate-300 hover:text-white transition-colors flex items-center gap-2 group"><Instagram className="w-4 h-4 text-slate-400" /> INSTAGRAM <ArrowRight className="w-3 h-3 -rotate-45 group-hover:text-cyan-400 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" /></a>
            </div>
         </div>
       </div>

       <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between pt-12 border-t border-white/5 mt-12 text-sm text-slate-500 font-mono z-30 relative gap-4">
          <div className="flex items-center gap-3">
             <Logo className="w-8 h-8 rounded-lg" />
             <span className="font-bold text-white tracking-widest text-sm">INRASTUDIO</span>
          </div>
          <p>© 2026 INRASTUDIO AI Marketing Studio.</p>
       </div>
    </footer>
  );
}

function Pricing() {
  return (
    <section id="pricing" className="py-32 px-6 max-w-6xl mx-auto">
       <div className="text-center mb-20 md:mt-24 mt-16">
         <motion.h1 initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} className="text-5xl md:text-6xl lg:text-7xl font-display font-medium text-white mb-6 tracking-tight">Flexible plans for<br/>every creator</motion.h1>
         <motion.p initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} transition={{delay: 0.1}} className="text-xl text-slate-400">Everything you need to step up your marketing game.</motion.p>
       </div>
       <div className="grid md:grid-cols-3 gap-8">
         {/* Free */}
         <div className="p-10 pb-12 rounded-3xl bg-white/[0.02] border border-white/5 flex flex-col justify-between">
            <div>
              <h3 className="text-2xl font-bold text-white mb-2">Free Trial</h3>
              <p className="text-slate-400 text-sm mb-6">Test the platform.</p>
              <div className="text-5xl font-display font-medium text-white mb-10 flex flex-col">
                <span className="text-lg text-slate-500 line-through tracking-wide mb-1 opacity-0">&nbsp;</span>
                Free
              </div>
              <ul className="space-y-4 mb-10">
                <li className="flex items-center gap-3 text-slate-300"><CheckCircle className="w-5 h-5 text-slate-500 shrink-0"/> 1 Campaign Free</li>
                <li className="flex items-center gap-3 text-slate-300"><CheckCircle className="w-5 h-5 text-slate-500 shrink-0"/> No watermark</li>
              </ul>
            </div>
            <Link href="/signup" className="w-full text-center py-4 rounded-full border border-white/20 font-semibold hover:bg-white/10 transition-colors mt-auto">Start for free</Link>
         </div>

         {/* Pay As You Go */}
         <div className="p-10 pb-12 rounded-3xl bg-white/[0.04] border border-white/10 flex flex-col justify-between relative">
            <div>
              <h3 className="text-2xl font-bold text-white mb-2">Pay-as-you-go</h3>
              <p className="text-slate-400 text-sm mb-6">No commitments.</p>
              <div className="text-5xl font-display font-medium text-white mb-10 flex flex-col">
                 <span className="text-lg text-slate-500 line-through tracking-wide mb-1 decoration-red-500/50 decoration-2">₦2,500</span>
                 ₦1,000<span className="text-base text-slate-400 font-normal uppercase tracking-widest mt-2">/ Campaign</span>
              </div>
              <ul className="space-y-4 mb-10">
                <li className="flex items-center gap-3 text-white"><CheckCircle className="w-5 h-5 text-slate-500 shrink-0"/> 1 Full Campaign</li>
                <li className="flex items-center gap-3 text-white"><CheckCircle className="w-5 h-5 text-cyan-400 shrink-0"/> No watermark</li>
                <li className="flex items-center gap-3 text-white"><CheckCircle className="w-5 h-5 text-cyan-400 shrink-0"/> High resolution exports</li>
              </ul>
            </div>
            <Link href="/signup" className="w-full text-center py-4 rounded-full bg-white text-[#0a1128] font-bold hover:bg-slate-200 transition-colors shadow-lg mt-auto">Buy Now</Link>
         </div>

         {/* Pro */}
         <div className="p-10 pb-12 rounded-3xl bg-gradient-to-br from-[#0a1128] to-cyan-900/40 border-2 border-cyan-500/50 flex flex-col relative shadow-[0_0_50px_rgba(34,211,238,0.1)] justify-between">
            <div className="absolute top-0 inset-x-0 flex justify-center -translate-y-1/2">
              <span className="px-5 py-2 rounded-full bg-cyan-400 text-[#0a1128] text-xs font-bold uppercase tracking-widest shadow-lg">Most Popular</span>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white mb-2 mt-4">Pro Plan</h3>
              <p className="text-slate-400 text-sm mb-6">For power users.</p>
              <div className="text-5xl font-display font-medium text-white mb-10 flex flex-col">
                 <span className="text-lg text-slate-500 line-through tracking-wide mb-1 decoration-red-500/50 decoration-2">₦10,000</span>
                 ₦4,500<span className="text-base text-slate-400 font-normal uppercase tracking-widest mt-2">/ Month</span>
              </div>
              <ul className="space-y-4 mb-10">
                <li className="flex items-center gap-3 text-white"><CheckCircle className="w-5 h-5 text-cyan-400 shrink-0"/> Unlimited Campaigns</li>
                <li className="flex items-center gap-3 text-white"><CheckCircle className="w-5 h-5 text-cyan-400 shrink-0"/> No watermark</li>
                <li className="flex items-center gap-3 text-white"><CheckCircle className="w-5 h-5 text-cyan-400 shrink-0"/> Priority queue generation</li>
                <li className="flex items-center gap-3 text-white"><CheckCircle className="w-5 h-5 text-cyan-400 shrink-0"/> Premium templates</li>
              </ul>
            </div>
            <Link href="/signup" className="w-full text-center py-4 rounded-full bg-cyan-400 text-[#0a1128] font-bold hover:bg-cyan-300 transition-colors shadow-[0_0_20px_rgba(34,211,238,0.3)] mt-auto">Upgrade to Pro</Link>
         </div>
       </div>
    </section>
  );
}

export default function PricingRoute() {
  return (
    <div className="min-h-screen bg-[#030712] text-slate-50 relative selection:bg-cyan-500 selection:text-white font-sans overflow-x-hidden">
      <Navbar />
      <main>
        <Pricing />
      </main>
      <Footer />
    </div>
  );
}
