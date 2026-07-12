"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  Home, 
  LayoutTemplate, 
  Settings, 
  Crown,
  LogOut,
  Menu,
  X,
  History,
  Sparkles
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Logo } from "@/components/Logo";
import Image from "next/image";
import { LuxuryProductTemplate } from "@/components/templates/LuxuryProduct";
import { SalePromotionTemplate } from "@/components/templates/SalePromotion";
import { SleekFlyerTemplate as MinimalProductTemplate } from "@/components/templates/MinimalProduct";
import { PremiumBrandTemplate } from "@/components/templates/PremiumBrand";
import { LUXURY_VARIATIONS, SALE_PROMOTION_VARIATIONS, MINIMAL_PRODUCT_VARIATIONS, PREMIUM_BRAND_VARIATIONS } from "@/lib/template-data";

function Sidebar({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-[#030712]/80 backdrop-blur-sm z-40 lg:hidden"
            onClick={onClose}
          />
        )}
      </AnimatePresence>
      <motion.aside 
        className={`fixed top-0 left-0 bottom-0 w-64 bg-[#0a1128] border-r border-white/5 z-50 flex flex-col transition-transform lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="p-6 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Logo className="w-8 h-8 rounded-lg" />
            <span className="font-display font-medium text-xl tracking-widest text-white">INRASTUDIO</span>
          </Link>
          <button className="lg:hidden text-slate-400 hover:text-white" onClick={onClose}>
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-6 px-4 flex flex-col gap-1">
          <Link href="/dashboard" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 text-slate-400 hover:text-white font-medium transition-colors">
            <Home className="w-5 h-5" /> Dashboard
          </Link>
          <Link href="/dashboard/templates" className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/10 text-white font-medium transition-colors">
            <LayoutTemplate className="w-5 h-5 text-cyan-400" /> Templates
          </Link>
          <Link href="#" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 text-slate-400 hover:text-white font-medium transition-colors">
            <History className="w-5 h-5" /> Campaigns
          </Link>
          <Link href="/dashboard/settings" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 text-slate-400 hover:text-white font-medium transition-colors">
            <Settings className="w-5 h-5" /> Settings
          </Link>
        </div>

        <div className="p-4 border-t border-white/5">
          <Link href="/pricing" className="flex items-center gap-3 px-4 py-3 mb-2 rounded-xl bg-gradient-to-r from-amber-500/10 to-transparent hover:bg-amber-500/20 text-amber-400 font-medium transition-colors border border-amber-500/20 shadow-[0_0_15px_rgba(245,158,11,0.1)]">
            <Crown className="w-5 h-5" /> Upgrade to Pro
          </Link>
          <button className="flex items-center gap-3 px-4 py-3 w-full rounded-xl hover:bg-red-500/10 text-slate-400 hover:text-red-400 font-medium transition-colors text-left">
            <LogOut className="w-5 h-5" /> Sign Out
          </button>
        </div>
      </motion.aside>
    </>
  );
}

const TEMPLATE_CATEGORIES = [
  {
    title: "Sale Promotion",
    description: "Best for fashion vendors, food businesses, supermarkets, beauty stores, and online retailers.",
    templates: SALE_PROMOTION_VARIATIONS.map(v => v.name)
  },
  {
    title: "Luxury Product",
    description: "Best for perfume sellers, skincare brands, jewelry sellers, luxury fashion, and watches.",
    templates: LUXURY_VARIATIONS.map(v => v.name)
  },
  {
    title: "Minimal Product",
    description: "Best for cosmetics, tech gadgets, small online stores, and modern fashion brands.",
    templates: MINIMAL_PRODUCT_VARIATIONS.map(v => v.name)
  },
  {
    title: "Premium Brand",
    description: "Best for established businesses, salons, restaurants, real estate, and agencies.",
    templates: PREMIUM_BRAND_VARIATIONS.map(v => v.name)
  }
];

export default function TemplatesPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [campaignImage, setCampaignImage] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const saved = sessionStorage.getItem("campaignImage");
    if (saved) {
      const timer = setTimeout(() => {
        setCampaignImage(saved);
      }, 0);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleUseTemplate = (templateName: string, categoryName: string) => {
    if (!campaignImage) {
      router.push("/dashboard");
    } else {
      router.push(`/dashboard/editor?variant=${encodeURIComponent(templateName)}&category=${encodeURIComponent(categoryName)}`);
    }
  };

  return (
    <div className="min-h-screen bg-[#030712] text-slate-50 font-sans selection:bg-cyan-500 selection:text-white flex">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="flex-1 lg:ml-64 relative min-h-screen">
        <header className="lg:hidden flex items-center justify-between p-4 border-b border-white/5 bg-[#0a1128]/80 backdrop-blur-md sticky top-0 z-30">
          <div className="flex items-center gap-2">
            <Logo className="w-6 h-6 rounded-md" />
            <span className="font-display font-medium text-lg tracking-widest text-white">INRASTUDIO</span>
          </div>
          <button onClick={() => setSidebarOpen(true)} className="p-2 text-slate-300">
            <Menu className="w-6 h-6" />
          </button>
        </header>

        <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-12">
          
          <div>
            <h1 className="text-3xl md:text-4xl font-display font-bold text-white tracking-tight mb-3">Templates Gallery</h1>
            <p className="text-slate-400 text-sm md:text-base max-w-2xl">Browse our curated collection of templates designed specifically for your marketing objectives. Just swap images, colors, and text to make it yours.</p>
          </div>

          <section>
            <div className="flex items-center gap-2 mb-6">
               <Sparkles className="w-5 h-5 text-cyan-400" />
               <h2 className="text-xl font-display font-semibold text-white tracking-tight">Most Used Templates</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
               {[
                 { name: "Digital Agency", category: "Premium Brand", templateType: PremiumBrandTemplate, data: PREMIUM_BRAND_VARIATIONS.find(v => v.name === "Digital Agency")! },
                 { name: "Combo Offer", category: "Sale Promotion", templateType: SalePromotionTemplate, data: SALE_PROMOTION_VARIATIONS.find(v => v.name === "Combo Offer")! },
                 { name: "Black Gold", category: "Luxury Product", templateType: LuxuryProductTemplate, data: LUXURY_VARIATIONS.find(v => v.name === "Black Gold")! }
               ].map((item, i) => {
                 const TemplateComp = item.templateType as any;
                 return (
                 <div key={item.name} className="group relative rounded-2xl overflow-hidden bg-white/5 border border-white/10 aspect-[4/5] cursor-pointer hover:border-cyan-400/50 transition-colors shadow-lg">
                    <div className="w-full h-full pointer-events-none select-none relative">
                       <TemplateComp {...item.data} productImage={campaignImage || item.data.productImage} />
                    </div>
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6 z-[60]">
                       <button onClick={() => handleUseTemplate(item.name, item.category)} className="block text-center text-sm font-semibold text-[#0a1128] hover:bg-cyan-300 w-full bg-cyan-400 rounded-xl py-3 backdrop-blur-md translate-y-4 group-hover:translate-y-0 transition-all duration-300 pointer-events-auto shadow-xl">
                          Use Template
                       </button>
                    </div>
                    <div className="absolute top-4 left-4 z-[70] bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 pointer-events-none">
                       <span className="text-xs uppercase font-bold tracking-widest text-[#ffffff]">{item.category}</span>
                    </div>
                 </div>
               )})}
            </div>
          </section>

          <div className="space-y-16">
            {TEMPLATE_CATEGORIES.map((category, index) => (
              <section key={category.title}>
                <div className="mb-6">
                  <h2 className="text-2xl font-display font-semibold text-white mb-2">{category.title}</h2>
                  <p className="text-slate-400 text-sm">{category.description}</p>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
                  {category.templates.map((templateName, idx) => (
                    <div key={templateName} className="group relative rounded-2xl overflow-hidden bg-white/5 border border-white/5 aspect-[4/5] cursor-pointer hover:border-white/20 transition-colors">
                      {category.title === "Luxury Product" || category.title === "Sale Promotion" || category.title === "Minimal Product" || category.title === "Premium Brand" ? (
                        <div className="w-full h-full pointer-events-none select-none relative">
                          {category.title === "Luxury Product" ? (
                            <LuxuryProductTemplate {...LUXURY_VARIATIONS[idx]} productImage={campaignImage || LUXURY_VARIATIONS[idx].productImage} />
                          ) : category.title === "Sale Promotion" ? (
                            <SalePromotionTemplate {...SALE_PROMOTION_VARIATIONS[idx]} productImage={campaignImage || SALE_PROMOTION_VARIATIONS[idx].productImage} />
                          ) : category.title === "Minimal Product" ? (
                            <MinimalProductTemplate {...MINIMAL_PRODUCT_VARIATIONS[idx]} productImage={campaignImage || MINIMAL_PRODUCT_VARIATIONS[idx].productImage} />
                          ) : category.title === "Premium Brand" ? (
                            <PremiumBrandTemplate {...PREMIUM_BRAND_VARIATIONS[idx]} productImage={campaignImage || PREMIUM_BRAND_VARIATIONS[idx].productImage} />
                          ) : null}
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6 z-[60]">
                             <button onClick={() => handleUseTemplate(templateName, category.title)} className="block text-center text-xs font-semibold text-[#0a1128] hover:bg-cyan-300 w-full bg-cyan-400 rounded-xl py-2.5 backdrop-blur-md translate-y-4 group-hover:translate-y-0 transition-all duration-300 pointer-events-auto">
                               Use Template
                             </button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <Image 
                            src={campaignImage || `https://picsum.photos/seed/${category.title.replace(/\s+/g, '')}${idx}/400/500`} 
                            alt={templateName} 
                            unoptimized
                            fill 
                            className="object-cover opacity-60 group-hover:opacity-100 transition-opacity duration-500 scale-100 group-hover:scale-105" 
                            referrerPolicy="no-referrer" 
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-[#0a1128] via-transparent to-transparent opacity-80" />
                          <div className="absolute inset-0 p-5 flex flex-col justify-end opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                             <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-4 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                               <h3 className="text-white font-medium text-sm mb-1">{templateName}</h3>
                               <button onClick={() => handleUseTemplate(templateName, category.title)} className="block text-center text-xs font-semibold text-[#0a1128] hover:bg-cyan-300 w-full mt-2 bg-cyan-400 rounded-lg py-2">Use Template</button>
                             </div>
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            ))}
          </div>

        </div>
      </main>
    </div>
  );
}
