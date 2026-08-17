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
  email?: string;        // NEW — same fact-provenance as phone, from Gemini analysis
  features?: string[];   // NEW — short spec/highlight lines (e.g. "5G", "256GB", "AMOLED")
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
  /** field is one of: brandName | headline | subtext | ctaText | website | phone | email | price | instagram */
  onUpdate?: (field: string, value: string) => void;
  onFocusEl?: (el: HTMLElement) => void;
  onBlurEl?: () => void;
  // NEW — features is an array, so it needs its own callbacks (mirrors the
  // pattern used for freeTexts/logoOverlay arrays in the editor page)
  onUpdateFeature?: (index: number, value: string) => void;
  onAddFeature?: () => void;
  onRemoveFeature?: (index: number) => void;
}

/* ─────────────────────────────────────────────────────────────────
   SHARED — feature highlights + contact row
   Used across all 12 variants below. Sized in cqi so they scale with
   the same container-query system as everything else in this file.
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
    <div className={`flex flex-wrap gap-x-[calc(3*var(--ci))] gap-y-[calc(1*var(--ci))] ${className}`}>
      {features.map((feat, i) => (
        <div key={i} className="flex items-center gap-[calc(0.8*var(--ci))]">
          <CheckCircle2 size="calc(1.6*var(--ci))" style={{ color: colors.accent, width: "calc(1.6*var(--ci))", height: "calc(1.6*var(--ci))", flexShrink: 0 }} />
          <EditableText as="span" fieldId={`f-feature-${i}`} editable={editable} value={feat}
            onChange={v => onUpdateFeature?.(i, v)} onFocusEl={onFocusEl} onBlurEl={onBlurEl}
            className="text-[calc(1.9*var(--ci))] tracking-wide opacity-75" />
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
  // Skip entirely in read-only mode if there's genuinely nothing to show —
  // in edit mode we still render phone so the "default number, tap to
  // edit" affordance is always available.
  if (!editable && !phone && !email && !website) return null;

  return (
    <div className={`flex flex-wrap items-center gap-[calc(2*var(--ci))] ${align === "right" ? "justify-end" : ""} ${className}`}>
      {(editable || phone) && (
        <div className="flex items-center gap-[calc(0.6*var(--ci))]">
          <Phone size="calc(1.5*var(--ci))" style={{ color: colors.accent, width: "calc(1.5*var(--ci))", height: "calc(1.5*var(--ci))", flexShrink: 0 }} />
          <EditableText as="span" fieldId="f-phone" editable={editable} value={phone ?? ""}
            onChange={v => onUpdate?.("phone", v)} onFocusEl={onFocusEl} onBlurEl={onBlurEl}
            className="text-[calc(1.6*var(--ci))] opacity-40 tracking-widest" />
        </div>
      )}
      {(editable || email) && (
        <div className="flex items-center gap-[calc(0.6*var(--ci))]">
          <Mail size="calc(1.5*var(--ci))" style={{ color: colors.accent, width: "calc(1.5*var(--ci))", height: "calc(1.5*var(--ci))", flexShrink: 0 }} />
          <EditableText as="span" fieldId="f-email" editable={editable} value={email ?? ""}
            onChange={v => onUpdate?.("email", v)} onFocusEl={onFocusEl} onBlurEl={onBlurEl}
            className="text-[calc(1.6*var(--ci))] opacity-40 tracking-widest" />
        </div>
      )}
      {website !== undefined && (
        <EditableText as="p" fieldId="f-web" editable={editable} value={website ?? ""}
          onChange={v => onUpdate?.("website", v)} onFocusEl={onFocusEl} onBlurEl={onBlurEl}
          className="text-[calc(1.6*var(--ci))] opacity-25 tracking-widest" />
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
  <div className="@container w-full h-full relative overflow-hidden flex flex-col font-sans" style={{ backgroundColor: colors.primary, color: colors.secondary }}>
    <div className="shrink-0 flex items-center justify-between px-[calc(5*var(--ci))] py-[calc(3*var(--ci))] border-b" style={{ borderColor: `${colors.accent}30` }}>
      <EditableText as="p" fieldId="f-brand" editable={editable} value={brandName ?? ""}
        onChange={v => onUpdate?.("brandName", v)} onFocusEl={onFocusEl} onBlurEl={onBlurEl}
        className="text-[calc(2*var(--ci))] font-bold tracking-[0.4em] uppercase" />
      <EditableText as="p" fieldId="f-instagram" editable={editable} value={instagram ?? ""}
        onChange={v => onUpdate?.("instagram", v)} onFocusEl={onFocusEl} onBlurEl={onBlurEl}
        className="text-[calc(2*var(--ci))] opacity-50 tracking-widest" />
    </div>

    <div className="shrink-0 px-[calc(5*var(--ci))] pt-[calc(4*var(--ci))] pb-[calc(2*var(--ci))]">
      <EditableHeadlineLines value={headline} editable={editable} onFocusEl={onFocusEl} onBlurEl={onBlurEl}
        onChange={v => onUpdate?.("headline", v)}
        renderLine={(line, i, node) => (
          <p className={i === 0
            ? "text-[calc(11*var(--ci))] font-black leading-[0.85] tracking-tight"
            : "text-[calc(8*var(--ci))] font-light tracking-[0.15em] uppercase opacity-70"}
            style={i === 1 ? { color: colors.accent } : {}}>
            {node}
          </p>
        )} />
    </div>

    <div className="flex-1 relative">
      <Image src={productImage} alt="Product" fill className="object-contain object-center" crossOrigin="anonymous" />
      <div className="absolute inset-0" style={{ background: `radial-gradient(ellipse at center bottom, ${colors.primary}60, transparent 70%)` }} />
    </div>

    <div className="shrink-0 flex items-center justify-between px-[calc(5*var(--ci))] py-[calc(3.5*var(--ci))] border-t" style={{ borderColor: `${colors.accent}30`, backgroundColor: `${colors.accent}08` }}>
      <div>
        {price !== undefined && price !== "" && (
          <EditableText as="p" fieldId="f-price" editable={editable} value={price}
            onChange={v => onUpdate?.("price", v)} onFocusEl={onFocusEl} onBlurEl={onBlurEl}
            className="text-[calc(5*var(--ci))] font-black" style={{ color: colors.accent }} />
        )}
        <EditableText as="p" fieldId="f-sub" editable={editable} value={subtext ?? ""}
          onChange={v => onUpdate?.("subtext", v)} onFocusEl={onFocusEl} onBlurEl={onBlurEl}
          className="text-[calc(2*var(--ci))] opacity-50 mt-[calc(0.5*var(--ci))]" />
      </div>
      <div>
        <EditableText as="div" fieldId="f-cta" editable={editable} value={ctaText}
          onChange={v => onUpdate?.("ctaText", v)} onFocusEl={onFocusEl} onBlurEl={onBlurEl}
          className="px-[calc(4*var(--ci))] py-[calc(2*var(--ci))] text-[calc(2.2*var(--ci))] font-black uppercase tracking-widest mb-[calc(1*var(--ci))]" style={{ backgroundColor: colors.accent, color: colors.primary }} />
        <EditableText as="p" fieldId="f-web" editable={editable} value={website ?? ""}
          onChange={v => onUpdate?.("website", v)} onFocusEl={onFocusEl} onBlurEl={onBlurEl}
          className="text-[calc(1.8*var(--ci))] opacity-25 text-right tracking-widest" />
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
    <div className="@container w-full h-full relative overflow-hidden flex flex-col font-sans" style={{ backgroundColor: colors.primary, color: colors.secondary }}>
      <div className="absolute left-[calc(12*var(--ci))] top-0 bottom-0 w-[calc(0.3*var(--ci))] z-10" style={{ backgroundColor: colors.accent, opacity: 0.4 }} />

      <div className="absolute left-[calc(6*var(--ci))] top-1/2 -translate-y-1/2 -rotate-90 z-10">
        <EditableText as="p" fieldId="f-brand" editable={editable} value={brandName ?? ""}
          onChange={v => onUpdate?.("brandName", v)} onFocusEl={onFocusEl} onBlurEl={onBlurEl}
          className="text-[calc(2*var(--ci))] tracking-[0.5em] uppercase font-bold opacity-30 whitespace-nowrap" />
      </div>

      <div className="flex-1 flex flex-col pl-[calc(15*var(--ci))] pr-[calc(5*var(--ci))] pt-[calc(5*var(--ci))] pb-[calc(4*var(--ci))]">
        <div className="shrink-0 mb-[calc(3*var(--ci))]">
          <EditableText as="p" fieldId="f-headline-0" editable={editable} value={eyebrow}
            onChange={v => {
              // reconstruct the joined headline with just the eyebrow line replaced
              const next = [v, ...lines.slice(1)];
              onUpdate?.("headline", next.join('\n'));
            }} onFocusEl={onFocusEl} onBlurEl={onBlurEl}
            className="text-[calc(2*var(--ci))] tracking-[0.4em] uppercase opacity-40 mb-[calc(2*var(--ci))]" />
          <h1 className="text-[calc(11*var(--ci))] font-black leading-[0.85] tracking-tight">
            <EditableText as="span" fieldId="f-headline-1" editable={editable} value={rest}
              onChange={v => {
                const next = [lines[0] ?? "", v];
                onUpdate?.("headline", next.join('\n'));
              }} onFocusEl={onFocusEl} onBlurEl={onBlurEl} />
          </h1>
          <div className="w-[calc(8*var(--ci))] h-[calc(0.3*var(--ci))] mt-[calc(2*var(--ci))]" style={{ backgroundColor: colors.accent }} />
        </div>

        <div className="flex-1 relative">
          <Image src={productImage} alt="Product" fill className="object-contain object-center" crossOrigin="anonymous" />
        </div>

        <div className="shrink-0 flex items-end justify-between pt-[calc(2*var(--ci))]">
          <div>
            <EditableText as="p" fieldId="f-sub" editable={editable} value={subtext ?? ""}
              onChange={v => onUpdate?.("subtext", v)} onFocusEl={onFocusEl} onBlurEl={onBlurEl}
              className="text-[calc(2.2*var(--ci))] opacity-50 mb-[calc(1*var(--ci))] max-w-[calc(40*var(--ci))]" />
            <EditableText as="p" fieldId="f-web" editable={editable} value={website ?? ""}
              onChange={v => onUpdate?.("website", v)} onFocusEl={onFocusEl} onBlurEl={onBlurEl}
              className="text-[calc(1.8*var(--ci))] opacity-25 tracking-widest uppercase" />
          </div>
          <div className="text-right">
            {price !== undefined && price !== "" && (
              <EditableText as="p" fieldId="f-price" editable={editable} value={price}
                onChange={v => onUpdate?.("price", v)} onFocusEl={onFocusEl} onBlurEl={onBlurEl}
                className="text-[calc(6*var(--ci))] font-black mb-[calc(1*var(--ci))]" style={{ color: colors.accent }} />
            )}
            <EditableText as="div" fieldId="f-cta" editable={editable} value={ctaText}
              onChange={v => onUpdate?.("ctaText", v)} onFocusEl={onFocusEl} onBlurEl={onBlurEl}
              className="inline-block px-[calc(4*var(--ci))] py-[calc(2*var(--ci))] text-[calc(2.2*var(--ci))] font-black uppercase tracking-widest" style={{ backgroundColor: colors.accent, color: colors.primary }} />
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
  <div className="@container w-full h-full relative overflow-hidden flex flex-col font-sans" style={{ backgroundColor: colors.primary, color: colors.secondary }}>
    <div className="absolute top-0 right-0 w-[60%] h-[60%] z-0" style={{ backgroundColor: colors.accent, clipPath: 'circle(50% at 100% 0%)', opacity: 0.08 }} />

    <div className="shrink-0 px-[calc(5*var(--ci))] pt-[calc(4*var(--ci))] pb-[calc(2*var(--ci))] flex items-center justify-between z-10 relative">
      <EditableText as="p" fieldId="f-web" editable={editable} value={website ?? ""}
        onChange={v => onUpdate?.("website", v)} onFocusEl={onFocusEl} onBlurEl={onBlurEl}
        className="text-[calc(2*var(--ci))] tracking-[0.4em] uppercase opacity-50" />
      <div className="w-[calc(6*var(--ci))] h-[calc(0.3*var(--ci))]" style={{ backgroundColor: colors.accent }} />
    </div>

    <div className="shrink-0 px-[calc(5*var(--ci))] z-10 relative">
      <EditableHeadlineLines value={headline} editable={editable} onFocusEl={onFocusEl} onBlurEl={onBlurEl}
        onChange={v => onUpdate?.("headline", v)}
        renderLine={(line, i, node) => (
          <h1 className="font-black uppercase leading-[0.82] tracking-tighter"
            style={{ fontSize: `calc((${14 - i * 1}) * var(--ci))`, color: i === 0 ? colors.secondary : colors.accent }}>
            {node}
          </h1>
        )} />
    </div>

    <div className="flex-1 relative z-10 px-[calc(4*var(--ci))]">
      <Image src={productImage} alt="Product" fill className="object-contain object-center" crossOrigin="anonymous" />
    </div>

    <div className="shrink-0 z-10 flex items-center justify-between px-[calc(5*var(--ci))] py-[calc(3.5*var(--ci))]" style={{ backgroundColor: colors.accent }}>
      <div>
        {price !== undefined && price !== "" && (
          <EditableText as="p" fieldId="f-price" editable={editable} value={price}
            onChange={v => onUpdate?.("price", v)} onFocusEl={onFocusEl} onBlurEl={onBlurEl}
            className="text-[calc(5*var(--ci))] font-black leading-none" style={{ color: colors.primary }} />
        )}
        <EditableText as="p" fieldId="f-sub" editable={editable} value={subtext ?? ""}
          onChange={v => onUpdate?.("subtext", v)} onFocusEl={onFocusEl} onBlurEl={onBlurEl}
          className="text-[calc(2*var(--ci))] opacity-60 mt-[calc(0.5*var(--ci))]" style={{ color: colors.primary }} />
      </div>
      <EditableText as="div" fieldId="f-cta" editable={editable} value={ctaText}
        onChange={v => onUpdate?.("ctaText", v)} onFocusEl={onFocusEl} onBlurEl={onBlurEl}
        className="px-[calc(4*var(--ci))] py-[calc(2*var(--ci))] text-[calc(2.4*var(--ci))] font-black uppercase tracking-widest" style={{ backgroundColor: colors.primary, color: colors.accent }} />
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
  <div className="@container w-full h-full relative overflow-hidden flex flex-col font-sans" style={{ backgroundColor: colors.primary, color: colors.secondary }}>
    <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/noise.png")' }} />

    <div className="shrink-0 px-[calc(5*var(--ci))] pt-[calc(4*var(--ci))] flex items-center justify-between z-10 relative">
      <EditableText as="p" fieldId="f-brand" editable={editable} value={brandName ?? ""}
        onChange={v => onUpdate?.("brandName", v)} onFocusEl={onFocusEl} onBlurEl={onBlurEl}
        className="text-[calc(2*var(--ci))] tracking-[0.5em] uppercase font-bold opacity-30" />
      <div className="w-[calc(4*var(--ci))] h-[calc(4*var(--ci))] rounded-full border-[calc(0.3*var(--ci))]" style={{ borderColor: colors.accent, opacity: 0.5 }} />
    </div>

    <div className="shrink-0 px-[calc(5*var(--ci))] pt-[calc(3*var(--ci))] pb-[calc(2*var(--ci))] z-10 relative">
      <h1 className="text-[calc(10*var(--ci))] font-black leading-[0.85] tracking-tight uppercase">
        <EditableHeadlineLines value={headline} editable={editable} onFocusEl={onFocusEl} onBlurEl={onBlurEl}
          onChange={v => onUpdate?.("headline", v)}
          renderLine={(line, i, node) => (
            <span className="block" style={i % 2 === 1 ? { color: colors.accent } : {}}>{node}</span>
          )} />
      </h1>
    </div>

    <div className="mx-[calc(5*var(--ci))] h-[calc(0.2*var(--ci))] z-10 relative" style={{ backgroundColor: `${colors.secondary}20` }} />

    <div className="flex-1 relative z-10">
      <Image src={productImage} alt="Product" fill className="object-contain object-center" crossOrigin="anonymous" />
      <div className="absolute inset-0" style={{ background: `radial-gradient(ellipse at center, transparent 40%, ${colors.primary}80 100%)` }} />
    </div>

    <div className="shrink-0 px-[calc(5*var(--ci))] pb-[calc(4*var(--ci))] flex items-end justify-between z-10 relative">
      <div>
        {price !== undefined && price !== "" && (
          <EditableText as="p" fieldId="f-price" editable={editable} value={price}
            onChange={v => onUpdate?.("price", v)} onFocusEl={onFocusEl} onBlurEl={onBlurEl}
            className="text-[calc(7*var(--ci))] font-black leading-none" style={{ color: colors.accent }} />
        )}
        <EditableText as="p" fieldId="f-sub" editable={editable} value={subtext ?? ""}
          onChange={v => onUpdate?.("subtext", v)} onFocusEl={onFocusEl} onBlurEl={onBlurEl}
          className="text-[calc(2*var(--ci))] opacity-40 mt-[calc(0.5*var(--ci))]" />
        <EditableText as="p" fieldId="f-web" editable={editable} value={website ?? ""}
          onChange={v => onUpdate?.("website", v)} onFocusEl={onFocusEl} onBlurEl={onBlurEl}
          className="text-[calc(1.6*var(--ci))] opacity-20 mt-[calc(1*var(--ci))] tracking-widest uppercase" />
      </div>
      <EditableText as="div" fieldId="f-cta" editable={editable} value={ctaText}
        onChange={v => onUpdate?.("ctaText", v)} onFocusEl={onFocusEl} onBlurEl={onBlurEl}
        className="px-[calc(4*var(--ci))] py-[calc(2.5*var(--ci))] text-[calc(2.2*var(--ci))] font-black uppercase tracking-wider" style={{ border: `calc(0.3*var(--ci)) solid ${colors.accent}`, color: colors.accent }} />
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
  <div className="@container w-full h-full relative overflow-hidden flex flex-col font-sans" style={{ backgroundColor: colors.primary, color: colors.secondary }}>
    <div className="absolute inset-0 pointer-events-none" style={{ background: `radial-gradient(ellipse at 50% 60%, ${colors.accent}15 0%, transparent 65%)` }} />

    <div className="shrink-0 px-[calc(5*var(--ci))] pt-[calc(5*var(--ci))] z-10 relative">
      <div className="flex items-center gap-[calc(2*var(--ci))] mb-[calc(3*var(--ci))]">
        <div className="w-[calc(4*var(--ci))] h-[calc(0.2*var(--ci))]" style={{ backgroundColor: colors.accent }} />
        <EditableText as="p" fieldId="f-web" editable={editable} value={website ?? ""}
          onChange={v => onUpdate?.("website", v)} onFocusEl={onFocusEl} onBlurEl={onBlurEl}
          className="text-[calc(1.8*var(--ci))] tracking-[0.4em] uppercase opacity-50" />
      </div>
      <h1 className="text-[calc(10.5*var(--ci))] font-black leading-[0.85] tracking-tighter uppercase">
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

    <div className="shrink-0 px-[calc(5*var(--ci))] pb-[calc(4*var(--ci))] z-10 relative">
      <div className="w-full h-[calc(0.2*var(--ci))] mb-[calc(3*var(--ci))]" style={{ backgroundColor: `${colors.accent}30` }} />
      <div className="flex items-end justify-between">
        <div>
          {price !== undefined && price !== "" && (
            <EditableText as="p" fieldId="f-price" editable={editable} value={price}
              onChange={v => onUpdate?.("price", v)} onFocusEl={onFocusEl} onBlurEl={onBlurEl}
              className="text-[calc(8*var(--ci))] font-black leading-none" style={{ color: colors.accent }} />
          )}
          <EditableText as="p" fieldId="f-sub" editable={editable} value={subtext ?? ""}
            onChange={v => onUpdate?.("subtext", v)} onFocusEl={onFocusEl} onBlurEl={onBlurEl}
            className="text-[calc(2.2*var(--ci))] opacity-50 mt-[calc(0.5*var(--ci))] max-w-[calc(40*var(--ci))]" />
        </div>
        <EditableText as="div" fieldId="f-cta" editable={editable} value={ctaText}
          onChange={v => onUpdate?.("ctaText", v)} onFocusEl={onFocusEl} onBlurEl={onBlurEl}
          className="px-[calc(5*var(--ci))] py-[calc(2.5*var(--ci))] text-[calc(2.4*var(--ci))] font-black uppercase tracking-widest rounded-full" style={{ backgroundColor: colors.accent, color: colors.primary }} />
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
  <div className="@container w-full h-full relative overflow-hidden flex font-sans" style={{ backgroundColor: colors.primary, color: colors.secondary }}>
    <div className="w-[42%] h-full flex flex-col justify-between p-[calc(5*var(--ci))] border-r z-10 relative" style={{ borderColor: `${colors.secondary}15` }}>
      <div>
        <EditableText as="p" fieldId="f-brand" editable={editable} value={brandName ?? ""}
          onChange={v => onUpdate?.("brandName", v)} onFocusEl={onFocusEl} onBlurEl={onBlurEl}
          className="text-[calc(1.8*var(--ci))] tracking-[0.5em] uppercase opacity-30 mb-[calc(4*var(--ci))]" />
        <h1 className="text-[calc(9*var(--ci))] font-black leading-[0.85] tracking-tight uppercase mb-[calc(3*var(--ci))]">
          <EditableHeadlineLines value={headline} editable={editable} onFocusEl={onFocusEl} onBlurEl={onBlurEl}
            onChange={v => onUpdate?.("headline", v)}
            renderLine={(line, i, node) => (
              <span className="block" style={i === 1 ? { color: colors.accent } : {}}>{node}</span>
            )} />
        </h1>
        <div className="w-[calc(6*var(--ci))] h-[calc(0.3*var(--ci))] mb-[calc(3*var(--ci))]" style={{ backgroundColor: colors.accent }} />
        <EditableText as="p" fieldId="f-sub" editable={editable} value={subtext ?? ""}
          onChange={v => onUpdate?.("subtext", v)} onFocusEl={onFocusEl} onBlurEl={onBlurEl}
          className="text-[calc(2.2*var(--ci))] leading-relaxed opacity-50" />
      </div>
      <div>
        {price !== undefined && price !== "" && (
          <EditableText as="p" fieldId="f-price" editable={editable} value={price}
            onChange={v => onUpdate?.("price", v)} onFocusEl={onFocusEl} onBlurEl={onBlurEl}
            className="text-[calc(7*var(--ci))] font-black leading-none mb-[calc(2*var(--ci))]" style={{ color: colors.accent }} />
        )}
        <EditableText as="div" fieldId="f-cta" editable={editable} value={ctaText}
          onChange={v => onUpdate?.("ctaText", v)} onFocusEl={onFocusEl} onBlurEl={onBlurEl}
          className="px-[calc(3*var(--ci))] py-[calc(2*var(--ci))] text-[calc(2.2*var(--ci))] font-black uppercase tracking-widest mb-[calc(1.5*var(--ci))]" style={{ backgroundColor: colors.accent, color: colors.primary }} />
        <EditableText as="p" fieldId="f-web" editable={editable} value={website ?? ""}
          onChange={v => onUpdate?.("website", v)} onFocusEl={onFocusEl} onBlurEl={onBlurEl}
          className="text-[calc(1.6*var(--ci))] opacity-20 tracking-widest uppercase" />
      </div>
    </div>

    <div className="w-[58%] relative">
      <Image src={productImage} alt="Product" fill className="object-contain object-center p-[calc(3*var(--ci))]" crossOrigin="anonymous" />
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
    <div className="@container w-full h-full relative overflow-hidden flex flex-col items-center font-sans text-center" style={{ backgroundColor: colors.primary, color: colors.secondary }}>
      <div className="shrink-0 w-full flex items-center justify-between px-[calc(5*var(--ci))] pt-[calc(4*var(--ci))] pb-[calc(2*var(--ci))]">
        <EditableText as="p" fieldId="f-brand" editable={editable} value={brandName ?? ""}
          onChange={v => onUpdate?.("brandName", v)} onFocusEl={onFocusEl} onBlurEl={onBlurEl}
          className="text-[calc(1.8*var(--ci))] tracking-[0.5em] uppercase opacity-30" />
        <div className="w-[calc(4*var(--ci))] h-[calc(0.2*var(--ci))]" style={{ backgroundColor: `${colors.secondary}30` }} />
        <EditableText as="p" fieldId="f-web" editable={editable} value={website ?? ""}
          onChange={v => onUpdate?.("website", v)} onFocusEl={onFocusEl} onBlurEl={onBlurEl}
          className="text-[calc(1.8*var(--ci))] tracking-[0.4em] uppercase opacity-30" />
      </div>

      <div className="shrink-0 px-[calc(6*var(--ci))] pt-[calc(2*var(--ci))] pb-[calc(3*var(--ci))]">
        <EditableText as="p" fieldId="f-headline-0" editable={editable} value={eyebrow}
          onChange={v => onUpdate?.("headline", [v, lines[1] ?? ""].join('\n'))}
          onFocusEl={onFocusEl} onBlurEl={onBlurEl}
          className="text-[calc(2*var(--ci))] tracking-[0.4em] uppercase opacity-40 mb-[calc(2*var(--ci))]" />
        <h1 className="text-[calc(10*var(--ci))] font-black leading-[0.85] tracking-tight uppercase">
          <EditableText as="span" fieldId="f-headline-1" editable={editable} value={main}
            onChange={v => onUpdate?.("headline", [lines[0] ?? "", v].join('\n'))}
            onFocusEl={onFocusEl} onBlurEl={onBlurEl} />
        </h1>
        <div className="w-[calc(6*var(--ci))] h-[calc(0.3*var(--ci))] mx-auto mt-[calc(2*var(--ci))]" style={{ backgroundColor: colors.accent }} />
      </div>

      <div className="flex-1 w-full relative px-[calc(4*var(--ci))]">
        <Image src={productImage} alt="Product" fill className="object-contain object-center" crossOrigin="anonymous" />
      </div>

      <div className="shrink-0 w-full px-[calc(5*var(--ci))] pb-[calc(4*var(--ci))] pt-[calc(2*var(--ci))] flex items-end justify-between">
        <div className="text-left">
          <EditableText as="p" fieldId="f-sub" editable={editable} value={subtext ?? ""}
            onChange={v => onUpdate?.("subtext", v)} onFocusEl={onFocusEl} onBlurEl={onBlurEl}
            className="text-[calc(2.2*var(--ci))] opacity-50 max-w-[calc(35*var(--ci))]" />
        </div>
        <div className="text-right">
          {price !== undefined && price !== "" && (
            <EditableText as="p" fieldId="f-price" editable={editable} value={price}
              onChange={v => onUpdate?.("price", v)} onFocusEl={onFocusEl} onBlurEl={onBlurEl}
              className="text-[calc(6*var(--ci))] font-black leading-none" style={{ color: colors.accent }} />
          )}
          <EditableText as="div" fieldId="f-cta" editable={editable} value={ctaText}
            onChange={v => onUpdate?.("ctaText", v)} onFocusEl={onFocusEl} onBlurEl={onBlurEl}
            className="inline-block mt-[calc(1.5*var(--ci))] px-[calc(4*var(--ci))] py-[calc(2*var(--ci))] text-[calc(2.2*var(--ci))] font-black uppercase tracking-widest" style={{ backgroundColor: colors.accent, color: colors.primary }} />
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
  <div className="@container w-full h-full relative overflow-hidden flex flex-col font-sans" style={{ backgroundColor: colors.primary, color: colors.secondary }}>
    <div className="h-[55%] relative shrink-0">
      <Image src={productImage} alt="Product" fill className="object-contain object-center p-[calc(3*var(--ci))]" crossOrigin="anonymous" />
      <div className="absolute inset-0" style={{ background: `linear-gradient(to bottom, transparent 60%, ${colors.primary} 100%)` }} />
    </div>

    <div className="flex-1 px-[calc(5*var(--ci))] pb-[calc(5*var(--ci))] flex flex-col justify-between">
      <div>
        <EditableHeadlineLines value={headline} editable={editable} onFocusEl={onFocusEl} onBlurEl={onBlurEl}
          onChange={v => onUpdate?.("headline", v)}
          renderLine={(line, i, node) => (
            <p className={i === 0
              ? "text-[calc(2.5*var(--ci))] tracking-[0.4em] uppercase opacity-40 mb-[calc(1*var(--ci))]"
              : "text-[calc(10*var(--ci))] font-black leading-[0.85] tracking-tighter uppercase"}
              style={i === 1 ? { color: colors.secondary } : {}}>
              {node}
            </p>
          )} />
        <div className="w-[calc(6*var(--ci))] h-[calc(0.3*var(--ci))] mt-[calc(2*var(--ci))]" style={{ backgroundColor: colors.accent }} />
      </div>
      <div className="flex items-end justify-between">
        <div>
          {price !== undefined && price !== "" && (
            <EditableText as="p" fieldId="f-price" editable={editable} value={price}
              onChange={v => onUpdate?.("price", v)} onFocusEl={onFocusEl} onBlurEl={onBlurEl}
              className="text-[calc(7*var(--ci))] font-black leading-none" style={{ color: colors.accent }} />
          )}
          <EditableText as="p" fieldId="f-sub" editable={editable} value={subtext ?? ""}
            onChange={v => onUpdate?.("subtext", v)} onFocusEl={onFocusEl} onBlurEl={onBlurEl}
            className="text-[calc(2*var(--ci))] opacity-50 mt-[calc(0.5*var(--ci))]" />
          <EditableText as="p" fieldId="f-web" editable={editable} value={website ?? ""}
            onChange={v => onUpdate?.("website", v)} onFocusEl={onFocusEl} onBlurEl={onBlurEl}
            className="text-[calc(1.6*var(--ci))] opacity-20 tracking-widest uppercase mt-[calc(1*var(--ci))]" />
        </div>
        <EditableText as="div" fieldId="f-cta" editable={editable} value={ctaText}
          onChange={v => onUpdate?.("ctaText", v)} onFocusEl={onFocusEl} onBlurEl={onBlurEl}
          className="px-[calc(4*var(--ci))] py-[calc(2.5*var(--ci))] text-[calc(2.4*var(--ci))] font-black uppercase tracking-widest rounded-full" style={{ backgroundColor: colors.accent, color: colors.primary }} />
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
  <div className="@container w-full h-full relative overflow-hidden flex flex-col font-sans" style={{ backgroundColor: colors.primary, color: colors.secondary }}>
    <div className="shrink-0 px-[calc(5*var(--ci))] pt-[calc(4*var(--ci))]">
      <div className="w-full h-[calc(0.3*var(--ci))] mb-[calc(2*var(--ci))]" style={{ backgroundColor: colors.secondary, opacity: 0.15 }} />
      <div className="flex items-center justify-between mb-[calc(2*var(--ci))]">
        <EditableText as="p" fieldId="f-brand" editable={editable} value={brandName ?? ""}
          onChange={v => onUpdate?.("brandName", v)} onFocusEl={onFocusEl} onBlurEl={onBlurEl}
          className="text-[calc(2*var(--ci))] tracking-[0.5em] uppercase opacity-40" />
        <EditableText as="p" fieldId="f-web" editable={editable} value={website ?? ""}
          onChange={v => onUpdate?.("website", v)} onFocusEl={onFocusEl} onBlurEl={onBlurEl}
          className="text-[calc(2*var(--ci))] tracking-[0.3em] uppercase opacity-25" />
      </div>
      <div className="w-full h-[calc(0.3*var(--ci))]" style={{ backgroundColor: colors.secondary, opacity: 0.15 }} />
    </div>

    <div className="flex-1 flex">
      <div className="w-[50%] flex flex-col justify-center px-[calc(5*var(--ci))] py-[calc(3*var(--ci))]">
        <h1 className="text-[calc(11*var(--ci))] font-black leading-[0.82] tracking-tighter uppercase mb-[calc(4*var(--ci))]">
          <EditableHeadlineLines value={headline} editable={editable} onFocusEl={onFocusEl} onBlurEl={onBlurEl}
            onChange={v => onUpdate?.("headline", v)}
            renderLine={(line, i, node) => (
              <span className="block" style={i % 2 === 1 ? { color: colors.accent } : {}}>{node}</span>
            )} />
        </h1>
        <EditableText as="p" fieldId="f-sub" editable={editable} value={subtext ?? ""}
          onChange={v => onUpdate?.("subtext", v)} onFocusEl={onFocusEl} onBlurEl={onBlurEl}
          className="text-[calc(2.2*var(--ci))] opacity-50 leading-relaxed mb-[calc(4*var(--ci))]" />
        {price !== undefined && price !== "" && (
          <EditableText as="p" fieldId="f-price" editable={editable} value={price}
            onChange={v => onUpdate?.("price", v)} onFocusEl={onFocusEl} onBlurEl={onBlurEl}
            className="text-[calc(6*var(--ci))] font-black leading-none mb-[calc(2*var(--ci))]" style={{ color: colors.accent }} />
        )}
        <EditableText as="div" fieldId="f-cta" editable={editable} value={ctaText}
          onChange={v => onUpdate?.("ctaText", v)} onFocusEl={onFocusEl} onBlurEl={onBlurEl}
          className="inline-block px-[calc(4*var(--ci))] py-[calc(2*var(--ci))] text-[calc(2.2*var(--ci))] font-black uppercase tracking-widest" style={{ backgroundColor: colors.secondary, color: colors.primary }} />
      </div>

      <div className="w-[50%] relative">
        <Image src={productImage} alt="Product" fill className="object-contain object-center" crossOrigin="anonymous" />
      </div>
    </div>

    <div className="shrink-0 px-[calc(5*var(--ci))] pb-[calc(4*var(--ci))]">
      <div className="w-full h-[calc(0.3*var(--ci))]" style={{ backgroundColor: colors.secondary, opacity: 0.15 }} />
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
  <div className="@container w-full h-full relative overflow-hidden flex flex-col font-sans" style={{ backgroundColor: colors.primary, color: colors.secondary }}>
    <div className="absolute inset-0 pointer-events-none opacity-[0.06]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)', backgroundSize: '20px 20px' }} />

    <div className="shrink-0 px-[calc(5*var(--ci))] pt-[calc(4*var(--ci))] flex items-center gap-[calc(2*var(--ci))]">
      <div className="w-[calc(3*var(--ci))] h-[calc(3*var(--ci))] rounded-full" style={{ backgroundColor: colors.accent }} />
      <EditableText as="p" fieldId="f-brand" editable={editable} value={brandName ?? ""}
        onChange={v => onUpdate?.("brandName", v)} onFocusEl={onFocusEl} onBlurEl={onBlurEl}
        className="text-[calc(2.2*var(--ci))] font-bold tracking-[0.3em] uppercase opacity-60" />
    </div>

    <div className="shrink-0 px-[calc(5*var(--ci))] pt-[calc(3*var(--ci))] pb-[calc(2*var(--ci))]">
      <h1 className="text-[calc(10.5*var(--ci))] font-black leading-[0.85] tracking-tighter uppercase">
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

    <div className="shrink-0 px-[calc(5*var(--ci))] pb-[calc(4*var(--ci))] flex items-end justify-between z-10">
      <div>
        {price !== undefined && price !== "" && (
          <EditableText as="p" fieldId="f-price" editable={editable} value={price}
            onChange={v => onUpdate?.("price", v)} onFocusEl={onFocusEl} onBlurEl={onBlurEl}
            className="text-[calc(7*var(--ci))] font-black leading-none" style={{ color: colors.accent }} />
        )}
        <EditableText as="p" fieldId="f-sub" editable={editable} value={subtext ?? ""}
          onChange={v => onUpdate?.("subtext", v)} onFocusEl={onFocusEl} onBlurEl={onBlurEl}
          className="text-[calc(2.2*var(--ci))] opacity-50 mt-[calc(0.5*var(--ci))] max-w-[calc(40*var(--ci))]" />
        <EditableText as="p" fieldId="f-web" editable={editable} value={website ?? ""}
          onChange={v => onUpdate?.("website", v)} onFocusEl={onFocusEl} onBlurEl={onBlurEl}
          className="text-[calc(1.6*var(--ci))] opacity-20 mt-[calc(1*var(--ci))] tracking-widest uppercase" />
      </div>
      <EditableText as="div" fieldId="f-cta" editable={editable} value={ctaText}
        onChange={v => onUpdate?.("ctaText", v)} onFocusEl={onFocusEl} onBlurEl={onBlurEl}
        className="px-[calc(5*var(--ci))] py-[calc(2.5*var(--ci))] text-[calc(2.4*var(--ci))] font-black uppercase tracking-widest rounded-full" style={{ backgroundColor: colors.accent, color: colors.primary }} />
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
  <div className="@container w-full h-full relative overflow-hidden flex flex-col font-sans" style={{ backgroundColor: colors.primary, color: colors.secondary }}>
    <div className="shrink-0 flex items-center justify-between px-[calc(5*var(--ci))] py-[calc(2.5*var(--ci))] border-b z-10 relative" style={{ borderColor: `${colors.secondary}12` }}>
      <EditableText as="p" fieldId="f-brand" editable={editable} value={brandName ?? ""}
        onChange={v => onUpdate?.("brandName", v)} onFocusEl={onFocusEl} onBlurEl={onBlurEl}
        className="text-[calc(2.2*var(--ci))] font-black uppercase tracking-[0.35em]" />
      <EditableText as="p" fieldId="f-web" editable={editable} value={website ?? ""}
        onChange={v => onUpdate?.("website", v)} onFocusEl={onFocusEl} onBlurEl={onBlurEl}
        className="text-[calc(2*var(--ci))] opacity-30 tracking-widest uppercase" />
    </div>

    <div className="shrink-0 px-[calc(5*var(--ci))] pt-[calc(3*var(--ci))] pb-[calc(1*var(--ci))] z-10 relative">
      <h1 className="text-[calc(7*var(--ci))] font-black uppercase leading-[0.85] tracking-tighter">
        <EditableHeadlineLines value={headline} editable={editable} onFocusEl={onFocusEl} onBlurEl={onBlurEl}
          onChange={v => onUpdate?.("headline", v)}
          renderLine={(line, i, node) => (
            <span className="block" style={i === 1 ? { color: colors.accent } : {}}>{node}</span>
          )} />
      </h1>
    </div>

    <div className="flex-1 flex gap-[calc(1.5*var(--ci))] px-[calc(5*var(--ci))] pb-[calc(1*var(--ci))] z-10 relative">
      <div className="flex-1 relative rounded-[calc(2*var(--ci))] overflow-hidden" style={{ backgroundColor: `${colors.secondary}08` }}>
        <Image src={productImage} alt="Main" fill className="object-contain p-[calc(2*var(--ci))]" crossOrigin="anonymous" />
      </div>
      <div className="w-[28%] flex flex-col gap-[calc(1.5*var(--ci))]">
        <div className="flex-1 relative rounded-[calc(2*var(--ci))] overflow-hidden" style={{ backgroundColor: `${colors.accent}15` }}>
          <Image src={productImage} alt="Side 1" fill className="object-contain p-[calc(2*var(--ci))] scale-90 opacity-70" crossOrigin="anonymous" />
        </div>
        <div className="flex-1 relative rounded-[calc(2*var(--ci))] overflow-hidden" style={{ backgroundColor: `${colors.secondary}08` }}>
          <Image src={productImage} alt="Side 2" fill className="object-contain p-[calc(2*var(--ci))] scale-90 opacity-50" crossOrigin="anonymous" />
        </div>
      </div>
    </div>

    <div className="shrink-0 border-t px-[calc(5*var(--ci))] py-[calc(2.5*var(--ci))] flex items-center justify-between z-10 relative" style={{ borderColor: `${colors.secondary}12` }}>
      <div>
        {price !== undefined && price !== "" && (
          <EditableText as="p" fieldId="f-price" editable={editable} value={price}
            onChange={v => onUpdate?.("price", v)} onFocusEl={onFocusEl} onBlurEl={onBlurEl}
            className="text-[calc(5*var(--ci))] font-black leading-none" style={{ color: colors.accent }} />
        )}
        <EditableText as="p" fieldId="f-sub" editable={editable} value={subtext ?? ""}
          onChange={v => onUpdate?.("subtext", v)} onFocusEl={onFocusEl} onBlurEl={onBlurEl}
          className="text-[calc(2*var(--ci))] opacity-45 mt-[calc(0.3*var(--ci))]" />
      </div>
      <EditableText as="div" fieldId="f-cta" editable={editable} value={ctaText}
        onChange={v => onUpdate?.("ctaText", v)} onFocusEl={onFocusEl} onBlurEl={onBlurEl}
        className="px-[calc(4*var(--ci))] py-[calc(2*var(--ci))] text-[calc(2.2*var(--ci))] font-black uppercase tracking-widest" style={{ backgroundColor: colors.accent, color: colors.primary }} />
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
  <div className="@container w-full h-full relative overflow-hidden font-sans" style={{ backgroundColor: colors.primary, color: colors.secondary }}>
    <div className="w-full h-full grid grid-cols-2 grid-rows-2">
      <div className="relative border-r border-b" style={{ borderColor: `${colors.secondary}12`, backgroundColor: `${colors.accent}08` }}>
        <Image src={productImage} alt="Skincare" fill className="object-contain p-[calc(4*var(--ci))]" crossOrigin="anonymous" />
      </div>

      <div className="flex flex-col items-start justify-end p-[calc(5*var(--ci))] border-b" style={{ borderColor: `${colors.secondary}12` }}>
        <EditableText as="p" fieldId="f-brand" editable={editable} value={brandName ?? ""}
          onChange={v => onUpdate?.("brandName", v)} onFocusEl={onFocusEl} onBlurEl={onBlurEl}
          className="text-[calc(1.8*var(--ci))] tracking-[0.4em] uppercase opacity-30 mb-[calc(1.5*var(--ci))]" />
        <h1 className="text-[calc(7.5*var(--ci))] font-black leading-[0.85] tracking-tighter uppercase">
          <EditableHeadlineLines value={headline} editable={editable} onFocusEl={onFocusEl} onBlurEl={onBlurEl}
            onChange={v => onUpdate?.("headline", v)}
            renderLine={(line, i, node) => (
              <span className="block" style={i === 1 ? { color: colors.accent } : {}}>{node}</span>
            )} />
        </h1>
      </div>

      <div className="flex flex-col justify-center p-[calc(5*var(--ci))] border-r" style={{ borderColor: `${colors.secondary}12` }}>
        {price !== undefined && price !== "" && (
          <EditableText as="p" fieldId="f-price" editable={editable} value={price}
            onChange={v => onUpdate?.("price", v)} onFocusEl={onFocusEl} onBlurEl={onBlurEl}
            className="text-[calc(7*var(--ci))] font-black leading-none mb-[calc(1.5*var(--ci))]" style={{ color: colors.accent }} />
        )}
        <EditableText as="p" fieldId="f-sub" editable={editable} value={subtext ?? ""}
          onChange={v => onUpdate?.("subtext", v)} onFocusEl={onFocusEl} onBlurEl={onBlurEl}
          className="text-[calc(2.2*var(--ci))] opacity-50 leading-relaxed" />
        <EditableText as="p" fieldId="f-web" editable={editable} value={website ?? ""}
          onChange={v => onUpdate?.("website", v)} onFocusEl={onFocusEl} onBlurEl={onBlurEl}
          className="text-[calc(1.6*var(--ci))] opacity-20 mt-[calc(2*var(--ci))] tracking-widest uppercase" />
      </div>

      <div className="flex flex-col items-center justify-center p-[calc(5*var(--ci))]" style={{ backgroundColor: colors.accent }}>
        <p className="text-[calc(2*var(--ci))] tracking-widest uppercase font-bold mb-[calc(2*var(--ci))]" style={{ color: colors.primary, opacity: 0.7 }}>Get yours</p>
        <EditableText as="div" fieldId="f-cta" editable={editable} value={ctaText}
          onChange={v => onUpdate?.("ctaText", v)} onFocusEl={onFocusEl} onBlurEl={onBlurEl}
          className="px-[calc(4*var(--ci))] py-[calc(2.5*var(--ci))] text-[calc(2.8*var(--ci))] font-black uppercase tracking-wider text-center border-[calc(0.3*var(--ci))]" style={{ borderColor: colors.primary, color: colors.primary }} />
      </div>
    </div>
  </div>
);