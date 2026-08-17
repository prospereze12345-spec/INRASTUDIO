"use client";

import React from "react";
import Image from "next/image";
import {
  ArrowUpRight,
  Check,
  Sparkles,
  Tag,
} from "lucide-react";

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
    .filter((value): value is string => {
      return typeof value === "string" && value.trim().length > 0;
    })
    .slice(0, 4);
}

function rgba(hex: string, alpha: number) {
  if (!hex) return `rgba(0,0,0,${alpha})`;

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
// Template
// ============================================================================

export function SalePromotionTemplate(
  props: SalePromotionProps
) {
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
// Main Template
// ============================================================================

function ModernSalesPromotion({
  headline,
  subtext,
  ctaText,

  badgeText,
  extraText,

  productImage,

  brandName,
  website,
  phone,
  email,

  price,
  oldPrice,

  features,
  onUpdateFeature,
  onAddFeature,
  onRemoveFeature,

  whyChooseUs,
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
      className="
        @container
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
      {/* Background                                                         */}
      {/* ================================================================== */}

      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: `
            linear-gradient(
              135deg,
              ${colors.primary} 0%,
              ${colors.primary} 58%,
              ${rgba(colors.accent, 0.06)} 100%
            )
          `,
        }}
      />

      <div
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

      {/* Accent rail */}
      <div
        className="
          pointer-events-none
          absolute
          right-[calc(4*var(--ci))]
          top-0
          bottom-0
          w-px
        "
        style={{
          backgroundColor: colors.accent,
          opacity: 0.18,
        }}
      />

      {/* ================================================================== */}
      {/* Header                                                             */}
      {/* ================================================================== */}

      <header
        className="
          absolute
          left-[calc(5*var(--ci))]
          right-[calc(5*var(--ci))]
          top-0
          z-40
          flex
          items-center
          justify-between
          pt-[calc(4*var(--ci))]
        "
      >
        <div
          className="
            flex
            min-w-0
            items-center
            gap-[calc(1.8*var(--ci))]
          "
        >
          <div
            className="
              flex
              shrink-0
              items-center
              justify-center
              rounded-[calc(1.5*var(--ci))]
            "
            style={{
              width: "calc(6 * var(--ci))",
              height: "calc(6 * var(--ci))",
              backgroundColor: colors.accent,
              color: colors.primary,
            }}
          >
            <Sparkles
              style={{
                width: "calc(3 * var(--ci))",
                height: "calc(3 * var(--ci))",
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
              font-bold
              tracking-[-0.03em]
            "
            style={{
              fontSize: "calc(2.4 * var(--ci))",
            }}
          />
        </div>

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
              ml-[calc(3*var(--ci))]
              min-w-0
              max-w-[32%]
              truncate
              uppercase
              tracking-[0.08em]
              opacity-45
            "
            style={{
              fontSize: "calc(1.65 * var(--ci))",
            }}
          />
        )}
      </header>

      {/* ================================================================== */}
      {/* Main composition                                                   */}
      {/* ================================================================== */}

      <main
        className="
          absolute
          inset-x-0
          top-[calc(11*var(--ci))]
          bottom-0
        "
      >
        {/* ================================================================ */}
        {/* PRODUCT IMAGE — RIGHT SIDE                                      */}
        {/* ================================================================ */}

        <div
          className="
            absolute
            right-[calc(4*var(--ci))]
            top-[calc(8*var(--ci))]
            z-10
            h-[52%]
            w-[39%]
            overflow-visible
          "
        >
          {/* soft image backing */}
          <div
            className="
              absolute
              inset-[8%]
              rounded-[calc(6*var(--ci))]
            "
            style={{
              backgroundColor: rgba(
                colors.secondary,
                0.035
              ),
            }}
          />

          {/* actual product image */}
          <div className="absolute inset-0">
            <Image
              src={productImage}
              alt="Product"
              fill
              priority
              crossOrigin="anonymous"
              sizes="40vw"
              className="
                object-contain
                object-center
              "
            />
          </div>

          {/* subtle glow */}
          <div
            className="
              pointer-events-none
              absolute
              right-[5%]
              top-[10%]
              h-[45%]
              w-[70%]
              rounded-full
              blur-3xl
            "
            style={{
              backgroundColor: colors.accent,
              opacity: 0.07,
            }}
          />

          {/* Badge */}
          {badgeText && (
            <div
              className="
                absolute
                right-[calc(1*var(--ci))]
                top-[calc(2*var(--ci))]
                z-20
                flex
                max-w-[80%]
                items-center
                gap-[calc(1*var(--ci))]
                rounded-full
                px-[calc(2.5*var(--ci))]
                py-[calc(1.4*var(--ci))]
                shadow-lg
              "
              style={{
                backgroundColor: colors.accent,
                color: colors.primary,
              }}
            >
              <Tag
                style={{
                  width: "calc(2 * var(--ci))",
                  height: "calc(2 * var(--ci))",
                }}
                strokeWidth={2.5}
              />

              <EditableText
                as="span"
                fieldId="sale-badge"
                editable={editable}
                value={badgeText}
                onChange={(value) =>
                  update("badgeText", value)
                }
                onFocusEl={onFocusEl}
                onBlurEl={onBlurEl}
                className="
                  min-w-0
                  truncate
                  font-black
                  uppercase
                  tracking-[0.08em]
                "
                style={{
                  fontSize: "calc(1.7 * var(--ci))",
                }}
              />
            </div>
          )}
        </div>

        {/* ================================================================ */}
        {/* LEFT CONTENT                                                     */}
        {/* ================================================================ */}

        <section
          className="
            absolute
            left-[calc(5*var(--ci))]
            top-[calc(5*var(--ci))]
            z-30
            w-[54%]
          "
        >
          {/* Kicker */}
          <div
            className="
              mb-[calc(2.5*var(--ci))]
              flex
              items-center
              gap-[calc(1.5*var(--ci))]
            "
          >
            <span
              className="
                h-[calc(0.3*var(--ci))]
                w-[calc(5*var(--ci))]
                shrink-0
              "
              style={{
                backgroundColor: colors.accent,
              }}
            />

            <span
              className="
                uppercase
                font-bold
                tracking-[0.22em]
                opacity-50
              "
              style={{
                fontSize: "calc(1.65 * var(--ci))",
              }}
            >
              Limited offer
            </span>
          </div>

          {/* Headline */}
          <h1
            className="
              max-w-full
              font-black
              uppercase
              tracking-[-0.055em]
              leading-[0.84]
            "
            style={{
              fontSize:
                "clamp(28px, calc(9.2 * var(--ci)), 110px)",
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
                  style={
                    index === 1
                      ? {
                          color: colors.accent,
                        }
                      : undefined
                  }
                >
                  {node}
                </span>
              )}
            />
          </h1>

          {/* Subtext */}
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
              mt-[calc(2.8*var(--ci))]
              max-w-[88%]
              leading-[1.4]
              opacity-55
            "
            style={{
              fontSize: "calc(2.05 * var(--ci))",
            }}
          />

          {/* ============================================================ */}
          {/* FEATURES                                                      */}
          {/* ============================================================ */}

          {safeFeatures.length > 0 && (
            <div
              className="
                mt-[calc(3*var(--ci))]
                flex
                flex-col
              "
              style={{
                gap: "calc(1.2 * var(--ci))",
              }}
            >
              {safeFeatures.map((feature, index) => (
                <div
                  key={`sale-feature-${index}`}
                  className="
                    flex
                    min-w-0
                    items-center
                    gap-[calc(1.2*var(--ci))]
                  "
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
                      width: "calc(3 * var(--ci))",
                      height: "calc(3 * var(--ci))",
                      backgroundColor:
                        rgba(colors.accent, 0.12),
                    }}
                  >
                    <Check
                      style={{
                        width:
                          "calc(1.7 * var(--ci))",
                        height:
                          "calc(1.7 * var(--ci))",
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
                      onUpdateFeature?.(
                        index,
                        value
                      );

                      const updated = [
                        ...safeFeatures,
                      ];

                      updated[index] = value;

                      update(
                        "features",
                        updated.join("\n")
                      );
                    }}
                    onFocusEl={onFocusEl}
                    onBlurEl={onBlurEl}
                    className="
                      min-w-0
                      flex-1
                      leading-tight
                      opacity-75
                    "
                    style={{
                      fontSize:
                        "calc(1.75 * var(--ci))",
                    }}
                  />
                </div>
              ))}
            </div>
          )}

          {/* ============================================================ */}
          {/* WHY CHOOSE US                                                 */}
          {/* ============================================================ */}

          <div className="mt-[calc(1*var(--ci))]">
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
              onRestoreSection={
                onRestoreWhyChooseUs
              }
            />
          </div>
        </section>

        {/* ================================================================ */}
        {/* PRICE / CTA — LOWER LEFT                                        */}
        {/* ================================================================ */}

        <div
          className="
            absolute
            bottom-[calc(12*var(--ci))]
            left-[calc(5*var(--ci))]
            z-30
            w-[54%]
          "
        >
          <div
            className="
              flex
              w-full
              items-end
              justify-between
              gap-[calc(2*var(--ci))]
              rounded-[calc(3*var(--ci))]
              p-[calc(2.5*var(--ci))]
            "
            style={{
              backgroundColor: colors.secondary,
              color: colors.primary,
            }}
          >
            {/* Price */}
            <div className="min-w-0">
              <div
                className="
                  mb-[calc(0.8*var(--ci))]
                  uppercase
                  tracking-[0.16em]
                  opacity-45
                "
                style={{
                  fontSize:
                    "calc(1.35 * var(--ci))",
                }}
              >
                Special price
              </div>

              <div
                className="
                  flex
                  min-w-0
                  items-end
                  gap-[calc(1.5*var(--ci))]
                "
              >
                {price && (
                  <EditableText
                    as="p"
                    fieldId="sale-price"
                    editable={editable}
                    value={price}
                    onChange={(value) =>
                      update("price", value)
                    }
                    onFocusEl={onFocusEl}
                    onBlurEl={onBlurEl}
                    className="
                      min-w-0
                      truncate
                      font-black
                      leading-none
                      tracking-[-0.05em]
                    "
                    style={{
                      fontSize:
                        "calc(5.8 * var(--ci))",
                    }}
                  />
                )}

                {oldPrice && (
                  <EditableText
                    as="p"
                    fieldId="sale-old-price"
                    editable={editable}
                    value={oldPrice}
                    onChange={(value) =>
                      update(
                        "oldPrice",
                        value
                      )
                    }
                    onFocusEl={onFocusEl}
                    onBlurEl={onBlurEl}
                    className="
                      shrink-0
                      pb-[calc(0.5*var(--ci))]
                      line-through
                      opacity-35
                    "
                    style={{
                      fontSize:
                        "calc(1.9 * var(--ci))",
                    }}
                  />
                )}
              </div>
            </div>

            {/* Arrow */}
            <div
              className="
                flex
                shrink-0
                items-center
                justify-center
                rounded-[calc(1.5*var(--ci))]
              "
              style={{
                width: "calc(6 * var(--ci))",
                height: "calc(6 * var(--ci))",
                backgroundColor: colors.accent,
                color: colors.primary,
              }}
            >
              <ArrowUpRight
                style={{
                  width:
                    "calc(3 * var(--ci))",
                  height:
                    "calc(3 * var(--ci))",
                }}
                strokeWidth={2.5}
              />
            </div>
          </div>
        </div>

        {/* ================================================================ */}
        {/* CTA — BOTTOM LEFT                                               */}
        {/* ================================================================ */}

        <div
          className="
            absolute
            bottom-[calc(3*var(--ci))]
            left-[calc(5*var(--ci))]
            z-40
          "
        >
          <div
            className="
              inline-flex
              max-w-full
              items-center
              gap-[calc(1.5*var(--ci))]
              rounded-full
              px-[calc(3.2*var(--ci))]
              py-[calc(1.7*var(--ci))]
              font-black
              uppercase
              tracking-[0.1em]
            "
            style={{
              backgroundColor: colors.accent,
              color: colors.primary,
              fontSize:
                "calc(1.75 * var(--ci))",
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
              className="truncate"
            />

            <ArrowUpRight
              style={{
                width:
                  "calc(2.2 * var(--ci))",
                height:
                  "calc(2.2 * var(--ci))",
              }}
              strokeWidth={3}
            />
          </div>
        </div>

        {/* ================================================================ */}
        {/* EXTRA TEXT                                                      */}
        {/* ================================================================ */}

        {extraText && (
          <EditableText
            as="span"
            fieldId="sale-extra"
            editable={editable}
            value={extraText}
            onChange={(value) =>
              update("extraText", value)
            }
            onFocusEl={onFocusEl}
            onBlurEl={onBlurEl}
            className="
              absolute
              bottom-[calc(3.7*var(--ci))]
              left-[calc(31*var(--ci))]
              z-30
              max-w-[20%]
              truncate
              opacity-40
            "
            style={{
              fontSize:
                "calc(1.35 * var(--ci))",
            }}
          />
        )}

        {/* ================================================================ */}
        {/* CONTACT BAR — FULL WIDTH BOTTOM                                */}
        {/* ================================================================ */}

        <div
          className="
            absolute
            bottom-[calc(0.8*var(--ci))]
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