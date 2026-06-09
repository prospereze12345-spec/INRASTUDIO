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

export default function PrivacyPolicyRoute() {
  return (
    <div className="min-h-screen bg-[#030712] text-slate-50 relative selection:bg-cyan-500 selection:text-white font-sans overflow-x-hidden">
      <Navbar />
      <main className="pt-40 pb-20 px-6 max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-6xl font-display font-medium text-white mb-8 tracking-tight">Privacy Policy</h1>
        <div className="prose prose-invert prose-slate max-w-none prose-headings:font-display prose-headings:font-medium prose-a:text-cyan-400 hover:prose-a:text-cyan-300">
          <p className="lead text-xl text-slate-300 mb-10">Last updated: {new Date().toLocaleDateString()}</p>
          
          <h2 className="text-2xl mt-12 mb-4">1. Introduction</h2>
          <p className="text-slate-400 mb-6">At INRASTUDIO AI Marketing Studio ("we", "our", or "us"), we respect your privacy and are committed to protecting it through our compliance with this policy. This policy describes the types of information we may collect from you or that you may provide when you visit our website (the "Website") and our practices for collecting, using, maintaining, protecting, and disclosing that information.</p>

          <h2 className="text-2xl mt-12 mb-4">2. Information We Collect</h2>
          <p className="text-slate-400 mb-6">We collect several types of information from and about users of our Website, including information:</p>
          <ul className="list-disc pl-6 text-slate-400 mb-6 space-y-2">
            <li>By which you may be personally identified, such as name, postal address, e-mail address, telephone number, or any other identifier by which you may be contacted online or offline ("personal information").</li>
            <li>That is about you but individually does not identify you.</li>
            <li>About your internet connection, the equipment you use to access our Website, and usage details.</li>
          </ul>

          <h2 className="text-2xl mt-12 mb-4">3. How We Use Your Information</h2>
          <p className="text-slate-400 mb-6">We use information that we collect about you or that you provide to us, including any personal information:</p>
          <ul className="list-disc pl-6 text-slate-400 mb-6 space-y-2">
            <li>To present our Website and its contents to you.</li>
            <li>To provide you with information, products, or services that you request from us.</li>
            <li>To fulfill any other purpose for which you provide it.</li>
            <li>To carry out our obligations and enforce our rights arising from any contracts entered into between you and us, including for billing and collection.</li>
          </ul>

          <h2 className="text-2xl mt-12 mb-4">4. AI Processing</h2>
          <p className="text-slate-400 mb-6">As an AI marketing studio, we process images and text you provide to generate marketing campaigns. This processing may involve third-party AI service providers. We do not use your personal images or brand data to train our AI models unless explicitly agreed upon.</p>
          
          <h2 className="text-2xl mt-12 mb-4">5. Data Security</h2>
          <p className="text-slate-400 mb-6">We have implemented measures designed to secure your personal information from accidental loss and from unauthorized access, use, alteration, and disclosure. However, the transmission of information via the internet is not completely secure, and we cannot guarantee the security of your personal information transmitted to our Website.</p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
