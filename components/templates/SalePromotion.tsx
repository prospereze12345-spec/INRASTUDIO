import React from "react";
import Image from "next/image";

export interface SalePromotionProps {
  name?: string;
  headline: string;
  subtext?: string;
  ctaText: string;
  badgeText?: string;
  extraText?: string;
  productImage: string;
  brandName?: string;
  website?: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
  };
}

export function SalePromotionTemplate(props: SalePromotionProps) {
  const { name = "Flash Arch" } = props;

  switch (name) {
    case "Flash Arch": return <VariantFlashArch {...props} />;
    case "Striped Circle": return <VariantStripedCircle {...props} />;
    case "Editorial Minimal": return <VariantEditorialMinimal {...props} />;
    case "Impact Text": return <VariantImpactText {...props} />;
    case "Dynamic Angle": return <VariantDynamicAngle {...props} />;
    case "Weekend Special": return <VariantWeekendSpecial {...props} />;
    case "Neon Glow": return <VariantNeonGlow {...props} />;
    case "Gift Banner": return <VariantGiftBanner {...props} />;
    case "Ribbon Frame": return <VariantRibbonFrame {...props} />;
    case "Combo Offer": return <VariantComboOffer {...props} />;
    case "Fashion Sale": return <VariantFashionSale {...props} />;
    case "Coffee Shop": return <VariantCoffeeShop {...props} />;
    default: return <VariantFlashArch {...props} />;
  }
}

const VariantFlashArch = ({ headline, ctaText, badgeText, productImage, colors }: SalePromotionProps) => {
  return (
    <div className="@container w-full h-full relative overflow-hidden flex flex-col items-center justify-center font-sans tracking-wide" style={{ backgroundColor: colors.primary, color: colors.secondary }}>
      <div className="absolute inset-0 bg-black/5 opacity-50 z-0 bg-[url('https://www.transparenttextures.com/patterns/clean-textile.png')]" />
      
      <h1 className="text-[12cqi] font-medium tracking-[0.1em] uppercase mb-[6cqi] relative z-20 font-serif text-center whitespace-pre-wrap drop-shadow-sm">
        {headline}
      </h1>
      
      <div className="relative w-[65cqi] h-[75cqi] z-10 flex items-center justify-center group transform transition-transform duration-700 hover:scale-[1.02]">
        <div className="absolute inset-0 rounded-t-[35cqi] bg-white w-full h-full shadow-[0_20px_50px_rgba(0,0,0,0.15)] ring-1 ring-black/5" />
        <div className="absolute top-1/2 -translate-y-1/2 -left-[20cqi] -right-[20cqi] h-[10cqi] flex overflow-hidden z-[-1] opacity-70 blur-[1px]">
           <div className="w-full h-full" style={{
             background: `linear-gradient(135deg, ${colors.accent} 25%, transparent 25%) -10px 0,
                          linear-gradient(225deg, ${colors.accent} 25%, transparent 25%) -10px 0,
                          linear-gradient(315deg, ${colors.accent} 25%, transparent 25%),
                          linear-gradient(45deg, ${colors.accent} 25%, transparent 25%)`,
             backgroundSize: '20px 20px',
           }} />
        </div>
        <Image src={productImage} alt="Product" fill className="object-contain object-bottom scale-[1.15] p-[4cqi] drop-shadow-2xl transition-transform duration-700 group-hover:scale-[1.2]" crossOrigin="anonymous" />
        {badgeText && (
          <div className="absolute -bottom-[5cqi] -right-[5cqi] w-[24cqi] h-[24cqi] rounded-full flex flex-col items-center justify-center text-center shadow-[0_10px_30px_rgba(0,0,0,0.2)] font-black italic leading-[1] transform rotate-[15deg] border-4 border-white transition-transform duration-500 hover:rotate-0 hover:scale-110" style={{ backgroundColor: colors.accent, color: colors.secondary }}>
            <span className="text-[6.5cqi]">{badgeText.split('\n')[0]}</span>
            <span className="text-[4cqi] mt-[0.5cqi]">{badgeText.split('\n')[1]}</span>
          </div>
        )}
      </div>

      <button className="mt-[14cqi] px-[10cqi] py-[3cqi] uppercase text-[3.5cqi] font-bold tracking-[0.25em] relative z-20 shadow-[0_8px_20px_rgba(0,0,0,0.1)] transition-all hover:bg-black/80 hover:scale-105 active:scale-95 rounded-sm" style={{ backgroundColor: '#111', color: '#fff' }}>
        {ctaText}
      </button>
    </div>
  );
}

const VariantStripedCircle = ({ headline, ctaText, badgeText, productImage, colors }: SalePromotionProps) => {
  return (
    <div className="@container w-full h-full relative overflow-hidden flex flex-col items-center justify-center font-sans tracking-wide border-4 border-transparent" style={{ backgroundColor: colors.primary, color: colors.secondary }}>
      <div className="absolute inset-0 bg-gradient-to-br from-black/5 to-transparent z-0" />
      <h1 className="text-[13cqi] font-bold tracking-tight uppercase mb-[8cqi] relative z-20 drop-shadow-xl text-center whitespace-pre-wrap">
        {headline}
      </h1>
      <div className="relative w-[75cqi] h-[75cqi] z-10 flex items-center justify-center">
        <div className="absolute inset-0 rounded-full w-full h-full shadow-[0_30px_60px_rgba(0,0,0,0.2)] opacity-90 overflow-hidden bg-white/10 backdrop-blur-sm border-[0.5cqi] border-white/20">
           <div className="absolute inset-0 w-[200%] h-[200%] -translate-x-[25%] -translate-y-[25%] rotate-45 opacity-50" style={{
              backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 10px, ${colors.accent} 10px, ${colors.accent} 20px)`
           }} />
        </div>
        <div className="absolute inset-[3cqi] rounded-full w-[calc(100%-6cqi)] h-[calc(100%-6cqi)] shadow-inner" style={{ backgroundColor: colors.accent }} />
        <Image src={productImage} alt="Product" fill className="object-contain scale-[1.12] drop-shadow-[0_20px_30px_rgba(0,0,0,0.3)] transition-transform duration-700 hover:scale-[1.18]" crossOrigin="anonymous" />
        {badgeText && (
          <div className="absolute top-[2cqi] right-[2cqi] w-[22cqi] h-[18cqi] rounded-[3cqi] flex flex-col items-center justify-center text-center shadow-[0_15px_30px_rgba(0,0,0,0.2)] rotate-[15deg] border-2 border-white backdrop-blur-md" style={{ backgroundColor: colors.secondary, color: colors.primary }}>
            <span className="text-[5.5cqi] font-black whitespace-pre-wrap tracking-tighter leading-tight drop-shadow-sm">{badgeText}</span>
          </div>
        )}
      </div>
      <button className="mt-[12cqi] text-[10cqi] font-black tracking-tighter uppercase relative z-20 whitespace-pre-wrap text-center hover:opacity-80 transition-opacity" style={{ color: colors.secondary }}>
        {ctaText}
      </button>
    </div>
  );
}

const VariantEditorialMinimal = ({ headline, subtext, ctaText, extraText, website, productImage, colors }: SalePromotionProps) => {
  return (
    <div className="@container w-full h-full relative overflow-hidden flex flex-col p-[8cqi] font-serif border-[1.5cqi] border-white/30" style={{ backgroundColor: colors.primary, color: colors.secondary }}>
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')] opacity-40 z-0" />
      <div className="text-center pb-[3cqi] relative z-20">
         <h3 className="text-[3cqi] tracking-[0.4em] uppercase font-bold text-center whitespace-pre-wrap">{ctaText}</h3>
         <p className="text-[2.2cqi] mt-[2cqi] opacity-60 tracking-[0.3em] font-sans whitespace-pre-wrap uppercase">{website}</p>
      </div>
      <div className="absolute right-[0] top-[20cqi] w-[45%] h-[55%] z-[5] shadow-lg" style={{ backgroundColor: colors.accent }} />
      <div className="absolute left-[5cqi] bottom-[25cqi] w-[30%] h-[40%] z-[4] border-[0.2cqi] border-black/10" style={{ backgroundColor: 'rgba(0,0,0,0.03)' }} />
      <div className="flex-1 w-full relative flex items-center justify-center my-[4cqi] z-10">
         <div className="w-[85%] h-full relative border-[2cqi] border-transparent shadow-[0_30px_60px_rgba(0,0,0,0.15)] mx-auto flex">
            {extraText && (
               <div className="absolute -left-[6cqi] top-1/2 -translate-y-1/2 -rotate-90 w-[50cqi] text-center opacity-80 z-20 mix-blend-difference" style={{ transformOrigin: "center" }}>
                 <p className="text-[2.2cqi] tracking-[0.2em] uppercase font-sans font-bold leading-relaxed whitespace-pre-wrap opacity-50">{extraText}</p>
               </div>
            )}
            <div className="w-full h-full relative ml-[6cqi] bg-white ring-1 ring-black/5 overflow-hidden">
              <Image src={productImage} alt="Product" fill className="object-cover transition-transform duration-1000 hover:scale-105" crossOrigin="anonymous" />
            </div>
         </div>
      </div>
      <div className="text-center pt-[5cqi] relative z-20">
         <h3 className="text-[2.8cqi] font-sans tracking-[0.5em] uppercase font-bold mb-[3cqi] opacity-80 whitespace-pre-wrap">{subtext}</h3>
         <h1 className="text-[16cqi] font-serif italic tracking-[0.05em] leading-none whitespace-pre-wrap drop-shadow-sm">{headline}</h1>
      </div>
    </div>
  );
}

const VariantImpactText = ({ headline, subtext, ctaText, badgeText, brandName, website, productImage, colors }: SalePromotionProps) => {
  return (
    <div className="@container w-full h-full relative overflow-hidden flex flex-col font-sans px-[8cqi] py-[10cqi]" style={{ backgroundColor: colors.primary, color: colors.secondary }}>
      <div className="absolute inset-0 opacity-[0.08]" style={{
        backgroundImage: 'linear-gradient(to right, #000 1px, transparent 1px), linear-gradient(to bottom, #000 1px, transparent 1px)',
        backgroundSize: '25px 25px'
      }} />
      <div className="absolute top-[4cqi] right-[4cqi] w-[40cqi] h-[40cqi] bg-gradient-to-bl from-white/20 to-transparent rounded-full blur-[30px] z-0" />
      <div className="text-center relative z-10">
         <p className="text-[2.5cqi] font-bold tracking-[0.3em] mb-[3cqi] whitespace-pre-wrap opacity-80">{brandName}</p>
         <h1 className="text-[22cqi] font-black uppercase leading-[0.85] tracking-tighter whitespace-pre-wrap drop-shadow-lg isolate" style={{ color: colors.accent, WebkitTextStroke: `1px ${colors.secondary}` }}>
           {headline}
         </h1>
      </div>
      <div className="absolute inset-0 z-20 flex items-center justify-center mt-[15cqi] pointer-events-none">
        <div className="relative w-full h-[80%]">
          <Image src={productImage} alt="Product" fill className="object-contain object-bottom scale-[1.2] drop-shadow-[0_25px_35px_rgba(0,0,0,0.4)]" crossOrigin="anonymous" />
        </div>
      </div>
      <div className="flex-1" />
      <div className="flex justify-between items-end relative z-30 font-bold uppercase pb-[2cqi]">
         <div className="bg-white/80 backdrop-blur-md p-[3cqi] rounded-lg shadow-lg border border-white/50" style={{ color: colors.primary }}>
            <div className="text-[3cqi] leading-tight opacity-80 mb-[2cqi]">
              <span className="whitespace-pre-wrap font-black">{subtext}</span>
            </div>
            <div className="text-[8cqi] leading-[0.9] tracking-tighter whitespace-pre-wrap text-black mb-[1cqi]">
              {ctaText}
            </div>
            <div className="text-[2cqi] mt-[2cqi] opacity-70 whitespace-pre-wrap tracking-wider">{website && "GET IT AT"}</div>
         </div>
         <div className="text-right flex flex-col items-end">
            <div className="text-[9cqi] leading-[0.9] tracking-tighter whitespace-pre-wrap font-black drop-shadow-md text-white px-[4cqi] py-[2cqi] rounded-[2cqi] rotate-[-5deg]" style={{ backgroundColor: colors.accent }}>
              {badgeText}
            </div>
            <div className="text-[2.8cqi] mt-[4cqi] tracking-widest whitespace-pre-wrap bg-black text-white px-[3cqi] py-[1cqi] rounded-full shadow-lg">{website}</div>
         </div>
      </div>
    </div>
  );
}

const VariantDynamicAngle = ({ headline, subtext, ctaText, badgeText, extraText, productImage, colors }: SalePromotionProps) => {
  return (
    <div className="@container w-full h-full relative overflow-hidden flex flex-col font-sans p-[6cqi]" style={{ backgroundColor: colors.primary, color: colors.secondary }}>
      <div className="absolute flex inset-0 opacity-[0.25] pointer-events-none z-0" style={{
        backgroundImage: 'radial-gradient(circle at center, #fff 1px, transparent 1px)',
        backgroundSize: '40px 40px'
      }} />
      <div className="relative z-20 flex flex-col items-center rotate-[-6deg] mt-[6cqi]">
        <div className="bg-yellow-400 text-black px-[5cqi] py-[1.5cqi] rounded-full text-[4cqi] font-black uppercase mb-[1cqi] self-end -mr-[4cqi] z-10 rotate-[12deg] shadow-xl whitespace-pre-wrap text-center border-4 border-black transition-transform hover:scale-110" style={{ backgroundColor: colors.accent, color: colors.primary }}>
          {ctaText}
        </div>
        <h1 className="text-[16cqi] font-black italic uppercase leading-[0.8] tracking-[-0.02em] drop-shadow-[0_15px_0px_rgba(0,0,0,0.8)] text-white/95 text-left w-full pl-[5cqi] whitespace-pre-wrap pb-[4cqi] relative" style={{ WebkitTextStroke: '2px black' }}>
          {headline}
        </h1>
      </div>
      <div className="flex-1 relative z-10 w-full flex items-center justify-center -mt-[5cqi]">
        <div className="absolute inset-[2cqi] bg-black/5 rotate-3 rounded-[5cqi] shadow-inner" />
        <div className="w-[120%] h-[120%] relative group">
          <Image src={productImage} alt="Product" fill className="object-contain drop-shadow-[0_30px_40px_rgba(0,0,0,0.4)] scale-[1.15] transition-transform duration-500 group-hover:rotate-2 group-hover:scale-[1.2]" crossOrigin="anonymous" />
        </div>
      </div>
      <div className="flex justify-between items-end relative z-20 italic bg-black/90 text-white p-[5cqi] rounded-xl shadow-2xl border-2 border-white/20 rotate-[-2deg] mb-[2cqi]">
        <div>
          <div className="text-[12cqi] font-black uppercase leading-[0.8] tracking-tighter whitespace-pre-wrap text-[#ffd700]" style={{ color: colors.accent }}>
            {badgeText}
          </div>
          <div className="text-[3cqi] font-bold mt-[2cqi] uppercase tracking-[0.2em] bg-white text-black px-[3cqi] py-[1cqi] rounded-full inline-block whitespace-pre-wrap shadow-md">
            {subtext}
          </div>
        </div>
        {extraText && (
          <div className="text-right text-[3.5cqi] font-bold leading-tight uppercase drop-shadow-sm pb-[1cqi] whitespace-pre-wrap tracking-wider opacity-90">
            {extraText}
          </div>
        )}
      </div>
    </div>
  );
}

const VariantWeekendSpecial = ({ headline, subtext, ctaText, brandName, productImage, colors }: SalePromotionProps) => {
  return (
    <div className="@container w-full h-full relative overflow-hidden flex flex-col font-sans p-[8cqi]" style={{ backgroundColor: colors.primary, color: colors.secondary }}>
      <div className="absolute top-0 right-0 w-[85%] h-[100%] rounded-bl-[45cqi] bg-[#315735] z-0 shadow-[-20px_20px_50px_rgba(0,0,0,0.2)]" style={{ backgroundColor: colors.secondary }} />
      <div className="absolute bottom-[-15cqi] right-[-15cqi] w-[50cqi] h-[50cqi] rounded-full opacity-40 z-0 blur-2xl" style={{ backgroundColor: colors.accent }} />
      
      <div className="relative z-10 flex justify-between items-center text-[3.5cqi] font-black tracking-[0.3em] uppercase drop-shadow-sm">
        <span style={{ color: colors.secondary }}>{brandName}</span>
      </div>

      <div className="relative z-10 flex-1 flex flex-col justify-center mt-[12cqi]">
        <div className="w-[88%] bg-white/95 backdrop-blur-md rounded-[12cqi] rounded-br-[0] p-[7cqi] shadow-[0_30px_60px_rgba(0,0,0,0.3)] relative border-[0.5cqi] border-white/50" style={{ color: colors.secondary }}>
           <h1 className="text-[13cqi] font-black uppercase leading-[0.95] tracking-tight mb-[5cqi] whitespace-pre-wrap">
             {headline}
           </h1>
           <p className="text-[3.8cqi] font-medium leading-relaxed opacity-85 mb-[8cqi] whitespace-pre-wrap pb-[2cqi] border-b-2 border-black/10">
             {subtext}
           </p>
           <button className="px-[8cqi] py-[3.5cqi] rounded-[4cqi] text-[3.5cqi] font-black tracking-[0.2em] uppercase text-white hover:scale-105 hover:shadow-[0_10px_30px_rgba(0,0,0,0.2)] transition-all shadow-md active:scale-95" style={{ backgroundColor: colors.accent }}>
             {ctaText}
           </button>
           
           <div className="absolute -right-[22cqi] top-[40%] -translate-y-1/2 w-[60cqi] h-[85cqi] group">
             <Image src={productImage} alt="Product" fill className="object-contain drop-shadow-[0_30px_50px_rgba(0,0,0,0.4)] scale-[1.2] transition-transform duration-[1.5s] group-hover:scale-[1.3] group-hover:rotate-3" crossOrigin="anonymous" />
           </div>
        </div>
      </div>
    </div>
  );
}

const VariantNeonGlow = ({ headline, subtext, ctaText, productImage, colors }: SalePromotionProps) => {
  return (
    <div className="@container w-full h-full relative overflow-hidden border-[2cqi] flex flex-col font-sans bg-[#0a0a0a] p-[8cqi]" style={{ backgroundColor: colors.primary, color: colors.secondary, borderColor: 'rgba(255,255,255,0.1)' }}>
      <div className="absolute inset-0 opacity-15 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-screen" />
      <div className="absolute inset-0 shadow-[inset_0_0_100px_rgba(0,0,0,0.9)] z-10 pointer-events-none" />
      
      <div className="relative z-20 flex-1 flex flex-col justify-between h-full border-[0.2cqi] p-[6cqi] rounded-sm bg-black/20 backdrop-blur-sm" style={{ borderColor: colors.accent, boxShadow: `0 0 30px ${colors.accent}40, inset 0 0 20px ${colors.accent}40` }}>
        
        <div className="text-center mt-[4cqi]">
          <h1 className="text-[18cqi] font-black uppercase leading-[0.85] tracking-tighter whitespace-pre-wrap" style={{ 
            color: '#fff', 
            textShadow: `0 0 10px #fff, 0 0 20px #fff, 0 0 40px ${colors.accent}, 0 0 80px ${colors.accent}` 
          }}>
            {headline}
          </h1>
        </div>
        
        <div className="relative w-full h-[60%] my-[6cqi]">
          <div className="absolute inset-[15%] rounded-full opacity-60 blur-[40px] mix-blend-screen" style={{ backgroundColor: colors.accent }} />
          <Image src={productImage} alt="Product" fill className="object-contain scale-[1.2] drop-shadow-[0_0_30px_rgba(0,0,0,0.8)] filter contrast-125" crossOrigin="anonymous" />
        </div>
        
        <div className="text-center font-bold tracking-widest relative">
          <p className="text-[3cqi] mb-[4cqi] uppercase tracking-[0.4em] opacity-90 drop-shadow-md whitespace-pre-wrap" style={{ color: '#fff' }}>{subtext}</p>
          <button className="px-[8cqi] py-[3cqi] text-[4cqi] uppercase border-[0.3cqi] bg-black/50 backdrop-blur-md transition-all hover:bg-white hover:text-black" style={{ borderColor: colors.accent, color: colors.accent, boxShadow: `0 0 15px ${colors.accent}60, inset 0 0 10px ${colors.accent}60` }}>
            {ctaText}
          </button>
        </div>
      </div>
    </div>
  );
}

const VariantGiftBanner = ({ headline, subtext, ctaText, badgeText, productImage, colors }: SalePromotionProps) => {
  return (
    <div className="@container w-full h-full relative overflow-hidden flex flex-col font-serif" style={{ backgroundColor: colors.primary, color: colors.secondary }}>
      <div className="h-[45%] w-full relative z-10 flex">
        <div className="w-[45%] h-full flex flex-col justify-center items-center text-center p-[6cqi] relative z-20 shadow-xl bg-white/95 backdrop-blur border-r border-black/5">
           <h3 className="text-[3.5cqi] uppercase tracking-[0.4em] font-sans font-bold opacity-80 mb-[2cqi] whitespace-pre-wrap">{subtext}</h3>
           <h1 className="text-[11cqi] font-medium leading-[1] italic whitespace-pre-wrap">
             {headline}
           </h1>
           {badgeText && (
             <div className="mt-[4cqi] bg-black text-white px-[4cqi] py-[1.5cqi] text-[2.5cqi] font-sans font-bold tracking-widest uppercase shadow-md whitespace-pre-wrap" style={{ backgroundColor: colors.accent }}>
               {badgeText}
             </div>
           )}
        </div>
        <div className="w-[55%] h-full relative bg-black/5 overflow-hidden">
           <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent z-10 opacity-50" />
           <Image src={productImage} alt="Product" fill className="object-cover scale-110" crossOrigin="anonymous" />
        </div>
      </div>
      
      <div className="h-[55%] w-full relative z-0 flex items-center justify-center p-[8cqi]">
         <div className="absolute inset-0 opacity-[0.4] bg-[url('https://www.transparenttextures.com/patterns/aged-paper.png')]" />
         <div className="w-full h-full border-y-[0.3cqi] border-current flex flex-col items-center justify-center relative p-[6cqi]">
            <div className="absolute left-[10cqi] top-[10cqi] text-[15cqi] opacity-10">✦</div>
            <div className="absolute right-[10cqi] bottom-[10cqi] text-[15cqi] opacity-10">✦</div>
            <p className="text-[4cqi] font-sans opacity-80 text-center leading-relaxed tracking-wider mb-[8cqi] whitespace-pre-wrap max-w-[80%]">
              Experience the season&apos;s best selections curated specially for you.
            </p>
            <button className="px-[10cqi] py-[3.5cqi] uppercase font-sans text-[3.5cqi] font-bold tracking-[0.3em] relative hover:-translate-y-1 hover:shadow-xl transition-all active:translate-y-0" style={{ backgroundColor: colors.secondary, color: colors.primary }}>
               {ctaText}
            </button>
         </div>
      </div>
    </div>
  );
}

const VariantRibbonFrame = ({ headline, subtext, ctaText, badgeText, productImage, colors }: SalePromotionProps) => {
  return (
    <div className="@container w-full h-full relative overflow-hidden flex flex-col font-sans p-[6cqi]" style={{ backgroundColor: colors.primary, color: colors.secondary }}>
      <div className="absolute inset-[6cqi] border-[1cqi] z-10 pointer-events-none drop-shadow-md" style={{ borderColor: 'rgba(255,255,255,0.8)' }} />
      <div className="absolute inset-[8cqi] border-[0.2cqi] border-white/40 z-10 pointer-events-none" />
      
      <h3 className="text-center mt-[4cqi] text-[3.5cqi] font-bold tracking-[0.4em] uppercase relative z-20 whitespace-pre-wrap opacity-90 drop-shadow-md">
        {subtext}
      </h3>
      
      <div className="absolute top-[22cqi] left-[0] bg-[#e63946] text-white py-[2cqi] pl-[8cqi] pr-[6cqi] z-30 shadow-[0_10px_20px_rgba(0,0,0,0.2)] font-black text-[5cqi] uppercase tracking-wider whitespace-pre-wrap" style={{ backgroundColor: colors.accent }}>
         {badgeText}
         <div className="absolute right-0 top-0 w-0 h-0 border-t-[3.5cqi] border-t-transparent border-b-[3.5cqi] border-b-transparent border-r-[3.5cqi] border-r-white transform translate-x-full opacity-30" />
      </div>

      <div className="flex-1 w-full relative z-20 my-[6cqi]">
        <div className="absolute inset-0 bg-white/5 rounded-full blur-[40px] z-0" />
        <Image src={productImage} alt="Product" fill className="object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,0.2)] scale-[1.05]" crossOrigin="anonymous" />
      </div>

      <div className="text-center relative z-20 mb-[4cqi]">
        <h1 className="text-[17cqi] font-black uppercase leading-[0.8] tracking-tighter mix-blend-overlay whitespace-pre-wrap pb-[4cqi]" style={{ WebkitTextStroke: '1px rgba(255,255,255,0.5)' }}>
          {headline}
        </h1>
        <button className="px-[12cqi] py-[3.5cqi] rounded-full uppercase font-bold text-[3.5cqi] tracking-[0.2em] shadow-xl hover:scale-105 active:scale-95 transition-transform" style={{ backgroundColor: '#ffffff', color: colors.primary }}>
          {ctaText}
        </button>
      </div>
    </div>
  );
}

const VariantComboOffer = ({ headline, subtext, ctaText, badgeText, productImage, colors }: SalePromotionProps) => {
  return (
    <div className="@container w-full h-full relative overflow-hidden flex flex-col font-sans p-[6cqi]" style={{ backgroundColor: colors.primary, color: colors.secondary }}>
      <div className="w-[90%] mx-auto h-[45%] bg-[#ffffff] rounded-b-[4cqi] shadow-2xl relative z-20 flex justify-center pb-[6cqi]">
        <div className="absolute top-0 w-[50%] h-[1.5cqi] rounded-b-full bg-black/10" />
        <div className="w-[85%] h-full relative mt-[2cqi]">
          <Image src={productImage} alt="Product" fill className="object-contain object-top drop-shadow-lg scale-110" crossOrigin="anonymous" />
        </div>
        {badgeText && (
          <div className="absolute -bottom-[8cqi] right-[4cqi] w-[26cqi] h-[26cqi] rounded-[50%] flex items-center justify-center text-center shadow-[0_15px_30px_rgba(0,0,0,0.3)] z-30 font-black text-white text-[5.5cqi] leading-[1] whitespace-pre-wrap border-4 border-white/20 hover:rotate-[15deg] transition-transform duration-500" style={{ backgroundColor: colors.accent }}>
            <span className="drop-shadow-sm">{badgeText}</span>
          </div>
        )}
      </div>

      <div className="flex-1 w-full text-center flex flex-col justify-end items-center relative z-10 pb-[6cqi] mt-[10cqi]">
        <h3 className="text-[3.5cqi] bg-white/10 text-white font-bold tracking-[0.3em] uppercase py-[1.5cqi] px-[4cqi] rounded-full shadow-md whitespace-pre-wrap border border-white/20">
          {subtext}
        </h3>
        <h1 className="text-[17cqi] font-black uppercase leading-[0.9] tracking-tighter mt-[4cqi] mb-[8cqi] whitespace-pre-wrap px-[4cqi] drop-shadow-md">
          {headline}
        </h1>
        <button className="px-[12cqi] py-[4cqi] rounded-[4cqi] text-[4cqi] font-black uppercase tracking-[0.2em] relative overflow-hidden group shadow-[0_15px_30px_rgba(0,0,0,0.2)] hover:scale-105 active:scale-95 transition-transform" style={{ backgroundColor: colors.secondary, color: colors.primary }}>
          <span className="relative z-10 drop-shadow-sm">{ctaText}</span>
          <div className="absolute inset-0 bg-white/20 transform -translate-x-full skew-x-12 group-hover:animate-[shimmer_1.5s_infinite]" />
        </button>
      </div>
    </div>
  );
}

const VariantFashionSale = ({ headline, subtext, badgeText, ctaText, extraText, website, productImage, colors }: SalePromotionProps) => {
  return (
    <div className="@container w-full h-full relative overflow-hidden flex flex-col font-serif" style={{ backgroundColor: colors.primary, color: colors.secondary }}>
      <div className="absolute top-0 right-0 w-1/2 h-full bg-white/20 blur-[10cqi] z-0" />
      <div className="absolute top-0 left-[50%] w-[1px] h-full bg-white/10 z-0" />
      <div className="absolute top-[60%] left-0 w-full h-[30cqi] bg-white z-0" style={{ backgroundColor: colors.accent }} />

      <div className="text-center pt-[6cqi] relative z-20">
         <h3 className="text-[10cqi] font-black italic tracking-widest leading-[1.0] drop-shadow-md pb-[1cqi]">
            {subtext?.split('\n')[0]}
         </h3>
         <p className="text-[3cqi] font-sans tracking-widest mt-[1cqi] opacity-90 uppercase whitespace-pre-wrap">
            {subtext?.split('\n').slice(1).join('\n')}
         </p>
      </div>

      <div className="flex-1 w-full relative z-10 flex px-[10cqi] pt-[6cqi] pb-[2cqi]">
         <div className="w-[35%] h-[90%] bg-white flex flex-col justify-center items-center relative py-[10cqi] border-r-[1cqi] border-l-[1cqi] border-transparent shadow-[0_0_20px_rgba(0,0,0,0.1)]">
            <h2 className="text-[14cqi] font-black tracking-tight uppercase text-center leading-[0.9] absolute transform -rotate-90 whitespace-nowrap" style={{ color: colors.primary }}>
               {badgeText?.replace('\n', ' ')}
            </h2>

            <div className="absolute bottom-[4cqi] left-[50%] -translate-x-[50%] flex items-center justify-center">
               <button className="px-[3cqi] py-[1cqi] rounded-full text-[2.5cqi] font-sans font-bold uppercase tracking-wider text-white shadow-md hover:scale-105 transition-transform flex items-center gap-2 pr-[5cqi] relative whitespace-nowrap" style={{ backgroundColor: colors.primary }}>
                  {ctaText}
                  <span className="absolute right-[0.5cqi] top-[50%] -translate-y-[50%] w-[3cqi] h-[3cqi] rounded-full bg-[#fbbc04] flex items-center justify-center p-[1cqi] text-[1.5cqi]">▶</span>
               </button>
            </div>
         </div>
         <div className="w-[65%] h-[90%] relative shadow-[0_20px_40px_rgba(0,0,0,0.3)] z-20 bg-[#d9cdcd]">
            <Image src={productImage} alt="Fashion" fill className="object-cover" crossOrigin="anonymous" />
         </div>
      </div>

      <div className="pb-[4cqi] pt-[2cqi] px-[10cqi] text-center relative z-20 flex flex-col items-center">
         <h1 className="text-[10cqi] font-black italic leading-[1.0] capitalize drop-shadow-lg mb-[2cqi] whitespace-pre-wrap text-[#ffffff]">
            {headline}
         </h1>
         <p className="text-[2cqi] font-sans leading-relaxed opacity-80 max-w-[80%] mb-[3cqi] text-[#ffffff]">
            {extraText}
         </p>
         <p className="text-[2.5cqi] font-sans tracking-widest font-medium text-[#ffffff]">
            {website}
         </p>
      </div>
    </div>
  );
}

const VariantCoffeeShop = ({ headline, subtext, badgeText, extraText, brandName, ctaText, productImage, colors }: SalePromotionProps) => {
  return (
    <div className="@container w-full h-full relative overflow-hidden flex flex-col font-sans p-[6cqi]" style={{ backgroundColor: colors.primary, color: colors.secondary }}>
      <div className="w-full flex justify-between items-start z-20 relative">
         <h4 className="text-[4cqi] font-black tracking-wider uppercase drop-shadow-sm">{brandName}</h4>
         <div className="w-[12cqi] h-[12cqi] rounded-full border-[0.3cqi] border-current flex flex-col items-center justify-center pb-[1cqi]">
            <div className="text-[5cqi] mt-[-1cqi] opacity-80">☕</div>
            <span className="text-[1.8cqi] font-bold uppercase tracking-widest mt-1">Coffee</span>
         </div>
      </div>

      <div className="flex-1 w-full flex flex-col justify-center relative z-20 mt-[4cqi] max-w-[60%]">
         <h1 className="text-[12cqi] font-black tracking-tight leading-[0.95] uppercase whitespace-pre-wrap" style={{ textShadow: "2px 2px 0px rgba(0,0,0,0.1)" }}>
            {headline}
         </h1>
         <p className="text-[3cqi] font-bold mt-[4cqi] leading-snug tracking-wide uppercase opacity-90 max-w-[90%] whitespace-pre-wrap">
            {subtext}
         </p>
         
         <div className="mt-[8cqi] mb-[12cqi]">
            <button className="px-[8cqi] py-[3cqi] rounded-[4cqi] text-[3cqi] font-black tracking-wider shadow-xl hover:scale-105 transition-transform border-[0.2cqi] border-white/20" style={{ backgroundColor: colors.secondary, color: colors.primary }}>
               {ctaText}
            </button>
         </div>

         <div className="flex flex-col gap-[2cqi] mt-auto pb-[6cqi]">
            <div className="flex items-center gap-[3cqi]">
               <div className="w-[5cqi] h-[5cqi] rounded-full flex items-center justify-center pt-1" style={{ backgroundColor: colors.secondary, color: colors.primary }}>📞</div>
               <span className="text-[3.5cqi] font-bold">{extraText?.split('\n')[0]}</span>
            </div>
            <div className="flex items-center gap-[3cqi]">
               <div className="w-[5cqi] h-[5cqi] rounded-full flex items-center justify-center pt-1" style={{ backgroundColor: colors.secondary, color: colors.primary }}>📍</div>
               <span className="text-[3cqi] font-bold opacity-90">{extraText?.split('\n')[1]}</span>
            </div>
         </div>
      </div>

      <div className="absolute right-[0cqi] bottom-[0cqi] w-[65%] h-[80%] z-10 flex items-end justify-center pointer-events-none">
         <div className="absolute bottom-[4cqi] left-[4cqi] right-[4cqi] h-[40cqi] -skew-x-[45deg] z-0 opacity-20 border-[0.2cqi] border-current" style={{ backgroundImage: `linear-gradient(${colors.secondary} 1px, transparent 1px), linear-gradient(90deg, ${colors.secondary} 1px, transparent 1px)`, backgroundSize: '4cqi 4cqi' }} />
         <div className="absolute top-[20%] left-[20%] w-[40cqi] h-[80cqi] z-0 opacity-20 border-[0.2cqi] border-current" style={{ backgroundImage: `linear-gradient(${colors.secondary} 1px, transparent 1px), linear-gradient(90deg, ${colors.secondary} 1px, transparent 1px)`, backgroundSize: '4cqi 4cqi' }} />
         
         <div className="absolute top-[30%] left-[-10%] -rotate-[15deg] z-30">
            <h2 className="text-[18cqi] font-serif italic drop-shadow-[0_4px_4px_rgba(0,0,0,0.2)] whitespace-nowrap" style={{ fontFamily: 'cursive', color: colors.secondary }}>
               {badgeText}
            </h2>
         </div>

         <div className="relative w-[110%] h-[110%] z-20 pb-[5cqi] pr-[5cqi]">
            <Image src={productImage} alt="Product" fill className="object-contain object-bottom drop-shadow-[0_40px_30px_rgba(0,0,0,0.6)]" crossOrigin="anonymous" />
         </div>
      </div>
    </div>
  );
}
