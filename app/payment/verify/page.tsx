"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { apiFetch } from "@/lib/auth";

type VerifyResponse = {
  status: "success" | "failed" | "pending" | string;
  message?: string;
};

type ViewState = "verifying" | "error";

export default function PaymentVerifyPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const hasRun = useRef(false);
  const [viewState, setViewState] = useState<ViewState>("verifying");

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    const status = searchParams.get("status");
    const flutterwaveTransactionId = searchParams.get("transaction_id");
    const transactionId = sessionStorage.getItem("pending_transaction_id");

    const redirectWithError = (message: string) => {
      router.replace(`/pricing?payment_error=${encodeURIComponent(message)}`);
    };

    const verify = async () => {
      if (status === "cancelled") {
        router.replace("/pricing");
        return;
      }

      if (status === "failed") {
        redirectWithError("Payment failed");
        return;
      }

      if (!flutterwaveTransactionId || !transactionId) {
        redirectWithError("Missing transaction reference");
        return;
      }

      try {
        const res = await apiFetch<VerifyResponse>(
          "/api/pricing/verify_payment/",
          {
            method: "POST",
            body: JSON.stringify({
              transaction_id: transactionId,
              flutterwave_transaction_id: flutterwaveTransactionId,
            }),
          }
        );

        sessionStorage.removeItem("pending_transaction_id");

        if (res.status === "success") {
          router.replace("/dashboard");
        } else {
          setViewState("error");
          redirectWithError(res.message || "Payment not completed");
        }
      } catch (err) {
        console.error("Payment verification failed:", err);
        setViewState("error");
        redirectWithError("Verification failed. Please contact support if you were charged.");
      }
    };

    verify();
  }, [router, searchParams]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h2 className="text-xl font-semibold">
          {viewState === "verifying" ? "Verifying your payment..." : "Redirecting..."}
        </h2>
        <p className="mt-2 text-gray-500">
          {viewState === "verifying"
            ? "Please wait while we confirm your payment."
            : "There was an issue confirming your payment."}
        </p>
      </div>
    </div>
  );
}