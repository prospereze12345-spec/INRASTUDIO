"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  Sparkles, 
  Home, 
  LayoutTemplate, 
  Settings, 
  Crown,
  LogOut,
  Menu,
  X,
  History,
  MonitorSmartphone,
  Trash2,
  Globe
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Logo } from "@/components/Logo";

function Sidebar({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-[#030712]/80 backdrop-blur-sm z-40 lg:hidden"
            onClick={onClose}
          />
        )}
      </AnimatePresence>
      <motion.aside 
        className={`fixed top-0 left-0 bottom-0 w-64 bg-[#0a1128] border-r border-white/5 z-50 flex flex-col transition-transform lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="p-6 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Logo className="w-8 h-8 rounded-lg" />
            <span className="font-display font-medium text-xl tracking-widest text-white">INRASTUDIO</span>
          </Link>
          <button className="lg:hidden text-slate-400 hover:text-white" onClick={onClose}>
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-6 px-4 flex flex-col gap-1">
          <Link href="/dashboard" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 text-slate-400 hover:text-white font-medium transition-colors">
            <Home className="w-5 h-5" /> Dashboard
          </Link>
          <Link href="/dashboard/templates" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 text-slate-400 hover:text-white font-medium transition-colors">
            <LayoutTemplate className="w-5 h-5" /> Templates
          </Link>
          <Link href="#" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 text-slate-400 hover:text-white font-medium transition-colors">
            <History className="w-5 h-5" /> Campaigns
          </Link>
          <Link href="/dashboard/settings" className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/10 text-white font-medium transition-colors">
            <Settings className="w-5 h-5 text-cyan-400" /> Settings
          </Link>
        </div>

        <div className="p-4 border-t border-white/5">
          <Link href="/pricing" className="flex items-center gap-3 px-4 py-3 mb-2 rounded-xl bg-gradient-to-r from-amber-500/10 to-transparent hover:bg-amber-500/20 text-amber-400 font-medium transition-colors border border-amber-500/20 shadow-[0_0_15px_rgba(245,158,11,0.1)]">
            <Crown className="w-5 h-5" /> Upgrade to Pro
          </Link>
          <button className="flex items-center gap-3 px-4 py-3 w-full rounded-xl hover:bg-red-500/10 text-slate-400 hover:text-red-400 font-medium transition-colors text-left">
            <LogOut className="w-5 h-5" /> Sign Out
          </button>
        </div>
      </motion.aside>
    </>
  );
}

export default function SettingsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#030712] text-slate-50 font-sans selection:bg-cyan-500 selection:text-white flex">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="flex-1 lg:ml-64 relative min-h-screen">
        {/* Mobile Header */}
        <header className="lg:hidden flex items-center justify-between p-4 border-b border-white/5 bg-[#0a1128]/80 backdrop-blur-md sticky top-0 z-30">
          <div className="flex items-center gap-2">
            <Logo className="w-6 h-6 rounded-md" />
            <span className="font-display font-medium text-lg tracking-widest text-white">INRASTUDIO</span>
          </div>
          <button onClick={() => setSidebarOpen(true)} className="p-2 text-slate-300">
            <Menu className="w-6 h-6" />
          </button>
        </header>

        <div className="p-6 md:p-10 max-w-4xl mx-auto space-y-10">
          
          <div>
            <h1 className="text-3xl font-display font-bold text-white tracking-tight mb-2">Account Settings</h1>
            <p className="text-slate-400 text-sm">Manage your personal information and account security.</p>
          </div>

          <div className="space-y-6">
            
            {/* Profile Info */}
            <section className="bg-white/[0.02] border border-white/5 rounded-3xl p-6 md:p-8">
              <h2 className="text-xl font-semibold text-white mb-6">Profile</h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">Full Name</label>
                  <input 
                    type="text" 
                    defaultValue="Alex" 
                    className="w-full max-w-md bg-[#0a1128] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all font-medium"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">Email Address</label>
                  <input 
                    type="email" 
                    defaultValue="alex@example.com" 
                    disabled
                    className="w-full max-w-md bg-[#0a1128]/50 border border-white/5 rounded-xl px-4 py-3 text-slate-400 focus:outline-none font-medium cursor-not-allowed"
                  />
                  <p className="text-xs text-slate-500 mt-2">Email address cannot be changed.</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">Country</label>
                  <div className="relative max-w-md">
                    <select 
                      className="w-full bg-[#0a1128] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all font-medium appearance-none"
                      defaultValue="NG"
                    >
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
              </div>
              
              <div className="mt-8 pt-6 border-t border-white/5">
                <button className="px-6 py-2.5 bg-white text-[#0a1128] font-bold rounded-xl hover:bg-slate-200 transition-colors text-sm">
                  Save Changes
                </button>
              </div>
            </section>

            {/* Preferences */}
            <section className="bg-white/[0.02] border border-white/5 rounded-3xl p-6 md:p-8">
              <h2 className="text-xl font-semibold text-white mb-6">Preferences</h2>
              
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Default Language</label>
                <div className="relative max-w-md">
                  <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <select 
                    className="w-full bg-[#0a1128] border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all font-medium appearance-none"
                    defaultValue="en"
                  >
                    <option value="en">English</option>
                    <option value="pcm">Pidgin</option>
                    <option value="sw">Swahili</option>
                    <option value="zu">Zulu</option>
                    <option value="ar">Arabic</option>
                    <option value="fr">French</option>
                  </select>
                </div>
              </div>
            </section>

            {/* Security */}
            <section className="bg-white/[0.02] border border-white/5 rounded-3xl p-6 md:p-8">
              <h2 className="text-xl font-semibold text-white mb-6">Security & Devices</h2>
              
              <div className="space-y-6">
                <div className="flex items-center justify-between flex-wrap gap-4 p-4 rounded-2xl bg-white/5 border border-white/5">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center shrink-0">
                      <MonitorSmartphone className="w-5 h-5 text-slate-300" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white mb-1">Log out of all devices</p>
                      <p className="text-xs text-slate-400">Sign out of every active session on all devices.</p>
                    </div>
                  </div>
                  <button className="px-4 py-2 border border-white/20 rounded-lg text-sm font-medium text-white hover:bg-white/10 transition-colors">
                    Log out all
                  </button>
                </div>
              </div>
            </section>

            {/* Danger Zone */}
            <section className="border border-red-500/20 rounded-3xl p-6 md:p-8 relative overflow-hidden group">
              <div className="absolute inset-0 bg-red-500/5 transition-colors group-hover:bg-red-500/10" />
              <div className="relative z-10">
                <h2 className="text-xl font-semibold text-red-400 mb-2">Delete Account</h2>
                <p className="text-slate-400 text-sm mb-6 max-w-xl">
                  Permanently delete your account and all of your content. This action cannot be undone.
                </p>
                <button className="px-5 py-2.5 bg-red-500/10 border border-red-500/20 text-red-400 font-medium rounded-xl hover:bg-red-500 hover:text-white transition-all text-sm flex items-center gap-2 group-hover:border-red-500/50">
                  <Trash2 className="w-4 h-4" />
                  Delete my account
                </button>
              </div>
            </section>

          </div>
        </div>
      </main>
    </div>
  );
}
