"use client";

import React, { useMemo } from "react";
import Image from "next/image";
import { ShoppingBag } from "lucide-react";

import {
  FeatureList,
  ContactBar,
  parseFlyerContent,
  WhyChooseUsList,
} from "./FlyerContentBlocks";

import { EditableText } from "@/components/EditableText";
import { EditableHeadlineLines } from "@/components/Editableheadlinelines";
import { touchTarget } from "@/lib/responsive";

// ============================================================================
// RESPONSIVE CANVAS SCALE
// ============================================================================

const cq = (n: number) =>
  `clamp(${n * 1.5}px, ${n}cqi, ${n * 12}px)`;

// ============================================================================
// TYPES
// ============================================================================

export interface PremiumBrandProps {
  name?: string;

  headline: string;
  subtext: string;
  ctaText: string;

  badgeText?: string;
  extraText?: string;

  productImage: string;

  brandName?: string;
  website?: string;
  price?: string;

  phone?: string;
  email?: string;

  colors: {
    primary: string;
    secondary: string;
    accent: string;
  };

  editable?: boolean;

  onUpdate?: (field: string, value: string) => void;

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

  features?: string[];
  onUpdateFeature?: (index: number, value: string) => void;
  onAddFeature?: () => void;
  onRemoveFeature?: (index: number) => void;
}

// ============================================================================
// HELPERS
// ============================================================================

function hexToRgba(hex: string, alpha: number) {
  if (!hex) return `rgba(0,0,0,${alpha})`;

  const value = hex.replace("#", "");

  if (value.length !== 6) return hex;

  const r = parseInt(value.slice(0, 2), 16);
  const g = parseInt(value.slice(2, 4), 16);
  const b = parseInt(value.slice(4, 6), 16);

  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

// ============================================================================
// MAIN TEMPLATE
// ============================================================================

export function PremiumBrandTemplate(props: PremiumBrandProps) {
  const { headline, productImage, colors } = props;

  if (!headline || !productImage || !colors) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-neutral-100 text-neutral-400 text-sm">
        Loading template...
      </div>
    );
  }

  const name = props.name || "Digital Agency";

  switch (name) {
    case "Digital Agency":
      return <VariantDigitalAgency {...props} />;

    case "Premium Gold":
      return <VariantPremiumGold {...props} />;

    default:
      return <VariantDigitalAgency {...props} />;
  }
}

// ============================================================================
// CTA
// ============================================================================

function SmartCTA({
  value,
  editable,
  onUpdate,
  onFocusEl,
  onBlurEl,
  colors,
  rounded = true,
  leadingIcon = false,
}: {
  value: string;
  editable?: boolean;
  onUpdate?: (field: string, value: string) => void;
  onFocusEl?: (el: HTMLElement) => void;
  onBlurEl?: () => void;
  colors: PremiumBrandProps["colors"];
  rounded?: boolean;
  leadingIcon?: boolean;
}) {
  return (
    <div
      className={`inline-flex items-center font-semibold uppercase ${
        rounded ? "rounded-2xl" : ""
      }`}
      style={{
        ...touchTarget,

        paddingLeft: leadingIcon ? cq(1.4) : cq(4),
        paddingRight: cq(4),

        paddingTop: cq(1.4),
        paddingBottom: cq(1.4),

        gap: cq(1.8),

        fontSize: cq(1.8),
        lineHeight: 1.25,
        letterSpacing: "0.06em",

        maxWidth: "100%",

        backgroundColor: colors.accent,
        color: colors.primary,

        boxShadow: `0 ${cq(1)} ${cq(3)} ${hexToRgba(
          colors.accent,
          0.2
        )}`,
      }}
    >
      {leadingIcon && (
        <span
          className="flex shrink-0 items-center justify-center rounded-full"
          style={{
            width: cq(4.2),
            height: cq(4.2),

            backgroundColor: colors.primary,
            color: colors.accent,
          }}
        >
          <ShoppingBag
            style={{
              width: cq(2),
              height: cq(2),
            }}
          />
        </span>
      )}

      <EditableText
        as="span"
        fieldId="f-cta"
        editable={editable}
        value={value}
        onChange={(v) => onUpdate?.("ctaText", v)}
        onFocusEl={onFocusEl}
        onBlurEl={onBlurEl}
        className="min-w-0"
      />

      <span
        className="shrink-0 opacity-60"
        style={{
          fontSize: cq(2.2),
        }}
      >
        →
      </span>
    </div>
  );
}

// ============================================================================
// DISCOUNT BURST
// ============================================================================

function DiscountBurst({
  text,
  colors,
}: {
  text?: string;
  colors: PremiumBrandProps["colors"];
}) {
  if (!text) return null;

  return (
    <div
      className="absolute z-30 flex items-center justify-center text-center font-black uppercase"
      style={{
        top: cq(5),
        right: cq(4),

        width: cq(13),
        height: cq(13),

        padding: cq(2),

        backgroundColor: colors.accent,
        color: colors.primary,

        clipPath:
          "polygon(50% 0%, 61% 8%, 72% 2%, 78% 14%, 91% 12%, 89% 26%, 100% 34%, 91% 44%, 97% 57%, 85% 63%, 89% 77%, 75% 78%, 70% 92%, 58% 85%, 48% 100%, 39% 88%, 26% 95%, 22% 81%, 8% 82%, 12% 68%, 0% 60%, 9% 49%, 2% 36%, 14% 29%, 10% 15%, 24% 16%, 30% 3%, 41% 10%)",

        filter: `drop-shadow(0 ${cq(1)} ${cq(2.5)} ${hexToRgba(
          colors.accent,
          0.25
        )})`,
      }}
    >
      <span
        style={{
          fontSize: cq(2.5),
          lineHeight: 0.95,
          maxWidth: "75%",
        }}
      >
        {text}
      </span>
    </div>
  );
}

// ============================================================================
// 1. DIGITAL AGENCY
// ============================================================================

function VariantDigitalAgency({
  headline,
  subtext,
  ctaText,
  badgeText,
  extraText,
  productImage,
  brandName,
  website,
  price,
  phone,
  email,
  colors,
  editable,
  onUpdate,
  onFocusEl,
  onBlurEl,
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
}: PremiumBrandProps) {
  const parsed = useMemo(
    () => parseFlyerContent(badgeText, extraText),
    [badgeText, extraText]
  );

  return (
    <div
      className="@container relative w-full h-full overflow-hidden font-sans"
      style={{
        backgroundColor: colors.primary,
        color: colors.secondary,
      }}
    >
      {/* ================================================================== */}
      {/* SUBTLE BACKGROUND DETAIL */}
      {/* ================================================================== */}

      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: `
            radial-gradient(
              circle at 88% 35%,
              ${hexToRgba(colors.accent, 0.08)} 0%,
              transparent 32%
            )
          `,
        }}
      />

      {/* ================================================================== */}
      {/* HEADER */}
      {/* ================================================================== */}

      <header
        className="relative z-40 flex items-center justify-between"
        style={{
          paddingLeft: cq(6),
          paddingRight: cq(6),
          paddingTop: cq(4.5),
        }}
      >
        <div
          className="flex items-center min-w-0"
          style={{
            gap: cq(2),
          }}
        >
          {/* Brand mark */}
          <span
            className="flex shrink-0 items-center justify-center rounded-full"
            style={{
              width: cq(6.2),
              height: cq(6.2),

              backgroundColor: hexToRgba(colors.accent, 0.16),
              color: colors.accent,

              fontSize: cq(2.7),
              fontWeight: 700,
            }}
          >
            ✦
          </span>

          <EditableText
            as="span"
            fieldId="f-brand"
            editable={editable}
            value={brandName ?? ""}
            onChange={(v) => onUpdate?.("brandName", v)}
            onFocusEl={onFocusEl}
            onBlurEl={onBlurEl}
            className="font-bold uppercase tracking-[0.08em] truncate"
            style={{
              fontSize: cq(2.1),
            }}
          />
        </div>

        {website && (
          <EditableText
            as="span"
            fieldId="f-web-top"
            editable={editable}
            value={website}
            onChange={(v) => onUpdate?.("website", v)}
            onFocusEl={onFocusEl}
            onBlurEl={onBlurEl}
            className="shrink-0 opacity-50"
            style={{
              fontSize: cq(1.55),
              letterSpacing: "0.03em",
            }}
          />
        )}
      </header>

      {/* ================================================================== */}
      {/* MAIN CONTENT */}
      {/* ================================================================== */}

      <main
        className="relative z-10"
        style={{
          minHeight: `calc(100% - ${cq(16)})`,

          paddingLeft: cq(6),
          paddingRight: cq(6),
          paddingTop: cq(4),
          paddingBottom: cq(4),
        }}
      >
        {/* ================================================================ */}
        {/* PRODUCT IMAGE */}
        {/* ================================================================ */}

        <section
          className="absolute pointer-events-none"
          style={{
            right: "-1%",
            top: cq(2),

            width: "54%",
            height: "78%",

            zIndex: 1,
          }}
        >
          {/* Very subtle image grounding */}
          <div
            className="absolute"
            style={{
              right: "9%",
              bottom: "3%",

              width: "72%",
              height: "18%",

              borderRadius: "50%",

              backgroundColor: hexToRgba(colors.secondary, 0.08),

              filter: `blur(${cq(2)})`,
              transform: "scaleX(1.05)",
            }}
          />

          <Image
            src={productImage}
            alt=""
            fill
            priority
            crossOrigin="anonymous"
            draggable={false}
            sizes="55vw"
            className="object-contain object-right-bottom"
            style={{
              filter: "drop-shadow(0 12px 20px rgba(0,0,0,0.08))",
            }}
          />

          <DiscountBurst
            text={parsed.badge}
            colors={colors}
          />
        </section>

        {/* ================================================================ */}
        {/* LEFT CONTENT */}
        {/* ================================================================ */}

        <section
          className="relative z-20 flex flex-col"
          style={{
            width: "55%",
            minHeight: "78%",

            paddingTop: cq(4),
            paddingBottom: cq(3),

            gap: cq(3),
          }}
        >
          {/* -------------------------------------------------------------- */}
          {/* HEADLINE */}
          {/* -------------------------------------------------------------- */}

          <div>
            <h1
              className="font-semibold uppercase"
              style={{
                fontSize: "clamp(1.7rem, 8.1cqi, 88px)",

                lineHeight: 0.86,
                letterSpacing: "-0.055em",

                maxWidth: "100%",
              }}
            >
              <EditableHeadlineLines
                value={headline}
                editable={editable}
                onChange={(v) => onUpdate?.("headline", v)}
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
          </div>

          {/* -------------------------------------------------------------- */}
          {/* SUBTEXT */}
          {/* -------------------------------------------------------------- */}

          <EditableText
            as="p"
            fieldId="f-sub"
            editable={editable}
            value={subtext}
            onChange={(v) => onUpdate?.("subtext", v)}
            onFocusEl={onFocusEl}
            onBlurEl={onBlurEl}
            className="leading-[1.45] opacity-60"
            style={{
              fontSize: cq(2.15),
              maxWidth: "72%",
            }}
          />

          {/* -------------------------------------------------------------- */}
          {/* INFORMATION */}
          {/* -------------------------------------------------------------- */}

          <div
            className="flex flex-col"
            style={{
              gap: cq(3),
              marginTop: cq(1),
            }}
          >
            <FeatureList
              features={parsed.features.slice(0, 3)}
              colors={colors}
              editable={editable}
              onUpdateFeature={(index, value) =>
                onUpdate?.(
                  "badgeText",
                  parsed.updateFeature(index, value)
                )
              }
              onAddFeature={() =>
                onUpdate?.("badgeText", parsed.addFeature())
              }
              onRemoveFeature={(index) =>
                onUpdate?.(
                  "badgeText",
                  parsed.removeFeature(index)
                )
              }
              onFocusEl={onFocusEl}
              onBlurEl={onBlurEl}
              visible={featuresVisible}
              onRestoreSection={onRestoreFeatures}
            />

            <WhyChooseUsList
              items={whyChooseUs?.slice(0, 3)}
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

          {/* -------------------------------------------------------------- */}
          {/* CTA / PRICE */}
          {/* -------------------------------------------------------------- */}

          <div
            className="mt-auto flex flex-col items-start"
            style={{
              gap: cq(2),
              paddingTop: cq(2),
            }}
          >
            {price && (
              <EditableText
                as="p"
                fieldId="f-price"
                editable={editable}
                value={price}
                onChange={(v) => onUpdate?.("price", v)}
                onFocusEl={onFocusEl}
                onBlurEl={onBlurEl}
                className="font-bold tracking-tight"
                style={{
                  color: colors.accent,
                  fontSize: cq(5),
                  lineHeight: 0.9,
                }}
              />
            )}

            <SmartCTA
              value={ctaText}
              editable={editable}
              onUpdate={onUpdate}
              onFocusEl={onFocusEl}
              onBlurEl={onBlurEl}
              colors={colors}
              leadingIcon
            />
          </div>
        </section>
      </main>

      {/* ================================================================== */}
      {/* CONTACT BAR */}
      {/* ================================================================== */}

      <footer
        className="absolute left-0 right-0 bottom-0 z-50"
        style={{
          paddingLeft: cq(6),
          paddingRight: cq(6),
          paddingBottom: cq(4),
        }}
      >
        <ContactBar
          phone={phone}
          website={website}
          email={email}
          accentColor={colors.accent}
          textColor={colors.secondary}
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
      </footer>
    </div>
  );
}

// ============================================================================
// 2. PREMIUM GOLD
// ============================================================================

function VariantPremiumGold({
  headline,
  subtext,
  ctaText,
  website,
  productImage,
  brandName,
  price,
  badgeText,
  extraText,
  phone,
  email,
  colors,
  editable,
  onUpdate,
  onFocusEl,
  onBlurEl,
  phoneVisible,
  emailVisible,
  websiteVisible,
  onRemovePhone,
  onRemoveEmail,
  onRemoveWebsite,
  onRestorePhone,
  onRestoreEmail,
  onRestoreWebsite,
}: PremiumBrandProps) {
  const parsed = useMemo(
    () => parseFlyerContent(badgeText, extraText),
    [badgeText, extraText]
  );

  return (
    <div
      className="@container relative w-full h-full overflow-hidden font-serif flex flex-col"
      style={{
        backgroundColor: colors.primary,
        color: colors.secondary,
      }}
    >
      {/* Elegant border */}
      <div
        className="absolute pointer-events-none"
        style={{
          inset: cq(4),

          border: `1px solid ${hexToRgba(
            colors.accent,
            0.35
          )}`,
        }}
      />

      {/* ================================================================ */}
      {/* HEADER */}
      {/* ================================================================ */}

      <header
        className="relative z-20 text-center shrink-0"
        style={{
          paddingTop: cq(6),
        }}
      >
        <EditableText
          as="p"
          fieldId="f-brand"
          editable={editable}
          value={brandName ?? ""}
          onChange={(v) => onUpdate?.("brandName", v)}
          onFocusEl={onFocusEl}
          onBlurEl={onBlurEl}
          className="uppercase tracking-[0.45em] opacity-55"
          style={{
            fontSize: cq(2.2),
          }}
        />

        <div
          className="flex justify-center items-center"
          style={{
            gap: cq(2),
            marginTop: cq(2),
          }}
        >
          <span
            className="h-px"
            style={{
              width: cq(10),
              backgroundColor: hexToRgba(
                colors.accent,
                0.4
              ),
            }}
          />

          <span
            className="rotate-45"
            style={{
              width: cq(0.9),
              height: cq(0.9),
              backgroundColor: colors.accent,
            }}
          />

          <span
            className="h-px"
            style={{
              width: cq(10),
              backgroundColor: hexToRgba(
                colors.accent,
                0.4
              ),
            }}
          />
        </div>
      </header>

      {/* ================================================================ */}
      {/* CONTENT */}
      {/* ================================================================ */}

      <div
        className="flex-1 relative min-h-0"
        style={{
          paddingLeft: cq(8),
          paddingRight: cq(8),
          paddingTop: cq(4),
          paddingBottom: cq(5),
        }}
      >
        {/* Headline */}
        <div className="text-center relative z-20 shrink-0">
          <h1
            className="font-medium uppercase"
            style={{
              fontSize: "clamp(1.4rem, 7.5cqi, 88px)",
              lineHeight: 0.9,
              letterSpacing: "-0.04em",
            }}
          >
            <EditableHeadlineLines
              value={headline}
              editable={editable}
              onChange={(v) => onUpdate?.("headline", v)}
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
        </div>

        {/* Product */}
        <div
          className="relative flex-1"
          style={{
            minHeight: cq(30),
            marginTop: cq(2),
            marginBottom: cq(2),
          }}
        >
          <Image
            src={productImage}
            alt=""
            fill
            priority
            crossOrigin="anonymous"
            draggable={false}
            sizes="80vw"
            className="object-contain"
          />

          {parsed.badge && (
            <DiscountBurst
              text={parsed.badge}
              colors={colors}
            />
          )}
        </div>

        {/* Bottom content */}
        <div className="shrink-0">
          <div
            className="w-full h-px"
            style={{
              marginBottom: cq(3),
              backgroundColor: hexToRgba(
                colors.accent,
                0.25
              ),
            }}
          />

          <div className="flex items-end justify-between gap-3">
            <div className="max-w-[55%] min-w-0">
              {price && (
                <EditableText
                  as="p"
                  fieldId="f-price"
                  editable={editable}
                  value={price}
                  onChange={(v) =>
                    onUpdate?.("price", v)
                  }
                  onFocusEl={onFocusEl}
                  onBlurEl={onBlurEl}
                  className="font-medium leading-none"
                  style={{
                    color: colors.accent,
                    fontSize: cq(5.5),
                  }}
                />
              )}

              <EditableText
                as="p"
                fieldId="f-sub"
                editable={editable}
                value={subtext}
                onChange={(v) =>
                  onUpdate?.("subtext", v)
                }
                onFocusEl={onFocusEl}
                onBlurEl={onBlurEl}
                className="leading-[1.4] opacity-50"
                style={{
                  marginTop: cq(1),
                  fontSize: cq(1.85),
                }}
              />
            </div>

            <SmartCTA
              value={ctaText}
              editable={editable}
              onUpdate={onUpdate}
              onFocusEl={onFocusEl}
              onBlurEl={onBlurEl}
              colors={colors}
              rounded={false}
            />
          </div>

          <div
            style={{
              marginTop: cq(2.5),
            }}
          >
            <ContactBar
              phone={phone}
              website={website}
              email={email}
              accentColor={colors.accent}
              textColor={colors.secondary}
              editable={editable}
              onUpdatePhone={(v) =>
                onUpdate?.("phone", v)
              }
              onUpdateWebsite={(v) =>
                onUpdate?.("website", v)
              }
              onUpdateEmail={(v) =>
                onUpdate?.("email", v)
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
        </div>
      </div>
    </div>
  );
}