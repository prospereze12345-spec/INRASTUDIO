import React from "react";
import Image from "next/image";
import { EditableText } from "@/components/EditableText";
import { EditableHeadlineLines } from "@/components/Editableheadlinelines";
import { FeatureList, ContactBar, WhyChooseUsList } from "./FlyerContentBlocks";

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
  /** field is one of: brandName | headline | subtext | ctaText | website | phone | email | price | instagram */
  onUpdate?: (field: string, value: string) => void;
  onFocusEl?: (el: HTMLElement) => void;
  onBlurEl?: () => void;
  onUpdateFeature?: (index: number, value: string) => void;
  onAddFeature?: () => void;
  onRemoveFeature?: (index: number) => void;

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
}

/* ─────────────────────────────────────────────────────────────────
   RESPONSIVE SCALE
   Every value below used to be `Ncqi`, which requires container
   query units (iOS 16+ only). Replaced with clamp(min, Nvw, max):
   - min  = N * 3px  → never illegibly small on old/narrow phones
   - Nvw  → same proportional scaling behavior cqi gave us
   - max  = N * 6px  → never balloons on tablet/desktop canvases
   clamp() + vw has worked since Safari 13.1 / iOS 13, so this runs
   correctly on iOS 15.8 and every Android browser without any
   @supports fallback needed.
───────────────────────────────────────────────────────────────── */

const px = (n: number) => `clamp(${n * 3}px, ${n}vw, ${n * 6}px)`;

// Touch targets: Apple HIG + Android Material both require a 44x44px
// (or 48x48dp) minimum hit area. The clamp() low end alone can't
// guarantee this on narrow phones, so CTAs get an explicit floor.
const ctaBaseStyle: React.CSSProperties = {
  minHeight: "44px",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
};

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
    case "Black Gold": return <VariantBlackGold {...props} />;
    case "White Gold": return <VariantWhiteGold {...props} />;
    default:            return <VariantWhiteGold {...props} />;
  }
}

/* ─────────────────────────────────────────────────────────────────
   1. BLACK GOLD
───────────────────────────────────────────────────────────────── */
const VariantBlackGold = ({
  headline, subtext, ctaText, productImage, brandName, website, instagram, price,
  colors, editable, onUpdate, onFocusEl, onBlurEl, features, phone, email, whyChooseUs,
  onUpdateFeature, onAddFeature, onRemoveFeature,
  onUpdateWhyChooseUs, onAddWhyChooseUs, onRemoveWhyChooseUs,
  featuresVisible, whyChooseUsVisible, phoneVisible, emailVisible, websiteVisible,
  onRestoreFeatures, onRestoreWhyChooseUs,
  onRemovePhone, onRemoveEmail, onRemoveWebsite,
  onRestorePhone, onRestoreEmail, onRestoreWebsite,
}: LuxuryProductProps) => (
  <div
    className="w-full h-full relative overflow-hidden flex flex-col font-sans"
    style={{ backgroundColor: colors.primary, color: colors.secondary }}
  >
    {/* Header */}
    <div
      className="shrink-0 flex items-center justify-between border-b"
      style={{
        paddingLeft: px(5), paddingRight: px(5),
        paddingTop: px(3), paddingBottom: px(3),
        borderColor: `${colors.accent}30`,
      }}
    >
      <EditableText as="p" fieldId="f-brand" editable={editable} value={brandName ?? ""}
        onChange={v => onUpdate?.("brandName", v)} onFocusEl={onFocusEl} onBlurEl={onBlurEl}
        className="font-bold uppercase"
        style={{ fontSize: px(2), letterSpacing: "0.4em" }} />
      <EditableText as="p" fieldId="f-instagram" editable={editable} value={instagram ?? ""}
        onChange={v => onUpdate?.("instagram", v)} onFocusEl={onFocusEl} onBlurEl={onBlurEl}
        className="opacity-50"
        style={{ fontSize: px(2), letterSpacing: "0.05em" }} />
    </div>

    {/* Headline */}
    <div style={{ paddingLeft: px(5), paddingRight: px(5), paddingTop: px(4), paddingBottom: px(2) }} className="shrink-0">
      <EditableHeadlineLines value={headline} editable={editable} onFocusEl={onFocusEl} onBlurEl={onBlurEl}
        onChange={v => onUpdate?.("headline", v)}
        renderLine={(line, i, node) => (
          <p
            className="font-black leading-[0.85] tracking-tight"
            style={{
              fontSize: i === 0 ? px(11) : px(8),
              fontWeight: i === 0 ? 900 : 300,
              textTransform: i === 1 ? "uppercase" : "none",
              letterSpacing: i === 1 ? "0.15em" : "-0.02em",
              opacity: i === 1 ? 0.7 : 1,
              color: i === 1 ? colors.accent : colors.secondary,
            }}
          >
            {node}
          </p>
        )} />
    </div>

    {/* Product image */}
    <div className="flex-1 relative">
      <Image src={productImage} alt="Product" fill className="object-contain object-center" crossOrigin="anonymous" />
      <div className="absolute inset-0" style={{ background: `radial-gradient(ellipse at center bottom, ${colors.primary}60, transparent 70%)` }} />
    </div>

    {/* Bottom bar */}
    <div
      className="shrink-0 flex flex-col border-t"
      style={{
        paddingLeft: px(5), paddingRight: px(5),
        paddingTop: px(3.5), paddingBottom: px(3.5),
        gap: px(2),
        borderColor: `${colors.accent}30`,
        backgroundColor: `${colors.accent}08`,
      }}
    >
      <div className="flex items-end justify-between gap-3">
        <div className="min-w-0">
          {price !== undefined && price !== "" && (
            <EditableText as="p" fieldId="f-price" editable={editable} value={price}
              onChange={v => onUpdate?.("price", v)} onFocusEl={onFocusEl} onBlurEl={onBlurEl}
              className="font-black" style={{ fontSize: px(5), color: colors.accent }} />
          )}
          <EditableText as="p" fieldId="f-sub" editable={editable} value={subtext ?? ""}
            onChange={v => onUpdate?.("subtext", v)} onFocusEl={onFocusEl} onBlurEl={onBlurEl}
            className="opacity-50" style={{ fontSize: px(2), marginTop: px(0.5) }} />
        </div>
        <EditableText as="div" fieldId="f-cta" editable={editable} value={ctaText}
          onChange={v => onUpdate?.("ctaText", v)} onFocusEl={onFocusEl} onBlurEl={onBlurEl}
          className="font-black uppercase shrink-0"
          style={{
            ...ctaBaseStyle,
            paddingLeft: px(4), paddingRight: px(4),
            paddingTop: px(2), paddingBottom: px(2),
            fontSize: px(2.2), letterSpacing: "0.08em",
            backgroundColor: colors.accent, color: colors.primary,
          }} />
      </div>

      <FeatureList features={features} colors={colors} editable={editable}
        onUpdateFeature={onUpdateFeature} onAddFeature={onAddFeature} onRemoveFeature={onRemoveFeature}
        onFocusEl={onFocusEl} onBlurEl={onBlurEl}
        visible={featuresVisible} onRestoreSection={onRestoreFeatures} />

      <WhyChooseUsList items={whyChooseUs} colors={colors} editable={editable}
        onUpdate={onUpdateWhyChooseUs} onAdd={onAddWhyChooseUs} onRemove={onRemoveWhyChooseUs}
        onFocusEl={onFocusEl} onBlurEl={onBlurEl}
        visible={whyChooseUsVisible} onRestoreSection={onRestoreWhyChooseUs} />

      <ContactBar phone={phone} website={website} email={email}
        accentColor={colors.accent} textColor={colors.secondary} editable={editable}
        onUpdatePhone={v => onUpdate?.("phone", v)} onUpdateWebsite={v => onUpdate?.("website", v)} onUpdateEmail={v => onUpdate?.("email", v)}
        onFocusEl={onFocusEl} onBlurEl={onBlurEl}
        phoneVisible={phoneVisible} websiteVisible={websiteVisible} emailVisible={emailVisible}
        onRemovePhone={onRemovePhone} onRemoveWebsite={onRemoveWebsite} onRemoveEmail={onRemoveEmail}
        onRestorePhone={onRestorePhone} onRestoreWebsite={onRestoreWebsite} onRestoreEmail={onRestoreEmail} />
    </div>
  </div>
);

/* ─────────────────────────────────────────────────────────────────
   2. WHITE GOLD
───────────────────────────────────────────────────────────────── */
const VariantWhiteGold = ({
  headline, subtext, ctaText, productImage, brandName, website, price,
  colors, editable, onUpdate, onFocusEl, onBlurEl, features, phone, email, whyChooseUs,
  onUpdateFeature, onAddFeature, onRemoveFeature,
  onUpdateWhyChooseUs, onAddWhyChooseUs, onRemoveWhyChooseUs,
  featuresVisible, whyChooseUsVisible, phoneVisible, emailVisible, websiteVisible,
  onRestoreFeatures, onRestoreWhyChooseUs,
  onRemovePhone, onRemoveEmail, onRemoveWebsite,
  onRestorePhone, onRestoreEmail, onRestoreWebsite,
}: LuxuryProductProps) => {
  const lines = headline.split("\n");
  const eyebrow = lines[0] ?? "";
  const rest = lines.slice(1).join(" ") || lines[0] || "";

  return (
    <div
      className="w-full h-full relative overflow-hidden flex flex-col font-sans"
      style={{ backgroundColor: colors.primary, color: colors.secondary }}
    >
      {/* Accent rule */}
      <div
        className="absolute top-0 bottom-0 z-10"
        style={{ left: px(12), width: px(0.3), backgroundColor: colors.accent, opacity: 0.4 }}
      />

      {/* Rotated wordmark */}
      <div
        className="absolute top-1/2 -translate-y-1/2 -rotate-90 z-10"
        style={{ left: px(6) }}
      >
        <EditableText as="p" fieldId="f-brand" editable={editable} value={brandName ?? ""}
          onChange={v => onUpdate?.("brandName", v)} onFocusEl={onFocusEl} onBlurEl={onBlurEl}
          className="uppercase font-bold opacity-30 whitespace-nowrap"
          style={{ fontSize: px(2), letterSpacing: "0.5em" }} />
      </div>

      <div
        className="flex-1 flex flex-col"
        style={{
          paddingLeft: px(15), paddingRight: px(5),
          paddingTop: px(5), paddingBottom: px(4),
        }}
      >
        <div className="shrink-0" style={{ marginBottom: px(3) }}>
          <EditableText as="p" fieldId="f-headline-0" editable={editable} value={eyebrow}
            onChange={v => {
              const next = [v, ...lines.slice(1)];
              onUpdate?.("headline", next.join("\n"));
            }} onFocusEl={onFocusEl} onBlurEl={onBlurEl}
            className="uppercase opacity-40"
            style={{ fontSize: px(2), letterSpacing: "0.4em", marginBottom: px(2) }} />

          <h1 className="font-black leading-[0.85] tracking-tight" style={{ fontSize: px(11) }}>
            <EditableText as="span" fieldId="f-headline-1" editable={editable} value={rest}
              onChange={v => {
                const next = [lines[0] ?? "", v];
                onUpdate?.("headline", next.join("\n"));
              }} onFocusEl={onFocusEl} onBlurEl={onBlurEl} />
          </h1>

          <div style={{ width: px(8), height: px(0.3), marginTop: px(2), backgroundColor: colors.accent }} />
        </div>

        <div className="flex-1 relative">
          <Image src={productImage} alt="Product" fill className="object-contain object-center" crossOrigin="anonymous" />
        </div>

        {/* Bottom bar */}
        <div
          className="shrink-0 flex flex-col border-t"
          style={{
            paddingTop: px(3.5), paddingBottom: px(3.5),
            gap: px(2),
            borderColor: `${colors.accent}30`,
            backgroundColor: `${colors.accent}08`,
          }}
        >
          <div className="flex items-end justify-between gap-3">
            <div className="min-w-0">
              {price !== undefined && price !== "" && (
                <EditableText as="p" fieldId="f-price" editable={editable} value={price}
                  onChange={v => onUpdate?.("price", v)} onFocusEl={onFocusEl} onBlurEl={onBlurEl}
                  className="font-black" style={{ fontSize: px(5), color: colors.accent }} />
              )}
              <EditableText as="p" fieldId="f-sub" editable={editable} value={subtext ?? ""}
                onChange={v => onUpdate?.("subtext", v)} onFocusEl={onFocusEl} onBlurEl={onBlurEl}
                className="opacity-50" style={{ fontSize: px(2), marginTop: px(0.5) }} />
            </div>
            <EditableText as="div" fieldId="f-cta" editable={editable} value={ctaText}
              onChange={v => onUpdate?.("ctaText", v)} onFocusEl={onFocusEl} onBlurEl={onBlurEl}
              className="font-black uppercase shrink-0"
              style={{
                ...ctaBaseStyle,
                paddingLeft: px(4), paddingRight: px(4),
                paddingTop: px(2), paddingBottom: px(2),
                fontSize: px(2.2), letterSpacing: "0.08em",
                backgroundColor: colors.accent, color: colors.primary,
              }} />
          </div>

          <FeatureList features={features} colors={colors} editable={editable}
            onUpdateFeature={onUpdateFeature} onAddFeature={onAddFeature} onRemoveFeature={onRemoveFeature}
            onFocusEl={onFocusEl} onBlurEl={onBlurEl}
            visible={featuresVisible} onRestoreSection={onRestoreFeatures} />

          <WhyChooseUsList items={whyChooseUs} colors={colors} editable={editable}
            onUpdate={onUpdateWhyChooseUs} onAdd={onAddWhyChooseUs} onRemove={onRemoveWhyChooseUs}
            onFocusEl={onFocusEl} onBlurEl={onBlurEl}
            visible={whyChooseUsVisible} onRestoreSection={onRestoreWhyChooseUs} />

          <ContactBar phone={phone} website={website} email={email}
            accentColor={colors.accent} textColor={colors.secondary} editable={editable}
            onUpdatePhone={v => onUpdate?.("phone", v)} onUpdateWebsite={v => onUpdate?.("website", v)} onUpdateEmail={v => onUpdate?.("email", v)}
            onFocusEl={onFocusEl} onBlurEl={onBlurEl}
            phoneVisible={phoneVisible} websiteVisible={websiteVisible} emailVisible={emailVisible}
            onRemovePhone={onRemovePhone} onRemoveWebsite={onRemoveWebsite} onRemoveEmail={onRemoveEmail}
            onRestorePhone={onRestorePhone} onRestoreWebsite={onRestoreWebsite} onRestoreEmail={onRestoreEmail} />
        </div>
      </div>
    </div>
  );
};