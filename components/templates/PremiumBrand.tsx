"use client";

import React, { useMemo } from "react";
import Image from "next/image";
import {
  FeatureList,
  ContactBar,
  parseFlyerContent,
  WhyChooseUsList,
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
    <header className="flex items-center justify-between px-[calc(6*var(--ci))] pt-[calc(5*var(--ci))] relative z-20">
      <EditableText
        as="p"
        fieldId="f-brand"
        editable={editable}
        value={brandName ?? ""}
        onChange={(v) => onUpdate?.("brandName", v)}
        onFocusEl={onFocusEl}
        onBlurEl={onBlurEl}
        className="
          text-[calc(2.25*var(--ci))]
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
            text-[calc(1.65*var(--ci))]
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
        "px-[calc(4.5*var(--ci))] py-[calc(2.4*var(--ci))]",
        "text-[calc(2.15*var(--ci))]",
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

      <span className="ml-[calc(2*var(--ci))] opacity-60">→</span>
    </div>
  );
}

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
  features,
  onUpdateFeature,
  onAddFeature,
  onRemoveFeature,
  whyChooseUs,
  onUpdateWhyChooseUs,
  onAddWhyChooseUs,
  onRemoveWhyChooseUs,
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
      <div
        className="absolute inset-[calc(3*var(--ci))] pointer-events-none"
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

      <main className="absolute inset-x-0 top-[calc(14*var(--ci))] bottom-0">
        <div className="absolute inset-x-[calc(5*var(--ci))] top-[calc(8*var(--ci))] bottom-[calc(23*var(--ci))] overflow-hidden">
          <Image
            src={productImage}
            alt=""
            fill
            priority
            crossOrigin="anonymous"
            className="object-contain object-center"
          />

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

        <div className="absolute left-[calc(6*var(--ci))] right-[calc(6*var(--ci))] top-0 z-10">
          <p
            className="text-[calc(1.65*var(--ci))] uppercase tracking-[0.25em] mb-[calc(2*var(--ci))] opacity-45"
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
              fontSize: "calc(10*var(--ci))",
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

        <div className="absolute left-[calc(6*var(--ci))] right-[calc(6*var(--ci))] bottom-[calc(5*var(--ci))] z-20">
          <div className="flex items-end justify-between gap-[calc(4*var(--ci))]">
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
                    text-[calc(6.5*var(--ci))]
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
                  mt-[calc(1*var(--ci))]
                  text-[calc(2*var(--ci))]
                  leading-[1.35]
                  opacity-55
                "
              />

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

            <SmartCTA
              value={ctaText}
              editable={editable}
              onUpdate={onUpdate}
              onFocusEl={onFocusEl}
              onBlurEl={onBlurEl}
              colors={colors}
            />
          </div>

          <div className="mt-[calc(3*var(--ci))]">
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
          </div>
        </div>
      </main>
    </div>
  );
}

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

      <div className="absolute left-[calc(6*var(--ci))] right-[calc(6*var(--ci))] top-[calc(17*var(--ci))] bottom-[calc(6*var(--ci))]">
        <div
          className="absolute left-[58%] top-0 bottom-0 w-px"
          style={{
            backgroundColor: hexToRgba(colors.secondary, 0.08),
          }}
        />

        <section className="absolute left-0 top-0 w-[52%] pr-[calc(5*var(--ci))]">
          <div className="flex items-center gap-[calc(1.5*var(--ci))] mb-[calc(3*var(--ci))]">
            <span
              className="w-[calc(3.5*var(--ci))] h-[1px]"
              style={{ backgroundColor: colors.accent }}
            />

            <span
              className="text-[calc(1.65*var(--ci))] uppercase tracking-[0.25em] opacity-45"
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
              fontSize: "calc(8.3*var(--ci))",
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
              mt-[calc(4*var(--ci))]
              text-[calc(2.15*var(--ci))]
              leading-[1.45]
              opacity-55
              max-w-[85%]
            "
          />

          <div className="mt-[calc(5*var(--ci))]">
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

          <div className="mt-[calc(5*var(--ci))] flex items-end gap-[calc(3*var(--ci))]">
            {price && (
              <EditableText
                as="p"
                fieldId="f-price"
                editable={editable}
                value={price}
                onChange={(v) => onUpdate?.("price", v)}
                onFocusEl={onFocusEl}
                onBlurEl={onBlurEl}
                className="text-[calc(5*var(--ci))] font-semibold tracking-tight"
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

        <section className="absolute right-0 top-0 bottom-[12%] w-[38%]">
          <div className="absolute inset-[calc(2*var(--ci))] overflow-hidden rounded-[calc(2*var(--ci))]">
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
            className="absolute -bottom-[calc(2*var(--ci))] -left-[calc(2*var(--ci))] w-[calc(10*var(--ci))] h-[calc(10*var(--ci))] rounded-full"
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
      className="@container w-full h-full relative overflow-hidden font-serif"
      style={{
        backgroundColor: colors.primary,
        color: colors.secondary,
      }}
    >
      <div
        className="absolute inset-[calc(4*var(--ci))] pointer-events-none"
        style={{
          border: `1px solid ${hexToRgba(colors.accent, 0.35)}`,
        }}
      />

      <header className="relative z-20 text-center pt-[calc(7*var(--ci))]">
        <EditableText
          as="p"
          fieldId="f-brand"
          editable={editable}
          value={brandName ?? ""}
          onChange={(v) => onUpdate?.("brandName", v)}
          onFocusEl={onFocusEl}
          onBlurEl={onBlurEl}
          className="
            text-[calc(2.2*var(--ci))]
            uppercase
            tracking-[0.45em]
            opacity-55
          "
        />

        <div className="flex justify-center items-center gap-[calc(2*var(--ci))] mt-[calc(2*var(--ci))]">
          <span
            className="w-[calc(10*var(--ci))] h-px"
            style={{
              backgroundColor: hexToRgba(colors.accent, 0.4),
            }}
          />

          <span
            className="w-[calc(0.9*var(--ci))] h-[calc(0.9*var(--ci))] rotate-45"
            style={{
              backgroundColor: colors.accent,
            }}
          />

          <span
            className="w-[calc(10*var(--ci))] h-px"
            style={{
              backgroundColor: hexToRgba(colors.accent, 0.4),
            }}
          />
        </div>
      </header>

      <div className="absolute inset-x-[calc(8*var(--ci))] top-[calc(20*var(--ci))] bottom-[calc(6*var(--ci))]">
        <div className="text-center relative z-20">
          <h1
            className="
              font-medium
              uppercase
              tracking-[-0.04em]
              leading-[0.9]
            "
            style={{
              fontSize: "calc(8*var(--ci))",
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
            className="w-full h-px mb-[calc(3*var(--ci))]"
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
                    text-[calc(6.2*var(--ci))]
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
                  mt-[calc(1*var(--ci))]
                  text-[calc(1.95*var(--ci))]
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

          <div className="mt-[calc(2.5*var(--ci))]">
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
          </div>
        </div>
      </div>
    </div>
  );
}

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
      className="@container w-full h-full relative overflow-hidden font-sans"
      style={{
        backgroundColor: colors.primary,
        color: colors.secondary,
      }}
    >
      <div
        className="absolute top-0 left-0 right-0 h-[calc(15*var(--ci))]"
        style={{
          backgroundColor: colors.accent,
        }}
      />

      <div className="relative z-10 px-[calc(6*var(--ci))] pt-[calc(5*var(--ci))]">
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
              text-[calc(2.25*var(--ci))]
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
              className="text-[calc(1.7*var(--ci))] opacity-65"
              style={{
                color: colors.primary,
              }}
            />
          )}
        </div>
      </div>

      <div className="absolute inset-x-0 top-[calc(15*var(--ci))] bottom-0">
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

        <div className="absolute left-[calc(6*var(--ci))] top-[calc(6*var(--ci))] w-[52%] bottom-[calc(5*var(--ci))]">
          <p
            className="text-[calc(1.7*var(--ci))] uppercase tracking-[0.28em] opacity-45 mb-[calc(2.5*var(--ci))]"
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
              fontSize: "calc(8.2*var(--ci))",
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
              mt-[calc(3.5*var(--ci))]
              text-[calc(2.1*var(--ci))]
              leading-[1.45]
              opacity-55
              max-w-[85%]
            "
          />

          <div className="mt-[calc(4*var(--ci))]">
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
                  className="text-[calc(5*var(--ci))] font-semibold"
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

            <div className="mt-[calc(2.5*var(--ci))]">
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

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
      className="@container w-full h-full relative overflow-hidden font-sans"
      style={{
        backgroundColor: colors.primary,
        color: colors.secondary,
      }}
    >
      <div
        className="absolute -right-[calc(15*var(--ci))] -top-[calc(12*var(--ci))] w-[calc(55*var(--ci))] h-[calc(55*var(--ci))] rounded-full"
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

      <div className="absolute inset-x-[calc(6*var(--ci))] top-[calc(17*var(--ci))] bottom-[calc(6*var(--ci))]">
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

        <div className="absolute left-0 top-[calc(3*var(--ci))] w-[67%] z-10">
          <p
            className="text-[calc(1.7*var(--ci))] uppercase tracking-[0.3em] opacity-45 mb-[calc(2*var(--ci))]"
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
              fontSize: "calc(8.7*var(--ci))",
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

        <div className="absolute left-0 right-0 bottom-0">
          <div className="w-full h-px mb-[calc(4*var(--ci))]" style={{
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
              text-[calc(2.15*var(--ci))]
              leading-[1.45]
              opacity-55
              max-w-[72%]
            "
          />

          {parsed.features.length > 0 && (
            <div className="mt-[calc(3*var(--ci))]">
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
          )}

          <div className="flex items-center justify-between mt-[calc(4*var(--ci))]">
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
                  text-[calc(5.5*var(--ci))]
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

          <div className="mt-[calc(2.5*var(--ci))]">
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
          </div>
        </div>
      </div>
    </div>
  );
}
