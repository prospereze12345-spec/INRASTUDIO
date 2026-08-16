import React from "react";
import Image from "next/image";
import { Phone, Mail, CheckCircle2 } from "lucide-react";
import { EditableText } from "@/components/EditableText";
import { EditableHeadlineLines } from "@/components/Editableheadlinelines";

export interface LuxuryProductProps {
  name?: string;
  headline: string;
  subtext?: string;
  ctaText: string;
  productImage: string;
  logo?: string;
  brandName?: string;
  website?: string;
  phone?: string;
  email?: string;
  features?: string[];
  extraText?: string;
  instagram?: string;
  tiktok?: string;
  price?: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
  };
  editable?: boolean;
  onUpdate?: (field: string, value: string) => void;
  onFocusEl?: (el: HTMLElement) => void;
  onBlurEl?: () => void;
  onUpdateFeature?: (index: number, value: string) => void;
  onAddFeature?: () => void;
  onRemoveFeature?: (index: number) => void;
}

/* ─────────────────────────────────────────────────────────────────
   SHARED — feature highlights + contact row
   Sizing now uses calc(N * var(--ci)) / calc(N * var(--cb)) instead
   of cqi/cqb container-query units. --ci and --cb are plain CSS
   custom properties (1% of canvas width / height) set by the editor
   canvas wrapper. This works on every browser back to iOS 9 — unlike
   cqi/cqb, which require Safari 16+ and render as 0 on older iOS.
───────────────────────────────────────────────────────────────── */
type SharedBlockProps = Pick<LuxuryProductProps,
  "editable" | "onUpdate" | "onFocusEl" | "onBlurEl" | "onUpdateFeature" | "onAddFeature" | "onRemoveFeature"
>;

function FeatureList({
  features, colors, editable, onUpdateFeature, onFocusEl, onBlurEl,
  className = "",
}: SharedBlockProps & {
  features?: string[];
  colors: LuxuryProductProps["colors"];
  className?: string;
}) {
  if (!features || features.length === 0) return null;
  return (
    <div
      className={`flex flex-wrap ${className}`}
      style={{ columnGap: "calc(3*var(--ci))", rowGap: "calc(1*var(--ci))" }}
    >
      {features.map((feat, i) => (
        <div key={i} className="flex items-center" style={{ gap: "calc(0.8*var(--ci))" }}>
          <CheckCircle2
            style={{ color: colors.accent, width: "calc(1.6*var(--ci))", height: "calc(1.6*var(--ci))", flexShrink: 0 }}
          />
          <EditableText as="span" fieldId={`f-feature-${i}`} editable={editable} value={feat}
            onChange={v => onUpdateFeature?.(i, v)} onFocusEl={onFocusEl} onBlurEl={onBlurEl}
            className="tracking-wide opacity-75" style={{ fontSize: "calc(1.9*var(--ci))" }} />
        </div>
      ))}
    </div>
  );
}

function ContactRow({
  phone, email, website, colors, editable, onUpdate, onFocusEl, onBlurEl,
  align = "left", className = "",
}: SharedBlockProps & {
  phone?: string;
  email?: string;
  website?: string;
  colors: LuxuryProductProps["colors"];
  align?: "left" | "right";
  className?: string;
}) {
  if (!editable && !phone && !email && !website) return null;

  return (
    <div
      className={`flex flex-wrap items-center ${align === "right" ? "justify-end" : ""} ${className}`}
      style={{ gap: "calc(2*var(--ci))" }}
    >
      {(editable || phone) && (
        <div className="flex items-center" style={{ gap: "calc(0.6*var(--ci))" }}>
          <Phone style={{ color: colors.accent, width: "calc(1.5*var(--ci))", height: "calc(1.5*var(--ci))", flexShrink: 0 }} />
          <EditableText as="span" fieldId="f-phone" editable={editable} value={phone ?? ""}
            onChange={v => onUpdate?.("phone", v)} onFocusEl={onFocusEl} onBlurEl={onBlurEl}
            className="opacity-40 tracking-widest" style={{ fontSize: "calc(1.6*var(--ci))" }} />
        </div>
      )}
      {(editable || email) && (
        <div className="flex items-center" style={{ gap: "calc(0.6*var(--ci))" }}>
          <Mail style={{ color: colors.accent, width: "calc(1.5*var(--ci))", height: "calc(1.5*var(--ci))", flexShrink: 0 }} />
          <EditableText as="span" fieldId="f-email" editable={editable} value={email ?? ""}
            onChange={v => onUpdate?.("email", v)} onFocusEl={onFocusEl} onBlurEl={onBlurEl}
            className="opacity-40 tracking-widest" style={{ fontSize: "calc(1.6*var(--ci))" }} />
        </div>
      )}
      {website !== undefined && (
        <EditableText as="p" fieldId="f-web" editable={editable} value={website ?? ""}
          onChange={v => onUpdate?.("website", v)} onFocusEl={onFocusEl} onBlurEl={onBlurEl}
          className="opacity-25 tracking-widest" style={{ fontSize: "calc(1.6*var(--ci))" }} />
      )}
    </div>
  );
}

export function LuxuryProductTemplate(props: LuxuryProductProps) {
  if (!props.headline || !props.productImage || !props.colors) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400 text-sm">
        Loading template...
      </div>
    );
  }
  const { name = "White Gold" } = props;
  switch (name) {
    case "Black Gold":         return <VariantBlackGold        {...props} />;
    case "White Gold":         return <VariantWhiteGold        {...props} />;
    case "Navy Cyan":          return <VariantNavyCyan         {...props} />;
    case "Dark Marble":        return <VariantDarkMarble       {...props} />;
    case "Royal Purple":       return <VariantRoyalPurple      {...props} />;
    case "Emerald Green":      return <VariantEmeraldGreen     {...props} />;
    case "Soft Sage":          return <VariantSoftSage         {...props} />;
    case "Rose Blush":         return <VariantRoseBlush        {...props} />;
    case "Classic Monochrome": return <VariantClassicMono      {...props} />;
    case "Crimson Velvet":     return <VariantCrimsonVelvet    {...props} />;
    case "New Catalog":        return <VariantNewCatalog       {...props} />;
    case "Borcelle Skincare":  return <VariantBorcelleSkincare {...props} />;
    default:                   return <VariantWhiteGold        {...props} />;
  }
}

/* ─────────────────────────────────────────────────────────────────
   1. BLACK GOLD
───────────────────────────────────────────────────────────────── */
const VariantBlackGold = ({
  headline, subtext, ctaText, productImage, brandName, website, instagram, price,
  colors, editable, onUpdate, onFocusEl, onBlurEl,
}: LuxuryProductProps) => (
  <div className="w-full h-full relative overflow-hidden flex flex-col font-sans" style={{ backgroundColor: colors.primary, color: colors.secondary }}>
    <div
      className="shrink-0 flex items-center justify-between border-b"
      style={{ borderColor: `${colors.accent}30`, padding: "calc(3*var(--cb)) calc(5*var(--ci))" }}
    >
      <EditableText as="p" fieldId="f-brand" editable={editable} value={brandName ?? ""}
        onChange={v => onUpdate?.("brandName", v)} onFocusEl={onFocusEl} onBlurEl={onBlurEl}
        className="font-bold tracking-[0.4em] uppercase" style={{ fontSize: "calc(2*var(--ci))" }} />
      <EditableText as="p" fieldId="f-instagram" editable={editable} value={instagram ?? ""}
        onChange={v => onUpdate?.("instagram", v)} onFocusEl={onFocusEl} onBlurEl={onBlurEl}
        className="opacity-50 tracking-widest" style={{ fontSize: "calc(2*var(--ci))" }} />
    </div>

    <div className="shrink-0" style={{ padding: "calc(4*var(--cb)) calc(5*var(--ci)) calc(2*var(--cb))" }}>
      <EditableHeadlineLines value={headline} editable={editable} onFocusEl={onFocusEl} onBlurEl={onBlurEl}
        onChange={v => onUpdate?.("headline", v)}
        renderLine={(line, i, node) => (
          <p className="leading-[0.85]"
            style={i === 0
              ? { fontSize: "calc(11*var(--ci))", fontWeight: 900, letterSpacing: "-0.02em" }
              : { fontSize: "calc(8*var(--ci))", fontWeight: 300, letterSpacing: "0.15em", textTransform: "uppercase", opacity: 0.7, color: colors.accent }}>
            {node}
          </p>
        )} />
    </div>

    <div className="flex-1 relative">
      <Image src={productImage} alt="Product" fill className="object-contain object-center" crossOrigin="anonymous" />
      <div className="absolute inset-0" style={{ background: `radial-gradient(ellipse at center bottom, ${colors.primary}60, transparent 70%)` }} />
    </div>

    <div
      className="shrink-0 flex items-center justify-between border-t"
      style={{ borderColor: `${colors.accent}30`, backgroundColor: `${colors.accent}08`, padding: "calc(3.5*var(--cb)) calc(5*var(--ci))" }}
    >
      <div>
        {price !== undefined && price !== "" && (
          <EditableText as="p" fieldId="f-price" editable={editable} value={price}
            onChange={v => onUpdate?.("price", v)} onFocusEl={onFocusEl} onBlurEl={onBlurEl}
            className="font-black" style={{ fontSize: "calc(5*var(--ci))", color: colors.accent }} />
        )}
        <EditableText as="p" fieldId="f-sub" editable={editable} value={subtext ?? ""}
          onChange={v => onUpdate?.("subtext", v)} onFocusEl={onFocusEl} onBlurEl={onBlurEl}
          className="opacity-50" style={{ fontSize: "calc(2*var(--ci))", marginTop: "calc(0.5*var(--cb))" }} />
      </div>
      <div>
        <EditableText as="div" fieldId="f-cta" editable={editable} value={ctaText}
          onChange={v => onUpdate?.("ctaText", v)} onFocusEl={onFocusEl} onBlurEl={onBlurEl}
          className="font-black uppercase tracking-widest"
          style={{
            backgroundColor: colors.accent, color: colors.primary,
            padding: "calc(2*var(--cb)) calc(4*var(--ci))", fontSize: "calc(2.2*var(--ci))",
            marginBottom: "calc(1*var(--cb))",
          }} />
        <EditableText as="p" fieldId="f-web" editable={editable} value={website ?? ""}
          onChange={v => onUpdate?.("website", v)} onFocusEl={onFocusEl} onBlurEl={onBlurEl}
          className="opacity-25 text-right tracking-widest" style={{ fontSize: "calc(1.8*var(--ci))" }} />
      </div>
    </div>
  </div>
);

/* ─────────────────────────────────────────────────────────────────
   2. WHITE GOLD
───────────────────────────────────────────────────────────────── */
const VariantWhiteGold = ({
  headline, subtext, ctaText, productImage, brandName, website, price,
  colors, editable, onUpdate, onFocusEl, onBlurEl,
}: LuxuryProductProps) => {
  const lines = headline.split('\n');
  const eyebrow = lines[0] ?? "";
  const rest = lines.slice(1).join(' ') || lines[0] || "";

  return (
    <div className="w-full h-full relative overflow-hidden flex flex-col font-sans" style={{ backgroundColor: colors.primary, color: colors.secondary }}>
      <div
        className="absolute top-0 bottom-0 z-10"
        style={{ left: "calc(12*var(--ci))", width: "calc(0.3*var(--ci))", backgroundColor: colors.accent, opacity: 0.4 }}
      />

      <div
        className="absolute top-1/2 -translate-y-1/2 -rotate-90 z-10"
        style={{ left: "calc(6*var(--ci))" }}
      >
        <EditableText as="p" fieldId="f-brand" editable={editable} value={brandName ?? ""}
          onChange={v => onUpdate?.("brandName", v)} onFocusEl={onFocusEl} onBlurEl={onBlurEl}
          className="tracking-[0.5em] uppercase font-bold opacity-30 whitespace-nowrap" style={{ fontSize: "calc(2*var(--ci))" }} />
      </div>

      <div
        className="flex-1 flex flex-col"
        style={{ paddingLeft: "calc(15*var(--ci))", paddingRight: "calc(5*var(--ci))", paddingTop: "calc(5*var(--cb))", paddingBottom: "calc(4*var(--cb))" }}
      >
        <div className="shrink-0" style={{ marginBottom: "calc(3*var(--cb))" }}>
          <EditableText as="p" fieldId="f-headline-0" editable={editable} value={eyebrow}
            onChange={v => {
              const next = [v, ...lines.slice(1)];
              onUpdate?.("headline", next.join('\n'));
            }} onFocusEl={onFocusEl} onBlurEl={onBlurEl}
            className="tracking-[0.4em] uppercase opacity-40" style={{ fontSize: "calc(2*var(--ci))", marginBottom: "calc(2*var(--cb))" }} />
          <h1 className="font-black leading-[0.85] tracking-tight" style={{ fontSize: "calc(11*var(--ci))" }}>
            <EditableText as="span" fieldId="f-headline-1" editable={editable} value={rest}
              onChange={v => {
                const next = [lines[0] ?? "", v];
                onUpdate?.("headline", next.join('\n'));
              }} onFocusEl={onFocusEl} onBlurEl={onBlurEl} />
          </h1>
          <div style={{ width: "calc(8*var(--ci))", height: "calc(0.3*var(--ci))", marginTop: "calc(2*var(--cb))", backgroundColor: colors.accent }} />
        </div>

        <div className="flex-1 relative">
          <Image src={productImage} alt="Product" fill className="object-contain object-center" crossOrigin="anonymous" />
        </div>

        <div className="shrink-0 flex items-end justify-between" style={{ paddingTop: "calc(2*var(--cb))" }}>
          <div>
            <EditableText as="p" fieldId="f-sub" editable={editable} value={subtext ?? ""}
              onChange={v => onUpdate?.("subtext", v)} onFocusEl={onFocusEl} onBlurEl={onBlurEl}
              className="opacity-50" style={{ fontSize: "calc(2.2*var(--ci))", marginBottom: "calc(1*var(--cb))", maxWidth: "calc(40*var(--ci))" }} />
            <EditableText as="p" fieldId="f-web" editable={editable} value={website ?? ""}
              onChange={v => onUpdate?.("website", v)} onFocusEl={onFocusEl} onBlurEl={onBlurEl}
              className="opacity-25 tracking-widest uppercase" style={{ fontSize: "calc(1.8*var(--ci))" }} />
          </div>
          <div className="text-right">
            {price !== undefined && price !== "" && (
              <EditableText as="p" fieldId="f-price" editable={editable} value={price}
                onChange={v => onUpdate?.("price", v)} onFocusEl={onFocusEl} onBlurEl={onBlurEl}
                className="font-black" style={{ fontSize: "calc(6*var(--ci))", marginBottom: "calc(1*var(--cb))", color: colors.accent }} />
            )}
            <EditableText as="div" fieldId="f-cta" editable={editable} value={ctaText}
              onChange={v => onUpdate?.("ctaText", v)} onFocusEl={onFocusEl} onBlurEl={onBlurEl}
              className="inline-block font-black uppercase tracking-widest"
              style={{ backgroundColor: colors.accent, color: colors.primary, padding: "calc(2*var(--cb)) calc(4*var(--ci))", fontSize: "calc(2.2*var(--ci))" }} />
          </div>
        </div>
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────────
   3. NAVY CYAN
───────────────────────────────────────────────────────────────── */
const VariantNavyCyan = ({
  headline, subtext, ctaText, productImage, website, price,
  colors, editable, onUpdate, onFocusEl, onBlurEl,
}: LuxuryProductProps) => (
  <div className="w-full h-full relative overflow-hidden flex flex-col font-sans" style={{ backgroundColor: colors.primary, color: colors.secondary }}>
    <div className="absolute top-0 right-0 w-[60%] h-[60%] z-0" style={{ backgroundColor: colors.accent, clipPath: 'circle(50% at 100% 0%)', opacity: 0.08 }} />

    <div className="shrink-0 flex items-center justify-between z-10 relative" style={{ padding: "calc(4*var(--cb)) calc(5*var(--ci)) calc(2*var(--cb))" }}>
      <EditableText as="p" fieldId="f-web" editable={editable} value={website ?? ""}
        onChange={v => onUpdate?.("website", v)} onFocusEl={onFocusEl} onBlurEl={onBlurEl}
        className="tracking-[0.4em] uppercase opacity-50" style={{ fontSize: "calc(2*var(--ci))" }} />
      <div style={{ width: "calc(6*var(--ci))", height: "calc(0.3*var(--ci))", backgroundColor: colors.accent }} />
    </div>

    <div className="shrink-0 z-10 relative" style={{ padding: "0 calc(5*var(--ci))" }}>
      <EditableHeadlineLines value={headline} editable={editable} onFocusEl={onFocusEl} onBlurEl={onBlurEl}
        onChange={v => onUpdate?.("headline", v)}
        renderLine={(line, i, node) => (
          <h1 className="font-black uppercase leading-[0.82] tracking-tighter"
            style={{ fontSize: `calc(${14 - i * 1}*var(--ci))`, color: i === 0 ? colors.secondary : colors.accent }}>
            {node}
          </h1>
        )} />
    </div>

    <div className="flex-1 relative z-10" style={{ padding: "0 calc(4*var(--ci))" }}>
      <Image src={productImage} alt="Product" fill className="object-contain object-center" crossOrigin="anonymous" />
    </div>

    <div
      className="shrink-0 z-10 flex items-center justify-between"
      style={{ backgroundColor: colors.accent, padding: "calc(3.5*var(--cb)) calc(5*var(--ci))" }}
    >
      <div>
        {price !== undefined && price !== "" && (
          <EditableText as="p" fieldId="f-price" editable={editable} value={price}
            onChange={v => onUpdate?.("price", v)} onFocusEl={onFocusEl} onBlurEl={onBlurEl}
            className="font-black leading-none" style={{ fontSize: "calc(5*var(--ci))", color: colors.primary }} />
        )}
        <EditableText as="p" fieldId="f-sub" editable={editable} value={subtext ?? ""}
          onChange={v => onUpdate?.("subtext", v)} onFocusEl={onFocusEl} onBlurEl={onBlurEl}
          className="opacity-60" style={{ fontSize: "calc(2*var(--ci))", marginTop: "calc(0.5*var(--cb))", color: colors.primary }} />
      </div>
      <EditableText as="div" fieldId="f-cta" editable={editable} value={ctaText}
        onChange={v => onUpdate?.("ctaText", v)} onFocusEl={onFocusEl} onBlurEl={onBlurEl}
        className="font-black uppercase tracking-widest"
        style={{ backgroundColor: colors.primary, color: colors.accent, padding: "calc(2*var(--cb)) calc(4*var(--ci))", fontSize: "calc(2.4*var(--ci))" }} />
    </div>
  </div>
);

/* ─────────────────────────────────────────────────────────────────
   4. DARK MARBLE
───────────────────────────────────────────────────────────────── */
const VariantDarkMarble = ({
  headline, subtext, ctaText, productImage, website, price, brandName,
  colors, editable, onUpdate, onFocusEl, onBlurEl,
}: LuxuryProductProps) => (
  <div className="w-full h-full relative overflow-hidden flex flex-col font-sans" style={{ backgroundColor: colors.primary, color: colors.secondary }}>
    <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/noise.png")' }} />

    <div className="shrink-0 flex items-center justify-between z-10 relative" style={{ padding: "calc(4*var(--cb)) calc(5*var(--ci)) 0" }}>
      <EditableText as="p" fieldId="f-brand" editable={editable} value={brandName ?? ""}
        onChange={v => onUpdate?.("brandName", v)} onFocusEl={onFocusEl} onBlurEl={onBlurEl}
        className="tracking-[0.5em] uppercase font-bold opacity-30" style={{ fontSize: "calc(2*var(--ci))" }} />
      <div
        className="rounded-full"
        style={{ width: "calc(4*var(--ci))", height: "calc(4*var(--ci))", border: `calc(0.3*var(--ci)) solid ${colors.accent}`, opacity: 0.5 }}
      />
    </div>

    <div className="shrink-0 z-10 relative" style={{ padding: "calc(3*var(--cb)) calc(5*var(--ci)) calc(2*var(--cb))" }}>
      <h1 className="font-black leading-[0.85] tracking-tight uppercase" style={{ fontSize: "calc(10*var(--ci))" }}>
        <EditableHeadlineLines value={headline} editable={editable} onFocusEl={onFocusEl} onBlurEl={onBlurEl}
          onChange={v => onUpdate?.("headline", v)}
          renderLine={(line, i, node) => (
            <span className="block" style={i % 2 === 1 ? { color: colors.accent } : {}}>{node}</span>
          )} />
      </h1>
    </div>

    <div className="z-10 relative" style={{ margin: "0 calc(5*var(--ci))", height: "calc(0.2*var(--ci))", backgroundColor: `${colors.secondary}20` }} />

    <div className="flex-1 relative z-10">
      <Image src={productImage} alt="Product" fill className="object-contain object-center" crossOrigin="anonymous" />
      <div className="absolute inset-0" style={{ background: `radial-gradient(ellipse at center, transparent 40%, ${colors.primary}80 100%)` }} />
    </div>

    <div className="shrink-0 flex items-end justify-between z-10 relative" style={{ padding: "0 calc(5*var(--ci)) calc(4*var(--cb))" }}>
      <div>
        {price !== undefined && price !== "" && (
          <EditableText as="p" fieldId="f-price" editable={editable} value={price}
            onChange={v => onUpdate?.("price", v)} onFocusEl={onFocusEl} onBlurEl={onBlurEl}
            className="font-black leading-none" style={{ fontSize: "calc(7*var(--ci))", color: colors.accent }} />
        )}
        <EditableText as="p" fieldId="f-sub" editable={editable} value={subtext ?? ""}
          onChange={v => onUpdate?.("subtext", v)} onFocusEl={onFocusEl} onBlurEl={onBlurEl}
          className="opacity-40" style={{ fontSize: "calc(2*var(--ci))", marginTop: "calc(0.5*var(--cb))" }} />
        <EditableText as="p" fieldId="f-web" editable={editable} value={website ?? ""}
          onChange={v => onUpdate?.("website", v)} onFocusEl={onFocusEl} onBlurEl={onBlurEl}
          className="opacity-20 tracking-widest uppercase" style={{ fontSize: "calc(1.6*var(--ci))", marginTop: "calc(1*var(--cb))" }} />
      </div>
      <EditableText as="div" fieldId="f-cta" editable={editable} value={ctaText}
        onChange={v => onUpdate?.("ctaText", v)} onFocusEl={onFocusEl} onBlurEl={onBlurEl}
        className="font-black uppercase tracking-wider"
        style={{ border: `calc(0.3*var(--ci)) solid ${colors.accent}`, color: colors.accent, padding: "calc(2.5*var(--cb)) calc(4*var(--ci))", fontSize: "calc(2.2*var(--ci))" }} />
    </div>
  </div>
);

/* ─────────────────────────────────────────────────────────────────
   5. ROYAL PURPLE
───────────────────────────────────────────────────────────────── */
const VariantRoyalPurple = ({
  headline, subtext, ctaText, productImage, website, price,
  colors, editable, onUpdate, onFocusEl, onBlurEl,
}: LuxuryProductProps) => (
  <div className="w-full h-full relative overflow-hidden flex flex-col font-sans" style={{ backgroundColor: colors.primary, color: colors.secondary }}>
    <div className="absolute inset-0 pointer-events-none" style={{ background: `radial-gradient(ellipse at 50% 60%, ${colors.accent}15 0%, transparent 65%)` }} />

    <div className="shrink-0 z-10 relative" style={{ padding: "calc(5*var(--cb)) calc(5*var(--ci)) 0" }}>
      <div className="flex items-center" style={{ gap: "calc(2*var(--ci))", marginBottom: "calc(3*var(--cb))" }}>
        <div style={{ width: "calc(4*var(--ci))", height: "calc(0.2*var(--ci))", backgroundColor: colors.accent }} />
        <EditableText as="p" fieldId="f-web" editable={editable} value={website ?? ""}
          onChange={v => onUpdate?.("website", v)} onFocusEl={onFocusEl} onBlurEl={onBlurEl}
          className="tracking-[0.4em] uppercase opacity-50" style={{ fontSize: "calc(1.8*var(--ci))" }} />
      </div>
      <h1 className="font-black leading-[0.85] tracking-tighter uppercase" style={{ fontSize: "calc(10.5*var(--ci))" }}>
        <EditableHeadlineLines value={headline} editable={editable} onFocusEl={onFocusEl} onBlurEl={onBlurEl}
          onChange={v => onUpdate?.("headline", v)}
          renderLine={(line, i, node) => (
            <span className="block" style={i === 1 ? { color: colors.accent } : {}}>{node}</span>
          )} />
      </h1>
    </div>

    <div className="flex-1 relative z-10">
      <Image src={productImage} alt="Product" fill className="object-contain object-center" crossOrigin="anonymous" />
    </div>

    <div className="shrink-0 z-10 relative" style={{ padding: "0 calc(5*var(--ci)) calc(4*var(--cb))" }}>
      <div style={{ width: "100%", height: "calc(0.2*var(--ci))", marginBottom: "calc(3*var(--cb))", backgroundColor: `${colors.accent}30` }} />
      <div className="flex items-end justify-between">
        <div>
          {price !== undefined && price !== "" && (
            <EditableText as="p" fieldId="f-price" editable={editable} value={price}
              onChange={v => onUpdate?.("price", v)} onFocusEl={onFocusEl} onBlurEl={onBlurEl}
              className="font-black leading-none" style={{ fontSize: "calc(8*var(--ci))", color: colors.accent }} />
          )}
          <EditableText as="p" fieldId="f-sub" editable={editable} value={subtext ?? ""}
            onChange={v => onUpdate?.("subtext", v)} onFocusEl={onFocusEl} onBlurEl={onBlurEl}
            className="opacity-50" style={{ fontSize: "calc(2.2*var(--ci))", marginTop: "calc(0.5*var(--cb))", maxWidth: "calc(40*var(--ci))" }} />
        </div>
        <EditableText as="div" fieldId="f-cta" editable={editable} value={ctaText}
          onChange={v => onUpdate?.("ctaText", v)} onFocusEl={onFocusEl} onBlurEl={onBlurEl}
          className="font-black uppercase tracking-widest rounded-full"
          style={{ backgroundColor: colors.accent, color: colors.primary, padding: "calc(2.5*var(--cb)) calc(5*var(--ci))", fontSize: "calc(2.4*var(--ci))" }} />
      </div>
    </div>
  </div>
);

/* ─────────────────────────────────────────────────────────────────
   6. EMERALD GREEN
───────────────────────────────────────────────────────────────── */
const VariantEmeraldGreen = ({
  headline, subtext, ctaText, productImage, brandName, website, price,
  colors, editable, onUpdate, onFocusEl, onBlurEl,
}: LuxuryProductProps) => (
  <div className="w-full h-full relative overflow-hidden flex font-sans" style={{ backgroundColor: colors.primary, color: colors.secondary }}>
    <div
      className="w-[42%] h-full flex flex-col justify-between border-r z-10 relative"
      style={{ borderColor: `${colors.secondary}15`, padding: "calc(5*var(--ci))" }}
    >
      <div>
        <EditableText as="p" fieldId="f-brand" editable={editable} value={brandName ?? ""}
          onChange={v => onUpdate?.("brandName", v)} onFocusEl={onFocusEl} onBlurEl={onBlurEl}
          className="tracking-[0.5em] uppercase opacity-30" style={{ fontSize: "calc(1.8*var(--ci))", marginBottom: "calc(4*var(--cb))" }} />
        <h1 className="font-black leading-[0.85] tracking-tight uppercase" style={{ fontSize: "calc(9*var(--ci))", marginBottom: "calc(3*var(--cb))" }}>
          <EditableHeadlineLines value={headline} editable={editable} onFocusEl={onFocusEl} onBlurEl={onBlurEl}
            onChange={v => onUpdate?.("headline", v)}
            renderLine={(line, i, node) => (
              <span className="block" style={i === 1 ? { color: colors.accent } : {}}>{node}</span>
            )} />
        </h1>
        <div style={{ width: "calc(6*var(--ci))", height: "calc(0.3*var(--ci))", marginBottom: "calc(3*var(--cb))", backgroundColor: colors.accent }} />
        <EditableText as="p" fieldId="f-sub" editable={editable} value={subtext ?? ""}
          onChange={v => onUpdate?.("subtext", v)} onFocusEl={onFocusEl} onBlurEl={onBlurEl}
          className="leading-relaxed opacity-50" style={{ fontSize: "calc(2.2*var(--ci))" }} />
      </div>
      <div>
        {price !== undefined && price !== "" && (
          <EditableText as="p" fieldId="f-price" editable={editable} value={price}
            onChange={v => onUpdate?.("price", v)} onFocusEl={onFocusEl} onBlurEl={onBlurEl}
            className="font-black leading-none" style={{ fontSize: "calc(7*var(--ci))", marginBottom: "calc(2*var(--cb))", color: colors.accent }} />
        )}
        <EditableText as="div" fieldId="f-cta" editable={editable} value={ctaText}
          onChange={v => onUpdate?.("ctaText", v)} onFocusEl={onFocusEl} onBlurEl={onBlurEl}
          className="font-black uppercase tracking-widest"
          style={{ backgroundColor: colors.accent, color: colors.primary, padding: "calc(2*var(--cb)) calc(3*var(--ci))", fontSize: "calc(2.2*var(--ci))", marginBottom: "calc(1.5*var(--cb))" }} />
        <EditableText as="p" fieldId="f-web" editable={editable} value={website ?? ""}
          onChange={v => onUpdate?.("website", v)} onFocusEl={onFocusEl} onBlurEl={onBlurEl}
          className="opacity-20 tracking-widest uppercase" style={{ fontSize: "calc(1.6*var(--ci))" }} />
      </div>
    </div>

    <div className="w-[58%] relative">
      <Image src={productImage} alt="Product" fill className="object-contain object-center" style={{ padding: "calc(3*var(--ci))" }} crossOrigin="anonymous" />
    </div>
  </div>
);

/* ─────────────────────────────────────────────────────────────────
   7. SOFT SAGE
───────────────────────────────────────────────────────────────── */
const VariantSoftSage = ({
  headline, subtext, ctaText, productImage, brandName, website, price,
  colors, editable, onUpdate, onFocusEl, onBlurEl,
}: LuxuryProductProps) => {
  const lines = headline.split('\n');
  const eyebrow = lines[0] ?? "";
  const main = lines[1] ?? lines[0] ?? "";

  return (
    <div className="w-full h-full relative overflow-hidden flex flex-col items-center font-sans text-center" style={{ backgroundColor: colors.primary, color: colors.secondary }}>
      <div className="shrink-0 w-full flex items-center justify-between" style={{ padding: "calc(4*var(--cb)) calc(5*var(--ci)) calc(2*var(--cb))" }}>
        <EditableText as="p" fieldId="f-brand" editable={editable} value={brandName ?? ""}
          onChange={v => onUpdate?.("brandName", v)} onFocusEl={onFocusEl} onBlurEl={onBlurEl}
          className="tracking-[0.5em] uppercase opacity-30" style={{ fontSize: "calc(1.8*var(--ci))" }} />
        <div style={{ width: "calc(4*var(--ci))", height: "calc(0.2*var(--ci))", backgroundColor: `${colors.secondary}30` }} />
        <EditableText as="p" fieldId="f-web" editable={editable} value={website ?? ""}
          onChange={v => onUpdate?.("website", v)} onFocusEl={onFocusEl} onBlurEl={onBlurEl}
          className="tracking-[0.4em] uppercase opacity-30" style={{ fontSize: "calc(1.8*var(--ci))" }} />
      </div>

      <div className="shrink-0" style={{ padding: "calc(2*var(--cb)) calc(6*var(--ci)) calc(3*var(--cb))" }}>
        <EditableText as="p" fieldId="f-headline-0" editable={editable} value={eyebrow}
          onChange={v => onUpdate?.("headline", [v, lines[1] ?? ""].join('\n'))}
          onFocusEl={onFocusEl} onBlurEl={onBlurEl}
          className="tracking-[0.4em] uppercase opacity-40" style={{ fontSize: "calc(2*var(--ci))", marginBottom: "calc(2*var(--cb))" }} />
        <h1 className="font-black leading-[0.85] tracking-tight uppercase" style={{ fontSize: "calc(10*var(--ci))" }}>
          <EditableText as="span" fieldId="f-headline-1" editable={editable} value={main}
            onChange={v => onUpdate?.("headline", [lines[0] ?? "", v].join('\n'))}
            onFocusEl={onFocusEl} onBlurEl={onBlurEl} />
        </h1>
        <div style={{ width: "calc(6*var(--ci))", height: "calc(0.3*var(--ci))", margin: "calc(2*var(--cb)) auto 0", backgroundColor: colors.accent }} />
      </div>

      <div className="flex-1 w-full relative" style={{ padding: "0 calc(4*var(--ci))" }}>
        <Image src={productImage} alt="Product" fill className="object-contain object-center" crossOrigin="anonymous" />
      </div>

      <div className="shrink-0 w-full flex items-end justify-between" style={{ padding: "calc(2*var(--cb)) calc(5*var(--ci)) calc(4*var(--cb))" }}>
        <div className="text-left">
          <EditableText as="p" fieldId="f-sub" editable={editable} value={subtext ?? ""}
            onChange={v => onUpdate?.("subtext", v)} onFocusEl={onFocusEl} onBlurEl={onBlurEl}
            className="opacity-50" style={{ fontSize: "calc(2.2*var(--ci))", maxWidth: "calc(35*var(--ci))" }} />
        </div>
        <div className="text-right">
          {price !== undefined && price !== "" && (
            <EditableText as="p" fieldId="f-price" editable={editable} value={price}
              onChange={v => onUpdate?.("price", v)} onFocusEl={onFocusEl} onBlurEl={onBlurEl}
              className="font-black leading-none" style={{ fontSize: "calc(6*var(--ci))", color: colors.accent }} />
          )}
          <EditableText as="div" fieldId="f-cta" editable={editable} value={ctaText}
            onChange={v => onUpdate?.("ctaText", v)} onFocusEl={onFocusEl} onBlurEl={onBlurEl}
            className="inline-block font-black uppercase tracking-widest"
            style={{ backgroundColor: colors.accent, color: colors.primary, marginTop: "calc(1.5*var(--cb))", padding: "calc(2*var(--cb)) calc(4*var(--ci))", fontSize: "calc(2.2*var(--ci))" }} />
        </div>
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────────
   8. ROSE BLUSH
───────────────────────────────────────────────────────────────── */
const VariantRoseBlush = ({
  headline, subtext, ctaText, productImage, website, price,
  colors, editable, onUpdate, onFocusEl, onBlurEl,
}: LuxuryProductProps) => (
  <div className="w-full h-full relative overflow-hidden flex flex-col font-sans" style={{ backgroundColor: colors.primary, color: colors.secondary }}>
    <div className="h-[55%] relative shrink-0">
      <Image src={productImage} alt="Product" fill className="object-contain object-center" style={{ padding: "calc(3*var(--ci))" }} crossOrigin="anonymous" />
      <div className="absolute inset-0" style={{ background: `linear-gradient(to bottom, transparent 60%, ${colors.primary} 100%)` }} />
    </div>

    <div className="flex-1 flex flex-col justify-between" style={{ padding: "0 calc(5*var(--ci)) calc(5*var(--cb))" }}>
      <div>
        <EditableHeadlineLines value={headline} editable={editable} onFocusEl={onFocusEl} onBlurEl={onBlurEl}
          onChange={v => onUpdate?.("headline", v)}
          renderLine={(line, i, node) => (
            <p
              style={i === 0
                ? { fontSize: "calc(2.5*var(--ci))", letterSpacing: "0.4em", textTransform: "uppercase", opacity: 0.4, marginBottom: "calc(1*var(--cb))" }
                : { fontSize: "calc(10*var(--ci))", fontWeight: 900, lineHeight: 0.85, letterSpacing: "-0.03em", textTransform: "uppercase", color: colors.secondary }}>
              {node}
            </p>
          )} />
        <div style={{ width: "calc(6*var(--ci))", height: "calc(0.3*var(--ci))", marginTop: "calc(2*var(--cb))", backgroundColor: colors.accent }} />
      </div>
      <div className="flex items-end justify-between">
        <div>
          {price !== undefined && price !== "" && (
            <EditableText as="p" fieldId="f-price" editable={editable} value={price}
              onChange={v => onUpdate?.("price", v)} onFocusEl={onFocusEl} onBlurEl={onBlurEl}
              className="font-black leading-none" style={{ fontSize: "calc(7*var(--ci))", color: colors.accent }} />
          )}
          <EditableText as="p" fieldId="f-sub" editable={editable} value={subtext ?? ""}
            onChange={v => onUpdate?.("subtext", v)} onFocusEl={onFocusEl} onBlurEl={onBlurEl}
            className="opacity-50" style={{ fontSize: "calc(2*var(--ci))", marginTop: "calc(0.5*var(--cb))" }} />
          <EditableText as="p" fieldId="f-web" editable={editable} value={website ?? ""}
            onChange={v => onUpdate?.("website", v)} onFocusEl={onFocusEl} onBlurEl={onBlurEl}
            className="opacity-20 tracking-widest uppercase" style={{ fontSize: "calc(1.6*var(--ci))", marginTop: "calc(1*var(--cb))" }} />
        </div>
        <EditableText as="div" fieldId="f-cta" editable={editable} value={ctaText}
          onChange={v => onUpdate?.("ctaText", v)} onFocusEl={onFocusEl} onBlurEl={onBlurEl}
          className="font-black uppercase tracking-widest rounded-full"
          style={{ backgroundColor: colors.accent, color: colors.primary, padding: "calc(2.5*var(--cb)) calc(4*var(--ci))", fontSize: "calc(2.4*var(--ci))" }} />
      </div>
    </div>
  </div>
);

/* ─────────────────────────────────────────────────────────────────
   9. CLASSIC MONOCHROME
───────────────────────────────────────────────────────────────── */
const VariantClassicMono = ({
  headline, subtext, ctaText, productImage, brandName, website, price,
  colors, editable, onUpdate, onFocusEl, onBlurEl,
}: LuxuryProductProps) => (
  <div className="w-full h-full relative overflow-hidden flex flex-col font-sans" style={{ backgroundColor: colors.primary, color: colors.secondary }}>
    <div className="shrink-0" style={{ padding: "calc(4*var(--cb)) calc(5*var(--ci)) 0" }}>
      <div style={{ width: "100%", height: "calc(0.3*var(--ci))", marginBottom: "calc(2*var(--cb))", backgroundColor: colors.secondary, opacity: 0.15 }} />
      <div className="flex items-center justify-between" style={{ marginBottom: "calc(2*var(--cb))" }}>
        <EditableText as="p" fieldId="f-brand" editable={editable} value={brandName ?? ""}
          onChange={v => onUpdate?.("brandName", v)} onFocusEl={onFocusEl} onBlurEl={onBlurEl}
          className="tracking-[0.5em] uppercase opacity-40" style={{ fontSize: "calc(2*var(--ci))" }} />
        <EditableText as="p" fieldId="f-web" editable={editable} value={website ?? ""}
          onChange={v => onUpdate?.("website", v)} onFocusEl={onFocusEl} onBlurEl={onBlurEl}
          className="tracking-[0.3em] uppercase opacity-25" style={{ fontSize: "calc(2*var(--ci))" }} />
      </div>
      <div style={{ width: "100%", height: "calc(0.3*var(--ci))", backgroundColor: colors.secondary, opacity: 0.15 }} />
    </div>

    <div className="flex-1 flex">
      <div className="w-[50%] flex flex-col justify-center" style={{ padding: "calc(3*var(--cb)) calc(5*var(--ci))" }}>
        <h1 className="font-black leading-[0.82] tracking-tighter uppercase" style={{ fontSize: "calc(11*var(--ci))", marginBottom: "calc(4*var(--cb))" }}>
          <EditableHeadlineLines value={headline} editable={editable} onFocusEl={onFocusEl} onBlurEl={onBlurEl}
            onChange={v => onUpdate?.("headline", v)}
            renderLine={(line, i, node) => (
              <span className="block" style={i % 2 === 1 ? { color: colors.accent } : {}}>{node}</span>
            )} />
        </h1>
        <EditableText as="p" fieldId="f-sub" editable={editable} value={subtext ?? ""}
          onChange={v => onUpdate?.("subtext", v)} onFocusEl={onFocusEl} onBlurEl={onBlurEl}
          className="opacity-50 leading-relaxed" style={{ fontSize: "calc(2.2*var(--ci))", marginBottom: "calc(4*var(--cb))" }} />
        {price !== undefined && price !== "" && (
          <EditableText as="p" fieldId="f-price" editable={editable} value={price}
            onChange={v => onUpdate?.("price", v)} onFocusEl={onFocusEl} onBlurEl={onBlurEl}
            className="font-black leading-none" style={{ fontSize: "calc(6*var(--ci))", marginBottom: "calc(2*var(--cb))", color: colors.accent }} />
        )}
        <EditableText as="div" fieldId="f-cta" editable={editable} value={ctaText}
          onChange={v => onUpdate?.("ctaText", v)} onFocusEl={onFocusEl} onBlurEl={onBlurEl}
          className="inline-block font-black uppercase tracking-widest"
          style={{ backgroundColor: colors.secondary, color: colors.primary, padding: "calc(2*var(--cb)) calc(4*var(--ci))", fontSize: "calc(2.2*var(--ci))" }} />
      </div>

      <div className="w-[50%] relative">
        <Image src={productImage} alt="Product" fill className="object-contain object-center" crossOrigin="anonymous" />
      </div>
    </div>

    <div className="shrink-0" style={{ padding: "0 calc(5*var(--ci)) calc(4*var(--cb))" }}>
      <div style={{ width: "100%", height: "calc(0.3*var(--ci))", backgroundColor: colors.secondary, opacity: 0.15 }} />
    </div>
  </div>
);

/* ─────────────────────────────────────────────────────────────────
   10. CRIMSON VELVET
───────────────────────────────────────────────────────────────── */
const VariantCrimsonVelvet = ({
  headline, subtext, ctaText, productImage, brandName, website, price,
  colors, editable, onUpdate, onFocusEl, onBlurEl,
}: LuxuryProductProps) => (
  <div className="w-full h-full relative overflow-hidden flex flex-col font-sans" style={{ backgroundColor: colors.primary, color: colors.secondary }}>
    <div className="absolute inset-0 pointer-events-none opacity-[0.06]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)', backgroundSize: '20px 20px' }} />

    <div className="shrink-0 flex items-center" style={{ padding: "calc(4*var(--cb)) calc(5*var(--ci)) 0", gap: "calc(2*var(--ci))" }}>
      <div className="rounded-full" style={{ width: "calc(3*var(--ci))", height: "calc(3*var(--ci))", backgroundColor: colors.accent }} />
      <EditableText as="p" fieldId="f-brand" editable={editable} value={brandName ?? ""}
        onChange={v => onUpdate?.("brandName", v)} onFocusEl={onFocusEl} onBlurEl={onBlurEl}
        className="font-bold tracking-[0.3em] uppercase opacity-60" style={{ fontSize: "calc(2.2*var(--ci))" }} />
    </div>

    <div className="shrink-0" style={{ padding: "calc(3*var(--cb)) calc(5*var(--ci)) calc(2*var(--cb))" }}>
      <h1 className="font-black leading-[0.85] tracking-tighter uppercase" style={{ fontSize: "calc(10.5*var(--ci))" }}>
        <EditableHeadlineLines value={headline} editable={editable} onFocusEl={onFocusEl} onBlurEl={onBlurEl}
          onChange={v => onUpdate?.("headline", v)}
          renderLine={(line, i, node) => (
            <span className="block" style={i === 0 ? { color: colors.secondary } : { color: colors.accent }}>{node}</span>
          )} />
      </h1>
    </div>

    <div className="flex-1 relative z-10">
      <Image src={productImage} alt="Product" fill className="object-contain object-center" crossOrigin="anonymous" />
      <div className="absolute bottom-0 left-0 right-0 h-[30%]" style={{ background: `linear-gradient(to top, ${colors.primary}, transparent)` }} />
    </div>

    <div className="shrink-0 flex items-end justify-between z-10" style={{ padding: "0 calc(5*var(--ci)) calc(4*var(--cb))" }}>
      <div>
        {price !== undefined && price !== "" && (
          <EditableText as="p" fieldId="f-price" editable={editable} value={price}
            onChange={v => onUpdate?.("price", v)} onFocusEl={onFocusEl} onBlurEl={onBlurEl}
            className="font-black leading-none" style={{ fontSize: "calc(7*var(--ci))", color: colors.accent }} />
        )}
        <EditableText as="p" fieldId="f-sub" editable={editable} value={subtext ?? ""}
          onChange={v => onUpdate?.("subtext", v)} onFocusEl={onFocusEl} onBlurEl={onBlurEl}
          className="opacity-50" style={{ fontSize: "calc(2.2*var(--ci))", marginTop: "calc(0.5*var(--cb))", maxWidth: "calc(40*var(--ci))" }} />
        <EditableText as="p" fieldId="f-web" editable={editable} value={website ?? ""}
          onChange={v => onUpdate?.("website", v)} onFocusEl={onFocusEl} onBlurEl={onBlurEl}
          className="opacity-20 tracking-widest uppercase" style={{ fontSize: "calc(1.6*var(--ci))", marginTop: "calc(1*var(--cb))" }} />
      </div>
      <EditableText as="div" fieldId="f-cta" editable={editable} value={ctaText}
        onChange={v => onUpdate?.("ctaText", v)} onFocusEl={onFocusEl} onBlurEl={onBlurEl}
        className="font-black uppercase tracking-widest rounded-full"
        style={{ backgroundColor: colors.accent, color: colors.primary, padding: "calc(2.5*var(--cb)) calc(5*var(--ci))", fontSize: "calc(2.4*var(--ci))" }} />
    </div>
  </div>
);

/* ─────────────────────────────────────────────────────────────────
   11. NEW CATALOG
───────────────────────────────────────────────────────────────── */
const VariantNewCatalog = ({
  headline, subtext, brandName, ctaText, productImage, website, price,
  colors, editable, onUpdate, onFocusEl, onBlurEl,
}: LuxuryProductProps) => (
  <div className="w-full h-full relative overflow-hidden flex flex-col font-sans" style={{ backgroundColor: colors.primary, color: colors.secondary }}>
    <div
      className="shrink-0 flex items-center justify-between border-b z-10 relative"
      style={{ borderColor: `${colors.secondary}12`, padding: "calc(2.5*var(--cb)) calc(5*var(--ci))" }}
    >
      <EditableText as="p" fieldId="f-brand" editable={editable} value={brandName ?? ""}
        onChange={v => onUpdate?.("brandName", v)} onFocusEl={onFocusEl} onBlurEl={onBlurEl}
        className="font-black uppercase tracking-[0.35em]" style={{ fontSize: "calc(2.2*var(--ci))" }} />
      <EditableText as="p" fieldId="f-web" editable={editable} value={website ?? ""}
        onChange={v => onUpdate?.("website", v)} onFocusEl={onFocusEl} onBlurEl={onBlurEl}
        className="opacity-30 tracking-widest uppercase" style={{ fontSize: "calc(2*var(--ci))" }} />
    </div>

    <div className="shrink-0 z-10 relative" style={{ padding: "calc(3*var(--cb)) calc(5*var(--ci)) calc(1*var(--cb))" }}>
      <h1 className="font-black uppercase leading-[0.85] tracking-tighter" style={{ fontSize: "calc(7*var(--ci))" }}>
        <EditableHeadlineLines value={headline} editable={editable} onFocusEl={onFocusEl} onBlurEl={onBlurEl}
          onChange={v => onUpdate?.("headline", v)}
          renderLine={(line, i, node) => (
            <span className="block" style={i === 1 ? { color: colors.accent } : {}}>{node}</span>
          )} />
      </h1>
    </div>

    <div className="flex-1 flex z-10 relative" style={{ gap: "calc(1.5*var(--ci))", padding: "0 calc(5*var(--ci)) calc(1*var(--cb))" }}>
      <div className="flex-1 relative overflow-hidden" style={{ backgroundColor: `${colors.secondary}08`, borderRadius: "calc(2*var(--ci))" }}>
        <Image src={productImage} alt="Main" fill className="object-contain" style={{ padding: "calc(2*var(--ci))" }} crossOrigin="anonymous" />
      </div>
      <div className="w-[28%] flex flex-col" style={{ gap: "calc(1.5*var(--ci))" }}>
        <div className="flex-1 relative overflow-hidden" style={{ backgroundColor: `${colors.accent}15`, borderRadius: "calc(2*var(--ci))" }}>
          <Image src={productImage} alt="Side 1" fill className="object-contain scale-90 opacity-70" style={{ padding: "calc(2*var(--ci))" }} crossOrigin="anonymous" />
        </div>
        <div className="flex-1 relative overflow-hidden" style={{ backgroundColor: `${colors.secondary}08`, borderRadius: "calc(2*var(--ci))" }}>
          <Image src={productImage} alt="Side 2" fill className="object-contain scale-90 opacity-50" style={{ padding: "calc(2*var(--ci))" }} crossOrigin="anonymous" />
        </div>
      </div>
    </div>

    <div
      className="shrink-0 border-t flex items-center justify-between z-10 relative"
      style={{ borderColor: `${colors.secondary}12`, padding: "calc(2.5*var(--cb)) calc(5*var(--ci))" }}
    >
      <div>
        {price !== undefined && price !== "" && (
          <EditableText as="p" fieldId="f-price" editable={editable} value={price}
            onChange={v => onUpdate?.("price", v)} onFocusEl={onFocusEl} onBlurEl={onBlurEl}
            className="font-black leading-none" style={{ fontSize: "calc(5*var(--ci))", color: colors.accent }} />
        )}
        <EditableText as="p" fieldId="f-sub" editable={editable} value={subtext ?? ""}
          onChange={v => onUpdate?.("subtext", v)} onFocusEl={onFocusEl} onBlurEl={onBlurEl}
          className="opacity-45" style={{ fontSize: "calc(2*var(--ci))", marginTop: "calc(0.3*var(--cb))" }} />
      </div>
      <EditableText as="div" fieldId="f-cta" editable={editable} value={ctaText}
        onChange={v => onUpdate?.("ctaText", v)} onFocusEl={onFocusEl} onBlurEl={onBlurEl}
        className="font-black uppercase tracking-widest"
        style={{ backgroundColor: colors.accent, color: colors.primary, padding: "calc(2*var(--cb)) calc(4*var(--ci))", fontSize: "calc(2.2*var(--ci))" }} />
    </div>
  </div>
);

/* ─────────────────────────────────────────────────────────────────
   12. BORCELLE SKINCARE
───────────────────────────────────────────────────────────────── */
const VariantBorcelleSkincare = ({
  headline, subtext, ctaText, productImage, brandName, website, price,
  colors, editable, onUpdate, onFocusEl, onBlurEl,
}: LuxuryProductProps) => (
  <div className="w-full h-full relative overflow-hidden font-sans" style={{ backgroundColor: colors.primary, color: colors.secondary }}>
    <div className="w-full h-full grid grid-cols-2 grid-rows-2">
      <div className="relative border-r border-b" style={{ borderColor: `${colors.secondary}12`, backgroundColor: `${colors.accent}08` }}>
        <Image src={productImage} alt="Skincare" fill className="object-contain" style={{ padding: "calc(4*var(--ci))" }} crossOrigin="anonymous" />
      </div>

      <div
        className="flex flex-col items-start justify-end border-b"
        style={{ borderColor: `${colors.secondary}12`, padding: "calc(5*var(--ci))" }}
      >
        <EditableText as="p" fieldId="f-brand" editable={editable} value={brandName ?? ""}
          onChange={v => onUpdate?.("brandName", v)} onFocusEl={onFocusEl} onBlurEl={onBlurEl}
          className="tracking-[0.4em] uppercase opacity-30" style={{ fontSize: "calc(1.8*var(--ci))", marginBottom: "calc(1.5*var(--cb))" }} />
        <h1 className="font-black leading-[0.85] tracking-tighter uppercase" style={{ fontSize: "calc(7.5*var(--ci))" }}>
          <EditableHeadlineLines value={headline} editable={editable} onFocusEl={onFocusEl} onBlurEl={onBlurEl}
            onChange={v => onUpdate?.("headline", v)}
            renderLine={(line, i, node) => (
              <span className="block" style={i === 1 ? { color: colors.accent } : {}}>{node}</span>
            )} />
        </h1>
      </div>

      <div
        className="flex flex-col justify-center border-r"
        style={{ borderColor: `${colors.secondary}12`, padding: "calc(5*var(--ci))" }}
      >
        {price !== undefined && price !== "" && (
          <EditableText as="p" fieldId="f-price" editable={editable} value={price}
            onChange={v => onUpdate?.("price", v)} onFocusEl={onFocusEl} onBlurEl={onBlurEl}
            className="font-black leading-none" style={{ fontSize: "calc(7*var(--ci))", marginBottom: "calc(1.5*var(--cb))", color: colors.accent }} />
        )}
        <EditableText as="p" fieldId="f-sub" editable={editable} value={subtext ?? ""}
          onChange={v => onUpdate?.("subtext", v)} onFocusEl={onFocusEl} onBlurEl={onBlurEl}
          className="opacity-50 leading-relaxed" style={{ fontSize: "calc(2.2*var(--ci))" }} />
        <EditableText as="p" fieldId="f-web" editable={editable} value={website ?? ""}
          onChange={v => onUpdate?.("website", v)} onFocusEl={onFocusEl} onBlurEl={onBlurEl}
          className="opacity-20 tracking-widest uppercase" style={{ fontSize: "calc(1.6*var(--ci))", marginTop: "calc(2*var(--cb))" }} />
      </div>

      <div className="flex flex-col items-center justify-center" style={{ backgroundColor: colors.accent, padding: "calc(5*var(--ci))" }}>
        <p
          className="tracking-widest uppercase font-bold"
          style={{ color: colors.primary, opacity: 0.7, fontSize: "calc(2*var(--ci))", marginBottom: "calc(2*var(--cb))" }}
        >
          Get yours
        </p>
        <EditableText as="div" fieldId="f-cta" editable={editable} value={ctaText}
          onChange={v => onUpdate?.("ctaText", v)} onFocusEl={onFocusEl} onBlurEl={onBlurEl}
          className="font-black uppercase tracking-wider text-center"
          style={{
            borderColor: colors.primary, borderWidth: "calc(0.3*var(--ci))", borderStyle: "solid",
            color: colors.primary, padding: "calc(2.5*var(--cb)) calc(4*var(--ci))", fontSize: "calc(2.8*var(--ci))",
          }} />
      </div>
    </div>
  </div>
);