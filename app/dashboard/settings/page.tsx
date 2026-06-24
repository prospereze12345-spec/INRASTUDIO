"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Home, LayoutTemplate, Settings, Crown, Menu, X, MonitorSmartphone } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useRouter } from "next/navigation";
import { Logo } from "@/components/Logo";

// ─────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────
interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  country: string;
}

// ─────────────────────────────────────────────────────────────
// Auth helpers (same style as dashboard)
// ─────────────────────────────────────────────────────────────
function getAccessToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("access");
}

function getRefreshToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("refresh");
}

async function refreshToken() {
  const refresh = getRefreshToken();
  if (!refresh) return null;

  const res = await fetch("/api/auth/token/refresh/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refresh }),
  });

  if (!res.ok) return null;

  const data = await res.json();
  localStorage.setItem("access", data.access);
  return data.access;
}

async function fetchMe(token: string): Promise<UserProfile> {
  const res = await fetch("/api/auth/me/", {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (res.status === 401) throw new Error("UNAUTHORIZED");
  if (!res.ok) throw new Error("ERROR");

  return res.json();
}

// ─────────────────────────────────────────────────────────────
// Hook (same pattern as dashboard)
// ─────────────────────────────────────────────────────────────
function useUser() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    let cancelled = false;

    async function load() {
      let token = getAccessToken();

      if (!token) {
        router.replace("/login");
        return;
      }

      try {
        const profile = await fetchMe(token);
        if (!cancelled) setUser(profile);
      } catch (err: any) {
        if (err.message === "UNAUTHORIZED") {
          const newToken = await refreshToken();

          if (!newToken) {
            localStorage.clear();
            router.replace("/login");
            return;
          }

          const profile = await fetchMe(newToken);
          if (!cancelled) setUser(profile);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [router]);

  return { user, loading };
}

// ─────────────────────────────────────────────────────────────
// Sidebar
// ─────────────────────────────────────────────────────────────
function Sidebar({ isOpen, onClose }: any) {
  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 z-40 lg:hidden"
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      <motion.aside
        className={`fixed top-0 left-0 bottom-0 w-64 bg-[#0a1128] border-r border-white/5 z-50 flex flex-col ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        <div className="p-6 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2">
            <Logo className="w-8 h-8" />
            <span className="text-white font-medium">INRASTUDIO</span>
          </Link>
          <button onClick={onClose} className="lg:hidden">
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        <nav className="flex-1 px-4 space-y-1">
          <Link href="/dashboard" className="flex gap-3 px-4 py-3 text-slate-400">
            <Home className="w-5 h-5" /> Dashboard
          </Link>

          <Link href="/dashboard/templates" className="flex gap-3 px-4 py-3 text-slate-400">
            <LayoutTemplate className="w-5 h-5" /> Templates
          </Link>

          <Link href="/dashboard/settings" className="flex gap-3 px-4 py-3 bg-white/10 text-white">
            <Settings className="w-5 h-5 text-cyan-400" /> Settings
          </Link>
        </nav>

        <div className="p-4 border-t border-white/5">
          <Link href="/pricing" className="flex gap-3 px-4 py-3 text-amber-400">
            <Crown className="w-5 h-5" /> Upgrade
          </Link>
        </div>
      </motion.aside>
    </>
  );
}

// ─────────────────────────────────────────────────────────────
// Page
// ─────────────────────────────────────────────────────────────
export default function SettingsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, loading } = useUser();

  const [fullName, setFullName] = useState("");
  const [country, setCountry] = useState("NG");

  useEffect(() => {
    if (user) {
      setFullName(user.full_name || "");
      setCountry(user.country || "NG");
    }
  }, [user]);

  const handleSave = async () => {
    await fetch("/api/auth/update-profile/", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getAccessToken()}`,
      },
      body: JSON.stringify({
        full_name: fullName,
        country,
      }),
    });

    alert("Profile updated");
  };

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

  return (
    <div className="min-h-screen bg-[#030712] text-white flex">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="flex-1 lg:ml-64">
        {/* Header */}
        <header className="lg:hidden flex justify-between p-4 border-b border-white/5">
          <Logo className="w-6 h-6" />
          <button onClick={() => setSidebarOpen(true)}>
            <Menu className="w-6 h-6" />
          </button>
        </header>

        <div className="max-w-3xl mx-auto p-6 space-y-10">
          <h1 className="text-3xl font-bold">Account Settings</h1>

          {/* PROFILE */}
          <section className="bg-white/5 p-6 rounded-2xl space-y-5">
            <h2 className="text-xl font-semibold">Profile</h2>

            <div>
              <label className="text-sm text-slate-400">Full Name</label>
              <input
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full mt-2 p-3 bg-[#0a1128] rounded-xl"
              />
            </div>

            <div>
              <label className="text-sm text-slate-400">Email</label>
              <input
                value={user?.email || ""}
                disabled
                className="w-full mt-2 p-3 bg-[#0a1128]/50 text-slate-400 rounded-xl"
              />
            </div>

            <div>
              <label className="text-sm text-slate-400">Country</label>
              <select
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="w-full mt-2 p-3 bg-[#0a1128] rounded-xl"
              >
                <option value="NG">Nigeria</option>
                <option value="GH">Ghana</option>
                <option value="KE">Kenya</option>
              </select>
            </div>

            <button
              onClick={handleSave}
              className="px-6 py-2 bg-cyan-400 text-black rounded-xl font-semibold"
            >
              Save Changes
            </button>
          </section>

          {/* SECURITY */}
          <section className="bg-white/5 p-6 rounded-2xl">
            <h2 className="text-xl font-semibold mb-4">Security</h2>

            <button
              onClick={handleLogout}
              className="px-4 py-2 border border-white/20 rounded-lg flex items-center gap-2"
            >
              <MonitorSmartphone className="w-4 h-4" />
              Log out all devices
            </button>
          </section>
        </div>
      </main>
    </div>
  );
}