"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "motion/react";
import { AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  Facebook,
  Image as ImageIcon,
  Instagram,
  LayoutTemplate,
  Play,
  Sparkles,
  Star,
  Type,
  Upload,
  Video,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Logo } from "@/components/Logo"; // uses the rebuilt icon+wordmark Logo component
import { Navbar } from "@/components/Navbar";

// ────────────────────────────────────────────────────────────────────────────
// Everything for this page lives in this one file on purpose: Hero,
// PipelineMockup, Connector, MediaCard, and every section below are local
// helper functions, not exported. Only LandingPage (the default export at
// the bottom) is public — a file may only have ONE `export default`, so none
// of these helpers should ever get their own `export`.
// ────────────────────────────────────────────────────────────────────────────

// Shape of each entry in CAPTIONS — unchanged from the original contract.
type Caption = {
  platform: string;
  text: string;
  color: string; // tailwind gradient classes, e.g. "from-pink-500 to-purple-500"
};

const CYCLE_SECONDS = 7;
const CAPTION_CYCLE_MS = CYCLE_SECONDS * 1000;

const CAPTIONS: Caption[] = [
  {
    platform: "Instagram",
    color: "from-pink-500 to-orange-500",
    text: "This changed everything for me... 🕰️ A beautiful Analog Wall Clock that keeps me on track and adds a touch of elegance to any room! 💡 With its circular design and Arabic numerals, it's the perfect combination of form and function. ⏰ Ready to elevate your space? 💬 DM to order now — we deliver today.",
  },
  {
    platform: "TikTok",
    color: "from-cyan-500 to-fuchsia-500",
    text: "POV: you need a clock that's both stylish and functional 🕰️ Not me buying this stunning Analog Wall Clock... 😍 #wallclock #homedecor",
  },
  {
    platform: "Twitter",
    color: "from-sky-500 to-blue-600",
    text: "Need a reliable clock that's also a style statement? 🕰️ Get our Analog Wall Clock for ₦4,500. DM to order now 🚀",
  },
  {
    platform: "Facebook",
    color: "from-blue-600 to-indigo-600",
    text: "Why pay ₦8,000 elsewhere when you can get this premium Analog Wall Clock for only ₦4,500? Hundreds of happy customers already love it.",
  },
  {
    platform: "WhatsApp",
    color: "from-green-500 to-emerald-600",
    text: "Only 5 left today! 🕰️ Get our Analog Wall Clock for ₦4,500 (worth ₦8,000). DM to order now — we deliver today.",
  },
];

/** Cycles through caption indices on a fixed interval, looping forever. */
function useCaptionCycle(length: number) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % length);
    }, CAPTION_CYCLE_MS);
    return () => clearInterval(timer);
  }, [length]);

  return index;
}

const AVATAR_URLS = [
  "https://images.unsplash.com/photo-1531384441138-2736e62e0919?w=100&h=100&fit=crop&q=80",
  "https://images.unsplash.com/photo-1531123897727-8f129e1bf98c?w=100&h=100&fit=crop&q=80",
  "https://images.unsplash.com/photo-1543269865-cbf427effbad?w=100&h=100&fit=crop&q=80",
  "https://images.unsplash.com/photo-1506803682981-6e718a9dd3ee?w=100&h=100&fit=crop&q=80",
  "https://images.unsplash.com/photo-1522529599102-193c0d76b5b6?w=100&h=100&fit=crop&q=80",
];

// ────────────────────────────────────────────────────────────────────────────
// Right-side "product pipeline" mockup card — local helper, no export. It
// owns no state of its own; it just renders whichever caption index the
// parent (Hero) hands it.
// ────────────────────────────────────────────────────────────────────────────

function PipelineMockup({
  activeIndex,
  captions,
}: {
  activeIndex: number;
  captions: Caption[];
}) {
  const active = captions[activeIndex];

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.9, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="relative z-10 w-full max-w-lg flex-1 lg:max-w-none"
    >
      <div className="relative overflow-hidden rounded-[28px] border border-white/10 bg-gradient-to-b from-white/[0.06] to-white/[0.015] p-5 shadow-[0_20px_70px_-15px_rgba(0,0,0,0.6)] backdrop-blur-2xl sm:p-7">
        {/* Ambient glow — quiet, not a rainbow */}
        <div className="pointer-events-none absolute -top-24 left-1/2 h-56 w-56 -translate-x-1/2 rounded-full bg-cyan-500/10 blur-[90px]" />

        {/* Window chrome */}
        <div className="mb-6 flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-red-500/80" />
          <span className="h-2.5 w-2.5 rounded-full bg-yellow-500/80" />
          <span className="h-2.5 w-2.5 rounded-full bg-green-500/80" />
          <span className="ml-3 text-[11px] font-medium tracking-wide text-slate-500">
            pipeline.ai
          </span>
        </div>

        <div className="flex flex-col gap-5">
          {/* Upload */}
          <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.04] p-4">
            <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl border border-white/10">
              <Image
                src="/images/clock.jpg"
                alt="Product photo uploaded by user"
                fill
                sizes="56px"
                className="object-cover"
              />
            </div>
            <div className="min-w-0 flex-1">
              <h4 className="text-sm font-semibold text-white">Product upload</h4>
              <p className="truncate text-xs text-slate-400">analog-wall-clock.jpg</p>
            </div>
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-green-500/15">
              <CheckCircle2 className="h-4 w-4 text-green-400" />
            </div>
          </div>


          {/* Output: Flyer + Video — full media visible, never cropped */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <MediaCard label="AI flyer generated" icon={ImageIcon}>
              <Image
                src="/images/flyer.png"
                alt=""
                fill
                aria-hidden
                sizes="(max-width: 640px) 100vw, 50vw"
                className="scale-110 object-cover opacity-40 blur-2xl"
              />
              <Image
                src="/images/flyer.png"
                alt="Generated flyer, full frame"
                fill
                sizes="(max-width: 640px) 100vw, 50vw"
                className="relative object-contain p-3 drop-shadow-[0_8px_24px_rgba(0,0,0,0.45)]"
              />
            </MediaCard>

            <MediaCard label="AI promo video" icon={Video}>
              <Image
                src="/images/flyer.png"
                alt=""
                fill
                aria-hidden
                sizes="(max-width: 640px) 100vw, 50vw"
                className="scale-110 object-cover opacity-40 blur-2xl"
              />
              <video
                src="/videos/promo.mp4"
                autoPlay
                muted
                loop
                playsInline
                preload="auto"
                poster="/images/flyer.png"
                className="relative h-full w-full object-contain p-3 drop-shadow-[0_8px_24px_rgba(0,0,0,0.45)]"
              />
            </MediaCard>
          </div>


          {/* Captions */}
          <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04]">
            <div className={`flex items-center gap-2 bg-gradient-to-r ${active.color} px-5 py-3`}>
              <Type className="h-4 w-4 text-white" />
              <span className="text-sm font-semibold text-white">{active.platform} caption</span>
              <Sparkles className="ml-auto h-3.5 w-3.5 text-white/70" />
            </div>

            <div className="p-5">
              <AnimatePresence mode="wait">
                <motion.p
                  key={activeIndex}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.35, ease: "easeOut" }}
                  className="text-sm leading-6 text-slate-300"
                >
                  {active.text}
                </motion.p>
              </AnimatePresence>

              {/* Story-style progress — each segment fills over the real cycle duration */}
              <div className="mt-5 flex gap-1.5">
                {captions.map((caption, i) => (
                  <div
                    key={caption.platform}
                    className="h-[3px] flex-1 overflow-hidden rounded-full bg-white/10"
                  >
                    {i === activeIndex && (
                      <motion.div
                        key={activeIndex}
                        className="h-full rounded-full bg-cyan-400"
                        initial={{ width: "0%" }}
                        animate={{ width: "100%" }}
                        transition={{ duration: CYCLE_SECONDS, ease: "linear" }}
                      />
                    )}
                    {i < activeIndex && <div className="h-full w-full rounded-full bg-cyan-400/60" />}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function Connector({ label }: { label: string }) {
  return (
    <div className="flex items-center justify-center gap-2">
      <span className="h-px w-8 bg-gradient-to-r from-transparent to-cyan-400/40" />
      <div className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1">
        <ChevronDown className="h-3 w-3 text-cyan-400" />
        <span className="text-[11px] font-medium text-slate-400">{label}</span>
      </div>
      <span className="h-px w-8 bg-gradient-to-l from-transparent to-cyan-400/40" />
    </div>
  );
}

function MediaCard({
  label,
  icon: Icon,
  children,
}: {
  label: string;
  icon: typeof ImageIcon;
  children: React.ReactNode;
}) {
  return (
    <div className="group overflow-hidden rounded-2xl border border-white/10 bg-black/30 transition-transform duration-300 ease-out hover:-translate-y-1">
      <div className="relative aspect-square overflow-hidden">{children}</div>
      <div className="flex items-center gap-2 border-t border-white/10 bg-white/[0.03] px-4 py-3">
        <Icon className="h-4 w-4 text-cyan-400" />
        <span className="text-xs font-medium text-white">{label}</span>
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// Hero — local helper used only inside LandingPage below. Navbar is rendered
// once, by LandingPage, not duplicated in here.
// ────────────────────────────────────────────────────────────────────────────

function Hero() {
  const activeIndex = useCaptionCycle(CAPTIONS.length);

  return (
    <section className="relative z-10 mx-auto flex max-w-7xl flex-col items-center gap-16 px-6 pb-20 pt-40 md:pb-32 md:pt-48 lg:flex-row">
      {/* Background glow */}
      <div className="pointer-events-none absolute -left-20 top-0 h-[500px] w-[800px] rounded-full bg-cyan-500/10 blur-[120px]" />

      {/* Left content */}
      <div className="z-10 w-full flex-1 text-center lg:text-left">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-6 inline-flex items-center justify-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-4 py-2 text-sm font-medium text-cyan-400 lg:justify-start"
        >
          <Sparkles className="h-4 w-4" />
          <span>African AI Marketing Studio</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="font-display mb-6 text-5xl font-bold leading-[1.1] tracking-tight text-white md:text-6xl lg:text-7xl"
        >
          Create Flyers, Captions &amp; Promo Videos in Minutes with AI
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mx-auto mb-10 max-w-2xl text-lg font-light leading-relaxed text-slate-400 md:text-xl lg:mx-0"
        >
          Upload your product once and let AI create everything you need to
          market and sell across WhatsApp, Instagram, Facebook and TikTok.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="flex flex-col items-center justify-center gap-4 sm:flex-row lg:justify-start"
        >
          <Link
            href="/signup"
            className="flex w-full items-center justify-center gap-2 rounded-full bg-cyan-400 px-8 py-4 text-lg font-bold text-[#0a1128] shadow-[0_0_30px_rgba(34,211,238,0.3)] transition-colors hover:bg-cyan-300 hover:shadow-[0_0_50px_rgba(34,211,238,0.5)] sm:w-auto"
          >
            Start Free Trial <ArrowRight className="h-5 w-5" />
          </Link>
          <a
            href="#demo"
            className="flex w-full items-center justify-center gap-2 rounded-full border border-white/10 bg-white/5 px-8 py-4 text-lg font-medium text-white transition-colors hover:bg-white/10 sm:w-auto"
          >
            <Play className="h-5 w-5 fill-white/50" /> Watch Demo
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-10 inline-flex flex-col items-center justify-center gap-4 rounded-full border border-white/10 bg-white/5 px-6 py-3 text-sm font-medium shadow-2xl backdrop-blur-xl sm:flex-row lg:justify-start"
        >
          <div className="flex shrink-0 -space-x-3">
            {AVATAR_URLS.map((src, i) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={src}
                src={src}
                alt={`User ${i + 1}`}
                className="h-8 w-8 rounded-full border-2 border-[#0a1128] object-cover shadow-sm"
              />
            ))}
          </div>
          <div className="tracking-wide text-slate-300">
            <span className="font-semibold text-white">Trusted by 1,000+</span>{" "}
            smart business owners
          </div>
        </motion.div>
      </div>

      {/* Right content — pipeline mockup */}
      <PipelineMockup activeIndex={activeIndex} captions={CAPTIONS} />
    </section>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// AnimatedCounter — counts up to `target` once it scrolls into view.
// ────────────────────────────────────────────────────────────────────────────

function AnimatedCounter({ target, suffix = "+" }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  useEffect(() => {
    if (!isInView) return;

    let startTimestamp: number | null = null;
    const duration = 2000;

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(easeOut * target));
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };

    window.requestAnimationFrame(step);
  }, [isInView, target]);

  return (
    <span ref={ref}>
      {count.toLocaleString()}
      {suffix}
    </span>
  );
}

function Stats() {
  return (
    <section className="flex border-y border-white/5 bg-white/[0.01] py-12">
      <div className="mx-auto flex w-full max-w-7xl flex-col items-center px-6">
        <p className="mb-8 text-center text-sm font-medium uppercase tracking-widest text-slate-400">
          Built for African Businesses
        </p>
        <div className="flex flex-col items-center justify-center text-center">
          <div className="font-display mb-2 text-5xl font-medium text-white md:text-6xl">
            <AnimatedCounter target={1000} />
          </div>
          <div className="text-sm font-medium tracking-wide text-cyan-400 md:text-base">
            AI CAMPAIGNS GENERATED
          </div>
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    { icon: Upload, title: "Upload Product", desc: "Upload a photo of your product." },
    { icon: LayoutTemplate, title: "Pick Template", desc: "Pick a template from the flow." },
    { icon: Sparkles, title: "AI Analysis", desc: "The AI analyzes them together to compose the best design." },
    { icon: ImageIcon, title: "Generate Campaign", desc: "Get a flyer, caption and promo video instantly." },
  ];

  return (
    <section className="mx-auto max-w-7xl px-6 py-24">
      <div className="mb-16 text-center">
        <h2 className="font-display mb-4 text-4xl font-medium text-white md:text-5xl">How It Works</h2>
        <p className="mx-auto max-w-2xl text-lg text-slate-400">
          From a single raw product photo to a full marketing campaign in seconds.
        </p>
      </div>
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
        {steps.map((step) => (
          <div
            key={step.title}
            className="group relative flex flex-col items-center rounded-3xl border border-white/5 bg-white/[0.02] p-8 text-center transition-colors hover:bg-white/[0.04]"
          >
            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-cyan-400/10 text-cyan-400 transition-all group-hover:scale-110 group-hover:bg-cyan-400/20">
              <step.icon className="h-8 w-8" />
            </div>
            <h3 className="mb-3 text-xl font-semibold text-white">{step.title}</h3>
            <p className="text-sm leading-relaxed text-slate-400">{step.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function Testimonials() {
  const reviews = [
    {
      name: "Chukwudi N.",
      location: "Lagos, NG",
      text: "INRASTUDIO completely changed how I run my boutique. I create professional promos in seconds without paying a designer.",
    },
    {
      name: "Amara S.",
      location: "Accra, GH",
      text: "The AI captions are incredibly accurate. It knows exactly how to pitch my luxury perfumes. Sales have doubled!",
    },
    {
      name: "Kwame K.",
      location: "Nairobi, KE",
      text: "I used to struggle with Canva for hours. With this, I just upload a picture of my food, and the flyer is ready.",
    },
    {
      name: "Sarah M.",
      location: "Johannesburg, SA",
      text: "The templates are perfectly suited for the African market. My collection launches look like a premium brand now.",
    },
    {
      name: "Femi O.",
      location: "Abuja, NG",
      text: "Unbelievably fast. The flash sale templates generate so much engagement on my WhatsApp statuses.",
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
    <section className="relative overflow-hidden border-t border-white/5 bg-[#0a1128] py-24">
      <div className="relative z-10 mx-auto w-full max-w-7xl overflow-hidden">
        <div className="mb-16 px-6 text-center">
          <h2 className="font-display mb-6 text-4xl font-medium tracking-tight text-white drop-shadow-md md:text-6xl">
            Enjoyed by Many
          </h2>
          <div className="mx-auto mb-6 h-[1px] w-3/4 max-w-lg bg-gradient-to-r from-transparent via-white/50 to-transparent" />
          <p className="mx-auto max-w-2xl text-lg font-medium tracking-wide text-slate-200 drop-shadow-md">
            Real Stories, Real Growth - Hear from Businesses Who&apos;ve Transformed Their Marketing
          </p>
        </div>

        <div ref={carouselRef} className="w-full cursor-grab overflow-hidden px-6 active:cursor-grabbing md:px-12">
          <motion.div
            drag="x"
            dragConstraints={{ right: 0, left: -width }}
            className="flex w-max gap-6 pb-12 pt-4"
          >
            {reviews.map((review) => (
              <div
                key={review.name}
                className="pointer-events-none flex w-[320px] flex-col justify-between rounded-[2rem] border border-white/5 bg-white/[0.02] p-8 shadow-lg transition-colors hover:bg-white/[0.04] md:w-[420px]"
              >
                <div>
                  <div className="mb-8 flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-medium leading-tight text-white">{review.name}</h3>
                      <p className="text-sm font-light text-slate-400">{review.location}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star key={star} className="h-5 w-5 fill-amber-300 text-amber-300 drop-shadow" />
                      ))}
                    </div>
                  </div>
                  <p className="text-base font-medium leading-relaxed text-slate-300 drop-shadow-sm md:text-lg">
                    &quot;{review.text}&quot;
                  </p>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function Workflow() {
  return (
    <section
      id="dashboards"
      className="relative overflow-hidden border-y border-cyan-500/10 bg-[#0a1128] px-6 py-32"
    >
      {/* Ambient background */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-cyan-900/10 via-[#0a1128] to-[#0a1128]" />

      <div className="relative z-10 mx-auto max-w-5xl text-center">
        <h2 className="font-display mb-6 text-4xl font-medium tracking-tight text-white md:text-5xl lg:text-6xl">
          One Upload.
          <br />
          Everything Generated.
        </h2>
        <p className="mx-auto mb-20 max-w-2xl text-xl font-light text-slate-400">
          The ultimate workflow engine built for speed and perfection.
        </p>

        <div className="flex flex-col items-center">
          <div className="relative w-full max-w-2xl">
            {/* Upload Node */}
            <div className="relative z-10 mx-auto flex max-w-xs items-center justify-center gap-3 rounded-full border border-white/20 bg-white/5 p-5 shadow-xl backdrop-blur">
              <Upload className="h-6 w-6 text-cyan-400" />
              <span className="text-lg font-semibold text-white">Upload Product</span>
            </div>

            <div className="mx-auto h-12 w-px bg-cyan-500/50" />

            {/* Analysis Node */}
            <div className="relative z-10 mx-auto flex max-w-sm items-center justify-center gap-3 rounded-full border border-cyan-400 bg-cyan-500/10 p-5 text-cyan-300 shadow-[0_0_30px_rgba(34,211,238,0.2)]">
              <Sparkles className="h-6 w-6" />
              <span className="text-lg font-semibold">AI Analysis &amp; Composition</span>
            </div>

            <div className="mx-auto h-12 w-px bg-cyan-500/50" />

            {/* 3 branches line */}
            <div className="relative mx-auto mt-4 flex h-px w-full max-w-md justify-between bg-cyan-500/50">
              <div className="absolute left-0 top-0 h-6 w-px bg-cyan-500/50" />
              <div className="absolute left-1/2 top-0 h-6 w-px -ml-px bg-cyan-500/50" />
              <div className="absolute right-0 top-0 h-6 w-px bg-cyan-500/50" />
            </div>

            {/* Outputs */}
            <div className="relative z-10 mx-auto grid max-w-md grid-cols-3 gap-6 pt-6">
              <div className="flex flex-col items-center gap-4 rounded-3xl border border-white/10 bg-white/5 p-6 shadow-xl transition-all hover:border-cyan-500/30 hover:bg-white/10">
                <ImageIcon className="h-8 w-8 text-white" />
                <span className="font-medium text-white">Flyer</span>
              </div>
              <div className="flex flex-col items-center gap-4 rounded-3xl border border-white/10 bg-white/5 p-6 shadow-xl transition-all hover:border-cyan-500/30 hover:bg-white/10">
                <Type className="h-8 w-8 text-white" />
                <span className="font-medium text-white">Caption</span>
              </div>
              <div className="flex flex-col items-center gap-4 rounded-3xl border border-white/10 bg-white/5 p-6 shadow-xl transition-all hover:border-cyan-500/30 hover:bg-white/10">
                <Video className="h-8 w-8 text-white" />
                <span className="font-medium text-white">Video</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function VideoDemo() {
  return (
    <section id="demo" className="mx-auto max-w-5xl px-6 py-24">
      <div className="mb-12 text-center">
        <h2 className="font-display mb-4 text-4xl font-medium text-white md:text-5xl">
          See INRASTUDIO in Action
        </h2>
        <p className="mx-auto max-w-2xl text-lg font-light text-slate-400">
          Watch how fast you can go from a single photo to a ready campaign.
        </p>
      </div>
      <div className="group relative flex aspect-video w-full cursor-pointer items-center justify-center overflow-hidden rounded-3xl border border-white/10 bg-[#0a1128] shadow-2xl">
        <Image
          src="https://picsum.photos/seed/apppreview/1200/675"
          fill
          sizes="100vw"
          className="object-cover opacity-50 transition-opacity duration-700 group-hover:opacity-70"
          alt="Demo"
        />
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="flex h-24 w-24 items-center justify-center rounded-full border border-white/20 bg-white/10 shadow-[0_0_30px_rgba(255,255,255,0.1)] backdrop-blur-md transition-all duration-300 group-hover:scale-110 group-hover:bg-cyan-500 group-hover:shadow-[0_0_40px_rgba(34,211,238,0.4)]">
            <Play className="ml-2 h-10 w-10 fill-white text-white transition-colors group-hover:fill-[#0a1128] group-hover:text-[#0a1128]" />
          </div>
        </div>
        {/* Steps Overlay */}
        <div className="pointer-events-none absolute bottom-8 left-0 right-0 flex justify-center gap-4 px-6">
          <span className="rounded-full border border-white/10 bg-black/60 px-5 py-2.5 text-sm font-medium text-cyan-400 shadow-lg backdrop-blur-md">
            1. Upload
          </span>
          <span className="rounded-full border border-white/10 bg-black/60 px-5 py-2.5 text-sm font-medium text-white shadow-lg backdrop-blur-md">
            2. Generate
          </span>
          <span className="rounded-full border border-white/10 bg-black/60 px-5 py-2.5 text-sm font-medium text-white shadow-lg backdrop-blur-md">
            3. Download
          </span>
        </div>
      </div>
    </section>
  );
}

function FAQ() {
  const faqs = [
    { q: "Do I need design experience?", a: "Not at all. Just upload a photo, and the AI handles the design, colors, and layouts automatically." },
    { q: "Can I use my own colors?", a: "Yes, you can specify your brand colors, and the AI will adapt the templates to match." },
    { q: "Can I upload my logo?", a: "Absolutely. Once uploaded, your logo will be perfectly positioned on all generated assets." },
    { q: "What countries are supported?", a: "We proudly support businesses globally, with specialized local templates tailored for Nigeria, Kenya, Ghana, South Africa, and Egypt." },
    { q: "Can I download videos?", a: "Yes, all promo videos can be downloaded as MP4 files directly to your device." },
  ];

  return (
    <section id="resources" className="mx-auto max-w-3xl border-t border-white/5 px-6 py-24">
      <h2 className="font-display mb-12 text-center text-4xl font-medium tracking-tight text-white md:text-5xl">
        Frequently asked questions
      </h2>
      <div className="space-y-6">
        {faqs.map((faq) => (
          <div
            key={faq.q}
            className="rounded-3xl border border-white/5 bg-white/[0.02] p-8 transition-colors hover:bg-white/[0.04]"
          >
            <h3 className="mb-3 text-lg font-semibold text-white">{faq.q}</h3>
            <p className="font-light leading-relaxed text-slate-400">{faq.a}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function CallToAction() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-12">
      <div className="relative w-full overflow-hidden rounded-[3rem] border border-white/10 bg-[#0c0c0c] shadow-2xl">
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "linear-gradient(135deg, rgba(34,211,238,0.15) 0%, rgba(236,72,153,0.1) 100%)",
          }}
        />
        <div className="relative z-10 flex flex-col items-center justify-between gap-16 p-12 md:flex-row md:p-24">
          <div className="z-20 flex-1 text-center md:text-left">
            <div className="mb-8 inline-block">
              <div className="rounded-full border border-cyan-500/30 bg-cyan-500/10 px-5 py-2.5 text-xs font-bold uppercase tracking-widest text-cyan-300">
                Join the future
              </div>
            </div>
            <h2 className="font-display mb-10 text-5xl font-medium leading-[1.1] tracking-tight text-white md:text-6xl lg:text-7xl">
              Ready to Create Your
              <br className="hidden lg:block" /> Next Campaign?
            </h2>
            <Link
              href="/signup"
              className="inline-block rounded-full bg-cyan-400 px-10 py-5 text-lg font-bold text-[#0a1128] shadow-[0_0_40px_rgba(34,211,238,0.3)] transition-all hover:scale-105 hover:bg-cyan-300 active:scale-95"
            >
              Start Free Trial
            </Link>
          </div>

          {/* Visual art portion */}
          <div className="relative z-10 hidden h-[350px] w-[400px] shrink-0 items-center justify-center lg:flex">
            <div className="absolute inset-0 flex items-center justify-center">
              <svg viewBox="0 0 200 200" className="h-full w-full drop-shadow-2xl">
                <path
                  d="M 150 100 Q 180 100 180 70 C 200 100 150 140 150 100"
                  fill="#22d3ee"
                  className="animate-pulse"
                />
                <path
                  d="M 120 70 A 30 30 0 0 1 180 70 L 180 150 A 30 30 0 0 1 120 150 Z"
                  fill="#030712"
                />
                <circle cx="160" cy="110" r="2" fill="#fff" />
                <circle cx="140" cy="130" r="1.5" fill="#fff" />
                <circle cx="145" cy="85" r="2.5" fill="#fff" />
                <path
                  d="M 150 90 L 80 90 A 10 10 0 0 0 80 110 L 150 110 Z"
                  fill="#f8fafc"
                />
                <path
                  d="M 150 130 L 80 130 A 10 10 0 0 0 80 150 L 150 150 Z"
                  fill="#f8fafc"
                />
                <path
                  d="M 20 60 L 60 100 L 40 110 L 80 150"
                  stroke="#22d3ee"
                  strokeWidth="3"
                  fill="none"
                />
                <path
                  d="M 40 30 L 80 70 L 60 80 L 100 120"
                  stroke="#ec4899"
                  strokeWidth="3"
                  fill="none"
                />
                <path
                  d="M 10 120 L 40 150 L 25 160 L 60 195"
                  stroke="#fde047"
                  strokeWidth="3"
                  fill="none"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="relative mt-12 w-full overflow-hidden border-t border-white/5 bg-[#030712] px-6 pb-12 pt-24">
      <div className="relative z-20 mx-auto flex max-w-7xl flex-col items-start justify-between gap-16 pb-40 lg:flex-row">
        {/* Big text block */}
        <div className="max-w-3xl flex-1">
          <h2 className="font-display text-4xl font-medium leading-tight tracking-tight text-slate-200 md:text-5xl lg:text-6xl">
            Ready to create something cool together, or just explore our solutions.
          </h2>
        </div>

        {/* Navigation links */}
        <div className="flex shrink-0 flex-wrap gap-12 font-mono text-xs uppercase tracking-widest sm:gap-24">
          <div className="flex flex-col gap-5">
            <span className="mb-2 font-bold text-slate-600">(EXPLORE)</span>
            <Link href="/privacy" className="text-slate-300 transition-colors hover:text-white">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-slate-300 transition-colors hover:text-white">
              Terms and Condition
            </Link>
            <Link href="/disclosure" className="text-slate-300 transition-colors hover:text-white">
              Disclosure
            </Link>
          </div>
          <div className="flex flex-col gap-5">
            <span className="mb-2 font-bold text-slate-600">(CONNECT)</span>
            <a
              href="#"
              className="group flex items-center gap-2 text-slate-300 transition-colors hover:text-white"
            >
              <Facebook className="h-4 w-4 text-slate-400" /> FACEBOOK
              <ArrowRight className="h-3 w-3 -rotate-45 transition-all group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-cyan-400" />
            </a>
            <a
              href="#"
              className="group flex items-center gap-2 text-slate-300 transition-colors hover:text-white"
            >
              <Instagram className="h-4 w-4 text-slate-400" /> INSTAGRAM
              <ArrowRight className="h-3 w-3 -rotate-45 transition-all group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-cyan-400" />
            </a>
          </div>
        </div>
      </div>

      <div className="relative z-30 mx-auto mt-12 flex max-w-7xl flex-col items-center justify-between gap-4 border-t border-white/5 pt-12 font-mono text-sm text-slate-500 md:flex-row">
<Logo size="sm" className="h-8 w-8 rounded-lg" />
        <p>© 2026 INRASTUDIO AI Marketing Studio.</p>
      </div>
    </footer>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// The ONLY export in this file.
// ────────────────────────────────────────────────────────────────────────────

export default function LandingPage() {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#030712] font-sans text-slate-50 selection:bg-cyan-500 selection:text-white">
      <Navbar />
      <main>
        <Hero />
        <Stats />
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
