"use client";

import React from "react";
import { Globe, Mail, Phone, Plus } from "lucide-react";
import { EditableText } from "@/components/EditableText";

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
  onFocusEl?: (el: HTMLElement) => void;
  onBlurEl?: () => void;
};

type RestoreButtonProps = {
  label: string;
  onClick?: () => void;
};

// ============================================================================
// Shared helpers
// ============================================================================

function cleanStringArray(values: unknown): string[] {
  if (!Array.isArray(values)) return [];
  return values.filter(
    (value): value is string =>
      typeof value === "string" && value.trim().length > 0
  );
}

function RestoreSectionButton({ label, onClick }: RestoreButtonProps) {
  if (!onClick) return null;
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

function RestoreChip({ label, onClick }: RestoreButtonProps) {
  if (!onClick) return null;
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
      style={{ fontSize: cq(1.3), minHeight: "36px" }}
    >
      <Plus style={{ width: cq(1.4), height: cq(1.4) }} />
      <span className="truncate">{label}</span>
    </button>
  );
}

// ============================================================================
// Feature List — uses simple dot, no icons, no remove buttons
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
    if (!editable) return null;
    return (
      <RestoreSectionButton
        label="Add features section"
        onClick={onRestoreSection}
      />
    );
  }

  if (cleanFeatures.length === 0 && !editable) return null;

  return (
    <section
      data-flyer-block="features"
      className="flex w-full flex-col"
      style={{ marginTop: 0, gap: cq(1) }}
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
          className="flex items-center"
          style={{ gap: cq(1.2) }}
        >
          <span
            className="flex shrink-0 items-center justify-center rounded-full"
            style={{
              width: cq(0.8),
              height: cq(0.8),
              backgroundColor: colors.accent,
              opacity: 0.7,
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
            className="min-w-0 flex-1"
            style={{ fontSize: cq(1.85) }}
          />
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
// Why Choose Us — simple dot, no checkmark, no remove buttons
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
    if (!editable) return null;
    return (
      <RestoreSectionButton
        label="Add why-choose-us section"
        onClick={onRestoreSection}
      />
    );
  }

  if (cleanItems.length === 0 && !editable) return null;

  return (
    <section
      data-flyer-block="why-choose-us"
      className="flex w-full flex-col"
      style={{ marginTop: 0, gap: cq(1) }}
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
          className="flex items-center"
          style={{ gap: cq(1.2) }}
        >
          <span
            className="flex shrink-0 items-center justify-center rounded-full"
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
            className="min-w-0 flex-1"
            style={{ fontSize: cq(1.85) }}
          />
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
// Contact Item — no remove button
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
    </div>
  );
}

// ============================================================================
// Contact Bar — no remove buttons, only update
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

  if (!editable && !hasVisibleContact) return null;

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