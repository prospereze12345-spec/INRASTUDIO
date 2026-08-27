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
  ShieldCheck,
  Zap,
  Crown,
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
  transaction_id: string;
}

const ink = "#16140F";
const panel = "#1D1A14";
const panelSoft = "#242016";
const rule = "#38321F";
const paper = "#EDE6D6";
const paperMuted = "#C9BFA4";
const marigold = "#E8A33D";
const signal = "#D6491F";
const textPrimary = "#F3ECDD";
const textMuted = "#8C8368";

function Footer() {
  return (
    <footer
      className="pt-24 pb-12 px-6 relative overflow-hidden mt-12 w-full"
      style={{
        background: ink,
        borderTop: `1px solid ${rule}`,
      }}
    >
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row justify-between items-start gap-16 pb-40 relative z-20">
        <div className="flex-1 max-w-3xl">
          <div
            className="font-mono text-[11px] tracking-[0.2em] mb-6"
            style={{ color: textMuted }}
          >
            INRASTUDIO / AI MARKETING STUDIO
          </div>

          <h2
            className="font-display text-4xl md:text-5xl lg:text-6xl font-medium tracking-tight leading-[1.05]"
            style={{ color: textPrimary }}
          >
            Make your next campaign
            <br />
            worth stopping for.
          </h2>
        </div>

        <div className="flex flex-wrap gap-12 sm:gap-24 uppercase text-xs tracking-widest font-mono shrink-0">
          <div className="flex flex-col gap-5">
            <span
              className="mb-2 font-bold"
              style={{ color: textMuted }}
            >
              (EXPLORE)
            </span>

            <Link
              href="/privacy"
              className="transition-colors"
              style={{ color: paperMuted }}
            >
              Privacy Policy
            </Link>

            <Link
              href="/terms"
              className="transition-colors"
              style={{ color: paperMuted }}
            >
              Terms and Condition
            </Link>

            <Link
              href="/disclosure"
              className="transition-colors"
              style={{ color: paperMuted }}
            >
              Disclosure
            </Link>
          </div>

          <div className="flex flex-col gap-5">
            <span
              className="mb-2 font-bold"
              style={{ color: textMuted }}
            >
              (CONNECT)
            </span>

            <a
              href="#"
              className="transition-colors flex items-center gap-2 group"
              style={{ color: paperMuted }}
            >
              <Facebook className="w-4 h-4" />
              FACEBOOK
              <ArrowRight className="w-3 h-3 -rotate-45 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
            </a>

            <a
              href="#"
              className="transition-colors flex items-center gap-2 group"
              style={{ color: paperMuted }}
            >
              <Instagram className="w-4 h-4" />
              INSTAGRAM
              <ArrowRight className="w-3 h-3 -rotate-45 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
            </a>
          </div>
        </div>
      </div>

      <div
        className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between pt-12 mt-12 relative z-30 gap-4"
        style={{ borderTop: `1px solid ${rule}` }}
      >
        <div className="flex items-center gap-3">
          <Logo className="w-8 h-8 rounded-lg" />
        </div>

        <p
          className="text-sm font-mono"
          style={{ color: textMuted }}
        >
          © 2026 INRASTUDIO AI Marketing Studio.
        </p>
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

  const [purchasingPlanType, setPurchasingPlanType] =
    useState<string | null>(null);

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
        `/api/pricing/plans/${
          country ? `?country=${encodeURIComponent(country)}` : ""
        }`
      );

      setPlans(response);
    } catch (err) {
      console.error("Error fetching plans:", err);
      setError("Failed to load pricing plans. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handlePurchase = async (plan: Plan) => {
    setPaymentError(null);

    const token = localStorage.getItem("access");

    if (!token) {
      router.push(
        `/signup?redirect=/pricing&plan=${plan.plan_type}`
      );
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

      const response =
        await apiFetch<InitiatePaymentResponse>(
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
        sessionStorage.setItem(
          "pending_transaction_id",
          response.transaction_id
        );

        window.location.href = response.redirect_url;
        return;
      }

      if (response.status === "success") {
        router.push("/dashboard");
        return;
      }

      setPaymentError(
        response.message ||
          "Payment initialization failed. Please try again."
      );

      setPurchasingPlanType(null);
    } catch (err) {
      console.error("Payment error:", err);

      setPaymentError(
        err instanceof Error
          ? err.message
          : "Payment failed. Please try again."
      );

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
      <section
        id="pricing"
        className="py-32 px-6 max-w-6xl mx-auto"
        style={{ background: ink }}
      >
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Loader2
              className="w-10 h-10 animate-spin mx-auto mb-5"
              style={{ color: marigold }}
            />

            <p
              className="font-mono text-xs tracking-[0.15em]"
              style={{ color: textMuted }}
            >
              LOADING PLANS...
            </p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section
        id="pricing"
        className="py-32 px-6 max-w-6xl mx-auto"
      >
        <div
          className="rounded-2xl p-8 text-center"
          style={{
            background: panel,
            border: `1px solid rgba(214,73,31,0.35)`,
          }}
        >
          <AlertCircle
            className="w-10 h-10 mx-auto mb-4"
            style={{ color: signal }}
          />

          <p style={{ color: signal }}>{error}</p>

          <button
            onClick={fetchPlans}
            className="mt-5 px-6 py-3 rounded-full font-semibold"
            style={{
              background: marigold,
              color: ink,
            }}
          >
            Retry
          </button>
        </div>
      </section>
    );
  }

  return (
    <section
      id="pricing"
      className="py-20 md:py-28 px-4 sm:px-6 max-w-7xl mx-auto"
    >
      {/* HEADER */}
      <div className="max-w-4xl mx-auto text-center mb-14 md:mb-20">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-mono text-[11px] tracking-[0.22em] mb-5"
          style={{ color: textMuted }}
        >
          CAMPAIGN ACCESS / PRICING
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold tracking-tight leading-[0.95]"
          style={{ color: textPrimary }}
        >
          Pay for the campaigns
          <br />
          <span style={{ color: marigold }}>you actually need.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="max-w-xl mx-auto mt-6 text-sm sm:text-base leading-relaxed"
          style={{ color: textMuted }}
        >
          Start free. Buy one campaign when you need it,
          or use Pro when marketing becomes part of your
          routine.
        </motion.p>
      </div>

      {paymentError && (
        <div
          className="mb-8 p-4 rounded-2xl flex items-start sm:items-center gap-3 text-sm"
          style={{
            background: "rgba(214,73,31,0.08)",
            border: "1px solid rgba(214,73,31,0.3)",
            color: signal,
          }}
        >
          <AlertCircle className="w-5 h-5 shrink-0" />

          <span className="flex-1">{paymentError}</span>

          <button
            onClick={() => setPaymentError(null)}
            className="text-xs underline shrink-0"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* PLANS */}
      <div className="grid md:grid-cols-3 gap-5 lg:gap-6 items-stretch">
        {plans.map((plan, index) => {
          const isPro = plan.plan_type === "pro";
          const isFree = plan.plan_type === "free";
          const isPayg = plan.plan_type === "payg";
          const isPurchasing =
            purchasingPlanType === plan.plan_type;

          return (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: 0.08 * index,
                duration: 0.45,
              }}
              className={`relative flex flex-col rounded-3xl overflow-hidden transition-all duration-300 ${
                isPro
                  ? "md:-translate-y-3"
                  : "hover:-translate-y-1"
              }`}
              style={{
                background: isPro ? panelSoft : panel,
                border: isPro
                  ? `1px solid ${marigold}88`
                  : `1px solid ${rule}`,
                boxShadow: isPro
                  ? "0 24px 70px rgba(0,0,0,0.3)"
                  : "0 18px 45px rgba(0,0,0,0.15)",
              }}
            >
              {/* PRO LABEL */}
              {isPro && (
                <div
                  className="flex items-center justify-between px-6 py-3"
                  style={{
                    background: marigold,
                    color: ink,
                  }}
                >
                  <span className="font-mono text-[10px] font-bold tracking-[0.18em]">
                    RECOMMENDED
                  </span>

                  <Crown className="w-4 h-4" />
                </div>
              )}

              <div className="p-6 sm:p-8 lg:p-9 flex flex-col flex-1">
                {/* PLAN HEADER */}
                <div>
                  <div
                    className="font-mono text-[10px] tracking-[0.18em] mb-3"
                    style={{ color: textMuted }}
                  >
                    {isFree
                      ? "STARTER"
                      : isPayg
                      ? "ON DEMAND"
                      : "FULL ACCESS"}
                  </div>

                  <h3
                    className="font-display text-2xl sm:text-3xl font-semibold"
                    style={{ color: textPrimary }}
                  >
                    {plan.name}
                  </h3>

                  <p
                    className="text-sm mt-2 min-h-[40px]"
                    style={{ color: textMuted }}
                  >
                    {isFree
                      ? "Test the platform."
                      : isPayg
                      ? "No commitments."
                      : "For power users."}
                  </p>
                </div>

                {/* PRICE */}
                <div
                  className="mt-8 pb-8"
                  style={{ borderBottom: `1px dashed ${rule}` }}
                >
                  {isFree ? (
                    <>
                      <div
                        className="font-display text-5xl sm:text-6xl font-semibold"
                        style={{ color: textPrimary }}
                      >
                        Free
                      </div>

                      <div
                        className="font-mono text-[10px] tracking-[0.15em] mt-3"
                        style={{ color: textMuted }}
                      >
                        TO GET STARTED
                      </div>
                    </>
                  ) : (
                    <>
                      {plan.old_price_display && (
                        <div
                          className="font-mono text-sm line-through mb-1"
                          style={{ color: "#655D4C" }}
                        >
                          {plan.old_price_display}
                        </div>
                      )}

                      <div
                        className="font-display text-5xl sm:text-6xl font-semibold leading-none"
                        style={{ color: isPro ? marigold : textPrimary }}
                      >
                        {plan.price_display}
                      </div>

                      <div
                        className="font-mono text-[10px] tracking-[0.15em] mt-3"
                        style={{ color: textMuted }}
                      >
                        / {isPayg ? "CAMPAIGN" : "MONTH"}
                      </div>
                    </>
                  )}
                </div>

                {/* FEATURES */}
                <div className="py-8 flex-1">
                  <div
                    className="font-mono text-[10px] tracking-[0.16em] mb-5"
                    style={{ color: textMuted }}
                  >
                    THIS INCLUDES
                  </div>

                  <ul className="space-y-4">
                    {isFree ? (
                      <>
                        <li className="flex gap-3 text-sm">
                          <CheckCircle
                            className="w-4 h-4 shrink-0 mt-0.5"
                            style={{ color: textMuted }}
                          />
                          <span style={{ color: paperMuted }}>
                            1 Campaign Free
                          </span>
                        </li>

                        <li className="flex gap-3 text-sm">
                          <CheckCircle
                            className="w-4 h-4 shrink-0 mt-0.5"
                            style={{ color: textMuted }}
                          />
                          <span style={{ color: paperMuted }}>
                            AI-powered marketing content
                          </span>
                        </li>
                      </>
                    ) : isPayg ? (
                      <>
                        <li className="flex gap-3 text-sm">
                          <CheckCircle
                            className="w-4 h-4 shrink-0 mt-0.5"
                            style={{ color: marigold }}
                          />
                          <span style={{ color: textPrimary }}>
                            1 Full Campaign
                          </span>
                        </li>

                        <li className="flex gap-3 text-sm">
                          <CheckCircle
                            className="w-4 h-4 shrink-0 mt-0.5"
                            style={{ color: marigold }}
                          />
                          <span style={{ color: textPrimary }}>
                            AI-powered marketing content
                          </span>
                        </li>

                        <li className="flex gap-3 text-sm">
                          <CheckCircle
                            className="w-4 h-4 shrink-0 mt-0.5"
                            style={{ color: marigold }}
                          />
                          <span style={{ color: textPrimary }}>
                            High resolution exports
                          </span>
                        </li>
                      </>
                    ) : (
                      <>
                        <li className="flex gap-3 text-sm">
                          <CheckCircle
                            className="w-4 h-4 shrink-0 mt-0.5"
                            style={{ color: marigold }}
                          />
                          <span style={{ color: textPrimary }}>
                            Unlimited Campaigns
                          </span>
                        </li>

                        <li className="flex gap-3 text-sm">
                          <CheckCircle
                            className="w-4 h-4 shrink-0 mt-0.5"
                            style={{ color: marigold }}
                          />
                          <span style={{ color: textPrimary }}>
                            AI-powered marketing content
                          </span>
                        </li>

                        <li className="flex gap-3 text-sm">
                          <CheckCircle
                            className="w-4 h-4 shrink-0 mt-0.5"
                            style={{ color: marigold }}
                          />
                          <span style={{ color: textPrimary }}>
                            Priority queue generation
                          </span>
                        </li>

                        <li className="flex gap-3 text-sm">
                          <CheckCircle
                            className="w-4 h-4 shrink-0 mt-0.5"
                            style={{ color: marigold }}
                          />
                          <span style={{ color: textPrimary }}>
                            Complete campaign creation
                          </span>
                        </li>
                      </>
                    )}
                  </ul>
                </div>

                {/* CTA */}
                <div>
                  <button
                    onClick={
                      isFree
                        ? handleFreeTrial
                        : () => handlePurchase(plan)
                    }
                    disabled={isPurchasing}
                    className="w-full min-h-[52px] rounded-full font-semibold text-sm flex items-center justify-center gap-2 transition-all duration-300 disabled:opacity-60"
                    style={{
                      background: isPro
                        ? marigold
                        : isFree
                        ? "transparent"
                        : paper,
                      color: isPro
                        ? ink
                        : isFree
                        ? textPrimary
                        : ink,
                      border: isFree
                        ? `1px solid ${rule}`
                        : "none",
                    }}
                  >
                    {isPurchasing ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Redirecting...
                      </>
                    ) : isFree ? (
                      <>
                        Start for free
                        <ArrowRight className="w-4 h-4" />
                      </>
                    ) : isPro ? (
                      <>
                        Upgrade to Pro
                        <ArrowRight className="w-4 h-4" />
                      </>
                    ) : (
                      <>
                        Buy campaign
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>

                  {!isFree && (
                    <div
                      className="flex items-center justify-center gap-2 mt-4 font-mono text-[9px] tracking-[0.12em]"
                      style={{ color: textMuted }}
                    >
                      <ShieldCheck className="w-3.5 h-3.5" />
                      SECURE PAYMENT VIA FLUTTERWAVE
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* TRUST STRIP */}
      <div
        className="mt-8 rounded-2xl px-5 py-5 sm:px-8"
        style={{
          background: panel,
          border: `1px solid ${rule}`,
        }}
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          <div className="flex items-center gap-3">
            <ShieldCheck
              className="w-4 h-4 shrink-0"
              style={{ color: marigold }}
            />
            <span
              className="font-mono text-[9px] tracking-[0.1em]"
              style={{ color: textMuted }}
            >
              SECURE PAYMENTS
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Zap
              className="w-4 h-4 shrink-0"
              style={{ color: marigold }}
            />
            <span
              className="font-mono text-[9px] tracking-[0.1em]"
              style={{ color: textMuted }}
            >
              INSTANT ACTIVATION
            </span>
          </div>

          <div className="flex items-center gap-3">
            <CheckCircle
              className="w-4 h-4 shrink-0"
              style={{ color: marigold }}
            />
            <span
              className="font-mono text-[9px] tracking-[0.1em]"
              style={{ color: textMuted }}
            >
              24/7 SUPPORT
            </span>
          </div>

          <div className="flex items-center gap-3">
            <CheckCircle
              className="w-4 h-4 shrink-0"
              style={{ color: marigold }}
            />
            <span
              className="font-mono text-[9px] tracking-[0.1em]"
              style={{ color: textMuted }}
            >
              MONEY-BACK GUARANTEE
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function PricingRoute() {
  return (
    <div
      className="min-h-screen relative font-sans overflow-x-hidden"
      style={{
        background: ink,
        color: textPrimary,
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=IBM+Plex+Mono:wght@400;500;600;700&display=swap');

        .font-display {
          font-family: 'Space Grotesk', ui-sans-serif, system-ui, sans-serif;
        }

        .font-mono {
          font-family: 'IBM Plex Mono', ui-monospace, monospace;
        }

        html, body {
          overflow-x: hidden;
          max-width: 100%;
        }

        button, a {
          touch-action: manipulation;
        }

        ::selection {
          background: ${marigold};
          color: ${ink};
        }
      `}</style>

      <Navbar />

      <main>
        <Pricing />
      </main>

      <Footer />
    </div>
  );
}