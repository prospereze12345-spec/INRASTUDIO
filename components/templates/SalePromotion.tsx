import React from "react";
import Image from "next/image";
import { EditableText } from "@/components/EditableText";
import { EditableHeadlineLines } from "@/components/Editableheadlinelines";

export interface SalePromotionProps {
  name?: string;
  headline: string;
  subtext?: string;
  ctaText: string;
  badgeText?: string;
  extraText?: string;
  productImage: string;
  brandName?: string;
  website?: string;
  price?: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
  };
  editable?: boolean;
  /** field is one of: brandName | headline | subtext | ctaText | badgeText | website | price */
  onUpdate?: (field: string, value: string) => void;
  onFocusEl?: (el: HTMLElement) => void;
  onBlurEl?: () => void;
}

export function SalePromotionTemplate(props: SalePromotionProps) {
  const { name = "Flash Arch" } = props;
  if (!props.headline || !props.productImage || !props.colors) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400 text-sm">
        Loading template...
      </div>
    );
  }
  switch (name) {
    case "Flash Arch":        return <VariantSplitHero       {...props} />;
    case "Striped Circle":    return <VariantFloatPrice       {...props} />;
    case "Editorial Minimal": return <VariantEditorialStrip   {...props} />;
    case "Impact Text":       return <VariantImpactDark       {...props} />;
    case "Dynamic Angle":     return <VariantDiagonalSlice    {...props} />;
    case "Weekend Special":   return <VariantWeekendCard      {...props} />;
    case "Neon Glow":         return <VariantNeonMinimal      {...props} />;
    case "Gift Banner":       return <VariantGiftLux          {...props} />;
    case "Ribbon Frame":      return <VariantFramedProduct    {...props} />;
    case "Combo Offer":       return <VariantComboClean       {...props} />;
    case "Fashion Sale":      return <VariantFashionEditorial {...props} />;
    case "Coffee Shop":       return <VariantCafeModern       {...props} />;
    default:                  return <VariantSplitHero        {...props} />;
  }
}

/* ─────────────────────────────────────────────────────────────────
   1. SPLIT HERO
───────────────────────────────────────────────────────────────── */
const VariantSplitHero = ({
  headline, subtext, ctaText, productImage, brandName, website, price,
  colors, editable, onUpdate, onFocusEl, onBlurEl,
}: SalePromotionProps) => (
  <div className="@container w-full h-full relative overflow-hidden flex font-sans" style={{ backgroundColor: colors.primary, color: colors.secondary }}>
    <div className="w-[45%] h-full flex flex-col justify-between p-[6cqi] relative z-10">
      <div>
        <EditableText as="p" fieldId="f-brand" editable={editable} value={brandName ?? ""}
          onChange={v => onUpdate?.("brandName", v)} onFocusEl={onFocusEl} onBlurEl={onBlurEl}
          className="text-[2cqi] tracking-[0.35em] uppercase font-medium opacity-50 mb-[3cqi]" />
        <div className="w-[8cqi] h-[0.3cqi] mb-[4cqi]" style={{ backgroundColor: colors.accent }} />
        <h1 className="text-[9cqi] font-black leading-[0.9] tracking-tight uppercase mb-[4cqi]">
          <EditableHeadlineLines value={headline} editable={editable} onFocusEl={onFocusEl} onBlurEl={onBlurEl}
            onChange={v => onUpdate?.("headline", v)}
            renderLine={(line, i, node) => <span className="block">{node}</span>} />
        </h1>
        <EditableText as="p" fieldId="f-sub" editable={editable} value={subtext ?? ""}
          onChange={v => onUpdate?.("subtext", v)} onFocusEl={onFocusEl} onBlurEl={onBlurEl}
          className="text-[2.4cqi] leading-relaxed opacity-60 max-w-[90%] mb-[5cqi]" />
        {price !== undefined && price !== "" && (
          <div className="mb-[4cqi]">
            <EditableText as="span" fieldId="f-price" editable={editable} value={price}
              onChange={v => onUpdate?.("price", v)} onFocusEl={onFocusEl} onBlurEl={onBlurEl}
              className="text-[7cqi] font-black leading-none" style={{ color: colors.accent }} />
          </div>
        )}
      </div>
      <div>
        <div className="inline-flex items-center gap-[2cqi] px-[4cqi] py-[2cqi] text-[2.2cqi] font-bold uppercase tracking-widest" style={{ backgroundColor: colors.accent, color: colors.primary }}>
          <EditableText as="span" fieldId="f-cta" editable={editable} value={ctaText}
            onChange={v => onUpdate?.("ctaText", v)} onFocusEl={onFocusEl} onBlurEl={onBlurEl} />
          <span className="text-[1.8cqi]">→</span>
        </div>
        <EditableText as="p" fieldId="f-web" editable={editable} value={website ?? ""}
          onChange={v => onUpdate?.("website", v)} onFocusEl={onFocusEl} onBlurEl={onBlurEl}
          className="text-[1.8cqi] opacity-30 tracking-widest mt-[3cqi] uppercase" />
      </div>
    </div>

    <div className="w-[55%] h-full relative">
      <Image src={productImage} alt="Product" fill className="object-cover object-center" crossOrigin="anonymous" />
      <div className="absolute inset-0" style={{ background: `linear-gradient(to right, ${colors.primary} 0%, transparent 30%)` }} />
    </div>

    <div className="absolute left-[45%] top-[10%] bottom-[10%] w-[0.3cqi] z-20" style={{ backgroundColor: colors.accent, opacity: 0.3 }} />
  </div>
);

/* ─────────────────────────────────────────────────────────────────
   2. FLOAT PRICE
───────────────────────────────────────────────────────────────── */
const VariantFloatPrice = ({
  headline, subtext, ctaText, productImage, brandName, website, price, badgeText,
  colors, editable, onUpdate, onFocusEl, onBlurEl,
}: SalePromotionProps) => (
  <div className="@container w-full h-full relative overflow-hidden flex flex-col font-sans" style={{ backgroundColor: colors.primary, color: colors.secondary }}>
    <div className="flex items-center justify-between px-[5cqi] py-[3cqi] border-b z-10 relative shrink-0" style={{ borderColor: `${colors.secondary}15` }}>
      <EditableText as="p" fieldId="f-brand" editable={editable} value={brandName ?? ""}
        onChange={v => onUpdate?.("brandName", v)} onFocusEl={onFocusEl} onBlurEl={onBlurEl}
        className="text-[2.2cqi] font-black uppercase tracking-widest" />
      <EditableText as="p" fieldId="f-web" editable={editable} value={website ?? ""}
        onChange={v => onUpdate?.("website", v)} onFocusEl={onFocusEl} onBlurEl={onBlurEl}
        className="text-[2cqi] opacity-40 tracking-widest uppercase" />
    </div>

    <div className="flex-1 relative flex items-center justify-center">
      <div className="absolute inset-0">
        <Image src={productImage} alt="Product" fill className="object-contain object-center scale-[0.85]" crossOrigin="anonymous" />
      </div>

      {price !== undefined && price !== "" && (
        <div className="absolute bottom-[6cqi] left-[5cqi] z-20">
          <p className="text-[2cqi] uppercase tracking-widest opacity-50 mb-[0.5cqi]">Only</p>
          <EditableText as="p" fieldId="f-price" editable={editable} value={price}
            onChange={v => onUpdate?.("price", v)} onFocusEl={onFocusEl} onBlurEl={onBlurEl}
            className="text-[18cqi] font-black leading-none" style={{ color: colors.accent }} />
        </div>
      )}

      {badgeText && (
        <div className="absolute top-[4cqi] right-[4cqi] w-[20cqi] h-[20cqi] rounded-full flex flex-col items-center justify-center text-center z-20 font-black text-[3.5cqi] leading-tight border-[0.4cqi]" style={{ backgroundColor: colors.accent, color: colors.primary, borderColor: colors.primary }}>
          <EditableHeadlineLines value={badgeText} editable={editable} onFocusEl={onFocusEl} onBlurEl={onBlurEl}
            fieldIdPrefix="f-badge" onChange={v => onUpdate?.("badgeText", v)}
            renderLine={(line, i, node) => <span className="block">{node}</span>} />
        </div>
      )}
    </div>

    <div className="shrink-0 px-[5cqi] py-[3cqi] flex items-center justify-between border-t z-10" style={{ borderColor: `${colors.secondary}15` }}>
      <div>
        <h2 className="text-[5cqi] font-black uppercase tracking-tight leading-none">{headline.split('\n')[0]}</h2>
        <EditableText as="p" fieldId="f-sub" editable={editable} value={subtext ?? ""}
          onChange={v => onUpdate?.("subtext", v)} onFocusEl={onFocusEl} onBlurEl={onBlurEl}
          className="text-[2.2cqi] opacity-50 mt-[1cqi]" />
      </div>
      <EditableText as="div" fieldId="f-cta" editable={editable} value={ctaText}
        onChange={v => onUpdate?.("ctaText", v)} onFocusEl={onFocusEl} onBlurEl={onBlurEl}
        className="px-[4cqi] py-[2cqi] text-[2.2cqi] font-black uppercase tracking-widest" style={{ backgroundColor: colors.secondary, color: colors.primary }} />
    </div>
  </div>
);

/* ─────────────────────────────────────────────────────────────────
   3. EDITORIAL STRIP
───────────────────────────────────────────────────────────────── */
const VariantEditorialStrip = ({
  headline, subtext, ctaText, productImage, brandName, website, price,
  colors, editable, onUpdate, onFocusEl, onBlurEl,
}: SalePromotionProps) => (
  <div className="@container w-full h-full relative overflow-hidden flex flex-col font-sans" style={{ backgroundColor: colors.primary, color: colors.secondary }}>
    <div className="shrink-0 px-[6cqi] pt-[5cqi] pb-[3cqi] relative z-10">
      <div className="flex items-baseline justify-between mb-[2cqi]">
        <EditableText as="p" fieldId="f-brand" editable={editable} value={brandName ?? ""}
          onChange={v => onUpdate?.("brandName", v)} onFocusEl={onFocusEl} onBlurEl={onBlurEl}
          className="text-[2cqi] tracking-[0.4em] uppercase opacity-40" />
        <EditableText as="p" fieldId="f-web" editable={editable} value={website ?? ""}
          onChange={v => onUpdate?.("website", v)} onFocusEl={onFocusEl} onBlurEl={onBlurEl}
          className="text-[2cqi] tracking-[0.3em] uppercase opacity-40" />
      </div>
      <div className="w-full h-[0.2cqi] mb-[3cqi]" style={{ backgroundColor: colors.secondary, opacity: 0.15 }} />
      <h1 className="text-[10cqi] font-black uppercase leading-[0.85] tracking-tighter">
        <EditableHeadlineLines value={headline} editable={editable} onFocusEl={onFocusEl} onBlurEl={onBlurEl}
          onChange={v => onUpdate?.("headline", v)}
          renderLine={(line, i, node) => (
            <span className="block" style={i % 2 === 1 ? { color: colors.accent } : {}}>{node}</span>
          )} />
      </h1>
    </div>

    <div className="flex-1 relative mx-[6cqi] overflow-hidden">
      <Image src={productImage} alt="Product" fill className="object-contain object-center" crossOrigin="anonymous" />
    </div>

    <div className="shrink-0 px-[6cqi] pb-[5cqi] pt-[3cqi] relative z-10">
      <div className="w-full h-[0.2cqi] mb-[3cqi]" style={{ backgroundColor: colors.secondary, opacity: 0.15 }} />
      <div className="flex items-end justify-between">
        <div>
          {price !== undefined && price !== "" && (
            <EditableText as="p" fieldId="f-price" editable={editable} value={price}
              onChange={v => onUpdate?.("price", v)} onFocusEl={onFocusEl} onBlurEl={onBlurEl}
              className="text-[8cqi] font-black leading-none" style={{ color: colors.accent }} />
          )}
          <EditableText as="p" fieldId="f-sub" editable={editable} value={subtext ?? ""}
            onChange={v => onUpdate?.("subtext", v)} onFocusEl={onFocusEl} onBlurEl={onBlurEl}
            className="text-[2.2cqi] opacity-50 mt-[1cqi] max-w-[50cqi]" />
        </div>
        <EditableText as="div" fieldId="f-cta" editable={editable} value={ctaText}
          onChange={v => onUpdate?.("ctaText", v)} onFocusEl={onFocusEl} onBlurEl={onBlurEl}
          className="px-[4cqi] py-[2cqi] text-[2.4cqi] font-black uppercase tracking-wider border-[0.3cqi]" style={{ borderColor: colors.secondary, color: colors.secondary }} />
      </div>
    </div>
  </div>
);

/* ─────────────────────────────────────────────────────────────────
   4. IMPACT DARK
───────────────────────────────────────────────────────────────── */
const VariantImpactDark = ({
  headline, subtext, ctaText, productImage, brandName, website, price,
  colors, editable, onUpdate, onFocusEl, onBlurEl,
}: SalePromotionProps) => (
  <div className="@container w-full h-full relative overflow-hidden flex flex-col font-sans" style={{ backgroundColor: colors.primary, color: colors.secondary }}>
    <div className="absolute inset-0">
      <Image src={productImage} alt="Product" fill className="object-contain object-center scale-[0.9]" crossOrigin="anonymous" />
      <div className="absolute inset-0" style={{ background: `linear-gradient(to top, ${colors.primary} 35%, ${colors.primary}80 60%, transparent 100%)` }} />
    </div>

    <div className="relative z-10 flex items-center justify-between px-[5cqi] pt-[4cqi]">
      <EditableText as="p" fieldId="f-brand" editable={editable} value={brandName ?? ""}
        onChange={v => onUpdate?.("brandName", v)} onFocusEl={onFocusEl} onBlurEl={onBlurEl}
        className="text-[2.2cqi] font-black uppercase tracking-[0.3em]" />
      <div className="w-[6cqi] h-[0.3cqi]" style={{ backgroundColor: colors.accent }} />
    </div>

    <div className="relative z-10 mt-auto px-[5cqi] pb-[5cqi]">
      {price !== undefined && price !== "" && (
        <EditableText as="p" fieldId="f-price" editable={editable} value={price}
          onChange={v => onUpdate?.("price", v)} onFocusEl={onFocusEl} onBlurEl={onBlurEl}
          className="text-[16cqi] font-black leading-none mb-[1cqi]" style={{ color: colors.accent }} />
      )}
      <h1 className="text-[7cqi] font-black uppercase leading-[0.9] tracking-tight mb-[2cqi]">
        <EditableHeadlineLines value={headline} editable={editable} onFocusEl={onFocusEl} onBlurEl={onBlurEl}
          onChange={v => onUpdate?.("headline", v)}
          renderLine={(line, i, node) => <span className="block">{node}</span>} />
      </h1>
      <EditableText as="p" fieldId="f-sub" editable={editable} value={subtext ?? ""}
        onChange={v => onUpdate?.("subtext", v)} onFocusEl={onFocusEl} onBlurEl={onBlurEl}
        className="text-[2.4cqi] opacity-50 mb-[4cqi] max-w-[70cqi]" />
      <div className="flex items-center gap-[3cqi]">
        <EditableText as="div" fieldId="f-cta" editable={editable} value={ctaText}
          onChange={v => onUpdate?.("ctaText", v)} onFocusEl={onFocusEl} onBlurEl={onBlurEl}
          className="px-[5cqi] py-[2.5cqi] text-[2.4cqi] font-black uppercase tracking-widest" style={{ backgroundColor: colors.accent, color: colors.primary }} />
        <EditableText as="p" fieldId="f-web" editable={editable} value={website ?? ""}
          onChange={v => onUpdate?.("website", v)} onFocusEl={onFocusEl} onBlurEl={onBlurEl}
          className="text-[2cqi] opacity-30 uppercase tracking-widest" />
      </div>
    </div>
  </div>
);

/* ─────────────────────────────────────────────────────────────────
   5. DIAGONAL SLICE
───────────────────────────────────────────────────────────────── */
const VariantDiagonalSlice = ({
  headline, subtext, ctaText, productImage, brandName, website, price,
  colors, editable, onUpdate, onFocusEl, onBlurEl,
}: SalePromotionProps) => (
  <div className="@container w-full h-full relative overflow-hidden flex flex-col font-sans">
    <div className="absolute inset-0" style={{ backgroundColor: colors.primary }} />
    <div className="absolute inset-0 z-0" style={{ backgroundColor: colors.accent, clipPath: 'polygon(55% 0%, 100% 0%, 100% 100%, 35% 100%)' }} />

    <div className="relative z-10 flex items-center justify-between px-[5cqi] pt-[4cqi] pb-[2cqi]">
      <EditableText as="p" fieldId="f-brand" editable={editable} value={brandName ?? ""}
        onChange={v => onUpdate?.("brandName", v)} onFocusEl={onFocusEl} onBlurEl={onBlurEl}
        className="text-[2.2cqi] font-black uppercase tracking-[0.3em]" style={{ color: colors.secondary }} />
      <EditableText as="p" fieldId="f-web" editable={editable} value={website ?? ""}
        onChange={v => onUpdate?.("website", v)} onFocusEl={onFocusEl} onBlurEl={onBlurEl}
        className="text-[2cqi] opacity-40 tracking-widest uppercase" style={{ color: colors.secondary }} />
    </div>

    <div className="relative z-10 px-[5cqi] mt-[2cqi]">
      <h1 className="text-[10cqi] font-black uppercase leading-[0.85] tracking-tight" style={{ color: colors.secondary }}>
        <EditableHeadlineLines value={headline} editable={editable} onFocusEl={onFocusEl} onBlurEl={onBlurEl}
          onChange={v => onUpdate?.("headline", v)}
          renderLine={(line, i, node) => <span className="block">{node}</span>} />
      </h1>
    </div>

    <div className="flex-1 relative z-20 flex items-center justify-center">
      <div className="w-[85cqi] h-full relative">
        <Image src={productImage} alt="Product" fill className="object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,0.35)]" crossOrigin="anonymous" />
      </div>
    </div>

    <div className="relative z-10 flex items-end justify-between px-[5cqi] pb-[4cqi]">
      <div>
        {price !== undefined && price !== "" && (
          <EditableText as="p" fieldId="f-price" editable={editable} value={price}
            onChange={v => onUpdate?.("price", v)} onFocusEl={onFocusEl} onBlurEl={onBlurEl}
            className="text-[8cqi] font-black leading-none" style={{ color: colors.secondary }} />
        )}
        <EditableText as="p" fieldId="f-sub" editable={editable} value={subtext ?? ""}
          onChange={v => onUpdate?.("subtext", v)} onFocusEl={onFocusEl} onBlurEl={onBlurEl}
          className="text-[2.2cqi] opacity-60 mt-[0.5cqi]" style={{ color: colors.secondary }} />
      </div>
      <EditableText as="div" fieldId="f-cta" editable={editable} value={ctaText}
        onChange={v => onUpdate?.("ctaText", v)} onFocusEl={onFocusEl} onBlurEl={onBlurEl}
        className="px-[5cqi] py-[2.5cqi] text-[2.4cqi] font-black uppercase tracking-wider" style={{ backgroundColor: colors.secondary, color: colors.primary }} />
    </div>
  </div>
);

/* ─────────────────────────────────────────────────────────────────
   6. WEEKEND CARD
───────────────────────────────────────────────────────────────── */
const VariantWeekendCard = ({
  headline, subtext, ctaText, productImage, brandName, website, price,
  colors, editable, onUpdate, onFocusEl, onBlurEl,
}: SalePromotionProps) => (
  <div className="@container w-full h-full relative overflow-hidden flex flex-col items-center justify-center font-sans p-[4cqi]" style={{ backgroundColor: colors.primary, color: colors.secondary }}>
    <div className="absolute inset-0 pointer-events-none" style={{ background: `radial-gradient(ellipse at 50% 40%, ${colors.accent}20 0%, transparent 70%)` }} />

    <div className="w-full h-full rounded-[4cqi] overflow-hidden relative flex flex-col shadow-[0_8px_60px_rgba(0,0,0,0.15)]" style={{ backgroundColor: colors.secondary === '#ffffff' ? '#fff' : colors.secondary + '08', border: `0.3cqi solid ${colors.secondary}12` }}>
      <div className="flex items-center justify-between px-[5cqi] py-[3.5cqi] shrink-0">
        <EditableText as="p" fieldId="f-brand" editable={editable} value={brandName ?? ""}
          onChange={v => onUpdate?.("brandName", v)} onFocusEl={onFocusEl} onBlurEl={onBlurEl}
          className="text-[2.2cqi] font-black uppercase tracking-[0.3em]" style={{ color: colors.secondary }} />
        <div className="w-[4cqi] h-[4cqi] rounded-full" style={{ backgroundColor: colors.accent }} />
      </div>

      <div className="flex-1 relative mx-[4cqi]">
        <Image src={productImage} alt="Product" fill className="object-contain" crossOrigin="anonymous" />
      </div>

      <div className="px-[5cqi] py-[4cqi] shrink-0" style={{ backgroundColor: colors.primary }}>
        <h1 className="text-[6.5cqi] font-black uppercase leading-[0.9] tracking-tight mb-[1.5cqi]" style={{ color: colors.secondary }}>
          <EditableHeadlineLines value={headline} editable={editable} onFocusEl={onFocusEl} onBlurEl={onBlurEl}
            onChange={v => onUpdate?.("headline", v)}
            renderLine={(line, i, node) => <span className="block">{node}</span>} />
        </h1>
        <div className="flex items-center justify-between mt-[2cqi]">
          <div>
            {price !== undefined && price !== "" && (
              <EditableText as="p" fieldId="f-price" editable={editable} value={price}
                onChange={v => onUpdate?.("price", v)} onFocusEl={onFocusEl} onBlurEl={onBlurEl}
                className="text-[5cqi] font-black" style={{ color: colors.accent }} />
            )}
            <EditableText as="p" fieldId="f-sub" editable={editable} value={subtext ?? ""}
              onChange={v => onUpdate?.("subtext", v)} onFocusEl={onFocusEl} onBlurEl={onBlurEl}
              className="text-[2cqi] opacity-50 mt-[0.5cqi]" style={{ color: colors.secondary }} />
          </div>
          <EditableText as="div" fieldId="f-cta" editable={editable} value={ctaText}
            onChange={v => onUpdate?.("ctaText", v)} onFocusEl={onFocusEl} onBlurEl={onBlurEl}
            className="px-[4cqi] py-[2cqi] rounded-full text-[2.2cqi] font-black uppercase tracking-widest" style={{ backgroundColor: colors.accent, color: colors.primary }} />
        </div>
        <EditableText as="p" fieldId="f-web" editable={editable} value={website ?? ""}
          onChange={v => onUpdate?.("website", v)} onFocusEl={onFocusEl} onBlurEl={onBlurEl}
          className="text-[1.8cqi] opacity-25 mt-[2cqi] tracking-widest uppercase" style={{ color: colors.secondary }} />
      </div>
    </div>
  </div>
);

/* ─────────────────────────────────────────────────────────────────
   7. NEON MINIMAL
───────────────────────────────────────────────────────────────── */
const VariantNeonMinimal = ({
  headline, subtext, ctaText, productImage, brandName, website, price,
  colors, editable, onUpdate, onFocusEl, onBlurEl,
}: SalePromotionProps) => (
  <div className="@container w-full h-full relative overflow-hidden flex flex-col font-sans" style={{ backgroundColor: '#080808', color: '#f5f5f5' }}>
    <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)', backgroundSize: '8cqi 8cqi' }} />
    <div className="absolute top-[20%] left-1/2 -translate-x-1/2 w-[60cqi] h-[60cqi] rounded-full blur-[15cqi] pointer-events-none" style={{ backgroundColor: colors.accent, opacity: 0.15 }} />

    <div className="relative z-10 flex items-center justify-between px-[5cqi] pt-[4cqi]">
      <EditableText as="p" fieldId="f-brand" editable={editable} value={brandName ?? ""}
        onChange={v => onUpdate?.("brandName", v)} onFocusEl={onFocusEl} onBlurEl={onBlurEl}
        className="text-[2cqi] font-black uppercase tracking-[0.4em] opacity-50" />
      <div className="h-[0.2cqi] flex-1 mx-[3cqi] opacity-20" style={{ backgroundColor: colors.accent }} />
      <EditableText as="p" fieldId="f-web" editable={editable} value={website ?? ""}
        onChange={v => onUpdate?.("website", v)} onFocusEl={onFocusEl} onBlurEl={onBlurEl}
        className="text-[2cqi] opacity-30 tracking-widest" />
    </div>

    <div className="flex-1 relative z-10">
      <Image src={productImage} alt="Product" fill className="object-contain object-center" crossOrigin="anonymous" />
    </div>

    <div className="relative z-10 px-[5cqi] pb-[5cqi]">
      <div className="w-full h-[0.2cqi] mb-[3cqi]" style={{ backgroundColor: colors.accent, opacity: 0.3 }} />
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-[6cqi] font-black uppercase leading-[0.9] tracking-tight">
            <EditableHeadlineLines value={headline} editable={editable} onFocusEl={onFocusEl} onBlurEl={onBlurEl}
              onChange={v => onUpdate?.("headline", v)}
              renderLine={(line, i, node) => <span className="block">{node}</span>} />
          </h1>
          <EditableText as="p" fieldId="f-sub" editable={editable} value={subtext ?? ""}
            onChange={v => onUpdate?.("subtext", v)} onFocusEl={onFocusEl} onBlurEl={onBlurEl}
            className="text-[2.2cqi] opacity-40 mt-[1.5cqi]" />
        </div>
        <div className="text-right">
          {price !== undefined && price !== "" && (
            <EditableText as="p" fieldId="f-price" editable={editable} value={price}
              onChange={v => onUpdate?.("price", v)} onFocusEl={onFocusEl} onBlurEl={onBlurEl}
              className="text-[8cqi] font-black leading-none" style={{ color: colors.accent }} />
          )}
          <EditableText as="div" fieldId="f-cta" editable={editable} value={ctaText}
            onChange={v => onUpdate?.("ctaText", v)} onFocusEl={onFocusEl} onBlurEl={onBlurEl}
            className="mt-[2cqi] px-[4cqi] py-[2cqi] text-[2.2cqi] font-black uppercase tracking-widest border-[0.2cqi]" style={{ borderColor: colors.accent, color: colors.accent }} />
        </div>
      </div>
    </div>
  </div>
);

/* ─────────────────────────────────────────────────────────────────
   8. GIFT LUX
───────────────────────────────────────────────────────────────── */
const VariantGiftLux = ({
  headline, subtext, ctaText, productImage, brandName, website, price, badgeText,
  colors, editable, onUpdate, onFocusEl, onBlurEl,
}: SalePromotionProps) => (
  <div className="@container w-full h-full relative overflow-hidden flex flex-col font-sans" style={{ backgroundColor: colors.primary, color: colors.secondary }}>
    <div className="shrink-0 flex items-center justify-between px-[5cqi] py-[2.5cqi] relative z-10" style={{ backgroundColor: colors.accent }}>
      <EditableText as="p" fieldId="f-brand" editable={editable} value={brandName ?? ""}
        onChange={v => onUpdate?.("brandName", v)} onFocusEl={onFocusEl} onBlurEl={onBlurEl}
        className="text-[2cqi] font-black uppercase tracking-[0.4em]" style={{ color: colors.primary }} />
      {badgeText && (
        <EditableText as="p" fieldId="f-badge" editable={editable} value={badgeText}
          onChange={v => onUpdate?.("badgeText", v)} onFocusEl={onFocusEl} onBlurEl={onBlurEl}
          className="text-[2cqi] font-bold uppercase tracking-widest" style={{ color: colors.primary }} />
      )}
    </div>

    <div className="flex-1 flex relative z-10">
      <div className="w-[55%] relative">
        <Image src={productImage} alt="Product" fill className="object-cover object-center" crossOrigin="anonymous" />
      </div>

      <div className="w-[45%] flex flex-col justify-between p-[5cqi]">
        <div>
          <h1 className="text-[8.5cqi] font-black uppercase leading-[0.85] tracking-tight mb-[3cqi]">
            <EditableHeadlineLines value={headline} editable={editable} onFocusEl={onFocusEl} onBlurEl={onBlurEl}
              onChange={v => onUpdate?.("headline", v)}
              renderLine={(line, i, node) => (
                <span className="block" style={i === 1 ? { color: colors.accent } : {}}>{node}</span>
              )} />
          </h1>
          <EditableText as="p" fieldId="f-sub" editable={editable} value={subtext ?? ""}
            onChange={v => onUpdate?.("subtext", v)} onFocusEl={onFocusEl} onBlurEl={onBlurEl}
            className="text-[2.2cqi] leading-relaxed opacity-55" />
        </div>
        <div>
          {price !== undefined && price !== "" && (
            <EditableText as="p" fieldId="f-price" editable={editable} value={price}
              onChange={v => onUpdate?.("price", v)} onFocusEl={onFocusEl} onBlurEl={onBlurEl}
              className="text-[7cqi] font-black leading-none mb-[2cqi]" style={{ color: colors.accent }} />
          )}
          <EditableText as="div" fieldId="f-cta" editable={editable} value={ctaText}
            onChange={v => onUpdate?.("ctaText", v)} onFocusEl={onFocusEl} onBlurEl={onBlurEl}
            className="px-[3cqi] py-[2cqi] text-[2.2cqi] font-black uppercase tracking-wider text-center" style={{ backgroundColor: colors.secondary, color: colors.primary }} />
        </div>
      </div>
    </div>

    <div className="shrink-0 flex items-center justify-center py-[2cqi] border-t z-10" style={{ borderColor: `${colors.secondary}15` }}>
      <EditableText as="p" fieldId="f-web" editable={editable} value={website ?? ""}
        onChange={v => onUpdate?.("website", v)} onFocusEl={onFocusEl} onBlurEl={onBlurEl}
        className="text-[1.8cqi] tracking-[0.5em] uppercase opacity-30" />
    </div>
  </div>
);

/* ─────────────────────────────────────────────────────────────────
   9. FRAMED PRODUCT
───────────────────────────────────────────────────────────────── */
const VariantFramedProduct = ({
  headline, subtext, ctaText, productImage, brandName, website, price,
  colors, editable, onUpdate, onFocusEl, onBlurEl,
}: SalePromotionProps) => (
  <div className="@container w-full h-full relative overflow-hidden flex flex-col items-center justify-center font-sans p-[5cqi]" style={{ backgroundColor: colors.primary, color: colors.secondary }}>
    <div className="absolute inset-[3cqi] border-[0.3cqi] pointer-events-none z-20" style={{ borderColor: `${colors.secondary}25` }} />
    <div className="absolute inset-[4.5cqi] border-[0.1cqi] pointer-events-none z-20" style={{ borderColor: `${colors.accent}40` }} />

    <div className="relative z-10 text-center mb-[3cqi] shrink-0">
      <EditableText as="p" fieldId="f-brand" editable={editable} value={brandName ?? ""}
        onChange={v => onUpdate?.("brandName", v)} onFocusEl={onFocusEl} onBlurEl={onBlurEl}
        className="text-[2.2cqi] tracking-[0.5em] uppercase font-medium opacity-40" />
    </div>

    <h1 className="relative z-10 text-[7cqi] font-black uppercase tracking-tight leading-[0.85] text-center mb-[4cqi] shrink-0">
      <EditableHeadlineLines value={headline} editable={editable} onFocusEl={onFocusEl} onBlurEl={onBlurEl}
        onChange={v => onUpdate?.("headline", v)}
        renderLine={(line, i, node) => (
          <span className="block" style={i === 0 ? {} : { color: colors.accent }}>{node}</span>
        )} />
    </h1>

    <div className="relative z-10 flex-1 w-full">
      <Image src={productImage} alt="Product" fill className="object-contain" crossOrigin="anonymous" />
    </div>

    <div className="relative z-10 flex items-center gap-[4cqi] mt-[3cqi] shrink-0">
      {price !== undefined && price !== "" && (
        <div className="text-center">
          <p className="text-[1.8cqi] tracking-widest uppercase opacity-40 mb-[0.3cqi]">Price</p>
          <EditableText as="p" fieldId="f-price" editable={editable} value={price}
            onChange={v => onUpdate?.("price", v)} onFocusEl={onFocusEl} onBlurEl={onBlurEl}
            className="text-[6cqi] font-black leading-none" style={{ color: colors.accent }} />
        </div>
      )}
      <div className="w-[0.2cqi] h-[8cqi]" style={{ backgroundColor: `${colors.secondary}20` }} />
      <div>
        <EditableText as="p" fieldId="f-sub" editable={editable} value={subtext ?? ""}
          onChange={v => onUpdate?.("subtext", v)} onFocusEl={onFocusEl} onBlurEl={onBlurEl}
          className="text-[2.4cqi] leading-relaxed opacity-50 mb-[1.5cqi] max-w-[35cqi]" />
        <div className="inline-flex items-center gap-[2cqi] px-[4cqi] py-[1.8cqi] text-[2.2cqi] font-black uppercase tracking-widest" style={{ backgroundColor: colors.accent, color: colors.primary }}>
          <EditableText as="span" fieldId="f-cta" editable={editable} value={ctaText}
            onChange={v => onUpdate?.("ctaText", v)} onFocusEl={onFocusEl} onBlurEl={onBlurEl} />
          <span>→</span>
        </div>
      </div>
    </div>

    <EditableText as="p" fieldId="f-web" editable={editable} value={website ?? ""}
      onChange={v => onUpdate?.("website", v)} onFocusEl={onFocusEl} onBlurEl={onBlurEl}
      className="relative z-10 text-[1.6cqi] tracking-[0.5em] uppercase opacity-20 mt-[2cqi] shrink-0" />
  </div>
);

/* ─────────────────────────────────────────────────────────────────
   10. COMBO CLEAN
───────────────────────────────────────────────────────────────── */
const VariantComboClean = ({
  headline, subtext, ctaText, productImage, brandName, website, price, badgeText,
  colors, editable, onUpdate, onFocusEl, onBlurEl,
}: SalePromotionProps) => (
  <div className="@container w-full h-full relative overflow-hidden flex flex-col font-sans" style={{ backgroundColor: colors.secondary === '#ffffff' ? '#fafafa' : colors.primary, color: colors.secondary }}>
    <div className="h-[55%] relative shrink-0">
      <Image src={productImage} alt="Product" fill className="object-contain object-center p-[4cqi]" crossOrigin="anonymous" />
      {badgeText && (
        <div className="absolute top-[4cqi] right-[4cqi] w-[18cqi] h-[18cqi] rounded-full flex items-center justify-center text-center z-10 font-black text-[3cqi] leading-tight shadow-xl" style={{ backgroundColor: colors.accent, color: colors.primary }}>
          <EditableHeadlineLines value={badgeText} editable={editable} onFocusEl={onFocusEl} onBlurEl={onBlurEl}
            fieldIdPrefix="f-badge" onChange={v => onUpdate?.("badgeText", v)}
            renderLine={(line, i, node) => <span className="block">{node}</span>} />
        </div>
      )}
      <div className="absolute bottom-0 left-0 right-0 h-[30%]" style={{ background: `linear-gradient(to bottom, transparent, ${colors.primary})` }} />
    </div>

    <div className="flex-1 px-[5cqi] pb-[4cqi] flex flex-col justify-between" style={{ backgroundColor: colors.primary }}>
      <div>
        <EditableText as="p" fieldId="f-brand" editable={editable} value={brandName ?? ""}
          onChange={v => onUpdate?.("brandName", v)} onFocusEl={onFocusEl} onBlurEl={onBlurEl}
          className="text-[2cqi] tracking-[0.4em] uppercase opacity-40 mb-[1cqi]" />
        <h1 className="text-[7.5cqi] font-black uppercase leading-[0.85] tracking-tight mb-[1.5cqi]" style={{ color: colors.secondary }}>
          <EditableHeadlineLines value={headline} editable={editable} onFocusEl={onFocusEl} onBlurEl={onBlurEl}
            onChange={v => onUpdate?.("headline", v)}
            renderLine={(line, i, node) => <span className="block">{node}</span>} />
        </h1>
        <EditableText as="p" fieldId="f-sub" editable={editable} value={subtext ?? ""}
          onChange={v => onUpdate?.("subtext", v)} onFocusEl={onFocusEl} onBlurEl={onBlurEl}
          className="text-[2.2cqi] opacity-50" />
      </div>
      <div className="flex items-center justify-between">
        {price !== undefined && price !== "" && (
          <EditableText as="p" fieldId="f-price" editable={editable} value={price}
            onChange={v => onUpdate?.("price", v)} onFocusEl={onFocusEl} onBlurEl={onBlurEl}
            className="text-[7cqi] font-black leading-none" style={{ color: colors.accent }} />
        )}
        <div>
          <EditableText as="div" fieldId="f-cta" editable={editable} value={ctaText}
            onChange={v => onUpdate?.("ctaText", v)} onFocusEl={onFocusEl} onBlurEl={onBlurEl}
            className="px-[5cqi] py-[2.5cqi] text-[2.4cqi] font-black uppercase tracking-widest mb-[1cqi]" style={{ backgroundColor: colors.accent, color: colors.primary }} />
          <EditableText as="p" fieldId="f-web" editable={editable} value={website ?? ""}
            onChange={v => onUpdate?.("website", v)} onFocusEl={onFocusEl} onBlurEl={onBlurEl}
            className="text-[1.8cqi] opacity-25 text-right tracking-widest uppercase" />
        </div>
      </div>
    </div>
  </div>
);

/* ─────────────────────────────────────────────────────────────────
   11. FASHION EDITORIAL
───────────────────────────────────────────────────────────────── */
const VariantFashionEditorial = ({
  headline, subtext, ctaText, productImage, brandName, website, price,
  colors, editable, onUpdate, onFocusEl, onBlurEl,
}: SalePromotionProps) => (
  <div className="@container w-full h-full relative overflow-hidden flex font-sans" style={{ backgroundColor: colors.primary, color: colors.secondary }}>
    <div className="absolute inset-0">
      <Image src={productImage} alt="Product" fill className="object-cover object-center" crossOrigin="anonymous" />
      <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, ${colors.primary}F0 0%, ${colors.primary}80 50%, transparent 100%)` }} />
    </div>

    <div className="relative z-10 w-[55%] h-full flex flex-col justify-between p-[6cqi]">
      <div>
        <EditableText as="p" fieldId="f-brand" editable={editable} value={brandName ?? ""}
          onChange={v => onUpdate?.("brandName", v)} onFocusEl={onFocusEl} onBlurEl={onBlurEl}
          className="text-[2cqi] tracking-[0.5em] uppercase font-medium opacity-40 mb-[3cqi]" />
        <div className="w-[5cqi] h-[0.3cqi] mb-[3cqi]" style={{ backgroundColor: colors.accent }} />
        <h1 className="text-[9.5cqi] font-black uppercase leading-[0.85] tracking-tighter mb-[3cqi]">
          <EditableHeadlineLines value={headline} editable={editable} onFocusEl={onFocusEl} onBlurEl={onBlurEl}
            onChange={v => onUpdate?.("headline", v)}
            renderLine={(line, i, node) => (
              <span className="block" style={i % 2 === 1 ? { color: colors.accent } : {}}>{node}</span>
            )} />
        </h1>
        <EditableText as="p" fieldId="f-sub" editable={editable} value={subtext ?? ""}
          onChange={v => onUpdate?.("subtext", v)} onFocusEl={onFocusEl} onBlurEl={onBlurEl}
          className="text-[2.3cqi] leading-relaxed opacity-55 max-w-[40cqi]" />
      </div>

      <div>
        {price !== undefined && price !== "" && (
          <div className="mb-[3cqi]">
            <p className="text-[1.8cqi] uppercase tracking-widest opacity-40 mb-[0.5cqi]">Starting from</p>
            <EditableText as="p" fieldId="f-price" editable={editable} value={price}
              onChange={v => onUpdate?.("price", v)} onFocusEl={onFocusEl} onBlurEl={onBlurEl}
              className="text-[9cqi] font-black leading-none" style={{ color: colors.accent }} />
          </div>
        )}
        <div className="inline-flex items-center gap-[2cqi] px-[5cqi] py-[2.5cqi] text-[2.4cqi] font-black uppercase tracking-wider" style={{ backgroundColor: colors.accent, color: colors.primary }}>
          <EditableText as="span" fieldId="f-cta" editable={editable} value={ctaText}
            onChange={v => onUpdate?.("ctaText", v)} onFocusEl={onFocusEl} onBlurEl={onBlurEl} />
          <span className="opacity-70">→</span>
        </div>
        <EditableText as="p" fieldId="f-web" editable={editable} value={website ?? ""}
          onChange={v => onUpdate?.("website", v)} onFocusEl={onFocusEl} onBlurEl={onBlurEl}
          className="text-[1.8cqi] opacity-25 mt-[2cqi] tracking-widest uppercase" />
      </div>
    </div>
  </div>
);

/* ─────────────────────────────────────────────────────────────────
   12. CAFE MODERN
───────────────────────────────────────────────────────────────── */
const VariantCafeModern = ({
  headline, subtext, ctaText, productImage, brandName, website, price, extraText,
  colors, editable, onUpdate, onFocusEl, onBlurEl,
}: SalePromotionProps) => (
  <div className="@container w-full h-full relative overflow-hidden flex flex-col font-sans" style={{ backgroundColor: colors.primary, color: colors.secondary }}>
    <div className="shrink-0 flex items-center justify-between px-[5cqi] py-[3cqi] border-b z-10 relative" style={{ borderColor: `${colors.secondary}12` }}>
      <EditableText as="p" fieldId="f-brand" editable={editable} value={brandName ?? ""}
        onChange={v => onUpdate?.("brandName", v)} onFocusEl={onFocusEl} onBlurEl={onBlurEl}
        className="text-[2.4cqi] font-black uppercase tracking-[0.3em]" />
      <div className="flex items-center gap-[1.5cqi]">
        <div className="w-[2cqi] h-[2cqi] rounded-full" style={{ backgroundColor: colors.accent }} />
        <EditableText as="p" fieldId="f-web" editable={editable} value={website ?? ""}
          onChange={v => onUpdate?.("website", v)} onFocusEl={onFocusEl} onBlurEl={onBlurEl}
          className="text-[1.8cqi] opacity-30 tracking-widest uppercase" />
      </div>
    </div>

    <div className="flex-1 relative">
      <Image src={productImage} alt="Product" fill className="object-contain object-center p-[3cqi]" crossOrigin="anonymous" />
      <div className="absolute bottom-0 left-0 right-0 h-[40%]" style={{ background: `linear-gradient(to top, ${colors.primary}, transparent)` }} />
    </div>

    <div className="shrink-0 px-[5cqi] pb-[4cqi] pt-[2cqi]">
      <h1 className="text-[7.5cqi] font-black uppercase leading-[0.85] tracking-tight mb-[2cqi]">
        <EditableHeadlineLines value={headline} editable={editable} onFocusEl={onFocusEl} onBlurEl={onBlurEl}
          onChange={v => onUpdate?.("headline", v)}
          renderLine={(line, i, node) => (
            <span className="block" style={i === 1 ? { color: colors.accent } : {}}>{node}</span>
          )} />
      </h1>
      <div className="flex items-end justify-between">
        <div>
          <EditableText as="p" fieldId="f-sub" editable={editable} value={subtext ?? ""}
            onChange={v => onUpdate?.("subtext", v)} onFocusEl={onFocusEl} onBlurEl={onBlurEl}
            className="text-[2.2cqi] opacity-50 mb-[0.5cqi]" />
          {extraText && <p className="text-[2cqi] opacity-35">{extraText.split('\n')[0]}</p>}
        </div>
        <div className="text-right">
          {price !== undefined && price !== "" && (
            <EditableText as="p" fieldId="f-price" editable={editable} value={price}
              onChange={v => onUpdate?.("price", v)} onFocusEl={onFocusEl} onBlurEl={onBlurEl}
              className="text-[6cqi] font-black leading-none mb-[1.5cqi]" style={{ color: colors.accent }} />
          )}
          <EditableText as="div" fieldId="f-cta" editable={editable} value={ctaText}
            onChange={v => onUpdate?.("ctaText", v)} onFocusEl={onFocusEl} onBlurEl={onBlurEl}
            className="px-[4cqi] py-[2cqi] text-[2.2cqi] font-black uppercase tracking-widest" style={{ backgroundColor: colors.accent, color: colors.primary }} />
        </div>
      </div>
    </div>
  </div>
);
