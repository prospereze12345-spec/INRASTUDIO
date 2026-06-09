"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Menu, X, Image as ImageIcon, Upload, Zap, CheckCircle, ChevronDown, Facebook, Instagram } from "lucide-react";
import Link from "next/link";
import { Logo } from "@/components/Logo";

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showUseCases, setShowUseCases] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const cases = [
    { icon: ImageIcon, title: "E-commerce & Retail" },
    { icon: Upload, title: "Agencies & Freelancers" },
    { icon: Zap, title: "Restaurants & Food" },
    { icon: CheckCircle, title: "Real Estate" },
  ];

  return (
    <>
      <div className="fixed top-6 left-0 right-0 z-50 flex justify-center px-4 w-full">
        <motion.nav 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
          className={`w-full max-w-5xl rounded-2xl transition-all duration-500 border border-white/5 shadow-2xl ${
            scrolled || isMenuOpen ? 'bg-[#0a1128]/95 backdrop-blur-xl' : 'bg-[#0a1128]/80 backdrop-blur-md'
          }`}
        >
          <div className="flex items-center justify-between px-6 py-4 relative">
            {/* Desktop Logo */}
            <div className="hidden lg:flex items-center gap-3 z-50 w-24">
              <Link href="/">
                <Logo className="w-10 h-10" />
              </Link>
            </div>

            {/* Mobile Centered Logo + Site Name */}
            <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-2 z-50 pointer-events-auto lg:hidden">
              <Link href="/" className="flex items-center gap-2">
                <Logo className="w-7 h-7" />
                <span className="font-display font-medium text-lg tracking-widest text-white">INRASTUDIO</span>
              </Link>
            </div>

            <div className="hidden lg:flex items-center justify-center gap-8 text-sm font-medium text-slate-300 absolute left-1/2 -translate-x-1/2">
               <div 
                 className="relative group h-full flex items-center"
                 onMouseEnter={() => setShowUseCases(true)}
                 onMouseLeave={() => setShowUseCases(false)}
               >
                 <button className="flex items-center gap-1 hover:text-cyan-400 transition-colors py-2">
                   Use Cases <ChevronDown className={`w-4 h-4 transition-transform ${showUseCases ? 'rotate-180' : ''}`} />
                 </button>
                 
                 <AnimatePresence>
                   {showUseCases && (
                     <motion.div 
                       initial={{ opacity: 0, y: 10, scale: 0.95 }}
                       animate={{ opacity: 1, y: 0, scale: 1 }}
                       exit={{ opacity: 0, y: 10, scale: 0.95 }}
                       transition={{ duration: 0.2 }}
                       className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-[400px] bg-[#0a1128]/95 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-2xl"
                     >
                        <div className="grid grid-cols-2 gap-2">
                          {cases.map((c, i) => (
                            <div key={i} className="flex items-start gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors cursor-default">
                               <div className="bg-cyan-500/10 p-2 rounded-lg shrink-0 text-cyan-400 mt-0.5">
                                 <c.icon className="w-4 h-4" />
                               </div>
                               <div>
                                 <h4 className="text-slate-200 font-medium text-sm mb-0.5">{c.title}</h4>
                               </div>
                            </div>
                          ))}
                        </div>
                     </motion.div>
                   )}
                 </AnimatePresence>
               </div>
               <Link href="/contact" className="hover:text-cyan-400 transition-colors">Contact</Link>
               <Link href="/dashboard" className="hover:text-cyan-400 transition-colors">Dashboard</Link>
               <Link href="#resources" className="hover:text-cyan-400 transition-colors">Resources</Link>
               <Link href="/pricing" className="hover:text-cyan-400 transition-colors">Pricing</Link>
            </div>

            <div className="flex items-center gap-4 z-50 ml-auto lg:ml-0">
              <Link href="/login" className="hidden sm:block text-sm font-medium text-slate-200 hover:text-cyan-400 transition-colors">
                Login
              </Link>
              <Link 
                href="/signup"
                className="hidden lg:flex px-5 py-2.5 rounded-full text-sm font-semibold bg-white text-[#0a1128] hover:bg-slate-200 hover:shadow-[0_0_15px_rgba(255,255,255,0.2)] transition-all"
              >
                Start Free Trial
              </Link>
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="lg:hidden p-2 -mr-2 text-white hover:text-cyan-400 transition-colors cursor-pointer pointer-events-auto relative z-50"
              >
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </motion.nav>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: -10 }}
            transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
            className="fixed inset-x-4 top-[88px] max-w-5xl mx-auto z-40 bg-[#0a1128] rounded-3xl border border-white/10 shadow-2xl overflow-hidden lg:hidden"
          >
            <div className="p-8 flex flex-col gap-6">
              <div className="space-y-4">
                <span className="text-sm font-bold text-slate-500 uppercase tracking-widest pl-2">Use Cases</span>
                <div className="grid grid-cols-1 gap-2 pl-2">
                  {cases.map((c, i) => (
                    <div key={i} className="flex items-center gap-3 py-2 text-slate-200">
                       <c.icon className="w-4 h-4 text-cyan-400" />
                       <span className="font-medium">{c.title}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="h-[1px] w-full bg-white/5 my-2"></div>
              
              <Link href="/contact" className="text-3xl font-display font-medium text-slate-200 hover:text-cyan-400 tracking-tight" onClick={() => setIsMenuOpen(false)}>Contact</Link>
              <Link href="/dashboard" className="text-3xl font-display font-medium text-slate-200 hover:text-cyan-400 tracking-tight" onClick={() => setIsMenuOpen(false)}>Dashboard</Link>
              <Link href="#resources" className="text-3xl font-display font-medium text-slate-200 hover:text-cyan-400 tracking-tight" onClick={() => setIsMenuOpen(false)}>Resources</Link>
              <Link
                href="/pricing"
                className="text-3xl font-display font-medium text-slate-200 hover:text-cyan-400 tracking-tight"
                onClick={() => setIsMenuOpen(false)}
              >
                Pricing
              </Link>
              <div className="mt-4 pt-4 border-t border-white/10">
                <Link href="/login" className="text-xl font-medium text-slate-300 hover:text-cyan-400" onClick={() => setIsMenuOpen(false)}>
                  Login
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
