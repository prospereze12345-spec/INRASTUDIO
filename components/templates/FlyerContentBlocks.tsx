"use client";

import React from "react";
import { Globe, Mail, Phone } from "lucide-react";
import { EditableText } from "@/components/EditableText";

const cq = (n: number) => `calc(var(--ci) * ${n})`;

// ============================================================================
// TYPES – updated to match the new colour system
// ============================================================================

export type FlyerColors = {
  bg: string;      // was primary
  text: string;    // was secondary
  accent: string;  // unchanged
};

export type SharedBlockProps = {
  colors: FlyerColors;
  editable?: boolean;
  onFocusEl?: (el: HTMLElement) => void;
  onBlurEl?: () => void;
};

export type FeatureListProps = SharedBlockProps & {
  features?: string[];
  visible?: boolean;
  onUpdateFeature?: (index: number, value: string) => void;
};

export type WhyChooseUsListProps = SharedBlockProps & {
  items?: string[];
  visible?: boolean;
  onUpdate?: (index: number, value: string) => void;
};

export type ContactBarProps = {
  phone?: string;
  website?: string;
  email?: string;
  accentColor: string;
  textColor: string;
  editable?: boolean;
  phoneVisible?: boolean;
  websiteVisible?: boolean;
  emailVisible?: boolean;
  onUpdatePhone?: (value: string) => void;
  onUpdateWebsite?: (value: string) => void;
  onUpdateEmail?: (value: string) => void;
  onRemovePhone?: () => void;
  onRemoveWebsite?: () => void;
  onRemoveEmail?: () => void;
  onFocusEl?: (el: HTMLElement) => void;
  onBlurEl?: () => void;
};

type ContactItemProps = {
  id: string;
  icon: React.ReactNode;
  value: string;
  accentColor: string;
  textColor: string;
  editable?: boolean;
  onChange?: (value: string) => void;
  onFocusEl?: (el: HTMLElement) => void;
  onBlurEl?: () => void;
};

// ============================================================================
// HELPERS
// ============================================================================

function cleanStringArray(values: unknown): string[] {
  if (!Array.isArray(values)) return [];
  return values.filter(
    (value): value is string =>
      typeof value === "string" && value.trim().length > 0
  );
}

// ============================================================================
// FEATURE LIST
// ============================================================================

export function FeatureList({
  features = [],
  colors,
  editable = false,
  visible = true,
  onUpdateFeature,
  onFocusEl,
  onBlurEl,
}: FeatureListProps) {
  if (!visible) return null;

  const cleanFeatures = cleanStringArray(features);
  if (cleanFeatures.length === 0) return null;

  return (
    <section
      data-flyer-block="features"
      className="flex w-full flex-col"
      style={{ gap: cq(1.15) }}
    >
      <h3
        className="font-black tracking-widest"
        style={{
          color: colors.accent,
          fontSize: cq(2.3),
          lineHeight: 1,
          marginBottom: cq(0.35),
        }}
      >
        FEATURES
      </h3>

      <div className="flex flex-col" style={{ gap: cq(1) }}>
        {cleanFeatures.map((feature, index) => (
          <div
            key={`feature-${index}`}
            className="flex min-w-0 items-start"
            style={{ gap: cq(1.2) }}
          >
            <span
              className="mt-[0.55em] shrink-0 rounded-full"
              style={{
                width: cq(0.8),
                height: cq(0.8),
                backgroundColor: colors.accent,
                opacity: 1,
              }}
            />
            <EditableText
              as="span"
              fieldId={`f-feature-${index}`}
              editable={editable}
              value={feature}
              onChange={(value) => onUpdateFeature?.(index, value)}
              onFocusEl={onFocusEl}
              onBlurEl={onBlurEl}
              className="min-w-0 flex-1 leading-[1.3]"
              style={{ fontSize: cq(1.85) }}
            />
          </div>
        ))}
      </div>
    </section>
  );
}

// ============================================================================
// WHY CHOOSE US
// ============================================================================

export function WhyChooseUsList({
  items = [],
  colors,
  editable = false,
  visible = true,
  onUpdate,
  onFocusEl,
  onBlurEl,
}: WhyChooseUsListProps) {
  if (!visible) return null;

  const cleanItems = cleanStringArray(items);
  if (cleanItems.length === 0) return null;

  return (
    <section
      data-flyer-block="why-choose-us"
      className="flex w-full flex-col"
      style={{ gap: cq(1.15) }}
    >
      <h3
        className="font-black tracking-widest"
        style={{
          color: colors.accent,
          fontSize: cq(2.3),
          lineHeight: 1,
          marginBottom: cq(0.35),
        }}
      >
        WHY CHOOSE US
      </h3>

      <div className="flex flex-col" style={{ gap: cq(1) }}>
        {cleanItems.map((item, index) => (
          <div
            key={`why-${index}`}
            className="flex min-w-0 items-start"
            style={{ gap: cq(1.2) }}
          >
            <span
              className="mt-[0.55em] shrink-0 rounded-full"
              style={{
                width: cq(0.8),
                height: cq(0.8),
                backgroundColor: colors.accent,
                opacity: 0.7,
              }}
            />
            <EditableText
              as="span"
              fieldId={`f-why-${index}`}
              editable={editable}
              value={item}
              onChange={(value) => onUpdate?.(index, value)}
              onFocusEl={onFocusEl}
              onBlurEl={onBlurEl}
              className="min-w-0 flex-1 leading-[1.3]"
              style={{ fontSize: cq(1.85) }}
            />
          </div>
        ))}
      </div>
    </section>
  );
}

// ============================================================================
// CONTACT ITEM
// ============================================================================

function ContactItem({
  id,
  icon,
  value,
  accentColor,
  textColor,
  editable = false,
  onChange,
  onFocusEl,
  onBlurEl,
}: ContactItemProps) {
  const hasValue = value.trim().length > 0;
  if (!editable && !hasValue) return null;

  return (
    <div className="flex min-w-0 items-center" style={{ gap: cq(0.8) }}>
      <span
        className="flex shrink-0 items-center justify-center rounded-full"
        style={{
          width: cq(2.6),
          height: cq(2.6),
          backgroundColor: accentColor,
        }}
      >
        {icon}
      </span>

      {editable ? (
        <EditableText
          as="span"
          fieldId={id}
          editable
          value={value}
          onChange={onChange}
          onFocusEl={onFocusEl}
          onBlurEl={onBlurEl}
          className="min-w-0 flex-1 truncate"
          style={{
            color: textColor,
            fontSize: cq(1.4),
          }}
        />
      ) : (
        <span
          className="min-w-0 flex-1 truncate font-medium"
          style={{
            color: textColor,
            fontSize: cq(1.6),
          }}
        >
          {value}
        </span>
      )}
    </div>
  );
}

// ============================================================================
// CONTACT BAR
// ============================================================================

export function ContactBar({
  phone = "",
  website = "",
  email = "",
  accentColor,
  textColor,
  editable = false,
  phoneVisible = true,
  websiteVisible = true,
  emailVisible = true,
  onUpdatePhone,
  onUpdateWebsite,
  onUpdateEmail,
  onRemovePhone,
  onRemoveWebsite,
  onRemoveEmail,
  onFocusEl,
  onBlurEl,
}: ContactBarProps) {
  const hasVisibleContact = Boolean(
    (phoneVisible && phone.trim()) ||
    (websiteVisible && website.trim()) ||
    (emailVisible && email.trim())
  );

  if (!editable && !hasVisibleContact) return null;

  const iconStyle: React.CSSProperties = {
    color: "#ffffff",
    width: cq(1.3),
    height: cq(1.3),
  };

  return (
    <section
      data-flyer-block="contact"
      className="flex w-full flex-wrap items-center"
      style={{ gap: cq(2) }}
    >
      <div className="min-w-0 flex-1">
        {phoneVisible ? (
          <ContactItem
            id="contact-phone"
            icon={<Phone style={iconStyle} />}
            value={phone}
            editable={editable}
            onChange={onUpdatePhone}
            onFocusEl={onFocusEl}
            onBlurEl={onBlurEl}
            accentColor={accentColor}
            textColor={textColor}
          />
        ) : (
          <span className="text-[10px] text-zinc-500 italic">Phone hidden</span>
        )}
      </div>

      <div className="min-w-0 flex-1">
        {websiteVisible ? (
          <ContactItem
            id="contact-website"
            icon={<Globe style={iconStyle} />}
            value={website}
            editable={editable}
            onChange={onUpdateWebsite}
            onFocusEl={onFocusEl}
            onBlurEl={onBlurEl}
            accentColor={accentColor}
            textColor={textColor}
          />
        ) : (
          <span className="text-[10px] text-zinc-500 italic">Website hidden</span>
        )}
      </div>

      <div className="min-w-0 flex-1">
        {emailVisible ? (
          <ContactItem
            id="contact-email"
            icon={<Mail style={iconStyle} />}
            value={email}
            editable={editable}
            onChange={onUpdateEmail}
            onFocusEl={onFocusEl}
            onBlurEl={onBlurEl}
            accentColor={accentColor}
            textColor={textColor}
          />
        ) : (
          <span className="text-[10px] text-zinc-500 italic">Email hidden</span>
        )}
      </div>
    </section>
  );
}