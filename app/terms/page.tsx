"use client";

import Link from "next/link";
import { ArrowUpRight, Instagram } from "lucide-react";

import { Logo } from "@/components/Logo";
import { Navbar } from "@/components/Navbar";
import { useTheme } from "@/lib/theme";

// ============================================================================
// TERMS DATA
// ============================================================================

const termsSections = [
{
number: "01",
title: "Acceptance of terms",
content: ( <p>
By accessing and using INRASTUDIO AI Marketing Studio, you agree to be
bound by these Terms and Conditions and our Privacy Policy. <br /> <br />
If you do not agree with these terms, please do not use our services. </p>
),
},

{
number: "02",
title: "Services provided",
content: ( <p>
INRASTUDIO provides AI-powered marketing asset generation, including
but not limited to flyers, captions, and promotional videos. <br /> <br />
We reserve the right to modify or discontinue the service with or
without notice to you. </p>
),
},

{
number: "03",
title: "User responsibilities",
content: (
<> <p className="mb-6">
You are responsible for the content you upload and generate using our
service. You agree not to use our service to generate content that
is: </p>

```
    <ul className="space-y-4">
      <li className="flex items-start gap-4">
        <span className="mt-[0.65rem] h-1.5 w-1.5 shrink-0 rounded-full" />
        <span>Illegal, threatening, defamatory, or abusive.</span>
      </li>

      <li className="flex items-start gap-4">
        <span className="mt-[0.65rem] h-1.5 w-1.5 shrink-0 rounded-full" />
        <span>
          Infringes on any third party&apos;s intellectual property rights.
        </span>
      </li>

      <li className="flex items-start gap-4">
        <span className="mt-[0.65rem] h-1.5 w-1.5 shrink-0 rounded-full" />
        <span>
          Contains software viruses or any other computer code designed to
          disrupt our platform.
        </span>
      </li>
    </ul>
  </>
),


},

{
number: "04",
title: "Intellectual property",
content: ( <p>
You retain ownership of all images and text you upload. <br /> <br />
We grant you a limited, non-exclusive, non-transferable licence to use
the generated marketing assets for your business purposes, subject to
the plan tier you have subscribed to. </p>
),
},

{
number: "05",
title: "Limitation of liability",
content: ( <p>
INRASTUDIO shall not be liable for any indirect, incidental, special,
consequential, or punitive damages resulting from your use of or
inability to use the service. <br /> <br />
Our maximum liability shall not exceed the amount you paid us over the
past 12 months. </p>
),
},
];

// ============================================================================
// FOOTER
// ============================================================================

function Footer() {
const { tokens } = useTheme();

const {
ink,
rule,
textPrimary,
textMuted,
paperMuted,
signal,
} = tokens;

return (
<footer
className="border-t"
style={{
background: ink,
borderColor: rule,
color: textPrimary,
}}
> <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10"> <div className="grid gap-14 py-16 sm:py-20 lg:grid-cols-[1.3fr_1fr] lg:gap-24"> <div className="max-w-xl">
<p
className="mb-5 font-mono text-[10px] uppercase tracking-[0.2em]"
style={{ color: textMuted }}
>
INRASTUDIO / LEGAL </p>


        <h2 className="font-display text-3xl font-semibold tracking-[-0.03em] sm:text-4xl">
          Clear terms for using the studio.
        </h2>

        <p
          className="mt-5 max-w-md text-sm leading-7"
          style={{ color: paperMuted }}
        >
          The important details about your data, generated content and
          using INRASTUDIO for your business.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-10 sm:gap-16">
        <div className="flex flex-col gap-4">
          <span
            className="mb-2 font-mono text-[9px] font-bold uppercase tracking-[0.2em]"
            style={{ color: textMuted }}
          >
            (EXPLORE)
          </span>

          <Link
            href="/privacy"
            className="text-sm transition-colors"
            style={{ color: paperMuted }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = signal;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = paperMuted;
            }}
          >
            Privacy Policy
          </Link>

          <Link
            href="/terms"
            className="text-sm transition-colors"
            style={{ color: paperMuted }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = signal;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = paperMuted;
            }}
          >
            Terms &amp; Conditions
          </Link>

          <Link
            href="/disclosure"
            className="text-sm transition-colors"
            style={{ color: paperMuted }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = signal;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = paperMuted;
            }}
          >
            Disclosure
          </Link>

          <Link
            href="/contact"
            className="mt-2 inline-flex items-center gap-2 text-sm transition-colors"
            style={{ color: paperMuted }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = signal;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = paperMuted;
            }}
          >
            Contact
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="flex flex-col gap-4">
          <span
            className="mb-2 font-mono text-[9px] font-bold uppercase tracking-[0.2em]"
            style={{ color: textMuted }}
          >
            (CONNECT)
          </span>

          <a
            href="#"
            className="group inline-flex items-center gap-2 text-sm transition-colors"
            style={{ color: paperMuted }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = signal;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = paperMuted;
            }}
          >
            <ArrowUpRight
              className="h-4 w-4"
              style={{ color: textMuted }}
            />

            TikTok

            <ArrowUpRight className="h-3 w-3 opacity-0 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100" />
          </a>

          <a
            href="#"
            className="group inline-flex items-center gap-2 text-sm transition-colors"
            style={{ color: paperMuted }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = signal;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = paperMuted;
            }}
          >
            <Instagram
              className="h-4 w-4"
              style={{ color: textMuted }}
            />

            Instagram

            <ArrowUpRight className="h-3 w-3 opacity-0 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100" />
          </a>
        </div>
      </div>
    </div>

    <div
      className="flex flex-col gap-5 border-t py-7 text-xs sm:flex-row sm:items-center sm:justify-between"
      style={{
        borderColor: rule,
        color: textMuted,
      }}
    >
      <Link
        href="/"
        className="inline-flex items-center gap-3"
      >
        <Logo
          showWordmark={false}
          className="h-8 w-8"
        />

        <span
          className="font-mono text-[10px] font-bold tracking-[0.16em]"
          style={{ color: textPrimary }}
        >
          INRASTUDIO
        </span>
      </Link>

      <p className="font-mono text-[10px] tracking-wide">
        © 2026 INRASTUDIO AI Marketing Studio.
      </p>
    </div>
  </div>
</footer>


);
}

// ============================================================================
// MAIN PAGE
// ============================================================================

export default function TermsRoute() {
const { tokens } = useTheme();

const {
ink,
panel,
panelSoft,
rule,
paperMuted,
signal,
textPrimary,
textMuted,
} = tokens;

const updatedDate = new Intl.DateTimeFormat("en-GB", {
day: "numeric",
month: "long",
year: "numeric",
}).format(new Date());

return (
<div
className="min-h-screen overflow-x-hidden"
style={{
background: ink,
color: textPrimary,
}}
> <Navbar />

```
  <main>
    {/* HERO / DOCUMENT HEADER */}

    <section className="px-5 pt-[120px] sm:px-8 sm:pt-[150px]">
      <div className="mx-auto max-w-[1000px]">
        <div className="mb-8 flex items-center gap-4 sm:mb-10">
          <span
            className="font-mono text-[9px] tracking-[0.2em]"
            style={{ color: textMuted }}
          >
            INRASTUDIO / LEGAL
          </span>

          <span
            className="h-px max-w-[180px] flex-1"
            style={{ background: rule }}
          />

          <span
            className="hidden font-mono text-[9px] tracking-[0.16em] sm:block"
            style={{ color: textMuted }}
          >
            02 / 03
          </span>
        </div>

        <div className="grid grid-cols-1 items-end gap-10 lg:grid-cols-[1fr_260px] lg:gap-20">
          <div>
            <p
              className="mb-5 font-mono text-[10px] tracking-[0.18em]"
              style={{ color: signal }}
            >
              TERMS &amp; CONDITIONS
            </p>

            <h1 className="font-display text-[clamp(3.7rem,9vw,8rem)] font-medium leading-[0.82] tracking-[-0.07em]">
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
              className="font-display text-lg leading-[1.2] tracking-[-0.02em] sm:text-xl"
              style={{ color: paperMuted }}
            >
              The terms that apply when you use INRASTUDIO, its tools, and
              the marketing material they produce.
            </p>
          </div>
        </div>

        <div
          className="mt-10 grid grid-cols-1 border-b border-t sm:mt-14 sm:grid-cols-3"
          style={{ borderColor: rule }}
        >
          <div
            className="border-b py-5 sm:border-b-0 sm:border-r sm:pr-6"
            style={{ borderColor: rule }}
          >
            <p
              className="mb-2 font-mono text-[8px] tracking-[0.15em]"
              style={{ color: textMuted }}
            >
              DOCUMENT
            </p>

            <p className="font-display text-sm">
              Terms &amp; Conditions
            </p>
          </div>

          <div
            className="border-b py-5 sm:border-b-0 sm:border-r sm:px-6"
            style={{ borderColor: rule }}
          >
            <p
              className="mb-2 font-mono text-[8px] tracking-[0.15em]"
              style={{ color: textMuted }}
            >
              LAST UPDATED
            </p>

            <p className="font-display text-sm">
              {updatedDate}
            </p>
          </div>

          <div className="py-5 sm:pl-6">
            <p
              className="mb-2 font-mono text-[8px] tracking-[0.15em]"
              style={{ color: textMuted }}
            >
              STATUS
            </p>

            <p className="flex items-center gap-2 font-display text-sm">
              <span
                className="h-2 w-2 rounded-full"
                style={{ background: signal }}
              />

              Current
            </p>
          </div>
        </div>
      </div>
    </section>

    {/* TERMS CONTENT */}

    <section className="mt-16 px-5 pb-24 sm:mt-24 sm:px-8">
      <div className="mx-auto max-w-[1000px]">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[180px_1fr] lg:gap-20">
          <aside className="hidden lg:block">
            <div className="sticky top-28">
              <p
                className="mb-5 font-mono text-[8px] tracking-[0.18em]"
                style={{ color: textMuted }}
              >
                ON THIS PAGE
              </p>

              <nav
                className="flex flex-col border-t"
                style={{ borderColor: rule }}
              >
                {termsSections.map((section) => (
                  <a
                    key={section.number}
                    href={`#section-${section.number}`}
                    className="border-b py-3 font-mono text-[9px] tracking-[0.08em] transition-opacity hover:opacity-70"
                    style={{
                      borderColor: rule,
                      color: textMuted,
                    }}
                  >
                    {section.number} / {section.title.toUpperCase()}
                  </a>
                ))}
              </nav>
            </div>
          </aside>

          <article>
            <div
              className="mb-16 max-w-[720px] font-display text-xl leading-[1.35] sm:mb-20 sm:text-2xl"
              style={{ color: paperMuted }}
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
                    style={{ borderColor: rule }}
                  >
                    <div className="grid grid-cols-[44px_1fr] gap-4 sm:grid-cols-[60px_1fr] sm:gap-6">
                      <span
                        className="font-mono text-[10px] tracking-[0.1em]"
                        style={{ color: signal }}
                      >
                        {section.number}
                      </span>

                      <div>
                        <h2 className="mb-6 font-display text-2xl font-medium leading-tight tracking-[-0.035em] sm:text-3xl">
                          {section.title}
                        </h2>

                        <div
                          className="max-w-[680px] font-display text-base leading-[1.65] sm:text-lg"
                          style={{ color: paperMuted }}
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
              className="mt-16 border-t pt-6 sm:mt-20 sm:pt-8"
              style={{ borderColor: rule }}
            >
              <div
                className="p-5 sm:p-7"
                style={{
                  background: panelSoft,
                  border: `1px solid ${rule}`,
                }}
              >
                <p
                  className="mb-4 font-mono text-[8px] tracking-[0.17em]"
                  style={{ color: textMuted }}
                >
                  BEFORE YOU USE IT
                </p>

                <p
                  className="font-display text-lg leading-[1.35] sm:text-xl"
                  style={{ color: textPrimary }}
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
              className="mt-12 flex flex-col items-start justify-between gap-5 border-t pt-6 sm:flex-row sm:items-center"
              style={{ borderColor: rule }}
            >
              <Link
                href="/privacy"
                className="group flex items-center gap-2 font-mono text-[9px] tracking-[0.13em] transition-opacity hover:opacity-70"
                style={{ color: textMuted }}
              >
                ← PRIVACY POLICY
              </Link>

              <Link
                href="/disclosure"
                className="group flex items-center gap-2 font-mono text-[9px] tracking-[0.13em] transition-opacity hover:opacity-70"
                style={{ color: textMuted }}
              >
                DISCLOSURE

                <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            </div>
          </article>
        </div>
      </div>
    </section>

    {/* FINAL CTA */}

    <section
      className="border-t"
      style={{
        background: panel,
        borderColor: rule,
      }}
    >
      <div className="mx-auto max-w-[1000px] px-5 py-16 sm:px-8 sm:py-24">
        <div className="flex flex-col justify-between gap-10 md:flex-row md:items-end">
          <div>
            <div
              className="mb-6 font-mono text-[9px] tracking-[0.2em]"
              style={{ color: textMuted }}
            >
              NEED CLARIFICATION?
            </div>

            <h2 className="font-display text-[clamp(2.8rem,6vw,5.8rem)] font-medium leading-[0.88] tracking-[-0.06em]">
              TALK TO
              <br />
              <span style={{ color: signal }}>US.</span>
            </h2>
          </div>

          <Link
            href="/contact"
            className="group inline-flex items-center gap-3 border-b pb-2 font-mono text-[10px] font-semibold tracking-[0.14em] transition-opacity hover:opacity-70"
            style={{
              color: textPrimary,
              borderColor: rule,
            }}
          >
            CONTACT INRASTUDIO

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
