"use client";

import React from "react";
import Image from "next/image";
import { ArrowUpRight, Check, Sparkles } from "lucide-react";

import { EditableText } from "@/components/EditableText";
import { EditableHeadlineLines } from "@/components/Editableheadlinelines";
import {
  ContactBar,
  WhyChooseUsList,
} from "./FlyerContentBlocks";

// ============================================================================
// Types
// ============================================================================

export interface SalePromotionProps {
  name?: string;

  headline: string;
  subtext: string;
  ctaText: string;

  badgeText?: string;
  extraText?: string;

  productImage: string;

  brandName?: string;
  website?: string;
  phone?: string;
  email?: string;

  price?: string;
  oldPrice?: string;

  features?: string[];
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

  colors: {
    primary: string;
    secondary: string;
    accent: string;
  };

  editable?: boolean;

  onUpdate?: (field: string, value: string) => void;

  onFocusEl?: (el: HTMLElement) => void;
  onBlurEl?: () => void;
}

// ============================================================================
// Helpers
// ============================================================================

function safeArray(values?: string[]) {
  return (values ?? [])
    .filter(
      (value): value is string =>
        typeof value === "string" && value.trim().length > 0
    )
    .slice(0, 4);
}

function rgba(hex: string, alpha: number) {
  if (!hex) {
    return `rgba(0,0,0,${alpha})`;
  }

  const value = hex.replace("#", "");

  if (value.length !== 6) {
    return hex;
  }

  const r = parseInt(value.slice(0, 2), 16);
  const g = parseInt(value.slice(2, 4), 16);
  const b = parseInt(value.slice(4, 6), 16);

  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

// ============================================================================
// Template entry
// ============================================================================

export function SalePromotionTemplate(props: SalePromotionProps) {
  const {
    headline,
    productImage,
    colors,
  } = props;

  if (!headline || !productImage || !colors) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-neutral-100 text-sm text-neutral-400">
        Loading template...
      </div>
    );
  }

  return <ModernSalesPromotion {...props} />;
}

// ============================================================================
// Main template
// ============================================================================

function ModernSalesPromotion({
  headline,
  subtext,
  ctaText,

  productImage,

  brandName,
  website,
  phone,
  email,

  features,

  whyChooseUs,
  onUpdateWhyChooseUs,
  onAddWhyChooseUs,
  onRemoveWhyChooseUs,

  whyChooseUsVisible,

  phoneVisible,
  emailVisible,
  websiteVisible,

  onRemovePhone,
  onRemoveEmail,
  onRemoveWebsite,

  onRestorePhone,
  onRestoreEmail,
  onRestoreWebsite,

  colors,

  editable,

  onUpdate,
  onFocusEl,
  onBlurEl,
}: SalePromotionProps) {
  const safeFeatures = safeArray(features);

  const update = (field: string, value: string) => {
    onUpdate?.(field, value);
  };

  return (
    <div
      data-flyer-template="sale-promotion"
      className="
        relative
        isolate
        h-full
        w-full
        overflow-hidden
        font-sans
        antialiased
      "
      style={{
        backgroundColor: colors.primary,
        color: colors.secondary,
      }}
    >
      {/* ================================================================== */}
      {/* BACKGROUND                                                         */}
      {/* ================================================================== */}

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background: `
            linear-gradient(
              135deg,
              ${colors.primary} 0%,
              ${colors.primary} 72%,
              ${rgba(colors.accent, 0.08)} 100%
            )
          `,
        }}
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage: `
            linear-gradient(${colors.secondary} 1px, transparent 1px),
            linear-gradient(90deg, ${colors.secondary} 1px, transparent 1px)
          `,
          backgroundSize:
            "calc(8 * var(--ci)) calc(8 * var(--ci))",
        }}
      />

      {/* Right decorative rail */}
      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          right-[calc(3*var(--ci))]
          top-[calc(3*var(--ci))]
          bottom-[calc(3*var(--ci))]
          w-px
        "
        style={{
          backgroundColor: colors.accent,
          opacity: 0.14,
        }}
      />

      {/* ================================================================== */}
      {/* HEADER                                                             */}
      {/* ================================================================== */}

      <header
        className="
          absolute
          left-[calc(5*var(--ci))]
          right-[calc(5*var(--ci))]
          top-[calc(3*var(--ci))]
          z-40
          flex
          items-center
          justify-between
        "
      >
        {/* Brand */}
        <div
          className="
            flex
            min-w-0
            items-center
            gap-[calc(1.6*var(--ci))]
          "
        >
          <div
            className="
              flex
              shrink-0
              items-center
              justify-center
              rounded-full
            "
            style={{
              width: "calc(5 * var(--ci))",
              height: "calc(5 * var(--ci))",
              backgroundColor: colors.accent,
              color: colors.primary,
            }}
          >
            <Sparkles
              style={{
                width: "calc(2.6 * var(--ci))",
                height: "calc(2.6 * var(--ci))",
              }}
              strokeWidth={2.5}
            />
          </div>

          <EditableText
            as="p"
            fieldId="sale-brand"
            editable={editable}
            value={brandName ?? ""}
            onChange={(value) =>
              update("brandName", value)
            }
            onFocusEl={onFocusEl}
            onBlurEl={onBlurEl}
            className="
              min-w-0
              truncate
              font-black
              uppercase
              tracking-[0.02em]
            "
            style={{
              fontSize: "calc(2.3 * var(--ci))",
            }}
          />
        </div>

        {/* Website */}
        {website && (
          <EditableText
            as="p"
            fieldId="sale-website"
            editable={editable}
            value={website}
            onChange={(value) =>
              update("website", value)
            }
            onFocusEl={onFocusEl}
            onBlurEl={onBlurEl}
            className="
              min-w-0
              max-w-[30%]
              truncate
              uppercase
              tracking-[0.08em]
              opacity-50
            "
            style={{
              fontSize: "calc(1.65 * var(--ci))",
            }}
          />
        )}
      </header>

      {/* ================================================================== */}
      {/* MAIN CONTENT                                                       */}
      {/* ================================================================== */}

      <main
        className="
          absolute
          inset-x-0
          top-[calc(9*var(--ci))]
          bottom-[calc(9*var(--ci))]
        "
      >
        {/* ================================================================= */}
        {/* LEFT CONTENT                                                      */}
        {/* ================================================================= */}

        <section
          className="
            absolute
            left-[calc(5*var(--ci))]
            top-[calc(1.5*var(--ci))]
            z-30
            w-[53%]
          "
        >
          {/* --------------------------------------------------------------- */}
          {/* HEADLINE                                                        */}
          {/* --------------------------------------------------------------- */}

          <h1
            className="
              m-0
              max-w-full
              font-black
              uppercase
              tracking-[-0.055em]
              leading-[0.84]
            "
            style={{
              fontSize:
                "clamp(30px, calc(8.7 * var(--ci)), 108px)",
            }}
          >
            <EditableHeadlineLines
              value={headline}
              editable={editable}
              onChange={(value) =>
                update("headline", value)
              }
              onFocusEl={onFocusEl}
              onBlurEl={onBlurEl}
              renderLine={(line, index, node) => (
                <span
                  className="block"
                  key={`${line}-${index}`}
                  style={
                    index === 1
                      ? {
                          color: colors.secondary,
                        }
                      : undefined
                  }
                >
                  {node}
                </span>
              )}
            />
          </h1>

          {/* --------------------------------------------------------------- */}
          {/* SUBTEXT                                                         */}
          {/* --------------------------------------------------------------- */}

          {subtext && (
            <EditableText
              as="p"
              fieldId="sale-subtext"
              editable={editable}
              value={subtext}
              onChange={(value) =>
                update("subtext", value)
              }
              onFocusEl={onFocusEl}
              onBlurEl={onBlurEl}
              className="
                mt-[calc(1.8*var(--ci))]
                max-w-[88%]
                leading-[1.3]
                opacity-60
              "
              style={{
                fontSize: "calc(1.85 * var(--ci))",
              }}
            />
          )}

          {/* --------------------------------------------------------------- */}
          {/* FEATURES                                                         */}
          {/* --------------------------------------------------------------- */}

          {safeFeatures.length > 0 && (
            <section
              data-flyer-block="features"
              className="
                mt-[calc(3.2*var(--ci))]
                flex
                max-w-[82%]
                flex-col
              "
              style={{
                gap: "calc(1.25 * var(--ci))",
              }}
            >
              <h3
                className="
                  m-0
                  font-black
                  tracking-[0.15em]
                "
                style={{
                  color: colors.accent,
                  fontSize: "calc(2.25 * var(--ci))",
                }}
              >
                FEATURES
              </h3>

              {safeFeatures.map((feature, index) => (
                <div
                  key={`sale-feature-${index}`}
                  className="
                    group
                    flex
                    min-w-0
                    items-center
                  "
                  style={{
                    gap: "calc(1.1 * var(--ci))",
                  }}
                >
                  <span
                    className="
                      flex
                      shrink-0
                      items-center
                      justify-center
                      rounded-full
                    "
                    style={{
                      width: "calc(2.7 * var(--ci))",
                      height: "calc(2.7 * var(--ci))",
                      backgroundColor:
                        rgba(colors.accent, 0.14),
                    }}
                  >
                    <Check
                      style={{
                        width: "calc(1.6 * var(--ci))",
                        height: "calc(1.6 * var(--ci))",
                        color: colors.accent,
                      }}
                      strokeWidth={3}
                    />
                  </span>

                  <EditableText
                    as="span"
                    fieldId={`sale-feature-${index}`}
                    editable={editable}
                    value={feature}
                    onChange={(value) => {
                      update(
                        "features",
                        safeFeatures
                          .map((item, itemIndex) =>
                            itemIndex === index
                              ? value
                              : item
                          )
                          .join("\n")
                      );
                    }}
                    onFocusEl={onFocusEl}
                    onBlurEl={onBlurEl}
                    className="
                      min-w-0
                      flex-1
                      leading-[1.15]
                    "
                    style={{
                      fontSize:
                        "calc(1.7 * var(--ci))",
                    }}
                  />
                </div>
              ))}
            </section>
          )}

          {/* --------------------------------------------------------------- */}
          {/* WHY CHOOSE US                                                    */}
          {/* --------------------------------------------------------------- */}

          <div
            className="
              mt-[calc(3.2*var(--ci))]
              max-w-[82%]
            "
          >
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
            />
          </div>
        </section>

        {/* ================================================================= */}
        {/* PRODUCT IMAGE — RIGHT                                             */}
        {/* ================================================================= */}

        <div
          className="
            pointer-events-none
            absolute
            right-[-1%]
            top-[calc(1*var(--ci))]
            z-10
            h-[72%]
            w-[45%]
          "
        >
          {/* Image glow */}
          <div
            aria-hidden="true"
            className="
              absolute
              right-[8%]
              top-[12%]
              h-[55%]
              w-[72%]
              rounded-full
              blur-3xl
            "
            style={{
              backgroundColor: colors.accent,
              opacity: 0.08,
            }}
          />

          {/* Product */}
          <div className="absolute inset-0">
            <Image
              src={productImage}
              alt="Product"
              fill
              priority
              crossOrigin="anonymous"
              sizes="45vw"
              className="
                object-contain
                object-right
              "
            />
          </div>
        </div>

        {/* ================================================================= */}
        {/* CTA — RIGHT / LOWER                                               */}
        {/* ================================================================= */}

        <div
          className="
            absolute
            right-[calc(5*var(--ci))]
            bottom-[calc(2.5*var(--ci))]
            z-40
            max-w-[43%]
          "
        >
          <div
            className="
              inline-flex
              max-w-full
              items-center
              gap-[calc(1.2*var(--ci))]
              rounded-full
              px-[calc(3*var(--ci))]
              py-[calc(1.6*var(--ci))]
              font-black
              uppercase
              tracking-[0.08em]
            "
            style={{
              backgroundColor: colors.accent,
              color: colors.primary,
              fontSize:
                "calc(1.65 * var(--ci))",
            }}
          >
            <EditableText
              as="span"
              fieldId="sale-cta"
              editable={editable}
              value={ctaText}
              onChange={(value) =>
                update("ctaText", value)
              }
              onFocusEl={onFocusEl}
              onBlurEl={onBlurEl}
              className="leading-[1.1]"
            />

            <ArrowUpRight
              className="shrink-0"
              style={{
                width: "calc(2.2 * var(--ci))",
                height: "calc(2.2 * var(--ci))",
              }}
              strokeWidth={3}
            />
          </div>
        </div>

        {/* ================================================================= */}
        {/* CONTACT BAR                                                       */}
        {/* ================================================================= */}

        <div
          className="
            absolute
            bottom-0
            left-[calc(5*var(--ci))]
            right-[calc(5*var(--ci))]
            z-50
          "
        >
          <ContactBar
            phone={phone}
            website={website}
            email={email}
            accentColor={colors.accent}
            textColor={colors.secondary}
            editable={editable}
            onUpdatePhone={(value) =>
              update("phone", value)
            }
            onUpdateWebsite={(value) =>
              update("website", value)
            }
            onUpdateEmail={(value) =>
              update("email", value)
            }
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
      </main>
    </div>
  );
}