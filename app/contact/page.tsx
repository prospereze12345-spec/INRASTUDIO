"use client";

import { ArrowUpRight, Instagram, Facebook, Mail, MapPin, Send } from "lucide-react";
import Link from "next/link";
import { Logo } from "@/components/Logo";
import { Navbar } from "@/components/Navbar";

const ink = "#16140F";
const paper = "#EEE7D8";
const paperDark = "#DCD2BD";
const signal = "#D6491F";
const marigold = "#E8A33D";
const muted = "#756D5C";

const navLinks = [
  { label: "Contact", href: "/contact" },
  { label: "Dashboard", href: "/dashboard" },
  { label: "Pricing", href: "/pricing" },
];

function Footer() {
  return (
    <footer
      className="w-full border-t"
      style={{
        background: ink,
        borderColor: "rgba(238,231,216,0.12)",
      }}
    >
      <div className="max-w-[1180px] mx-auto px-5 sm:px-8 pt-16 sm:pt-24 pb-8">
        {/* FOOTER INTRO */}
        <div className="grid grid-cols-1 lg:grid-cols-[1.3fr_0.7fr] gap-14 lg:gap-24 pb-20">
          <div>
            <div
              className="font-mono text-[9px] tracking-[0.2em] mb-6"
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

          <div className="lg:pt-10">
            <p
              className="font-display text-xl sm:text-2xl leading-[1.15] tracking-[-0.025em] max-w-md"
              style={{ color: "#C5BCAA" }}
            >
              Good marketing should earn attention before it asks for a sale.
            </p>
          </div>
        </div>

        {/* FOOTER NAVIGATION */}
        <div
          className="border-t border-b py-8 sm:py-10 grid grid-cols-1 sm:grid-cols-3 gap-10"
          style={{
            borderColor: "rgba(238,231,216,0.12)",
          }}
        >
          <div>
            <p
              className="font-mono text-[9px] tracking-[0.18em] mb-5"
              style={{ color: "#77705F" }}
            >
              (01) EXPLORE
            </p>

            <div className="flex flex-col gap-3">
              <Link
                href="/pricing"
                className="font-display text-base hover:opacity-70 transition-opacity"
                style={{ color: paper }}
              >
                Pricing
              </Link>

              <Link
                href="/dashboard"
                className="font-display text-base hover:opacity-70 transition-opacity"
                style={{ color: paper }}
              >
                Dashboard
              </Link>

              <Link
                href="/contact"
                className="font-display text-base hover:opacity-70 transition-opacity"
                style={{ color: paper }}
              >
                Contact
              </Link>
            </div>
          </div>

          <div>
            <p
              className="font-mono text-[9px] tracking-[0.18em] mb-5"
              style={{ color: "#77705F" }}
            >
              (02) CONNECT
            </p>

            <div className="flex flex-col gap-3">
              <a
                href="#"
                className="flex items-center gap-2 font-display text-base group hover:opacity-70 transition-opacity"
                style={{ color: paper }}
              >
                <Instagram className="w-4 h-4" />
                Instagram
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>

              <a
                href="#"
                className="flex items-center gap-2 font-display text-base group hover:opacity-70 transition-opacity"
                style={{ color: paper }}
              >
                <Facebook className="w-4 h-4" />
                Facebook
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          <div>
            <p
              className="font-mono text-[9px] tracking-[0.18em] mb-5"
              style={{ color: "#77705F" }}
            >
              (03) READ
            </p>

            <div className="flex flex-col gap-3">
              <Link
                href="/privacy"
                className="font-display text-base hover:opacity-70 transition-opacity"
                style={{ color: paper }}
              >
                Privacy Policy
              </Link>

              <Link
                href="/terms"
                className="font-display text-base hover:opacity-70 transition-opacity"
                style={{ color: paper }}
              >
                Terms & Conditions
              </Link>

              <Link
                href="/disclosure"
                className="font-display text-base hover:opacity-70 transition-opacity"
                style={{ color: paper }}
              >
                Disclosure
              </Link>
            </div>
          </div>
        </div>

        {/* FOOTER BASELINE */}
        <div className="pt-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
          <div className="flex items-center gap-3">
            <Logo
              size="sm"
              showWordmark={false}
              className="w-8 h-8 rounded-lg"
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

function Field({
  label,
  name,
  type = "text",
  placeholder,
}: {
  label: string;
  name: string;
  type?: string;
  placeholder: string;
}) {
  return (
    <label className="block">
      <span
        className="block font-mono text-[9px] tracking-[0.16em] mb-3"
        style={{ color: muted }}
      >
        {label}
      </span>

      <input
        name={name}
        type={type}
        placeholder={placeholder}
        className="
          w-full
          bg-transparent
          border-0
          border-b
          px-0
          py-3
          rounded-none
          outline-none
          font-display
          text-lg
          placeholder:opacity-40
          transition-colors
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

export default function ContactRoute() {
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

        <section className="pt-[118px] sm:pt-[145px] px-5 sm:px-8">
          <div className="max-w-[1180px] mx-auto">
            {/* TOP LABEL */}
            <div className="flex items-center gap-4 mb-8 sm:mb-10">
              <span
                className="font-mono text-[9px] tracking-[0.2em]"
                style={{ color: muted }}
              >
                01 / CONTACT
              </span>

              <span
                className="h-px flex-1 max-w-[180px]"
                style={{ background: "rgba(22,20,15,0.18)" }}
              />

              <span
                className="font-mono text-[9px] tracking-[0.16em] hidden sm:block"
                style={{ color: muted }}
              >
                LAGOS / WORLDWIDE
              </span>
            </div>

            {/* MEMORABLE HERO */}
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-10 lg:gap-20 items-end">
              <h1
                className="
                  font-display
                  text-[clamp(4rem,11vw,9.5rem)]
                  font-medium
                  leading-[0.82]
                  tracking-[-0.07em]
                  max-w-[950px]
                "
              >
                LET&apos;S MAKE
                <br />
                <span style={{ color: signal }}>SOMETHING</span>
                <br />
                <span className="inline-flex items-end gap-4">
                  WORTH
                  <span
                    className="inline-block w-5 h-5 sm:w-8 sm:h-8 mb-[0.08em]"
                    style={{ background: marigold }}
                  />
                  IT.
                </span>
              </h1>

              <div className="pb-2 lg:pb-4">
                <p
                  className="font-display text-lg sm:text-xl leading-[1.2] tracking-[-0.02em] max-w-[280px]"
                  style={{ color: "#514B3E" }}
                >
                  Have a question, an idea, or a campaign that needs a sharper
                  edge? Tell us what you&apos;re working on.
                </p>
              </div>
            </div>

            {/* HERO BASELINE */}
            <div
              className="mt-10 sm:mt-14 border-t"
              style={{ borderColor: "rgba(22,20,15,0.2)" }}
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
                    className="py-4 sm:py-5 border-r last:border-r-0"
                    style={{
                      borderColor: "rgba(22,20,15,0.14)",
                    }}
                  >
                    <div
                      className="font-mono text-[8px] mb-2"
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

        <section className="px-5 sm:px-8 mt-20 sm:mt-28 pb-24">
          <div className="max-w-[1180px] mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-[0.72fr_1.28fr] gap-12 lg:gap-20">
              {/* LEFT INFORMATION */}
              <aside>
                <div
                  className="font-mono text-[9px] tracking-[0.2em] mb-8"
                  style={{ color: muted }}
                >
                  02 / FIND US
                </div>

                <div
                  className="border-t pt-6 mb-10"
                  style={{ borderColor: "rgba(22,20,15,0.2)" }}
                >
                  <div className="flex gap-4">
                    <Mail
                      className="w-5 h-5 shrink-0"
                      style={{ color: signal }}
                    />

                    <div>
                      <p
                        className="font-mono text-[9px] tracking-[0.14em] mb-2"
                        style={{ color: muted }}
                      >
                        EMAIL
                      </p>

                      <a
                        href="mailto:hello@inrastudio.com"
                        className="
                          font-display
                          text-lg
                          sm:text-xl
                          hover:opacity-60
                          transition-opacity
                        "
                      >
                        hello@inrastudio.com
                      </a>
                    </div>
                  </div>
                </div>

                <div
                  className="border-t pt-6 mb-10"
                  style={{ borderColor: "rgba(22,20,15,0.2)" }}
                >
                  <div className="flex gap-4">
                    <MapPin
                      className="w-5 h-5 shrink-0"
                      style={{ color: signal }}
                    />

                    <div>
                      <p
                        className="font-mono text-[9px] tracking-[0.14em] mb-2"
                        style={{ color: muted }}
                      >
                        STUDIO
                      </p>

                      <p className="font-display text-lg sm:text-xl leading-[1.15]">
                        100 Innovation Way
                        <br />
                        Tech Hub, Lagos
                      </p>
                    </div>
                  </div>
                </div>

                {/* RESPONSE NOTE */}
                <div
                  className="mt-12 p-5 sm:p-6 border"
                  style={{
                    background: paperDark,
                    borderColor: "rgba(22,20,15,0.14)",
                  }}
                >
                  <div
                    className="font-mono text-[9px] tracking-[0.16em] mb-4"
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
                  className="font-mono text-[9px] tracking-[0.2em] mb-8"
                  style={{ color: muted }}
                >
                  03 / SEND A NOTE
                </div>

                <div
                  className="border-t"
                  style={{ borderColor: "rgba(22,20,15,0.2)" }}
                >
                  <form
                    className="pt-8 sm:pt-10"
                    onSubmit={(event) => event.preventDefault()}
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 sm:gap-x-8 sm:gap-y-10">
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
                            className="block font-mono text-[9px] tracking-[0.16em] mb-3"
                            style={{ color: muted }}
                          >
                            04 / WHAT&apos;S ON YOUR MIND?
                          </span>

                          <textarea
                            name="message"
                            rows={6}
                            placeholder="Tell us what you're working on..."
                            className="
                              w-full
                              bg-transparent
                              border
                              px-4
                              py-4
                              rounded-none
                              outline-none
                              resize-none
                              font-display
                              text-lg
                              placeholder:opacity-40
                              transition-colors
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

                    {/* SUBMIT */}
                    <div
                      className="
                        mt-8
                        pt-6
                        border-t
                        flex
                        flex-col
                        sm:flex-row
                        items-start
                        sm:items-center
                        justify-between
                        gap-6
                      "
                      style={{
                        borderColor: "rgba(22,20,15,0.2)",
                      }}
                    >
                      <p
                        className="font-mono text-[9px] leading-[1.5] max-w-[260px]"
                        style={{ color: muted }}
                      >
                        We read every message. No automated maze, no sales
                        script.
                      </p>

                      <button
                        type="submit"
                        className="
                          group
                          w-full
                          sm:w-auto
                          min-w-[190px]
                          h-14
                          px-6
                          flex
                          items-center
                          justify-center
                          gap-3
                          font-display
                          text-sm
                          font-bold
                          transition-all
                          duration-200
                          hover:-translate-y-0.5
                          active:translate-y-0
                        "
                        style={{
                          background: signal,
                          color: "#F7F0E2",
                        }}
                      >
                        SEND MESSAGE

                        <Send className="w-4 h-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
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
          <div className="max-w-[1180px] mx-auto px-5 sm:px-8 py-16 sm:py-24">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-10">
              <div>
                <div
                  className="font-mono text-[9px] tracking-[0.2em] mb-6"
                  style={{ color: muted }}
                >
                  04 / BEFORE YOU GO
                </div>

                <h2
                  className="
                    font-display
                    text-[clamp(2.7rem,6vw,6rem)]
                    leading-[0.88]
                    tracking-[-0.06em]
                    font-medium
                  "
                >
                  HAVE SOMETHING
                  <br />
                  <span style={{ color: signal }}>IN MIND?</span>
                </h2>
              </div>

              <Link
                href="/dashboard"
                className="
                  group
                  inline-flex
                  items-center
                  gap-3
                  font-mono
                  text-[10px]
                  tracking-[0.14em]
                  font-semibold
                  pb-2
                  border-b
                  transition-colors
                  hover:text-[#D6491F]
                "
                style={{
                  borderColor: "rgba(22,20,15,0.25)",
                }}
              >
                BACK TO STUDIO
                <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}