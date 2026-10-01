"use client";

import { useEffect, useState } from "react";
import { XCircle, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { apiFetch } from "@/lib/auth";

interface VerifyPaymentResponse {
  status: "success" | "pending" | "failed";
  message?: string;
  transaction_id: string;
}

const paper = "#EEE7D8";
const paperMuted = "#E3DCCB";
const ink = "#16140F";
const rule = "#CFC6B3";
const marigold = "#E8A33D";
const signal = "#D6491F";
const textMuted = "#6B6250";

type ViewState = "verifying" | "pending" | "failed";

const POLL_ATTEMPTS = 5;
const POLL_DELAY_MS = 2500;

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/*
 * Dashboard-style loading skeleton.
 *
 * This deliberately uses the same light/paper visual language as the
 * dashboard instead of the old dark payment page. This prevents the
 * purple/dark flash users were seeing while returning from magic-link
 * login or payment checkout.
 */
function DashboardSkeleton() {
  return (
    <div
      className="min-h-screen px-4 py-6 sm:px-6 sm:py-8"
      style={{ background: paper }}
    >
      <div className="mx-auto w-full max-w-6xl">
        {/* Header skeleton */}
        <div className="mb-8 flex items-center justify-between gap-4">
          <div
            className="h-8 w-32 animate-pulse rounded-xl"
            style={{ background: paperMuted }}
          />

          <div
            className="h-10 w-24 animate-pulse rounded-xl"
            style={{ background: paperMuted }}
          />
        </div>

        {/* Main heading skeleton */}
        <div className="mb-8">
          <div
            className="mb-3 h-9 w-64 animate-pulse rounded-xl"
            style={{ background: paperMuted }}
          />

          <div
            className="h-4 w-80 max-w-full animate-pulse rounded-lg"
            style={{ background: paperMuted }}
          />
        </div>

        {/* Main dashboard card */}
        <div
          className="rounded-2xl border p-5 sm:p-6"
          style={{
            background: "#F4EFE3",
            borderColor: rule,
          }}
        >
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="rounded-xl border p-5"
                style={{
                  background: paper,
                  borderColor: rule,
                }}
              >
                <div
                  className="mb-4 h-3 w-20 animate-pulse rounded"
                  style={{ background: paperMuted }}
                />

                <div
                  className="mb-2 h-8 w-28 animate-pulse rounded-lg"
                  style={{ background: paperMuted }}
                />

                <div
                  className="h-3 w-24 animate-pulse rounded"
                  style={{ background: paperMuted }}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Content skeleton */}
        <div className="mt-8">
          <div
            className="mb-4 h-6 w-44 animate-pulse rounded-lg"
            style={{ background: paperMuted }}
          />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="h-48 animate-pulse rounded-2xl"
                style={{
                  background: paperMuted,
                }}
              />
            ))}
          </div>
        </div>

        {/* Verification message */}
        <div className="mt-8 text-center">
          <Loader2
            className="mx-auto mb-3 h-6 w-6 animate-spin"
            style={{ color: marigold }}
          />

          <p
            className="text-sm font-medium"
            style={{ color: ink }}
          >
            Confirming your payment…
          </p>

          <p
            className="mt-1 text-xs"
            style={{ color: textMuted }}
          >
            Taking you back to your dashboard.
          </p>
        </div>
      </div>
    </div>
  );
}

function PendingPayment() {
  const router = useRouter();

  return (
    <div
      className="flex min-h-screen items-center justify-center px-4 py-8 sm:px-6"
      style={{ background: paper }}
    >
      <div
        className="w-full max-w-md rounded-2xl border p-6 text-center sm:p-8"
        style={{
          background: "#F4EFE3",
          borderColor: rule,
        }}
      >
        <Loader2
          className="mx-auto mb-5 h-11 w-11 animate-spin"
          style={{ color: marigold }}
        />

        <h1
          className="mb-2 text-xl font-semibold"
          style={{ color: ink }}
        >
          Payment still processing
        </h1>

        <p
          className="mb-7 text-sm leading-6"
          style={{ color: textMuted }}
        >
          We haven't received final confirmation from the payment provider
          yet. Your payment has not been marked as failed. You can check your
          dashboard shortly.
        </p>

        <button
          onClick={() => router.replace("/dashboard")}
          className="flex min-h-[46px] w-full items-center justify-center rounded-xl px-5 py-3 text-sm font-semibold transition-opacity hover:opacity-90"
          style={{
            background: marigold,
            color: ink,
          }}
        >
          Go to dashboard
        </button>

        <button
          onClick={() => window.location.reload()}
          className="mt-3 min-h-[44px] w-full rounded-xl px-5 py-3 text-sm font-medium"
          style={{
            border: `1px solid ${rule}`,
            color: ink,
          }}
        >
          Check payment again
        </button>
      </div>
    </div>
  );
}

function FailedPayment({
  message,
}: {
  message: string | null;
}) {
  return (
    <div
      className="flex min-h-screen items-center justify-center px-4 py-8 sm:px-6"
      style={{ background: paper }}
    >
      <div
        className="w-full max-w-md rounded-2xl border p-6 text-center sm:p-8"
        style={{
          background: "#F4EFE3",
          borderColor: rule,
        }}
      >
        <XCircle
          className="mx-auto mb-5 h-11 w-11"
          style={{ color: signal }}
        />

        <h1
          className="mb-2 text-xl font-semibold"
          style={{ color: ink }}
        >
          Payment failed
        </h1>

        <p
          className="mb-7 text-sm leading-6"
          style={{ color: textMuted }}
        >
          {message ||
            "The payment provider reported that this payment was not completed."}
        </p>

        <Link
          href="/pricing"
          className="flex min-h-[46px] w-full items-center justify-center rounded-xl px-5 py-3 text-sm font-semibold transition-opacity hover:opacity-90"
          style={{
            background: marigold,
            color: ink,
          }}
        >
          Back to pricing
        </Link>
      </div>
    </div>
  );
}

export default function PaymentVerifyPage() {
  const router = useRouter();

  const [view, setView] = useState<ViewState>("verifying");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      const transactionId = sessionStorage.getItem(
        "pending_transaction_id"
      );

      if (!transactionId) {
        if (cancelled) return;

        setView("failed");
        setErrorMessage(
          "We couldn't find the payment transaction. If you were charged, please contact support so we can look up the transaction."
        );
        return;
      }

      for (let attempt = 0; attempt < POLL_ATTEMPTS; attempt++) {
        if (cancelled) return;

        try {
          const result =
            await apiFetch<VerifyPaymentResponse>(
              "/api/pricing/verify_payment/",
              {
                method: "POST",
                body: JSON.stringify({
                  transaction_id: transactionId,
                }),
              }
            );

          if (cancelled) return;

          /*
           * IMPORTANT:
           *
           * Once the backend confirms success, there is no success
           * screen here anymore.
           *
           * Remove the temporary transaction ID and immediately return
           * the customer to the dashboard.
           */
          if (result.status === "success") {
            sessionStorage.removeItem(
              "pending_transaction_id"
            );

            router.replace("/dashboard");
            return;
          }

          /*
           * A genuine provider failure is different from a verification
           * request failing.
           *
           * Only show "Payment failed" when the backend explicitly tells
           * us that the payment itself failed.
           */
          if (result.status === "failed") {
            setView("failed");
            setErrorMessage(
              result.message ||
                "The payment provider reported that this payment was not completed."
            );
            return;
          }

          // Payment is still pending. Keep polling.
        } catch (err) {
          /*
           * DO NOT turn a 401/403/network error into "Payment failed".
           *
           * The customer may already have been charged by Paystack before
           * this verification request failed.
           *
           * The webhook can still confirm the transaction on the backend.
           *
           * Therefore we keep polling instead of falsely telling the
           * customer that their money was not received.
           */
          console.warn(
            "[Payment verification] verification request failed:",
            err
          );
        }

        if (attempt < POLL_ATTEMPTS - 1) {
          await sleep(POLL_DELAY_MS);
        }
      }

      if (cancelled) return;

      /*
       * Verification attempts are exhausted but we never received an
       * explicit "failed" response from the backend.
       *
       * This is NOT treated as a failed payment.
       */
      setView("pending");
    };

    run();

    return () => {
      cancelled = true;
    };
  }, [router]);

  /*
   * While payment confirmation is happening, show the same visual
   * language as the dashboard.
   *
   * No dark background.
   * No purple authentication screen.
   * No separate success page.
   */
  if (view === "verifying") {
    return <DashboardSkeleton />;
  }

  if (view === "pending") {
    return <PendingPayment />;
  }

  return <FailedPayment message={errorMessage} />;
}