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

/* -------------------------------------------------------------------------- */
/* Helpers                                                                    */
/* -------------------------------------------------------------------------- */

function safeString(value?: string) {
  return typeof value === "string" ? value.trim() : "";
}

/* -------------------------------------------------------------------------- */
/* Template                                                                   */
/* -------------------------------------------------------------------------- */

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

/* -------------------------------------------------------------------------- */
/* Main variant                                                               */
/* -------------------------------------------------------------------------- */

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
    .map(safeString)
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
      {/* ------------------------------------------------------------------ */}
      {/* Background                                                         */}
      {/* ------------------------------------------------------------------ */}

      <BackgroundDecoration colors={colors} />

      {/* ------------------------------------------------------------------ */}
      {/* Header                                                             */}
      {/* ------------------------------------------------------------------ */}

      <SaleHeader
        brandName={brandName}
        website={website}
        editable={editable}
        onUpdate={update}
        onFocusEl={onFocusEl}
        onBlurEl={onBlurEl}
        colors={colors}
      />

      {/* ------------------------------------------------------------------ */}
      {/* Main layout                                                        */}
      {/* ------------------------------------------------------------------ */}

      <main
        className="
          absolute
          inset-x-0
          bottom-0
          top-[calc(13*var(--ci))]
          overflow-hidden
        "
      >
        <div
          className="
            relative
            h-full
            w-full
            px-[calc(5*var(--ci))]
            pb-[calc(4*var(--ci))]
          "
        >
          {/* ============================================================ */}
          {/* PRODUCT VISUAL                                               */}
          {/* ============================================================ */}

          <ProductVisual
            productImage={productImage}
            badgeText={badgeText}
            editable={editable}
            onUpdate={update}
            onFocusEl={onFocusEl}
            onBlurEl={onBlurEl}
            colors={colors}
          />

          {/* ============================================================ */}
          {/* CONTENT                                                       */}
          {/* ============================================================ */}

          <section
            className="
              absolute
              left-[calc(5*var(--ci))]
              top-[calc(4*var(--ci))]
              z-20
              flex
              w-[52%]
              max-w-[52%]
              flex-col
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
                  w-[calc(4.5*var(--ci))]
                  shrink-0
                "
                style={{
                  backgroundColor: colors.accent,
                }}
              />

              <span
                className="
                  text-[calc(1.65*var(--ci))]
                  font-bold
                  uppercase
                  tracking-[0.2em]
                  opacity-50
                "
              >
                Limited offer
              </span>
            </div>

            {/* Headline */}

            <h1
              className="
                m-0
                max-w-full
                font-black
                uppercase
                leading-[0.84]
                tracking-[-0.055em]
                text-[clamp(2.1rem,10.5cqw,8rem)]
              "
            >
              <EditableHeadlineLines
                value={headline}
                editable={editable}
                onChange={(value) => update("headline", value)}
                onFocusEl={onFocusEl}
                onBlurEl={onBlurEl}
                renderLine={(line, index, node) => (
                  <span
                    className="block"
                    style={
                      index % 2 === 1
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

            {safeString(subtext) && (
              <EditableText
                as="p"
                fieldId="sale-subtext"
                editable={editable}
                value={subtext}
                onChange={(value) => update("subtext", value)}
                onFocusEl={onFocusEl}
                onBlurEl={onBlurEl}
                className="
                  mt-[calc(2.5*var(--ci))]
                  max-w-[95%]
                  text-[clamp(0.72rem,2.25cqw,1.5rem)]
                  leading-[1.4]
                  opacity-55
                "
              />
            )}

            {/* Features */}

            {safeFeatures.length > 0 && (
              <div
                className="
                  mt-[calc(2.5*var(--ci))]
                  flex
                  flex-col
                  gap-[calc(1*var(--ci))]
                "
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
                        h-[calc(3*var(--ci))]
                        w-[calc(3*var(--ci))]
                        shrink-0
                        items-center
                        justify-center
                        rounded-full
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
                      onChange={(value) => {
                        onUpdateFeature?.(index, value);

                        const updated = [...safeFeatures];
                        updated[index] = value;

                        update("features", updated.join("\n"));
                      }}
                      onFocusEl={onFocusEl}
                      onBlurEl={onBlurEl}
                      className="
                        min-w-0
                        text-[clamp(0.65rem,1.85cqw,1.2rem)]
                        font-medium
                        leading-[1.25]
                        opacity-75
                      "
                    />
                  </div>
                ))}
              </div>
            )}

            {/* Why choose us */}

            <div className="mt-[calc(1.5*var(--ci))]">
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

            {/* Price */}

            <PriceCard
              price={price}
              oldPrice={oldPrice}
              editable={editable}
              onUpdate={update}
              onFocusEl={onFocusEl}
              onBlurEl={onBlurEl}
              colors={colors}
            />
          </section>

          {/* ============================================================ */}
          {/* BOTTOM ACTIONS                                               */}
          {/* ============================================================ */}

          <div
            className="
              absolute
              bottom-[calc(4*var(--ci))]
              left-[calc(5*var(--ci))]
              right-[calc(5*var(--ci))]
              z-30
              flex
              min-w-0
              items-end
              justify-between
              gap-[calc(3*var(--ci))]
            "
          >
            {/* CTA */}

            <div className="min-w-0 shrink-0">
              <SaleCTA
                value={ctaText}
                editable={editable}
                onChange={(value) => update("ctaText", value)}
                onFocusEl={onFocusEl}
                onBlurEl={onBlurEl}
                colors={colors}
              />
            </div>

            {/* Extra text */}

            {safeString(extraText) && (
              <EditableText
                as="span"
                fieldId="sale-extra"
                editable={editable}
                value={extraText ?? ""}
                onChange={(value) => update("extraText", value)}
                onFocusEl={onFocusEl}
                onBlurEl={onBlurEl}
                className="
                  min-w-0
                  max-w-[25%]
                  text-right
                  text-[clamp(0.55rem,1.45cqw,1rem)]
                  leading-[1.25]
                  opacity-40
                "
              />
            )}

            {/* Contact */}

            <div
              className="
                ml-auto
                min-w-0
                max-w-[42%]
                overflow-hidden
              "
            >
              <ContactBar
                phone={phone}
                website={website}
                email={email}
                accentColor={colors.accent}
                textColor={colors.secondary}
                editable={editable}
                onUpdatePhone={(value) => update("phone", value)}
                onUpdateWebsite={(value) => update("website", value)}
                onUpdateEmail={(value) => update("email", value)}
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
      </main>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Background                                                                 */
/* -------------------------------------------------------------------------- */

function BackgroundDecoration({
  colors,
}: {
  colors: SalePromotionProps["colors"];
}) {
  return (
    <>
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: `
            linear-gradient(
              135deg,
              ${colors.primary} 0%,
              ${colors.primary} 60%,
              ${colors.accent}08 100%
            )
          `,
        }}
      />

      <div
        className="pointer-events-none absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage: `
            linear-gradient(
              ${colors.secondary} 1px,
              transparent 1px
            ),
            linear-gradient(
              90deg,
              ${colors.secondary} 1px,
              transparent 1px
            )
          `,
          backgroundSize:
            "calc(8*var(--ci)) calc(8*var(--ci))",
        }}
      />

      <div
        className="
          pointer-events-none
          absolute
          right-[calc(5*var(--ci))]
          top-0
          bottom-0
          w-px
        "
        style={{
          backgroundColor: colors.accent,
          opacity: 0.25,
        }}
      />
    </>
  );
}

/* -------------------------------------------------------------------------- */
/* Header                                                                     */
/* -------------------------------------------------------------------------- */

function SaleHeader({
  brandName,
  website,
  editable,
  onUpdate,
  onFocusEl,
  onBlurEl,
  colors,
}: {
  brandName?: string;
  website?: string;
  editable?: boolean;
  onUpdate: (field: string, value: string) => void;
  onFocusEl?: (el: HTMLElement) => void;
  onBlurEl?: () => void;
  colors: SalePromotionProps["colors"];
}) {
  return (
    <header
      className="
        relative
        z-30
        flex
        items-center
        justify-between
        gap-[calc(3*var(--ci))]
        px-[calc(5*var(--ci))]
        pt-[calc(4*var(--ci))]
      "
    >
      <div
        className="
          flex
          min-w-0
          items-center
          gap-[calc(1.7*var(--ci))]
        "
      >
        <div
          className="
            flex
            h-[calc(5.5*var(--ci))]
            w-[calc(5.5*var(--ci))]
            shrink-0
            items-center
            justify-center
            rounded-[calc(1.4*var(--ci))]
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
          onChange={(value) =>
            onUpdate("brandName", value)
          }
          onFocusEl={onFocusEl}
          onBlurEl={onBlurEl}
          className="
            min-w-0
            truncate
            text-[clamp(0.75rem,2.4cqw,1.5rem)]
            font-bold
            tracking-[-0.03em]
          "
        />
      </div>

      {safeString(website) && (
        <EditableText
          as="p"
          fieldId="sale-website"
          editable={editable}
          value={website ?? ""}
          onChange={(value) =>
            onUpdate("website", value)
          }
          onFocusEl={onFocusEl}
          onBlurEl={onBlurEl}
          className="
            min-w-0
            max-w-[38%]
            truncate
            text-[clamp(0.55rem,1.65cqw,1rem)]
            uppercase
            tracking-[0.08em]
            opacity-45
          "
        />
      )}
    </header>
  );
}

/* -------------------------------------------------------------------------- */
/* Product visual                                                             */
/* -------------------------------------------------------------------------- */

function ProductVisual({
  productImage,
  badgeText,
  editable,
  onUpdate,
  onFocusEl,
  onBlurEl,
  colors,
}: {
  productImage: string;
  badgeText?: string;
  editable?: boolean;
  onUpdate: (field: string, value: string) => void;
  onFocusEl?: (el: HTMLElement) => void;
  onBlurEl?: () => void;
  colors: SalePromotionProps["colors"];
}) {
  return (
    <div
      className="
        absolute
        right-[calc(5*var(--ci))]
        top-[calc(3*var(--ci))]
        bottom-[calc(11*var(--ci))]
        z-10
        w-[53%]
        overflow-hidden
        rounded-[calc(4*var(--ci))]
      "
      style={{
        backgroundColor: `${colors.secondary}08`,
      }}
    >
      {/* Product image is centered rather than cropped. */}

      <div className="absolute inset-[5%]">
        <Image
          src={productImage}
          alt="Product"
          fill
          priority
          crossOrigin="anonymous"
          sizes="53vw"
          className="
            object-contain
            object-center
          "
        />
      </div>

      {/* Left blending gradient */}

      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: `
            linear-gradient(
              90deg,
              ${colors.primary} 0%,
              ${colors.primary}bb 14%,
              ${colors.primary}30 36%,
              transparent 58%
            )
          `,
        }}
      />

      {/* Bottom blending */}

      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[32%]"
        style={{
          background: `
            linear-gradient(
              to top,
              ${colors.primary}66,
              transparent
            )
          `,
        }}
      />

      {/* Badge */}

      {safeString(badgeText) && (
        <div
          className="
            absolute
            right-[calc(3*var(--ci))]
            top-[calc(3*var(--ci))]
            z-20
            flex
            max-w-[60%]
            items-center
            gap-[calc(1*var(--ci))]
            rounded-full
            px-[calc(2.5*var(--ci))]
            py-[calc(1.4*var(--ci))]
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
            className="shrink-0"
          />

          <EditableText
            as="span"
            fieldId="sale-badge"
            editable={editable}
            value={badgeText ?? ""}
            onChange={(value) =>
              onUpdate("badgeText", value)
            }
            onFocusEl={onFocusEl}
            onBlurEl={onBlurEl}
            className="
              min-w-0
              truncate
              text-[clamp(0.55rem,1.8cqw,1rem)]
              font-black
              uppercase
              tracking-[0.08em]
            "
          />
        </div>
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Price card                                                                 */
/* -------------------------------------------------------------------------- */

function PriceCard({
  price,
  oldPrice,
  editable,
  onUpdate,
  onFocusEl,
  onBlurEl,
  colors,
}: {
  price?: string;
  oldPrice?: string;
  editable?: boolean;
  onUpdate: (field: string, value: string) => void;
  onFocusEl?: (el: HTMLElement) => void;
  onBlurEl?: () => void;
  colors: SalePromotionProps["colors"];
}) {
  if (!safeString(price) && !safeString(oldPrice)) {
    return null;
  }

  return (
    <div
      className="
        mt-[calc(3*var(--ci))]
        flex
        w-full
        max-w-[95%]
        items-end
        justify-between
        gap-[calc(2*var(--ci))]
        rounded-[calc(2.5*var(--ci))]
        p-[calc(2.5*var(--ci))]
        shadow-2xl
      "
      style={{
        backgroundColor: colors.secondary,
        color: colors.primary,
      }}
    >
      <div className="min-w-0">
        <div
          className="
            mb-[calc(0.7*var(--ci))]
            text-[clamp(0.45rem,1.35cqw,0.8rem)]
            uppercase
            tracking-[0.18em]
            opacity-45
          "
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
          {safeString(price) && (
            <EditableText
              as="p"
              fieldId="sale-price"
              editable={editable}
              value={price ?? ""}
              onChange={(value) =>
                onUpdate("price", value)
              }
              onFocusEl={onFocusEl}
              onBlurEl={onBlurEl}
              className="
                min-w-0
                truncate
                text-[clamp(1.4rem,6.5cqw,4rem)]
                font-black
                leading-none
                tracking-[-0.05em]
              "
            />
          )}

          {safeString(oldPrice) && (
            <EditableText
              as="p"
              fieldId="sale-old-price"
              editable={editable}
              value={oldPrice ?? ""}
              onChange={(value) =>
                onUpdate("oldPrice", value)
              }
              onFocusEl={onFocusEl}
              onBlurEl={onBlurEl}
              className="
                shrink-0
                pb-[calc(0.5*var(--ci))]
                text-[clamp(0.65rem,2cqw,1.2rem)]
                line-through
                opacity-35
              "
            />
          )}
        </div>
      </div>

      <div
        className="
          flex
          h-[calc(6.5*var(--ci))]
          w-[calc(6.5*var(--ci))]
          shrink-0
          items-center
          justify-center
          rounded-[calc(1.8*var(--ci))]
        "
        style={{
          backgroundColor: colors.accent,
          color: colors.primary,
        }}
      >
        <ArrowUpRight
          size={19}
          strokeWidth={2.5}
        />
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* CTA                                                                        */
/* -------------------------------------------------------------------------- */

function SaleCTA({
  value,
  editable,
  onChange,
  onFocusEl,
  onBlurEl,
  colors,
}: {
  value: string;
  editable?: boolean;
  onChange?: (value: string) => void;
  onFocusEl?: (el: HTMLElement) => void;
  onBlurEl?: () => void;
  colors: SalePromotionProps["colors"];
}) {
  return (
    <div
      className="
        inline-flex
        max-w-full
        items-center
        gap-[calc(1.5*var(--ci))]
        rounded-full
        px-[calc(3.2*var(--ci))]
        py-[calc(1.8*var(--ci))]
        text-[clamp(0.6rem,1.8cqw,1.1rem)]
        font-black
        uppercase
        tracking-[0.1em]
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
        value={value}
        onChange={onChange}
        onFocusEl={onFocusEl}
        onBlurEl={onBlurEl}
        className="truncate"
      />

      <ArrowUpRight
        size={15}
        strokeWidth={3}
        className="shrink-0"
      />
    </div>
  );
}