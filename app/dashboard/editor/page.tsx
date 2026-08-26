"use client";

import {
  useState, useEffect, useLayoutEffect, useRef, useCallback, Suspense, memo,
} from "react";
import type { PromoVideoProps } from "@/remotion/PromoVideo";
import dynamic from "next/dynamic";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import {
  ArrowLeft, Download, Pointer, Type, Palette,
  Video, MessageSquare, Check, Copy, Bold, Italic, ListChecks,
  AlignLeft, AlignCenter, AlignRight, Plus, Minus, Package, GripVertical, X,
  UploadCloud, Film, Square, Smartphone, Monitor, Image as ImageIcon, Loader2,
  ChevronDown, ChevronUp,
} from "lucide-react";
import { loadJobResult, fetchJobById, ApiError } from "@/lib/campaign-api";
import type { PlayerRef } from "@remotion/player";
import { Logo } from "@/components/Logo";

// ============================================================================
// DYNAMIC IMPORTS
// ============================================================================
const Player = dynamic(
  () => import("@remotion/player").then(m => m.Player),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full flex items-center justify-center text-zinc-600 text-[11px]">
        Loading preview
      </div>
    ),
  },
);

const PromoVideo = dynamic<PromoVideoProps>(
  () => import("@/remotion/PromoVideo").then(m => m.PromoVideo),
  { ssr: false },
);

// ============================================================================
// TEMPLATE IMPORTS
// ============================================================================
import { LuxuryProductTemplate } from "@/components/templates/LuxuryProduct";
import { SleekFlyerTemplate as MinimalProductTemplate } from "@/components/templates/MinimalProduct";
import { PremiumBrandTemplate } from "@/components/templates/PremiumBrand";

// ============================================================================
// LOCAL TYPE: JobResult
// ============================================================================
interface JobResult {
  job_id?: string;
  flyer?: {
    headline?: string;
    subheadline?: string;
    subtext?: string;
    cta?: string;
    ctaText?: string;
    ctaVisible?: boolean;
    badgeText?: string;
    brand_name?: string;
    brandName?: string;
    price_text?: string;
    colors?: any;
    phone?: string;
    email?: string;
    website?: string;
    address?: string;
    features?: string[];
    feature_highlights?: string[];
    why_choose_us?: string[];
    whyChooseUs?: string[];
    name?: string;
  };
  template_category?: string;
  png_url?: string;
  captions?: Array<{ platform: string; text: string }>;
}

// ============================================================================
// TEMPLATE RENDERER (unchanged)
// ============================================================================
const TemplateRenderer = memo(function TemplateRenderer({
  data,
  onUpdate,
  onElementFocus,
  onElementBlur,
  onUpdateFeature,
  onAddFeature,
  onRemoveFeature,
  onUpdateWhyChooseUs,
  onAddWhyChooseUs,
  onRemoveWhyChooseUs,
}: {
  data: FlyerState;
  onUpdate: (field: string, value: any) => void;
  onElementFocus: (el: HTMLElement) => void;
  onElementBlur: () => void;
  onUpdateFeature: (index: number, value: string) => void;
  onAddFeature: () => void;
  onRemoveFeature: (index: number) => void;
  onUpdateWhyChooseUs: (index: number, value: string) => void;
  onAddWhyChooseUs: () => void;
  onRemoveWhyChooseUs: (index: number) => void;
}) {
  const shared = {
    name: data.templateVariant || "Digital Agency",
    headline: data.headline,
    subtext: data.subtext,
    ctaText: data.ctaText,
    ctaVisible: data.ctaVisible,
    productImage: data.productImage,
    brandName: data.brandName,
    phone: data.phone,
    email: data.email,
    website: data.website,
    price: data.price,
    colors: data.colors,
    features: data.features,
    whyChooseUs: data.whyChooseUs,
    featuresVisible: data.featuresVisible,
    whyChooseUsVisible: data.whyChooseUsVisible,
    phoneVisible: data.phoneVisible,
    emailVisible: data.emailVisible,
    websiteVisible: data.websiteVisible,
    editable: true,
    onUpdate,
    onFocusEl: onElementFocus,
    onBlurEl: onElementBlur,
    onUpdateFeature,
    onAddFeature,
    onRemoveFeature,
    onUpdateWhyChooseUs,
    onAddWhyChooseUs,
    onRemoveWhyChooseUs,
    onRemovePhone: () => onUpdate("phoneVisible", false),
    onRemoveEmail: () => onUpdate("emailVisible", false),
    onRemoveWebsite: () => onUpdate("websiteVisible", false),
  };

  switch (data.templateCategory) {
    case "Luxury Product":
      return <LuxuryProductTemplate {...shared} />;
    case "Minimal Product":
      return <MinimalProductTemplate {...shared} />;
    case "Premium Brand":
      return <PremiumBrandTemplate {...shared} />;
    default:
      return <LuxuryProductTemplate {...shared} />;
  }
});

// ============================================================================
// TYPES
// ============================================================================
type Tool = "select" | "text";
type ColorLayer = "primary" | "secondary" | "tertiary";
type RsbTab = "design" | "content" | "video" | "captions";
type FormatId = typeof SOCIAL_FORMATS[number]["id"];

type BackendCaptions = {
  instagram?: string;
  facebook?: string;
  whatsapp?: string;
  tiktok?: string;
  twitter?: string;
};

type Caption = {
  platform: string;
  key: keyof BackendCaptions;
  text: string;
  color: string;
};

type FlyerState = {
  headline: string;
  subtext: string;
  ctaText: string;
  ctaVisible: boolean;
  badgeText: string;
  price: string;
  brandName: string;
  website: string;
  phone: string;
  email: string;
  features: string[];
  whyChooseUs: string[];
  featuresVisible?: boolean;
  whyChooseUsVisible?: boolean;
  phoneVisible: boolean;
  emailVisible: boolean;
  websiteVisible: boolean;
  productImage: string;
  logoImage: string | null;
  templateVariant: string;
  templateCategory:
    | "Luxury Product"
    | "Minimal Product"
    | "Premium Brand";
  colors: {
    primary: string;
    secondary: string;
    accent: string;
  };
};

// ============================================================================
// CONSTANTS & HELPERS
// ============================================================================
const SOCIAL_FORMATS = [
  { id: "ig", label: "Instagram", icon: ImageIcon, ratio: "4:5", rw: 4, rh: 5, fps: 30, durationS: 12, exportW: 1080, exportH: 1350 },
  { id: "square", label: "Square", icon: Square, ratio: "1:1", rw: 1, rh: 1, fps: 30, durationS: 12, exportW: 1080, exportH: 1080 },
  { id: "story", label: "Story", icon: Smartphone, ratio: "9:16", rw: 9, rh: 16, fps: 30, durationS: 15, exportW: 1080, exportH: 1920 },
  { id: "tiktok", label: "TikTok", icon: Film, ratio: "9:16", rw: 9, rh: 16, fps: 30, durationS: 12, exportW: 1080, exportH: 1920 },
] as const;

const PLATFORM_META: { key: keyof BackendCaptions; label: string; color: string }[] = [
  { key: "instagram", label: "Instagram", color: "text-pink-400" },
  { key: "tiktok", label: "TikTok", color: "text-purple-400" },
  { key: "twitter", label: "Twitter/X", color: "text-sky-400" },
  { key: "facebook", label: "Facebook", color: "text-blue-400" },
  { key: "whatsapp", label: "WhatsApp", color: "text-emerald-400" },
];

function parseCaptions(raw: BackendCaptions | null | undefined): Caption[] {
  if (!raw) return [];
  return PLATFORM_META
    .filter(p => !!raw[p.key])
    .map(p => ({
      platform: p.label,
      key: p.key,
      text: raw[p.key]!,
      color: p.color,
    }));
}

// ==================== COLOUR SWATCHES (30) ====================
const COLOR_SWATCHES = [
  "#0a0a0a", "#1c1c1e", "#f5f5f0", "#e8e2d5", "#c0c0c0", "#8c8c8c",
  "#d4af37", "#b08d57", "#e5c07b", "#b76e79",
  "#1a237e", "#283593", "#003153", "#0f4c81", "#4682b4",
  "#014421", "#0b6e4f", "#4a5d43", "#2e4600",
  "#7b1e3a", "#9a2a2a", "#c1440e", "#e07a5f", "#d94f70",
  "#5b2a86", "#6a0572", "#a78bfa",
  "#ffffff", "#111111", "#f4f1ea",
];

// ==================== EXTENDED THEMES ====================
const TEMPLATE_THEMES = [
  { label: "Gold", bg: "#0a0a0a", accent: "#c9a84c", text: "#ffffff" },
  { label: "Violet", bg: "#0f0a1e", accent: "#a78bfa", text: "#ffffff" },
  { label: "Emerald", bg: "#022c22", accent: "#6ee7b7", text: "#ffffff" },
  { label: "Rouge", bg: "#1a0000", accent: "#fca5a5", text: "#ffffff" },
  { label: "Ivory", bg: "#f5f0e8", accent: "#1c1917", text: "#1c1917" },
  { label: "Ocean", bg: "#0a1929", accent: "#38bdf8", text: "#ffffff" },
  { label: "Slate", bg: "#1d1d1f", accent: "#0071e3", text: "#f5f5f7" },
  { label: "Paper", bg: "#fafafa", accent: "#111111", text: "#111111" },
  { label: "Terracotta", bg: "#2b1810", accent: "#e07a5f", text: "#f4ede4" },
  { label: "Sage", bg: "#f0f2ea", accent: "#4a5d43", text: "#1f2417" },
  { label: "Silver", bg: "#1c1c1e", accent: "#c0c0c0", text: "#ffffff" },
  { label: "Indigo", bg: "#0d0f2b", accent: "#5c6bc0", text: "#ffffff" },
  { label: "Rose Gold", bg: "#2a1a1d", accent: "#b76e79", text: "#f5ece7" },
  { label: "Burgundy", bg: "#1a0510", accent: "#7b1e3a", text: "#f4ede4" },
  { label: "Forest", bg: "#0a1f14", accent: "#4a8b6f", text: "#eaf3ec" },
];

// ============================================================================
// EDITABLE COMPONENT
// ============================================================================
type EditableProps = {
  id: string;
  value: string;
  onChange: (v: string) => void;
  className?: string;
  style?: React.CSSProperties;
  placeholder?: string;
  onFocus?: (el: HTMLElement) => void;
  onBlur?: () => void;
};

function Editable({
  id, value, onChange, className = "", style = {}, placeholder = "", onFocus, onBlur,
}: EditableProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current && document.activeElement !== ref.current && ref.current.textContent !== value) {
      ref.current.textContent = value;
    }
  }, [value]);

  return (
    <div
      ref={ref}
      id={id}
      contentEditable
      suppressContentEditableWarning
      data-placeholder={placeholder}
      className={`outline-none select-text touch-manipulation -m-1.5 p-1.5 ${className}`}
      style={{
        cursor: "text",
        WebkitTapHighlightColor: "transparent",
        ...style,
      }}
      onInput={e => onChange((e.target as HTMLElement).textContent || "")}
      onFocus={e => onFocus?.(e.currentTarget)}
      onBlur={onBlur}
      onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) e.preventDefault(); }}
    />
  );
}

// ============================================================================
// MOVABLE / OVERLAY
// ============================================================================
type Transform = { x: number; y: number; scale: number };

const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));

function Movable({
  transform, onChange, containerRef, selected, onSelect, onDelete,
  minScale = 0.4, maxScale = 3, children, extra, dragHandleOnly = false,
}: {
  transform: Transform;
  onChange: (t: Transform) => void;
  containerRef: React.RefObject<HTMLElement | null>;
  selected: boolean;
  onSelect: () => void;
  onDelete?: () => void;
  minScale?: number;
  maxScale?: number;
  children: React.ReactNode;
  extra?: React.ReactNode;
  dragHandleOnly?: boolean;
}) {
  const dragRef = useRef<{ startX: number; startY: number; origX: number; origY: number } | null>(null);
  const resizeRef = useRef<{ startDist: number; origScale: number } | null>(null);

  const rectOf = () => containerRef.current?.getBoundingClientRect() ?? null;

  const beginDrag = (e: React.PointerEvent) => {
    onSelect();
    (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
    dragRef.current = { startX: e.clientX, startY: e.clientY, origX: transform.x, origY: transform.y };
  };

  const beginResize = (e: React.PointerEvent) => {
    e.stopPropagation();
    onSelect();
    (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
    const rect = rectOf();
    if (!rect) return;
    const cx = rect.left + (transform.x / 100) * rect.width;
    const cy = rect.top + (transform.y / 100) * rect.height;
    resizeRef.current = { startDist: Math.max(1, Math.hypot(e.clientX - cx, e.clientY - cy)), origScale: transform.scale };
  };

  const onPointerMove = (e: React.PointerEvent) => {
    const rect = rectOf();
    if (!rect) return;
    if (dragRef.current) {
      const dxPct = ((e.clientX - dragRef.current.startX) / rect.width) * 100;
      const dyPct = ((e.clientY - dragRef.current.startY) / rect.height) * 100;
      onChange({
        ...transform,
        x: clamp(dragRef.current.origX + dxPct, 0, 100),
        y: clamp(dragRef.current.origY + dyPct, 0, 100),
      });
    } else if (resizeRef.current) {
      const cx = rect.left + (transform.x / 100) * rect.width;
      const cy = rect.top + (transform.y / 100) * rect.height;
      const dist = Math.hypot(e.clientX - cx, e.clientY - cy);
      const scale = clamp(resizeRef.current.origScale * (dist / resizeRef.current.startDist), minScale, maxScale);
      onChange({ ...transform, scale });
    }
  };

  const endInteraction = () => { dragRef.current = null; resizeRef.current = null; };

  return (
    <div
      className="absolute"
      style={{
        left: `${transform.x}%`,
        top: `${transform.y}%`,
        transform: `translate(-50%, -50%) scale(${transform.scale})`,
        touchAction: "none",
        zIndex: selected ? 40 : 20,
      }}
      onPointerDown={e => { if (!dragHandleOnly) { e.stopPropagation(); beginDrag(e); } else { onSelect(); e.stopPropagation(); } }}
      onPointerMove={onPointerMove}
      onPointerUp={endInteraction}
      onPointerCancel={endInteraction}
      onClick={e => e.stopPropagation()}
    >
      <div
        style={{
          outline: selected ? "2px dashed #ffffff" : "none",
          outlineOffset: 6,
          borderRadius: 10,
          cursor: dragHandleOnly ? "default" : "grab",
        }}
      >
        {children}
      </div>

      {selected && (
        <>
          {dragHandleOnly && (
            <div
              onPointerDown={e => { e.stopPropagation(); beginDrag(e); }}
              title="Drag to move"
              className="absolute -top-3.5 left-1/2 -translate-x-1/2 w-7 h-7 rounded-full bg-white
                         flex items-center justify-center text-black shadow-lg cursor-grab touch-none"
              style={{ touchAction: "none" }}
            >
              <GripVertical size={14} />
            </div>
          )}
          {onDelete && (
            <button
              onPointerDown={e => e.stopPropagation()}
              onClick={e => { e.stopPropagation(); onDelete(); }}
              title="Remove"
              className="absolute -top-3 -left-3 w-6 h-6 rounded-full bg-red-500 text-white text-[12px]
                         flex items-center justify-center shadow-lg touch-manipulation"
            >
              <X size={12} />
            </button>
          )}
          <div
            onPointerDown={beginResize}
            title="Drag to resize"
            className="absolute -bottom-3 -right-3 w-7 h-7 rounded-full bg-white border-2 border-zinc-950
                       shadow-lg cursor-nwse-resize touch-none"
            style={{ touchAction: "none" }}
          />
          {extra}
        </>
      )}
    </div>
  );
}

// ============================================================================
// DISCOUNT BADGE
// ============================================================================
type DiscountBadge = {
  visible: boolean;
  text: string;
  subText: string;
  textColor: string;
  bgColor: string;
  transform: Transform;
};

const DEFAULT_BADGE: DiscountBadge = {
  visible: true,
  text: "50%",
  subText: "OFF",
  textColor: "#111111",
  bgColor: "#ffd23f",
  transform: { x: 84, y: 16, scale: 1 },
};

const BURST_CLIP_PATH =
  "polygon(50% 0%, 61% 12%, 75% 2%, 80% 18%, 95% 15%, 92% 32%, 100% 42%, 88% 50%, " +
  "100% 58%, 92% 68%, 95% 85%, 80% 82%, 75% 98%, 61% 88%, 50% 100%, 39% 88%, " +
  "25% 98%, 20% 82%, 5% 85%, 8% 68%, 0% 58%, 12% 50%, 0% 42%, 8% 32%, 5% 15%, 20% 18%, 25% 2%, 39% 12%)";

function DiscountBadgeSticker({
  badge, onChangeText, onChangeSubText, onFocus, onBlur,
}: {
  badge: DiscountBadge;
  onChangeText: (v: string) => void;
  onChangeSubText: (v: string) => void;
  onFocus?: (el: HTMLElement) => void;
  onBlur?: () => void;
}) {
  const SIZE = "calc(var(--ci) * 22)";

  return (
    <div style={{ width: SIZE, height: SIZE, position: "relative" }}>
      <div style={{
        position: "absolute", inset: 0, background: badge.bgColor,
        clipPath: BURST_CLIP_PATH, transform: "rotate(-10deg)",
        boxShadow: "0 12px 26px rgba(0,0,0,0.35)",
      }} />
      <div style={{
        position: "absolute", inset: 7, border: `2px dashed ${badge.textColor}50`,
        clipPath: BURST_CLIP_PATH, transform: "rotate(-10deg)",
      }} />
      <div style={{
        position: "absolute", inset: 0, display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center", gap: 1, padding: "0 8px",
      }}>
        <Editable
          id="badge-text"
          value={badge.text}
          onChange={onChangeText}
          onFocus={onFocus}
          onBlur={onBlur}
          className="text-center"
          style={{
            fontWeight: 900, fontSize: "calc(var(--ci) * 5)", lineHeight: 1, letterSpacing: "-0.03em",
            color: badge.textColor, textShadow: "0 1px 2px rgba(0,0,0,.12)",
            minWidth: 10,
          }}
        />
        <Editable
          id="badge-subtext"
          value={badge.subText}
          onChange={onChangeSubText}
          onFocus={onFocus}
          onBlur={onBlur}
          className="text-center"
          style={{
            fontWeight: 800, fontSize: "calc(var(--ci) * 2.4)", letterSpacing: "0.12em",
            color: badge.textColor, opacity: 0.85, minWidth: 10,
          }}
        />
      </div>
    </div>
  );
}

// ============================================================================
// PANEL COMPONENTS
// ============================================================================
function Label({ children }: { children: React.ReactNode }) {
  return <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-2">{children}</p>;
}
function Divider() { return <div className="h-px bg-zinc-800" />; }
function ToolBtn({ children, active, label, onClick }: {
  children: React.ReactNode; active?: boolean; label: string;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}) {
  return (
    <button onClick={onClick} title={label} aria-label={label}
      className={`w-11 h-11 md:w-9 md:h-9 rounded-lg flex items-center justify-center transition-colors touch-manipulation
        ${active
          ? "bg-white text-black"
          : "text-zinc-500 hover:bg-zinc-800 hover:text-zinc-200"}`}>
      {children}
    </button>
  );
}

function TextField({ label, value, onChange, placeholder, type = "text" }: {
  label: string; value: string; onChange: (v: string) => void; placeholder?: string; type?: string;
}) {
  return (
    <label className="block mb-3">
      <span className="text-[11px] text-zinc-500 mb-1 block">{label}</span>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={e => onChange(e.target.value)}
        className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2.5
                   text-[16px] text-zinc-100 focus:outline-none focus:border-white"
      />
    </label>
  );
}

function SectionToggle({ title, active, onToggle }: {
  title: string; active: boolean; onToggle: (v: boolean) => void;
}) {
  return (
    <button
      onClick={() => onToggle(!active)}
      className="w-full flex items-center justify-between px-3 py-3 rounded-lg bg-zinc-900
                 border border-zinc-800 mb-2 touch-manipulation"
    >
      <span className="text-[13px] text-zinc-200">{title}</span>
      <span className={`w-9 h-5 rounded-full relative transition-colors ${active ? "bg-white" : "bg-zinc-700"}`}>
        <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-black transition-all ${active ? "left-[18px]" : "left-0.5"}`} />
      </span>
    </button>
  );
}

// ======== DesignPanel ========
const DesignPanel = memo(function DesignPanel({
  data,
  onUpdate,
  onLogoUpload,
  badge,
  onBadgeChange,
  activeFormat,
  setActiveFormat,
}: {
  data: FlyerState;
  onUpdate: (k: keyof FlyerState, v: any) => void;
  onLogoUpload: (file: File) => void;
  badge: DiscountBadge;
  onBadgeChange: (b: DiscountBadge) => void;
  activeFormat: FormatId;
  setActiveFormat: (id: FormatId) => void;
}) {
  const [colorLayer, setColorLayer] = useState<ColorLayer>("primary");
  const [activeTheme, setActiveTheme] = useState<number | null>(null);

  const applyTheme = (i: number) => {
    setActiveTheme(i);
    const t = TEMPLATE_THEMES[i];
    onUpdate("colors", { primary: t.bg, secondary: t.text, accent: t.accent });
  };

  const applyColor = (hex: string) => {
    const map: Record<ColorLayer, keyof typeof data.colors> = {
      primary: "primary", secondary: "secondary", tertiary: "accent",
    };
    onUpdate("colors", { ...data.colors, [map[colorLayer]]: hex });
  };

  const currentLayerColor =
    colorLayer === "primary" ? data.colors.primary :
      colorLayer === "secondary" ? data.colors.secondary :
        data.colors.accent;

  return (
    <div className="space-y-5">
      <div>
        <Label>Format</Label>
        <div className="grid grid-cols-4 gap-1.5">
          {SOCIAL_FORMATS.map(f => {
            const Icon = f.icon;
            return (
              <button key={f.id} onClick={() => setActiveFormat(f.id)}
                className={`py-2 px-1 rounded-lg border text-center transition-all touch-manipulation text-[10px]
                  ${activeFormat === f.id
                    ? "border-white bg-white/10 text-white"
                    : "border-zinc-800 text-zinc-500 hover:border-zinc-600 hover:text-zinc-300"}`}>
                <Icon size={14} className="mx-auto mb-1" />
                <div className="font-bold leading-none">{f.label}</div>
                <div className="text-[8px] text-zinc-600 mt-0.5">{f.ratio}</div>
              </button>
            );
          })}
        </div>
      </div>

      <Divider />

      <div>
        <Label>Template theme</Label>
        <div className="grid grid-cols-3 gap-2">
          {TEMPLATE_THEMES.map((t, i) => (
            <button key={t.label} onClick={() => applyTheme(i)}
              className={`h-14 rounded-lg overflow-hidden border-2 relative transition-all text-left touch-manipulation
                ${activeTheme === i ? "border-white" : "border-transparent hover:border-zinc-600"}`}
              style={{ background: t.bg }}>
              <span style={{
                position: "absolute", bottom: 5, left: 7,
                fontSize: 8, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em",
                color: t.text, textShadow: "0 1px 3px rgba(0,0,0,.6)",
              }}>{t.label}</span>
            </button>
          ))}
        </div>
      </div>

      <Divider />

      <div>
        <Label>Brand colors</Label>
        <div className="flex bg-zinc-900 rounded-lg p-0.5 gap-0.5 mb-3">
          {(["primary", "secondary", "tertiary"] as ColorLayer[]).map(l => (
            <button key={l} onClick={() => setColorLayer(l)}
              className={`flex-1 py-2 rounded-md text-[10px] font-bold uppercase tracking-wider transition-colors touch-manipulation
                ${colorLayer === l ? "bg-white/10 text-white" : "text-zinc-500 hover:text-zinc-300"}`}>
              {l === "primary" ? "Primary" : l === "secondary" ? "Secondary" : "Tertiary"}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap gap-2 mb-3">
          {COLOR_SWATCHES.map(hex => (
            <button key={hex} onClick={() => applyColor(hex)}
              className="w-7 h-7 md:w-6 md:h-6 rounded-full border-2 hover:scale-110 transition-transform touch-manipulation shrink-0"
              style={{
                background: hex,
                borderColor: currentLayerColor === hex ? "white" : "transparent",
                boxShadow: currentLayerColor === hex ? "0 0 0 1px rgba(255,255,255,.3)" : "none",
                outline: hex === "#ffffff" ? "1px solid #444" : "none",
              }} />
          ))}
        </div>
        <div className="flex gap-2 items-center">
          <input type="color" value={currentLayerColor}
            onChange={e => applyColor(e.target.value)}
            className="w-10 h-10 rounded-lg cursor-pointer border border-zinc-700 bg-zinc-900 p-1 shrink-0" />
          <input type="text" value={currentLayerColor}
            inputMode="text"
            onChange={e => /^#[0-9a-fA-F]{6}$/.test(e.target.value) && applyColor(e.target.value)}
            className="flex-1 bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2.5
                       text-[16px] md:text-[12px] font-mono text-zinc-200 focus:outline-none focus:border-white" />
        </div>
      </div>

      <Divider />

      <div>
        <Label>Logo</Label>
        <label className="flex flex-col items-center gap-1.5 border-[1.5px] border-dashed border-zinc-700
                          rounded-xl p-4 cursor-pointer hover:border-zinc-500 hover:bg-zinc-900/50 transition-all touch-manipulation">
          <UploadCloud size={18} className="text-zinc-500" />
          <span className="text-[11px] text-zinc-500 text-center">Upload logo - PNG recommended</span>
          <input type="file" accept="image/*" className="hidden"
            onChange={e => { const f = e.target.files?.[0]; if (f) onLogoUpload(f); }} />
        </label>
      </div>

      <Divider />
    </div>
  );
});

// ======== ContentPanel – now includes discount badge and text properties ========
const ContentPanel = memo(function ContentPanel({
  data,
  onUpdate,
  badge,
  onBadgeChange,
  selectedTextId,
  freeTexts,
  onUpdateFreeText,
  onDeleteFreeText,
}: {
  data: FlyerState;
  onUpdate: (k: keyof FlyerState, v: any) => void;
  badge: DiscountBadge;
  onBadgeChange: (b: DiscountBadge) => void;
  selectedTextId: string | null;
  freeTexts: Array<{ id: string; text: string; color: string; transform: Transform }>;
  onUpdateFreeText: (id: string, updates: Partial<{ text: string; color: string; transform: Transform }>) => void;
  onDeleteFreeText: (id: string) => void;
}) {
  const selectedText = freeTexts.find(ft => ft.id === selectedTextId);

  return (
    <div className="space-y-5">
      <div>
        <Label>Main Text</Label>
        <TextField label="Headline" value={data.headline} onChange={v => onUpdate("headline", v)} />
        <TextField label="Subtext" value={data.subtext} onChange={v => onUpdate("subtext", v)} />
        <TextField label="Call to action" value={data.ctaText} onChange={v => onUpdate("ctaText", v)} />
      </div>

      <Divider />

      <div>
        <Label>Sections</Label>
        <SectionToggle title="Features" active={data.featuresVisible ?? true} onToggle={v => onUpdate("featuresVisible", v)} />
        <SectionToggle title="Why choose us" active={data.whyChooseUsVisible ?? true} onToggle={v => onUpdate("whyChooseUsVisible", v)} />
        <SectionToggle title="Call to Action (CTA)" active={data.ctaVisible} onToggle={v => onUpdate("ctaVisible", v)} />
      </div>

      <Divider />

      <div>
        <Label>Contact details</Label>
        <SectionToggle title="Phone" active={data.phoneVisible} onToggle={v => onUpdate("phoneVisible", v)} />
        <SectionToggle title="Email" active={data.emailVisible} onToggle={v => onUpdate("emailVisible", v)} />
        <SectionToggle title="Website" active={data.websiteVisible} onToggle={v => onUpdate("websiteVisible", v)} />
      </div>

      <Divider />

      <div>
        <Label>Discount Badge</Label>
        <div className="space-y-3">
          <SectionToggle title="Show badge" active={badge.visible} onToggle={v => onBadgeChange({ ...badge, visible: v })} />
          <TextField label="Discount text" value={badge.text} onChange={v => onBadgeChange({ ...badge, text: v })} placeholder="e.g. 50%" />
          <TextField label="Subtext" value={badge.subText} onChange={v => onBadgeChange({ ...badge, subText: v })} placeholder="e.g. OFF" />
          <div className="flex gap-4">
            <div className="flex-1">
              <Label>Text color</Label>
              <input
                type="color"
                value={badge.textColor}
                onChange={e => onBadgeChange({ ...badge, textColor: e.target.value })}
                className="w-full h-10 rounded-lg cursor-pointer border border-zinc-700 bg-zinc-900 p-1"
              />
            </div>
            <div className="flex-1">
              <Label>Background color</Label>
              <input
                type="color"
                value={badge.bgColor}
                onChange={e => onBadgeChange({ ...badge, bgColor: e.target.value })}
                className="w-full h-10 rounded-lg cursor-pointer border border-zinc-700 bg-zinc-900 p-1"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={badge.textColor}
              onChange={e => /^#[0-9a-fA-F]{6}$/.test(e.target.value) && onBadgeChange({ ...badge, textColor: e.target.value })}
              className="flex-1 bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-[12px] font-mono text-zinc-200 focus:outline-none focus:border-white"
              placeholder="#000000"
            />
            <input
              type="text"
              value={badge.bgColor}
              onChange={e => /^#[0-9a-fA-F]{6}$/.test(e.target.value) && onBadgeChange({ ...badge, bgColor: e.target.value })}
              className="flex-1 bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-[12px] font-mono text-zinc-200 focus:outline-none focus:border-white"
              placeholder="#ffffff"
            />
          </div>
        </div>
      </div>

      <Divider />

      {/* Text Properties Editor - shows when a free text is selected */}
      {selectedText && (
        <div>
          <Label>Selected Text</Label>
          <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-3 space-y-3">
            <TextField
              label="Text content"
              value={selectedText.text}
              onChange={v => onUpdateFreeText(selectedText.id, { text: v })}
            />
            <div className="flex items-center gap-3">
              <div className="flex-1">
                <Label>Color</Label>
                <input
                  type="color"
                  value={selectedText.color}
                  onChange={e => onUpdateFreeText(selectedText.id, { color: e.target.value })}
                  className="w-full h-10 rounded-lg cursor-pointer border border-zinc-700 bg-zinc-900 p-1"
                />
              </div>
              <div className="flex-1">
                <Label>Size</Label>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      const newScale = Math.max(0.4, selectedText.transform.scale - 0.1);
                      onUpdateFreeText(selectedText.id, { transform: { ...selectedText.transform, scale: newScale } });
                    }}
                    className="w-8 h-8 rounded-lg bg-zinc-800 text-white flex items-center justify-center touch-manipulation"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="text-sm text-zinc-300 w-10 text-center">
                    {Math.round(selectedText.transform.scale * 100)}%
                  </span>
                  <button
                    onClick={() => {
                      const newScale = Math.min(3, selectedText.transform.scale + 0.1);
                      onUpdateFreeText(selectedText.id, { transform: { ...selectedText.transform, scale: newScale } });
                    }}
                    className="w-8 h-8 rounded-lg bg-zinc-800 text-white flex items-center justify-center touch-manipulation"
                  >
                    <Plus size={14} />
                  </button>
                </div>
              </div>
            </div>
            <button
              onClick={() => onDeleteFreeText(selectedText.id)}
              className="w-full py-2 rounded-lg bg-red-500/20 text-red-400 text-[12px] font-bold touch-manipulation"
            >
              Delete text
            </button>
          </div>
        </div>
      )}
    </div>
  );
});

// ======== VideoPanel ========
interface VideoPanelProps {
  flyer: FlyerState;
  activeFormatId: FormatId;
  jobId: string | null;
  logoOverlay: { image: string | null; transform: Transform };
  badgeOverlay: DiscountBadge;
}

const VideoPanel = memo(function VideoPanel({
  flyer,
  activeFormatId,
  jobId,
  logoOverlay,
  badgeOverlay,
}: VideoPanelProps) {
  const [selectedFormat, setSelectedFormat] = useState<FormatId>(activeFormatId);
  const [downloading, setDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState<string | null>(null);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  const fmt = SOCIAL_FORMATS.find(f => f.id === selectedFormat)!;
  const BASE = 1080;
  const isWide = fmt.rw >= fmt.rh;
  const COMP_W = isWide ? BASE : Math.round(BASE * (fmt.rw / fmt.rh));
  const COMP_H = isWide ? Math.round(BASE * (fmt.rh / fmt.rw)) : BASE;
  const durationInFrames = fmt.fps * fmt.durationS;

  const promoProps = {
    headline: flyer.headline,
    subtext: flyer.subtext,
    ctaText: flyer.ctaText,
    price: flyer.price,
    brandName: flyer.brandName,
    website: flyer.website,
    productImage: flyer.productImage,
    colors: flyer.colors,
    logoImage: logoOverlay.image,
    badge: badgeOverlay.visible ? badgeOverlay : null,
  };

  const POLL_INTERVAL_MS = 3000;

  const pollJobStatus = useCallback(async (
    videoJobId: string,
    onTick: (seconds: number) => void
  ): Promise<string> => {
    let seconds = 0;
    while (true) {
      await new Promise(r => setTimeout(r, POLL_INTERVAL_MS));
      seconds += POLL_INTERVAL_MS / 1000;
      onTick(seconds);

      const statusRes = await fetch(`/api/campaign/render-video/${videoJobId}/`);
      if (!statusRes.ok) throw new Error(`Status check failed (${statusRes.status})`);
      const statusData = await statusRes.json();
      if (statusData.status === "success") return statusData.video_url;
      if (statusData.status === "failed") throw new Error(statusData.error || "Render failed");
    }
  }, []);

  const downloadFromUrl = async (videoUrl: string, filename: string) => {
    const videoRes = await fetch(videoUrl);
    const blob = await videoRes.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDownload = async () => {
    if (downloading) return;
    setDownloading(true);
    setDownloadError(null);
    setElapsedSeconds(0);

    try {
      const res = await fetch("/api/campaign/render-video/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ format: selectedFormat, props: promoProps }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || `Render failed (${res.status})`);
      }
      const { job_id: videoJobId } = await res.json();

      const videoUrl = await pollJobStatus(videoJobId, setElapsedSeconds);
      await downloadFromUrl(videoUrl, `promo-${selectedFormat}.mp4`);
    } catch (err) {
      console.error(err);
      setDownloadError(err instanceof Error ? err.message : "Video render failed.");
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="space-y-4">
      <Label>Select format</Label>
      <div className="grid grid-cols-3 gap-1.5">
        {SOCIAL_FORMATS.map(f => {
          const Icon = f.icon;
          return (
            <button key={f.id} onClick={() => setSelectedFormat(f.id)}
              className={`py-2.5 px-1 rounded-lg border text-center transition-all touch-manipulation
                ${selectedFormat === f.id
                  ? "border-white bg-white/10 text-white"
                  : "border-zinc-800 text-zinc-500 hover:border-zinc-600 hover:text-zinc-300"}`}>
              <Icon size={14} className="mx-auto mb-1" />
              <div className="text-[9px] font-bold leading-none">{f.label}</div>
              <div className="text-[8px] text-zinc-600 mt-0.5">{f.ratio}</div>
            </button>
          );
        })}
      </div>

      <Divider />

      <Label>Preview ({fmt.durationS}s promo)</Label>
      <div className="rounded-xl overflow-hidden border border-zinc-800 bg-zinc-950"
        style={{ aspectRatio: `${fmt.rw}/${fmt.rh}`, maxHeight: 260 }}>
        <Player
          component={PromoVideo as unknown as React.ComponentType<Record<string, unknown>>}
          inputProps={promoProps}
          durationInFrames={durationInFrames}
          compositionWidth={COMP_W}
          compositionHeight={COMP_H}
          fps={fmt.fps}
          style={{ width: "100%", height: "100%" }}
          controls
          loop
          autoPlay
          acknowledgeRemotionLicense
        />
      </div>

      <Divider />

      <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-3 space-y-1.5">
        <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-2">
          Premium video elements included
        </p>
        {[
          "Cinematic product reveal with depth",
          "Word-by-word animated headline",
          "Price badge pop with spring physics",
          "CTA with animated underline sweep",
          "Brand intro + outro bumpers",
          "Ambient accent light circles",
        ].map(t => (
          <div key={t} className="flex items-center gap-2">
            <div className="w-1 h-1 rounded-full bg-white shrink-0" />
            <span className="text-[10px] text-zinc-400">{t}</span>
          </div>
        ))}
      </div>

      {downloadError && (
        <p className="text-red-400 text-[11px]">{downloadError}</p>
      )}

      <button
        type="button"
        onClick={handleDownload}
        disabled={downloading}
        aria-busy={downloading}
        className={`w-full py-3.5 md:py-2.5 rounded-xl font-bold text-[13px] flex items-center justify-center gap-2 transition-all duration-200 touch-manipulation
          ${downloading
            ? "bg-zinc-700 text-zinc-400 cursor-not-allowed"
            : "bg-white hover:bg-zinc-200 active:scale-[0.98] text-black"
          }`}
      >
        {downloading ? (
          <>
            <div className="w-4 h-4 border-2 border-transparent border-t-black border-r-black rounded-full animate-spin" />
            <span>Rendering{elapsedSeconds > 0 ? ` (${Math.floor(elapsedSeconds)}s)` : "..."}</span>
          </>
        ) : (
          <>
            <Download size={16} />
            <span>Download {fmt.label} Video</span>
          </>
        )}
      </button>
    </div>
  );
});

// ======== CaptionsPanel ========
const CaptionsPanel = memo(function CaptionsPanel({ captions }: { captions: Caption[] }) {
  const [copied, setCopied] = useState<string | null>(null);

  const copy = (platform: string, text: string) => {
    navigator.clipboard.writeText(text).catch(() => { });
    setCopied(platform);
    setTimeout(() => setCopied(null), 2000);
  };

  if (captions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 gap-3
                      border border-dashed border-zinc-800 rounded-xl">
        <MessageSquare size={24} className="text-zinc-600" />
        <p className="text-[11px] text-zinc-500 text-center max-w-[180px]">
          Captions will appear here once your job has finished processing.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <p className="text-[11px] text-zinc-500 leading-relaxed mb-1">
        Generated from your product. Tap to copy.
      </p>
      {captions.map(cap => (
        <div key={cap.platform}
          className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
          <div className="flex items-center justify-between px-3.5 py-2.5 border-b border-zinc-800/60">
            <span className={`text-[10px] font-bold uppercase tracking-wider ${cap.color}`}>
              {cap.platform}
            </span>
            <button
              onClick={() => copy(cap.platform, cap.text)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-800 text-[10px]
                         text-zinc-400 hover:text-white hover:bg-zinc-700 transition-colors touch-manipulation">
              {copied === cap.platform
                ? <><Check size={10} /> Copied</>
                : <><Copy size={10} /> Copy</>
              }
            </button>
          </div>
          <p className="px-3.5 py-3 text-[11px] text-zinc-400 leading-relaxed whitespace-pre-wrap">
            {cap.text}
          </p>
        </div>
      ))}
    </div>
  );
});

// ============================================================================
// EXPORT DROPDOWN
// ============================================================================
function ExportDropdown({
  onExport,
  exportingFormat,
}: {
  onExport: (format: 'png' | 'jpg' | 'pdf') => void;
  exportingFormat: 'png' | 'jpg' | 'pdf' | null;
}) {
  const [open, setOpen] = useState(false);
  const isExporting = exportingFormat !== null;

  return (
    <div className="relative">
      <button
        onClick={() => !isExporting && setOpen(v => !v)}
        disabled={isExporting}
        className="px-3 sm:px-4 py-2 sm:py-1.5 rounded-lg text-[12px] font-bold bg-white
                   hover:bg-zinc-200 disabled:opacity-60 disabled:cursor-not-allowed
                   text-black flex items-center gap-1.5 transition-colors touch-manipulation"
      >
        {isExporting ? (
          <>
            <Loader2 size={13} className="animate-spin" />
            Exporting {exportingFormat.toUpperCase()}...
          </>
        ) : (
          <>
            <Download size={13} />
            Export
            <ChevronDown size={13} />
          </>
        )}
      </button>
      {open && !isExporting && (
        <div className="absolute right-0 mt-1 w-36 bg-zinc-900 border border-zinc-700 rounded-xl shadow-2xl overflow-hidden z-50">
          {(['png', 'jpg', 'pdf'] as const).map(f => (
            <button
              key={f}
              onClick={() => { onExport(f); setOpen(false); }}
              className="w-full text-left px-3.5 py-2.5 text-[12px] text-zinc-200 hover:bg-zinc-800"
            >
              {f.toUpperCase()}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ============================================================================
// MAIN EDITOR COMPONENT
// ============================================================================
const EMPTY_FLYER_STATE: FlyerState = {
  headline: "",
  subtext: "",
  ctaText: "",
  ctaVisible: true,
  badgeText: "",
  price: "",
  brandName: "",
  phone: "",
  email: "",
  website: "",
  features: [],
  whyChooseUs: [],
  featuresVisible: true,
  whyChooseUsVisible: true,
  phoneVisible: true,
  emailVisible: true,
  websiteVisible: true,
  productImage: "",
  logoImage: null,
  templateVariant: "",
  templateCategory: "Premium Brand",
  colors: {
    primary: "#0a0a0a",
    secondary: "#ffffff",
    accent: "#c9a84c",
  },
};

const VALID_CATEGORIES: FlyerState["templateCategory"][] = [
  "Luxury Product", "Minimal Product", "Premium Brand",
];

async function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

async function toDataURL(url: string): Promise<string> {
  try {
    const res = await fetch(url, { mode: "cors" });
    const blob = await res.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0);
        resolve(canvas.toDataURL('image/png'));
      };
      img.onerror = () => reject(new Error('Failed to load image for data URL'));
      img.src = url;
    });
  }
}

async function uploadAsset(file: File): Promise<string> {
  const form = new FormData();
  form.append("file", file);

  const res = await fetch("/api/campaign/uploads/", {
    method: "POST",
    body: form,
  });

  if (!res.ok) {
    throw new Error("Upload failed");
  }

  const data = await res.json();
  return data.url as string;
}

function EditorContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const canvasWrapRef = useRef<HTMLDivElement>(null);
  const [flyer, setFlyer] = useState<FlyerState>(EMPTY_FLYER_STATE);
  const [loading, setLoading] = useState(true);
  const flyerNodeRef = useRef<HTMLDivElement>(null);
  const exportNodeRef = useRef<HTMLDivElement>(null);
  const [jobId, setJobId] = useState<string | null>(null);
  const [exportError, setExportError] = useState<string | null>(null);
  const [captions, setCaptions] = useState<Caption[]>([]);
  const [activeTab, setActiveTab] = useState<RsbTab>("content"); // default to content for text editing
  const [activeTool, setActiveTool] = useState<Tool>("select");
  const [activeFormat, setActiveFormat] = useState<FormatId>("ig");
  const [scale, setScale] = useState<number | null>(null);
  const [panelCollapsed, setPanelCollapsed] = useState(false); // true = collapsed (header only), false = expanded

  const [logoOverlay, setLogoOverlay] = useState<{
    image: string | null;
    transform: Transform;
  }>({
    image: null,
    transform: { x: 15, y: 15, scale: 1 },
  });

  const [badgeOverlay, setBadgeOverlay] = useState<DiscountBadge>({
    visible: true,
    text: "50%",
    subText: "OFF",
    textColor: "#111111",
    bgColor: "#ffd23f",
    transform: { x: 84, y: 16, scale: 1 },
  });

  const [freeTexts, setFreeTexts] = useState<
    Array<{
      id: string;
      text: string;
      color: string;
      transform: Transform;
    }>
  >([]);

  const [selectedOverlayId, setSelectedOverlayId] = useState<string | null>(null);
  const [pendingUploads, setPendingUploads] = useState(0);
  const [exportingFormat, setExportingFormat] = useState<"png" | "jpg" | "pdf" | null>(null);

  const update = useCallback(
    (field: string, value: any) => {
      setFlyer(prev => {
        if (!(field in prev)) {
          console.warn(`Unknown flyer field: ${field}`);
          return prev;
        }
        return {
          ...prev,
          [field]: value,
        };
      });
    },
    []
  );

  const updateFeature = useCallback((index: number, value: string) => {
    setFlyer(prev => {
      const next = [...prev.features];
      next[index] = value;
      return { ...prev, features: next };
    });
  }, []);

  const updateWhyChooseUs = useCallback(
    (index: number, value: string) => {
      setFlyer(prev => {
        const next = [...prev.whyChooseUs];
        next[index] = value;
        return {
          ...prev,
          whyChooseUs: next,
        };
      });
    },
    []
  );

  const addWhyChooseUs = useCallback(() => {
    setFlyer(prev => ({
      ...prev,
      whyChooseUs: [
        ...prev.whyChooseUs,
        "New reason",
      ],
    }));
  }, []);

  const removeWhyChooseUs = useCallback((index: number) => {
    setFlyer(prev => ({
      ...prev,
      whyChooseUs: prev.whyChooseUs.filter(
        (_, i) => i !== index
      ),
    }));
  }, []);

  const addFeature = useCallback(() => {
    setFlyer(prev => ({ ...prev, features: [...prev.features, "New feature"] }));
  }, []);

  const removeFeature = useCallback((index: number) => {
    setFlyer(prev => ({ ...prev, features: prev.features.filter((_, i) => i !== index) }));
  }, []);

  const handleImageUpload = useCallback(
    async (file: File, field: "productImage" | "logoImage") => {
      if (!file) return;
      const blobUrl = URL.createObjectURL(file);
      if (field === "logoImage") {
        setLogoOverlay(prev => ({ ...prev, image: blobUrl }));
        update("logoImage", null);
      } else {
        update("productImage", blobUrl);
      }
      setPendingUploads(n => n + 1);
      try {
        const url = await uploadAsset(file);
        if (field === "logoImage") {
          setLogoOverlay(prev => ({ ...prev, image: url }));
        } else {
          update("productImage", url);
        }
      } catch {
        setExportError(
          `${field === "productImage" ? "Product image" : "Logo"} upload failed. Please try again.`
        );
      } finally {
        setPendingUploads(n => n - 1);
      }
    },
    [update]
  );

  // ============================================================================
  // EXPORT FLYER
  // ============================================================================
  const exportFlyer = useCallback(async (
    format: 'png' | 'jpg' | 'pdf',
  ) => {
    if (!exportNodeRef.current) return;
    if (pendingUploads > 0) {
      setExportError("Still uploading your image - please wait a moment and try again.");
      return;
    }

    setExportingFormat(format);
    setExportError(null);

    const node = exportNodeRef.current;
    let imgEls: HTMLImageElement[] = [];
    let originalSrcs: string[] = [];

    try {
      imgEls = Array.from(node.querySelectorAll("img"));
      originalSrcs = imgEls.map(img => img.src);

      await Promise.all(
        imgEls.map(async (img, i) => {
          try {
            const dataUrl = await toDataURL(originalSrcs[i]);
            img.src = dataUrl;
            try {
              await img.decode();
            } catch {
              await new Promise<void>((resolve) => {
                img.onload = () => resolve();
                img.onerror = () => resolve();
              });
            }
          } catch {
            // keep original
          }
        })
      );

      await new Promise(res => requestAnimationFrame(res));
      const isTouch = typeof window !== "undefined" && matchMedia("(pointer: coarse)").matches;
      await new Promise(res => setTimeout(res, isTouch ? 350 : 100));

      const { toPng, toJpeg } = await import("html-to-image");
      const fmt = SOCIAL_FORMATS.find(f => f.id === activeFormat)!;
      const snapshotOpts = {
        pixelRatio: 1,
        cacheBust: true,
        width: fmt.exportW,
        height: fmt.exportH,
        useCORS: true,
        skipAutoScale: true,
      };

      let blob: Blob;
      if (format === 'jpg') {
        const dataUrl = await toJpeg(node, { ...snapshotOpts, quality: 0.95, backgroundColor: '#ffffff' });
        blob = await (await fetch(dataUrl)).blob();
      } else if (format === 'pdf') {
        const { default: jsPDF } = await import('jspdf');
        const dataUrl = await toPng(node, snapshotOpts);
        const pdf = new jsPDF({
          orientation: fmt.exportW > fmt.exportH ? "landscape" : "portrait",
          unit: "px",
          format: [fmt.exportW, fmt.exportH],
        });
        pdf.addImage(dataUrl, "PNG", 0, 0, fmt.exportW, fmt.exportH);
        blob = pdf.output("blob");
      } else {
        const dataUrl = await toPng(node, snapshotOpts);
        blob = await (await fetch(dataUrl)).blob();
      }

      const ext = format === 'pdf' ? 'pdf' : format;
      const filename = `flyer-${activeFormat}.${ext}`;
      await downloadBlob(blob, filename);

    } catch (err) {
      console.error(err);
      setExportError(err instanceof Error ? err.message : "Export failed.");
    } finally {
      imgEls.forEach((img, i) => { img.src = originalSrcs[i]; });
      setExportingFormat(null);
    }
  }, [exportNodeRef, activeFormat, pendingUploads]);

  // -------- LOAD DATA (unchanged) --------
  useEffect(() => {
    let cancelled = false;

    async function init() {
      const urlJobId = searchParams.get("job");
      const urlVariant = searchParams.get("variant");
      const rawCategory = searchParams.get("category");
      const urlCategory = VALID_CATEGORIES.includes(rawCategory as any)
        ? (rawCategory as FlyerState["templateCategory"])
        : null;

      let result: JobResult | null = loadJobResult(urlJobId) as JobResult | null;

      if (!result && urlJobId) {
        try {
          const fetched = await fetchJobById(urlJobId);
          result = fetched as JobResult;
        } catch (err) {
          if (cancelled) return;
          if (err instanceof ApiError && err.status === 401) {
            const redirect = encodeURIComponent(
              `${window.location.pathname}${window.location.search}`
            );
            router.push(`/login?redirect=${redirect}`);
            return;
          }
          console.error("Failed to load job", urlJobId, err);
          setLoading(false);
          setExportError(
            err instanceof ApiError && err.status === 404
              ? "That campaign couldn't be found."
              : "Couldn't load this campaign. Check your connection and try again."
          );
          return;
        }
      }

      if (cancelled) return;

      if (!result && !urlVariant) {
        router.push("/dashboard");
        return;
      }

      if (result) {
        setJobId(result.job_id || urlJobId || null);

        setFlyer(prev => ({
          ...prev,
          ...(result.flyer && {
            headline: result.flyer.headline || prev.headline,
            subtext: result.flyer.subheadline || result.flyer.subtext || prev.subtext,
            ctaText: result.flyer.cta || result.flyer.ctaText || prev.ctaText,
            ctaVisible: result.flyer.ctaVisible ?? prev.ctaVisible,
            badgeText: result.flyer.badgeText || prev.badgeText,
            brandName: result.flyer.brand_name || result.flyer.brandName || prev.brandName,
            price: result.flyer.price_text || prev.price,
            colors: result.flyer.colors || prev.colors,
            phone: result.flyer.phone ?? prev.phone,
            email: result.flyer.email ?? prev.email,
            website: result.flyer.website ?? prev.website,
            features: Array.isArray(result.flyer.features) && result.flyer.features.length > 0
              ? result.flyer.features
              : Array.isArray(result.flyer.feature_highlights) && result.flyer.feature_highlights.length > 0
                ? result.flyer.feature_highlights
                : prev.features,
            whyChooseUs: Array.isArray(result.flyer.why_choose_us) && result.flyer.why_choose_us.length > 0
              ? result.flyer.why_choose_us
              : Array.isArray(result.flyer.whyChooseUs) && result.flyer.whyChooseUs.length > 0
                ? result.flyer.whyChooseUs
                : prev.whyChooseUs,
          }),
          productImage: result.png_url || prev.productImage,
          templateVariant: urlVariant || result.flyer?.name || prev.templateVariant,
          templateCategory: urlCategory ||
            (result.template_category as FlyerState["templateCategory"]) ||
            prev.templateCategory,
        }));

        if (result.captions) {
          setCaptions(result.captions.map((c) => ({
            platform: c.platform,
            key: c.platform.toLowerCase() as keyof BackendCaptions,
            text: c.text,
            color: PLATFORM_META.find(p => p.label.toLowerCase() === c.platform.toLowerCase())?.color || "text-zinc-400",
          })));
        }
      } else if (urlVariant) {
        setFlyer(prev => ({
          ...prev,
          templateVariant: urlVariant,
          templateCategory: urlCategory || prev.templateCategory,
        }));
      }
      setLoading(false);
    }

    init();
    return () => { cancelled = true; };
  }, [router, searchParams]);

  // -------- CANVAS SCALE CALCULATION (unchanged) --------
  useLayoutEffect(() => {
    const recalc = () => {
      if (!canvasWrapRef.current) return;
      const rect = canvasWrapRef.current.getBoundingClientRect();
      const pad = 16;
      const availW = Math.max(rect.width - pad * 2, 0);
      const availH = Math.max(rect.height - pad * 2, 0);

      const fmt = SOCIAL_FORMATS.find(f => f.id === activeFormat)!;
      const baseW = fmt.exportW;
      const baseH = fmt.exportH;

      const scaleX = availW / baseW;
      const scaleY = availH / baseH;
      let newScale = Math.min(scaleX, scaleY);
      newScale = Math.min(newScale, 1);
      setScale(newScale);
    };

    recalc();
    const ro = new ResizeObserver(recalc);
    if (canvasWrapRef.current) ro.observe(canvasWrapRef.current);
    window.visualViewport?.addEventListener("resize", recalc);
    return () => {
      ro.disconnect();
      window.visualViewport?.removeEventListener("resize", recalc);
    };
  }, [activeFormat]);

  const handleCanvasClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    setSelectedOverlayId(null);

    if (activeTool !== "text") return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    const id = `ft-${Date.now()}`;
    setFreeTexts(prev => [
      ...prev,
      {
        id,
        text: "New text",
        color: "#ffffff",
        transform: { x, y, scale: 1 },
      },
    ]);
    setSelectedOverlayId(id);
    setActiveTool("select");
    // switch to content tab to show text properties
    setActiveTab("content");
  }, [activeTool]);

  const updateFreeText = useCallback((id: string, updates: Partial<{ text: string; color: string; transform: Transform }>) => {
    setFreeTexts(prev =>
      prev.map(ft => ft.id === id ? { ...ft, ...updates } : ft)
    );
  }, []);

  const deleteFreeText = useCallback((id: string) => {
    setFreeTexts(prev => prev.filter(ft => ft.id !== id));
    if (selectedOverlayId === id) setSelectedOverlayId(null);
  }, [selectedOverlayId]);

  const TOOLS = [
    { id: "select" as Tool, icon: <Pointer size={16} />, label: "Select (V)" },
    { id: "text" as Tool, icon: <Type size={16} />, label: "Add text (T)" },
  ];

  const TABS: { id: RsbTab; icon: React.ReactNode; label: string }[] = [
    { id: "design", icon: <Palette size={16} />, label: "Design" },
    { id: "content", icon: <ListChecks size={16} />, label: "Content" },
    { id: "video", icon: <Video size={16} />, label: "Video" },
    { id: "captions", icon: <MessageSquare size={16} />, label: "Captions" },
  ];

  if (loading) {
    return (
      <div className="h-[100dvh] w-screen bg-zinc-950 flex items-center justify-center
                      text-white font-mono tracking-widest text-sm">
        Loading your flyer...
      </div>
    );
  }

  const currentFormat = SOCIAL_FORMATS.find(f => f.id === activeFormat)!;

  // Determine panel height based on collapsed state and viewport
  const panelHeight = panelCollapsed
    ? "h-[52px]" // header only
    : "h-[70vh]"; // expanded

  // On desktop, we might want to keep it expanded always, but we'll still allow collapse via toggle for consistency.
  // We'll just use the same logic for all screens.

  // -------- RENDER --------
  return (
    <div className="h-[100dvh] w-screen bg-zinc-950 text-zinc-50 font-sans flex flex-col overflow-hidden overscroll-none">

      {/* HEADER */}
      <header className="h-[52px] shrink-0 flex items-center justify-between gap-2 px-2 md:px-4
                         bg-[#111113] border-b border-zinc-800 z-40"
        style={{ paddingTop: "env(safe-area-inset-top)" }}>
        <div className="flex items-center gap-1.5 sm:gap-3 min-w-0">
          <Link href="/dashboard"
            aria-label="Back to dashboard"
            className="w-9 h-9 rounded-full hover:bg-zinc-800 flex items-center justify-center transition-colors shrink-0 touch-manipulation">
            <ArrowLeft size={15} className="text-zinc-500" />
          </Link>
          <div className="flex items-center gap-2 shrink-0">
            <Logo className="w-5 h-5 rounded-md" />
            <span className="hidden sm:inline text-[13px] font-semibold tracking-wide">Editor</span>
          </div>
          <div className="hidden sm:block w-px h-4 bg-zinc-700 shrink-0" />
          <span className="text-[12px] text-zinc-500 truncate min-w-0">
            {flyer.headline || "Untitled flyer"}
          </span>
        </div>
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          <ExportDropdown onExport={exportFlyer} exportingFormat={exportingFormat} />
        </div>
      </header>

      {exportError && (
        <div className="px-4 py-1.5 bg-red-950/40 border-b border-red-900/50">
          <p className="text-red-400 text-[11px]">{exportError}</p>
        </div>
      )}

      {/* MAIN AREA */}
      <div className="flex flex-1 overflow-hidden relative">

        {/* ====== CANVAS ====== */}
        <section className="flex-1 flex flex-col overflow-hidden bg-zinc-950 pb-[52px] md:pb-0">
          <div
            ref={canvasWrapRef}
            className="flex-1 flex items-center justify-center overflow-hidden relative"
            style={{
              backgroundImage: "linear-gradient(45deg,#1a1a1c 25%,transparent 25%),linear-gradient(-45deg,#1a1a1c 25%,transparent 25%),linear-gradient(45deg,transparent 75%,#1a1a1c 75%),linear-gradient(-45deg,transparent 75%,#1a1a1c 75%)",
              backgroundSize: "16px 16px",
              backgroundPosition: "0 0,0 8px,8px -8px,-8px 0",
              cursor: activeTool === "text" ? "crosshair" : "default",
              touchAction: activeTool === "text" ? "manipulation" : "auto",
            }}
            onClick={handleCanvasClick}
          >
            {/* Flyer container – fixed dimensions + transform scale */}
            <div
              key={`flyer-${activeFormat}`}
              ref={flyerNodeRef}
              className="relative shrink-0"
              style={{
                width: currentFormat.exportW,
                height: currentFormat.exportH,
                transform: `scale(${scale ?? 0.001})`,
                opacity: scale === null ? 0 : 1,
                transition: "opacity 120ms ease-out",
                transformOrigin: "center center",
                overflow: "hidden",
                containerType: "size",
                containerName: "flyer-canvas",
                ["--ci" as any]: `${currentFormat.exportW / 100}px`,
                ["--cb" as any]: `${currentFormat.exportH / 100}px`,
              } as React.CSSProperties}
            >
              <TemplateRenderer
                data={{ ...flyer, logoImage: null, badgeText: "" }}
                onUpdate={update}
                onElementFocus={() => {}}
                onElementBlur={() => {}}
                onUpdateFeature={updateFeature}
                onAddFeature={addFeature}
                onRemoveFeature={removeFeature}
                onUpdateWhyChooseUs={updateWhyChooseUs}
                onAddWhyChooseUs={addWhyChooseUs}
                onRemoveWhyChooseUs={removeWhyChooseUs}
              />

              {/* Logo */}
              {logoOverlay.image && (
                <Movable
                  transform={logoOverlay.transform}
                  onChange={(t) => setLogoOverlay(prev => ({ ...prev, transform: t }))}
                  containerRef={flyerNodeRef}
                  selected={selectedOverlayId === "logo"}
                  onSelect={() => setSelectedOverlayId("logo")}
                  onDelete={() => setLogoOverlay(prev => ({ ...prev, image: null }))}
                >
                  <img
                    src={logoOverlay.image}
                    alt="Logo"
                    style={{
                      width: "calc(var(--ci) * 20)",
                      height: "calc(var(--ci) * 20)",
                      objectFit: "contain"
                    }}
                    draggable={false}
                  />
                </Movable>
              )}

              {/* Discount Badge */}
              {badgeOverlay.visible && (
                <Movable
                  transform={badgeOverlay.transform}
                  onChange={(t) => setBadgeOverlay(prev => ({ ...prev, transform: t }))}
                  containerRef={flyerNodeRef}
                  selected={selectedOverlayId === "badge"}
                  onSelect={() => setSelectedOverlayId("badge")}
                  onDelete={() => setBadgeOverlay(prev => ({ ...prev, visible: false }))}
                  dragHandleOnly
                  extra={
                    <div className="absolute top-0 left-full ml-2 p-2 bg-zinc-900 border border-zinc-700 rounded shadow-lg z-50">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-zinc-400">Text</span>
                        <input
                          type="color"
                          value={badgeOverlay.textColor}
                          onChange={(e) => setBadgeOverlay(prev => ({ ...prev, textColor: e.target.value }))}
                          className="w-6 h-6 p-0 border-0"
                        />
                        <span className="text-[10px] text-zinc-400">Bg</span>
                        <input
                          type="color"
                          value={badgeOverlay.bgColor}
                          onChange={(e) => setBadgeOverlay(prev => ({ ...prev, bgColor: e.target.value }))}
                          className="w-6 h-6 p-0 border-0"
                        />
                      </div>
                    </div>
                  }
                >
                  <DiscountBadgeSticker
                    badge={badgeOverlay}
                    onChangeText={(v) => setBadgeOverlay(prev => ({ ...prev, text: v }))}
                    onChangeSubText={(v) => setBadgeOverlay(prev => ({ ...prev, subText: v }))}
                    onFocus={() => setSelectedOverlayId("badge")}
                    onBlur={() => { }}
                  />
                </Movable>
              )}

              {/* Free Text blocks */}
              {freeTexts.map((ft) => (
                <Movable
                  key={ft.id}
                  transform={ft.transform}
                  onChange={(t) =>
                    setFreeTexts(prev =>
                      prev.map(item => (item.id === ft.id ? { ...item, transform: t } : item))
                    )
                  }
                  containerRef={flyerNodeRef}
                  selected={selectedOverlayId === ft.id}
                  onSelect={() => setSelectedOverlayId(ft.id)}
                  onDelete={() => deleteFreeText(ft.id)}
                  dragHandleOnly
                  extra={
                    <div className="absolute top-0 left-full ml-2 p-2 bg-zinc-900 border border-zinc-700 rounded shadow-lg z-50">
                      <input
                        type="color"
                        value={ft.color}
                        onChange={(e) =>
                          setFreeTexts(prev =>
                            prev.map(item =>
                              item.id === ft.id ? { ...item, color: e.target.value } : item
                            )
                          )
                        }
                        className="w-6 h-6 p-0 border-0"
                      />
                    </div>
                  }
                >
                  <Editable
                    id={ft.id}
                    value={ft.text}
                    onChange={(v) =>
                      setFreeTexts(prev =>
                        prev.map(item => (item.id === ft.id ? { ...item, text: v } : item))
                      )
                    }
                    className="text-white font-semibold min-w-[40px]"
                    style={{ color: ft.color }}
                    onFocus={() => setSelectedOverlayId(ft.id)}
                    onBlur={() => { }}
                  />
                </Movable>
              ))}
            </div>

            <AnimatePresence>
              {activeTool === "text" && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-zinc-900/90 border border-zinc-700
                             rounded-full px-4 py-1.5 text-[11px] text-zinc-300 pointer-events-none text-center max-w-[90vw]">
                  Tap anywhere on the flyer to place a text block
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* ====== HIDDEN EXPORT CONTAINER ====== */}
          <div
            aria-hidden="true"
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: currentFormat.exportW,
              height: currentFormat.exportH,
              opacity: 0.01,
              pointerEvents: "none",
              zIndex: -1,
              ["--ci" as any]: `${currentFormat.exportW / 100}px`,
              ["--cb" as any]: `${currentFormat.exportH / 100}px`,
            } as React.CSSProperties}
          >
            <div ref={exportNodeRef} style={{ position: "relative", width: "100%", height: "100%" }}>
              <TemplateRenderer
                data={{ ...flyer, logoImage: null, badgeText: "" }}
                onUpdate={() => {}}
                onElementFocus={() => {}}
                onElementBlur={() => {}}
                onUpdateFeature={() => {}}
                onAddFeature={() => {}}
                onRemoveFeature={() => {}}
                onUpdateWhyChooseUs={() => {}}
                onAddWhyChooseUs={() => {}}
                onRemoveWhyChooseUs={() => {}}
              />

              {logoOverlay.image && (
                <img
                  src={logoOverlay.image}
                  alt="Logo"
                  style={{
                    position: "absolute",
                    left: `${logoOverlay.transform.x}%`,
                    top: `${logoOverlay.transform.y}%`,
                    transform: `translate(-50%, -50%) scale(${logoOverlay.transform.scale})`,
                    width: "calc(var(--ci) * 20)",
                    height: "calc(var(--ci) * 20)",
                    objectFit: "contain",
                  }}
                />
              )}

              {badgeOverlay.visible && (
                <div
                  style={{
                    position: "absolute",
                    left: `${badgeOverlay.transform.x}%`,
                    top: `${badgeOverlay.transform.y}%`,
                    transform: `translate(-50%, -50%) scale(${badgeOverlay.transform.scale})`,
                  }}
                >
                  <DiscountBadgeSticker
                    badge={badgeOverlay}
                    onChangeText={() => {}}
                    onChangeSubText={() => {}}
                  />
                </div>
              )}

              {freeTexts.map(ft => (
                <div
                  key={ft.id}
                  style={{
                    position: "absolute",
                    left: `${ft.transform.x}%`,
                    top: `${ft.transform.y}%`,
                    transform: `translate(-50%, -50%) scale(${ft.transform.scale})`,
                    color: ft.color,
                    fontWeight: 600,
                  }}
                >
                  {ft.text}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ====== RIGHT/BOTTOM SHEET ====== */}
        <aside
          className={`
            fixed md:static inset-x-0 bottom-0 md:inset-auto
            w-full md:w-[265px] shrink-0
            bg-[#111113] border-t md:border-t-0 md:border-l border-zinc-800
            flex flex-col z-30
            transition-[height] duration-200 ease-out
            ${panelCollapsed ? "h-[52px]" : "h-[70vh]"}
            md:h-auto md:flex-1
          `}
          style={{ paddingBottom: panelCollapsed ? 0 : "env(safe-area-inset-bottom)" }}
        >
          {/* ====== SHEET HEADER (tools + tabs + toggle) ====== */}
          <div className="flex items-center border-b border-zinc-800 shrink-0 gap-1 px-2 h-12 md:h-auto">
            {/* Tools */}
            <div className="flex items-center gap-0.5">
              {TOOLS.map(t => (
                <ToolBtn key={t.id} active={activeTool === t.id} label={t.label}
                  onClick={() => setActiveTool(t.id)}>
                  {t.icon}
                </ToolBtn>
              ))}
              <div className="w-px h-6 bg-zinc-800 mx-1" />
            </div>

            {/* Tabs */}
            <div className="flex flex-1">
              {TABS.map(tab => (
                <button key={tab.id} onClick={() => { setActiveTab(tab.id); setPanelCollapsed(false); }}
                  className={`flex-1 py-3 md:py-2.5 text-[10px] font-bold uppercase tracking-wider
                              border-b-2 transition-colors touch-manipulation flex items-center justify-center gap-1.5
                    ${activeTab === tab.id
                      ? "text-white border-white"
                      : "text-zinc-600 border-transparent hover:text-zinc-300"}`}>
                  <span className="md:hidden">{tab.icon}</span>
                  {tab.label}
                  {tab.id === "captions" && captions.length > 0 && (
                    <span className="ml-0.5 inline-flex items-center justify-center w-4 h-4
                                    rounded-full bg-white text-black text-[8px] font-black">
                      {captions.length}
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* Toggle button: collapse/expand */}
            <button
              onClick={() => setPanelCollapsed(v => !v)}
              className="w-9 h-9 rounded-lg flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors touch-manipulation"
              aria-label={panelCollapsed ? "Expand panel" : "Collapse panel"}
            >
              {panelCollapsed ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </button>
          </div>

          {/* ====== PANEL CONTENT (only shown when expanded) ====== */}
          {!panelCollapsed && (
            <div className={`flex-1 overflow-y-auto p-4 overscroll-contain
                            [&::-webkit-scrollbar]:w-1
                            [&::-webkit-scrollbar-thumb]:bg-zinc-700
                            [&::-webkit-scrollbar-track]:bg-transparent`}
              style={{ WebkitOverflowScrolling: "touch" }}>
              <AnimatePresence mode="wait">
                <motion.div key={activeTab}
                  initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }} transition={{ duration: 0.1 }}>
                  {activeTab === "design" && (
                    <DesignPanel
                      data={flyer}
                      onUpdate={update}
                      onLogoUpload={(file) => handleImageUpload(file, "logoImage")}
                      badge={badgeOverlay}
                      onBadgeChange={setBadgeOverlay}
                      activeFormat={activeFormat}
                      setActiveFormat={setActiveFormat}
                    />
                  )}
                  {activeTab === "video" && (
                    <VideoPanel
                      flyer={flyer}
                      activeFormatId={activeFormat}
                      jobId={jobId}
                      logoOverlay={logoOverlay}
                      badgeOverlay={badgeOverlay}
                    />
                  )}
                  {activeTab === "captions" && (
                    <CaptionsPanel captions={captions} />
                  )}
                  {activeTab === "content" && (
                    <ContentPanel
                      data={flyer}
                      onUpdate={update}
                      badge={badgeOverlay}
                      onBadgeChange={setBadgeOverlay}
                      selectedTextId={selectedOverlayId?.startsWith("ft-") ? selectedOverlayId : null}
                      freeTexts={freeTexts}
                      onUpdateFreeText={updateFreeText}
                      onDeleteFreeText={deleteFreeText}
                    />
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}

export default function FlyerEditor() {
  return (
    <Suspense fallback={
      <div className="h-[100dvh] w-screen bg-zinc-950 flex items-center justify-center
                      text-white font-mono tracking-widest text-sm">
        Loading editor...
      </div>
    }>
      <EditorContent />
    </Suspense>
  );
}