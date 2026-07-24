"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "motion/react";
import { AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  Facebook,
  Home,
  Image as ImageIcon,
  Instagram,
  LayoutTemplate,
  Play,
  Scissors,
  ShoppingBag,
  Sparkles,
  Star,
  Type,
  Upload,
  UtensilsCrossed,
  Video,
  Mail, // ← NEW import
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Logo } from "@/components/Logo";
import { Navbar } from "@/components/Navbar";

// ─── Types & data ──────────────────────────────────────────────────────────

type Caption = {
  platform: string;
  text: string;
  color: string;
};

const CYCLE_SECONDS = 7;
const CAPTION_CYCLE_MS = CYCLE_SECONDS * 1000;

const CAPTIONS: Caption[] = [
  {
    platform: "Instagram",
    color: "from-orange-600 to-amber-600",
    text: "This changed everything for me... 🌸 I used to struggle with oily skin, but since I started using Cetaphil Daily Facial Cleanser, my skin has been balanced and fresh! 💧 It's clinically proven to deep clean without drying. Get yours now and say goodbye to excess oil! 💸 DM to order — we deliver today. #skincarelover #cetaphil #facialcleanser #oilyskin #glowingskin #skincarejunkie #beautyessentials #cleanskin #skincareaddict #naturalskincare",
  },
  {
    platform: "TikTok",
    color: "from-stone-600 to-neutral-700",
    text: "POV: you wake up with glowing skin 🌸 Not me buying Cetaphil Daily Facial Cleanser, but... 💸 It's clinically proven to deep clean without drying! #skincarelover #cetaphil #glowingskin #skincarejunkie #beautyessentials #cleanskin #skincareaddict #naturalskincare #facialcleanser",
  },
  {
    platform: "Twitter",
    color: "from-sky-700 to-blue-800",
    text: "Tired of oily skin? 💧 Cetaphil Daily Facial Cleanser (20 FL OZ) for ₦850! 💸 Clinically proven to deep clean. DM to order — we deliver today #skincare #cetaphil.",
  },
  {
    platform: "Facebook",
    color: "from-blue-700 to-indigo-800",
    text: " Why pay ₦1,200 elsewhere when you can get Cetaphil Daily Facial Cleanser for ₦850? 💸 This 20 FL OZ bottle is perfect for daily use and is clinically proven to deep clean normal to oily skin types. 100s of happy customers trust us for their skincare needs! To order, simply comment 'ORDER' below or send us a DM. You can also WhatsApp us at 08012345678.",
  },
  {
    platform: "WhatsApp",
    color: "from-emerald-700 to-green-800",
    text: "Only 5 left today! 💨 Get Cetaphil Daily Facial Cleanser for ₦850 (20 FL OZ). Clinically proven for normal to oily skin. Send 'ORDER' to this number to get yours now!.",
  },
];

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

// ─── PipelineMockup, Connector, MediaCard ─────────────────────────────────

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
        <div className="mb-6 flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-red-500/80" />
          <span className="h-2.5 w-2.5 rounded-full bg-yellow-500/80" />
          <span className="h-2.5 w-2.5 rounded-full bg-green-500/80" />
          <span className="ml-3 text-[11px] font-medium tracking-wide text-slate-500">
            INRASTUDIO AI
          </span>
        </div>

        <div className="flex flex-col gap-5">
          <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.04] p-4">
            <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl border border-white/10">
              <Image
                src="/images/cosmetic.jpg"
                alt="Product photo uploaded by user"
                fill
                sizes="56px"
                className="object-cover"
              />
            </div>
            <div className="min-w-0 flex-1">
              <h4 className="text-sm font-semibold text-white">Product upload</h4>
              <p className="truncate text-xs text-slate-400">Cosmetics.jpg</p>
            </div>
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-green-500/15">
              <CheckCircle2 className="h-4 w-4 text-green-400" />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <MediaCard label="AI flyer generated" icon={ImageIcon}>
              <Image
                src="/images/flyer-1784491663572.png"
                alt=""
                fill
                aria-hidden
                sizes="(max-width: 640px) 100vw, 50vw"
                className="scale-110 object-cover opacity-40 blur-2xl"
              />
              <Image
                src="/images/flyer-1784491663572.png"
                alt="Generated flyer, full frame"
                fill
                sizes="(max-width: 640px) 100vw, 50vw"
                className="relative object-contain p-3 drop-shadow-[0_8px_24px_rgba(0,0,0,0.45)]"
              />
            </MediaCard>

            <MediaCard label="Promo video" icon={Video}>
              <Image
                src="/images/flyer-1784491663572.png"
                alt=""
                fill
                aria-hidden
                sizes="(max-width: 640px) 100vw, 50vw"
                className="scale-110 object-cover opacity-40 blur-2xl"
              />
              <video
                src="/videos/promo-tiktok (2).mp4"
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

          <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04]">
            <div className={`flex items-center gap-2 bg-gradient-to-r ${active.color} px-5 py-3`}>
              <Type className="h-4 w-4 text-white" />
              <span className="text-sm font-semibold text-white">{active.platform} caption</span>
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

// ─── Hero ──────────────────────────────────────────────────────────────────

function Hero() {
  const activeIndex = useCaptionCycle(CAPTIONS.length);

  return (
    <section className="relative z-10 mx-auto flex max-w-7xl flex-col items-center gap-16 px-6 pb-20 pt-40 md:pb-32 md:pt-48 lg:flex-row">
      <div className="z-10 w-full flex-1 text-center lg:text-left">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="mb-6 text-5xl font-bold leading-[1.1] tracking-tight text-white md:text-6xl lg:text-7xl"
          style={{ fontFamily: "var(--font-display)" }}
        >
          You already sell on WhatsApp.
          <br />
          You just don't need design skills to look this good.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mx-auto mb-10 max-w-2xl text-lg font-light leading-relaxed text-slate-400 md:text-xl lg:mx-0"
        >
          Take one photo of your product. We turn it into a flyer with your logo on it,
          a caption for each platform, and a short promo video — ready to post in
          under a minute.
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
      </div>

      <PipelineMockup activeIndex={activeIndex} captions={CAPTIONS} />
    </section>
  );
}

// ─── Stats ─────────────────────────────────────────────────────────────────

function Stats() {
  return (
    <section className="flex border-y border-white/5 bg-white/[0.01] py-12">
      <div className="mx-auto flex w-full max-w-7xl flex-col items-center px-6">
        <p className="text-center text-sm text-slate-500 text-xl">
          1,102 flyers generated last month by resellers, skincare brands, real
          estate agents, and caterers across Lagos, Abuja, Accra, and Nairobi.
        </p>
      </div>
    </section>
  );
}

// ─── WhoItsFor ─────────────────────────────────────────────────────────────

const USE_CASES: { icon: typeof ShoppingBag; label: string; detail: string }[] = [
  {
    icon: ShoppingBag,
    label: "Fashion & accessories resellers",
    detail: "New stock, new flyer, same minute.",
  },
  {
    icon: Sparkles,
    label: "Skincare & beauty sellers",
    detail: "Captions tuned for how you already sell.",
  },
  {
    icon: Home,
    label: "Real estate agents",
    detail: "Listings that look credible on first glance.",
  },
  {
    icon: UtensilsCrossed,
    label: "Food & catering businesses",
    detail: "Daily specials, posted before the lunch rush.",
  },
  {
    icon: LayoutTemplate,
    label: "Event planners & vendors",
    detail: "Your logo, consistent across every job.",
  },
  {
    icon: Scissors,
    label: "Tailors & independent designers",
    detail: "Show finished work like it was shot in a studio.",
  },
];

function WhoItsFor() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-24">
      <h2 className="mb-4 text-3xl font-medium text-white md:text-4xl">
        Built for anyone selling without a design team.
      </h2>
      <p className="mb-14 max-w-xl text-lg text-slate-400">
        If you sell through WhatsApp, Instagram, or TikTok — not a storefront
        with a marketing budget — this is built around how you actually work.
      </p>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {USE_CASES.map(({ icon: Icon, label, detail }) => (
          <div
            key={label}
            className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-white/[0.02] p-6 transition-colors duration-300 hover:bg-white/[0.05]"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-400/10">
              <Icon className="h-5 w-5 text-cyan-400" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-white">{label}</h3>
              <p className="mt-1 text-sm leading-relaxed text-slate-400">{detail}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ─── HowItWorks ────────────────────────────────────────────────────────────

function HowItWorks() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-24">
      <h2 className="mb-4 text-3xl font-medium text-white md:text-4xl">
        There's really only one hard part.
      </h2>

      <p className="mb-16 max-w-xl text-lg text-slate-400">
        Everything before it is just uploading a photo. Everything after it is
        yours to tweak or download as-is.
      </p>

      <div className="grid grid-cols-1 gap-16 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <div className="flex justify-center">
            <Image
              src="/images/flyer.png"
              alt="Product photo turned into a finished flyer"
              width={520}
              height={650}
              priority
              className="w-full max-w-[520px] h-auto object-contain"
            />
          </div>

          <h3 className="mt-8 text-xl font-semibold text-white">
            We look at your photo the way a designer would
          </h3>

          <p className="mt-3 max-w-lg text-slate-400 leading-7">
            Lighting, background, product shape, and spacing are analyzed
            automatically. Instead of dropping your product into a generic
            template, every flyer is composed around the product itself.
          </p>
        </div>

        <div className="flex flex-col justify-center gap-8 lg:col-span-2">
          <div className="border-l-2 border-white/10 pl-5">
            <span className="text-sm text-slate-500">Before</span>
            <p className="mt-1 text-white">
              Upload one clear photo of your product.
            </p>
          </div>

          <div className="border-l-2 border-white/10 pl-5">
            <span className="text-sm text-slate-500">After</span>
            <p className="mt-1 text-white">
              Get a polished flyer with your logo placed in, 5 social
              captions, and a short promo video.
            </p>
          </div>

          <div className="border-l-2 border-cyan-500/40 pl-5">
            <span className="text-sm text-cyan-400">Time</span>
            <p className="mt-1 text-white">
              Usually ready in under 5 minutes.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Testimonials ──────────────────────────────────────────────────────────

function Testimonials() {
  const reviews = [
    {
      name: "Chukwudi N.",
      location: "Lagos",
      stars: 5,
      text: "I was paying a guy ₦10,000 per flyer before this. Now I do it myself between customers. The captions still need small edits sometimes but it's close enough.",
    },
    {
      name: "Amara S.",
      location: "Accra",
      stars: 4,
      text: "Video quality could be a bit sharper on bigger screens, but for WhatsApp Status it's more than good enough. Saves me real time.",
    },
    {
      name: "Kwame K.",
      location: "Nairobi",
      stars: 5,
      text: "Uploaded a photo I took with a torch light at night and it still came out looking decent. Didn't expect that.",
    },
    {
      name: "Sarah M.",
      location: "Abuja",
      stars: 5,
      text: "Been using it for my collection launches for about two months now. Customers ask if I hired a photographer.",
    },
    {
      name: "Tomiwa A.",
      location: "Lagos",
      stars: 5,
      text: "I do property listings. Once I added my agency logo it carries over on every flyer automatically. Clients take it more seriously now.",
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
    <section className="border-t border-white/5 bg-[#0a1128] py-24">
      <div className="mx-auto w-full max-w-7xl">
        <div className="mb-12 px-6">
          <h2 className="text-3xl font-medium text-white md:text-4xl">What people actually say</h2>
        </div>

        <div ref={carouselRef} className="w-full cursor-grab overflow-hidden px-6 active:cursor-grabbing">
          <motion.div drag="x" dragConstraints={{ right: 0, left: -width }} className="flex w-max gap-5 pb-8">
            {reviews.map((review) => (
              <div
                key={review.name}
                className="pointer-events-none flex w-[300px] flex-col justify-between border border-white/10 bg-white/[0.02] p-7 md:w-[360px]"
              >
                <p className="mb-6 text-[15px] leading-relaxed text-slate-300">"{review.text}"</p>
                <div className="flex items-center justify-between border-t border-white/10 pt-4">
                  <div>
                    <p className="text-sm font-medium text-white">{review.name}</p>
                    <p className="text-xs text-slate-500">{review.location}</p>
                  </div>
                  <div className="flex gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-3.5 w-3.5 ${i < review.stars ? "fill-amber-400 text-amber-400" : "text-slate-700"}`}
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

// ─── Workflow ──────────────────────────────────────────────────────────────

function Workflow() {
  return (
    <section id="dashboards" className="border-y border-white/5 bg-[#0a1128] px-6 py-24">
      <div className="mx-auto max-w-5xl">
        <h2 className="mb-2 text-3xl font-medium text-white md:text-4xl">
          One photo in. Three things out.
        </h2>
        <p className="mb-12 max-w-xl text-slate-400">
          No templates to browse — just a finished draft you can tweak in one tap.
        </p>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="overflow-hidden rounded-2xl border border-white/10 bg-black/20">
            <div className="relative aspect-[4/5]">
              <Image src="/images/flyer-1784495302024.png" alt="Generated flyer" fill className="object-contain p-4" />
            </div>
            <div className="border-t border-white/10 px-4 py-3 text-sm font-medium text-white">Flyer</div>
          </div>
          <div className="overflow-hidden rounded-2xl border border-white/10 bg-black/20">
            <div className="relative aspect-[4/5]">
              <video src="/videos/promo-tiktok (3).mp4" autoPlay muted loop playsInline className="h-full w-full object-contain p-4" />
            </div>
            <div className="border-t border-white/10 px-4 py-3 text-sm font-medium text-white">Video</div>
          </div>
          <div className="flex flex-col justify-center gap-4 rounded-2xl border border-white/10 bg-black/20 p-6">
            <span className="text-sm font-medium text-white">Caption</span>
            <p className="text-sm leading-relaxed text-slate-400">
              "This changed everything for me... 💃🏻👜! I was tired of boring handbags until I found this stunning vibrant red patent leather top-handle bag. Not only is it a head-turner, but it's also incredibly versatile and perfect for any occasion. Whether you're heading to a formal event or just running errands, this bag is sure to make you feel chic and polished. And the best part? It's affordable! 💸 From ₦12,000 — free delivery today only. DM to order now — we deliver today. #fashion #handbag #redhot #patentleather #tophandle #vibrant #style #elegance #sophistication #accessorize."
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── VideoDemo ─────────────────────────────────────────────────────────────

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

// ─── FAQ ──────────────────────────────────────────────────────────────────

function FAQ() {
  const faqs = [
    { q: "My photos are usually taken on a normal phone, not a proper camera. Does that matter?", a: "Not much. Most sellers upload photos taken on mid-range Android phones, sometimes indoors with regular room lighting. It works — it just won't fix a badly blurred photo." },
    { q: "Does this use a lot of data?", a: "Uploading a photo is small. Downloading the video is the heaviest part, usually a few MB. You can generate on WiFi and download later if data is tight." },
    { q: "Can I edit the caption before I post it?", a: "Yes. Treat what we generate as a first draft — most people tweak a line or two before sending." },
    { q: "Can I add my own logo?", a: "Yes — upload it once and drag it into place on your flyer. Resize it however you like, and it carries over automatically when you switch between Instagram, Story, or TikTok formats." },
    { q: "What if I don't like any of the results?", a: "Editing text, color, or your logo updates instantly — no regenerating needed. You only need to regenerate if you want to swap the product photo itself." },
    { q: "Do you support Naira pricing and local payment?", a: "Yes — pricing shows automatically in Naira, Cedis, Kenyan Shilling, or USD based on the country you select when you sign up, and you can pay by card or bank transfer." },
  ];

  return (
    <section id="resources" className="mx-auto max-w-3xl border-t border-white/5 px-6 py-24">
      <h2 className="mb-10 text-3xl font-medium tracking-tight text-white md:text-4xl">Questions people actually ask</h2>
      <div className="divide-y divide-white/5">
        {faqs.map((faq) => (
          <div key={faq.q} className="py-6">
            <h3 className="mb-2 text-base font-medium text-white">{faq.q}</h3>
            <p className="text-[15px] leading-relaxed text-slate-400">{faq.a}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

// ─── CallToAction (flyer image now visible on all screens) ────────────────

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
        <div className="relative z-10 flex flex-col items-center gap-12 p-8 md:flex-row md:gap-16 md:p-24">
          <div className="z-20 flex-1 text-center md:text-left">
            <h2 className="font-display mb-8 text-4xl font-medium leading-[1.1] tracking-tight text-white md:text-6xl lg:text-7xl">
              Your next flyer is one
              <br className="hidden lg:block" />
              <span className="text-cyan-400">Photo Away</span>
            </h2>
            <Link
              href="/signup"
              className="inline-block rounded-full bg-cyan-400 px-10 py-5 text-lg font-bold text-[#0a1128] shadow-[0_0_40px_rgba(34,211,238,0.3)] transition-all hover:scale-105 hover:bg-cyan-300 active:scale-95"
            >
              Start Free Trial
            </Link>
          </div>

          {/* Image – now always visible, stacks below on mobile */}
          <div className="relative z-10 w-full max-w-sm shrink-0 items-center justify-center md:max-w-[400px] lg:flex">
            <div
              className="absolute inset-0 rounded-full blur-3xl opacity-30"
              style={{ background: "radial-gradient(circle, #22d3ee 0%, transparent 70%)" }}
            />
            <Image
              src="/images/flyer-1784810176714.png"
              alt="Infinix phone showcasing Active Matrix Display and Flagship Level Design"
              width={400}
              height={400}
              className="relative z-10 h-full w-full object-contain drop-shadow-2xl"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Footer (with new Support link) ───────────────────────────────────────

function Footer() {
  return (
    <footer className="relative mt-12 w-full border-t border-white/5 bg-[#030712] px-6 pb-12 pt-24">
      <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-16 pb-20 lg:flex-row">
        <div className="max-w-2xl flex-1">
          <h2 className="text-3xl font-medium leading-snug tracking-tight text-slate-200 md:text-4xl">
            Built for people who sell things, not people who design things.
            <br />
            If you've got a product photo, you've got a campaign.
          </h2>
        </div>

        <div className="flex shrink-0 flex-wrap gap-12 font-mono text-xs uppercase tracking-widest sm:gap-24">
          <div className="flex flex-col gap-4">
            <span className="mb-2 font-bold text-slate-600">Legal</span>
            <Link href="/privacy" className="text-slate-300 hover:text-white">Privacy</Link>
            <Link href="/terms" className="text-slate-300 hover:text-white">Terms</Link>
          </div>
          <div className="flex flex-col gap-4">
            <span className="mb-2 font-bold text-slate-600">Contact</span>
            <a href="#" className="flex items-center gap-2 text-slate-300 hover:text-white">
              <Facebook className="h-4 w-4 text-slate-400" /> Facebook
            </a>
            <a href="#" className="flex items-center gap-2 text-slate-300 hover:text-white">
              <Instagram className="h-4 w-4 text-slate-400" /> Instagram
            </a>
            {/* NEW Support link */}
            <a
              href="mailto:somtohgist@gmail.com"
              className="flex items-center gap-2 text-slate-300 hover:text-white"
            >
              <Mail className="h-4 w-4 text-slate-400" /> Support
            </a>
          </div>
        </div>
      </div>

      <div className="mx-auto mt-4 flex max-w-7xl flex-col items-center justify-between gap-4 border-t border-white/5 pt-8 text-sm text-slate-500 md:flex-row">
        <Logo size="sm" className="h-8 w-8 rounded-lg" />
        <p>© 2026 INRASTUDIO. Made in Lagos.</p>
      </div>
    </footer>
  );
}

// ─── Main export ───────────────────────────────────────────────────────────

export default function LandingPage() {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#030712] font-sans text-slate-50 selection:bg-cyan-500 selection:text-white">
      <Navbar />
      <main>
        <Hero />
        <Stats />
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