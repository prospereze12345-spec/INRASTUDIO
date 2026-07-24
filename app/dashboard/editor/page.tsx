"use client";
import {
  useState, useEffect, useRef, useCallback, Suspense, memo,
} from "react";
import type { PromoVideoProps } from "@/remotion/PromoVideo";
import dynamic from "next/dynamic";

import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import {
  ArrowLeft, Download, Pointer, Type, Palette,
  Video, MessageSquare, Check, Copy, Bold, Italic,
  AlignLeft, AlignCenter, AlignRight, Plus, Minus, Package,
  UploadCloud, Film, Square, Smartphone, Monitor, Image as ImageIcon, Loader2,
} from "lucide-react";

import type { PlayerRef } from "@remotion/player";
import { loadJobResult, fetchJobById } from "@/lib/campaign-api";
import { Logo } from "@/components/Logo";

// ─── Heavy / non-critical deps are code-split ─────────────────────────────────
const Player = dynamic(
  () => import("@remotion/player").then(m => m.Player),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full flex items-center justify-center text-zinc-600 text-[11px]">
        Loading preview…
      </div>
    ),
  },
);

const PromoVideo = dynamic<PromoVideoProps>(
  () => import("@/remotion/PromoVideo").then(m => m.PromoVideo),
  { ssr: false },
);

// ─── Types ────────────────────────────────────────────────────────────────────
import { LuxuryProductTemplate } from "@/components/templates/LuxuryProduct";
import { SalePromotionTemplate } from "@/components/templates/SalePromotion";
import { SleekFlyerTemplate as MinimalProductTemplate } from "@/components/templates/MinimalProduct";
import { PremiumBrandTemplate } from "@/components/templates/PremiumBrand";

const TemplateRenderer = memo(function TemplateRenderer({
  data, onUpdate, onElementFocus, onElementBlur,
}: {
  data: FlyerState;
  onUpdate: (k: keyof FlyerState, v: any) => void;
  onElementFocus: (el: HTMLElement) => void;
  onElementBlur: () => void;
}) {
  const onFieldUpdate = (field: string, value: string) => {
    onUpdate(field as keyof FlyerState, value);
  };

  const shared = {
    name: data.templateVariant,
    headline: data.headline,
    ctaText: data.ctaText,
    productImage: data.productImage,
    brandName: data.brandName,
    website: data.website,
    price: data.price,
    colors: data.colors,
    editable: true,
    onUpdate: onFieldUpdate,
    onFocusEl: onElementFocus,
    onBlurEl: onElementBlur,
  } as const;

  switch (data.templateCategory) {
    case "Luxury Product":
      return <LuxuryProductTemplate {...shared} subtext={data.subtext} />;
    case "Sale Promotion":
      // Hide template badge – we use overlay
      return <SalePromotionTemplate {...shared} subtext={data.subtext} badgeText="" />;
    case "Minimal Product":
      return <MinimalProductTemplate {...shared} subheadline={data.subtext} badge="" />;
    case "Premium Brand":
      return <PremiumBrandTemplate {...shared} subtext={data.subtext} badgeText="" />;
    default:
      return null;
  }
});

type RsbTab     = "design" | "video" | "captions";
type Tool       = "select" | "text";
type ColorLayer = "bg" | "accent" | "text";

type BackendCaptions = {
  instagram?: string;
  facebook?:  string;
  whatsapp?:  string;
  tiktok?:    string;
  twitter?:   string;
};

type Caption = {
  platform: string;
  key:      keyof BackendCaptions;
  text:     string;
  color:    string;
};

type FlyerState = {
  headline:         string;
  subtext:          string;
  ctaText:          string;
  badgeText:        string; // kept for compatibility
  price:            string;
  brandName:        string;
  website:          string;
  productImage:     string;
  logoImage:        string | null;
  templateVariant:  string;
  templateCategory: "Luxury Product" | "Sale Promotion" | "Minimal Product" | "Premium Brand";
  colors:           { primary: string; secondary: string; accent: string };
};

type CanvasSize = { w: number; h: number };

// ─── Social format definitions ────────────────────────────────────────────────
const SOCIAL_FORMATS = [
  { id: "ig",     label: "Instagram", icon: ImageIcon,    ratio: "4:5",  rw: 4,  rh: 5,  fps: 30, durationS: 12 },
  { id: "square", label: "Square",    icon: Square,       ratio: "1:1",  rw: 1,  rh: 1,  fps: 30, durationS: 12 },
  { id: "story",  label: "Story",     icon: Smartphone,   ratio: "9:16", rw: 9,  rh: 16, fps: 30, durationS: 15 },
  { id: "yt",     label: "YouTube",   icon: Monitor,      ratio: "16:9", rw: 16, rh: 9,  fps: 30, durationS: 15 },
  { id: "tiktok", label: "TikTok",    icon: Film,         ratio: "9:16", rw: 9,  rh: 16, fps: 30, durationS: 12 },
  { id: "banner", label: "Banner",    icon: Monitor,      ratio: "21:9", rw: 21, rh: 9,  fps: 30, durationS: 10 },
] as const;
type FormatId = typeof SOCIAL_FORMATS[number]["id"];



function calcCanvasSize(
  formatId: FormatId,
  maxW: number,
  maxH: number,
): CanvasSize {
  const fmt = SOCIAL_FORMATS.find(f => f.id === formatId)!;
  const aspect = fmt.rw / fmt.rh;
  let w = Math.max(maxW, 0);
  let h = Math.round(w / aspect);
  if (h > maxH) { h = Math.max(maxH, 0); w = Math.round(h * aspect); }
  return { w, h };
}


// ─── Caption platform metadata ────────────────────────────────────────────────
const PLATFORM_META: { key: keyof BackendCaptions; label: string; color: string }[] = [
  { key: "instagram", label: "Instagram", color: "text-pink-400"    },
  { key: "tiktok",    label: "TikTok",    color: "text-purple-400"  },
  { key: "twitter",   label: "Twitter/X", color: "text-sky-400"     },
  { key: "facebook",  label: "Facebook",  color: "text-blue-400"    },
  { key: "whatsapp",  label: "WhatsApp",  color: "text-emerald-400" },
];

function parseCaptions(raw: BackendCaptions | null | undefined): Caption[] {
  if (!raw) return [];
  return PLATFORM_META
    .filter(p => !!raw[p.key])
    .map(p => ({
      platform: p.label,
      key:      p.key,
      text:     raw[p.key]!,
      color:    p.color,
    }));
}

const MARKETING_FONTS = [
  { label: "Inter",            value: "var(--font-inter), sans-serif" },
  { label: "Bebas Neue",       value: "var(--font-bebas), sans-serif" },
  { label: "Playfair Display", value: "var(--font-playfair), serif" },
  { label: "Poppins",          value: "var(--font-poppins), sans-serif" },
  { label: "Archivo Black",    value: "var(--font-archivo), sans-serif" },
];

// ─── Template themes ──────────────────────────────────────────────────────────
const TEMPLATE_THEMES = [
  { label: "Gold",      bg: "#0a0a0a", accent: "#c9a84c", text: "#ffffff" },
  { label: "Violet",    bg: "#0f0a1e", accent: "#a78bfa", text: "#ffffff" },
  { label: "Emerald",   bg: "#022c22", accent: "#6ee7b7", text: "#ffffff" },
  { label: "Rouge",     bg: "#1a0000", accent: "#fca5a5", text: "#ffffff" },
  { label: "Ivory",     bg: "#f5f0e8", accent: "#1c1917", text: "#1c1917" },
  { label: "Ocean",     bg: "#0a1929", accent: "#38bdf8", text: "#ffffff" },
  { label: "Slate",     bg: "#1d1d1f", accent: "#0071e3", text: "#f5f5f7" },
  { label: "Paper",     bg: "#fafafa", accent: "#111111", text: "#111111" },
  { label: "Terracotta",bg: "#2b1810", accent: "#e07a5f", text: "#f4ede4" },
  { label: "Sage",      bg: "#f0f2ea", accent: "#4a5d43", text: "#1f2417" },
];

const COLOR_SWATCHES = [
  "#000000", "#1d1d1f", "#ffffff", "#f5f5f7", "#78716c", "#64748b",
  "#0071e3", "#4285f4", "#ea4335", "#fbbc05", "#34a853", "#ff3b30",
  "#ff0000", "#f97316", "#eab308", "#22c55e", "#06b6d4", "#3b82f6", "#8b5cf6", "#ec4899",
  "#e07a5f", "#c9a84c", "#4a5d43", "#a78bfa", "#fca5a5",
];

// ════════════════════════════════════════════════════════════════════════════
//  EDITABLE — inline contenteditable
// ════════════════════════════════════════════════════════════════════════════
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

// ════════════════════════════════════════════════════════════════════════════
//  MOVABLE — drag + resize for overlays
// ════════════════════════════════════════════════════════════════════════════
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
  const dragRef   = useRef<{ startX: number; startY: number; origX: number; origY: number } | null>(null);
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
    const cy = rect.top  + (transform.y / 100) * rect.height;
    resizeRef.current = { startDist: Math.max(1, Math.hypot(e.clientX - cx, e.clientY - cy)), origScale: transform.scale };
  };

  const onPointerMove = (e: React.PointerEvent) => {
    const rect = rectOf();
    if (!rect) return;
    if (dragRef.current) {
      const dxPct = ((e.clientX - dragRef.current.startX) / rect.width)  * 100;
      const dyPct = ((e.clientY - dragRef.current.startY) / rect.height) * 100;
      onChange({
        ...transform,
        x: clamp(dragRef.current.origX + dxPct, 0, 100),
        y: clamp(dragRef.current.origY + dyPct, 0, 100),
      });
    } else if (resizeRef.current) {
      const cx = rect.left + (transform.x / 100) * rect.width;
      const cy = rect.top  + (transform.y / 100) * rect.height;
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
              ⠿
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
              ✕
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

// ════════════════════════════════════════════════════════════════════════════
//  DISCOUNT BADGE — sunburst sticker
// ════════════════════════════════════════════════════════════════════════════
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
  const SIZE = 116;
  return (
    <div style={{ width: SIZE, height: SIZE, position: "relative" }}>
      <div style={{
        position: "absolute", inset: 0, background: badge.bgColor,
        clipPath: BURST_CLIP_PATH, transform: "rotate(-10deg)",
        boxShadow: "0 12px 26px rgba(0,0,0,0.35)",
      }}/>
      <div style={{
        position: "absolute", inset: 7, border: `2px dashed ${badge.textColor}50`,
        clipPath: BURST_CLIP_PATH, transform: "rotate(-10deg)",
      }}/>
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
            fontWeight: 900, fontSize: 24, lineHeight: 1, letterSpacing: "-0.03em",
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
            fontWeight: 800, fontSize: 12, letterSpacing: "0.12em",
            color: badge.textColor, opacity: 0.85, minWidth: 10,
          }}
        />
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
//  FLOATING TEXT TOOLBAR (unchanged)
// ════════════════════════════════════════════════════════════════════════════
function FloatingTextToolbar({ onClose }: { onClose: () => void }) {
  const [bold,   setBold]   = useState(false);
  const [italic, setItalic] = useState(false);
  const [align,  setAlign]  = useState<"left" | "center" | "right">("left");
  const [size,   setSize]   = useState(16);
  const colorRef = useRef<HTMLInputElement>(null);

  const exec = (cmd: string, val?: string) => {
    document.execCommand(cmd, false, val);
    setBold(document.queryCommandState("bold"));
    setItalic(document.queryCommandState("italic"));
  };

  const nudge = (d: number) => {
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0) return;
    const el = sel.getRangeAt(0).commonAncestorContainer.parentElement;
    if (!el) return;
    const cur = parseFloat(getComputedStyle(el).fontSize) || 16;
    const next = Math.max(8, Math.min(96, cur + d * 2));
    el.style.fontSize = `${next}px`;
    setSize(Math.round(next));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 4, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 4, scale: 0.97 }}
      transition={{ duration: 0.1 }}
      className="fixed inset-x-2 bottom-[120px] z-50 flex flex-wrap items-center justify-center gap-1 px-2 py-2
                 rounded-xl border border-zinc-700 bg-zinc-900/95 backdrop-blur-md shadow-2xl
                 md:absolute md:inset-x-auto md:bottom-auto md:-top-12 md:left-0 md:flex-nowrap md:justify-start md:gap-0.5 md:px-2 md:py-1.5"
      onMouseDown={e => e.preventDefault()}
    >
      {[
        { icon: <Bold size={12}/>,   active: bold,            cmd: () => exec("bold")         },
        { icon: <Italic size={12}/>, active: italic,          cmd: () => exec("italic")       },
      ].map((b, i) => (
        <FtbBtn key={i} active={b.active} onClick={b.cmd}>{b.icon}</FtbBtn>
      ))}
      <FtbSep/>
      <FtbBtn onClick={() => nudge(-1)}><Minus size={10}/></FtbBtn>
      <span className="text-[11px] font-mono text-zinc-300 w-6 text-center">{size}</span>
      <FtbBtn onClick={() => nudge(1)}><Plus  size={10}/></FtbBtn>
      <FtbSep/>
      {(["left","center","right"] as const).map(a => (
        <FtbBtn key={a} active={align===a} onClick={() => { setAlign(a); exec(`justify${a.charAt(0).toUpperCase()+a.slice(1)}`); }}>
          {a==="left"?<AlignLeft size={11}/>:a==="center"?<AlignCenter size={11}/>:<AlignRight size={11}/>}
        </FtbBtn>
      ))}
      <FtbSep/>
      <div
        className="w-6 h-6 md:w-4 md:h-4 rounded cursor-pointer border border-zinc-600 hover:scale-110 transition-transform shrink-0"
        style={{ background: "#ffffff" }}
        onClick={() => colorRef.current?.click()}
        title="Text color"
      />
      <input ref={colorRef} type="color" defaultValue="#ffffff" className="sr-only"
        onChange={e => exec("foreColor", e.target.value)}/>
      <FtbSep/>
      <div className="flex items-center gap-0.5 flex-wrap justify-center">
        {MARKETING_FONTS.map(f => (
          <button
            key={f.label}
            onMouseDown={e => e.preventDefault()}
            onClick={() => exec("fontName", f.value)}
            title={f.label}
            style={{ fontFamily: f.value }}
            className="w-7 h-7 md:w-6 md:h-6 flex items-center justify-center rounded-md text-[11px]
                       text-zinc-300 hover:bg-zinc-700 hover:text-white transition-colors touch-manipulation"
          >
            Aa
          </button>
        ))}
      </div>
      <button
        onMouseDown={e => e.preventDefault()}
        onClick={onClose}
        className="md:hidden ml-1 w-7 h-7 flex items-center justify-center rounded-md text-zinc-400
                   hover:bg-zinc-700 hover:text-white transition-colors touch-manipulation"
        title="Close"
      >
        ✕
      </button>
    </motion.div>
  );
}

function FtbBtn({ children, active, onClick }: { children: React.ReactNode; active?: boolean; onClick?: () => void }) {
  return (
    <button onMouseDown={e => { e.preventDefault(); onClick?.(); }}
      className={`w-7 h-7 md:w-6 md:h-6 flex items-center justify-center rounded-md transition-colors shrink-0 touch-manipulation
        ${active ? "bg-cyan-400/20 text-cyan-400" : "text-zinc-400 hover:bg-zinc-700 hover:text-zinc-200"}`}>
      {children}
    </button>
  );
}
function FtbSep() { return <div className="w-px h-4 bg-zinc-700 mx-0.5 shrink-0"/>; }

// ════════════════════════════════════════════════════════════════════════════
//  RIGHT SIDEBAR PANELS
// ════════════════════════════════════════════════════════════════════════════

const DesignPanel = memo(function DesignPanel({ data, onUpdate, onLogoUpload, badge, onBadgeChange }: {
  data: FlyerState;
  onUpdate: (k: keyof FlyerState, v: any) => void;
  onLogoUpload: (file: File) => void;
  badge: DiscountBadge;
  onBadgeChange: (b: DiscountBadge) => void;
}) {
  const [colorLayer, setColorLayer] = useState<ColorLayer>("accent");
  const [activeTheme, setActiveTheme] = useState<number | null>(null);

  const applyTheme = (i: number) => {
    setActiveTheme(i);
    const t = TEMPLATE_THEMES[i];
    onUpdate("colors", { primary: t.bg, secondary: t.text, accent: t.accent });
  };

  const applyColor = (hex: string) => {
    const map: Record<ColorLayer, keyof typeof data.colors> = {
      bg: "primary", accent: "accent", text: "secondary",
    };
    onUpdate("colors", { ...data.colors, [map[colorLayer]]: hex });
  };

  const currentLayerColor =
    colorLayer === "bg"     ? data.colors.primary   :
    colorLayer === "accent" ? data.colors.accent     :
    data.colors.secondary;

  return (
    <div className="space-y-5">
      <div>
        <Label>Template theme</Label>
        <div className="grid grid-cols-3 gap-2">
          {TEMPLATE_THEMES.map((t, i) => (
            <button key={t.label} onClick={() => applyTheme(i)}
              className={`h-14 rounded-lg overflow-hidden border-2 relative transition-all text-left touch-manipulation
                ${activeTheme===i ? "border-cyan-400" : "border-transparent hover:border-zinc-600"}`}
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

      <Divider/>

      <div>
        <Label>Brand colors</Label>
        <div className="flex bg-zinc-900 rounded-lg p-0.5 gap-0.5 mb-3">
          {(["bg","accent","text"] as ColorLayer[]).map(l => (
            <button key={l} onClick={() => setColorLayer(l)}
              className={`flex-1 py-2 rounded-md text-[10px] font-bold uppercase tracking-wider transition-colors touch-manipulation
                ${colorLayer===l ? "bg-cyan-400/20 text-cyan-400" : "text-zinc-500 hover:text-zinc-300"}`}>
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
              }}/>
          ))}
        </div>
        <div className="flex gap-2 items-center">
          <input type="color" value={currentLayerColor}
            onChange={e => applyColor(e.target.value)}
            className="w-10 h-10 rounded-lg cursor-pointer border border-zinc-700 bg-zinc-900 p-1 shrink-0"/>
          <input type="text" value={currentLayerColor}
            inputMode="text"
            onChange={e => /^#[0-9a-fA-F]{6}$/.test(e.target.value) && applyColor(e.target.value)}
            className="flex-1 bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2.5
                       text-[16px] md:text-[12px] font-mono text-zinc-200 focus:outline-none focus:border-cyan-500"/>
        </div>
      </div>

      <Divider/>

      {/* Logo Upload */}
      <div>
        <Label>Logo</Label>
        <label className="flex flex-col items-center gap-1.5 border-[1.5px] border-dashed border-zinc-700
                          rounded-xl p-4 cursor-pointer hover:border-zinc-500 hover:bg-zinc-900/50 transition-all touch-manipulation">
          <UploadCloud size={18} className="text-zinc-500"/>
          <span className="text-[11px] text-zinc-500 text-center">Upload logo — PNG recommended</span>
          <input type="file" accept="image/*" className="hidden"
            onChange={e => { const f = e.target.files?.[0]; if(f) onLogoUpload(f); }}/>
        </label>
      </div>

      <Divider/>


    </div>
  );
});

// ── Video panel — updated to accept overlays ───────────────────────────────
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
  const playerRef = useRef<PlayerRef>(null);

  const fmt = SOCIAL_FORMATS.find(f => f.id === selectedFormat)!;
  const BASE = 1080;
  const isWide = fmt.rw >= fmt.rh;
  const COMP_W = isWide ? BASE : Math.round(BASE * (fmt.rw / fmt.rh));
  const COMP_H = isWide ? Math.round(BASE * (fmt.rh / fmt.rw)) : BASE;
  const durationInFrames = fmt.fps * fmt.durationS;

  // Extended promo props – include overlays
  const promoProps = {
    headline:     flyer.headline,
    subtext:      flyer.subtext,
    ctaText:      flyer.ctaText,
    price:        flyer.price,
    brandName:    flyer.brandName,
    website:      flyer.website,
    productImage: flyer.productImage,
    colors:       flyer.colors,
    logoImage:    logoOverlay.image,
    badge:        badgeOverlay.visible ? badgeOverlay : null,
  };

  const handleDownload = async () => {
    if (downloading) return;
    setDownloading(true);
    setDownloadError(null);

    try {
      const [{ renderMediaOnWeb }, { PromoVideo: PromoVideoComp }] = await Promise.all([
        import("@remotion/web-renderer"),
        import("@/remotion/PromoVideo"),
      ]);

      const { getBlob } = await renderMediaOnWeb({
        composition: {
          id: "PromoVideo",
          component: PromoVideoComp,
          width: COMP_W,
          height: COMP_H,
          fps: fmt.fps,
          durationInFrames,
          defaultProps: promoProps,
        } as const,
        inputProps: promoProps,
        container: "mp4",
        videoCodec: "h264",
        videoBitrate: "high",
        onProgress: ({ progress }) => {},
      });

      const blob = await getBlob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `promo-${selectedFormat}.mp4`;
      a.click();
      URL.revokeObjectURL(url);
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
                ${selectedFormat===f.id
                  ? "border-cyan-400 bg-cyan-950/30 text-cyan-400"
                  : "border-zinc-800 text-zinc-500 hover:border-zinc-600 hover:text-zinc-300"}`}>
              <Icon size={14} className="mx-auto mb-1"/>
              <div className="text-[9px] font-bold leading-none">{f.label}</div>
              <div className="text-[8px] text-zinc-600 mt-0.5">{f.ratio}</div>
            </button>
          );
        })}
      </div>

      <Divider/>

      <Label>Preview ({fmt.durationS}s promo)</Label>
      <div className="rounded-xl overflow-hidden border border-zinc-800 bg-zinc-950"
        style={{ aspectRatio: `${fmt.rw}/${fmt.rh}`, maxHeight: 260 }}>
        <Player
          ref={playerRef}
          component={PromoVideo}
          inputProps={promoProps}
          durationInFrames={durationInFrames}
          compositionWidth={COMP_W}
          compositionHeight={COMP_H}
          fps={fmt.fps}
          style={{ width: "100%", height: "100%" }}
          controls
          loop
          autoPlay
        />
      </div>

      <Divider/>

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
            <div className="w-1 h-1 rounded-full bg-cyan-400 shrink-0"/>
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
          ${
            downloading
              ? "bg-zinc-700 text-zinc-400 cursor-not-allowed"
              : "bg-cyan-400 hover:bg-cyan-300 active:scale-[0.98] text-black"
          }`}
      >
        {downloading ? (
          <>
            <div className="w-4 h-4 border-2 border-transparent border-t-black border-r-black rounded-full animate-spin" />
            <span>Rendering video...</span>
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

// ── Captions panel (unchanged) ─────────────────────────────────────────────
const CaptionsPanel = memo(function CaptionsPanel({ captions }: { captions: Caption[] }) {
  const [copied, setCopied] = useState<string | null>(null);

  const copy = (platform: string, text: string) => {
    navigator.clipboard.writeText(text).catch(() => {});
    setCopied(platform);
    setTimeout(() => setCopied(null), 2000);
  };

  if (captions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 gap-3
                      border border-dashed border-zinc-800 rounded-xl">
        <MessageSquare size={24} className="text-zinc-600"/>
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
                ? <><Check size={10}/> Copied</>
                : <><Copy  size={10}/> Copy</>
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

// ─── Shared primitives ────────────────────────────────────────────────────────
function Label({ children }: { children: React.ReactNode }) {
  return <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-2">{children}</p>;
}
function Divider() { return <div className="h-px bg-zinc-800"/>; }
function ToolBtn({ children, active, label, onClick }: {
  children: React.ReactNode; active?: boolean; label: string;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}) {
  return (
    <button onClick={onClick} title={label} aria-label={label}
      className={`w-11 h-11 md:w-9 md:h-9 rounded-lg flex items-center justify-center transition-colors touch-manipulation
        ${active
          ? "bg-cyan-400 text-black"
          : "text-zinc-500 hover:bg-zinc-800 hover:text-zinc-200"}`}>
      {children}
    </button>
  );
}

// ════════════════════════════════════════════════════════════════════════════
//  MAIN EDITOR CONTENT
// ════════════════════════════════════════════════════════════════════════════
const EMPTY_FLYER_STATE: FlyerState = {
  headline:         "",
  subtext:          "",
  ctaText:          "",
  badgeText:        "",
  price:            "",
  brandName:        "",
  website:          "",
  productImage:     "",
  logoImage:        null,
  templateVariant:  "",
  templateCategory: "Premium Brand",
  colors: { primary: "#0a0a0a", secondary: "#ffffff", accent: "#c9a84c" },
};

const VALID_CATEGORIES: FlyerState["templateCategory"][] = [
  "Luxury Product", "Sale Promotion", "Minimal Product", "Premium Brand",
];

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
  const [flyer,   setFlyer]   = useState<FlyerState>(EMPTY_FLYER_STATE);
  const [loading, setLoading] = useState(true);
  const flyerNodeRef = useRef<HTMLDivElement>(null);
  const [jobId,           setJobId]           = useState<string | null>(null);
  const [exportError,     setExportError]     = useState<string | null>(null);
  const [captions,        setCaptions]        = useState<Caption[]>([]);
  const [activeTab,       setActiveTab]       = useState<RsbTab>("design");
  const [activeTool,      setActiveTool]      = useState<Tool>("select");
  const [activeFormat,    setActiveFormat]    = useState<FormatId>("ig");
  const [canvasSize,      setCanvasSize]      = useState<CanvasSize>({ w: 380, h: 475 });
  const [focusedEl,       setFocusedEl]       = useState<HTMLElement | null>(null);
  const [showFtb,         setShowFtb]         = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [sheetExpanded, setSheetExpanded] = useState(false);

  // ─── Overlay states ────────────────────────────────────────────────────
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

  // ─── Update functions ──────────────────────────────────────────────────
  const update = useCallback((k: keyof FlyerState, v: any) => {
    setFlyer(prev => ({ ...prev, [k]: v }));
  }, []);

  const [pendingUploads, setPendingUploads] = useState(0);

  // Handle image upload – for logo, set overlay; for product, update flyer
  const handleImageUpload = useCallback(
    async (file: File, field: "productImage" | "logoImage") => {
      if (!file) return;
      const blobUrl = URL.createObjectURL(file);
      if (field === "logoImage") {
        setLogoOverlay(prev => ({ ...prev, image: blobUrl }));
        // Hide template logo
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

  // ─── Export logic ──────────────────────────────────────────────────────
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [exportingFormat, setExportingFormat] = useState<"png" | "jpg" | "pdf" | null>(null);

  const handleExportFlyer = async (format: "png" | "jpg" | "pdf") => {
    if (!flyerNodeRef.current) return;
    if (pendingUploads > 0) {
      return setExportError("Still uploading your image — please wait a moment and try again.");
    }

    setExportingFormat(format);
    setExportError(null);
    setShowExportMenu(false);

    try {
      const { toPng, toJpeg } = await import("html-to-image");
      const snapshotOpts = { pixelRatio: 3, cacheBust: true };

      if (format === "png" || format === "jpg") {
        const dataUrl = format === "png"
          ? await toPng(flyerNodeRef.current, snapshotOpts)
          : await toJpeg(flyerNodeRef.current, { ...snapshotOpts, quality: 0.95, backgroundColor: "#ffffff" });

        const a = document.createElement("a");
        a.href = dataUrl;
        a.download = `flyer-${Date.now()}.${format}`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        return;
      }

      // PDF
      const [{ default: jsPDF }, dataUrl] = await Promise.all([
        import("jspdf"),
        toPng(flyerNodeRef.current, snapshotOpts),
      ]);
      const img = new Image();
      img.src = dataUrl;
      await new Promise((res, rej) => { img.onload = res; img.onerror = rej; });

      const pdf = new jsPDF({
        orientation: img.width >= img.height ? "landscape" : "portrait",
        unit: "px",
        format: [img.width, img.height],
      });
      pdf.addImage(dataUrl, "PNG", 0, 0, img.width, img.height);
      pdf.save(`flyer-${Date.now()}.pdf`);

    } catch (err) {
      console.error(err);
      setExportError(
        err instanceof Error
          ? `${err.message} — this is usually a CORS issue with your product image.`
          : "Export failed."
      );
    } finally {
      setExportingFormat(null);
    }
  };
// ─── Load initial data ────────────────────────────────────────────────
useEffect(() => {
  let cancelled = false;

  async function init() {
    const urlJobId    = searchParams.get("job");
    const urlVariant  = searchParams.get("variant");
    const rawCategory = searchParams.get("category");
    const urlCategory = VALID_CATEGORIES.includes(rawCategory as any)
      ? (rawCategory as FlyerState["templateCategory"])
      : null;

    let result = loadJobResult();

    // Cache miss (e.g. opened from Recent Campaigns in a new/different session)
    // — go fetch it directly from the backend using the job id in the URL.
    if (!result && urlJobId) {
      try {
        result = await fetchJobById(urlJobId);
      } catch (err) {
        console.error("Failed to load job", urlJobId, err);
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
          headline:   result.flyer.headline    || prev.headline,
          subtext:    result.flyer.subheadline || result.flyer.subtext || prev.subtext,
          ctaText:    result.flyer.cta         || result.flyer.ctaText || prev.ctaText,
          badgeText:  result.flyer.badgeText   || prev.badgeText,
          brandName:  result.flyer.brand_name  || result.flyer.brandName || prev.brandName,
          price:      result.flyer.price_text  || prev.price,
          colors:     result.flyer.colors      || prev.colors,
        }),
        productImage: result.png_url || prev.productImage,
        templateVariant:  urlVariant  || result.flyer?.name || prev.templateVariant,
        templateCategory: urlCategory || (result.template_category as FlyerState["templateCategory"]) || prev.templateCategory,
      }));

      if (result.captions) {
        setCaptions(result.captions.map((c) => ({
          platform: c.platform,
          key:      c.platform.toLowerCase() as keyof BackendCaptions,
          text:     c.text,
          color:    PLATFORM_META.find(p => p.label.toLowerCase() === c.platform.toLowerCase())?.color || "text-zinc-400",
        })));
      }
    } else if (urlVariant) {
      setFlyer(prev => ({
        ...prev,
        templateVariant:  urlVariant,
        templateCategory: urlCategory || prev.templateCategory,
      }));
    }

    setLoading(false);
  }

  init();
  return () => { cancelled = true; };
}, [router, searchParams]);


  // ─── Canvas size recalculation ────────────────────────────────────────
  useEffect(() => {
    const recalc = () => {
      if (!canvasWrapRef.current) return;
      const { width, height } = canvasWrapRef.current.getBoundingClientRect();
      const pad = 48;
      setCanvasSize(calcCanvasSize(activeFormat, width - pad, height - pad));
    };
    recalc();
    const ro = new ResizeObserver(recalc);
    if (canvasWrapRef.current) ro.observe(canvasWrapRef.current);
    return () => ro.disconnect();
  }, [activeFormat, sheetExpanded]);
const handleCanvasClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
  // Deselect any overlay when clicking on the canvas background
  setSelectedOverlayId(null);

  if (activeTool !== "text") return;
  
  const rect = e.currentTarget.getBoundingClientRect();
  const x = ((e.clientX - rect.left) / rect.width)  * 100;
  const y = ((e.clientY - rect.top)  / rect.height) * 100;
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
}, [activeTool]);



  const TOOLS = [
    { id: "select" as Tool, icon: <Pointer  size={16}/>, label: "Select (V)"  },
    { id: "text"   as Tool, icon: <Type     size={16}/>, label: "Add text (T)" },
  ];

  const TABS: { id: RsbTab; icon: React.ReactNode; label: string }[] = [
    { id: "design",   icon: <Palette size={16}/>,       label: "Design"   },
    { id: "video",    icon: <Video size={16}/>,         label: "Video"    },
    { id: "captions", icon: <MessageSquare size={16}/>, label: "Captions" },
  ];

  if (loading) {
    return (
      <div className="h-[100dvh] w-screen bg-zinc-950 flex items-center justify-center
                      text-cyan-400 font-mono tracking-widest text-sm">
        Loading your flyer…
      </div>
    );
  }

  return (
    <div className="h-[100dvh] w-screen bg-zinc-950 text-zinc-50 font-sans flex flex-col overflow-hidden overscroll-none">

      {/* ─── Header ──────────────────────────────────────────────────────── */}
      <header className="h-[52px] shrink-0 flex items-center justify-between gap-2 px-2 md:px-4
                         bg-[#111113] border-b border-zinc-800 z-40"
        style={{ paddingTop: "env(safe-area-inset-top)" }}>
        <div className="flex items-center gap-1.5 sm:gap-3 min-w-0">
          <Link href="/dashboard"
            aria-label="Back to dashboard"
            className="w-9 h-9 rounded-full hover:bg-zinc-800 flex items-center justify-center transition-colors shrink-0 touch-manipulation">
            <ArrowLeft size={15} className="text-zinc-500"/>
          </Link>
          <div className="flex items-center gap-2 shrink-0">
            <Logo className="w-5 h-5 rounded-md"/>
            <span className="hidden sm:inline text-[13px] font-semibold tracking-wide">Editor</span>
          </div>
          <div className="hidden sm:block w-px h-4 bg-zinc-700 shrink-0"/>
          <span className="text-[12px] text-zinc-500 truncate min-w-0">
            {flyer.headline || "Untitled flyer"}
          </span>
        </div>
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          <button className="hidden sm:block px-3 py-1.5 rounded-lg text-[12px] text-zinc-400
                             hover:bg-zinc-800 hover:text-white transition-colors touch-manipulation">
          </button>
          <div className="relative">
            <button
              onClick={() => setShowExportMenu(v => !v)}
              disabled={!!exportingFormat}
              className="px-3 sm:px-4 py-2 sm:py-1.5 rounded-lg text-[12px] font-bold bg-cyan-400
                         hover:bg-cyan-300 disabled:opacity-50 disabled:cursor-not-allowed
                         text-black flex items-center gap-1.5 transition-colors touch-manipulation"
            >
              {exportingFormat ? (
                <>
                  <Loader2 size={13} className="animate-spin" />
                  <span className="hidden sm:inline">Exporting {exportingFormat.toUpperCase()}...</span>
                </>
              ) : (
                <>
                  <Download size={13} />
                  Export
                </>
              )}
            </button>
            <AnimatePresence>
              {showExportMenu && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowExportMenu(false)} />
                  <motion.div
                    initial={{ opacity: 0, y: -6, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -6, scale: 0.97 }}
                    transition={{ duration: 0.12 }}
                    className="fixed md:absolute right-2 md:right-0 top-[60px] md:top-[calc(100%+8px)]
                               w-[calc(100vw-16px)] max-w-[220px] md:w-48 z-50
                               bg-zinc-900 border border-zinc-700 rounded-xl shadow-2xl overflow-hidden"
                  >
                    <button
                      onClick={() => handleExportFlyer("png")}
                      className="w-full flex items-center gap-3 px-3.5 py-3.5 md:py-3 text-left hover:bg-zinc-800 transition-colors touch-manipulation"
                    >
                      <ImageIcon size={16} className="text-cyan-400" />
                      <div>
                        <div className="text-[12px] font-semibold text-zinc-100">PNG</div>
                        <div className="text-[10px] text-zinc-500">Best for social & web</div>
                      </div>
                    </button>
                    <div className="h-px bg-zinc-800" />
                    <button
                      onClick={() => handleExportFlyer("jpg")}
                      className="w-full flex items-center gap-3 px-3.5 py-3.5 md:py-3 text-left hover:bg-zinc-800 transition-colors touch-manipulation"
                    >
                      <ImageIcon size={16} className="text-cyan-400" />
                      <div>
                        <div className="text-[12px] font-semibold text-zinc-100">JPG</div>
                        <div className="text-[10px] text-zinc-500">Smaller file size</div>
                      </div>
                    </button>
                    <div className="h-px bg-zinc-800" />
                    <button
                      onClick={() => handleExportFlyer("pdf")}
                      className="w-full flex items-center gap-3 px-3.5 py-3.5 md:py-3 text-left hover:bg-zinc-800 transition-colors touch-manipulation"
                    >
                      <Download size={16} className="text-cyan-400" />
                      <div>
                        <div className="text-[12px] font-semibold text-zinc-100">PDF</div>
                        <div className="text-[10px] text-zinc-500">Best for print</div>
                      </div>
                    </button>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        </div>
      </header>

      {exportError && (
        <div className="px-4 py-1.5 bg-red-950/40 border-b border-red-900/50">
          <p className="text-red-400 text-[11px]">{exportError}</p>
        </div>
      )}

      {/* ─── Main area ──────────────────────────────────────────────────── */}
      <div className="flex flex-1 overflow-hidden relative">

        <aside className="hidden md:flex w-[52px] shrink-0 bg-[#111113] border-r border-zinc-800
                          flex-col items-center py-3 gap-1 z-20">
          {TOOLS.map(t => (
            <ToolBtn key={t.id} active={activeTool===t.id} label={t.label}
              onClick={() => setActiveTool(t.id)}>
              {t.icon}
            </ToolBtn>
          ))}
          <div className="w-7 h-px bg-zinc-800 my-1.5"/>
          {TABS.map(t => (
            <ToolBtn key={t.id} label={t.label} active={activeTab===t.id} onClick={() => setActiveTab(t.id)}>
              {t.icon}
            </ToolBtn>
          ))}
        </aside>

        <section className="flex-1 flex flex-col overflow-hidden bg-zinc-950 pb-[112px] md:pb-0">
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
            <div ref={flyerNodeRef} className="relative" style={{ width: canvasSize.w, height: canvasSize.h }}>
              {/* Template – logo and badge are hidden */}
              <TemplateRenderer
                data={{ ...flyer, logoImage: null, badgeText: "" }}
                onUpdate={update}
                onElementFocus={(el) => { setFocusedEl(el); setShowFtb(true); }}
                onElementBlur={() => setTimeout(() => setShowFtb(false), 150)}
              />

              {/* ─── Overlays ──────────────────────────────────────────────── */}
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
                    style={{ width: 80, height: 80, objectFit: "contain" }}
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
                    onBlur={() => {}}
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
                  onDelete={() => setFreeTexts(prev => prev.filter(item => item.id !== ft.id))}
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
                    className="text-white font-semibold text-base min-w-[40px]"
                    style={{ color: ft.color }}
                    onFocus={() => setSelectedOverlayId(ft.id)}
                    onBlur={() => {}}
                  />
                </Movable>
              ))}

              {/* Floating text toolbar (for template's editable elements) */}
              <AnimatePresence>
                {showFtb && focusedEl && <FloatingTextToolbar onClose={() => setShowFtb(false)}/>}
              </AnimatePresence>
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

          {/* Format bar */}
          <div className="h-12 shrink-0 bg-[#111113] border-t border-zinc-800
                          flex items-center gap-1.5 px-4 overflow-x-auto
                          md:justify-center [&::-webkit-scrollbar]:hidden">
            <span className="text-[10px] text-zinc-600 font-bold uppercase tracking-wider mr-2 shrink-0">Format</span>
            {SOCIAL_FORMATS.map(f => {
              const Icon = f.icon;
              return (
                <button key={f.id} onClick={() => setActiveFormat(f.id)}
                  className={`flex items-center gap-1.5 px-3 py-2 md:py-1 rounded-full text-[11px] font-semibold
                              border transition-all shrink-0 touch-manipulation
                    ${activeFormat===f.id
                      ? "border-cyan-400 bg-cyan-400/10 text-cyan-400"
                      : "border-zinc-800 text-zinc-500 hover:border-zinc-600 hover:text-zinc-300"}`}>
                  <Icon size={11}/>
                  {f.label}
                </button>
              );
            })}
          </div>
        </section>

        {/* Right Sidebar */}
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
          <div className="md:hidden flex flex-col items-center pt-2 pb-1.5 shrink-0"
            onClick={() => setSheetExpanded(v => !v)}>
            <div className="w-9 h-1 rounded-full bg-zinc-700 mb-2" />
            <div className="flex items-center gap-1 px-3 flex-wrap justify-center">
              {TOOLS.map(t => (
                <ToolBtn key={t.id} active={activeTool === t.id} label={t.label}
                  onClick={(e) => { e?.stopPropagation?.(); setActiveTool(t.id); }}>
                  {t.icon}
                </ToolBtn>
              ))}
              <div className="w-px h-6 bg-zinc-800 mx-1" />
              <span className="text-[10px] text-zinc-500 uppercase tracking-wider font-bold">
                {sheetExpanded ? "Drag down to collapse" : "Drag up for more"}
              </span>
            </div>
          </div>

          <div className="flex border-b border-zinc-800 shrink-0">
            {TABS.map(tab => (
              <button key={tab.id} onClick={() => { setActiveTab(tab.id); setSheetExpanded(true); }}
                className={`flex-1 py-3 md:py-2.5 text-[10px] font-bold uppercase tracking-wider
                            border-b-2 transition-colors touch-manipulation flex items-center justify-center gap-1.5
                  ${activeTab===tab.id
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
              </motion.div>
            </AnimatePresence>
          </div>
        </aside>
      </div>

      <AnimatePresence>
        {showExportModal && (
          <LazyExportModal
            flyer={flyer}
            activeFormat={activeFormat}
            onClose={() => setShowExportModal(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

const LazyExportModal = dynamic(() => import("@/components/ExportModal"), { ssr: false });

export default function FlyerEditor() {
  return (
    <Suspense fallback={
      <div className="h-[100dvh] w-screen bg-zinc-950 flex items-center justify-center
                      text-cyan-400 font-mono tracking-widest text-sm">
        Loading editor…
      </div>
    }>
      <EditorContent/>
    </Suspense>
  );
}