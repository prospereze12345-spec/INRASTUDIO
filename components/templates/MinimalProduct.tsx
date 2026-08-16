"use client";

import { EditableText } from "@/components/EditableText";

import React from "react";
import Image from "next/image";
import { Phone, Mail, Globe, CheckCircle2, Plus, X } from "lucide-react";
import { FeatureList, ContactBar, WhyChooseUsList } from "./FlyerContentBlocks";
import { EditableHeadlineLines } from "@/components/Editableheadlinelines";

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

// ---------------------------------------------------------------------------
// Sizing note: every dimension below uses calc(N * var(--ci)) / calc(N * var(--cb))
// instead of the old Ncqi / Ncqb container-query units. --ci and --cb are
// plain CSS custom properties (1% of canvas width / height) set on the
// editor's canvas wrapper. calc()+var() has worked since iOS 9.3; cqi/cqb
// require Safari 16+ and silently collapse to 0 on iOS 15 and older,
// which is why the flyer used to render blank on older iPhones.
// ---------------------------------------------------------------------------

export function SleekFlyerTemplate(
  props: SleekFlyerProps
) {
  const {
    name = "Mono Split",
  } = props;

  switch (name) {
    case "Mono Split":
      return <VariantMonoSplit {...props} />;

    case "Editorial Arc":
      return <VariantEditorialArc {...props} />;

    case "Negative Space":
      return <VariantNegativeSpace {...props} />;

    case "Studio Grid":
      return <VariantStudioGrid {...props} />;

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
    className="w-full h-full relative overflow-hidden flex flex-row font-sans"
    style={{
      backgroundColor: colors.primary,
      color: colors.secondary,
    }}
  >
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

    <div
      className="flex flex-col justify-between relative z-10"
      style={{
        width: "45%",
        height: "100%",
        backgroundColor: colors.primary,
        padding: "calc(7*var(--cb)) calc(6*var(--ci)) calc(7*var(--cb)) calc(5*var(--ci))",
      }}
    >
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
            fontSize: "calc(2.2*var(--ci))",
            fontWeight: 700,
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            opacity: 0.45,
            color: colors.secondary,
          }}
        />

        <div
          style={{
            width: "calc(1.8*var(--ci))",
            height: "calc(1.8*var(--ci))",
            borderRadius: "50%",
            backgroundColor: colors.accent,
          }}
        />
      </div>

      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          gap: "calc(3*var(--cb))",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: "calc(8*var(--ci))",
            height: "calc(0.3*var(--ci))",
            backgroundColor: colors.accent,
            marginBottom: "calc(1*var(--cb))",
          }}
        />

        <h1
          style={{
            fontSize: "clamp(24px, calc(11*var(--ci)), 96px)",
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
              fontSize: "calc(2.6*var(--ci))",
              lineHeight: 1.5,
              color: colors.secondary,
              opacity: 0.55,
              margin: 0,
              maxWidth: "28ch",
              fontWeight: 400,
            }}
          />
        )}

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

        {price !== undefined && price !== "" && (
          <div
            style={{
              display: "inline-flex",
              alignItems: "baseline",
              gap: "calc(0.8*var(--ci))",
              marginTop: "calc(1*var(--cb))",
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
                fontSize: "calc(7*var(--ci))",
                fontWeight: 700,
                letterSpacing: "-0.04em",
                color: colors.secondary,
              }}
            />
          </div>
        )}
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "calc(2.5*var(--cb))",
        }}
      >
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "calc(2*var(--ci))",
            backgroundColor: colors.secondary,
            color: colors.primary,
            padding: "calc(2.2*var(--cb)) calc(4*var(--ci))",
            borderRadius: "100px",
            fontSize: "calc(2.4*var(--ci))",
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
            width="14"
            height="14"
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
   2. EDITORIAL ARC
═══════════════════════════════════════════════════════════════════════════ */

const VariantEditorialArc = ({
  headline,
  subheadline,
  ctaText,

  productImage,
  brandName,
  website,
  price,
  badge,

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
}: SleekFlyerProps) => {
  const lines = headline.split("\n");

  const line0 = lines[0] ?? "";
  const line1 = lines[1] ?? "";

  return (
    <div
      className="w-full h-full relative overflow-hidden flex flex-col font-sans"
      style={{
        backgroundColor: colors.primary,
        color: colors.secondary,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "calc(5*var(--cb)) calc(6*var(--ci)) 0",
          position: "relative",
          zIndex: 20,
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
            fontSize: "calc(2*var(--ci))",
            fontWeight: 700,
            letterSpacing: "0.25em",
            textTransform: "uppercase",
            color: colors.secondary,
            opacity: 0.5,
          }}
        />

        {badge && (
          <EditableText
            as="span"
            fieldId="f-badge"
            editable={editable}
            value={badge}
            onChange={(value) =>
              onUpdate?.("badgeText", value)
            }
            onFocusEl={onFocusEl}
            onBlurEl={onBlurEl}
            style={{
              fontSize: "calc(1.8*var(--ci))",
              fontWeight: 600,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: colors.accent,
              border: `calc(0.15*var(--ci)) solid ${colors.accent}`,
              padding: "calc(0.8*var(--cb)) calc(2.5*var(--ci))",
              borderRadius: "100px",
            }}
          />
        )}
      </div>

      <div
        style={{
          padding: "calc(2*var(--cb)) calc(6*var(--ci)) 0",
          position: "relative",
          zIndex: 5,
          lineHeight: 0.82,
        }}
      >
        <h1
          style={{
            fontSize: "clamp(32px, calc(18*var(--ci)), 160px)",
            fontWeight: 900,
            letterSpacing: "-0.04em",
            color: colors.secondary,
            margin: 0,
            fontFamily:
              "-apple-system, 'SF Pro Display', 'Helvetica Neue', sans-serif",
          }}
        >
          <EditableText
            as="span"
            fieldId="f-headline-0"
            editable={editable}
            value={line0}
            onChange={(value) =>
              onUpdate?.(
                "headline",
                [value, line1].join("\n")
              )
            }
            onFocusEl={onFocusEl}
            onBlurEl={onBlurEl}
          />
        </h1>

        {line1 && (
          <h1
            style={{
              fontSize: "clamp(32px, calc(18*var(--ci)), 160px)",
              fontWeight: 900,
              letterSpacing: "-0.04em",
              color: "transparent",
              WebkitTextStroke: `calc(0.15*var(--ci)) ${colors.secondary}`,
              margin: 0,
              fontFamily:
                "-apple-system, 'SF Pro Display', 'Helvetica Neue', sans-serif",
              opacity: 0.2,
            }}
          >
            <EditableText
              as="span"
              fieldId="f-headline-1"
              editable={editable}
              value={line1}
              onChange={(value) =>
                onUpdate?.(
                  "headline",
                  [line0, value].join("\n")
                )
              }
              onFocusEl={onFocusEl}
              onBlurEl={onBlurEl}
            />
          </h1>
        )}
      </div>

      <div
        style={{
          flex: 1,
          position: "relative",
          zIndex: 15,
          margin: "calc(-4*var(--cb)) 0 0",
          minHeight: 0,
        }}
      >
        <Image
          src={productImage}
          alt="Product"
          fill
          className="object-contain object-bottom"
          style={{
            transform: "scale(1.05)",
            transformOrigin: "bottom center",
          }}
          crossOrigin="anonymous"
        />
      </div>

      <div
        style={{
          position: "absolute",
          bottom: "calc(-15*var(--cb))",
          left: "-10%",
          width: "120%",
          height: "calc(45*var(--cb))",
          backgroundColor: colors.accent,
          borderRadius: "50% 50% 0 0",
          zIndex: 10,
        }}
      />

      <div
        style={{
          position: "absolute",
          bottom: "calc(5*var(--cb))",
          left: 0,
          right: 0,
          zIndex: 20,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          padding: "0 calc(7*var(--ci))",
          gap: "calc(4*var(--ci))",
        }}
      >
        <div
          style={{
            minWidth: 0,
            flex: 1,
          }}
        >
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
                fontSize: "calc(2.5*var(--ci))",
                color: colors.primary,
                margin: "0 0 calc(1*var(--cb))",
                opacity: 0.8,
                fontWeight: 400,
                maxWidth: "26ch",
                lineHeight: 1.4,
              }}
            />
          )}

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
                fontSize: "calc(8*var(--ci))",
                fontWeight: 800,
                letterSpacing: "-0.04em",
                color: colors.primary,
              }}
            />
          )}
        </div>

        <div
          style={{
            textAlign: "right",
            flexShrink: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-end",
            gap: "calc(1.5*var(--cb))",
          }}
        >
          <div
            style={{
              fontSize: "calc(2.8*var(--ci))",
              fontWeight: 700,
              color: colors.primary,
              letterSpacing: "0.04em",
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
            />{" "}
            →
          </div>

          <ContactBar
            phone={phone}
            website={website}
            email={email}
            accentColor={colors.primary}
            textColor={colors.primary}
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


/* ═══════════════════════════════════════════════════════════════════════════
   3. NEGATIVE SPACE
═══════════════════════════════════════════════════════════════════════════ */

const VariantNegativeSpace = ({
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
    className="w-full h-full relative overflow-hidden flex flex-col font-sans"
    style={{
      backgroundColor: colors.primary,
      color: colors.secondary,
    }}
  >
    <div
      style={{
        height: "calc(0.6*var(--cb))",
        backgroundColor: colors.accent,
        width: "100%",
        flexShrink: 0,
      }}
    />

    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "calc(4*var(--cb)) calc(6*var(--ci))",
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
          fontSize: "calc(2.2*var(--ci))",
          fontWeight: 800,
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          color: colors.secondary,
        }}
      />

      {tagline !== undefined && (
        <EditableText
          as="span"
          fieldId="f-tagline"
          editable={editable}
          value={tagline}
          onChange={(value) =>
            onUpdate?.("tagline", value)
          }
          onFocusEl={onFocusEl}
          onBlurEl={onBlurEl}
          style={{
            fontSize: "calc(2*var(--ci))",
            fontWeight: 400,
            color: colors.secondary,
            opacity: 0.35,
            letterSpacing: "0.06em",
          }}
        />
      )}
    </div>

    <div
      style={{
        flex: 1,
        position: "relative",
        margin: "0 calc(8*var(--ci))",
        minHeight: 0,
      }}
    >
      <Image
        src={productImage}
        alt="Product"
        fill
        className="object-contain"
        style={{
          filter:
            "drop-shadow(0 calc(8*var(--cb)) calc(6*var(--cb)) rgba(0,0,0,0.08))",
        }}
        crossOrigin="anonymous"
      />
    </div>

    <div
      style={{
        flexShrink: 0,
        padding: "0 calc(6*var(--ci)) calc(5*var(--cb))",
        display: "flex",
        flexDirection: "column",
        gap: "calc(2*var(--cb))",
      }}
    >
      <div
        style={{
          height: "calc(0.08*var(--cb))",
          backgroundColor: colors.secondary,
          opacity: 0.1,
          marginBottom: "calc(1*var(--cb))",
        }}
      />

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          gap: "calc(4*var(--ci))",
        }}
      >
        <div
          style={{
            minWidth: 0,
            flex: 1,
          }}
        >
          <h2
            style={{
              fontSize: "clamp(18px, calc(8*var(--ci)), 72px)",
              fontWeight: 700,
              letterSpacing: "-0.025em",
              color: colors.secondary,
              margin: 0,
              lineHeight: 0.95,
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
          </h2>

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
                fontSize: "calc(2.2*var(--ci))",
                color: colors.secondary,
                opacity: 0.5,
                margin: "calc(1.5*var(--cb)) 0 0",
                fontWeight: 400,
                lineHeight: 1.5,
                maxWidth: "30ch",
              }}
            />
          )}

          <div
            style={{
              marginTop: "calc(2*var(--cb))",
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
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-end",
            gap: "calc(2*var(--cb))",
            flexShrink: 0,
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
                fontSize: "calc(6*var(--ci))",
                fontWeight: 700,
                letterSpacing: "-0.03em",
                color: colors.accent,
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
              border: `calc(0.15*var(--ci)) solid ${colors.secondary}`,
              padding: "calc(1.8*var(--cb)) calc(4.5*var(--ci))",
              fontSize: "calc(2.2*var(--ci))",
              fontWeight: 600,
              letterSpacing: "0.06em",
              color: colors.secondary,
              borderRadius: "100px",
              whiteSpace: "nowrap",
            }}
          />

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


/* ═══════════════════════════════════════════════════════════════════════════
   4. STUDIO GRID
═══════════════════════════════════════════════════════════════════════════ */

const VariantStudioGrid = ({
  headline,
  subheadline,
  ctaText,

  productImage,
  brandName,
  website,
  price,
  badge,

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
    className="w-full h-full relative overflow-hidden font-sans"
    style={{
      backgroundColor: colors.primary,
      color: colors.secondary,
    }}
  >
    <div
      style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform:
          "translate(-50%, -50%) rotate(-20deg)",
        fontSize: "calc(40*var(--ci))",
        fontWeight: 900,
        letterSpacing: "-0.05em",
        color: colors.secondary,
        opacity: 0.03,
        whiteSpace: "nowrap",
        pointerEvents: "none",
        zIndex: 0,
        userSelect: "none",
      }}
    >
      {headline.split("\n")[0]}
    </div>

    <div
      style={{
        position: "absolute",
        top: "33.33%",
        left: 0,
        right: 0,
        height: "calc(0.08*var(--cb))",
        backgroundColor: colors.secondary,
        opacity: 0.08,
        zIndex: 5,
      }}
    />

    <div
      style={{
        position: "absolute",
        top: 0,
        bottom: 0,
        right: "35%",
        width: "calc(0.08*var(--ci))",
        backgroundColor: colors.secondary,
        opacity: 0.08,
        zIndex: 5,
      }}
    />

    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "65%",
        height: "33.33%",
        backgroundColor: colors.accent,
        zIndex: 2,
      }}
    />

    <div
      style={{
        position: "absolute",
        top: "calc(5*var(--cb))",
        left: "calc(6*var(--ci))",
        zIndex: 10,
        display: "flex",
        flexDirection: "column",
        gap: "calc(1.2*var(--cb))",
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
          fontSize: "calc(3*var(--ci))",
          fontWeight: 800,
          letterSpacing: "0.15em",
          textTransform: "uppercase",
          color: colors.primary,
        }}
      />

      {badge && (
        <EditableText
          as="span"
          fieldId="f-badge"
          editable={editable}
          value={badge}
          onChange={(value) =>
            onUpdate?.("badgeText", value)
          }
          onFocusEl={onFocusEl}
          onBlurEl={onBlurEl}
          style={{
            fontSize: "calc(1.8*var(--ci))",
            fontWeight: 500,
            color: colors.primary,
            opacity: 0.7,
            letterSpacing: "0.06em",
          }}
        />
      )}
    </div>

    <div
      style={{
        position: "absolute",
        top: "10%",
        left: "5%",
        right: "32%",
        bottom: "10%",
        zIndex: 15,
      }}
    >
      <Image
        src={productImage}
        alt="Product"
        fill
        className="object-contain"
        style={{
          filter:
            "drop-shadow(0 calc(6*var(--cb)) calc(8*var(--cb)) rgba(0,0,0,0.15))",
        }}
        crossOrigin="anonymous"
      />
    </div>

    <div
      style={{
        position: "absolute",
        top: 0,
        right: 0,
        width: "35%",
        height: "100%",
        zIndex: 20,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "calc(6*var(--cb)) calc(5*var(--ci)) calc(12*var(--cb)) calc(4*var(--ci))",
        gap: "calc(3*var(--cb))",
        overflow: "hidden",
      }}
    >
      <h1
        style={{
          fontSize: "clamp(16px, calc(7.5*var(--ci)), 64px)",
          fontWeight: 800,
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

      <div
        style={{
          width: "calc(6*var(--ci))",
          height: "calc(0.3*var(--ci))",
          backgroundColor: colors.accent,
        }}
      />

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
            fontSize: "calc(2.2*var(--ci))",
            lineHeight: 1.55,
            color: colors.secondary,
            opacity: 0.5,
            margin: 0,
            fontWeight: 400,
          }}
        />
      )}

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
            fontSize: "calc(7*var(--ci))",
            fontWeight: 700,
            letterSpacing: "-0.04em",
            color: colors.secondary,
          }}
        />
      )}
    </div>

    <div
      style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        minHeight: "calc(10*var(--cb))",
        zIndex: 20,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "calc(2*var(--cb)) calc(6*var(--ci))",
        borderTop: `calc(0.08*var(--cb)) solid ${colors.secondary}18`,
        gap: "calc(3*var(--ci))",
      }}
    >
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
          backgroundColor: colors.secondary,
          color: colors.primary,
          padding: "calc(1.8*var(--cb)) calc(5*var(--ci))",
          borderRadius: "100px",
          fontSize: "calc(2.2*var(--ci))",
          fontWeight: 600,
          letterSpacing: "0.04em",
          whiteSpace: "nowrap",
        }}
      />

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
    className="w-full h-full relative overflow-hidden flex flex-col items-center font-sans"
    style={{
      backgroundColor: colors.primary,
      color: colors.secondary,
    }}
  >
    <div
      style={{
        padding: "calc(5*var(--cb)) 0 0",
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
          fontSize: "calc(2*var(--ci))",
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
        onChange={(value) =>
          onUpdate?.("tagline", value)
        }
        onFocusEl={onFocusEl}
        onBlurEl={onBlurEl}
        style={{
          fontSize: "calc(2.4*var(--ci))",
          fontStyle: "italic",
          color: colors.secondary,
          opacity: 0.35,
          margin: "calc(2*var(--cb)) 0 0",
          letterSpacing: "0.04em",
          zIndex: 10,
          flexShrink: 0,
        }}
      />
    )}

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
      <div
        style={{
          position: "absolute",
          width: "calc(70*var(--ci))",
          height: "calc(70*var(--ci))",
          borderRadius: "50%",
          border: `calc(0.12*var(--ci)) solid ${colors.secondary}`,
          opacity: 0.08,
          zIndex: 2,
        }}
      />

      <div
        style={{
          position: "absolute",
          width: "calc(52*var(--ci))",
          height: "calc(52*var(--ci))",
          borderRadius: "50%",
          border: `calc(0.2*var(--ci)) solid ${colors.accent}`,
          opacity: 0.6,
          zIndex: 2,
        }}
      />

      <div
        style={{
          position: "relative",
          width: "calc(62*var(--ci))",
          height: "calc(62*var(--ci))",
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
              "drop-shadow(0 calc(4*var(--cb)) calc(8*var(--cb)) rgba(0,0,0,0.12))",
          }}
          crossOrigin="anonymous"
        />
      </div>
    </div>

    <div
      style={{
        flexShrink: 0,
        textAlign: "center",
        padding: "0 calc(8*var(--ci)) calc(5.5*var(--cb))",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "calc(2.5*var(--cb))",
        width: "100%",
      }}
    >
      <div
        style={{
          width: "calc(5*var(--ci))",
          height: "calc(0.25*var(--ci))",
          backgroundColor: colors.accent,
        }}
      />

      <h1
        style={{
          fontSize: "clamp(20px, calc(9*var(--ci)), 80px)",
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
            fontSize: "calc(2.4*var(--ci))",
            lineHeight: 1.5,
            color: colors.secondary,
            opacity: 0.45,
            margin: 0,
            fontWeight: 400,
            maxWidth: "28ch",
          }}
        />
      )}

      <div
        style={{
          width: "100%",
          maxWidth: "calc(65*var(--ci))",
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

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "calc(4*var(--ci))",
          marginTop: "calc(0.5*var(--cb))",
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
              fontSize: "calc(4*var(--ci))",
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
            border: `calc(0.12*var(--ci)) solid ${colors.secondary}`,
            padding: "calc(1.6*var(--cb)) calc(4.5*var(--ci))",
            borderRadius: "100px",
            fontSize: "calc(2.2*var(--ci))",
            fontWeight: 500,
            letterSpacing: "0.06em",
            color: colors.secondary,
            opacity: 0.75,
          }}
        />
      </div>

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