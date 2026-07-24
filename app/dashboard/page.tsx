"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
   Home, LayoutTemplate, Image as ImageIcon, Settings, Crown, Plus,
  Video, Type, X, History, Upload, Menu, Loader2, AlertCircle, Pencil, Clock,
  MonitorSmartphone, // ← new import
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

interface RecentCampaign {
  job_id: string;
  headline: string | null;
  png_url: string | null;
  template_category: string | null;
  created_at: string;
}

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
function timeAgo(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(iso).toLocaleDateString(undefined, { month: "short", day: "numeric" });
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
// Sidebar
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
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [phase, setPhase]   = useState<UploadPhase>("idle");
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [dashboardLoading, setDashboardLoading] = useState(true);
  const [dashboardError, setDashboardError] = useState<string | null>(null);
  const [recentCampaigns, setRecentCampaigns] = useState<RecentCampaign[]>([]);
  const [recentCampaignsLoading, setRecentCampaignsLoading] = useState(true);
  const [showAllCampaigns, setShowAllCampaigns] = useState(false);
  const router = useRouter();
  const { user, loading } = useUser();
  const greeting = useGreeting();

  // ─── Logout handler ────────────────────────────────────────────────────────
  const handleLogout = async () => {
    await fetch("/api/auth/logout/", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${getAccessToken()}`,
      },
    });
    localStorage.clear();
    window.location.replace("/login");
  };

  useEffect(() => {
    async function fetchRecentCampaigns() {
      if (!user) return;
      try {
        const data = await apiFetch<RecentCampaign[]>('/api/campaign/recent/');
        console.log("recentCampaigns response:", data);
        setRecentCampaigns(data);
      } catch (error) {
        console.error('Error fetching recent campaigns:', error);
        setRecentCampaigns([]);
      } finally {
        setRecentCampaignsLoading(false);
      }
    }
    if (user) {
      fetchRecentCampaigns();
    }
  }, [user]);

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
      setPhase("uploading");
      const { job_id } = await createCampaignJob(imageFile);

      setPhase("processing");
      const result = await pollUntilDone(job_id, {
        intervalMs: 2000,
        maxAttempts: 90,
        onStatus: (status: JobStatus) => {
          if (status === "processing") setPhase("processing");
        },
      });

      saveJobResult(result);
      setPhase("done");
      apiFetch<RecentCampaign[]>('/api/campaign/recent/')
        .then(setRecentCampaigns)
        .catch(() => {});
      
      try {
        await apiFetch('/api/pricing/track_generation/', {
          method: 'POST',
          body: JSON.stringify({
            campaign_id: job_id,
            action: 'generated'
          }),
        });
        const updatedData = await apiFetch<DashboardData>('/api/pricing/dashboard/');
        setDashboardData(updatedData);
      } catch (trackError) {
        console.error('Error tracking generation:', trackError);
      }
      
      router.push("/dashboard/templates");
    } catch (err: any) {
      console.error("[Campaign]", err);
      setPhase("error");
      setErrorMsg(err?.message ?? "Unknown error");
    }
  };

  const isWorking = phase === "uploading" || phase === "processing";

  const getCampaignsDisplay = (remaining: number | string) => {
    if (remaining === Infinity || remaining === 'Infinity' || remaining === 999999) {
      return '♾️';
    }
    if (typeof remaining === 'number') {
      return remaining.toString();
    }
    return remaining;
  };

  const getPlanDisplay = (planType: string) => {
    if (planType === 'free') return 'Free Trial';
    if (planType === 'payg') return 'Pay-as-you-go';
    if (planType === 'pro') return 'Pro Plan';
    return planType;
  };

  const canGenerate = () => {
    if (!dashboardData) return false;
    const remaining = dashboardData.campaigns_remaining;
    if (remaining === Infinity || remaining === 'Infinity' || remaining === 999999) {
      return true;
    }
    return typeof remaining === 'number' && remaining > 0;
  };

  return (
    <>
      <style>{`
        button, a, label, [role="button"] {
          touch-action: manipulation;
        }
        html, body { overflow-x: hidden; max-width: 100%; }
      `}</style>

      <div className="min-h-screen bg-[#030712] text-slate-50 font-sans selection:bg-cyan-500 selection:text-white flex overflow-x-hidden">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        <main className="flex-1 lg:ml-64 relative min-h-screen w-full max-w-full overflow-x-hidden">

          <header className="lg:hidden flex items-center justify-between p-4 border-b border-white/5 bg-[#0a1128]/80 backdrop-blur-md sticky top-0 z-30">
            <Logo className="w-8 h-8 rounded-md" />
            <button onClick={() => setSidebarOpen(true)} className="p-3 -m-3 text-slate-300">
              <Menu className="w-6 h-6" />
            </button>
          </header>

          <div className="p-3 sm:p-6 md:p-10 max-w-6xl mx-auto space-y-8 sm:space-y-12 w-full max-w-full">

            {/* ── Greeting ── */}
            <section className="flex flex-col md:flex-row md:items-end justify-between gap-4 md:gap-6">
              <div className="min-w-0">
                {loading ? (
                  <div className="animate-pulse space-y-2">
                    <div className="h-3 w-20 bg-white/10 rounded-full" />
                    <div className="h-9 w-72 bg-white/10 rounded-xl" />
                  </div>
                ) : (
                  <>
                    <p className="text-slate-400 text-sm font-medium uppercase tracking-widest mb-1">Overview</p>
                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold text-white tracking-tight break-words">
                      {greeting}, {getFirstName(user?.full_name ?? "")} 
                    </h1>
                  </>
                )}
              </div>
              <div className="w-10 h-10 rounded-full bg-cyan-900 border-2 border-cyan-400 flex items-center justify-center text-cyan-50 font-bold text-sm shadow-lg shadow-cyan-400/20 shrink-0" title={user?.full_name ?? ""}>
                {loading ? <span className="w-4 h-4 bg-cyan-700 rounded-full animate-pulse" /> : getInitials(user?.full_name ?? "?")}
              </div>
            </section>

            {/* ── Stats ── */}
            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              <div className="bg-white/[0.03] border border-white/5 backdrop-blur-md p-4 sm:p-6 rounded-3xl">
                <div className="flex items-center justify-between mb-3 sm:mb-4">
                  <h3 className="text-slate-400 font-medium text-sm sm:text-base">Campaigns Left</h3>
                </div>
                {dashboardLoading ? (
                  <div className="animate-pulse">
                    <div className="h-10 w-20 bg-white/10 rounded-lg" />
                  </div>
                ) : dashboardError ? (
                  <div className="text-red-400 text-sm">{dashboardError}</div>
                ) : (
                  <>
                    <div className="text-3xl sm:text-4xl font-display font-medium text-white break-words">
                      {getCampaignsDisplay(dashboardData?.campaigns_remaining ?? 0)}
                    </div>
                    <p className="text-sm text-slate-500 mt-2 break-words">
                      {dashboardData?.plan ? getPlanDisplay(dashboardData.plan.plan_type) : 'No Plan'}
                    </p>
                  </>
                )}
              </div>

              <div className="bg-white/[0.03] border border-white/5 backdrop-blur-md p-4 sm:p-6 rounded-3xl">
                <div className="flex items-center justify-between mb-3 sm:mb-4">
                  <h3 className="text-slate-400 font-medium text-sm sm:text-base">Assets Generated</h3>
                  <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center shrink-0">
                    <ImageIcon className="w-4 h-4 text-indigo-400" />
                  </div>
                </div>
                {dashboardLoading ? (
                  <div className="animate-pulse">
                    <div className="h-10 w-20 bg-white/10 rounded-lg" />
                  </div>
                ) : (
                  <>
                    <div className="text-3xl sm:text-4xl font-display font-medium text-white">
                      {dashboardData?.campaigns_generated ?? 0}
                    </div>
                    <p className="text-sm text-slate-500 mt-2">Lifetime creations</p>
                  </>
                )}
              </div>

              <div className="bg-white/[0.03] border border-white/5 backdrop-blur-md p-4 sm:p-6 rounded-3xl">
                <div className="flex items-center justify-between mb-3 sm:mb-4">
                  <h3 className="text-slate-400 font-medium text-sm sm:text-base">Plan Status</h3>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
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
                    <div className="text-3xl sm:text-4xl font-display font-medium text-white break-words">
                      {dashboardData?.plan?.name || 'Free Trial'}
                    </div>
                    <p className="text-sm text-slate-500 mt-2 flex items-center gap-1.5 flex-wrap">
                      <span className={`inline-block w-2 h-2 rounded-full ${dashboardData?.is_active ? 'bg-emerald-400' : 'bg-rose-400'}`} />
                      {dashboardData?.is_active ? 'Active' : 'Inactive'}
                    </p>
                  </>
                )}
              </div>
            </section>

            {/* ── Create Campaign ── */}
            <section className="bg-gradient-to-tr from-[#0a1128] to-cyan-950/40 border border-cyan-500/20 rounded-[2rem] p-4 sm:p-8 md:p-12 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-32 bg-cyan-500/10 blur-[100px] rounded-full mix-blend-screen pointer-events-none" />
              <div className="absolute bottom-0 left-0 p-32 bg-indigo-500/10 blur-[100px] rounded-full mix-blend-screen pointer-events-none" />

              <div className="max-w-4xl relative z-10">
                <h2 className="text-2xl sm:text-3xl font-display font-bold text-white mb-2 tracking-tight break-words">Create New Campaign</h2>
                <p className="text-slate-400 mb-4 sm:mb-8 max-w-xl text-sm sm:text-base break-words">
                  Upload your product image and select the assets you want to generate. Click start to auto-generate from beautiful templates.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-4 sm:mb-8">
                  <div className="bg-[#030712]/50 rounded-2xl p-4 sm:p-6 border border-white/5 backdrop-blur-sm space-y-3 sm:space-y-4">
                    <p className="text-xs font-mono text-slate-500 uppercase tracking-widest font-bold">Includes:</p>

                    <label className="flex items-center gap-3 sm:gap-4 p-2 sm:p-3 rounded-xl opacity-80 cursor-not-allowed">
                      <input type="checkbox" className="w-5 h-5 rounded border-slate-700 bg-slate-900 text-cyan-400 pointer-events-none shrink-0" checked readOnly disabled />
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-8 h-8 rounded-lg bg-cyan-500/10 flex items-center justify-center shrink-0"><ImageIcon className="w-4 h-4 text-cyan-400" /></div>
                        <span className="font-medium text-slate-200 text-sm truncate">Flyer Design <span className="text-xs text-slate-400 ml-1">(Required)</span></span>
                      </div>
                    </label>

                    <label className="flex items-center gap-3 sm:gap-4 p-2 sm:p-3 rounded-xl opacity-80 cursor-not-allowed">
                      <input type="checkbox" className="w-5 h-5 rounded border-slate-700 bg-slate-900 text-cyan-400 pointer-events-none shrink-0" checked readOnly disabled />
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center shrink-0"><Type className="w-4 h-4 text-indigo-400" /></div>
                        <span className="font-medium text-slate-200 text-sm truncate">Social Caption <span className="text-xs text-slate-400 ml-1">(Required)</span></span>
                      </div>
                    </label>

                    <label className="flex items-center gap-3 sm:gap-4 p-2 sm:p-3 rounded-xl hover:bg-white/5 transition-colors cursor-pointer">
                      <input type="checkbox" className="w-5 h-5 rounded border-slate-700 bg-slate-900 text-cyan-400 shrink-0"
                        checked={generateVideo} onChange={(e) => setGenerateVideo(e.target.checked)} />
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center shrink-0"><Video className="w-4 h-4 text-purple-400" /></div>
                        <span className="font-medium text-slate-200 text-sm">Promo Video</span>
                      </div>
                    </label>
                  </div>

                  <div className="bg-[#030712]/50 rounded-2xl p-4 sm:p-6 border border-white/5 backdrop-blur-sm flex flex-col gap-3 sm:gap-4">
                    <div className="flex items-center justify-between flex-wrap gap-1">
                      <p className="text-xs font-mono text-slate-500 uppercase tracking-widest font-bold">Product Image</p>
                      <span className="text-xs font-medium text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded-full">Required</span>
                    </div>

                    <label className={`flex-1 flex flex-col items-center justify-center min-h-[120px] sm:min-h-[160px] border-2 border-dashed rounded-2xl transition-all group overflow-hidden relative ${isWorking ? "border-cyan-400/60 cursor-not-allowed" : "border-cyan-500/30 cursor-pointer bg-cyan-950/10 hover:bg-cyan-950/20"}`}>
                      {previewImage ? (
                        <Image src={previewImage} alt="Uploaded product" fill className="object-contain p-2 sm:p-4" />
                      ) : (
                        <div className="flex flex-col items-center justify-center py-4 sm:py-8 px-4 text-center">
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

                <AnimatePresence>
                  {phase !== "idle" && (
                    <motion.div
                      key="status"
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      className={`mb-4 sm:mb-6 flex items-center gap-3 px-4 sm:px-5 py-3 rounded-2xl text-sm font-medium ${
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
                      <span className="flex-1 break-words">{phase === "error" ? errorMsg || PHASE_LABEL.error : PHASE_LABEL[phase]}</span>
                      {isWorking && (
                        <span className="text-xs opacity-60 font-mono shrink-0">
                          {phase === "uploading" ? "Sending…" : "Processing…"}
                        </span>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>

                <button
                  onClick={handleStartGenerating}
                  disabled={isWorking || !imageFile}
                  className="flex items-center justify-center gap-2 w-full sm:w-auto px-6 sm:px-8 py-4 bg-cyan-400 hover:bg-cyan-300 disabled:bg-cyan-900 disabled:text-cyan-700 disabled:cursor-not-allowed text-[#0a1128] rounded-full font-bold transition-all shadow-[0_0_20px_rgba(34,211,238,0.3)] hover:shadow-[0_0_30px_rgba(34,211,238,0.5)] active:scale-[0.98] min-h-[44px] whitespace-nowrap"
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
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <h2 className="text-lg sm:text-xl font-display font-semibold text-white tracking-tight">Recent Campaigns</h2>
                {recentCampaigns.length > 4 && (
                  <button
                    onClick={() => setShowAllCampaigns(v => !v)}
                    className="text-sm font-medium text-cyan-400 hover:text-cyan-300 transition-colors px-3 py-2 -my-2 min-h-[44px] flex items-center"
                  >
                    {showAllCampaigns ? "Show less" : "View All"}
                  </button>
                )}
              </div>

              {recentCampaignsLoading ? (
                <div className="grid grid-cols-2 min-[400px]:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="space-y-2">
                      <div className="aspect-[4/5] rounded-2xl bg-white/[0.04] animate-pulse" />
                      <div className="h-3 w-3/4 bg-white/[0.04] rounded-full animate-pulse" />
                    </div>
                  ))}
                </div>
              ) : recentCampaigns.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 sm:py-16 bg-white/[0.02] border border-white/5 border-dashed rounded-3xl">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-4">
                    <History className="w-7 h-7 sm:w-8 sm:h-8 text-slate-500" />
                  </div>
                  <h3 className="text-base sm:text-lg font-medium text-white mb-2">No campaigns yet</h3>
                  <p className="text-slate-400 text-sm max-w-sm text-center px-4">
                    Your generated flyers, captions, and videos will appear here once you create a campaign.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-2 min-[400px]:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
                  {(showAllCampaigns ? recentCampaigns : recentCampaigns.slice(0, 4)).map((c) => (
                    <Link
                      key={c.job_id}
                      href={`/dashboard/editor?job=${c.job_id}`}
                      className="group flex flex-col gap-2"
                    >
                      <div className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-white/[0.03] ring-1 ring-white/5 group-hover:ring-cyan-400/40 transition-all duration-200 group-hover:-translate-y-0.5">
                        {c.png_url ? (
                          <Image src={c.png_url} alt={c.headline ?? "Campaign"} fill
                            className="object-cover transition-transform duration-300 group-hover:scale-[1.03]" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <History className="w-6 h-6 text-slate-600" />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/25 transition-colors duration-200 flex items-center justify-center">
                          <div className="w-9 h-9 rounded-full bg-white/95 flex items-center justify-center opacity-0 group-hover:opacity-100 scale-90 group-hover:scale-100 transition-all duration-200 shadow-lg">
                            <Pencil className="w-4 h-4 text-[#0a1128]" />
                          </div>
                        </div>
                        {c.template_category && (
                          <span className="absolute top-2.5 left-2.5 text-[9px] font-semibold uppercase tracking-wider text-white/90 bg-black/40 backdrop-blur-sm px-2 py-1 rounded-full">
                            {c.template_category}
                          </span>
                        )}
                      </div>
                      <div className="px-0.5">
                        <p className="text-[13px] font-medium text-slate-200 truncate group-hover:text-white transition-colors">
                          {c.headline || "Untitled campaign"}
                        </p>
                        <p className="flex items-center gap-1 text-[11px] text-slate-500 mt-0.5">
                          <Clock className="w-3 h-3 shrink-0" />
                          {timeAgo(c.created_at)}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </section>

            {/* ── Most Used Templates ── */}
            <section>
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <h2 className="text-lg sm:text-xl font-display font-semibold text-white tracking-tight">Most Used Templates</h2>
                <Link href="/dashboard/templates" className="text-sm font-medium text-cyan-400 hover:text-cyan-300 transition-colors px-3 py-2 -my-2 min-h-[44px] flex items-center">
                  View All
                </Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
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
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a1128] via-[#0a1128]/40 to-transparent flex flex-col justify-end p-4 sm:p-6 z-[60]">
                      <span className="text-[10px] uppercase font-bold tracking-widest text-cyan-400 mb-1">{category}</span>
                      <h3 className="text-base sm:text-lg font-medium text-white drop-shadow-md">{name}</h3>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* ── NEW: Security Section ── */}
            <section className="bg-white/[0.03] border border-white/5 backdrop-blur-md p-5 sm:p-6 rounded-3xl">
              <h2 className="text-xl font-display font-semibold text-white mb-4">Security</h2>
              <button
                onClick={handleLogout}
                className="flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-3 border border-white/20 rounded-xl hover:bg-white/5 transition-colors text-sm font-medium text-slate-300 hover:text-white min-h-[44px] touch-manipulation"
              >
                <MonitorSmartphone className="w-4 h-4" />
                Log out all devices
              </button>
            </section>

          </div>
        </main>
      </div>
    </>
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