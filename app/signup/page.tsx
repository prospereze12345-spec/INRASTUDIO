"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowUpRight,
  Loader2,
  CheckCircle2,
  ImageIcon,
  Type,
  Video,
  ShieldCheck,
  Eye,
  EyeOff,
  Sparkles,
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

const ink = "#16140F";
const panel = "#1D1A14";
const panelSoft = "#242019";
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
  {
    icon: ImageIcon,
    number: "01",
    title: "Marketing flyers",
    desc: "Turn product photos into polished promotional designs.",
  },
  {
    icon: Type,
    number: "02",
    title: "Social captions",
    desc: "Get ready-to-use copy for the campaign you are creating.",
  },
  {
    icon: Video,
    number: "03",
    title: "Promo videos",
    desc: "Give the same campaign another format without starting over.",
  },
];

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
  const [success, setSuccess] = useState(false);

  const set =
    (field: FormField) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setForm((prev) => ({
        ...prev,
        [field]: e.target.value,
      }));

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
      className="min-h-screen flex flex-col overflow-x-hidden"
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

        .campaign-input::placeholder {
          color: #756D5C;
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
        className={`
          fixed
          top-5
          right-5
          sm:top-6
          sm:right-6
          z-50
          flex
          items-center
          gap-3
          rounded-xl
          px-4
          py-3.5
          shadow-2xl
          transition-all
          duration-500
          ${
            success
              ? "translate-y-0 opacity-100"
              : "-translate-y-3 pointer-events-none opacity-0"
          }
        `}
        style={{
          background: panel,
          border: `1px solid ${marigold}55`,
        }}
      >
        <CheckCircle2
          className="h-5 w-5 shrink-0"
          style={{ color: marigold }}
        />

        <div>
          <p className="font-display text-sm font-semibold">
            Account created
          </p>

          <p
            className="font-mono mt-0.5 text-[10px] tracking-[0.08em]"
            style={{ color: textMuted }}
          >
            OPENING YOUR STUDIO
          </p>
        </div>
      </div>

      {/* HEADER */}
      <header className="px-5 py-5 sm:px-8 sm:py-7">
        <div className="mx-auto flex max-w-[1180px] items-center justify-between">
          <Link
            href="/"
            className="group inline-flex items-center gap-3"
            style={{ color: textMuted }}
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />

            <Logo
              size="sm"
              showWordmark={false}
              className="h-8 w-8 rounded-lg"
            />

            <span className="font-mono text-[10px] tracking-[0.16em]">
              BACK TO HOME
            </span>
          </Link>

          <span
            className="hidden font-mono text-[9px] tracking-[0.18em] sm:block"
            style={{ color: "#625B4B" }}
          >
            INRASTUDIO / CREATE
          </span>
        </div>
      </header>

      {/* MAIN */}
      <main className="flex-1 px-5 pb-14 pt-4 sm:px-8 sm:pb-20 sm:pt-6">
        <div className="mx-auto grid w-full max-w-[1180px] grid-cols-1 gap-8 lg:grid-cols-[1fr_520px] lg:items-start lg:gap-20">

          {/* =====================================================
              LEFT — VALUE PROPOSITION
          ====================================================== */}
          <section className="lg:sticky lg:top-10">
            <div
              className="mb-7 flex items-center gap-4 font-mono text-[9px] tracking-[0.2em]"
              style={{ color: textMuted }}
            >
              <span>INRASTUDIO / 01</span>

              <span
                className="h-px w-16"
                style={{ background: rule }}
              />
            </div>

            <h1 className="font-display text-[clamp(3.7rem,7vw,7.5rem)] font-medium leading-[0.84] tracking-[-0.07em]">
              ONE
              <br />
              <span style={{ color: marigold }}>
                PHOTO.
              </span>
              <br />
              FULL
              <br />
              CAMPAIGN.
            </h1>

            <p
              className="font-display mt-8 max-w-[500px] text-lg leading-[1.18] tracking-[-0.02em] sm:text-xl"
              style={{ color: "#B9B09C" }}
            >
              INRASTUDIO turns the raw material you already have into
              marketing content you can actually use.
            </p>

            {/* PRODUCT OUTPUTS */}
            <div className="mt-9 max-w-[520px]">
              {INCLUDED.map(({ icon: Icon, number, title, desc }) => (
                <div
                  key={number}
                  className="flex gap-4 border-t py-4"
                  style={{ borderColor: rule }}
                >
                  <div
                    className="font-mono w-7 shrink-0 pt-1 text-[8px]"
                    style={{ color: marigold }}
                  >
                    {number}
                  </div>

                  <div
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
                    style={{
                      background: panelSoft,
                      border: `1px solid ${rule}`,
                    }}
                  >
                    <Icon
                      className="h-4 w-4"
                      style={{ color: marigold }}
                    />
                  </div>

                  <div>
                    <h3 className="font-display text-sm font-semibold">
                      {title}
                    </h3>

                    <p
                      className="mt-1 text-sm leading-relaxed"
                      style={{ color: textMuted }}
                    >
                      {desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div
              className="mt-6 flex items-center gap-2 font-mono text-[9px] tracking-[0.1em]"
              style={{ color: textMuted }}
            >
              <Sparkles
                className="h-3.5 w-3.5"
                style={{ color: marigold }}
              />

              BUILT FOR BUSINESSES THAT NEED TO MOVE FAST
            </div>
          </section>

          {/* =====================================================
              RIGHT — SIGNUP FORM
          ====================================================== */}
          <section
            className="rounded-[24px] p-1"
            style={{
              background: panelSoft,
              border: `1px solid ${rule}`,
            }}
          >
            <div
              className="rounded-[20px] p-6 sm:p-8 md:p-10"
              style={{
                background: panel,
              }}
            >
              <div>
                <div
                  className="font-mono text-[9px] tracking-[0.18em]"
                  style={{ color: textMuted }}
                >
                  CREATE YOUR STUDIO
                </div>

                <h2 className="font-display mt-2 text-2xl font-semibold tracking-[-0.025em] sm:text-3xl">
                  Start creating.
                </h2>

                <p
                  className="mt-2 max-w-md text-sm leading-relaxed"
                  style={{ color: textMuted }}
                >
                  Set up your account once. Then turn your business
                  ideas into campaign-ready content from one place.
                </p>
              </div>

              {/* ERROR */}
              {error && (
                <div
                  role="alert"
                  className="mt-6 rounded-xl px-4 py-3 text-sm"
                  style={{
                    background: "rgba(214,73,31,0.1)",
                    border: "1px solid rgba(214,73,31,0.35)",
                    color: signal,
                  }}
                >
                  {error}
                </div>
              )}

              {/* FORM */}
              <div
                className="mt-7 rounded-2xl p-1"
                style={{ background: paper }}
              >
                <div
                  className="rounded-xl p-4 sm:p-5"
                  style={{
                    border: `1px dashed ${paperMuted}`,
                  }}
                  onKeyDown={handleKeyDown}
                >
                  {/* NAME */}
                  <div>
                    <label
                      htmlFor="fullName"
                      className="font-mono block text-[9px] tracking-[0.16em]"
                      style={{ color: "#6B6250" }}
                    >
                      FULL NAME
                    </label>

                    <input
                      id="fullName"
                      type="text"
                      placeholder="Your name"
                      value={form.full_name}
                      onChange={set("full_name")}
                      autoComplete="name"
                      className="campaign-input font-display mt-2 w-full bg-transparent text-base font-medium sm:text-lg"
                      style={{ color: ink }}
                    />
                  </div>

                  {/* EMAIL */}
                  <div
                    className="mt-4 border-t pt-4"
                    style={{ borderColor: paperMuted }}
                  >
                    <label
                      htmlFor="email"
                      className="font-mono block text-[9px] tracking-[0.16em]"
                      style={{ color: "#6B6250" }}
                    >
                      EMAIL ADDRESS
                    </label>

                    <input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      value={form.email}
                      onChange={set("email")}
                      autoComplete="email"
                      className="campaign-input font-display mt-2 w-full bg-transparent text-base font-medium sm:text-lg"
                      style={{ color: ink }}
                    />
                  </div>

                  {/* COUNTRY */}
                  <div
                    className="mt-4 border-t pt-4"
                    style={{ borderColor: paperMuted }}
                  >
                    <label
                      htmlFor="country"
                      className="font-mono block text-[9px] tracking-[0.16em]"
                      style={{ color: "#6B6250" }}
                    >
                      COUNTRY
                    </label>

                    <select
                      id="country"
                      value={form.country}
                      onChange={set("country")}
                      className="campaign-select mt-2 w-full cursor-pointer bg-transparent text-base font-medium outline-none sm:text-lg"
                      style={{
                        color: form.country ? ink : "#6B6250",
                      }}
                    >
                      <option value="">
                        Select your country
                      </option>

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
                    className="mt-4 border-t pt-4"
                    style={{ borderColor: paperMuted }}
                  >
                    <label
                      htmlFor="password"
                      className="font-mono block text-[9px] tracking-[0.16em]"
                      style={{ color: "#6B6250" }}
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
                        className="campaign-input font-display mt-2 w-full bg-transparent pr-11 text-base font-medium outline-none sm:text-lg"
                        style={{ color: ink }}
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
                        className="absolute right-0 top-1/2 -translate-y-1/2 rounded-lg p-2 transition-opacity hover:opacity-60"
                        style={{ color: "#6B6250" }}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* CONFIRM PASSWORD */}
                  <div
                    className="mt-4 border-t pt-4"
                    style={{ borderColor: paperMuted }}
                  >
                    <label
                      htmlFor="confirmPassword"
                      className="font-mono block text-[9px] tracking-[0.16em]"
                      style={{ color: "#6B6250" }}
                    >
                      CONFIRM PASSWORD
                    </label>

                    <div className="relative">
                      <input
                        id="confirmPassword"
                        type={
                          showConfirmPassword
                            ? "text"
                            : "password"
                        }
                        placeholder="Re-enter your password"
                        value={form.confirm_password}
                        onChange={set("confirm_password")}
                        autoComplete="new-password"
                        className="campaign-input font-display mt-2 w-full bg-transparent pr-11 text-base font-medium outline-none sm:text-lg"
                        style={{ color: ink }}
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
                        className="absolute right-0 top-1/2 -translate-y-1/2 rounded-lg p-2 transition-opacity hover:opacity-60"
                        style={{ color: "#6B6250" }}
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* CTA */}
              <button
                type="button"
                onClick={handleSubmit}
                disabled={loading || !formReady}
                className="
                  group
                  mt-4
                  flex
                  min-h-[58px]
                  w-full
                  items-center
                  justify-center
                  gap-3
                  rounded-[13px]
                  px-6
                  font-display
                  text-sm
                  font-bold
                  transition-all
                  duration-200
                  hover:-translate-y-0.5
                  active:translate-y-0
                  disabled:cursor-not-allowed
                  disabled:hover:translate-y-0
                "
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
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Creating your studio...
                  </>
                ) : (
                  <>
                    CREATE MY STUDIO
                    <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </>
                )}
              </button>

              {/* TRUST */}
              <div
                className="mt-6 flex items-start gap-3 border-t pt-5"
                style={{ borderColor: rule }}
              >
                <ShieldCheck
                  className="mt-0.5 h-4 w-4 shrink-0"
                  style={{ color: marigold }}
                />

                <p
                  className="font-mono text-[9px] leading-[1.5]"
                  style={{ color: textMuted }}
                >
                  YOUR CONTENT STAYS YOURS
                  <br />
                  Your account keeps your campaigns in one place.
                </p>
              </div>

              {/* LOGIN */}
              <p
                className="mt-7 text-sm"
                style={{ color: textMuted }}
              >
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="font-semibold transition-opacity hover:opacity-70"
                  style={{ color: marigold }}
                >
                  Log in
                </Link>
              </p>
            </div>
          </section>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="px-5 pb-6 sm:px-8">
        <div className="mx-auto flex max-w-[1180px] items-center justify-between">
          <span
            className="font-mono text-[8px] tracking-[0.14em]"
            style={{ color: "#514B3E" }}
          >
            ONE PHOTO / FULL CAMPAIGN
          </span>

          <span
            className="font-mono text-[8px] tracking-[0.1em]"
            style={{ color: "#514B3E" }}
          >
            INRASTUDIO / 2026
          </span>
        </div>
      </footer>
    </div>
  );
}