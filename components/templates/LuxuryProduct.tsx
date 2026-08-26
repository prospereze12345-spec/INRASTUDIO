"use client";

import React from "react";
import Image from "next/image";
import { EditableText } from "@/components/EditableText";
import { EditableHeadlineLines } from "@/components/Editableheadlinelines";
import { FeatureList, ContactBar, WhyChooseUsList } from "./FlyerContentBlocks";

/* ═══════════════════════════════════════════════════════════════════════════
   TYPES – updated to match editor's FlyerState colors
═══════════════════════════════════════════════════════════════════════════ */

export interface LuxuryProductProps {
  name?: string;                       // variant name ("Noir Editorial" | "Atelier Light")
  headline: string;
  subtext?: string;
  ctaText: string;
  productImage: string;
  imageVersion?: string | number;      // optional cache‑buster
  brandName?: string;
  website?: string;
  phone?: string;
  email?: string;
  // price removed
  features?: string[];
  whyChooseUs?: string[];
  colors: {
    bg: string;       // was primary
    text: string;     // was secondary
    accent: string;   // unchanged
  };
  editable?: boolean;

  // Update callbacks (all strings)
  onUpdate?: (field: string, value: string) => void;

  // Feature list editing
  onUpdateFeature?: (index: number, value: string) => void;

  // WhyChooseUs editing
  onUpdateWhyChooseUs?: (index: number, value: string) => void;

  // Contact editing
  onUpdatePhone?: (value: string) => void;
  onUpdateWebsite?: (value: string) => void;
  onUpdateEmail?: (value: string) => void;

  // Focus/blur
  onFocusEl?: (el: HTMLElement) => void;
  onBlurEl?: () => void;

  // Visibility toggles
  featuresVisible?: boolean;
  whyChooseUsVisible?: boolean;
  phoneVisible?: boolean;
  emailVisible?: boolean;
  websiteVisible?: boolean;

  // Remove handlers
  onRemovePhone?: () => void;
  onRemoveEmail?: () => void;
  onRemoveWebsite?: () => void;
}

/* ─────────────────────────────────────────────────────────────────
   CANVAS SCALE & HELPERS
───────────────────────────────────────────────────────────────── */

const cq = (n: number) => `calc(var(--ci) * ${n})`;

const space = {
  xs: cq(1),
  sm: cq(1.6),
  md: cq(2.4),
  lg: cq(3.6),
};

function hexToRgba(hex: string, alpha: number) {
  if (!hex) return `rgba(0,0,0,${alpha})`;
  const value = hex.replace("#", "");
  if (value.length !== 6) return hex;
  const r = parseInt(value.slice(0, 2), 16);
  const g = parseInt(value.slice(2, 4), 16);
  const b = parseInt(value.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

/* ─────────────────────────────────────────────────────────────────
   CACHE BUSTING
───────────────────────────────────────────────────────────────── */

function withCacheBust(url?: string, version?: string | number) {
  if (!url || !version) return url;
  if (url.startsWith("data:") || url.startsWith("blob:")) return url;
  const separator = url.includes("?") ? "&" : "?";
  return `${url}${separator}v=${encodeURIComponent(String(version))}`;
}

/* ─────────────────────────────────────────────────────────────────
   ENTRY
───────────────────────────────────────────────────────────────── */

export function LuxuryProductTemplate(props: LuxuryProductProps) {
  if (!props.colors) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400 text-sm">
        Loading template...
      </div>
    );
  }

  const { name = "Atelier Light" } = props;
  switch (name) {
    case "Noir Editorial": return <VariantNoirEditorial {...props} />;
    case "Atelier Light":  return <VariantAtelierLight {...props} />;
    default:               return <VariantAtelierLight {...props} />;
  }
}

/* ─────────────────────────────────────────────────────────────────
   IMAGE SAFETY WRAPPER
───────────────────────────────────────────────────────────────── */

function SafeImage({
  src,
  version,
  aspectRatio,
  className,
  style,
}: {
  src?: string;
  version?: string | number;
  aspectRatio: string;
  className?: string;
  style?: React.CSSProperties;
}) {
  const bustedSrc = withCacheBust(src, version);
  return (
    <div className={className} style={{ position: "relative", width: "100%", aspectRatio, ...style }}>
      {bustedSrc ? (
        <Image
          key={bustedSrc}
          src={bustedSrc}
          alt="Product"
          fill
          priority
          unoptimized
          crossOrigin="anonymous"
          className="object-contain object-center"
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center text-xs opacity-30">
          Product image
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────
   FOOTER PANEL (simplified – uses new color keys)
───────────────────────────────────────────────────────────────── */

function ContactFooter({
  colors,
  textColor,
  ...contactProps
}: Omit<React.ComponentProps<typeof ContactBar>, "accentColor" | "textColor"> & {
  colors: LuxuryProductProps["colors"];
  textColor: string;
}) {
  return (
    <div
      className="w-full shrink-0"
      style={{
        marginTop: space.md,
        padding: `${space.sm} ${space.md}`,
        borderRadius: cq(1.2),
        backgroundColor: hexToRgba(colors.accent, 0.06),
        border: `1px solid ${hexToRgba(colors.accent, 0.16)}`,
      }}
    >
      <ContactBar accentColor={colors.accent} textColor={textColor} {...contactProps} />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   1. NOIR EDITORIAL – updated to use colors.bg, .text, .accent, no price
═══════════════════════════════════════════════════════════════════════════ */

const VariantNoirEditorial = ({
  headline,
  subtext,
  ctaText,
  productImage,
  imageVersion,
  brandName,
  // price removed
  colors,
  editable,
  onUpdate,
  onFocusEl,
  onBlurEl,
  features,
  phone,
  email,
  whyChooseUs,
  onUpdateFeature,
  onUpdateWhyChooseUs,
  featuresVisible,
  whyChooseUsVisible,
  phoneVisible,
  emailVisible,
  websiteVisible,
  onRemovePhone,
  onRemoveEmail,
  onRemoveWebsite,
  website,
}: LuxuryProductProps) => {
  const hasFeatures = Array.isArray(features) && features.length > 0;
  const hasWhyChooseUs = Array.isArray(whyChooseUs) && whyChooseUs.length > 0;
  const bustedBg = withCacheBust(productImage, imageVersion);

  return (
    <div
      className="@container w-full h-full relative overflow-hidden flex flex-col font-sans aspect-[4/5]"
      style={{ backgroundColor: colors.bg, color: "#fff" }}
    >
      {/* Background image */}
      <div className="absolute inset-0">
        {bustedBg ? (
          <Image
            key={bustedBg}
            src={bustedBg}
            alt="Product"
            fill
            priority
            unoptimized
            crossOrigin="anonymous"
            className="object-cover object-center"
          />
        ) : (
          <div className="absolute inset-0" style={{ backgroundColor: colors.text }} />
        )}
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(180deg, ${hexToRgba("#000000", 0.55)} 0%, transparent 30%, transparent 52%, ${hexToRgba("#000000", 0.85)} 100%)`,
          }}
        />
      </div>

      {/* Top bar: brand name only */}
      <div className="relative z-10 shrink-0 flex items-center justify-between" style={{ padding: `${space.md} ${space.lg} 0` }}>
        <EditableText as="p" fieldId="f-brand" editable={editable} value={brandName ?? ""}
          onChange={v => onUpdate?.("brandName", v)} onFocusEl={onFocusEl} onBlurEl={onBlurEl}
          className="font-bold uppercase" style={{ fontSize: cq(2), letterSpacing: "0.4em" }} />
      </div>

      {/* Headline */}
      <div className="relative z-10 shrink-0" style={{ padding: `${space.md} ${space.lg}` }}>
        <EditableHeadlineLines value={headline} editable={editable} onFocusEl={onFocusEl} onBlurEl={onBlurEl}
          onChange={v => onUpdate?.("headline", v)}
          renderLine={(line, i, node) => (
            <p
              className="font-black leading-[0.86] tracking-tight"
              style={{
                fontSize: i === 0 ? cq(7.6) : cq(5.2),
                textTransform: i === 1 ? "uppercase" : "none",
                letterSpacing: i === 1 ? "0.14em" : "-0.02em",
                opacity: i === 1 ? 0.75 : 1,
                color: i === 1 ? colors.accent : "#fff",
              }}
            >
              {node}
            </p>
          )} />
      </div>

      <div className="flex-1 min-h-0" />

      {/* Bottom panel */}
      <div
        className="relative z-10 shrink-0 flex flex-col"
        style={{
          padding: `${space.md} ${space.lg}`,
          gap: space.sm,
          backgroundColor: hexToRgba("#000000", 0.5),
          backdropFilter: "blur(10px)",
          borderTop: `1px solid ${hexToRgba("#ffffff", 0.14)}`,
        }}
      >
        <div className="flex items-end justify-between gap-3">
          <div className="min-w-0">
            {/* Price removed */}
            <EditableText as="p" fieldId="f-sub" editable={editable} value={subtext ?? ""}
              onChange={v => onUpdate?.("subtext", v)} onFocusEl={onFocusEl} onBlurEl={onBlurEl}
              className="opacity-70" style={{ fontSize: cq(1.8) }} />
          </div>

          <EditableText as="div" fieldId="f-cta" editable={editable} value={ctaText}
            onChange={v => onUpdate?.("ctaText", v)} onFocusEl={onFocusEl} onBlurEl={onBlurEl}
            className="font-black uppercase shrink-0"
            style={{
              minHeight: "44px", display: "inline-flex", alignItems: "center",
              paddingLeft: cq(3.6), paddingRight: cq(3.6),
              fontSize: cq(1.9), letterSpacing: "0.08em",
              backgroundColor: colors.accent, color: colors.bg,
              borderRadius: "100px",
            }} />
        </div>

        {(hasFeatures || hasWhyChooseUs) && (
          <div className="grid grid-cols-2" style={{ gap: space.md, color: "#fff" }}>
            {hasFeatures && (
              <FeatureList
                features={features!.slice(0, 3)}
                colors={{ ...colors, text: "#fff" }} // override text color for list items
                editable={editable}
                onUpdateFeature={onUpdateFeature ?? (() => undefined)}
                onFocusEl={onFocusEl}
                onBlurEl={onBlurEl}
                visible={featuresVisible}
              />
            )}
            {hasWhyChooseUs && (
              <WhyChooseUsList
                items={whyChooseUs!.slice(0, 3)}
                colors={{ ...colors, text: "#fff" }}
                editable={editable}
                onUpdate={onUpdateWhyChooseUs ?? (() => undefined)}
                onFocusEl={onFocusEl}
                onBlurEl={onBlurEl}
                visible={whyChooseUsVisible}
              />
            )}
          </div>
        )}

        <ContactFooter
          colors={colors}
          textColor="#fff"
          phone={phone}
          website={website}
          email={email}
          editable={editable}
          onUpdatePhone={v => onUpdate?.("phone", v)}
          onUpdateWebsite={v => onUpdate?.("website", v)}
          onUpdateEmail={v => onUpdate?.("email", v)}
          onFocusEl={onFocusEl}
          onBlurEl={onBlurEl}
          phoneVisible={phoneVisible}
          websiteVisible={websiteVisible}
          emailVisible={emailVisible}
          onRemovePhone={onRemovePhone}
          onRemoveWebsite={onRemoveWebsite}
          onRemoveEmail={onRemoveEmail}
        />
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════════════════
   2. ATELIER LIGHT – updated similarly
═══════════════════════════════════════════════════════════════════════════ */

const VariantAtelierLight = ({
  headline,
  subtext,
  ctaText,
  productImage,
  imageVersion,
  brandName,
  // price removed
  colors,
  editable,
  onUpdate,
  onFocusEl,
  onBlurEl,
  features,
  phone,
  email,
  whyChooseUs,
  onUpdateFeature,
  onUpdateWhyChooseUs,
  featuresVisible,
  whyChooseUsVisible,
  phoneVisible,
  emailVisible,
  websiteVisible,
  onRemovePhone,
  onRemoveEmail,
  onRemoveWebsite,
  website,
}: LuxuryProductProps) => {
  const hasFeatures = Array.isArray(features) && features.length > 0;
  const hasWhyChooseUs = Array.isArray(whyChooseUs) && whyChooseUs.length > 0;

  return (
    <div
      className="@container w-full h-full relative overflow-hidden flex flex-col items-center font-sans aspect-[4/5]"
      style={{ backgroundColor: colors.bg, color: colors.text }}
    >
      {/* Brand */}
      <div className="shrink-0 text-center" style={{ paddingTop: space.lg }}>
        <EditableText as="p" fieldId="f-brand" editable={editable} value={brandName ?? ""}
          onChange={v => onUpdate?.("brandName", v)} onFocusEl={onFocusEl} onBlurEl={onBlurEl}
          className="uppercase font-bold opacity-40"
          style={{ fontSize: cq(1.7), letterSpacing: "0.5em" }} />
      </div>

      {/* Product image */}
      <div className="relative shrink-0" style={{ width: "46%", marginTop: space.md }}>
        <div
          className="absolute"
          style={{
            inset: `-${space.sm}`,
            background: `radial-gradient(ellipse at center, ${hexToRgba(colors.accent, 0.14)} 0%, transparent 70%)`,
          }}
        />
        <SafeImage
          src={productImage}
          version={imageVersion}
          aspectRatio="1 / 1"
          className="relative rounded-2xl overflow-hidden"
          style={{
            backgroundColor: hexToRgba(colors.accent, 0.05),
            boxShadow: `0 ${cq(1.6)} ${cq(3)} ${hexToRgba("#000000", 0.12)}`,
          }}
        />
      </div>

      {/* Headline + subtext */}
      <div className="shrink-0 text-center" style={{ marginTop: space.md, padding: `0 ${space.lg}` }}>
        <EditableHeadlineLines value={headline} editable={editable} onFocusEl={onFocusEl} onBlurEl={onBlurEl}
          onChange={v => onUpdate?.("headline", v)}
          renderLine={(line, i, node) => (
            <p
              className="font-black leading-[0.92] tracking-tight"
              style={{
                fontSize: i === 0 ? cq(5) : cq(3.6),
                color: i === 1 ? colors.accent : colors.text,
                opacity: i === 1 ? 0.85 : 1,
              }}
            >
              {node}
            </p>
          )} />

        {subtext !== undefined && (
          <EditableText as="p" fieldId="f-sub" editable={editable} value={subtext}
            onChange={v => onUpdate?.("subtext", v)} onFocusEl={onFocusEl} onBlurEl={onBlurEl}
            className="opacity-55 mx-auto" style={{ fontSize: cq(1.7), marginTop: space.sm, maxWidth: "34ch" }} />
        )}
      </div>

      <div className="flex-1 min-h-0" />

      {/* Features / Why Choose Us (side by side) */}
      {(hasFeatures || hasWhyChooseUs) && (
        <div
          className="shrink-0 grid grid-cols-2 text-left w-full"
          style={{
            padding: `${space.md} ${space.lg}`,
            gap: space.md,
            borderTop: `1px solid ${hexToRgba(colors.accent, 0.18)}`,
          }}
        >
          <div style={{ borderRight: `1px solid ${hexToRgba(colors.accent, 0.18)}`, paddingRight: space.md }}>
            {hasFeatures && (
              <FeatureList
                features={features!.slice(0, 3)}
                colors={colors}
                editable={editable}
                onUpdateFeature={onUpdateFeature ?? (() => undefined)}
                onFocusEl={onFocusEl}
                onBlurEl={onBlurEl}
                visible={featuresVisible}
              />
            )}
          </div>
          <div>
            {hasWhyChooseUs && (
              <WhyChooseUsList
                items={whyChooseUs!.slice(0, 3)}
                colors={colors}
                editable={editable}
                onUpdate={onUpdateWhyChooseUs ?? (() => undefined)}
                onFocusEl={onFocusEl}
                onBlurEl={onBlurEl}
                visible={whyChooseUsVisible}
              />
            )}
          </div>
        </div>
      )}

      {/* Price removed – only CTA remains */}
      <div className="shrink-0 flex items-center justify-center" style={{ gap: space.md, padding: `${space.sm} ${space.lg} 0` }}>
        <EditableText as="span" fieldId="f-cta" editable={editable} value={ctaText}
          onChange={v => onUpdate?.("ctaText", v)} onFocusEl={onFocusEl} onBlurEl={onBlurEl}
          className="font-semibold uppercase"
          style={{
            fontSize: cq(1.7), letterSpacing: "0.1em",
            color: colors.text,
            textDecoration: "underline",
            textUnderlineOffset: "4px",
            textDecorationColor: colors.accent,
          }} />
      </div>

      {/* Contact footer */}
      <div className="shrink-0 w-full" style={{ padding: `${space.sm} ${space.lg} ${space.lg}` }}>
        <ContactFooter
          colors={colors}
          textColor={colors.text}
          phone={phone}
          website={website}
          email={email}
          editable={editable}
          onUpdatePhone={v => onUpdate?.("phone", v)}
          onUpdateWebsite={v => onUpdate?.("website", v)}
          onUpdateEmail={v => onUpdate?.("email", v)}
          onFocusEl={onFocusEl}
          onBlurEl={onBlurEl}
          phoneVisible={phoneVisible}
          websiteVisible={websiteVisible}
          emailVisible={emailVisible}
          onRemovePhone={onRemovePhone}
          onRemoveWebsite={onRemoveWebsite}
          onRemoveEmail={onRemoveEmail}
        />
      </div>
    </div>
  );
};