import React from "react";
import Image from "next/image";
import { Instagram, Globe, Phone, ShieldCheck, Droplet, Sparkles, CheckCircle2, ChevronRight, Leaf, Target } from "lucide-react";

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
  extraText?: string;
  instagram?: string;
  tiktok?: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
  };
}

export function LuxuryProductTemplate(props: LuxuryProductProps) {
  const { name = "Default" } = props;

  switch (name) {
    case "Black Gold": return <VariantBlackGold {...props} />;
    case "White Gold": return <VariantWhiteGold {...props} />;
    case "Navy Cyan": return <VariantNavyCyan {...props} />;
    case "Dark Marble": return <VariantDarkMarble {...props} />;
    case "Royal Purple": return <VariantRoyalPurple {...props} />;
    case "Emerald Green": return <VariantEmeraldGreen {...props} />;
    case "Soft Sage": return <VariantSoftSage {...props} />;
    case "Rose Blush": return <VariantRoseBlush {...props} />;
    case "Classic Monochrome": return <VariantClassicMonochrome {...props} />;
    case "Crimson Velvet": return <VariantCrimsonVelvet {...props} />;
    case "New Catalog": return <VariantNewCatalog {...props} />;
    case "Borcelle Skincare": return <VariantBorcelleSkincare {...props} />;
    default: return <VariantWhiteGold {...props} />;
  }
}

const VariantBlackGold = ({ headline, subtext, ctaText, productImage, brandName, website, instagram, colors }: LuxuryProductProps) => {
  const lines = headline.split("\n");
  return (
    <div className="@container w-full h-full relative overflow-hidden flex flex-col font-sans" style={{ backgroundColor: colors.primary, color: colors.secondary }}>
      <div className="flex justify-between items-center p-[4cqi] text-[2.5cqi] relative z-10 opacity-80 border-b" style={{ borderColor: `${colors.accent}40` }}>
        <span className="font-medium tracking-wide">{brandName}</span>
        <span className="font-medium">{instagram}</span>
      </div>
       <div className="px-[6cqi] pt-[6cqi] relative z-10 flex flex-col items-center text-center">
         {lines.length > 0 && <span className="font-serif italic text-[12cqi] leading-[0.8] mb-[2cqi]" style={{ color: colors.secondary }}>{lines[0]}</span>}
         {lines.length > 1 && <span className="font-display font-medium tracking-wide text-[10cqi] uppercase leading-[0.9]" style={{ color: colors.accent }}>{lines[1]}</span>}
       </div>
       <div className="flex-1 flex relative z-10 mt-[4cqi] w-full">
         <div className="absolute top-[8cqi] left-[8cqi] w-[18cqi] h-[18cqi] rounded-full flex flex-col items-center justify-center text-center -rotate-12 shadow-xl z-20" style={{ backgroundColor: colors.accent, color: colors.primary }}>
            <span className="text-[2.5cqi] font-bold uppercase leading-tight">Limited<br/>Release</span>
         </div>
         <div className="absolute inset-0 flex justify-center">
            <div className="w-[80cqi] h-full relative pl-[10cqi]">
               <Image src={productImage} alt="Product" fill className="object-contain object-bottom drop-shadow-[0_20px_20px_rgba(0,0,0,0.5)] z-10 scale-110" crossOrigin="anonymous" />
            </div>
         </div>
         <div className="absolute right-[6cqi] top-[30cqi] w-[35cqi] flex flex-col justify-center text-right z-30">
            <h3 className="font-bold text-[4.5cqi] mb-[2cqi] leading-tight uppercase font-display" style={{ color: colors.secondary }}>Premium<br/>Beauty<br/>Formula</h3>
            <p className="text-[2.5cqi] font-light leading-relaxed opacity-90">{subtext}</p>
         </div>
       </div>
       <div className="h-[15cqi] flex justify-between items-center px-[6cqi] border-t relative z-30 bg-black/20 backdrop-blur-md" style={{ borderColor: `${colors.accent}40` }}>
          <span className="font-bold text-[3.5cqi] uppercase tracking-wider w-1/2 leading-tight" style={{ color: colors.secondary }}>{ctaText}</span>
          <div className="flex flex-col items-end text-[2.5cqi] opacity-80">
            <span>{website}</span>
            <span>123 Anywhere St., Any City</span>
          </div>
       </div>
    </div>
  );
}

const VariantWhiteGold = ({ headline, subtext, ctaText, productImage, colors, website }: LuxuryProductProps) => {
  const parts = headline.split("\n");
  return (
    <div className="@container w-full h-full relative overflow-hidden font-sans" style={{ backgroundColor: colors.primary, color: colors.secondary }}>
       <div className="absolute top-0 left-[18cqi] w-[10cqi] h-full opacity-30 shadow-2xl" style={{ backgroundColor: colors.accent }} />
       <div className="absolute top-[10cqi] left-[6cqi] rotate-180" style={{ writingMode: 'vertical-rl' }}>
         <span className="text-[2.5cqi] tracking-[0.3em] font-bold uppercase opacity-60">PURE ESSENTIALS</span>
       </div>
       <div className="absolute top-[16cqi] right-[8cqi] text-right max-w-[65cqi] z-20">
          <h1 className="font-serif text-[12cqi] leading-none mb-[4cqi]" style={{ color: colors.secondary }}>
            <span className="font-sans font-light tracking-[0.1em] text-[5cqi] block mb-[1cqi]">{parts[0]}</span>
            {parts[1] || 'Perfume'}
          </h1>
          <p className="text-[2.5cqi] uppercase tracking-[0.15em] font-light leading-relaxed opacity-70 border-b pb-[4cqi]" style={{ borderColor: `${colors.accent}40` }}>
            {subtext}
          </p>
       </div>
       <div className="absolute bottom-[28cqi] left-1/2 -translate-x-[45%] w-[80cqi] h-[55cqi] z-10">
          <Image src={productImage} alt="Product" fill className="object-contain drop-shadow-[0_40px_40px_rgba(0,0,0,0.3)]" crossOrigin="anonymous" />
       </div>
       <button className="absolute top-[55cqi] right-[8cqi] px-[6cqi] py-[2.5cqi] font-bold text-[3cqi] tracking-widest shadow-xl uppercase z-20" style={{ background: `linear-gradient(45deg, ${colors.accent}, #fff)`, color: colors.primary }}>
         {ctaText}
       </button>
       <div className="absolute bottom-[-15cqi] left-1/2 -translate-x-1/2 w-[120cqi] h-[35cqi] rounded-t-[50cqi] z-0" style={{ backgroundColor: colors.accent, filter: "brightness(0.95)" }}>
          <div className="absolute bottom-[18cqi] w-full text-center text-[2.5cqi] tracking-widest uppercase opacity-80 font-bold" style={{ color: colors.primary }}>
             WWW.{website}
          </div>
       </div>
    </div>
  )
}

const VariantNavyCyan = ({ headline, subtext, ctaText, productImage, website, colors }: LuxuryProductProps) => {
  const lines = headline.split("\n");
  return (
    <div className="@container w-full h-full relative overflow-hidden flex flex-col font-sans" style={{ backgroundColor: "#f8fafc" }}>
       <div className="absolute top-0 left-[15cqi] right-[15cqi] h-full shadow-2xl" style={{ backgroundColor: colors.primary }} />
       <div className="relative z-10 pt-[15cqi] flex flex-col items-center px-[20cqi]">
         {lines.map((l, i) => (
           <h1 key={i} className="font-display text-[18cqi] font-black text-white uppercase leading-[0.85] tracking-tighter shadow-black drop-shadow-md">{l}</h1>
         ))}
         <p className="text-white text-[2.8cqi] text-center mt-[8cqi] opacity-90 leading-relaxed font-medium pb-[2cqi]">
           {subtext}
         </p>
       </div>
       <div className="relative z-20 flex-1 flex items-center justify-center w-full mt-[-5cqi]">
          <div className="w-[120cqi] h-[45cqi] relative">
             <Image src={productImage} alt="Product" fill className="object-contain drop-shadow-[0_30px_30px_rgba(0,0,0,0.4)]" crossOrigin="anonymous" />
          </div>
       </div>
       <div className="absolute bottom-0 w-full rounded-t-[3cqi] h-[12cqi] z-30 flex items-center justify-between px-[6cqi]" style={{ backgroundColor: '#06132b' }}>
          <button className="px-[6cqi] py-[2cqi] rounded-full text-[#0b2046] font-bold text-[3cqi] tracking-widest shadow-lg uppercase" style={{ backgroundColor: colors.accent }}>
            {ctaText}
          </button>
          <div className="flex bg-white text-[#0b2046] px-[4cqi] py-[1.5cqi] rounded-full text-[2.5cqi] font-bold items-center gap-[1cqi]">
             <Globe className="w-[3cqi] h-[3cqi]" /> {website}
          </div>
       </div>
    </div>
  )
}

const VariantDarkMarble = ({ headline, subtext, website, productImage, colors, brandName }: LuxuryProductProps) => {
  return (
    <div className="@container w-full h-full relative overflow-hidden flex flex-col font-serif" style={{ backgroundColor: colors.primary, color: colors.secondary }}>
      <div className="pt-[8cqi] flex flex-col items-center justify-center">
         <div className="w-[20cqi] h-[25cqi] rounded-t-[10cqi] border border-white/20 flex flex-col items-center justify-center relative bg-black/5">
            <span className="uppercase text-[2cqi] tracking-widest mb-[2cqi] opacity-80 font-sans">Est 2022</span>
            <div className="w-[10cqi] h-[10cqi] rounded-full border border-white/40 mb-[2cqi] flex items-center justify-center"><Sparkles className="w-[5cqi] h-[5cqi] stroke-1 opacity-70"/></div>
            <span className="uppercase text-[3.5cqi] tracking-widest font-sans font-bold">{brandName}</span>
         </div>
      </div>
      <div className="flex flex-col items-center text-center mt-[6cqi] relative z-10 px-[10cqi]">
        <h1 className="text-[14cqi] font-bold leading-[1.1] mb-[4cqi]" style={{ color: colors.secondary }}>
          {headline.split('\n').map((l, i) => <span key={i} className="block">{l}</span>)}
        </h1>
      </div>
      <div className="w-full py-[3cqi] text-center font-sans text-[3.8cqi] font-bold tracking-[0.2em] uppercase shadow-xl relative z-10" style={{ backgroundColor: colors.accent, color: colors.secondary }}>
        Quality, Safe, and Verified
      </div>
      <div className="text-center font-sans mt-[4cqi] text-[2.8cqi] opacity-80 relative z-10 px-[10cqi]">
        <p>{subtext?.split('.')[0]}</p>
        <p className="font-bold tracking-widest mt-[1cqi]">WWW.{website}</p>
      </div>
      <div className="flex-1 w-full relative mt-[2cqi] z-10">
         <Image src={productImage} alt="Product" fill className="object-contain object-bottom drop-shadow-[0_20px_30px_rgba(0,0,0,0.5)]" crossOrigin="anonymous" />
      </div>
      <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-[0.03] mix-blend-overlay" viewBox="0 0 100 100" preserveAspectRatio="none">
        <path d="M0,20 Q50,0 100,20 M0,80 Q50,100 100,80 M20,0 Q0,50 20,100 M80,0 Q100,50 80,100" fill="none" stroke="currentColor" strokeWidth="2" />
      </svg>
    </div>
  )
}

const VariantRoyalPurple = ({ headline, subtext, ctaText, productImage, website, colors }: LuxuryProductProps) => {
  const parts = subtext?.split('•').map(p => p.trim()) || [];
  return (
    <div className="@container w-full h-full relative overflow-hidden flex flex-col items-center justify-center font-sans" style={{ backgroundColor: colors.primary, color: colors.secondary }}>
       <div className="absolute inset-0 shadow-[inset_0_0_100px_rgba(0,0,0,0.9)] z-10 pointer-events-none" />
       <div className="absolute inset-0 opacity-20" style={{ background: `radial-gradient(circle at center, ${colors.accent} 0%, transparent 60%)` }} />
       
       <div className="relative z-20 text-center mt-[12cqi] flex flex-col items-center w-full px-[10cqi]">
         <h1 className="font-serif text-[11cqi] tracking-widest uppercase mb-[1cqi] opacity-90">{headline.split('\n')[0]}</h1>
         <h2 className="text-[3.5cqi] font-bold tracking-[0.3em] uppercase" style={{ color: colors.accent }}>{headline.split('\n')[1]}</h2>
       </div>

       <div className="w-full flex-1 relative mt-[8cqi] mb-[15cqi] z-20">
         <Image src={productImage} alt="Product" fill className="object-contain drop-shadow-[0_30px_30px_rgba(0,0,0,1)] z-20 scale-[1.15]" crossOrigin="anonymous" />
         
         <div className="absolute top-[10%] left-[6%] flex flex-col items-center text-center">
           <ShieldCheck className="w-[6cqi] h-[6cqi] mb-[1cqi]" style={{ color: colors.secondary }} />
           <span className="text-[2.2cqi] font-medium opacity-80 max-w-[20cqi]">{parts[0]}</span>
         </div>
         <div className="absolute top-[10%] right-[6%] flex flex-col items-center text-center">
           <Droplet className="w-[6cqi] h-[6cqi] mb-[1cqi]" style={{ color: colors.secondary }} />
           <span className="text-[2.2cqi] font-medium opacity-80 max-w-[20cqi]">{parts[1]}</span>
         </div>
         <div className="absolute bottom-[25%] left-[6%] flex flex-col items-center text-center">
           <Sparkles className="w-[6cqi] h-[6cqi] mb-[1cqi]" style={{ color: colors.secondary }} />
           <span className="text-[2.2cqi] font-medium opacity-80 max-w-[20cqi]">{parts[2] || 'Crystal'}</span>
         </div>
         <div className="absolute bottom-[25%] right-[6%] flex flex-col items-center text-center">
           <CheckCircle2 className="w-[6cqi] h-[6cqi] mb-[1cqi]" style={{ color: colors.secondary }} />
           <span className="text-[2.2cqi] font-medium opacity-80 max-w-[20cqi]">{parts[3] || 'Weight'}</span>
         </div>

         <div className="absolute bottom-[5%] left-1/2 -translate-x-1/2 w-[60cqi] h-[15cqi] shadow-[0_-20px_50px_rgba(0,0,0,0.5)] z-10" style={{ backgroundColor: '#222', clipPath: "polygon(20% 0%, 80% 0%, 100% 100%, 0% 100%)", borderBottom: `2px solid ${colors.accent}` }} />
       </div>

       <div className="absolute bottom-[12cqi] z-30">
          <button className="px-[10cqi] py-[3cqi] rounded-full font-bold text-[3.5cqi] tracking-widest shadow-[0_0_30px_rgba(0,0,0,0.5)] uppercase" style={{ backgroundColor: colors.accent, color: colors.primary }}>
            {ctaText}
          </button>
       </div>
       <div className="absolute bottom-[4cqi] z-30 text-[2.5cqi] tracking-[0.2em] font-medium opacity-50 uppercase">
          WWW.{website}
       </div>
    </div>
  )
}

const VariantEmeraldGreen = ({ headline, subtext, ctaText, productImage, brandName, colors }: LuxuryProductProps) => {
  return (
    <div className="@container w-full h-full relative overflow-hidden flex flex-col font-serif" style={{ backgroundColor: colors.primary, color: colors.secondary }}>
      <div className="pt-[10cqi] px-[10cqi] text-center relative z-10">
        <h1 className="text-[9cqi] font-bold tracking-wider uppercase mb-[2cqi]" style={{ color: colors.secondary }}>
          {headline.replace('\n', ' ')}
        </h1>
      </div>
      
      <div className="flex-1 w-full relative z-10">
        <Image src={productImage} alt="Product" fill className="object-contain drop-shadow-xl p-[10cqi] scale-110" crossOrigin="anonymous" />
        
        <div className="absolute top-[20%] left-[10%] flex items-center gap-[2cqi]">
           <span className="font-serif italic text-[3.5cqi]" style={{ color: colors.accent }}>Sturdy Handle</span>
           <div className="w-[10cqi] h-[1px] rotate-45 origin-left" style={{ backgroundColor: colors.accent }} />
        </div>
        <div className="absolute bottom-[35%] left-[5%] flex items-center gap-[2cqi]">
           <span className="font-serif italic text-[3.5cqi]" style={{ color: colors.accent }}>Vegan Leather</span>
           <div className="w-[12cqi] h-[1px] -rotate-12 origin-left" style={{ backgroundColor: colors.accent }} />
        </div>
        <div className="absolute top-[40%] right-[10%] flex items-center gap-[2cqi] flex-row-reverse">
           <span className="font-serif italic text-[3.5cqi]" style={{ color: colors.accent }}>Statement Tassel</span>
           <div className="w-[12cqi] h-[1px] rotate-[160deg] origin-right" style={{ backgroundColor: colors.accent }} />
        </div>
      </div>

      <div className="px-[12cqi] text-center pb-[12cqi] relative z-10">
         <p className="font-sans text-[2.5cqi] font-medium tracking-wide leading-relaxed mb-[6cqi]" style={{ color: colors.secondary }}>
           {subtext}
         </p>
         <div className="flex justify-between items-center font-sans text-[2.5cqi] font-bold uppercase tracking-widest border-t pt-[4cqi]" style={{ borderColor: `${colors.secondary}30` }}>
            <span>{brandName}</span>
            <span style={{ color: colors.accent }}>{ctaText}</span>
         </div>
      </div>
      <div className="absolute inset-0 opacity-[0.03] mix-blend-multiply pointer-events-none" style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/cream-paper.png')" }} />
    </div>
  )
}

const VariantSoftSage = ({ headline, subtext, ctaText, productImage, brandName, colors }: LuxuryProductProps) => {
  return (
    <div className="@container w-full h-full relative overflow-hidden flex flex-col items-center justify-center font-serif text-center" style={{ backgroundColor: colors.primary, color: colors.secondary }}>
      <Leaf className="absolute top-[4cqi] left-[4cqi] w-[15cqi] h-[15cqi] opacity-20 -rotate-45" />
      <Leaf className="absolute top-[4cqi] right-[4cqi] w-[15cqi] h-[15cqi] opacity-20 rotate-45 scale-x-[-1]" />
      <Leaf className="absolute bottom-[4cqi] left-[4cqi] w-[15cqi] h-[15cqi] opacity-20 -rotate-[135deg]" />
      <Leaf className="absolute bottom-[4cqi] right-[4cqi] w-[15cqi] h-[15cqi] opacity-20 rotate-[135deg] scale-x-[-1]" />
      
      <div className="mt-[10cqi] mb-[4cqi] flex flex-col items-center">
         <div className="w-[6cqi] h-[6cqi] rounded-t-full rounded-bl-full rotate-45 mb-[2cqi]" style={{ backgroundColor: colors.secondary }} />
         <span className="font-sans text-[2.5cqi] tracking-[0.3em] font-medium uppercase">{brandName}</span>
      </div>

      <h1 className="text-[10cqi] font-bold leading-none mb-[4cqi] max-w-[80cqi]">
        {headline.replace('\n', ' ')}
      </h1>
      <p className="font-sans text-[3cqi] opacity-80 max-w-[70cqi] leading-relaxed mb-[6cqi]">
        {subtext}
      </p>

      <div className="flex-1 w-full relative">
         <Image src={productImage} alt="Product" fill className="object-contain object-bottom drop-shadow-2xl pb-[10cqi]" crossOrigin="anonymous" />
         <div className="absolute top-[20cqi] right-[15cqi] w-[25cqi] h-[35cqi] bg-[#f4ebd0] shadow-xl rotate-12 flex flex-col items-center justify-center p-[2cqi] origin-top text-[#4a3f35] rounded-b-[2cqi]">
            <div className="w-[4cqi] h-[4cqi] rounded-full border-[0.5cqi] border-[#6b5c47] mb-[2cqi] bg-white absolute top-[2cqi]" />
            <span className="font-serif text-[4cqi] font-bold leading-tight mt-[4cqi]">Royale<br/>Collection</span>
            <span className="font-sans text-[2cqi] opacity-70 mt-auto border-t border-[#6b5c47]/20 pt-[1cqi] w-full">{ctaText}</span>
         </div>
      </div>
      
      <div className="absolute bottom-[8cqi] font-sans text-[2.8cqi] font-bold tracking-widest uppercase">
         {ctaText} completely today.
      </div>
    </div>
  )
}

const VariantRoseBlush = ({ headline, subtext, ctaText, productImage, website, colors }: LuxuryProductProps) => {
  return (
    <div className="@container w-full h-full relative overflow-hidden flex flex-col font-sans" style={{ backgroundColor: colors.primary, color: colors.secondary }}>
      <svg className="absolute inset-0 w-full h-full opacity-10 pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
         <path d="M0,100 L100,0 M0,80 L100,-20 M0,120 L100,20 M100,100 L0,0 M100,80 L0,-20 M100,120 L0,20" stroke="currentColor" strokeWidth="0.5" />
      </svg>
      
      <div className="pt-[15cqi] flex flex-col items-center text-center relative z-10 px-[10cqi]">
         <span className="text-[3cqi] tracking-[0.4em] font-medium uppercase opacity-70 mb-[2cqi]">{headline.split('\n')[0]}</span>
         <h1 className="font-serif text-[12cqi] uppercase tracking-wider mb-[4cqi] leading-none">{headline.split('\n')[1]}</h1>
         
         <div className="flex flex-col items-center">
            <span className="text-[2.5cqi] opacity-70 mb-[1cqi]">{subtext?.split('.')[0]}</span>
            <div className="border-[0.5cqi] px-[6cqi] py-[1.5cqi] rounded-[1cqi] font-bold text-[7cqi]" style={{ borderColor: colors.secondary }}>
              $599
            </div>
         </div>
      </div>

      <div className="flex-1 w-full relative z-20 mt-[4cqi] mb-[15cqi]">
         <Image src={productImage} alt="Product" fill className="object-contain drop-shadow-[0_40px_30px_rgba(0,0,0,1)] scale-110 z-20" crossOrigin="anonymous" />
         <div className="absolute bottom-[-10cqi] left-1/2 -translate-x-1/2 w-[80cqi] h-[30cqi] z-10 flex flex-col justify-end items-center">
             <div className="w-[90%] h-[40%] bg-[#222] shadow-[0_-20px_50px_rgba(0,0,0,0.5)] relative z-10" />
             <div className="w-full h-[30%] bg-[#1a1a1a] absolute bottom-[2cqi] z-0" />
         </div>
      </div>

      <div className="absolute bottom-[12cqi] w-full flex justify-center z-30">
          <button className="px-[10cqi] py-[3cqi] rounded-full font-bold text-[3.5cqi] tracking-widest shadow-2xl uppercase" style={{ backgroundColor: colors.accent, color: colors.primary }}>
            {ctaText}
          </button>
      </div>
      <div className="absolute bottom-[4cqi] w-full text-center text-[2.5cqi] tracking-[0.3em] font-medium opacity-60 uppercase">
          WWW.{website}
      </div>
    </div>
  )
}

const VariantClassicMonochrome = ({ headline, subtext, ctaText, productImage, colors, brandName, website }: LuxuryProductProps) => {
  return (
    <div className="@container w-full h-full relative overflow-hidden flex font-serif" style={{ backgroundColor: colors.primary, color: colors.secondary }}>
      <div className="absolute inset-0 opacity-[0.15]" style={{ background: `linear-gradient(135deg, ${colors.accent} 0%, transparent 100%)` }} />
      <svg className="absolute w-full h-[150%] top-[-20%] left-[-20%] opacity-20 pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
         <path d="M0,50 Q25,25 50,50 T100,50" fill="none" stroke={colors.accent} strokeWidth="15" strokeLinecap="round"/>
         <path d="M0,70 Q25,45 50,70 T100,70" fill="none" stroke={colors.accent} strokeWidth="8" strokeLinecap="round"/>
      </svg>
      
      <div className="w-[50%] h-full pl-[8cqi] pt-[15cqi] flex flex-col relative z-20">
         <span className="font-sans text-[2.5cqi] tracking-widest uppercase opacity-70 mb-[4cqi]">{brandName}</span>
         <h1 className="text-[11cqi] font-bold leading-[0.9] italic mb-[6cqi]">
            {headline.replace('\n', ' ')}
         </h1>
         <p className="font-sans text-[2.8cqi] opacity-80 leading-relaxed max-w-[90%] mb-[8cqi]">
            {subtext}
         </p>
         
         <button className="self-start px-[8cqi] py-[3cqi] rounded-full font-bold font-sans text-[3.5cqi] shadow-xl uppercase bg-white" style={{ color: colors.accent }}>
            {ctaText}
         </button>

         <div className="mt-auto pb-[6cqi] font-sans text-[2.5cqi] font-medium opacity-60 flex flex-col gap-[1cqi]">
            <span className="flex items-center gap-[1cqi]"><Globe className="w-[3cqi] h-[3cqi]" /> {website}</span>
            <span className="flex items-center gap-[1cqi]"><Phone className="w-[3cqi] h-[3cqi]" /> +123-456-7890</span>
         </div>
      </div>

      <div className="w-[50%] h-full relative z-10 flex items-end">
         <div className="absolute bottom-[5cqi] right-[-10cqi] w-[55cqi] h-[55cqi] rounded-full bg-white shadow-2xl z-0 border-[4cqi]" style={{ borderColor: `${colors.accent}40` }} />
         <div className="absolute w-full h-[60%] bottom-[8cqi] right-[-5cqi] z-10">
            <Image src={productImage} alt="Product" fill className="object-contain drop-shadow-2xl scale-110" crossOrigin="anonymous" />
         </div>
      </div>
    </div>
  )
}

const VariantCrimsonVelvet = ({ headline, subtext, ctaText, productImage, colors, website, brandName }: LuxuryProductProps) => {
  const parts = subtext?.split('•').map(p => p.trim()) || [];
  return (
    <div className="@container w-full h-full relative overflow-hidden flex flex-col font-serif" style={{ backgroundColor: colors.primary, color: colors.secondary }}>
      <div className="absolute top-[20%] left-[-20%] w-[150%] h-[150%] bg-white -rotate-12 origin-top-left z-0 shadow-[0_-20px_50px_rgba(0,0,0,0.05)]" />
      
      <div className="pt-[8cqi] px-[8cqi] relative z-10 flex gap-[2cqi] items-center">
         <div className="w-[6cqi] h-[6cqi] rounded-full border-[0.5cqi]" style={{ borderColor: colors.secondary }} />
         <span className="font-sans text-[3cqi] font-medium tracking-wide">{brandName}</span>
      </div>

      <div className="px-[8cqi] pt-[6cqi] relative z-10">
         <h1 className="font-sans text-[12cqi] font-bold leading-none mb-[1cqi] tracking-tight">{headline.split('\n')[0]}</h1>
         <h2 className="text-[6cqi] opacity-80 italic">{headline.split('\n')[1]}</h2>
      </div>

      <div className="flex-1 w-full flex mt-[4cqi] relative z-20">
         <div className="w-[45%] pl-[8cqi] pt-[8cqi] flex flex-col gap-[6cqi]">
            <div className="flex items-center gap-[3cqi]">
               <div className="w-[10cqi] h-[10cqi] rounded-full border-[0.5cqi] flex items-center justify-center shrink-0 bg-white shadow-sm" style={{ borderColor: colors.secondary }}>
                  <Leaf className="w-[4.5cqi] h-[4.5cqi]" />
               </div>
               <span className="font-sans text-[2.8cqi] font-medium leading-tight max-w-[15cqi]">{parts[0]}</span>
            </div>
            <div className="flex items-center gap-[3cqi]">
               <div className="w-[10cqi] h-[10cqi] rounded-full border-[0.5cqi] flex items-center justify-center shrink-0 bg-white shadow-sm" style={{ borderColor: colors.secondary }}>
                  <Droplet className="w-[4.5cqi] h-[4.5cqi]" />
               </div>
               <span className="font-sans text-[2.8cqi] font-medium leading-tight max-w-[15cqi]">{parts[1]}</span>
            </div>
            <div className="flex items-center gap-[3cqi]">
               <div className="w-[10cqi] h-[10cqi] rounded-full border-[0.5cqi] flex items-center justify-center shrink-0 bg-white shadow-sm" style={{ borderColor: colors.secondary }}>
                  <CheckCircle2 className="w-[4.5cqi] h-[4.5cqi]" />
               </div>
               <span className="font-sans text-[2.8cqi] font-medium leading-tight max-w-[15cqi]">{parts[2]}</span>
            </div>
         </div>

         <div className="w-[55%] h-full relative">
            <Image src={productImage} alt="Product" fill className="object-contain drop-shadow-[0_20px_20px_rgba(0,0,0,0.2)] scale-110 translate-y-[5%]" crossOrigin="anonymous" />
         </div>
      </div>

      <div className="absolute bottom-[6cqi] w-full flex flex-col items-center z-30">
          <button className="px-[8cqi] py-[2.5cqi] rounded-full font-sans font-bold text-[3.5cqi] tracking-wider shadow-lg mb-[4cqi] text-white" style={{ backgroundColor: colors.accent }}>
            {ctaText}
          </button>
          <span className="font-sans text-[2.8cqi] font-bold tracking-widest">{website}</span>
      </div>
    </div>
  )
}

const VariantNewCatalog = ({ headline, subtext, brandName, extraText, ctaText, productImage, website, colors }: LuxuryProductProps) => {
  return (
    <div className="@container w-full h-full relative overflow-hidden flex flex-col font-sans" style={{ backgroundColor: colors.primary, color: colors.secondary }}>
      <div className="absolute inset-0 z-0 opacity-40 mix-blend-overlay pointer-events-none" style={{ backgroundImage: 'radial-gradient(ellipse at top, #ffffff60, transparent)' }} />
      <div className="w-full flex justify-between px-[8cqi] pt-[8cqi] z-10 relative">
         <span className="font-serif tracking-wide text-[3cqi]">{brandName}</span>
         <span className="font-serif tracking-wide text-[3cqi]">{extraText}</span>
      </div>

      <div className="flex flex-col items-center justify-center pt-[4cqi] pb-[2cqi] relative z-10">
         <div className="relative">
            <h2 className="text-[14cqi] font-black font-serif italic absolute top-[-5cqi] left-[10cqi] drop-shadow-md z-10" style={{ fontFamily: 'cursive', color: colors.secondary }}>
               {headline.split('\n')[0]}
            </h2>
            <h1 className="text-[16cqi] font-serif uppercase tracking-tight leading-[0.9] text-center" style={{ color: colors.accent }}>
               {headline.split('\n')[1]}
            </h1>
         </div>
         <p className="text-[3cqi] text-center px-[10cqi] leading-relaxed max-w-[90%] font-medium opacity-90 whitespace-pre-wrap mt-[6cqi] mb-[2cqi]">
            {subtext}
         </p>
      </div>

      <div className="flex-1 w-full px-[4cqi] pb-[2cqi] pt-[1cqi] flex gap-[2cqi] items-center justify-center relative z-10">
         <div className="w-[30%] aspect-[3/4] relative bg-black/10 overflow-hidden group shadow-lg">
            <Image src="https://picsum.photos/seed/luxcat1/300/400" alt="Model 1" fill className="object-cover transition-transform group-hover:scale-110 duration-700" crossOrigin="anonymous" />
            <div className="absolute border-[0.2cqi] border-black/10 bottom-[2cqi] left-1/2 -translate-x-1/2 bg-white px-[2cqi] py-[1cqi] shadow-md z-10">
               <span className="text-[2.5cqi] font-bold" style={{ color: colors.accent }}>$62.80</span>
            </div>
         </div>
         <div className="w-[40%] aspect-[4/5] relative bg-black/10 overflow-hidden shadow-xl z-20 group border-[0.5cqi] border-white/20">
            <Image src={productImage} alt="Main Model" fill className="object-cover transition-transform group-hover:scale-110 duration-700" crossOrigin="anonymous" />
            <div className="absolute bottom-[2cqi] left-1/2 -translate-x-1/2 px-[3cqi] py-[1.5cqi] shadow-md z-10" style={{ backgroundColor: colors.secondary }}>
               <span className="text-[3cqi] font-bold text-white">$45.55</span>
            </div>
         </div>
         <div className="w-[30%] aspect-[3/4] relative bg-black/10 overflow-hidden group shadow-lg">
            <Image src="https://picsum.photos/seed/luxcat3/300/400" alt="Model 3" fill className="object-cover transition-transform group-hover:scale-110 duration-700" crossOrigin="anonymous" />
            <div className="absolute border-[0.2cqi] border-black/10 bottom-[2cqi] left-1/2 -translate-x-1/2 bg-white px-[2cqi] py-[1cqi] shadow-md z-10">
               <span className="text-[2.5cqi] font-bold" style={{ color: colors.accent }}>$55.40</span>
            </div>
         </div>
      </div>

      <div className="flex items-center justify-center gap-[4cqi] pb-[4cqi] pt-[2cqi] relative z-10">
         <div className="flex text-[4cqi] font-black tracking-[-0.2em]">{">>>>>"}</div>
         <button className="text-[3cqi] font-bold tracking-widest hover:scale-105 transition-transform uppercase">
            {ctaText}
         </button>
         <div className="flex text-[4cqi] font-black tracking-[-0.2em]">{"<<<<<"}</div>
      </div>

      <div className="w-full h-[8cqi] flex items-center justify-center text-white relative z-10 mt-auto" style={{ backgroundColor: colors.secondary }}>
         <p className="text-[2.5cqi] tracking-wider font-light">{website}</p>
      </div>
    </div>
  )
}

const VariantBorcelleSkincare = ({ headline, extraText, ctaText, productImage, colors }: LuxuryProductProps) => {
  return (
    <div className="@container w-full h-full relative overflow-hidden grid grid-cols-2 grid-rows-2 font-sans" style={{ backgroundColor: colors.accent, color: colors.secondary }}>
      <div className="relative w-full h-full border-r-[0.5cqi] border-b-[0.5cqi] border-black/5" style={{ backgroundColor: colors.primary }}>
         <Image src={productImage} alt="Skincare" fill className="object-cover mix-blend-multiply p-[4cqi]" crossOrigin="anonymous" />
      </div>
      
      <div className="relative w-full h-full flex flex-col items-center justify-center border-b-[0.5cqi] border-black/5 p-[4cqi]">
         <div className="text-center relative">
            <h1 className="text-[7cqi] font-sans text-center leading-[1.1] mb-[2cqi] whitespace-pre-wrap font-medium">
               {headline}
            </h1>
            <div className="w-[100%] h-[0.3cqi] bg-black absolute bottom-[0cqi] left-[0%]" />
         </div>
      </div>

      <div className="relative w-full h-full flex flex-col items-center justify-center border-r-[0.5cqi] border-black/5 p-[4cqi]">
         <button className="border-[0.5cqi] border-black px-[6cqi] py-[2cqi] text-[4cqi] font-bold tracking-wider hover:bg-black hover:text-white transition-colors duration-300">
            {ctaText}
         </button>
      </div>

      <div className="relative w-full h-full flex flex-col items-center justify-center text-center p-[4cqi]" style={{ backgroundColor: colors.primary }}>
         <h4 className="text-[3.5cqi] font-bold mb-[4cqi]">
            {extraText?.split('\n')[0]}
         </h4>
         <p className="text-[3cqi] font-bold mb-[3cqi]">
            {extraText?.split('\n')[1]}
         </p>
         <p className="text-[3cqi] font-bold">
            {extraText?.split('\n')[2]}
         </p>
      </div>
    </div>
  )
}
