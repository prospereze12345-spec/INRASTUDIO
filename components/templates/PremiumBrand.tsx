"use client";

import React, { useMemo } from "react";
import Image from "next/image";
import {
  FeatureList,
  ContactBar,
  parseFlyerContent,
  WhyChooseUsList,
} from "./FlyerContentBlocks";

import { EditableText } from "@/components/EditableText";
import { EditableHeadlineLines } from "@/components/Editableheadlinelines";
import { px, touchTarget } from "@/lib/responsive";

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
   SHARED HEADER
============================================================================ */

function BrandHeader({
  brandName,
  website,
  editable,
  onUpdate,
  onFocusEl,
  onBlurEl,
  colors,
}: Pick<
  PremiumBrandProps,
  "brandName" | "website" | "editable" | "onUpdate" | "onFocusEl" | "onBlurEl" | "colors"
>) {
  return (
    <header
      className="flex items-center justify-between relative z-20"
      style={{ paddingLeft: px(6), paddingRight: px(6), paddingTop: px(5) }}
    >
      <EditableText
        as="p"
        fieldId="f-brand"
        editable={editable}
        value={brandName ?? ""}
        onChange={(v) => onUpdate?.("brandName", v)}
        onFocusEl={onFocusEl}
        onBlurEl={onBlurEl}
        className="font-semibold tracking-[0.18em] uppercase leading-none"
        style={{ color: colors.secondary, fontSize: px(2.25) }}
      />

      {website && (
        <EditableText
          as="p"
          fieldId="f-web"
          editable={editable}
          value={website}
          onChange={(v) => onUpdate?.("website", v)}
          onFocusEl={onFocusEl}
          onBlurEl={onBlurEl}
          className="tracking-[0.08em] leading-none opacity-50"
          style={{ color: colors.secondary, fontSize: px(1.65) }}
        />
      )}
    </header>
  );
}

/* ============================================================================
   CTA
============================================================================ */

function SmartCTA({
  value,
  editable,
  onUpdate,
  onFocusEl,
  onBlurEl,
  colors,
  rounded = true,
}: {
  value: string;
  editable?: boolean;
  onUpdate?: (field: string, value: string) => void;
  onFocusEl?: (el: HTMLElement) => void;
  onBlurEl?: () => void;
  colors: PremiumBrandProps["colors"];
  rounded?: boolean;
}) {
  return (
    <div
      className={`inline-flex items-center font-semibold tracking-[0.08em] uppercase ${rounded ? "rounded-full" : ""}`}
      style={{
        ...touchTarget,
        paddingLeft: px(4.5), paddingRight: px(4.5),
        paddingTop: px(2.4), paddingBottom: px(2.4),
        fontSize: px(2.15),
        backgroundColor: colors.accent,
        color: colors.primary,
      }}
    >
      <EditableText
        as="span"
        fieldId="f-cta"
        editable={editable}
        value={value}
        onChange={(v) => onUpdate?.("ctaText", v)}
        onFocusEl={onFocusEl}
        onBlurEl={onBlurEl}
      />
      <span className="opacity-60" style={{ marginLeft: px(2) }}>→</span>
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
    // 1. @container added — enables cqi units so the headline scales
    //    to THIS column's width, not the viewport.
    <div
      className="@container w-full h-full relative overflow-hidden font-sans flex flex-col"
      style={{ backgroundColor: colors.primary, color: colors.secondary }}
    >
      <BrandHeader
        brandName={brandName} website={website} editable={editable}
        onUpdate={onUpdate} onFocusEl={onFocusEl} onBlurEl={onBlurEl} colors={colors}
      />

      {/* 2. Body is now flex-1 + min-h-0: it fills exactly the space
             between header and canvas edge, and CANNOT overflow it. */}
      <div
        className="flex-1 relative min-h-0"
        style={{ paddingLeft: px(6), paddingRight: px(6), paddingTop: px(3), paddingBottom: px(6) }}
      >
        <div
          className="absolute left-[58%] top-0 bottom-0 w-px"
          style={{ backgroundColor: hexToRgba(colors.secondary, 0.08) }}
        />

        {/* 3. Left column: flex column, full height of its slot, so its
               children can never spill past the visible canvas. */}
        <section
          className="absolute left-0 top-0 bottom-0 w-[52%] flex flex-col"
          style={{ paddingRight: px(5) }}
        >
          <div className="flex items-center shrink-0" style={{ gap: px(1.5), marginBottom: px(2) }}>
            <span className="h-px" style={{ width: px(3.5), backgroundColor: colors.accent }} />
            <span
              className="uppercase tracking-[0.25em] opacity-45"
              style={{ color: colors.secondary, fontSize: px(1.65) }}
            >
              {parsed.kicker || "Services"}
            </span>
          </div>

          {/* 4. Headline: fluid clamp tied to the column (cqi), not vw.
                 keep-all + normal wrapping stops mid-word breaks like
                 "INST / ANTL / Y". Long headlines shrink instead of
                 blowing up the box. shrink-0 keeps it from being
                 squashed by the flex layout. */}
          <h1
            className="font-semibold uppercase tracking-[-0.055em] leading-[0.88] shrink-0"
            style={{
              fontSize: "clamp(1.5rem, 9cqi, 96px)",
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
            style={{ marginTop: px(3), fontSize: px(2.15) }}
          />

          {/* 5. Features + WhyChooseUs get their own scrollable region.
                 flex-1 + min-h-0 means: take remaining space, but if
                 content is genuinely too tall, scroll INSIDE this box
                 instead of pushing the price/CTA/ContactBar off canvas. */}
          <div className="flex-1 min-h-0 overflow-y-auto" style={{ marginTop: px(3) }}>
            <FeatureList
              features={parsed.features} colors={colors} editable={editable}
              onUpdateFeature={(index, value) => onUpdate?.("badgeText", parsed.updateFeature(index, value))}
              onAddFeature={() => onUpdate?.("badgeText", parsed.addFeature())}
              onRemoveFeature={(index) => onUpdate?.("badgeText", parsed.removeFeature(index))}
              onFocusEl={onFocusEl} onBlurEl={onBlurEl}
              visible={featuresVisible} onRestoreSection={onRestoreFeatures}
            />
            <WhyChooseUsList
              items={whyChooseUs} colors={colors} editable={editable}
              onUpdate={onUpdateWhyChooseUs} onAdd={onAddWhyChooseUs} onRemove={onRemoveWhyChooseUs}
              onFocusEl={onFocusEl} onBlurEl={onBlurEl}
              visible={whyChooseUsVisible} onRestoreSection={onRestoreWhyChooseUs}
            />
          </div>

          <div className="flex items-end shrink-0" style={{ marginTop: px(3), gap: px(3) }}>
            {price && (
              <EditableText
                as="p" fieldId="f-price" editable={editable} value={price}
                onChange={(v) => onUpdate?.("price", v)} onFocusEl={onFocusEl} onBlurEl={onBlurEl}
                className="font-semibold tracking-tight" style={{ color: colors.accent, fontSize: px(5) }}
              />
            )}
            <SmartCTA value={ctaText} editable={editable} onUpdate={onUpdate} onFocusEl={onFocusEl} onBlurEl={onBlurEl} colors={colors} />
          </div>
        </section>

        {/* Image column — unchanged, this part was already correct */}
        <section className="absolute right-0 top-0 bottom-[12%] w-[38%]">
          <div className="absolute overflow-hidden" style={{ inset: px(2), borderRadius: px(2) }}>
            <Image src={productImage} alt="" fill priority crossOrigin="anonymous" className="object-cover" />
          </div>
          <div
            className="absolute rounded-full"
            style={{ bottom: px(-2), left: px(-2), width: px(10), height: px(10), backgroundColor: colors.accent, opacity: 0.9 }}
          />
        </section>
      </div>

      {/* 6. ContactBar now sits in normal flow as the true footer,
             (shrink-0, not absolute), so it can never overlap content
             above it — it always sits at the true bottom of the flex
             column, after everything else has taken its space. */}
      <div className="shrink-0">
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
    <div
      className="w-full h-full relative overflow-hidden font-serif"
      style={{ backgroundColor: colors.primary, color: colors.secondary }}
    >
      <div
        className="absolute pointer-events-none"
        style={{ inset: px(4), border: `1px solid ${hexToRgba(colors.accent, 0.35)}` }}
      />

      <header className="relative z-20 text-center" style={{ paddingTop: px(7) }}>
        <EditableText
          as="p" fieldId="f-brand" editable={editable} value={brandName ?? ""}
          onChange={(v) => onUpdate?.("brandName", v)} onFocusEl={onFocusEl} onBlurEl={onBlurEl}
          className="uppercase tracking-[0.45em] opacity-55" style={{ fontSize: px(2.2) }}
        />

        <div className="flex justify-center items-center" style={{ gap: px(2), marginTop: px(2) }}>
          <span className="h-px" style={{ width: px(10), backgroundColor: hexToRgba(colors.accent, 0.4) }} />
          <span className="rotate-45" style={{ width: px(0.9), height: px(0.9), backgroundColor: colors.accent }} />
          <span className="h-px" style={{ width: px(10), backgroundColor: hexToRgba(colors.accent, 0.4) }} />
        </div>
      </header>

      <div className="absolute" style={{ left: px(8), right: px(8), top: px(20), bottom: px(6) }}>
        <div className="text-center relative z-20">
          <h1 className="font-medium uppercase tracking-[-0.04em] leading-[0.9]" style={{ fontSize: px(8) }}>
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

        <div className="absolute inset-x-[8%] top-[15%] bottom-[22%]">
          <Image src={productImage} alt="" fill priority crossOrigin="anonymous" className="object-contain" />
        </div>

        <div className="absolute left-0 right-0 bottom-0">
          <div className="w-full h-px" style={{ marginBottom: px(3), backgroundColor: hexToRgba(colors.accent, 0.25) }} />

          <div className="flex items-end justify-between">
            <div className="max-w-[55%]">
              {price && (
                <EditableText
                  as="p" fieldId="f-price" editable={editable} value={price}
                  onChange={(v) => onUpdate?.("price", v)} onFocusEl={onFocusEl} onBlurEl={onBlurEl}
                  className="font-medium leading-none" style={{ color: colors.accent, fontSize: px(6.2) }}
                />
              )}
              <EditableText
                as="p" fieldId="f-sub" editable={editable} value={subtext}
                onChange={(v) => onUpdate?.("subtext", v)} onFocusEl={onFocusEl} onBlurEl={onBlurEl}
                className="leading-[1.4] opacity-50" style={{ marginTop: px(1), fontSize: px(1.95) }}
              />
            </div>
            <SmartCTA value={ctaText} editable={editable} onUpdate={onUpdate} onFocusEl={onFocusEl} onBlurEl={onBlurEl} colors={colors} rounded={false} />
          </div>

          <div style={{ marginTop: px(2.5) }}>
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