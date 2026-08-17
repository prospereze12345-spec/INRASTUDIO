import React from "react";
import Image from "next/image";
import { Phone, Mail, CheckCircle2 } from "lucide-react";
import { EditableText } from "@/components/EditableText";
import { EditableHeadlineLines } from "@/components/Editableheadlinelines";

export interface LuxuryProductProps {
  name?: string;
  headline: string;
  subtext?: string;
  ctaText: string;
  productImage: string;
  logo?: string;
  brandName?: string;
  website?: string;
  phone?: string;
  email?: string;
  features?: string[];
  extraText?: string;
  instagram?: string;
  tiktok?: string;
  price?: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
  };
  editable?: boolean;
  onUpdate?: (field: string, value: string) => void;
  onFocusEl?: (el: HTMLElement) => void;
  onBlurEl?: () => void;
  onUpdateFeature?: (index: number, value: string) => void;
  onAddFeature?: () => void;
  onRemoveFeature?: (index: number) => void;
}

type C = LuxuryProductProps["colors"];

type CommonProps = Pick<
  LuxuryProductProps,
  | "editable"
  | "onUpdate"
  | "onFocusEl"
  | "onBlurEl"
  | "onUpdateFeature"
  | "onAddFeature"
  | "onRemoveFeature"
>;

const ci = (n: number) => `calc(${n} * var(--ci))`;

function Edit({
  as = "p",
  field,
  value,
  className = "",
  style,
  ...rest
}: {
  as?: React.ElementType;
  field: string;
  value?: string;
  className?: string;
  style?: React.CSSProperties;
} & CommonProps) {
  const {
    editable,
    onUpdate,
    onFocusEl,
    onBlurEl,
  } = rest;

  return (
    <EditableText
      as={as}
      fieldId={field}
      editable={editable}
      value={value ?? ""}
      onChange={(v) => onUpdate?.(field, v)}
      onFocusEl={onFocusEl}
      onBlurEl={onBlurEl}
      className={className}
      style={style}
    />
  );
}

function ProductImage({
  src,
  alt = "Product",
  className = "",
  style,
}: {
  src: string;
  alt?: string;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes="(max-width: 700px) 55vw, 50vw"
      className={`object-contain ${className}`}
      style={style}
      crossOrigin="anonymous"
      priority
    />
  );
}

function FeatureList({
  features,
  colors,
  ...props
}: {
  features?: string[];
  colors: C;
} & CommonProps) {
  if (!features?.length) return null;

  return (
    <div
      className="flex flex-wrap"
      style={{
        gap: ci(2),
        marginTop: ci(2),
      }}
    >
      {features.map((feature, index) => (
        <div
          key={`${feature}-${index}`}
          className="flex items-center min-w-0"
          style={{ gap: ci(0.7) }}
        >
          <CheckCircle2
            aria-hidden
            style={{
              width: ci(1.7),
              height: ci(1.7),
              flexShrink: 0,
              color: colors.accent,
            }}
          />
          <Edit
            {...props}
            field={`feature-${index}`}
            value={feature}
            className="text-[calc(1.65*var(--ci))] opacity-70 leading-tight"
          />
        </div>
      ))}
    </div>
  );
}

function ContactRow({
  phone,
  email,
  website,
  colors,
  align = "left",
  ...props
}: {
  phone?: string;
  email?: string;
  website?: string;
  colors: C;
  align?: "left" | "right";
} & CommonProps) {
  if (!props.editable && !phone && !email && !website) return null;

  return (
    <div
      className={`flex flex-wrap items-center ${align === "right" ? "justify-end" : ""}`}
      style={{ gap: ci(1.5) }}
    >
      {(props.editable || phone) && (
        <div className="flex items-center min-w-0" style={{ gap: ci(0.55) }}>
          <Phone
            aria-hidden
            style={{
              width: ci(1.5),
              height: ci(1.5),
              color: colors.accent,
              flexShrink: 0,
            }}
          />
          <Edit
            {...props}
            field="phone"
            value={phone}
            className="text-[calc(1.45*var(--ci))] opacity-55 tracking-wide truncate"
          />
        </div>
      )}

      {(props.editable || email) && (
        <div className="flex items-center min-w-0" style={{ gap: ci(0.55) }}>
          <Mail
            aria-hidden
            style={{
              width: ci(1.5),
              height: ci(1.5),
              color: colors.accent,
              flexShrink: 0,
            }}
          />
          <Edit
            {...props}
            field="email"
            value={email}
            className="text-[calc(1.45*var(--ci))] opacity-55 tracking-wide truncate"
          />
        </div>
      )}

      {(props.editable || website) && (
        <Edit
          {...props}
          field="website"
          value={website}
          className="text-[calc(1.45*var(--ci))] opacity-35 tracking-wide truncate"
        />
      )}
    </div>
  );
}

function CTA({
  text,
  colors,
  variant = "solid",
  ...props
}: {
  text: string;
  colors: C;
  variant?: "solid" | "outline" | "pill";
} & CommonProps) {
  const base =
    "text-[calc(2.05*var(--ci))] font-black uppercase tracking-widest whitespace-nowrap";

  const style: React.CSSProperties =
    variant === "outline"
      ? {
          border: `${ci(0.3)} solid ${colors.accent}`,
          color: colors.accent,
          padding: `${ci(1.7)} ${ci(3)}`,
        }
      : {
          backgroundColor: colors.accent,
          color: colors.primary,
          padding: `${ci(1.7)} ${ci(3)}`,
          borderRadius: variant === "pill" ? "999px" : undefined,
        };

  return (
    <Edit
      {...props}
      as="div"
      field="ctaText"
      value={text}
      className={base}
      style={style}
    />
  );
}

function Price({
  value,
  colors,
  size = 6,
  ...props
}: {
  value?: string;
  colors: C;
  size?: number;
} & CommonProps) {
  if (!value && !props.editable) return null;

  return (
    <Edit
      {...props}
      field="price"
      value={value}
      className="font-black leading-none"
      style={{
        fontSize: ci(size),
        color: colors.accent,
      }}
    />
  );
}

function Brand({
  value,
  ...props
}: {
  value?: string;
} & CommonProps) {
  return (
    <Edit
      {...props}
      field="brandName"
      value={value}
      className="text-[calc(1.9*var(--ci))] font-bold uppercase tracking-[0.35em] opacity-45 truncate"
    />
  );
}

function Headline({
  value,
  colors,
  size = 9,
  accentEveryOther = false,
  accentSecond = true,
  ...props
}: {
  value: string;
  colors: C;
  size?: number;
  accentEveryOther?: boolean;
  accentSecond?: boolean;
} & CommonProps) {
  return (
    <h1
      className="font-black uppercase leading-[0.84] tracking-tighter"
      style={{
        fontSize: ci(size),
        maxWidth: "100%",
        overflowWrap: "anywhere",
      }}
    >
      <EditableHeadlineLines
        value={value}
        editable={props.editable}
        onFocusEl={props.onFocusEl}
        onBlurEl={props.onBlurEl}
        onChange={(v) => props.onUpdate?.("headline", v)}
        renderLine={(_line, index, node) => {
          const accent = accentEveryOther
            ? index % 2 === 1
            : accentSecond && index === 1;

          return (
            <span
              className="block"
              style={accent ? { color: colors.accent } : undefined}
            >
              {node}
            </span>
          );
        }}
      />
    </h1>
  );
}

/*
 * The original file repeated the same flex, image, CTA, price and editable
 * text patterns in almost every variant. This version keeps the 12 named
 * variants but moves the repeated behavior into small primitives above.
 *
 * Important layout rule:
 *   - desktop/tablet: copy stays left, product stays right
 *   - narrow containers: the same two-column relationship is preserved,
 *     but widths become 56% / 44% so the product never drops underneath
 *   - all text uses var(--ci), so the flyer scales with its parent
 */

function SplitProduct({
  children,
  productImage,
  colors,
  imageWidth = "44%",
  imagePadding = 3,
  imagePosition = "center",
}: {
  children: React.ReactNode;
  productImage: string;
  colors: C;
  imageWidth?: string;
  imagePadding?: number;
  imagePosition?: string;
}) {
  return (
    <div
      className="flex-1 min-h-0 grid"
      style={{
        gridTemplateColumns: `minmax(0, 1fr) ${imageWidth}`,
      }}
    >
      <div className="min-w-0 min-h-0 overflow-hidden">{children}</div>

      <div
        className="relative min-w-0 min-h-0 overflow-hidden"
        style={{
          backgroundColor: `${colors.accent}08`,
        }}
      >
        <ProductImage
          src={productImage}
          style={{
            padding: ci(imagePadding),
            objectPosition: imagePosition,
          }}
        />
      </div>
    </div>
  );
}

function Base({
  children,
  colors,
  className = "",
}: {
  children: React.ReactNode;
  colors: C;
  className?: string;
}) {
  return (
    <div
      className={`@container relative isolate w-full h-full min-h-0 overflow-hidden flex flex-col font-sans ${className}`}
      style={{
        backgroundColor: colors.primary,
        color: colors.secondary,
      }}
    >
      {children}
    </div>
  );
}

/* ------------------------------------------------------------------
   1. BLACK GOLD
------------------------------------------------------------------- */
function VariantBlackGold(p: LuxuryProductProps) {
  const { colors } = p;

  return (
    <Base colors={colors}>
      <header
        className="shrink-0 flex items-center justify-between min-w-0"
        style={{
          padding: `${ci(3)} ${ci(5)}`,
          borderBottom: `1px solid ${colors.accent}30`,
          gap: ci(2),
        }}
      >
        <Brand {...p} value={p.brandName} />
        <Edit
          {...p}
          field="instagram"
          value={p.instagram}
          className="text-[calc(1.7*var(--ci))] opacity-40 tracking-widest truncate text-right"
        />
      </header>

      <SplitProduct
        productImage={p.productImage}
        colors={colors}
        imageWidth="46%"
        imagePadding={2}
        imagePosition="center"
      >
        <div
          className="h-full flex flex-col min-h-0"
          style={{ padding: `${ci(4)} ${ci(5)}` }}
        >
          <Headline {...p} value={p.headline} colors={colors} size={8.5} />

          <div className="flex-1 min-h-0 relative mt-[calc(2*var(--ci))]" />

          <div className="shrink-0 flex items-end justify-between gap-[calc(2*var(--ci))]">
            <div className="min-w-0">
              <Price {...p} value={p.price} colors={colors} size={5.5} />
              <Edit
                {...p}
                field="subtext"
                value={p.subtext}
                className="text-[calc(1.8*var(--ci))] opacity-50 mt-[calc(0.6*var(--ci))] leading-tight"
              />
            </div>
            <div className="shrink-0">
              <CTA {...p} text={p.ctaText} colors={colors} />
              <Edit
                {...p}
                field="website"
                value={p.website}
                className="text-[calc(1.35*var(--ci))] opacity-30 text-right mt-[calc(0.7*var(--ci))] tracking-widest truncate max-w-[calc(22*var(--ci))]"
              />
            </div>
          </div>
        </div>
      </SplitProduct>
    </Base>
  );
}

/* ------------------------------------------------------------------
   2. WHITE GOLD
------------------------------------------------------------------- */
function VariantWhiteGold(p: LuxuryProductProps) {
  const { colors } = p;
  const lines = p.headline.split("\n");
  const eyebrow = lines[0] ?? "";
  const main = lines.slice(1).join(" ") || lines[0] || "";

  return (
    <Base colors={colors}>
      <div
        className="absolute left-[calc(8*var(--ci))] top-0 bottom-0 w-[calc(0.25*var(--ci))] z-10"
        style={{ backgroundColor: colors.accent, opacity: 0.45 }}
      />

      <div
        className="absolute left-[calc(2*var(--ci))] top-1/2 -translate-y-1/2 -rotate-90 z-20"
        style={{ width: ci(14) }}
      >
        <Brand {...p} value={p.brandName} />
      </div>

      <SplitProduct
        productImage={p.productImage}
        colors={colors}
        imageWidth="45%"
        imagePadding={2}
      >
        <div
          className="h-full flex flex-col min-h-0"
          style={{ padding: `${ci(5)} ${ci(4)} ${ci(4)} ${ci(13)}` }}
        >
          <div className="shrink-0">
            <Edit
              {...p}
              field="headline-eyebrow"
              value={eyebrow}
              className="text-[calc(1.8*var(--ci))] tracking-[0.35em] uppercase opacity-40 mb-[calc(1.5*var(--ci))]"
              onUpdate={(field, value) =>
                p.onUpdate?.(
                  "headline",
                  [value, ...lines.slice(1)].join("\n")
                )
              }
            />
            <Edit
              {...p}
              as="h1"
              field="headline-main"
              value={main}
              className="font-black leading-[0.85] tracking-tight"
              style={{ fontSize: ci(9) }}
              onUpdate={(_field, value) =>
                p.onUpdate?.("headline", [lines[0] ?? "", value].join("\n"))
              }
            />
            <div
              className="mt-[calc(2*var(--ci))] w-[calc(7*var(--ci))] h-[calc(0.25*var(--ci))]"
              style={{ backgroundColor: colors.accent }}
            />
          </div>

          <div className="flex-1 min-h-0" />

          <div className="shrink-0 flex items-end justify-between gap-[calc(2*var(--ci))]">
            <div className="min-w-0">
              <Edit
                {...p}
                field="subtext"
                value={p.subtext}
                className="text-[calc(1.9*var(--ci))] opacity-50 leading-tight mb-[calc(0.8*var(--ci))] max-w-[calc(34*var(--ci))]"
              />
              <Edit
                {...p}
                field="website"
                value={p.website}
                className="text-[calc(1.45*var(--ci))] opacity-30 tracking-widest uppercase truncate"
              />
            </div>

            <div className="text-right shrink-0">
              <Price {...p} value={p.price} colors={colors} size={5.5} />
              <CTA {...p} text={p.ctaText} colors={colors} />
            </div>
          </div>
        </div>
      </SplitProduct>
    </Base>
  );
}

/* ------------------------------------------------------------------
   3. NAVY CYAN
------------------------------------------------------------------- */
function VariantNavyCyan(p: LuxuryProductProps) {
  const { colors } = p;

  return (
    <Base colors={colors}>
      <div
        className="absolute top-0 right-0 w-[60%] h-[60%] pointer-events-none"
        style={{
          backgroundColor: colors.accent,
          clipPath: "circle(50% at 100% 0%)",
          opacity: 0.08,
        }}
      />

      <div
        className="shrink-0 flex items-center justify-between relative z-10"
        style={{ padding: `${ci(3)} ${ci(5)}`, gap: ci(2) }}
      >
        <Edit
          {...p}
          field="website"
          value={p.website}
          className="text-[calc(1.65*var(--ci))] tracking-[0.3em] uppercase opacity-45 truncate"
        />
        <div
          className="shrink-0 w-[calc(5*var(--ci))] h-[calc(0.25*var(--ci))]"
          style={{ backgroundColor: colors.accent }}
        />
      </div>

      <SplitProduct
        productImage={p.productImage}
        colors={colors}
        imageWidth="47%"
        imagePadding={1}
      >
        <div
          className="h-full flex flex-col min-h-0 relative z-10"
          style={{ padding: `0 ${ci(5)} ${ci(3)}` }}
        >
          <Headline
            {...p}
            value={p.headline}
            colors={colors}
            size={8.2}
          />

          <div className="flex-1 min-h-0" />

          <div
            className="shrink-0 flex items-center justify-between gap-[calc(2*var(--ci))] -mx-[calc(5*var(--ci))]"
            style={{
              backgroundColor: colors.accent,
              padding: `${ci(2.7)} ${ci(5)}`,
            }}
          >
            <div className="min-w-0">
              <Price
                {...p}
                value={p.price}
                colors={{ ...colors, accent: colors.primary }}
                size={5}
              />
              <Edit
                {...p}
                field="subtext"
                value={p.subtext}
                className="text-[calc(1.75*var(--ci))] opacity-65 leading-tight mt-[calc(0.4*var(--ci))]"
                style={{ color: colors.primary }}
              />
            </div>

            <CTA
              {...p}
              text={p.ctaText}
              colors={{
                ...colors,
                accent: colors.primary,
                primary: colors.accent,
              }}
            />
          </div>
        </div>
      </SplitProduct>
    </Base>
  );
}

/* ------------------------------------------------------------------
   4. DARK MARBLE
------------------------------------------------------------------- */
function VariantDarkMarble(p: LuxuryProductProps) {
  const { colors } = p;

  return (
    <Base colors={colors}>
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.035]"
        style={{
          backgroundImage:
            'url("https://www.transparenttextures.com/patterns/noise.png")',
        }}
      />

      <header
        className="shrink-0 flex items-center justify-between relative z-10"
        style={{ padding: `${ci(4)} ${ci(5)} ${ci(2)}`, gap: ci(2) }}
      >
        <Brand {...p} value={p.brandName} />
        <div
          className="shrink-0 rounded-full border"
          style={{
            width: ci(3.5),
            height: ci(3.5),
            borderWidth: ci(0.25),
            borderColor: colors.accent,
            opacity: 0.55,
          }}
        />
      </header>

      <SplitProduct
        productImage={p.productImage}
        colors={colors}
        imageWidth="48%"
        imagePadding={1}
      >
        <div
          className="h-full flex flex-col min-h-0 relative z-10"
          style={{ padding: `${ci(2)} ${ci(5)} ${ci(4)}` }}
        >
          <Headline
            {...p}
            value={p.headline}
            colors={colors}
            size={8.5}
            accentEveryOther
          />

          <div
            className="shrink-0 mt-[calc(2*var(--ci))] h-[calc(0.2*var(--ci))]"
            style={{ backgroundColor: `${colors.secondary}20` }}
          />

          <div className="flex-1 min-h-0" />

          <div className="shrink-0 flex items-end justify-between gap-[calc(2*var(--ci))]">
            <div className="min-w-0">
              <Price {...p} value={p.price} colors={colors} size={6} />
              <Edit
                {...p}
                field="subtext"
                value={p.subtext}
                className="text-[calc(1.8*var(--ci))] opacity-45 mt-[calc(0.5*var(--ci))] leading-tight"
              />
              <Edit
                {...p}
                field="website"
                value={p.website}
                className="text-[calc(1.35*var(--ci))] opacity-25 mt-[calc(0.8*var(--ci))] tracking-widest uppercase truncate"
              />
            </div>
            <CTA {...p} text={p.ctaText} colors={colors} variant="outline" />
          </div>
        </div>
      </SplitProduct>
    </Base>
  );
}

/* ------------------------------------------------------------------
   5. ROYAL PURPLE
------------------------------------------------------------------- */
function VariantRoyalPurple(p: LuxuryProductProps) {
  const { colors } = p;

  return (
    <Base colors={colors}>
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse at 70% 55%, ${colors.accent}18 0%, transparent 65%)`,
        }}
      />

      <div
        className="shrink-0 relative z-10"
        style={{ padding: `${ci(4)} ${ci(5)} ${ci(2)}` }}
      >
        <div
          className="flex items-center mb-[calc(2*var(--ci))]"
          style={{ gap: ci(1.5) }}
        >
          <div
            className="w-[calc(4*var(--ci))] h-[calc(0.2*var(--ci))]"
            style={{ backgroundColor: colors.accent }}
          />
          <Edit
            {...p}
            field="website"
            value={p.website}
            className="text-[calc(1.6*var(--ci))] tracking-[0.35em] uppercase opacity-45 truncate"
          />
        </div>
        <Headline
          {...p}
          value={p.headline}
          colors={colors}
          size={8.5}
        />
      </div>

      <SplitProduct
        productImage={p.productImage}
        colors={colors}
        imageWidth="47%"
        imagePadding={0}
      >
        <div
          className="h-full flex flex-col min-h-0 relative z-10"
          style={{ padding: `0 ${ci(5)} ${ci(4)}` }}
        >
          <div className="flex-1 min-h-0" />

          <div
            className="shrink-0 h-[calc(0.2*var(--ci))] mb-[calc(2.5*var(--ci))]"
            style={{ backgroundColor: `${colors.accent}35` }}
          />

          <div className="flex items-end justify-between gap-[calc(2*var(--ci))]">
            <div className="min-w-0">
              <Price {...p} value={p.price} colors={colors} size={6.5} />
              <Edit
                {...p}
                field="subtext"
                value={p.subtext}
                className="text-[calc(1.8*var(--ci))] opacity-50 mt-[calc(0.5*var(--ci))] leading-tight"
              />
            </div>
            <CTA {...p} text={p.ctaText} colors={colors} variant="pill" />
          </div>
        </div>
      </SplitProduct>
    </Base>
  );
}

/* ------------------------------------------------------------------
   6. EMERALD GREEN
------------------------------------------------------------------- */
function VariantEmeraldGreen(p: LuxuryProductProps) {
  const { colors } = p;

  return (
    <Base colors={colors}>
      <div
        className="flex-1 min-h-0 grid"
        style={{ gridTemplateColumns: "54% 46%" }}
      >
        <div
          className="min-w-0 min-h-0 flex flex-col justify-between"
          style={{
            padding: ci(5),
            borderRight: `1px solid ${colors.secondary}15`,
          }}
        >
          <div className="min-w-0">
            <Brand {...p} value={p.brandName} />

            <div style={{ marginTop: ci(3) }}>
              <Headline
                {...p}
                value={p.headline}
                colors={colors}
                size={7.8}
              />
            </div>

            <div
              className="w-[calc(5*var(--ci))] h-[calc(0.25*var(--ci))]"
              style={{
                backgroundColor: colors.accent,
                marginTop: ci(2.5),
              }}
            />

            <Edit
              {...p}
              field="subtext"
              value={p.subtext}
              className="text-[calc(1.9*var(--ci))] leading-relaxed opacity-50 mt-[calc(2*var(--ci))]"
            />

            <FeatureList
              {...p}
              features={p.features}
              colors={colors}
            />
          </div>

          <div className="shrink-0">
            <Price {...p} value={p.price} colors={colors} size={6} />
            <div style={{ marginTop: ci(1.2) }}>
              <CTA {...p} text={p.ctaText} colors={colors} />
            </div>
            <Edit
              {...p}
              field="website"
              value={p.website}
              className="text-[calc(1.35*var(--ci))] opacity-25 tracking-widest uppercase mt-[calc(0.8*var(--ci))] truncate"
            />
          </div>
        </div>

        <div
          className="relative min-w-0 min-h-0"
          style={{ backgroundColor: `${colors.accent}08` }}
        >
          <ProductImage
            src={p.productImage}
            style={{ padding: ci(2), objectPosition: "center" }}
          />
        </div>
      </div>
    </Base>
  );
}

/* ------------------------------------------------------------------
   7. SOFT SAGE
------------------------------------------------------------------- */
function VariantSoftSage(p: LuxuryProductProps) {
  const { colors } = p;
  const lines = p.headline.split("\n");
  const eyebrow = lines[0] ?? "";
  const main = lines[1] ?? lines[0] ?? "";

  return (
    <Base colors={colors}>
      <header
        className="shrink-0 flex items-center justify-between"
        style={{
          padding: `${ci(3.5)} ${ci(5)} ${ci(1.5)}`,
          gap: ci(2),
        }}
      >
        <Brand {...p} value={p.brandName} />
        <div
          className="shrink-0 w-[calc(4*var(--ci))] h-[calc(0.2*var(--ci))]"
          style={{ backgroundColor: `${colors.secondary}30` }}
        />
        <Edit
          {...p}
          field="website"
          value={p.website}
          className="text-[calc(1.55*var(--ci))] tracking-[0.3em] uppercase opacity-30 truncate text-right"
        />
      </header>

      <SplitProduct
        productImage={p.productImage}
        colors={colors}
        imageWidth="46%"
        imagePadding={1}
      >
        <div
          className="h-full flex flex-col min-h-0"
          style={{ padding: `${ci(1)} ${ci(5)} ${ci(4)}` }}
        >
          <div className="shrink-0">
            <Edit
              {...p}
              field="headline-eyebrow"
              value={eyebrow}
              className="text-[calc(1.75*var(--ci))] tracking-[0.35em] uppercase opacity-40 mb-[calc(1.3*var(--ci))]"
              onUpdate={(_field, value) =>
                p.onUpdate?.(
                  "headline",
                  [value, lines[1] ?? ""].join("\n")
                )
              }
            />
            <Edit
              {...p}
              as="h1"
              field="headline-main"
              value={main}
              className="font-black leading-[0.85] tracking-tight uppercase"
              style={{ fontSize: ci(8.5) }}
              onUpdate={(_field, value) =>
                p.onUpdate?.(
                  "headline",
                  [lines[0] ?? "", value].join("\n")
                )
              }
            />
            <div
              className="w-[calc(5*var(--ci))] h-[calc(0.25*var(--ci))] mt-[calc(1.8*var(--ci))]"
              style={{ backgroundColor: colors.accent }}
            />
          </div>

          <div className="flex-1 min-h-0" />

          <div className="shrink-0 flex items-end justify-between gap-[calc(2*var(--ci))]">
            <Edit
              {...p}
              field="subtext"
              value={p.subtext}
              className="text-[calc(1.85*var(--ci))] opacity-50 leading-tight max-w-[calc(30*var(--ci))]"
            />

            <div className="text-right shrink-0">
              <Price {...p} value={p.price} colors={colors} size={5.5} />
              <div style={{ marginTop: ci(1) }}>
                <CTA {...p} text={p.ctaText} colors={colors} />
              </div>
            </div>
          </div>
        </div>
      </SplitProduct>
    </Base>
  );
}

/* ------------------------------------------------------------------
   8. ROSE BLUSH
------------------------------------------------------------------- */
function VariantRoseBlush(p: LuxuryProductProps) {
  const { colors } = p;

  return (
    <Base colors={colors}>
      <SplitProduct
        productImage={p.productImage}
        colors={colors}
        imageWidth="48%"
        imagePadding={1}
      >
        <div
          className="h-full flex flex-col min-h-0"
          style={{ padding: `${ci(5)} ${ci(5)} ${ci(4)}` }}
        >
          <Headline
            {...p}
            value={p.headline}
            colors={colors}
            size={8.2}
          />

          <div
            className="w-[calc(5*var(--ci))] h-[calc(0.25*var(--ci))] mt-[calc(2*var(--ci))]"
            style={{ backgroundColor: colors.accent }}
          />

          <div className="flex-1 min-h-0" />

          <div className="shrink-0 flex items-end justify-between gap-[calc(2*var(--ci))]">
            <div className="min-w-0">
              <Price {...p} value={p.price} colors={colors} size={6} />
              <Edit
                {...p}
                field="subtext"
                value={p.subtext}
                className="text-[calc(1.8*var(--ci))] opacity-50 mt-[calc(0.5*var(--ci))] leading-tight"
              />
              <Edit
                {...p}
                field="website"
                value={p.website}
                className="text-[calc(1.35*var(--ci))] opacity-25 tracking-widest uppercase mt-[calc(0.7*var(--ci))] truncate"
              />
            </div>

            <CTA {...p} text={p.ctaText} colors={colors} variant="pill" />
          </div>
        </div>
      </SplitProduct>
    </Base>
  );
}

/* ------------------------------------------------------------------
   9. CLASSIC MONOCHROME
------------------------------------------------------------------- */
function VariantClassicMono(p: LuxuryProductProps) {
  const { colors } = p;

  return (
    <Base colors={colors}>
      <header
        className="shrink-0"
        style={{ padding: `${ci(3)} ${ci(5)} ${ci(2)}` }}
      >
        <div
          className="h-[calc(0.25*var(--ci))] mb-[calc(1.5*var(--ci))]"
          style={{ backgroundColor: colors.secondary, opacity: 0.15 }}
        />
        <div
          className="flex items-center justify-between min-w-0"
          style={{ gap: ci(2) }}
        >
          <Brand {...p} value={p.brandName} />
          <Edit
            {...p}
            field="website"
            value={p.website}
            className="text-[calc(1.5*var(--ci))] tracking-[0.25em] uppercase opacity-25 truncate text-right"
          />
        </div>
        <div
          className="h-[calc(0.25*var(--ci))] mt-[calc(1.5*var(--ci))]"
          style={{ backgroundColor: colors.secondary, opacity: 0.15 }}
        />
      </header>

      <SplitProduct
        productImage={p.productImage}
        colors={colors}
        imageWidth="52%"
        imagePadding={1}
      >
        <div
          className="h-full flex flex-col justify-center min-h-0"
          style={{ padding: `${ci(4)} ${ci(5)}` }}
        >
          <Headline
            {...p}
            value={p.headline}
            colors={colors}
            size={7.7}
            accentEveryOther
          />

          <Edit
            {...p}
            field="subtext"
            value={p.subtext}
            className="text-[calc(1.8*var(--ci))] opacity-50 leading-relaxed mt-[calc(2.5*var(--ci))]"
          />

          <div style={{ marginTop: ci(2) }}>
            <Price {...p} value={p.price} colors={colors} size={5.5} />
          </div>

          <div style={{ marginTop: ci(1.3) }}>
            <CTA
              {...p}
              text={p.ctaText}
              colors={{
                ...colors,
                accent: colors.secondary,
              }}
            />
          </div>
        </div>
      </SplitProduct>

      <div
        className="shrink-0 mx-[calc(5*var(--ci))] mb-[calc(3*var(--ci))] h-[calc(0.25*var(--ci))]"
        style={{ backgroundColor: colors.secondary, opacity: 0.15 }}
      />
    </Base>
  );
}

/* ------------------------------------------------------------------
   10. CRIMSON VELVET
------------------------------------------------------------------- */
function VariantCrimsonVelvet(p: LuxuryProductProps) {
  const { colors } = p;

  return (
    <Base colors={colors}>
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.055]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)",
          backgroundSize: "18px 18px",
        }}
      />

      <header
        className="shrink-0 flex items-center relative z-10"
        style={{ padding: `${ci(3.5)} ${ci(5)} ${ci(2)}`, gap: ci(1.5) }}
      >
        <div
          className="rounded-full shrink-0"
          style={{
            width: ci(2.8),
            height: ci(2.8),
            backgroundColor: colors.accent,
          }}
        />
        <Brand {...p} value={p.brandName} />
      </header>

      <SplitProduct
        productImage={p.productImage}
        colors={colors}
        imageWidth="47%"
        imagePadding={0}
      >
        <div
          className="h-full flex flex-col min-h-0 relative z-10"
          style={{ padding: `${ci(1)} ${ci(5)} ${ci(4)}` }}
        >
          <Headline
            {...p}
            value={p.headline}
            colors={colors}
            size={8}
          />

          <div className="flex-1 min-h-0" />

          <div className="shrink-0 flex items-end justify-between gap-[calc(2*var(--ci))]">
            <div className="min-w-0">
              <Price {...p} value={p.price} colors={colors} size={6} />
              <Edit
                {...p}
                field="subtext"
                value={p.subtext}
                className="text-[calc(1.8*var(--ci))] opacity-50 mt-[calc(0.5*var(--ci))] leading-tight"
              />
              <Edit
                {...p}
                field="website"
                value={p.website}
                className="text-[calc(1.3*var(--ci))] opacity-25 mt-[calc(0.7*var(--ci))] tracking-widest uppercase truncate"
              />
            </div>
            <CTA {...p} text={p.ctaText} colors={colors} variant="pill" />
          </div>
        </div>
      </SplitProduct>
    </Base>
  );
}

/* ------------------------------------------------------------------
   11. NEW CATALOG
------------------------------------------------------------------- */
function VariantNewCatalog(p: LuxuryProductProps) {
  const { colors } = p;

  return (
    <Base colors={colors}>
      <header
        className="shrink-0 flex items-center justify-between min-w-0"
        style={{
          padding: `${ci(2.5)} ${ci(5)}`,
          borderBottom: `1px solid ${colors.secondary}12`,
          gap: ci(2),
        }}
      >
        <Brand {...p} value={p.brandName} />
        <Edit
          {...p}
          field="website"
          value={p.website}
          className="text-[calc(1.45*var(--ci))] opacity-30 tracking-widest uppercase truncate text-right"
        />
      </header>

      <div
        className="shrink-0"
        style={{ padding: `${ci(2.5)} ${ci(5)} ${ci(1.5)}` }}
      >
        <Headline
          {...p}
          value={p.headline}
          colors={colors}
          size={6.7}
        />
      </div>

      <SplitProduct
        productImage={p.productImage}
        colors={colors}
        imageWidth="55%"
        imagePadding={2}
      >
        <div
          className="h-full flex flex-col justify-center min-h-0"
          style={{ padding: `${ci(3)} ${ci(5)}` }}
        >
          <div
            className="rounded-[calc(2*var(--ci))] h-full min-h-0 relative overflow-hidden"
            style={{
              backgroundColor: `${colors.secondary}07`,
              border: `1px solid ${colors.secondary}10`,
            }}
          >
            <ProductImage
              src={p.productImage}
              style={{
                padding: ci(2),
                objectPosition: "center",
              }}
            />
          </div>
        </div>
      </SplitProduct>

      <footer
        className="shrink-0 flex items-center justify-between min-w-0"
        style={{
          padding: `${ci(2.3)} ${ci(5)}`,
          borderTop: `1px solid ${colors.secondary}12`,
          gap: ci(2),
        }}
      >
        <div className="min-w-0">
          <Price {...p} value={p.price} colors={colors} size={4.8} />
          <Edit
            {...p}
            field="subtext"
            value={p.subtext}
            className="text-[calc(1.65*var(--ci))] opacity-45 mt-[calc(0.3*var(--ci))] truncate"
          />
        </div>
        <CTA {...p} text={p.ctaText} colors={colors} />
      </footer>
    </Base>
  );
}

/* ------------------------------------------------------------------
   12. BORCELLE SKINCARE
------------------------------------------------------------------- */
function VariantBorcelleSkincare(p: LuxuryProductProps) {
  const { colors } = p;

  return (
    <Base colors={colors}>
      <div
        className="h-full min-h-0 grid"
        style={{
          gridTemplateColumns: "54% 46%",
          gridTemplateRows: "58% 42%",
        }}
      >
        <div
          className="relative min-w-0 min-h-0 overflow-hidden"
          style={{
            borderRight: `1px solid ${colors.secondary}12`,
            borderBottom: `1px solid ${colors.secondary}12`,
            backgroundColor: `${colors.accent}08`,
          }}
        >
          <ProductImage
            src={p.productImage}
            alt="Skincare"
            style={{ padding: ci(3), objectPosition: "center" }}
          />
        </div>

        <div
          className="min-w-0 min-h-0 flex flex-col justify-end"
          style={{
            padding: ci(4),
            borderBottom: `1px solid ${colors.secondary}12`,
          }}
        >
          <Brand {...p} value={p.brandName} />
          <div style={{ marginTop: ci(1.5) }}>
            <Headline
              {...p}
              value={p.headline}
              colors={colors}
              size={6.4}
            />
          </div>
        </div>

        <div
          className="min-w-0 min-h-0 flex flex-col justify-center"
          style={{
            padding: ci(4),
            borderRight: `1px solid ${colors.secondary}12`,
          }}
        >
          <Price {...p} value={p.price} colors={colors} size={5.5} />

          <Edit
            {...p}
            field="subtext"
            value={p.subtext}
            className="text-[calc(1.8*var(--ci))] opacity-50 leading-relaxed mt-[calc(1.2*var(--ci))]"
          />

          <Edit
            {...p}
            field="website"
            value={p.website}
            className="text-[calc(1.35*var(--ci))] opacity-25 mt-[calc(1.5*var(--ci))] tracking-widest uppercase truncate"
          />

          <FeatureList
            {...p}
            features={p.features}
            colors={colors}
          />
        </div>

        <div
          className="min-w-0 min-h-0 flex flex-col items-center justify-center"
          style={{
            padding: ci(3),
            backgroundColor: colors.accent,
          }}
        >
          <p
            className="text-[calc(1.55*var(--ci))] tracking-widest uppercase font-bold mb-[calc(1.3*var(--ci))]"
            style={{ color: colors.primary, opacity: 0.7 }}
          >
            Get yours
          </p>

          <CTA
            {...p}
            text={p.ctaText}
            colors={{
              ...colors,
              accent: colors.primary,
              primary: colors.accent,
            }}
            variant="outline"
          />
        </div>
      </div>
    </Base>
  );
}

const VARIANTS: Record<
  string,
  React.ComponentType<LuxuryProductProps>
> = {
  "Black Gold": VariantBlackGold,
  "White Gold": VariantWhiteGold,
  "Navy Cyan": VariantNavyCyan,
  "Dark Marble": VariantDarkMarble,
  "Royal Purple": VariantRoyalPurple,
  "Emerald Green": VariantEmeraldGreen,
  "Soft Sage": VariantSoftSage,
  "Rose Blush": VariantRoseBlush,
  "Classic Monochrome": VariantClassicMono,
  "Crimson Velvet": VariantCrimsonVelvet,
  "New Catalog": VariantNewCatalog,
  "Borcelle Skincare": VariantBorcelleSkincare,
};

export function LuxuryProductTemplate(props: LuxuryProductProps) {
  if (!props.productImage || !props.colors || !props.headline) {
    return (
      <div className="w-full h-full min-h-0 flex items-center justify-center bg-gray-100 text-gray-400 text-sm">
        Loading template...
      </div>
    );
  }

  const Variant =
    VARIANTS[props.name ?? "White Gold"] ?? VariantWhiteGold;

  return <Variant {...props} />;
}