"use client";

import { ArrowUpRight, Instagram, Mail } from "lucide-react";
import { Logo } from "@/components/Logo";
import { Navbar } from "@/components/Navbar";
import { useTheme } from "@/lib/theme";
import Link from "next/link";

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
marigold,
} = tokens;

return (
<footer
className="relative mt-12 w-full border-t px-6 pb-12 pt-24"
style={{
background: ink,
borderColor: rule,
}}
> <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-16 pb-20 lg:flex-row"> <div className="max-w-2xl flex-1">
<h2
className="text-3xl leading-snug tracking-tight md:text-4xl"
style={{ color: textPrimary }}
>
We're software, not a design agency. <br />
Give it one photo and it hands back a flyer, five captions and a
video — no brief, no back-and-forth. </h2> </div>


    <div className="flex shrink-0 flex-wrap gap-12 font-mono text-xs uppercase tracking-widest sm:gap-24">
      {/* LEGAL */}

      <div className="flex flex-col gap-4">
        <span
          className="mb-2 font-bold"
          style={{ color: textMuted }}
        >
          Legal
        </span>

        <Link
          href="/privacy"
          className="transition-colors"
          style={{ color: textPrimary }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = marigold;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = textPrimary;
          }}
        >
          Privacy
        </Link>

        <Link
          href="/terms"
          className="transition-colors"
          style={{ color: textPrimary }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = marigold;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = textPrimary;
          }}
        >
          Terms
        </Link>

        <Link
          href="/disclosure"
          className="transition-colors"
          style={{ color: textPrimary }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = marigold;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = textPrimary;
          }}
        >
          Disclosure
        </Link>
      </div>

      {/* CONTACT */}

      <div className="flex flex-col gap-4">
        <span
          className="mb-2 font-bold"
          style={{ color: textMuted }}
        >
          Contact
        </span>

        <a
          href="#"
          className="flex items-center gap-2 transition-colors"
          style={{ color: textPrimary }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = marigold;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = textPrimary;
          }}
        >
          <span className="flex h-4 w-4 items-center justify-center text-[12px] font-bold">
            ♪
          </span>
          TikTok
        </a>

        <a
          href="#"
          className="flex items-center gap-2 transition-colors"
          style={{ color: textPrimary }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = marigold;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = textPrimary;
          }}
        >
          <Instagram className="h-4 w-4" />
          Instagram
        </a>

        <a
          href="mailto:somtohgist@gmail.com"
          className="flex items-center gap-2 transition-colors"
          style={{ color: textPrimary }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = marigold;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = textPrimary;
          }}
        >
          <Mail className="h-4 w-4" />
          Support
        </a>
      </div>
    </div>
  </div>

  {/* FOOTER BOTTOM */}

  <div
    className="mx-auto mt-4 flex max-w-7xl flex-col items-center justify-between gap-4 border-t pt-8 text-sm md:flex-row"
    style={{
      borderColor: rule,
      color: textMuted,
    }}
  >
    <Logo
      size="sm"
      showWordmark={false}
      className="h-8 w-8"
    />

    <p>© 2026 Inrastudio. Made in Lagos.</p>
  </div>
</footer>

);
}

// ============================================================================
// DISCLOSURE CONTENT
// ============================================================================

const disclosureSections = [
{
number: "01",
title: "AI nature of the product",
content: ( <p>
INRASTUDIO uses artificial intelligence to generate visual and written
marketing content. AI systems are probabilistic, which means generated
material may occasionally be inaccurate, unsuitable, incomplete, or
different from what you intended. <br /> <br />
You should review every generated asset before publishing, advertising,
or distributing it. You remain responsible for the final content you
choose to use. </p>
),
},
{
number: "02",
title: "Affiliate relationships",
content: ( <p>
Some links or recommendations made through INRASTUDIO may be affiliate
links. Where this applies, INRASTUDIO may receive a commission if you
purchase a product, service, resource, or upgrade through that link. <br /> <br />
Any commission does not increase the price you pay. </p>
),
},
{
number: "03",
title: "No guarantee of results",
content: ( <p>
INRASTUDIO provides tools intended to help businesses create and
distribute marketing material more efficiently. However, we cannot
guarantee particular commercial results. <br /> <br />
This includes, but is not limited to, increases in sales, enquiries,
followers, engagement, reach, advertising performance, or other
business or social media metrics. </p>
),
},
];

// ============================================================================
// MAIN PAGE
// ============================================================================

export default function DisclosureRoute() {
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


  <main>
    {/* HEADER */}

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
            03 / 03
          </span>
        </div>

        <div className="grid grid-cols-1 items-end gap-10 lg:grid-cols-[1fr_260px] lg:gap-20">
          <div>
            <p
              className="mb-5 font-mono text-[10px] tracking-[0.18em]"
              style={{ color: signal }}
            >
              DISCLOSURE
            </p>

            <h1
              className="
                font-display
                text-[clamp(4rem,10vw,8.5rem)]
                font-medium
                leading-[0.82]
                tracking-[-0.07em]
              "
            >
              WHAT
              <br />
              YOU
              <br />
              SHOULD
              <br />
              KNOW.
            </h1>
          </div>

          <div className="pb-1">
            <p
              className="font-display text-lg leading-[1.2] tracking-[-0.02em] sm:text-xl"
              style={{ color: paperMuted }}
            >
              A straightforward explanation of how AI, affiliate links,
              and marketing claims work on INRASTUDIO.
            </p>
          </div>
        </div>

        {/* DOCUMENT META */}

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
              Disclosure Statement
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

            <p className="font-display text-sm">{updatedDate}</p>
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

    {/* DISCLOSURE CONTENT */}

    <section className="mt-16 px-5 pb-24 sm:mt-24 sm:px-8">
      <div className="mx-auto max-w-[1000px]">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[180px_1fr] lg:gap-20">
          {/* SIDEBAR */}

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
                {disclosureSections.map((section) => (
                  <a
                    key={section.number}
                    href={`#section-${section.number}`}
                    className="border-b py-3 font-mono text-[9px] tracking-[0.08em] transition-colors"
                    style={{
                      borderColor: rule,
                      color: textMuted,
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = signal;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = textMuted;
                    }}
                  >
                    {section.number} / {section.title.toUpperCase()}
                  </a>
                ))}
              </nav>
            </div>
          </aside>

          {/* DOCUMENT */}

          <article>
            <div
              className="mb-16 max-w-[720px] font-display text-xl leading-[1.35] tracking-[-0.02em] sm:mb-20 sm:text-2xl"
              style={{ color: paperMuted }}
            >
              This disclosure explains the important limitations and
              commercial relationships you should understand when using
              INRASTUDIO.
            </div>

            <div>
              {disclosureSections.map((section, index) => (
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
                        <h2
                          className="
                            mb-6
                            font-display
                            text-2xl
                            font-medium
                            leading-tight
                            tracking-[-0.035em]
                            sm:text-3xl
                          "
                        >
                          {section.title}
                        </h2>

                        <div
                          className="
                            max-w-[680px]
                            font-display
                            text-base
                            leading-[1.65]
                            sm:text-lg
                          "
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

            {/* CLOSING NOTE */}

            <div
              className="mt-16 border-t pt-6 sm:mt-20 sm:pt-8"
              style={{ borderColor: rule }}
            >
              <div
                className="p-5 sm:p-7"
                style={{ background: panelSoft }}
              >
                <p
                  className="mb-4 font-mono text-[8px] tracking-[0.17em]"
                  style={{ color: textMuted }}
                >
                  IN SHORT
                </p>

                <p
                  className="font-display text-lg leading-[1.35] sm:text-xl"
                  style={{ color: textPrimary }}
                >
                  Check what AI produces before you publish it, understand
                  when a link may earn us a commission, and treat marketing
                  performance as something to test rather than something
                  we can promise.
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
                className="group flex items-center gap-2 font-mono text-[9px] tracking-[0.13em] transition-colors"
                style={{ color: textMuted }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = signal;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = textMuted;
                }}
              >
                ← PRIVACY POLICY
              </Link>

              <Link
                href="/terms"
                className="group flex items-center gap-2 font-mono text-[9px] tracking-[0.13em] transition-colors"
                style={{ color: textMuted }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = signal;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = textMuted;
                }}
              >
                TERMS & CONDITIONS

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
              STILL HAVE A QUESTION?
            </div>

            <h2
              className="
                font-display
                text-[clamp(2.8rem,6vw,5.8rem)]
                font-medium
                leading-[0.88]
                tracking-[-0.06em]
              "
            >
              ASK US
              <br />
              <span style={{ color: signal }}>DIRECTLY.</span>
            </h2>
          </div>

          <Link
            href="/contact"
            className="group inline-flex items-center gap-3 border-b pb-2 font-mono text-[10px] font-semibold tracking-[0.14em] transition-colors"
            style={{
              color: textPrimary,
              borderColor: rule,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = signal;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = textPrimary;
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
