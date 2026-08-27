"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Loader2,
  CheckCircle2,
  ImageIcon,
  Type,
  Video,
  ShieldCheck,
  Eye,
  EyeOff,
} from "lucide-react";
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

/* Campaign Ticket palette */
const ink = "#16140F";
const panel = "#1D1A14";
const rule = "#38321F";
const paper = "#EDE6D6";
const paperMuted = "#C9BFA4";
const marigold = "#E8A33D";
const signal = "#D6491F";
const textPrimary = "#F3ECDD";
const textMuted = "#8C8368";

const COUNTRIES = [
  { value: "NG", label: "Nigeria" },
  { value: "KE", label: "Kenya" },
  { value: "GH", label: "Ghana" },
  { value: "OTHER", label: "Other" },
] as const;

const INCLUDED = [
  { icon: ImageIcon, label: "Flyer design" },
  { icon: Type, label: "Five social captions" },
  { icon: Video, label: "Promo video" },
];

export default function SignUpPage() {
  const router = useRouter();

  /* ORIGINAL STATE — PRESERVED */
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
  const [success, setSuccess] = useState(false);

  /* ORIGINAL SETTER — PRESERVED */
  const set =
    (field: FormField) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setForm((prev) => ({
        ...prev,
        [field]: e.target.value,
      }));

  /* ORIGINAL VALIDATION — PRESERVED */
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

  /* ORIGINAL SUBMIT LOGIC — PRESERVED */
  async function handleSubmit() {
    if (loading) return;

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

      setSuccess(true);

      setTimeout(() => {
        router.push("/dashboard");
      }, 700);
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

  /* ORIGINAL ENTER HANDLER — PRESERVED */
  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !loading) {
      handleSubmit();
    }
  }

  const formReady =
    form.full_name.trim() &&
    form.email.trim() &&
    form.country &&
    form.password &&
    form.confirm_password;

  return (
    <div
      className="min-h-screen flex flex-col relative overflow-x-hidden"
      style={{
        background: ink,
        color: textPrimary,
      }}
    >
      {/* Fonts */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=IBM+Plex+Mono:wght@400;500;600;700&display=swap');

        .font-display {
          font-family: 'Space Grotesk', ui-sans-serif, system-ui, sans-serif;
        }

        .font-mono {
          font-family: 'IBM Plex Mono', ui-monospace, monospace;
        }

        .campaign-input::placeholder {
          color: #6b6250;
        }

        .campaign-input:focus {
          outline: none;
        }

        .campaign-select option {
          background: #EDE6D6;
          color: #16140F;
        }
      `}</style>

      {/* SUCCESS TOAST */}
      <div
        role="status"
        aria-live="polite"
        className={`fixed top-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-xl transition-all duration-500 ${
          success
            ? "opacity-100 translate-y-0"
            : "opacity-0 -translate-y-3 pointer-events-none"
        }`}
        style={{
          background: panel,
          border: `1px solid ${marigold}55`,
          color: textPrimary,
        }}
      >
        <CheckCircle2
          className="w-5 h-5 shrink-0"
          style={{ color: marigold }}
        />

        <div>
          <p className="font-semibold text-sm">
            Account created successfully
          </p>

          <p
            className="font-mono text-[11px] mt-0.5"
            style={{ color: textMuted }}
          >
            OPENING YOUR DASHBOARD
          </p>
        </div>
      </div>

      {/* NAV */}
      <nav className="p-5 sm:p-6 flex items-center">
        <Link
          href="/"
          className="inline-flex items-center gap-3 transition-opacity hover:opacity-80"
          style={{ color: textMuted }}
        >
          <ArrowLeft className="w-4 h-4" />

          <Logo className="w-8 h-8 rounded-lg" />

          <span className="font-mono text-[11px] tracking-[0.15em]">
            BACK TO HOME
          </span>
        </Link>
      </nav>

      {/* MAIN */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 py-8 sm:py-12">
        <div
          className="w-full max-w-5xl rounded-3xl overflow-hidden grid grid-cols-1 lg:grid-cols-2"
          style={{
            background: panel,
            border: `1px solid ${rule}`,
          }}
        >
          {/* =====================================================
              LEFT — SIGNUP FORM
          ====================================================== */}

          <div className="p-7 sm:p-10 lg:p-12 flex flex-col justify-center">
            <span
              className="font-mono text-[11px] sm:text-xs tracking-[0.2em]"
              style={{ color: textMuted }}
            >
              NEW ACCOUNT TICKET
            </span>

            <h1 className="font-display text-2xl sm:text-3xl font-semibold mt-2 leading-tight">
              Open your account.
            </h1>

            <p
              className="mt-3 text-sm sm:text-base max-w-md leading-relaxed"
              style={{ color: textMuted }}
            >
              Create your INRA Studio account and start turning your business
              content into ready-to-use marketing assets.
            </p>

            {/* ERROR */}
            {error && (
              <div
                role="alert"
                className="mt-6 text-sm px-4 py-3 rounded-xl"
                style={{
                  background: "rgba(214,73,31,0.1)",
                  border: `1px solid rgba(214,73,31,0.35)`,
                  color: signal,
                }}
              >
                {error}
              </div>
            )}

            {/* FORM PAPER */}
            <div
              className="mt-6 rounded-2xl p-1"
              style={{
                background: paper,
              }}
            >
              <div
                className="rounded-xl p-4 sm:p-5 flex flex-col"
                style={{
                  border: `2px dashed ${paperMuted}`,
                }}
                onKeyDown={handleKeyDown}
              >
                {/* FULL NAME */}
                <div>
                  <label
                    htmlFor="fullName"
                    className="font-mono text-[10px] sm:text-[11px] tracking-[0.15em]"
                    style={{ color: "#6b6250" }}
                  >
                    FULL NAME
                  </label>

                  <input
                    id="fullName"
                    type="text"
                    placeholder="Inrastudio"
                    value={form.full_name}
                    onChange={set("full_name")}
                    autoComplete="name"
                    className="campaign-input w-full mt-1.5 bg-transparent text-base sm:text-lg font-medium"
                    style={{
                      color: ink,
                    }}
                  />
                </div>

                {/* EMAIL */}
                <div
                  className="pt-4 mt-4"
                  style={{
                    borderTop: `1px dashed ${paperMuted}`,
                  }}
                >
                  <label
                    htmlFor="email"
                    className="font-mono text-[10px] sm:text-[11px] tracking-[0.15em]"
                    style={{ color: "#6b6250" }}
                  >
                    EMAIL ADDRESS
                  </label>

                  <input
                    id="email"
                    type="email"
                    placeholder="inrastudio@gmail.com"
                    value={form.email}
                    onChange={set("email")}
                    autoComplete="email"
                    className="campaign-input w-full mt-1.5 bg-transparent text-base sm:text-lg font-medium"
                    style={{
                      color: ink,
                    }}
                  />
                </div>

                {/* COUNTRY */}
                <div
                  className="pt-4 mt-4"
                  style={{
                    borderTop: `1px dashed ${paperMuted}`,
                  }}
                >
                  <label
                    htmlFor="country"
                    className="font-mono text-[10px] sm:text-[11px] tracking-[0.15em]"
                    style={{ color: "#6b6250" }}
                  >
                    COUNTRY
                  </label>

                  <select
                    id="country"
                    value={form.country}
                    onChange={set("country")}
                    className="campaign-select w-full mt-1.5 bg-transparent outline-none text-base sm:text-lg font-medium cursor-pointer"
                    style={{
                      color: form.country ? ink : "#6b6250",
                    }}
                  >
                    <option value="">Select your country</option>

                    {COUNTRIES.map((country) => (
                      <option
                        key={country.value}
                        value={country.value}
                      >
                        {country.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* PASSWORD */}
                <div
                  className="pt-4 mt-4"
                  style={{
                    borderTop: `1px dashed ${paperMuted}`,
                  }}
                >
                  <label
                    htmlFor="password"
                    className="font-mono text-[10px] sm:text-[11px] tracking-[0.15em]"
                    style={{ color: "#6b6250" }}
                  >
                    PASSWORD
                  </label>

                  <div className="relative">
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Minimum 8 characters"
                      value={form.password}
                      onChange={set("password")}
                      autoComplete="new-password"
                      className="campaign-input w-full mt-1.5 bg-transparent outline-none text-base sm:text-lg font-medium pr-11"
                      style={{
                        color: ink,
                      }}
                    />

                    <button
                      type="button"
                      aria-label={
                        showPassword
                          ? "Hide password"
                          : "Show password"
                      }
                      onClick={() =>
                        setShowPassword((value) => !value)
                      }
                      className="absolute right-1 top-1/2 -translate-y-1/2 p-2 rounded-lg transition-opacity hover:opacity-70"
                      style={{
                        color: "#6b6250",
                      }}
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* CONFIRM PASSWORD */}
                <div
                  className="pt-4 mt-4"
                  style={{
                    borderTop: `1px dashed ${paperMuted}`,
                  }}
                >
                  <label
                    htmlFor="confirmPassword"
                    className="font-mono text-[10px] sm:text-[11px] tracking-[0.15em]"
                    style={{ color: "#6b6250" }}
                  >
                    CONFIRM PASSWORD
                  </label>

                  <div className="relative">
                    <input
                      id="confirmPassword"
                      type={
                        showConfirmPassword ? "text" : "password"
                      }
                      placeholder="Re-enter your password"
                      value={form.confirm_password}
                      onChange={set("confirm_password")}
                      autoComplete="new-password"
                      className="campaign-input w-full mt-1.5 bg-transparent outline-none text-base sm:text-lg font-medium pr-11"
                      style={{
                        color: ink,
                      }}
                    />

                    <button
                      type="button"
                      aria-label={
                        showConfirmPassword
                          ? "Hide confirm password"
                          : "Show confirm password"
                      }
                      onClick={() =>
                        setShowConfirmPassword((value) => !value)
                      }
                      className="absolute right-1 top-1/2 -translate-y-1/2 p-2 rounded-lg transition-opacity hover:opacity-70"
                      style={{
                        color: "#6b6250",
                      }}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* SUBMIT */}
            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading || !formReady}
              className="flex items-center justify-center gap-2 w-full mt-5 px-7 py-4 rounded-full font-bold transition-all hover:-translate-y-0.5 active:translate-y-0 disabled:cursor-not-allowed disabled:hover:translate-y-0 min-h-[48px]"
              style={{
                background:
                  loading || !formReady
                    ? "#5A4A22"
                    : marigold,
                color:
                  loading || !formReady
                    ? "#8C7C52"
                    : ink,
              }}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Creating your account…
                </>
              ) : (
                "Create my account"
              )}
            </button>

            {/* LOGIN */}
            <p
              className="mt-6 text-sm"
              style={{ color: textMuted }}
            >
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-semibold transition-opacity hover:opacity-75"
                style={{ color: marigold }}
              >
                Log in instead
              </Link>
            </p>
          </div>

          {/* =====================================================
              RIGHT — CAMPAIGN PROMISE
          ====================================================== */}

          <div
            className="hidden lg:flex flex-col justify-center p-10 xl:p-12"
            style={{
              borderLeft: `1px dashed ${rule}`,
            }}
          >
            <span
              className="font-mono text-xs tracking-[0.2em]"
              style={{ color: textMuted }}
            >
              WHAT&apos;S WAITING FOR YOU
            </span>

            <h2 className="font-display text-xl xl:text-2xl font-semibold mt-3 leading-tight">
              One photo in,
              <br />
              a full campaign out.
            </h2>

            <p
              className="text-sm mt-3 max-w-sm leading-relaxed"
              style={{ color: textMuted }}
            >
              Upload a product or business photo and INRA Studio handles the
              creative work for you.
            </p>

            {/* INCLUDED */}
            <div className="mt-7 flex flex-col gap-2">
              {INCLUDED.map(({ icon: Icon, label }) => (
                <div
                  key={label}
                  className="flex items-center gap-3 px-4 py-3.5 rounded-xl"
                  style={{
                    background: ink,
                    border: `1px solid ${rule}`,
                  }}
                >
                  <Icon
                    className="w-4 h-4 shrink-0"
                    style={{ color: marigold }}
                  />

                  <span className="text-sm font-medium">
                    {label}
                  </span>
                </div>
              ))}
            </div>

            {/* TRUST */}
            <div
              className="flex items-center gap-2 mt-7 font-mono text-[10px] tracking-[0.1em]"
              style={{ color: textMuted }}
            >
              <ShieldCheck
                className="w-3.5 h-3.5"
                style={{ color: marigold }}
              />

              YOUR CONTENT STAYS YOURS
            </div>

            {/* SMALL DIVIDER */}
            <div
              className="mt-7 pt-5"
              style={{
                borderTop: `1px dashed ${rule}`,
              }}
            >
              <p
                className="font-mono text-[10px] tracking-[0.08em] leading-relaxed"
                style={{ color: textMuted }}
              >
                BUILT FOR BUSINESSES THAT NEED
                <br />
                CONTENT WITHOUT THE BACK-AND-FORTH.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}