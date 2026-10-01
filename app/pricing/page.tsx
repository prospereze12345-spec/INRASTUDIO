"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "motion/react";
import {
  CheckCircle,
  Instagram,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  Zap,
  Crown,
  type LucideIcon,
} from "lucide-react";
import { Logo } from "@/components/Logo";
import { Navbar } from "@/components/Navbar";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/auth";
import { useTheme } from "@/lib/theme";

/**
 * All colours come from `useTheme()` tokens so the page reacts to the site's
 * theme toggle. Business logic (plan fetching, purchase flow, error handling,
 * free-trial redirect) is unchanged. The loading state is now a skeleton that
 * mirrors the real plan cards instead of a spinner.
 */

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────
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

interface StoredUser {
  id?: string;
  country?: string;
  country_code?: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Static content
// ─────────────────────────────────────────────────────────────────────────────
interface PlanCopy {
  eyebrow: string;
  tagline: string;
  features: string[];
}

const PLAN_COPY: Record<"free" | "payg" | "pro", PlanCopy> = {
  free: {
    eyebrow: "STARTER",
    tagline: "Test the platform.",
    features: ["1 Campaign Free", "AI-powered marketing content"],
  },
  payg: {
    eyebrow: "ON DEMAND",
    tagline: "No commitments.",
    features: [
      "1 Full Campaign",
      "AI-powered marketing content",
      "High resolution exports",
    ],
  },
  pro: {
    eyebrow: "FULL ACCESS",
    tagline: "For power users.",
    features: [
      "Unlimited Campaigns",
      "AI-powered marketing content",
      "Priority queue generation",
      "Complete campaign creation",
    ],
  },
};

// Unknown plan types fall back to the Pro copy, same as the original.
function getPlanCopy(planType: string): PlanCopy {
  return PLAN_COPY[planType as keyof typeof PLAN_COPY] ?? PLAN_COPY.pro;
}

const TRUST_ITEMS: { icon: LucideIcon; label: string }[] = [
  { icon: ShieldCheck, label: "SECURE PAYMENTS" },
  { icon: Zap, label: "INSTANT ACTIVATION" },
  { icon: CheckCircle, label: "24/7 SUPPORT" },
  { icon: CheckCircle, label: "MONEY-BACK GUARANTEE" },
];

const FOOTER_LINKS = [
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/terms", label: "Terms and Conditions" },
  { href: "/disclosure", label: "Disclosure" },
];

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────
function getStoredUser(): StoredUser {
  try {
    const raw = localStorage.getItem("user");
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Footer
// ─────────────────────────────────────────────────────────────────────────────
function Footer() {
  const { tokens } = useTheme();
  const { ink, rule, paperMuted, textPrimary, textMuted } = tokens;

  return (
    <footer
      className="relative mt-12 w-full overflow-hidden px-6 pb-12 pt-24 transition-colors duration-300"
      style={{ background: ink, borderTop: `1px solid ${rule}` }}
    >
      <div className="relative z-20 mx-auto flex max-w-7xl flex-col items-start justify-between gap-16 pb-40 lg:flex-row">
        <div className="max-w-3xl flex-1">
          <div
            className="mb-6 font-mono text-[11px] tracking-[0.2em]"
            style={{ color: textMuted }}
          >
            INRASTUDIO / AI MARKETING STUDIO
          </div>

          <h2
            className="font-display text-4xl font-medium leading-[1.05] tracking-tight md:text-5xl lg:text-6xl"
            style={{ color: textPrimary }}
          >
            Make your next campaign
            <br />
            worth stopping for.
          </h2>
        </div>

        <div className="flex shrink-0 flex-wrap gap-12 font-mono text-xs uppercase tracking-widest sm:gap-24">
          <div className="flex flex-col gap-5">
            <span className="mb-2 font-bold" style={{ color: textMuted }}>
              (EXPLORE)
            </span>

            {FOOTER_LINKS.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="transition-colors hover:opacity-80"
                style={{ color: paperMuted }}
              >
                {label}
              </Link>
            ))}
          </div>

          <div className="flex flex-col gap-5">
            <span className="mb-2 font-bold" style={{ color: textMuted }}>
              (CONNECT)
            </span>

            <a
              href="#"
              className="group flex items-center gap-2 transition-colors"
              style={{ color: paperMuted }}
            >
              <span className="flex h-4 w-4 items-center justify-center text-[11px] font-bold">
                ♪
              </span>
              TikTok
              <ArrowRight className="h-3 w-3 -rotate-45 transition-all group-hover:translate-x-1 group-hover:-translate-y-1" />
            </a>

            <a
              href="#"
              className="group flex items-center gap-2 transition-colors"
              style={{ color: paperMuted }}
            >
              <Instagram className="h-4 w-4" />
              Instagram
              <ArrowRight className="h-3 w-3 -rotate-45 transition-all group-hover:translate-x-1 group-hover:-translate-y-1" />
            </a>
          </div>
        </div>
      </div>

      <div
        className="relative z-30 mx-auto mt-12 flex max-w-7xl flex-col items-center justify-between gap-4 border-t pt-12 md:flex-row"
        style={{ borderColor: rule }}
      >
        <div className="flex items-center gap-3">
          <Logo className="h-8 w-8 rounded-lg" />
        </div>

        <p className="font-mono text-sm" style={{ color: textMuted }}>
          © 2026 INRASTUDIO AI Marketing Studio.
        </p>
      </div>
    </footer>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Skeleton (replaces the old spinner)
// ─────────────────────────────────────────────────────────────────────────────
function PricingSkeleton() {
  const { tokens } = useTheme();
  const { panel, panelSoft, rule, marigold } = tokens;

  const Bar = ({ className }: { className: string }) => (
    <div className={`animate-pulse ${className}`} style={{ background: rule }} />
  );

  return (
    <section
      id="pricing"
      className="mx-auto max-w-7xl px-4 py-20 sm:px-6 md:py-28"
      aria-busy="true"
      aria-live="polite"
    >
      <span className="sr-only">Loading plans</span>

      {/* Header placeholder */}
      <div className="mx-auto mb-14 flex max-w-4xl flex-col items-center md:mb-20">
        <Bar className="mb-5 h-3 w-48 rounded-full" />
        <Bar className="h-10 w-full max-w-xl rounded-xl sm:h-12" />
        <Bar className="mt-3 h-10 w-2/3 max-w-sm rounded-xl sm:h-12" />
        <Bar className="mt-6 h-3 w-full max-w-md rounded-full" />
      </div>

      {/* Card placeholders */}
      <div className="grid items-stretch gap-5 md:grid-cols-3 lg:gap-6">
        {[0, 1, 2].map((i) => {
          const highlighted = i === 2;

          return (
            <div
              key={i}
              className={`flex flex-col overflow-hidden rounded-3xl ${
                highlighted ? "md:-translate-y-3" : ""
              }`}
              style={{
                background: highlighted ? panelSoft : panel,
                border: highlighted
                  ? `1px solid ${marigold}88`
                  : `1px solid ${rule}`,
              }}
            >
              {highlighted && (
                <div
                  className="h-11 animate-pulse"
                  style={{ background: `${marigold}55` }}
                />
              )}

              <div className="flex flex-1 flex-col p-6 sm:p-8 lg:p-9">
                <Bar className="mb-3 h-3 w-24 rounded-full" />
                <Bar className="h-8 w-40 rounded-lg" />
                <Bar className="mt-3 h-3 w-32 rounded-full" />

                <div
                  className="mt-8 pb-8"
                  style={{ borderBottom: `1px dashed ${rule}` }}
                >
                  <Bar className="h-14 w-40 rounded-xl" />
                  <Bar className="mt-3 h-3 w-24 rounded-full" />
                </div>

                <div className="flex-1 space-y-4 py-8">
                  <Bar className="mb-5 h-3 w-28 rounded-full" />
                  {[0, 1, 2].map((row) => (
                    <div key={row} className="flex items-center gap-3">
                      <Bar className="h-4 w-4 shrink-0 rounded-full" />
                      <Bar className="h-3 w-full max-w-[200px] rounded-full" />
                    </div>
                  ))}
                </div>

                <Bar className="h-[52px] w-full rounded-full" />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Plan card
// ─────────────────────────────────────────────────────────────────────────────
function PlanCard({
  plan,
  index,
  isPurchasing,
  onFreeTrial,
  onPurchase,
}: {
  plan: Plan;
  index: number;
  isPurchasing: boolean;
  onFreeTrial: () => void;
  onPurchase: (plan: Plan) => void;
}) {
  const { tokens } = useTheme();
  const {
    ink,
    panel,
    panelSoft,
    rule,
    paper,
    paperMuted,
    marigold,
    textPrimary,
    textMuted,
  } = tokens;

  const isPro = plan.plan_type === "pro";
  const isFree = plan.plan_type === "free";
  const isPayg = plan.plan_type === "payg";
  const copy = getPlanCopy(plan.plan_type);

  const ctaLabel = isFree
    ? "Start for free"
    : isPro
      ? "Upgrade to Pro"
      : "Buy campaign";

  return (
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.08 * index, duration: 0.45 }}
      className={`relative flex flex-col overflow-hidden rounded-3xl transition-all duration-300 ${
        isPro ? "md:-translate-y-3" : "hover:-translate-y-1"
      }`}
      style={{
        background: isPro ? panelSoft : panel,
        border: isPro ? `1px solid ${marigold}88` : `1px solid ${rule}`,
        boxShadow: isPro
          ? "0 24px 70px rgba(0,0,0,0.3)"
          : "0 18px 45px rgba(0,0,0,0.15)",
      }}
    >
      {isPro && (
        <div
          className="flex items-center justify-between px-6 py-3"
          style={{ background: marigold, color: ink }}
        >
          <span className="font-mono text-[10px] font-bold tracking-[0.18em]">
            RECOMMENDED
          </span>
          <Crown className="h-4 w-4" />
        </div>
      )}

      <div className="flex flex-1 flex-col p-6 sm:p-8 lg:p-9">
        {/* Header */}
        <div>
          <div
            className="mb-3 font-mono text-[10px] tracking-[0.18em]"
            style={{ color: textMuted }}
          >
            {copy.eyebrow}
          </div>

          <h3
            className="font-display text-2xl font-semibold sm:text-3xl"
            style={{ color: textPrimary }}
          >
            {plan.name}
          </h3>

          <p className="mt-2 min-h-[40px] text-sm" style={{ color: textMuted }}>
            {copy.tagline}
          </p>
        </div>

        {/* Price */}
        <div
          className="mt-8 pb-8"
          style={{ borderBottom: `1px dashed ${rule}` }}
        >
          {isFree ? (
            <>
              <div
                className="font-display text-5xl font-semibold sm:text-6xl"
                style={{ color: textPrimary }}
              >
                Free
              </div>
              <div
                className="mt-3 font-mono text-[10px] tracking-[0.15em]"
                style={{ color: textMuted }}
              >
                TO GET STARTED
              </div>
            </>
          ) : (
            <>
              {plan.old_price_display && (
                <div
                  className="mb-1 font-mono text-sm line-through"
                  style={{ color: textMuted }}
                >
                  {plan.old_price_display}
                </div>
              )}

              <div
                className="font-display text-5xl font-semibold leading-none sm:text-6xl"
                style={{ color: isPro ? marigold : textPrimary }}
              >
                {plan.price_display}
              </div>

              <div
                className="mt-3 font-mono text-[10px] tracking-[0.15em]"
                style={{ color: textMuted }}
              >
                / {isPayg ? "CAMPAIGN" : "MONTH"}
              </div>
            </>
          )}
        </div>

        {/* Features */}
        <div className="flex-1 py-8">
          <div
            className="mb-5 font-mono text-[10px] tracking-[0.16em]"
            style={{ color: textMuted }}
          >
            THIS INCLUDES
          </div>

          <ul className="space-y-4">
            {copy.features.map((feature) => (
              <li key={feature} className="flex gap-3 text-sm">
                <CheckCircle
                  className="mt-0.5 h-4 w-4 shrink-0"
                  style={{ color: isFree ? textMuted : marigold }}
                />
                <span style={{ color: isFree ? paperMuted : textPrimary }}>
                  {feature}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* CTA */}
        <div>
          <button
            onClick={isFree ? onFreeTrial : () => onPurchase(plan)}
            disabled={isPurchasing}
            className="flex min-h-[52px] w-full items-center justify-center gap-2 rounded-full text-sm font-semibold transition-all duration-300 disabled:opacity-60"
            style={{
              background: isPro ? marigold : isFree ? "transparent" : paper,
              color: isFree ? textPrimary : ink,
              border: isFree ? `1px solid ${rule}` : "none",
            }}
          >
            {isPurchasing ? (
              <span className="animate-pulse">Redirecting…</span>
            ) : (
              <>
                {ctaLabel}
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>

          {!isFree && (
            <div
              className="mt-4 flex items-center justify-center gap-2 font-mono text-[9px] tracking-[0.12em]"
              style={{ color: textMuted }}
            >
              <ShieldCheck className="h-3.5 w-3.5" />
              SECURE PAYMENT VIA PAYSTACK
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Trust strip
// ─────────────────────────────────────────────────────────────────────────────
function TrustStrip() {
  const { tokens } = useTheme();
  const { panel, rule, marigold, textMuted } = tokens;

  return (
    <div
      className="mt-8 rounded-2xl px-5 py-5 sm:px-8 transition-colors duration-300"
      style={{ background: panel, border: `1px solid ${rule}` }}
    >
      <div className="grid grid-cols-2 gap-5 md:grid-cols-4">
        {TRUST_ITEMS.map(({ icon: Icon, label }) => (
          <div key={label} className="flex items-center gap-3">
            <Icon className="h-4 w-4 shrink-0" style={{ color: marigold }} />
            <span
              className="font-mono text-[9px] tracking-[0.1em]"
              style={{ color: textMuted }}
            >
              {label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Pricing
// ─────────────────────────────────────────────────────────────────────────────
function Pricing() {
  const router = useRouter();
  const { tokens } = useTheme();
  const { ink, panel, signal, marigold, textPrimary, textMuted } = tokens;

  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [purchasingPlanType, setPurchasingPlanType] = useState<string | null>(
    null
  );

  const fetchPlans = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const user = getStoredUser();
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
  }, []);

  useEffect(() => {
    fetchPlans();
  }, [fetchPlans]);

  const handlePurchase = async (plan: Plan) => {
    setPaymentError(null);

    const token = localStorage.getItem("access");

    if (!token) {
      router.push(`/signup?redirect=/pricing&plan=${plan.plan_type}`);
      return;
    }

    setPurchasingPlanType(plan.plan_type);

    try {
      const user = getStoredUser();
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
        return;
      }

      if (response.status === "success") {
        router.push("/dashboard");
        return;
      }

      setPaymentError(
        response.message || "Payment initialization failed. Please try again."
      );
      setPurchasingPlanType(null);
    } catch (err) {
      console.error("Payment error:", err);

      setPaymentError(
        err instanceof Error ? err.message : "Payment failed. Please try again."
      );
      setPurchasingPlanType(null);
    }
  };

  const handleFreeTrial = () => {
    const token = localStorage.getItem("access");
    router.push(token ? "/dashboard" : "/signup?redirect=/dashboard");
  };

  if (loading) return <PricingSkeleton />;

  if (error) {
    return (
      <section id="pricing" className="mx-auto max-w-6xl px-6 py-32">
        <div
          className="rounded-2xl p-8 text-center transition-colors duration-300"
          style={{ background: panel, border: `1px solid ${signal}59` }}
        >
          <AlertCircle
            className="mx-auto mb-4 h-10 w-10"
            style={{ color: signal }}
          />

          <p style={{ color: signal }}>{error}</p>

          <button
            onClick={fetchPlans}
            className="mt-5 rounded-full px-6 py-3 font-semibold"
            style={{ background: marigold, color: ink }}
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
      className="mx-auto max-w-7xl px-4 py-20 sm:px-6 md:py-28"
    >
      {/* Header */}
      <div className="mx-auto mb-14 max-w-4xl text-center md:mb-20">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-5 font-mono text-[11px] tracking-[0.22em]"
          style={{ color: textMuted }}
        >
          CAMPAIGN ACCESS / PRICING
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="font-display text-4xl font-semibold leading-[0.95] tracking-tight sm:text-5xl md:text-6xl lg:text-7xl"
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
          className="mx-auto mt-6 max-w-xl text-sm leading-relaxed sm:text-base"
          style={{ color: textMuted }}
        >
          Start free. Buy one campaign when you need it, or use Pro when
          marketing becomes part of your routine.
        </motion.p>
      </div>

      {/* Payment error */}
      {paymentError && (
        <div
          className="mb-8 flex items-start gap-3 rounded-2xl p-4 text-sm sm:items-center transition-colors duration-300"
          style={{
            background: `${signal}14`,
            border: `1px solid ${signal}4d`,
            color: signal,
          }}
        >
          <AlertCircle className="h-5 w-5 shrink-0" />
          <span className="flex-1">{paymentError}</span>
          <button
            onClick={() => setPaymentError(null)}
            className="shrink-0 text-xs underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Plans */}
      <div className="grid items-stretch gap-5 md:grid-cols-3 lg:gap-6">
        {plans.map((plan, index) => (
          <PlanCard
            key={plan.id}
            plan={plan}
            index={index}
            isPurchasing={purchasingPlanType === plan.plan_type}
            onFreeTrial={handleFreeTrial}
            onPurchase={handlePurchase}
          />
        ))}
      </div>

      <TrustStrip />
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Page
// ─────────────────────────────────────────────────────────────────────────────
export default function PricingRoute() {
  const { tokens } = useTheme();
  const { ink, marigold, textPrimary } = tokens;

  return (
    <div
      suppressHydrationWarning
      className="relative min-h-screen overflow-x-hidden font-sans transition-colors duration-300"
      style={{ background: ink, color: textPrimary }}
    >
      <style suppressHydrationWarning>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=IBM+Plex+Mono:wght@400;500;600;700&display=swap');

        .font-display {
          font-family: 'Space Grotesk', ui-sans-serif, system-ui, sans-serif;
        }

        .font-mono {
          font-family: 'IBM Plex Mono', ui-monospace, monospace;
        }

        html,
        body {
          overflow-x: hidden;
          max-width: 100%;
        }

        button,
        a {
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