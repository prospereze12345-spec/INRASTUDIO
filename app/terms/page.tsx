"use client";

import { ArrowUpRight, Facebook, Instagram } from "lucide-react";
import { Logo } from "@/components/Logo";
import { Navbar } from "@/components/Navbar";
import Link from "next/link";

const ink = "#16140F";
const paper = "#EEE7D8";
const paperDark = "#DCD2BD";
const signal = "#D6491F";
const marigold = "#E8A33D";
const muted = "#756D5C";

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
              (02) CONNECT
            </p>

            <div className="flex flex-col gap-3">
              <a
                href="#"
                className="flex items-center gap-2 font-display text-base hover:opacity-70 transition-opacity"
                style={{ color: paper }}
              >
                <Instagram className="w-4 h-4" />
                Instagram
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>

              <a
                href="#"
                className="flex items-center gap-2 font-display text-base hover:opacity-70 transition-opacity"
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

const termsSections = [
  {
    number: "01",
    title: "Acceptance of terms",
    content: (
      <p>
        By accessing and using INRASTUDIO AI Marketing Studio, you agree to be
        bound by these Terms and Conditions and our Privacy Policy.
        <br />
        <br />
        If you do not agree with these terms, please do not use our services.
      </p>
    ),
  },

  {
    number: "02",
    title: "Services provided",
    content: (
      <p>
        INRASTUDIO provides AI-powered marketing asset generation, including
        but not limited to flyers, captions, and promotional videos.
        <br />
        <br />
        We reserve the right to modify or discontinue the service with or
        without notice to you.
      </p>
    ),
  },

  {
    number: "03",
    title: "User responsibilities",
    content: (
      <>
        <p className="mb-6">
          You are responsible for the content you upload and generate using our
          service. You agree not to use our service to generate content that
          is:
        </p>

        <ul className="space-y-4">
          {[
            "Illegal, threatening, defamatory, or abusive.",
            "Infringes on any third party's intellectual property rights.",
            "Contains software viruses or any other computer code designed to disrupt our platform.",
          ].map((item, index) => (
            <li
              key={index}
              className="flex items-start gap-4"
            >
              <span
                className="mt-[0.65rem] w-1.5 h-1.5 rounded-full shrink-0"
                style={{ background: signal }}
              />

              <span>{item}</span>
            </li>
          ))}
        </ul>
      </>
    ),
  },

  {
    number: "04",
    title: "Intellectual property",
    content: (
      <p>
        You retain ownership of all images and text you upload.
        <br />
        <br />
        We grant you a limited, non-exclusive, non-transferable licence to use
        the generated marketing assets for your business purposes, subject to
        the plan tier you have subscribed to.
      </p>
    ),
  },

  {
    number: "05",
    title: "Limitation of liability",
    content: (
      <p>
        INRASTUDIO shall not be liable for any indirect, incidental, special,
        consequential, or punitive damages resulting from your use of or
        inability to use the service.
        <br />
        <br />
        Our maximum liability shall not exceed the amount you paid us over the
        past 12 months.
      </p>
    ),
  },
];

export default function TermsRoute() {
  const updatedDate = new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date());

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
            HERO / DOCUMENT HEADER
        ========================================================== */}

        <section className="pt-[120px] sm:pt-[150px] px-5 sm:px-8">
          <div className="max-w-[1000px] mx-auto">
            <div className="flex items-center gap-4 mb-8 sm:mb-10">
              <span
                className="font-mono text-[9px] tracking-[0.2em]"
                style={{ color: muted }}
              >
                INRASTUDIO / LEGAL
              </span>

              <span
                className="h-px flex-1 max-w-[180px]"
                style={{
                  background: "rgba(22,20,15,0.18)",
                }}
              />

              <span
                className="font-mono text-[9px] tracking-[0.16em] hidden sm:block"
                style={{ color: muted }}
              >
                02 / 03
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[1fr_260px] gap-10 lg:gap-20 items-end">
              <div>
                <p
                  className="font-mono text-[10px] tracking-[0.18em] mb-5"
                  style={{ color: signal }}
                >
                  TERMS & CONDITIONS
                </p>

                <h1
                  className="
                    font-display
                    text-[clamp(3.7rem,9vw,8rem)]
                    font-medium
                    leading-[0.82]
                    tracking-[-0.07em]
                  "
                >
                  THE
                  <br />
                  RULES
                  <br />
                  ARE
                  <br />
                  SIMPLE.
                </h1>
              </div>

              <div className="pb-1">
                <p
                  className="font-display text-lg sm:text-xl leading-[1.2] tracking-[-0.02em]"
                  style={{ color: "#514B3E" }}
                >
                  The terms that apply when you use INRASTUDIO, its tools, and
                  the marketing material they produce.
                </p>
              </div>
            </div>

            {/* DOCUMENT META */}
            <div
              className="mt-10 sm:mt-14 border-t border-b grid grid-cols-1 sm:grid-cols-3"
              style={{
                borderColor: "rgba(22,20,15,0.2)",
              }}
            >
              <div
                className="py-5 sm:pr-6 border-b sm:border-b-0 sm:border-r"
                style={{
                  borderColor: "rgba(22,20,15,0.14)",
                }}
              >
                <p
                  className="font-mono text-[8px] tracking-[0.15em] mb-2"
                  style={{ color: muted }}
                >
                  DOCUMENT
                </p>

                <p className="font-display text-sm">
                  Terms & Conditions
                </p>
              </div>

              <div
                className="py-5 sm:px-6 border-b sm:border-b-0 sm:border-r"
                style={{
                  borderColor: "rgba(22,20,15,0.14)",
                }}
              >
                <p
                  className="font-mono text-[8px] tracking-[0.15em] mb-2"
                  style={{ color: muted }}
                >
                  LAST UPDATED
                </p>

                <p className="font-display text-sm">{updatedDate}</p>
              </div>

              <div className="py-5 sm:pl-6">
                <p
                  className="font-mono text-[8px] tracking-[0.15em] mb-2"
                  style={{ color: muted }}
                >
                  STATUS
                </p>

                <p className="font-display text-sm flex items-center gap-2">
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ background: signal }}
                  />
                  Current
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================
            TERMS CONTENT
        ========================================================== */}

        <section className="px-5 sm:px-8 mt-16 sm:mt-24 pb-24">
          <div className="max-w-[1000px] mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-[180px_1fr] gap-10 lg:gap-20">
              {/* DESKTOP CONTENT INDEX */}
              <aside className="hidden lg:block">
                <div className="sticky top-28">
                  <p
                    className="font-mono text-[8px] tracking-[0.18em] mb-5"
                    style={{ color: muted }}
                  >
                    ON THIS PAGE
                  </p>

                  <nav className="flex flex-col border-t">
                    {termsSections.map((section) => (
                      <a
                        key={section.number}
                        href={`#section-${section.number}`}
                        className="
                          py-3
                          border-b
                          font-mono
                          text-[9px]
                          tracking-[0.08em]
                          hover:text-[#D6491F]
                          transition-colors
                        "
                        style={{
                          borderColor: "rgba(22,20,15,0.14)",
                          color: muted,
                        }}
                      >
                        {section.number} /{" "}
                        {section.title.toUpperCase()}
                      </a>
                    ))}
                  </nav>
                </div>
              </aside>

              {/* DOCUMENT */}
              <article>
                <div
                  className="
                    font-display
                    text-xl
                    sm:text-2xl
                    leading-[1.35]
                    max-w-[720px]
                    mb-16
                    sm:mb-20
                  "
                  style={{ color: "#514B3E" }}
                >
                  These terms set out the basic rules for using INRASTUDIO.
                  Please read them before creating or publishing material
                  through the service.
                </div>

                <div>
                  {termsSections.map((section, index) => (
                    <section
                      key={section.number}
                      id={`section-${section.number}`}
                      className={index === 0 ? "" : "mt-16 sm:mt-20"}
                    >
                      <div
                        className="border-t pt-5 sm:pt-6"
                        style={{
                          borderColor: "rgba(22,20,15,0.2)",
                        }}
                      >
                        <div className="grid grid-cols-[44px_1fr] sm:grid-cols-[60px_1fr] gap-4 sm:gap-6">
                          <span
                            className="font-mono text-[10px] tracking-[0.1em]"
                            style={{ color: signal }}
                          >
                            {section.number}
                          </span>

                          <div>
                            <h2
                              className="
                                font-display
                                text-2xl
                                sm:text-3xl
                                font-medium
                                tracking-[-0.035em]
                                leading-tight
                                mb-6
                              "
                            >
                              {section.title}
                            </h2>

                            <div
                              className="
                                font-display
                                text-base
                                sm:text-lg
                                leading-[1.65]
                                max-w-[680px]
                              "
                              style={{ color: "#5F584B" }}
                            >
                              {section.content}
                            </div>
                          </div>
                        </div>
                      </div>
                    </section>
                  ))}
                </div>

                {/* IMPORTANT NOTE */}
                <div
                  className="mt-16 sm:mt-20 border-t pt-6 sm:pt-8"
                  style={{
                    borderColor: "rgba(22,20,15,0.2)",
                  }}
                >
                  <div
                    className="p-5 sm:p-7"
                    style={{
                      background: paperDark,
                    }}
                  >
                    <p
                      className="font-mono text-[8px] tracking-[0.17em] mb-4"
                      style={{ color: muted }}
                    >
                      BEFORE YOU USE IT
                    </p>

                    <p
                      className="font-display text-lg sm:text-xl leading-[1.35]"
                      style={{ color: ink }}
                    >
                      You are responsible for the material you upload and for
                      what you publish using INRASTUDIO. Make sure you have the
                      rights to use your source material and that your final
                      content is appropriate for its intended use.
                    </p>
                  </div>
                </div>

                {/* LEGAL NAVIGATION */}
                <div
                  className="mt-12 pt-6 border-t flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5"
                  style={{
                    borderColor: "rgba(22,20,15,0.2)",
                  }}
                >
                  <Link
                    href="/privacy"
                    className="
                      group
                      flex
                      items-center
                      gap-2
                      font-mono
                      text-[9px]
                      tracking-[0.13em]
                      hover:text-[#D6491F]
                      transition-colors
                    "
                    style={{ color: muted }}
                  >
                    ← PRIVACY POLICY
                  </Link>

                  <Link
                    href="/disclosure"
                    className="
                      group
                      flex
                      items-center
                      gap-2
                      font-mono
                      text-[9px]
                      tracking-[0.13em]
                      hover:text-[#D6491F]
                      transition-colors
                    "
                    style={{ color: muted }}
                  >
                    DISCLOSURE
                    <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </Link>
                </div>
              </article>
            </div>
          </div>
        </section>

        {/* =========================================================
            FINAL CTA
        ========================================================== */}

        <section
          className="border-t"
          style={{
            background: "#E5DDCC",
            borderColor: "rgba(22,20,15,0.15)",
          }}
        >
          <div className="max-w-[1000px] mx-auto px-5 sm:px-8 py-16 sm:py-24">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-10">
              <div>
                <div
                  className="font-mono text-[9px] tracking-[0.2em] mb-6"
                  style={{ color: muted }}
                >
                  NEED CLARIFICATION?
                </div>

                <h2
                  className="
                    font-display
                    text-[clamp(2.8rem,6vw,5.8rem)]
                    leading-[0.88]
                    tracking-[-0.06em]
                    font-medium
                  "
                >
                  TALK TO
                  <br />
                  <span style={{ color: signal }}>US.</span>
                </h2>
              </div>

              <Link
                href="/contact"
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
                  hover:text-[#D6491F]
                  transition-colors
                "
                style={{
                  color: ink,
                  borderColor: "rgba(22,20,15,0.25)",
                }}
              >
                CONTACT INRASTUDIO
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