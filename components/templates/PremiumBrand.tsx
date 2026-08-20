"use client";

import React from "react";
import Image from "next/image";
import { ShoppingBag } from "lucide-react";
import {
  FeatureList,
  ContactBar,
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
  badgeText?: string;           // now just a string for discount badge
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

  // Direct data from backend
  features?: string[];
  whyChooseUs?: string[];

  // Visibility toggles
  featuresVisible?: boolean;
  whyChooseUsVisible?: boolean;
  phoneVisible?: boolean;
  emailVisible?: boolean;
  websiteVisible?: boolean;

  // Restore callbacks (if needed)
  onRestoreFeatures?: () => void;
  onRestoreWhyChooseUs?: () => void;
  onRemovePhone?: () => void;
  onRemoveEmail?: () => void;
  onRemoveWebsite?: () => void;
  onRestorePhone?: () => void;
  onRestoreEmail?: () => void;
  onRestoreWebsite?: () => void;

  // These are kept for compatibility but we won't parse them
  extraText?: string;
  // Also keep the original feature/why props if they were passed
  onUpdateFeature?: (index: number, value: string) => void;
  onAddFeature?: () => void;
  onRemoveFeature?: (index: number) => void;
  onUpdateWhyChooseUs?: (index: number, value: string) => void;
  onAddWhyChooseUs?: () => void;
  onRemoveWhyChooseUs?: (index: number) => void;
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
   SMART CTA — clean, prominent
============================================================================ */

function SmartCTA({
  value,
  editable,
  onUpdate,
  onFocusEl,
  onBlurEl,
  colors,
}: {
  value: string;
  editable?: boolean;
  onUpdate?: (field: string, value: string) => void;
  onFocusEl?: (el: HTMLElement) => void;
  onBlurEl?: () => void;
  colors: PremiumBrandProps["colors"];
}) {
  return (
    <div
      className="inline-flex items-center font-semibold tracking-[0.06em] uppercase rounded-2xl transition-all hover:scale-[1.02] active:scale-[0.98]"
      style={{
        ...touchTarget,
        paddingLeft: cq(3),
        paddingRight: cq(3.5),
        paddingTop: cq(1.2),
        paddingBottom: cq(1.2),
        gap: cq(1.5),
        fontSize: cq(1.7),
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
          width: cq(3.5),
          height: cq(3.5),
          backgroundColor: colors.primary,
          color: colors.accent,
        }}
      >
        <ShoppingBag style={{ width: cq(1.8), height: cq(1.8) }} />
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
      <span className="opacity-50 shrink-0" style={{ fontSize: cq(1.6) }}>→</span>
    </div>
  );
}

/* ============================================================================
   DIGITAL AGENCY — uses direct props, no parsing
============================================================================ */

function VariantDigitalAgency({
  headline,
  subtext,
  ctaText,
  badgeText,
  productImage,
  website,
  price,
  phone,
  email,
  colors,
  editable,
  onUpdate,
  onFocusEl,
  onBlurEl,
  features,
  whyChooseUs,
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
  // Use directly provided arrays, fallback to defaults if empty
  const featureItems =
    features && features.length > 0
      ? features
      : ["Fast delivery", "High quality", "Best support"];

  const whyItems =
    whyChooseUs && whyChooseUs.length > 0
      ? whyChooseUs
      : ["Fast delivery guaranteed", "High quality products", "Best customer service"];

  // Badge comes straight from badgeText
  const badge = badgeText || null;

  // Always hide add/remove controls in the lists
  const listEditable = false;

  return (
    <div
      className="@container w-full h-full aspect-[4/5] relative overflow-hidden font-sans flex flex-col"
      style={{ backgroundColor: colors.primary, color: colors.secondary }}
    >
      {/* Subtle grain texture */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.02]"
        style={{
          backgroundImage: `radial-gradient(circle at 30% 40%, ${colors.accent} 1px, transparent 1px)`,
          backgroundSize: `${cq(2.5)} ${cq(2.5)}`,
        }}
      />

      {/* Header – only website */}
      <header
        className="shrink-0 flex items-start justify-end relative z-10"
        style={{ paddingLeft: cq(7), paddingRight: cq(7), paddingTop: cq(3) }}
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

      {/* Main content */}
      <div
        className="flex-1 relative min-h-0"
        style={{ paddingLeft: cq(7), paddingRight: cq(7), paddingTop: cq(1.5), paddingBottom: cq(4) }}
      >
        {/* Left column: content */}
        <section
          className="absolute left-0 top-0 bottom-0 flex flex-col justify-center"
          style={{ width: "55%", paddingRight: cq(5), gap: cq(2.5) }}
        >
          <h1
            className="font-semibold uppercase tracking-[-0.05em] leading-[0.88]"
            style={{
              fontSize: "clamp(1.6rem, 8.5cqi, 90px)",
              wordBreak: "keep-all",
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

          <div className="flex flex-col" style={{ gap: cq(2) }}>
            <FeatureList
              features={featureItems.slice(0, 3)}
              colors={colors}
              editable={listEditable}
              visible={featuresVisible}
              title="FEATURES"
              onUpdateTitle={() => {}}
              onUpdateFeature={() => {}}
              onAddFeature={() => {}}
              onRemoveFeature={() => {}}
              onRestoreSection={onRestoreFeatures}
              onFocusEl={onFocusEl}
              onBlurEl={onBlurEl}
            />

            <WhyChooseUsList
              items={whyItems.slice(0, 3)}
              colors={colors}
              editable={listEditable}
              visible={whyChooseUsVisible}
              title="WHY CHOOSE US"
              onUpdateTitle={() => {}}
              onUpdate={() => {}}
              onAdd={() => {}}
              onRemove={() => {}}
              onRestoreSection={onRestoreWhyChooseUs}
              onFocusEl={onFocusEl}
              onBlurEl={onBlurEl}
            />
          </div>

          <div className="flex items-center" style={{ gap: cq(2), marginTop: cq(0.5) }}>
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
                style={{ color: colors.accent, fontSize: cq(4) }}
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

        {/* Right column: Image */}
        <section
          className="absolute right-0 top-1/2 -translate-y-1/2 overflow-hidden rounded-2xl"
          style={{
            width: "40%",
            height: "78%",
            boxShadow: `0 ${cq(2)} ${cq(4)} ${hexToRgba(colors.secondary, 0.05)}`,
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

          {badge && (
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
              {badge}
            </div>
          )}
        </section>
      </div>

      {/* Footer – solid contact bar */}
      <div className="shrink-0 relative z-10" style={{ paddingLeft: cq(7), paddingRight: cq(7), paddingBottom: cq(3.5) }}>
        <div
          style={{
            paddingTop: cq(1.5),
            paddingBottom: cq(1.5),
            paddingLeft: cq(2.5),
            paddingRight: cq(2.5),
            borderRadius: cq(1.5),
            backgroundColor: colors.primary,
            border: `1px solid ${hexToRgba(colors.secondary, 0.08)}`,
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
   PREMIUM GOLD — same direct‑props approach
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
  return (
    <div
      className="@container w-full h-full aspect-[4/5] relative overflow-hidden font-serif flex flex-col"
      style={{ backgroundColor: colors.primary, color: colors.secondary }}
    >
      {/* Decorative border */}
      <div
        className="absolute pointer-events-none"
        style={{
          inset: cq(3.5),
          border: `1px solid ${hexToRgba(colors.accent, 0.2)}`,
          borderRadius: cq(1.5),
        }}
      />

      {/* Subtle grain */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.02]"
        style={{
          backgroundImage: `radial-gradient(circle at 50% 50%, ${colors.accent} 1px, transparent 1px)`,
          backgroundSize: `${cq(3)} ${cq(3)}`,
        }}
      />

      {/* Header line */}
      <header className="relative z-20 text-center shrink-0" style={{ paddingTop: cq(4) }}>
        <div className="flex justify-center items-center" style={{ gap: cq(1.5) }}>
          <span className="h-px" style={{ width: cq(8), backgroundColor: hexToRgba(colors.accent, 0.3) }} />
          <span className="rotate-45" style={{ width: cq(0.8), height: cq(0.8), backgroundColor: colors.accent, opacity: 0.5 }} />
          <span className="h-px" style={{ width: cq(8), backgroundColor: hexToRgba(colors.accent, 0.3) }} />
        </div>
      </header>

      {/* Main */}
      <div
        className="flex-1 relative min-h-0"
        style={{ paddingLeft: cq(7), paddingRight: cq(7), paddingTop: cq(3), paddingBottom: cq(4) }}
      >
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

          {badgeText && (
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
              {badgeText}
            </div>
          )}
        </div>

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
            />
          </div>

          <div style={{ marginTop: cq(2) }}>
            <div
              style={{
                paddingTop: cq(1.2),
                paddingBottom: cq(1.2),
                paddingLeft: cq(2),
                paddingRight: cq(2),
                borderRadius: cq(1.5),
                backgroundColor: colors.primary,
                border: `1px solid ${hexToRgba(colors.secondary, 0.08)}`,
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