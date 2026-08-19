"use client";

import React from "react";
import {
  CheckCircle2,
  Globe,
  Mail,
  Phone,
  Plus,
  X,
} from "lucide-react";

import { EditableText } from "@/components/EditableText";

// ============================================================================
// Canvas-relative scale
// ----------------------------------------------------------------------------
// Sized against the @container this element renders inside (cqi), NOT the
// browser viewport (vw). This is what keeps spacing/type consistent whether
// the flyer is shown full-size in the editor canvas or shrunk into a small
// preview thumbnail — vw has no idea the preview is scaled down, cqi does.
// ============================================================================

const cq = (n: number) => `clamp(${n * 1.5}px, ${n}cqi, ${n * 12}px)`;

// ============================================================================
// Types
// ============================================================================

export type FlyerColors = {
  primary: string;
  secondary: string;
  accent: string;
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
  title?: string;

  onUpdateTitle?: (value: string) => void;
  onUpdateFeature?: (index: number, value: string) => void;
  onAddFeature?: () => void;
  onRemoveFeature?: (index: number) => void;
  onRestoreSection?: () => void;
};

export type WhyChooseUsListProps = SharedBlockProps & {
  items?: string[];
  visible?: boolean;
  title?: string;

  onUpdateTitle?: (value: string) => void;
  onUpdate?: (index: number, value: string) => void;
  onAdd?: () => void;
  onRemove?: (index: number) => void;
  onRestoreSection?: () => void;
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

  onRestorePhone?: () => void;
  onRestoreWebsite?: () => void;
  onRestoreEmail?: () => void;

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
  onRemove?: () => void;

  onFocusEl?: (el: HTMLElement) => void;
  onBlurEl?: () => void;
};

type RemoveButtonProps = {
  onClick?: () => void;
  label?: string;
};

type RestoreButtonProps = {
  label: string;
  onClick?: () => void;
};

// ============================================================================
// Shared helpers
// ============================================================================

function cleanStringArray(values: unknown): string[] {
  if (!Array.isArray(values)) {
    return [];
  }

  return values.filter(
    (value): value is string =>
      typeof value === "string" && value.trim().length > 0
  );
}

/**
 * Small secondary control (delete-item X). Visual size stays compact so
 * it fits inline in a dense list row, but the tappable hit-area is
 * padded out via negative margin so fingers don't need pixel precision.
 *
 * Previously this was `opacity-0` + `group-hover:opacity-100` — on
 * touchscreens there is no hover state, so on every mobile device this
 * button was invisible and untappable. Now it's always visible at
 * reduced opacity and goes full-opacity on hover (desktop) or
 * focus/active (any device, including touch).
 */
function RemoveButton({
  onClick,
  label = "Remove",
}: RemoveButtonProps) {
  if (!onClick) {
    return null;
  }

  return (
    <button
      type="button"
      data-flyer-control="true"
      aria-label={label}
      title={label}
      onClick={onClick}
      className="
        ml-1 -m-1.5 p-1.5 shrink-0
        inline-flex items-center justify-center
        rounded-full
        text-red-400
        opacity-50
        transition
        hover:bg-red-500/20 hover:text-red-300 hover:opacity-100
        focus:opacity-100
        active:opacity-100
      "
    >
      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-red-500/10">
        <X size={12} />
      </span>
    </button>
  );
}

function RestoreSectionButton({
  label,
  onClick,
}: RestoreButtonProps) {
  if (!onClick) {
    return null;
  }

  return (
    <button
      type="button"
      data-flyer-control="true"
      onClick={onClick}
      className="
        flex w-full items-center justify-center gap-1.5
        rounded-lg
        border border-dashed border-white/25
        text-white/50
        transition
        hover:border-white/50
        hover:text-white/80
      "
      style={{
        paddingTop: cq(1.2),
        paddingBottom: cq(1.2),
        fontSize: cq(1.8),
        minHeight: "44px",
      }}
    >
      <Plus style={{ width: cq(1.6), height: cq(1.6) }} />
      {label}
    </button>
  );
}

/**
 * Used only for contact fields that have been hidden.
 */
function RestoreChip({
  label,
  onClick,
}: RestoreButtonProps) {
  if (!onClick) {
    return null;
  }

  return (
    <button
      type="button"
      data-flyer-control="true"
      onClick={onClick}
      aria-label={`Restore ${label}`}
      title={`Restore ${label}`}
      className="
        inline-flex min-w-0 max-w-full
        items-center gap-1
        rounded-md
        border border-dashed border-white/20
        px-2 py-1.5
        text-white/50
        transition
        hover:border-white/40
        hover:text-white/80
      "
      style={{
        fontSize: cq(1.3),
        minHeight: "36px",
      }}
    >
      <Plus style={{ width: cq(1.4), height: cq(1.4) }} />
      <span className="truncate">{label}</span>
    </button>
  );
}

// ============================================================================
// Feature List
// ============================================================================

export function FeatureList({
  features = [],
  colors,
  editable = false,
  visible = true,
  title = "FEATURES",
  onUpdateTitle,
  onUpdateFeature,
  onAddFeature,
  onRemoveFeature,
  onRestoreSection,
  onFocusEl,
  onBlurEl,
}: FeatureListProps) {
  const cleanFeatures = cleanStringArray(features);

  if (!visible) {
    if (!editable) {
      return null;
    }
    return (
      <RestoreSectionButton
        label="Add features section"
        onClick={onRestoreSection}
      />
    );
  }

  if (cleanFeatures.length === 0 && !editable) {
    return null;
  }

  return (
    <section
      data-flyer-block="features"
      className="flex max-w-[85%] flex-col"
      style={{ marginTop: cq(2.5), gap: cq(1.3) }}
    >
      <EditableText
        as="h3"
        fieldId="f-features-title"
        editable={editable}
        value={title}
        onChange={onUpdateTitle}
        onFocusEl={onFocusEl}
        onBlurEl={onBlurEl}
        className="font-black tracking-widest"
        style={{ color: colors.accent, fontSize: cq(2.3) }}
      />

      {cleanFeatures.map((feature, index) => (
        <div
          key={`feature-${index}`}
          className="group flex items-center"
          style={{ gap: cq(1) }}
        >
          <span
            className="flex shrink-0 items-center justify-center rounded-full"
            style={{
              width: cq(2.4),
              height: cq(2.4),
              backgroundColor: `${colors.accent}22`,
            }}
          >
            <CheckCircle2
              style={{ color: colors.accent, width: cq(1.5), height: cq(1.5) }}
            />
          </span>

          <EditableText
            as="span"
            fieldId={`f-feature-${index}`}
            editable={editable}
            value={feature}
            onChange={(value) => onUpdateFeature?.(index, value)}
            onFocusEl={onFocusEl}
            onBlurEl={onBlurEl}
            className="min-w-0 flex-1"
            style={{ fontSize: cq(1.85) }}
          />

          {editable && (
            <RemoveButton
              label={`Remove feature ${index + 1}`}
              onClick={() => onRemoveFeature?.(index)}
            />
          )}
        </div>
      ))}

      {editable && (
        <button
          type="button"
          data-flyer-control="true"
          onClick={onAddFeature}
          className="inline-flex w-fit items-center gap-1 rounded-md px-1 py-1.5 transition hover:bg-black/5"
          style={{ color: colors.accent, fontSize: cq(1.7), minHeight: "36px" }}
        >
          <Plus style={{ width: cq(1.8), height: cq(1.8) }} />
          Add feature
        </button>
      )}
    </section>
  );
}

// ============================================================================
// Why Choose Us
// ============================================================================

export function WhyChooseUsList({
  items = [],
  colors,
  editable = false,
  visible = true,
  title = "WHY CHOOSE US",
  onUpdateTitle,
  onUpdate,
  onAdd,
  onRemove,
  onRestoreSection,
  onFocusEl,
  onBlurEl,
}: WhyChooseUsListProps) {
  const cleanItems = cleanStringArray(items);

  if (!visible) {
    if (!editable) {
      return null;
    }
    return (
      <RestoreSectionButton
        label="Add why-choose-us section"
        onClick={onRestoreSection}
      />
    );
  }

  if (cleanItems.length === 0 && !editable) {
    return null;
  }

  return (
    <section
      data-flyer-block="why-choose-us"
      className="flex max-w-[85%] flex-col"
      style={{ marginTop: cq(2.5), gap: cq(1.3) }}
    >
      <EditableText
        as="h3"
        fieldId="f-why-title"
        editable={editable}
        value={title}
        onChange={onUpdateTitle}
        onFocusEl={onFocusEl}
        onBlurEl={onBlurEl}
        className="font-black tracking-widest"
        style={{ color: colors.accent, fontSize: cq(2.3) }}
      />

      {cleanItems.map((item, index) => (
        <div
          key={`why-${index}`}
          className="group flex items-center"
          style={{ gap: cq(1) }}
        >
          <span
            className="flex shrink-0 items-center justify-center rounded-full"
            style={{
              width: cq(2.4),
              height: cq(2.4),
              backgroundColor: `${colors.accent}22`,
            }}
          >
            <CheckCircle2
              style={{ color: colors.accent, width: cq(1.5), height: cq(1.5) }}
            />
          </span>

          <EditableText
            as="span"
            fieldId={`f-why-${index}`}
            editable={editable}
            value={item}
            onChange={(value) => onUpdate?.(index, value)}
            onFocusEl={onFocusEl}
            onBlurEl={onBlurEl}
            className="min-w-0 flex-1"
            style={{ fontSize: cq(1.85) }}
          />

          {editable && (
            <RemoveButton
              label={`Remove reason ${index + 1}`}
              onClick={() => onRemove?.(index)}
            />
          )}
        </div>
      ))}

      {editable && (
        <button
          type="button"
          data-flyer-control="true"
          onClick={onAdd}
          className="inline-flex w-fit items-center gap-1 rounded-md px-1 py-1.5 transition hover:bg-black/5"
          style={{ color: colors.accent, fontSize: cq(1.7), minHeight: "36px" }}
        >
          <Plus style={{ width: cq(1.8), height: cq(1.8) }} />
          Add reason
        </button>
      )}
    </section>
  );
}

// ============================================================================
// Contact Item
// ============================================================================

function ContactItem({
  id,
  icon,
  value,
  accentColor,
  textColor,
  editable = false,
  onChange,
  onRemove,
  onFocusEl,
  onBlurEl,
}: ContactItemProps) {
  const hasValue = value.trim().length > 0;

  if (!editable && !hasValue) {
    return null;
  }

  return (
    <div className="group flex min-w-0 items-center" style={{ gap: cq(0.8) }}>
      <span
        className="flex shrink-0 items-center justify-center rounded-full"
        style={{ width: cq(2), height: cq(2), backgroundColor: accentColor }}
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
          style={{ color: textColor, fontSize: cq(1.4) }}
        />
      ) : (
        <span
          className="min-w-0 flex-1 truncate"
          style={{ color: textColor, fontSize: cq(1.4) }}
        >
          {value}
        </span>
      )}

      {editable && onRemove && hasValue && (
        <RemoveButton label="Remove contact field" onClick={onRemove} />
      )}
    </div>
  );
}

// ============================================================================
// Contact Bar
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
  onRestorePhone,
  onRestoreWebsite,
  onRestoreEmail,
  onFocusEl,
  onBlurEl,
}: ContactBarProps) {
  const hasVisibleContact = Boolean(
    (phoneVisible && phone.trim()) ||
      (websiteVisible && website.trim()) ||
      (emailVisible && email.trim())
  );

  if (!editable && !hasVisibleContact) {
    return null;
  }

  const iconStyle = { color: "#ffffff" };

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
            icon={<Phone size={11} style={iconStyle} />}
            value={phone}
            editable={editable}
            onChange={onUpdatePhone}
            onRemove={onRemovePhone}
            onFocusEl={onFocusEl}
            onBlurEl={onBlurEl}
            accentColor={accentColor}
            textColor={textColor}
          />
        ) : (
          <RestoreChip label="Phone" onClick={onRestorePhone} />
        )}
      </div>

      <div className="min-w-0 flex-1">
        {websiteVisible ? (
          <ContactItem
            id="contact-website"
            icon={<Globe size={11} style={iconStyle} />}
            value={website}
            editable={editable}
            onChange={onUpdateWebsite}
            onRemove={onRemoveWebsite}
            onFocusEl={onFocusEl}
            onBlurEl={onBlurEl}
            accentColor={accentColor}
            textColor={textColor}
          />
        ) : (
          <RestoreChip label="Website" onClick={onRestoreWebsite} />
        )}
      </div>

      <div className="min-w-0 flex-1">
        {emailVisible ? (
          <ContactItem
            id="contact-email"
            icon={<Mail size={11} style={iconStyle} />}
            value={email}
            editable={editable}
            onChange={onUpdateEmail}
            onRemove={onRemoveEmail}
            onFocusEl={onFocusEl}
            onBlurEl={onBlurEl}
            accentColor={accentColor}
            textColor={textColor}
          />
        ) : (
          <RestoreChip label="Email" onClick={onRestoreEmail} />
        )}
      </div>
    </section>
  );
}

// ============================================================================
// Flyer Content Parser (unchanged — no cqi/layout logic here)
// ============================================================================

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

const MAX_FEATURES = 6;
const BULLET_PREFIX = /^[-•●✓✔▪◦]\s*/;
const PHONE_PATTERN = /(?:\+?\d[\d\s().-]{7,}\d)/i;
const EMAIL_PATTERN = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i;
const WEBSITE_PATTERN = /(?:https?:\/\/|www\.)[^\s]+/i;

function normalizeLine(value: string): string {
  return value.replace(BULLET_PREFIX, "").replace(/\s+/g, " ").trim();
}

function isHeading(value: string): boolean {
  return (
    /^our services$/i.test(value) ||
    /^services$/i.test(value) ||
    /^features$/i.test(value) ||
    /^feature highlights$/i.test(value) ||
    /^why choose us$/i.test(value) ||
    /^why us$/i.test(value)
  );
}

function isContactLine(value: string): boolean {
  return (
    PHONE_PATTERN.test(value) ||
    EMAIL_PATTERN.test(value) ||
    WEBSITE_PATTERN.test(value)
  );
}

export function parseFlyerContent(
  badgeText?: string,
  extraText?: string
): ParsedFlyerContent {
  const badge = badgeText?.trim() ?? "";
  const extra = extraText?.trim() ?? "";
  const source = `${badge}\n${extra}`;

  const rawLines = source.split(/\r?\n/).map(normalizeLine).filter(Boolean);
  const features: string[] = [];

  for (const line of rawLines) {
    if (isHeading(line) || isContactLine(line)) continue;
    const alreadyExists = features.some(
      (feature) => feature.toLowerCase() === line.toLowerCase()
    );
    if (!alreadyExists) features.push(line);
  }

  const cleanFeatures = features.slice(0, MAX_FEATURES);

  const phone = source.match(PHONE_PATTERN)?.[0]?.trim();
  const email = source.match(EMAIL_PATTERN)?.[0]?.trim();
  const website = source.match(WEBSITE_PATTERN)?.[0]?.trim();

  const updateFeature = (index: number, value: string): string => {
    if (index < 0 || index >= cleanFeatures.length) return cleanFeatures.join("\n");
    const updated = [...cleanFeatures];
    updated[index] = value.trim();
    return updated.filter(Boolean).join("\n");
  };

  const addFeature = (): string => {
    if (cleanFeatures.length >= MAX_FEATURES) return cleanFeatures.join("\n");
    return [...cleanFeatures, "New feature"].join("\n");
  };

  const removeFeature = (index: number): string => {
    if (index < 0 || index >= cleanFeatures.length) return cleanFeatures.join("\n");
    return cleanFeatures.filter((_, itemIndex) => itemIndex !== index).join("\n");
  };

  return {
    features: cleanFeatures,
    kicker: undefined,
    phone,
    email,
    website,
    updateFeature,
    addFeature,
    removeFeature,
  };
}