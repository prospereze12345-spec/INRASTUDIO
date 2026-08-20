"use client";

import React, { useMemo } from "react";
import Image from "next/image";
import { ShoppingBag, ArrowUpRight } from "lucide-react";

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
//
// All measurements are based on the flyer container rather than the viewport.
// This keeps the design proportional in:
//   - editor canvas
//   - mobile preview
//   - desktop preview
//   - exported flyer
//
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

  // --------------------------------------------------------------------------
  // WHY CHOOSE US
  // --------------------------------------------------------------------------

  whyChooseUs?: string[];

  onUpdateWhyChooseUs?: (
    index: number,
    value: string
  ) => void;

  onAddWhyChooseUs?: () => void;

  onRemoveWhyChooseUs?: (
    index: number
  ) => void;

  // --------------------------------------------------------------------------
  // SECTION VISIBILITY
  // --------------------------------------------------------------------------

  featuresVisible?: boolean;
  whyChooseUsVisible?: boolean;

  phoneVisible?: boolean;
  emailVisible?: boolean;
  websiteVisible?: boolean;

  // --------------------------------------------------------------------------
  // RESTORE
  // --------------------------------------------------------------------------

  onRestoreFeatures?: () => void;
  onRestoreWhyChooseUs?: () => void;

  onRestorePhone?: () => void;
  onRestoreEmail?: () => void;
  onRestoreWebsite?: () => void;

  // --------------------------------------------------------------------------
  // REMOVE CONTACT
  // --------------------------------------------------------------------------

  onRemovePhone?: () => void;
  onRemoveEmail?: () => void;
  onRemoveWebsite?: () => void;

  // --------------------------------------------------------------------------
  // FEATURES
  // --------------------------------------------------------------------------

  features?: string[];

  onUpdateFeature?: (
    index: number,
    value: string
  ) => void;

  onAddFeature?: () => void;

  onRemoveFeature?: (
    index: number
  ) => void;
}

// ============================================================================
// HELPERS
// ============================================================================

function hexToRgba(
  hex: string,
  alpha: number
) {
  if (!hex) {
    return `rgba(0,0,0,${alpha})`;
  }

  const value = hex.replace("#", "");

  if (value.length !== 6) {
    return hex;
  }

  const r = parseInt(
    value.slice(0, 2),
    16
  );

  const g = parseInt(
    value.slice(2, 4),
    16
  );

  const b = parseInt(
    value.slice(4, 6),
    16
  );

  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

// ============================================================================
// MAIN TEMPLATE
// ============================================================================

export function PremiumBrandTemplate(
  props: PremiumBrandProps
) {
  const {
    headline,
    productImage,
    colors,
  } = props;

  if (
    !headline ||
    !productImage ||
    !colors
  ) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-neutral-100 text-neutral-400 text-sm">
        Loading template...
      </div>
    );
  }

  const name =
    props.name || "Digital Agency";

  switch (name) {
    case "Digital Agency":
      return (
        <VariantDigitalAgency
          {...props}
        />
      );

    case "Premium Gold":
      return (
        <VariantPremiumGold
          {...props}
        />
      );

    default:
      return (
        <VariantDigitalAgency
          {...props}
        />
      );
  }
}

// ============================================================================
// SMART CTA
// ============================================================================
//
// Design goals:
// - Strong enough to read as the primary action.
// - Doesn't compete with the headline.
// - Doesn't become excessively wide when user enters long text.
// - Remains touch-friendly in editor.
// - Uses the same accent color as the rest of the flyer.
// ============================================================================

function SmartCTA({
  value,
  editable,
  onUpdate,
  onFocusEl,
  onBlurEl,
  colors,
}: {
  value: string;

  editable?: boolean;

  onUpdate?: (
    field: string,
    value: string
  ) => void;

  onFocusEl?: (
    el: HTMLElement
  ) => void;

  onBlurEl?: () => void;

  colors: PremiumBrandProps["colors"];
}) {
  return (
    <div
      className="inline-flex items-center justify-center rounded-xl font-semibold uppercase"
      style={{
        ...touchTarget,

        minHeight: cq(7),

        maxWidth: "92cqi",

        paddingLeft: cq(1.5),
        paddingRight: cq(3),

        paddingTop: cq(1.2),
        paddingBottom: cq(1.2),

        gap: cq(1.5),

        backgroundColor:
          colors.accent,

        color:
          colors.primary,

        fontSize: cq(1.8),

        lineHeight: 1.15,

        letterSpacing: "0.055em",

        boxShadow: `0 ${cq(
          0.6
        )} ${cq(
          1.8
        )} ${hexToRgba(
          colors.secondary,
          0.08
        )}`,
      }}
    >
      <span
        className="flex shrink-0 items-center justify-center rounded-lg"
        style={{
          width: cq(4.1),
          height: cq(4.1),

          backgroundColor:
            colors.primary,

          color:
            colors.accent,
        }}
      >
        <ShoppingBag
          style={{
            width: cq(2),
            height: cq(2),
          }}
        />
      </span>

      <EditableText
        as="span"
        fieldId="f-cta"
        editable={editable}
        value={value}
        onChange={(v) =>
          onUpdate?.(
            "ctaText",
            v
          )
        }
        onFocusEl={
          onFocusEl
        }
        onBlurEl={
          onBlurEl
        }
        className="min-w-0"
        style={{
          overflowWrap:
            "anywhere",
        }}
      />

      <ArrowUpRight
        className="shrink-0"
        style={{
          width: cq(2.5),
          height: cq(2.5),
          opacity: 0.55,
        }}
      />
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

  badgeText,
  extraText,

  productImage,

  price,

  phone,
  email,
  website,

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
  // --------------------------------------------------------------------------
  // Parse dynamic flyer content.
  //
  // We intentionally do NOT render parsed.badge.
  // The previous burst/sticker treatment was removed from the design.
  // --------------------------------------------------------------------------

  const parsed = useMemo(
    () =>
      parseFlyerContent(
        badgeText,
        extraText
      ),
    [
      badgeText,
      extraText,
    ]
  );

  return (
    <div
      className="@container relative w-full h-full overflow-hidden font-sans"
      style={{
        backgroundColor:
          colors.primary,

        color:
          colors.secondary,
      }}
    >
      {/* ================================================================== */}
      {/* MAIN PRODUCT AREA */}
      {/* ================================================================== */}

      <div
        className="absolute inset-0"
        style={{
          paddingLeft: cq(6),
          paddingRight: cq(6),

          paddingTop: cq(4.5),

          paddingBottom: cq(4),
        }}
      >
        {/* ================================================================ */}
        {/* PRODUCT IMAGE */}
        {/* ================================================================ */}
        <section
          className="absolute pointer-events-none"
          style={{
            right: "-3%",

            top: cq(8),

            width: "55%",

            height: "63%",

            zIndex: 1,
          }}
        >
          <Image
            src={productImage}
            alt=""
            fill
            priority
            crossOrigin="anonymous"
            draggable={false}
            sizes="55vw"
            className="object-contain object-right-center"
          />
        </section>

        {/* ================================================================ */}
        {/* CONTENT COLUMN */}
        {/* ================================================================ */}

        <main
          className="relative z-20 flex flex-col"
          style={{
            width: "58%",

            height: "100%",

            paddingTop: cq(4),
          }}
        >
          {/* -------------------------------------------------------------- */}
          {/* HEADLINE */}
          {/* -------------------------------------------------------------- */}

          <section>
            <h1
              className="font-semibold uppercase"
              style={{
                fontSize:
                  "clamp(1.7rem, 8.2cqi, 88px)",

                lineHeight: 0.87,

                letterSpacing:
                  "-0.055em",

                maxWidth: "100%",
              }}
            >
              <EditableHeadlineLines
                value={headline}
                editable={editable}
                onChange={(v) =>
                  onUpdate?.(
                    "headline",
                    v
                  )
                }
                onFocusEl={
                  onFocusEl
                }
                onBlurEl={
                  onBlurEl
                }
                renderLine={(
                  line,
                  index,
                  node
                ) => (
                  <span
                    className="block"
                    style={
                      index === 1
                        ? {
                            color:
                              colors.accent,
                          }
                        : undefined
                    }
                  >
                    {node}
                  </span>
                )}
              />
            </h1>
          </section>

          {/* -------------------------------------------------------------- */}
          {/* SUBTEXT */}
          {/* -------------------------------------------------------------- */}

          <EditableText
            as="p"
            fieldId="f-sub"
            editable={editable}
            value={subtext}
            onChange={(v) =>
              onUpdate?.(
                "subtext",
                v
              )
            }
            onFocusEl={
              onFocusEl
            }
            onBlurEl={
              onBlurEl
            }
            className="leading-[1.4] opacity-60"
            style={{
              marginTop: cq(2),

              maxWidth: "72%",

              fontSize: cq(2.05),
            }}
          />

          {/* -------------------------------------------------------------- */}
          {/* FEATURES */}
          {/* -------------------------------------------------------------- */}

          <div
            style={{
              marginTop: cq(5),
            }}
          >
            <FeatureList
              features={parsed.features.slice(
                0,
                3
              )}
              colors={colors}
              editable={editable}

              onUpdateFeature={(
                index,
                value
              ) =>
                onUpdate?.(
                  "badgeText",
                  parsed.updateFeature(
                    index,
                    value
                  )
                )
              }

              onAddFeature={() =>
                onUpdate?.(
                  "badgeText",
                  parsed.addFeature()
                )
              }

              onRemoveFeature={(
                index
              ) =>
                onUpdate?.(
                  "badgeText",
                  parsed.removeFeature(
                    index
                  )
                )
              }

              onFocusEl={
                onFocusEl
              }

              onBlurEl={
                onBlurEl
              }

              visible={
                featuresVisible
              }

              onRestoreSection={
                onRestoreFeatures
              }
            />
          </div>

          {/* -------------------------------------------------------------- */}
          {/* WHY CHOOSE US */}
          {/* -------------------------------------------------------------- */}

          <div
            style={{
              marginTop: cq(4),
            }}
          >
            <WhyChooseUsList
              items={whyChooseUs?.slice(
                0,
                3
              )}
              colors={colors}
              editable={editable}

              onUpdate={
                onUpdateWhyChooseUs
              }

              onAdd={
                onAddWhyChooseUs
              }

              onRemove={
                onRemoveWhyChooseUs
              }

              onFocusEl={
                onFocusEl
              }

              onBlurEl={
                onBlurEl
              }

              visible={
                whyChooseUsVisible
              }

              onRestoreSection={
                onRestoreWhyChooseUs
              }
            />
          </div>

          {/* -------------------------------------------------------------- */}
          {/* CTA */}
          {/* -------------------------------------------------------------- */}
          //
          // IMPORTANT:
          // CTA is intentionally ABOVE the footer.
          // It belongs to the content hierarchy, not the contact metadata.
          //

          <div
            className="flex items-center"
            style={{
              marginTop: cq(4),

              gap: cq(3),
            }}
          >
            {price && (
              <EditableText
                as="p"
                fieldId="f-price"
                editable={editable}
                value={price}
                onChange={(v) =>
                  onUpdate?.(
                    "price",
                    v
                  )
                }
                onFocusEl={
                  onFocusEl
                }
                onBlurEl={
                  onBlurEl
                }
                className="font-bold tracking-tight shrink-0"
                style={{
                  color:
                    colors.accent,

                  fontSize: cq(4.2),

                  lineHeight: 0.9,
                }}
              />
            )}

            <SmartCTA
              value={ctaText}
              editable={editable}
              onUpdate={onUpdate}
              onFocusEl={
                onFocusEl
              }
              onBlurEl={
                onBlurEl
              }
              colors={colors}
            />
          </div>
        </main>
      </div>

      {/* ================================================================== */}
      {/* CONTACT FOOTER */}
      {/* ================================================================== */}
      //
      // The contact information is intentionally given its own visual zone.
      // It should read as:
      //
      //    PHONE       WEBSITE       EMAIL
      //
      // rather than being tiny text floating at the bottom.
      //

      <footer
        className="absolute left-0 right-0 bottom-0 z-50"
        style={{
          paddingLeft: cq(6),
          paddingRight: cq(6),
          paddingBottom: cq(3.5),
        }}
      >
        <div
          style={{
            width: "100%",

            paddingTop: cq(2),
            paddingBottom: cq(2),

            paddingLeft: cq(2.5),
            paddingRight: cq(2.5),

            borderRadius: cq(2),

            backgroundColor:
              hexToRgba(
                colors.accent,
                0.94
              ),

            boxShadow: `0 ${cq(
              0.8
            )} ${cq(
              2.5
            )} ${hexToRgba(
              colors.secondary,
              0.08
            )}`,
          }}
        >
          <ContactBar
            phone={phone}
            website={website}
            email={email}
            accentColor={
              colors.primary
            }
            textColor={
              colors.primary
            }
            editable={editable}

            onUpdatePhone={(v) =>
              onUpdate?.(
                "phone",
                v
              )
            }

            onUpdateWebsite={(v) =>
              onUpdate?.(
                "website",
                v
              )
            }

            onUpdateEmail={(v) =>
              onUpdate?.(
                "email",
                v
              )
            }

            onFocusEl={
              onFocusEl
            }

            onBlurEl={
              onBlurEl
            }

            phoneVisible={
              phoneVisible
            }

            websiteVisible={
              websiteVisible
            }

            emailVisible={
              emailVisible
            }

            onRemovePhone={
              onRemovePhone
            }

            onRemoveWebsite={
              onRemoveWebsite
            }

            onRemoveEmail={
              onRemoveEmail
            }

            onRestorePhone={
              onRestorePhone
            }

            onRestoreWebsite={
              onRestoreWebsite
            }

            onRestoreEmail={
              onRestoreEmail
            }
          />
        </div>
      </footer>
    </div>
  );
}

// ============================================================================
// PREMIUM GOLD
// ============================================================================
//
// This variant is intentionally kept functional.
//
// The same principles apply:
// - no artificial sticker
// - no unnecessary decorative branding
// - clear hierarchy
// - product remains the hero
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
  return (
    <div
      className="@container relative w-full h-full overflow-hidden font-serif flex flex-col"
      style={{
        backgroundColor:
          colors.primary,

        color:
          colors.secondary,
      }}
    >
      {/* ================================================================ */}
      {/* SUBTLE BORDER */}
      {/* ================================================================ */}

      <div
        className="absolute pointer-events-none"
        style={{
          inset: cq(4),

          border: `1px solid ${hexToRgba(
            colors.accent,
            0.28
          )}`,
        }}
      />

      {/* ================================================================ */}
      {/* HEADER */}
      {/* ================================================================ */}

      <header
        className="relative z-20 shrink-0 text-center"
        style={{
          paddingTop: cq(5),
        }}
      >
        <EditableText
          as="p"
          fieldId="f-brand"
          editable={editable}
          value={brandName ?? ""}
          onChange={(v) =>
            onUpdate?.(
              "brandName",
              v
            )
          }
          onFocusEl={
            onFocusEl
          }
          onBlurEl={
            onBlurEl
          }
          className="uppercase tracking-[0.4em] opacity-60"
          style={{
            fontSize: cq(2),
          }}
        />
      </header>

      {/* ================================================================ */}
      {/* MAIN */}
      {/* ================================================================ */}

      <div
        className="relative flex-1 min-h-0"
        style={{
          paddingLeft: cq(8),
          paddingRight: cq(8),

          paddingTop: cq(4),
          paddingBottom: cq(4),
        }}
      >
        {/* -------------------------------------------------------------- */}
        {/* HEADLINE */}
        {/* -------------------------------------------------------------- */}

        <div className="relative z-20 text-center">
          <h1
            className="font-medium uppercase"
            style={{
              fontSize:
                "clamp(1.4rem, 7.5cqi, 88px)",

              lineHeight: 0.9,

              letterSpacing:
                "-0.04em",
            }}
          >
            <EditableHeadlineLines
              value={headline}
              editable={editable}
              onChange={(v) =>
                onUpdate?.(
                  "headline",
                  v
                )
              }
              onFocusEl={
                onFocusEl
              }
              onBlurEl={
                onBlurEl
              }
              renderLine={(
                line,
                index,
                node
              ) => (
                <span
                  className="block"
                  style={
                    index === 1
                      ? {
                          color:
                            colors.accent,
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
        {/* PRODUCT */}
        {/* -------------------------------------------------------------- */}

        <div
          className="relative flex-1 min-h-0"
          style={{
            marginTop: cq(3),
            marginBottom: cq(3),

            minHeight: cq(30),
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
        </div>

        {/* -------------------------------------------------------------- */}
        {/* BOTTOM CTA AREA */}
        {/* -------------------------------------------------------------- */}

        <div className="shrink-0">
          <div
            className="w-full h-px"
            style={{
              marginBottom: cq(3),

              backgroundColor:
                hexToRgba(
                  colors.accent,
                  0.22
                ),
            }}
          />

          <div className="flex items-end justify-between gap-4">
            <div
              className="min-w-0"
              style={{
                maxWidth: "55%",
              }}
            >
              {price && (
                <EditableText
                  as="p"
                  fieldId="f-price"
                  editable={editable}
                  value={price}
                  onChange={(v) =>
                    onUpdate?.(
                      "price",
                      v
                    )
                  }
                  onFocusEl={
                    onFocusEl
                  }
                  onBlurEl={
                    onBlurEl
                  }
                  className="font-medium leading-none"
                  style={{
                    color:
                      colors.accent,

                    fontSize: cq(5),
                  }}
                />
              )}

              <EditableText
                as="p"
                fieldId="f-sub"
                editable={editable}
                value={subtext}
                onChange={(v) =>
                  onUpdate?.(
                    "subtext",
                    v
                  )
                }
                onFocusEl={
                  onFocusEl
                }
                onBlurEl={
                  onBlurEl
                }
                className="leading-[1.4] opacity-55"
                style={{
                  marginTop: cq(1),

                  fontSize: cq(1.8),
                }}
              />
            </div>

            <SmartCTA
              value={ctaText}
              editable={editable}
              onUpdate={onUpdate}
              onFocusEl={
                onFocusEl
              }
              onBlurEl={
                onBlurEl
              }
              colors={colors}
            />
          </div>

          {/* ------------------------------------------------------------ */}
          {/* CONTACT */}
          {/* ------------------------------------------------------------ */}

          <div
            style={{
              marginTop: cq(3),
            }}
          >
            <ContactBar
              phone={phone}
              website={website}
              email={email}
              accentColor={
                colors.primary
              }
              textColor={
                colors.primary
              }
              editable={editable}

              onUpdatePhone={(v) =>
                onUpdate?.(
                  "phone",
                  v
                )
              }

              onUpdateWebsite={(v) =>
                onUpdate?.(
                  "website",
                  v
                )
              }

              onUpdateEmail={(v) =>
                onUpdate?.(
                  "email",
                  v
                )
              }

              onFocusEl={
                onFocusEl
              }

              onBlurEl={
                onBlurEl
              }

              phoneVisible={
                phoneVisible
              }

              websiteVisible={
                websiteVisible
              }

              emailVisible={
                emailVisible
              }

              onRemovePhone={
                onRemovePhone
              }

              onRemoveWebsite={
                onRemoveWebsite
              }

              onRemoveEmail={
                onRemoveEmail
              }

              onRestorePhone={
                onRestorePhone
              }

              onRestoreWebsite={
                onRestoreWebsite
              }

              onRestoreEmail={
                onRestoreEmail
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
}