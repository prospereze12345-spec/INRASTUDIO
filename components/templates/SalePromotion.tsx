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

      <div
        className="absolute inset-0 pointer-events-none opacity-[0.035]"
        style={{
          backgroundImage: `
            linear-gradient(${colors.secondary} 1px, transparent 1px),
            linear-gradient(90deg, ${colors.secondary} 1px, transparent 1px)
          `,
          backgroundSize: "calc(8*var(--ci)) calc(8*var(--ci))",
        }}
      />

      <div
        className="absolute right-[calc(7*var(--ci))] top-0 bottom-0 w-[calc(0.15*var(--ci))] pointer-events-none"
        style={{
          backgroundColor: colors.accent,
          opacity: 0.25,
        }}
      />

      <header
        className="
          relative
          z-20
          flex
          items-center
          justify-between
          px-[calc(5*var(--ci))]
          pt-[calc(4*var(--ci))]
          pb-[calc(2*var(--ci))]
        "
      >
        <div className="flex items-center gap-[calc(2*var(--ci))]">
          <div
            className="
              flex
              items-center
              justify-center
              w-[calc(6*var(--ci))]
              h-[calc(6*var(--ci))]
              rounded-[calc(1.5*var(--ci))]
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
              text-[calc(2.4*var(--ci))]
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
            text-[calc(1.8*var(--ci))]
            tracking-[0.08em]
            uppercase
            opacity-45
          "
        />
      </header>

      <main className="relative z-10 h-[calc(100%-calc(11*var(--ci)))] px-[calc(5*var(--ci))] pb-[calc(4*var(--ci))]">
        <div className="relative h-full">

          <div
            className="
              absolute
              right-0
              top-[calc(4*var(--ci))]
              bottom-[calc(9*var(--ci))]
              w-[58%]
              overflow-hidden
              rounded-[calc(4*var(--ci))]
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

            {badgeText && (
              <div
                className="
                  absolute
                  top-[calc(4*var(--ci))]
                  right-[calc(4*var(--ci))]
                  px-[calc(3*var(--ci))]
                  py-[calc(1.7*var(--ci))]
                  rounded-full
                  flex
                  items-center
                  gap-[calc(1.2*var(--ci))]
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
                    text-[calc(2*var(--ci))]
                    font-black
                    uppercase
                    tracking-[0.08em]
                  "
                />
              </div>
            )}
          </div>

          <section
            className="
              absolute
              left-0
              top-[calc(3*var(--ci))]
              z-20
              w-[57%]
              flex
              flex-col
            "
          >

            <div
              className="
                flex
                items-center
                gap-[calc(1.8*var(--ci))]
                mb-[calc(3*var(--ci))]
              "
            >
              <div
                className="w-[calc(5*var(--ci))] h-[calc(0.3*var(--ci))]"
                style={{
                  backgroundColor: colors.accent,
                }}
              />

              <span
                className="
                  text-[calc(1.8*var(--ci))]
                  uppercase
                  tracking-[0.22em]
                  font-bold
                  opacity-50
                "
              >
                Limited offer
              </span>
            </div>

            <h1
              className="
                font-black
                uppercase
                tracking-[-0.055em]
                leading-[0.84]
                text-[calc(10.5*var(--ci))]
                max-w-[calc(55*var(--ci))]
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

            <EditableText
              as="p"
              fieldId="sale-subtext"
              editable={editable}
              value={subtext}
              onChange={(v) => update("subtext", v)}
              onFocusEl={onFocusEl}
              onBlurEl={onBlurEl}
              className="
                mt-[calc(3*var(--ci))]
                text-[calc(2.35*var(--ci))]
                leading-[1.45]
                opacity-55
                max-w-[calc(40*var(--ci))]
              "
            />

            {safeFeatures.length > 0 && (
              <div className="mt-[calc(3.5*var(--ci))] flex flex-col gap-[calc(1.3*var(--ci))]">
                {safeFeatures.map((feature, index) => (
                  <div
                    key={index}
                    className="
                      flex
                      items-center
                      gap-[calc(1.5*var(--ci))]
                    "
                  >
                    <span
                      className="
                        flex
                        items-center
                        justify-center
                        shrink-0
                        rounded-full
                        w-[calc(3.5*var(--ci))]
                        h-[calc(3.5*var(--ci))]
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
                        onUpdateFeature?.(index, v);
                        const updated = [...safeFeatures];
                        updated[index] = v;
                        update("features", updated.join("\n"));
                      }}
                      onFocusEl={onFocusEl}
                      onBlurEl={onBlurEl}
                      className="
                        text-[calc(2*var(--ci))]
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

            <div
              className="
                mt-[calc(4*var(--ci))]
                w-[calc(48*var(--ci))]
                rounded-[calc(3*var(--ci))]
                p-[calc(3*var(--ci))]
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
                    text-[calc(1.5*var(--ci))]
                    uppercase
                    tracking-[0.18em]
                    opacity-45
                    mb-[calc(1*var(--ci))]
                  "
                >
                  Special price
                </div>

                <div className="flex items-end gap-[calc(2*var(--ci))]">

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
                          text-[calc(7*var(--ci))]
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
                          text-[calc(2.3*var(--ci))]
                          line-through
                          opacity-35
                          pb-[calc(0.7*var(--ci))]
                        "
                      />
                    )}
                </div>
              </div>

              <div
                className="
                  flex
                  items-center
                  justify-center
                  w-[calc(8*var(--ci))]
                  h-[calc(8*var(--ci))]
                  rounded-[calc(2*var(--ci))]
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

          <div
            className="
              absolute
              left-0
              bottom-0
              z-30
              flex
              items-center
              gap-[calc(2*var(--ci))]
            "
          >
            <div
              className="
                inline-flex
                items-center
                gap-[calc(2*var(--ci))]
                px-[calc(4*var(--ci))]
                py-[calc(2.2*var(--ci))]
                rounded-full
                font-black
                uppercase
                tracking-[0.12em]
                text-[calc(2.1*var(--ci))]
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
                  text-[calc(1.7*var(--ci))]
                  opacity-40
                  max-w-[calc(20*var(--ci))]
                "
              />
            )}
          </div>

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
    <div className="flex items-center gap-[calc(1*var(--ci))]">

      <span
        className="
          flex
          items-center
          justify-center
          w-[calc(3.5*var(--ci))]
          h-[calc(3.5*var(--ci))]
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
          text-[calc(1.45*var(--ci))]
          opacity-45
          whitespace-nowrap
        "
      />

    </div>
  );
}