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
// ----------------------------------------------------------------------------
// Sized against the @container this element renders inside (cqi), NOT the
// browser viewport (vw). This keeps spacing/type consistent whether the
// flyer is shown full-size in the editor canvas or shrunk into a small
// preview thumbnail. Every measurement in this file uses cq(), not the old
// vw-based px() from @/lib/responsive.
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
   SMALL DESIGN HELPERS
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

  // NOTE: default used to be "Grand Opening", a variant that no longer
  // exists — with no default case in the switch, that produced a blank
  // render (undefined) whenever `name` was missing. Fixed by pointing
  // the fallback at a variant that's actually still here.
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
   CTA
   Leading icon circle (bag) + label + trailing arrow — a two-tone pill
   instead of a flat text button, so it reads as a tappable action rather
   than a label. rounded-2xl (not rounded-full) is deliberate: CTA copy is
   user-editable and can run long ("DM TO ORDER NOW — WE DELIVER TODAY"),
   and a fixed pill radius on wrapped text draws a blob instead of a button.
============================================================================ */

function SmartCTA({
  value,
  editable,
  onUpdate,
  onFocusEl,
  onBlurEl,
  colors,
  rounded = true,
  leadingIcon = false,
}: {
  value: string;
  editable?: boolean;
  onUpdate?: (field: string, value: string) => void;
  onFocusEl?: (el: HTMLElement) => void;
  onBlurEl?: () => void;
  colors: PremiumBrandProps["colors"];
  rounded?: boolean;
  leadingIcon?: boolean;
}) {
  return (
    <div
      className={`inline-flex items-center font-semibold tracking-[0.08em] uppercase ${rounded ? "rounded-2xl" : ""}`}
      style={{
        ...touchTarget,
        paddingLeft: leadingIcon ? cq(1.4) : cq(4.5),
        paddingRight: cq(4.5),
        paddingTop: cq(1.4),
        paddingBottom: cq(1.4),
        gap: cq(2),
        fontSize: cq(1.9),
        lineHeight: 1.3,
        maxWidth: "min(90cqi, 100%)",
        backgroundColor: colors.accent,
        color: colors.primary,
      }}
    >
      {leadingIcon && (
        <span
          className="flex shrink-0 items-center justify-center rounded-full"
          style={{
            width: cq(4.4),
            height: cq(4.4),
            backgroundColor: colors.primary,
            color: colors.accent,
          }}
        >
          <ShoppingBag style={{ width: cq(2), height: cq(2) }} />
        </span>
      )}

      <EditableText
        as="span"
        fieldId="f-cta"
        editable={editable}
        value={value}
        onChange={(v) => onUpdate?.("ctaText", v)}
        onFocusEl={onFocusEl}
        onBlurEl={onBlurEl}
      />
      <span className="opacity-60 shrink-0">→</span>
    </div>
  );
}

/* ============================================================================
   2. DIGITAL AGENCY
============================================================================ */
function VariantDigitalAgency({
  headline, subtext, ctaText, badgeText, extraText, productImage,
  brandName, website, price, phone, email, colors, editable, onUpdate,
  onFocusEl, onBlurEl, whyChooseUs, onUpdateWhyChooseUs, onAddWhyChooseUs,
  onRemoveWhyChooseUs, featuresVisible, whyChooseUsVisible, phoneVisible,
  emailVisible, websiteVisible, onRestoreFeatures, onRestoreWhyChooseUs,
  onRemovePhone, onRemoveEmail, onRemoveWebsite, onRestorePhone,
  onRestoreEmail, onRestoreWebsite,
}: PremiumBrandProps) {
  const parsed = useMemo(
    () => parseFlyerContent(badgeText, extraText),
    [badgeText, extraText]
  );

  return (
    // @container enables cqi units so every child's cq() scales to THIS
    // element's rendered width/height, not the browser window.
    <div
      className="@container w-full h-full relative overflow-hidden font-sans flex flex-col"
      style={{ backgroundColor: colors.primary, color: colors.secondary }}
    >
      {/* The old header — "PREMIUM BRAND" / "SERVICES" — is intentionally
          gone. It duplicated brandName/website with no visual purpose and
          ate the top ~10% of the canvas before the headline even started.
          Website is still fully present, just where it belongs: the
          ContactBar footer, next to phone and email. The body section
          below now owns the full canvas height and centers vertically,
          so removing the header doesn't leave a visible gap. */}

      {/* Body fills the entire canvas top-to-bottom. No overflow-y-auto
          anywhere below — a flyer never scrolls. Instead Features/
          Why-Choose-Us cap how many items render (see slice calls below),
          which is what guarantees this fits without a scrollbar. */}
      <div
        className="flex-1 relative min-h-0"
        style={{ paddingLeft: cq(6), paddingRight: cq(6), paddingTop: cq(5), paddingBottom: cq(5) }}
      >
        {/* Left column: ONE flex column with a single `gap` token driving
            every section's spacing. This replaces the old per-element
            marginTop values — that's what was reading as a "wall" of text
            with no consistent rhythm. Change cq(3.2) below to retune every
            gap in the column at once. */}
        <section
          className="absolute left-0 top-0 bottom-0 w-[52%] flex flex-col justify-center"
          style={{ paddingRight: cq(5), gap: cq(3.2) }}
        >
          <div className="flex items-center shrink-0" style={{ gap: cq(1.5) }}>
            <span className="h-px" style={{ width: cq(3.5), backgroundColor: colors.accent }} />
            <span
              className="uppercase tracking-[0.25em] opacity-45"
              style={{ color: colors.secondary, fontSize: cq(1.65) }}
            >
              {parsed.kicker || brandName || "Services"}
            </span>
          </div>

          {/* Headline: fluid clamp tied to the column (cqi), not vw.
              keep-all + normal wrapping stops mid-word breaks. Long
              headlines shrink instead of blowing up the box. */}
          <h1
            className="font-semibold uppercase tracking-[-0.055em] leading-[0.88] shrink-0"
            style={{
              fontSize: "clamp(1.5rem, 8cqi, 88px)",
              wordBreak: "keep-all",
              overflowWrap: "normal",
            }}
          >
            <EditableHeadlineLines
              value={headline} editable={editable}
              onChange={(v) => onUpdate?.("headline", v)}
              onFocusEl={onFocusEl} onBlurEl={onBlurEl}
              renderLine={(line, index, node) => (
                <span className="block" style={index === 1 ? { color: colors.accent } : undefined}>
                  {node}
                </span>
              )}
            />
          </h1>

          <EditableText
            as="p" fieldId="f-sub" editable={editable} value={subtext}
            onChange={(v) => onUpdate?.("subtext", v)} onFocusEl={onFocusEl} onBlurEl={onBlurEl}
            className="leading-[1.45] opacity-55 max-w-[85%] shrink-0"
            style={{ fontSize: cq(2.15) }}
          />

          {/* Features + Why Choose Us: no wrapper height cap, no scroll.
              Capped to 3 visible items each — a deliberate design ceiling,
              same as Canva/real flyer tools use, so a flyer can never be
              overloaded past what a fixed canvas can hold. Data itself is
              untouched; slice() only affects what renders. */}
          <div className="shrink-0 flex flex-col" style={{ gap: cq(2.4) }}>
            <FeatureList
              features={parsed.features.slice(0, 3)} colors={colors} editable={editable}
              onUpdateFeature={(index, value) => onUpdate?.("badgeText", parsed.updateFeature(index, value))}
              onAddFeature={() => onUpdate?.("badgeText", parsed.addFeature())}
              onRemoveFeature={(index) => onUpdate?.("badgeText", parsed.removeFeature(index))}
              onFocusEl={onFocusEl} onBlurEl={onBlurEl}
              visible={featuresVisible} onRestoreSection={onRestoreFeatures}
            />
            <WhyChooseUsList
              items={whyChooseUs?.slice(0, 3)} colors={colors} editable={editable}
              onUpdate={onUpdateWhyChooseUs} onAdd={onAddWhyChooseUs} onRemove={onRemoveWhyChooseUs}
              onFocusEl={onFocusEl} onBlurEl={onBlurEl}
              visible={whyChooseUsVisible} onRestoreSection={onRestoreWhyChooseUs}
            />
          </div>

          <div className="flex items-end shrink-0" style={{ gap: cq(3) }}>
            {price && (
              <EditableText
                as="p" fieldId="f-price" editable={editable} value={price}
                onChange={(v) => onUpdate?.("price", v)} onFocusEl={onFocusEl} onBlurEl={onBlurEl}
                className="font-semibold tracking-tight" style={{ color: colors.accent, fontSize: cq(5) }}
              />
            )}
            <SmartCTA
              value={ctaText} editable={editable} onUpdate={onUpdate}
              onFocusEl={onFocusEl} onBlurEl={onBlurEl} colors={colors}
              leadingIcon
            />
          </div>
        </section>

        {/* Image column — full-bleed, edge-to-edge, no inset frame. The
            accent circle sits as a corner overlay rather than eating into
            the image's height. website has moved off the old header and
            onto the badge here instead — small, unobtrusive, still legible. */}
        <section className="absolute right-0 top-0 bottom-0 w-[42%] overflow-hidden rounded-[calc(2.5*var(--ci,1cqi))]">
          <Image
            src={productImage}
            alt=""
            fill
            priority
            crossOrigin="anonymous"
            draggable={false}
            className="object-cover"
          />

          {website && (
            <div
              className="absolute top-0 right-0 font-medium tracking-[0.05em]"
              style={{
                padding: `${cq(1.6)} ${cq(2.4)}`,
                fontSize: cq(1.5),
                color: colors.secondary,
                opacity: 0.85,
              }}
            >
              <EditableText
                as="span"
                fieldId="f-web"
                editable={editable}
                value={website}
                onChange={(v) => onUpdate?.("website", v)}
                onFocusEl={onFocusEl}
                onBlurEl={onBlurEl}
              />
            </div>
          )}

          <div
            className="absolute rounded-full"
            style={{ bottom: cq(3), left: cq(3), width: cq(9), height: cq(9), backgroundColor: colors.accent, opacity: 0.92 }}
          />
        </section>
      </div>

      {/* ContactBar sits in normal flow as the true footer (shrink-0, not
          absolute), so it can never overlap content above it. */}
      <div className="shrink-0" style={{ paddingLeft: cq(6), paddingRight: cq(6), paddingBottom: cq(4) }}>
        <ContactBar
          phone={phone} website={website} email={email}
          accentColor={colors.accent} textColor={colors.secondary} editable={editable}
          onUpdatePhone={(v) => onUpdate?.("phone", v)} onUpdateWebsite={(v) => onUpdate?.("website", v)} onUpdateEmail={(v) => onUpdate?.("email", v)}
          onFocusEl={onFocusEl} onBlurEl={onBlurEl}
          phoneVisible={phoneVisible} websiteVisible={websiteVisible} emailVisible={emailVisible}
          onRemovePhone={onRemovePhone} onRemoveWebsite={onRemoveWebsite} onRemoveEmail={onRemoveEmail}
          onRestorePhone={onRestorePhone} onRestoreWebsite={onRestoreWebsite} onRestoreEmail={onRestoreEmail}
        />
      </div>
    </div>
  );
}

/* ============================================================================
   3. PREMIUM GOLD
============================================================================ */
function VariantPremiumGold({
  headline, subtext, ctaText, website, productImage, brandName, price,
  badgeText, extraText, phone, email, colors, editable, onUpdate, onFocusEl,
  onBlurEl, phoneVisible, emailVisible, websiteVisible, onRemovePhone,
  onRemoveEmail, onRemoveWebsite, onRestorePhone, onRestoreEmail, onRestoreWebsite,
}: PremiumBrandProps) {
  return (
    // @container added here too — this variant had the same vw-based
    // sizing risk as Digital Agency, just not visible in your last
    // screenshot because it wasn't the active variant.
    <div
      className="@container w-full h-full relative overflow-hidden font-serif flex flex-col"
      style={{ backgroundColor: colors.primary, color: colors.secondary }}
    >
      <div
        className="absolute pointer-events-none"
        style={{ inset: cq(4), border: `1px solid ${hexToRgba(colors.accent, 0.35)}` }}
      />

      <header className="relative z-20 text-center shrink-0" style={{ paddingTop: cq(6) }}>
        <EditableText
          as="p" fieldId="f-brand" editable={editable} value={brandName ?? ""}
          onChange={(v) => onUpdate?.("brandName", v)} onFocusEl={onFocusEl} onBlurEl={onBlurEl}
          className="uppercase tracking-[0.45em] opacity-55" style={{ fontSize: cq(2.2) }}
        />

        <div className="flex justify-center items-center" style={{ gap: cq(2), marginTop: cq(2) }}>
          <span className="h-px" style={{ width: cq(10), backgroundColor: hexToRgba(colors.accent, 0.4) }} />
          <span className="rotate-45" style={{ width: cq(0.9), height: cq(0.9), backgroundColor: colors.accent }} />
          <span className="h-px" style={{ width: cq(10), backgroundColor: hexToRgba(colors.accent, 0.4) }} />
        </div>
      </header>

      <div
        className="flex-1 relative min-h-0"
        style={{ paddingLeft: cq(8), paddingRight: cq(8), paddingTop: cq(4), paddingBottom: cq(5) }}
      >
        <div className="text-center relative z-20 shrink-0">
          <h1 className="font-medium uppercase tracking-[-0.04em] leading-[0.9]" style={{ fontSize: "clamp(1.4rem, 7.5cqi, 88px)" }}>
            <EditableHeadlineLines
              value={headline} editable={editable}
              onChange={(v) => onUpdate?.("headline", v)}
              onFocusEl={onFocusEl} onBlurEl={onBlurEl}
              renderLine={(line, index, node) => (
                <span className="block" style={index === 1 ? { color: colors.accent } : undefined}>
                  {node}
                </span>
              )}
            />
          </h1>
        </div>

        <div className="relative flex-1" style={{ minHeight: cq(30), marginTop: cq(2), marginBottom: cq(2) }}>
          <Image
            src={productImage}
            alt=""
            fill
            priority
            crossOrigin="anonymous"
            draggable={false}
            className="object-contain"
          />
        </div>

        <div className="shrink-0">
          <div className="w-full h-px" style={{ marginBottom: cq(3), backgroundColor: hexToRgba(colors.accent, 0.25) }} />

          <div className="flex items-end justify-between gap-3">
            <div className="max-w-[55%] min-w-0">
              {price && (
                <EditableText
                  as="p" fieldId="f-price" editable={editable} value={price}
                  onChange={(v) => onUpdate?.("price", v)} onFocusEl={onFocusEl} onBlurEl={onBlurEl}
                  className="font-medium leading-none" style={{ color: colors.accent, fontSize: cq(5.5) }}
                />
              )}
              <EditableText
                as="p" fieldId="f-sub" editable={editable} value={subtext}
                onChange={(v) => onUpdate?.("subtext", v)} onFocusEl={onFocusEl} onBlurEl={onBlurEl}
                className="leading-[1.4] opacity-50" style={{ marginTop: cq(1), fontSize: cq(1.85) }}
              />
            </div>
            <SmartCTA value={ctaText} editable={editable} onUpdate={onUpdate} onFocusEl={onFocusEl} onBlurEl={onBlurEl} colors={colors} rounded={false} />
          </div>

          <div style={{ marginTop: cq(2.5) }}>
            <ContactBar
              phone={phone} website={website} email={email}
              accentColor={colors.accent} textColor={colors.secondary} editable={editable}
              onUpdatePhone={(v) => onUpdate?.("phone", v)} onUpdateWebsite={(v) => onUpdate?.("website", v)} onUpdateEmail={(v) => onUpdate?.("email", v)}
              onFocusEl={onFocusEl} onBlurEl={onBlurEl}
              phoneVisible={phoneVisible} websiteVisible={websiteVisible} emailVisible={emailVisible}
              onRemovePhone={onRemovePhone} onRemoveWebsite={onRemoveWebsite} onRemoveEmail={onRemoveEmail}
              onRestorePhone={onRestorePhone} onRestoreWebsite={onRestoreWebsite} onRestoreEmail={onRestoreEmail}
            />
          </div>
        </div>
      </div>
    </div>
  );
}