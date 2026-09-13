"use client";

import { useEffect, useState } from "react";
import { CheckCircle, XCircle, Loader2, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { apiFetch } from "@/lib/auth";

interface VerifyPaymentResponse {
  status: "success" | "pending" | "failed";
  message?: string;
  transaction_id: string;
}

const ink = "#16140F";
const panel = "#1D1A14";
const rule = "#38321F";
const marigold = "#E8A33D";
const signal = "#D6491F";
const textPrimary = "#F3ECDD";
const textMuted = "#8C8368";

type ViewState = "verifying" | "success" | "pending" | "failed";

// Paystack retries a webhook, and a payment can briefly sit as "pending" on
// their end even after the customer sees a success screen. Poll a few times
// with a short backoff before telling the person something actually failed.
const POLL_ATTEMPTS = 5;
const POLL_DELAY_MS = 2500;

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export default function PaymentVerifyPage() {
  const router = useRouter();
  const [view, setView] = useState<ViewState>("verifying");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const run = async () => {
      const transactionId = sessionStorage.getItem("pending_transaction_id");

      if (!transactionId) {
        // No record of a transaction we started -- most likely the page was
        // opened directly, or storage was cleared. Nothing to verify.
        setView("failed");
        setErrorMessage(
          "We couldn't find a payment to verify. If you were charged, contact support with your email so we can look it up."
        );
        return;
      }

      for (let attempt = 0; attempt < POLL_ATTEMPTS; attempt++) {
        try {
          const result = await apiFetch<VerifyPaymentResponse>(
            "/api/pricing/verify_payment/",
            {
              method: "POST",
              body: JSON.stringify({ transaction_id: transactionId }),
            }
          );

          if (result.status === "success") {
            sessionStorage.removeItem("pending_transaction_id");
            setView("success");
            return;
          }

          if (result.status === "failed") {
            setView("failed");
            setErrorMessage(
              result.message || "The payment could not be confirmed."
            );
            return;
          }

          // status === "pending" -- wait and retry rather than giving up
        } catch (err) {
          // A network hiccup on one attempt shouldn't fail the whole check --
          // only surface an error once every attempt is exhausted.
          if (attempt === POLL_ATTEMPTS - 1) {
            setView("failed");
            setErrorMessage(
              err instanceof Error
                ? err.message
                : "Something went wrong while confirming your payment."
            );
            return;
          }
        }

        if (attempt < POLL_ATTEMPTS - 1) {
          await sleep(POLL_DELAY_MS);
        }
      }

      // Exhausted all attempts and it's still pending.
      setView("pending");
    };

    run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      className="flex min-h-screen items-center justify-center px-6"
      style={{ background: ink }}
    >
      <div
        className="w-full max-w-md rounded-3xl p-10 text-center"
        style={{ background: panel, border: `1px solid ${rule}` }}
      >
        {view === "verifying" && (
          <>
            <Loader2
              className="mx-auto mb-6 h-12 w-12 animate-spin"
              style={{ color: marigold }}
            />
            <h1
              className="mb-2 text-xl font-semibold"
              style={{ color: textPrimary }}
            >
              Confirming your payment
            </h1>
            <p className="text-sm" style={{ color: textMuted }}>
              This usually takes a few seconds. Don't close this tab.
            </p>
          </>
        )}

        {view === "success" && (
          <>
            <CheckCircle
              className="mx-auto mb-6 h-12 w-12"
              style={{ color: marigold }}
            />
            <h1
              className="mb-2 text-xl font-semibold"
              style={{ color: textPrimary }}
            >
              Payment confirmed
            </h1>
            <p className="mb-8 text-sm" style={{ color: textMuted }}>
              Your plan is active. You're ready to start your next campaign.
            </p>
            <button
              onClick={() => router.push("/dashboard")}
              className="flex w-full items-center justify-center gap-2 rounded-full py-3 text-sm font-semibold"
              style={{ background: marigold, color: ink }}
            >
              Go to dashboard
              <ArrowRight className="h-4 w-4" />
            </button>
          </>
        )}

        {view === "pending" && (
          <>
            <Loader2
              className="mx-auto mb-6 h-12 w-12"
              style={{ color: marigold }}
            />
            <h1
              className="mb-2 text-xl font-semibold"
              style={{ color: textPrimary }}
            >
              Still processing
            </h1>
            <p className="mb-8 text-sm" style={{ color: textMuted }}>
              Paystack hasn't confirmed this payment yet. This can take a
              minute for bank transfers. Check your dashboard shortly, or
              refresh this page to check again.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="flex w-full items-center justify-center gap-2 rounded-full py-3 text-sm font-semibold"
              style={{ background: marigold, color: ink }}
            >
              Check again
            </button>
          </>
        )}

        {view === "failed" && (
          <>
            <XCircle
              className="mx-auto mb-6 h-12 w-12"
              style={{ color: signal }}
            />
            <h1
              className="mb-2 text-xl font-semibold"
              style={{ color: textPrimary }}
            >
              We couldn't confirm this payment
            </h1>
            <p className="mb-8 text-sm" style={{ color: textMuted }}>
              {errorMessage}
            </p>
            <Link
              href="/pricing"
              className="flex w-full items-center justify-center gap-2 rounded-full py-3 text-sm font-semibold"
              style={{ background: marigold, color: ink }}
            >
              Back to pricing
            </Link>
          </>
        )}
      </div>
    </div>
  );
}