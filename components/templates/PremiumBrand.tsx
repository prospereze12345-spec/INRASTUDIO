"use client";

import React from "react";
import { ShoppingBag } from "lucide-react";

import {
  FeatureList,
  ContactBar,
  WhyChooseUsList,
  type FlyerColors,
} from "./FlyerContentBlocks";

import { EditableText } from "@/components/EditableText";
import { EditableHeadlineLines } from "@/components/Editableheadlinelines";
import { touchTarget } from "@/lib/responsive";

// ============================================================================
// CANVAS SCALE
// ============================================================================

const cq = (n: number) => `calc(var(--ci) * ${n})`;

// ============================================================================
// TYPES
// ============================================================================

export interface PremiumBrandProps {
  name?: string;

  headline: string;
  subtext: string;
  ctaText: string;
  ctaVisible?: boolean;

  badgeText?: string;
  productImage: string;
  brandName?: string;
  website?: string;
  price?: string;
  phone?: string;
  email?: string;

  colors: FlyerColors;

  editable?: boolean;

  onUpdate?: (field: string, value: string) => void;
  onFocusEl?: (el: HTMLElement) => void;
  onBlurEl?: () => void;

  features?: string[];
  whyChooseUs?: string[];

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

  onUpdateFeature?: (index: number, value: string) => void;
  onAddFeature?: () => void;
  onRemoveFeature?: (index: number) => void;

  onUpdateWhyChooseUs?: (index: number, value: string) => void;
  onAddWhyChooseUs?: () => void;
  onRemoveWhyChooseUs?: (index: number) => void;

  extraText?: string;
}

// ============================================================================
// HELPERS
// ============================================================================

function hexToRgba(hex: string, alpha: number): string {
  if (!hex) return `rgba(0,0,0,${alpha})`;

  const value = hex.replace("#", "");
  if (value.length !== 6) return hex;

  const r = parseInt(value.slice(0, 2), 16);
  const g = parseInt(value.slice(2, 4), 16);
  const b = parseInt(value.slice(4, 6), 16);

  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

// ============================================================================
// SUBCOMPONENT — CTA
// ============================================================================

interface SmartCTAProps {
  value: string;
  editable?: boolean;
  onUpdate?: (field: string, value: string) => void;
  onFocusEl?: (el: HTMLElement) => void;
  onBlurEl?: () => void;
  colors: FlyerColors;
}

function SmartCTA({
  value,
  editable,
  onUpdate,
  onFocusEl,
  onBlurEl,
  colors,
}: SmartCTAProps) {
  return (
    <div
      className="inline-flex shrink-0 items-center font-semibold tracking-[0.06em] uppercase rounded-2xl transition-transform hover:scale-[1.02] active:scale-[0.98]"
      style={{
        ...touchTarget,
        paddingLeft: cq(3),
        paddingRight: cq(3.5),
        paddingTop: cq(1.2),
        paddingBottom: cq(1.2),
        gap: cq(1.5),
        fontSize: cq(1.7),
        lineHeight: 1.2,
        maxWidth: "100%",
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

      <span className="opacity-50 shrink-0" style={{ fontSize: cq(1.6) }}>
        →
      </span>
    </div>
  );
}

// ============================================================================
// SUBCOMPONENT — PRODUCT IMAGE
// ============================================================================
//
// Shared by both variants. Any change to product-image rendering — sizes,
// fallback state, badge positioning, or CORS attributes — happens here
// once, for both templates.
//
// ⚠️  DO NOT add crossOrigin="anonymous" to the <img> below.
//
//     Safari applies CORS mode to any <img> that has crossOrigin set,
//     including when its src is a data: URL. Data URLs cannot respond to
//     a CORS request, so Safari fails the load silently — the element
//     stays in the DOM but never gets a bitmap.
//
//     The flyer export pipeline inlines this image to a data: URL before
//     html-to-image captures the node. With crossOrigin set, that inline
//     step produces an empty <img> on Safari, and the exported PNG ends
//     up with a blank product-image slot.
//
//     Chrome ignores CORS mode for data URLs and works either way, which
//     is why the bug only shows up on Safari / iOS.
//
// ============================================================================

interface ProductImageBlockProps {
  productImage: string;
  badgeText?: string;
  colors: FlyerColors;
  /** fontSize for the badge — differs slightly between variants. */
  badgeFontSize: string;
  /** shadow alpha for the badge — differs slightly between variants. */
  badgeShadowAlpha: number;
}

function ProductImageBlock({
  productImage,
  badgeText,
  colors,
  badgeFontSize,
  badgeShadowAlpha,
}: ProductImageBlockProps) {
  return (
    <div
      className="absolute right-0 top-1/2 -translate-y-1/2"
      style={{
        width: "38%",
        height: "74%",
        right: cq(8),
      }}
    >
      <div className="relative w-full h-full">
        {productImage ? (
          <img
            src={productImage}
            alt="Product"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "contain",
            }}
            draggable={false}
          />
        ) : (
          <div
            className="w-full h-full flex items-center justify-center rounded-lg"
            style={{
              backgroundColor: hexToRgba(colors.secondary, 0.08),
              border: `1px dashed ${hexToRgba(colors.secondary, 0.15)}`,
            }}
          >
            <span
              className="text-[11px] font-medium opacity-30"
              style={{ color: colors.secondary }}
            >
              No image
            </span>
          </div>
        )}

        {badgeText && (
          <div
            className="absolute flex items-center justify-center rounded-full text-center font-bold uppercase leading-tight"
            style={{
              top: "6%",
              right: "6%",
              width: "28%",
              aspectRatio: "1 / 1",
              backgroundColor: colors.accent,
              color: colors.primary,
              fontSize: badgeFontSize,
              boxShadow: `0 ${cq(0.5)} ${cq(1.5)} ${hexToRgba(
                colors.accent,
                badgeShadowAlpha
              )}`,
            }}
          >
            {badgeText}
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================================================
// MAIN ENTRY — routes to a variant
// ============================================================================

export function PremiumBrandTemplate(props: PremiumBrandProps) {
  const templateName = props.name || "Digital Agency";

  switch (templateName) {
    case "Digital Agency":
      return <VariantDigitalAgency {...props} />;

    case "Premium Gold":
      return <VariantPremiumGold {...props} />;

    default:
      return <VariantDigitalAgency {...props} />;
  }
}

// ============================================================================
// VARIANT — DIGITAL AGENCY
// ============================================================================

function VariantDigitalAgency({
  headline,
  subtext,
  ctaText,
  ctaVisible = true,
  badgeText,
  productImage,
  website,
  price,
  phone,
  email,
  colors,

  editable = false,

  onUpdate,
  onFocusEl,
  onBlurEl,

  features,
  whyChooseUs,

  featuresVisible = true,
  whyChooseUsVisible = true,

  phoneVisible = true,
  emailVisible = true,
  websiteVisible = true,

  onRestoreFeatures,
  onRestoreWhyChooseUs,

  onRemovePhone,
  onRemoveEmail,
  onRemoveWebsite,

  onRestorePhone,
  onRestoreEmail,
  onRestoreWebsite,

  onUpdateFeature,
  onAddFeature,
  onRemoveFeature,

  onUpdateWhyChooseUs,
  onAddWhyChooseUs,
  onRemoveWhyChooseUs,
}: PremiumBrandProps) {
  const hasFeatures = Array.isArray(features) && features.length > 0;
  const hasWhyChooseUs = Array.isArray(whyChooseUs) && whyChooseUs.length > 0;

  return (
    <div
      className="@container relative flex h-full w-full aspect-[4/5] flex-col overflow-hidden font-sans"
      style={{
        backgroundColor: colors.primary,
        color: colors.secondary,
      }}
    >
      {/* ─── Background dot pattern ────────────────────────────── */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.02]"
        style={{
          backgroundImage: `radial-gradient(circle at 30% 40%, ${colors.accent} 1px, transparent 1px)`,
          backgroundSize: `${cq(2.5)} ${cq(2.5)}`,
        }}
      />

      {/* ─── Header ────────────────────────────────────────────── */}
      <header
        className="relative z-10 flex shrink-0 items-start justify-end"
        style={{
          paddingLeft: cq(8),
          paddingRight: cq(8),
          paddingTop: cq(4),
        }}
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

      {/* ─── Main safe area ───────────────────────────────────── */}
      <div
        className="relative flex-1 min-h-0"
        style={{
          paddingLeft: cq(8),
          paddingRight: cq(8),
          paddingTop: cq(3),
          paddingBottom: cq(4),
        }}
      >
        {/* Left column — headline, subtext, features, why-us, CTA */}
        <section
          className="absolute left-0 top-0 bottom-0 flex flex-col justify-center"
          style={{
            width: "55%",
            paddingLeft: cq(8),
            paddingRight: cq(3),
          }}
        >
          {/* Headline */}
          <h1
            className="font-semibold uppercase tracking-[-0.05em] leading-[0.92]"
            style={{
              fontSize: `clamp(2rem, ${cq(7.4)}, 76px)`,
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

          {/* Subtext */}
          <EditableText
            as="p"
            fieldId="f-sub"
            editable={editable}
            value={subtext}
            onChange={(v) => onUpdate?.("subtext", v)}
            onFocusEl={onFocusEl}
            onBlurEl={onBlurEl}
            className="leading-[1.5] opacity-50 max-w-[82%]"
            style={{
              fontSize: cq(2),
              marginTop: cq(3),
            }}
          />

          {/* Benefit blocks */}
          <div
            className="shrink-0 flex flex-col"
            style={{
              marginTop: cq(3),
              marginBottom: 0,
              gap: cq(3.2),
            }}
          >
            {hasFeatures && (
              <FeatureList
                features={features!.slice(0, 3)}
                colors={colors}
                editable={editable}
                visible={featuresVisible}
                title="FEATURES"
                onUpdateTitle={(v) => onUpdate?.("featuresTitle", v)}
                onUpdateFeature={onUpdateFeature ?? (() => undefined)}
                onAddFeature={onAddFeature ?? (() => undefined)}
                onRemoveFeature={onRemoveFeature ?? (() => undefined)}
                onRestoreSection={onRestoreFeatures}
                onFocusEl={onFocusEl}
                onBlurEl={onBlurEl}
              />
            )}

            {hasWhyChooseUs && (
              <WhyChooseUsList
                items={whyChooseUs!.slice(0, 3)}
                colors={colors}
                editable={editable}
                visible={whyChooseUsVisible}
                title="WHY CHOOSE US"
                onUpdateTitle={(v) => onUpdate?.("whyChooseUsTitle", v)}
                onUpdate={onUpdateWhyChooseUs ?? (() => undefined)}
                onAdd={onAddWhyChooseUs ?? (() => undefined)}
                onRemove={onRemoveWhyChooseUs ?? (() => undefined)}
                onRestoreSection={onRestoreWhyChooseUs}
                onFocusEl={onFocusEl}
                onBlurEl={onBlurEl}
              />
            )}
          </div>

          {/* CTA row */}
          {ctaVisible && (
            <div
              className="flex shrink-0 items-center"
              style={{
                gap: cq(2),
                marginTop: cq(3.5),
                minHeight: cq(7),
              }}
            >
              {price && (
                <EditableText
                  as="p"
                  fieldId="f-price"
                  editable={editable}
                  value={price}
                  onChange={(v) => onUpdate?.("price", v)}
                  onFocusEl={onFocusEl}
                  onBlurEl={onBlurEl}
                  className="shrink-0 font-bold tracking-tight"
                  style={{
                    color: colors.accent,
                    fontSize: cq(4),
                  }}
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
          )}
        </section>

        {/* Right column — product image */}
        <ProductImageBlock
          productImage={productImage}
          badgeText={badgeText}
          colors={colors}
          badgeFontSize={`clamp(0.8rem, ${cq(2.2)}, 2.2rem)`}
          badgeShadowAlpha={0.3}
        />
      </div>

      {/* ─── Footer / contact bar ──────────────────────────────── */}
      <div
        className="relative z-10 shrink-0"
        style={{
          paddingLeft: cq(8),
          paddingRight: cq(8),
          paddingBottom: cq(4),
          paddingTop: cq(1),
        }}
      >
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

// ============================================================================
// VARIANT — PREMIUM GOLD
// ============================================================================

function VariantPremiumGold({
  headline,
  subtext,
  ctaText,
  ctaVisible = true,
  website,
  productImage,
  price,
  badgeText,
  phone,
  email,
  colors,

  editable = false,

  onUpdate,
  onFocusEl,
  onBlurEl,

  features,
  whyChooseUs,

  featuresVisible = true,
  whyChooseUsVisible = true,

  onRestoreFeatures,
  onRestoreWhyChooseUs,

  onUpdateFeature,
  onAddFeature,
  onRemoveFeature,

  onUpdateWhyChooseUs,
  onAddWhyChooseUs,
  onRemoveWhyChooseUs,

  phoneVisible = true,
  emailVisible = true,
  websiteVisible = true,

  onRemovePhone,
  onRemoveEmail,
  onRemoveWebsite,

  onRestorePhone,
  onRestoreEmail,
  onRestoreWebsite,
}: PremiumBrandProps) {
  const hasFeatures = Array.isArray(features) && features.length > 0;
  const hasWhyChooseUs = Array.isArray(whyChooseUs) && whyChooseUs.length > 0;

  return (
    <div
      className="@container relative flex h-full w-full aspect-[4/5] flex-col overflow-hidden font-serif"
      style={{
        backgroundColor: colors.primary,
        color: colors.secondary,
      }}
    >
      {/* ─── Decorative border ─────────────────────────────────── */}
      <div
        className="absolute pointer-events-none"
        style={{
          inset: cq(3.5),
          border: `1px solid ${hexToRgba(colors.accent, 0.2)}`,
          borderRadius: cq(1.5),
        }}
      />

      {/* ─── Grain ─────────────────────────────────────────────── */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.02]"
        style={{
          backgroundImage: `radial-gradient(circle at 50% 50%, ${colors.accent} 1px, transparent 1px)`,
          backgroundSize: `${cq(3)} ${cq(3)}`,
        }}
      />

      {/* ─── Header ornament ───────────────────────────────────── */}
      <header
        className="relative z-20 flex shrink-0 justify-center"
        style={{ paddingTop: cq(4) }}
      >
        <div className="flex items-center justify-center" style={{ gap: cq(1.5) }}>
          <span
            className="h-px"
            style={{
              width: cq(8),
              backgroundColor: hexToRgba(colors.accent, 0.3),
            }}
          />
          <span
            className="rotate-45"
            style={{
              width: cq(0.8),
              height: cq(0.8),
              backgroundColor: colors.accent,
              opacity: 0.5,
            }}
          />
          <span
            className="h-px"
            style={{
              width: cq(8),
              backgroundColor: hexToRgba(colors.accent, 0.3),
            }}
          />
        </div>
      </header>

      {/* ─── Main ──────────────────────────────────────────────── */}
      <div
        className="relative flex-1 min-h-0"
        style={{
          paddingLeft: cq(7),
          paddingRight: cq(7),
          paddingTop: cq(3),
          paddingBottom: cq(4),
        }}
      >
        {/* Headline */}
        <div className="relative z-20 shrink-0 text-center">
          <h1
            className="font-medium uppercase tracking-[-0.04em] leading-[0.9]"
            style={{ fontSize: `clamp(1.9rem, ${cq(7.2)}, 84px)` }}
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

        {/* Product image */}
        <ProductImageBlock
          productImage={productImage}
          badgeText={badgeText}
          colors={colors}
          badgeFontSize={`clamp(0.8rem, ${cq(2)}, 2rem)`}
          badgeShadowAlpha={0.25}
        />

        {/* Benefit blocks — 2-column grid */}
        {(hasFeatures || hasWhyChooseUs) && (
          <div
            className="grid grid-cols-2 text-left"
            style={{
              gap: cq(3),
              marginBottom: cq(3.5),
            }}
          >
            {hasFeatures && (
              <FeatureList
                features={features!.slice(0, 3)}
                colors={colors}
                editable={editable}
                visible={featuresVisible}
                title="FEATURES"
                onUpdateTitle={(v) => onUpdate?.("featuresTitle", v)}
                onUpdateFeature={onUpdateFeature ?? (() => undefined)}
                onAddFeature={onAddFeature ?? (() => undefined)}
                onRemoveFeature={onRemoveFeature ?? (() => undefined)}
                onRestoreSection={onRestoreFeatures}
                onFocusEl={onFocusEl}
                onBlurEl={onBlurEl}
              />
            )}

            {hasWhyChooseUs && (
              <WhyChooseUsList
                items={whyChooseUs!.slice(0, 3)}
                colors={colors}
                editable={editable}
                visible={whyChooseUsVisible}
                title="WHY CHOOSE US"
                onUpdateTitle={(v) => onUpdate?.("whyChooseUsTitle", v)}
                onUpdate={onUpdateWhyChooseUs ?? (() => undefined)}
                onAdd={onAddWhyChooseUs ?? (() => undefined)}
                onRemove={onRemoveWhyChooseUs ?? (() => undefined)}
                onRestoreSection={onRestoreWhyChooseUs}
                onFocusEl={onFocusEl}
                onBlurEl={onBlurEl}
              />
            )}
          </div>
        )}

        {/* Bottom content */}
        <div className="shrink-0">
          {/* Divider */}
          <div
            className="w-full h-px"
            style={{
              marginBottom: cq(2.5),
              backgroundColor: hexToRgba(colors.accent, 0.2),
            }}
          />

          {/* Price / subtext / CTA */}
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
                  style={{
                    color: colors.accent,
                    fontSize: cq(4.5),
                  }}
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
                style={{
                  marginTop: cq(0.8),
                  fontSize: cq(1.7),
                }}
              />
            </div>

            {ctaVisible && (
              <SmartCTA
                value={ctaText}
                editable={editable}
                onUpdate={onUpdate}
                onFocusEl={onFocusEl}
                onBlurEl={onBlurEl}
                colors={colors}
              />
            )}
          </div>

          {/* Contact bar */}
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