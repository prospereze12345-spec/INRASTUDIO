"use client";

import { useState, useEffect } from "react";
import { motion } from "motion/react";
import {
  CheckCircle,
  Facebook,
  Instagram,
  Loader2,
  AlertCircle,
  ArrowRight,
} from "lucide-react";
import { Logo } from "@/components/Logo";
import { Navbar } from "@/components/Navbar";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/auth";

interface Plan {
  id: number;
  name: string;
  plan_type: string;
  price_display: string;
  old_price_display: string | null;
  campaigns_per_month: number | null;
  has_watermark: boolean;
  priority_queue: boolean;
  premium_templates: boolean;
  is_active: boolean;
  currency?: string;
}

interface InitiatePaymentResponse {
  status: string;
  redirect_url?: string;
  reference?: string;
  message?: string;
  transaction_id: string; // add this

}

function Footer() {
  return (
    <footer className="pt-24 pb-12 px-6 bg-[#030712] border-t border-white/5 relative overflow-hidden mt-12 w-full">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row justify-between items-start gap-16 pb-40 relative z-20">
        <div className="flex-1 max-w-3xl">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-medium text-slate-200 tracking-tight leading-tight">
            Ready to create something cool together, or just explore our solutions.
          </h2>
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
            <a href="#" className="text-slate-300 hover:text-white transition-colors flex items-center gap-2 group">
              <Facebook className="w-4 h-4 text-slate-400" />
              FACEBOOK
              <ArrowRight className="w-3 h-3 -rotate-45 group-hover:text-cyan-400 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
            </a>
            <a href="#" className="text-slate-300 hover:text-white transition-colors flex items-center gap-2 group">
              <Instagram className="w-4 h-4 text-slate-400" />
              INSTAGRAM
              <ArrowRight className="w-3 h-3 -rotate-45 group-hover:text-cyan-400 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
            </a>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between pt-12 border-t border-white/5 mt-12 text-sm text-slate-500 font-mono z-30 relative gap-4">
        <div className="flex items-center gap-3">
          <Logo className="w-8 h-8 rounded-lg" />
        </div>
        <p>© 2026 INRASTUDIO AI Marketing Studio.</p>
      </div>
    </footer>
  );
}

function Pricing() {
  const router = useRouter();
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  // Tracks which plan's button is mid-purchase, so only that button shows
  // a spinner instead of a global "submitting" flag.
  const [purchasingPlanType, setPurchasingPlanType] = useState<string | null>(null);

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
  try {
    setLoading(true);
    setError(null);

    const userStr = localStorage.getItem("user");
    const user = userStr ? JSON.parse(userStr) : {};
    const country = user.country || user.country_code || "";

    const response = await apiFetch<Plan[]>(
      `/api/pricing/plans/${country ? `?country=${encodeURIComponent(country)}` : ""}`
    );
    setPlans(response);
  } catch (err) {
    console.error("Error fetching plans:", err);
    setError("Failed to load pricing plans. Please try again.");
  } finally {
    setLoading(false);
  }
};
  /**
   * Clicking "Buy Now" / "Upgrade to Pro" goes straight to Flutterwave --
   * no channel-picker modal. Flutterwave's hosted checkout page already
   * detects the transaction currency and shows the right local payment
   * methods (card, bank transfer, USSD, mobile money, etc.) on its own.
   */
  const handlePurchase = async (plan: Plan) => {
    setPaymentError(null);

    const token = localStorage.getItem("access");
    if (!token) {
      router.push(`/signup?redirect=/pricing&plan=${plan.plan_type}`);
      return;
    }

    setPurchasingPlanType(plan.plan_type);

    try {
      const userStr = localStorage.getItem("user");
      const user = userStr ? JSON.parse(userStr) : {};
      const userId = user.id || "anonymous";
      const idempotencyKey = `${userId}_${plan.plan_type}_${Date.now()}_${Math.random()
        .toString(36)
        .substring(7)}`;

      const response = await apiFetch<InitiatePaymentResponse>(
  "/api/pricing/initiate_payment/",
  {
    method: "POST",
    body: JSON.stringify({
      plan_type: plan.plan_type,
      idempotency_key: idempotencyKey,
      country: user.country || user.country_code,
    }),
  }
);

      if (response.redirect_url) {
  sessionStorage.setItem("pending_transaction_id", response.transaction_id);
  window.location.href = response.redirect_url;
}

      if (response.status === "success") {
        // Idempotent replay of an already-completed payment.
        router.push("/dashboard");
        return;
      }

      setPaymentError(response.message || "Payment initialization failed. Please try again.");
      setPurchasingPlanType(null);
    } catch (err) {
      console.error("Payment error:", err);
      setPaymentError(err instanceof Error ? err.message : "Payment failed. Please try again.");
      setPurchasingPlanType(null);
    }
  };

  const handleFreeTrial = () => {
    const token = localStorage.getItem("access");
    if (!token) {
      router.push("/signup?redirect=/dashboard");
    } else {
      router.push("/dashboard");
    }
  };

  if (loading) {
    return (
      <section id="pricing" className="py-32 px-6 max-w-6xl mx-auto">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Loader2 className="w-12 h-12 text-cyan-400 animate-spin mx-auto mb-4" />
            <p className="text-slate-400">Loading plans...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="pricing" className="py-32 px-6 max-w-6xl mx-auto">
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-6 text-center">
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <p className="text-red-400">{error}</p>
          <button
            onClick={fetchPlans}
            className="mt-4 px-6 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors"
          >
            Retry
          </button>
        </div>
      </section>
    );
  }

  return (
    <section id="pricing" className="py-32 px-6 max-w-6xl mx-auto">
      <div className="text-center mb-20 md:mt-24 mt-16">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl md:text-6xl lg:text-7xl font-display font-medium text-white mb-6 tracking-tight"
        >
          Flexible plans for
          <br />
          every creator
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-xl text-slate-400"
        >
          Everything you need to step up your marketing game.
        </motion.p>
      </div>

      {paymentError && (
        <div className="mb-8 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-center">
          <AlertCircle className="w-5 h-5 inline-block mr-2" />
          {paymentError}
          <button
            onClick={() => setPaymentError(null)}
            className="ml-4 text-sm text-red-400 hover:text-red-300 underline"
          >
            Dismiss
          </button>
        </div>
      )}

      <div className="grid md:grid-cols-3 gap-8">
        {plans.map((plan) => {
          const isPro = plan.plan_type === "pro";
          const isFree = plan.plan_type === "free";
          const isPayg = plan.plan_type === "payg";
          const isPurchasing = purchasingPlanType === plan.plan_type;

          return (
            <div
              key={plan.id}
              className={`p-10 pb-12 rounded-3xl flex flex-col justify-between transition-all duration-300 ${
                isPro
                  ? "bg-gradient-to-br from-[#0a1128] to-cyan-900/40 border-2 border-cyan-500/50 shadow-[0_0_50px_rgba(34,211,238,0.1)] hover:shadow-[0_0_70px_rgba(34,211,238,0.2)]"
                  : "bg-white/[0.02] border border-white/5 hover:bg-white/[0.05]"
              } ${isPro ? "relative" : ""}`}
            >
              {isPro && (
                <div className="absolute top-0 inset-x-0 flex justify-center -translate-y-1/2">
                  <span className="px-5 py-2 rounded-full bg-cyan-400 text-[#0a1128] text-xs font-bold uppercase tracking-widest shadow-lg animate-pulse">
                    Most Popular
                  </span>
                </div>
              )}

              <div>
                <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                <p className="text-slate-400 text-sm mb-6">
                  {isFree ? "Test the platform." : isPayg ? "No commitments." : "For power users."}
                </p>

                <div className="text-5xl font-display font-medium text-white mb-10 flex flex-col">
                  {isFree ? (
                    <>
                      Free
                      <span className="text-base text-slate-400 font-normal uppercase tracking-widest mt-2">
                        / Month
                      </span>
                    </>
                  ) : (
                    <>
                      {plan.old_price_display && (
                        <span className="text-lg text-slate-500 line-through tracking-wide mb-1 decoration-red-500/50 decoration-2">
                          {plan.old_price_display}
                        </span>
                      )}
                      {plan.price_display}
                      <span className="text-base text-slate-400 font-normal uppercase tracking-widest mt-2">
                        / {isPayg ? "Campaign" : "Month"}
                      </span>
                    </>
                  )}
                </div>

                <ul className="space-y-4 mb-10">
                  {isFree ? (
                    <>
                      <li className="flex items-center gap-3 text-slate-300">
                        <CheckCircle className="w-5 h-5 text-slate-500 shrink-0" /> 1 Campaign Free
                      </li>
                      <li className="flex items-center gap-3 text-slate-300">
                        <CheckCircle className="w-5 h-5 text-slate-500 shrink-0" /> No watermark
                      </li>
                    </>
                  ) : isPayg ? (
                    <>
                      <li className="flex items-center gap-3 text-white">
                        <CheckCircle className="w-5 h-5 text-slate-500 shrink-0" /> 1 Full Campaign
                      </li>
                      <li className="flex items-center gap-3 text-white">
                        <CheckCircle className="w-5 h-5 text-cyan-400 shrink-0" /> No watermark
                      </li>
                      <li className="flex items-center gap-3 text-white">
                        <CheckCircle className="w-5 h-5 text-cyan-400 shrink-0" /> High resolution exports
                      </li>
                    </>
                  ) : (
                    <>
                      <li className="flex items-center gap-3 text-white">
                        <CheckCircle className="w-5 h-5 text-cyan-400 shrink-0" /> Unlimited Campaigns
                      </li>
                      <li className="flex items-center gap-3 text-white">
                        <CheckCircle className="w-5 h-5 text-cyan-400 shrink-0" /> No watermark
                      </li>
                      <li className="flex items-center gap-3 text-white">
                        <CheckCircle className="w-5 h-5 text-cyan-400 shrink-0" /> Priority queue generation
                      </li>
                      <li className="flex items-center gap-3 text-white">
                        <CheckCircle className="w-5 h-5 text-cyan-400 shrink-0" /> Premium templates
                      </li>
                    </>
                  )}
                </ul>
              </div>

              <button
                onClick={isFree ? handleFreeTrial : () => handlePurchase(plan)}
                disabled={isPurchasing}
                className={`w-full text-center py-4 rounded-full font-bold transition-all duration-300 shadow-lg mt-auto relative overflow-hidden flex items-center justify-center gap-2 disabled:opacity-70 ${
                  isPro
                    ? "bg-cyan-400 text-[#0a1128] hover:bg-cyan-300 hover:scale-105 shadow-[0_0_20px_rgba(34,211,238,0.3)] hover:shadow-[0_0_30px_rgba(34,211,238,0.5)]"
                    : isFree
                    ? "border border-white/20 hover:bg-white/10 text-white hover:scale-105"
                    : "bg-white text-[#0a1128] hover:bg-slate-200 hover:scale-105"
                }`}
              >
                {isPurchasing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Redirecting...
                  </>
                ) : isFree ? (
                  "Start for free"
                ) : isPro ? (
                  "Upgrade to Pro"
                ) : (
                  "Buy Now"
                )}
              </button>

              {!isFree && (
                <div className="mt-4 text-center">
                  <span className="text-xs text-slate-500">🔒 Secure payment via Flutterwave</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-16 text-center">
        <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500">
          <span className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-cyan-400" /> Secure payments
          </span>
          <span className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-cyan-400" /> Instant activation
          </span>
          <span className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-cyan-400" /> 24/7 support
          </span>
          <span className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-cyan-400" /> Money-back guarantee
          </span>
        </div>
      </div>
    </section>
  );
}

export default function PricingRoute() {
  return (
    <div className="min-h-screen bg-[#030712] text-slate-50 relative selection:bg-cyan-500 selection:text-white font-sans overflow-x-hidden">
      <Navbar />
      <main>
        <Pricing />
      </main>
      <Footer />
    </div>
  );
}