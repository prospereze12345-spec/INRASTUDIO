"use client";

import React from "react";
import {
  Phone,
  Mail,
  Globe,
  CheckCircle2,
  Plus,
  X,
} from "lucide-react";

import { EditableText } from "@/components/EditableText";

type FeatureListProps = {
  features: string[];
  accentColor: string;
  textColor: string;
  editable?: boolean;

  onUpdateFeature?: (index: number, value: string) => void;
  onAddFeature?: () => void;
  onRemoveFeature?: (index: number) => void;

  onFocusEl?: (el: HTMLElement) => void;
  onBlurEl?: () => void;
};

export function FeatureList({
  features,
  accentColor,
  textColor,
  editable = false,
  onUpdateFeature,
  onAddFeature,
  onRemoveFeature,
  onFocusEl,
  onBlurEl,
}: FeatureListProps) {
  if (!features || features.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-col gap-2">
      {features.map((feature, index) => (
        <div
          key={`feature-${index}`}
          className="group/feature flex items-center gap-2"
        >
          <span
            className="flex shrink-0 items-center justify-center rounded-full"
            style={{
              width: 18,
              height: 18,
              backgroundColor: `${accentColor}22`,
            }}
          >
            <CheckCircle2
              size={12}
              style={{ color: accentColor }}
            />
          </span>

          {editable ? (
            <EditableText
              fieldId={`feature-${index}`}
              value={feature}
              onChange={(value) =>
                onUpdateFeature?.(index, value)
              }
              onFocusEl={onFocusEl}
              onBlurEl={onBlurEl}
              className="min-w-[40px] text-[13px] leading-snug"
              style={{ color: textColor }}
            />
          ) : (
            <span
              className="text-[13px] leading-snug"
              style={{ color: textColor }}
            >
              {feature}
            </span>
          )}

          {editable && onRemoveFeature && (
            <button
              type="button"
              onClick={() => onRemoveFeature(index)}
              className="shrink-0 opacity-0 transition-opacity group-hover/feature:opacity-100"
              title="Remove feature"
            >
              <X
                size={11}
                className="text-red-400"
              />
            </button>
          )}
        </div>
      ))}

      {editable && onAddFeature && (
        <button
          type="button"
          onClick={onAddFeature}
          className="mt-0.5 flex items-center gap-1.5 text-[11px] opacity-60 transition-opacity hover:opacity-100"
          style={{ color: textColor }}
        >
          <Plus size={12} />
          Add line
        </button>
      )}
    </div>
  );
}

type ContactItemProps = {
  icon: React.ReactNode;
  value: string;

  editable?: boolean;
  onChange?: (value: string) => void;

  onFocusEl?: (el: HTMLElement) => void;
  onBlurEl?: () => void;

  id: string;
  accentColor: string;
  textColor: string;
};

function ContactItem({
  icon,
  value,
  editable = false,
  onChange,
  onFocusEl,
  onBlurEl,
  id,
  accentColor,
  textColor,
}: ContactItemProps) {
  return (
    <div className="flex items-center gap-1.5">
      <span
        className="flex shrink-0 items-center justify-center rounded-full"
        style={{
          width: 20,
          height: 20,
          backgroundColor: accentColor,
        }}
      >
        {icon}
      </span>

      {editable ? (
        <EditableText
          as="span"
          fieldId={id}
          editable={editable}
          value={value}
          onChange={(v) => onChange?.(v)}
          onFocusEl={onFocusEl}
          onBlurEl={onBlurEl}
          className="min-w-[30px] text-[10px]"
          style={{ color: textColor }}
        />
      ) : (
        <span
          className="text-[10px]"
          style={{ color: textColor }}
        >
          {value}
        </span>
      )}
    </div>
  );
}

type ContactBarProps = {
  phone?: string;
  website?: string;
  email?: string;

  accentColor: string;
  textColor: string;

  editable?: boolean;

  onUpdatePhone?: (value: string) => void;
  onUpdateWebsite?: (value: string) => void;
  onUpdateEmail?: (value: string) => void;

  onFocusEl?: (el: HTMLElement) => void;
  onBlurEl?: () => void;
};

export function ContactBar({
  phone,
  website,
  email,
  accentColor,
  textColor,
  editable = false,
  onUpdatePhone,
  onUpdateWebsite,
  onUpdateEmail,
  onFocusEl,
  onBlurEl,
}: ContactBarProps) {
  const hasAny =
    Boolean(phone) ||
    Boolean(website) ||
    Boolean(email) ||
    editable;

  if (!hasAny) {
    return null;
  }

  const iconStyle = {
    color: "#ffffff",
  };

  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5">
      {(phone || editable) && (
        <ContactItem
          id="contact-phone"
          icon={
            <Phone
              size={11}
              style={iconStyle}
            />
          }
          value={phone || ""}
          editable={editable}
          onChange={onUpdatePhone}
          onFocusEl={onFocusEl}
          onBlurEl={onBlurEl}
          accentColor={accentColor}
          textColor={textColor}
        />
      )}

      {(website || editable) && (
        <ContactItem
          id="contact-website"
          icon={
            <Globe
              size={11}
              style={iconStyle}
            />
          }
          value={website || ""}
          editable={editable}
          onChange={onUpdateWebsite}
          onFocusEl={onFocusEl}
          onBlurEl={onBlurEl}
          accentColor={accentColor}
          textColor={textColor}
        />
      )}

      {(email || editable) && (
        <ContactItem
          id="contact-email"
          icon={
            <Mail
              size={11}
              style={iconStyle}
            />
          }
          value={email || ""}
          editable={editable}
          onChange={onUpdateEmail}
          onFocusEl={onFocusEl}
          onBlurEl={onBlurEl}
          accentColor={accentColor}
          textColor={textColor}
        />
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// FLYER CONTENT PARSER
// Converts AI-generated flyer text into structured content that templates
// can consume consistently.
// ─────────────────────────────────────────────────────────────────────────────
export interface ParsedFlyerContent {
  features: string[];
  kicker?: string;
  phone?: string;
  email?: string;
  website?: string;

  updateFeature: (index: number, value: string) => string;
  addFeature: () => string;
  removeFeature: (index: number) => string;
}

export function parseFlyerContent(
  badgeText?: string,
  extraText?: string
): ParsedFlyerContent {
  const features: string[] = [];

  const badge = (badgeText ?? "").trim();
  const extra = (extraText ?? "").trim();

  // Split on new lines first.
  const lines = badge
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  for (const line of lines) {
    const normalized = line
      .replace(/^[-•●✓✔]\s*/, "")
      .replace(/^OUR SERVICES\s*:?\s*$/i, "")
      .replace(/^WHY CHOOSE US\s*:?\s*$/i, "")
      .replace(/^SERVICES\s*:?\s*$/i, "")
      .trim();

    if (
      normalized &&
      !/^our services$/i.test(normalized) &&
      !/^why choose us$/i.test(normalized) &&
      !/^services$/i.test(normalized)
    ) {
      features.push(normalized);
    }
  }

  // Also allow extraText to contain feature-like lines.
  if (extra) {
    const extraLines = extra
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean);

    for (const line of extraLines) {
      const normalized = line
        .replace(/^[-•●✓✔]\s*/, "")
        .trim();

      if (
        normalized &&
        !features.some(
          (existing) =>
            existing.toLowerCase() === normalized.toLowerCase()
        )
      ) {
        features.push(normalized);
      }
    }
  }

  // Limit the flyer to a sensible number of visible features.
  const cleanFeatures = features.slice(0, 6);

  const combined = `${badge}\n${extra}`;

  const phoneMatch = combined.match(
    /(?:\+?\d[\d\s().-]{7,}\d)/i
  );

  const emailMatch = combined.match(
    /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i
  );

  const websiteMatch = combined.match(
    /(?:https?:\/\/|www\.)[^\s]+/i
  );
const updateFeature = (index: number, value: string): string => {
  const updated = [...cleanFeatures];

  if (index >= 0 && index < updated.length) {
    updated[index] = value;
  }

  return updated.join("\n");
};

const addFeature = (): string => {
  return [...cleanFeatures, "New feature"].join("\n");
};

const removeFeature = (index: number): string => {
  return cleanFeatures
    .filter((_, i) => i !== index)
    .join("\n");
};

return {
  features: cleanFeatures,

  // PremiumBrand uses this as a small label above the headline.
  // Leave it undefined when the source text does not explicitly provide one.
  kicker: undefined,

  phone: phoneMatch?.[0]?.trim(),
  email: emailMatch?.[0]?.trim(),
  website: websiteMatch?.[0]?.trim(),

  updateFeature,
  addFeature,
  removeFeature,
};
}
