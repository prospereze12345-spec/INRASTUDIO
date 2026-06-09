"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Menu, X, ArrowRight, Facebook, Instagram } from "lucide-react";
import { Logo } from "@/components/Logo";
import { Navbar } from "@/components/Navbar";
import Link from "next/link";



function Footer() {
  return (
    <footer className="pt-24 pb-12 px-6 bg-[#030712] border-t border-white/5 relative overflow-hidden mt-12 w-full">
       <div className="max-w-7xl mx-auto flex flex-col lg:flex-row justify-between items-start gap-16 pb-40 relative z-20">
         <div className="flex-1 max-w-3xl">
           <h2 className="text-4xl font-display font-medium text-slate-200 tracking-tight leading-tight">INRASTUDIO</h2>
         </div>
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

export default function TermsRoute() {
  return (
    <div className="min-h-screen bg-[#030712] text-slate-50 relative selection:bg-cyan-500 selection:text-white font-sans overflow-x-hidden">
      <Navbar />
      <main className="pt-40 pb-20 px-6 max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-6xl font-display font-medium text-white mb-8 tracking-tight">Terms & Conditions</h1>
        <div className="prose prose-invert prose-slate max-w-none prose-headings:font-display prose-headings:font-medium prose-a:text-cyan-400 hover:prose-a:text-cyan-300">
          <p className="lead text-xl text-slate-300 mb-10">Last updated: {new Date().toLocaleDateString()}</p>
          
          <h2 className="text-2xl mt-12 mb-4">1. Acceptance of Terms</h2>
          <p className="text-slate-400 mb-6">By accessing and using INRASTUDIO AI Marketing Studio, you agree to be bound by these Terms and Conditions and our Privacy Policy. If you do not agree, please do not use our services.</p>

          <h2 className="text-2xl mt-12 mb-4">2. Services Provide</h2>
          <p className="text-slate-400 mb-6">INRASTUDIO provides AI-powered marketing asset generation, including but not limited to flyers, captions, and promotional videos. We reserve the right to modify or discontinue the service with or without notice to you.</p>

          <h2 className="text-2xl mt-12 mb-4">3. User Responsibilities</h2>
          <p className="text-slate-400 mb-6">You are responsible for the content you upload and generate using our service. You agree not to use our service to generate content that is:</p>
          <ul className="list-disc pl-6 text-slate-400 mb-6 space-y-2">
            <li>Illegal, threatening, defamatory, or abusive.</li>
            <li>Infringes on any third party's intellectual property rights.</li>
            <li>Contains software viruses or any other computer code designed to disrupt our platform.</li>
          </ul>

          <h2 className="text-2xl mt-12 mb-4">4. Intellectual Property</h2>
          <p className="text-slate-400 mb-6">You retain ownership of all images and text you upload. We grant you a limited, non-exclusive, non-transferable license to use the generated marketing assets for your business purposes, subject to the plan tier you have subscribed to.</p>
          
          <h2 className="text-2xl mt-12 mb-4">5. Limitation of Liability</h2>
          <p className="text-slate-400 mb-6">INRASTUDIO shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of or inability to use the service. Our maximum liability shall not exceed the amount you paid us over the past 12 months.</p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
