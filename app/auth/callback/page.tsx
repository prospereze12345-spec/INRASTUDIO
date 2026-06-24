"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function AuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = searchParams?.get("token");

    if (!token) return;

    const verifyToken = async () => {
      try {
        const res = await fetch(
          "http://127.0.0.1:8000/api/auth/verify/",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ token }),
          }
        );

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.detail || "Verification failed");
        }

        localStorage.setItem("access", data.access);
        localStorage.setItem("refresh", data.refresh);

        router.replace("/dashboard");
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Login verification failed."
        );
      } finally {
        setLoading(false);
      }
    };

    verifyToken();
  }, [searchParams, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#030712] text-white">
      {loading && !error && (
        <div className="flex items-center gap-2 text-slate-400">
          <Loader2 className="w-5 h-5 animate-spin" />
          Signing you in...
        </div>
      )}

      {error && (
        <div className="text-center space-y-4 max-w-sm">
          <p className="text-red-500 text-sm">{error}</p>

          <button
            onClick={() => router.push("/login")}
            className="text-cyan-400 font-semibold hover:underline"
          >
            Request new login link
          </button>
        </div>
      )}
    </div>
  );
}