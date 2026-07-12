import React from "react";
import Image from "next/image";
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
  /** field is one of: brandName | headline | subtext | ctaText | website | price | instagram */
  onUpdate?: (field: string, value: string) => void;
  onFocusEl?: (el: HTMLElement) => void;
  onBlurEl?: () => void;
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
    <div className="shrink-0 flex items-center justify-between px-[5cqi] py-[3cqi] border-b" style={{ borderColor: `${colors.accent}30` }}>
      <EditableText as="p" fieldId="f-brand" editable={editable} value={brandName ?? ""}
        onChange={v => onUpdate?.("brandName", v)} onFocusEl={onFocusEl} onBlurEl={onBlurEl}
        className="text-[2cqi] font-bold tracking-[0.4em] uppercase" />
      <EditableText as="p" fieldId="f-instagram" editable={editable} value={instagram ?? ""}
        onChange={v => onUpdate?.("instagram", v)} onFocusEl={onFocusEl} onBlurEl={onBlurEl}
        className="text-[2cqi] opacity-50 tracking-widest" />
    </div>

    <div className="shrink-0 px-[5cqi] pt-[4cqi] pb-[2cqi]">
      <EditableHeadlineLines value={headline} editable={editable} onFocusEl={onFocusEl} onBlurEl={onBlurEl}
        onChange={v => onUpdate?.("headline", v)}
        renderLine={(line, i, node) => (
          <p className={i === 0
            ? "text-[11cqi] font-black leading-[0.85] tracking-tight"
            : "text-[8cqi] font-light tracking-[0.15em] uppercase opacity-70"}
            style={i === 1 ? { color: colors.accent } : {}}>
            {node}
          </p>
        )} />
    </div>

    <div className="flex-1 relative">
      <Image src={productImage} alt="Product" fill className="object-contain object-center" crossOrigin="anonymous" />
      <div className="absolute inset-0" style={{ background: `radial-gradient(ellipse at center bottom, ${colors.primary}60, transparent 70%)` }} />
    </div>

    <div className="shrink-0 flex items-center justify-between px-[5cqi] py-[3.5cqi] border-t" style={{ borderColor: `${colors.accent}30`, backgroundColor: `${colors.accent}08` }}>
      <div>
        {price !== undefined && price !== "" && (
          <EditableText as="p" fieldId="f-price" editable={editable} value={price}
            onChange={v => onUpdate?.("price", v)} onFocusEl={onFocusEl} onBlurEl={onBlurEl}
            className="text-[5cqi] font-black" style={{ color: colors.accent }} />
        )}
        <EditableText as="p" fieldId="f-sub" editable={editable} value={subtext ?? ""}
          onChange={v => onUpdate?.("subtext", v)} onFocusEl={onFocusEl} onBlurEl={onBlurEl}
          className="text-[2cqi] opacity-50 mt-[0.5cqi]" />
      </div>
      <div>
        <EditableText as="div" fieldId="f-cta" editable={editable} value={ctaText}
          onChange={v => onUpdate?.("ctaText", v)} onFocusEl={onFocusEl} onBlurEl={onBlurEl}
          className="px-[4cqi] py-[2cqi] text-[2.2cqi] font-black uppercase tracking-widest mb-[1cqi]" style={{ backgroundColor: colors.accent, color: colors.primary }} />
        <EditableText as="p" fieldId="f-web" editable={editable} value={website ?? ""}
          onChange={v => onUpdate?.("website", v)} onFocusEl={onFocusEl} onBlurEl={onBlurEl}
          className="text-[1.8cqi] opacity-25 text-right tracking-widest" />
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
      <div className="absolute left-[12cqi] top-0 bottom-0 w-[0.3cqi] z-10" style={{ backgroundColor: colors.accent, opacity: 0.4 }} />

      <div className="absolute left-[6cqi] top-1/2 -translate-y-1/2 -rotate-90 z-10">
        <EditableText as="p" fieldId="f-brand" editable={editable} value={brandName ?? ""}
          onChange={v => onUpdate?.("brandName", v)} onFocusEl={onFocusEl} onBlurEl={onBlurEl}
          className="text-[2cqi] tracking-[0.5em] uppercase font-bold opacity-30 whitespace-nowrap" />
      </div>

      <div className="flex-1 flex flex-col pl-[15cqi] pr-[5cqi] pt-[5cqi] pb-[4cqi]">
        <div className="shrink-0 mb-[3cqi]">
          <EditableText as="p" fieldId="f-headline-0" editable={editable} value={eyebrow}
            onChange={v => {
              // reconstruct the joined headline with just the eyebrow line replaced
              const next = [v, ...lines.slice(1)];
              onUpdate?.("headline", next.join('\n'));
            }} onFocusEl={onFocusEl} onBlurEl={onBlurEl}
            className="text-[2cqi] tracking-[0.4em] uppercase opacity-40 mb-[2cqi]" />
          <h1 className="text-[11cqi] font-black leading-[0.85] tracking-tight">
            <EditableText as="span" fieldId="f-headline-1" editable={editable} value={rest}
              onChange={v => {
                const next = [lines[0] ?? "", v];
                onUpdate?.("headline", next.join('\n'));
              }} onFocusEl={onFocusEl} onBlurEl={onBlurEl} />
          </h1>
          <div className="w-[8cqi] h-[0.3cqi] mt-[2cqi]" style={{ backgroundColor: colors.accent }} />
        </div>

        <div className="flex-1 relative">
          <Image src={productImage} alt="Product" fill className="object-contain object-center" crossOrigin="anonymous" />
        </div>

        <div className="shrink-0 flex items-end justify-between pt-[2cqi]">
          <div>
            <EditableText as="p" fieldId="f-sub" editable={editable} value={subtext ?? ""}
              onChange={v => onUpdate?.("subtext", v)} onFocusEl={onFocusEl} onBlurEl={onBlurEl}
              className="text-[2.2cqi] opacity-50 mb-[1cqi] max-w-[40cqi]" />
            <EditableText as="p" fieldId="f-web" editable={editable} value={website ?? ""}
              onChange={v => onUpdate?.("website", v)} onFocusEl={onFocusEl} onBlurEl={onBlurEl}
              className="text-[1.8cqi] opacity-25 tracking-widest uppercase" />
          </div>
          <div className="text-right">
            {price !== undefined && price !== "" && (
              <EditableText as="p" fieldId="f-price" editable={editable} value={price}
                onChange={v => onUpdate?.("price", v)} onFocusEl={onFocusEl} onBlurEl={onBlurEl}
                className="text-[6cqi] font-black mb-[1cqi]" style={{ color: colors.accent }} />
            )}
            <EditableText as="div" fieldId="f-cta" editable={editable} value={ctaText}
              onChange={v => onUpdate?.("ctaText", v)} onFocusEl={onFocusEl} onBlurEl={onBlurEl}
              className="inline-block px-[4cqi] py-[2cqi] text-[2.2cqi] font-black uppercase tracking-widest" style={{ backgroundColor: colors.accent, color: colors.primary }} />
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

    <div className="shrink-0 px-[5cqi] pt-[4cqi] pb-[2cqi] flex items-center justify-between z-10 relative">
      <EditableText as="p" fieldId="f-web" editable={editable} value={website ?? ""}
        onChange={v => onUpdate?.("website", v)} onFocusEl={onFocusEl} onBlurEl={onBlurEl}
        className="text-[2cqi] tracking-[0.4em] uppercase opacity-50" />
      <div className="w-[6cqi] h-[0.3cqi]" style={{ backgroundColor: colors.accent }} />
    </div>

    <div className="shrink-0 px-[5cqi] z-10 relative">
      <EditableHeadlineLines value={headline} editable={editable} onFocusEl={onFocusEl} onBlurEl={onBlurEl}
        onChange={v => onUpdate?.("headline", v)}
        renderLine={(line, i, node) => (
          <h1 className="font-black uppercase leading-[0.82] tracking-tighter"
            style={{ fontSize: `${14 - i * 1}cqi`, color: i === 0 ? colors.secondary : colors.accent }}>
            {node}
          </h1>
        )} />
    </div>

    <div className="flex-1 relative z-10 px-[4cqi]">
      <Image src={productImage} alt="Product" fill className="object-contain object-center" crossOrigin="anonymous" />
    </div>

    <div className="shrink-0 z-10 flex items-center justify-between px-[5cqi] py-[3.5cqi]" style={{ backgroundColor: colors.accent }}>
      <div>
        {price !== undefined && price !== "" && (
          <EditableText as="p" fieldId="f-price" editable={editable} value={price}
            onChange={v => onUpdate?.("price", v)} onFocusEl={onFocusEl} onBlurEl={onBlurEl}
            className="text-[5cqi] font-black leading-none" style={{ color: colors.primary }} />
        )}
        <EditableText as="p" fieldId="f-sub" editable={editable} value={subtext ?? ""}
          onChange={v => onUpdate?.("subtext", v)} onFocusEl={onFocusEl} onBlurEl={onBlurEl}
          className="text-[2cqi] opacity-60 mt-[0.5cqi]" style={{ color: colors.primary }} />
      </div>
      <EditableText as="div" fieldId="f-cta" editable={editable} value={ctaText}
        onChange={v => onUpdate?.("ctaText", v)} onFocusEl={onFocusEl} onBlurEl={onBlurEl}
        className="px-[4cqi] py-[2cqi] text-[2.4cqi] font-black uppercase tracking-widest" style={{ backgroundColor: colors.primary, color: colors.accent }} />
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

    <div className="shrink-0 px-[5cqi] pt-[4cqi] flex items-center justify-between z-10 relative">
      <EditableText as="p" fieldId="f-brand" editable={editable} value={brandName ?? ""}
        onChange={v => onUpdate?.("brandName", v)} onFocusEl={onFocusEl} onBlurEl={onBlurEl}
        className="text-[2cqi] tracking-[0.5em] uppercase font-bold opacity-30" />
      <div className="w-[4cqi] h-[4cqi] rounded-full border-[0.3cqi]" style={{ borderColor: colors.accent, opacity: 0.5 }} />
    </div>

    <div className="shrink-0 px-[5cqi] pt-[3cqi] pb-[2cqi] z-10 relative">
      <h1 className="text-[10cqi] font-black leading-[0.85] tracking-tight uppercase">
        <EditableHeadlineLines value={headline} editable={editable} onFocusEl={onFocusEl} onBlurEl={onBlurEl}
          onChange={v => onUpdate?.("headline", v)}
          renderLine={(line, i, node) => (
            <span className="block" style={i % 2 === 1 ? { color: colors.accent } : {}}>{node}</span>
          )} />
      </h1>
    </div>

    <div className="mx-[5cqi] h-[0.2cqi] z-10 relative" style={{ backgroundColor: `${colors.secondary}20` }} />

    <div className="flex-1 relative z-10">
      <Image src={productImage} alt="Product" fill className="object-contain object-center" crossOrigin="anonymous" />
      <div className="absolute inset-0" style={{ background: `radial-gradient(ellipse at center, transparent 40%, ${colors.primary}80 100%)` }} />
    </div>

    <div className="shrink-0 px-[5cqi] pb-[4cqi] flex items-end justify-between z-10 relative">
      <div>
        {price !== undefined && price !== "" && (
          <EditableText as="p" fieldId="f-price" editable={editable} value={price}
            onChange={v => onUpdate?.("price", v)} onFocusEl={onFocusEl} onBlurEl={onBlurEl}
            className="text-[7cqi] font-black leading-none" style={{ color: colors.accent }} />
        )}
        <EditableText as="p" fieldId="f-sub" editable={editable} value={subtext ?? ""}
          onChange={v => onUpdate?.("subtext", v)} onFocusEl={onFocusEl} onBlurEl={onBlurEl}
          className="text-[2cqi] opacity-40 mt-[0.5cqi]" />
        <EditableText as="p" fieldId="f-web" editable={editable} value={website ?? ""}
          onChange={v => onUpdate?.("website", v)} onFocusEl={onFocusEl} onBlurEl={onBlurEl}
          className="text-[1.6cqi] opacity-20 mt-[1cqi] tracking-widest uppercase" />
      </div>
      <EditableText as="div" fieldId="f-cta" editable={editable} value={ctaText}
        onChange={v => onUpdate?.("ctaText", v)} onFocusEl={onFocusEl} onBlurEl={onBlurEl}
        className="px-[4cqi] py-[2.5cqi] text-[2.2cqi] font-black uppercase tracking-wider" style={{ border: `0.3cqi solid ${colors.accent}`, color: colors.accent }} />
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

    <div className="shrink-0 px-[5cqi] pt-[5cqi] z-10 relative">
      <div className="flex items-center gap-[2cqi] mb-[3cqi]">
        <div className="w-[4cqi] h-[0.2cqi]" style={{ backgroundColor: colors.accent }} />
        <EditableText as="p" fieldId="f-web" editable={editable} value={website ?? ""}
          onChange={v => onUpdate?.("website", v)} onFocusEl={onFocusEl} onBlurEl={onBlurEl}
          className="text-[1.8cqi] tracking-[0.4em] uppercase opacity-50" />
      </div>
      <h1 className="text-[10.5cqi] font-black leading-[0.85] tracking-tighter uppercase">
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

    <div className="shrink-0 px-[5cqi] pb-[4cqi] z-10 relative">
      <div className="w-full h-[0.2cqi] mb-[3cqi]" style={{ backgroundColor: `${colors.accent}30` }} />
      <div className="flex items-end justify-between">
        <div>
          {price !== undefined && price !== "" && (
            <EditableText as="p" fieldId="f-price" editable={editable} value={price}
              onChange={v => onUpdate?.("price", v)} onFocusEl={onFocusEl} onBlurEl={onBlurEl}
              className="text-[8cqi] font-black leading-none" style={{ color: colors.accent }} />
          )}
          <EditableText as="p" fieldId="f-sub" editable={editable} value={subtext ?? ""}
            onChange={v => onUpdate?.("subtext", v)} onFocusEl={onFocusEl} onBlurEl={onBlurEl}
            className="text-[2.2cqi] opacity-50 mt-[0.5cqi] max-w-[40cqi]" />
        </div>
        <EditableText as="div" fieldId="f-cta" editable={editable} value={ctaText}
          onChange={v => onUpdate?.("ctaText", v)} onFocusEl={onFocusEl} onBlurEl={onBlurEl}
          className="px-[5cqi] py-[2.5cqi] text-[2.4cqi] font-black uppercase tracking-widest rounded-full" style={{ backgroundColor: colors.accent, color: colors.primary }} />
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
    <div className="w-[42%] h-full flex flex-col justify-between p-[5cqi] border-r z-10 relative" style={{ borderColor: `${colors.secondary}15` }}>
      <div>
        <EditableText as="p" fieldId="f-brand" editable={editable} value={brandName ?? ""}
          onChange={v => onUpdate?.("brandName", v)} onFocusEl={onFocusEl} onBlurEl={onBlurEl}
          className="text-[1.8cqi] tracking-[0.5em] uppercase opacity-30 mb-[4cqi]" />
        <h1 className="text-[9cqi] font-black leading-[0.85] tracking-tight uppercase mb-[3cqi]">
          <EditableHeadlineLines value={headline} editable={editable} onFocusEl={onFocusEl} onBlurEl={onBlurEl}
            onChange={v => onUpdate?.("headline", v)}
            renderLine={(line, i, node) => (
              <span className="block" style={i === 1 ? { color: colors.accent } : {}}>{node}</span>
            )} />
        </h1>
        <div className="w-[6cqi] h-[0.3cqi] mb-[3cqi]" style={{ backgroundColor: colors.accent }} />
        <EditableText as="p" fieldId="f-sub" editable={editable} value={subtext ?? ""}
          onChange={v => onUpdate?.("subtext", v)} onFocusEl={onFocusEl} onBlurEl={onBlurEl}
          className="text-[2.2cqi] leading-relaxed opacity-50" />
      </div>
      <div>
        {price !== undefined && price !== "" && (
          <EditableText as="p" fieldId="f-price" editable={editable} value={price}
            onChange={v => onUpdate?.("price", v)} onFocusEl={onFocusEl} onBlurEl={onBlurEl}
            className="text-[7cqi] font-black leading-none mb-[2cqi]" style={{ color: colors.accent }} />
        )}
        <EditableText as="div" fieldId="f-cta" editable={editable} value={ctaText}
          onChange={v => onUpdate?.("ctaText", v)} onFocusEl={onFocusEl} onBlurEl={onBlurEl}
          className="px-[3cqi] py-[2cqi] text-[2.2cqi] font-black uppercase tracking-widest mb-[1.5cqi]" style={{ backgroundColor: colors.accent, color: colors.primary }} />
        <EditableText as="p" fieldId="f-web" editable={editable} value={website ?? ""}
          onChange={v => onUpdate?.("website", v)} onFocusEl={onFocusEl} onBlurEl={onBlurEl}
          className="text-[1.6cqi] opacity-20 tracking-widest uppercase" />
      </div>
    </div>

    <div className="w-[58%] relative">
      <Image src={productImage} alt="Product" fill className="object-contain object-center p-[3cqi]" crossOrigin="anonymous" />
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
      <div className="shrink-0 w-full flex items-center justify-between px-[5cqi] pt-[4cqi] pb-[2cqi]">
        <EditableText as="p" fieldId="f-brand" editable={editable} value={brandName ?? ""}
          onChange={v => onUpdate?.("brandName", v)} onFocusEl={onFocusEl} onBlurEl={onBlurEl}
          className="text-[1.8cqi] tracking-[0.5em] uppercase opacity-30" />
        <div className="w-[4cqi] h-[0.2cqi]" style={{ backgroundColor: `${colors.secondary}30` }} />
        <EditableText as="p" fieldId="f-web" editable={editable} value={website ?? ""}
          onChange={v => onUpdate?.("website", v)} onFocusEl={onFocusEl} onBlurEl={onBlurEl}
          className="text-[1.8cqi] tracking-[0.4em] uppercase opacity-30" />
      </div>

      <div className="shrink-0 px-[6cqi] pt-[2cqi] pb-[3cqi]">
        <EditableText as="p" fieldId="f-headline-0" editable={editable} value={eyebrow}
          onChange={v => onUpdate?.("headline", [v, lines[1] ?? ""].join('\n'))}
          onFocusEl={onFocusEl} onBlurEl={onBlurEl}
          className="text-[2cqi] tracking-[0.4em] uppercase opacity-40 mb-[2cqi]" />
        <h1 className="text-[10cqi] font-black leading-[0.85] tracking-tight uppercase">
          <EditableText as="span" fieldId="f-headline-1" editable={editable} value={main}
            onChange={v => onUpdate?.("headline", [lines[0] ?? "", v].join('\n'))}
            onFocusEl={onFocusEl} onBlurEl={onBlurEl} />
        </h1>
        <div className="w-[6cqi] h-[0.3cqi] mx-auto mt-[2cqi]" style={{ backgroundColor: colors.accent }} />
      </div>

      <div className="flex-1 w-full relative px-[4cqi]">
        <Image src={productImage} alt="Product" fill className="object-contain object-center" crossOrigin="anonymous" />
      </div>

      <div className="shrink-0 w-full px-[5cqi] pb-[4cqi] pt-[2cqi] flex items-end justify-between">
        <div className="text-left">
          <EditableText as="p" fieldId="f-sub" editable={editable} value={subtext ?? ""}
            onChange={v => onUpdate?.("subtext", v)} onFocusEl={onFocusEl} onBlurEl={onBlurEl}
            className="text-[2.2cqi] opacity-50 max-w-[35cqi]" />
        </div>
        <div className="text-right">
          {price !== undefined && price !== "" && (
            <EditableText as="p" fieldId="f-price" editable={editable} value={price}
              onChange={v => onUpdate?.("price", v)} onFocusEl={onFocusEl} onBlurEl={onBlurEl}
              className="text-[6cqi] font-black leading-none" style={{ color: colors.accent }} />
          )}
          <EditableText as="div" fieldId="f-cta" editable={editable} value={ctaText}
            onChange={v => onUpdate?.("ctaText", v)} onFocusEl={onFocusEl} onBlurEl={onBlurEl}
            className="inline-block mt-[1.5cqi] px-[4cqi] py-[2cqi] text-[2.2cqi] font-black uppercase tracking-widest" style={{ backgroundColor: colors.accent, color: colors.primary }} />
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
      <Image src={productImage} alt="Product" fill className="object-contain object-center p-[3cqi]" crossOrigin="anonymous" />
      <div className="absolute inset-0" style={{ background: `linear-gradient(to bottom, transparent 60%, ${colors.primary} 100%)` }} />
    </div>

    <div className="flex-1 px-[5cqi] pb-[5cqi] flex flex-col justify-between">
      <div>
        <EditableHeadlineLines value={headline} editable={editable} onFocusEl={onFocusEl} onBlurEl={onBlurEl}
          onChange={v => onUpdate?.("headline", v)}
          renderLine={(line, i, node) => (
            <p className={i === 0
              ? "text-[2.5cqi] tracking-[0.4em] uppercase opacity-40 mb-[1cqi]"
              : "text-[10cqi] font-black leading-[0.85] tracking-tighter uppercase"}
              style={i === 1 ? { color: colors.secondary } : {}}>
              {node}
            </p>
          )} />
        <div className="w-[6cqi] h-[0.3cqi] mt-[2cqi]" style={{ backgroundColor: colors.accent }} />
      </div>
      <div className="flex items-end justify-between">
        <div>
          {price !== undefined && price !== "" && (
            <EditableText as="p" fieldId="f-price" editable={editable} value={price}
              onChange={v => onUpdate?.("price", v)} onFocusEl={onFocusEl} onBlurEl={onBlurEl}
              className="text-[7cqi] font-black leading-none" style={{ color: colors.accent }} />
          )}
          <EditableText as="p" fieldId="f-sub" editable={editable} value={subtext ?? ""}
            onChange={v => onUpdate?.("subtext", v)} onFocusEl={onFocusEl} onBlurEl={onBlurEl}
            className="text-[2cqi] opacity-50 mt-[0.5cqi]" />
          <EditableText as="p" fieldId="f-web" editable={editable} value={website ?? ""}
            onChange={v => onUpdate?.("website", v)} onFocusEl={onFocusEl} onBlurEl={onBlurEl}
            className="text-[1.6cqi] opacity-20 tracking-widest uppercase mt-[1cqi]" />
        </div>
        <EditableText as="div" fieldId="f-cta" editable={editable} value={ctaText}
          onChange={v => onUpdate?.("ctaText", v)} onFocusEl={onFocusEl} onBlurEl={onBlurEl}
          className="px-[4cqi] py-[2.5cqi] text-[2.4cqi] font-black uppercase tracking-widest rounded-full" style={{ backgroundColor: colors.accent, color: colors.primary }} />
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
    <div className="shrink-0 px-[5cqi] pt-[4cqi]">
      <div className="w-full h-[0.3cqi] mb-[2cqi]" style={{ backgroundColor: colors.secondary, opacity: 0.15 }} />
      <div className="flex items-center justify-between mb-[2cqi]">
        <EditableText as="p" fieldId="f-brand" editable={editable} value={brandName ?? ""}
          onChange={v => onUpdate?.("brandName", v)} onFocusEl={onFocusEl} onBlurEl={onBlurEl}
          className="text-[2cqi] tracking-[0.5em] uppercase opacity-40" />
        <EditableText as="p" fieldId="f-web" editable={editable} value={website ?? ""}
          onChange={v => onUpdate?.("website", v)} onFocusEl={onFocusEl} onBlurEl={onBlurEl}
          className="text-[2cqi] tracking-[0.3em] uppercase opacity-25" />
      </div>
      <div className="w-full h-[0.3cqi]" style={{ backgroundColor: colors.secondary, opacity: 0.15 }} />
    </div>

    <div className="flex-1 flex">
      <div className="w-[50%] flex flex-col justify-center px-[5cqi] py-[3cqi]">
        <h1 className="text-[11cqi] font-black leading-[0.82] tracking-tighter uppercase mb-[4cqi]">
          <EditableHeadlineLines value={headline} editable={editable} onFocusEl={onFocusEl} onBlurEl={onBlurEl}
            onChange={v => onUpdate?.("headline", v)}
            renderLine={(line, i, node) => (
              <span className="block" style={i % 2 === 1 ? { color: colors.accent } : {}}>{node}</span>
            )} />
        </h1>
        <EditableText as="p" fieldId="f-sub" editable={editable} value={subtext ?? ""}
          onChange={v => onUpdate?.("subtext", v)} onFocusEl={onFocusEl} onBlurEl={onBlurEl}
          className="text-[2.2cqi] opacity-50 leading-relaxed mb-[4cqi]" />
        {price !== undefined && price !== "" && (
          <EditableText as="p" fieldId="f-price" editable={editable} value={price}
            onChange={v => onUpdate?.("price", v)} onFocusEl={onFocusEl} onBlurEl={onBlurEl}
            className="text-[6cqi] font-black leading-none mb-[2cqi]" style={{ color: colors.accent }} />
        )}
        <EditableText as="div" fieldId="f-cta" editable={editable} value={ctaText}
          onChange={v => onUpdate?.("ctaText", v)} onFocusEl={onFocusEl} onBlurEl={onBlurEl}
          className="inline-block px-[4cqi] py-[2cqi] text-[2.2cqi] font-black uppercase tracking-widest" style={{ backgroundColor: colors.secondary, color: colors.primary }} />
      </div>

      <div className="w-[50%] relative">
        <Image src={productImage} alt="Product" fill className="object-contain object-center" crossOrigin="anonymous" />
      </div>
    </div>

    <div className="shrink-0 px-[5cqi] pb-[4cqi]">
      <div className="w-full h-[0.3cqi]" style={{ backgroundColor: colors.secondary, opacity: 0.15 }} />
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

    <div className="shrink-0 px-[5cqi] pt-[4cqi] flex items-center gap-[2cqi]">
      <div className="w-[3cqi] h-[3cqi] rounded-full" style={{ backgroundColor: colors.accent }} />
      <EditableText as="p" fieldId="f-brand" editable={editable} value={brandName ?? ""}
        onChange={v => onUpdate?.("brandName", v)} onFocusEl={onFocusEl} onBlurEl={onBlurEl}
        className="text-[2.2cqi] font-bold tracking-[0.3em] uppercase opacity-60" />
    </div>

    <div className="shrink-0 px-[5cqi] pt-[3cqi] pb-[2cqi]">
      <h1 className="text-[10.5cqi] font-black leading-[0.85] tracking-tighter uppercase">
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

    <div className="shrink-0 px-[5cqi] pb-[4cqi] flex items-end justify-between z-10">
      <div>
        {price !== undefined && price !== "" && (
          <EditableText as="p" fieldId="f-price" editable={editable} value={price}
            onChange={v => onUpdate?.("price", v)} onFocusEl={onFocusEl} onBlurEl={onBlurEl}
            className="text-[7cqi] font-black leading-none" style={{ color: colors.accent }} />
        )}
        <EditableText as="p" fieldId="f-sub" editable={editable} value={subtext ?? ""}
          onChange={v => onUpdate?.("subtext", v)} onFocusEl={onFocusEl} onBlurEl={onBlurEl}
          className="text-[2.2cqi] opacity-50 mt-[0.5cqi] max-w-[40cqi]" />
        <EditableText as="p" fieldId="f-web" editable={editable} value={website ?? ""}
          onChange={v => onUpdate?.("website", v)} onFocusEl={onFocusEl} onBlurEl={onBlurEl}
          className="text-[1.6cqi] opacity-20 mt-[1cqi] tracking-widest uppercase" />
      </div>
      <EditableText as="div" fieldId="f-cta" editable={editable} value={ctaText}
        onChange={v => onUpdate?.("ctaText", v)} onFocusEl={onFocusEl} onBlurEl={onBlurEl}
        className="px-[5cqi] py-[2.5cqi] text-[2.4cqi] font-black uppercase tracking-widest rounded-full" style={{ backgroundColor: colors.accent, color: colors.primary }} />
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
    <div className="shrink-0 flex items-center justify-between px-[5cqi] py-[2.5cqi] border-b z-10 relative" style={{ borderColor: `${colors.secondary}12` }}>
      <EditableText as="p" fieldId="f-brand" editable={editable} value={brandName ?? ""}
        onChange={v => onUpdate?.("brandName", v)} onFocusEl={onFocusEl} onBlurEl={onBlurEl}
        className="text-[2.2cqi] font-black uppercase tracking-[0.35em]" />
      <EditableText as="p" fieldId="f-web" editable={editable} value={website ?? ""}
        onChange={v => onUpdate?.("website", v)} onFocusEl={onFocusEl} onBlurEl={onBlurEl}
        className="text-[2cqi] opacity-30 tracking-widest uppercase" />
    </div>

    <div className="shrink-0 px-[5cqi] pt-[3cqi] pb-[1cqi] z-10 relative">
      <h1 className="text-[7cqi] font-black uppercase leading-[0.85] tracking-tighter">
        <EditableHeadlineLines value={headline} editable={editable} onFocusEl={onFocusEl} onBlurEl={onBlurEl}
          onChange={v => onUpdate?.("headline", v)}
          renderLine={(line, i, node) => (
            <span className="block" style={i === 1 ? { color: colors.accent } : {}}>{node}</span>
          )} />
      </h1>
    </div>

    <div className="flex-1 flex gap-[1.5cqi] px-[5cqi] pb-[1cqi] z-10 relative">
      <div className="flex-1 relative rounded-[2cqi] overflow-hidden" style={{ backgroundColor: `${colors.secondary}08` }}>
        <Image src={productImage} alt="Main" fill className="object-contain p-[2cqi]" crossOrigin="anonymous" />
      </div>
      <div className="w-[28%] flex flex-col gap-[1.5cqi]">
        <div className="flex-1 relative rounded-[2cqi] overflow-hidden" style={{ backgroundColor: `${colors.accent}15` }}>
          <Image src={productImage} alt="Side 1" fill className="object-contain p-[2cqi] scale-90 opacity-70" crossOrigin="anonymous" />
        </div>
        <div className="flex-1 relative rounded-[2cqi] overflow-hidden" style={{ backgroundColor: `${colors.secondary}08` }}>
          <Image src={productImage} alt="Side 2" fill className="object-contain p-[2cqi] scale-90 opacity-50" crossOrigin="anonymous" />
        </div>
      </div>
    </div>

    <div className="shrink-0 border-t px-[5cqi] py-[2.5cqi] flex items-center justify-between z-10 relative" style={{ borderColor: `${colors.secondary}12` }}>
      <div>
        {price !== undefined && price !== "" && (
          <EditableText as="p" fieldId="f-price" editable={editable} value={price}
            onChange={v => onUpdate?.("price", v)} onFocusEl={onFocusEl} onBlurEl={onBlurEl}
            className="text-[5cqi] font-black leading-none" style={{ color: colors.accent }} />
        )}
        <EditableText as="p" fieldId="f-sub" editable={editable} value={subtext ?? ""}
          onChange={v => onUpdate?.("subtext", v)} onFocusEl={onFocusEl} onBlurEl={onBlurEl}
          className="text-[2cqi] opacity-45 mt-[0.3cqi]" />
      </div>
      <EditableText as="div" fieldId="f-cta" editable={editable} value={ctaText}
        onChange={v => onUpdate?.("ctaText", v)} onFocusEl={onFocusEl} onBlurEl={onBlurEl}
        className="px-[4cqi] py-[2cqi] text-[2.2cqi] font-black uppercase tracking-widest" style={{ backgroundColor: colors.accent, color: colors.primary }} />
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
        <Image src={productImage} alt="Skincare" fill className="object-contain p-[4cqi]" crossOrigin="anonymous" />
      </div>

      <div className="flex flex-col items-start justify-end p-[5cqi] border-b" style={{ borderColor: `${colors.secondary}12` }}>
        <EditableText as="p" fieldId="f-brand" editable={editable} value={brandName ?? ""}
          onChange={v => onUpdate?.("brandName", v)} onFocusEl={onFocusEl} onBlurEl={onBlurEl}
          className="text-[1.8cqi] tracking-[0.4em] uppercase opacity-30 mb-[1.5cqi]" />
        <h1 className="text-[7.5cqi] font-black leading-[0.85] tracking-tighter uppercase">
          <EditableHeadlineLines value={headline} editable={editable} onFocusEl={onFocusEl} onBlurEl={onBlurEl}
            onChange={v => onUpdate?.("headline", v)}
            renderLine={(line, i, node) => (
              <span className="block" style={i === 1 ? { color: colors.accent } : {}}>{node}</span>
            )} />
        </h1>
      </div>

      <div className="flex flex-col justify-center p-[5cqi] border-r" style={{ borderColor: `${colors.secondary}12` }}>
        {price !== undefined && price !== "" && (
          <EditableText as="p" fieldId="f-price" editable={editable} value={price}
            onChange={v => onUpdate?.("price", v)} onFocusEl={onFocusEl} onBlurEl={onBlurEl}
            className="text-[7cqi] font-black leading-none mb-[1.5cqi]" style={{ color: colors.accent }} />
        )}
        <EditableText as="p" fieldId="f-sub" editable={editable} value={subtext ?? ""}
          onChange={v => onUpdate?.("subtext", v)} onFocusEl={onFocusEl} onBlurEl={onBlurEl}
          className="text-[2.2cqi] opacity-50 leading-relaxed" />
        <EditableText as="p" fieldId="f-web" editable={editable} value={website ?? ""}
          onChange={v => onUpdate?.("website", v)} onFocusEl={onFocusEl} onBlurEl={onBlurEl}
          className="text-[1.6cqi] opacity-20 mt-[2cqi] tracking-widest uppercase" />
      </div>

      <div className="flex flex-col items-center justify-center p-[5cqi]" style={{ backgroundColor: colors.accent }}>
        <p className="text-[2cqi] tracking-widest uppercase font-bold mb-[2cqi]" style={{ color: colors.primary, opacity: 0.7 }}>Get yours</p>
        <EditableText as="div" fieldId="f-cta" editable={editable} value={ctaText}
          onChange={v => onUpdate?.("ctaText", v)} onFocusEl={onFocusEl} onBlurEl={onBlurEl}
          className="px-[4cqi] py-[2.5cqi] text-[2.8cqi] font-black uppercase tracking-wider text-center border-[0.3cqi]" style={{ borderColor: colors.primary, color: colors.primary }} />
      </div>
    </div>
  </div>
);
