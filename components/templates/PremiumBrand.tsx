"use client";

import React, { useMemo } from "react";
import Image from "next/image";
import { ShoppingBag, ArrowUpRight, Check, Plus } from "lucide-react";

import { EditableText } from "@/components/EditableText";
import { EditableHeadlineLines } from "@/components/Editableheadlinelines";
import { touchTarget } from "@/lib/responsive";

// ============================================================================
// RESPONSIVE CANVAS SCALE
// ============================================================================

const cq = (n: number) => `clamp(${n * 1.5}px, ${n}cqi, ${n * 12}px)`;

// ============================================================================
// TYPES
// ============================================================================

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

    // Why Choose Us
    whyChooseUs?: string[];
    onUpdateWhyChooseUs?: (index: number, value: string) => void;
    onAddWhyChooseUs?: () => void;
    onRemoveWhyChooseUs?: (index: number) => void;

    // Section visibility
    featuresVisible?: boolean;
    whyChooseUsVisible?: boolean;

    // Restore
    onRestoreFeatures?: () => void;
    onRestoreWhyChooseUs?: () => void;

    // Features
    features?: string[];
    onUpdateFeature?: (index: number, value: string) => void;
    onAddFeature?: () => void;
    onRemoveFeature?: (index: number) => void;
}

// ============================================================================
// HELPERS
// ============================================================================

function hexToRgba(hex: string, alpha: number) {
    if (!hex) return `rgba(0,0,0,${alpha})`;
    const value = hex.replace("#", "");
    if (value.length !== 6) return hex;
    const r = parseInt(value.slice(0, 2), 16);
    const g = parseInt(value.slice(2, 4), 16);
    const b = parseInt(value.slice(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function parseFlyerContent(badgeText?: string, extraText?: string) {
    const features: string[] = [];

    if (badgeText) {
        const lines = badgeText.split("\n").filter(Boolean);
        for (const line of lines) {
            const trimmed = line.trim();
            if (trimmed.startsWith("+")) {
                features.push(trimmed.slice(1).trim() || "New feature");
            } else if (trimmed && !trimmed.startsWith("-")) {
                features.push(trimmed);
            }
        }
    }

    return {
        features,
        addFeature: () => {
            const updated = [...features, "New feature"];
            return updated.join("\n");
        },
        removeFeature: (index: number) => {
            const updated = features.filter((_, i) => i !== index);
            return updated.join("\n");
        },
        updateFeature: (index: number, value: string) => {
            const updated = [...features];
            updated[index] = value;
            return updated.join("\n");
        },
    };
}

// ============================================================================
// FEATURE LIST
// ============================================================================

function FeatureList({
    features,
    colors,
    editable,
    onUpdateFeature,
    onAddFeature,
    onRemoveFeature,
    onFocusEl,
    onBlurEl,
    visible,
    onRestoreSection,
}: {
    features?: string[];
    colors: PremiumBrandProps["colors"];
    editable?: boolean;
    onUpdateFeature?: (index: number, value: string) => void;
    onAddFeature?: () => void;
    onRemoveFeature?: (index: number) => void;
    onFocusEl?: (el: HTMLElement) => void;
    onBlurEl?: () => void;
    visible?: boolean;
    onRestoreSection?: () => void;
}) {
    const items = features || [];

    if (!visible && items.length === 0) {
        return (
            <div className="flex items-center gap-3 opacity-40">
                <span style={{ fontSize: cq(1.6) }} className="tracking-wide uppercase font-medium">
                    Features
                </span>
                {editable && onRestoreSection && (
                    <button
                        onClick={onRestoreSection}
                        className="text-xs underline-offset-2 hover:underline"
                        style={{ color: colors.accent }}
                    >
                        Restore
                    </button>
                )}
            </div>
        );
    }

    if (!visible) return null;

    return (
        <div>
            <div className="flex items-center gap-3 mb-3">
                <span
                    className="tracking-[0.15em] uppercase font-medium"
                    style={{
                        fontSize: cq(1.4),
                        opacity: 0.5,
                        letterSpacing: "0.15em",
                    }}
                >
                    Features
                </span>
                {editable && onAddFeature && (
                    <button
                        onClick={onAddFeature}
                        className="flex items-center gap-1 rounded-full transition-colors hover:opacity-70"
                        style={{
                            color: colors.accent,
                            fontSize: cq(1.2),
                            padding: `${cq(0.3)} ${cq(1)}`,
                            border: `1px solid ${hexToRgba(colors.accent, 0.25)}`,
                        }}
                    >
                        <Plus style={{ width: cq(1.2), height: cq(1.2) }} />
                        <span>Add</span>
                    </button>
                )}
            </div>

            <ul className="flex flex-wrap gap-x-6 gap-y-2" style={{ fontSize: cq(1.7) }}>
                {items.map((feature, index) => {
                    const isNew = feature.toLowerCase().startsWith("new");
                    return (
                        <li key={index} className="flex items-center gap-2.5">
                            <span
                                className="rounded-full flex-shrink-0"
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
                                onChange={(v) => onUpdateFeature?.(index, v)}
                                onFocusEl={onFocusEl}
                                onBlurEl={onBlurEl}
                                className="leading-tight"
                                style={{
                                    opacity: isNew ? 0.7 : 0.85,
                                }}
                            />
                            {editable && onRemoveFeature && (
                                <button
                                    onClick={() => onRemoveFeature(index)}
                                    className="ml-1 opacity-30 hover:opacity-70 transition-opacity"
                                    style={{ fontSize: cq(1.2) }}
                                >
                                    ×
                                </button>
                            )}
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}

// ============================================================================
// WHY CHOOSE US LIST
// ============================================================================

function WhyChooseUsList({
    items,
    colors,
    editable,
    onUpdate,
    onAdd,
    onRemove,
    onFocusEl,
    onBlurEl,
    visible,
    onRestoreSection,
}: {
    items?: string[];
    colors: PremiumBrandProps["colors"];
    editable?: boolean;
    onUpdate?: (index: number, value: string) => void;
    onAdd?: () => void;
    onRemove?: (index: number) => void;
    onFocusEl?: (el: HTMLElement) => void;
    onBlurEl?: () => void;
    visible?: boolean;
    onRestoreSection?: () => void;
}) {
    const list = items || [];

    if (!visible && list.length === 0) {
        return (
            <div className="flex items-center gap-3 opacity-40">
                <span style={{ fontSize: cq(1.6) }} className="tracking-wide uppercase font-medium">
                    Why Choose Us
                </span>
                {editable && onRestoreSection && (
                    <button
                        onClick={onRestoreSection}
                        className="text-xs underline-offset-2 hover:underline"
                        style={{ color: colors.accent }}
                    >
                        Restore
                    </button>
                )}
            </div>
        );
    }

    if (!visible) return null;

    return (
        <div>
            <div className="flex items-center gap-3 mb-3">
                <span
                    className="tracking-[0.15em] uppercase font-medium"
                    style={{
                        fontSize: cq(1.4),
                        opacity: 0.5,
                        letterSpacing: "0.15em",
                    }}
                >
                    Why Choose Us
                </span>
                {editable && onAdd && (
                    <button
                        onClick={onAdd}
                        className="flex items-center gap-1 rounded-full transition-colors hover:opacity-70"
                        style={{
                            color: colors.accent,
                            fontSize: cq(1.2),
                            padding: `${cq(0.3)} ${cq(1)}`,
                            border: `1px solid ${hexToRgba(colors.accent, 0.25)}`,
                        }}
                    >
                        <Plus style={{ width: cq(1.2), height: cq(1.2) }} />
                        <span>Add</span>
                    </button>
                )}
            </div>

            <ul className="space-y-1.5" style={{ fontSize: cq(1.7) }}>
                {list.map((reason, index) => (
                    <li key={index} className="flex items-start gap-2.5">
                        <Check
                            className="flex-shrink-0 mt-0.5"
                            style={{
                                width: cq(1.6),
                                height: cq(1.6),
                                color: colors.accent,
                                opacity: 0.7,
                            }}
                        />
                        <EditableText
                            as="span"
                            fieldId={`f-why-${index}`}
                            editable={editable}
                            value={reason}
                            onChange={(v) => onUpdate?.(index, v)}
                            onFocusEl={onFocusEl}
                            onBlurEl={onBlurEl}
                            className="leading-snug"
                            style={{ opacity: 0.85 }}
                        />
                        {editable && onRemove && (
                            <button
                                onClick={() => onRemove(index)}
                                className="ml-1 opacity-30 hover:opacity-70 transition-opacity"
                                style={{ fontSize: cq(1.2) }}
                            >
                                ×
                            </button>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
}

// ============================================================================
// SMART CTA
// ============================================================================

function SmartCTA({
    value,
    editable,
    onUpdate,
    onFocusEl,
    onBlurEl,
    colors,
}: {
    value: string;
    editable?: boolean;
    onUpdate?: (field: string, value: string) => void;
    onFocusEl?: (el: HTMLElement) => void;
    onBlurEl?: () => void;
    colors: PremiumBrandProps["colors"];
}) {
    return (
        <div
            className="inline-flex items-center justify-center rounded-2xl font-semibold uppercase transition-all hover:scale-[1.02] active:scale-[0.98]"
            style={{
                ...touchTarget,
                minHeight: cq(7),
                maxWidth: "92cqi",
                paddingLeft: cq(2),
                paddingRight: cq(3.5),
                paddingTop: cq(1.2),
                paddingBottom: cq(1.2),
                gap: cq(1.5),
                backgroundColor: colors.accent,
                color: colors.primary,
                fontSize: cq(1.8),
                lineHeight: 1.15,
                letterSpacing: "0.055em",
                boxShadow: `0 ${cq(0.8)} ${cq(2.5)} ${hexToRgba(colors.accent, 0.15)}`,
            }}
        >
            <span
                className="flex shrink-0 items-center justify-center rounded-xl"
                style={{
                    width: cq(4.1),
                    height: cq(4.1),
                    backgroundColor: colors.primary,
                    color: colors.accent,
                }}
            >
                <ShoppingBag style={{ width: cq(2), height: cq(2) }} />
            </span>

            <EditableText
                as="span"
                fieldId="f-cta"
                editable={editable}
                value={value}
                onChange={(v) => onUpdate?.("ctaText", v)}
                onFocusEl={onFocusEl}
                onBlurEl={onBlurEl}
                className="min-w-0"
                style={{ overflowWrap: "anywhere" }}
            />

            <ArrowUpRight
                className="shrink-0"
                style={{
                    width: cq(2.5),
                    height: cq(2.5),
                    opacity: 0.55,
                }}
            />
        </div>
    );
}

// ============================================================================
// MAIN TEMPLATE
// ============================================================================

export function PremiumBrandTemplate(props: PremiumBrandProps) {
    const { headline, productImage, colors } = props;

    if (!headline || !productImage || !colors) {
        return (
            <div className="w-full h-full flex items-center justify-center bg-neutral-100 text-neutral-400 text-sm">
                Loading template...
            </div>
        );
    }

    const name = props.name || "Digital Agency";

    switch (name) {
        case "Digital Agency":
            return <VariantDigitalAgency {...props} />;
        case "Premium Gold":
            return <VariantPremiumGold {...props} />;
        default:
            return <VariantDigitalAgency {...props} />;
    }
}

// ============================================================================
// DIGITAL AGENCY — REFINED
// ============================================================================

function VariantDigitalAgency({
    headline,
    subtext,
    ctaText,
    badgeText,
    extraText,
    productImage,
    price,
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
    onRestoreFeatures,
    onRestoreWhyChooseUs,
}: PremiumBrandProps) {
    const parsed = useMemo(
        () => parseFlyerContent(badgeText, extraText),
        [badgeText, extraText]
    );

    // Use features from parsed or fallback to defaults
    const featureItems = parsed.features.length > 0 ? parsed.features : ["Fast delivery", "High quality", "Best support"];

    const whyItems = whyChooseUs && whyChooseUs.length > 0 ? whyChooseUs : ["Fast delivery guaranteed", "High quality products", "Best customer service"];

    return (
        <div
            className="@container relative w-full h-full overflow-hidden font-sans"
            style={{
                backgroundColor: colors.primary,
                color: colors.secondary,
            }}
        >
            {/* ---- Subtle decorative grain overlay ---- */}
            <div
                className="absolute inset-0 pointer-events-none opacity-[0.03]"
                style={{
                    backgroundImage: `radial-gradient(circle at 20% 30%, ${colors.accent} 1px, transparent 1px)`,
                    backgroundSize: `${cq(3)} ${cq(3)}`,
                }}
            />

            {/* ---- Main content area ---- */}
            <div
                className="absolute inset-0"
                style={{
                    paddingLeft: cq(6),
                    paddingRight: cq(6),
                    paddingTop: cq(4.5),
                    paddingBottom: cq(4),
                }}
            >
                {/* ---- Product image ---- */}
                <section
                    className="absolute pointer-events-none"
                    style={{
                        right: "-3%",
                        top: cq(6),
                        width: "55%",
                        height: "68%",
                        zIndex: 1,
                    }}
                >
                    <Image
                        src={productImage}
                        alt=""
                        fill
                        priority
                        crossOrigin="anonymous"
                        draggable={false}
                        sizes="55vw"
                        className="object-contain object-right-center"
                    />
                </section>

                {/* ---- Content column ---- */}
                <main
                    className="relative z-20 flex flex-col"
                    style={{
                        width: "58%",
                        height: "100%",
                        paddingTop: cq(4),
                    }}
                >
                    {/* ---- Badge / top label ---- */}
                    <div
                        className="inline-flex items-center gap-2 mb-3"
                        style={{ fontSize: cq(1.4) }}
                    >
                        <span
                            className="tracking-[0.2em] uppercase font-medium"
                            style={{
                                opacity: 0.35,
                                letterSpacing: "0.2em",
                            }}
                        >
                            New Arrival
                        </span>
                        <span
                            className="w-8 h-px"
                            style={{ backgroundColor: hexToRgba(colors.accent, 0.3) }}
                        />
                    </div>

                    {/* ---- Headline ---- */}
                    <section>
                        <h1
                            className="font-semibold uppercase leading-[0.87]"
                            style={{
                                fontSize: "clamp(1.7rem, 8.2cqi, 88px)",
                                letterSpacing: "-0.055em",
                                maxWidth: "100%",
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
                                        style={index === 1 ? { color: colors.accent } : undefined}
                                    >
                                        {node}
                                    </span>
                                )}
                            />
                        </h1>
                    </section>

                    {/* ---- Subtext ---- */}
                    <EditableText
                        as="p"
                        fieldId="f-sub"
                        editable={editable}
                        value={subtext}
                        onChange={(v) => onUpdate?.("subtext", v)}
                        onFocusEl={onFocusEl}
                        onBlurEl={onBlurEl}
                        className="leading-[1.5]"
                        style={{
                            marginTop: cq(2.5),
                            maxWidth: "72%",
                            fontSize: cq(2.05),
                            opacity: 0.55,
                            fontWeight: 400,
                        }}
                    />

                    {/* ---- Features ---- */}
                    <div style={{ marginTop: cq(4.5) }}>
                        <FeatureList
                            features={featureItems.slice(0, 3)}
                            colors={colors}
                            editable={editable}
                            onUpdateFeature={(index, value) =>
                                onUpdate?.("badgeText", parsed.updateFeature(index, value))
                            }
                            onAddFeature={() => onUpdate?.("badgeText", parsed.addFeature())}
                            onRemoveFeature={(index) => onUpdate?.("badgeText", parsed.removeFeature(index))}
                            onFocusEl={onFocusEl}
                            onBlurEl={onBlurEl}
                            visible={featuresVisible}
                            onRestoreSection={onRestoreFeatures}
                        />
                    </div>

                    {/* ---- Why Choose Us ---- */}
                    <div style={{ marginTop: cq(3.5) }}>
                        <WhyChooseUsList
                            items={whyItems.slice(0, 3)}
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

                    {/* ---- CTA + Price ---- */}
                    <div
                        className="flex items-center"
                        style={{
                            marginTop: cq(4.5),
                            gap: cq(3),
                        }}
                    >
                        {price && (
                            <EditableText
                                as="p"
                                fieldId="f-price"
                                editable={editable}
                                value={price}
                                onChange={(v) => onUpdate?.("price", v)}
                                onFocusEl={onFocusEl}
                                onBlurEl={onBlurEl}
                                className="font-bold tracking-tight shrink-0"
                                style={{
                                    color: colors.accent,
                                    fontSize: cq(4.2),
                                    lineHeight: 0.9,
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
                </main>
            </div>

            {/* ---- Subtle bottom accent line ---- */}
            <div
                className="absolute bottom-0 left-0 right-0 pointer-events-none"
                style={{
                    height: cq(0.4),
                    background: `linear-gradient(90deg, ${colors.accent} 0%, ${hexToRgba(colors.accent, 0.1)} 100%)`,
                    opacity: 0.3,
                }}
            />
        </div>
    );
}

// ============================================================================
// PREMIUM GOLD — REFINED
// ============================================================================

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
    return (
        <div
            className="@container relative w-full h-full overflow-hidden font-serif flex flex-col"
            style={{
                backgroundColor: colors.primary,
                color: colors.secondary,
            }}
        >
            {/* ---- Decorative border ---- */}
            <div
                className="absolute pointer-events-none"
                style={{
                    inset: cq(4),
                    border: `1px solid ${hexToRgba(colors.accent, 0.15)}`,
                    borderRadius: cq(1.5),
                }}
            />

            {/* ---- Header ---- */}
            <header
                className="relative z-20 shrink-0 text-center"
                style={{ paddingTop: cq(5) }}
            >
                <EditableText
                    as="p"
                    fieldId="f-brand"
                    editable={editable}
                    value={brandName ?? ""}
                    onChange={(v) => onUpdate?.("brandName", v)}
                    onFocusEl={onFocusEl}
                    onBlurEl={onBlurEl}
                    className="uppercase tracking-[0.4em]"
                    style={{
                        fontSize: cq(2),
                        opacity: 0.4,
                        letterSpacing: "0.4em",
                    }}
                />
            </header>

            {/* ---- Main ---- */}
            <div
                className="relative flex-1 min-h-0"
                style={{
                    paddingLeft: cq(8),
                    paddingRight: cq(8),
                    paddingTop: cq(4),
                    paddingBottom: cq(4),
                }}
            >
                {/* ---- Headline ---- */}
                <div className="relative z-20 text-center">
                    <h1
                        className="font-medium uppercase leading-[0.9]"
                        style={{
                            fontSize: "clamp(1.4rem, 7.5cqi, 88px)",
                            letterSpacing: "-0.04em",
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
                                    style={index === 1 ? { color: colors.accent } : undefined}
                                >
                                    {node}
                                </span>
                            )}
                        />
                    </h1>
                </div>

                {/* ---- Product ---- */}
                <div
                    className="relative flex-1 min-h-0"
                    style={{
                        marginTop: cq(3),
                        marginBottom: cq(3),
                        minHeight: cq(30),
                    }}
                >
                    <Image
                        src={productImage}
                        alt=""
                        fill
                        priority
                        crossOrigin="anonymous"
                        draggable={false}
                        sizes="80vw"
                        className="object-contain"
                    />
                </div>

                {/* ---- Bottom CTA area ---- */}
                <div className="shrink-0">
                    <div
                        className="w-full h-px"
                        style={{
                            marginBottom: cq(3),
                            backgroundColor: hexToRgba(colors.accent, 0.15),
                        }}
                    />

                    <div className="flex items-end justify-between gap-4">
                        <div className="min-w-0" style={{ maxWidth: "55%" }}>
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
                                    style={{
                                        color: colors.accent,
                                        fontSize: cq(5),
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
                                className="leading-[1.5]"
                                style={{
                                    marginTop: cq(1),
                                    fontSize: cq(1.8),
                                    opacity: 0.45,
                                }}
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
                </div>
            </div>
        </div>
    );
}