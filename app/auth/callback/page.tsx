"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { DashboardSkeleton } from "@/components/DashboardSkeleton";
import { ThemeProvider, useTheme } from "@/lib/theme";

const VERIFY_URL = "https://inrabackend-docker.onrender.com/api/auth/verify/";

interface VerifyResponse {
  access: string;
  refresh: string;
  detail?: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Error state (only shown when verification actually fails)
// ─────────────────────────────────────────────────────────────────────────────
function CallbackError({
  message,
  onRetry,
}: {
  message: string;
  onRetry: () => void;
}) {
  const { tokens } = useTheme();
  const { ink, panel, rule, signal, marigold, textPrimary } = tokens;

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ background: ink, color: textPrimary }}
    >
      <div
        className="w-full max-w-sm rounded-2xl p-6 text-center space-y-4"
        style={{ background: panel, border: `1px solid ${rule}` }}
        role="alert"
      >
        <p className="text-sm" style={{ color: signal }}>
          {message}
        </p>

        <button
          onClick={onRetry}
          className="min-h-[44px] rounded-full px-6 py-3 text-sm font-semibold"
          style={{ background: marigold, color: ink }}
        >
          Request new login link
        </button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Callback logic
// ─────────────────────────────────────────────────────────────────────────────
function AuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState("");

  // Login tokens are single-use. In development, React Strict Mode runs
  // effects twice, which would burn the token on the first call and fail the
  // second. The ref makes sure we only verify once.
  const startedRef = useRef(false);

  useEffect(() => {
    if (startedRef.current) return;

    const token = searchParams?.get("token");

    if (!token) {
      setError("This login link is missing or invalid.");
      return;
    }

    startedRef.current = true;

    const verifyToken = async () => {
      try {
        const res = await fetch(VERIFY_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        });

        const data: VerifyResponse = await res.json();

        if (!res.ok) {
          throw new Error(data.detail || "Verification failed");
        }

        localStorage.setItem("access", data.access);
        localStorage.setItem("refresh", data.refresh);

        router.replace("/dashboard");
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Login verification failed."
        );
      }
    };

    verifyToken();
  }, [searchParams, router]);

  if (error) {
    return <CallbackError message={error} onRetry={() => router.push("/login")} />;
  }

  // While verifying (and during the redirect) the user sees the dashboard
  // skeleton, so the page already looks like where they're going.
  return <DashboardSkeleton />;
}

export default function AuthCallbackPage() {
  return (
    <ThemeProvider>
      <Suspense fallback={<DashboardSkeleton />}>
        <AuthCallbackContent />
      </Suspense>
    </ThemeProvider>
  );
}