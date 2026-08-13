"use client";

import React, { useMemo } from "react";
import Image from "next/image";
import {
  FeatureList,
  ContactBar,
  parseFlyerContent,
} from "./FlyerContentBlocks";

import { EditableText } from "@/components/EditableText";
import { EditableHeadlineLines } from "@/components/Editableheadlinelines";

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
}

/* ============================================================================
   SMALL DESIGN HELPERS
============================================================================ */

function hexToRgba(hex: string, alpha: number) {
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

function safeText(value?: string) {
  return value?.trim() || "";
}

/* ============================================================================
   MAIN TEMPLATE
============================================================================ */

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

  const name = props.name || "Grand Opening";

  switch (name) {
    case "Grand Opening":
      return <VariantGrandOpening {...props} />;

    case "Digital Agency":
      return <VariantDigitalAgency {...props} />;

    case "Premium Gold":
      return <VariantPremiumGold {...props} />;

    case "Cleaning Service":
      return <VariantCleaningService {...props} />;

    case "Organic Deal":
      return <VariantOrganicDeal {...props} />;

    default:
      return <VariantGrandOpening {...props} />;
  }
}

/* ============================================================================
   SHARED HEADER
============================================================================ */

function BrandHeader({
  brandName,
  website,
  editable,
  onUpdate,
  onFocusEl,
  onBlurEl,
  colors,
}: Pick<
  PremiumBrandProps,
  | "brandName"
  | "website"
  | "editable"
  | "onUpdate"
  | "onFocusEl"
  | "onBlurEl"
  | "colors"
>) {
  return (
    <header className="flex items-center justify-between px-[6cqi] pt-[5cqi] relative z-20">
      <EditableText
        as="p"
        fieldId="f-brand"
        editable={editable}
        value={brandName ?? ""}
        onChange={(v) => onUpdate?.("brandName", v)}
        onFocusEl={onFocusEl}
        onBlurEl={onBlurEl}
        className="
          text-[2.25cqi]
          font-semibold
          tracking-[0.18em]
          uppercase
          leading-none
        "
        style={{
          color: colors.secondary,
        }}
      />

      {website && (
        <EditableText
          as="p"
          fieldId="f-web"
          editable={editable}
          value={website}
          onChange={(v) => onUpdate?.("website", v)}
          onFocusEl={onFocusEl}
          onBlurEl={onBlurEl}
          className="
            text-[1.65cqi]
            tracking-[0.08em]
            leading-none
            opacity-50
          "
          style={{
            color: colors.secondary,
          }}
        />
      )}
    </header>
  );
}

/* ============================================================================
   CTA
============================================================================ */

function SmartCTA({
  value,
  editable,
  onUpdate,
  onFocusEl,
  onBlurEl,
  colors,
  rounded = true,
}: {
  value: string;
  editable?: boolean;
  onUpdate?: (field: string, value: string) => void;
  onFocusEl?: (el: HTMLElement) => void;
  onBlurEl?: () => void;
  colors: PremiumBrandProps["colors"];
  rounded?: boolean;
}) {
  return (
    <div
      className={[
        "inline-flex items-center",
        "px-[4.5cqi] py-[2.4cqi]",
        "text-[2.15cqi]",
        "font-semibold",
        "tracking-[0.08em]",
        "uppercase",
        rounded ? "rounded-full" : "",
      ].join(" ")}
      style={{
        backgroundColor: colors.accent,
        color: colors.primary,
      }}
    >
      <EditableText
        as="span"
        fieldId="f-cta"
        editable={editable}
        value={value}
        onChange={(v) => onUpdate?.("ctaText", v)}
        onFocusEl={onFocusEl}
        onBlurEl={onBlurEl}
      />

      <span className="ml-[2cqi] opacity-60">â†—</span>
    </div>
  );
}

/* ============================================================================
   1. GRAND OPENING

   Editorial / luxury launch style.
============================================================================ */

function VariantGrandOpening({
  headline,
  subtext,
  ctaText,
  productImage,
  brandName,
  website,
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
}: PremiumBrandProps) {
  const parsed = useMemo(
    () => parseFlyerContent(badgeText, extraText),
    [badgeText, extraText]
  );

  return (
    <div
      className="@container w-full h-full overflow-hidden relative font-sans"
      style={{
        backgroundColor: colors.primary,
        color: colors.secondary,
      }}
    >
      {/* subtle editorial border */}
      <div
        className="absolute inset-[3cqi] pointer-events-none"
        style={{
          border: `1px solid ${hexToRgba(colors.secondary, 0.08)}`,
        }}
      />

      <BrandHeader
        brandName={brandName}
        website={website}
        editable={editable}
        onUpdate={onUpdate}
        onFocusEl={onFocusEl}
        onBlurEl={onBlurEl}
        colors={colors}
      />

      {/* HERO */}
      <main className="absolute inset-x-0 top-[14cqi] bottom-0">
        {/* image */}
        <div className="absolute inset-x-[5cqi] top-[8cqi] bottom-[23cqi] overflow-hidden">
          <Image
            src={productImage}
            alt=""
            fill
            priority
            crossOrigin="anonymous"
            className="object-contain object-center"
          />

          {/* quiet fade */}
          <div
            className="absolute inset-x-0 bottom-0 h-[18%]"
            style={{
              background: `linear-gradient(
                to top,
                ${colors.primary},
                transparent
              )`,
            }}
          />
        </div>

        {/* headline */}
        <div className="absolute left-[6cqi] right-[6cqi] top-0 z-10">
          <p
            className="text-[1.65cqi] uppercase tracking-[0.25em] mb-[2cqi] opacity-45"
            style={{ color: colors.secondary }}
          >
            {parsed.kicker || "New"}
          </p>

          <h1
            className="
              font-semibold
              uppercase
              tracking-[-0.055em]
              leading-[0.86]
            "
            style={{
              fontSize: "10cqi",
              color: colors.secondary,
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
                    index % 2 === 1
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

        {/* bottom information */}
        <div className="absolute left-[6cqi] right-[6cqi] bottom-[5cqi] z-20">
          <div className="flex items-end justify-between gap-[4cqi]">
            <div className="max-w-[52%]">
              {price && (
                <EditableText
                  as="p"
                  fieldId="f-price"
                  editable={editable}
                  value={price}
                  onChange={(v) => onUpdate?.("price", v)}
                  onFocusEl={onFocusEl}
                  onBlurEl={onBlurEl}
                  className="
                    font-semibold
                    leading-none
                    tracking-[-0.04em]
                    text-[6.5cqi]
                  "
                  style={{ color: colors.accent }}
                />
              )}

              <EditableText
                as="p"
                fieldId="f-sub"
                editable={editable}
                value={subtext}
                onChange={(v) => onUpdate?.("subtext", v)}
                onFocusEl={onFocusEl}
                onBlurEl={onBlurEl}
                className="
                  mt-[1cqi]
                  text-[2cqi]
                  leading-[1.35]
                  opacity-55
                "
              />
            </div>

            <SmartCTA
              value={ctaText}
              editable={editable}
              onUpdate={onUpdate}
              onFocusEl={onFocusEl}
              onBlurEl={onBlurEl}
              colors={colors}
            />
          </div>

          <div className="mt-[3cqi]">
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
            />
          </div>
        </div>
      </main>
    </div>
  );
}

/* ============================================================================
   2. DIGITAL AGENCY

   Modern Swiss / Apple editorial grid.
============================================================================ */

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
}: PremiumBrandProps) {
  const parsed = useMemo(
    () => parseFlyerContent(badgeText, extraText),
    [badgeText, extraText]
  );

  return (
    <div
      className="@container w-full h-full relative overflow-hidden font-sans"
      style={{
        backgroundColor: colors.primary,
        color: colors.secondary,
      }}
    >
      <BrandHeader
        brandName={brandName}
        website={website}
        editable={editable}
        onUpdate={onUpdate}
        onFocusEl={onFocusEl}
        onBlurEl={onBlurEl}
        colors={colors}
      />

      <div className="absolute left-[6cqi] right-[6cqi] top-[17cqi] bottom-[6cqi]">
        {/* vertical grid */}
        <div
          className="absolute left-[58%] top-0 bottom-0 w-px"
          style={{
            backgroundColor: hexToRgba(colors.secondary, 0.08),
          }}
        />

        {/* COPY */}
        <section className="absolute left-0 top-0 w-[52%] pr-[5cqi]">
          <div className="flex items-center gap-[1.5cqi] mb-[3cqi]">
            <span
              className="w-[3.5cqi] h-[1px]"
              style={{ backgroundColor: colors.accent }}
            />

            <span
              className="text-[1.65cqi] uppercase tracking-[0.25em] opacity-45"
              style={{ color: colors.secondary }}
            >
              {parsed.kicker || "Services"}
            </span>
          </div>

          <h1
            className="
              font-semibold
              uppercase
              tracking-[-0.055em]
              leading-[0.88]
            "
            style={{
              fontSize: "8.3cqi",
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
                      ? { color: colors.accent }
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
            fieldId="f-sub"
            editable={editable}
            value={subtext}
            onChange={(v) => onUpdate?.("subtext", v)}
            onFocusEl={onFocusEl}
            onBlurEl={onBlurEl}
            className="
              mt-[4cqi]
              text-[2.15cqi]
              leading-[1.45]
              opacity-55
              max-w-[85%]
            "
          />

          <div className="mt-[5cqi]">
            <FeatureList
              features={parsed.features}
              colors={colors}
              editable={editable}
              onUpdateFeature={(index, value) =>
                onUpdate?.(
                  "badgeText",
                  parsed.updateFeature(index, value)
                )
              }
              onAddFeature={() => {
                onUpdate?.(
                  "badgeText",
                  parsed.addFeature()
                );
              }}
              onRemoveFeature={(index) => {
                onUpdate?.(
                  "badgeText",
                  parsed.removeFeature(index)
                );
              }}
              onFocusEl={onFocusEl}
              onBlurEl={onBlurEl}
            />
          </div>

          <div className="mt-[5cqi] flex items-end gap-[3cqi]">
            {price && (
              <EditableText
                as="p"
                fieldId="f-price"
                editable={editable}
                value={price}
                onChange={(v) => onUpdate?.("price", v)}
                onFocusEl={onFocusEl}
                onBlurEl={onBlurEl}
                className="text-[5cqi] font-semibold tracking-tight"
                style={{
                  color: colors.accent,
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
        </section>

        {/* IMAGE */}
        <section className="absolute right-0 top-0 bottom-[12%] w-[38%]">
          <div className="absolute inset-[2cqi] overflow-hidden rounded-[2cqi]">
            <Image
              src={productImage}
              alt=""
              fill
              priority
              crossOrigin="anonymous"
              className="object-cover"
            />
          </div>

          <div
            className="absolute -bottom-[2cqi] -left-[2cqi] w-[10cqi] h-[10cqi] rounded-full"
            style={{
              backgroundColor: colors.accent,
              opacity: 0.9,
            }}
          />
        </section>

        <div className="absolute left-0 right-0 bottom-0">
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
          />
        </div>
      </div>
    </div>
  );
}

/* ============================================================================
   3. PREMIUM GOLD

   High-end fashion / jewellery editorial.
============================================================================ */

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
}: PremiumBrandProps) {
  const parsed = useMemo(
    () => parseFlyerContent(badgeText, extraText),
    [badgeText, extraText]
  );

  return (
    <div
      className="@container w-full h-full relative overflow-hidden font-serif"
      style={{
        backgroundColor: colors.primary,
        color: colors.secondary,
      }}
    >
      <div
        className="absolute inset-[4cqi] pointer-events-none"
        style={{
          border: `1px solid ${hexToRgba(colors.accent, 0.35)}`,
        }}
      />

      <header className="relative z-20 text-center pt-[7cqi]">
        <EditableText
          as="p"
          fieldId="f-brand"
          editable={editable}
          value={brandName ?? ""}
          onChange={(v) => onUpdate?.("brandName", v)}
          onFocusEl={onFocusEl}
          onBlurEl={onBlurEl}
          className="
            text-[2.2cqi]
            uppercase
            tracking-[0.45em]
            opacity-55
          "
        />

        <div className="flex justify-center items-center gap-[2cqi] mt-[2cqi]">
          <span
            className="w-[10cqi] h-px"
            style={{
              backgroundColor: hexToRgba(colors.accent, 0.4),
            }}
          />

          <span
            className="w-[0.9cqi] h-[0.9cqi] rotate-45"
            style={{
              backgroundColor: colors.accent,
            }}
          />

          <span
            className="w-[10cqi] h-px"
            style={{
              backgroundColor: hexToRgba(colors.accent, 0.4),
            }}
          />
        </div>
      </header>

      <div className="absolute inset-x-[8cqi] top-[20cqi] bottom-[6cqi]">
        <div className="text-center relative z-20">
          <h1
            className="
              font-medium
              uppercase
              tracking-[-0.04em]
              leading-[0.9]
            "
            style={{
              fontSize: "8cqi",
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

        <div className="absolute inset-x-[8%] top-[15%] bottom-[22%]">
          <Image
            src={productImage}
            alt=""
            fill
            priority
            crossOrigin="anonymous"
            className="object-contain"
          />
        </div>

        <div className="absolute left-0 right-0 bottom-0">
          <div
            className="w-full h-px mb-[3cqi]"
            style={{
              backgroundColor: hexToRgba(colors.accent, 0.25),
            }}
          />

          <div className="flex items-end justify-between">
            <div className="max-w-[55%]">
              {price && (
                <EditableText
                  as="p"
                  fieldId="f-price"
                  editable={editable}
                  value={price}
                  onChange={(v) => onUpdate?.("price", v)}
                  onFocusEl={onFocusEl}
                  onBlurEl={onBlurEl}
                  className="
                    text-[6.2cqi]
                    font-medium
                    leading-none
                  "
                  style={{
                    color: colors.accent,
                  }}
                />
              )}

              <EditableText
                as="p"
                fieldId="f-sub"
                editable={editable}
                value={subtext}
                onChange={(v) => onUpdate?.("subtext", v)}
                onFocusEl={onFocusEl}
                onBlurEl={onBlurEl}
                className="
                  mt-[1cqi]
                  text-[1.95cqi]
                  leading-[1.4]
                  opacity-50
                "
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

          <div className="mt-[2.5cqi]">
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
            />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============================================================================
   4. CLEANING SERVICE

   Clean corporate / hospitality layout.
============================================================================ */

function VariantCleaningService({
  headline,
  subtext,
  badgeText,
  extraText,
  productImage,
  brandName,
  website,
  price,
  ctaText,
  phone,
  email,
  colors,
  editable,
  onUpdate,
  onFocusEl,
  onBlurEl,
}: PremiumBrandProps) {
  const parsed = useMemo(
    () => parseFlyerContent(badgeText, extraText),
    [badgeText, extraText]
  );

  return (
    <div
      className="@container w-full h-full relative overflow-hidden font-sans"
      style={{
        backgroundColor: colors.primary,
        color: colors.secondary,
      }}
    >
      {/* accent header */}
      <div
        className="absolute top-0 left-0 right-0 h-[15cqi]"
        style={{
          backgroundColor: colors.accent,
        }}
      />

      <div className="relative z-10 px-[6cqi] pt-[5cqi]">
        <div className="flex justify-between items-center">
          <EditableText
            as="p"
            fieldId="f-brand"
            editable={editable}
            value={brandName ?? ""}
            onChange={(v) => onUpdate?.("brandName", v)}
            onFocusEl={onFocusEl}
            onBlurEl={onBlurEl}
            className="
              text-[2.25cqi]
              font-bold
              uppercase
              tracking-[0.18em]
            "
            style={{
              color: colors.primary,
            }}
          />

          {website && (
            <EditableText
              as="p"
              fieldId="f-web"
              editable={editable}
              value={website}
              onChange={(v) => onUpdate?.("website", v)}
              onFocusEl={onFocusEl}
              onBlurEl={onBlurEl}
              className="text-[1.7cqi] opacity-65"
              style={{
                color: colors.primary,
              }}
            />
          )}
        </div>
      </div>

      <div className="absolute inset-x-0 top-[15cqi] bottom-0">
        {/* image */}
        <div className="absolute right-0 top-0 bottom-0 w-[47%] overflow-hidden">
          <Image
            src={productImage}
            alt=""
            fill
            priority
            crossOrigin="anonymous"
            className="object-cover"
          />

          <div
            className="absolute inset-y-0 left-0 w-[30%]"
            style={{
              background: `linear-gradient(
                to right,
                ${colors.primary},
                transparent
              )`,
            }}
          />
        </div>

        {/* content */}
        <div className="absolute left-[6cqi] top-[6cqi] w-[52%] bottom-[5cqi]">
          <p
            className="text-[1.7cqi] uppercase tracking-[0.28em] opacity-45 mb-[2.5cqi]"
            style={{
              color: colors.secondary,
            }}
          >
            {parsed.kicker || "Professional service"}
          </p>

          <h1
            className="
              font-semibold
              uppercase
              tracking-[-0.05em]
              leading-[0.88]
            "
            style={{
              fontSize: "8.2cqi",
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
                      ? { color: colors.accent }
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
            fieldId="f-sub"
            editable={editable}
            value={subtext}
            onChange={(v) => onUpdate?.("subtext", v)}
            onFocusEl={onFocusEl}
            onBlurEl={onBlurEl}
            className="
              mt-[3.5cqi]
              text-[2.1cqi]
              leading-[1.45]
              opacity-55
              max-w-[85%]
            "
          />

          <div className="mt-[4cqi]">
            <FeatureList
              features={parsed.features}
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
            />
          </div>

          <div className="absolute bottom-0 left-0 right-0">
            <div className="flex items-center justify-between">
              {price && (
                <EditableText
                  as="p"
                  fieldId="f-price"
                  editable={editable}
                  value={price}
                  onChange={(v) => onUpdate?.("price", v)}
                  onFocusEl={onFocusEl}
                  onBlurEl={onBlurEl}
                  className="text-[5cqi] font-semibold"
                  style={{
                    color: colors.accent,
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

            <div className="mt-[2.5cqi]">
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
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============================================================================
   5. ORGANIC DEAL

   Modern wellness / food / lifestyle.
============================================================================ */

function VariantOrganicDeal({
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
}: PremiumBrandProps) {
  const parsed = useMemo(
    () => parseFlyerContent(badgeText, extraText),
    [badgeText, extraText]
  );

  return (
    <div
      className="@container w-full h-full relative overflow-hidden font-sans"
      style={{
        backgroundColor: colors.primary,
        color: colors.secondary,
      }}
    >
      {/* organic shape */}
      <div
        className="absolute -right-[15cqi] -top-[12cqi] w-[55cqi] h-[55cqi] rounded-full"
        style={{
          backgroundColor: colors.accent,
          opacity: 0.07,
        }}
      />

      <BrandHeader
        brandName={brandName}
        website={website}
        editable={editable}
        onUpdate={onUpdate}
        onFocusEl={onFocusEl}
        onBlurEl={onBlurEl}
        colors={colors}
      />

      <div className="absolute inset-x-[6cqi] top-[17cqi] bottom-[6cqi]">
        {/* image */}
        <div className="absolute right-0 top-0 w-[58%] h-[50%]">
          <Image
            src={productImage}
            alt=""
            fill
            priority
            crossOrigin="anonymous"
            className="object-contain"
          />
        </div>

        {/* headline */}
        <div className="absolute left-0 top-[3cqi] w-[67%] z-10">
          <p
            className="text-[1.7cqi] uppercase tracking-[0.3em] opacity-45 mb-[2cqi]"
            style={{
              color: colors.secondary,
            }}
          >
            {parsed.kicker || "Naturally better"}
          </p>

          <h1
            className="
              font-semibold
              uppercase
              tracking-[-0.055em]
              leading-[0.88]
            "
            style={{
              fontSize: "8.7cqi",
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

        {/* bottom information */}
        <div className="absolute left-0 right-0 bottom-0">
          <div className="w-full h-px mb-[4cqi]" style={{
            backgroundColor: hexToRgba(colors.secondary, 0.1),
          }} />

          <EditableText
            as="p"
            fieldId="f-sub"
            editable={editable}
            value={subtext}
            onChange={(v) => onUpdate?.("subtext", v)}
            onFocusEl={onFocusEl}
            onBlurEl={onBlurEl}
            className="
              text-[2.15cqi]
              leading-[1.45]
              opacity-55
              max-w-[72%]
            "
          />

          {parsed.features.length > 0 && (
            <div className="mt-[3cqi]">
              <FeatureList
                features={parsed.features}
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
              />
            </div>
          )}

          <div className="flex items-center justify-between mt-[4cqi]">
            {price ? (
              <EditableText
                as="p"
                fieldId="f-price"
                editable={editable}
                value={price}
                onChange={(v) => onUpdate?.("price", v)}
                onFocusEl={onFocusEl}
                onBlurEl={onBlurEl}
                className="
                  text-[5.5cqi]
                  font-semibold
                  tracking-[-0.03em]
                "
                style={{
                  color: colors.accent,
                }}
              />
            ) : (
              <div />
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

          <div className="mt-[2.5cqi]">
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
            />
          </div>
        </div>
      </div>
    </div>
  );
}





