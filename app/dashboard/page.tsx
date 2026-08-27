"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  Home, LayoutTemplate, ImageIcon, Crown, Plus,
  Video, Type, X, History, Upload, Menu, Loader2, AlertCircle, Pencil, Clock,
  LogOut, User, ArrowLeft,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Logo } from "@/components/Logo";
import { LuxuryProductTemplate } from "@/components/templates/LuxuryProduct";
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

/* ────────────────────────────────────────────────────────────────
   DESIGN TOKENS — "Campaign Ticket" system.
   Everything below is deliberately not navy/purple/glass: it borrows
   from print-shop dockets — kraft paper, stamps, perforation, mono
   labels — because the product's own output is a printed flyer.
   Keep these in one place so the palette never drifts per-section.
   ──────────────────────────────────────────────────────────────── */
const ink = "#16140F";
const panel = "#1D1A14";
const rule = "#38321F";
const paper = "#EDE6D6";
const paperMuted = "#C9BFA4";
const marigold = "#E8A33D";
const signal = "#D6491F";
const textPrimary = "#F3ECDD";
const textMuted = "#8C8368";

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
function getFirstName(fullName: string): string {
  return fullName.trim().split(/\s+/)[0] || "";
}

// ─────────────────────────────────────────────────────────────────────────────
// Upload state machine
// ─────────────────────────────────────────────────────────────────────────────
type UploadPhase = "idle" | "uploading" | "processing" | "done" | "error";

const PHASE_LABEL: Record<UploadPhase, string> = {
  idle:       "",
  uploading:  "Sending your photo across…",
  processing: "Putting your flyer, caption and video together…",
  done:       "Done — taking you to it now…",
  error:      "That didn't go through. Please try again.",
};

// ─────────────────────────────────────────────────────────────────────────────
// ScaledPreview — renders a template at its true design size, then scales the
// whole thing down as one rigid block. This is the fix for thumbnails that
// look cramped or overlapping: nothing ever reflows at a smaller width, it's
// just optically shrunk, exactly like a print proof reduced on a photocopier.
//
// TEMPLATE_CANVAS_W / H below must match the pixel size your template
// components are actually built at. If LuxuryProductTemplate / PremiumBrand
// Template use a different intrinsic canvas, change these two numbers only —
// nothing else in this component needs to know about it.
// ─────────────────────────────────────────────────────────────────────────────
const TEMPLATE_CANVAS_W = 1000;
const TEMPLATE_CANVAS_H = 1250;

function ScaledPreview({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.25);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const measure = () => setScale(el.offsetWidth / TEMPLATE_CANVAS_W);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className="relative w-full overflow-hidden rounded-lg"
      style={{ aspectRatio: `${TEMPLATE_CANVAS_W}/${TEMPLATE_CANVAS_H}` }}
    >
      <div
        className="absolute top-0 left-0 pointer-events-none select-none"
        style={{
          width: TEMPLATE_CANVAS_W,
          height: TEMPLATE_CANVAS_H,
          transform: `scale(${scale})`,
          transformOrigin: "top left",
        }}
      >
        {children}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Sidebar
// ─────────────────────────────────────────────────────────────────────────────
function Sidebar({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 z-40 lg:hidden"
            onClick={onClose} />
        )}
      </AnimatePresence>
      <motion.aside
        className={`fixed top-0 left-0 bottom-0 w-64 z-50 flex flex-col transition-transform lg:translate-x-0 ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
        style={{ background: panel, borderRight: `1px solid ${rule}` }}
      >
        <div className="p-6 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Logo className="w-8 h-8 rounded-lg" />
          </Link>
          <button className="lg:hidden p-1" style={{ color: textMuted }} onClick={onClose}><X className="w-5 h-5" /></button>
        </div>

        {/* Explicit way back to the marketing site — separate from the
            in-app "Dashboard" link below, since that one stays inside the app. */}
        <div className="px-6 pb-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 font-mono text-[11px] tracking-[0.15em]"
            style={{ color: textMuted }}
          >
            <ArrowLeft className="w-3.5 h-3.5" /> BACK TO HOME
          </Link>
        </div>

        <nav className="flex-1 overflow-y-auto py-2 px-4 flex flex-col gap-1" style={{ borderTop: `1px solid ${rule}` }}>
          <Link href="/dashboard" className="flex items-center gap-3 px-4 py-3 mt-4 rounded-xl font-medium" style={{ background: "rgba(232,163,61,0.12)", color: textPrimary }}>
            <Home className="w-5 h-5" style={{ color: marigold }} /> Dashboard
          </Link>
          <Link href="/dashboard/templates" className="flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors" style={{ color: textMuted }}>
            <LayoutTemplate className="w-5 h-5" /> Templates
          </Link>
        </nav>
        <div className="p-4" style={{ borderTop: `1px solid ${rule}` }}>
          <Link href="/pricing" className="flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors" style={{ background: "rgba(232,163,61,0.08)", color: marigold, border: `1px solid rgba(232,163,61,0.3)` }}>
            <Crown className="w-5 h-5" /> Move up to Pro
          </Link>
        </div>
      </motion.aside>
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Small building blocks specific to the "campaign ticket" concept
// ─────────────────────────────────────────────────────────────────────────────
function Stamp({ value, label }: { value: string; label: string }) {
  return (
    <div
      className="w-28 h-28 sm:w-32 sm:h-32 rounded-full flex flex-col items-center justify-center shrink-0"
      style={{ border: `2px dashed ${signal}`, transform: "rotate(-6deg)" }}
    >
      <span className="font-mono font-bold text-2xl sm:text-3xl leading-none" style={{ color: signal }}>{value}</span>
      <span className="font-mono text-[9px] sm:text-[10px] tracking-widest mt-1 text-center px-2" style={{ color: signal }}>{label}</span>
    </div>
  );
}

function Perforation() {
  return (
    <div className="relative h-px mx-8 sm:mx-10">
      <div style={{ borderTop: `2px dashed ${rule}` }} />
      <div className="absolute -left-[10px] -top-[9px] w-[18px] h-[18px] rounded-full" style={{ background: ink }} />
      <div className="absolute -right-[10px] -top-[9px] w-[18px] h-[18px] rounded-full" style={{ background: ink }} />
    </div>
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

  const handleLogout = async () => {
    await fetch("/api/auth/logout/", {
      method: "POST",
      headers: { Authorization: `Bearer ${getAccessToken()}` },
    });
    localStorage.clear();
    window.location.replace("/login");
  };

  useEffect(() => {
    async function fetchRecentCampaigns() {
      if (!user) return;
      try {
        const data = await apiFetch<RecentCampaign[]>('/api/campaign/recent/');
        setRecentCampaigns(data);
      } catch (error) {
        console.error('Error fetching recent campaigns:', error);
        setRecentCampaigns([]);
      } finally {
        setRecentCampaignsLoading(false);
      }
    }
    if (user) fetchRecentCampaigns();
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
        setDashboardError(error instanceof Error ? error.message : 'Could not load your account details');
      } finally {
        setDashboardLoading(false);
      }
    }
    if (user) fetchDashboardData();
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
      alert("Add a product photo first — that's what we build the flyer from.");
      return;
    }
    try {
      setPhase("uploading");
      const { job_id } = await createCampaignJob(imageFile);
      setPhase("processing");
      const result = await pollUntilDone(job_id, {
        intervalMs: 2000,
        maxAttempts: 90,
        onStatus: (status: JobStatus) => { if (status === "processing") setPhase("processing"); },
      });
      saveJobResult(result);
      setPhase("done");
      apiFetch<RecentCampaign[]>('/api/campaign/recent/').then(setRecentCampaigns).catch(() => {});
      try {
        await apiFetch('/api/pricing/track_generation/', {
          method: 'POST',
          body: JSON.stringify({ campaign_id: job_id, action: 'generated' }),
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
    if (remaining === Infinity || remaining === 'Infinity' || remaining === 999999) return '∞';
    return typeof remaining === 'number' ? remaining.toString() : remaining;
  };
  const getPlanDisplay = (planType: string) => {
    if (planType === 'free') return 'Free trial';
    if (planType === 'payg') return 'Pay as you go';
    if (planType === 'pro') return 'Pro plan';
    return planType;
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=IBM+Plex+Mono:wght@400;500;600;700&display=swap');
        .font-display { font-family: 'Space Grotesk', ui-sans-serif, system-ui, sans-serif; }
        .font-mono { font-family: 'IBM Plex Mono', ui-monospace, monospace; }
        button, a, label, [role="button"] { touch-action: manipulation; }
        html, body { overflow-x: hidden; max-width: 100%; }
        .job-btn { transition: transform .15s ease; }
        .job-btn:hover:not(:disabled) { transform: translateY(-2px); }
        .job-btn:active:not(:disabled) { transform: translateY(0); }
        .lift:hover { transform: translateY(-3px); }
        .lift { transition: transform .18s ease, border-color .18s ease; }
      `}</style>

      <div className="min-h-screen font-sans flex overflow-x-hidden" style={{ background: ink, color: textPrimary }}>
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        <main className="flex-1 lg:ml-64 relative min-h-screen w-full max-w-full overflow-x-hidden">

          <header className="lg:hidden flex items-center justify-between p-4 sticky top-0 z-30" style={{ background: `${ink}cc`, borderBottom: `1px solid ${rule}`, backdropFilter: "blur(6px)" }}>
            <Link href="/" className="flex items-center gap-2" style={{ color: textMuted }}>
              <ArrowLeft className="w-4 h-4" />
              <Logo className="w-8 h-8 rounded-md" />
            </Link>
            <button onClick={() => setSidebarOpen(true)} className="p-3 -m-3" style={{ color: textMuted }}>
              <Menu className="w-6 h-6" />
            </button>
          </header>

          <div className="p-3 sm:p-6 md:p-10 max-w-6xl mx-auto space-y-10 sm:space-y-14 w-full max-w-full">

            {/* ── CAMPAIGN TICKET: greeting + create-campaign as one torn ticket ── */}
            <section className="rounded-3xl overflow-hidden" style={{ background: panel, border: `1px solid ${rule}` }}>

              {/* stub */}
              <div className="p-6 sm:p-9 pb-6 sm:pb-7 flex flex-col sm:flex-row justify-between items-start gap-6">
                <div className="min-w-0">
                  {loading ? (
                    <div className="animate-pulse space-y-3">
                      <div className="h-3 w-40 rounded-full" style={{ background: rule }} />
                      <div className="h-9 w-72 rounded-xl" style={{ background: rule }} />
                    </div>
                  ) : (
                    <>
                      <span className="font-mono text-xs tracking-[0.2em]" style={{ color: textMuted }}>
                        CAMPAIGN TICKET — {new Date().toLocaleDateString("en-GB", { weekday: "short", day: "2-digit", month: "short" }).toUpperCase()}
                      </span>
                      <h1 className="font-display text-2xl sm:text-3xl md:text-4xl font-semibold mt-2 leading-tight break-words">
                        {greeting}, {getFirstName(user?.full_name ?? "")}.<br className="hidden sm:block" /> Let&apos;s get something printed.
                      </h1>
                      <p className="mt-3 max-w-md text-sm sm:text-base" style={{ color: textMuted }}>
                        Upload one product photo. We turn it into a flyer, a caption and a short video — ready to post.
                      </p>
                    </>
                  )}
                </div>
                {!dashboardLoading && dashboardData && (
                  <Stamp
                    value={getCampaignsDisplay(dashboardData.campaigns_remaining)}
                    label="CAMPAIGNS LEFT"
                  />
                )}
              </div>

              <Perforation />

              {/* order form */}
              <div className="p-6 sm:p-9 pt-6 sm:pt-7">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">

                  <div>
                    <p className="font-mono text-[11px] tracking-[0.2em]" style={{ color: textMuted }}>THIS CAMPAIGN INCLUDES</p>
                    <div className="mt-3 flex flex-col gap-1">
                      <label className="flex items-center gap-3 px-2 py-2.5 rounded-lg opacity-90 cursor-not-allowed">
                        <input type="checkbox" className="w-4 h-4 shrink-0 pointer-events-none" checked readOnly disabled style={{ accentColor: marigold }} />
                        <ImageIcon className="w-4 h-4 shrink-0" style={{ color: textMuted }} />
                        <span className="text-sm font-medium">Flyer design</span>
                        <span className="font-mono text-[10px] ml-auto" style={{ color: textMuted }}>REQUIRED</span>
                      </label>
                      <label className="flex items-center gap-3 px-2 py-2.5 rounded-lg opacity-90 cursor-not-allowed">
                        <input type="checkbox" className="w-4 h-4 shrink-0 pointer-events-none" checked readOnly disabled style={{ accentColor: marigold }} />
                        <Type className="w-4 h-4 shrink-0" style={{ color: textMuted }} />
                        <span className="text-sm font-medium">Social caption</span>
                        <span className="font-mono text-[10px] ml-auto" style={{ color: textMuted }}>REQUIRED</span>
                      </label>
                      <label className="flex items-center gap-3 px-2 py-2.5 rounded-lg cursor-pointer transition-colors" style={{ }}>
                        <input type="checkbox" className="w-4 h-4 shrink-0" checked={generateVideo} onChange={(e) => setGenerateVideo(e.target.checked)} style={{ accentColor: marigold }} />
                        <Video className="w-4 h-4 shrink-0" style={{ color: textMuted }} />
                        <span className="text-sm font-medium">Promo video</span>
                      </label>
                    </div>
                  </div>

                  <div className="rounded-2xl p-1" style={{ background: paper }}>
                    <label className={`flex-1 flex flex-col items-center justify-center min-h-[132px] sm:min-h-[152px] rounded-xl relative overflow-hidden ${isWorking ? "cursor-not-allowed" : "cursor-pointer"}`} style={{ border: `2px dashed ${paperMuted}` }}>
                      {previewImage ? (
                        <Image src={previewImage} alt="Uploaded product" fill className="object-contain p-3" />
                      ) : (
                        <div className="flex flex-col items-center justify-center py-6 px-4 text-center">
                          <Upload className="w-6 h-6 mb-2" style={{ color: ink }} />
                          <p className="text-sm font-semibold" style={{ color: ink }}>Click to upload a photo</p>
                          <p className="font-mono text-[11px] mt-1" style={{ color: "#6b6250" }}>PNG, JPG OR WEBP</p>
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
                      className="mt-5 sm:mt-6 flex items-center gap-3 px-4 sm:px-5 py-3 rounded-xl text-sm font-medium"
                      style={{
                        background: phase === "error" ? "rgba(214,73,31,0.1)" : phase === "done" ? "rgba(120,180,120,0.1)" : "rgba(232,163,61,0.1)",
                        border: `1px solid ${phase === "error" ? "rgba(214,73,31,0.35)" : phase === "done" ? "rgba(120,180,120,0.35)" : "rgba(232,163,61,0.35)"}`,
                        color: phase === "error" ? signal : phase === "done" ? "#8FD08F" : marigold,
                      }}
                    >
                      {phase === "error" ? <AlertCircle className="w-4 h-4 shrink-0" /> : isWorking ? <Loader2 className="w-4 h-4 shrink-0 animate-spin" /> : null}
                      <span className="flex-1 break-words">{phase === "error" ? errorMsg || PHASE_LABEL.error : PHASE_LABEL[phase]}</span>
                    </motion.div>
                  )}
                </AnimatePresence>

                <button
                  onClick={handleStartGenerating}
                  disabled={isWorking || !imageFile}
                  className="job-btn flex items-center justify-center gap-2 w-full sm:w-auto mt-6 px-7 py-4 rounded-full font-bold transition-colors disabled:cursor-not-allowed min-h-[44px] whitespace-nowrap"
                  style={{
                    background: isWorking || !imageFile ? "#5A4A22" : marigold,
                    color: isWorking || !imageFile ? "#8C7C52" : ink,
                  }}
                >
                  {isWorking ? (
                    <><Loader2 className="w-5 h-5 animate-spin" /> {phase === "uploading" ? "Sending…" : "Building…"}</>
                  ) : (
                    <><Plus className="w-5 h-5" /> Start the campaign</>
                  )}
                </button>
              </div>
            </section>

            {/* ── STAT RECEIPT STRIP ── */}
            <section className="rounded-2xl grid grid-cols-1 sm:grid-cols-3" style={{ background: paper, color: ink }}>
              <div className="p-5 sm:p-6">
                <p className="text-xs uppercase tracking-wide" style={{ color: "#5a523f" }}>Campaigns left</p>
                {dashboardLoading ? (
                  <div className="h-8 w-16 rounded-lg mt-2 animate-pulse" style={{ background: paperMuted }} />
                ) : dashboardError ? (
                  <p className="text-sm mt-2" style={{ color: signal }}>{dashboardError}</p>
                ) : (
                  <>
                    <p className="font-mono text-3xl font-bold mt-1">{getCampaignsDisplay(dashboardData?.campaigns_remaining ?? 0)}</p>
                    <p className="text-xs mt-1" style={{ color: "#6b6250" }}>{dashboardData?.plan ? getPlanDisplay(dashboardData.plan.plan_type) : "No plan yet"}</p>
                  </>
                )}
              </div>
              <div className="p-5 sm:p-6" style={{ borderTop: `1px dashed ${paperMuted}`, borderLeft: `1px dashed ${paperMuted}` }}>
                <p className="text-xs uppercase tracking-wide" style={{ color: "#5a523f" }}>Flyers made so far</p>
                {dashboardLoading ? (
                  <div className="h-8 w-16 rounded-lg mt-2 animate-pulse" style={{ background: paperMuted }} />
                ) : (
                  <>
                    <p className="font-mono text-3xl font-bold mt-1">{dashboardData?.campaigns_generated ?? 0}</p>
                    <p className="text-xs mt-1" style={{ color: "#6b6250" }}>Since you joined</p>
                  </>
                )}
              </div>
              <div className="p-5 sm:p-6" style={{ borderTop: `1px dashed ${paperMuted}` }}>
                <p className="text-xs uppercase tracking-wide" style={{ color: "#5a523f" }}>Plan status</p>
                {dashboardLoading ? (
                  <div className="h-8 w-24 rounded-lg mt-2 animate-pulse" style={{ background: paperMuted }} />
                ) : (
                  <>
                    <p className="font-mono text-xl font-bold mt-1 break-words">{dashboardData?.plan?.name || "Free trial"}</p>
                    <p className="text-xs mt-1 flex items-center gap-1.5" style={{ color: "#6b6250" }}>
                      <span className="inline-block w-2 h-2 rounded-full" style={{ background: dashboardData?.is_active ? "#5FA05F" : signal }} />
                      {dashboardData?.is_active ? "Active" : "Inactive"}
                    </p>
                  </>
                )}
              </div>
            </section>

            {/* ── Recent Campaigns: contact sheet ── */}
            <section>
              <div className="flex items-center justify-between mb-4 sm:mb-5">
                <h2 className="font-display text-lg sm:text-xl font-semibold tracking-tight">Recent campaigns</h2>
                {recentCampaigns.length > 4 && (
                  <button
                    onClick={() => setShowAllCampaigns(v => !v)}
                    className="font-mono text-xs tracking-wide px-3 py-2 -my-2 min-h-[44px] flex items-center"
                    style={{ color: marigold }}
                  >
                    {showAllCampaigns ? "SHOW LESS" : "VIEW ALL →"}
                  </button>
                )}
              </div>

              {recentCampaignsLoading ? (
                <div className="grid grid-cols-2 min-[400px]:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="space-y-2">
                      <div className="aspect-[4/5] rounded-xl animate-pulse" style={{ background: panel }} />
                      <div className="h-3 w-3/4 rounded-full animate-pulse" style={{ background: panel }} />
                    </div>
                  ))}
                </div>
              ) : recentCampaigns.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 sm:py-16 rounded-2xl" style={{ background: panel, border: `1px dashed ${rule}` }}>
                  <History className="w-8 h-8 mb-4" style={{ color: textMuted }} />
                  <h3 className="text-base sm:text-lg font-semibold mb-2">No campaigns yet</h3>
                  <p className="text-sm max-w-sm text-center px-4" style={{ color: textMuted }}>
                    Start your first campaign above and it will show up here — flyer, caption and video together.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-2 min-[400px]:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                  {(showAllCampaigns ? recentCampaigns : recentCampaigns.slice(0, 4)).map((c) => (
                    <Link
                      key={c.job_id}
                      href={`/dashboard/editor?job=${c.job_id}`}
                      className="lift group flex flex-col gap-2 rounded-2xl p-2"
                      style={{ background: panel, border: `1px solid ${rule}` }}
                    >
                      <div className="relative aspect-[4/5] rounded-xl overflow-hidden">
                        {c.png_url ? (
                          <Image src={c.png_url} alt={c.headline ?? "Campaign"} fill className="object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center" style={{ background: "#141210" }}>
                            <History className="w-6 h-6" style={{ color: textMuted }} />
                          </div>
                        )}
                        {c.template_category && (
                          <span className="font-mono absolute top-2 left-2 text-[9px] tracking-wide px-2 py-1 rounded" style={{ background: `${ink}c0`, color: textPrimary }}>
                            {c.template_category.toUpperCase()}
                          </span>
                        )}
                        <div className="absolute bottom-2 right-2 w-8 h-8 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity" style={{ background: marigold }}>
                          <Pencil className="w-3.5 h-3.5" style={{ color: ink }} />
                        </div>
                      </div>
                      <div className="px-0.5">
                        <p className="text-[13px] font-medium truncate">{c.headline || "Untitled campaign"}</p>
                        <p className="font-mono flex items-center gap-1 text-[10.5px] mt-0.5" style={{ color: textMuted }}>
                          <Clock className="w-3 h-3 shrink-0" /> {timeAgo(c.created_at)}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </section>

           {/* ── Templates people reach for ── */}
<section>
  <div className="flex items-center justify-between mb-4 sm:mb-5">
    <h2 className="font-display text-lg sm:text-xl font-semibold tracking-tight">
      Templates people reach for
    </h2>

    <Link
      href="/dashboard/templates"
      className="font-mono text-xs tracking-wide px-3 py-2 -my-2 min-h-[44px] flex items-center"
      style={{ color: marigold }}
    >
      VIEW ALL →
    </Link>
  </div>

  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
    {[
      {
        name: "Digital Agency",
        category: "Premium brand",
        Comp: PremiumBrandTemplate,
        data: PREMIUM_BRAND_VARIATIONS.find(
          (v) => v.name === "Digital Agency"
        ),
      },
      {
        name: "Black Gold",
        category: "Luxury product",
        Comp: LuxuryProductTemplate,
        data: LUXURY_VARIATIONS.find(
          (v) => v.name === "Black Gold"
        ),
      },
    ]
      .filter((template) => template.data)
      .map(({ name, category, Comp, data }) => (
        <button
          key={name}
          type="button"
          onClick={() =>
            router.push(
              `/dashboard/editor?variant=${encodeURIComponent(
                name
              )}&category=${encodeURIComponent(category)}`
            )
          }
          className="
            group
            w-full
            text-left
            rounded-2xl
            p-2
            cursor-pointer
            transition-transform
            duration-200
            hover:-translate-y-0.5
            focus:outline-none
            focus-visible:ring-2
            focus-visible:ring-offset-2
          "
          style={{
            background: paper,
            border: "1px solid rgba(0,0,0,0.06)",
          }}
        >
          {/* Preview */}
          <div
            className="overflow-hidden rounded-xl"
            style={{
              background: "#f4f0e8",
            }}
          >
            <ScaledPreview>
              <Comp {...(data as any)} />
            </ScaledPreview>
          </div>

          {/* Template information */}
          <div className="flex items-center justify-between mt-2.5 px-1.5 pb-1">
            <div className="min-w-0">
              <p
                className="text-sm font-bold truncate"
                style={{ color: ink }}
              >
                {name}
              </p>

              <p
                className="font-mono text-[10px] tracking-wide mt-0.5"
                style={{ color: "#6b6250" }}
              >
                {category.toUpperCase()}
              </p>
            </div>

            <span
              className="
                hidden
                sm:block
                font-mono
                text-[9px]
                tracking-wider
                opacity-0
                group-hover:opacity-100
                transition-opacity
              "
              style={{ color: marigold }}
            >
              USE →
            </span>
          </div>
        </button>
      ))}
  </div>
</section>

            {/* ── Security ── */}
            <section className="rounded-2xl p-5 sm:p-6 flex flex-col sm:flex-row justify-between sm:items-center gap-4" style={{ background: panel, border: `1px solid ${rule}` }}>
              <div>
                <h2 className="font-display text-base font-semibold">Security</h2>
                <p className="text-sm mt-1" style={{ color: textMuted }}>Sign out everywhere you&apos;re currently logged in.</p>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl transition-colors text-sm font-medium min-h-[44px]"
                style={{ border: `1px solid ${rule}`, color: textPrimary }}
              >
                <LogOut className="w-4 h-4" /> Log out all devices
              </button>
            </section>

          </div>
        </main>
      </div>
    </>
  );
}