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
  ArrowLeft, Download, Palette,
  Video, MessageSquare, Check, Copy, ListChecks,
  GripVertical, X,
  UploadCloud, Film, Square, Smartphone, Monitor, Image as ImageIcon, Loader2,
  ChevronDown,
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
// TEMPLATE RENDERER
// ============================================================================
const TemplateRenderer = memo(function TemplateRenderer({
  data,
  onUpdate,
  onUpdateFeature,
  onAddFeature,
  onRemoveFeature,
  onUpdateWhyChooseUs,
  onAddWhyChooseUs,
  onRemoveWhyChooseUs,
}: {
  data: FlyerState;
  onUpdate: (field: string, value: any) => void;
  onUpdateFeature: (index: number, value: string) => void;
  onAddFeature: () => void;
  onRemoveFeature: (index: number) => void;
  onUpdateWhyChooseUs: (index: number, value: string) => void;
  onAddWhyChooseUs: () => void;
  onRemoveWhyChooseUs: (index: number) => void;
}) {
  const shared = {
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
type RsbTab = "design" | "content" | "video" | "captions";

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
  address: string;
  features: string[];
  whyChooseUs: string[];
  featuresVisible?: boolean;
  whyChooseUsVisible?: boolean;
  phoneVisible: boolean;
  emailVisible: boolean;
  websiteVisible: boolean;
  addressVisible: boolean;
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
type FormatId = typeof SOCIAL_FORMATS[number]["id"];

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
];

// Full 30‑colour swatch set
const COLOR_SWATCHES = [
  "#0a0a0a", "#1c1c1e", "#f5f5f0", "#e8e2d5", "#c0c0c0", "#8c8c8c",
  "#d4af37", "#b08d57", "#e5c07b", "#b76e79",
  "#1a237e", "#283593", "#003153", "#0f4c81", "#4682b4",
  "#014421", "#0b6e4f", "#4a5d43", "#2e4600",
  "#7b1e3a", "#9a2a2a", "#c1440e", "#e07a5f", "#d94f70",
  "#5b2a86", "#6a0572", "#a78bfa",
  "#ffffff", "#111111", "#f4f1ea",
];

// ============================================================================
// EDITABLE COMPONENT (only used for badge)
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
// MOVABLE / OVERLAY (only for logo and badge)
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
          outline: selected ? "2px dashed #22d3ee" : "none",
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
              className="absolute -top-3.5 left-1/2 -translate-x-1/2 w-7 h-7 rounded-full bg-cyan-400
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
            className="absolute -bottom-3 -right-3 w-7 h-7 rounded-full bg-cyan-400 border-2 border-zinc-950
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
      <span className={`w-9 h-5 rounded-full relative transition-colors ${active ? "bg-cyan-400" : "bg-zinc-700"}`}>
        <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all ${active ? "left-[18px]" : "left-0.5"}`} />
      </span>
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
                   text-[16px] text-zinc-100 focus:outline-none focus:border-cyan-500"
      />
    </label>
  );
}

// ======== DesignPanel ========
const DesignPanel = memo(function DesignPanel({
  data,
  onUpdate,
  onLogoUpload,
  badge,
  onBadgeChange,
}: {
  data: FlyerState;
  onUpdate: (k: keyof FlyerState, v: any) => void;
  onLogoUpload: (file: File) => void;
  badge: DiscountBadge;
  onBadgeChange: (b: DiscountBadge) => void;
}) {
  const [colorLayer, setColorLayer] = useState<"bg" | "accent" | "text">("accent");
  const [activeTheme, setActiveTheme] = useState<number | null>(null);

  const applyTheme = (i: number) => {
    setActiveTheme(i);
    const t = TEMPLATE_THEMES[i];
    onUpdate("colors", { primary: t.bg, secondary: t.text, accent: t.accent });
  };

  const applyColor = (hex: string) => {
    const map: Record<"bg" | "accent" | "text", keyof typeof data.colors> = {
      bg: "primary", accent: "accent", text: "secondary",
    };
    onUpdate("colors", { ...data.colors, [map[colorLayer]]: hex });
  };

  const currentLayerColor =
    colorLayer === "bg" ? data.colors.primary :
      colorLayer === "accent" ? data.colors.accent :
        data.colors.secondary;

  return (
    <div className="space-y-5">
      <div>
        <Label>Template theme</Label>
        <div className="grid grid-cols-3 gap-2">
          {TEMPLATE_THEMES.map((t, i) => (
            <button key={t.label} onClick={() => applyTheme(i)}
              className={`h-14 rounded-lg overflow-hidden border-2 relative transition-all text-left touch-manipulation
                ${activeTheme === i ? "border-cyan-400" : "border-transparent hover:border-zinc-600"}`}
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
          {(["bg", "accent", "text"] as const).map(l => (
            <button key={l} onClick={() => setColorLayer(l)}
              className={`flex-1 py-2 rounded-md text-[10px] font-bold uppercase tracking-wider transition-colors touch-manipulation
                ${colorLayer === l ? "bg-cyan-400/20 text-cyan-400" : "text-zinc-500 hover:text-zinc-300"}`}>
              {l === "bg" ? "BG" : l === "accent" ? "Accent" : "Text"}
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
                       text-[16px] md:text-[12px] font-mono text-zinc-200 focus:outline-none focus:border-cyan-500" />
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

// ======== ContentPanel – includes badge controls ========
const ContentPanel = memo(function ContentPanel({
  data, onUpdate, badge, onBadgeChange,
}: {
  data: FlyerState;
  onUpdate: (k: keyof FlyerState, v: any) => void;
  badge: DiscountBadge;
  onBadgeChange: (b: DiscountBadge) => void;
}) {
  return (
    <div className="space-y-5">
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
              className="flex-1 bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-[12px] font-mono text-zinc-200 focus:outline-none focus:border-cyan-500"
              placeholder="#000000"
            />
            <input
              type="text"
              value={badge.bgColor}
              onChange={e => /^#[0-9a-fA-F]{6}$/.test(e.target.value) && onBadgeChange({ ...badge, bgColor: e.target.value })}
              className="flex-1 bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-[12px] font-mono text-zinc-200 focus:outline-none focus:border-cyan-500"
              placeholder="#ffffff"
            />
          </div>
        </div>
      </div>
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
  const playerRef = useRef<PlayerRef>(null);

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
                  ? "border-cyan-400 bg-cyan-950/30 text-cyan-400"
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
          ref={playerRef}
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
            <div className="w-1 h-1 rounded-full bg-cyan-400 shrink-0" />
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
            : "bg-cyan-400 hover:bg-cyan-300 active:scale-[0.98] text-black"
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
        className="px-3 sm:px-4 py-2 sm:py-1.5 rounded-lg text-[12px] font-bold bg-cyan-400
                   hover:bg-cyan-300 disabled:opacity-60 disabled:cursor-not-allowed
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
  address: "",
  features: [],
  whyChooseUs: [],
  featuresVisible: true,
  whyChooseUsVisible: true,
  phoneVisible: true,
  emailVisible: true,
  websiteVisible: true,
  addressVisible: true,
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

// ---------- EXPORT HELPERS (using modern-screenshot) ----------
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

// ---------- Main Editor ----------
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
  const [activeTab, setActiveTab] = useState<RsbTab>("design");
  const [activeFormat, setActiveFormat] = useState<FormatId>("ig");
  const [scale, setScale] = useState(1);
  const [sheetExpanded, setSheetExpanded] = useState(false);

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

  // ---------- EXPORT FLYER (using modern-screenshot) ----------
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
      // Convert all images to data URLs to ensure they render
      imgEls = Array.from(node.querySelectorAll("img"));
      originalSrcs = imgEls.map(img => img.src);

      await Promise.all(
        imgEls.map(async (img, i) => {
          try {
            const dataUrl = await toDataURL(originalSrcs[i]);
            img.src = dataUrl;
            if (img.complete) return;
            await new Promise<void>((resolve) => {
              img.onload = () => resolve();
              img.onerror = () => resolve();
            });
          } catch {
            // keep original
          }
        })
      );

      // Allow paint to settle
      await new Promise(res => requestAnimationFrame(res));
      await new Promise(res => setTimeout(res, 300));

      // Use modern-screenshot – handles oklch without errors
      const { capture } = await import('modern-screenshot');
      const fmt = SOCIAL_FORMATS.find(f => f.id === activeFormat)!;

      const canvas = await capture(node, {
        width: fmt.exportW,
        height: fmt.exportH,
        backgroundColor: '#ffffff',
        scale: 1,
        // @ts-ignore – type definitions may not include all options
        style: {
          transform: 'none', // prevent extra transforms
        },
      });

      let blob: Blob;
      if (format === 'jpg') {
        blob = await new Promise<Blob>((resolve) => {
          canvas.toBlob((b) => resolve(b!), 'image/jpeg', 0.95);
        });
      } else if (format === 'pdf') {
        const { default: jsPDF } = await import('jspdf');
        const dataUrl = canvas.toDataURL('image/png');
        const pdf = new jsPDF({
          orientation: fmt.exportW > fmt.exportH ? "landscape" : "portrait",
          unit: "px",
          format: [fmt.exportW, fmt.exportH],
        });
        pdf.addImage(dataUrl, "PNG", 0, 0, fmt.exportW, fmt.exportH);
        blob = pdf.output("blob");
      } else {
        blob = await new Promise<Blob>((resolve) => {
          canvas.toBlob((b) => resolve(b!), 'image/png');
        });
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

  // ---------- LOAD DATA ----------
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
            address: result.flyer.address ?? prev.address,
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

  // ---------- CANVAS SCALE CALCULATION ----------
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
  }, [activeFormat, sheetExpanded]);

  // ---------- No free-text state or handlers ----------

  const TABS: { id: RsbTab; icon: React.ReactNode; label: string }[] = [
    { id: "design", icon: <Palette size={16} />, label: "Design" },
    { id: "content", icon: <ListChecks size={16} />, label: "Content" },
    { id: "video", icon: <Video size={16} />, label: "Video" },
    { id: "captions", icon: <MessageSquare size={16} />, label: "Captions" },
  ];

  if (loading) {
    return (
      <div className="h-[100dvh] w-screen bg-zinc-950 flex items-center justify-center
                      text-cyan-400 font-mono tracking-widest text-sm">
        Loading your flyer...
      </div>
    );
  }

  const currentFormat = SOCIAL_FORMATS.find(f => f.id === activeFormat)!;

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

        {/* CANVAS */}
        <section className="flex-1 flex flex-col overflow-hidden bg-zinc-950 pb-[52px] md:pb-0">
          <div
            ref={canvasWrapRef}
            className="flex-1 flex items-center justify-center overflow-hidden relative"
            style={{
              backgroundImage: "linear-gradient(45deg,#1a1a1c 25%,transparent 25%),linear-gradient(-45deg,#1a1a1c 25%,transparent 25%),linear-gradient(45deg,transparent 75%,#1a1a1c 75%),linear-gradient(-45deg,transparent 75%,#1a1a1c 75%)",
              backgroundSize: "16px 16px",
              backgroundPosition: "0 0,0 8px,8px -8px,-8px 0",
              cursor: "default",
            }}
          >
            {/* Flyer container */}
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
            </div>
          </div>

          {/* Hidden export clone – opacity:0, pointer-events:none */}
          <div
            aria-hidden="true"
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: currentFormat.exportW,
              height: currentFormat.exportH,
              opacity: 0,
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
            </div>
          </div>
        </section>

        {/* BOTTOM PANEL – with format selector at the top */}
        <aside
          className={`
            fixed md:static inset-x-0 bottom-0 md:inset-auto
            w-full md:w-[265px] shrink-0
            bg-[#111113] border-t md:border-t-0 md:border-l border-zinc-800
            flex flex-col z-30
            transition-[height] duration-200 ease-out
            ${sheetExpanded ? "h-[70vh]" : "h-[128px]"}
            md:h-auto md:flex-1
          `}
          style={{ paddingBottom: sheetExpanded ? 0 : "env(safe-area-inset-bottom)" }}
        >
          {/* Mobile handle */}
          <div className="md:hidden flex flex-col items-center pt-2 pb-1.5 shrink-0"
            onClick={() => setSheetExpanded(v => !v)}>
            <div className="w-9 h-1 rounded-full bg-zinc-700 mb-2" />
            <span className="text-[10px] text-zinc-500 uppercase tracking-wider font-bold">
              {sheetExpanded ? "Drag down to collapse" : "Drag up for more"}
            </span>
          </div>

          {/* Format selector – always visible */}
          <div className="border-b border-zinc-800 px-3 py-2 shrink-0 overflow-x-auto [&::-webkit-scrollbar]:hidden">
            <div className="flex gap-1.5 items-center justify-start">
              <span className="text-[10px] text-zinc-600 font-bold uppercase tracking-wider mr-1 shrink-0">Format</span>
              {SOCIAL_FORMATS.map(f => {
                const Icon = f.icon;
                return (
                  <button key={f.id} onClick={() => setActiveFormat(f.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-semibold
                                border transition-all shrink-0 touch-manipulation
                      ${activeFormat === f.id
                        ? "border-cyan-400 bg-cyan-400/10 text-cyan-400"
                        : "border-zinc-800 text-zinc-500 hover:border-zinc-600 hover:text-zinc-300"}`}>
                    <Icon size={11} />
                    {f.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Tabs row */}
          <div className="flex border-b border-zinc-800 shrink-0">
            {TABS.map(tab => (
              <button key={tab.id} onClick={() => { setActiveTab(tab.id); setSheetExpanded(true); }}
                className={`flex-1 py-3 md:py-2.5 text-[10px] font-bold uppercase tracking-wider
                            border-b-2 transition-colors touch-manipulation flex items-center justify-center gap-1.5
                  ${activeTab === tab.id
                    ? "text-cyan-400 border-cyan-400"
                    : "text-zinc-600 border-transparent hover:text-zinc-300"}`}>
                <span className="md:hidden">{tab.icon}</span>
                {tab.label}
                {tab.id === "captions" && captions.length > 0 && (
                  <span className="ml-0.5 inline-flex items-center justify-center w-4 h-4
                                  rounded-full bg-cyan-400 text-black text-[8px] font-black">
                    {captions.length}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Panel content */}
          <div className={`flex-1 overflow-y-auto p-4 overscroll-contain
                          [&::-webkit-scrollbar]:w-1
                          [&::-webkit-scrollbar-thumb]:bg-zinc-700
                          [&::-webkit-scrollbar-track]:bg-transparent
                          ${sheetExpanded ? "" : "hidden md:block"}`}
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
                  />
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </aside>
      </div>
    </div>
  );
}

export default function FlyerEditor() {
  return (
    <Suspense fallback={
      <div className="h-[100dvh] w-screen bg-zinc-950 flex items-center justify-center
                      text-cyan-400 font-mono tracking-widest text-sm">
        Loading editor...
      </div>
    }>
      <EditorContent />
    </Suspense>
  );
}