"use client";

import { useState, useEffect, Suspense, useRef } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import {
  ArrowLeft, Download, Image as ImageIcon, Type, Palette,
  LayoutTemplate, Upload, Check, Play, Pause, Volume2,
  Copy, RefreshCw, Sparkles, ChevronDown, FileVideo,
  MessageSquare, Zap, VolumeX
} from "lucide-react";
import { LuxuryProductTemplate } from "@/components/templates/LuxuryProduct";
import { SalePromotionTemplate } from "@/components/templates/SalePromotion";
import { MinimalProductTemplate } from "@/components/templates/MinimalProduct";
import { PremiumBrandTemplate } from "@/components/templates/PremiumBrand";
import {
  LUXURY_VARIATIONS, SALE_PROMOTION_VARIATIONS,
  MINIMAL_PRODUCT_VARIATIONS, PREMIUM_BRAND_VARIATIONS
} from "@/lib/template-data";
import { Logo } from "@/components/Logo";

// ─── Types ───────────────────────────────────────────────────────────────────

type GeneratedAssets = {
  videoUrl: string | null;
  captions: { platform: string; text: string }[];
  status: "idle" | "generating" | "done" | "error";
};

// ─── Constants ───────────────────────────────────────────────────────────────

const PRESET_COLORS = [
  { name: "Black",      value: "#000000" },
  { name: "White",      value: "#ffffff" },
  { name: "Gold",       value: "#ffd700" },
  { name: "Navy",       value: "#000080" },
  { name: "Royal Blue", value: "#4169e1" },
  { name: "Purple",     value: "#800080" },
  { name: "Pink",       value: "#ffc0cb" },
  { name: "Red",        value: "#ff0000" },
  { name: "Orange",     value: "#ffa500" },
  { name: "Yellow",     value: "#ffff00" },
  { name: "Green",      value: "#008000" },
  { name: "Teal",       value: "#008080" },
  { name: "Cyan",       value: "#00ffff" },
  { name: "Gray",       value: "#808080" },
  { name: "Brown",      value: "#a52a2a" },
];

const TEMPLATES = [
  ...LUXURY_VARIATIONS.map((v, i)       => ({ id: `luxury${i}`,  name: v.name, variant: v.name, category: "Luxury Product"   })),
  ...SALE_PROMOTION_VARIATIONS.map((v, i) => ({ id: `sale${i}`,    name: v.name, variant: v.name, category: "Sale Promotion"   })),
  ...MINIMAL_PRODUCT_VARIATIONS.map((v, i) => ({ id: `minimal${i}`, name: v.name, variant: v.name, category: "Minimal Product"  })),
  ...PREMIUM_BRAND_VARIATIONS.map((v, i)  => ({ id: `premium${i}`, name: v.name, variant: v.name, category: "Premium Brand"    })),
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Small badge shown on the header button when generation is done */
function DotBadge() {
  return (
    <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-cyan-400 border border-[#0a1128]" />
  );
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function VideoPlayer({ url }: { url: string | null }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [muted,   setMuted]   = useState(false);

  const toggle = () => {
    if (!videoRef.current) return;
    if (playing) { videoRef.current.pause(); setPlaying(false); }
    else         { videoRef.current.play();  setPlaying(true);  }
  };

  if (!url) {
    return (
      <div className="w-full aspect-video bg-[#030712] rounded-xl border border-white/10 flex flex-col items-center justify-center gap-3">
        <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center">
          <FileVideo className="w-5 h-5 text-slate-500" />
        </div>
        <p className="text-xs text-slate-500">Video will appear here once generated</p>
      </div>
    );
  }

  return (
    <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-black border border-white/10 group">
      <video
        ref={videoRef}
        src={url}
        muted={muted}
        loop
        className="w-full h-full object-cover"
        onEnded={() => setPlaying(false)}
      />
      {/* overlay controls */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-between p-4">
        <button
          onClick={toggle}
          className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-colors"
        >
          {playing ? <Pause className="w-4 h-4 text-white" /> : <Play className="w-4 h-4 text-white fill-white" />}
        </button>
        <button
          onClick={() => setMuted(m => !m)}
          className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-colors"
        >
          {muted ? <VolumeX className="w-4 h-4 text-white" /> : <Volume2 className="w-4 h-4 text-white" />}
        </button>
      </div>
      {/* play icon when paused */}
      {!playing && (
        <button
          onClick={toggle}
          className="absolute inset-0 flex items-center justify-center"
        >
          <div className="w-16 h-16 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center">
            <Play className="w-7 h-7 text-white fill-white ml-1" />
          </div>
        </button>
      )}
    </div>
  );
}

function CaptionCard({ platform, text, onRegenerate }: { platform: string; text: string; onRegenerate?: () => void }) {
  const [copied, setCopied] = useState(false);

  const copy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const platformColor: Record<string, string> = {
    Instagram: "text-pink-400",
    TikTok:    "text-purple-400",
    Twitter:   "text-sky-400",
    Facebook:  "text-blue-400",
    LinkedIn:  "text-cyan-400",
  };

  return (
    <div className="bg-white/[0.03] border border-white/8 rounded-xl overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/5">
        <span className={`text-xs font-bold uppercase tracking-widest ${platformColor[platform] ?? "text-slate-400"}`}>
          {platform}
        </span>
        <div className="flex items-center gap-2">
          {onRegenerate && (
            <button
              onClick={onRegenerate}
              className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"

>
              <RefreshCw className="w-3.5 h-3.5 text-slate-400" />
            </button>
          )}
          <button
            onClick={copy}
            className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"
            title="Copy"
          >
            {copied
              ? <Check className="w-3.5 h-3.5 text-cyan-400" />
              : <Copy className="w-3.5 h-3.5 text-slate-400" />
            }
          </button>
        </div>
      </div>
      <p className="px-4 py-3 text-sm text-slate-300 leading-relaxed whitespace-pre-wrap">{text}</p>
    </div>
  );
}


function MediaPanel({
  assets,
  onRegenerate,
}: {
  assets: GeneratedAssets;
  onRegenerate: () => void;
}) {
  const [activeSection, setActiveSection] = useState<"video" | "captions">("video");

  return (
    <div className="flex flex-col h-full">
      {/* Section tabs */}
      <div className="flex border-b border-white/5 shrink-0">
        {[
          { id: "video",    icon: FileVideo,       label: "Video" },
          { id: "captions", icon: MessageSquare,   label: "Captions" },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveSection(tab.id as any)}
            className={`flex-1 py-4 flex flex-col items-center justify-center gap-1.5 transition-colors relative ${
              activeSection === tab.id ? "text-cyan-400" : "text-slate-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <tab.icon className="w-5 h-5" />
            <span className="text-[10px] uppercase tracking-wider font-bold">{tab.label}</span>
            {activeSection === tab.id && (
              <motion.div layoutId="mediaTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-cyan-400" />
            )}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-white/10">
        <AnimatePresence mode="wait">
          {activeSection === "video" && (
            <motion.div
              key="video"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-5"
            >
              {/* Status bar */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-cyan-400" />
                  <span className="text-xs font-bold uppercase tracking-widest text-slate-300">
                    Generated Video
                  </span>
                </div>
                {assets.status === "done" && (
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/20">
                    Ready
                  </span>
                )}
                {assets.status === "generating" && (
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full bg-cyan-500/15 text-cyan-400 border border-cyan-500/20 animate-pulse">
                    Generating…
                  </span>
                )}
                {assets.status === "idle" && (
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full bg-white/5 text-slate-400 border border-white/10">
                    Pending
                  </span>
                )}
              </div>

              {/* Generating skeleton */}
              {assets.status === "generating" && (
                <div className="w-full aspect-video rounded-xl bg-gradient-to-br from-[#0a1128] to-[#030712] border border-white/10 flex flex-col items-center justify-center gap-4 relative overflow-hidden">
                  <div className="absolute inset-0 bg-[length:200%_200%] animate-pulse bg-gradient-to-br from-cyan-950/20 via-transparent to-cyan-950/20" />
                  <Sparkles className="w-8 h-8 text-cyan-400 animate-spin-slow" />
                  <p className="text-sm text-cyan-300 font-medium">Rendering your video…</p>
                  <div className="w-48 h-1 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-cyan-400 rounded-full animate-[progress_2s_ease-in-out_infinite]" style={{ width: "60%" }} />
                  </div>
                </div>
              )}

              {/* Video player */}
              {(assets.status === "done" || assets.status === "idle") && (
                <VideoPlayer url={assets.videoUrl} />
              )}

              {/* Actions */}
              <div className="flex items-center gap-3">
               
                <a
                  href={assets.videoUrl ?? undefined}
                  download
                  className={`flex-1 py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all ${
                    assets.videoUrl
                      ? "bg-cyan-400 hover:bg-cyan-300 text-[#0a1128] shadow-[0_0_15px_rgba(34,211,238,0.3)]"
                      : "bg-white/5 text-slate-500 cursor-not-allowed pointer-events-none"
                  }`}
                >
                  <Download className="w-4 h-4" /> Download
                </a>
              </div>

              {/* Info hint */}
              <div className="p-4 bg-[#0a1128] border border-white/5 rounded-xl">
                <p className="text-xs text-slate-500 leading-relaxed">
                  The video is auto-generated from your selected template and product image. Switching templates or colors will trigger a new render in the backend.
                </p>
              </div>
            </motion.div>
          )}

          {activeSection === "captions" && (
            <motion.div
              key="captions"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-cyan-400" />
                  <span className="text-xs font-bold uppercase tracking-widest text-slate-300">
                    Generated Captions
                  </span>
                </div>
                
              </div>

              {/* Generating skeleton */}
              {assets.status === "generating" && (
                <div className="space-y-3">
                  {["Instagram", "TikTok", "Twitter"].map(p => (
                    <div key={p} className="h-28 rounded-xl bg-white/[0.03] border border-white/8 animate-pulse" />
                  ))}
                </div>
              )}

              {/* Caption cards */}
              {assets.status === "done" && assets.captions.length > 0 && (
                <div className="space-y-3">
                  {assets.captions.map(cap => (
                    <CaptionCard
                      key={cap.platform}
                      platform={cap.platform}
                      text={cap.text}
                      onRegenerate={onRegenerate}
                    />
                  ))}
                </div>
              )}

              {/* Empty state */}
              {assets.status === "idle" && (
                <div className="flex flex-col items-center justify-center py-12 gap-4 border border-dashed border-white/10 rounded-xl">
                  <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center">
                    <MessageSquare className="w-5 h-5 text-slate-500" />
                  </div>
                  <p className="text-xs text-slate-500 text-center max-w-[200px]">
                    Captions will be generated automatically once you pick a template
                  </p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// ─── Editor left panel ───────────────────────────────────────────────────────

type EditorTab = "text" | "image" | "colors" | "template";

function EditorPanel({ flyerData, setFlyerData }: {
  flyerData: any;
  setFlyerData: React.Dispatch<React.SetStateAction<any>>;
}) {
  const [activeTab, setActiveTab] = useState<EditorTab>("text");
  const [activeColorLayer, setActiveColorLayer] = useState<"primary" | "secondary" | "accent">("primary");

  const handleUpdate = (key: string, value: any) => setFlyerData((prev: any) => ({ ...prev, [key]: value }));
  const handleColorUpdate = (layer: "primary" | "secondary" | "accent", color: string) =>
    setFlyerData((prev: any) => ({ ...prev, colors: { ...prev.colors, [layer]: color } }));

  const tabs = [
    { id: "text",     icon: Type,           label: "Text"     },
    { id: "image",    icon: ImageIcon,       label: "Image"    },
    { id: "colors",   icon: Palette,         label: "Colors"   },
    { id: "template", icon: LayoutTemplate,  label: "Layout"   },
  ];

  return (
    <div className="flex flex-col h-full">
      {/* Tabs */}
      <div className="flex border-b border-white/5 shrink-0">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as EditorTab)}
            className={`flex-1 py-4 flex flex-col items-center justify-center gap-1.5 transition-colors relative ${
              activeTab === tab.id ? "text-cyan-400" : "text-slate-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <tab.icon className="w-5 h-5" />
            <span className="text-[10px] uppercase tracking-wider font-bold">{tab.label}</span>
            {activeTab === tab.id && (
              <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-cyan-400" />
            )}
          </button>
        ))}
      </div>

      {/* Panel content */}
      <div className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-white/10">
        <AnimatePresence mode="wait">

          {activeTab === "text" && (
            <motion.div key="text" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
              {[
                { key: "headline",  label: "Headline",              minH: "100px" },
                { key: "subtext",   label: "Subtext",               minH: "100px" },
                { key: "ctaText",   label: "Call to Action (CTA)",  minH: "60px"  },
              ].map(field => (
                <div key={field.key} className="space-y-2">
                  <label className="text-xs uppercase tracking-widest text-slate-400 font-bold">{field.label}</label>
                  <textarea
                    value={flyerData[field.key]}
                    onChange={e => handleUpdate(field.key, e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 resize-none font-medium"
                    style={{ minHeight: field.minH }}
                  />
                </div>
              ))}

              <div className="pt-4 border-t border-white/5 space-y-4">
                {[
                  { key: "brandName", label: "Brand Name" },
                  { key: "website",   label: "Website"    },
                ].map(field => (
                  <div key={field.key} className="space-y-2">
                    <label className="text-xs uppercase tracking-widest text-slate-400 font-bold">{field.label}</label>
                    <textarea
                      value={flyerData[field.key]}
                      onChange={e => handleUpdate(field.key, e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 min-h-[60px] resize-none text-sm font-medium"
                    />
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t border-white/5 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs uppercase tracking-widest text-slate-400 font-bold">Additional Text</label>
                  <button
                    onClick={() => handleUpdate("extraText", flyerData.extraText ? flyerData.extraText + "\nNew Text Block" : "New Text Block")}
                    className="text-xs font-bold text-cyan-400 hover:text-cyan-300 px-2 py-1 bg-cyan-400/10 rounded-md transition-colors"
                  >
                    + Add Text
                  </button>
                </div>
                <textarea
                  value={flyerData.extraText}
                  onChange={e => handleUpdate("extraText", e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 min-h-[80px] resize-none text-sm"
                />
              </div>
            </motion.div>
          )}

          {activeTab === "image" && (
            <motion.div key="image" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
              <div className="space-y-4">
                <label className="text-xs uppercase tracking-widest text-slate-400 font-bold">Product Image</label>
                <div className="w-full aspect-square bg-[#030712] rounded-2xl border-2 border-dashed border-white/10 flex flex-col items-center justify-center gap-4 relative overflow-hidden group">
                  {flyerData.productImage ? (
                    <>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={flyerData.productImage} alt="Product" className="w-full h-full object-contain p-4" />
                      <div className="absolute inset-0 bg-[#030712]/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <button
                          onClick={() => handleUpdate("productImage", "https://picsum.photos/seed/newproduct/800/800")}
                          className="px-4 py-2 bg-white text-black rounded-full font-bold text-sm shadow-xl"
                        >
                          Replace Image
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center">
                        <Upload className="w-6 h-6 text-slate-400" />
                      </div>
                      <div className="text-center">
                        <p className="font-medium text-white mb-1">Upload new image</p>
                        <p className="text-sm text-slate-500">PNG, JPG up to 10MB</p>
                      </div>
                    </>
                  )}
                </div>
              </div>
              <div className="p-4 bg-cyan-950/30 border border-cyan-500/20 rounded-xl">
                <p className="text-sm text-cyan-200">
                  <strong>AI Tip:</strong> Use an image with a transparent background (.PNG) for best results. The template automatically applies object-fit: contain to scale perfectly.
                </p>
              </div>
            </motion.div>
          )}

          {activeTab === "colors" && (
            <motion.div key="colors" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-8">
              <div className="space-y-4">
                <label className="text-xs uppercase tracking-widest text-slate-400 font-bold">Smart Color Layers</label>
                <div className="flex bg-white/5 rounded-xl p-1 gap-1">
                  {[
                    { id: "primary",   label: "Background"    },
                    { id: "secondary", label: "Text/Headline" },
                    { id: "accent",    label: "Accent/CTA"    },
                  ].map(layer => (
                    <button
                      key={layer.id}
                      onClick={() => setActiveColorLayer(layer.id as any)}
                      className={`flex-1 py-3 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors ${
                        activeColorLayer === layer.id ? "bg-white/10 text-white" : "text-slate-400 hover:text-white"
                      }`}
                    >
                      {layer.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-xs uppercase tracking-widest text-slate-400 font-bold">Palette</label>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full border border-white/20" style={{ backgroundColor: flyerData.colors[activeColorLayer] }} />
                    <span className="text-xs font-mono text-slate-300">{flyerData.colors[activeColorLayer]}</span>
                  </div>
                </div>
                <div className="grid grid-cols-5 gap-3">
                  {PRESET_COLORS.map(color => (
                    <button
                      key={color.name}
                      onClick={() => handleColorUpdate(activeColorLayer, color.value)}
                      className="w-full aspect-square rounded-full border-2 hover:scale-110 transition-transform relative focus:outline-none"
                      style={{
                        backgroundColor: color.value,
                        borderColor: flyerData.colors[activeColorLayer] === color.value ? "white" : "transparent",
                        boxShadow: flyerData.colors[activeColorLayer] === color.value ? "0 0 0 2px rgba(255,255,255,0.2)" : "none"
                      }}
                      title={color.name}
                    >
                      {flyerData.colors[activeColorLayer] === color.value && (
                        <Check className={`absolute inset-0 m-auto w-4 h-4 ${["#ffffff","#ffd700","#00ffff"].includes(color.value) ? "text-black" : "text-white"}`} />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t border-white/5">
                <label className="text-xs uppercase tracking-widest text-slate-400 font-bold">Custom Color</label>
                <div className="flex items-center gap-4 bg-white/5 p-4 rounded-xl border border-white/10">
                  <input
                    type="color"
                    value={flyerData.colors[activeColorLayer]}
                    onChange={e => handleColorUpdate(activeColorLayer, e.target.value)}
                    className="w-12 h-12 rounded cursor-pointer border-0 p-0 bg-transparent"
                  />
                  <input
                    type="text"
                    value={flyerData.colors[activeColorLayer]}
                    onChange={e => handleColorUpdate(activeColorLayer, e.target.value)}
                    className="flex-1 bg-transparent border-b border-white/20 text-white font-mono focus:outline-none focus:border-cyan-400 px-2 py-1 uppercase"
                  />
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "template" && (
            <motion.div key="template" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-4">
              <label className="text-xs uppercase tracking-widest text-slate-400 font-bold block mb-4">Template Layouts</label>
              <div className="space-y-3">
                {TEMPLATES.map(template => (
                  <button
                    key={template.id}
                    onClick={() => {
                      handleUpdate("templateVariant", template.variant);
                      handleUpdate("templateCategory", template.category);
                    }}
                    className={`w-full p-4 rounded-xl border flex items-center justify-between transition-all ${
                      flyerData.templateVariant === template.variant
                        ? "border-cyan-400 bg-cyan-950/20 shadow-[0_0_15px_rgba(34,211,238,0.1)]"
                        : "border-white/5 bg-white/5 hover:border-white/20"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${flyerData.templateVariant === template.variant ? "bg-cyan-400 text-black" : "bg-white/10 text-white"}`}>
                        <LayoutTemplate className="w-4 h-4" />
                      </div>
                      <span className="font-medium text-left text-sm whitespace-nowrap">{template.name}</span>
                    </div>
                    {flyerData.templateVariant === template.variant && (
                      <Check className="w-5 h-5 text-cyan-400 ml-2" />
                    )}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────

function EditorContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [flyerData, setFlyerData] = useState({
    headline:         "NEW\nCOLLECTION",
    subtext:          "Experience the ultimate luxury. Crafted with precision.",
    ctaText:          "Shop Now",
    badgeText:        "40%\nOFF",
    extraText:        "Quality, Safe, and Verified.",
    productImage:     "",
    brandName:        "INRASTUDIO",
    website:          "INRASTUDIO.COM",
    instagram:        "@INRASTUDIO",
    templateVariant:  "Black Gold",
    templateCategory: "Luxury Product" as "Luxury Product" | "Sale Promotion" | "Minimal Product" | "Premium Brand",
    colors: { primary: "#000000", secondary: "#ffffff", accent: "#ffd700" },
  });

  // Simulated generated assets — replace with real API state
  const [assets, setAssets] = useState<GeneratedAssets>({
    videoUrl: null,
    captions: [],
    status: "idle",
  });

  // RIGHT PANEL: which view is open
  const [rightView, setRightView] = useState<"preview" | "media">("preview");

  useEffect(() => {
    const savedImage = sessionStorage.getItem("campaignImage");
    if (!savedImage) { router.push("/dashboard"); return; }
    const variantQuery  = searchParams.get("variant");
    const categoryQuery = searchParams.get("category") as any;
    const timer = setTimeout(() => {
      setFlyerData(prev => ({
        ...prev,
        productImage: savedImage,
        ...(variantQuery  && { templateVariant: variantQuery }),
        ...(categoryQuery && { templateCategory: categoryQuery }),
      }));
      // Simulate auto-generation on load
      triggerGeneration();
    }, 0);
    return () => clearTimeout(timer);
  }, [searchParams, router]);

  // ── Backend hook: call your real API here ──────────────────────────────────
  // Replace this mock with a real fetch to your backend.
  // Expected response shape:
  //   { videoUrl: string, captions: { platform: string, text: string }[] }
  const triggerGeneration = () => {
    setAssets({ videoUrl: null, captions: [], status: "generating" });
    setTimeout(() => {
      setAssets({
        status:   "done",
        videoUrl: "/mock-video.mp4",   // replace with real URL from backend
        captions: [
          {
            platform: "Instagram",
            text: "✨ Elevate your style with our NEW COLLECTION. Precision-crafted luxury, now available. Tap the link in bio to shop.\n\n#NewCollection #LuxuryFashion #INRASTUDIO",
          },
          {
            platform: "TikTok",
            text: "POV: You just discovered the collection everyone's talking about 🔥 New drop from @inrastudio is here — shop now before it sells out!",
          },
          {
            platform: "Twitter",
            text: "Our NEW COLLECTION just dropped. Crafted for those who settle for nothing but the best. Shop now → INRASTUDIO.COM",
          },
          {
            platform: "Facebook",
            text: "Introducing our NEW COLLECTION — a statement of precision and luxury. Visit INRASTUDIO.COM to explore the full range.",
          },
        ],
      });
    }, 3000);
  };
  // ──────────────────────────────────────────────────────────────────────────

  const renderTemplate = () => {
    const props = {
      name: flyerData.templateVariant, headline: flyerData.headline,
      subtext: flyerData.subtext, ctaText: flyerData.ctaText,
      badgeText: flyerData.badgeText, extraText: flyerData.extraText,
      productImage: flyerData.productImage, brandName: flyerData.brandName,
      website: flyerData.website, colors: flyerData.colors,
    };
    switch (flyerData.templateCategory) {
      case "Sale Promotion":  return <SalePromotionTemplate  {...props} />;
      case "Minimal Product": return <MinimalProductTemplate {...props} />;
      case "Premium Brand":   return <PremiumBrandTemplate   {...props} />;
      default:                return <LuxuryProductTemplate  {...props} instagram={flyerData.instagram} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#030712] text-slate-50 font-sans flex flex-col h-screen overflow-hidden">

      {/* ── Top Navbar ─────────────────────────────────────────────────────── */}
      <header className="h-[72px] shrink-0 border-b border-white/5 bg-[#0a1128]/95 backdrop-blur-md px-6 flex items-center justify-between z-30">
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="w-10 h-10 rounded-full hover:bg-white/5 flex items-center justify-center transition-colors">
            <ArrowLeft className="w-5 h-5 text-slate-400" />
          </Link>
          <div className="flex items-center gap-2">
            <Logo className="w-6 h-6 rounded-md" />
            <span className="font-display font-medium tracking-widest text-white">EDITOR</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Video & Captions toggle */}
          <button
            onClick={() => setRightView(v => v === "media" ? "preview" : "media")}
            className={`relative px-5 py-2.5 rounded-full font-bold text-sm transition-all flex items-center gap-2 ${
              rightView === "media"
                ? "bg-white/10 text-white border border-white/20"
                : "text-slate-300 hover:text-white hover:bg-white/5"
            }`}
          >
            <FileVideo className="w-4 h-4" />
            Video & Captions
            {assets.status === "done" && <DotBadge />}
          </button>

          <button className="px-6 py-2.5 rounded-full font-medium text-sm text-slate-300 hover:text-white hover:bg-white/5 transition-colors">
            Save Draft
          </button>
          <button className="px-6 py-2.5 rounded-full font-bold text-sm bg-cyan-400 hover:bg-cyan-300 text-[#0a1128] transition-all flex items-center gap-2 shadow-[0_0_15px_rgba(34,211,238,0.3)]">
            <Download className="w-4 h-4" /> Download
          </button>
        </div>
      </header>

      {/* ── Main layout ────────────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-row overflow-hidden relative">

        {/* Left: Editor panel */}
        <aside className="w-[340px] xl:w-[380px] shrink-0 bg-[#0a1128]/80 border-r border-white/5 flex flex-col overflow-hidden z-20">
          <EditorPanel flyerData={flyerData} setFlyerData={setFlyerData} />
        </aside>

        {/* Centre: Flyer preview */}
        <section className="flex-1 bg-[#030712] relative overflow-hidden flex items-center justify-center p-6 md:p-12 z-10 transition-all duration-300">
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage:
                "linear-gradient(45deg,#fff 25%,transparent 25%),linear-gradient(-45deg,#fff 25%,transparent 25%),linear-gradient(45deg,transparent 75%,#fff 75%),linear-gradient(-45deg,transparent 75%,#fff 75%)",
              backgroundSize: "20px 20px",
              backgroundPosition: "0 0,0 10px,10px -10px,-10px 0px",
            }}
          />
          <div className="w-full max-w-[520px] aspect-[4/5] bg-black shadow-2xl relative border-4 border-[#0a1128] rounded-xl overflow-hidden">
            {renderTemplate()}
          </div>
        </section>

        {/* Right: Video & Captions panel (slides in) */}
        <AnimatePresence>
          {rightView === "media" && (
            <motion.aside
              key="media-panel"
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 380, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ type: "spring", damping: 28, stiffness: 220 }}
              className="shrink-0 bg-[#0a1128]/90 border-l border-white/5 flex flex-col overflow-hidden z-20"
              style={{ minWidth: 0 }}
            >
              <MediaPanel assets={assets} onRegenerate={triggerGeneration} />
            </motion.aside>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}

export default function FlyerEditor() {
  return (
    <Suspense fallback={
      <div className="h-screen w-screen bg-[#030712] flex items-center justify-center text-cyan-400 font-mono tracking-widest text-sm">
        LOADING EDITOR…
      </div>
    }>
      <EditorContent />
    </Suspense>
  );
}
