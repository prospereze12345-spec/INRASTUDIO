"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { 
  ArrowLeft, Download, Image as ImageIcon, Type, Palette, 
  LayoutTemplate, X, Upload, Check, ChevronRight
} from "lucide-react";
import { LuxuryProductTemplate } from "@/components/templates/LuxuryProduct";
import { SalePromotionTemplate } from "@/components/templates/SalePromotion";
import { MinimalProductTemplate } from "@/components/templates/MinimalProduct";
import { PremiumBrandTemplate } from "@/components/templates/PremiumBrand";
import { LUXURY_VARIATIONS, SALE_PROMOTION_VARIATIONS, MINIMAL_PRODUCT_VARIATIONS, PREMIUM_BRAND_VARIATIONS } from "@/lib/template-data";
import { Logo } from "@/components/Logo";

const PRESET_COLORS = [
  { name: "Black", value: "#000000" },
  { name: "White", value: "#ffffff" },
  { name: "Gold", value: "#ffd700" },
  { name: "Navy", value: "#000080" },
  { name: "Royal Blue", value: "#4169e1" },
  { name: "Purple", value: "#800080" },
  { name: "Pink", value: "#ffc0cb" },
  { name: "Red", value: "#ff0000" },
  { name: "Orange", value: "#ffa500" },
  { name: "Yellow", value: "#ffff00" },
  { name: "Green", value: "#008000" },
  { name: "Teal", value: "#008080" },
  { name: "Cyan", value: "#00ffff" },
  { name: "Gray", value: "#808080" },
  { name: "Brown", value: "#a52a2a" },
];

const TEMPLATES = [
  ...LUXURY_VARIATIONS.map((v, i) => ({ id: `luxury${i}`, name: v.name, variant: v.name, category: "Luxury Product" })),
  ...SALE_PROMOTION_VARIATIONS.map((v, i) => ({ id: `sale${i}`, name: v.name, variant: v.name, category: "Sale Promotion" })),
  ...MINIMAL_PRODUCT_VARIATIONS.map((v, i) => ({ id: `minimal${i}`, name: v.name, variant: v.name, category: "Minimal Product" })),
  ...PREMIUM_BRAND_VARIATIONS.map((v, i) => ({ id: `premium${i}`, name: v.name, variant: v.name, category: "Premium Brand" }))
];

function EditorContent() {
  const [activeTab, setActiveTab] = useState<"text" | "image" | "colors" | "template">("text");
  const searchParams = useSearchParams();
  const router = useRouter();
  
  // State for flyer details
  const [flyerData, setFlyerData] = useState({
    headline: "NEW\nCOLLECTION",
    subtext: "Experience the ultimate luxury. Crafted with precision.",
    ctaText: "Shop Now",
    badgeText: "40%\nOFF",
    extraText: "Quality, Safe, and Verified.",
    productImage: "",
    brandName: "INRASTUDIO",
    website: "INRASTUDIO.COM",
    instagram: "@INRASTUDIO",
    templateVariant: "Black Gold",
    templateCategory: "Luxury Product" as "Luxury Product" | "Sale Promotion" | "Minimal Product" | "Premium Brand",
    colors: {
      primary: "#000000",
      secondary: "#ffffff",
      accent: "#ffd700",
    }
  });

  useEffect(() => {
    // Load image from session storage
    const savedImage = sessionStorage.getItem("campaignImage");
    
    if (!savedImage) {
      router.push("/dashboard");
      return;
    }
    
    // Load variant from URL or fallback
    const variantQuery = searchParams.get("variant");
    const categoryQuery = searchParams.get("category") as any;
    
    const timer = setTimeout(() => {
      setFlyerData(prev => ({
        ...prev,
        productImage: savedImage,
        ...(variantQuery && { templateVariant: variantQuery }),
        ...(categoryQuery && { templateCategory: categoryQuery })
      }));
    }, 0);
    return () => clearTimeout(timer);
  }, [searchParams, router]);

  const [activeColorLayer, setActiveColorLayer] = useState<"primary" | "secondary" | "accent">("primary");

  const handleUpdate = (key: string, value: any) => {
    setFlyerData(prev => ({ ...prev, [key]: value }));
  };

  const handleColorUpdate = (layer: "primary" | "secondary" | "accent", color: string) => {
    setFlyerData(prev => ({
      ...prev,
      colors: {
        ...prev.colors,
        [layer]: color
      }
    }));
  };

  const handleAddText = () => {
    setFlyerData(prev => ({
      ...prev,
      extraText: prev.extraText ? prev.extraText + "\nNew Text Block" : "New Text Block"
    }));
  };

  return (
    <div className="min-h-screen bg-[#030712] text-slate-50 font-sans flex flex-col h-screen overflow-hidden">
      {/* Top Navbar */}
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
          <button className="px-6 py-2.5 rounded-full font-medium text-sm text-slate-300 hover:text-white hover:bg-white/5 transition-colors">
            Save Draft
          </button>
          <button className="px-6 py-2.5 rounded-full font-bold text-sm bg-cyan-400 hover:bg-cyan-300 text-[#0a1128] transition-all flex items-center gap-2 shadow-[0_0_15px_rgba(34,211,238,0.3)]">
            <Download className="w-4 h-4" /> Download
          </button>
        </div>
      </header>

      {/* Main Layout */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden relative">
        
        {/* Editor Panel (Left) */}
        <aside className="w-full md:w-[400px] shrink-0 bg-[#0a1128]/80 border-r border-white/5 flex flex-col overflow-hidden relative z-20">
          
          {/* Tabs */}
          <div className="flex border-b border-white/5">
            {[
              { id: "text", icon: Type, label: "Text" },
              { id: "image", icon: ImageIcon, label: "Image" },
              { id: "colors", icon: Palette, label: "Colors" },
              { id: "template", icon: LayoutTemplate, label: "Layout" }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
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

          {/* Panel Content (Scrollable) */}
          <div className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-white/10">
            <AnimatePresence mode="wait">
              {activeTab === "text" && (
                <motion.div
                  key="text"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-6"
                >
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-widest text-slate-400 font-bold">Headline</label>
                    <textarea 
                      value={flyerData.headline}
                      onChange={(e) => handleUpdate("headline", e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 min-h-[100px] resize-none font-medium"
                      placeholder="Enter headline..."
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-widest text-slate-400 font-bold">Subtext</label>
                    <textarea 
                      value={flyerData.subtext}
                      onChange={(e) => handleUpdate("subtext", e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 min-h-[100px] resize-none text-sm"
                      placeholder="Enter details..."
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-widest text-slate-400 font-bold">Call to Action (CTA)</label>
                    <textarea 
                      value={flyerData.ctaText}
                      onChange={(e) => handleUpdate("ctaText", e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 min-h-[60px] resize-none text-sm font-medium"
                      placeholder="e.g. SHOP NOW"
                    />
                  </div>

                  <div className="space-y-2 pt-4 border-t border-white/5">
                    <label className="text-xs uppercase tracking-widest text-slate-400 font-bold">Brand Name</label>
                    <textarea 
                      value={flyerData.brandName}
                      onChange={(e) => handleUpdate("brandName", e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 min-h-[60px] resize-none text-sm font-medium"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-widest text-slate-400 font-bold">Website</label>
                    <textarea 
                      value={flyerData.website}
                      onChange={(e) => handleUpdate("website", e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 min-h-[60px] resize-none text-sm font-medium"
                    />
                  </div>

                  <div className="space-y-2 pt-4 border-t border-white/5">
                    <div className="flex items-center justify-between">
                      <label className="text-xs uppercase tracking-widest text-slate-400 font-bold">Additional Text</label>
                      <button onClick={handleAddText} className="text-xs font-bold text-cyan-400 hover:text-cyan-300 px-2 py-1 bg-cyan-400/10 rounded-md transition-colors">
                        + Add Text
                      </button>
                    </div>
                    {flyerData.extraText !== undefined && (
                      <textarea 
                        value={flyerData.extraText}
                        onChange={(e) => handleUpdate("extraText", e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 min-h-[80px] resize-none text-sm"
                        placeholder="Enter extra promotional text..."
                      />
                    )}
                  </div>
                </motion.div>
              )}

              {activeTab === "image" && (
                <motion.div
                  key="image"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-6"
                >
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
                <motion.div
                  key="colors"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-8"
                >
                  <div className="space-y-4">
                    <label className="text-xs uppercase tracking-widest text-slate-400 font-bold">Smart Color Layers</label>
                    <div className="flex bg-white/5 rounded-xl p-1 gap-1">
                      {[
                        { id: "primary", label: "Background" },
                        { id: "secondary", label: "Text/Headline" },
                        { id: "accent", label: "Accent/CTA" }
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
                         <div 
                           className="w-6 h-6 rounded-full border border-white/20"
                           style={{ backgroundColor: flyerData.colors[activeColorLayer] }}
                         />
                         <span className="text-xs font-mono text-slate-300">{flyerData.colors[activeColorLayer]}</span>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-5 gap-3">
                      {PRESET_COLORS.map(color => (
                        <button
                          key={color.name}
                          onClick={() => handleColorUpdate(activeColorLayer, color.value)}
                          className="w-full aspect-square rounded-full border-2 border-transparent hover:scale-110 transition-transform relative focus:outline-none"
                          style={{ backgroundColor: color.value, borderColor: flyerData.colors[activeColorLayer] === color.value ? 'white' : 'transparent', boxShadow: flyerData.colors[activeColorLayer] === color.value ? '0 0 0 2px rgba(255,255,255,0.2)' : 'none' }}
                          title={color.name}
                        >
                          {flyerData.colors[activeColorLayer] === color.value && (
                            <Check className={`absolute inset-0 m-auto w-4 h-4 ${['#ffffff', '#ffd700', '#00ffff'].includes(color.value) ? 'text-black' : 'text-white'}`} />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4 pt-4 border-t border-white/5">
                    <label className="text-xs uppercase tracking-widest text-slate-400 font-bold flex items-center gap-2">
                       Custom Color
                    </label>
                    <div className="flex items-center gap-4 bg-white/5 p-4 rounded-xl border border-white/10">
                      <input 
                        type="color"
                        value={flyerData.colors[activeColorLayer]}
                        onChange={(e) => handleColorUpdate(activeColorLayer, e.target.value)}
                        className="w-12 h-12 rounded cursor-pointer border-0 p-0 bg-transparent"
                      />
                      <input 
                        type="text"
                        value={flyerData.colors[activeColorLayer]}
                        onChange={(e) => handleColorUpdate(activeColorLayer, e.target.value)}
                        className="flex-1 bg-transparent border-b border-white/20 text-white font-mono focus:outline-none focus:border-cyan-400 px-2 py-1 uppercase"
                      />
                    </div>
                  </div>

                </motion.div>
              )}

              {activeTab === "template" && (
                <motion.div
                  key="template"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-4"
                >
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
                           <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${flyerData.templateVariant === template.variant ? 'bg-cyan-400 text-black' : 'bg-white/10 text-white'}`}>
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
        </aside>

        {/* Live Preview Area (Right) */}
        <section className="flex-1 bg-[#030712] relative overflow-hidden flex items-center justify-center p-6 md:p-12 z-10">
           {/* Dark checkerboard background for transparency illusion */}
           <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(45deg, #fff 25%, transparent 25%), linear-gradient(-45deg, #fff 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #fff 75%), linear-gradient(-45deg, transparent 75%, #fff 75%)', backgroundSize: '20px 20px', backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px' }} />
           
           <div className="w-full max-w-[600px] aspect-[4/5] bg-black shadow-2xl relative border-4 border-[#0a1128] rounded-xl overflow-hidden transition-all duration-300">
             {flyerData.templateCategory === "Sale Promotion" ? (
               <SalePromotionTemplate 
                 name={flyerData.templateVariant}
                 headline={flyerData.headline}
                 subtext={flyerData.subtext}
                 ctaText={flyerData.ctaText}
                 badgeText={flyerData.badgeText}
                 extraText={flyerData.extraText}
                 productImage={flyerData.productImage}
                 brandName={flyerData.brandName}
                 website={flyerData.website}
                 colors={flyerData.colors}
               />
             ) : flyerData.templateCategory === "Minimal Product" ? (
               <MinimalProductTemplate
                 name={flyerData.templateVariant}
                 headline={flyerData.headline}
                 subtext={flyerData.subtext}
                 ctaText={flyerData.ctaText}
                 badgeText={flyerData.badgeText}
                 extraText={flyerData.extraText}
                 productImage={flyerData.productImage}
                 brandName={flyerData.brandName}
                 website={flyerData.website}
                 colors={flyerData.colors}
               />
             ) : flyerData.templateCategory === "Premium Brand" ? (
               <PremiumBrandTemplate
                 name={flyerData.templateVariant}
                 headline={flyerData.headline}
                 subtext={flyerData.subtext}
                 ctaText={flyerData.ctaText}
                 badgeText={flyerData.badgeText}
                 extraText={flyerData.extraText}
                 productImage={flyerData.productImage}
                 brandName={flyerData.brandName}
                 website={flyerData.website}
                 colors={flyerData.colors}
               />
             ) : (
               <LuxuryProductTemplate 
                 name={flyerData.templateVariant}
                 headline={flyerData.headline}
                 subtext={flyerData.subtext}
                 ctaText={flyerData.ctaText}
                 productImage={flyerData.productImage}
                 brandName={flyerData.brandName}
                 website={flyerData.website}
                 instagram={flyerData.instagram}
                 colors={flyerData.colors}
               />
             )}
           </div>
        </section>

      </div>
    </div>
  );
}

export default function FlyerEditor() {
  return (
    <Suspense fallback={<div className="h-screen w-screen bg-[#030712] flex items-center justify-center text-cyan-400 font-mono tracking-widest text-sm">LOADING EDITOR...</div>}>
      <EditorContent />
    </Suspense>
  );
}
