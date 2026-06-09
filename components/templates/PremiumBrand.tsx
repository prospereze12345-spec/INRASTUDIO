import React from "react";
import Image from "next/image";

export interface PremiumBrandProps {
  name?: string;
  headline: string;
  subtext: string;
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

export function PremiumBrandTemplate(props: PremiumBrandProps) {
  const { name = "Grand Opening" } = props;

  switch (name) {
    case "Grand Opening": return <VariantGrandOpening {...props} />;
    case "Digital Agency": return <VariantDigitalAgency {...props} />;
    case "Premium Gold": return <VariantPremiumGold {...props} />;
    case "Cleaning Service": return <VariantCleaningService {...props} />;
    case "Organic Deal": return <VariantOrganicDeal {...props} />;
    default: return <VariantGrandOpening {...props} />;
  }
}

const VariantGrandOpening = ({ headline, badgeText, productImage, colors }: PremiumBrandProps) => {
  return (
    <div className="@container w-full h-full relative overflow-hidden flex flex-col font-sans p-[6cqi]" style={{ backgroundColor: colors.primary, color: colors.secondary }}>
      <div className="absolute inset-0 bg-white/5 opacity-30 z-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
      
      <div className="relative z-20 text-center mt-[4cqi]">
        <h1 className="text-[17cqi] font-black uppercase leading-[0.9] tracking-tighter whitespace-pre-wrap drop-shadow-md">
          {headline}
        </h1>
      </div>

      <div className="flex-1 w-full relative z-10 flex items-center justify-center mt-[10cqi]">
        <h1 className="absolute text-[24cqi] font-black uppercase leading-none tracking-tighter text-transparent z-0 opacity-20" style={{ WebkitTextStroke: `1px ${colors.secondary}`}}>
          {headline.split('\n')[2] || "PROMO"}<br/>
          {headline.split('\n')[2] || "PROMO"}<br/>
          {headline.split('\n')[2] || "PROMO"}<br/>
          {headline.split('\n')[2] || "PROMO"}
        </h1>
        <div className="w-[120%] h-[120%] relative z-10">
          <Image src={productImage} alt="Product" fill className="object-contain drop-shadow-2xl scale-[1.1] transition-transform duration-700 hover:scale-[1.15]" crossOrigin="anonymous" />
        </div>
        
        {badgeText && (
          <div className="absolute -bottom-[2cqi] rounded-[50%] w-[35cqi] h-[22cqi] flex flex-col items-center justify-center border-[0.5cqi] border-dashed border-white shadow-lg backdrop-blur-sm transform hover:scale-105 transition-transform z-30" style={{ backgroundColor: colors.primary, color: colors.secondary }}>
             <span className="text-[9cqi] font-black leading-[1]">{badgeText.split('\n')[0]}</span>
             <span className="text-[5cqi] font-bold uppercase tracking-wider">{badgeText.split('\n')[1]}</span>
          </div>
        )}
      </div>
    </div>
  );
}

const VariantDigitalAgency = ({ headline, subtext, ctaText, badgeText, extraText, productImage, colors }: PremiumBrandProps) => {
  return (
    <div className="@container w-full h-full relative overflow-hidden flex flex-col font-sans" style={{ backgroundColor: colors.primary, color: colors.secondary }}>
      <div className="absolute right-[10cqi] top-0 bottom-0 w-[4cqi] bg-[#ff1493] z-0 shadow-lg" style={{ backgroundColor: colors.accent, filter: "brightness(1.5)" }} />
      <div className="absolute right-[20cqi] top-0 bottom-0 w-[4cqi] bg-[#9400d3] z-0 shadow-lg" style={{ backgroundColor: colors.accent, filter: "brightness(0.7)" }} />
      <div className="absolute right-[0cqi] top-0 bottom-0 w-[4cqi] bg-[#ff69b4] z-0 shadow-lg" style={{ backgroundColor: colors.accent, filter: "brightness(1.2)" }} />

      <div className="p-[8cqi] relative z-20 flex-1 flex flex-col">
         <h1 className="text-[14cqi] font-black leading-[1.0] tracking-tight whitespace-pre-wrap drop-shadow-xl" style={{ color: '#fed6e3' }}>
            {headline}
         </h1>
         <div className="w-[20cqi] h-[0.5cqi] my-[4cqi] bg-white/20" />
         <p className="text-[4cqi] opacity-80 leading-snug whitespace-pre-wrap max-w-[65%]">
            {subtext}
         </p>

         <div className="mt-[8cqi]">
            <h3 className="text-[6cqi] font-bold mb-[3cqi]" style={{ color: '#fed6e3' }}>Our Services</h3>
            <div className="text-[3.5cqi] leading-[1.8] opacity-80 max-w-[60%] whitespace-pre-wrap">
               {badgeText?.replace('Our Services\n', '')}
            </div>
         </div>
      </div>

      <div className="absolute right-0 bottom-0 w-[80%] h-[70%] z-10 pointer-events-none">
        <Image src={productImage} alt="Person" fill className="object-cover object-bottom drop-shadow-2xl brightness-110 contrast-110" crossOrigin="anonymous" />
      </div>

      <div className="w-full p-[6cqi] relative z-30 pb-[8cqi]">
         <div className="w-full flex items-center bg-purple-600 rounded-[5cqi] p-[2cqi] shadow-[0_10px_30px_rgba(0,0,0,0.5)] border border-white/20" style={{ backgroundColor: colors.accent }}>
            <button className="bg-black/40 text-white rounded-[4cqi] px-[10cqi] py-[3.5cqi] text-[4cqi] font-bold tracking-wide hover:bg-black/60 transition-colors">
               {ctaText}
            </button>
            <div className="flex-1 flex flex-col items-center justify-center text-[2.8cqi] font-medium leading-tight">
               <span className="font-bold opacity-100">{extraText?.split('\n')[0]}</span>
               <span className="opacity-90">{extraText?.split('\n')[1]}</span>
            </div>
         </div>
      </div>
    </div>
  );
}

const VariantPremiumGold = ({ headline, subtext, ctaText, website, productImage, colors }: PremiumBrandProps) => {
  return (
    <div className="@container w-full h-full relative overflow-hidden flex flex-col font-serif items-center justify-between py-[12cqi] px-[8cqi]" style={{ backgroundColor: colors.primary, color: colors.secondary }}>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/10 to-black/20 z-0" />
      <div className="absolute top-[20%] w-[60%] h-[50%] border-[1.5cqi] border-white/20 z-0 shadow-inner mix-blend-overlay" />
      
      <div className="relative z-20 text-center">
         <h1 className="text-[12cqi] font-normal uppercase tracking-[0.2em] leading-[1.1] whitespace-pre-wrap mb-[3cqi]">
            {headline}
         </h1>
      </div>
      
      <div className="relative z-30 -mt-[4cqi] mb-[4cqi]">
         <div className="px-[8cqi] py-[1.5cqi] text-[5cqi] italic font-black shadow-lg mx-auto" style={{ backgroundColor: colors.accent, color: colors.secondary, boxShadow: "0px 10px 20px rgba(0,0,0,0.15)" }}>
            {subtext}
            <div className="absolute left-[-2cqi] top-[50%] -translate-y-[50%] w-[4cqi] h-[100%] bg-white/20 rotate-[-15deg]" />
            <div className="absolute right-[-2cqi] top-[50%] -translate-y-[50%] w-[4cqi] h-[100%] bg-black/10 rotate-[15deg]" />
         </div>
      </div>

      <div className="flex-1 w-full relative z-20 flex justify-center items-center">
         <div className="absolute w-[200%] h-full pointer-events-none">
            {/* Fake decorative leaves / lighting could be a pattern or SVG, using CSS linear-gradient for now */}
            <div className="absolute left-[10%] top-[40%] w-[3cqi] h-[3cqi] rounded-full bg-white opacity-40 blur-sm shadow-[0_0_20px_white]" />
            <div className="absolute right-[15%] top-[20%] w-[2cqi] h-[2cqi] rounded-full bg-white opacity-60 blur-sm shadow-[0_0_15px_white]" />
         </div>
         <div className="relative w-[110%] h-[110%] scale-[1.1] pb-[10cqi] z-10 z-[5]">
           <Image src={productImage} alt="Product" fill className="object-contain drop-shadow-[0_40px_30px_rgba(0,0,0,0.5)] transition-transform duration-[2s] hover:scale-105" crossOrigin="anonymous" />
         </div>
         <div className="absolute bottom-[5cqi] w-[80%] h-[20cqi] bg-gradient-to-t from-black/20 to-transparent blur-md rounded-[100%] z-[4]" />
         <div className="absolute bottom-[-15cqi] w-[90%] h-[30cqi] rounded-[100%] flex flex-col pt-[2cqi] items-center border-[0.2cqi] border-white/20 shadow-[0_-10px_40px_rgba(0,0,0,0.2)] z-[3]" style={{ background: `linear-gradient(to bottom, ${colors.accent}, #b8860b)` }}>
            <div className="w-[85%] h-[40%] rounded-[100%] border-[0.2cqi] border-white/10" style={{ background: `linear-gradient(to bottom, #ebd197, ${colors.accent})` }} />
         </div>
      </div>

      <div className="relative z-30 mt-[12cqi] text-center">
         <p className="text-[4cqi] font-sans tracking-[0.2em] font-medium opacity-90">{website}</p>
      </div>
    </div>
  );
}

const VariantCleaningService = ({ headline, subtext, badgeText, extraText, productImage, colors }: PremiumBrandProps) => {
  return (
    <div className="@container w-full h-full relative overflow-hidden flex flex-col font-sans bg-[#f5f5f0]" style={{ backgroundColor: colors.primary, color: colors.secondary }}>
      <div className="h-[12cqi] w-full flex items-center justify-between px-[6cqi] z-20 shadow-sm" style={{ backgroundColor: '#c7bca7' }}>
         <div className="flex items-center gap-[2cqi]">
            <div className="w-[6cqi] h-[6cqi] bg-white/30 rounded-sm flex items-center justify-center">✦</div>
         </div>
         <span className="font-bold text-[3.5cqi] tracking-wider text-white drop-shadow-sm">{subtext}</span>
      </div>

      <div className="flex-1 w-full flex flex-col relative z-10">
         <div className="flex h-[45%] w-full">
            <div className="w-[60%] p-[8cqi] flex flex-col justify-center">
               <h3 className="text-[4cqi] font-bold tracking-[0.1em] opacity-80 mb-[2cqi]">PROFESSIONAL</h3>
               <h1 className="text-[12cqi] font-black uppercase leading-[1.0] tracking-tight">
                  {headline.replace('PROFESSIONAL\n', '')}
               </h1>
            </div>
            <div className="w-[40%] h-full relative">
               <Image src={productImage} alt="Cleaning" fill className="object-cover" crossOrigin="anonymous" />
            </div>
         </div>
         <div className="flex h-[55%] w-full">
            <div className="w-[45%] h-full relative">
               <Image src="https://picsum.photos/seed/cleanmirror/400/500" alt="Mirror" fill className="object-cover" crossOrigin="anonymous" />
               <div className="absolute inset-0 bg-black/10" />
            </div>
            <div className="w-[55%] p-[8cqi] flex flex-col justify-center">
               <h3 className="text-[5cqi] font-bold tracking-[0.1em] mb-[4cqi]">OUR SERVICES :</h3>
               <div className="text-[3cqi] font-semibold leading-[2] opacity-80 list-disc ml-[4cqi]">
                  {badgeText?.replace('OUR SERVICES :\n\n', '').split('\n').map((line, i) => (
                    <div key={i} className="whitespace-pre-wrap">{line}</div>
                  ))}
               </div>
            </div>
         </div>
      </div>

      <div className="h-[22cqi] w-full flex items-center justify-center text-center p-[6cqi] z-20" style={{ backgroundColor: colors.accent, color: colors.primary }}>
         <p className="text-[2.8cqi] leading-relaxed max-w-[90%] font-medium opacity-90 mx-auto whitespace-pre-wrap">
            {extraText}
         </p>
      </div>
    </div>
  );
}

const VariantOrganicDeal = ({ headline, subtext, ctaText, website, productImage, colors }: PremiumBrandProps) => {
  return (
    <div className="@container w-full h-full relative overflow-hidden flex flex-col font-serif bg-[#e9eee7] p-[6cqi]" style={{ backgroundColor: colors.primary, color: colors.secondary }}>
      <div className="absolute right-0 top-0 w-1/2 h-1/2 bg-gradient-to-bl from-pink-300/20 to-transparent blur-3xl z-0" />
      
      <div className="w-full flex-1 relative z-10 border-[0.2cqi] border-current flex flex-col p-[4cqi] bg-white/30 backdrop-blur-sm">
         <div className="w-full h-[65%] relative overflow-hidden border-[0.2cqi] border-current">
            <Image src={productImage} alt="Organic" fill className="object-cover scale-[1.05] hover:scale-100 transition-transform duration-1000" crossOrigin="anonymous" />
            <div className="absolute inset-0 bg-black/5" />
            
            <div className="absolute top-[4cqi] right-[4cqi] flex flex-col gap-[1cqi] opacity-80">
               {['Z', 'I', 'N', 'G'].map(l => (
                 <div key={l} className="w-[4cqi] h-[4cqi] bg-white shadow-md text-black flex items-center justify-center text-[2.5cqi] font-sans font-bold">{l}</div>
               ))}
            </div>
         </div>
         
         <div className="flex-1 flex flex-col items-center justify-center text-center pt-[6cqi]">
            <h3 className="text-[3.5cqi] font-sans tracking-[0.2em] font-medium opacity-80 mb-[4cqi] whitespace-pre-wrap uppercase">
               {subtext}
            </h3>
            
            <h1 className="text-[11cqi] font-normal leading-[1.0] tracking-wide whitespace-pre-wrap mb-[5cqi] text-[#3e4f35]">
               {headline}
            </h1>
            
            <button className="px-[8cqi] py-[2.5cqi] rounded-full text-[4cqi] font-sans font-bold uppercase tracking-widest text-[#e9eee7] hover:bg-black hover:text-white transition-colors" style={{ backgroundColor: colors.accent }}>
               {ctaText}
            </button>
         </div>
      </div>

      <div className="absolute bottom-[6cqi] left-0 right-0 text-center z-10 pointers-events-none">
         <p className="text-[3cqi] font-sans tracking-[0.2em] uppercase font-bold opacity-80">{website}</p>
      </div>

      <div className="absolute bottom-[-5cqi] left-[-5cqi] text-[18cqi] rotate-[45deg] opacity-20 pointer-events-none">🌿</div>
      <div className="absolute bottom-[-5cqi] right-[-5cqi] text-[18cqi] rotate-[-45deg] scale-x-[-1] opacity-20 pointer-events-none">🌿</div>
    </div>
  );
}
