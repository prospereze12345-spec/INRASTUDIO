"use client";

import React, { useMemo } from "react";
import Image from "next/image";
import { ShoppingBag } from "lucide-react";
import {
  FeatureList,
  ContactBar,
  parseFlyerContent,
  WhyChooseUsList,
} from "./FlyerContentBlocks";

import { EditableText } from "@/components/EditableText";
import { EditableHeadlineLines } from "@/components/Editableheadlinelines";
import { touchTarget } from "@/lib/responsive";

// ============================================================================
// Canvas-relative scale
// ============================================================================

const cq = (n: number) => `clamp(${n * 1.5}px, ${n}cqi, ${n * 12}px)`;

export interface PremiumBrandProps {
  name?: string;
  headline: string;
  subtext: string;
  ctaText: string;
  badgeText?: string;
  extraText?: string;
  productImage: string;
  brandName?: string;
  website?: string;
  price?: string;
  phone?: string;
  email?: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
  };
  editable?: boolean;
  onUpdate?: (field: string, value: string) => void;
  onFocusEl?: (el: HTMLElement) => void;
  onBlurEl?: () => void;
  whyChooseUs?: string[];
  onUpdateWhyChooseUs?: (index: number, value: string) => void;
  onAddWhyChooseUs?: () => void;
  onRemoveWhyChooseUs?: (index: number) => void;
  featuresVisible?: boolean;
  whyChooseUsVisible?: boolean;
  phoneVisible?: boolean;
  emailVisible?: boolean;
  websiteVisible?: boolean;
  onRestoreFeatures?: () => void;
  onRestoreWhyChooseUs?: () => void;
  onRemovePhone?: () => void;
  onRemoveEmail?: () => void;
  onRemoveWebsite?: () => void;
  onRestorePhone?: () => void;
  onRestoreEmail?: () => void;
  onRestoreWebsite?: () => void;
  features?: string[];
  onUpdateFeature?: (index: number, value: string) => void;
  onAddFeature?: () => void;
  onRemoveFeature?: (index: number) => void;
}

/* ============================================================================
   HELPERS
============================================================================ */

function hexToRgba(hex: string, alpha: number) {
  if (!hex) return `rgba(0,0,0,${alpha})`;
  const value = hex.replace("#", "");
  if (value.length !== 6) return hex;
  const r = parseInt(value.slice(0, 2), 16);
  const g = parseInt(value.slice(2, 4), 16);
  const b = parseInt(value.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

/* ============================================================================
   MAIN TEMPLATE
============================================================================ */

export function PremiumBrandTemplate(props: PremiumBrandProps) {
  const { headline, productImage, colors } = props;

  if (!headline || !productImage || !colors) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-neutral-100 text-neutral-400 text-sm">
        Loading template...
      </div>
    );
  }

  const name = props.name || "Digital Agency";

  switch (name) {
    case "Digital Agency":
      return <VariantDigitalAgency {...props} />;
    case "Premium Gold":
      return <VariantPremiumGold {...props} />;
    default:
      return <VariantDigitalAgency {...props} />;
  }
}

/* ============================================================================
   SMART CTA
============================================================================ */

function SmartCTA({
  value,
  editable,
  onUpdate,
  onFocusEl,
  onBlurEl,
  colors,
  compact = false,
}: {
  value: string;
  editable?: boolean;
  onUpdate?: (field: string, value: string) => void;
  onFocusEl?: (el: HTMLElement) => void;
  onBlurEl?: () => void;
  colors: PremiumBrandProps["colors"];
  compact?: boolean;
}) {
  return (
    <div
      className="inline-flex items-center font-semibold tracking-[0.06em] uppercase rounded-2xl transition-all hover:scale-[1.02] active:scale-[0.98]"
      style={{
        ...touchTarget,
        paddingLeft: compact ? cq(2.5) : cq(3.5),
        paddingRight: compact ? cq(3) : cq(4),
        paddingTop: compact ? cq(1) : cq(1.4),
        paddingBottom: compact ? cq(1) : cq(1.4),
        gap: compact ? cq(1.2) : cq(1.8),
        fontSize: compact ? cq(1.5) : cq(1.8),
        lineHeight: 1.2,
        maxWidth: "min(90cqi, 100%)",
        backgroundColor: colors.accent,
        color: colors.primary,
        boxShadow: `0 ${cq(0.6)} ${cq(2)} ${hexToRgba(colors.accent, 0.2)}`,
      }}
    >
      <span
        className="flex shrink-0 items-center justify-center rounded-full"
        style={{
          width: compact ? cq(3.2) : cq(4),
          height: compact ? cq(3.2) : cq(4),
          backgroundColor: colors.primary,
          color: colors.accent,
        }}
      >
        <ShoppingBag style={{ width: compact ? cq(1.6) : cq(2), height: compact ? cq(1.6) : cq(2) }} />
      </span>

      <EditableText
        as="span"
        fieldId="f-cta"
        editable={editable}
        value={value}
        onChange={(v) => onUpdate?.("ctaText", v)}
        onFocusEl={onFocusEl}
        onBlurEl={onBlurEl}
        className="whitespace-nowrap"
      />
      <span className="opacity-50 shrink-0" style={{ fontSize: compact ? cq(1.4) : cq(1.8) }}>→</span>
    </div>
  );
}

/* ============================================================================
   DIGITAL AGENCY — clean, spacious, no brand label
============================================================================ */

function VariantDigitalAgency({
  headline,
  subtext,
  ctaText,
  badgeText,
  extraText,
  productImage,
  brandName,
  website,
  price,
  phone,
  email,
  colors,
  editable,
  onUpdate,
  onFocusEl,
  onBlurEl,
  whyChooseUs,
  onUpdateWhyChooseUs,
  onAddWhyChooseUs,
  onRemoveWhyChooseUs,
  featuresVisible,
  whyChooseUsVisible,
  phoneVisible,
  emailVisible,
  websiteVisible,
  onRestoreFeatures,
  onRestoreWhyChooseUs,
  onRemovePhone,
  onRemoveEmail,
  onRemoveWebsite,
  onRestorePhone,
  onRestoreEmail,
  onRestoreWebsite,
}: PremiumBrandProps) {
  const parsed = useMemo(
    () => parseFlyerContent(badgeText, extraText),
    [badgeText, extraText]
  );

  const featureItems = parsed.features.length > 0 ? parsed.features : ["Fast delivery", "High quality", "Best support"];
  const whyItems = whyChooseUs && whyChooseUs.length > 0 ? whyChooseUs : ["Fast delivery guaranteed", "High quality products", "Best customer service"];

  return (
    <div
      className="@container w-full h-full aspect-[4/5] relative overflow-hidden font-sans flex flex-col"
      style={{ backgroundColor: colors.primary, color: colors.secondary }}
    >
      {/* ── Subtle grain texture ── */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.025]"
        style={{
          backgroundImage: `radial-gradient(circle at 30% 40%, ${colors.accent} 1px, transparent 1px)`,
          backgroundSize: `${cq(2.5)} ${cq(2.5)}`,
        }}
      />

      {/* ── Header ── ONLY website (no brand, no icon) */}
      <header
        className="shrink-0 flex items-start justify-end relative z-10"
        style={{ paddingLeft: cq(6), paddingRight: cq(6), paddingTop: cq(4.5) }}
      >
        {website && (
          <EditableText
            as="span"
            fieldId="f-web-top"
            editable={editable}
            value={website}
            onChange={(v) => onUpdate?.("website", v)}
            onFocusEl={onFocusEl}
            onBlurEl={onBlurEl}
            className="opacity-40 tracking-wide"
            style={{ fontSize: cq(1.5) }}
          />
        )}
      </header>

      {/* ── Main content ── */}
      <div
        className="flex-1 relative min-h-0"
        style={{ paddingLeft: cq(6), paddingRight: cq(6), paddingTop: cq(2), paddingBottom: cq(4.5) }}
      >
        {/* Content column */}
        <section
          className="absolute left-0 top-0 bottom-0 flex flex-col justify-center"
          style={{ width: "54%", paddingRight: cq(5), gap: cq(3) }}
        >
          {/* Headline */}
          <h1
            className="font-semibold uppercase tracking-[-0.05em] leading-[0.88]"
            style={{
              fontSize: "clamp(1.6rem, 8.5cqi, 90px)",
              wordBreak: "keep-all",
              overflowWrap: "normal",
            }}
          >
            <EditableHeadlineLines
              value={headline}
              editable={editable}
              onChange={(v) => onUpdate?.("headline", v)}
              onFocusEl={onFocusEl}
              onBlurEl={onBlurEl}
              renderLine={(line, index, node) => (
                <span
                  className="block"
                  style={index === 1 ? { color: colors.accent } : undefined}
                >
                  {node}
                </span>
              )}
            />
          </h1>

          {/* Subtext */}
          <EditableText
            as="p"
            fieldId="f-sub"
            editable={editable}
            value={subtext}
            onChange={(v) => onUpdate?.("subtext", v)}
            onFocusEl={onFocusEl}
            onBlurEl={onBlurEl}
            className="leading-[1.5] opacity-50 max-w-[80%]"
            style={{ fontSize: cq(2) }}
          />

          {/* Features + Why Choose Us */}
          <div className="flex flex-col" style={{ gap: cq(2.5) }}>
            <FeatureList
              features={featureItems.slice(0, 3)}
              colors={colors}
              editable={editable}
              onUpdateFeature={(index, value) =>
                onUpdate?.("badgeText", parsed.updateFeature(index, value))
              }
              onAddFeature={() => onUpdate?.("badgeText", parsed.addFeature())}
              onRemoveFeature={(index) => onUpdate?.("badgeText", parsed.removeFeature(index))}
              onFocusEl={onFocusEl}
              onBlurEl={onBlurEl}
              visible={featuresVisible}
              onRestoreSection={onRestoreFeatures}
            />

            <WhyChooseUsList
              items={whyItems.slice(0, 3)}
              colors={colors}
              editable={editable}
              onUpdate={onUpdateWhyChooseUs}
              onAdd={onAddWhyChooseUs}
              onRemove={onRemoveWhyChooseUs}
              onFocusEl={onFocusEl}
              onBlurEl={onBlurEl}
              visible={whyChooseUsVisible}
              onRestoreSection={onRestoreWhyChooseUs}
            />
          </div>

          {/* CTA + Price */}
          <div className="flex items-center" style={{ gap: cq(2.5), marginTop: cq(0.5) }}>
            {price && (
              <EditableText
                as="p"
                fieldId="f-price"
                editable={editable}
                value={price}
                onChange={(v) => onUpdate?.("price", v)}
                onFocusEl={onFocusEl}
                onBlurEl={onBlurEl}
                className="font-bold tracking-tight"
                style={{ color: colors.accent, fontSize: cq(4.5) }}
              />
            )}
            <SmartCTA
              value={ctaText}
              editable={editable}
              onUpdate={onUpdate}
              onFocusEl={onFocusEl}
              onBlurEl={onBlurEl}
              colors={colors}
            />
          </div>
        </section>

        {/* Image column — smaller, cleaner */}
        <section
          className="absolute right-0 top-1/2 -translate-y-1/2 overflow-hidden rounded-2xl"
          style={{
            width: "38%",
            height: "72%",
            boxShadow: `0 ${cq(2)} ${cq(4)} ${hexToRgba(colors.secondary, 0.06)}`,
          }}
        >
          <Image
            src={productImage}
            alt=""
            fill
            priority
            crossOrigin="anonymous"
            draggable={false}
            className="object-cover"
          />

          {/* Discount badge — only if present */}
          {parsed.badge && (
            <div
              className="absolute flex items-center justify-center text-center font-bold uppercase leading-tight rounded-full"
              style={{
                top: cq(2.5),
                right: cq(2.5),
                width: cq(8),
                height: cq(8),
                backgroundColor: colors.accent,
                color: colors.primary,
                fontSize: cq(2.2),
                boxShadow: `0 ${cq(0.5)} ${cq(1.5)} ${hexToRgba(colors.accent, 0.3)}`,
              }}
            >
              {parsed.badge}
            </div>
          )}
        </section>
      </div>

      {/* ── Footer / Contact Bar ── */}
      <div className="shrink-0 relative z-10" style={{ paddingLeft: cq(6), paddingRight: cq(6), paddingBottom: cq(3.5) }}>
        <div
          style={{
            paddingTop: cq(1.5),
            paddingBottom: cq(1.5),
            paddingLeft: cq(2.5),
            paddingRight: cq(2.5),
            borderRadius: cq(1.5),
            backgroundColor: hexToRgba(colors.secondary, 0.04),
            border: `1px solid ${hexToRgba(colors.secondary, 0.06)}`,
          }}
        >
          <ContactBar
            phone={phone}
            website={website}
            email={email}
            accentColor={colors.accent}
            textColor={colors.secondary}
            editable={editable}
            onUpdatePhone={(v) => onUpdate?.("phone", v)}
            onUpdateWebsite={(v) => onUpdate?.("website", v)}
            onUpdateEmail={(v) => onUpdate?.("email", v)}
            onFocusEl={onFocusEl}
            onBlurEl={onBlurEl}
            phoneVisible={phoneVisible}
            websiteVisible={websiteVisible}
            emailVisible={emailVisible}
            onRemovePhone={onRemovePhone}
            onRemoveWebsite={onRemoveWebsite}
            onRemoveEmail={onRemoveEmail}
            onRestorePhone={onRestorePhone}
            onRestoreWebsite={onRestoreWebsite}
            onRestoreEmail={onRestoreEmail}
          />
        </div>
      </div>
    </div>
  );
}

/* ============================================================================
   PREMIUM GOLD — clean, no brand label
============================================================================ */

function VariantPremiumGold({
  headline,
  subtext,
  ctaText,
  website,
  productImage,
  brandName,
  price,
  badgeText,
  extraText,
  phone,
  email,
  colors,
  editable,
  onUpdate,
  onFocusEl,
  onBlurEl,
  phoneVisible,
  emailVisible,
  websiteVisible,
  onRemovePhone,
  onRemoveEmail,
  onRemoveWebsite,
  onRestorePhone,
  onRestoreEmail,
  onRestoreWebsite,
}: PremiumBrandProps) {
  const parsed = useMemo(
    () => parseFlyerContent(badgeText, extraText),
    [badgeText, extraText]
  );

  return (
    <div
      className="@container w-full h-full aspect-[4/5] relative overflow-hidden font-serif flex flex-col"
      style={{ backgroundColor: colors.primary, color: colors.secondary }}
    >
      {/* ── Decorative border ── */}
      <div
        className="absolute pointer-events-none"
        style={{
          inset: cq(3.5),
          border: `1px solid ${hexToRgba(colors.accent, 0.2)}`,
          borderRadius: cq(1.5),
        }}
      />

      {/* ── Subtle grain ── */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.02]"
        style={{
          backgroundImage: `radial-gradient(circle at 50% 50%, ${colors.accent} 1px, transparent 1px)`,
          backgroundSize: `${cq(3)} ${cq(3)}`,
        }}
      />

      {/* ── Header ── ONLY decorative line (no brand) */}
      <header className="relative z-20 text-center shrink-0" style={{ paddingTop: cq(5) }}>
        <div className="flex justify-center items-center" style={{ gap: cq(1.5) }}>
          <span className="h-px" style={{ width: cq(8), backgroundColor: hexToRgba(colors.accent, 0.3) }} />
          <span className="rotate-45" style={{ width: cq(0.8), height: cq(0.8), backgroundColor: colors.accent, opacity: 0.5 }} />
          <span className="h-px" style={{ width: cq(8), backgroundColor: hexToRgba(colors.accent, 0.3) }} />
        </div>
      </header>

      {/* ── Main ── */}
      <div
        className="flex-1 relative min-h-0"
        style={{ paddingLeft: cq(7), paddingRight: cq(7), paddingTop: cq(3.5), paddingBottom: cq(4) }}
      >
        {/* Headline */}
        <div className="text-center relative z-20 shrink-0">
          <h1
            className="font-medium uppercase tracking-[-0.04em] leading-[0.9]"
            style={{ fontSize: "clamp(1.4rem, 7.2cqi, 84px)" }}
          >
            <EditableHeadlineLines
              value={headline}
              editable={editable}
              onChange={(v) => onUpdate?.("headline", v)}
              onFocusEl={onFocusEl}
              onBlurEl={onBlurEl}
              renderLine={(line, index, node) => (
                <span
                  className="block"
                  style={index === 1 ? { color: colors.accent } : undefined}
                >
                  {node}
                </span>
              )}
            />
          </h1>
        </div>

        {/* Product Image */}
        <div
          className="relative"
          style={{
            height: "48%",
            marginTop: cq(2.5),
            marginBottom: cq(2),
          }}
        >
          <Image
            src={productImage}
            alt=""
            fill
            priority
            crossOrigin="anonymous"
            draggable={false}
            className="object-contain"
          />

          {parsed.badge && (
            <div
              className="absolute flex items-center justify-center text-center font-bold uppercase leading-tight rounded-full"
              style={{
                top: cq(1.5),
                right: cq(1.5),
                width: cq(7),
                height: cq(7),
                backgroundColor: colors.accent,
                color: colors.primary,
                fontSize: cq(2),
                boxShadow: `0 ${cq(0.5)} ${cq(1.5)} ${hexToRgba(colors.accent, 0.25)}`,
              }}
            >
              {parsed.badge}
            </div>
          )}
        </div>

        {/* Bottom area */}
        <div className="shrink-0">
          <div
            className="w-full h-px"
            style={{
              marginBottom: cq(2.5),
              backgroundColor: hexToRgba(colors.accent, 0.2),
            }}
          />

          <div className="flex items-end justify-between gap-4">
            <div className="max-w-[55%] min-w-0">
              {price && (
                <EditableText
                  as="p"
                  fieldId="f-price"
                  editable={editable}
                  value={price}
                  onChange={(v) => onUpdate?.("price", v)}
                  onFocusEl={onFocusEl}
                  onBlurEl={onBlurEl}
                  className="font-medium leading-none"
                  style={{ color: colors.accent, fontSize: cq(4.5) }}
                />
              )}
              <EditableText
                as="p"
                fieldId="f-sub"
                editable={editable}
                value={subtext}
                onChange={(v) => onUpdate?.("subtext", v)}
                onFocusEl={onFocusEl}
                onBlurEl={onBlurEl}
                className="leading-[1.4] opacity-45"
                style={{ marginTop: cq(0.8), fontSize: cq(1.7) }}
              />
            </div>

            <SmartCTA
              value={ctaText}
              editable={editable}
              onUpdate={onUpdate}
              onFocusEl={onFocusEl}
              onBlurEl={onBlurEl}
              colors={colors}
              compact
            />
          </div>

          {/* Contact */}
          <div style={{ marginTop: cq(2) }}>
            <div
              style={{
                paddingTop: cq(1.2),
                paddingBottom: cq(1.2),
                paddingLeft: cq(2),
                paddingRight: cq(2),
                borderRadius: cq(1.5),
                backgroundColor: hexToRgba(colors.secondary, 0.04),
                border: `1px solid ${hexToRgba(colors.secondary, 0.06)}`,
              }}
            >
              <ContactBar
                phone={phone}
                website={website}
                email={email}
                accentColor={colors.accent}
                textColor={colors.secondary}
                editable={editable}
                onUpdatePhone={(v) => onUpdate?.("phone", v)}
                onUpdateWebsite={(v) => onUpdate?.("website", v)}
                onUpdateEmail={(v) => onUpdate?.("email", v)}
                onFocusEl={onFocusEl}
                onBlurEl={onBlurEl}
                phoneVisible={phoneVisible}
                websiteVisible={websiteVisible}
                emailVisible={emailVisible}
                onRemovePhone={onRemovePhone}
                onRemoveWebsite={onRemoveWebsite}
                onRemoveEmail={onRemoveEmail}
                onRestorePhone={onRestorePhone}
                onRestoreWebsite={onRestoreWebsite}
                onRestoreEmail={onRestoreEmail}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}