"use client";

import { useState } from "react";
import {
  ArrowUpRight,
  Instagram,
  Facebook,
  Mail,
  MapPin,
  Send,
} from "lucide-react";
import Link from "next/link";

import { Logo } from "@/components/Logo";
import { Navbar } from "@/components/Navbar";

const ink = "#16140F";
const paper = "#EEE7D8";
const paperDark = "#DCD2BD";
const signal = "#D6491F";
const marigold = "#E8A33D";
const muted = "#756D5C";

// ─── Footer ─────────────────────────────────────────────────────────────────

function Footer() {
  return (
    <footer
      className="w-full border-t"
      style={{
        background: ink,
        borderColor: "rgba(238,231,216,0.12)",
      }}
    >
      <div className="mx-auto max-w-[1180px] px-5 pb-8 pt-12 sm:px-8 sm:pt-16">
        {/* FOOTER INTRO */}
        <div className="grid grid-cols-1 gap-10 pb-14 lg:grid-cols-[1.3fr_0.7fr] lg:gap-20 lg:pb-16">
          <div>
            <div
              className="mb-5 font-mono text-[9px] tracking-[0.2em]"
              style={{ color: "#8D836C" }}
            >
              INRASTUDIO / 2026
            </div>

            <h2
              className="
                font-display
                text-[clamp(3rem,8vw,7rem)]
                font-medium
                leading-[0.88]
                tracking-[-0.055em]
              "
              style={{ color: paper }}
            >
              MAKE IT
              <br />
              <span style={{ color: marigold }}>NOTICE.</span>
            </h2>
          </div>

          <div className="lg:pt-6">
            <p
              className="max-w-md font-display text-xl leading-[1.15] tracking-[-0.025em] sm:text-2xl"
              style={{ color: "#C5BCAA" }}
            >
              Good marketing should earn attention before it asks for a sale.
            </p>
          </div>
        </div>

        {/* FOOTER NAVIGATION */}
        <div
          className="grid grid-cols-1 gap-8 border-b border-t py-7 sm:grid-cols-2 sm:py-8"
          style={{
            borderColor: "rgba(238,231,216,0.12)",
          }}
        >
          {/* CONNECT */}
          <div>
            <p
              className="mb-4 font-mono text-[9px] tracking-[0.18em]"
              style={{ color: "#77705F" }}
            >
              (01) CONNECT
            </p>

            <div className="flex flex-col gap-2.5">
              <a
                href="#"
                className="group flex items-center gap-2 font-display text-base transition-opacity hover:opacity-70"
                style={{ color: paper }}
              >
                <Instagram className="h-4 w-4" />
                Instagram
                <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>

              <a
                href="#"
                className="group flex items-center gap-2 font-display text-base transition-opacity hover:opacity-70"
                style={{ color: paper }}
              >
                <Facebook className="h-4 w-4" />
                Facebook
                <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>

              <a
                href="mailto:prospereze12345@gmail.com"
                className="group flex items-center gap-2 font-display text-base transition-opacity hover:opacity-70"
                style={{ color: paper }}
              >
                <Mail className="h-4 w-4" />
                Support
                <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
            </div>
          </div>

          {/* READ */}
          <div>
            <p
              className="mb-4 font-mono text-[9px] tracking-[0.18em]"
              style={{ color: "#77705F" }}
            >
              (02) READ
            </p>

            <div className="flex flex-col gap-2.5">
              <Link
                href="/privacy"
                className="font-display text-base transition-opacity hover:opacity-70"
                style={{ color: paper }}
              >
                Privacy Policy
              </Link>

              <Link
                href="/terms"
                className="font-display text-base transition-opacity hover:opacity-70"
                style={{ color: paper }}
              >
                Terms & Conditions
              </Link>

              <Link
                href="/disclosure"
                className="font-display text-base transition-opacity hover:opacity-70"
                style={{ color: paper }}
              >
                Disclosure
              </Link>
            </div>
          </div>
        </div>

        {/* FOOTER BASELINE */}
        <div className="flex flex-col items-start justify-between gap-4 pt-6 sm:flex-row sm:items-center">
          <div className="flex items-center gap-3">
            <Logo
              size="sm"
              showWordmark={false}
              className="h-8 w-8 rounded-lg"
            />

            <span
              className="font-mono text-[9px] tracking-[0.16em]"
              style={{ color: "#8D836C" }}
            >
              INRASTUDIO
            </span>
          </div>

          <p
            className="font-mono text-[9px] tracking-[0.08em]"
            style={{ color: "#77705F" }}
          >
            © 2026 INRASTUDIO AI MARKETING STUDIO.
          </p>
        </div>
      </div>
    </footer>
  );
}

// ─── Form Field ─────────────────────────────────────────────────────────────

function Field({
  label,
  name,
  type = "text",
  placeholder,
  required = true,
}: {
  label: string;
  name: string;
  type?: string;
  placeholder: string;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span
        className="mb-2 block font-mono text-[9px] tracking-[0.16em]"
        style={{ color: muted }}
      >
        {label}
      </span>

      <input
        name={name}
        type={type}
        placeholder={placeholder}
        required={required}
        className="
          w-full
          rounded-none
          border-0
          border-b
          bg-transparent
          px-0
          py-3
          font-display
          text-lg
          outline-none
          transition-colors
          placeholder:opacity-40
          focus:border-[#D6491F]
        "
        style={{
          color: ink,
          borderColor: "rgba(22,20,15,0.2)",
        }}
      />
    </label>
  );
}

// ─── Main Page ──────────────────────────────────────────────────────────────

export default function ContactRoute() {
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [statusMessage, setStatusMessage] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (sending) return;

    setSending(true);
    setStatus("idle");
    setStatusMessage("");

    const form = event.currentTarget;
    const formData = new FormData(form);

    const firstName = String(formData.get("firstName") || "").trim();
    const lastName = String(formData.get("lastName") || "").trim();
    const email = String(formData.get("email") || "").trim();
    const message = String(formData.get("message") || "").trim();

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          message,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.error || "Unable to send your message."
        );
      }

      setStatus("success");
      setStatusMessage(
        "Your message has been sent. We'll get back to you as soon as possible."
      );

      form.reset();
    } catch (error) {
      setStatus("error");
      setStatusMessage(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setSending(false);
    }
  }

  return (
    <div
      className="min-h-screen overflow-x-hidden"
      style={{
        background: paper,
        color: ink,
      }}
    >
      <Navbar />

      <main>
        {/* =========================================================
            HERO
        ========================================================== */}

        <section className="px-5 pt-[112px] sm:px-8 sm:pt-[138px]">
          <div className="mx-auto max-w-[1180px]">
            {/* TOP LABEL */}
            <div className="mb-6 flex items-center gap-4 sm:mb-8">
              <span
                className="font-mono text-[9px] tracking-[0.2em]"
                style={{ color: muted }}
              >
                01 / CONTACT
              </span>

              <span
                className="h-px max-w-[180px] flex-1"
                style={{
                  background: "rgba(22,20,15,0.18)",
                }}
              />

              <span
                className="hidden font-mono text-[9px] tracking-[0.16em] sm:block"
                style={{ color: muted }}
              >
                LAGOS / NIGERIA
              </span>
            </div>

            {/* HERO */}
            <div className="grid grid-cols-1 items-end gap-8 lg:grid-cols-[1fr_300px] lg:gap-16">
              <h1
                className="
                  max-w-[950px]
                  font-display
                  text-[clamp(4rem,11vw,9.5rem)]
                  font-medium
                  leading-[0.82]
                  tracking-[-0.07em]
                "
              >
                LET&apos;S MAKE
                <br />

                <span style={{ color: signal }}>
                  SOMETHING
                </span>

                <br />

                <span className="inline-flex items-end gap-4">
                  WORTH

                  <span
                    className="mb-[0.08em] inline-block h-5 w-5 sm:h-8 sm:w-8"
                    style={{ background: marigold }}
                  />

                  IT.
                </span>
              </h1>

              <div className="pb-1 lg:pb-3">
                <p
                  className="max-w-[280px] font-display text-lg leading-[1.2] tracking-[-0.02em] sm:text-xl"
                  style={{ color: "#514B3E" }}
                >
                  Have a question, an idea, or a campaign that needs a
                  sharper edge? Tell us what you&apos;re working on.
                </p>
              </div>
            </div>

            {/* HERO BASELINE */}
            <div
              className="mt-8 border-t sm:mt-10"
              style={{
                borderColor: "rgba(22,20,15,0.2)",
              }}
            >
              <div className="grid grid-cols-2 sm:grid-cols-4">
                {[
                  ["01", "QUESTIONS"],
                  ["02", "PROJECTS"],
                  ["03", "PARTNERSHIPS"],
                  ["04", "OTHER"],
                ].map(([number, label]) => (
                  <div
                    key={number}
                    className="border-r py-3.5 last:border-r-0 sm:py-4"
                    style={{
                      borderColor: "rgba(22,20,15,0.14)",
                    }}
                  >
                    <div
                      className="mb-1.5 font-mono text-[8px]"
                      style={{ color: signal }}
                    >
                      {number}
                    </div>

                    <div
                      className="font-mono text-[8px] tracking-[0.13em]"
                      style={{ color: muted }}
                    >
                      {label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================
            CONTACT AREA
        ========================================================== */}

        <section className="mt-16 px-5 pb-20 sm:mt-20 sm:px-8 sm:pb-20">
          <div className="mx-auto max-w-[1180px]">
            <div className="grid grid-cols-1 gap-10 lg:grid-cols-[0.72fr_1.28fr] lg:gap-16">
              {/* LEFT INFORMATION */}

              <aside>
                <div
                  className="mb-6 font-mono text-[9px] tracking-[0.2em]"
                  style={{ color: muted }}
                >
                  02 / FIND US
                </div>

                {/* EMAIL */}

                <div
                  className="mb-8 border-t pt-5"
                  style={{
                    borderColor: "rgba(22,20,15,0.2)",
                  }}
                >
                  <div className="flex gap-4">
                    <Mail
                      className="h-5 w-5 shrink-0"
                      style={{ color: signal }}
                    />

                    <div>
                      <p
                        className="mb-1.5 font-mono text-[9px] tracking-[0.14em]"
                        style={{ color: muted }}
                      >
                        EMAIL
                      </p>

                      <a
                        href="mailto:prospereze12345@gmail.com"
                        className="font-display text-lg transition-opacity hover:opacity-60 sm:text-xl"
                      >
                        prospereze12345@gmail.com
                      </a>
                    </div>
                  </div>
                </div>

                {/* LOCATION */}

                <div
                  className="mb-8 border-t pt-5"
                  style={{
                    borderColor: "rgba(22,20,15,0.2)",
                  }}
                >
                  <div className="flex gap-4">
                    <MapPin
                      className="h-5 w-5 shrink-0"
                      style={{ color: signal }}
                    />

                    <div>
                      <p
                        className="mb-1.5 font-mono text-[9px] tracking-[0.14em]"
                        style={{ color: muted }}
                      >
                        STUDIO
                      </p>

                      <p className="font-display text-lg leading-[1.15] sm:text-xl">
                        Lagos
                        <br />
                        Nigeria
                      </p>
                    </div>
                  </div>
                </div>

                {/* QUICK NOTE */}

                <div
                  className="mt-8 border p-5 sm:p-6"
                  style={{
                    background: paperDark,
                    borderColor: "rgba(22,20,15,0.14)",
                  }}
                >
                  <div
                    className="mb-3 font-mono text-[9px] tracking-[0.16em]"
                    style={{ color: muted }}
                  >
                    A QUICK NOTE
                  </div>

                  <p
                    className="font-display text-base leading-[1.3]"
                    style={{ color: "#514B3E" }}
                  >
                    You don&apos;t need a polished brief. A rough idea is
                    enough. Give us the useful bits and we&apos;ll take it
                    from there.
                  </p>
                </div>
              </aside>

              {/* FORM */}

              <div>
                <div
                  className="mb-6 font-mono text-[9px] tracking-[0.2em]"
                  style={{ color: muted }}
                >
                  03 / SEND A NOTE
                </div>

                <div
                  className="border-t"
                  style={{
                    borderColor: "rgba(22,20,15,0.2)",
                  }}
                >
                  <form
                    className="pt-7 sm:pt-8"
                    onSubmit={handleSubmit}
                  >
                    <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 sm:gap-x-8 sm:gap-y-8">
                      <Field
                        label="01 / FIRST NAME"
                        name="firstName"
                        placeholder="Jane"
                      />

                      <Field
                        label="02 / LAST NAME"
                        name="lastName"
                        placeholder="Doe"
                      />

                      <div className="sm:col-span-2">
                        <Field
                          label="03 / EMAIL"
                          name="email"
                          type="email"
                          placeholder="jane@example.com"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block">
                          <span
                            className="mb-2 block font-mono text-[9px] tracking-[0.16em]"
                            style={{ color: muted }}
                          >
                            04 / WHAT&apos;S ON YOUR MIND?
                          </span>

                          <textarea
                            name="message"
                            rows={5}
                            required
                            placeholder="Tell us what you're working on..."
                            className="
                              w-full
                              resize-none
                              rounded-none
                              border
                              bg-transparent
                              px-4
                              py-4
                              font-display
                              text-lg
                              outline-none
                              transition-colors
                              placeholder:opacity-40
                              focus:border-[#D6491F]
                            "
                            style={{
                              color: ink,
                              borderColor: "rgba(22,20,15,0.2)",
                            }}
                          />
                        </label>
                      </div>
                    </div>

                    {/* STATUS */}

                    {status !== "idle" && (
                      <div
                        className="mt-6 border px-4 py-4 font-mono text-[10px] leading-[1.5]"
                        style={{
                          background:
                            status === "success"
                              ? "rgba(40,120,70,0.08)"
                              : "rgba(214,73,31,0.08)",

                          borderColor:
                            status === "success"
                              ? "rgba(40,120,70,0.2)"
                              : "rgba(214,73,31,0.2)",

                          color:
                            status === "success"
                              ? "#285C3A"
                              : "#A83820",
                        }}
                      >
                        {statusMessage}
                      </div>
                    )}

                    {/* SUBMIT */}

                    <div
                      className="
                        mt-7
                        flex
                        flex-col
                        gap-5
                        border-t
                        pt-5
                        sm:flex-row
                        sm:items-center
                        sm:justify-between
                      "
                      style={{
                        borderColor: "rgba(22,20,15,0.2)",
                      }}
                    >
                      <p
                        className="max-w-[260px] font-mono text-[9px] leading-[1.5]"
                        style={{ color: muted }}
                      >
                        We read every message. No automated maze, no sales
                        script.
                      </p>

                      <button
                        type="submit"
                        disabled={sending}
                        className="
                          group
                          flex
                          h-16
                          w-full
                          min-w-[220px]
                          items-center
                          justify-center
                          gap-3
                          rounded-[10px]
                          px-7
                          font-display
                          text-sm
                          font-bold
                          tracking-[-0.01em]
                          shadow-[0_8px_24px_rgba(214,73,31,0.18)]
                          transition-all
                          duration-200
                          hover:-translate-y-0.5
                          hover:shadow-[0_12px_30px_rgba(214,73,31,0.25)]
                          active:translate-y-0
                          disabled:cursor-not-allowed
                          disabled:opacity-60
                          sm:w-auto
                        "
                        style={{
                          background: signal,
                          color: "#F7F0E2",
                        }}
                      >
                        {sending ? "SENDING..." : "SEND MESSAGE"}

                        {!sending && (
                          <Send className="h-4 w-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================
            CLOSING STATEMENT
        ========================================================== */}

        <section
          className="border-t"
          style={{
            background: "#E5DDCC",
            borderColor: "rgba(22,20,15,0.15)",
          }}
        >
          <div className="mx-auto max-w-[1180px] px-5 py-12 sm:px-8 sm:py-16">
            <div className="flex flex-col justify-between gap-7 md:flex-row md:items-end">
              <div>
                <div
                  className="mb-5 font-mono text-[9px] tracking-[0.2em]"
                  style={{ color: muted }}
                >
                  04 / BEFORE YOU GO
                </div>

                <h2
                  className="
                    font-display
                    text-[clamp(2.7rem,6vw,6rem)]
                    font-medium
                    leading-[0.88]
                    tracking-[-0.06em]
                  "
                >
                  HAVE SOMETHING
                  <br />

                  <span style={{ color: signal }}>
                    IN MIND?
                  </span>
                </h2>
              </div>

              <Link
                href="/dashboard"
                className="
                  group
                  inline-flex
                  w-fit
                  items-center
                  gap-3
                  border-b-2
                  pb-2
                  font-mono
                  text-[10px]
                  font-semibold
                  tracking-[0.14em]
                  transition-all
                  hover:-translate-y-0.5
                  hover:text-[#D6491F]
                "
                style={{
                  borderColor: signal,
                }}
              >
                BACK TO STUDIO

                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
