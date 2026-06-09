"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Menu, X, ArrowRight, Mail, MapPin, Send, Facebook, Instagram } from "lucide-react";
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

export default function ContactRoute() {
  return (
    <div className="min-h-screen bg-[#030712] text-slate-50 relative selection:bg-cyan-500 selection:text-white font-sans overflow-x-hidden">
      <Navbar />
      <main className="pt-40 pb-20 px-6 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
        <div>
          <h1 className="text-4xl md:text-6xl font-display font-medium text-white mb-6 tracking-tight">Get in Touch</h1>
          <p className="text-xl text-slate-400 mb-12 max-w-md">Whether you have a question about features, pricing, or anything else, our team is ready to answer all your questions.</p>
          
          <div className="space-y-8">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center border border-white/10 shrink-0">
                <Mail className="w-6 h-6 text-cyan-400" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-slate-200 mb-1">Email us</h3>
                <p className="text-slate-400 mb-2">Our friendly team is here to help.</p>
                <a href="mailto:hello@inrastudio.com" className="text-cyan-400 font-medium hover:text-cyan-300 transition-colors">hello@inrastudio.com</a>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center border border-white/10 shrink-0">
                <MapPin className="w-6 h-6 text-cyan-400" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-slate-200 mb-1">Office</h3>
                <p className="text-slate-400 mb-2">Come say hello at our headquarters.</p>
                <span className="text-slate-300 font-medium">100 Innovation Way<br/>Tech Hub, Lagos</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Contact Form */}
        <div className="bg-[#0a1128]/50 border border-white/5 p-8 md:p-12 rounded-3xl backdrop-blur-sm">
          <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-mono text-slate-400 uppercase tracking-widest font-bold">First Name</label>
                <input type="text" className="w-full bg-[#030712] border border-white/10 rounded-xl px-4 py-3 text-slate-200 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-colors placeholder:text-slate-700" placeholder="Jane" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-mono text-slate-400 uppercase tracking-widest font-bold">Last Name</label>
                <input type="text" className="w-full bg-[#030712] border border-white/10 rounded-xl px-4 py-3 text-slate-200 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-colors placeholder:text-slate-700" placeholder="Doe" />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-xs font-mono text-slate-400 uppercase tracking-widest font-bold">Email</label>
              <input type="email" className="w-full bg-[#030712] border border-white/10 rounded-xl px-4 py-3 text-slate-200 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-colors placeholder:text-slate-700" placeholder="jane@example.com" />
            </div>
            
            <div className="space-y-2">
              <label className="text-xs font-mono text-slate-400 uppercase tracking-widest font-bold">Message</label>
              <textarea rows={5} className="w-full bg-[#030712] border border-white/10 rounded-xl px-4 py-3 text-slate-200 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-colors placeholder:text-slate-700 resize-none" placeholder="How can we help you?" />
            </div>
            
            <button className="w-full bg-cyan-400 text-[#0a1128] font-bold py-4 rounded-xl hover:bg-cyan-300 transition-colors flex items-center justify-center gap-2">
              <span>Send Message</span>
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
}
