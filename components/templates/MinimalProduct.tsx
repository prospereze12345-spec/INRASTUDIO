"use client";

import { EditableText } from "@/components/EditableText";

import React from "react";
import Image from "next/image";
import { Phone, Mail, Globe, CheckCircle2, Plus, X } from "lucide-react";
import { FeatureList, ContactBar, WhyChooseUsList } from "./FlyerContentBlocks";
import { EditableHeadlineLines } from "@/components/Editableheadlinelines";

/* ═══════════════════════════════════════════════════════════════════════════
   TYPES
═══════════════════════════════════════════════════════════════════════════ */

export interface SleekFlyerProps {
  name?: string;

  /* ── Main content ─────────────────────────────────────────────────────── */

  headline: string;
  subheadline?: string;
  tagline?: string;
  ctaText: string;

  /* ── Product ──────────────────────────────────────────────────────────── */

  productImage: string;
  brandName?: string;
  website?: string;
  price?: string;
  badge?: string;

  /* ── NEW: Product selling points ──────────────────────────────────────── */

  features?: string[];

  /* ── NEW: Contact information ────────────────────────────────────────── */

  phone?: string;
  email?: string;

  /* ── Colors ───────────────────────────────────────────────────────────── */

  colors: {
    primary: string;
    secondary: string;
    accent: string;
  };

  /* ── Editor ───────────────────────────────────────────────────────────── */

  editable?: boolean;

  /**
   * Canonical FlyerState field names:
   *
   * brandName
   * headline
   * subtext
   * ctaText
   * website
   * price
   * badgeText
   * tagline
   * phone
   * email
   */
  onUpdate?: (field: string, value: string) => void;

  /* ── Feature editing ─────────────────────────────────────────────────── */

  onUpdateFeature?: (index: number, value: string) => void;
  onAddFeature?: () => void;
  onRemoveFeature?: (index: number) => void;

  /* ── Contact editing ──────────────────────────────────────────────────── */

  onUpdatePhone?: (value: string) => void;
  onUpdateWebsite?: (value: string) => void;
  onUpdateEmail?: (value: string) => void;

  /* ── Focus / blur ────────────────────────────────────────────────────── */

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


/* ═══════════════════════════════════════════════════════════════════════════
   FEATURE LIST
   Product-focused selling points / benefits.
═══════════════════════════════════════════════════════════════════════════ */


export function SleekFlyerTemplate(
  props: SleekFlyerProps
) {
  const {
    name = "Mono Split",
  } = props;

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
  website,
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
}: SleekFlyerProps) => (
  <div
    className="@container w-full h-full relative overflow-hidden flex flex-row font-sans"
    style={{
      backgroundColor: colors.primary,
      color: colors.secondary,
    }}
  >
    {/* ── Product image ─────────────────────────────────────────────────── */}

    <div
      className="relative overflow-hidden"
      style={{
        width: "55%",
        height: "100%",
      }}
    >
      <Image
        src={productImage}
        alt="Product"
        fill
        className="object-cover object-center"
        crossOrigin="anonymous"
      />

      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `linear-gradient(to right, transparent 60%, ${colors.primary}CC 100%)`,
        }}
      />
    </div>

    {/* ── Content ───────────────────────────────────────────────────────── */}

    <div
      className="flex flex-col justify-between relative z-10"
      style={{
        width: "45%",
        height: "100%",
        backgroundColor: colors.primary,
        padding: "7cqi 6cqi 7cqi 5cqi",
      }}
    >
      {/* Brand */}
      <div className="flex items-center justify-between">
        <EditableText
          as="span"
          fieldId="f-brand"
          editable={editable}
          value={brandName ?? ""}
          onChange={(value) =>
            onUpdate?.("brandName", value)
          }
          onFocusEl={onFocusEl}
          onBlurEl={onBlurEl}
          style={{
            fontSize: "2.2cqi",
            fontWeight: 700,
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            opacity: 0.45,
            color: colors.secondary,
          }}
        />

        <div
          style={{
            width: "1.8cqi",
            height: "1.8cqi",
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
          gap: "3cqi",
          overflow: "hidden",
        }}
      >
        {/* Accent line */}
        <div
          style={{
            width: "8cqi",
            height: "0.3cqi",
            backgroundColor: colors.accent,
            marginBottom: "1cqi",
          }}
        />

        {/* Headline */}
        <h1
          style={{
            fontSize: "clamp(24px, 11cqi, 96px)",
            fontWeight: 800,
            lineHeight: 0.92,
            letterSpacing: "-0.03em",
            color: colors.secondary,
            margin: 0,
            fontFamily:
              "-apple-system, 'SF Pro Display', 'Helvetica Neue', sans-serif",
          }}
        >
          <EditableHeadlineLines
            value={headline}
            editable={editable}
            onFocusEl={onFocusEl}
            onBlurEl={onBlurEl}
            onChange={(value) =>
              onUpdate?.("headline", value)
            }
            renderLine={(line, index, node) => (
              <span
                key={index}
                style={{
                  display: "block",
                }}
              >
                {node}
              </span>
            )}
          />
        </h1>

        {/* Description */}
        {subheadline !== undefined && (
          <EditableText
            as="p"
            fieldId="f-sub"
            editable={editable}
            value={subheadline}
            onChange={(value) =>
              onUpdate?.("subtext", value)
            }
            onFocusEl={onFocusEl}
            onBlurEl={onBlurEl}
            style={{
              fontSize: "2.6cqi",
              lineHeight: 1.5,
              color: colors.secondary,
              opacity: 0.55,
              margin: 0,
              maxWidth: "28ch",
              fontWeight: 400,
            }}
          />
        )}

        {/* Product features */}
        <FeatureList
  features={features}
  colors={colors}
  editable={editable}
  onUpdateFeature={onUpdateFeature}
  onAddFeature={onAddFeature}
  onRemoveFeature={onRemoveFeature}
  onFocusEl={onFocusEl}
  onBlurEl={onBlurEl}
  visible={featuresVisible}
  onRestoreSection={onRestoreFeatures}
/>
        <WhyChooseUsList
    items={whyChooseUs}
    colors={colors}
    editable={editable}
    onUpdate={onUpdateWhyChooseUs}
    onAdd={onAddWhyChooseUs}
    onRemove={onRemoveWhyChooseUs}
    onFocusEl={onFocusEl}
    onBlurEl={onBlurEl}
    visible={whyChooseUsVisible}
    onRestoreSection={onRestoreWhyChooseUs}
  />

        {/* Price */}
        {price !== undefined && price !== "" && (
          <div
            style={{
              display: "inline-flex",
              alignItems: "baseline",
              gap: "0.8cqi",
              marginTop: "1cqi",
            }}
          >
            <EditableText
              as="span"
              fieldId="f-price"
              editable={editable}
              value={price}
              onChange={(value) =>
                onUpdate?.("price", value)
              }
              onFocusEl={onFocusEl}
              onBlurEl={onBlurEl}
              style={{
                fontSize: "7cqi",
                fontWeight: 700,
                letterSpacing: "-0.04em",
                color: colors.secondary,
              }}
            />
          </div>
        )}
      </div>

      {/* Bottom actions */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "2.5cqi",
        }}
      >
        {/* CTA */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "2cqi",
            backgroundColor: colors.secondary,
            color: colors.primary,
            padding: "2.2cqi 4cqi",
            borderRadius: "100px",
            fontSize: "2.4cqi",
            fontWeight: 600,
            letterSpacing: "0.02em",
            width: "fit-content",
          }}
        >
          <EditableText
            as="span"
            fieldId="f-cta"
            editable={editable}
            value={ctaText}
            onChange={(value) =>
              onUpdate?.("ctaText", value)
            }
            onFocusEl={onFocusEl}
            onBlurEl={onBlurEl}
          />

          <svg
            width="1.4cqi"
            height="1.4cqi"
            viewBox="0 0 12 12"
            fill="currentColor"
          >
            <path
              d="M2 6h8M6 2l4 4-4 4"
              stroke="currentColor"
              strokeWidth="1.5"
              fill="none"
              strokeLinecap="round"
            />
          </svg>
        </div>

        {/* Contact */}
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



/* ═══════════════════════════════════════════════════════════════════════════
   5. KŌAN
═══════════════════════════════════════════════════════════════════════════ */

const VariantKoan = ({
  headline,
  subheadline,
  tagline,
  ctaText,

  productImage,
  brandName,
  website,
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
}: SleekFlyerProps) => (
  <div
    className="@container w-full h-full relative overflow-hidden flex flex-col items-center font-sans"
    style={{
      backgroundColor: colors.primary,
      color: colors.secondary,
    }}
  >
    {/* Brand */}
    <div
      style={{
        padding: "5cqi 0 0",
        textAlign: "center",
        zIndex: 10,
        flexShrink: 0,
      }}
    >
      <EditableText
        as="span"
        fieldId="f-brand"
        editable={editable}
        value={brandName ?? ""}
        onChange={(value) =>
          onUpdate?.("brandName", value)
        }
        onFocusEl={onFocusEl}
        onBlurEl={onBlurEl}
        style={{
          fontSize: "2cqi",
          fontWeight: 700,
          letterSpacing: "0.3em",
          textTransform: "uppercase",
          color: colors.secondary,
          opacity: 0.4,
        }}
      />
    </div>

    {/* Tagline */}
    {tagline !== undefined && (
      <EditableText
        as="p"
        fieldId="f-tagline"
        editable={editable}
        value={tagline}
        onChange={(value) =>
          onUpdate?.("tagline", value)
        }
        onFocusEl={onFocusEl}
        onBlurEl={onBlurEl}
        style={{
          fontSize: "2.4cqi",
          fontStyle: "italic",
          color: colors.secondary,
          opacity: 0.35,
          margin: "2cqi 0 0",
          letterSpacing: "0.04em",
          zIndex: 10,
          flexShrink: 0,
        }}
      />
    )}

    {/* Product area */}
    <div
      style={{
        flex: 1,
        position: "relative",
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: 0,
      }}
    >
      {/* Outer circle */}
      <div
        style={{
          position: "absolute",
          width: "70cqi",
          height: "70cqi",
          borderRadius: "50%",
          border: `0.12cqi solid ${colors.secondary}`,
          opacity: 0.08,
          zIndex: 2,
        }}
      />

      {/* Accent circle */}
      <div
        style={{
          position: "absolute",
          width: "52cqi",
          height: "52cqi",
          borderRadius: "50%",
          border: `0.2cqi solid ${colors.accent}`,
          opacity: 0.6,
          zIndex: 2,
        }}
      />

      {/* Product */}
      <div
        style={{
          position: "relative",
          width: "62cqi",
          height: "62cqi",
          zIndex: 10,
        }}
      >
        <Image
          src={productImage}
          alt="Product"
          fill
          className="object-contain"
          style={{
            filter:
              "drop-shadow(0 4cqi 8cqi rgba(0,0,0,0.12))",
          }}
          crossOrigin="anonymous"
        />
      </div>
    </div>

    {/* Bottom content */}
    <div
      style={{
        flexShrink: 0,
        textAlign: "center",
        padding: "0 8cqi 5.5cqi",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "2.5cqi",
        width: "100%",
      }}
    >
      {/* Accent line */}
      <div
        style={{
          width: "5cqi",
          height: "0.25cqi",
          backgroundColor: colors.accent,
        }}
      />

      {/* Headline */}
      <h1
        style={{
          fontSize: "clamp(20px, 9cqi, 80px)",
          fontWeight: 700,
          letterSpacing: "-0.03em",
          lineHeight: 0.95,
          color: colors.secondary,
          margin: 0,
          fontFamily:
            "-apple-system, 'SF Pro Display', 'Helvetica Neue', sans-serif",
        }}
      >
        <EditableHeadlineLines
          value={headline}
          editable={editable}
          onFocusEl={onFocusEl}
          onBlurEl={onBlurEl}
          onChange={(value) =>
            onUpdate?.("headline", value)
          }
          renderLine={(line, index, node) => (
            <span
              key={index}
              style={{
                display: "block",
              }}
            >
              {node}
            </span>
          )}
        />
      </h1>

      {/* Description */}
      {subheadline !== undefined && (
        <EditableText
          as="p"
          fieldId="f-sub"
          editable={editable}
          value={subheadline}
          onChange={(value) =>
            onUpdate?.("subtext", value)
          }
          onFocusEl={onFocusEl}
          onBlurEl={onBlurEl}
          style={{
            fontSize: "2.4cqi",
            lineHeight: 1.5,
            color: colors.secondary,
            opacity: 0.45,
            margin: 0,
            fontWeight: 400,
            maxWidth: "28ch",
          }}
        />
      )}

      {/* Features */}
      <div
        style={{
          width: "100%",
          maxWidth: "65cqi",
          textAlign: "left",
        }}
      >
        <FeatureList
          features={features}
          colors={colors}
          editable={editable}
          onUpdateFeature={onUpdateFeature}
          onAddFeature={onAddFeature}
          onRemoveFeature={onRemoveFeature}
          onFocusEl={onFocusEl}
          onBlurEl={onBlurEl}
          visible={featuresVisible}
          onRestoreSection={onRestoreFeatures}
        />
        <WhyChooseUsList
  items={whyChooseUs}
  colors={colors}
  editable={editable}
  onUpdate={onUpdateWhyChooseUs}
  onAdd={onAddWhyChooseUs}
  onRemove={onRemoveWhyChooseUs}
  onFocusEl={onFocusEl}
  onBlurEl={onBlurEl}
  visible={whyChooseUsVisible}
onRestoreSection={onRestoreWhyChooseUs}
/>
      </div>

      {/* Price + CTA */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "4cqi",
          marginTop: "0.5cqi",
          flexWrap: "wrap",
        }}
      >
        {price !== undefined && price !== "" && (
          <EditableText
            as="span"
            fieldId="f-price"
            editable={editable}
            value={price}
            onChange={(value) =>
              onUpdate?.("price", value)
            }
            onFocusEl={onFocusEl}
            onBlurEl={onBlurEl}
            style={{
              fontSize: "4cqi",
              fontWeight: 700,
              color: colors.accent,
              letterSpacing: "-0.02em",
            }}
          />
        )}

        <EditableText
          as="div"
          fieldId="f-cta"
          editable={editable}
          value={ctaText}
          onChange={(value) =>
            onUpdate?.("ctaText", value)
          }
          onFocusEl={onFocusEl}
          onBlurEl={onBlurEl}
          style={{
            border: `0.12cqi solid ${colors.secondary}`,
            padding: "1.6cqi 4.5cqi",
            borderRadius: "100px",
            fontSize: "2.2cqi",
            fontWeight: 500,
            letterSpacing: "0.06em",
            color: colors.secondary,
            opacity: 0.75,
          }}
        />
      </div>

      {/* Contact */}
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
);



