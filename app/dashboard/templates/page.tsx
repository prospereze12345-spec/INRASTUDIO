"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Home,
  LayoutTemplate,
  Crown,
  Menu,
  X,
  ArrowLeft,
  ArrowUpRight,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Logo } from "@/components/Logo";
import { LuxuryProductTemplate } from "@/components/templates/LuxuryProduct";
import { SleekFlyerTemplate as MinimalProductTemplate } from "@/components/templates/MinimalProduct";
import { PremiumBrandTemplate } from "@/components/templates/PremiumBrand";
import {
  LUXURY_VARIATIONS,
  MINIMAL_PRODUCT_VARIATIONS,
  PREMIUM_BRAND_VARIATIONS,
} from "@/lib/template-data";

/* =========================================================
   DESIGN TOKENS
========================================================= */

const ink = "#16140F";
const panel = "#1D1A14";
const panelSoft = "#211E17";
const rule = "#38321F";
const paper = "#EDE6D6";
const paperMuted = "#C9BFA4";
const marigold = "#E8A33D";
const textPrimary = "#F3ECDD";
const textMuted = "#8C8368";

/* =========================================================
   SIDEBAR
========================================================= */

function Sidebar({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden"
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      <motion.aside
        className={`fixed top-0 left-0 bottom-0 w-[270px] z-50 flex flex-col border-r transition-transform duration-300 lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        style={{
          background: panel,
          borderColor: rule,
        }}
      >
        {/* Logo */}
        <div
          className="h-[82px] px-6 flex items-center justify-between border-b"
          style={{ borderColor: rule }}
        >
          <Link href="/" className="flex items-center">
            <Logo className="w-9 h-9 rounded-lg" />
          </Link>

          <button
            onClick={onClose}
            className="lg:hidden p-2 rounded-lg transition-opacity hover:opacity-70"
            style={{ color: textMuted }}
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <div className="flex-1 px-4 py-7">
          <p
            className="font-mono text-[10px] tracking-[0.18em] px-4 mb-3"
            style={{ color: textMuted }}
          >
            WORKSPACE
          </p>

          <div className="flex flex-col gap-1">
            <Link
              href="/dashboard"
              className="flex items-center gap-3 px-4 py-3 rounded-xl transition-colors hover:bg-white/[0.04]"
              style={{ color: textMuted }}
            >
              <Home className="w-[18px] h-[18px]" />
              <span className="text-sm font-medium">Dashboard</span>
            </Link>

            <Link
              href="/dashboard/templates"
              className="flex items-center gap-3 px-4 py-3 rounded-xl"
              style={{
                background: "rgba(232,163,61,0.10)",
                color: textPrimary,
                border: `1px solid rgba(232,163,61,0.16)`,
              }}
            >
              <LayoutTemplate
                className="w-[18px] h-[18px]"
                style={{ color: marigold }}
              />

              <span className="text-sm font-medium">Templates</span>
            </Link>
          </div>
        </div>

        {/* Upgrade */}
        <div
          className="p-4 border-t"
          style={{ borderColor: rule }}
        >
          <Link
            href="/pricing"
            className="flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all hover:-translate-y-0.5"
            style={{
              background: "rgba(232,163,61,0.08)",
              border: "1px solid rgba(232,163,61,0.18)",
              color: marigold,
            }}
          >
            <Crown className="w-5 h-5" />

            <div>
              <p className="text-sm font-semibold">Upgrade to Pro</p>
              <p
                className="font-mono text-[9px] tracking-[0.08em] mt-0.5"
                style={{ color: textMuted }}
              >
                MORE CREATIVE OPTIONS
              </p>
            </div>
          </Link>
        </div>
      </motion.aside>
    </>
  );
}

/* =========================================================
   TEMPLATE DATA
========================================================= */

const TEMPLATE_CATEGORIES = [
  {
    title: "Luxury Product",
    description:
      "Refined layouts for perfume, skincare, jewelry, watches, and premium fashion.",
    templates: LUXURY_VARIATIONS.map((v) => v.name),
  },
  {
    title: "Minimal Product",
    description:
      "Clean, modern compositions for cosmetics, tech, online stores, and fashion.",
    templates: MINIMAL_PRODUCT_VARIATIONS.map((v) => v.name),
  },
  {
    title: "Premium Brand",
    description:
      "Confident layouts for established businesses, salons, restaurants, property, and agencies.",
    templates: PREMIUM_BRAND_VARIATIONS.map((v) => v.name),
  },
];

/* =========================================================
   PREVIEW FRAME
========================================================= */

function TemplatePreview({
  category,
  index,
  templateName,
  campaignImage,
  onUse,
}: {
  category: string;
  index: number;
  templateName: string;
  campaignImage: string | null;
  onUse: () => void;
}) {
  const isLuxury = category === "Luxury Product";
  const isMinimal = category === "Minimal Product";
  const isPremium = category === "Premium Brand";

  return (
    <div className="group">
      {/* Preview */}
      <div
        className="relative w-full overflow-hidden rounded-2xl sm:rounded-3xl"
        style={{
          aspectRatio: "4 / 5",
          background: "#100F0B",
          border: `1px solid ${rule}`,
        }}
      >
        {/* Inner stage
            Keeps the template centered and prevents its dimensions
            from breaking the gallery layout.
        */}
        <div className="absolute inset-[7px] sm:inset-[10px] overflow-hidden rounded-xl sm:rounded-2xl">
          <div
            className="absolute inset-0 flex items-center justify-center overflow-hidden"
            style={{
              background: paper,
            }}
          >
            {isLuxury ? (
              <div className="absolute inset-0">
                <LuxuryProductTemplate
                  {...LUXURY_VARIATIONS[index]}
                  productImage={
                    campaignImage ||
                    LUXURY_VARIATIONS[index].productImage
                  }
                />
              </div>
            ) : isMinimal ? (
              <div className="absolute inset-0">
                <MinimalProductTemplate
                  {...MINIMAL_PRODUCT_VARIATIONS[index]}
                  productImage={
                    campaignImage ||
                    MINIMAL_PRODUCT_VARIATIONS[index].productImage
                  }
                />
              </div>
            ) : isPremium ? (
              <div className="absolute inset-0">
                <PremiumBrandTemplate
                  {...PREMIUM_BRAND_VARIATIONS[index]}
                  productImage={
                    campaignImage ||
                    PREMIUM_BRAND_VARIATIONS[index].productImage
                  }
                />
              </div>
            ) : null}
          </div>
        </div>

        {/* Category label */}
        <div className="absolute top-4 left-4 z-20">
          <span
            className="font-mono text-[9px] sm:text-[10px] tracking-[0.13em] uppercase px-2.5 py-1.5 rounded-full backdrop-blur-md"
            style={{
              background: "rgba(22,20,15,0.72)",
              border: `1px solid rgba(237,230,214,0.16)`,
              color: textPrimary,
            }}
          >
            {category}
          </span>
        </div>

        {/* Hover overlay */}
        <div
          className="absolute inset-0 z-30 flex items-end p-4 sm:p-5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{
            background:
              "linear-gradient(to top, rgba(22,20,15,0.92), rgba(22,20,15,0.05) 65%)",
          }}
        >
          <button
            onClick={onUse}
            className="w-full flex items-center justify-center gap-2 rounded-full py-3 font-semibold text-sm transition-all duration-300 translate-y-3 group-hover:translate-y-0"
            style={{
              background: marigold,
              color: ink,
            }}
          >
            Use this template
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Caption */}
      <div className="pt-3 px-1">
        <div className="flex items-center justify-between gap-3">
          <h3
            className="font-display text-sm sm:text-base font-semibold truncate"
            style={{ color: textPrimary }}
          >
            {templateName}
          </h3>

          <ArrowUpRight
            className="w-4 h-4 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
            style={{ color: marigold }}
          />
        </div>

        <p
          className="font-mono text-[9px] tracking-[0.08em] mt-1"
          style={{ color: textMuted }}
        >
          {category.toUpperCase()}
        </p>
      </div>
    </div>
  );
}

/* =========================================================
   FEATURED TEMPLATE
========================================================= */

function FeaturedTemplate({
  name,
  category,
  templateType,
  data,
  campaignImage,
  onUse,
}: {
  name: string;
  category: string;
  templateType: any;
  data: any;
  campaignImage: string | null;
  onUse: () => void;
}) {
  const TemplateComp = templateType;

  return (
    <div
      className="group rounded-3xl overflow-hidden"
      style={{
        background: panel,
        border: `1px solid ${rule}`,
      }}
    >
      {/* Large preview */}
      <div
        className="relative overflow-hidden"
        style={{
          aspectRatio: "4 / 5",
          background: "#100F0B",
        }}
      >
        <div className="absolute inset-3 sm:inset-4 rounded-2xl overflow-hidden">
          <TemplateComp
            {...data}
            productImage={campaignImage || data.productImage}
          />
        </div>

        {/* Overlay */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-5 sm:p-6"
          style={{
            background:
              "linear-gradient(to top, rgba(22,20,15,0.95), transparent 65%)",
          }}
        >
          <button
            onClick={onUse}
            className="w-full rounded-full py-3.5 font-semibold text-sm flex items-center justify-center gap-2 transition-transform hover:-translate-y-0.5"
            style={{
              background: marigold,
              color: ink,
            }}
          >
            Use this template
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>

        <div className="absolute top-5 left-5 z-20">
          <span
            className="font-mono text-[9px] tracking-[0.13em] px-3 py-1.5 rounded-full"
            style={{
              background: "rgba(22,20,15,0.75)",
              color: textPrimary,
              border: `1px solid rgba(237,230,214,0.15)`,
            }}
          >
            FEATURED
          </span>
        </div>
      </div>

      {/* Information */}
      <div className="p-5 sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p
              className="font-mono text-[9px] tracking-[0.15em]"
              style={{ color: marigold }}
            >
              {category.toUpperCase()}
            </p>

            <h3
              className="font-display text-lg sm:text-xl font-semibold mt-1"
              style={{ color: textPrimary }}
            >
              {name}
            </h3>
          </div>

          <ArrowUpRight
            className="w-5 h-5 shrink-0"
            style={{ color: textMuted }}
          />
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   PAGE
========================================================= */

export default function TemplatesPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [campaignImage, setCampaignImage] = useState<string | null>(null);

  const router = useRouter();

  /* ORIGINAL SESSION STORAGE LOGIC */
  useEffect(() => {
    const saved = sessionStorage.getItem("campaignImage");

    if (saved) {
      const timer = setTimeout(() => {
        setCampaignImage(saved);
      }, 0);

      return () => clearTimeout(timer);
    }
  }, []);

  /* ORIGINAL ROUTING LOGIC */
  const handleUseTemplate = (
    templateName: string,
    categoryName: string
  ) => {
    if (!campaignImage) {
      router.push("/dashboard");
    } else {
      router.push(
        `/dashboard/editor?variant=${encodeURIComponent(
          templateName
        )}&category=${encodeURIComponent(categoryName)}`
      );
    }
  };

  return (
    <>
      <style>{`
        button,
        a,
        label,
        [role="button"] {
          touch-action: manipulation;
        }

        html,
        body {
          overflow-x: hidden;
          max-width: 100%;
          background: ${ink};
        }

        * {
          box-sizing: border-box;
        }

        .template-scroll::-webkit-scrollbar {
          height: 4px;
        }

        .template-scroll::-webkit-scrollbar-track {
          background: transparent;
        }

        .template-scroll::-webkit-scrollbar-thumb {
          background: ${rule};
          border-radius: 999px;
        }
      `}</style>

      <div
        className="min-h-screen flex overflow-x-hidden"
        style={{
          background: ink,
          color: textPrimary,
        }}
      >
        {/* SIDEBAR */}
        <Sidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        {/* MAIN */}
        <main className="flex-1 lg:ml-[270px] min-w-0">
          {/* MOBILE HEADER */}
          <header
            className="lg:hidden sticky top-0 z-40 h-[72px] px-4 flex items-center justify-between backdrop-blur-xl border-b"
            style={{
              background: "rgba(29,26,20,0.92)",
              borderColor: rule,
            }}
          >
            <Link href="/">
              <Logo className="w-8 h-8 rounded-lg" />
            </Link>

            <button
              onClick={() => setSidebarOpen(true)}
              className="p-3 rounded-xl"
              style={{
                color: textPrimary,
                background: "rgba(237,230,214,0.05)",
              }}
              aria-label="Open menu"
            >
              <Menu className="w-5 h-5" />
            </button>
          </header>

          {/* CONTENT */}
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-7 sm:py-10 lg:py-12">
            {/* PAGE HEADER */}
            <div className="max-w-3xl">
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 font-mono text-[10px] tracking-[0.12em] mb-7 transition-opacity hover:opacity-70"
                style={{ color: textMuted }}
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                BACK TO DASHBOARD
              </Link>

              <p
                className="font-mono text-[10px] sm:text-[11px] tracking-[0.2em]"
                style={{ color: marigold }}
              >
                CAMPAIGN TEMPLATES
              </p>

              <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight mt-2 leading-[1.05]">
                Start with a look
                <br className="hidden sm:block" /> that fits your business.
              </h1>

              <p
                className="mt-4 text-sm sm:text-base max-w-2xl leading-relaxed"
                style={{ color: textMuted }}
              >
                Pick a direction, drop in your product, and make it yours.
                Every template is built to keep the message clear and the
                product in focus.
              </p>
            </div>

            {/* CAMPAIGN IMAGE NOTICE */}
            {campaignImage && (
              <div
                className="mt-8 rounded-2xl px-4 py-3.5 flex items-center gap-3"
                style={{
                  background: "rgba(232,163,61,0.07)",
                  border: "1px solid rgba(232,163,61,0.15)",
                }}
              >
                <div
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{ background: marigold }}
                />

                <p
                  className="font-mono text-[10px] sm:text-[11px] tracking-[0.04em]"
                  style={{ color: paperMuted }}
                >
                  YOUR CAMPAIGN PHOTO WILL BE USED IN THE PREVIEW
                </p>
              </div>
            )}

            {/* =====================================================
                FEATURED
            ====================================================== */}

            <section className="mt-12 sm:mt-14">
              <div className="flex items-end justify-between gap-5 mb-6">
                <div>
                  <p
                    className="font-mono text-[10px] tracking-[0.18em]"
                    style={{ color: textMuted }}
                  >
                    A GOOD PLACE TO START
                  </p>

                  <h2 className="font-display text-xl sm:text-2xl font-semibold mt-1">
                    Featured templates
                  </h2>
                </div>
              </div>

              {/* Mobile horizontal scroll.
                  Desktop two-column layout.
              */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6 max-w-4xl">
                {[
                  {
                    name: "Digital Agency",
                    category: "Premium Brand",
                    templateType: PremiumBrandTemplate,
                    data: PREMIUM_BRAND_VARIATIONS.find(
                      (v) => v.name === "Digital Agency"
                    )!,
                  },
                  {
                    name: "Black Gold",
                    category: "Luxury Product",
                    templateType: LuxuryProductTemplate,
                    data: LUXURY_VARIATIONS.find(
                      (v) => v.name === "Black Gold"
                    )!,
                  },
                ].map((item) => (
                  <FeaturedTemplate
                    key={item.name}
                    {...item}
                    campaignImage={campaignImage}
                    onUse={() =>
                      handleUseTemplate(
                        item.name,
                        item.category
                      )
                    }
                  />
                ))}
              </div>
            </section>

            {/* DIVIDER */}
            <div
              className="my-14 sm:my-16"
              style={{
                borderTop: `1px dashed ${rule}`,
              }}
            />

            {/* =====================================================
                ALL TEMPLATE CATEGORIES
            ====================================================== */}

            <div className="space-y-14 sm:space-y-20">
              {TEMPLATE_CATEGORIES.map((category) => (
                <section key={category.title}>
                  {/* Category heading */}
                  <div className="max-w-2xl mb-6 sm:mb-8">
                    <p
                      className="font-mono text-[10px] tracking-[0.17em]"
                      style={{ color: marigold }}
                    >
                      {category.title.toUpperCase()}
                    </p>

                    <h2 className="font-display text-2xl sm:text-3xl font-semibold mt-1">
                      {category.title}
                    </h2>

                    <p
                      className="text-sm mt-2 leading-relaxed"
                      style={{ color: textMuted }}
                    >
                      {category.description}
                    </p>
                  </div>

                  {/* PREVIEWS */}
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-3 sm:gap-x-5 gap-y-8 sm:gap-y-10">
                    {category.templates.map(
                      (templateName, idx) => (
                        <TemplatePreview
                          key={templateName}
                          category={category.title}
                          index={idx}
                          templateName={templateName}
                          campaignImage={campaignImage}
                          onUse={() =>
                            handleUseTemplate(
                              templateName,
                              category.title
                            )
                          }
                        />
                      )
                    )}
                  </div>
                </section>
              ))}
            </div>

            {/* BOTTOM */}
            <div
              className="mt-16 sm:mt-20 pt-7 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
              style={{
                borderTop: `1px dashed ${rule}`,
              }}
            >
              <div>
                <p className="font-display text-sm font-semibold">
                  Can't decide?
                </p>

                <p
                  className="text-xs mt-1"
                  style={{ color: textMuted }}
                >
                  Start with your product photo and choose a style later.
                </p>
              </div>

              <Link
                href="/dashboard"
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full font-semibold text-sm transition-transform hover:-translate-y-0.5"
                style={{
                  background: paper,
                  color: ink,
                }}
              >
                Go to dashboard
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}