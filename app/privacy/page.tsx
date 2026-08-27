import Link from "next/link";
import { ArrowUpRight, Facebook, Instagram } from "lucide-react";

import { Logo } from "@/components/Logo";
import { Navbar } from "@/components/Navbar";

function Footer() {
  return (
    <footer className="border-t border-[#25231e] bg-[#11100d] text-[#eee7d8]">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        {/* Main footer */}
        <div className="grid gap-14 py-16 sm:py-20 lg:grid-cols-[1.3fr_1fr] lg:gap-24">
          <div className="max-w-xl">
            <p className="mb-5 font-mono text-[10px] uppercase tracking-[0.2em] text-[#8d836c]">
              INRASTUDIO / LEGAL
            </p>

            <h2 className="font-display text-3xl font-semibold tracking-[-0.03em] sm:text-4xl">
              Clear terms for using the studio.
            </h2>

            <p className="mt-5 max-w-md text-sm leading-7 text-[#aaa18f]">
              The important details about your data, generated content and
              using INRASTUDIO for your business.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-10 sm:gap-16">
            {/* Explore */}
            <div className="flex flex-col gap-4">
              <span className="mb-2 font-mono text-[9px] font-bold uppercase tracking-[0.2em] text-[#6f6859]">
                (EXPLORE)
              </span>

              <Link
                href="/privacy"
                className="text-sm text-[#c9c1b0] transition-colors hover:text-[#d6491f]"
              >
                Privacy Policy
              </Link>

              <Link
                href="/terms"
                className="text-sm text-[#c9c1b0] transition-colors hover:text-[#d6491f]"
              >
                Terms & Conditions
              </Link>

              <Link
                href="/disclosure"
                className="text-sm text-[#c9c1b0] transition-colors hover:text-[#d6491f]"
              >
                Disclosure
              </Link>

              <Link
                href="/contact"
                className="mt-2 inline-flex items-center gap-2 text-sm text-[#c9c1b0] transition-colors hover:text-[#d6491f]"
              >
                Contact
                <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            {/* Connect */}
            <div className="flex flex-col gap-4">
              <span className="mb-2 font-mono text-[9px] font-bold uppercase tracking-[0.2em] text-[#6f6859]">
                (CONNECT)
              </span>

              <a
                href="#"
                className="group inline-flex items-center gap-2 text-sm text-[#c9c1b0] transition-colors hover:text-[#d6491f]"
              >
                <Facebook className="h-4 w-4 text-[#77705f]" />
                Facebook
                <ArrowUpRight className="h-3 w-3 opacity-0 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100" />
              </a>

              <a
                href="#"
                className="group inline-flex items-center gap-2 text-sm text-[#c9c1b0] transition-colors hover:text-[#d6491f]"
              >
                <Instagram className="h-4 w-4 text-[#77705f]" />
                Instagram
                <ArrowUpRight className="h-3 w-3 opacity-0 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100" />
              </a>
            </div>
          </div>
        </div>

        {/* Footer bottom */}
        <div className="flex flex-col gap-5 border-t border-[#25231e] py-7 text-xs text-[#756e60] sm:flex-row sm:items-center sm:justify-between">
          <Link href="/" className="inline-flex items-center gap-3">
            <Logo
              showWordmark={false}
              className="h-8 w-8"
            />

            <span className="font-mono text-[10px] font-bold tracking-[0.16em] text-[#eee7d8]">
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

export default function PrivacyPolicyRoute() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-[#eee7d8] text-[#16140f] selection:bg-[#d6491f] selection:text-[#f7f0e2]">
      <Navbar />

      <main>
        {/* Editorial header */}
        <section className="border-b border-[#cfc5b0] px-5 pb-16 pt-36 sm:px-8 sm:pb-20 sm:pt-44 lg:px-10">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-10 lg:grid-cols-[1fr_360px] lg:items-end">
              <div>
                <p className="mb-6 font-mono text-[10px] font-semibold uppercase tracking-[0.22em] text-[#8d836c]">
                  INRASTUDIO / PRIVACY
                </p>

                <h1 className="max-w-4xl font-display text-5xl font-semibold leading-[0.94] tracking-[-0.055em] sm:text-6xl lg:text-8xl">
                  Privacy,
                  <br />
                  without the small print.
                </h1>
              </div>

              <div className="border-l border-[#cfc5b0] pl-5 lg:mb-1">
                <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-[#8d836c]">
                  Last updated
                </p>

                <p className="mt-2 font-display text-xl font-medium">
                  27 August 2026
                </p>

                <p className="mt-5 text-sm leading-6 text-[#625b4e]">
                  This page explains what information INRASTUDIO collects,
                  why we need it and how it is handled when you use the
                  service.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Policy body */}
        <section className="px-5 py-16 sm:px-8 sm:py-20 lg:px-10">
          <div className="mx-auto grid max-w-7xl gap-14 lg:grid-cols-[240px_minmax(0,720px)] lg:gap-24">
            {/* Side index */}
            <aside className="hidden lg:block">
              <div className="sticky top-32">
                <p className="font-mono text-[9px] font-bold uppercase tracking-[0.2em] text-[#8d836c]">
                  On this page
                </p>

                <nav className="mt-5 flex flex-col border-l border-[#cfc5b0]">
                  {[
                    ["01", "Introduction"],
                    ["02", "Information we collect"],
                    ["03", "How we use it"],
                    ["04", "AI processing"],
                    ["05", "Data security"],
                  ].map(([number, label]) => (
                    <a
                      key={number}
                      href={`#section-${number}`}
                      className="border-l-2 border-transparent py-2 pl-4 font-mono text-[10px] uppercase tracking-[0.08em] text-[#77705f] transition-colors hover:border-[#d6491f] hover:text-[#16140f]"
                    >
                      {number} / {label}
                    </a>
                  ))}
                </nav>
              </div>
            </aside>

            {/* Content */}
            <article className="max-w-3xl">
              <PolicySection
                id="section-01"
                number="01"
                title="Introduction"
              >
                <p>
                  At INRASTUDIO AI Marketing Studio (“we”, “our”, or “us”),
                  we respect your privacy and are committed to handling your
                  information responsibly.
                </p>

                <p>
                  This policy explains the information we may collect when
                  you visit our website or use our services, how we use that
                  information, and the circumstances in which it may be
                  shared.
                </p>
              </PolicySection>

              <PolicySection
                id="section-02"
                number="02"
                title="Information we collect"
              >
                <p>
                  We may collect information you provide directly to us, as
                  well as technical information generated when you use the
                  website.
                </p>

                <ul>
                  <li>
                    Information such as your name, email address, telephone
                    number or other contact details.
                  </li>
                  <li>
                    Information you provide when creating an account,
                    contacting us or using our services.
                  </li>
                  <li>
                    Information about your device, browser, connection and
                    how you interact with the website.
                  </li>
                </ul>
              </PolicySection>

              <PolicySection
                id="section-03"
                number="03"
                title="How we use your information"
              >
                <p>
                  We use information we collect to operate and maintain
                  INRASTUDIO and to provide the services you request.
                </p>

                <ul>
                  <li>To provide and improve the website and its services.</li>
                  <li>
                    To process requests, account activity and transactions.
                  </li>
                  <li>
                    To communicate with you about your account or enquiries.
                  </li>
                  <li>
                    To protect the service and prevent misuse or fraudulent
                    activity.
                  </li>
                </ul>
              </PolicySection>

              <PolicySection
                id="section-04"
                number="04"
                title="AI processing"
              >
                <p>
                  INRASTUDIO uses AI systems to process images and text you
                  provide and to generate marketing material such as flyers,
                  captions and promotional content.
                </p>

                <p>
                  Depending on the service being used, processing may involve
                  third-party AI providers. Your submitted material may
                  therefore be transmitted to those providers where required
                  to perform the requested service.
                </p>

                <p>
                  We do not use your personal images or brand information to
                  train our own AI models unless this has been explicitly
                  agreed with you.
                </p>
              </PolicySection>

              <PolicySection
                id="section-05"
                number="05"
                title="Data security"
              >
                <p>
                  We take reasonable measures to protect information held by
                  INRASTUDIO against accidental loss, unauthorised access,
                  alteration or disclosure.
                </p>

                <p>
                  No internet-based service can guarantee absolute security.
                  You should therefore understand that information sent over
                  the internet may carry some risk despite the safeguards we
                  put in place.
                </p>
              </PolicySection>

              {/* Contact block */}
              <div className="mt-20 border-t-2 border-[#16140f] pt-8">
                <p className="font-mono text-[9px] font-bold uppercase tracking-[0.2em] text-[#8d836c]">
                  Questions about your data?
                </p>

                <div className="mt-4 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
                  <h2 className="max-w-lg font-display text-2xl font-semibold tracking-[-0.03em] sm:text-3xl">
                    Ask us directly.
                  </h2>

                  <Link
                    href="/contact"
                    className="inline-flex h-11 items-center justify-center gap-2 rounded-[10px] bg-[#16140f] px-5 font-mono text-[10px] font-semibold uppercase tracking-[0.12em] text-[#eee7d8] transition-transform hover:-translate-y-0.5"
                  >
                    Contact us
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            </article>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

function PolicySection({
  id,
  number,
  title,
  children,
}: {
  id: string;
  number: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-32 border-b border-[#cfc5b0] py-10 first:pt-0">
      <div className="grid gap-5 sm:grid-cols-[70px_1fr] sm:gap-8">
        <div className="font-mono text-[10px] font-bold tracking-[0.12em] text-[#d6491f]">
          {number}
        </div>

        <div>
          <h2 className="font-display text-2xl font-semibold tracking-[-0.035em] sm:text-3xl">
            {title}
          </h2>

          <div className="mt-6 space-y-5 text-[15px] leading-7 text-[#625b4e]">
            {children}
          </div>
        </div>
      </div>
    </section>
  );
}