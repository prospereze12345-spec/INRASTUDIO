import React from "react";
import Image from "next/image";
import { EditableText } from "@/components/EditableText";
import { EditableHeadlineLines } from "@/components/Editableheadlinelines";

export interface SleekFlyerProps {
  name?: string;
  headline: string;
  subheadline?: string;
  tagline?: string;
  ctaText: string;
  productImage: string;
  brandName?: string;
  website?: string;
  price?: string;
  badge?: string;
  colors: {
    primary: string;    // background
    secondary: string;  // text / foreground
    accent: string;     // highlight color
  };
  editable?: boolean;
  /** field is one of: brandName | headline | subtext | ctaText | website | price | badgeText | tagline
   *  Note: this template's own props are named `subheadline`/`badge`, but onUpdate always
   *  reports back using the canonical FlyerState field names ("subtext" / "badgeText") so the
   *  editor's state stays consistent no matter which template family is on screen. */
  onUpdate?: (field: string, value: string) => void;
  onFocusEl?: (el: HTMLElement) => void;
  onBlurEl?: () => void;
}

export function SleekFlyerTemplate(props: SleekFlyerProps) {
  const { name = "Mono Split" } = props;

  switch (name) {
    case "Mono Split":      return <VariantMonoSplit {...props} />;
    case "Editorial Arc":   return <VariantEditorialArc {...props} />;
    case "Negative Space":  return <VariantNegativeSpace {...props} />;
    case "Studio Grid":     return <VariantStudioGrid {...props} />;
    case "Kōan":            return <VariantKoan {...props} />;
    default:                return <VariantMonoSplit {...props} />;
  }
}

/* ─────────────────────────────────────────────────────────────
   1. MONO SPLIT
───────────────────────────────────────────────────────────── */
const VariantMonoSplit = ({
  headline, subheadline, ctaText,
  productImage, brandName, website, price, colors,
  editable, onUpdate, onFocusEl, onBlurEl,
}: SleekFlyerProps) => (
  <div
    className="@container w-full h-full relative overflow-hidden flex flex-row font-sans"
    style={{ backgroundColor: colors.primary, color: colors.secondary }}
  >
    <div className="relative overflow-hidden" style={{ width: "55%", height: "100%" }}>
      <Image src={productImage} alt="Product" fill className="object-cover object-center" crossOrigin="anonymous" />
      <div className="absolute inset-0 pointer-events-none" style={{ background: `linear-gradient(to right, transparent 60%, ${colors.primary}CC 100%)` }} />
    </div>

    <div className="flex flex-col justify-between relative z-10" style={{ width: "45%", height: "100%", backgroundColor: colors.primary, padding: "7cqi 6cqi 7cqi 5cqi" }}>
      <div className="flex items-center justify-between">
        <EditableText as="span" fieldId="f-brand" editable={editable} value={brandName ?? ""}
          onChange={v => onUpdate?.("brandName", v)} onFocusEl={onFocusEl} onBlurEl={onBlurEl}
          style={{ fontSize: "2.2cqi", fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase", opacity: 0.45, color: colors.secondary }} />
        <div style={{ width: "1.8cqi", height: "1.8cqi", borderRadius: "50%", backgroundColor: colors.accent }} />
      </div>

      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", gap: "3cqi" }}>
        <div style={{ width: "8cqi", height: "0.3cqi", backgroundColor: colors.accent, marginBottom: "1cqi" }} />
        <h1 style={{ fontSize: "clamp(24px, 11cqi, 96px)", fontWeight: 800, lineHeight: 0.92, letterSpacing: "-0.03em", color: colors.secondary, margin: 0, fontFamily: "-apple-system, 'SF Pro Display', 'Helvetica Neue', sans-serif" }}>
          <EditableHeadlineLines value={headline} editable={editable} onFocusEl={onFocusEl} onBlurEl={onBlurEl}
            onChange={v => onUpdate?.("headline", v)}
            renderLine={(line, i, node) => <span style={{ display: "block" }}>{node}</span>} />
        </h1>
        {subheadline !== undefined && (
          <EditableText as="p" fieldId="f-sub" editable={editable} value={subheadline}
            onChange={v => onUpdate?.("subtext", v)} onFocusEl={onFocusEl} onBlurEl={onBlurEl}
            style={{ fontSize: "2.6cqi", lineHeight: 1.5, color: colors.secondary, opacity: 0.55, margin: 0, maxWidth: "28ch", fontWeight: 400 }} />
        )}
        {price !== undefined && price !== "" && (
          <div style={{ display: "inline-flex", alignItems: "baseline", gap: "0.8cqi", marginTop: "1cqi" }}>
            <EditableText as="span" fieldId="f-price" editable={editable} value={price}
              onChange={v => onUpdate?.("price", v)} onFocusEl={onFocusEl} onBlurEl={onBlurEl}
              style={{ fontSize: "7cqi", fontWeight: 700, letterSpacing: "-0.04em", color: colors.secondary }} />
          </div>
        )}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "2.5cqi" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: "2cqi", backgroundColor: colors.secondary, color: colors.primary, padding: "2.2cqi 4cqi", borderRadius: "100px", fontSize: "2.4cqi", fontWeight: 600, letterSpacing: "0.02em", width: "fit-content" }}>
          <EditableText as="span" fieldId="f-cta" editable={editable} value={ctaText}
            onChange={v => onUpdate?.("ctaText", v)} onFocusEl={onFocusEl} onBlurEl={onBlurEl} />
          <svg width="1.4cqi" height="1.4cqi" viewBox="0 0 12 12" fill="currentColor">
            <path d="M2 6h8M6 2l4 4-4 4" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
          </svg>
        </div>
        {website !== undefined && (
          <EditableText as="span" fieldId="f-web" editable={editable} value={website}
            onChange={v => onUpdate?.("website", v)} onFocusEl={onFocusEl} onBlurEl={onBlurEl}
            style={{ fontSize: "1.8cqi", letterSpacing: "0.12em", opacity: 0.3, textTransform: "lowercase", color: colors.secondary }} />
        )}
      </div>
    </div>
  </div>
);


/* ─────────────────────────────────────────────────────────────
   2. EDITORIAL ARC
───────────────────────────────────────────────────────────── */
const VariantEditorialArc = ({
  headline, subheadline, ctaText,
  productImage, brandName, website, price, badge, colors,
  editable, onUpdate, onFocusEl, onBlurEl,
}: SleekFlyerProps) => {
  const lines = headline.split('\n');
  const line0 = lines[0] ?? "";
  const line1 = lines[1] ?? "";

  return (
    <div
      className="@container w-full h-full relative overflow-hidden flex flex-col font-sans"
      style={{ backgroundColor: colors.primary, color: colors.secondary }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "5cqi 6cqi 0", position: "relative", zIndex: 20 }}>
        <EditableText as="span" fieldId="f-brand" editable={editable} value={brandName ?? ""}
          onChange={v => onUpdate?.("brandName", v)} onFocusEl={onFocusEl} onBlurEl={onBlurEl}
          style={{ fontSize: "2cqi", fontWeight: 700, letterSpacing: "0.25em", textTransform: "uppercase", color: colors.secondary, opacity: 0.5 }} />
        {badge && (
          <EditableText as="span" fieldId="f-badge" editable={editable} value={badge}
            onChange={v => onUpdate?.("badgeText", v)} onFocusEl={onFocusEl} onBlurEl={onBlurEl}
            style={{ fontSize: "1.8cqi", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: colors.accent, border: `0.15cqi solid ${colors.accent}`, padding: "0.8cqi 2.5cqi", borderRadius: "100px" }} />
        )}
      </div>

      <div style={{ padding: "2cqi 6cqi 0", position: "relative", zIndex: 5, lineHeight: 0.82 }}>
        <h1 style={{ fontSize: "clamp(32px, 18cqi, 160px)", fontWeight: 900, letterSpacing: "-0.04em", color: colors.secondary, margin: 0, fontFamily: "-apple-system, 'SF Pro Display', 'Helvetica Neue', sans-serif" }}>
          <EditableText as="span" fieldId="f-headline-0" editable={editable} value={line0}
            onChange={v => onUpdate?.("headline", [v, line1].join('\n'))}
            onFocusEl={onFocusEl} onBlurEl={onBlurEl} />
        </h1>
        {line1 && (
          <h1 style={{ fontSize: "clamp(32px, 18cqi, 160px)", fontWeight: 900, letterSpacing: "-0.04em", color: "transparent", WebkitTextStroke: `0.15cqi ${colors.secondary}`, margin: 0, fontFamily: "-apple-system, 'SF Pro Display', 'Helvetica Neue', sans-serif", opacity: 0.2 }}>
            <EditableText as="span" fieldId="f-headline-1" editable={editable} value={line1}
              onChange={v => onUpdate?.("headline", [line0, v].join('\n'))}
              onFocusEl={onFocusEl} onBlurEl={onBlurEl} />
          </h1>
        )}
      </div>

      <div style={{ flex: 1, position: "relative", zIndex: 15, margin: "-4cqi 0 0" }}>
        <Image src={productImage} alt="Product" fill className="object-contain object-bottom"
          style={{ transform: "scale(1.05)", transformOrigin: "bottom center" }} crossOrigin="anonymous" />
      </div>

      <div style={{ position: "absolute", bottom: "-15cqi", left: "-10%", width: "120%", height: "45cqi", backgroundColor: colors.accent, borderRadius: "50% 50% 0 0", zIndex: 10 }} />

      <div style={{ position: "absolute", bottom: "6cqi", left: 0, right: 0, zIndex: 20, display: "flex", justifyContent: "space-between", alignItems: "flex-end", padding: "0 7cqi" }}>
        <div>
          {subheadline !== undefined && (
            <EditableText as="p" fieldId="f-sub" editable={editable} value={subheadline}
              onChange={v => onUpdate?.("subtext", v)} onFocusEl={onFocusEl} onBlurEl={onBlurEl}
              style={{ fontSize: "2.5cqi", color: colors.primary, margin: "0 0 1cqi", opacity: 0.8, fontWeight: 400, maxWidth: "26ch", lineHeight: 1.4 }} />
          )}
          {price !== undefined && price !== "" && (
            <EditableText as="span" fieldId="f-price" editable={editable} value={price}
              onChange={v => onUpdate?.("price", v)} onFocusEl={onFocusEl} onBlurEl={onBlurEl}
              style={{ fontSize: "8cqi", fontWeight: 800, letterSpacing: "-0.04em", color: colors.primary }} />
          )}
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: "2.8cqi", fontWeight: 700, color: colors.primary, letterSpacing: "0.04em", marginBottom: "0.8cqi" }}>
            <EditableText as="span" fieldId="f-cta" editable={editable} value={ctaText}
              onChange={v => onUpdate?.("ctaText", v)} onFocusEl={onFocusEl} onBlurEl={onBlurEl} /> →
          </div>
          {website !== undefined && (
            <EditableText as="div" fieldId="f-web" editable={editable} value={website}
              onChange={v => onUpdate?.("website", v)} onFocusEl={onFocusEl} onBlurEl={onBlurEl}
              style={{ fontSize: "1.8cqi", color: colors.primary, opacity: 0.5 }} />
          )}
        </div>
      </div>
    </div>
  );
};


/* ─────────────────────────────────────────────────────────────
   3. NEGATIVE SPACE
───────────────────────────────────────────────────────────── */
const VariantNegativeSpace = ({
  headline, subheadline, tagline, ctaText,
  productImage, brandName, website, price, colors,
  editable, onUpdate, onFocusEl, onBlurEl,
}: SleekFlyerProps) => (
  <div
    className="@container w-full h-full relative overflow-hidden flex flex-col font-sans"
    style={{ backgroundColor: colors.primary, color: colors.secondary }}
  >
    <div style={{ height: "0.6cqi", backgroundColor: colors.accent, width: "100%", flexShrink: 0 }} />

    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "4cqi 6cqi", flexShrink: 0 }}>
      <EditableText as="span" fieldId="f-brand" editable={editable} value={brandName ?? ""}
        onChange={v => onUpdate?.("brandName", v)} onFocusEl={onFocusEl} onBlurEl={onBlurEl}
        style={{ fontSize: "2.2cqi", fontWeight: 800, letterSpacing: "0.18em", textTransform: "uppercase", color: colors.secondary }} />
      {tagline !== undefined && (
        <EditableText as="span" fieldId="f-tagline" editable={editable} value={tagline}
          onChange={v => onUpdate?.("tagline", v)} onFocusEl={onFocusEl} onBlurEl={onBlurEl}
          style={{ fontSize: "2cqi", fontWeight: 400, color: colors.secondary, opacity: 0.35, letterSpacing: "0.06em" }} />
      )}
    </div>

    <div style={{ flex: 1, position: "relative", margin: "0 8cqi" }}>
      <Image src={productImage} alt="Product" fill className="object-contain"
        style={{ filter: "drop-shadow(0 8cqi 6cqi rgba(0,0,0,0.08))" }} crossOrigin="anonymous" />
    </div>

    <div style={{ flexShrink: 0, padding: "0 6cqi 5cqi", display: "flex", flexDirection: "column", gap: "2cqi" }}>
      <div style={{ height: "0.08cqi", backgroundColor: colors.secondary, opacity: 0.1, marginBottom: "1cqi" }} />

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
        <div>
          <h2 style={{ fontSize: "clamp(18px, 8cqi, 72px)", fontWeight: 700, letterSpacing: "-0.025em", color: colors.secondary, margin: 0, lineHeight: 0.95, fontFamily: "-apple-system, 'SF Pro Display', 'Helvetica Neue', sans-serif" }}>
            <EditableHeadlineLines value={headline} editable={editable} onFocusEl={onFocusEl} onBlurEl={onBlurEl}
              onChange={v => onUpdate?.("headline", v)}
              renderLine={(line, i, node) => <span style={{ display: "block" }}>{node}</span>} />
          </h2>
          {subheadline !== undefined && (
            <EditableText as="p" fieldId="f-sub" editable={editable} value={subheadline}
              onChange={v => onUpdate?.("subtext", v)} onFocusEl={onFocusEl} onBlurEl={onBlurEl}
              style={{ fontSize: "2.2cqi", color: colors.secondary, opacity: 0.5, margin: "1.5cqi 0 0", fontWeight: 400, lineHeight: 1.5, maxWidth: "30ch" }} />
          )}
        </div>

        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "2cqi", flexShrink: 0 }}>
          {price !== undefined && price !== "" && (
            <EditableText as="span" fieldId="f-price" editable={editable} value={price}
              onChange={v => onUpdate?.("price", v)} onFocusEl={onFocusEl} onBlurEl={onBlurEl}
              style={{ fontSize: "6cqi", fontWeight: 700, letterSpacing: "-0.03em", color: colors.accent }} />
          )}
          <EditableText as="div" fieldId="f-cta" editable={editable} value={ctaText}
            onChange={v => onUpdate?.("ctaText", v)} onFocusEl={onFocusEl} onBlurEl={onBlurEl}
            style={{ border: `0.15cqi solid ${colors.secondary}`, padding: "1.8cqi 4.5cqi", fontSize: "2.2cqi", fontWeight: 600, letterSpacing: "0.06em", color: colors.secondary, borderRadius: "100px", whiteSpace: "nowrap" }} />
          {website !== undefined && (
            <EditableText as="span" fieldId="f-web" editable={editable} value={website}
              onChange={v => onUpdate?.("website", v)} onFocusEl={onFocusEl} onBlurEl={onBlurEl}
              style={{ fontSize: "1.6cqi", opacity: 0.25, letterSpacing: "0.1em", color: colors.secondary }} />
          )}
        </div>
      </div>
    </div>
  </div>
);


/* ─────────────────────────────────────────────────────────────
   4. STUDIO GRID
───────────────────────────────────────────────────────────── */
const VariantStudioGrid = ({
  headline, subheadline, ctaText,
  productImage, brandName, website, price, badge, colors,
  editable, onUpdate, onFocusEl, onBlurEl,
}: SleekFlyerProps) => (
  <div
    className="@container w-full h-full relative overflow-hidden font-sans"
    style={{ backgroundColor: colors.primary, color: colors.secondary }}
  >
    <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%) rotate(-20deg)", fontSize: "40cqi", fontWeight: 900, letterSpacing: "-0.05em", color: colors.secondary, opacity: 0.03, whiteSpace: "nowrap", pointerEvents: "none", zIndex: 0, userSelect: "none" }}>
      {headline.split("\n")[0]}
    </div>

    <div style={{ position: "absolute", top: "33.33%", left: 0, right: 0, height: "0.08cqi", backgroundColor: colors.secondary, opacity: 0.08, zIndex: 5 }} />
    <div style={{ position: "absolute", top: 0, bottom: 0, right: "35%", width: "0.08cqi", backgroundColor: colors.secondary, opacity: 0.08, zIndex: 5 }} />

    <div style={{ position: "absolute", top: 0, left: 0, width: "65%", height: "33.33%", backgroundColor: colors.accent, zIndex: 2 }} />

    <div style={{ position: "absolute", top: "5cqi", left: "6cqi", zIndex: 10, display: "flex", flexDirection: "column", gap: "1.2cqi" }}>
      <EditableText as="span" fieldId="f-brand" editable={editable} value={brandName ?? ""}
        onChange={v => onUpdate?.("brandName", v)} onFocusEl={onFocusEl} onBlurEl={onBlurEl}
        style={{ fontSize: "3cqi", fontWeight: 800, letterSpacing: "0.15em", textTransform: "uppercase", color: colors.primary }} />
      {badge && (
        <EditableText as="span" fieldId="f-badge" editable={editable} value={badge}
          onChange={v => onUpdate?.("badgeText", v)} onFocusEl={onFocusEl} onBlurEl={onBlurEl}
          style={{ fontSize: "1.8cqi", fontWeight: 500, color: colors.primary, opacity: 0.7, letterSpacing: "0.06em" }} />
      )}
    </div>

    <div style={{ position: "absolute", top: "10%", left: "5%", right: "32%", bottom: "10%", zIndex: 15 }}>
      <Image src={productImage} alt="Product" fill className="object-contain"
        style={{ filter: "drop-shadow(0 6cqi 8cqi rgba(0,0,0,0.15))" }} crossOrigin="anonymous" />
    </div>

    <div style={{ position: "absolute", top: 0, right: 0, width: "35%", height: "100%", zIndex: 20, display: "flex", flexDirection: "column", justifyContent: "center", padding: "6cqi 5cqi 6cqi 4cqi", gap: "3cqi" }}>
      <h1 style={{ fontSize: "clamp(16px, 7.5cqi, 64px)", fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 0.95, color: colors.secondary, margin: 0, fontFamily: "-apple-system, 'SF Pro Display', 'Helvetica Neue', sans-serif" }}>
        <EditableHeadlineLines value={headline} editable={editable} onFocusEl={onFocusEl} onBlurEl={onBlurEl}
          onChange={v => onUpdate?.("headline", v)}
          renderLine={(line, i, node) => <span style={{ display: "block" }}>{node}</span>} />
      </h1>

      <div style={{ width: "6cqi", height: "0.3cqi", backgroundColor: colors.accent }} />

      {subheadline !== undefined && (
        <EditableText as="p" fieldId="f-sub" editable={editable} value={subheadline}
          onChange={v => onUpdate?.("subtext", v)} onFocusEl={onFocusEl} onBlurEl={onBlurEl}
          style={{ fontSize: "2.2cqi", lineHeight: 1.55, color: colors.secondary, opacity: 0.5, margin: 0, fontWeight: 400 }} />
      )}

      {price !== undefined && price !== "" && (
        <EditableText as="span" fieldId="f-price" editable={editable} value={price}
          onChange={v => onUpdate?.("price", v)} onFocusEl={onFocusEl} onBlurEl={onBlurEl}
          style={{ fontSize: "7cqi", fontWeight: 700, letterSpacing: "-0.04em", color: colors.secondary }} />
      )}
    </div>

    <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "10cqi", zIndex: 20, display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0 6cqi", borderTop: `0.08cqi solid ${colors.secondary}`, borderTopColor: `${colors.secondary}18` }}>
      <EditableText as="div" fieldId="f-cta" editable={editable} value={ctaText}
        onChange={v => onUpdate?.("ctaText", v)} onFocusEl={onFocusEl} onBlurEl={onBlurEl}
        style={{ backgroundColor: colors.secondary, color: colors.primary, padding: "1.8cqi 5cqi", borderRadius: "100px", fontSize: "2.2cqi", fontWeight: 600, letterSpacing: "0.04em" }} />
      {website !== undefined && (
        <EditableText as="span" fieldId="f-web" editable={editable} value={website}
          onChange={v => onUpdate?.("website", v)} onFocusEl={onFocusEl} onBlurEl={onBlurEl}
          style={{ fontSize: "1.8cqi", opacity: 0.25, color: colors.secondary, letterSpacing: "0.08em" }} />
      )}
    </div>
  </div>
);


/* ─────────────────────────────────────────────────────────────
   5. KŌAN
───────────────────────────────────────────────────────────── */
const VariantKoan = ({
  headline, subheadline, tagline, ctaText,
  productImage, brandName, website, price, colors,
  editable, onUpdate, onFocusEl, onBlurEl,
}: SleekFlyerProps) => (
  <div
    className="@container w-full h-full relative overflow-hidden flex flex-col items-center font-sans"
    style={{ backgroundColor: colors.primary, color: colors.secondary }}
  >
    <div style={{ padding: "5cqi 0 0", textAlign: "center", zIndex: 10, flexShrink: 0 }}>
      <EditableText as="span" fieldId="f-brand" editable={editable} value={brandName ?? ""}
        onChange={v => onUpdate?.("brandName", v)} onFocusEl={onFocusEl} onBlurEl={onBlurEl}
        style={{ fontSize: "2cqi", fontWeight: 700, letterSpacing: "0.3em", textTransform: "uppercase", color: colors.secondary, opacity: 0.4 }} />
    </div>

    {tagline !== undefined && (
      <EditableText as="p" fieldId="f-tagline" editable={editable} value={tagline}
        onChange={v => onUpdate?.("tagline", v)} onFocusEl={onFocusEl} onBlurEl={onBlurEl}
        style={{ fontSize: "2.4cqi", fontStyle: "italic", color: colors.secondary, opacity: 0.35, margin: "2cqi 0 0", letterSpacing: "0.04em", zIndex: 10, flexShrink: 0 }} />
    )}

    <div style={{ flex: 1, position: "relative", width: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ position: "absolute", width: "70cqi", height: "70cqi", borderRadius: "50%", border: `0.12cqi solid ${colors.secondary}`, opacity: 0.08, zIndex: 2 }} />
      <div style={{ position: "absolute", width: "52cqi", height: "52cqi", borderRadius: "50%", border: `0.2cqi solid ${colors.accent}`, opacity: 0.6, zIndex: 2 }} />
      <div style={{ position: "relative", width: "62cqi", height: "62cqi", zIndex: 10 }}>
        <Image src={productImage} alt="Product" fill className="object-contain"
          style={{ filter: "drop-shadow(0 4cqi 8cqi rgba(0,0,0,0.12))" }} crossOrigin="anonymous" />
      </div>
    </div>

    <div style={{ flexShrink: 0, textAlign: "center", padding: "0 8cqi 5.5cqi", display: "flex", flexDirection: "column", alignItems: "center", gap: "2.5cqi" }}>
      <div style={{ width: "5cqi", height: "0.25cqi", backgroundColor: colors.accent }} />
      <h1 style={{ fontSize: "clamp(20px, 9cqi, 80px)", fontWeight: 700, letterSpacing: "-0.03em", lineHeight: 0.95, color: colors.secondary, margin: 0, fontFamily: "-apple-system, 'SF Pro Display', 'Helvetica Neue', sans-serif" }}>
        <EditableHeadlineLines value={headline} editable={editable} onFocusEl={onFocusEl} onBlurEl={onBlurEl}
          onChange={v => onUpdate?.("headline", v)}
          renderLine={(line, i, node) => <span style={{ display: "block" }}>{node}</span>} />
      </h1>
      {subheadline !== undefined && (
        <EditableText as="p" fieldId="f-sub" editable={editable} value={subheadline}
          onChange={v => onUpdate?.("subtext", v)} onFocusEl={onFocusEl} onBlurEl={onBlurEl}
          style={{ fontSize: "2.4cqi", lineHeight: 1.5, color: colors.secondary, opacity: 0.45, margin: 0, fontWeight: 400, maxWidth: "28ch" }} />
      )}
      <div style={{ display: "flex", alignItems: "center", gap: "4cqi", marginTop: "0.5cqi" }}>
        {price !== undefined && price !== "" && (
          <EditableText as="span" fieldId="f-price" editable={editable} value={price}
            onChange={v => onUpdate?.("price", v)} onFocusEl={onFocusEl} onBlurEl={onBlurEl}
            style={{ fontSize: "4cqi", fontWeight: 700, color: colors.accent, letterSpacing: "-0.02em" }} />
        )}
        <EditableText as="div" fieldId="f-cta" editable={editable} value={ctaText}
          onChange={v => onUpdate?.("ctaText", v)} onFocusEl={onFocusEl} onBlurEl={onBlurEl}
          style={{ border: `0.12cqi solid ${colors.secondary}`, padding: "1.6cqi 4.5cqi", borderRadius: "100px", fontSize: "2.2cqi", fontWeight: 500, letterSpacing: "0.06em", color: colors.secondary, opacity: 0.75 }} />
      </div>
      {website !== undefined && (
        <EditableText as="span" fieldId="f-web" editable={editable} value={website}
          onChange={v => onUpdate?.("website", v)} onFocusEl={onFocusEl} onBlurEl={onBlurEl}
          style={{ fontSize: "1.6cqi", letterSpacing: "0.12em", opacity: 0.2, color: colors.secondary }} />
      )}
    </div>
  </div>
);
