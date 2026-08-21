"use client";

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

const px = (n: number) => `clamp(${n * 3}px, ${n}vw, ${n * 6}px)`;

function hexToRgba(hex: string, alpha: number) {
  if (!hex) return `rgba(0,0,0,${alpha})`;
  const value = hex.replace("#", "");
  if (value.length !== 6) return hex;
  const r = parseInt(value.slice(0, 2), 16);
  const g = parseInt(value.slice(2, 4), 16);
  const b = parseInt(value.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

/* ─────────────────────────────────────────────────────────────────
   ENTRY
   Only `colors` is truly required to render something coherent.
   Missing headline/productImage now degrade gracefully instead of
   blanking the entire template — a flyer with 4 of 5 sections
   filled in is useful; a blank gray box never is.
───────────────────────────────────────────────────────────────── */

export function LuxuryProductTemplate(props: LuxuryProductProps) {
  if (!props.colors) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400 text-sm">
        Loading template...
      </div>
    );
  }

  const { name = "Atelier Light" } = props;
  switch (name) {
    case "Noir Editorial": return <VariantNoirEditorial {...props} />;
    case "Atelier Light":  return <VariantAtelierLight {...props} />;
    default:               return <VariantAtelierLight {...props} />;
  }
}

/* ─────────────────────────────────────────────────────────────────
   IMAGE SAFETY WRAPPER
   Guarantees next/image `fill` always has a nonzero, positioned
   ancestor via aspect-ratio — never relies on flex-1 resolving
   correctly, which is what silently ate the product photo before.
───────────────────────────────────────────────────────────────── */

function SafeImage({
  src,
  aspectRatio,
  className,
  style,
  children,
}: {
  src?: string;
  aspectRatio: string;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}) {
  return (
    <div
      className={className}
      style={{ position: "relative", width: "100%", aspectRatio, ...style }}
    >
      {src ? (
        <Image src={src} alt="Product" fill className="object-contain object-center" crossOrigin="anonymous" />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center text-xs opacity-30">
          Product image
        </div>
      )}
      {children}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   1. NOIR EDITORIAL
   Full-bleed photo background, overlaid headline, frosted bottom panel.
   Deliberately not a text-column / image-card split.
═══════════════════════════════════════════════════════════════════════════ */

const VariantNoirEditorial = ({
  headline, subtext, ctaText, productImage, brandName, instagram, price,
  colors, editable, onUpdate, onFocusEl, onBlurEl, features, phone, email, whyChooseUs,
  onUpdateFeature, onAddFeature, onRemoveFeature,
  onUpdateWhyChooseUs, onAddWhyChooseUs, onRemoveWhyChooseUs,
  featuresVisible, whyChooseUsVisible, phoneVisible, emailVisible, websiteVisible,
  onRestoreFeatures, onRestoreWhyChooseUs,
  onRemovePhone, onRemoveEmail, onRemoveWebsite,
  onRestorePhone, onRestoreEmail, onRestoreWebsite,
  website,
}: LuxuryProductProps) => {
  const hasFeatures = Array.isArray(features) && features.length > 0;
  const hasWhyChooseUs = Array.isArray(whyChooseUs) && whyChooseUs.length > 0;

  return (
    <div
      className="w-full h-full relative overflow-hidden flex flex-col font-sans"
      style={{ backgroundColor: colors.primary, color: "#fff" }}
    >
      {/* Full-bleed background photo — fills the whole canvas, not a card */}
      <div className="absolute inset-0">
        {productImage ? (
          <Image src={productImage} alt="Product" fill className="object-cover object-center" crossOrigin="anonymous" />
        ) : (
          <div className="absolute inset-0" style={{ backgroundColor: colors.secondary }} />
        )}
        {/* Scrim: dark at top for header legibility, darker at bottom for the panel */}
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(180deg, ${hexToRgba("#000000", 0.55)} 0%, transparent 30%, transparent 55%, ${hexToRgba("#000000", 0.85)} 100%)`,
          }}
        />
      </div>

      {/* Header — brand + instagram overlaid on the photo */}
      <div
        className="relative z-10 shrink-0 flex items-center justify-between"
        style={{ padding: `${px(3)} ${px(5)} 0` }}
      >
        <EditableText as="p" fieldId="f-brand" editable={editable} value={brandName ?? ""}
          onChange={v => onUpdate?.("brandName", v)} onFocusEl={onFocusEl} onBlurEl={onBlurEl}
          className="font-bold uppercase" style={{ fontSize: px(2), letterSpacing: "0.4em" }} />
        <EditableText as="p" fieldId="f-instagram" editable={editable} value={instagram ?? ""}
          onChange={v => onUpdate?.("instagram", v)} onFocusEl={onFocusEl} onBlurEl={onBlurEl}
          className="opacity-60" style={{ fontSize: px(2) }} />
      </div>

      {/* Headline — sits directly on the photo, upper-left */}
      <div className="relative z-10 shrink-0" style={{ padding: `${px(3)} ${px(5)}` }}>
        <EditableHeadlineLines value={headline} editable={editable} onFocusEl={onFocusEl} onBlurEl={onBlurEl}
          onChange={v => onUpdate?.("headline", v)}
          renderLine={(line, i, node) => (
            <p
              className="font-black leading-[0.86] tracking-tight"
              style={{
                fontSize: i === 0 ? px(9) : px(6.2),
                textTransform: i === 1 ? "uppercase" : "none",
                letterSpacing: i === 1 ? "0.14em" : "-0.02em",
                opacity: i === 1 ? 0.75 : 1,
                color: i === 1 ? colors.accent : "#fff",
              }}
            >
              {node}
            </p>
          )} />
      </div>

      {/* Spacer pushes the frosted panel to the bottom */}
      <div className="flex-1" />

      {/* Frosted bottom panel — everything else lives here, off the photo */}
      <div
        className="relative z-10 shrink-0 flex flex-col"
        style={{
          padding: `${px(3.5)} ${px(5)}`,
          gap: px(2.2),
          backgroundColor: hexToRgba("#000000", 0.5),
          backdropFilter: "blur(10px)",
          borderTop: `1px solid ${hexToRgba("#ffffff", 0.14)}`,
        }}
      >
        <div className="flex items-end justify-between gap-3">
          <div className="min-w-0">
            {price !== undefined && price !== "" && (
              <EditableText as="p" fieldId="f-price" editable={editable} value={price}
                onChange={v => onUpdate?.("price", v)} onFocusEl={onFocusEl} onBlurEl={onBlurEl}
                className="font-black" style={{ fontSize: px(4.6), color: colors.accent }} />
            )}
            <EditableText as="p" fieldId="f-sub" editable={editable} value={subtext ?? ""}
              onChange={v => onUpdate?.("subtext", v)} onFocusEl={onFocusEl} onBlurEl={onBlurEl}
              className="opacity-70" style={{ fontSize: px(1.9), marginTop: px(0.4) }} />
          </div>

          <EditableText as="div" fieldId="f-cta" editable={editable} value={ctaText}
            onChange={v => onUpdate?.("ctaText", v)} onFocusEl={onFocusEl} onBlurEl={onBlurEl}
            className="font-black uppercase shrink-0"
            style={{
              minHeight: "44px", display: "inline-flex", alignItems: "center",
              paddingLeft: px(4), paddingRight: px(4),
              fontSize: px(2), letterSpacing: "0.08em",
              backgroundColor: colors.accent, color: colors.primary,
              borderRadius: "100px",
            }} />
        </div>

        {(hasFeatures || hasWhyChooseUs) && (
          <div className="grid grid-cols-2" style={{ gap: px(3), color: "#fff" }}>
            {hasFeatures && (
              <FeatureList
                features={features!.slice(0, 3)} colors={{ ...colors, secondary: "#fff" }} editable={editable}
                title="FEATURES" onUpdateTitle={(v) => onUpdate?.("featuresTitle", v)}
                onUpdateFeature={onUpdateFeature ?? (() => undefined)}
                onAddFeature={onAddFeature ?? (() => undefined)}
                onRemoveFeature={onRemoveFeature ?? (() => undefined)}
                onFocusEl={onFocusEl} onBlurEl={onBlurEl}
                visible={featuresVisible} onRestoreSection={onRestoreFeatures}
              />
            )}
            {hasWhyChooseUs && (
              <WhyChooseUsList
                items={whyChooseUs!.slice(0, 3)} colors={{ ...colors, secondary: "#fff" }} editable={editable}
                title="WHY CHOOSE US" onUpdateTitle={(v) => onUpdate?.("whyChooseUsTitle", v)}
                onUpdate={onUpdateWhyChooseUs ?? (() => undefined)}
                onAdd={onAddWhyChooseUs ?? (() => undefined)}
                onRemove={onRemoveWhyChooseUs ?? (() => undefined)}
                onFocusEl={onFocusEl} onBlurEl={onBlurEl}
                visible={whyChooseUsVisible} onRestoreSection={onRestoreWhyChooseUs}
              />
            )}
          </div>
        )}

        <div className="pt-1 border-t" style={{ borderColor: hexToRgba("#ffffff", 0.14), marginTop: px(0.3), paddingTop: px(1.8) }}>
          <ContactBar phone={phone} website={website} email={email}
            accentColor={colors.accent} textColor="#fff" editable={editable}
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

/* ═══════════════════════════════════════════════════════════════════════════
   2. ATELIER LIGHT
   Product on a raised pedestal card with a soft glow. Features and
   why-choose-us sit side-by-side under a vertical hairline, not
   stacked. CTA is an underlined text link, not a filled button.
═══════════════════════════════════════════════════════════════════════════ */

const VariantAtelierLight = ({
  headline, subtext, ctaText, productImage, brandName, price,
  colors, editable, onUpdate, onFocusEl, onBlurEl, features, phone, email, whyChooseUs,
  onUpdateFeature, onAddFeature, onRemoveFeature,
  onUpdateWhyChooseUs, onAddWhyChooseUs, onRemoveWhyChooseUs,
  featuresVisible, whyChooseUsVisible, phoneVisible, emailVisible, websiteVisible,
  onRestoreFeatures, onRestoreWhyChooseUs,
  onRemovePhone, onRemoveEmail, onRemoveWebsite,
  onRestorePhone, onRestoreEmail, onRestoreWebsite,
  website,
}: LuxuryProductProps) => {
  const hasFeatures = Array.isArray(features) && features.length > 0;
  const hasWhyChooseUs = Array.isArray(whyChooseUs) && whyChooseUs.length > 0;

  return (
    <div
      className="w-full h-full relative overflow-hidden flex flex-col items-center font-sans"
      style={{ backgroundColor: colors.primary, color: colors.secondary }}
    >
      {/* Brand — small, centered, quiet */}
      <div className="shrink-0 text-center" style={{ paddingTop: px(4) }}>
        <EditableText as="p" fieldId="f-brand" editable={editable} value={brandName ?? ""}
          onChange={v => onUpdate?.("brandName", v)} onFocusEl={onFocusEl} onBlurEl={onBlurEl}
          className="uppercase font-bold opacity-40"
          style={{ fontSize: px(1.8), letterSpacing: "0.5em" }} />
      </div>

      {/* Pedestal — product raised on a soft card with radial glow */}
      <div className="relative shrink-0" style={{ width: "62%", marginTop: px(3) }}>
        <div
          className="absolute"
          style={{
            inset: `-${px(4)}`,
            background: `radial-gradient(ellipse at center, ${hexToRgba(colors.accent, 0.14)} 0%, transparent 70%)`,
          }}
        />
        <SafeImage
          src={productImage}
          aspectRatio="1 / 1"
          className="relative rounded-2xl overflow-hidden"
          style={{
            backgroundColor: hexToRgba(colors.accent, 0.05),
            boxShadow: `0 ${px(2)} ${px(4)} ${hexToRgba("#000000", 0.12)}`,
          }}
        />
      </div>

      {/* Headline — below the pedestal, centered */}
      <div className="shrink-0 text-center" style={{ marginTop: px(3), padding: `0 ${px(5)}` }}>
        <EditableHeadlineLines value={headline} editable={editable} onFocusEl={onFocusEl} onBlurEl={onBlurEl}
          onChange={v => onUpdate?.("headline", v)}
          renderLine={(line, i, node) => (
            <p
              className="font-black leading-[0.92] tracking-tight"
              style={{
                fontSize: i === 0 ? px(6) : px(4.4),
                color: i === 1 ? colors.accent : colors.secondary,
                opacity: i === 1 ? 0.85 : 1,
              }}
            >
              {node}
            </p>
          )} />

        {subtext !== undefined && (
          <EditableText as="p" fieldId="f-sub" editable={editable} value={subtext}
            onChange={v => onUpdate?.("subtext", v)} onFocusEl={onFocusEl} onBlurEl={onBlurEl}
            className="opacity-55 mx-auto" style={{ fontSize: px(1.9), marginTop: px(1.2), maxWidth: "36ch" }} />
        )}
      </div>

      <div className="flex-1" />

      {/* Features | Why choose us — side by side, split by a hairline */}
      {(hasFeatures || hasWhyChooseUs) && (
        <div
          className="shrink-0 grid grid-cols-2 text-left w-full"
          style={{
            padding: `${px(3)} ${px(6)}`,
            gap: px(4),
            borderTop: `1px solid ${hexToRgba(colors.accent, 0.18)}`,
          }}
        >
          <div style={{ borderRight: `1px solid ${hexToRgba(colors.accent, 0.18)}`, paddingRight: px(4) }}>
            {hasFeatures && (
              <FeatureList
                features={features!.slice(0, 3)} colors={colors} editable={editable}
                title="FEATURES" onUpdateTitle={(v) => onUpdate?.("featuresTitle", v)}
                onUpdateFeature={onUpdateFeature ?? (() => undefined)}
                onAddFeature={onAddFeature ?? (() => undefined)}
                onRemoveFeature={onRemoveFeature ?? (() => undefined)}
                onFocusEl={onFocusEl} onBlurEl={onBlurEl}
                visible={featuresVisible} onRestoreSection={onRestoreFeatures}
              />
            )}
          </div>
          <div>
            {hasWhyChooseUs && (
              <WhyChooseUsList
                items={whyChooseUs!.slice(0, 3)} colors={colors} editable={editable}
                title="WHY CHOOSE US" onUpdateTitle={(v) => onUpdate?.("whyChooseUsTitle", v)}
                onUpdate={onUpdateWhyChooseUs ?? (() => undefined)}
                onAdd={onAddWhyChooseUs ?? (() => undefined)}
                onRemove={onRemoveWhyChooseUs ?? (() => undefined)}
                onFocusEl={onFocusEl} onBlurEl={onBlurEl}
                visible={whyChooseUsVisible} onRestoreSection={onRestoreWhyChooseUs}
              />
            )}
          </div>
        </div>
      )}

      {/* Price + underlined text-link CTA — quiet luxury register, not a button */}
      <div
        className="shrink-0 flex items-center justify-center"
        style={{ gap: px(3), padding: `${px(2.5)} ${px(5)} 0` }}
      >
        {price !== undefined && price !== "" && (
          <EditableText as="span" fieldId="f-price" editable={editable} value={price}
            onChange={v => onUpdate?.("price", v)} onFocusEl={onFocusEl} onBlurEl={onBlurEl}
            className="font-black" style={{ fontSize: px(3.4), color: colors.accent }} />
        )}
        <EditableText as="span" fieldId="f-cta" editable={editable} value={ctaText}
          onChange={v => onUpdate?.("ctaText", v)} onFocusEl={onFocusEl} onBlurEl={onBlurEl}
          className="font-semibold uppercase"
          style={{
            fontSize: px(1.9), letterSpacing: "0.1em",
            color: colors.secondary,
            textDecoration: "underline",
            textUnderlineOffset: "4px",
            textDecorationColor: colors.accent,
          }} />
      </div>

      {/* Contact — icon-only, minimal, centered footer */}
      <div className="shrink-0 w-full" style={{ padding: `${px(2.5)} ${px(5)} ${px(4)}` }}>
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
};