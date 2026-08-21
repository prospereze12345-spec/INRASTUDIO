"use client";

import React from "react";
import Image from "next/image";
import { ShoppingBag } from "lucide-react";

import {
  FeatureList,
  ContactBar,
  WhyChooseUsList,
} from "./FlyerContentBlocks";

import { EditableText } from "@/components/EditableText";
import { EditableHeadlineLines } from "@/components/Editableheadlinelines";
import { touchTarget } from "@/lib/responsive";

// ============================================================================
// CANVAS SCALE
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
  ctaVisible?: boolean; // <-- NEW: CTA visibility toggle

  badgeText?: string;
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

  // Backend-provided content
  features?: string[];
  whyChooseUs?: string[];

  // Section visibility
  featuresVisible?: boolean;
  whyChooseUsVisible?: boolean;

  phoneVisible?: boolean;
  emailVisible?: boolean;
  websiteVisible?: boolean;

  // Section restore
  onRestoreFeatures?: () => void;
  onRestoreWhyChooseUs?: () => void;

  // Contact visibility
  onRemovePhone?: () => void;
  onRemoveEmail?: () => void;
  onRemoveWebsite?: () => void;

  onRestorePhone?: () => void;
  onRestoreEmail?: () => void;
  onRestoreWebsite?: () => void;

  // Feature editing
  onUpdateFeature?: (index: number, value: string) => void;
  onAddFeature?: () => void;
  onRemoveFeature?: (index: number) => void;

  // Why choose us editing
  onUpdateWhyChooseUs?: (index: number, value: string) => void;
  onAddWhyChooseUs?: () => void;
  onRemoveWhyChooseUs?: (index: number) => void;

  // Legacy compatibility
  extraText?: string;
}

// ============================================================================
// HELPERS
// ============================================================================

function hexToRgba(hex: string, alpha: number) {
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
// MAIN TEMPLATE
// ============================================================================

export function PremiumBrandTemplate(props: PremiumBrandProps) {
  const {
    headline,
    productImage,
    colors,
  } = props;

  if (!headline || !productImage || !colors) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-neutral-100 text-neutral-400 text-sm">
        Loading template...
      </div>
    );
  }

  const templateName = props.name || "Digital Agency";

  switch (templateName) {
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

interface SmartCTAProps {
  value: string;
  editable?: boolean;
  onUpdate?: (field: string, value: string) => void;
  onFocusEl?: (el: HTMLElement) => void;
  onBlurEl?: () => void;
  colors: PremiumBrandProps["colors"];
}

function SmartCTA({
  value,
  editable,
  onUpdate,
  onFocusEl,
  onBlurEl,
  colors,
}: SmartCTAProps) {
  return (
    <div
      className="inline-flex shrink-0 items-center font-semibold tracking-[0.06em] uppercase rounded-2xl transition-transform hover:scale-[1.02] active:scale-[0.98]"
      style={{
        ...touchTarget,
        paddingLeft: cq(3),
        paddingRight: cq(3.5),
        paddingTop: cq(1.2),
        paddingBottom: cq(1.2),
        gap: cq(1.5),
        fontSize: cq(1.7),
        lineHeight: 1.2,
        maxWidth: "100%",
        backgroundColor: colors.accent,
        color: colors.primary,
        boxShadow: `0 ${cq(0.6)} ${cq(2)} ${hexToRgba(
          colors.accent,
          0.2
        )}`,
      }}
    >
      <span
        className="flex shrink-0 items-center justify-center rounded-full"
        style={{
          width: cq(3.5),
          height: cq(3.5),
          backgroundColor: colors.primary,
          color: colors.accent,
        }}
      >
        <ShoppingBag
          style={{
            width: cq(1.8),
            height: cq(1.8),
          }}
        />
      </span>

      <EditableText
        as="span"
        fieldId="f-cta"
        editable={editable}
        value={value}
        onChange={(value) => onUpdate?.("ctaText", value)}
        onFocusEl={onFocusEl}
        onBlurEl={onBlurEl}
        className="whitespace-nowrap"
      />

      <span
        className="opacity-50 shrink-0"
        style={{ fontSize: cq(1.6) }}
      >
        →
      </span>
    </div>
  );
}

// ============================================================================
// DIGITAL AGENCY
// ============================================================================
function VariantDigitalAgency({
  headline,
  subtext,
  ctaText,
  ctaVisible = true,
  badgeText,
  productImage,
  website,
  price,
  phone,
  email,
  colors,

  editable = false,

  onUpdate,
  onFocusEl,
  onBlurEl,

  features,
  whyChooseUs,

  featuresVisible = true,
  whyChooseUsVisible = true,

  phoneVisible = true,
  emailVisible = true,
  websiteVisible = true,

  onRestoreFeatures,
  onRestoreWhyChooseUs,

  onRemovePhone,
  onRemoveEmail,
  onRemoveWebsite,

  onRestorePhone,
  onRestoreEmail,
  onRestoreWebsite,

  onUpdateFeature,
  onAddFeature,
  onRemoveFeature,

  onUpdateWhyChooseUs,
  onAddWhyChooseUs,
  onRemoveWhyChooseUs,
}: PremiumBrandProps) {
  const hasFeatures =
    Array.isArray(features) && features.length > 0;

  const hasWhyChooseUs =
    Array.isArray(whyChooseUs) && whyChooseUs.length > 0;

  return (
    <div
      className="@container relative flex h-full w-full aspect-[4/5] flex-col overflow-hidden font-sans"
      style={{
        backgroundColor: colors.primary,
        color: colors.secondary,
      }}
    >
      {/* ================================================================ */}
      {/* BACKGROUND                                                       */}
      {/* ================================================================ */}

      <div
        className="absolute inset-0 pointer-events-none opacity-[0.02]"
        style={{
          backgroundImage: `radial-gradient(circle at 30% 40%, ${colors.accent} 1px, transparent 1px)`,
          backgroundSize: `${cq(2.5)} ${cq(2.5)}`,
        }}
      />

      {/* ================================================================ */}
      {/* HEADER                                                           */}
      {/* ================================================================ */}

      <header
        className="relative z-10 flex shrink-0 items-start justify-end"
        style={{
          paddingLeft: cq(8),
          paddingRight: cq(8),
          paddingTop: cq(4),
        }}
      >
        {website && (
          <EditableText
            as="span"
            fieldId="f-web-top"
            editable={editable}
            value={website}
            onChange={(value) =>
              onUpdate?.("website", value)
            }
            onFocusEl={onFocusEl}
            onBlurEl={onBlurEl}
            className="opacity-40 tracking-wide"
            style={{
              fontSize: cq(1.5),
            }}
          />
        )}
      </header>

      {/* ================================================================ */}
      {/* MAIN SAFE AREA                                                   */}
      {/* ================================================================ */}

      <div
        className="relative flex-1 min-h-0"
        style={{
          paddingLeft: cq(8),
          paddingRight: cq(8),
          paddingTop: cq(3),
          paddingBottom: cq(4),
        }}
      >
        {/* ============================================================ */}
        {/* LEFT CONTENT                                                   */}
        {/* ============================================================ */}

        <section
          className="absolute left-0 top-0 bottom-0 flex flex-col justify-center"
          style={{
            width: "55%",
            paddingLeft: cq(8),
            paddingRight: cq(3),
          }}
        >
          {/* ========================================================== */}
          {/* HEADLINE                                                     */}
          {/* ========================================================== */}

                    <h1
            className="font-semibold uppercase tracking-[-0.05em] leading-[0.92]"
            style={{
              fontSize: "clamp(1.5rem, 7.4cqi, 76px)",
              wordBreak: "keep-all",
            }}
          >
            <EditableHeadlineLines
              value={headline}
              editable={editable}
              onChange={(value) =>
                onUpdate?.("headline", value)
              }
              onFocusEl={onFocusEl}
              onBlurEl={onBlurEl}
              renderLine={(line, index, node) => (
                <span
                  className="block"
                  style={
                    index === 1
                      ? { color: colors.accent }
                      : undefined
                  }
                >
                  {node}
                </span>
              )}
            />
          </h1>

          {/* ========================================================== */}
          {/* SUBTEXT                                                       */}
          {/* ========================================================== */}

          <EditableText
            as="p"
            fieldId="f-sub"
            editable={editable}
            value={subtext}
            onChange={(value) =>
              onUpdate?.("subtext", value)
            }
            onFocusEl={onFocusEl}
            onBlurEl={onBlurEl}
            className="leading-[1.5] opacity-50 max-w-[82%]"
            style={{
              fontSize: cq(2),
              marginTop: cq(3),
            }}
          />

          {/* ========================================================== */}
          {/* BENEFITS                                                      */}
          {/* ========================================================== */}

                              <div
            className="shrink-0 flex flex-col"
            style={{
              marginTop: cq(3),
              marginBottom: 0,
              gap: cq(3.2),
            }}
          >
            {/* -------------------------------------------------------- */}
            {/* FEATURES                                                   */}
            {/* -------------------------------------------------------- */}

            {hasFeatures && (
              <FeatureList
                features={features!.slice(0, 3)}
                colors={colors}
                editable={editable}
                visible={featuresVisible}
                title="FEATURES"
                onUpdateTitle={(value) =>
                  onUpdate?.("featuresTitle", value)
                }
                onUpdateFeature={
                  onUpdateFeature ??
                  (() => undefined)
                }
                onAddFeature={
                  onAddFeature ??
                  (() => undefined)
                }
                onRemoveFeature={
                  onRemoveFeature ??
                  (() => undefined)
                }
                onRestoreSection={
                  onRestoreFeatures
                }
                onFocusEl={onFocusEl}
                onBlurEl={onBlurEl}
              />
            )}

            {/* -------------------------------------------------------- */}
            {/* WHY CHOOSE US                                              */}
            {/* -------------------------------------------------------- */}

            {hasWhyChooseUs && (
              <WhyChooseUsList
                items={whyChooseUs!.slice(0, 3)}
                colors={colors}
                editable={editable}
                visible={whyChooseUsVisible}
                title="WHY CHOOSE US"
                onUpdateTitle={(value) =>
                  onUpdate?.("whyChooseUsTitle", value)
                }
                onUpdate={
                  onUpdateWhyChooseUs ??
                  (() => undefined)
                }
                onAdd={
                  onAddWhyChooseUs ??
                  (() => undefined)
                }
                onRemove={
                  onRemoveWhyChooseUs ??
                  (() => undefined)
                }
                onRestoreSection={
                  onRestoreWhyChooseUs
                }
                onFocusEl={onFocusEl}
                onBlurEl={onBlurEl}
              />
            )}
          </div>

          {/* ========================================================== */}
          {/* CTA                                                          */}
          {/* ========================================================== */}

          {ctaVisible && (
            <div
              className="flex shrink-0 items-center"
              style={{
                gap: cq(2),
                marginTop: cq(3.5),
                minHeight: cq(7),
              }}
            >
              {price && (
                <EditableText
                  as="p"
                  fieldId="f-price"
                  editable={editable}
                  value={price}
                  onChange={(value) =>
                    onUpdate?.("price", value)
                  }
                  onFocusEl={onFocusEl}
                  onBlurEl={onBlurEl}
                  className="shrink-0 font-bold tracking-tight"
                  style={{
                    color: colors.accent,
                    fontSize: cq(4),
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
              />
            </div>
          )}
        </section>

        {/* ================================================================ */}
        {/* RIGHT PRODUCT IMAGE                                               */}
        {/* ================================================================ */}

                <section
          className="absolute right-0 top-1/2 -translate-y-1/2 overflow-hidden rounded-2xl"
          style={{
            width: "38%",
            height: "74%",
            right: cq(8),
            backgroundColor: hexToRgba(colors.accent, 0.06),
            boxShadow: `0 ${cq(2.5)} ${cq(5)} ${hexToRgba(
              colors.secondary,
              0.14
            )}`,
          }}
        >
          <Image
            src={productImage}
            alt=""
            fill
            priority
            crossOrigin="anonymous"
            draggable={false}
            className="object-cover"
          />

          {badgeText && (
            <div
              className="absolute flex items-center justify-center rounded-full text-center font-bold uppercase leading-tight"
              style={{
                top: cq(2.5),
                right: cq(2.5),
                width: cq(8),
                height: cq(8),
                backgroundColor: colors.accent,
                color: colors.primary,
                fontSize: cq(2.2),
                boxShadow: `0 ${cq(0.5)} ${cq(1.5)} ${hexToRgba(
                  colors.accent,
                  0.3
                )}`,
              }}
            >
              {badgeText}
            </div>
          )}
        </section>
      </div>

      {/* ================================================================ */}
      {/* FOOTER / CONTACT BAR                                               */}
      {/* ================================================================ */}

      <div
        className="relative z-10 shrink-0"
        style={{
          paddingLeft: cq(8),
          paddingRight: cq(8),
          paddingBottom: cq(4),
          paddingTop: cq(1),
        }}
      >
        <div
          style={{
            paddingTop: cq(1.5),
            paddingBottom: cq(1.5),
            paddingLeft: cq(2.5),
            paddingRight: cq(2.5),
            borderRadius: cq(1.5),
            backgroundColor: colors.primary,
            border: `1px solid ${hexToRgba(
              colors.secondary,
              0.08
            )}`,
          }}
        >
          <ContactBar
            phone={phone}
            website={website}
            email={email}
            accentColor={colors.accent}
            textColor={colors.secondary}
            editable={editable}

            onUpdatePhone={(value) =>
              onUpdate?.("phone", value)
            }

            onUpdateWebsite={(value) =>
              onUpdate?.("website", value)
            }

            onUpdateEmail={(value) =>
              onUpdate?.("email", value)
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
  );
}
// ============================================================================
// PREMIUM GOLD
// ============================================================================

function VariantPremiumGold({
  headline,
  subtext,
  ctaText,
  ctaVisible = true,
  website,
  productImage,
  price,
  badgeText,
  phone,
  email,
  colors,

  editable = false,

  onUpdate,
  onFocusEl,
  onBlurEl,

  features,
  whyChooseUs,

  featuresVisible = true,
  whyChooseUsVisible = true,

  onRestoreFeatures,
  onRestoreWhyChooseUs,

  onUpdateFeature,
  onAddFeature,
  onRemoveFeature,

  onUpdateWhyChooseUs,
  onAddWhyChooseUs,
  onRemoveWhyChooseUs,

  phoneVisible = true,
  emailVisible = true,
  websiteVisible = true,

  onRemovePhone,
  onRemoveEmail,
  onRemoveWebsite,

  onRestorePhone,
  onRestoreEmail,
  onRestoreWebsite,
}: PremiumBrandProps) {
  const hasFeatures = Array.isArray(features) && features.length > 0;
  const hasWhyChooseUs = Array.isArray(whyChooseUs) && whyChooseUs.length > 0;
  return (
    <div
      className="@container relative flex h-full w-full aspect-[4/5] flex-col overflow-hidden font-serif"
      style={{
        backgroundColor: colors.primary,
        color: colors.secondary,
      }}
    >
      {/* ================================================================== */}
      {/* BORDER */}
      {/* ================================================================== */}

      <div
        className="absolute pointer-events-none"
        style={{
          inset: cq(3.5),
          border: `1px solid ${hexToRgba(
            colors.accent,
            0.2
          )}`,
          borderRadius: cq(1.5),
        }}
      />

      {/* ================================================================== */}
      {/* GRAIN */}
      {/* ================================================================== */}

      <div
        className="absolute inset-0 pointer-events-none opacity-[0.02]"
        style={{
          backgroundImage: `radial-gradient(circle at 50% 50%, ${colors.accent} 1px, transparent 1px)`,
          backgroundSize: `${cq(3)} ${cq(3)}`,
        }}
      />

      {/* ================================================================== */}
      {/* HEADER */}
      {/* ================================================================== */}

      <header
        className="relative z-20 flex shrink-0 justify-center"
        style={{
          paddingTop: cq(4),
        }}
      >
        <div
          className="flex items-center justify-center"
          style={{
            gap: cq(1.5),
          }}
        >
          <span
            className="h-px"
            style={{
              width: cq(8),
              backgroundColor: hexToRgba(
                colors.accent,
                0.3
              ),
            }}
          />

          <span
            className="rotate-45"
            style={{
              width: cq(0.8),
              height: cq(0.8),
              backgroundColor: colors.accent,
              opacity: 0.5,
            }}
          />

          <span
            className="h-px"
            style={{
              width: cq(8),
              backgroundColor: hexToRgba(
                colors.accent,
                0.3
              ),
            }}
          />
        </div>
      </header>

      {/* ================================================================== */}
      {/* MAIN */}
      {/* ================================================================== */}

      <div
        className="relative flex-1 min-h-0"
        style={{
          paddingLeft: cq(7),
          paddingRight: cq(7),
          paddingTop: cq(3),
          paddingBottom: cq(4),
        }}
      >
        {/* HEADLINE */}

        <div className="relative z-20 shrink-0 text-center">
          <h1
            className="font-medium uppercase tracking-[-0.04em] leading-[0.9]"
            style={{
              fontSize: "clamp(1.4rem, 7.2cqi, 84px)",
            }}
          >
            <EditableHeadlineLines
              value={headline}
              editable={editable}
              onChange={(value) =>
                onUpdate?.("headline", value)
              }
              onFocusEl={onFocusEl}
              onBlurEl={onBlurEl}
              renderLine={(line, index, node) => (
                <span
                  className="block"
                  style={
                    index === 1
                      ? { color: colors.accent }
                      : undefined
                  }
                >
                  {node}
                </span>
              )}
            />
          </h1>
        </div>

        {/* PRODUCT IMAGE */}

                <div
          className="relative"
          style={{
            height: "38%",
            marginTop: cq(2.5),
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
            className="object-contain"
          />

          {badgeText && (
            <div
              className="absolute flex items-center justify-center rounded-full text-center font-bold uppercase leading-tight"
              style={{
                top: cq(1.5),
                right: cq(1.5),
                width: cq(7),
                height: cq(7),
                backgroundColor: colors.accent,
                color: colors.primary,
                fontSize: cq(2),
                boxShadow: `0 ${cq(0.5)} ${cq(1.5)} ${hexToRgba(
                  colors.accent,
                  0.25
                )}`,
              }}
            >
              {badgeText}
            </div>
                   )}
        </div>

        {/* ================================================================== */}
        {/* FEATURES / WHY CHOOSE US — mirrors Digital Agency variant          */}
        {/* ================================================================== */}

        {(hasFeatures || hasWhyChooseUs) && (
          <div
            className="grid grid-cols-2 text-left"
            style={{
              gap: cq(3),
              marginBottom: cq(3.5), // breathing room before divider/CTA
            }}
          >
            {hasFeatures && (
              <FeatureList
                features={features!.slice(0, 3)}
                colors={colors}
                editable={editable}
                visible={featuresVisible}
                title="FEATURES"
                onUpdateTitle={(value) => onUpdate?.("featuresTitle", value)}
                onUpdateFeature={onUpdateFeature ?? (() => undefined)}
                onAddFeature={onAddFeature ?? (() => undefined)}
                onRemoveFeature={onRemoveFeature ?? (() => undefined)}
                onRestoreSection={onRestoreFeatures}
                onFocusEl={onFocusEl}
                onBlurEl={onBlurEl}
              />
            )}

            {hasWhyChooseUs && (
              <WhyChooseUsList
                items={whyChooseUs!.slice(0, 3)}
                colors={colors}
                editable={editable}
                visible={whyChooseUsVisible}
                title="WHY CHOOSE US"
                onUpdateTitle={(value) => onUpdate?.("whyChooseUsTitle", value)}
                onUpdate={onUpdateWhyChooseUs ?? (() => undefined)}
                onAdd={onAddWhyChooseUs ?? (() => undefined)}
                onRemove={onRemoveWhyChooseUs ?? (() => undefined)}
                onRestoreSection={onRestoreWhyChooseUs}
                onFocusEl={onFocusEl}
                onBlurEl={onBlurEl}
              />
            )}
          </div>
        )}

        {/* ================================================================== */}
        {/* BOTTOM CONTENT */}
        {/* ================================================================== */}

        <div className="shrink-0">
          {/* Divider */}

          <div
            className="w-full h-px"
            style={{
              marginBottom: cq(2.5),
              backgroundColor: hexToRgba(
                colors.accent,
                0.2
              ),
            }}
          />

          {/* Price / Subtext / CTA - conditionally rendered */}

          <div className="flex items-end justify-between gap-4">
            <div className="max-w-[55%] min-w-0">
              {price && (
                <EditableText
                  as="p"
                  fieldId="f-price"
                  editable={editable}
                  value={price}
                  onChange={(value) =>
                    onUpdate?.("price", value)
                  }
                  onFocusEl={onFocusEl}
                  onBlurEl={onBlurEl}
                  className="font-medium leading-none"
                  style={{
                    color: colors.accent,
                    fontSize: cq(4.5),
                  }}
                />
              )}

              <EditableText
                as="p"
                fieldId="f-sub"
                editable={editable}
                value={subtext}
                onChange={(value) =>
                  onUpdate?.("subtext", value)
                }
                onFocusEl={onFocusEl}
                onBlurEl={onBlurEl}
                className="leading-[1.4] opacity-45"
                style={{
                  marginTop: cq(0.8),
                  fontSize: cq(1.7),
                }}
              />
            </div>

            {/* CTA - only rendered if ctaVisible is true */}
            {ctaVisible && (
              <SmartCTA
                value={ctaText}
                editable={editable}
                onUpdate={onUpdate}
                onFocusEl={onFocusEl}
                onBlurEl={onBlurEl}
                colors={colors}
              />
            )}
          </div>

          {/* ================================================================= */}
          {/* CONTACT BAR                                                       */}
          {/* ================================================================= */}

          <div style={{ marginTop: cq(2) }}>
            <div
              style={{
                paddingTop: cq(1.2),
                paddingBottom: cq(1.2),
                paddingLeft: cq(2),
                paddingRight: cq(2),
                borderRadius: cq(1.5),
                backgroundColor: colors.primary,
                border: `1px solid ${hexToRgba(
                  colors.secondary,
                  0.08
                )}`,
              }}
            >
              <ContactBar
                phone={phone}
                website={website}
                email={email}
                accentColor={colors.accent}
                textColor={colors.secondary}
                editable={editable}

                onUpdatePhone={(value) =>
                  onUpdate?.("phone", value)
                }

                onUpdateWebsite={(value) =>
                  onUpdate?.("website", value)
                }

                onUpdateEmail={(value) =>
                  onUpdate?.("email", value)
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
    </div>
  );
}