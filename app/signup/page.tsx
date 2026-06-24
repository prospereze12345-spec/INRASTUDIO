"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2, Eye, EyeOff } from "lucide-react";
import { Logo } from "@/components/Logo";
import { apiFetch } from "@/lib/auth";

type FormField =
  | "full_name"
  | "email"
  | "country"
  | "password"
  | "confirm_password";

interface FormState {
  full_name: string;
  email: string;
  country: string;
  password: string;
  confirm_password: string;
}

const COUNTRIES = [
  { value: "NG", label: "Nigeria" },
  { value: "KE", label: "Kenya" },
  { value: "GH", label: "Ghana" },
  { value: "ZA", label: "South Africa" },
  { value: "EG", label: "Egypt" },
  { value: "OTHER", label: "Other" },
] as const;

const INPUT_CLASS =
  "w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 outline-none transition-all placeholder:text-slate-400 text-slate-900 text-sm";

export default function SignUpPage() {
  const router = useRouter();

  const [form, setForm] = useState<FormState>({
    full_name: "",
    email: "",
    country: "",
    password: "",
    confirm_password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const set =
    (field: FormField) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setForm((prev) => ({ ...prev, [field]: e.target.value }));

  function validate(): string | null {
    if (!form.full_name.trim()) return "Name is required.";
    if (!form.email.trim()) return "Email address is required.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      return "Enter a valid email address.";
    if (!form.country) return "Please select your country.";
    if (form.password.length < 8)
      return "Password must be at least 8 characters.";
    if (form.password !== form.confirm_password)
      return "Passwords do not match.";
    return null;
  }

  async function handleSubmit() {
    setError("");

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);

    try {
  await apiFetch("/api/auth/signup/", {
    method: "POST",
    body: JSON.stringify({
      full_name: form.full_name.trim(),
      email: form.email.trim().toLowerCase(),
      country: form.country,
      password: form.password,
      confirm_password: form.confirm_password,
    }),
  });


      router.push("/dashboard");
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : "Signup failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !loading) handleSubmit();
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 p-6 flex items-center">
        <Link href="/" className="flex items-center gap-2">
          <Logo className="w-8 h-8 rounded-lg" />
          <span className="font-display font-medium text-xl tracking-widest text-[#0a1128]">
            INRASTUDIO
          </span>
        </Link>
      </nav>

      {/* Form */}
      <div className="flex-1 flex items-center justify-center p-4 py-24">
        <div className="w-full max-w-md bg-white p-8 sm:p-12 rounded-3xl shadow-xl border border-slate-100">
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-slate-900 mb-2 text-center tracking-tight">
            Create an account
          </h1>

          <p className="text-slate-500 mb-8 text-center text-sm font-light">
            Start generating high-converting AI marketing assets.
          </p>

          {error && (
            <p
              role="alert"
              className="mb-4 text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-3"
            >
              {error}
            </p>
          )}

          <div className="space-y-4" onKeyDown={handleKeyDown}>
            {/* Full Name */}
            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-700">
                Name
              </label>
              <input
                type="text"
                placeholder="e.g. John"
                value={form.full_name}
                onChange={set("full_name")}
                className={INPUT_CLASS}
              />
            </div>

            {/* Email */}
            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-700">
                Email address
              </label>
              <input
                type="email"
                placeholder="john@example.com"
                value={form.email}
                onChange={set("email")}
                className={INPUT_CLASS}
              />
            </div>

            {/* Country */}
            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-700">
                Country
              </label>

              <select
                value={form.country}
                onChange={set("country")}
                className={`${INPUT_CLASS} appearance-none`}
              >
                <option value="">Select your country</option>
                {COUNTRIES.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Password */}
            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-700">
                Password
              </label>

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Min. 8 characters"
                  value={form.password}
                  onChange={set("password")}
                  className={`${INPUT_CLASS} pr-12`}
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-700">
                Confirm password
              </label>

              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Re-enter password"
                  value={form.confirm_password}
                  onChange={set("confirm_password")}
                  className={`${INPUT_CLASS} pr-12`}
                />

                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((v) => !v)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              className="w-full py-4 rounded-xl bg-cyan-500 text-white font-semibold hover:bg-cyan-600 active:scale-[0.98] transition-all shadow-lg shadow-cyan-500/25 mt-6 flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {loading ? "Creating account…" : "Create account"}
            </button>
          </div>

          <p className="mt-8 text-center text-sm text-slate-500">
            Already have an account?{" "}
            <Link href="/login" className="text-cyan-600 font-semibold">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}