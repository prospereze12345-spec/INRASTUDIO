"use client";

import { EditableText } from "@/components/EditableText";

import React from "react";
import Image from "next/image";
import { FeatureList, ContactBar, WhyChooseUsList } from "./FlyerContentBlocks";
import { EditableHeadlineLines } from "@/components/Editableheadlinelines";

/* ═══════════════════════════════════════════════════════════════════════════
   TYPES
═══════════════════════════════════════════════════════════════════════════ */

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
  features?: string[];
  phone?: string;
  email?: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
  };
  editable?: boolean;
  onUpdate?: (field: string, value: string) => void;
  onUpdateFeature?: (index: number, value: string) => void;
  onAddFeature?: () => void;
  onRemoveFeature?: (index: number) => void;
  onUpdatePhone?: (value: string) => void;
  onUpdateWebsite?: (value: string) => void;
  onUpdateEmail?: (value: string) => void;
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
}

/* ─────────────────────────────────────────────────────────────────
   CANVAS SCALE
   Same mechanism as PremiumBrandTemplate: `--ci` is a real numeric
   CSS custom property (set by the editor to exportWidth / 100),
   not the `cqi` container-query unit. `cqi` isn't reliably resolved
   by html-to-image when it serializes the DOM for export, so every
   size in this file must route through this helper instead of using
   raw `cqi`/`vw` values.
───────────────────────────────────────────────────────────────── */

const cq = (n: number) => `calc(var(--ci) * ${n})`;

/* ─────────────────────────────────────────────────────────────────
   HELPERS
───────────────────────────────────────────────────────────────── */

function hexToRgba(hex: string, alpha: number) {
  if (!hex) return `rgba(0,0,0,${alpha})`;
  const value = hex.replace("#", "");
  if (value.length !== 6) return hex;
  const r = parseInt(value.slice(0, 2), 16);
  const g = parseInt(value.slice(2, 4), 16);
  const b = parseInt(value.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export function SleekFlyerTemplate(props: SleekFlyerProps) {
  const { name = "Mono Split" } = props;

  switch (name) {
    case "Mono Split":
      return <VariantMonoSplit {...props} />;
    case "Kōan":
      return <VariantKoan {...props} />;
    default:
      return <VariantMonoSplit {...props} />;
  }
}

/* ═══════════════════════════════════════════════════════════════════════════
   1. MONO SPLIT
═══════════════════════════════════════════════════════════════════════════ */

const VariantMonoSplit = ({
  headline,
  subheadline,
  ctaText,
  productImage,
  brandName,
  price,
  features,
  phone,
  email,
  colors,
  editable,
  onUpdate,
  onUpdateFeature,
  onAddFeature,
  onRemoveFeature,
  whyChooseUs,
  onUpdateWhyChooseUs,
  onAddWhyChooseUs,
  onRemoveWhyChooseUs,
  onUpdateWebsite,
  onUpdateEmail,
  onUpdatePhone,
  website,
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
  onFocusEl,
  onBlurEl,
}: SleekFlyerProps) => {
  const hasFeatures = Array.isArray(features) && features.length > 0;
  const hasWhyChooseUs = Array.isArray(whyChooseUs) && whyChooseUs.length > 0;

  return (
    <div
      className="@container w-full h-full relative overflow-hidden flex flex-row font-sans"
      style={{ backgroundColor: colors.primary, color: colors.secondary }}
    >
      {/* ── Product image ─────────────────────────────────────────────── */}

      <div className="relative overflow-hidden" style={{ width: "55%", height: "100%" }}>
        <Image
          src={productImage}
          alt="Product"
          fill
          unoptimized
          crossOrigin="anonymous"
          className="object-cover object-center"
        />

        {/* Fade into the content panel */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `linear-gradient(to right, transparent 60%, ${hexToRgba(colors.primary, 0.8)} 100%)`,
          }}
        />

        {/* Grounding vignette so the photo reads as a designed shot, not a raw crop */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            boxShadow: `inset 0 0 ${cq(6)} ${hexToRgba(colors.primary, 0.18)}`,
          }}
        />
      </div>

      {/* ── Content ───────────────────────────────────────────────────── */}

      <div
        className="flex flex-col justify-between relative z-10"
        style={{
          width: "45%",
          height: "100%",
          backgroundColor: colors.primary,
          padding: `${cq(7)} ${cq(6)} ${cq(7)} ${cq(5)}`,
        }}
      >
        {/* Brand */}
        <div className="flex items-center justify-between">
          <EditableText
            as="span"
            fieldId="f-brand"
            editable={editable}
            value={brandName ?? ""}
            onChange={(value) => onUpdate?.("brandName", value)}
            onFocusEl={onFocusEl}
            onBlurEl={onBlurEl}
            style={{
              fontSize: cq(2.2),
              fontWeight: 700,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              opacity: 0.45,
              color: colors.secondary,
            }}
          />

          <div
            style={{
              width: cq(1.8),
              height: cq(1.8),
              borderRadius: "50%",
              backgroundColor: colors.accent,
            }}
          />
        </div>

        {/* Main content */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            gap: cq(3),
            overflow: "hidden",
          }}
        >
          <div style={{ width: cq(8), height: cq(0.3), backgroundColor: colors.accent, marginBottom: cq(1) }} />

          <h1
            style={{
              fontSize: `clamp(24px, ${cq(11)}, 96px)`,
              fontWeight: 800,
              lineHeight: 0.92,
              letterSpacing: "-0.03em",
              color: colors.secondary,
              margin: 0,
              fontFamily: "-apple-system, 'SF Pro Display', 'Helvetica Neue', sans-serif",
            }}
          >
            <EditableHeadlineLines
              value={headline}
              editable={editable}
              onFocusEl={onFocusEl}
              onBlurEl={onBlurEl}
              onChange={(value) => onUpdate?.("headline", value)}
              renderLine={(line, index, node) => (
                <span key={index} style={{ display: "block" }}>
                  {node}
                </span>
              )}
            />
          </h1>

          {subheadline !== undefined && (
            <EditableText
              as="p"
              fieldId="f-sub"
              editable={editable}
              value={subheadline}
              onChange={(value) => onUpdate?.("subtext", value)}
              onFocusEl={onFocusEl}
              onBlurEl={onBlurEl}
              style={{
                fontSize: cq(2.6),
                lineHeight: 1.5,
                color: colors.secondary,
                opacity: 0.55,
                margin: 0,
                maxWidth: "28ch",
                fontWeight: 400,
              }}
            />
          )}

          {hasFeatures && (
            <FeatureList
              features={features!.slice(0, 3)}
              colors={colors}
              editable={editable}
              title="FEATURES"
              onUpdateTitle={(value) => onUpdate?.("featuresTitle", value)}
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
              colors={colors}
              editable={editable}
              title="WHY CHOOSE US"
              onUpdateTitle={(value) => onUpdate?.("whyChooseUsTitle", value)}
              onUpdate={onUpdateWhyChooseUs ?? (() => undefined)}
              onAdd={onAddWhyChooseUs ?? (() => undefined)}
              onRemove={onRemoveWhyChooseUs ?? (() => undefined)}
              onFocusEl={onFocusEl}
              onBlurEl={onBlurEl}
              visible={whyChooseUsVisible}
              onRestoreSection={onRestoreWhyChooseUs}
            />
          )}

          {price !== undefined && price !== "" && (
            <div style={{ display: "inline-flex", alignItems: "baseline", gap: cq(0.8), marginTop: cq(1) }}>
              <EditableText
                as="span"
                fieldId="f-price"
                editable={editable}
                value={price}
                onChange={(value) => onUpdate?.("price", value)}
                onFocusEl={onFocusEl}
                onBlurEl={onBlurEl}
                style={{
                  fontSize: cq(7),
                  fontWeight: 700,
                  letterSpacing: "-0.04em",
                  color: colors.secondary,
                }}
              />
            </div>
          )}
        </div>

        {/* Bottom actions */}
        <div style={{ display: "flex", flexDirection: "column", gap: cq(2.5) }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: cq(2),
              backgroundColor: colors.secondary,
              color: colors.primary,
              padding: `${cq(2.2)} ${cq(4)}`,
              borderRadius: "100px",
              fontSize: cq(2.4),
              fontWeight: 600,
              letterSpacing: "0.02em",
              width: "fit-content",
              minHeight: "44px",
            }}
          >
            <EditableText
              as="span"
              fieldId="f-cta"
              editable={editable}
              value={ctaText}
              onChange={(value) => onUpdate?.("ctaText", value)}
              onFocusEl={onFocusEl}
              onBlurEl={onBlurEl}
            />
            <svg width={cq(1.4)} height={cq(1.4)} viewBox="0 0 12 12" fill="currentColor">
              <path d="M2 6h8M6 2l4 4-4 4" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" />
            </svg>
          </div>

          {/* Contact — framed with a top divider + tint so it reads as a real
              info bar, not fine print trailing off the bottom of the layout. */}
          <div
            style={{
              borderTop: `1px solid ${hexToRgba(colors.accent, 0.18)}`,
              paddingTop: cq(2),
            }}
          >
            <ContactBar
              phone={phone}
              website={website}
              email={email}
              accentColor={colors.accent}
              textColor={colors.secondary}
              editable={editable}
              onUpdatePhone={onUpdatePhone}
              onUpdateWebsite={onUpdateWebsite}
              onUpdateEmail={onUpdateEmail}
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
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════════════════
   2. KŌAN
═══════════════════════════════════════════════════════════════════════════ */

const VariantKoan = ({
  headline,
  subheadline,
  tagline,
  ctaText,
  productImage,
  brandName,
  price,
  features,
  phone,
  email,
  colors,
  editable,
  onUpdate,
  onUpdateFeature,
  onAddFeature,
  onRemoveFeature,
  whyChooseUs,
  onUpdateWhyChooseUs,
  onAddWhyChooseUs,
  onRemoveWhyChooseUs,
  onUpdatePhone,
  onUpdateWebsite,
  onUpdateEmail,
  website,
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
  onFocusEl,
  onBlurEl,
}: SleekFlyerProps) => {
  const hasFeatures = Array.isArray(features) && features.length > 0;
  const hasWhyChooseUs = Array.isArray(whyChooseUs) && whyChooseUs.length > 0;

  return (
    <div
      className="@container w-full h-full relative overflow-hidden flex flex-col items-center font-sans"
      style={{ backgroundColor: colors.primary, color: colors.secondary }}
    >
      {/* Brand */}
      <div style={{ padding: `${cq(5)} 0 0`, textAlign: "center", zIndex: 10, flexShrink: 0 }}>
        <EditableText
          as="span"
          fieldId="f-brand"
          editable={editable}
          value={brandName ?? ""}
          onChange={(value) => onUpdate?.("brandName", value)}
          onFocusEl={onFocusEl}
          onBlurEl={onBlurEl}
          style={{
            fontSize: cq(2),
            fontWeight: 700,
            letterSpacing: "0.3em",
            textTransform: "uppercase",
            color: colors.secondary,
            opacity: 0.4,
          }}
        />
      </div>

      {tagline !== undefined && (
        <EditableText
          as="p"
          fieldId="f-tagline"
          editable={editable}
          value={tagline}
          onChange={(value) => onUpdate?.("tagline", value)}
          onFocusEl={onFocusEl}
          onBlurEl={onBlurEl}
          style={{
            fontSize: cq(2.4),
            fontStyle: "italic",
            color: colors.secondary,
            opacity: 0.35,
            margin: `${cq(2)} 0 0`,
            letterSpacing: "0.04em",
            zIndex: 10,
            flexShrink: 0,
          }}
        />
      )}

      {/* Product area */}
      <div style={{ flex: 1, position: "relative", width: "100%", display: "flex", alignItems: "center", justifyContent: "center", minHeight: 0 }}>
        <div
          style={{
            position: "absolute",
            width: cq(70),
            height: cq(70),
            borderRadius: "50%",
            border: `${cq(0.12)} solid ${colors.secondary}`,
            opacity: 0.08,
            zIndex: 2,
          }}
        />
        <div
          style={{
            position: "absolute",
            width: cq(52),
            height: cq(52),
            borderRadius: "50%",
            border: `${cq(0.2)} solid ${colors.accent}`,
            opacity: 0.6,
            zIndex: 2,
          }}
        />
        <div style={{ position: "relative", width: cq(62), height: cq(62), zIndex: 10 }}>
          <Image
            src={productImage}
            alt="Product"
            fill
            unoptimized
            crossOrigin="anonymous"
            className="object-contain"
            style={{ filter: `drop-shadow(0 ${cq(4)} ${cq(8)} rgba(0,0,0,0.12))` }}
          />
        </div>
      </div>

      {/* Bottom content */}
      <div
        style={{
          flexShrink: 0,
          textAlign: "center",
          padding: `0 ${cq(8)} ${cq(5.5)}`,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: cq(2.5),
          width: "100%",
        }}
      >
        <div style={{ width: cq(5), height: cq(0.25), backgroundColor: colors.accent }} />

        <h1
          style={{
            fontSize: `clamp(20px, ${cq(9)}, 80px)`,
            fontWeight: 700,
            letterSpacing: "-0.03em",
            lineHeight: 0.95,
            color: colors.secondary,
            margin: 0,
            fontFamily: "-apple-system, 'SF Pro Display', 'Helvetica Neue', sans-serif",
          }}
        >
          <EditableHeadlineLines
            value={headline}
            editable={editable}
            onFocusEl={onFocusEl}
            onBlurEl={onBlurEl}
            onChange={(value) => onUpdate?.("headline", value)}
            renderLine={(line, index, node) => (
              <span key={index} style={{ display: "block" }}>
                {node}
              </span>
            )}
          />
        </h1>

        {subheadline !== undefined && (
          <EditableText
            as="p"
            fieldId="f-sub"
            editable={editable}
            value={subheadline}
            onChange={(value) => onUpdate?.("subtext", value)}
            onFocusEl={onFocusEl}
            onBlurEl={onBlurEl}
            style={{
              fontSize: cq(2.4),
              lineHeight: 1.5,
              color: colors.secondary,
              opacity: 0.45,
              margin: 0,
              fontWeight: 400,
              maxWidth: "28ch",
            }}
          />
        )}

        {(hasFeatures || hasWhyChooseUs) && (
          <div style={{ width: "100%", maxWidth: cq(65), textAlign: "left", display: "flex", flexDirection: "column", gap: cq(2) }}>
            {hasFeatures && (
              <FeatureList
                features={features!.slice(0, 3)}
                colors={colors}
                editable={editable}
                title="FEATURES"
                onUpdateTitle={(value) => onUpdate?.("featuresTitle", value)}
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
                colors={colors}
                editable={editable}
                title="WHY CHOOSE US"
                onUpdateTitle={(value) => onUpdate?.("whyChooseUsTitle", value)}
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

        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: cq(4), marginTop: cq(0.5), flexWrap: "wrap" }}>
          {price !== undefined && price !== "" && (
            <EditableText
              as="span"
              fieldId="f-price"
              editable={editable}
              value={price}
              onChange={(value) => onUpdate?.("price", value)}
              onFocusEl={onFocusEl}
              onBlurEl={onBlurEl}
              style={{ fontSize: cq(4), fontWeight: 700, color: colors.accent, letterSpacing: "-0.02em" }}
            />
          )}

          <EditableText
            as="div"
            fieldId="f-cta"
            editable={editable}
            value={ctaText}
            onChange={(value) => onUpdate?.("ctaText", value)}
            onFocusEl={onFocusEl}
            onBlurEl={onBlurEl}
            style={{
              border: `${cq(0.12)} solid ${colors.secondary}`,
              padding: `${cq(1.6)} ${cq(4.5)}`,
              borderRadius: "100px",
              fontSize: cq(2.2),
              fontWeight: 500,
              letterSpacing: "0.06em",
              color: colors.secondary,
              opacity: 0.75,
              minHeight: "44px",
              display: "inline-flex",
              alignItems: "center",
            }}
          />
        </div>

        {/* Contact — framed with a top divider + tint, matching Mono Split */}
        <div style={{ width: "100%", borderTop: `1px solid ${hexToRgba(colors.accent, 0.18)}`, paddingTop: cq(2.5) }}>
          <ContactBar
            phone={phone}
            website={website}
            email={email}
            accentColor={colors.accent}
            textColor={colors.secondary}
            editable={editable}
            onUpdatePhone={onUpdatePhone}
            onUpdateWebsite={onUpdateWebsite}
            onUpdateEmail={onUpdateEmail}
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
    </div>
  );
};
