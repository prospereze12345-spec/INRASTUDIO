"use client";

import React from "react";
import Image from "next/image";
import { EditableText } from "@/components/EditableText";
import { EditableHeadlineLines } from "@/components/Editableheadlinelines";
import {
  FeatureList,
  ContactBar,
  WhyChooseUsList,
} from "./FlyerContentBlocks";

export interface SleekFlyerProps {
  name?: string;
  headline: string;
  subheadline?: string;
  tagline?: string;
  ctaText: string;
  productImage: string;
  brandName?: string;
  website?: string;
  price?: string;
  badge?: string;
  features?: string[];
  phone?: string;
  email?: string;

  colors: {
    primary: string;
    secondary: string;
    accent: string;
  };

  editable?: boolean;
  onUpdate?: (field: string, value: string) => void;

  onUpdateFeature?: (index: number, value: string) => void;
  onAddFeature?: () => void;
  onRemoveFeature?: (index: number) => void;

  onUpdatePhone?: (value: string) => void;
  onUpdateWebsite?: (value: string) => void;
  onUpdateEmail?: (value: string) => void;

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
}

/* -------------------------------------------------------------------------- */
/* Shared constants/helpers                                                   */
/* -------------------------------------------------------------------------- */

const FONT =
  "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Helvetica Neue', Arial, sans-serif";

const rootStyle = (colors: SleekFlyerProps["colors"]): React.CSSProperties => ({
  width: "100%",
  height: "100%",
  minWidth: 0,
  minHeight: 0,
  position: "relative",
  overflow: "hidden",
  fontFamily: FONT,
  backgroundColor: colors.primary,
  color: colors.secondary,
  boxSizing: "border-box",
});

const ci = (value: number) => `calc(${value} * var(--ci, 1px))`;

const textOverflowStyle: React.CSSProperties = {
  minWidth: 0,
  overflowWrap: "anywhere",
  wordBreak: "break-word",
};

type FlyerImageProps = {
  src: string;
  alt?: string;
  position?: string;
  contain?: boolean;
  style?: React.CSSProperties;
};

function FlyerImage({
  src,
  alt = "Product",
  position = "50% 50%",
  contain = true,
  style,
}: FlyerImageProps) {
  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes="100vw"
      priority
      unoptimized
      draggable={false}
      className={contain ? "sleek-flyer-image contain" : "sleek-flyer-image cover"}
      style={{
        objectPosition: position,
        ...style,
      }}
    />
  );
}

function Brand({
  brandName,
  editable,
  onUpdate,
  onFocusEl,
  onBlurEl,
  color,
  opacity = 0.5,
  fontSize = 2.2,
}: Pick<
  SleekFlyerProps,
  "brandName" | "editable" | "onUpdate" | "onFocusEl" | "onBlurEl"
> & {
  color: string;
  opacity?: number;
  fontSize?: number;
}) {
  return (
    <EditableText
      as="span"
      fieldId="f-brand"
      editable={editable}
      value={brandName ?? ""}
      onChange={(value) => onUpdate?.("brandName", value)}
      onFocusEl={onFocusEl}
      onBlurEl={onBlurEl}
      style={{
        ...textOverflowStyle,
        fontSize: ci(fontSize),
        fontWeight: 700,
        letterSpacing: "0.22em",
        textTransform: "uppercase",
        color,
        opacity,
      }}
    />
  );
}

function Subheadline({
  value,
  editable,
  onUpdate,
  onFocusEl,
  onBlurEl,
  color,
  fontSize = 2.4,
  maxWidth = "30ch",
}: {
  value?: string;
  editable?: boolean;
  onUpdate?: SleekFlyerProps["onUpdate"];
  onFocusEl?: SleekFlyerProps["onFocusEl"];
  onBlurEl?: SleekFlyerProps["onBlurEl"];
  color: string;
  fontSize?: number;
  maxWidth?: string;
}) {
  if (value === undefined) return null;

  return (
    <EditableText
      as="p"
      fieldId="f-sub"
      editable={editable}
      value={value}
      onChange={(next) => onUpdate?.("subtext", next)}
      onFocusEl={onFocusEl}
      onBlurEl={onBlurEl}
      style={{
        ...textOverflowStyle,
        margin: 0,
        maxWidth,
        fontSize: ci(fontSize),
        lineHeight: 1.45,
        fontWeight: 400,
        color,
        opacity: 0.55,
      }}
    />
  );
}

function Price({
  value,
  editable,
  onUpdate,
  onFocusEl,
  onBlurEl,
  color,
  fontSize = 6,
}: {
  value?: string;
  editable?: boolean;
  onUpdate?: SleekFlyerProps["onUpdate"];
  onFocusEl?: SleekFlyerProps["onFocusEl"];
  onBlurEl?: SleekFlyerProps["onBlurEl"];
  color: string;
  fontSize?: number;
}) {
  if (!value) return null;

  return (
    <EditableText
      as="span"
      fieldId="f-price"
      editable={editable}
      value={value}
      onChange={(next) => onUpdate?.("price", next)}
      onFocusEl={onFocusEl}
      onBlurEl={onBlurEl}
      style={{
        ...textOverflowStyle,
        fontSize: ci(fontSize),
        fontWeight: 700,
        letterSpacing: "-0.035em",
        color,
      }}
    />
  );
}

function CTA({
  value,
  editable,
  onUpdate,
  onFocusEl,
  onBlurEl,
  backgroundColor,
  color,
  border,
}: {
  value: string;
  editable?: boolean;
  onUpdate?: SleekFlyerProps["onUpdate"];
  onFocusEl?: SleekFlyerProps["onFocusEl"];
  onBlurEl?: SleekFlyerProps["onBlurEl"];
  backgroundColor?: string;
  color: string;
  border?: string;
}) {
  return (
    <EditableText
      as="div"
      fieldId="f-cta"
      editable={editable}
      value={value}
      onChange={(next) => onUpdate?.("ctaText", next)}
      onFocusEl={onFocusEl}
      onBlurEl={onBlurEl}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        maxWidth: "100%",
        minHeight: ci(7),
        padding: `${ci(1.8)} ${ci(4)}`,
        borderRadius: "999px",
        backgroundColor,
        border,
        color,
        fontSize: ci(2.2),
        lineHeight: 1.15,
        fontWeight: 600,
        letterSpacing: "0.03em",
        boxSizing: "border-box",
        overflowWrap: "anywhere",
      }}
    />
  );
}

function ContentLists({
  props,
  colorOverride,
}: {
  props: SleekFlyerProps;
  colorOverride?: string;
}) {
  const {
    features,
    whyChooseUs,
    colors,
    editable,
    onUpdateFeature,
    onAddFeature,
    onRemoveFeature,
    onUpdateWhyChooseUs,
    onAddWhyChooseUs,
    onRemoveWhyChooseUs,
    featuresVisible,
    whyChooseUsVisible,
    onRestoreFeatures,
    onRestoreWhyChooseUs,
    onFocusEl,
    onBlurEl,
  } = props;

  const color = colorOverride ?? colors.secondary;

  return (
    <div
      style={{
        minWidth: 0,
        maxWidth: "100%",
        display: "flex",
        flexDirection: "column",
        gap: ci(1.5),
        color,
      }}
    >
      <FeatureList
        features={features}
        colors={{
          ...colors,
          secondary: color,
        }}
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
        colors={{
          ...colors,
          secondary: color,
        }}
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
  );
}

function Contacts(props: SleekFlyerProps & { accent?: string; text?: string }) {
  return (
    <ContactBar
      phone={props.phone}
      website={props.website}
      email={props.email}
      accentColor={props.accent ?? props.colors.accent}
      textColor={props.text ?? props.colors.secondary}
      editable={props.editable}
      onUpdatePhone={props.onUpdatePhone}
      onUpdateWebsite={props.onUpdateWebsite}
      onUpdateEmail={props.onUpdateEmail}
      onFocusEl={props.onFocusEl}
      onBlurEl={props.onBlurEl}
      phoneVisible={props.phoneVisible}
      websiteVisible={props.websiteVisible}
      emailVisible={props.emailVisible}
      onRemovePhone={props.onRemovePhone}
      onRemoveWebsite={props.onRemoveWebsite}
      onRemoveEmail={props.onRemoveEmail}
      onRestorePhone={props.onRestorePhone}
      onRestoreWebsite={props.onRestoreWebsite}
      onRestoreEmail={props.onRestoreEmail}
    />
  );
}

/* -------------------------------------------------------------------------- */
/* Template switcher                                                          */
/* -------------------------------------------------------------------------- */

export function SleekFlyerTemplate(props: SleekFlyerProps) {
  switch (props.name ?? "Mono Split") {
    case "Mono Split":
      return <VariantMonoSplit {...props} />;
    case "Editorial Arc":
      return <VariantEditorialArc {...props} />;
    case "Negative Space":
      return <VariantNegativeSpace {...props} />;
    case "Studio Grid":
      return <VariantStudioGrid {...props} />;
    case "Kōan":
      return <VariantKoan {...props} />;
    default:
      return <VariantMonoSplit {...props} />;
  }
}

/* -------------------------------------------------------------------------- */
/* 1. MONO SPLIT                                                              */
/*                                                                            */
/* Main responsive fix:                                                      */
/* - product image is now on the RIGHT                                       */
/* - image is vertically/horizontally centered                               */
/* - text is on the LEFT                                                      */
/* - no @container dependency                                                 */
/* -------------------------------------------------------------------------- */

function VariantMonoSplit(props: SleekFlyerProps) {
  const {
    headline,
    subheadline,
    ctaText,
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
  } = props;

  return (
    <div style={rootStyle(colors)}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "row",
        }}
      >
        {/* TEXT SIDE */}
        <div
          style={{
            position: "relative",
            zIndex: 10,
            width: "46%",
            height: "100%",
            minWidth: 0,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: `${ci(7)} ${ci(3)} ${ci(6)} ${ci(6)}`,
            boxSizing: "border-box",
            backgroundColor: colors.primary,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              minWidth: 0,
            }}
          >
            <Brand
              brandName={brandName}
              editable={editable}
              onUpdate={onUpdate}
              onFocusEl={onFocusEl}
              onBlurEl={onBlurEl}
              color={colors.secondary}
              fontSize={2.1}
            />
          </div>

          <div
            style={{
              minHeight: 0,
              flex: 1,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              gap: ci(2.2),
              overflow: "hidden",
              padding: `${ci(3)} 0`,
              boxSizing: "border-box",
            }}
          >
            <div
              style={{
                width: ci(8),
                height: ci(0.35),
                flexShrink: 0,
                backgroundColor: colors.accent,
              }}
            />

            <h1
              style={{
                ...textOverflowStyle,
                margin: 0,
                fontSize: "clamp(24px, 11cqi, 96px)",
                fontWeight: 800,
                lineHeight: 0.92,
                letterSpacing: "-0.03em",
                color: colors.secondary,
                fontFamily: FONT,
              }}
            >
              <EditableHeadlineLines
                value={headline}
                editable={editable}
                onFocusEl={onFocusEl}
                onBlurEl={onBlurEl}
                onChange={(value) => onUpdate?.("headline", value)}
                renderLine={(line, index, node) => (
                  <span key={`${index}-${line}`} style={{ display: "block" }}>
                    {node}
                  </span>
                )}
              />
            </h1>

            <Subheadline
              value={subheadline}
              editable={editable}
              onUpdate={onUpdate}
              onFocusEl={onFocusEl}
              onBlurEl={onBlurEl}
              color={colors.secondary}
              fontSize={2.45}
              maxWidth="28ch"
            />

            <ContentLists props={props} />

            <Price
              value={price}
              editable={editable}
              onUpdate={onUpdate}
              onFocusEl={onFocusEl}
              onBlurEl={onBlurEl}
              color={colors.secondary}
              fontSize={6}
            />
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              gap: ci(2.2),
              minWidth: 0,
            }}
          >
            <CTA
              value={ctaText}
              editable={editable}
              onUpdate={onUpdate}
              onFocusEl={onFocusEl}
              onBlurEl={onBlurEl}
              backgroundColor={colors.secondary}
              color={colors.primary}
            />

            <Contacts
              {...props}
              accent={colors.accent}
              text={colors.secondary}
            />
          </div>
        </div>

        {/* IMAGE SIDE — centered right */}
        <div
          style={{
            position: "relative",
            width: "54%",
            height: "100%",
            minWidth: 0,
            minHeight: 0,
            overflow: "hidden",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: colors.primary,
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundColor: colors.primary,
              opacity: 0.06,
            }}
          />

          <div
            style={{
              position: "relative",
              width: "92%",
              height: "88%",
              minWidth: 0,
              minHeight: 0,
              zIndex: 2,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <FlyerImage
              src={productImage}
              position="50% 50%"
              contain
              style={{
                filter: "drop-shadow(0 5% 4% rgba(0,0,0,0.14))",
              }}
            />
          </div>

          <div
            style={{
              position: "absolute",
              inset: 0,
              zIndex: 3,
              pointerEvents: "none",
              background:
                "linear-gradient(to right, rgba(0,0,0,0.08), transparent 35%)",
            }}
          />
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* 2. EDITORIAL ARC                                                           */
/* -------------------------------------------------------------------------- */

function VariantEditorialArc(props: SleekFlyerProps) {
  const {
    headline,
    subheadline,
    ctaText,
    productImage,
    brandName,
    badge,
    price,
    colors,
    editable,
    onUpdate,
    onFocusEl,
    onBlurEl,
  } = props;

  const lines = headline.split("\n");
  const line0 = lines[0] ?? "";
  const line1 = lines.slice(1).join("\n");

  return (
    <div style={rootStyle(colors)}>
      <div
        style={{
          position: "relative",
          zIndex: 30,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: ci(3),
          padding: `${ci(5)} ${ci(6)} 0`,
          boxSizing: "border-box",
        }}
      >
        <Brand
          brandName={brandName}
          editable={editable}
          onUpdate={onUpdate}
          onFocusEl={onFocusEl}
          onBlurEl={onBlurEl}
          color={colors.secondary}
          fontSize={2}
        />

        {badge ? (
          <EditableText
            as="span"
            fieldId="f-badge"
            editable={editable}
            value={badge}
            onChange={(value) => onUpdate?.("badgeText", value)}
            onFocusEl={onFocusEl}
            onBlurEl={onBlurEl}
            style={{
              flexShrink: 0,
              maxWidth: "45%",
              padding: `${ci(0.8)} ${ci(2.5)}`,
              border: `${ci(0.15)} solid ${colors.accent}`,
              borderRadius: "999px",
              fontSize: ci(1.8),
              fontWeight: 600,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: colors.accent,
              overflowWrap: "anywhere",
            }}
          />
        ) : null}
      </div>

      <div
        style={{
          position: "relative",
          zIndex: 20,
          padding: `${ci(2)} ${ci(6)} 0`,
          lineHeight: 0.84,
        }}
      >
        <h1
          style={{
            margin: 0,
            fontSize: "clamp(32px, 18cqi, 160px)",
            fontWeight: 900,
            letterSpacing: "-0.04em",
            color: colors.secondary,
            fontFamily: FONT,
          }}
        >
          <EditableText
            as="span"
            fieldId="f-headline-0"
            editable={editable}
            value={line0}
            onChange={(value) =>
              onUpdate?.("headline", line1 ? `${value}\n${line1}` : value)
            }
            onFocusEl={onFocusEl}
            onBlurEl={onBlurEl}
            style={{ display: "block", overflowWrap: "anywhere" }}
          />

          {line1 ? (
            <EditableText
              as="span"
              fieldId="f-headline-1"
              editable={editable}
              value={line1}
              onChange={(value) =>
                onUpdate?.("headline", line0 ? `${line0}\n${value}` : value)
              }
              onFocusEl={onFocusEl}
              onBlurEl={onBlurEl}
              style={{
                display: "block",
                color: "transparent",
                WebkitTextStroke: `${ci(0.15)} ${colors.secondary}`,
                opacity: 0.2,
                overflowWrap: "anywhere",
              }}
            />
          ) : null}
        </h1>
      </div>

      {/* Image is centered in the remaining area and stays safely inside bounds. */}
      <div
        style={{
          position: "absolute",
          top: "22%",
          right: "3%",
          width: "58%",
          height: "55%",
          zIndex: 15,
        }}
      >
        <FlyerImage
          src={productImage}
          position="50% 50%"
          contain
          style={{
            transform: "scale(1.02)",
            transformOrigin: "center center",
          }}
        />
      </div>

      <div
        style={{
          position: "absolute",
          left: "-10%",
          bottom: "-15%",
          width: "120%",
          height: "45%",
          backgroundColor: colors.accent,
          borderRadius: "50% 50% 0 0",
          zIndex: 10,
        }}
      />

      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: ci(5),
          zIndex: 30,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          gap: ci(4),
          padding: `0 ${ci(7)}`,
          boxSizing: "border-box",
        }}
      >
        <div
          style={{
            minWidth: 0,
            maxWidth: "65%",
            display: "flex",
            flexDirection: "column",
            gap: ci(1.5),
          }}
        >
          <Subheadline
            value={subheadline}
            editable={editable}
            onUpdate={onUpdate}
            onFocusEl={onFocusEl}
            onBlurEl={onBlurEl}
            color={colors.primary}
            fontSize={2.5}
            maxWidth="26ch"
          />

          <ContentLists props={props} colorOverride={colors.primary} />

          <Price
            value={price}
            editable={editable}
            onUpdate={onUpdate}
            onFocusEl={onFocusEl}
            onBlurEl={onBlurEl}
            color={colors.primary}
            fontSize={6.5}
          />
        </div>

        <div
          style={{
            flexShrink: 0,
            maxWidth: "35%",
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-end",
            gap: ci(1.5),
            textAlign: "right",
          }}
        >
          <CTA
            value={ctaText}
            editable={editable}
            onUpdate={onUpdate}
            onFocusEl={onFocusEl}
            onBlurEl={onBlurEl}
            color={colors.primary}
            backgroundColor="transparent"
            border="none"
          />

          <Contacts
            {...props}
            accent={colors.primary}
            text={colors.primary}
          />
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* 3. NEGATIVE SPACE                                                           */
/* -------------------------------------------------------------------------- */

function VariantNegativeSpace(props: SleekFlyerProps) {
  const {
    headline,
    subheadline,
    tagline,
    ctaText,
    productImage,
    brandName,
    price,
    colors,
    editable,
    onUpdate,
    onFocusEl,
    onBlurEl,
  } = props;

  return (
    <div style={rootStyle(colors)}>
      <div
        style={{
          height: ci(0.6),
          width: "100%",
          backgroundColor: colors.accent,
        }}
      />

      <div
        style={{
          height: "12%",
          minHeight: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: ci(3),
          padding: `0 ${ci(6)}`,
          boxSizing: "border-box",
        }}
      >
        <Brand
          brandName={brandName}
          editable={editable}
          onUpdate={onUpdate}
          onFocusEl={onFocusEl}
          onBlurEl={onBlurEl}
          color={colors.secondary}
          fontSize={2.2}
          opacity={1}
        />

        {tagline !== undefined ? (
          <EditableText
            as="span"
            fieldId="f-tagline"
            editable={editable}
            value={tagline}
            onChange={(value) => onUpdate?.("tagline", value)}
            onFocusEl={onFocusEl}
            onBlurEl={onBlurEl}
            style={{
              ...textOverflowStyle,
              maxWidth: "45%",
              fontSize: ci(2),
              fontWeight: 400,
              color: colors.secondary,
              opacity: 0.35,
              letterSpacing: "0.06em",
              textAlign: "right",
            }}
          />
        ) : null}
      </div>

      {/* Large centered product image area */}
      <div
        style={{
          position: "relative",
          height: "48%",
          minHeight: 0,
          margin: `0 ${ci(7)}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            position: "relative",
            width: "88%",
            height: "94%",
            minHeight: 0,
          }}
        >
          <FlyerImage
            src={productImage}
            position="50% 50%"
            contain
            style={{
              filter: "drop-shadow(0 6% 5% rgba(0,0,0,0.08))",
            }}
          />
        </div>
      </div>

      <div
        style={{
          height: "40%",
          minHeight: 0,
          padding: `0 ${ci(6)} ${ci(5)}`,
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          gap: ci(2),
        }}
      >
        <div
          style={{
            height: ci(0.08),
            width: "100%",
            backgroundColor: colors.secondary,
            opacity: 0.1,
          }}
        />

        <div
          style={{
            minHeight: 0,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            gap: ci(4),
          }}
        >
          <div
            style={{
              minWidth: 0,
              flex: 1,
              maxWidth: "68%",
              display: "flex",
              flexDirection: "column",
              gap: ci(1.5),
            }}
          >
            <h2
              style={{
                ...textOverflowStyle,
                margin: 0,
                fontSize: "clamp(18px, 8cqi, 72px)",
                fontWeight: 700,
                letterSpacing: "-0.025em",
                lineHeight: 0.95,
                color: colors.secondary,
                fontFamily: FONT,
              }}
            >
              <EditableHeadlineLines
                value={headline}
                editable={editable}
                onFocusEl={onFocusEl}
                onBlurEl={onBlurEl}
                onChange={(value) => onUpdate?.("headline", value)}
                renderLine={(line, index, node) => (
                  <span key={`${index}-${line}`} style={{ display: "block" }}>
                    {node}
                  </span>
                )}
              />
            </h2>

            <Subheadline
              value={subheadline}
              editable={editable}
              onUpdate={onUpdate}
              onFocusEl={onFocusEl}
              onBlurEl={onBlurEl}
              color={colors.secondary}
              fontSize={2.2}
              maxWidth="30ch"
            />

            <ContentLists props={props} />
          </div>

          <div
            style={{
              flexShrink: 0,
              maxWidth: "32%",
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-end",
              gap: ci(2),
            }}
          >
            <Price
              value={price}
              editable={editable}
              onUpdate={onUpdate}
              onFocusEl={onFocusEl}
              onBlurEl={onBlurEl}
              color={colors.accent}
              fontSize={5.5}
            />

            <CTA
              value={ctaText}
              editable={editable}
              onUpdate={onUpdate}
              onFocusEl={onFocusEl}
              onBlurEl={onBlurEl}
              color={colors.secondary}
              border={`${ci(0.15)} solid ${colors.secondary}`}
            />

            <Contacts
              {...props}
              accent={colors.accent}
              text={colors.secondary}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* 4. STUDIO GRID                                                              */
/* -------------------------------------------------------------------------- */

function VariantStudioGrid(props: SleekFlyerProps) {
  const {
    headline,
    subheadline,
    ctaText,
    productImage,
    brandName,
    badge,
    price,
    colors,
    editable,
    onUpdate,
    onFocusEl,
    onBlurEl,
  } = props;

  return (
    <div style={rootStyle(colors)}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%) rotate(-20deg)",
            fontSize: "clamp(80px, 40vw, 700px)",
            fontWeight: 900,
            letterSpacing: "-0.05em",
            color: colors.secondary,
            opacity: 0.03,
            whiteSpace: "nowrap",
          }}
        >
          {headline.split("\n")[0]}
        </div>

        <div
          style={{
            position: "absolute",
            top: "33.33%",
            left: 0,
            right: 0,
            height: ci(0.08),
            backgroundColor: colors.secondary,
            opacity: 0.08,
          }}
        />

        <div
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            right: "35%",
            width: ci(0.08),
            backgroundColor: colors.secondary,
            opacity: 0.08,
          }}
        />

        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "65%",
            height: "33.33%",
            backgroundColor: colors.accent,
          }}
        />
      </div>

      <div
        style={{
          position: "absolute",
          top: ci(5),
          left: ci(6),
          zIndex: 20,
          maxWidth: "58%",
          display: "flex",
          flexDirection: "column",
          gap: ci(1.2),
        }}
      >
        <Brand
          brandName={brandName}
          editable={editable}
          onUpdate={onUpdate}
          onFocusEl={onFocusEl}
          onBlurEl={onBlurEl}
          color={colors.primary}
          fontSize={3}
          opacity={1}
        />

        {badge ? (
          <EditableText
            as="span"
            fieldId="f-badge"
            editable={editable}
            value={badge}
            onChange={(value) => onUpdate?.("badgeText", value)}
            onFocusEl={onFocusEl}
            onBlurEl={onBlurEl}
            style={{
              fontSize: ci(1.8),
              fontWeight: 500,
              color: colors.primary,
              opacity: 0.7,
              letterSpacing: "0.06em",
              overflowWrap: "anywhere",
            }}
          />
        ) : null}
      </div>

      {/* Product image remains visually dominant and centered in the left area. */}
      <div
        style={{
          position: "absolute",
          top: "10%",
          left: "4%",
          width: "62%",
          height: "70%",
          zIndex: 15,
        }}
      >
        <FlyerImage
          src={productImage}
          position="50% 50%"
          contain
          style={{
            filter: "drop-shadow(0 5% 6% rgba(0,0,0,0.15))",
          }}
        />
      </div>

      <div
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          width: "35%",
          height: "100%",
          zIndex: 20,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: `${ci(7)} ${ci(5)} ${ci(12)} ${ci(4)}`,
          gap: ci(2.5),
          boxSizing: "border-box",
          overflow: "hidden",
        }}
      >
        <h1
          style={{
            ...textOverflowStyle,
            margin: 0,
            fontSize: "clamp(16px, 7.5cqi, 64px)",
            fontWeight: 800,
            letterSpacing: "-0.03em",
            lineHeight: 0.95,
            color: colors.secondary,
            fontFamily: FONT,
          }}
        >
          <EditableHeadlineLines
            value={headline}
            editable={editable}
            onFocusEl={onFocusEl}
            onBlurEl={onBlurEl}
            onChange={(value) => onUpdate?.("headline", value)}
            renderLine={(line, index, node) => (
              <span key={`${index}-${line}`} style={{ display: "block" }}>
                {node}
              </span>
            )}
          />
        </h1>

        <div
          style={{
            width: ci(6),
            height: ci(0.3),
            backgroundColor: colors.accent,
            flexShrink: 0,
          }}
        />

        <Subheadline
          value={subheadline}
          editable={editable}
          onUpdate={onUpdate}
          onFocusEl={onFocusEl}
          onBlurEl={onBlurEl}
          color={colors.secondary}
          fontSize={2.2}
        />

        <ContentLists props={props} />

        <Price
          value={price}
          editable={editable}
          onUpdate={onUpdate}
          onFocusEl={onFocusEl}
          onBlurEl={onBlurEl}
          color={colors.secondary}
          fontSize={6.5}
        />
      </div>

      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          minHeight: ci(10),
          zIndex: 30,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: ci(3),
          padding: `${ci(2)} ${ci(6)}`,
          borderTop: `${ci(0.08)} solid ${colors.secondary}18`,
          boxSizing: "border-box",
        }}
      >
        <CTA
          value={ctaText}
          editable={editable}
          onUpdate={onUpdate}
          onFocusEl={onFocusEl}
          onBlurEl={onBlurEl}
          backgroundColor={colors.secondary}
          color={colors.primary}
        />

        <Contacts
          {...props}
          accent={colors.accent}
          text={colors.secondary}
        />
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* 5. KŌAN                                                                     */
/* -------------------------------------------------------------------------- */

function VariantKoan(props: SleekFlyerProps) {
  const {
    headline,
    subheadline,
    tagline,
    ctaText,
    productImage,
    brandName,
    price,
    colors,
    editable,
    onUpdate,
    onFocusEl,
    onBlurEl,
  } = props;

  return (
    <div style={rootStyle(colors)}>
      <div
        style={{
          height: "12%",
          minHeight: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: `${ci(4)} ${ci(4)} 0`,
          boxSizing: "border-box",
        }}
      >
        <Brand
          brandName={brandName}
          editable={editable}
          onUpdate={onUpdate}
          onFocusEl={onFocusEl}
          onBlurEl={onBlurEl}
          color={colors.secondary}
          fontSize={2}
          opacity={0.4}
        />

        {tagline !== undefined ? (
          <EditableText
            as="p"
            fieldId="f-tagline"
            editable={editable}
            value={tagline}
            onChange={(value) => onUpdate?.("tagline", value)}
            onFocusEl={onFocusEl}
            onBlurEl={onBlurEl}
            style={{
              margin: `${ci(1.5)} 0 0`,
              maxWidth: "80%",
              fontSize: ci(2.2),
              fontStyle: "italic",
              color: colors.secondary,
              opacity: 0.35,
              textAlign: "center",
              overflowWrap: "anywhere",
            }}
          />
        ) : null}
      </div>

      {/* Centered image — safe percentage sizing for small screens. */}
      <div
        style={{
          position: "relative",
          height: "39%",
          minHeight: 0,
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            position: "absolute",
            width: "58%",
            height: "96%",
            maxWidth: "62%",
            maxHeight: "96%",
            borderRadius: "50%",
            border: `${ci(0.12)} solid ${colors.secondary}`,
            opacity: 0.08,
          }}
        />

        <div
          style={{
            position: "absolute",
            width: "43%",
            height: "72%",
            borderRadius: "50%",
            border: `${ci(0.2)} solid ${colors.accent}`,
            opacity: 0.6,
          }}
        />

        <div
          style={{
            position: "relative",
            width: "60%",
            height: "92%",
            minHeight: 0,
            zIndex: 10,
          }}
        >
          <FlyerImage
            src={productImage}
            position="50% 50%"
            contain
            style={{
              filter: "drop-shadow(0 4% 6% rgba(0,0,0,0.12))",
            }}
          />
        </div>
      </div>

      <div
        style={{
          height: "49%",
          minHeight: 0,
          padding: `0 ${ci(8)} ${ci(5)}`,
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "flex-start",
          gap: ci(2),
          textAlign: "center",
        }}
      >
        <div
          style={{
            width: ci(5),
            height: ci(0.25),
            backgroundColor: colors.accent,
            flexShrink: 0,
          }}
        />

        <h1
          style={{
            ...textOverflowStyle,
            margin: 0,
            fontSize: "clamp(20px, 9cqi, 80px)",
            fontWeight: 700,
            letterSpacing: "-0.03em",
            lineHeight: 0.95,
            color: colors.secondary,
            fontFamily: FONT,
          }}
        >
          <EditableHeadlineLines
            value={headline}
            editable={editable}
            onFocusEl={onFocusEl}
            onBlurEl={onBlurEl}
            onChange={(value) => onUpdate?.("headline", value)}
            renderLine={(line, index, node) => (
              <span key={`${index}-${line}`} style={{ display: "block" }}>
                {node}
              </span>
            )}
          />
        </h1>

        <Subheadline
          value={subheadline}
          editable={editable}
          onUpdate={onUpdate}
          onFocusEl={onFocusEl}
          onBlurEl={onBlurEl}
          color={colors.secondary}
          fontSize={2.35}
          maxWidth="28ch"
        />

        <div
          style={{
            width: "100%",
            maxWidth: "calc(65 * var(--ci, 1px))",
            minWidth: 0,
            textAlign: "left",
          }}
        >
          <ContentLists props={props} />
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: ci(3),
            width: "100%",
            flexWrap: "wrap",
            marginTop: ci(0.5),
          }}
        >
          <Price
            value={price}
            editable={editable}
            onUpdate={onUpdate}
            onFocusEl={onFocusEl}
            onBlurEl={onBlurEl}
            color={colors.accent}
            fontSize={4}
          />

          <CTA
            value={ctaText}
            editable={editable}
            onUpdate={onUpdate}
            onFocusEl={onFocusEl}
            onBlurEl={onBlurEl}
            color={colors.secondary}
            border={`${ci(0.12)} solid ${colors.secondary}`}
          />
        </div>

        <Contacts
          {...props}
          accent={colors.accent}
          text={colors.secondary}
        />
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* iOS 15.8-safe CSS                                                          */
/* -------------------------------------------------------------------------- */
/*
Add this to your global CSS once:

.sleek-flyer-image {
  width: 100% !important;
  height: 100% !important;
  display: block;
  max-width: none;
  max-height: none;
  user-select: none;
  -webkit-user-drag: none;
}

.sleek-flyer-image.contain {
  object-fit: contain !important;
}

.sleek-flyer-image.cover {
  object-fit: cover !important;
}

Do NOT add @container to this component.
Safari 15.8 is the reason the previous @container-based approach was risky.
*/

