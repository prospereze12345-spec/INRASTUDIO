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

// ---------------------------------------------------------------------------
// Sizing note: everything below uses calc(N * var(--ci)) / calc(N * var(--cb))
// instead of the old Ncqi / Ncqb container-query units. --ci and --cb are
// plain CSS custom properties (1% of canvas width / height) set on the
// editor's canvas wrapper. calc()+var() has worked since iOS 9.3; cqi/cqb
// require Safari 16+ and silently collapse to 0 on iOS 15 and older.
// ---------------------------------------------------------------------------

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
    <header
      className="flex items-center justify-between relative z-20"
      style={{ padding: "calc(5*var(--cb)) calc(6*var(--ci)) 0" }}
    >
      <EditableText
        as="p"
        fieldId="f-brand"
        editable={editable}
        value={brandName ?? ""}
        onChange={(v) => onUpdate?.("brandName", v)}
        onFocusEl={onFocusEl}
        onBlurEl={onBlurEl}
        className="font-semibold tracking-[0.18em] uppercase leading-none"
        style={{
          fontSize: "calc(2.25*var(--ci))",
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
          className="tracking-[0.08em] leading-none opacity-50"
          style={{
            fontSize: "calc(1.65*var(--ci))",
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
      className={["inline-flex items-center", "font-semibold", "tracking-[0.08em]", "uppercase", rounded ? "rounded-full" : ""].join(" ")}
      style={{
        backgroundColor: colors.accent,
        color: colors.primary,
        padding: "calc(2.4*var(--cb)) calc(4.5*var(--ci))",
        fontSize: "calc(2.15*var(--ci))",
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

      <span className="opacity-60" style={{ marginLeft: "calc(2*var(--ci))" }}>→</span>
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
      className="w-full h-full overflow-hidden relative font-sans"
      style={{
        backgroundColor: colors.primary,
        color: colors.secondary,
      }}
    >
      <div
        className="absolute pointer-events-none"
        style={{
          inset: "calc(3*var(--ci))",
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

      <main className="absolute inset-x-0 bottom-0" style={{ top: "calc(14*var(--cb))" }}>
        <div
          className="absolute overflow-hidden"
          style={{ left: "calc(5*var(--ci))", right: "calc(5*var(--ci))", top: "calc(8*var(--cb))", bottom: "calc(23*var(--cb))" }}
        >
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
              background: `linear-gradient(to top, ${colors.primary}, transparent)`,
            }}
          />
        </div>

        <div className="absolute top-0 z-10" style={{ left: "calc(6*var(--ci))", right: "calc(6*var(--ci))" }}>
          <p
            className="uppercase tracking-[0.25em] opacity-45"
            style={{ fontSize: "calc(1.65*var(--ci))", marginBottom: "calc(2*var(--cb))", color: colors.secondary }}
          >
            {parsed.kicker || "New"}
          </p>

          <h1
            className="font-semibold uppercase tracking-[-0.055em] leading-[0.86]"
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

        <div className="absolute z-20" style={{ left: "calc(6*var(--ci))", right: "calc(6*var(--ci))", bottom: "calc(5*var(--cb))" }}>
          <div className="flex items-end justify-between" style={{ gap: "calc(4*var(--ci))" }}>
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
                  className="font-semibold leading-none tracking-[-0.04em]"
                  style={{ fontSize: "calc(6.5*var(--ci))", color: colors.accent }}
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
                className="leading-[1.35] opacity-55"
                style={{ marginTop: "calc(1*var(--cb))", fontSize: "calc(2*var(--ci))" }}
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

          <div style={{ marginTop: "calc(3*var(--cb))" }}>
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
      className="w-full h-full relative overflow-hidden font-sans"
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

      <div
        className="absolute"
        style={{ left: "calc(6*var(--ci))", right: "calc(6*var(--ci))", top: "calc(17*var(--cb))", bottom: "calc(6*var(--cb))" }}
      >
        <div
          className="absolute top-0 bottom-0 w-px"
          style={{ left: "58%", backgroundColor: hexToRgba(colors.secondary, 0.08) }}
        />

        <section className="absolute left-0 top-0 w-[52%]" style={{ paddingRight: "calc(5*var(--ci))" }}>
          <div className="flex items-center" style={{ gap: "calc(1.5*var(--ci))", marginBottom: "calc(3*var(--cb))" }}>
            <span
              className="h-px"
              style={{ width: "calc(3.5*var(--ci))", backgroundColor: colors.accent }}
            />

            <span
              className="uppercase tracking-[0.25em] opacity-45"
              style={{ fontSize: "calc(1.65*var(--ci))", color: colors.secondary }}
            >
              {parsed.kicker || "Services"}
            </span>
          </div>

          <h1
            className="font-semibold uppercase tracking-[-0.055em] leading-[0.88]"
            style={{ fontSize: "calc(8.3*var(--ci))" }}
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
            className="leading-[1.45] opacity-55 max-w-[85%]"
            style={{ marginTop: "calc(4*var(--cb))", fontSize: "calc(2.15*var(--ci))" }}
          />

          <div style={{ marginTop: "calc(5*var(--cb))" }}>
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

          <div className="flex items-end" style={{ marginTop: "calc(5*var(--cb))", gap: "calc(3*var(--ci))" }}>
            {price && (
              <EditableText
                as="p"
                fieldId="f-price"
                editable={editable}
                value={price}
                onChange={(v) => onUpdate?.("price", v)}
                onFocusEl={onFocusEl}
                onBlurEl={onBlurEl}
                className="font-semibold tracking-tight"
                style={{ fontSize: "calc(5*var(--ci))", color: colors.accent }}
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
          <div className="absolute overflow-hidden" style={{ inset: "calc(2*var(--ci))", borderRadius: "calc(2*var(--ci))" }}>
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
            className="absolute rounded-full"
            style={{
              bottom: "calc(-2*var(--ci))", left: "calc(-2*var(--ci))",
              width: "calc(10*var(--ci))", height: "calc(10*var(--ci))",
              backgroundColor: colors.accent, opacity: 0.9,
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
      className="w-full h-full relative overflow-hidden font-serif"
      style={{
        backgroundColor: colors.primary,
        color: colors.secondary,
      }}
    >
      <div
        className="absolute pointer-events-none"
        style={{ inset: "calc(4*var(--ci))", border: `1px solid ${hexToRgba(colors.accent, 0.35)}` }}
      />

      <header className="relative z-20 text-center" style={{ paddingTop: "calc(7*var(--cb))" }}>
        <EditableText
          as="p"
          fieldId="f-brand"
          editable={editable}
          value={brandName ?? ""}
          onChange={(v) => onUpdate?.("brandName", v)}
          onFocusEl={onFocusEl}
          onBlurEl={onBlurEl}
          className="uppercase tracking-[0.45em] opacity-55"
          style={{ fontSize: "calc(2.2*var(--ci))" }}
        />

        <div className="flex justify-center items-center" style={{ gap: "calc(2*var(--ci))", marginTop: "calc(2*var(--cb))" }}>
          <span
            className="h-px"
            style={{ width: "calc(10*var(--ci))", backgroundColor: hexToRgba(colors.accent, 0.4) }}
          />

          <span
            className="rotate-45"
            style={{ width: "calc(0.9*var(--ci))", height: "calc(0.9*var(--ci))", backgroundColor: colors.accent }}
          />

          <span
            className="h-px"
            style={{ width: "calc(10*var(--ci))", backgroundColor: hexToRgba(colors.accent, 0.4) }}
          />
        </div>
      </header>

      <div className="absolute" style={{ left: "calc(8*var(--ci))", right: "calc(8*var(--ci))", top: "calc(20*var(--cb))", bottom: "calc(6*var(--cb))" }}>
        <div className="text-center relative z-20">
          <h1
            className="font-medium uppercase tracking-[-0.04em] leading-[0.9]"
            style={{ fontSize: "calc(8*var(--ci))" }}
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
            className="w-full h-px"
            style={{ marginBottom: "calc(3*var(--cb))", backgroundColor: hexToRgba(colors.accent, 0.25) }}
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
                  className="font-medium leading-none"
                  style={{ fontSize: "calc(6.2*var(--ci))", color: colors.accent }}
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
                className="leading-[1.4] opacity-50"
                style={{ marginTop: "calc(1*var(--cb))", fontSize: "calc(1.95*var(--ci))" }}
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

          <div style={{ marginTop: "calc(2.5*var(--cb))" }}>
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
      className="w-full h-full relative overflow-hidden font-sans"
      style={{
        backgroundColor: colors.primary,
        color: colors.secondary,
      }}
    >
      <div
        className="absolute top-0 left-0 right-0"
        style={{ height: "calc(15*var(--cb))", backgroundColor: colors.accent }}
      />

      <div className="relative z-10" style={{ padding: "calc(5*var(--cb)) calc(6*var(--ci)) 0" }}>
        <div className="flex justify-between items-center">
          <EditableText
            as="p"
            fieldId="f-brand"
            editable={editable}
            value={brandName ?? ""}
            onChange={(v) => onUpdate?.("brandName", v)}
            onFocusEl={onFocusEl}
            onBlurEl={onBlurEl}
            className="font-bold uppercase tracking-[0.18em]"
            style={{ fontSize: "calc(2.25*var(--ci))", color: colors.primary }}
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
              className="opacity-65"
              style={{ fontSize: "calc(1.7*var(--ci))", color: colors.primary }}
            />
          )}
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-0" style={{ top: "calc(15*var(--cb))" }}>
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
              background: `linear-gradient(to right, ${colors.primary}, transparent)`,
            }}
          />
        </div>

        <div className="absolute w-[52%]" style={{ left: "calc(6*var(--ci))", top: "calc(6*var(--cb))", bottom: "calc(5*var(--cb))" }}>
          <p
            className="uppercase tracking-[0.28em] opacity-45"
            style={{ fontSize: "calc(1.7*var(--ci))", marginBottom: "calc(2.5*var(--cb))", color: colors.secondary }}
          >
            {parsed.kicker || "Professional service"}
          </p>

          <h1
            className="font-semibold uppercase tracking-[-0.05em] leading-[0.88]"
            style={{ fontSize: "calc(8.2*var(--ci))" }}
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
            className="leading-[1.45] opacity-55 max-w-[85%]"
            style={{ marginTop: "calc(3.5*var(--cb))", fontSize: "calc(2.1*var(--ci))" }}
          />

          <div style={{ marginTop: "calc(4*var(--cb))" }}>
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
                  className="font-semibold"
                  style={{ fontSize: "calc(5*var(--ci))", color: colors.accent }}
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

            <div style={{ marginTop: "calc(2.5*var(--cb))" }}>
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
      className="w-full h-full relative overflow-hidden font-sans"
      style={{
        backgroundColor: colors.primary,
        color: colors.secondary,
      }}
    >
      <div
        className="absolute rounded-full"
        style={{
          right: "calc(-15*var(--ci))", top: "calc(-12*var(--cb))",
          width: "calc(55*var(--ci))", height: "calc(55*var(--ci))",
          backgroundColor: colors.accent, opacity: 0.07,
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

      <div className="absolute" style={{ left: "calc(6*var(--ci))", right: "calc(6*var(--ci))", top: "calc(17*var(--cb))", bottom: "calc(6*var(--cb))" }}>
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

        <div className="absolute left-0 w-[67%] z-10" style={{ top: "calc(3*var(--cb))" }}>
          <p
            className="uppercase tracking-[0.3em] opacity-45"
            style={{ fontSize: "calc(1.7*var(--ci))", marginBottom: "calc(2*var(--cb))", color: colors.secondary }}
          >
            {parsed.kicker || "Naturally better"}
          </p>

          <h1
            className="font-semibold uppercase tracking-[-0.055em] leading-[0.88]"
            style={{ fontSize: "calc(8.7*var(--ci))" }}
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
          <div
            className="w-full h-px"
            style={{ marginBottom: "calc(4*var(--cb))", backgroundColor: hexToRgba(colors.secondary, 0.1) }}
          />

          <EditableText
            as="p"
            fieldId="f-sub"
            editable={editable}
            value={subtext}
            onChange={(v) => onUpdate?.("subtext", v)}
            onFocusEl={onFocusEl}
            onBlurEl={onBlurEl}
            className="leading-[1.45] opacity-55 max-w-[72%]"
            style={{ fontSize: "calc(2.15*var(--ci))" }}
          />

          {parsed.features.length > 0 && (
            <div style={{ marginTop: "calc(3*var(--cb))" }}>
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

          <div className="flex items-center justify-between" style={{ marginTop: "calc(4*var(--cb))" }}>
            {price ? (
              <EditableText
                as="p"
                fieldId="f-price"
                editable={editable}
                value={price}
                onChange={(v) => onUpdate?.("price", v)}
                onFocusEl={onFocusEl}
                onBlurEl={onBlurEl}
                className="font-semibold tracking-[-0.03em]"
                style={{ fontSize: "calc(5.5*var(--ci))", color: colors.accent }}
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

          <div style={{ marginTop: "calc(2.5*var(--cb))" }}>
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
