"use client";

import React from "react";

import { EditableText } from "@/components/EditableText";
import { EditableHeadlineLines } from "@/components/Editableheadlinelines";

import { FeatureList, ContactBar, WhyChooseUsList } from "./FlyerContentBlocks";

/* ═══════════════════════════════════════════════════════════════════════════
   TYPES
═══════════════════════════════════════════════════════════════════════════ */

export interface LuxuryProductProps {
  name?: string;
  headline: string;
  subtext?: string;
  subheadline?: string;
  ctaText: string;
  productImage: string;

  imageVersion?: string | number;

  /** Part of the shared template contract. Currently unused by this file. */
  logo?: string;

  brandName?: string;
  website?: string;
  phone?: string;
  email?: string;
  features?: string[];

  /** Part of the shared template contract. Currently unused by this file. */
  extraText?: string;

  /** Used by VariantNoirEditorial. Part of the shared contract. */
  instagram?: string;

  /** Part of the shared template contract. Currently unused by this file. */
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

/* ─────────────────────────────────────────────────────────────────
   SPACING SCALE
───────────────────────────────────────────────────────────────── */

const cq = (n: number) => `calc(var(--ci) * ${n})`;

const space = {
  xs: cq(1),
  sm: cq(1.6),
  md: cq(2.4),
  lg: cq(3.6),
};

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
   CACHE BUSTING
   Appends `?v=<version>` to a URL so the browser refetches it when
   the underlying bytes change. Data URLs and blob URLs are skipped.
───────────────────────────────────────────────────────────────── */

function withCacheBust(url?: string, version?: string | number) {
  if (!url || !version) return url;
  if (url.startsWith("data:") || url.startsWith("blob:")) return url;
  const separator = url.includes("?") ? "&" : "?";
  return `${url}${separator}v=${encodeURIComponent(String(version))}`;
}

/* ─────────────────────────────────────────────────────────────────
   ENTRY
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
    case "Noir Editorial":
      return <VariantNoirEditorial {...props} />;
    case "Atelier Light":
      return <VariantAtelierLight {...props} />;
    default:
      return <VariantAtelierLight {...props} />;
  }
}

/* ─────────────────────────────────────────────────────────────────
   IMAGE WRAPPER — background-image div

   html2canvas does NOT reliably render `object-fit: contain` or
   `cover` on <img> elements — it falls back to the image's natural
   pixel size, which is why the product looked much larger in the
   exported PNG than in the editor.

   `background-size: contain|cover` on a plain <div> is fully
   supported, so we route every product image through here.

   No `crossOrigin` on the source URL — html2canvas handles CORS on
   its own clone with `useCORS: true`.
───────────────────────────────────────────────────────────────── */

function SafeImage({
  src,
  version,
  aspectRatio,
  fit = "contain",
  className,
  style,
}: {
  src?: string;
  version?: string | number;
  aspectRatio: string;
  fit?: "contain" | "cover";
  className?: string;
  style?: React.CSSProperties;
}) {
  const bustedSrc = withCacheBust(src, version);

  return (
    <div
      className={className}
      style={{ position: "relative", width: "100%", aspectRatio, ...style }}
    >
      {bustedSrc ? (
        <div
          role="img"
          aria-label="Product"
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: `url(${bustedSrc})`,
            backgroundSize: fit,
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center text-xs opacity-30">
          Product image
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────
   FOOTER PANEL
───────────────────────────────────────────────────────────────── */

function ContactFooter({
  colors,
  textColor,
  ...contactProps
}: Omit<
  React.ComponentProps<typeof ContactBar>,
  "accentColor" | "textColor"
> & {
  colors: LuxuryProductProps["colors"];
  textColor: string;
}) {
  return (
    <div
      className="w-full shrink-0"
      style={{
        marginTop: space.md,
        padding: `${space.sm} ${space.md}`,
        borderRadius: cq(1.2),
        backgroundColor: hexToRgba(colors.accent, 0.06),
        border: `1px solid ${hexToRgba(colors.accent, 0.16)}`,
      }}
    >
      <ContactBar
        accentColor={colors.accent}
        textColor={textColor}
        {...contactProps}
      />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   1. NOIR EDITORIAL
═══════════════════════════════════════════════════════════════════════════ */

const VariantNoirEditorial = ({
  headline,
  subtext,
  subheadline,
  ctaText,
  productImage,
  imageVersion,
  brandName,
  instagram,
  price,
  colors,
  editable,
  onUpdate,
  onFocusEl,
  onBlurEl,
  features,
  phone,
  email,
  whyChooseUs,
  onUpdateFeature,
  onAddFeature,
  onRemoveFeature,
  onUpdateWhyChooseUs,
  onAddWhyChooseUs,
  onRemoveWhyChooseUs,
  featuresVisible,
  whyChooseUsVisible,
  phoneVisible,
  emailVisible,
  websiteVisible,
  onRestoreFeatures,
  onRestoreWhyChooseUs,
  onRemovePhone,
  onRemoveEmail,
  onRemoveWebsite,
  onRestorePhone,
  onRestoreEmail,
  onRestoreWebsite,
  website,
}: LuxuryProductProps) => {
  const subCopy = subtext ?? subheadline;

  const hasFeatures = Array.isArray(features) && features.length > 0;
  const hasWhyChooseUs = Array.isArray(whyChooseUs) && whyChooseUs.length > 0;
  const bustedBg = withCacheBust(productImage, imageVersion);

  return (
    <div
      className="@container w-full h-full relative overflow-hidden flex flex-col font-sans aspect-[4/5]"
      style={{ backgroundColor: colors.primary, color: "#fff" }}
    >
      {/* Full-bleed product background — background-image div so
          html2canvas renders background-size: cover correctly. */}
      <div className="absolute inset-0">
        {bustedBg ? (
          <div
            role="img"
            aria-label="Product background"
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage: `url(${bustedBg})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
            }}
          />
        ) : (
          <div
            className="absolute inset-0"
            style={{ backgroundColor: colors.secondary }}
          />
        )}

        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(180deg, ${hexToRgba(
              "#000000",
              0.55
            )} 0%, transparent 30%, transparent 52%, ${hexToRgba(
              "#000000",
              0.85
            )} 100%)`,
          }}
        />
      </div>

      {/* Brand + instagram top row */}
      <div
        className="relative z-10 shrink-0 flex items-center justify-between"
        style={{ padding: `${space.md} ${space.lg} 0` }}
      >
        <EditableText
          as="p"
          fieldId="f-brand"
          editable={editable}
          value={brandName ?? ""}
          onChange={(v) => onUpdate?.("brandName", v)}
          onFocusEl={onFocusEl}
          onBlurEl={onBlurEl}
          className="font-bold uppercase"
          style={{ fontSize: cq(2), letterSpacing: "0.4em" }}
        />
        <EditableText
          as="p"
          fieldId="f-instagram"
          editable={editable}
          value={instagram ?? ""}
          onChange={(v) => onUpdate?.("instagram", v)}
          onFocusEl={onFocusEl}
          onBlurEl={onBlurEl}
          className="opacity-60"
          style={{ fontSize: cq(2) }}
        />
      </div>

      {/* Headline */}
      <div
        className="relative z-10 shrink-0"
        style={{ padding: `${space.md} ${space.lg}` }}
      >
        <EditableHeadlineLines
          value={headline}
          editable={editable}
          onFocusEl={onFocusEl}
          onBlurEl={onBlurEl}
          onChange={(v) => onUpdate?.("headline", v)}
          renderLine={(_line, i, node) => (
            <p
              key={i}
              className="font-black leading-[0.86] tracking-tight"
              style={{
                fontSize: i === 0 ? cq(7.6) : cq(5.2),
                textTransform: i === 1 ? "uppercase" : "none",
                letterSpacing: i === 1 ? "0.14em" : "-0.02em",
                opacity: i === 1 ? 0.75 : 1,
                color: i === 1 ? colors.accent : "#fff",
              }}
            >
              {node}
            </p>
          )}
        />
      </div>

      <div className="flex-1 min-h-0" />

      {/* Bottom info panel with glassy background */}
      <div
        className="relative z-10 shrink-0 flex flex-col"
        style={{
          padding: `${space.md} ${space.lg}`,
          gap: space.sm,
          backgroundColor: hexToRgba("#000000", 0.5),
          backdropFilter: "blur(10px)",
          borderTop: `1px solid ${hexToRgba("#ffffff", 0.14)}`,
        }}
      >
        {/* Price + subtext + CTA */}
        <div className="flex items-end justify-between gap-3">
          <div className="min-w-0">
            {price !== undefined && price !== "" && (
              <EditableText
                as="p"
                fieldId="f-price"
                editable={editable}
                value={price}
                onChange={(v) => onUpdate?.("price", v)}
                onFocusEl={onFocusEl}
                onBlurEl={onBlurEl}
                className="font-black"
                style={{ fontSize: cq(4), color: colors.accent }}
              />
            )}
            <EditableText
              as="p"
              fieldId="f-sub"
              editable={editable}
              value={subCopy ?? ""}
              onChange={(v) => onUpdate?.("subtext", v)}
              onFocusEl={onFocusEl}
              onBlurEl={onBlurEl}
              className="opacity-70"
              style={{ fontSize: cq(1.8), marginTop: space.xs }}
            />
          </div>

          <EditableText
            as="div"
            fieldId="f-cta"
            editable={editable}
            value={ctaText}
            onChange={(v) => onUpdate?.("ctaText", v)}
            onFocusEl={onFocusEl}
            onBlurEl={onBlurEl}
            className="font-black uppercase shrink-0"
            style={{
              minHeight: "44px",
              display: "inline-flex",
              alignItems: "center",
              paddingLeft: cq(3.6),
              paddingRight: cq(3.6),
              fontSize: cq(1.9),
              letterSpacing: "0.08em",
              backgroundColor: colors.accent,
              color: colors.primary,
              borderRadius: "100px",
            }}
          />
        </div>

        {/* Feature / why-us grid */}
        {(hasFeatures || hasWhyChooseUs) && (
          <div className="grid grid-cols-2" style={{ gap: space.md, color: "#fff" }}>
            {hasFeatures && (
              <FeatureList
                features={features!.slice(0, 3)}
                colors={{ ...colors, secondary: "#fff" }}
                editable={editable}
                title="FEATURES"
                onUpdateTitle={(v) => onUpdate?.("featuresTitle", v)}
                onUpdateFeature={onUpdateFeature ?? (() => undefined)}
                onAddFeature={onAddFeature ?? (() => undefined)}
                onRemoveFeature={onRemoveFeature ?? (() => undefined)}
                onFocusEl={onFocusEl}
                onBlurEl={onBlurEl}
                visible={featuresVisible}
                onRestoreSection={onRestoreFeatures}
              />
            )}
            {hasWhyChooseUs && (
              <WhyChooseUsList
                items={whyChooseUs!.slice(0, 3)}
                colors={{ ...colors, secondary: "#fff" }}
                editable={editable}
                title="WHY CHOOSE US"
                onUpdateTitle={(v) => onUpdate?.("whyChooseUsTitle", v)}
                onUpdate={onUpdateWhyChooseUs ?? (() => undefined)}
                onAdd={onAddWhyChooseUs ?? (() => undefined)}
                onRemove={onRemoveWhyChooseUs ?? (() => undefined)}
                onFocusEl={onFocusEl}
                onBlurEl={onBlurEl}
                visible={whyChooseUsVisible}
                onRestoreSection={onRestoreWhyChooseUs}
              />
            )}
          </div>
        )}

        {/* Contact bar */}
        <ContactFooter
          colors={colors}
          textColor="#fff"
          phone={phone}
          website={website}
          email={email}
          editable={editable}
          onUpdatePhone={(v) => onUpdate?.("phone", v)}
          onUpdateWebsite={(v) => onUpdate?.("website", v)}
          onUpdateEmail={(v) => onUpdate?.("email", v)}
          onFocusEl={onFocusEl}
          onBlurEl={onBlurEl}
          phoneVisible={phoneVisible}
          websiteVisible={websiteVisible}
          emailVisible={emailVisible}
          onRemovePhone={onRemovePhone}
          onRemoveWebsite={onRemoveWebsite}
          onRemoveEmail={onRemoveEmail}
          onRestorePhone={onRestorePhone}
          onRestoreWebsite={onRestoreWebsite}
          onRestoreEmail={onRestoreEmail}
        />
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════════════════
   2. ATELIER LIGHT
═══════════════════════════════════════════════════════════════════════════ */

const VariantAtelierLight = ({
  headline,
  subtext,
  subheadline,
  ctaText,
  productImage,
  imageVersion,
  brandName,
  price,
  colors,
  editable,
  onUpdate,
  onFocusEl,
  onBlurEl,
  features,
  phone,
  email,
  whyChooseUs,
  onUpdateFeature,
  onAddFeature,
  onRemoveFeature,
  onUpdateWhyChooseUs,
  onAddWhyChooseUs,
  onRemoveWhyChooseUs,
  featuresVisible,
  whyChooseUsVisible,
  phoneVisible,
  emailVisible,
  websiteVisible,
  onRestoreFeatures,
  onRestoreWhyChooseUs,
  onRemovePhone,
  onRemoveEmail,
  onRemoveWebsite,
  onRestorePhone,
  onRestoreEmail,
  onRestoreWebsite,
  website,
}: LuxuryProductProps) => {
  const subCopy = subtext ?? subheadline;

  const hasFeatures = Array.isArray(features) && features.length > 0;
  const hasWhyChooseUs = Array.isArray(whyChooseUs) && whyChooseUs.length > 0;

  return (
    <div
      className="@container w-full h-full relative overflow-hidden flex flex-col items-center font-sans aspect-[4/5]"
      style={{ backgroundColor: colors.primary, color: colors.secondary }}
    >
      {/* Brand — top centre */}
      <div className="shrink-0 text-center" style={{ paddingTop: space.lg }}>
        <EditableText
          as="p"
          fieldId="f-brand"
          editable={editable}
          value={brandName ?? ""}
          onChange={(v) => onUpdate?.("brandName", v)}
          onFocusEl={onFocusEl}
          onBlurEl={onBlurEl}
          className="uppercase font-bold opacity-40"
          style={{ fontSize: cq(1.7), letterSpacing: "0.5em" }}
        />
      </div>

      {/* Product image with soft radial accent behind it */}
      <div
        className="relative shrink-0"
        style={{ width: "46%", marginTop: space.md }}
      >
        <div
          className="absolute"
          style={{
            inset: `-${space.sm}`,
            background: `radial-gradient(ellipse at center, ${hexToRgba(
              colors.accent,
              0.14
            )} 0%, transparent 70%)`,
          }}
        />
        <SafeImage
          src={productImage}
          version={imageVersion}
          aspectRatio="1 / 1"
          fit="contain"
          className="relative rounded-2xl overflow-hidden"
          style={{
            backgroundColor: hexToRgba(colors.accent, 0.05),
            boxShadow: `0 ${cq(1.6)} ${cq(3)} ${hexToRgba("#000000", 0.12)}`,
          }}
        />
      </div>

      {/* Headline + subtext */}
      <div
        className="shrink-0 text-center"
        style={{ marginTop: space.md, padding: `0 ${space.lg}` }}
      >
        <EditableHeadlineLines
          value={headline}
          editable={editable}
          onFocusEl={onFocusEl}
          onBlurEl={onBlurEl}
          onChange={(v) => onUpdate?.("headline", v)}
          renderLine={(_line, i, node) => (
            <p
              key={i}
              className="font-black leading-[0.92] tracking-tight"
              style={{
                fontSize: i === 0 ? cq(5) : cq(3.6),
                color: i === 1 ? colors.accent : colors.secondary,
                opacity: i === 1 ? 0.85 : 1,
              }}
            >
              {node}
            </p>
          )}
        />

        {subCopy !== undefined && subCopy !== "" && (
          <EditableText
            as="p"
            fieldId="f-sub"
            editable={editable}
            value={subCopy}
            onChange={(v) => onUpdate?.("subtext", v)}
            onFocusEl={onFocusEl}
            onBlurEl={onBlurEl}
            className="opacity-55 mx-auto"
            style={{
              fontSize: cq(1.7),
              marginTop: space.sm,
              maxWidth: "34ch",
            }}
          />
        )}
      </div>

      {/* Flexible gap */}
      <div className="flex-1 min-h-0" />

      {/* Feature / why-us two-column band */}
      {(hasFeatures || hasWhyChooseUs) && (
        <div
          className="shrink-0 grid grid-cols-2 text-left w-full"
          style={{
            padding: `${space.md} ${space.lg}`,
            gap: space.md,
            borderTop: `1px solid ${hexToRgba(colors.accent, 0.18)}`,
          }}
        >
          <div
            style={{
              borderRight: `1px solid ${hexToRgba(colors.accent, 0.18)}`,
              paddingRight: space.md,
            }}
          >
            {hasFeatures && (
              <FeatureList
                features={features!.slice(0, 3)}
                colors={colors}
                editable={editable}
                title="FEATURES"
                onUpdateTitle={(v) => onUpdate?.("featuresTitle", v)}
                onUpdateFeature={onUpdateFeature ?? (() => undefined)}
                onAddFeature={onAddFeature ?? (() => undefined)}
                onRemoveFeature={onRemoveFeature ?? (() => undefined)}
                onFocusEl={onFocusEl}
                onBlurEl={onBlurEl}
                visible={featuresVisible}
                onRestoreSection={onRestoreFeatures}
              />
            )}
          </div>
          <div>
            {hasWhyChooseUs && (
              <WhyChooseUsList
                items={whyChooseUs!.slice(0, 3)}
                colors={colors}
                editable={editable}
                title="WHY CHOOSE US"
                onUpdateTitle={(v) => onUpdate?.("whyChooseUsTitle", v)}
                onUpdate={onUpdateWhyChooseUs ?? (() => undefined)}
                onAdd={onAddWhyChooseUs ?? (() => undefined)}
                onRemove={onRemoveWhyChooseUs ?? (() => undefined)}
                onFocusEl={onFocusEl}
                onBlurEl={onBlurEl}
                visible={whyChooseUsVisible}
                onRestoreSection={onRestoreWhyChooseUs}
              />
            )}
          </div>
        </div>
      )}

      {/* Price + CTA row */}
      <div
        className="shrink-0 flex items-center justify-center"
        style={{ gap: space.md, padding: `${space.sm} ${space.lg} 0` }}
      >
        {price !== undefined && price !== "" && (
          <EditableText
            as="span"
            fieldId="f-price"
            editable={editable}
            value={price}
            onChange={(v) => onUpdate?.("price", v)}
            onFocusEl={onFocusEl}
            onBlurEl={onBlurEl}
            className="font-black"
            style={{ fontSize: cq(3), color: colors.accent }}
          />
        )}
        <EditableText
          as="span"
          fieldId="f-cta"
          editable={editable}
          value={ctaText}
          onChange={(v) => onUpdate?.("ctaText", v)}
          onFocusEl={onFocusEl}
          onBlurEl={onBlurEl}
          className="font-semibold uppercase"
          style={{
            fontSize: cq(1.7),
            letterSpacing: "0.1em",
            color: colors.secondary,
            textDecoration: "underline",
            textUnderlineOffset: "4px",
            textDecorationColor: colors.accent,
          }}
        />
      </div>

      {/* Contact bar */}
      <div
        className="shrink-0 w-full"
        style={{ padding: `${space.sm} ${space.lg} ${space.lg}` }}
      >
        <ContactFooter
          colors={colors}
          textColor={colors.secondary}
          phone={phone}
          website={website}
          email={email}
          editable={editable}
          onUpdatePhone={(v) => onUpdate?.("phone", v)}
          onUpdateWebsite={(v) => onUpdate?.("website", v)}
          onUpdateEmail={(v) => onUpdate?.("email", v)}
          onFocusEl={onFocusEl}
          onBlurEl={onBlurEl}
          phoneVisible={phoneVisible}
          websiteVisible={websiteVisible}
          emailVisible={emailVisible}
          onRemovePhone={onRemovePhone}
          onRemoveWebsite={onRemoveWebsite}
          onRemoveEmail={onRemoveEmail}
          onRestorePhone={onRestorePhone}
          onRestoreWebsite={onRestoreWebsite}
          onRestoreEmail={onRestoreEmail}
        />
      </div>
    </div>
  );
};