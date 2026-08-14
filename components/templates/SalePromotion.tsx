"use client";

import React from "react";
import Image from "next/image";
import {
  ArrowUpRight,
  Check,
  Phone,
  Mail,
  Globe,
  Tag,
  Sparkles,
} from "lucide-react";

import { EditableText } from "@/components/EditableText";
import { EditableHeadlineLines } from "@/components/Editableheadlinelines";
import { WhyChooseUsList, ContactBar } from "./FlyerContentBlocks";

/* ============================================================================
   SALE PROMOTION — MODERN EDITORIAL / CANVA STYLE
   ----------------------------------------------------------------------------
   Design direction:
   - Editorial product photography
   - Floating offer card
   - Strong typographic hierarchy
   - Rounded modern UI details
   - Controlled accent color
   - No repetitive "split-screen flyer" composition
   - Fully editable text
============================================================================ */

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

/* ============================================================================
   MAIN TEMPLATE
============================================================================ */

export function SalePromotionTemplate(props: SalePromotionProps) {
  if (
    !props.headline ||
    !props.productImage ||
    !props.colors
  ) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400 text-sm">
        Loading template...
      </div>
    );
  }

  return <ModernSalesPromotion {...props} />;
}

/* ============================================================================
   MAIN DESIGN
============================================================================ */
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
  const safeFeatures = (features ?? [])
    .filter(Boolean)
    .slice(0, 4);

  const update = (field: string, value: string) => {
    onUpdate?.(field, value);
  };

  return (
    <div
      className="
        @container
        relative
        w-full
        h-full
        overflow-hidden
        font-sans
        antialiased
      "
      style={{
        backgroundColor: colors.primary,
        color: colors.secondary,
      }}
    >
      {/* ====================================================================
         BACKGROUND
      ==================================================================== */}

      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            linear-gradient(
              135deg,
              ${colors.primary} 0%,
              ${colors.primary} 58%,
              ${colors.accent}08 100%
            )
          `,
        }}
      />

      {/* subtle editorial grid */}

      <div
        className="absolute inset-0 pointer-events-none opacity-[0.035]"
        style={{
          backgroundImage: `
            linear-gradient(${colors.secondary} 1px, transparent 1px),
            linear-gradient(90deg, ${colors.secondary} 1px, transparent 1px)
          `,
          backgroundSize: "8cqi 8cqi",
        }}
      />

      {/* Accent vertical line */}

      <div
        className="absolute right-[7cqi] top-0 bottom-0 w-[0.15cqi] pointer-events-none"
        style={{
          backgroundColor: colors.accent,
          opacity: 0.25,
        }}
      />

      {/* ====================================================================
         TOP NAV / BRAND
      ==================================================================== */}

      <header
        className="
          relative
          z-20
          flex
          items-center
          justify-between
          px-[5cqi]
          pt-[4cqi]
          pb-[2cqi]
        "
      >
        <div className="flex items-center gap-[2cqi]">
          {/* Brand mark */}

          <div
            className="
              flex
              items-center
              justify-center
              w-[6cqi]
              h-[6cqi]
              rounded-[1.5cqi]
              shrink-0
            "
            style={{
              backgroundColor: colors.accent,
              color: colors.primary,
            }}
          >
            <Sparkles
              size={18}
              strokeWidth={2.5}
            />
          </div>

          <EditableText
            as="p"
            fieldId="sale-brand"
            editable={editable}
            value={brandName ?? ""}
            onChange={(v) => update("brandName", v)}
            onFocusEl={onFocusEl}
            onBlurEl={onBlurEl}
            className="
              text-[2.4cqi]
              font-bold
              tracking-[-0.03em]
            "
          />
        </div>

        <EditableText
          as="p"
          fieldId="sale-website"
          editable={editable}
          value={website ?? ""}
          onChange={(v) => update("website", v)}
          onFocusEl={onFocusEl}
          onBlurEl={onBlurEl}
          className="
            text-[1.8cqi]
            tracking-[0.08em]
            uppercase
            opacity-45
          "
        />
      </header>

      {/* ====================================================================
         MAIN CANVAS
      ==================================================================== */}

      <main className="relative z-10 h-[calc(100%-11cqi)] px-[5cqi] pb-[4cqi]">
        <div className="relative h-full">

          {/* ================================================================
             PRODUCT PHOTOGRAPHY
          ================================================================ */}

          <div
            className="
              absolute
              right-0
              top-[4cqi]
              bottom-[9cqi]
              w-[58%]
              overflow-hidden
              rounded-[4cqi]
            "
            style={{
              backgroundColor: `${colors.secondary}08`,
            }}
          >
            <Image
              src={productImage}
              alt="Product"
              fill
              priority
              crossOrigin="anonymous"
              className="
                object-cover
                object-center
              "
            />

            {/* Image treatment */}

            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: `
                  linear-gradient(
                    90deg,
                    ${colors.primary} 0%,
                    ${colors.primary}22 28%,
                    transparent 58%
                  )
                `,
              }}
            />

            {/* Image bottom fade */}

            <div
              className="absolute inset-x-0 bottom-0 h-[28%]"
              style={{
                background: `
                  linear-gradient(
                    to top,
                    ${colors.primary}55,
                    transparent
                  )
                `,
              }}
            />

            {/* ============================================================
               FLOATING SALE TAG
            ============================================================ */}

            {badgeText && (
              <div
                className="
                  absolute
                  top-[4cqi]
                  right-[4cqi]
                  px-[3cqi]
                  py-[1.7cqi]
                  rounded-full
                  flex
                  items-center
                  gap-[1.2cqi]
                  shadow-xl
                "
                style={{
                  backgroundColor: colors.accent,
                  color: colors.primary,
                }}
              >
                <Tag
                  size={13}
                  strokeWidth={2.5}
                />

                <EditableText
                  as="span"
                  fieldId="sale-badge"
                  editable={editable}
                  value={badgeText}
                  onChange={(v) => update("badgeText", v)}
                  onFocusEl={onFocusEl}
                  onBlurEl={onBlurEl}
                  className="
                    text-[2cqi]
                    font-black
                    uppercase
                    tracking-[0.08em]
                  "
                />
              </div>
            )}
          </div>

          {/* ================================================================
             LEFT EDITORIAL CONTENT
          ================================================================ */}

          <section
            className="
              absolute
              left-0
              top-[3cqi]
              z-20
              w-[57%]
              flex
              flex-col
            "
          >

            {/* eyebrow */}

            <div
              className="
                flex
                items-center
                gap-[1.8cqi]
                mb-[3cqi]
              "
            >
              <div
                className="w-[5cqi] h-[0.3cqi]"
                style={{
                  backgroundColor: colors.accent,
                }}
              />

              <span
                className="
                  text-[1.8cqi]
                  uppercase
                  tracking-[0.22em]
                  font-bold
                  opacity-50
                "
              >
                Limited offer
              </span>
            </div>

            {/* ============================================================
               HEADLINE
            ============================================================ */}

            <h1
              className="
                font-black
                uppercase
                tracking-[-0.055em]
                leading-[0.84]
                text-[10.5cqi]
                max-w-[55cqi]
              "
            >
              <EditableHeadlineLines
                value={headline}
                editable={editable}
                onChange={(v) => update("headline", v)}
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

            {/* ============================================================
               DESCRIPTION
            ============================================================ */}

            <EditableText
              as="p"
              fieldId="sale-subtext"
              editable={editable}
              value={subtext}
              onChange={(v) => update("subtext", v)}
              onFocusEl={onFocusEl}
              onBlurEl={onBlurEl}
              className="
                mt-[3cqi]
                text-[2.35cqi]
                leading-[1.45]
                opacity-55
                max-w-[40cqi]
              "
            />

            {/* ============================================================
               FEATURE LIST
            ============================================================ */}

            {safeFeatures.length > 0 && (
              <div className="mt-[3.5cqi] flex flex-col gap-[1.3cqi]">
                {safeFeatures.map((feature, index) => (
                  <div
                    key={index}
                    className="
                      flex
                      items-center
                      gap-[1.5cqi]
                    "
                  >
                    <span
                      className="
                        flex
                        items-center
                        justify-center
                        shrink-0
                        rounded-full
                        w-[3.5cqi]
                        h-[3.5cqi]
                      "
                      style={{
                        backgroundColor: `${colors.accent}20`,
                      }}
                    >
                      <Check
                        size={11}
                        strokeWidth={3}
                        style={{
                          color: colors.accent,
                        }}
                      />
                    </span>

                    <EditableText
                      as="span"
                      fieldId={`sale-feature-${index}`}
                      editable={editable}
                      value={feature}
                      onChange={(v) => {
                        // Update the feature at this index
                        onUpdateFeature?.(index, v);
                        // Also update the full features string in the parent state
                        const updated = [...safeFeatures];
                        updated[index] = v;
                        update("features", updated.join("\n"));
                      }}
                      onFocusEl={onFocusEl}
                      onBlurEl={onBlurEl}
                      className="
                        text-[2cqi]
                        font-medium
                        opacity-75
                      "
                    />
                  </div>
                ))}
              </div>
            )}

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

            {/* ============================================================
               OFFER CARD
            ============================================================ */}

            <div
              className="
                mt-[4cqi]
                w-[48cqi]
                rounded-[3cqi]
                p-[3cqi]
                flex
                items-end
                justify-between
                shadow-2xl
              "
              style={{
                backgroundColor: colors.secondary,
                color: colors.primary,
              }}
            >

              <div>

                <div
                  className="
                    text-[1.5cqi]
                    uppercase
                    tracking-[0.18em]
                    opacity-45
                    mb-[1cqi]
                  "
                >
                  Special price
                </div>

                <div className="flex items-end gap-[2cqi]">

                  {price !== undefined &&
                    price !== "" && (
                      <EditableText
                        as="p"
                        fieldId="sale-price"
                        editable={editable}
                        value={price}
                        onChange={(v) =>
                          update("price", v)
                        }
                        onFocusEl={onFocusEl}
                        onBlurEl={onBlurEl}
                        className="
                          text-[7cqi]
                          font-black
                          leading-none
                          tracking-[-0.05em]
                        "
                      />
                    )}

                  {oldPrice !== undefined &&
                    oldPrice !== "" && (
                      <EditableText
                        as="p"
                        fieldId="sale-old-price"
                        editable={editable}
                        value={oldPrice}
                        onChange={(v) =>
                          update("oldPrice", v)
                        }
                        onFocusEl={onFocusEl}
                        onBlurEl={onBlurEl}
                        className="
                          text-[2.3cqi]
                          line-through
                          opacity-35
                          pb-[0.7cqi]
                        "
                      />
                    )}
                </div>
              </div>

              {/* CTA */}

              <div
                className="
                  flex
                  items-center
                  justify-center
                  w-[8cqi]
                  h-[8cqi]
                  rounded-[2cqi]
                  shrink-0
                "
                style={{
                  backgroundColor: colors.accent,
                  color: colors.primary,
                }}
              >
                <ArrowUpRight
                  size={20}
                  strokeWidth={2.5}
                />
              </div>
            </div>
          </section>

          {/* ================================================================
             BOTTOM CTA
          ================================================================ */}

          <div
            className="
              absolute
              left-0
              bottom-0
              z-30
              flex
              items-center
              gap-[2cqi]
            "
          >
            <div
              className="
                inline-flex
                items-center
                gap-[2cqi]
                px-[4cqi]
                py-[2.2cqi]
                rounded-full
                font-black
                uppercase
                tracking-[0.12em]
                text-[2.1cqi]
              "
              style={{
                backgroundColor: colors.accent,
                color: colors.primary,
              }}
            >
              <EditableText
                as="span"
                fieldId="sale-cta"
                editable={editable}
                value={ctaText}
                onChange={(v) =>
                  update("ctaText", v)
                }
                onFocusEl={onFocusEl}
                onBlurEl={onBlurEl}
              />

              <ArrowUpRight
                size={15}
                strokeWidth={3}
              />
            </div>

            {extraText && (
              <EditableText
                as="span"
                fieldId="sale-extra"
                editable={editable}
                value={extraText}
                onChange={(v) =>
                  update("extraText", v)
                }
                onFocusEl={onFocusEl}
                onBlurEl={onBlurEl}
                className="
                  text-[1.7cqi]
                  opacity-40
                  max-w-[20cqi]
                "
              />
            )}
          </div>

          {/* ================================================================
             CONTACT INFORMATION
          ================================================================ */}

          <div
            className="
              absolute
              right-0
              bottom-0
              z-30
            "
          >
            <ContactBar
              phone={phone}
              website={website}
              email={email}
              accentColor={colors.accent}
              textColor={colors.secondary}
              editable={editable}
              onUpdatePhone={(v) => update("phone", v)}
              onUpdateWebsite={(v) => update("website", v)}
              onUpdateEmail={(v) => update("email", v)}
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
      </main>
    </div>
  );
}

// Helper component (unchanged)
function ContactMini({
  icon,
  value,
  fieldId,
  editable,
  onChange,
  onFocusEl,
  onBlurEl,
  colors,
}: {
  icon: React.ReactNode;
  value: string;
  fieldId: string;
  editable?: boolean;
  onChange?: (value: string) => void;
  onFocusEl?: (el: HTMLElement) => void;
  onBlurEl?: () => void;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
  };
}) {
  return (
    <div className="flex items-center gap-[1cqi]">

      <span
        className="
          flex
          items-center
          justify-center
          w-[3.5cqi]
          h-[3.5cqi]
          rounded-full
        "
        style={{
          backgroundColor: `${colors.accent}18`,
          color: colors.accent,
        }}
      >
        {icon}
      </span>

      <EditableText
        as="span"
        fieldId={fieldId}
        editable={editable}
        value={value}
        onChange={onChange}
        onFocusEl={onFocusEl}
        onBlurEl={onBlurEl}
        className="
          text-[1.45cqi]
          opacity-45
          whitespace-nowrap
        "
      />

    </div>
  );
}