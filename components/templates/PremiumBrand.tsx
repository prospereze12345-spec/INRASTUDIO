import React from "react";
import Image from "next/image";
import { EditableText } from "@/components/EditableText";
import { EditableHeadlineLines } from "@/components/Editableheadlinelines";

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
  colors: {
    primary: string;
    secondary: string;
    accent: string;
  };
  /** When true, every text field renders as an in-place editable node wired to onUpdate. */
  editable?: boolean;
  /** field is one of: brandName | headline | subtext | ctaText | badgeText | website | price */
  onUpdate?: (field: string, value: string) => void;
  onFocusEl?: (el: HTMLElement) => void;
  onBlurEl?: () => void;
}

export function PremiumBrandTemplate(props: PremiumBrandProps) {
  if (!props.headline || !props.productImage || !props.colors) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400 text-sm">
        Loading template...
      </div>
    );
  }
  const { name = "Grand Opening" } = props;
  switch (name) {
    case "Grand Opening":    return <VariantGrandOpening   {...props} />;
    case "Digital Agency":   return <VariantDigitalAgency  {...props} />;
    case "Premium Gold":     return <VariantPremiumGold    {...props} />;
    case "Cleaning Service": return <VariantCleaningService {...props} />;
    case "Organic Deal":     return <VariantOrganicDeal    {...props} />;
    default:                 return <VariantGrandOpening   {...props} />;
  }
}

/* ─────────────────────────────────────────────────────────────────
   1. GRAND OPENING — bold announcement, full-bleed drama
───────────────────────────────────────────────────────────────── */
const VariantGrandOpening = ({
  headline, subtext, ctaText, productImage, brandName, website, price, badgeText,
  colors, editable, onUpdate, onFocusEl, onBlurEl,
}: PremiumBrandProps) => (
  <div className="@container w-full h-full relative overflow-hidden flex flex-col font-sans" style={{ backgroundColor: colors.primary, color: colors.secondary }}>

    <div className="absolute top-0 right-0 w-[70cqi] h-[70cqi] rounded-full pointer-events-none z-0"
      style={{ background: `radial-gradient(circle, ${colors.accent}18 0%, transparent 70%)` }} />

    <div className="shrink-0 flex items-center justify-between px-[5cqi] pt-[4cqi] pb-[3cqi] z-10 relative">
      <EditableText as="p" fieldId="f-brand" editable={editable} value={brandName ?? ""}
        onChange={v => onUpdate?.("brandName", v)} onFocusEl={onFocusEl} onBlurEl={onBlurEl}
        className="text-[2.2cqi] font-black uppercase tracking-[0.35em]" />
      <div className="flex items-center gap-[2cqi]">
        <div className="w-[2cqi] h-[2cqi] rounded-full" style={{ backgroundColor: colors.accent }} />
        <EditableText as="p" fieldId="f-web" editable={editable} value={website ?? ""}
          onChange={v => onUpdate?.("website", v)} onFocusEl={onFocusEl} onBlurEl={onBlurEl}
          className="text-[1.8cqi] opacity-30 tracking-widest uppercase" />
      </div>
    </div>

    <div className="shrink-0 px-[5cqi] pb-[1cqi] z-10 relative">
      <h1 className="font-black uppercase leading-[0.82] tracking-tighter" style={{ fontSize: '12cqi', color: colors.secondary }}>
        <EditableHeadlineLines
          value={headline} editable={editable} onFocusEl={onFocusEl} onBlurEl={onBlurEl}
          onChange={v => onUpdate?.("headline", v)}
          renderLine={(line, i, node) => (
            <span className="block" style={i % 2 === 1 ? { color: colors.accent } : {}}>{node}</span>
          )}
        />
      </h1>
    </div>

    <div className="mx-[5cqi] h-[0.2cqi] z-10 relative shrink-0 my-[2cqi]"
      style={{ backgroundColor: `${colors.secondary}15` }} />

    <div className="flex-1 relative z-10">
      <Image src={productImage} alt="Product" fill
        className="object-contain object-center"
        crossOrigin="anonymous" />
      <div className="absolute bottom-0 left-0 right-0 h-[35%]"
        style={{ background: `linear-gradient(to top, ${colors.primary}, transparent)` }} />
    </div>

    <div className="shrink-0 px-[5cqi] pb-[4cqi] z-10 relative">
      <div className="flex items-end justify-between">
        <div>
          {price !== undefined && price !== "" && (
            <EditableText as="p" fieldId="f-price" editable={editable} value={price}
              onChange={v => onUpdate?.("price", v)} onFocusEl={onFocusEl} onBlurEl={onBlurEl}
              className="text-[8cqi] font-black leading-none" style={{ color: colors.accent }} />
          )}
          <EditableText as="p" fieldId="f-sub" editable={editable} value={subtext}
            onChange={v => onUpdate?.("subtext", v)} onFocusEl={onFocusEl} onBlurEl={onBlurEl}
            className="text-[2.2cqi] opacity-50 mt-[0.5cqi] max-w-[45cqi]" />
        </div>
        <div className="flex flex-col items-end gap-[1.5cqi]">
          {badgeText && (
            <EditableText as="div" fieldId="f-badge" editable={editable} value={badgeText.split('\n')[0]}
              onChange={v => onUpdate?.("badgeText", v)} onFocusEl={onFocusEl} onBlurEl={onBlurEl}
              className="px-[3cqi] py-[1cqi] text-[2cqi] font-black uppercase tracking-wider rounded-full"
              style={{ backgroundColor: `${colors.accent}20`, color: colors.accent, border: `0.2cqi solid ${colors.accent}40` }} />
          )}
          <EditableText as="div" fieldId="f-cta" editable={editable} value={ctaText}
            onChange={v => onUpdate?.("ctaText", v)} onFocusEl={onFocusEl} onBlurEl={onBlurEl}
            className="px-[5cqi] py-[2.5cqi] text-[2.4cqi] font-black uppercase tracking-widest"
            style={{ backgroundColor: colors.accent, color: colors.primary }} />
        </div>
      </div>
    </div>
  </div>
);

/* ─────────────────────────────────────────────────────────────────
   2. DIGITAL AGENCY — tech-forward, asymmetric, confident
───────────────────────────────────────────────────────────────── */
const VariantDigitalAgency = ({
  headline, subtext, ctaText, badgeText, extraText, productImage, brandName, website, price,
  colors, editable, onUpdate, onFocusEl, onBlurEl,
}: PremiumBrandProps) => {
  const services = (badgeText ?? "").replace('Our Services\n', '').split('\n').filter(Boolean).slice(0, 4);

  const setService = (i: number, v: string) => {
    if (!onUpdate) return;
    const all = (badgeText ?? "").split('\n');
    // account for the stripped "Our Services" header line when present
    const offset = (badgeText ?? "").startsWith('Our Services\n') ? 1 : 0;
    all[i + offset] = v;
    onUpdate("badgeText", all.join('\n'));
  };

  return (
    <div className="@container w-full h-full relative overflow-hidden flex flex-col font-sans"
      style={{ backgroundColor: colors.primary, color: colors.secondary }}>

      {[0, 1, 2].map(i => (
        <div key={i} className="absolute top-0 bottom-0 w-[0.8cqi] z-0"
          style={{ right: `${(i + 1) * 4}cqi`, backgroundColor: colors.accent, opacity: 0.12 + i * 0.06 }} />
      ))}

      <div className="shrink-0 flex items-center justify-between px-[5cqi] pt-[4cqi] pb-[3cqi] z-10 relative">
        <EditableText as="p" fieldId="f-brand" editable={editable} value={brandName ?? ""}
          onChange={v => onUpdate?.("brandName", v)} onFocusEl={onFocusEl} onBlurEl={onBlurEl}
          className="text-[2.4cqi] font-black uppercase tracking-[0.3em]" />
        <EditableText as="p" fieldId="f-web" editable={editable} value={website ?? ""}
          onChange={v => onUpdate?.("website", v)} onFocusEl={onFocusEl} onBlurEl={onBlurEl}
          className="text-[1.8cqi] opacity-25 tracking-widest uppercase" />
      </div>

      <div className="flex-1 flex z-10 relative">
        <div className="w-[55%] flex flex-col justify-between px-[5cqi] pb-[4cqi]">
          <div>
            <div className="flex items-center gap-[2cqi] mb-[2.5cqi]">
              <div className="w-[4cqi] h-[0.2cqi]" style={{ backgroundColor: colors.accent }} />
              <p className="text-[1.8cqi] tracking-[0.3em] uppercase opacity-40">Services</p>
            </div>

            <h1 className="text-[8.5cqi] font-black leading-[0.85] tracking-tighter uppercase mb-[3cqi]">
              <EditableHeadlineLines
                value={headline} editable={editable} onFocusEl={onFocusEl} onBlurEl={onBlurEl}
                onChange={v => onUpdate?.("headline", v)}
                renderLine={(line, i, node) => (
                  <span className="block" style={i === 1 ? { color: colors.accent } : {}}>{node}</span>
                )}
              />
            </h1>

            <EditableText as="p" fieldId="f-sub" editable={editable} value={subtext}
              onChange={v => onUpdate?.("subtext", v)} onFocusEl={onFocusEl} onBlurEl={onBlurEl}
              className="text-[2.2cqi] leading-relaxed opacity-55 mb-[3cqi]" />

            {badgeText && (
              <div className="space-y-[1.5cqi]">
                {services.map((item, i) => (
                  <div key={i} className="flex items-center gap-[2cqi]">
                    <div className="w-[1.5cqi] h-[1.5cqi] rounded-full shrink-0" style={{ backgroundColor: colors.accent }} />
                    <EditableText as="p" fieldId={`f-service-${i}`} editable={editable} value={item}
                      onChange={v => setService(i, v)} onFocusEl={onFocusEl} onBlurEl={onBlurEl}
                      className="text-[2.2cqi] font-medium opacity-70" />
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            {price !== undefined && price !== "" && (
              <EditableText as="p" fieldId="f-price" editable={editable} value={price}
                onChange={v => onUpdate?.("price", v)} onFocusEl={onFocusEl} onBlurEl={onBlurEl}
                className="text-[6cqi] font-black leading-none mb-[2cqi]" style={{ color: colors.accent }} />
            )}
            <div className="inline-flex items-center gap-[2cqi] px-[4cqi] py-[2.5cqi] text-[2.4cqi] font-black uppercase tracking-widest"
              style={{ backgroundColor: colors.accent, color: colors.primary }}>
              <EditableText as="span" fieldId="f-cta" editable={editable} value={ctaText}
                onChange={v => onUpdate?.("ctaText", v)} onFocusEl={onFocusEl} onBlurEl={onBlurEl} />
              <span className="opacity-70">→</span>
            </div>
            {extraText && (
              <p className="text-[1.8cqi] opacity-30 mt-[1.5cqi]">{extraText.split('\n')[0]}</p>
            )}
          </div>
        </div>

        <div className="w-[45%] relative">
          <Image src={productImage} alt="Product" fill
            className="object-cover object-center"
            crossOrigin="anonymous" />
          <div className="absolute inset-0"
            style={{ background: `linear-gradient(to right, ${colors.primary} 0%, transparent 30%)` }} />
        </div>
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────────
   3. PREMIUM GOLD — opulent, jewellery-store gravitas
───────────────────────────────────────────────────────────────── */
const VariantPremiumGold = ({
  headline, subtext, ctaText, website, productImage, brandName, price,
  colors, editable, onUpdate, onFocusEl, onBlurEl,
}: PremiumBrandProps) => (
  <div className="@container w-full h-full relative overflow-hidden flex flex-col font-sans"
    style={{ backgroundColor: colors.primary, color: colors.secondary }}>

    <div className="absolute inset-[3cqi] border-[0.2cqi] pointer-events-none z-20"
      style={{ borderColor: `${colors.accent}40` }} />

    <div className="shrink-0 text-center pt-[6cqi] pb-[2cqi] z-10 relative">
      <EditableText as="p" fieldId="f-brand" editable={editable} value={brandName ?? ""}
        onChange={v => onUpdate?.("brandName", v)} onFocusEl={onFocusEl} onBlurEl={onBlurEl}
        className="text-[2cqi] tracking-[0.6em] uppercase font-medium opacity-40" />
      <div className="flex items-center justify-center gap-[3cqi] mt-[1.5cqi]">
        <div className="flex-1 h-[0.1cqi] max-w-[15cqi]" style={{ backgroundColor: `${colors.accent}50` }} />
        <div className="w-[2cqi] h-[2cqi] rotate-45" style={{ backgroundColor: colors.accent, opacity: 0.5 }} />
        <div className="flex-1 h-[0.1cqi] max-w-[15cqi]" style={{ backgroundColor: `${colors.accent}50` }} />
      </div>
    </div>

    <div className="shrink-0 px-[7cqi] z-10 relative text-center">
      <h1 className="text-[8cqi] font-black uppercase leading-[0.9] tracking-tight">
        <EditableHeadlineLines
          value={headline} editable={editable} onFocusEl={onFocusEl} onBlurEl={onBlurEl}
          onChange={v => onUpdate?.("headline", v)}
          renderLine={(line, i, node) => (
            <span className="block" style={i === 1 ? { color: colors.accent } : {}}>{node}</span>
          )}
        />
      </h1>
    </div>

    <div className="flex-1 relative z-10 px-[5cqi] py-[2cqi]">
      <Image src={productImage} alt="Product" fill
        className="object-contain object-center"
        crossOrigin="anonymous" />
      <div className="absolute bottom-0 left-[20%] right-[20%] h-[30%] blur-[4cqi] z-0 rounded-full"
        style={{ backgroundColor: colors.accent, opacity: 0.08 }} />
    </div>

    <div className="shrink-0 px-[6cqi] pb-[5cqi] z-10 relative">
      <div className="flex items-center justify-center gap-[3cqi] mb-[2.5cqi]">
        <div className="flex-1 h-[0.1cqi]" style={{ backgroundColor: `${colors.accent}30` }} />
        <div className="w-[2cqi] h-[2cqi] rotate-45" style={{ backgroundColor: colors.accent, opacity: 0.4 }} />
        <div className="flex-1 h-[0.1cqi]" style={{ backgroundColor: `${colors.accent}30` }} />
      </div>
      <div className="flex items-end justify-between">
        <div>
          {price !== undefined && price !== "" && (
            <EditableText as="p" fieldId="f-price" editable={editable} value={price}
              onChange={v => onUpdate?.("price", v)} onFocusEl={onFocusEl} onBlurEl={onBlurEl}
              className="text-[7cqi] font-black leading-none" style={{ color: colors.accent }} />
          )}
          <EditableText as="p" fieldId="f-sub" editable={editable} value={subtext}
            onChange={v => onUpdate?.("subtext", v)} onFocusEl={onFocusEl} onBlurEl={onBlurEl}
            className="text-[2cqi] opacity-45 mt-[0.5cqi]" />
        </div>
        <div className="text-right">
          <EditableText as="div" fieldId="f-cta" editable={editable} value={ctaText}
            onChange={v => onUpdate?.("ctaText", v)} onFocusEl={onFocusEl} onBlurEl={onBlurEl}
            className="inline-block px-[5cqi] py-[2.5cqi] text-[2.2cqi] font-black uppercase tracking-widest mb-[1cqi]"
            style={{ backgroundColor: colors.accent, color: colors.primary }} />
          <EditableText as="p" fieldId="f-web" editable={editable} value={website ?? ""}
            onChange={v => onUpdate?.("website", v)} onFocusEl={onFocusEl} onBlurEl={onBlurEl}
            className="text-[1.6cqi] opacity-20 tracking-widest uppercase" />
        </div>
      </div>
    </div>
  </div>
);

/* ─────────────────────────────────────────────────────────────────
   4. CLEANING SERVICE — professional, trustworthy, clean grid
───────────────────────────────────────────────────────────────── */
const VariantCleaningService = ({
  headline, subtext, badgeText, extraText, productImage, brandName, website, price, ctaText,
  colors, editable, onUpdate, onFocusEl, onBlurEl,
}: PremiumBrandProps) => {
  const cleanedHeadline = headline.replace('PROFESSIONAL\n', '');
  const services = (badgeText ?? "").replace('OUR SERVICES :\n\n', '').split('\n').filter(Boolean).slice(0, 4);

  const setService = (i: number, v: string) => {
    if (!onUpdate) return;
    const all = (badgeText ?? "").split('\n');
    const prefixLines = (badgeText ?? "").startsWith('OUR SERVICES :\n\n') ? 2 : 0;
    all[i + prefixLines] = v;
    onUpdate("badgeText", all.join('\n'));
  };

  return (
    <div className="@container w-full h-full relative overflow-hidden flex flex-col font-sans"
      style={{ backgroundColor: colors.primary, color: colors.secondary }}>

      <div className="shrink-0 flex items-center justify-between px-[5cqi] py-[3cqi] z-10 relative"
        style={{ backgroundColor: colors.accent }}>
        <EditableText as="p" fieldId="f-brand" editable={editable} value={brandName ?? ""}
          onChange={v => onUpdate?.("brandName", v)} onFocusEl={onFocusEl} onBlurEl={onBlurEl}
          className="text-[2.4cqi] font-black uppercase tracking-[0.3em]" style={{ color: colors.primary }} />
        <EditableText as="p" fieldId="f-web" editable={editable} value={website ?? ""}
          onChange={v => onUpdate?.("website", v)} onFocusEl={onFocusEl} onBlurEl={onBlurEl}
          className="text-[1.8cqi] font-bold opacity-60 tracking-widest uppercase" style={{ color: colors.primary }} />
      </div>

      <div className="flex-1 flex z-10 relative">
        <div className="w-[50%] flex flex-col justify-between px-[5cqi] py-[4cqi]">
          <div>
            <p className="text-[2cqi] tracking-[0.4em] uppercase opacity-40 mb-[2cqi]">Professional</p>
            <h1 className="text-[9cqi] font-black uppercase leading-[0.85] tracking-tight mb-[3cqi]">
              <EditableHeadlineLines
                value={cleanedHeadline} editable={editable} onFocusEl={onFocusEl} onBlurEl={onBlurEl}
                onChange={v => onUpdate?.("headline", v)}
                renderLine={(line, i, node) => (
                  <span className="block" style={i === 1 ? { color: colors.accent } : {}}>{node}</span>
                )}
              />
            </h1>
            <EditableText as="p" fieldId="f-sub" editable={editable} value={subtext}
              onChange={v => onUpdate?.("subtext", v)} onFocusEl={onFocusEl} onBlurEl={onBlurEl}
              className="text-[2.2cqi] opacity-55 leading-relaxed mb-[3cqi]" />

            {badgeText && (
              <div className="space-y-[1.5cqi]">
                <p className="text-[1.8cqi] tracking-[0.3em] uppercase opacity-40 mb-[1.5cqi]">What we do</p>
                {services.map((s, i) => (
                  <div key={i} className="flex items-center gap-[2cqi]">
                    <div className="w-[1.5cqi] h-[1.5cqi] rounded-full shrink-0" style={{ backgroundColor: colors.accent }} />
                    <EditableText as="p" fieldId={`f-service-${i}`} editable={editable} value={s}
                      onChange={v => setService(i, v)} onFocusEl={onFocusEl} onBlurEl={onBlurEl}
                      className="text-[2.2cqi] font-medium opacity-65" />
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            {price !== undefined && price !== "" && (
              <EditableText as="p" fieldId="f-price" editable={editable} value={price}
                onChange={v => onUpdate?.("price", v)} onFocusEl={onFocusEl} onBlurEl={onBlurEl}
                className="text-[6cqi] font-black leading-none mb-[2cqi]" style={{ color: colors.accent }} />
            )}
            <div className="inline-flex items-center gap-[2cqi] px-[4cqi] py-[2.5cqi] text-[2.4cqi] font-black uppercase tracking-widest"
              style={{ backgroundColor: colors.accent, color: colors.primary }}>
              <EditableText as="span" fieldId="f-cta" editable={editable} value={ctaText}
                onChange={v => onUpdate?.("ctaText", v)} onFocusEl={onFocusEl} onBlurEl={onBlurEl} />
              <span className="opacity-70">→</span>
            </div>
            {extraText && (
              <p className="text-[1.8cqi] opacity-30 mt-[1.5cqi]">{extraText.split('\n')[0]}</p>
            )}
          </div>
        </div>

        <div className="w-[50%] relative">
          <Image src={productImage} alt="Product" fill
            className="object-cover object-center"
            crossOrigin="anonymous" />
          <div className="absolute inset-0"
            style={{ background: `linear-gradient(to right, ${colors.primary} 0%, transparent 25%)` }} />
        </div>
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────────
   5. ORGANIC DEAL — natural, earthy, wellness brand
───────────────────────────────────────────────────────────────── */
const VariantOrganicDeal = ({
  headline, subtext, ctaText, website, productImage, brandName, price,
  colors, editable, onUpdate, onFocusEl, onBlurEl,
}: PremiumBrandProps) => (
  <div className="@container w-full h-full relative overflow-hidden flex flex-col font-sans"
    style={{ backgroundColor: colors.primary, color: colors.secondary }}>

    <div className="absolute top-[-10cqi] right-[-10cqi] w-[50cqi] h-[50cqi] rounded-full pointer-events-none z-0"
      style={{ backgroundColor: colors.accent, opacity: 0.06 }} />
    <div className="absolute bottom-[-5cqi] left-[-5cqi] w-[30cqi] h-[30cqi] rounded-full pointer-events-none z-0"
      style={{ backgroundColor: colors.accent, opacity: 0.04 }} />

    <div className="shrink-0 flex items-center justify-between px-[5cqi] pt-[4cqi] pb-[2cqi] z-10 relative">
      <EditableText as="p" fieldId="f-brand" editable={editable} value={brandName ?? ""}
        onChange={v => onUpdate?.("brandName", v)} onFocusEl={onFocusEl} onBlurEl={onBlurEl}
        className="text-[2.2cqi] font-black uppercase tracking-[0.35em]" />
      <EditableText as="p" fieldId="f-web" editable={editable} value={website ?? ""}
        onChange={v => onUpdate?.("website", v)} onFocusEl={onFocusEl} onBlurEl={onBlurEl}
        className="text-[1.8cqi] opacity-25 tracking-widest uppercase" />
    </div>

    <div className="mx-[5cqi] h-[0.2cqi] shrink-0 z-10 relative"
      style={{ backgroundColor: `${colors.secondary}15` }} />

    <div className="flex-1 relative z-10 px-[4cqi] pt-[2cqi]">
      <Image src={productImage} alt="Product" fill
        className="object-contain object-center"
        crossOrigin="anonymous" />
      <div className="absolute bottom-0 left-0 right-0 h-[40%]"
        style={{ background: `linear-gradient(to top, ${colors.primary}, transparent)` }} />
    </div>

    <div className="shrink-0 px-[5cqi] pb-[5cqi] z-10 relative">
      <div className="flex items-center gap-[2cqi] mb-[2cqi]">
        <div className="w-[4cqi] h-[0.2cqi]" style={{ backgroundColor: colors.accent }} />
        <p className="text-[1.8cqi] tracking-[0.4em] uppercase opacity-40">{subtext.split(' ').slice(0, 3).join(' ')}</p>
      </div>

      <h1 className="text-[8.5cqi] font-black uppercase leading-[0.85] tracking-tighter mb-[2.5cqi]">
        <EditableHeadlineLines
          value={headline} editable={editable} onFocusEl={onFocusEl} onBlurEl={onBlurEl}
          onChange={v => onUpdate?.("headline", v)}
          renderLine={(line, i, node) => (
            <span className="block" style={i === 1 ? { color: colors.accent } : {}}>{node}</span>
          )}
        />
      </h1>

      <EditableText as="p" fieldId="f-sub" editable={editable} value={subtext}
        onChange={v => onUpdate?.("subtext", v)} onFocusEl={onFocusEl} onBlurEl={onBlurEl}
        className="text-[2.2cqi] opacity-50 leading-relaxed mb-[3cqi] max-w-[65cqi]" />

      <div className="flex items-center justify-between">
        {price !== undefined && price !== ""
          ? <EditableText as="p" fieldId="f-price" editable={editable} value={price}
              onChange={v => onUpdate?.("price", v)} onFocusEl={onFocusEl} onBlurEl={onBlurEl}
              className="text-[6cqi] font-black leading-none" style={{ color: colors.accent }} />
          : <div />
        }
        <div className="inline-flex items-center gap-[2cqi] px-[5cqi] py-[2.5cqi] text-[2.4cqi] font-black uppercase tracking-widest rounded-full"
          style={{ backgroundColor: colors.accent, color: colors.primary }}>
          <EditableText as="span" fieldId="f-cta" editable={editable} value={ctaText}
            onChange={v => onUpdate?.("ctaText", v)} onFocusEl={onFocusEl} onBlurEl={onBlurEl} />
          <span className="opacity-70">→</span>
        </div>
      </div>
    </div>
  </div>
);
