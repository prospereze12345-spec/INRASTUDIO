"use client";

import React from "react";
import { Globe, Mail, Phone, Plus } from "lucide-react";
import { EditableText } from "@/components/EditableText";

const cq = (n: number) => `calc(var(--ci) * ${n})`;

// ============================================================================
// TYPES
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

  // Kept in type for compatibility.
  // The title itself is intentionally NOT editable.
  title?: string;

  onUpdateTitle?: (value: string) => void;

  // Only content editing is supported.
  onUpdateFeature?: (
    index: number,
    value: string
  ) => void;

  // Kept for parent compatibility but intentionally unused.
  onAddFeature?: () => void;
  onRemoveFeature?: (index: number) => void;

  onRestoreSection?: () => void;
};

export type WhyChooseUsListProps = SharedBlockProps & {
  items?: string[];
  visible?: boolean;

  // Kept for compatibility.
  // The title itself is intentionally NOT editable.
  title?: string;

  onUpdateTitle?: (value: string) => void;

  // Only content editing is supported.
  onUpdate?: (
    index: number,
    value: string
  ) => void;

  // Kept for parent compatibility but intentionally unused.
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
// HELPERS
// ============================================================================

function cleanStringArray(values: unknown): string[] {
  if (!Array.isArray(values)) return [];

  return values.filter(
    (value): value is string =>
      typeof value === "string" &&
      value.trim().length > 0
  );
}

// ============================================================================
// RESTORE SECTION
// ============================================================================

function RestoreSectionButton({
  label,
  onClick,
}: RestoreButtonProps) {
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
      <Plus
        style={{
          width: cq(1.6),
          height: cq(1.6),
        }}
      />

      {label}
    </button>
  );
}

// ============================================================================
// RESTORE CHIP
// ============================================================================

function RestoreChip({
  label,
  onClick,
}: RestoreButtonProps) {
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
      style={{
        fontSize: cq(1.3),
        minHeight: "36px",
      }}
    >
      <Plus
        style={{
          width: cq(1.4),
          height: cq(1.4),
        }}
      />

      <span className="truncate">
        {label}
      </span>
    </button>
  );
}

// ============================================================================
// FEATURE LIST
//
// Heading = FIXED
// Feature content = EDITABLE
// Add button = REMOVED
// Remove button = REMOVED
// Icon = simple dot
// ============================================================================

export function FeatureList({
  features = [],
  colors,
  editable = false,
  visible = true,
  onRestoreSection,
  onUpdateFeature,
  onFocusEl,
  onBlurEl,
}: FeatureListProps) {
  if (!visible) {
    if (!editable) return null;

    return (
      <RestoreSectionButton
        label="Add features section"
        onClick={onRestoreSection}
      />
    );
  }

  const cleanFeatures =
    cleanStringArray(features);

  if (cleanFeatures.length === 0) {
    return null;
  }

  return (
    <section
      data-flyer-block="features"
      className="flex w-full flex-col"
      style={{
        gap: cq(1.15),
      }}
    >
      {/* Fixed section label */}

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

      {/* Editable backend content */}

      <div
        className="flex flex-col"
        style={{
          gap: cq(1),
        }}
      >
        {cleanFeatures.map(
          (feature, index) => (
            <div
              key={`feature-${index}`}
              className="flex min-w-0 items-start"
              style={{
                gap: cq(1.2),
              }}
            >
              {/* Simple dot */}

                            <span
                className="mt-[0.55em] shrink-0 rounded-full"
                style={{
                  width: cq(0.8),
                  height: cq(0.8),
                  backgroundColor: colors.accent,
                  opacity: 1,
                }}
              />

              {/* ONLY THIS TEXT IS EDITABLE */}

              <EditableText
                as="span"
                fieldId={`f-feature-${index}`}
                editable={editable}
                value={feature}
                onChange={(value) =>
                  onUpdateFeature?.(
                    index,
                    value
                  )
                }
                onFocusEl={onFocusEl}
                onBlurEl={onBlurEl}
                className="min-w-0 flex-1 leading-[1.3]"
                style={{
                  fontSize: cq(1.85),
                }}
              />
            </div>
          )
        )}
      </div>
    </section>
  );
}

// ============================================================================
// WHY CHOOSE US
//
// Heading = FIXED
// Content = EDITABLE
// Add button = REMOVED
// Remove button = REMOVED
// Icon = simple dot
// ============================================================================

export function WhyChooseUsList({
  items = [],
  colors,
  editable = false,
  visible = true,
  onRestoreSection,
  onUpdate,
  onFocusEl,
  onBlurEl,
}: WhyChooseUsListProps) {
  if (!visible) {
    if (!editable) return null;

    return (
      <RestoreSectionButton
        label="Add why-choose-us section"
        onClick={onRestoreSection}
      />
    );
  }

  const cleanItems =
    cleanStringArray(items);

  if (cleanItems.length === 0) {
    return null;
  }

  return (
    <section
      data-flyer-block="why-choose-us"
      className="flex w-full flex-col"
      style={{
        gap: cq(1.15),
      }}
    >
      {/* Fixed section label */}

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

      {/* Editable backend content */}

      <div
        className="flex flex-col"
        style={{
          gap: cq(1),
        }}
      >
        {cleanItems.map(
          (item, index) => (
            <div
              key={`why-${index}`}
              className="flex min-w-0 items-start"
              style={{
                gap: cq(1.2),
              }}
            >
              {/* Simple dot */}

              <span
                className="mt-[0.55em] shrink-0 rounded-full"
                style={{
                  width: cq(0.8),
                  height: cq(0.8),
                  backgroundColor:
                    colors.accent,
                  opacity: 0.7,
                }}
              />

              {/* ONLY THIS TEXT IS EDITABLE */}

              <EditableText
                as="span"
                fieldId={`f-why-${index}`}
                editable={editable}
                value={item}
                onChange={(value) =>
                  onUpdate?.(
                    index,
                    value
                  )
                }
                onFocusEl={onFocusEl}
                onBlurEl={onBlurEl}
                className="min-w-0 flex-1 leading-[1.3]"
                style={{
                  fontSize: cq(1.85),
                }}
              />
            </div>
          )
        )}
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
  const hasValue =
    value.trim().length > 0;

  if (!editable && !hasValue) {
    return null;
  }

  return (
    <div
      className="flex min-w-0 items-center"
      style={{
        gap: cq(0.8),
      }}
    >
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

  onRestorePhone,
  onRestoreWebsite,
  onRestoreEmail,

  onFocusEl,
  onBlurEl,
}: ContactBarProps) {
  const hasVisibleContact = Boolean(
    (phoneVisible && phone.trim()) ||
      (websiteVisible &&
        website.trim()) ||
      (emailVisible &&
        email.trim())
  );

  if (!editable && !hasVisibleContact) {
    return null;
  }

    const iconStyle: React.CSSProperties = {
    color: "#ffffff",
    width: cq(1.3),
    height: cq(1.3),
  };

  return (
    <section
      data-flyer-block="contact"
      className="flex w-full flex-wrap items-center"
      style={{
        gap: cq(2),
      }}
    >
      {/* PHONE */}

      <div className="min-w-0 flex-1">
        {phoneVisible ? (
          <ContactItem
            id="contact-phone"
            icon={
              <Phone style={iconStyle} />

            }
            value={phone}
            editable={editable}
            onChange={onUpdatePhone}
            onFocusEl={onFocusEl}
            onBlurEl={onBlurEl}
            accentColor={accentColor}
            textColor={textColor}
          />
        ) : (
          <RestoreChip
            label="Phone"
            onClick={onRestorePhone}
          />
        )}
      </div>

      {/* WEBSITE */}

      <div className="min-w-0 flex-1">
        {websiteVisible ? (
          <ContactItem
            id="contact-website"
            icon={
              <Globe style={iconStyle} />

            }
            value={website}
            editable={editable}
            onChange={onUpdateWebsite}
            onFocusEl={onFocusEl}
            onBlurEl={onBlurEl}
            accentColor={accentColor}
            textColor={textColor}
          />
        ) : (
          <RestoreChip
            label="Website"
            onClick={onRestoreWebsite}
          />
        )}
      </div>

      {/* EMAIL */}

      <div className="min-w-0 flex-1">
        {emailVisible ? (
          <ContactItem
            id="contact-email"
            icon={
              <Mail style={iconStyle} />
            }
            value={email}
            editable={editable}
            onChange={onUpdateEmail}
            onFocusEl={onFocusEl}
            onBlurEl={onBlurEl}
            accentColor={accentColor}
            textColor={textColor}
          />
        ) : (
          <RestoreChip
            label="Email"
            onClick={onRestoreEmail}
          />
        )}
      </div>
    </section>
  );
}