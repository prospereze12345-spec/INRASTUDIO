"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Sparkles,
  Home,
  LayoutTemplate,
  Image as ImageIcon,
  Settings,
  Crown,
  Plus,
  Video,
  Type,
  X,
  History,
  Upload,
  Menu,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Logo } from "@/components/Logo";
import { LuxuryProductTemplate } from "@/components/templates/LuxuryProduct";
import { SalePromotionTemplate } from "@/components/templates/SalePromotion";
import { PremiumBrandTemplate } from "@/components/templates/PremiumBrand";
import {
  LUXURY_VARIATIONS,
  SALE_PROMOTION_VARIATIONS,
  PREMIUM_BRAND_VARIATIONS,
} from "@/lib/template-data";
import {
  createCampaignJob,
  pollUntilDone,
  saveJobResult,
  type JobStatus,
} from "@/lib/campaign-api";
import { apiFetch } from "@/lib/auth";

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────
interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  country: string;
  is_verified: boolean;
  created_at: string;
}

interface DashboardData {
  id: number;
  plan: {
    id: number;
    name: string;
    plan_type: string;
    campaigns_per_month: number | null;
    has_watermark: boolean;
    priority_queue: boolean;
    premium_templates: boolean;
  };
  is_active: boolean;
  campaigns_used: number;
  campaigns_generated: number;
  campaigns_remaining: number | string;
  start_date: string;
  end_date: string | null;
}

// ─────────────────────────────────────────────────────────────────────────────
// Token helpers
// ─────────────────────────────────────────────────────────────────────────────
function getAccessToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("access");
}
function getRefreshToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("refresh");
}
async function refreshAccessToken(): Promise<string | null> {
  const refresh = getRefreshToken();
  if (!refresh) return null;
  try {
    const res = await fetch("/api/auth/token/refresh/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh }),
    });
    if (!res.ok) return null;
    const data = await res.json();
    if (data.access) { localStorage.setItem("access", data.access); return data.access; }
  } catch {}
  return null;
}
async function fetchMe(token: string): Promise<UserProfile> {
  const res = await fetch("/api/auth/me/", { headers: { Authorization: `Bearer ${token}` } });
  if (res.status === 401) throw new Error("UNAUTHORIZED");
  if (!res.ok) throw new Error("FETCH_ERROR");
  return res.json();
}
function useUser() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  useEffect(() => {
    let cancelled = false;
    async function load() {
      let token = getAccessToken();
      if (!token) { router.replace("/login"); return; }
      try {
        const profile = await fetchMe(token);
        if (!cancelled) setUser(profile);
      } catch (err: any) {
        if (err.message === "UNAUTHORIZED") {
          const newToken = await refreshAccessToken();
          if (!newToken) { localStorage.removeItem("access"); localStorage.removeItem("refresh"); router.replace("/login"); return; }
          try {
            const profile = await fetchMe(newToken);
            if (!cancelled) setUser(profile);
          } catch { localStorage.removeItem("access"); localStorage.removeItem("refresh"); router.replace("/login"); }
        }
      } finally { if (!cancelled) setLoading(false); }
    }
    load();
    return () => { cancelled = true; };
  }, [router]);
  return { user, loading };
}

function useGreeting(): string {
  const getGreeting = () => {
    const watHour = new Date(Date.now() + 60 * 60 * 1000).getUTCHours();
    if (watHour < 12) return "Good morning";
    if (watHour < 17) return "Good afternoon";
    return "Good evening";
  };
  const [greeting, setGreeting] = useState(getGreeting);
  useEffect(() => {
    const id = setInterval(() => setGreeting(getGreeting()), 60_000);
    return () => clearInterval(id);
  }, []);
  return greeting;
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}
function getFirstName(fullName: string): string {
  return fullName.trim().split(/\s+/)[0];
}

// ─────────────────────────────────────────────────────────────────────────────
// Upload state machine
// idle → uploading (POST /generate/) → processing (polling /status/) → done | error
// ─────────────────────────────────────────────────────────────────────────────
type UploadPhase = "idle" | "uploading" | "processing" | "done" | "error";

const PHASE_LABEL: Record<UploadPhase, string> = {
  idle:       "",
  uploading:  "Removing background…",
  processing: "AI is generating your assets…",
  done:       "Ready! Redirecting…",
  error:      "Something went wrong. Please try again.",
};

// ─────────────────────────────────────────────────────────────────────────────
// Sidebar (unchanged from original)
// ─────────────────────────────────────────────────────────────────────────────
function Sidebar({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-[#030712]/80 backdrop-blur-sm z-40 lg:hidden"
            onClick={onClose} />
        )}
      </AnimatePresence>
      <motion.aside className={`fixed top-0 left-0 bottom-0 w-64 bg-[#0a1128] border-r border-white/5 z-50 flex flex-col transition-transform lg:translate-x-0 ${isOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="p-6 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Logo className="w-8 h-8 rounded-lg" />
          </Link>
          <button className="lg:hidden text-slate-400 hover:text-white" onClick={onClose}><X className="w-5 h-5" /></button>
        </div>
        <nav className="flex-1 overflow-y-auto py-6 px-4 flex flex-col gap-1">
          <Link href="/dashboard" className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/10 text-white font-medium">
            <Home className="w-5 h-5 text-cyan-400" /> Dashboard
          </Link>
          <Link href="/dashboard/templates" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 text-slate-400 hover:text-white font-medium transition-colors">
            <LayoutTemplate className="w-5 h-5" /> Templates
          </Link>
          <Link href="#" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 text-slate-400 hover:text-white font-medium transition-colors">
            <History className="w-5 h-5" /> Campaigns
          </Link>
          <Link href="/dashboard/settings" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 text-slate-400 hover:text-white font-medium transition-colors">
            <Settings className="w-5 h-5" /> Settings
          </Link>
        </nav>
        <div className="p-4 border-t border-white/5">
          <Link href="/pricing" className="flex items-center gap-3 px-4 py-3 mb-2 rounded-xl bg-gradient-to-r from-amber-500/10 to-transparent hover:bg-amber-500/20 text-amber-400 font-medium transition-colors border border-amber-500/20 shadow-[0_0_15px_rgba(245,158,11,0.1)]">
            <Crown className="w-5 h-5" /> Upgrade to Pro
          </Link>
        </div>
      </motion.aside>
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Page
// ─────────────────────────────────────────────────────────────────────────────
export default function DashboardPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [generateVideo, setGenerateVideo] = useState(true);

  // Local preview (blob URL) — only for the upload thumbnail
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  // The actual File object we send to the API
  const [imageFile, setImageFile] = useState<File | null>(null);

  const [phase, setPhase]   = useState<UploadPhase>("idle");
  const [errorMsg, setErrorMsg] = useState<string>("");

  // Dashboard data from backend
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [dashboardLoading, setDashboardLoading] = useState(true);
  const [dashboardError, setDashboardError] = useState<string | null>(null);

  const router = useRouter();
  const { user, loading } = useUser();
  const greeting = useGreeting();

  // Fetch dashboard data using apiFetch
  useEffect(() => {
    async function fetchDashboardData() {
      if (!user) return;
      
      try {
        const data = await apiFetch<DashboardData>('/api/pricing/dashboard/');
        setDashboardData(data);
        setDashboardError(null);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setDashboardError(error instanceof Error ? error.message : 'Failed to load dashboard data');
      } finally {
        setDashboardLoading(false);
      }
    }

    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setPreviewImage(URL.createObjectURL(file));
    setPhase("idle");
    setErrorMsg("");
  };

  const handleStartGenerating = async () => {
    if (!imageFile) {
      alert("Please upload a product image to continue.");
      return;
    }

    try {
      // ── Step 1: POST /api/campaign/generate/ ───────────────────────────────
      setPhase("uploading");
      const { job_id } = await createCampaignJob(imageFile);

      // ── Step 2: Poll /api/campaign/status/<job_id>/ ───────────────────────
      setPhase("processing");
      const result = await pollUntilDone(job_id, {
        intervalMs: 2000,
        maxAttempts: 90, // 3 min max
        onStatus: (status: JobStatus) => {
          // You can add finer-grained UI feedback here if desired
          if (status === "processing") setPhase("processing");
        },
      });

      // ── Step 3: Persist result, redirect to templates ─────────────────────
      saveJobResult(result); // writes png_url, captions, video_url to sessionStorage
      setPhase("done");
      
      // ── Step 4: Track campaign generation using apiFetch ──────────────────
      try {
        await apiFetch('/api/pricing/track_generation/', {
          method: 'POST',
          body: JSON.stringify({
            campaign_id: job_id,
            action: 'generated'
          }),
        });
        // Refresh dashboard data
        const updatedData = await apiFetch<DashboardData>('/api/pricing/dashboard/');
        setDashboardData(updatedData);
      } catch (trackError) {
        console.error('Error tracking generation:', trackError);
        // Continue even if tracking fails
      }
      
      router.push("/dashboard/templates");

    } catch (err: any) {
      console.error("[Campaign]", err);
      setPhase("error");
      setErrorMsg(err?.message ?? "Unknown error");
    }
  };

  const isWorking = phase === "uploading" || phase === "processing";

  // Helper function to get campaigns remaining display
  const getCampaignsDisplay = (remaining: number | string) => {
    if (remaining === Infinity || remaining === 'Infinity' || remaining === 999999) {
      return '♾️';
    }
    if (typeof remaining === 'number') {
      return remaining.toString();
    }
    return remaining;
  };

  // Helper function to get plan display name
  const getPlanDisplay = (planType: string) => {
    if (planType === 'free') return 'Free Trial';
    if (planType === 'payg') return 'Pay-as-you-go';
    if (planType === 'pro') return 'Pro Plan';
    return planType;
  };

  // Helper to check if user can generate more campaigns
  const canGenerate = () => {
    if (!dashboardData) return false;
    const remaining = dashboardData.campaigns_remaining;
    if (remaining === Infinity || remaining === 'Infinity' || remaining === 999999) {
      return true;
    }
    return typeof remaining === 'number' && remaining > 0;
  };

  return (
    <div className="min-h-screen bg-[#030712] text-slate-50 font-sans selection:bg-cyan-500 selection:text-white flex">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="flex-1 lg:ml-64 relative min-h-screen">

        {/* Mobile header */}
        <header className="lg:hidden flex items-center justify-between p-4 border-b border-white/5 bg-[#0a1128]/80 backdrop-blur-md sticky top-0 z-30">
          <div className="flex items-center gap-2">
            <Logo className="w-6 h-6 rounded-md" />
            <span className="font-display font-medium text-lg tracking-widest text-white">INRASTUDIO</span>
          </div>
          <button onClick={() => setSidebarOpen(true)} className="p-2 text-slate-300">
            <Menu className="w-6 h-6" />
          </button>
        </header>

        <div className="p-6 md:p-10 max-w-6xl mx-auto space-y-12">

          {/* ── Greeting ── */}
          <section className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              {loading ? (
                <div className="animate-pulse space-y-2">
                  <div className="h-3 w-20 bg-white/10 rounded-full" />
                  <div className="h-9 w-72 bg-white/10 rounded-xl" />
                </div>
              ) : (
                <>
                  <p className="text-slate-400 text-sm font-medium uppercase tracking-widest mb-1">Overview</p>
                  <h1 className="text-3xl md:text-4xl font-display font-bold text-white tracking-tight">
                    {greeting}, {getFirstName(user?.full_name ?? "")} ✨
                  </h1>
                </>
              )}
            </div>
            <div className="w-10 h-10 rounded-full bg-cyan-900 border-2 border-cyan-400 flex items-center justify-center text-cyan-50 font-bold text-sm shadow-lg shadow-cyan-400/20" title={user?.full_name ?? ""}>
              {loading ? <span className="w-4 h-4 bg-cyan-700 rounded-full animate-pulse" /> : getInitials(user?.full_name ?? "?")}
            </div>
          </section>

          {/* ── Stats ── */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Campaigns Left - Dynamic */}
            <div className="bg-white/[0.03] border border-white/5 backdrop-blur-md p-6 rounded-3xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-slate-400 font-medium">Campaigns Left</h3>
                <div className="w-8 h-8 rounded-full bg-cyan-500/20 flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-cyan-400" />
                </div>
              </div>
              {dashboardLoading ? (
                <div className="animate-pulse">
                  <div className="h-10 w-20 bg-white/10 rounded-lg" />
                </div>
              ) : dashboardError ? (
                <div className="text-red-400 text-sm">{dashboardError}</div>
              ) : (
                <>
                  <div className="text-4xl font-display font-medium text-white">
                    {getCampaignsDisplay(dashboardData?.campaigns_remaining ?? 0)}
                  </div>
                  <p className="text-sm text-slate-500 mt-2">
                    {dashboardData?.plan ? getPlanDisplay(dashboardData.plan.plan_type) : 'No Plan'}
                  </p>
                </>
              )}
            </div>

            {/* Assets Generated - Dynamic */}
            <div className="bg-white/[0.03] border border-white/5 backdrop-blur-md p-6 rounded-3xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-slate-400 font-medium">Assets Generated</h3>
                <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center">
                  <ImageIcon className="w-4 h-4 text-indigo-400" />
                </div>
              </div>
              {dashboardLoading ? (
                <div className="animate-pulse">
                  <div className="h-10 w-20 bg-white/10 rounded-lg" />
                </div>
              ) : (
                <>
                  <div className="text-4xl font-display font-medium text-white">
                    {dashboardData?.campaigns_generated ?? 0}
                  </div>
                  <p className="text-sm text-slate-500 mt-2">Lifetime creations</p>
                </>
              )}
            </div>

            {/* Plan Status - New Card */}
            <div className="bg-white/[0.03] border border-white/5 backdrop-blur-md p-6 rounded-3xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-slate-400 font-medium">Plan Status</h3>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  dashboardData?.plan?.plan_type === 'pro' 
                    ? 'bg-cyan-500/20' 
                    : dashboardData?.plan?.plan_type === 'payg'
                    ? 'bg-amber-500/20'
                    : 'bg-slate-500/20'
                }`}>
                  <span className={`text-sm font-bold ${
                    dashboardData?.plan?.plan_type === 'pro' 
                      ? 'text-cyan-400' 
                      : dashboardData?.plan?.plan_type === 'payg'
                      ? 'text-amber-400'
                      : 'text-slate-400'
                  }`}>
                    {dashboardLoading ? '...' : dashboardData?.plan?.plan_type === 'pro' ? 'PRO' : 
                     dashboardData?.plan?.plan_type === 'payg' ? 'PAYG' : 'FREE'}
                  </span>
                </div>
              </div>
              {dashboardLoading ? (
                <div className="animate-pulse">
                  <div className="h-10 w-32 bg-white/10 rounded-lg" />
                </div>
              ) : (
                <>
                  <div className="text-4xl font-display font-medium text-white">
                    {dashboardData?.plan?.name || 'Free Trial'}
                  </div>
                  <p className="text-sm text-slate-500 mt-2">
                    {dashboardData?.is_active ? 'Active ✅' : 'Inactive ⚠️'}
                  </p>
                </>
              )}
            </div>
          </section>


            
          {/* ── Create Campaign ── */}
          <section className="bg-gradient-to-tr from-[#0a1128] to-cyan-950/40 border border-cyan-500/20 rounded-[2rem] p-8 md:p-12 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-32 bg-cyan-500/10 blur-[100px] rounded-full mix-blend-screen pointer-events-none" />
            <div className="absolute bottom-0 left-0 p-32 bg-indigo-500/10 blur-[100px] rounded-full mix-blend-screen pointer-events-none" />

            <div className="max-w-4xl relative z-10">
              <h2 className="text-3xl font-display font-bold text-white mb-2 tracking-tight">Create New Campaign</h2>
              <p className="text-slate-400 mb-8 max-w-xl">
                Upload your product image and select the assets you want to generate. Click start to auto-generate from beautiful templates.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {/* Checklist */}
                <div className="bg-[#030712]/50 rounded-2xl p-6 border border-white/5 backdrop-blur-sm space-y-4">
                  <p className="text-xs font-mono text-slate-500 uppercase tracking-widest font-bold">Includes:</p>

                  <label className="flex items-center gap-4 p-3 rounded-xl opacity-80 cursor-not-allowed">
                    <input type="checkbox" className="w-5 h-5 rounded border-slate-700 bg-slate-900 text-cyan-400 pointer-events-none" checked readOnly disabled />
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-cyan-500/10 flex items-center justify-center"><ImageIcon className="w-4 h-4 text-cyan-400" /></div>
                      <span className="font-medium text-slate-200">Flyer Design <span className="text-xs text-slate-400 ml-2">(Required)</span></span>
                    </div>
                  </label>

                  <label className="flex items-center gap-4 p-3 rounded-xl opacity-80 cursor-not-allowed">
                    <input type="checkbox" className="w-5 h-5 rounded border-slate-700 bg-slate-900 text-cyan-400 pointer-events-none" checked readOnly disabled />
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center"><Type className="w-4 h-4 text-indigo-400" /></div>
                      <span className="font-medium text-slate-200">Social Caption <span className="text-xs text-slate-400 ml-2">(Required)</span></span>
                    </div>
                  </label>

                  <label className="flex items-center gap-4 p-3 rounded-xl hover:bg-white/5 transition-colors cursor-pointer">
                    <input type="checkbox" className="w-5 h-5 rounded border-slate-700 bg-slate-900 text-cyan-400"
                      checked={generateVideo} onChange={(e) => setGenerateVideo(e.target.checked)} />
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center"><Video className="w-4 h-4 text-purple-400" /></div>
                      <span className="font-medium text-slate-200">Promo Video</span>
                    </div>
                  </label>
                </div>

                {/* Upload */}
                <div className="bg-[#030712]/50 rounded-2xl p-6 border border-white/5 backdrop-blur-sm flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-mono text-slate-500 uppercase tracking-widest font-bold">Product Image</p>
                    <span className="text-xs font-medium text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded-full">Required</span>
                  </div>

                  <label className={`flex-1 flex flex-col items-center justify-center min-h-[160px] border-2 border-dashed rounded-2xl transition-all group overflow-hidden relative ${isWorking ? "border-cyan-400/60 cursor-not-allowed" : "border-cyan-500/30 cursor-pointer bg-cyan-950/10 hover:bg-cyan-950/20"}`}>
                    {previewImage ? (
                      <Image src={previewImage} alt="Uploaded product" fill className="object-contain p-4" />
                    ) : (
                      <div className="flex flex-col items-center justify-center py-8">
                        <div className="w-12 h-12 rounded-full bg-cyan-500/20 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                          <Upload className="w-6 h-6 text-cyan-400" />
                        </div>
                        <p className="text-sm text-slate-300 font-medium"><span className="text-cyan-400">Click to upload</span> or drag and drop</p>
                        <p className="text-xs text-slate-500 mt-1">PNG, JPG or WEBP</p>
                      </div>
                    )}
                    <input type="file" className="hidden" accept="image/png,image/jpeg,image/webp" onChange={handleImageUpload} disabled={isWorking} />
                  </label>
                </div>
              </div>

              {/* Status feedback */}
              <AnimatePresence>
                {phase !== "idle" && (
                  <motion.div
                    key="status"
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className={`mb-6 flex items-center gap-3 px-5 py-3 rounded-2xl text-sm font-medium ${
                      phase === "error"
                        ? "bg-red-500/10 border border-red-500/20 text-red-400"
                        : phase === "done"
                        ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400"
                        : "bg-cyan-500/10 border border-cyan-500/20 text-cyan-300"
                    }`}
                  >
                    {phase === "error" ? (
                      <AlertCircle className="w-4 h-4 shrink-0" />
                    ) : isWorking ? (
                      <Loader2 className="w-4 h-4 shrink-0 animate-spin" />
                    ) : null}
                    <span>{phase === "error" ? errorMsg || PHASE_LABEL.error : PHASE_LABEL[phase]}</span>
                    {isWorking && (
                      <span className="ml-auto text-xs opacity-60 font-mono">
                        {phase === "uploading" ? "Sending…" : "Processing…"}
                      </span>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              <button
                onClick={handleStartGenerating}
                disabled={isWorking || !imageFile}
                className="flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-4 bg-cyan-400 hover:bg-cyan-300 disabled:bg-cyan-900 disabled:text-cyan-700 disabled:cursor-not-allowed text-[#0a1128] rounded-full font-bold transition-all shadow-[0_0_20px_rgba(34,211,238,0.3)] hover:shadow-[0_0_30px_rgba(34,211,238,0.5)] active:scale-[0.98]"
              >
                {isWorking ? (
                  <><Loader2 className="w-5 h-5 animate-spin" /> {phase === "uploading" ? "Uploading…" : "Generating…"}</>
                ) : (
                  <><Plus className="w-5 h-5" /> Start Campaign</>
                )}
              </button>
            </div>
          </section>

          {/* ── Recent Campaigns ── */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-display font-semibold text-white tracking-tight">Recent Campaigns</h2>
              <Link href="#" className="text-sm font-medium text-cyan-400 hover:text-cyan-300 transition-colors">View All</Link>
            </div>
            <div className="flex flex-col items-center justify-center py-16 bg-white/[0.02] border border-white/5 border-dashed rounded-3xl">
              <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-4">
                <History className="w-8 h-8 text-slate-500" />
              </div>
              <h3 className="text-lg font-medium text-white mb-2">No campaigns yet</h3>
              <p className="text-slate-400 text-sm max-w-sm text-center">
                Your generated flyers, captions, and videos will appear here once you create a campaign.
              </p>
            </div>
          </section>

          {/* ── Most Used Templates ── */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-display font-semibold text-white tracking-tight">Most Used Templates</h2>
              <Link href="/dashboard/templates" className="text-sm font-medium text-cyan-400 hover:text-cyan-300 transition-colors">View All</Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { name: "Digital Agency",  category: "Premium Brand",  Comp: PremiumBrandTemplate,  data: PREMIUM_BRAND_VARIATIONS.find((v) => v.name === "Digital Agency")! },
                { name: "Combo Offer",     category: "Sale Promotion", Comp: SalePromotionTemplate, data: SALE_PROMOTION_VARIATIONS.find((v) => v.name === "Combo Offer")! },
                { name: "Black Gold",      category: "Luxury Product", Comp: LuxuryProductTemplate, data: LUXURY_VARIATIONS.find((v) => v.name === "Black Gold")! },
              ].map(({ name, category, Comp, data }) => (
                <div
                  key={name}
                  onClick={() => router.push(`/dashboard/editor?variant=${encodeURIComponent(name)}&category=${encodeURIComponent(category)}`)}
                  className="group relative rounded-2xl overflow-hidden bg-white/5 border border-white/5 aspect-[4/3] cursor-pointer hover:border-cyan-400/50 transition-colors shadow-lg"
                >
                  <div className="w-full h-[120%] pointer-events-none select-none relative -mt-[10%] opacity-80 group-hover:opacity-100 transition-opacity">
                    <Comp {...(data as any)} />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a1128] via-[#0a1128]/40 to-transparent flex flex-col justify-end p-6 z-[60]">
                    <span className="text-[10px] uppercase font-bold tracking-widest text-cyan-400 mb-1">{category}</span>
                    <h3 className="text-lg font-medium text-white drop-shadow-md">{name}</h3>
                  </div>
                </div>
              ))}
            </div>
          </section>

        </div>
      </main>
    </div>
  );
}

function ArrowRight(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
    </svg>
  );
}
