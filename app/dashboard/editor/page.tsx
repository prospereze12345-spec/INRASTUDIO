"use client";
import {
  useState, useEffect, useRef, useCallback, Suspense,
} from "react";
import { PromoVideo, PromoVideoProps } from "@/remotion/PromoVideo";

import { renderMediaOnWeb } from "@remotion/web-renderer";

import { toPng, toJpeg } from "html-to-image";
import jsPDF from "jspdf";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import {
  ArrowLeft, Download, Pointer, Type, Palette,
  Video, MessageSquare, Check, Copy, Bold, Italic,
  AlignLeft, AlignCenter, AlignRight, Plus, Minus, Package,
  UploadCloud, Film, Square, Smartphone, Monitor, Image as ImageIcon, Loader2,
} from "lucide-react";

// Remotion imports — only the Player is needed here now; the composition
// itself (PromoVideo) lives in remotion/PromoVideo.tsx and is imported above.
import { Player, PlayerRef } from "@remotion/player";
import ExportModal from "@/components/ExportModal";
import { loadJobResult } from "@/lib/campaign-api";
import { Logo } from "@/components/Logo";

// ─── Types ────────────────────────────────────────────────────────────────────
import { LuxuryProductTemplate } from "@/components/templates/LuxuryProduct";
import { SalePromotionTemplate } from "@/components/templates/SalePromotion";
import { SleekFlyerTemplate as MinimalProductTemplate } from "@/components/templates/MinimalProduct";
import { PremiumBrandTemplate } from "@/components/templates/PremiumBrand";
function TemplateRenderer({
  data, onUpdate, onElementFocus, onElementBlur,
}: {
  data: FlyerState;
  onUpdate: (k: keyof FlyerState, v: any) => void;
  onElementFocus: (el: HTMLElement) => void;
  onElementBlur: () => void;
}) {
  // Adapts the editor's typed setter to the string-based signature every
  // template variant expects. This is the one place that bridges the two.
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
    onUpdate: onFieldUpdate,       // ← use the adapter, not `onUpdate` directly
    onFocusEl: onElementFocus,
    onBlurEl: onElementBlur,
  } as const;

  switch (data.templateCategory) {
    case "Luxury Product":
      return <LuxuryProductTemplate {...shared} subtext={data.subtext} />;
    case "Sale Promotion":
      return <SalePromotionTemplate {...shared} subtext={data.subtext} badgeText={data.badgeText} />;
    case "Minimal Product":
      return <MinimalProductTemplate {...shared} subheadline={data.subtext} badge={data.badgeText} />;
    case "Premium Brand":
      return <PremiumBrandTemplate {...shared} subtext={data.subtext} badgeText={data.badgeText} />;
    default:
      return null;
  }
}

type RsbTab     = "design" | "video" | "captions";
type Tool       = "select" | "text";
type ColorLayer = "bg" | "accent" | "text";

/** Shape of result.captions from the backend */
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
  badgeText:        string;
  price:            string;
  brandName:        string;
  website:          string;
  productImage:     string;
  logoImage:        string | null;
  templateVariant:  string;
  templateCategory: "Luxury Product" | "Sale Promotion" | "Minimal Product" | "Premium Brand";
  colors:           { primary: string; secondary: string; accent: string };
};

/** Canvas dimensions for a given social format */
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

/** Compute canvas pixel size that fits in the given container */
function calcCanvasSize(
  formatId: FormatId,
  maxW: number,
  maxH: number,
): CanvasSize {
  const fmt = SOCIAL_FORMATS.find(f => f.id === formatId)!;
  const aspect = fmt.rw / fmt.rh;
  let w = maxW;
  let h = Math.round(w / aspect);
  if (h > maxH) { h = maxH; w = Math.round(h * aspect); }
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

/** Map raw backend captions object → typed Caption[] */
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

// ─── Template themes ──────────────────────────────────────────────────────────

const TEMPLATE_THEMES = [
  { label: "Gold",    bg: "#0a0a0a",  accent: "#c9a84c", text: "#ffffff" },
  { label: "Violet",  bg: "#0f0a1e",  accent: "#a78bfa", text: "#ffffff" },
  { label: "Emerald", bg: "#022c22",  accent: "#6ee7b7", text: "#ffffff" },
  { label: "Rouge",   bg: "#1a0000",  accent: "#fca5a5", text: "#ffffff" },
  { label: "Ivory",   bg: "#f5f0e8",  accent: "#1c1917", text: "#1c1917" },
  { label: "Ocean",   bg: "#0a1929",  accent: "#38bdf8", text: "#ffffff" },
];

const COLOR_SWATCHES = [
  "#000000","#ffffff","#c9a84c","#fbbf24","#f43f5e",
  "#22d3ee","#4ade80","#818cf8","#fb923c","#a78bfa",
];

// ════════════════════════════════════════════════════════════════════════════
//  NOTE: the PromoVideo Remotion composition used to be redefined locally
//  here (a second, drifting copy of remotion/PromoVideo.tsx). That caused a
//  real bug: this local copy resolved uploaded product images with
//  `staticFile(productImage)`, which only works for bundled /public assets —
//  not for Django-served media paths — so uploaded product images silently
//  failed to load in both the live Player preview and the exported MP4.
//  Fixed by importing the single canonical PromoVideo from
//  "@/remotion/PromoVideo" (see top of file) instead of redefining it here.
// ════════════════════════════════════════════════════════════════════════════

// ════════════════════════════════════════════════════════════════════════════
//  EDITABLE — inline contenteditable on the flyer canvas
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
      className={`outline-none select-text ${className}`}
      style={{
        cursor: "text",
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
//  FLOATING TEXT TOOLBAR
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
      className="absolute -top-12 left-0 z-50 flex items-center gap-0.5 px-2 py-1.5
                 rounded-xl border border-zinc-700 bg-zinc-900/95 backdrop-blur-md shadow-2xl"
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
        className="w-4 h-4 rounded cursor-pointer border border-zinc-600 hover:scale-110 transition-transform"
        style={{ background: "#ffffff" }}
        onClick={() => colorRef.current?.click()}
        title="Text color"
      />
      <input ref={colorRef} type="color" defaultValue="#ffffff" className="sr-only"
        onChange={e => exec("foreColor", e.target.value)}/>
    </motion.div>
  );
}

function FtbBtn({ children, active, onClick }: { children: React.ReactNode; active?: boolean; onClick?: () => void }) {
  return (
    <button onMouseDown={e => { e.preventDefault(); onClick?.(); }}
      className={`w-6 h-6 flex items-center justify-center rounded-md transition-colors
        ${active ? "bg-cyan-400/20 text-cyan-400" : "text-zinc-400 hover:bg-zinc-700 hover:text-zinc-200"}`}>
      {children}
    </button>
  );
}
function FtbSep() { return <div className="w-px h-4 bg-zinc-700 mx-0.5"/>; }

// ════════════════════════════════════════════════════════════════════════════
//  FLYER CANVAS
//
//  NOTE: This component is fully built (per-layout markup, image upload
//  wiring via onImageUpload) but is not referenced anywhere in this file —
//  the editor actually renders <TemplateRenderer>, which delegates to the
//  separate Luxury/Sale/Minimal/Premium template components instead. Left
//  in place rather than deleted since removing it could be a breaking change
//  if something else imports it, but flagging it: this is dead code in this
//  file today, and the real templates' image-upload path should be checked
//  separately to confirm they go through the same uploadAsset()/handleImageUpload
//  flow rather than only storing a local blob: URL.
// ════════════════════════════════════════════════════════════════════════════

type FlyerLayout = "portrait" | "square" | "landscape" | "banner";

function getFlyerLayout(formatId: FormatId): FlyerLayout {
  if (formatId === "square")                return "square";
  if (formatId === "yt" || formatId === "banner") return formatId === "banner" ? "banner" : "landscape";
  return "portrait";
}

function FlyerCanvas({
  data, size, formatId, onUpdate, onElementFocus, onElementBlur, onImageUpload,
}: {
  data: FlyerState;
  size: CanvasSize;
  formatId: FormatId;
  onUpdate: (k: keyof FlyerState, v: any) => void;
  onElementFocus: (el: HTMLElement) => void;
  onElementBlur: () => void;
  onImageUpload: (file: File, field: "productImage" | "logoImage") => void;

}) {
  const logoRef    = useRef<HTMLInputElement>(null);
  const productRef = useRef<HTMLInputElement>(null);
  const layout     = getFlyerLayout(formatId);

  const accent  = data.colors.accent  || "#c9a84c";
  const primary = data.colors.primary || "#0a0a0a";
  const textCol = data.colors.secondary || "#ffffff";
  const isDark  = primary === "#f5f0e8" ? false : true;

  const fs = (base: number) => Math.round(base * (size.w / 380));

  if (layout === "portrait") {
    const imgH = Math.round(size.h * 0.45);
    return (
      <div className="relative overflow-hidden rounded-xl border border-zinc-800 shrink-0"
        style={{ width: size.w, height: size.h, background: primary }}>

        <div style={{
          position: "absolute", inset: "0 0 auto 0",
          height: Math.round(size.h * 0.52),
          background: `linear-gradient(160deg, ${accent}33 0%, ${primary} 80%)`,
        }}/>

        <div style={{
          position: "absolute", top: fs(14), left: fs(16), right: fs(16),
          display: "flex", alignItems: "center", justifyContent: "space-between", zIndex: 10,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: fs(6) }}>
            <div
              onClick={() => logoRef.current?.click()}
              style={{
                width: fs(26), height: fs(26), borderRadius: fs(6),
                border: `1.5px dashed ${accent}55`,
                background: `${accent}15`, display: "flex", alignItems: "center",
                justifyContent: "center", cursor: "pointer", overflow: "hidden",
                flexShrink: 0,
              }}
              title="Upload logo"
            >
              {data.logoImage
                ? <img src={data.logoImage} alt="logo" style={{ width: "100%", height: "100%", objectFit: "contain" }}/>
                : <ImageIcon size={fs(10)} color={`${accent}88`}/>
              }
            </div>
            <Editable id="f-brand" value={data.brandName} onChange={v => onUpdate("brandName", v)}
              onFocus={onElementFocus} onBlur={onElementBlur}
              style={{ fontSize: fs(9), fontWeight: 700, letterSpacing: "0.18em",
                       textTransform: "uppercase", color: `${textCol}70` }}/>
          </div>
          <Editable id="f-badge" value={data.badgeText} onChange={v => onUpdate("badgeText", v)}
            onFocus={onElementFocus} onBlur={onElementBlur}
            style={{
              fontSize: fs(8), fontWeight: 700, letterSpacing: "0.06em",
              textTransform: "uppercase", color: isDark ? "#000" : textCol,
              background: accent, padding: `${fs(3)}px ${fs(8)}px`, borderRadius: 100,
            }}/>
        </div>

        <div style={{
          position: "absolute", top: fs(40), left: "50%", transform: "translateX(-50%)",
          width: Math.round(size.w * 0.62), height: imgH,
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          {data.productImage
            ? <img src={data.productImage} alt="Product" style={{
                width: "100%", height: "100%", objectFit: "contain",
                filter: "drop-shadow(0 16px 28px rgba(0,0,0,0.5))",
              }}/>
            : <div
                onClick={() => productRef.current?.click()}
                style={{
                  width: "100%", height: "100%",
                  border: `2px dashed ${accent}30`, borderRadius: fs(12),
                  display: "flex", flexDirection: "column",
                  alignItems: "center", justifyContent: "center", gap: fs(6),
                  cursor: "pointer",
                }}
              >
                <Package size={fs(24)} color={`${accent}40`}/>
                <span style={{ fontSize: fs(9), color: `${textCol}30` }}>Upload product image</span>
              </div>
          }
        </div>

        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0,
          padding: `${fs(14)}px ${fs(16)}px ${fs(18)}px`,
          background: `linear-gradient(to top, ${primary} 70%, transparent)`,
        }}>
          <Editable id="f-price" value={data.price} onChange={v => onUpdate("price", v)}
            onFocus={onElementFocus} onBlur={onElementBlur}
            style={{ fontSize: fs(28), fontWeight: 900, letterSpacing: "-0.04em",
                     lineHeight: 1, color: accent, display: "block", marginBottom: fs(5) }}/>
          <Editable id="f-headline" value={data.headline} onChange={v => onUpdate("headline", v)}
            onFocus={onElementFocus} onBlur={onElementBlur}
            style={{ fontSize: fs(13), fontWeight: 700, lineHeight: 1.25,
                     color: textCol, display: "block", marginBottom: fs(4) }}/>
          <Editable id="f-sub" value={data.subtext} onChange={v => onUpdate("subtext", v)}
            onFocus={onElementFocus} onBlur={onElementBlur}
            style={{ fontSize: fs(8.5), lineHeight: 1.5,
                     color: `${textCol}55`, display: "block", marginBottom: fs(12) }}/>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <Editable id="f-cta" value={data.ctaText} onChange={v => onUpdate("ctaText", v)}
              onFocus={onElementFocus} onBlur={onElementBlur}
              style={{
                fontSize: fs(9), fontWeight: 700, letterSpacing: "0.04em",
                color: isDark ? "#000" : "#000",
                background: accent, padding: `${fs(6)}px ${fs(14)}px`,
                borderRadius: 100,
              }}/>
            <Editable id="f-web" value={data.website} onChange={v => onUpdate("website", v)}
              onFocus={onElementFocus} onBlur={onElementBlur}
              style={{ fontSize: fs(7.5), letterSpacing: "0.1em",
                       textTransform: "lowercase", color: `${textCol}28` }}/>
          </div>
        </div>

       <input ref={logoRef} type="file" accept="image/*" className="hidden"
  onChange={e => { const f = e.target.files?.[0]; if (f) onImageUpload(f, "logoImage"); }}
/>
  <input ref={productRef} type="file" accept="image/*" className="hidden"
  onChange={e => { const f = e.target.files?.[0]; if (f) onImageUpload(f, "productImage"); }}
/>
      </div>
    );
  }

  if (layout === "square") {
    return (
      <div className="relative overflow-hidden rounded-xl border border-zinc-800 shrink-0"
        style={{ width: size.w, height: size.h, background: primary }}>
        <div style={{
          position: "absolute", inset: 0,
          background: `radial-gradient(ellipse at 70% 30%, ${accent}22 0%, transparent 65%)`,
        }}/>
        <div style={{
          position: "absolute", left: fs(20), top: fs(20), bottom: fs(20),
          width: "48%", display: "flex", flexDirection: "column", justifyContent: "space-between", zIndex: 10,
        }}>
          <div>
            <Editable id="f-brand" value={data.brandName} onChange={v => onUpdate("brandName", v)}
              onFocus={onElementFocus} onBlur={onElementBlur}
              style={{ fontSize: fs(9), fontWeight: 700, letterSpacing: "0.18em",
                       textTransform: "uppercase", color: `${textCol}50`, display: "block", marginBottom: fs(12) }}/>
            <Editable id="f-headline" value={data.headline} onChange={v => onUpdate("headline", v)}
              onFocus={onElementFocus} onBlur={onElementBlur}
              style={{ fontSize: fs(20), fontWeight: 900, lineHeight: 1.05, letterSpacing: "-0.03em",
                       color: textCol, display: "block", marginBottom: fs(8) }}/>
            <Editable id="f-sub" value={data.subtext} onChange={v => onUpdate("subtext", v)}
              onFocus={onElementFocus} onBlur={onElementBlur}
              style={{ fontSize: fs(8), lineHeight: 1.5, color: `${textCol}55`, display: "block" }}/>
          </div>
          <div>
            <Editable id="f-price" value={data.price} onChange={v => onUpdate("price", v)}
              onFocus={onElementFocus} onBlur={onElementBlur}
              style={{ fontSize: fs(22), fontWeight: 900, letterSpacing: "-0.04em",
                       color: accent, display: "block", marginBottom: fs(10) }}/>
            <Editable id="f-cta" value={data.ctaText} onChange={v => onUpdate("ctaText", v)}
              onFocus={onElementFocus} onBlur={onElementBlur}
              style={{
                fontSize: fs(8), fontWeight: 700, color: "#000",
                background: accent, padding: `${fs(5)}px ${fs(12)}px`, borderRadius: 100, display: "inline-block",
              }}/>
          </div>
        </div>
        <div style={{
          position: "absolute", right: 0, top: 0, bottom: 0, width: "52%",
        }}>
          {data.productImage
            ? <img src={data.productImage} alt="Product" style={{
                width: "100%", height: "100%", objectFit: "contain", objectPosition: "center",
                filter: "drop-shadow(0 12px 24px rgba(0,0,0,0.5))",
              }}/>
            : <div onClick={() => productRef.current?.click()}
                style={{ width: "100%", height: "100%", display: "flex", alignItems: "center",
                          justifyContent: "center", cursor: "pointer" }}>
                <Package size={fs(32)} color={`${accent}30`}/>
              </div>
          }
        </div>
        <input ref={logoRef} type="file" accept="image/*" className="hidden"
  onChange={e => { const f = e.target.files?.[0]; if (f) onImageUpload(f, "logoImage"); }}
/>
        <input ref={productRef} type="file" accept="image/*" className="hidden"
         onChange={e => { const f = e.target.files?.[0]; if (f) onImageUpload(f, "productImage"); }}
        />
      </div>
    );
  }

  if (layout === "landscape") {
    return (
      <div className="relative overflow-hidden rounded-xl border border-zinc-800 shrink-0"
        style={{ width: size.w, height: size.h, background: primary }}>
        <div style={{
          position: "absolute", inset: 0,
          background: `linear-gradient(to right, ${primary} 40%, ${accent}18 100%)`,
        }}/>
        <div style={{
          position: "absolute", left: "5%", top: "10%", width: "45%", height: "80%",
          display: "flex", flexDirection: "column", justifyContent: "center", gap: fs(8), zIndex: 10,
        }}>
          <Editable id="f-brand" value={data.brandName} onChange={v => onUpdate("brandName", v)}
            onFocus={onElementFocus} onBlur={onElementBlur}
            style={{ fontSize: fs(8), fontWeight: 700, letterSpacing: "0.2em",
                     textTransform: "uppercase", color: `${textCol}45`, display: "block" }}/>
          <Editable id="f-headline" value={data.headline} onChange={v => onUpdate("headline", v)}
            onFocus={onElementFocus} onBlur={onElementBlur}
            style={{ fontSize: fs(22), fontWeight: 900, lineHeight: 1.0, letterSpacing: "-0.03em",
                     color: textCol, display: "block" }}/>
          <div style={{ width: fs(32), height: 2, background: accent, borderRadius: 1 }}/>
          <Editable id="f-sub" value={data.subtext} onChange={v => onUpdate("subtext", v)}
            onFocus={onElementFocus} onBlur={onElementBlur}
            style={{ fontSize: fs(8), lineHeight: 1.55, color: `${textCol}50`, display: "block", maxWidth: "90%" }}/>
          <div style={{ display: "flex", alignItems: "center", gap: fs(10), marginTop: fs(4) }}>
            <Editable id="f-price" value={data.price} onChange={v => onUpdate("price", v)}
              onFocus={onElementFocus} onBlur={onElementBlur}
              style={{ fontSize: fs(24), fontWeight: 900, letterSpacing: "-0.04em", color: accent }}/>
            <Editable id="f-cta" value={data.ctaText} onChange={v => onUpdate("ctaText", v)}
              onFocus={onElementFocus} onBlur={onElementBlur}
              style={{
                fontSize: fs(8), fontWeight: 700, color: "#000",
                background: accent, padding: `${fs(5)}px ${fs(12)}px`, borderRadius: 100,
              }}/>
          </div>
          <Editable id="f-web" value={data.website} onChange={v => onUpdate("website", v)}
            onFocus={onElementFocus} onBlur={onElementBlur}
            style={{ fontSize: fs(7), letterSpacing: "0.1em", color: `${textCol}25` }}/>
        </div>
        <div style={{ position: "absolute", right: "3%", top: "5%", width: "47%", height: "90%" }}>
          {data.productImage
            ? <img src={data.productImage} alt="Product" style={{
                width: "100%", height: "100%", objectFit: "contain",
                filter: "drop-shadow(0 12px 32px rgba(0,0,0,0.45))",
              }}/>
            : <div onClick={() => productRef.current?.click()}
                style={{ width: "100%", height: "100%", display: "flex", alignItems: "center",
                          justifyContent: "center", cursor: "pointer" }}>
                <Package size={fs(36)} color={`${accent}30`}/>
              </div>
          }
        </div>
        <input ref={productRef} type="file" accept="image/*" className="hidden"
  onChange={e => { const f = e.target.files?.[0]; if (f) onImageUpload(f, "productImage"); }}
/>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden rounded-xl border border-zinc-800 shrink-0"
      style={{ width: size.w, height: size.h, background: primary }}>
      <div style={{
        position: "absolute", inset: 0,
        background: `linear-gradient(90deg, ${primary} 0%, ${accent}15 50%, ${primary} 100%)`,
      }}/>
      <div style={{ position: "absolute", top: "5%", bottom: "5%", left: "30%", width: "40%", zIndex: 5 }}>
        {data.productImage
          ? <img src={data.productImage} alt="Product" style={{
              width: "100%", height: "100%", objectFit: "contain",
              filter: "drop-shadow(0 8px 20px rgba(0,0,0,0.5))",
            }}/>
          : <div onClick={() => productRef.current?.click()}
              style={{ width: "100%", height: "100%", display: "flex", alignItems: "center",
                        justifyContent: "center", cursor: "pointer" }}>
              <Package size={fs(28)} color={`${accent}30`}/>
            </div>
        }
      </div>
      <div style={{
        position: "absolute", left: "3%", top: "15%", width: "28%",
        display: "flex", flexDirection: "column", gap: fs(5), zIndex: 10,
      }}>
        <Editable id="f-brand" value={data.brandName} onChange={v => onUpdate("brandName", v)}
          onFocus={onElementFocus} onBlur={onElementBlur}
          style={{ fontSize: fs(8), fontWeight: 700, letterSpacing: "0.2em",
                   textTransform: "uppercase", color: `${textCol}40` }}/>
        <Editable id="f-headline" value={data.headline} onChange={v => onUpdate("headline", v)}
          onFocus={onElementFocus} onBlur={onElementBlur}
          style={{ fontSize: fs(16), fontWeight: 900, lineHeight: 1.05,
                   letterSpacing: "-0.03em", color: textCol }}/>
        <Editable id="f-price" value={data.price} onChange={v => onUpdate("price", v)}
          onFocus={onElementFocus} onBlur={onElementBlur}
          style={{ fontSize: fs(18), fontWeight: 900, letterSpacing: "-0.04em", color: accent }}/>
      </div>
      <div style={{
        position: "absolute", right: "3%", top: "20%", width: "26%",
        display: "flex", flexDirection: "column", gap: fs(6), zIndex: 10,
      }}>
        <Editable id="f-sub" value={data.subtext} onChange={v => onUpdate("subtext", v)}
          onFocus={onElementFocus} onBlur={onElementBlur}
          style={{ fontSize: fs(7.5), lineHeight: 1.5, color: `${textCol}50` }}/>
        <Editable id="f-cta" value={data.ctaText} onChange={v => onUpdate("ctaText", v)}
          onFocus={onElementFocus} onBlur={onElementBlur}
          style={{
            fontSize: fs(8), fontWeight: 700, color: "#000",
            background: accent, padding: `${fs(5)}px ${fs(12)}px`, borderRadius: 100,
            display: "inline-block",
          }}/>
        <Editable id="f-web" value={data.website} onChange={v => onUpdate("website", v)}
          onFocus={onElementFocus} onBlur={onElementBlur}
          style={{ fontSize: fs(7), letterSpacing: "0.1em", color: `${textCol}25` }}/>
      </div>
      <input ref={productRef} type="file" accept="image/*" className="hidden"
  onChange={e => { const f = e.target.files?.[0]; if (f) onImageUpload(f, "productImage"); }}
/>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
//  RIGHT SIDEBAR PANELS
// ════════════════════════════════════════════════════════════════════════════

function DesignPanel({ data, onUpdate }: {
  data: FlyerState;
  onUpdate: (k: keyof FlyerState, v: any) => void;
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
              className={`h-14 rounded-lg overflow-hidden border-2 relative transition-all text-left
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
              className={`flex-1 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-wider transition-colors
                ${colorLayer===l ? "bg-cyan-400/20 text-cyan-400" : "text-zinc-500 hover:text-zinc-300"}`}>
              {l === "bg" ? "BG" : l === "accent" ? "Accent" : "Text"}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap gap-1.5 mb-3">
          {COLOR_SWATCHES.map(hex => (
            <button key={hex} onClick={() => applyColor(hex)}
              className="w-6 h-6 rounded-full border-2 hover:scale-110 transition-transform"
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
            className="w-9 h-9 rounded-lg cursor-pointer border border-zinc-700 bg-zinc-900 p-1 shrink-0"/>
          <input type="text" value={currentLayerColor}
            onChange={e => /^#[0-9a-fA-F]{6}$/.test(e.target.value) && applyColor(e.target.value)}
            className="flex-1 bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-1.5
                       text-[12px] font-mono text-zinc-200 focus:outline-none focus:border-cyan-500"/>
        </div>
      </div>

      <Divider/>

      <div>
        <Label>Logo</Label>
        <label className="flex flex-col items-center gap-1.5 border-[1.5px] border-dashed border-zinc-700
                          rounded-xl p-4 cursor-pointer hover:border-zinc-500 hover:bg-zinc-900/50 transition-all">
          <UploadCloud size={18} className="text-zinc-500"/>
          <span className="text-[11px] text-zinc-500">Upload logo — PNG recommended</span>
          <input type="file" accept="image/*" className="hidden"
            onChange={e => { const f = e.target.files?.[0]; if(f) onUpdate("logoImage", URL.createObjectURL(f)); }}/>
        </label>
      </div>
    </div>
  );
}

// ── Video panel — Remotion player + per-format download ───────────────────────
function VideoPanel({ flyer, activeFormatId, jobId }: {
  flyer: FlyerState;
  activeFormatId: FormatId;
  jobId: string | null;
}) {
  const [selectedFormat, setSelectedFormat] = useState<FormatId>(activeFormatId);
  const [downloading, setDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState<string | null>(null);
  const playerRef = useRef<PlayerRef>(null);

  const fmt = SOCIAL_FORMATS.find(f => f.id === selectedFormat)!;
  const COMP_W = fmt.rw * 60;
  const COMP_H = fmt.rh * 60;
  const durationInFrames = fmt.fps * fmt.durationS;

  const promoProps: PromoVideoProps = {
    headline:     flyer.headline,
    subtext:      flyer.subtext,
    ctaText:      flyer.ctaText,
    price:        flyer.price,
    brandName:    flyer.brandName,
    website:      flyer.website,
    productImage: flyer.productImage,
    colors:       flyer.colors,
  };

  
  const handleDownload = async () => {
    if (downloading) return;
    setDownloading(true);
    setDownloadError(null);

  try {
    const { getBlob } = await renderMediaOnWeb({
  composition: {
    id: "PromoVideo",
    component: PromoVideo,
    width: COMP_W,
    height: COMP_H,
    fps: fmt.fps,
    durationInFrames,
    defaultProps: promoProps, // some renderMediaOnWeb versions want this, not just inputProps
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
              className={`py-2 px-1 rounded-lg border text-center transition-all
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
        className={`w-full py-2.5 rounded-xl font-bold text-[13px] flex items-center justify-center gap-2 rounded-xl transition-all duration-200
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
}

// ── Captions panel ──────────────────────────────────────────────────────────

function CaptionsPanel({ captions }: { captions: Caption[] }) {
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
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-zinc-800 text-[10px]
                         text-zinc-400 hover:text-white hover:bg-zinc-700 transition-colors">
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
}

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
    <button onClick={onClick} title={label}
      className={`w-9 h-9 rounded-lg flex items-center justify-center transition-colors
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

// Neutral fallback shape — module scope, used only if the API result is
// missing a field. Never shown as real placeholder copy for more than a frame.
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
  return data.url as string; // the real, permanent URL
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



const update = useCallback((k: keyof FlyerState, v: any) => {
  setFlyer(prev => ({ ...prev, [k]: v }));
}, []);

const [pendingUploads, setPendingUploads] = useState(0);

const handleImageUpload = useCallback(
  async (file: File, field: "productImage" | "logoImage") => {
    if (!file) return;
    const blobUrl = URL.createObjectURL(file);
    update(field, blobUrl);
    setPendingUploads(n => n + 1);
    try {
      const url = await uploadAsset(file);
      update(field, url);
    } catch {
      update(field, "");
      setExportError(
        `${field === "productImage" ? "Product image" : "Logo"} upload failed. Please try again.`
      );
    } finally {
      setPendingUploads(n => n - 1);
    }
  },
  [update]
);

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
    const dataUrl = await toPng(flyerNodeRef.current, snapshotOpts);
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

useEffect(() => {
    const urlVariant  = searchParams.get("variant");
    const rawCategory = searchParams.get("category");
    const urlCategory = VALID_CATEGORIES.includes(rawCategory as any)
  ? (rawCategory as FlyerState["templateCategory"])
  : null;
    const result = loadJobResult() as any;

    if (!result && !urlVariant) {
      // No job AND no template pick — genuinely nothing to show.
      router.push("/dashboard");
      return;
    }

    if (result) {

      setJobId(result.job_id || null);
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
        templateCategory: urlCategory || prev.templateCategory,
      }));

      if (result.captions) {
        if (Array.isArray(result.captions)) {
          setCaptions(result.captions.map((c: any) => ({
            platform: c.platform,
            key:      c.platform.toLowerCase() as keyof BackendCaptions,
            text:     c.text,
            color:    PLATFORM_META.find(p => p.label.toLowerCase() === c.platform.toLowerCase())?.color || "text-zinc-400",
          })));
        } else {
          setCaptions(parseCaptions(result.captions as BackendCaptions));
        }
      }
    } else if (urlVariant) {
      // Template picked with no job yet — apply the template selection alone.
      setFlyer(prev => ({
        ...prev,
        templateVariant:  urlVariant,
        templateCategory: urlCategory || prev.templateCategory,
      }));
    }

    setLoading(false);
}, [router, searchParams]);

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
  }, [activeFormat]);

  const [freeTexts, setFreeTexts] = useState<{ id: string; text: string; x: number; y: number }[]>([]);

  const handleCanvasClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (activeTool !== "text") return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width)  * 100;
    const y = ((e.clientY - rect.top)  / rect.height) * 100;
    const id = `ft-${Date.now()}`;
    setFreeTexts(prev => [...prev, { id, text: "New text", x, y }]);
    setActiveTool("select");
  }, [activeTool]);

  const TOOLS = [
    { id: "select" as Tool, icon: <Pointer  size={15}/>, label: "Select (V)"  },
    { id: "text"   as Tool, icon: <Type     size={15}/>, label: "Add text (T)" },
  ];

  if (loading) {
    return (
      <div className="h-screen w-screen bg-zinc-950 flex items-center justify-center
                      text-cyan-400 font-mono tracking-widest text-sm">
        Loading your flyer…
      </div>
    );
  }

  return (
    <div className="h-screen w-screen bg-zinc-950 text-zinc-50 font-sans flex flex-col overflow-hidden">

      <header className="h-[52px] shrink-0 flex items-center justify-between px-2 md:px-4
                         bg-[#111113] border-b border-zinc-800 z-40">
        <div className="flex items-center gap-3">
          <Link href="/dashboard"
            className="w-8 h-8 rounded-full hover:bg-zinc-800 flex items-center justify-center transition-colors">
            <ArrowLeft size={15} className="text-zinc-500"/>
          </Link>
          <div className="flex items-center gap-2">
            <Logo className="w-5 h-5 rounded-md"/>
            <span className="text-[13px] font-semibold tracking-wide">Editor</span>
          </div>
          <div className="w-px h-4 bg-zinc-700"/>
          <span className="text-[12px] text-zinc-500 truncate max-w-[200px]">
            {flyer.headline || "Untitled flyer"}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button className="px-3 py-1.5 rounded-lg text-[12px] text-zinc-400
                             hover:bg-zinc-800 hover:text-white transition-colors">
            Save draft
          </button>
          <div className="relative">
  <button
    onClick={() => setShowExportMenu(v => !v)}
    disabled={!!exportingFormat}
    className="px-4 py-1.5 rounded-lg text-[12px] font-bold bg-cyan-400
               hover:bg-cyan-300 disabled:opacity-50 disabled:cursor-not-allowed
               text-black flex items-center gap-1.5 transition-colors"
  >
    {exportingFormat ? (
      <>
        <Loader2 size={13} className="animate-spin" />
        Exporting {exportingFormat.toUpperCase()}...
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
          className="absolute right-0 top-[calc(100%+8px)] w-48 z-50
                     bg-zinc-900 border border-zinc-700 rounded-xl shadow-2xl overflow-hidden"
        >
          <button
  onClick={() => handleExportFlyer("png")}
  className="w-full flex items-center gap-3 px-3.5 py-3 text-left hover:bg-zinc-800 transition-colors"
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
  className="w-full flex items-center gap-3 px-3.5 py-3 text-left hover:bg-zinc-800 transition-colors"
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
  className="w-full flex items-center gap-3 px-3.5 py-3 text-left hover:bg-zinc-800 transition-colors"
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
          <ToolBtn label="Design" active={activeTab==="design"} onClick={() => setActiveTab("design")}>
            <Palette size={15}/>
          </ToolBtn>
          <ToolBtn label="Video" active={activeTab==="video"} onClick={() => setActiveTab("video")}>
            <Video size={15}/>
          </ToolBtn>
          <ToolBtn label="Captions" active={activeTab==="captions"} onClick={() => setActiveTab("captions")}>
            <MessageSquare size={15}/>
          </ToolBtn>
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
            }}
            onClick={handleCanvasClick}
          >
<div ref={flyerNodeRef} className="relative" style={{ width: canvasSize.w, height: canvasSize.h }}>
    <TemplateRenderer
    data={flyer}
    onUpdate={update}
    onElementFocus={(el) => { setFocusedEl(el); setShowFtb(true); }}
    onElementBlur={() => setTimeout(() => setShowFtb(false), 150)}
  />

              <AnimatePresence>
                {showFtb && focusedEl && <FloatingTextToolbar onClose={() => setShowFtb(false)}/>}
              </AnimatePresence>

              {freeTexts.map(ft => (
                <div key={ft.id} contentEditable
                  className="absolute outline-none text-white font-semibold text-base
                             min-w-[40px] cursor-text px-1"
                  style={{ left: `${ft.x}%`, top: `${ft.y}%`, transform: "translate(-50%,-50%)" }}
                  onFocus={e => { setFocusedEl(e.currentTarget); setShowFtb(true); }}
                  onBlur={() => setTimeout(() => setShowFtb(false), 150)}
                  suppressContentEditableWarning
                >
                  {ft.text}
                </div>
              ))}
            </div>

            <AnimatePresence>
              {activeTool === "text" && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-zinc-900/90 border border-zinc-700
                             rounded-full px-4 py-1.5 text-[11px] text-zinc-300 pointer-events-none">
                  Click anywhere on the flyer to place a text block
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="h-11 shrink-0 bg-[#111113] border-t border-zinc-800
                          flex items-center gap-1.5 px-4 overflow-x-auto
                          md:justify-center [&::-webkit-scrollbar]:hidden">
            <span className="text-[10px] text-zinc-600 font-bold uppercase tracking-wider mr-2">Format</span>
            {SOCIAL_FORMATS.map(f => {
              const Icon = f.icon;
              return (
                <button key={f.id} onClick={() => setActiveFormat(f.id)}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold
                              border transition-all
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

          <aside
            className={`
              fixed md:static inset-x-0 bottom-0 md:inset-auto
              w-full md:w-[265px] shrink-0
              bg-[#111113] border-t md:border-t-0 md:border-l border-zinc-800
              flex flex-col z-30
              transition-[height] duration-200 ease-out
              ${sheetExpanded ? "h-[70vh]" : "h-[112px]"}
              md:h-auto md:flex-1
            `}
          >
            {/* Drag handle + tool row — mobile only */}
            <div className="md:hidden flex flex-col items-center pt-2 pb-1 shrink-0"
              onClick={() => setSheetExpanded(v => !v)}>
              <div className="w-9 h-1 rounded-full bg-zinc-700 mb-2" />
              <div className="flex items-center gap-1.5 px-3">
                {TOOLS.map(t => (
                  <ToolBtn key={t.id} active={activeTool === t.id} label={t.label}
                    onClick={(e) => { e?.stopPropagation?.(); setActiveTool(t.id); }}>
                    {t.icon}
                  </ToolBtn>
                ))}
                <div className="w-px h-5 bg-zinc-800 mx-1" />
              </div>
            </div>

            <div className="flex border-b border-zinc-800 shrink-0">
              {(["design","video","captions"] as RsbTab[]).map(tab => (
                <button key={tab} onClick={() => { setActiveTab(tab); setSheetExpanded(true); }}
                  className={`flex-1 py-2.5 text-[10px] font-bold uppercase tracking-wider
                              border-b-2 transition-colors
                    ${activeTab===tab
                      ? "text-cyan-400 border-cyan-400"
                      : "text-zinc-600 border-transparent hover:text-zinc-300"}`}>
                  {tab}
                  {tab === "captions" && captions.length > 0 && (
                    <span className="ml-1.5 inline-flex items-center justify-center w-4 h-4
                                    rounded-full bg-cyan-400 text-black text-[8px] font-black">
                      {captions.length}
                    </span>
                  )}
                </button>
              ))}
            </div>

            <div className={`flex-1 overflow-y-auto p-4
                            [&::-webkit-scrollbar]:w-1
                            [&::-webkit-scrollbar-thumb]:bg-zinc-700
                            [&::-webkit-scrollbar-track]:bg-transparent
                            ${sheetExpanded ? "" : "hidden md:block"}`}>
              <AnimatePresence mode="wait">
                <motion.div key={activeTab}
                  initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }} transition={{ duration: 0.1 }}>
                  {activeTab === "design" && (
                    <DesignPanel data={flyer} onUpdate={update}/>
                  )}
                  {activeTab === "video" && (
                    <VideoPanel flyer={flyer} activeFormatId={activeFormat} jobId={jobId} />
                  )}
                  {activeTab === "captions" && (
                    <CaptionsPanel captions={captions}/>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </aside>
          
      </div>

      <AnimatePresence>
        {showExportModal && (
          <ExportModal
            flyer={flyer}
            activeFormat={activeFormat}
            onClose={() => setShowExportModal(false)}
          />
        )}
      </AnimatePresence>

    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
//  EXPORT
// ════════════════════════════════════════════════════════════════════════════

export default function FlyerEditor() {
  return (
    <Suspense fallback={
      <div className="h-screen w-screen bg-zinc-950 flex items-center justify-center
                      text-cyan-400 font-mono tracking-widest text-sm">
        Loading editor…
      </div>
    }>
      <EditorContent/>
    </Suspense>
  );
}

