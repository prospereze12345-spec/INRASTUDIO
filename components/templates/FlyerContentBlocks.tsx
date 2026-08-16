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

type FeatureListProps = SharedBlockProps & {
  features?: string[];
  visible?: boolean;
  title?: string;
  onUpdateTitle?: (value: string) => void;
  onUpdateFeature?: (index: number, value: string) => void;
  onAddFeature?: () => void;
  onRemoveFeature?: (index: number) => void;
  onRestoreSection?: () => void;
};

type WhyChooseUsListProps = SharedBlockProps & {
  items?: string[];
  visible?: boolean;
  title?: string;
  onUpdateTitle?: (value: string) => void;
  onUpdate?: (index: number, value: string) => void;
  onAdd?: () => void;
  onRemove?: (index: number) => void;
  onRestoreSection?: () => void;
};

// ---------------------------------------------------------------------------
// Small remove button (shared)
// ---------------------------------------------------------------------------

function RemoveButton({
  onClick,
  label = "Remove",
}: {
  onClick?: () => void;
  label?: string;
}) {
  if (!onClick) return null;

  return (
    <button
      type="button"
      data-flyer-control="true"
      aria-label={label}
      title={label}
      onClick={onClick}
      className="ml-1 inline-flex h-5 w-5 shrink-0 items-center justify-center
                 rounded-full bg-red-500/10 text-red-400 opacity-0 transition
                 hover:bg-red-500/20 hover:text-red-300
                 group-hover:opacity-100 focus:opacity-100"
    >
      <X size={12} />
    </button>
  );
}

// ---------------------------------------------------------------------------
// Restore placeholder
// ---------------------------------------------------------------------------

function RestoreSectionButton({
  label,
  onClick,
}: {
  label: string;
  onClick?: () => void;
}) {
  if (!onClick) return null;

  return (
    <button
      type="button"
      data-flyer-control="true"
      onClick={onClick}
      className="flex w-full items-center justify-center gap-1.5 rounded-lg
                 border border-dashed border-white/25 text-white/50 transition hover:border-white/50 hover:text-white/80"
      style={{
        paddingTop: "calc(1.2 * var(--cb))",
        paddingBottom: "calc(1.2 * var(--cb))",
        fontSize: "calc(1.8 * var(--ci))",
      }}
    >
      <Plus style={{ width: "calc(1.6 * var(--ci))", height: "calc(1.6 * var(--ci))" }} />
      {label}
    </button>
  );
}

// ---------------------------------------------------------------------------
// Feature list
// ---------------------------------------------------------------------------

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
  const cleanFeatures = features.filter(
    (f) => typeof f === "string" && f.trim().length > 0
  );

  if (!visible) {
    if (!editable) return null;
    return (
      <RestoreSectionButton
        label="Add features section"
        onClick={onRestoreSection}
      />
    );
  }

  if (!cleanFeatures.length && !editable) return null;

  return (
    <section
      data-flyer-block="features"
      className="flex flex-col mt-[calc(3*var(--cb))] max-w-[85%]"
      style={{ gap: "calc(1.5 * var(--cb))" }}
    >
      <EditableText
        as="h3"
        fieldId="f-features-title"
        editable={editable}
        value={title}
        onChange={(v) => onUpdateTitle?.(v)}
        onFocusEl={onFocusEl}
        onBlurEl={onBlurEl}
        className="font-black tracking-widest"
        style={{ color: colors.accent, fontSize: "calc(2.5 * var(--ci))" }}
      />

      {cleanFeatures.map((feature, index) => (
        <div
          key={`feature-${index}`}
          className="group flex items-center"
          style={{ gap: "calc(1 * var(--ci))" }}
        >
          <span
            className="flex shrink-0 items-center justify-center rounded-full"
            style={{
              width: "calc(2.6 * var(--ci))",
              height: "calc(2.6 * var(--ci))",
              backgroundColor: `${colors.accent}22`,
            }}
          >
            <CheckCircle2
              style={{
                color: colors.accent,
                width: "calc(1.6 * var(--ci))",
                height: "calc(1.6 * var(--ci))",
              }}
            />
          </span>

          <EditableText
            as="span"
            fieldId={`f-feature-${index}`}
            editable={editable}
            value={feature}
            onChange={(v) => onUpdateFeature?.(index, v)}
            onFocusEl={onFocusEl}
            onBlurEl={onBlurEl}
            className="min-w-0 flex-1"
            style={{ fontSize: "calc(2 * var(--ci))" }}
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
          className="inline-flex w-fit items-center gap-1 rounded-md px-1 py-0.5
                     transition hover:bg-black/5"
          style={{ color: colors.accent, fontSize: "calc(1.8 * var(--ci))" }}
        >
          <Plus style={{ width: "calc(1.8 * var(--ci))", height: "calc(1.8 * var(--ci))" }} />
          Add feature
        </button>
      )}
    </section>
  );
}

// ---------------------------------------------------------------------------
// Why Choose Us
// ---------------------------------------------------------------------------

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
  const cleanItems = items.filter(
    (i) => typeof i === "string" && i.trim().length > 0
  );

  if (!visible) {
    if (!editable) return null;
    return (
      <RestoreSectionButton
        label="Add why-choose-us section"
        onClick={onRestoreSection}
      />
    );
  }

  if (!cleanItems.length && !editable) return null;

  return (
    <section
      data-flyer-block="why-choose-us"
      className="flex flex-col mt-[calc(3.5*var(--cb))] max-w-[85%]"
      style={{ gap: "calc(1.5 * var(--cb))" }}
    >
      <EditableText
        as="h3"
        fieldId="f-why-title"
        editable={editable}
        value={title}
        onChange={(v) => onUpdateTitle?.(v)}
        onFocusEl={onFocusEl}
        onBlurEl={onBlurEl}
        className="font-black tracking-widest"
        style={{ color: colors.accent, fontSize: "calc(2.5 * var(--ci))" }}
      />

      {cleanItems.map((item, index) => (
        <div
          key={`why-${index}`}
          className="group flex items-center"
          style={{ gap: "calc(1 * var(--ci))" }}
        >
          <span
            className="flex shrink-0 items-center justify-center rounded-full"
            style={{
              width: "calc(2.6 * var(--ci))",
              height: "calc(2.6 * var(--ci))",
              backgroundColor: `${colors.accent}22`,
            }}
          >
            <CheckCircle2
              style={{
                color: colors.accent,
                width: "calc(1.6 * var(--ci))",
                height: "calc(1.6 * var(--ci))",
              }}
            />
          </span>

          <EditableText
            as="span"
            fieldId={`f-why-${index}`}
            editable={editable}
            value={item}
            onChange={(v) => onUpdate?.(index, v)}
            onFocusEl={onFocusEl}
            onBlurEl={onBlurEl}
            className="min-w-0 flex-1"
            style={{ fontSize: "calc(2 * var(--ci))" }}
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
          className="inline-flex w-fit items-center gap-1 rounded-md px-1 py-0.5
                     transition hover:bg-black/5"
          style={{ color: colors.accent, fontSize: "calc(1.8 * var(--ci))" }}
        >
          <Plus style={{ width: "calc(1.8 * var(--ci))", height: "calc(1.8 * var(--ci))" }} />
          Add reason
        </button>
      )}
    </section>
  );
}

// ---------------------------------------------------------------------------
// Contact item
// ---------------------------------------------------------------------------

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
  onRemove?: () => void;
};

function ContactItem({
  icon, value, editable = false, onChange, onFocusEl, onBlurEl,
  id, accentColor, textColor, onRemove,
}: ContactItemProps) {
  if (!editable && !value.trim()) return null;

  return (
    <div className="group flex min-w-0 items-center gap-1.5">
      <span
        className="flex shrink-0 items-center justify-center rounded-full"
        style={{ width: 20, height: 20, backgroundColor: accentColor }}
      >
        {icon}
      </span>

      {editable ? (
        <EditableText
          as="span"
          fieldId={id}
          editable
          value={value}
          onChange={(v) => onChange?.(v)}
          onFocusEl={onFocusEl}
          onBlurEl={onBlurEl}
          className="min-w-[30px] max-w-[28cqi] truncate text-[10px]"
          style={{ color: textColor }}
        />
      ) : (
        <span className="max-w-[28cqi] truncate text-[10px]" style={{ color: textColor }}>
          {value}
        </span>
      )}

      {editable && onRemove && value.trim() && (
        <RemoveButton label="Remove contact field" onClick={onRemove} />
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Contact bar
// ---------------------------------------------------------------------------

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

function RestoreChip({ label, onClick }: { label: string; onClick?: () => void }) {
  if (!onClick) return null;
  return (
    <button
      type="button"
      data-flyer-control="true"
      onClick={onClick}
      className="inline-flex items-center gap-1 rounded-full border border-dashed
                 border-white/30 px-2 py-1 text-[10px] text-white/50 hover:text-white/80"
    >
      <Plus size={10} /> {label}
    </button>
  );
}

export function ContactBar({
  phone = "", website = "", email = "",
  accentColor, textColor, editable = false,
  phoneVisible = true, websiteVisible = true, emailVisible = true,
  onUpdatePhone, onUpdateWebsite, onUpdateEmail,
  onRemovePhone, onRemoveWebsite, onRemoveEmail,
  onRestorePhone, onRestoreWebsite, onRestoreEmail,
  onFocusEl, onBlurEl,
}: ContactBarProps) {
  const visibleItems = [
    phoneVisible && phone.trim(),
    websiteVisible && website.trim(),
    emailVisible && email.trim(),
  ].filter(Boolean);

  if (!editable && visibleItems.length === 0) return null;

  const iconStyle = { color: "#ffffff" };

  return (
    <section data-flyer-block="contact" className="flex flex-wrap items-center gap-x-4 gap-y-1.5">
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
    </section>
  );
}

// ---------------------------------------------------------------------------
// Flyer content parser (unchanged logic)
// ---------------------------------------------------------------------------

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

function normalizeLine(value: string): string {
  return value.replace(/^[-•●✓✔▪◦]\s*/, "").replace(/\s+/g, " ").trim();
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
  const phone = /(?:\+?\d[\d\s().-]{7,}\d)/i;
  const email = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i;
  const website = /(?:https?:\/\/|www\.)[^\s]+/i;
  return phone.test(value) || email.test(value) || website.test(value);
}

export function parseFlyerContent(badgeText?: string, extraText?: string): ParsedFlyerContent {
  const badge = (badgeText ?? "").trim();
  const extra = (extraText ?? "").trim();
  const source = `${badge}\n${extra}`;

  const rawLines = source.split(/\r?\n/).map(normalizeLine).filter(Boolean);
  const features: string[] = [];

  for (const line of rawLines) {
    if (isHeading(line) || isContactLine(line)) continue;
    if (!features.some((f) => f.toLowerCase() === line.toLowerCase())) {
      features.push(line);
    }
  }

  const cleanFeatures = features.slice(0, 6);
  const phoneMatch = source.match(/(?:\+?\d[\d\s().-]{7,}\d)/i);
  const emailMatch = source.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i);
  const websiteMatch = source.match(/(?:https?:\/\/|www\.)[^\s]+/i);

  const updateFeature = (index: number, value: string): string => {
    const updated = [...cleanFeatures];
    if (index >= 0 && index < updated.length) updated[index] = value.trim();
    return updated.filter(Boolean).join("\n");
  };

  const addFeature = (): string => [...cleanFeatures, "New feature"].join("\n");

  const removeFeature = (index: number): string =>
    cleanFeatures.filter((_, i) => i !== index).join("\n");

  return {
    features: cleanFeatures,
    kicker: undefined,
    phone: phoneMatch?.[0]?.trim(),
    email: emailMatch?.[0]?.trim(),
    website: websiteMatch?.[0]?.trim(),
    updateFeature,
    addFeature,
    removeFeature,
  };
}