"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "motion/react";
import {
  ArrowRight,
  Home,
  Instagram,
  Mail,
  Play,
  Scissors,
  ShoppingBag,
  Sparkles,
  Star,
  Tent,
  Type,
  UtensilsCrossed,
  Video,
  ArrowUpRight,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Logo } from "@/components/Logo";
import { Navbar } from "@/components/Navbar";
import { InstallButton } from "@/components/pwa/InstallButton";
import { useTheme } from "@/lib/theme";

/**
 * DESIGN NOTES
 * ---------------------------------------------------------------------------
 * Theming scope (read this before touching colors here):
 *
 * Every color on this page now comes from the ThemeTokens object in
 * @/lib/theme (ink, panel, panelSoft, rule, paper, paperMuted, marigold,
 * signal, textPrimary, textMuted). To make those usable inside Tailwind
 * classes — including :hover states, which inline `style` can't reach —
 * the tokens are written onto the page wrapper as CSS custom properties
 * (--ink, --marigold, etc.) and referenced as `bg-[var(--marigold)]`,
 * `hover:text-[var(--marigold)]`, and so on throughout.
 *
 * Left hardcoded on purpose, unrelated to the site's theme:
 *  - The studio screenshot mockups: FlyerHero's preview card, the dark
 *    device bezel + captions panel inside Workflow, and the VideoDemo
 *    player chrome. These render literal screenshots of the product's own
 *    (always-dark) UI, not site chrome, so they stay fixed in both themes.
 *  - CTA button text color: buttons sit on the marigold accent, which is a
 *    fairly consistent mid-tone in both themes, so the button text is kept
 *    a fixed dark color rather than pulled from a token.
 *
 * "Paper" surfaces that aren't part of a screenshot (HowItWorks band,
 * Testimonials clippings) now use tokens.paper for the surface and
 * var(--ink) for the text on top of it. tokens.paper in each mode sits
 * close to the *other* mode's tokens.ink, so var(--ink) reliably contrasts
 * against var(--paper) in both light and dark — that's the reasoning
 * behind reusing "ink" as the on-paper text color instead of adding a new
 * token.
 * ---------------------------------------------------------------------------
 */

// ─── Copy & data ────────────────────────────────────────────────────────────

type Caption = {
  platform: string;
  text: string;
};

const CYCLE_SECONDS = 7;
const CAPTION_CYCLE_MS = CYCLE_SECONDS * 1000;

const CAPTIONS: Caption[] = [
  {
    platform: "Instagram",
    text: "My skin used to get oily by midday — not since I switched to Cetaphil Daily Facial Cleanser. Clinically proven to clean without stripping. DM to order, we deliver today. #cetaphil #oilyskin #skincare",
  },
  {
    platform: "TikTok",
    text: "POV: you wake up and your skin isn't shiny by 10am 👀 Cetaphil Daily Facial Cleanser did that. #cetaphil #skincaretok #glowup",
  },
  {
    platform: "Twitter",
    text: "Cetaphil Daily Facial Cleanser, 20 FL OZ — ₦850. Clinically proven to deep clean oily skin. DM to order, delivered today.",
  },
  {
    platform: "TikTok",
    text: "₦850 instead of ₦1,200 elsewhere — Cetaphil Daily Facial Cleanser, 20 FL OZ, suited to normal and oily skin. Comment 'ORDER' or WhatsApp 08012345678 to get yours.",
  },
  {
    platform: "WhatsApp",
    text: "5 left today. Cetaphil Daily Facial Cleanser, 20 FL OZ — ₦850. Reply 'ORDER' to this number and we'll sort delivery.",
  },
];

function useCaptionCycle(length: number) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((p) => (p + 1) % length);
    }, CAPTION_CYCLE_MS);

    return () => clearInterval(timer);
  }, [length]);

  return index;
}

// ─── Deferred video ─────────────────────────────────────────────────────────

function useDeferredVideo(shouldConsider: boolean) {
  const [canLoad, setCanLoad] = useState(false);

  useEffect(() => {
    if (!shouldConsider) return;

    const connection = (navigator as any).connection;

    if (connection?.saveData === true) return;

    const idle =
      (window as any).requestIdleCallback ??
      ((cb: () => void) => setTimeout(cb, 300));

    const id = idle(() => setCanLoad(true));

    return () => {
      if ((window as any).cancelIdleCallback) {
        (window as any).cancelIdleCallback(id);
      } else {
        clearTimeout(id);
      }
    };
  }, [shouldConsider]);

  return canLoad;
}

function FadeInVideo({
  src,
  poster,
  className = "",
}: {
  src: string;
  poster: string;
  className?: string;
}) {
  const [ready, setReady] = useState(false);

  return (
    <video
      src={src}
      autoPlay
      muted
      loop
      playsInline
      preload="metadata"
      poster={poster}
      onCanPlay={() => setReady(true)}
      className={`${className} transition-opacity duration-500 ${
        ready ? "opacity-100" : "opacity-0"
      }`}
    />
  );
}

function LazyReveal({
  className,
  margin = "200px",
  children,
}: {
  className?: string;
  margin?: string;
  children: (inView: boolean) => React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, {
    once: true,
    margin: margin as any,
  });

  return (
    <div ref={ref} className={className}>
      {children(inView)}
    </div>
  );
}

// ─── Decorative tape ───────────────────────────────────────────────────────
// Part of the printed-flyer illustration inside the (fixed, always-dark)
// studio mockup — kept as a fixed paper tone, same reasoning as FlyerHero.

function TapeCorner({ className = "" }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={`absolute h-8 w-16 -rotate-6 bg-[#F2EEE2]/70 shadow-sm ${className}`}
      style={{
        clipPath: "polygon(0 15%, 100% 0, 100% 85%, 0 100%)",
      }}
    />
  );
}

// ─── Hero product preview ──────────────────────────────────────────────────
// Everything inside this component is a screenshot/mockup of the product's
// own (always-dark) studio UI and its printed output — intentionally left
// out of the theme system, same reasoning as the design note at the top.

function FlyerHero({
  activeIndex,
  captions,
}: {
  activeIndex: number;
  captions: Caption[];
}) {
  const active = captions[activeIndex];

  const wrapRef = useRef<HTMLDivElement>(null);
  const inView = useInView(wrapRef, {
    once: true,
    margin: "0px",
  });

  const canLoadVideo = useDeferredVideo(inView);

  return (
    <motion.div
      ref={wrapRef}
      initial={{ opacity: 0, y: 20, rotate: -3 }}
      animate={{ opacity: 1, y: 0, rotate: -1.5 }}
      transition={{
        duration: 0.7,
        delay: 0.25,
        ease: [0.16, 1, 0.3, 1],
      }}
      className="relative z-10 w-full max-w-md flex-1 lg:max-w-[440px]"
    >
      {/* Studio frame */}
      <div className="relative border border-[#F2EEE2]/15 bg-[#0c0a08] p-2 shadow-[10px_14px_0_0_rgba(0,0,0,0.35)]">
        {/* Browser/studio header */}
        <div className="flex items-center justify-between border-b border-[#F2EEE2]/10 px-3 py-2.5">
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-[#C6371B]" />
            <span className="h-2 w-2 rounded-full bg-[#FFC629]" />
            <span className="h-2 w-2 rounded-full bg-[#F2EEE2]/30" />
          </div>

          <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-[#A79A82]">
            Inrastudio / Studio
          </span>

          <span className="font-mono text-[9px] uppercase text-[#FFC629]">
            Ready
          </span>
        </div>

        {/* Actual generated output */}
        <div className="bg-[#F2EEE2] p-4 pb-6 sm:p-5">
          <TapeCorner className="-top-4 left-6" />
          <TapeCorner className="-top-3 right-8 rotate-[8deg]" />

          <div className="mb-4 flex items-center justify-between border-b border-dashed border-[#15130F]/30 pb-3 font-mono text-[10px] uppercase tracking-widest text-[#15130F]/60">
            <span>Generated output</span>
            <span>#0412</span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="relative aspect-square overflow-hidden bg-[#E7E1CF]">
              <Image
                src="/images/flyer-1784491663572.png"
                alt="Flyer generated from a customer's product photo"
                fill
                priority
                fetchPriority="high"
                sizes="(max-width: 640px) 45vw, 220px"
                className="object-contain p-2"
              />
            </div>

            <div className="relative aspect-square overflow-hidden bg-[#E7E1CF]">
              <Image
                src="/images/flyer.png"
                alt="Preview frame of the generated promo video"
                fill
                sizes="(max-width: 640px) 45vw, 220px"
                className="object-contain p-2"
              />

              {canLoadVideo && (
                <FadeInVideo
                  src="/videos/promo-tiktok (2).mp4"
                  poster="/images/flyer.png"
                  className="absolute inset-0 h-full w-full object-contain p-2"
                />
              )}

              <span className="absolute bottom-1.5 right-1.5 flex items-center gap-1 bg-[#15130F] px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-wider text-[#F2EEE2]">
                <Video className="h-2.5 w-2.5" />
                9:16
              </span>
            </div>
          </div>

          {/* Generated caption */}
          <div className="mt-4 border-t border-dashed border-[#15130F]/30 pt-4">
            <div className="mb-2 flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-[#15130F]/60">
              <Type className="h-3 w-3" />
              Caption — {active.platform}
            </div>

            <AnimatePresence mode="wait">
              <motion.p
                key={activeIndex}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="text-[12px] leading-5 text-[#15130F]/85"
              >
                {active.text}
              </motion.p>
            </AnimatePresence>
          </div>

          {/* Output summary */}
          <div className="mt-4 grid grid-cols-3 border-t border-dashed border-[#15130F]/30 pt-3 font-mono text-[9px] uppercase tracking-wider text-[#15130F]/65">
            <div>
              <span className="block text-[#15130F]/40">Flyer</span>
              <span className="font-bold text-[#15130F]">01</span>
            </div>

            <div>
              <span className="block text-[#15130F]/40">Captions</span>
              <span className="font-bold text-[#15130F]">05</span>
            </div>

            <div className="text-right">
              <span className="block text-[#15130F]/40">Ready</span>
              <span className="font-bold text-[#15130F]">~5 MIN</span>
            </div>
          </div>
        </div>
      </div>

      {/* Trial sticker */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8, rotate: 8 }}
        animate={{ opacity: 1, scale: 1, rotate: 10 }}
        transition={{
          duration: 0.5,
          delay: 0.9,
          ease: "backOut",
        }}
        className="absolute -right-6 -top-6 hidden sm:block"
      >
        <div className="relative flex h-24 w-24 items-center justify-center bg-[#FFC629] text-center shadow-[4px_6px_0_0_rgba(0,0,0,0.35)]">
          <span className="absolute -left-1.5 top-1/2 h-3 w-3 -translate-y-1/2 rounded-full bg-[#15130F]" />

          <span className="font-mono text-[11px] font-bold uppercase leading-tight text-[#15130F]">
            Free
            <br />
            trial
          </span>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Hero ───────────────────────────────────────────────────────────────────

function Hero() {
  const { tokens } = useTheme();
  const activeIndex = useCaptionCycle(CAPTIONS.length);

  return (
    <section className="relative z-10 mx-auto flex max-w-7xl flex-col items-center gap-12 px-6 pb-16 pt-32 md:pb-20 md:pt-40 lg:flex-row lg:items-center lg:gap-16">
      <div className="z-10 w-full flex-1 text-center lg:text-left">
        <motion.span
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-5 inline-block px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-[var(--marigold)]"
          style={{ background: tokens.ink }}
        >
          Printed for WhatsApp, Instagram &amp; TikTok
        </motion.span>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="mb-5 text-5xl leading-[1.03] tracking-tight md:text-6xl lg:text-[4.6rem]"
          style={{
            color: tokens.textPrimary,
            fontFamily: "'Archivo Black', var(--font-display), sans-serif",
          }}
        >
          One photo in.
          <br />
          A flyer worth
          <br />
          posting, out.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mx-auto mb-8 max-w-lg text-base leading-relaxed md:text-lg lg:mx-0"
          style={{ color: tokens.textMuted }}
        >
          Send a photo of what you're selling. You'll get a flyer with your
          logo already on it, captions written for each platform, and a short
          video for your Status — most orders are ready in under five minutes.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="flex flex-col items-center justify-center gap-3 sm:flex-row lg:justify-start"
        >
          <Link
            href="/signup"
            className="flex w-full items-center justify-center gap-2 bg-[var(--marigold)] px-8 py-4 text-lg font-bold text-[#15130F] shadow-[4px_4px_0_0_rgba(0,0,0,0.4)] transition-transform hover:-translate-y-0.5 sm:w-auto"
          >
            Start Creating
            <ArrowRight className="h-5 w-5" />
          </Link>

          <InstallButton />
        </motion.div>

        <p className="mt-3 text-xs" style={{ color: tokens.textMuted }}>
          No card needed. Cancel any time.
        </p>

        {/* Small product cue */}
        <div
          className="mt-7 flex items-center justify-center gap-3 font-mono text-[9px] uppercase tracking-[0.18em] lg:justify-start"
          style={{ color: tokens.textMuted }}
        >
          <span className="h-px w-8" style={{ background: tokens.rule }} />
          <span>Flyer + video + 5 captions</span>
        </div>
      </div>

      <FlyerHero activeIndex={activeIndex} captions={CAPTIONS} />
    </section>
  );
}

// ─── Stats ──────────────────────────────────────────────────────────────────

function StatsBar() {
  const { tokens } = useTheme();
  return (
    <section
      className="border-y py-6 transition-colors duration-300"
      style={{ borderColor: tokens.rule, background: tokens.ink }}
    >
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-1 px-6 text-center">
        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--marigold)]">
          Last month
        </span>

        <p className="max-w-2xl text-base md:text-lg" style={{ color: tokens.textPrimary }}>
          1,102 flyers went out to resellers, skincare sellers, estate agents
          and caterers across Nigeria, Morocco, USA, Accra and Kenya.
        </p>
      </div>
    </section>
  );
}

// ─── Who it's for ───────────────────────────────────────────────────────────

const USE_CASES: {
  icon: typeof ShoppingBag;
  label: string;
  detail: string;
  rotate: string;
}[] = [
  {
    icon: ShoppingBag,
    label: "Fashion & accessories",
    detail: "New stock arrives, new flyer goes out the same afternoon.",
    rotate: "-rotate-1",
  },
  {
    icon: Sparkles,
    label: "Skincare & beauty",
    detail: "Captions written the way you already talk to customers.",
    rotate: "rotate-1",
  },
  {
    icon: Home,
    label: "Estate agents",
    detail: "A listing your client isn't embarrassed to forward on.",
    rotate: "-rotate-1",
  },
  {
    icon: UtensilsCrossed,
    label: "Caterers",
    detail: "Today's specials, posted before anyone's ordered lunch.",
    rotate: "rotate-1",
  },
  {
    icon: Tent,
    label: "Event stylists & hire",
    detail: "One logo, consistent across every job you take.",
    rotate: "-rotate-1",
  },
  {
    icon: Scissors,
    label: "Tailors & designers",
    detail: "Finished pieces that look shot in a studio, not a fitting room.",
    rotate: "rotate-1",
  },
];

function WhoItsFor() {
  const { tokens } = useTheme();
  return (
    <section className="mx-auto max-w-6xl px-6 py-20 md:py-24">
      <div className="mb-10 flex flex-col justify-between gap-5 md:flex-row md:items-end">
        <div>
          <h2
            className="text-3xl md:text-4xl"
            style={{
              color: tokens.textPrimary,
              fontFamily: "'Archivo Black', var(--font-display), sans-serif",
            }}
          >
            If you sell like this, it's built for you.
          </h2>

          <p
            className="mt-3 max-w-xl text-base leading-relaxed md:text-lg"
            style={{ color: tokens.textMuted }}
          >
            Not a storefront with a marketing budget — someone selling through
            WhatsApp, Instagram or TikTok, one product at a time.
          </p>
        </div>

        <span className="hidden font-mono text-[10px] uppercase tracking-widest text-[var(--marigold)] md:block">
          Built around real sellers
        </span>
      </div>

      <div className="flex flex-wrap gap-5">
        {USE_CASES.map(({ icon: Icon, label, detail, rotate }) => (
          <div
            key={label}
            className={`w-full border-2 p-5 transition-transform duration-300 hover:-translate-y-1 sm:w-[calc(50%-0.625rem)] lg:w-[calc(33.333%-0.84rem)] ${rotate}`}
            style={{ borderColor: tokens.rule, background: tokens.panel }}
          >
            <div className="mb-3 flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-[var(--marigold)]">
              <Icon className="h-3.5 w-3.5" />
              Signboard
            </div>

            <h3
              className="text-lg"
              style={{
                color: tokens.textPrimary,
                fontFamily: "'Archivo Black', var(--font-display), sans-serif",
              }}
            >
              {label}
            </h3>

            <p className="mt-2 text-sm leading-relaxed" style={{ color: tokens.textMuted }}>
              {detail}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

// ─── How it works ──────────────────────────────────────────────────────────
// A "paper" interlude — not part of any screenshot, so unlike FlyerHero it
// now uses tokens.paper for the surface and var(--ink) for the text on it.

function HowItWorks() {
  return (
    <section
      className="px-6 py-20 md:py-24 transition-colors duration-300"
      style={{ background: "var(--paper)" }}
    >
      <div className="mx-auto max-w-6xl">
        <div className="mb-12">
          <h2
            className="text-3xl text-[var(--ink)] md:text-4xl"
            style={{
              fontFamily: "'Archivo Black', var(--font-display), sans-serif",
            }}
          >
            There's really only one hard part.
          </h2>

          <p className="mt-3 max-w-xl text-base leading-relaxed text-[var(--ink)]/70 md:text-lg">
            Everything before it is uploading a photo. Everything after it is
            yours to edit or send as it comes.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-10 md:grid-cols-3 md:gap-8">
          {[
            {
              n: "01",
              title: "You upload",
              body: "Take a photo with your phone. Ordinary indoor light is fine — most people shoot in their shop.",
            },
            {
              n: "02",
              title: "We build the flyer around it",
              body: "Lighting, background and the shape of the product are read automatically, so the layout fits your product instead of the other way round.",
            },
            {
              n: "03",
              title: "You post or edit first",
              body: "Download the flyer, captions and video as they are, or change the text, colour or logo — nothing needs regenerating unless you swap the photo.",
            },
          ].map((step) => (
            <div key={step.n} className="border-t-4 border-[var(--ink)] pt-4">
              <span
                className="text-5xl text-[var(--ink)]/15"
                style={{
                  fontFamily: "'Archivo Black', var(--font-display), sans-serif",
                }}
              >
                {step.n}
              </span>

              <h3 className="mt-2 text-xl font-semibold text-[var(--ink)]">
                {step.title}
              </h3>

              <p className="mt-2 leading-relaxed text-[var(--ink)]/70">
                {step.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Workflow product showcase ─────────────────────────────────────────────
// The section shell (heading, wrapper bg) follows the theme; the "studio
// frame" mockup inside it — including its captions panel — is a screenshot
// of the product and stays constant, same as FlyerHero.
//
// All three media panels (flyer / video / captions) share the same
// Instagram-feed aspect ratio (4:5) so they read as one uniform row.

const IG_ASPECT = "aspect-[4/5]";

function VideoCard({
  src,
  poster,
  className = "",
}: {
  src: string;
  poster: string;
  className?: string;
}) {
  return (
    <LazyReveal className={`relative ${IG_ASPECT} bg-[#F2EEE2]`}>
      {(inView) => (
        <DeferredVideoTile
          inView={inView}
          src={src}
          poster={poster}
          className={className}
        />
      )}
    </LazyReveal>
  );
}

function DeferredVideoTile({
  inView,
  src,
  poster,
  className = "",
}: {
  inView: boolean;
  src: string;
  poster: string;
  className?: string;
}) {
  const canLoad = useDeferredVideo(inView);

  return (
    <>
      <img
        src={poster}
        alt="Preview frame of the promo video"
        className={`absolute inset-0 h-full w-full object-cover ${className}`}
        loading="lazy"
      />

      {canLoad && (
        <FadeInVideo
          src={src}
          poster={poster}
          className={`absolute inset-0 h-full w-full object-cover ${className}`}
        />
      )}
    </>
  );
}

function Workflow() {
  const { tokens } = useTheme();
  return (
    <section
      id="dashboards"
      className="border-y px-6 py-20 md:py-24 transition-colors duration-300"
      style={{ borderColor: tokens.rule, background: tokens.ink }}
    >
      <div className="mx-auto max-w-6xl">
        {/* Product heading */}
        <div className="mb-10 flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <div className="mb-3 font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--marigold)]">
              Inside the studio
            </div>

            <h2
              className="text-3xl md:text-5xl"
              style={{
                color: tokens.textPrimary,
                fontFamily: "'Archivo Black', var(--font-display), sans-serif",
              }}
            >
              One photo in.
              <br />
              Everything you need out.
            </h2>

            <p
              className="mt-4 max-w-xl text-base leading-relaxed md:text-lg"
              style={{ color: tokens.textMuted }}
            >
              No templates to scroll through. INRASTUDIO builds the first draft
              for you, then leaves the final decision in your hands.
            </p>
          </div>

          <Link
            href="/signup"
            className="hidden shrink-0 items-center gap-2 border px-4 py-3 font-mono text-[10px] uppercase tracking-widest transition-colors hover:border-[var(--marigold)] hover:text-[var(--marigold)] md:flex"
            style={{ borderColor: tokens.rule, color: tokens.textPrimary }}
          >
            Try the studio
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {/* Actual product/output area — a screenshot mockup, kept constant */}
        <div className="border border-[#F2EEE2]/15 bg-[#0c0a08] p-2 shadow-[8px_8px_0_0_rgba(0,0,0,0.25)]">
          {/* Fake studio toolbar */}
          <div className="flex flex-col gap-2 border-b border-[#F2EEE2]/10 px-3 py-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4 font-mono text-[9px] uppercase tracking-widest">
              <span className="text-[#FFC629]">Output</span>
              <span className="text-[#A79A82]">Flyer</span>
              <span className="text-[#A79A82]">Video</span>
              <span className="text-[#A79A82]">Captions</span>
            </div>

            <div className="font-mono text-[9px] uppercase tracking-widest text-[#A79A82]">
              Draft generated
            </div>
          </div>

          <div className="grid grid-cols-1 gap-2 p-2 md:grid-cols-[1fr_1fr_0.8fr]">
            {/* Flyer — now shows the 940c… image */}
            <div className="overflow-hidden border border-[#F2EEE2]/10 bg-black/20">
              <div className={`relative ${IG_ASPECT}`}>
                <Image
                  src="/images/940c038f-3019-49a3-b115-83f2953cde21.png"
                  alt="Generated flyer"
                  fill
                  loading="lazy"
                  sizes="(max-width: 768px) 100vw, 34vw"
                  className="object-cover"
                />
              </div>

              <div className="flex items-center justify-between border-t border-[#F2EEE2]/10 px-4 py-3">
                <span className="font-mono text-[10px] uppercase tracking-widest text-[#F2EEE2]">
                  Flyer
                </span>

                <span className="font-mono text-[9px] text-[#A79A82]">
                  1080 × 1350
                </span>
              </div>
            </div>

            {/* Video — loops automatically (autoPlay + loop + muted + playsInline in FadeInVideo) */}
            <div className="overflow-hidden border border-[#F2EEE2]/10 bg-black/20">
              <div className={`relative ${IG_ASPECT}`}>
                <VideoCard
                  src="/videos/promo-ig (7).mp4"
                  poster="/images/940c038f-3019-49a3-b115-83f2953cde21.png"
                  className="object-cover"
                />
              </div>

              <div className="flex items-center justify-between border-t border-[#F2EEE2]/10 px-4 py-3">
                <span className="font-mono text-[10px] uppercase tracking-widest text-[#F2EEE2]">
                  Video
                </span>

                <span className="font-mono text-[9px] text-[#A79A82]">
                  1080 × 1350
                </span>
              </div>
            </div>

            {/* Captions — text removed; now shows the 322a… image that
                used to be in the flyer slot */}
            <div className="overflow-hidden border border-[#F2EEE2]/10 bg-black/20">
              <div className={`relative ${IG_ASPECT}`}>
                <Image
                  src="/images/322a5f2f-385f-43ad-a7d2-81fbc44861c8.png"
                  alt="Caption preview"
                  fill
                  loading="lazy"
                  sizes="(max-width: 768px) 100vw, 27vw"
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Mobile CTA */}
        <div className="mt-5 md:hidden">
          <Link
            href="/signup"
            className="flex w-full items-center justify-center gap-2 bg-[var(--marigold)] px-6 py-4 font-bold text-[#15130F]"
          >
            Try the studio
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

// ─── Video demo ─────────────────────────────────────────────────────────────

function VideoDemo() {
  const { tokens } = useTheme();
  const wrapRef = useRef<HTMLDivElement>(null);
  const inView = useInView(wrapRef, {
    once: true,
    margin: "150px",
  });

  return (
    <section id="demo" className="mx-auto max-w-5xl px-6 py-16 md:py-20" ref={wrapRef}>
      <div className="mb-8 text-center">
        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--marigold)]">
          See it happen
        </span>

        <h2
          className="mt-2 text-3xl md:text-5xl"
          style={{
            color: tokens.textPrimary,
            fontFamily: "'Archivo Black', var(--font-display), sans-serif",
          }}
        >
          Watch the whole thing happen
        </h2>

        <p className="mx-auto mt-3 max-w-2xl text-base md:text-lg" style={{ color: tokens.textMuted }}>
          Two minutes, start to finish — from a phone photo to a finished post.
        </p>
      </div>

      {/* Video player chrome stays black in both themes, like any video
          player — this is a media surface, not page chrome. */}
      <div className="group relative flex aspect-video w-full cursor-pointer items-center justify-center overflow-hidden border-2 border-[#F2EEE2]/20 bg-[#0f0d0a]">
        {inView && (
          <Image
            src="https://picsum.photos/seed/apppreview/1200/675"
            fill
            loading="lazy"
            sizes="(max-width: 1024px) 100vw, 1024px"
            className="object-cover opacity-60 transition-opacity duration-700 group-hover:opacity-80"
            alt="Still frame from the walkthrough video"
          />
        )}

        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#FFC629] shadow-[4px_4px_0_0_rgba(0,0,0,0.4)] transition-transform duration-300 group-hover:scale-110 md:h-20 md:w-20">
            <Play className="ml-1 h-7 w-7 fill-[#15130F] text-[#15130F] md:h-8 md:w-8" />
          </div>
        </div>

        <div className="pointer-events-none absolute bottom-4 left-0 right-0 flex justify-center gap-2 px-4 font-mono text-[9px] uppercase tracking-widest md:bottom-6 md:gap-3 md:text-xs">
          <span className="bg-[#15130F] px-2 py-1.5 text-[#FFC629] md:px-3 md:py-2">
            1. Upload
          </span>

          <span className="bg-[#15130F] px-2 py-1.5 text-[#F2EEE2] md:px-3 md:py-2">
            2. Generate
          </span>

          <span className="bg-[#15130F] px-2 py-1.5 text-[#F2EEE2] md:px-3 md:py-2">
            3. Download
          </span>
        </div>
      </div>
    </section>
  );
}

// ─── Testimonials ───────────────────────────────────────────────────────────
// The clippings are the other "paper, not screenshot" surface — same
// tokens.paper / var(--ink) treatment as HowItWorks.

function Testimonials() {
  const { tokens } = useTheme();
  const reviews = [
    {
      name: "Chukwudi N.",
      location: "Nigeria",
      stars: 5,
      text: "I was paying ten thousand naira a flyer before this. Now I do it myself between customers. The captions sometimes need a small edit, but that's it.",
    },
    {
      name: "Amara S.",
      location: "Ghana",
      stars: 4,
      text: "Video isn't the sharpest on a big screen, but for WhatsApp Status it's more than good enough. Saves me real time.",
    },
    {
      name: "Kwame K.",
      location: "Kenya",
      stars: 5,
      text: "Uploaded a photo taken with a torch at night and it still came out looking decent. Didn't expect that.",
    },
    {
      name: "Sarah M.",
      location: "USA",
      stars: 5,
      text: "I've used it for two collection launches now. Customers ask if I hired a photographer.",
    },
    {
      name: "Tomiwa A.",
      location: "Morocco",
      stars: 5,
      text: "I do property listings. Once I added my agency logo, it carried over on every flyer automatically. Clients take it more seriously now.",
    },
  ];

  const carouselRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    if (carouselRef.current) {
      setWidth(carouselRef.current.scrollWidth - carouselRef.current.offsetWidth);
    }
  }, []);

  return (
    <section
      className="border-t py-20 md:py-24 transition-colors duration-300"
      style={{ borderColor: tokens.rule, background: tokens.ink }}
    >
      <div className="mx-auto w-full max-w-7xl">
        <div className="mb-9 px-6">
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--marigold)]">
            Proof from sellers
          </span>

          <h2
            className="mt-2 text-3xl md:text-4xl"
            style={{
              color: tokens.textPrimary,
              fontFamily: "'Archivo Black', var(--font-display), sans-serif",
            }}
          >
            What sellers say, unedited
          </h2>
        </div>

        <div
          ref={carouselRef}
          className="w-full cursor-grab overflow-hidden px-6 active:cursor-grabbing"
        >
          <motion.div
            drag="x"
            dragConstraints={{
              right: 0,
              left: -width,
            }}
            className="flex w-max gap-5 pb-6"
          >
            {reviews.map((review) => (
              <div
                key={review.name}
                className="pointer-events-none flex w-[290px] flex-col justify-between p-6 shadow-[6px_6px_0_0_rgba(0,0,0,0.3)] md:w-[340px]"
                style={{ background: "var(--paper)" }}
              >
                <p className="mb-6 font-mono text-[13px] leading-relaxed text-[var(--ink)]/90">
                  {review.text}
                </p>

                <div className="flex items-center justify-between border-t border-dashed border-[var(--ink)]/30 pt-4 font-mono text-[11px] uppercase tracking-widest text-[var(--ink)]/70">
                  <div>
                    <p className="font-bold text-[var(--ink)]">{review.name}</p>
                    <p>{review.location}</p>
                  </div>

                  <div className="flex gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-3 w-3 ${
                          i < review.stars
                            ? "fill-[var(--signal)] text-[var(--signal)]"
                            : "text-[var(--ink)]/20"
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ─── FAQ ────────────────────────────────────────────────────────────────────

function FAQ() {
  const { tokens } = useTheme();
  const faqs = [
    {
      q: "My photos are taken on an ordinary phone, not a proper camera. Does that matter?",
      a: "Not much. Most sellers upload photos taken indoors on a mid-range Android phone. It works fine — it just won't rescue a badly blurred shot.",
    },
    {
      q: "Does this use a lot of data?",
      a: "Uploading a photo is small. Downloading the video is the heaviest part, usually a few megabytes. You can generate on Wi-Fi and download later if data's tight.",
    },
    {
      q: "Can I edit the caption before I post it?",
      a: "Yes. Treat what's generated as a first draft — most people change a line or two before sending it.",
    },
    {
      q: "Can I add my own logo?",
      a: "Yes — upload it once and drag it into place on your flyer. Resize it however you like, and it carries over automatically across formats.",
    },
    {
      q: "What if I don't like the result?",
      a: "Editing text, colour or your logo updates instantly, no regenerating needed. You only need to regenerate if you want to swap the product photo itself.",
    },
  ];

  return (
    <section
      id="resources"
      className="mx-auto max-w-3xl border-t px-6 py-20 md:py-24 transition-colors duration-300"
      style={{ borderColor: tokens.rule }}
    >
      <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--marigold)]">
        FAQ
      </span>

      <h2
        className="mt-2 mb-8 text-3xl md:text-4xl"
        style={{
          color: tokens.textPrimary,
          fontFamily: "'Archivo Black', var(--font-display), sans-serif",
        }}
      >
        Questions people actually ask
      </h2>

      <div>
        {faqs.map((faq, i) => (
          <div
            key={faq.q}
            className="py-5"
            style={i > 0 ? { borderTop: `1px solid ${tokens.rule}` } : undefined}
          >
            <h3 className="mb-2 text-base font-semibold" style={{ color: tokens.textPrimary }}>
              {faq.q}
            </h3>

            <p className="text-[15px] leading-relaxed" style={{ color: tokens.textMuted }}>
              {faq.a}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

// ─── Final CTA ──────────────────────────────────────────────────────────────

function CallToAction() {
  const { tokens } = useTheme();
  return (
    <section className="mx-auto max-w-7xl px-6 py-8 md:py-12">
      <div
        className="relative w-full overflow-hidden border-2 shadow-[10px_10px_0_0_rgba(255,198,41,0.25)] transition-colors duration-300"
        style={{ borderColor: tokens.textPrimary, background: tokens.ink }}
      >
        <div className="relative z-10 flex flex-col items-center gap-8 p-8 md:flex-row md:gap-12 md:p-16">
          <div className="flex-1 text-center md:text-left">
            <h2
              className="mb-7 text-4xl leading-[1.05] md:text-6xl"
              style={{
                color: tokens.textPrimary,
                fontFamily: "'Archivo Black', var(--font-display), sans-serif",
              }}
            >
              Your next flyer starts with whatever's on your phone right now.
            </h2>

            <Link
              href="/signup"
              className="inline-flex items-center gap-2 bg-[var(--marigold)] px-9 py-4 text-lg font-bold text-[#15130F] shadow-[4px_4px_0_0_rgba(0,0,0,0.4)] transition-transform hover:-translate-y-0.5 active:translate-y-0"
            >
              Start free trial
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>

          <div className="relative w-full max-w-sm shrink-0 md:max-w-[330px]">
            <Image
              src="/images/flyer-1784810176714.png"
              alt="Sample flyer generated by Inrastudio"
              width={360}
              height={360}
              loading="lazy"
              sizes="(max-width: 768px) 90vw, 330px"
              className="h-full w-full object-contain"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Footer ─────────────────────────────────────────────────────────────────
// Rebuilt to match the same footer pattern used on the Contact page: a big
// typographic statement + subtext, a Connect/Read two-column nav, and a
// baseline row with the logo and copyright. Only the wording changed here —
// swapped the contact page's "MAKE IT NOTICE." pitch for the homepage's own
// "we're software, not a design agency" message. Tokens are read directly
// via useTheme(), same as the Contact page does, rather than the
// var(--token) CSS-custom-property approach used elsewhere on this page —
// no hover color-swaps are needed here (opacity handles hover instead), so
// there's nothing that requires the CSS-var indirection.

function Footer() {
  const { tokens } = useTheme();
  const { ink, rule, paper, paperMuted, marigold, textMuted } = tokens;

  return (
    <footer
      className="w-full border-t transition-colors duration-300"
      style={{ background: ink, borderColor: rule }}
    >
      <div className="mx-auto max-w-[1180px] px-5 pb-8 pt-12 sm:px-8 sm:pt-16">
        {/* Footer intro — the big statement */}
        <div className="grid grid-cols-1 gap-10 pb-14 lg:grid-cols-[1.3fr_0.7fr] lg:gap-20 lg:pb-16">
          <div>
            <div
              className="mb-5 font-mono text-[9px] tracking-[0.2em]"
              style={{ color: textMuted }}
            >
              INRASTUDIO / 2026
            </div>

            <h2
              className="text-[clamp(2.6rem,7vw,5.5rem)] leading-[0.92] tracking-[-0.045em]"
              style={{
                color: paper,
                fontFamily: "'Archivo Black', var(--font-display), sans-serif",
              }}
            >
              WE&apos;RE
              <br />
              <span style={{ color: marigold }}>SOFTWARE.</span>
            </h2>
          </div>

          <div className="lg:pt-6">
            <p
              className="max-w-md text-xl leading-[1.3] tracking-[-0.01em] sm:text-2xl"
              style={{ color: paperMuted }}
            >
              Not a design agency. Give it one photo and it hands back a
              flyer, five captions and a video — no brief, no back-and-forth.
            </p>
          </div>
        </div>

        {/* Footer navigation */}
        <div
          className="grid grid-cols-1 gap-8 border-b border-t py-7 sm:grid-cols-2 sm:py-8"
          style={{ borderColor: rule }}
        >
          {/* Connect */}
          <div>
            <p
              className="mb-4 font-mono text-[9px] tracking-[0.18em]"
              style={{ color: textMuted }}
            >
              (01) CONNECT
            </p>

            <div className="flex flex-col gap-2.5">
              <a
                href="#"
                className="group flex items-center gap-2 text-base transition-opacity hover:opacity-70"
                style={{ color: paper }}
              >
                <Instagram className="h-4 w-4" />
                Instagram
                <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>

              <a
                href="#"
                className="group flex items-center gap-2 text-base transition-opacity hover:opacity-70"
                style={{ color: paper }}
              >
                <span className="flex h-4 w-4 items-center justify-center text-[11px] font-bold">
                  ♪
                </span>
                TikTok
                <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>

              <a
                href="mailto:somtohgist@gmail.com"
                className="group flex items-center gap-2 text-base transition-opacity hover:opacity-70"
                style={{ color: paper }}
              >
                <Mail className="h-4 w-4" />
                Support
                <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
            </div>
          </div>

          {/* Read */}
          <div>
            <p
              className="mb-4 font-mono text-[9px] tracking-[0.18em]"
              style={{ color: textMuted }}
            >
              (02) READ
            </p>

            <div className="flex flex-col gap-2.5">
              <Link
                href="/privacy"
                className="text-base transition-opacity hover:opacity-70"
                style={{ color: paper }}
              >
                Privacy Policy
              </Link>

              <Link
                href="/terms"
                className="text-base transition-opacity hover:opacity-70"
                style={{ color: paper }}
              >
                Terms & Conditions
              </Link>

              <Link
                href="/disclosure"
                className="text-base transition-opacity hover:opacity-70"
                style={{ color: paper }}
              >
                Disclosure
              </Link>
            </div>
          </div>
        </div>

        {/* Baseline */}
        <div className="flex flex-col items-start justify-between gap-4 pt-6 sm:flex-row sm:items-center">
          <div className="flex items-center gap-3">
            <Logo size="sm" className="h-8 w-8" />
            <span
              className="font-mono text-[9px] tracking-[0.16em]"
              style={{ color: textMuted }}
            >
              INRASTUDIO
            </span>
          </div>

          <p
            className="font-mono text-[9px] tracking-[0.08em]"
            style={{ color: textMuted }}
          >
            © 2026 INRASTUDIO AI MARKETING STUDIO. MADE IN LAGOS.
          </p>
        </div>
      </div>
    </footer>
  );
}

// ─── Main export ────────────────────────────────────────────────────────────

function LandingPageInner() {
  const { tokens } = useTheme();

  return (
    <div
      suppressHydrationWarning
      className="relative min-h-screen overflow-x-hidden font-sans transition-colors duration-300 selection:bg-[var(--marigold)] selection:text-[#15130F]"
      style={
        {
          background: tokens.ink,
          color: tokens.textPrimary,
          // Expose every theme token as a CSS custom property so Tailwind
          // arbitrary-value classes (including hover:) can read live theme
          // values throughout the tree — inline `style` alone can't
          // express hover states.
          "--ink": tokens.ink,
          "--panel": tokens.panel,
          "--panelSoft": tokens.panelSoft,
          "--rule": tokens.rule,
          "--paper": tokens.paper,
          "--paperMuted": tokens.paperMuted,
          "--marigold": tokens.marigold,
          "--signal": tokens.signal,
          "--textPrimary": tokens.textPrimary,
          "--textMuted": tokens.textMuted,
        } as React.CSSProperties
      }
    >
      <style jsx global>{`
        @import url("https://fonts.googleapis.com/css2?family=Archivo+Black&family=IBM+Plex+Mono:wght@400;600&display=swap");

        .font-mono {
          font-family: "IBM Plex Mono", ui-monospace, monospace;
        }
      `}</style>

      {/* Theme toggle removed here — the navbar/layout already owns theme
          switching, so this page no longer renders its own floating control. */}
      <Navbar />

      <main>
        <Hero />
        <StatsBar />
        <WhoItsFor />
        <HowItWorks />
        <Workflow />
        <VideoDemo />
        <Testimonials />
        <FAQ />
        <CallToAction />
      </main>

      <Footer />
    </div>
  );
}

export default function LandingPage() {
  // No local ThemeProvider here on purpose — the root layout already wraps
  // the whole app in one (via providers.tsx -> lib/theme), which now
  // defaults to "light" itself. A second, nested provider here would create
  // an independent context/localStorage sync from every other page's
  // Navbar, which is exactly the kind of drift that causes hydration
  // mismatches like the one you just hit on /contact.
  return <LandingPageInner />;
}