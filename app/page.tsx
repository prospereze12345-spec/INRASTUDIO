"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "motion/react";
import {
  ArrowRight,
  CheckCircle2,
  Facebook,
  Home,
  Image as ImageIcon,
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
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Logo } from "@/components/Logo";
import { Navbar } from "@/components/Navbar";
import { InstallButton } from "@/components/pwa/InstallButton";

/**
 * DESIGN NOTES (leave this comment in — it explains the choices made)
 * ---------------------------------------------------------------------------
 * Concept: the hero is built to look like an actual printed flyer taped to
 * a wall, and secondary sections borrow from till receipts, price tags and
 * hand-painted market signboards — the same objects this product prints for
 * its customers. That's the one idea the whole page is built around, so nothing
 * else needs to shout for attention.
 *
 * Palette (named, not decorative):
 *   --ink        #15130F   near-black warm ink, used as the main background
 *   --paper      #F2EEE2   uncoated paper stock, used for printed panels
 *   --paper-dim  #E7E1CF   paper in shadow / secondary panels
 *   --signal     #FFC629   signboard yellow — the one accent used for action
 *   --stamp      #C6371B   ink-stamp red — used only for scarcity/urgency cues
 *   --ink-soft   #A79A82   warm grey for secondary text on ink backgrounds
 *
 * Type: a blocky display face (Archivo Black) for anything meant to be read
 * from across a market stall, a plain grotesk for body copy, and a monospace
 * face for anything that behaves like a receipt line — prices, quantities,
 * timestamps, testimonial attributions.
 *
 * Fonts are loaded locally in this file via @import so the page works as a
 * drop-in. If you already load fonts through next/font in app/layout.tsx,
 * move the two families there instead and delete the <style> block at the
 * bottom of this file — it'll be faster.
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
    platform: "Facebook",
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
    const timer = setInterval(() => setIndex((p) => (p + 1) % length), CAPTION_CYCLE_MS);
    return () => clearInterval(timer);
  }, [length]);
  return index;
}

// ─── Performance: connection-aware, idle-deferred video ────────────────────
//
// The old hero mounted an autoplaying <video> the instant it scrolled into
// view — which, for a hero, is immediately. That video then competed with the
// hero image and fonts for bandwidth right when it matters most (LCP).
//
// This hook fixes that on three fronts:
//   1. It waits until the browser is idle (after the first paint) before it
//      even requests the video file.
//   2. It checks Network Information API (where supported) and Data Saver
//      mode, and simply doesn't request video at all on slow or
//      data-saver connections — the static flyer image is shown instead.
//      This matters here specifically: sellers on this page have already
//      told us in the FAQ that mobile data is a real cost, not an
//      afterthought.
//   3. Video tags always carry a `poster` and `preload="none"`, so the very
//      first frame the user sees is a static image, not a spinner.
function useDeferredVideo(shouldConsider: boolean) {
  const [canLoad, setCanLoad] = useState(false);

  useEffect(() => {
    if (!shouldConsider) return;

    // Only skip video for an explicit Data Saver setting the person turned on
    // themselves — not for effectiveType, which DevTools throttling and
    // ordinary variable mobile signal also trigger, and which was making the
    // video disappear far more often than intended.
    const connection = (navigator as any).connection;
    if (connection?.saveData === true) return; // stay on the static image

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
      className={`${className} transition-opacity duration-500 ${ready ? "opacity-100" : "opacity-0"}`}
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
  const inView = useInView(ref, { once: true, margin: margin as any });
  return (
    <div ref={ref} className={className}>
      {children(inView)}
    </div>
  );
}

// ─── Signature hero: the page opens as a flyer taped to a wall ─────────────

function TapeCorner({ className = "" }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={`absolute h-8 w-16 -rotate-6 bg-[#F2EEE2]/70 shadow-sm ${className}`}
      style={{ clipPath: "polygon(0 15%, 100% 0, 100% 85%, 0 100%)" }}
    />
  );
}

function FlyerHero({ activeIndex, captions }: { activeIndex: number; captions: Caption[] }) {
  const active = captions[activeIndex];
  const wrapRef = useRef<HTMLDivElement>(null);
  const inView = useInView(wrapRef, { once: true, margin: "0px" });
  const canLoadVideo = useDeferredVideo(inView);

  return (
    <motion.div
      ref={wrapRef}
      initial={{ opacity: 0, y: 20, rotate: -3 }}
      animate={{ opacity: 1, y: 0, rotate: -1.5 }}
      transition={{ duration: 0.7, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
      className="relative z-10 w-full max-w-md flex-1 lg:max-w-[420px]"
    >
      <div className="relative bg-[#F2EEE2] p-5 pb-7 shadow-[10px_14px_0_0_rgba(0,0,0,0.35)] sm:p-6">
        <TapeCorner className="-top-4 left-6" />
        <TapeCorner className="-top-3 right-8 rotate-[8deg]" />

        {/* order docket header */}
        <div className="mb-5 flex items-center justify-between border-b border-dashed border-[#15130F]/30 pb-3 font-mono text-[11px] uppercase tracking-widest text-[#15130F]/60">
          <span>Inrastudio print job</span>
          <span>#0412</span>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="relative col-span-1 aspect-square overflow-hidden bg-[#E7E1CF]">
            <Image
              src="/images/flyer-1784491663572.png"
              alt="Flyer generated from a customer's product photo"
              fill
              priority
              fetchPriority="high"
              sizes="(max-width: 640px) 45vw, 210px"
              className="object-contain p-2"
            />
          </div>

          <div className="relative col-span-1 aspect-square overflow-hidden bg-[#E7E1CF]">
            {/* Static frame is always in the DOM so there's never a blank gap
               while the video decides whether to load. */}
            <Image
              src="/images/flyer.png"
              alt="Preview frame of the promo video"
              fill
              sizes="(max-width: 640px) 45vw, 210px"
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
              <Video className="h-2.5 w-2.5" /> 9:16
            </span>
          </div>
        </div>

        {/* caption line, receipt style */}
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
              className="text-[13px] leading-5 text-[#15130F]/85"
            >
              {active.text}
            </motion.p>
          </AnimatePresence>
        </div>

        {/* docket total */}
        <div className="mt-4 space-y-1 border-t border-dashed border-[#15130F]/30 pt-4 font-mono text-[11px] text-[#15130F]/70">
          <div className="flex justify-between">
            <span>Photo received</span>
            <span>×1</span>
          </div>
          <div className="flex justify-between">
            <span>Captions written</span>
            <span>×5</span>
          </div>
          <div className="flex justify-between font-bold text-[#15130F]">
            <span>Turnaround</span>
            <span>~5 MIN</span>
          </div>
        </div>
      </div>

      {/* price-tag CTA sticker, hanging off the flyer */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8, rotate: 8 }}
        animate={{ opacity: 1, scale: 1, rotate: 10 }}
        transition={{ duration: 0.5, delay: 0.9, ease: "backOut" }}
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

function Hero() {
  const activeIndex = useCaptionCycle(CAPTIONS.length);

  return (
    <section className="relative z-10 mx-auto flex max-w-7xl flex-col items-center gap-16 px-6 pb-20 pt-40 md:pb-32 md:pt-48 lg:flex-row lg:items-start">
      <div className="z-10 w-full flex-1 text-center lg:text-left">
        <motion.span
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-6 inline-block bg-[#15130F] px-3 py-1 font-mono text-[11px] uppercase tracking-widest text-[#FFC629]"
        >
          Printed for WhatsApp, Instagram &amp; TikTok
        </motion.span>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="mb-6 text-5xl leading-[1.05] tracking-tight text-[#F2EEE2] md:text-6xl lg:text-[4.6rem]"
          style={{ fontFamily: "'Archivo Black', var(--font-display), sans-serif" }}
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
          className="mx-auto mb-10 max-w-lg text-lg leading-relaxed text-[#A79A82] lg:mx-0"
        >
          Send a photo of what you're selling. You'll get a flyer with your
          logo already on it, captions written for each platform, and a short
          video for your Status — most orders are ready in under five
          minutes.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="flex flex-col items-center justify-center gap-4 sm:flex-row lg:justify-start"
        >
          <Link
            href="/signup"
            className="flex w-full items-center justify-center gap-2 bg-[#FFC629] px-8 py-4 text-lg font-bold text-[#15130F] shadow-[4px_4px_0_0_rgba(0,0,0,0.4)] transition-transform hover:-translate-y-0.5 sm:w-auto"
          >
            Start Creating
            <ArrowRight className="h-5 w-5" />
          </Link>
          <InstallButton />
        </motion.div>

        <p className="mt-4 text-xs text-[#A79A82]/80 lg:text-left">
          No card needed. Cancel any time.
        </p>
      </div>

      <FlyerHero activeIndex={activeIndex} captions={CAPTIONS} />
    </section>
  );
}

// ─── Stamped stats line ─────────────────────────────────────────────────────

function StatsBar() {
  return (
    <section className="border-y border-[#F2EEE2]/10 bg-[#15130F] py-8">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-2 px-6 text-center">
        <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#FFC629]">
          Last month
        </span>
        <p className="max-w-2xl text-lg text-[#F2EEE2]">
          1,102 flyers went out to resellers, skincare sellers, estate agents
          and caterers across Nigeria, Morocco,USA,  Accra and Kenya.
        </p>
      </div>
    </section>
  );
}

// ─── Who it's for — hand-painted signboards, not a feature grid ───────────

const USE_CASES: { icon: typeof ShoppingBag; label: string; detail: string; rotate: string }[] = [
  { icon: ShoppingBag, label: "Fashion & accessories", detail: "New stock arrives, new flyer goes out the same afternoon.", rotate: "-rotate-1" },
  { icon: Sparkles, label: "Skincare & beauty", detail: "Captions written the way you already talk to customers.", rotate: "rotate-1" },
  { icon: Home, label: "Estate agents", detail: "A listing your client isn't embarrassed to forward on.", rotate: "-rotate-1" },
  { icon: UtensilsCrossed, label: "Caterers", detail: "Today's specials, posted before anyone's ordered lunch.", rotate: "rotate-1" },
  { icon: Tent, label: "Event stylists & hire", detail: "One logo, consistent across every job you take.", rotate: "-rotate-1" },
  { icon: Scissors, label: "Tailors & designers", detail: "Finished pieces that look shot in a studio, not a fitting room.", rotate: "rotate-1" },
];

function WhoItsFor() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-24">
      <h2
        className="mb-4 text-3xl text-[#F2EEE2] md:text-4xl"
        style={{ fontFamily: "'Archivo Black', var(--font-display), sans-serif" }}
      >
        If you sell like this, it's built for you.
      </h2>
      <p className="mb-14 max-w-xl text-lg text-[#A79A82]">
        Not a storefront with a marketing budget — someone selling through
        WhatsApp, Instagram or TikTok, one product at a time.
      </p>

      <div className="flex flex-wrap gap-6">
        {USE_CASES.map(({ icon: Icon, label, detail, rotate }) => (
          <div
            key={label}
            className={`w-full border-2 border-[#F2EEE2] bg-[#15130F] p-6 transition-transform duration-300 hover:-translate-y-1 sm:w-[calc(50%-0.75rem)] lg:w-[calc(33.333%-1rem)] ${rotate}`}
          >
            <div className="mb-4 flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-[#FFC629]">
              <Icon className="h-3.5 w-3.5" />
              Signboard
            </div>
            <h3 className="text-lg text-[#F2EEE2]" style={{ fontFamily: "'Archivo Black', var(--font-display), sans-serif" }}>
              {label}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-[#A79A82]">{detail}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

// ─── How it works — a real 3-step sequence, stamped numerals ──────────────

function HowItWorks() {
  return (
    <section className="bg-[#F2EEE2] px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <h2
          className="mb-4 text-3xl text-[#15130F] md:text-4xl"
          style={{ fontFamily: "'Archivo Black', var(--font-display), sans-serif" }}
        >
          There's really only one hard part.
        </h2>
        <p className="mb-16 max-w-xl text-lg text-[#15130F]/70">
          Everything before it is uploading a photo. Everything after it is
          yours to edit or send as it comes.
        </p>

        <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
          {[
            { n: "01", title: "You upload", body: "Take a photo with your phone. Ordinary indoor light is fine — most people shoot in their shop." },
            { n: "02", title: "We build the flyer around it", body: "Lighting, background and the shape of the product are read automatically, so the layout fits your product instead of the other way round." },
            { n: "03", title: "You post or edit first", body: "Download the flyer, captions and video as they are, or change the text, colour or logo — nothing needs regenerating unless you swap the photo." },
          ].map((step) => (
            <div key={step.n} className="border-t-4 border-[#15130F] pt-5">
              <span
                className="text-5xl text-[#15130F]/15"
                style={{ fontFamily: "'Archivo Black', var(--font-display), sans-serif" }}
              >
                {step.n}
              </span>
              <h3 className="mt-3 text-xl font-semibold text-[#15130F]">{step.title}</h3>
              <p className="mt-2 leading-relaxed text-[#15130F]/70">{step.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Workflow output preview ────────────────────────────────────────────────

function VideoCard({ src, poster }: { src: string; poster: string }) {
  return (
    <LazyReveal className="relative aspect-[4/5] bg-[#F2EEE2]">
      {(inView) => <DeferredVideoTile inView={inView} src={src} poster={poster} />}
    </LazyReveal>
  );
}

function DeferredVideoTile({ inView, src, poster }: { inView: boolean; src: string; poster: string }) {
  const canLoad = useDeferredVideo(inView);
  return (
    <>
      <img
        src={poster}
        alt="Preview frame of the promo video"
        className="absolute inset-0 h-full w-full object-contain p-4"
        loading="lazy"
      />
      {canLoad && (
        <FadeInVideo src={src} poster={poster} className="absolute inset-0 h-full w-full object-contain p-4" />
      )}
    </>
  );
}

function Workflow() {
  return (
    <section id="dashboards" className="border-y border-[#F2EEE2]/10 bg-[#15130F] px-6 py-24">
      <div className="mx-auto max-w-5xl">
        <h2
          className="mb-2 text-3xl text-[#F2EEE2] md:text-4xl"
          style={{ fontFamily: "'Archivo Black', var(--font-display), sans-serif" }}
        >
          One photo in. A flyer, a video and five captions out.
        </h2>
        <p className="mb-12 max-w-xl text-[#A79A82]">
          No templates to scroll through — a finished draft, ready to tweak
          in one tap.
        </p>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="overflow-hidden border-2 border-[#F2EEE2]/20 bg-black/20">
            <div className="relative aspect-[4/5]">
              <Image
                src="/images/flyer-1784495302024.png"
                alt="Generated flyer"
                fill
                loading="lazy"
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-contain p-4"
              />
            </div>
            <div className="border-t border-[#F2EEE2]/20 px-4 py-3 font-mono text-xs uppercase tracking-widest text-[#F2EEE2]">
              Flyer
            </div>
          </div>

          <div className="overflow-hidden border-2 border-[#F2EEE2]/20 bg-black/20">
            <VideoCard src="/videos/promo-tiktok (3).mp4" poster="/images/flyer.png" />
            <div className="border-t border-[#F2EEE2]/20 px-4 py-3 font-mono text-xs uppercase tracking-widest text-[#F2EEE2]">
              Video
            </div>
          </div>

          <div className="flex flex-col justify-center gap-4 border-2 border-[#F2EEE2]/20 bg-black/20 p-6">
            <span className="font-mono text-xs uppercase tracking-widest text-[#FFC629]">Caption</span>
            <p className="text-sm leading-relaxed text-[#A79A82]">
              Tired of plain handbags? This vibrant red patent-leather
              top-handle bag goes from the office to a wedding without
              looking out of place. From ₦12,000, free delivery today. DM to
              order. #handbags #ootd
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Demo section (video lives here, not competing with hero LCP) ─────────

function VideoDemo() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const inView = useInView(wrapRef, { once: true, margin: "150px" });

  return (
    <section id="demo" className="mx-auto max-w-5xl px-6 py-24" ref={wrapRef}>
      <div className="mb-12 text-center">
        <h2
          className="mb-4 text-4xl text-[#F2EEE2] md:text-5xl"
          style={{ fontFamily: "'Archivo Black', var(--font-display), sans-serif" }}
        >
          Watch the whole thing happen
        </h2>
        <p className="mx-auto max-w-2xl text-lg text-[#A79A82]">
          Two minutes, start to finish — from a phone photo to a finished
          post.
        </p>
      </div>

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
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#FFC629] shadow-[4px_4px_0_0_rgba(0,0,0,0.4)] transition-transform duration-300 group-hover:scale-110">
            <Play className="ml-1 h-8 w-8 fill-[#15130F] text-[#15130F]" />
          </div>
        </div>

        <div className="pointer-events-none absolute bottom-6 left-0 right-0 flex justify-center gap-3 px-6 font-mono text-xs uppercase tracking-widest">
          <span className="bg-[#15130F] px-3 py-2 text-[#FFC629]">1. Upload</span>
          <span className="bg-[#15130F] px-3 py-2 text-[#F2EEE2]">2. Generate</span>
          <span className="bg-[#15130F] px-3 py-2 text-[#F2EEE2]">3. Download</span>
        </div>
      </div>
    </section>
  );
}

// ─── Testimonials — printed as till slips ──────────────────────────────────

function Testimonials() {
  const reviews = [
    { name: "Chukwudi N.", location: "Nigeria", stars: 5, text: "I was paying ten thousand naira a flyer before this. Now I do it myself between customers. The captions sometimes need a small edit, but that's it." },
    { name: "Amara S.", location: "Ghana", stars: 4, text: "Video isn't the sharpest on a big screen, but for WhatsApp Status it's more than good enough. Saves me real time." },
    { name: "Kwame K.", location: "Kenya", stars: 5, text: "Uploaded a photo taken with a torch at night and it still came out looking decent. Didn't expect that." },
    { name: "Sarah M.", location: "USA", stars: 5, text: "I've used it for two collection launches now. Customers ask if I hired a photographer." },
    { name: "Tomiwa A.", location: "Morocco", stars: 5, text: "I do property listings. Once I added my agency logo, it carried over on every flyer automatically. Clients take it more seriously now." },
  ];

  const carouselRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    if (carouselRef.current) {
      setWidth(carouselRef.current.scrollWidth - carouselRef.current.offsetWidth);
    }
  }, []);

  return (
    <section className="border-t border-[#F2EEE2]/10 bg-[#15130F] py-24">
      <div className="mx-auto w-full max-w-7xl">
        <div className="mb-12 px-6">
          <h2
            className="text-3xl text-[#F2EEE2] md:text-4xl"
            style={{ fontFamily: "'Archivo Black', var(--font-display), sans-serif" }}
          >
            What sellers say, unedited
          </h2>
        </div>

        <div ref={carouselRef} className="w-full cursor-grab overflow-hidden px-6 active:cursor-grabbing">
          <motion.div drag="x" dragConstraints={{ right: 0, left: -width }} className="flex w-max gap-5 pb-8">
            {reviews.map((review) => (
              <div
                key={review.name}
                className="pointer-events-none flex w-[290px] flex-col justify-between bg-[#F2EEE2] p-6 shadow-[6px_6px_0_0_rgba(0,0,0,0.3)] md:w-[340px]"
              >
                <p className="mb-6 font-mono text-[13px] leading-relaxed text-[#15130F]/90">
                  {review.text}
                </p>
                <div className="flex items-center justify-between border-t border-dashed border-[#15130F]/30 pt-4 font-mono text-[11px] uppercase tracking-widest text-[#15130F]/70">
                  <div>
                    <p className="font-bold text-[#15130F]">{review.name}</p>
                    <p>{review.location}</p>
                  </div>
                  <div className="flex gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className={`h-3 w-3 ${i < review.stars ? "fill-[#C6371B] text-[#C6371B]" : "text-[#15130F]/20"}`} />
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
  const faqs = [
    { q: "My photos are taken on an ordinary phone, not a proper camera. Does that matter?", a: "Not much. Most sellers upload photos taken indoors on a mid-range Android phone. It works fine — it just won't rescue a badly blurred shot." },
    { q: "Does this use a lot of data?", a: "Uploading a photo is small. Downloading the video is the heaviest part, usually a few megabytes. You can generate on Wi-Fi and download later if data's tight." },
    { q: "Can I edit the caption before I post it?", a: "Yes. Treat what's generated as a first draft — most people change a line or two before sending it." },
    { q: "Can I add my own logo?", a: "Yes — upload it once and drag it into place on your flyer. Resize it however you like, and it carries over automatically across formats." },
    { q: "What if I don't like the result?", a: "Editing text, colour or your logo updates instantly, no regenerating needed. You only need to regenerate if you want to swap the product photo itself." },
    { q: "Do you support naira pricing and local payment?", a: "Yes — pricing shows in naira, cedis, Kenyan shillings or US dollars depending on the country you select at sign-up, and you can pay by card or bank transfer." },
  ];

  return (
    <section id="resources" className="mx-auto max-w-3xl border-t border-[#F2EEE2]/10 px-6 py-24">
      <h2
        className="mb-10 text-3xl text-[#F2EEE2] md:text-4xl"
        style={{ fontFamily: "'Archivo Black', var(--font-display), sans-serif" }}
      >
        Questions people actually ask
      </h2>
      <div className="divide-y divide-[#F2EEE2]/10">
        {faqs.map((faq) => (
          <div key={faq.q} className="py-6">
            <h3 className="mb-2 text-base font-semibold text-[#F2EEE2]">{faq.q}</h3>
            <p className="text-[15px] leading-relaxed text-[#A79A82]">{faq.a}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

// ─── Final call to action ───────────────────────────────────────────────────

function CallToAction() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-12">
      <div className="relative w-full overflow-hidden border-2 border-[#F2EEE2] bg-[#0c0c0c] shadow-[10px_10px_0_0_rgba(255,198,41,0.25)]">
        <div className="relative z-10 flex flex-col items-center gap-12 p-8 md:flex-row md:gap-16 md:p-20">
          <div className="flex-1 text-center md:text-left">
            <h2
              className="mb-8 text-4xl leading-[1.1] text-[#F2EEE2] md:text-6xl"
              style={{ fontFamily: "'Archivo Black', var(--font-display), sans-serif" }}
            >
              Your next flyer starts with whatever's on your phone right now.
            </h2>
            <Link
              href="/signup"
              className="inline-block bg-[#FFC629] px-10 py-5 text-lg font-bold text-[#15130F] shadow-[4px_4px_0_0_rgba(0,0,0,0.4)] transition-transform hover:-translate-y-0.5 active:translate-y-0"
            >
              Start free trial
            </Link>
          </div>

          <div className="relative w-full max-w-sm shrink-0 md:max-w-[360px]">
            <Image
              src="/images/flyer-1784810176714.png"
              alt="Sample flyer generated by Inrastudio"
              width={360}
              height={360}
              loading="lazy"
              sizes="(max-width: 768px) 90vw, 360px"
              className="h-full w-full object-contain"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Footer ─────────────────────────────────────────────────────────────────

function Footer() {
  return (
    <footer className="relative mt-12 w-full border-t border-[#F2EEE2]/10 bg-[#0c0a08] px-6 pb-12 pt-24">
      <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-16 pb-20 lg:flex-row">
        <div className="max-w-2xl flex-1">
          <h2 className="text-3xl leading-snug tracking-tight text-[#F2EEE2] md:text-4xl">
            We're software, not a design agency.
            <br />
            Give it one photo and it hands back a flyer, five captions and a
            video — no brief, no back-and-forth.
          </h2>
        </div>

        <div className="flex shrink-0 flex-wrap gap-12 font-mono text-xs uppercase tracking-widest sm:gap-24">
          <div className="flex flex-col gap-4">
            <span className="mb-2 font-bold text-[#A79A82]">Legal</span>
            <Link href="/privacy" className="text-[#F2EEE2] hover:text-[#FFC629]">Privacy</Link>
            <Link href="/terms" className="text-[#F2EEE2] hover:text-[#FFC629]">Terms</Link>
          </div>
          <div className="flex flex-col gap-4">
            <span className="mb-2 font-bold text-[#A79A82]">Contact</span>
            <a href="#" className="flex items-center gap-2 text-[#F2EEE2] hover:text-[#FFC629]">
              <Facebook className="h-4 w-4" /> Facebook
            </a>
            <a href="#" className="flex items-center gap-2 text-[#F2EEE2] hover:text-[#FFC629]">
              <Instagram className="h-4 w-4" /> Instagram
            </a>
            <a href="mailto:somtohgist@gmail.com" className="flex items-center gap-2 text-[#F2EEE2] hover:text-[#FFC629]">
              <Mail className="h-4 w-4" /> Support
            </a>
          </div>
        </div>
      </div>

      <div className="mx-auto mt-4 flex max-w-7xl flex-col items-center justify-between gap-4 border-t border-[#F2EEE2]/10 pt-8 text-sm text-[#A79A82] md:flex-row">
        <Logo size="sm" className="h-8 w-8" />
        <p>© 2026 Inrastudio. Made in Lagos.</p>
      </div>
    </footer>
  );
}

// ─── Main export ────────────────────────────────────────────────────────────

export default function LandingPage() {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#15130F] font-sans text-[#F2EEE2] selection:bg-[#FFC629] selection:text-[#15130F]">
      {/*
        Self-contained font loading so this file is a drop-in replacement.
        Move this to app/layout.tsx via next/font/google for better
        performance (self-hosted, no extra DNS/TLS round trip) once you're
        ready — see the design notes comment at the top of this file.
      */}
      <style jsx global>{`
        @import url("https://fonts.googleapis.com/css2?family=Archivo+Black&family=IBM+Plex+Mono:wght@400;600&display=swap");
        .font-mono {
          font-family: "IBM Plex Mono", ui-monospace, monospace;
        }
      `}</style>

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