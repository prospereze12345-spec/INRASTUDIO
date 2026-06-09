import React from "react";
import Image from "next/image";

export interface MinimalProductProps {
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

export function MinimalProductTemplate(props: MinimalProductProps) {
  const { name = "Gold Frame" } = props;

  switch (name) {
    case "Gold Frame": return <VariantGoldFrame {...props} />;
    case "Dark Arch": return <VariantDarkArch {...props} />;
    case "Fresh Green": return <VariantFreshGreen {...props} />;
    case "Feature Circle": return <VariantFeatureCircle {...props} />;
    case "Elegant Outline": return <VariantElegantOutline {...props} />;
    case "Pink Podium": return <VariantPinkPodium {...props} />;
    case "Floral Watercolor": return <VariantFloralWatercolor {...props} />;
    case "Split Shadow": return <VariantSplitShadow {...props} />;
    case "Abstract Circles": return <VariantAbstractCircles {...props} />;
    case "Dark Split": return <VariantDarkSplit {...props} />;
    default: return <VariantGoldFrame {...props} />;
  }
}

const VariantGoldFrame = ({ headline, subtext, ctaText, productImage, colors }: MinimalProductProps) => {
  return (
    <div className="@container w-full h-full relative overflow-hidden flex flex-row items-center font-sans tracking-wide p-[6cqi]" style={{ backgroundColor: colors.primary, color: colors.secondary }}>
      <div className="absolute inset-[6cqi] border-[0.8cqi] z-20 pointer-events-none" style={{ borderColor: colors.accent }} />
      <div className="w-[45%] h-[80%] relative z-10 ml-[4cqi]">
        <Image src={productImage} alt="Product" fill className="object-contain drop-shadow-xl" crossOrigin="anonymous" />
      </div>
      <div className="w-[55%] flex flex-col items-center justify-center text-center px-[4cqi] relative z-10">
        <span className="text-[3.5cqi] tracking-[0.5em] uppercase mb-[2cqi] font-medium">{headline.split('\n')[0]}</span>
        <h1 className="text-[12cqi] font-serif italic mb-[4cqi] leading-none" style={{ fontFamily: 'Georgia, serif' }}>
          {headline.split('\n')[1] || headline}
        </h1>
        <p className="text-[2.5cqi] opacity-80 leading-relaxed mb-[8cqi] max-w-[80%]">{subtext}</p>
        <div className="border border-black px-[6cqi] py-[2.5cqi] text-[2.5cqi] tracking-[0.4em] uppercase" style={{ borderColor: colors.secondary }}>
          {ctaText}
        </div>
      </div>
    </div>
  );
}

const VariantDarkArch = ({ headline, subtext, ctaText, productImage, colors }: MinimalProductProps) => {
  return (
    <div className="@container w-full h-full relative overflow-hidden flex flex-col items-center justify-center font-sans p-[8cqi]" style={{ backgroundColor: colors.primary, color: colors.secondary }}>
      {/* Decorative Dots */}
      <div className="absolute top-[6cqi] left-[6cqi] grid grid-cols-3 gap-2 opacity-60">
        {[...Array(9)].map((_, i) => <div key={i} className="w-[1cqi] h-[1cqi] rounded-full bg-white" />)}
      </div>
      <div className="absolute top-[6cqi] right-[6cqi] grid grid-cols-2 gap-2 opacity-60">
        {[...Array(8)].map((_, i) => <div key={i} className="w-[1cqi] h-[1cqi] rounded-full bg-white" />)}
      </div>
      
      {/* Abstract lines */}
      <div className="absolute right-[-10cqi] top-[10cqi] w-[40cqi] h-[80cqi] rounded-full border-[1cqi] border-white/20 z-0" />
      <div className="absolute right-[-15cqi] top-[5cqi] w-[45cqi] h-[90cqi] rounded-full border-[0.5cqi] border-white/10 z-0" />

      <div className="absolute bottom-[-20cqi] left-[-20cqi] w-[60cqi] h-[60cqi] rounded-full border-[1cqi] border-white/20 z-0" />
      <div className="absolute bottom-[-15cqi] left-[-15cqi] w-[50cqi] h-[50cqi] rounded-full border-[0.5cqi] border-white/10 z-0" />
      
      <div className="w-full text-right text-[2.5cqi] mb-[4cqi] z-10 relative">{subtext}</div>
      
      <h1 className="text-[14cqi] font-black uppercase leading-[1.2] tracking-widest text-transparent w-full z-10" 
          style={{ WebkitTextStroke: '2px white' }}>
        {headline.split('\n')[0]}<br/>{headline.split('\n')[1]}
      </h1>
      
      <div className="w-[70%] h-[50%] relative z-10 mt-[4cqi] flex items-end justify-center">
        <Image src={productImage} alt="Product" fill className="object-contain object-bottom scale-125" crossOrigin="anonymous" />
      </div>
      
      <div className="w-full flex justify-end z-20 mt-[4cqi]">
        <div className="bg-white text-black px-[6cqi] py-[2cqi] rounded-full font-bold text-[3.5cqi] tracking-wider uppercase">
          {ctaText}
        </div>
      </div>
    </div>
  );
}

const VariantFreshGreen = ({ headline, subtext, badgeText, ctaText, brandName, website, productImage, colors }: MinimalProductProps) => {
  return (
    <div className="@container w-full h-full relative overflow-hidden flex flex-col font-sans p-[6cqi]" style={{ backgroundColor: colors.primary, color: colors.secondary }}>
      <div className="flex items-center gap-[2cqi] text-[4cqi] font-bold text-[#8cb369] mb-[4cqi]" style={{ color: colors.accent }}>
        {/* Simple lotus icon */}
        <div className="w-[6cqi] h-[6cqi] rounded-full border-2 border-current flex items-center justify-center">
           <div className="w-[3cqi] h-[3cqi] border-b-2 border-r-2 border-current transform rotate-45" />
        </div>
        {brandName}
      </div>
      
      <h1 className="text-[16cqi] font-black leading-[0.9] tracking-tighter w-[60%] mb-[4cqi] whitespace-pre-wrap">
        <span style={{ color: colors.accent }}>{headline.split('\n')[0]}</span><br/>
        {headline.split('\n')[1]}
      </h1>
      
      <div className="bg-[#8cb369] rounded-2xl p-[6cqi] w-[80%] text-white relative z-0 flex flex-col" style={{ backgroundColor: colors.accent }}>
        <h2 className="text-[12cqi] font-black italic">{badgeText}</h2>
        <p className="text-[3cqi] font-medium opacity-90 mt-[1cqi] mb-[4cqi]">{subtext}</p>
        <button className="bg-[#f0f4f8] text-[#333333] font-black text-[5cqi] uppercase px-[4cqi] py-[2cqi] rounded self-start shadow-md">
          {ctaText}
        </button>
      </div>

      <div className="absolute right-[4cqi] bottom-[15cqi] w-[45%] h-[65%] z-10">
        <Image src={productImage} alt="Product" fill className="object-contain object-bottom drop-shadow-[0_20px_20px_rgba(0,0,0,0.3)] scale-[1.1]" crossOrigin="anonymous" />
      </div>

      <div className="absolute bottom-0 left-0 w-full bg-[#8cb369] text-white text-center py-[2cqi] text-[3cqi] font-medium tracking-wider z-0" style={{ backgroundColor: colors.accent }}>
        {website}
      </div>
    </div>
  );
}

const VariantFeatureCircle = ({ headline, subtext, ctaText, website, productImage, colors }: MinimalProductProps) => {
  const features = (subtext || '').split('•').map(f => f.trim()).filter(Boolean);
  return (
    <div className="@container w-full h-full relative overflow-hidden flex flex-col items-center justify-center font-serif py-[8cqi]" style={{ backgroundColor: colors.primary, color: colors.secondary }}>
      <div className="text-center w-[80%] z-20 mb-[4cqi]">
        <h1 className="text-[10cqi] leading-[1.1] mb-[1cqi]">
          The Benefits of<br/>
          <span className="italic font-bold text-[12cqi]">{headline.split('\n')[1] || "Using Product"}</span>
        </h1>
      </div>
      
      <div className="w-full relative flex-1 flex justify-center items-center z-10 my-[4cqi]">
        <div className="absolute w-[65cqi] h-[65cqi] border-[0.5cqi] rounded-full scale-100 z-0" style={{ borderColor: colors.accent }} />
        
        <div className="absolute inset-0 flex items-center justify-center z-20">
          <div className="w-[30%] h-[90%] relative scale-125">
            <Image src={productImage} alt="Product" fill className="object-contain drop-shadow-xl" crossOrigin="anonymous" />
          </div>
        </div>

        {/* Feature badges positioned around the circle */}
        {features.length >= 1 && (
          <div className="absolute left-[4cqi] top-[20%] bg-white rounded-full px-[3cqi] py-[1.5cqi] text-[2.2cqi] font-sans font-bold shadow-md z-30" style={{ backgroundColor: colors.accent, color: 'white' }}>
            {features[0]}
          </div>
        )}
        {features.length >= 2 && (
          <div className="absolute right-[4cqi] top-[20%] bg-white rounded-full px-[3cqi] py-[1.5cqi] text-[2.2cqi] font-sans font-bold shadow-md z-30" style={{ backgroundColor: colors.accent, color: 'white' }}>
            {features[1]}
          </div>
        )}
        {features.length >= 3 && (
          <div className="absolute left-[4cqi] top-[45%] bg-white rounded-full px-[3cqi] py-[1.5cqi] text-[2.2cqi] font-sans font-bold shadow-md z-30" style={{ backgroundColor: colors.accent, color: 'white' }}>
            {features[2]}
          </div>
        )}
        {features.length >= 4 && (
          <div className="absolute right-[4cqi] top-[45%] bg-white rounded-full px-[3cqi] py-[1.5cqi] text-[2.2cqi] font-sans font-bold shadow-md z-30" style={{ backgroundColor: colors.accent, color: 'white' }}>
            {features[3]}
          </div>
        )}
        {features.length >= 5 && (
          <div className="absolute left-[4cqi] bottom-[20%] bg-white rounded-full px-[3cqi] py-[1.5cqi] text-[2.2cqi] font-sans font-bold shadow-md z-30" style={{ backgroundColor: colors.accent, color: 'white' }}>
            {features[4]}
          </div>
        )}
      </div>

      <div className="text-[3cqi] font-sans font-bold tracking-widest mt-auto z-20">
        {website}
      </div>
    </div>
  );
}

const VariantElegantOutline = ({ headline, subtext, ctaText, website, productImage, colors }: MinimalProductProps) => {
  return (
    <div className="@container w-full h-full relative overflow-hidden flex flex-col font-sans p-[4cqi]" style={{ backgroundColor: colors.primary, color: colors.secondary }}>
      <div className="w-full h-full border-[0.3cqi] relative z-10 flex flex-col items-center justify-center" style={{ borderColor: 'rgba(0,0,0,0.2)' }}>
        
        <div className="absolute top-[4cqi] text-[2.5cqi] font-bold tracking-widest opacity-80 z-20">
          {website}
        </div>

        <div className="absolute inset-0 flex flex-col justify-center items-center overflow-hidden z-10 pointer-events-none px-[4cqi]">
           <h1 className="text-[28cqi] font-serif leading-[0.8] tracking-tighter text-center uppercase whitespace-pre-wrap opacity-5"
               style={{ WebkitTextStroke: '2px black', color: 'transparent' }}>
             {headline}
           </h1>
           {/* Geometric ellipse outline */}
           <div className="absolute top-[25%] right-[10%] w-[60cqi] h-[20cqi] border-[0.2cqi] rounded-[50%] -rotate-12 opacity-40 z-0 flex items-center justify-between" style={{ borderColor: colors.secondary }}>
              <div className="w-[4cqi] h-[4cqi] -ml-[2cqi] rotate-45 border border-current bg-white" />
              <div className="w-[4cqi] h-[4cqi] -mr-[2cqi] rotate-45 border border-current bg-white" />
           </div>
        </div>
        
        <div className="w-full flex items-center h-full relative z-20 px-[8cqi]">
           <div className="w-[45%] h-[80%] relative ml-[5%]">
             <Image src={productImage} alt="Product" fill className="object-contain drop-shadow-2xl scale-110" crossOrigin="anonymous" />
           </div>
        </div>

      </div>
    </div>
  );
}

const VariantPinkPodium = ({ headline, subtext, ctaText, productImage, colors }: MinimalProductProps) => {
  const parts = (subtext || '').split('•').map(p => p.trim()).filter(Boolean);
  return (
    <div className="@container w-full h-full relative overflow-hidden flex flex-col font-sans items-center pt-[10cqi]" style={{ backgroundColor: colors.primary, color: colors.secondary }}>
      <div className="absolute w-[120cqi] h-[120cqi] rounded-full top-[5cqi] bg-white/10 z-0 mix-blend-overlay" />
      
      <h2 className="text-[4cqi] font-bold tracking-[0.4em] uppercase mb-[8cqi] z-20 text-white drop-shadow-md">
        • {headline} •
      </h2>
      
      <div className="w-full flex-1 relative z-10 flex items-center justify-center">
         <div className="w-[40%] h-full relative z-20 scale-125 pb-[20cqi]">
            <Image src={productImage} alt="Product" fill className="object-contain object-bottom drop-shadow-2xl" crossOrigin="anonymous" />
         </div>

         {parts[0] && (
           <div className="absolute left-[8cqi] top-[30%] text-white z-30">
             <div className="text-[3cqi] font-bold tracking-widest mb-[0.5cqi] whitespace-nowrap">{parts[0]}</div>
             <div className="w-full h-[1px] bg-white opacity-50 mb-[0.5cqi]" />
             <div className="text-[2cqi] opacity-80 whitespace-nowrap">{parts[1] || 'Ingredient'}</div>
           </div>
         )}
         {parts[2] && (
           <div className="absolute right-[8cqi] top-[30%] text-white z-30 text-right">
             <div className="text-[3cqi] font-bold tracking-widest mb-[0.5cqi] whitespace-nowrap">{parts[2]}</div>
             <div className="w-full h-[1px] bg-white opacity-50 mb-[0.5cqi]" />
             <div className="text-[2cqi] opacity-80 whitespace-nowrap">{parts[3] || 'Ingredient'}</div>
           </div>
         )}
      </div>

      <div className="absolute bottom-0 w-[150%] h-[35cqi] flex justify-center items-end z-0">
         <div className="w-[80cqi] h-[25cqi] rounded-[50%] bg-[#f3a8b6] shadow-inner mb-[-10cqi] border-t-8 border-[#f8bcc8] relative z-10 flex justify-center">
         </div>
      </div>
    </div>
  );
}

const VariantFloralWatercolor = ({ headline, subtext, badgeText, ctaText, productImage, colors }: MinimalProductProps) => {
  return (
    <div className="@container w-full h-full relative overflow-hidden flex flex-col font-sans px-[8cqi] py-[6cqi]" style={{ backgroundColor: colors.primary, color: colors.secondary }}>
      
      {/* Top purple edge */}
      <div className="absolute top-0 left-0 w-full h-[8cqi] z-20 pointer-events-none" style={{ backgroundColor: colors.accent, clipPath: 'polygon(0 0, 100% 0, 100% 100%, 85% 80%, 70% 100%, 55% 80%, 40% 100%, 25% 80%, 10% 100%, 0 80%)' }} />
      {/* Bottom purple area */}
      <div className="absolute bottom-0 left-0 w-full h-[30cqi] z-10 pointer-events-none opacity-80" style={{ backgroundColor: colors.accent, borderRadius: '40% 100% 0 0' }} />
      
      <div className="flex justify-between items-center text-[2.5cqi] font-bold relative z-20 opacity-80 mt-[4cqi]">
        <div className="flex items-center gap-[2cqi]">
          <div className="w-[3cqi] h-[3cqi] rotate-45 bg-black" />
          {subtext}
        </div>
        <div>{badgeText}</div>
      </div>

      <div className="text-center mt-[12cqi] relative z-20">
         <h1 className="text-[14cqi] font-medium leading-[1.1] text-black">
           {headline.split('\n')[0]}<br/>
           {headline.split('\n')[1] || "Product"}
         </h1>
         <div className="w-[40cqi] h-[0.3cqi] mx-auto mt-[2cqi]" style={{ backgroundColor: colors.accent }} />
      </div>

      <div className="flex-1 w-full relative z-20 mt-[4cqi]">
         <Image src={productImage} alt="Product" fill className="object-contain scale-110 drop-shadow-2xl" crossOrigin="anonymous" />
         
         <div className="absolute left-[15cqi] top-[50%] bg-purple-900 text-white px-[4cqi] py-[1.5cqi] rounded-full text-[2.5cqi] font-bold flex items-center shadow-lg" style={{ backgroundColor: colors.accent }}>
           {ctaText}
         </div>
      </div>
    </div>
  );
}

const VariantSplitShadow = ({ headline, subtext, badgeText, ctaText, website, productImage, colors }: MinimalProductProps) => {
  return (
    <div className="@container w-full h-full relative overflow-hidden flex flex-row font-serif" style={{ backgroundColor: colors.primary, color: colors.secondary }}>
      
      {/* Shadow overlay leaf effect */}
      <div className="absolute top-[-10cqi] left-[-10cqi] w-[60cqi] h-[60cqi] bg-black/5 rounded-full blur-[20px] z-20 pointer-events-none" />
      
      <div className="absolute top-[8cqi] right-[8cqi] z-30 flex items-center gap-[1cqi] text-[3.5cqi] tracking-wider uppercase font-sans">
        {ctaText.replace('>>', '')}
        <div className="flex gap-[0.2cqi]">
          <div className="w-[2cqi] h-[2cqi] border-r-[0.4cqi] border-t-[0.4cqi] rotate-45 border-current" />
          <div className="w-[2cqi] h-[2cqi] border-r-[0.4cqi] border-t-[0.4cqi] rotate-45 border-current -ml-[1cqi]" />
        </div>
      </div>

      <div className="w-1/2 h-[75%] absolute top-[12.5%] left-[8cqi] z-20 bg-white rounded-3xl overflow-hidden shadow-2xl">
         <Image src={productImage} alt="Product" fill className="object-cover" crossOrigin="anonymous" />
      </div>

      <div className="absolute bottom-[20%] right-[-5cqi] w-[60%] h-[55%] rounded-l-3xl z-10 flex flex-col justify-center pl-[25cqi]" style={{ backgroundColor: colors.accent, color: 'white' }}>
         <h2 className="text-[7cqi] font-serif italic mb-[2cqi] leading-tight">
           {headline.split('\n')[0]}<br/>
           {headline.split('\n')[1]}<br/>
           {headline.split('\n')[2]}
         </h2>
         <h1 className="text-[9cqi] font-sans font-light tracking-widest mt-[2cqi]">{badgeText}</h1>
      </div>

      <div className="absolute bottom-[6cqi] w-full text-center text-[3cqi] font-sans font-bold tracking-widest z-10">
        {website}
      </div>
    </div>
  );
}

const VariantAbstractCircles = ({ headline, subtext, ctaText, productImage, colors }: MinimalProductProps) => {
  return (
    <div className="@container w-full h-full relative overflow-hidden flex flex-col font-serif items-center pt-[12cqi]" style={{ backgroundColor: colors.primary, color: colors.secondary }}>
      
      <div className="absolute -top-[10cqi] left-[15cqi] w-[25cqi] h-[25cqi] rounded-full z-0 opacity-80" style={{ backgroundColor: colors.accent }} />
      <div className="absolute top-[20cqi] -right-[10cqi] w-[20cqi] h-[20cqi] rounded-full z-0 opacity-80" style={{ backgroundColor: colors.accent }} />
      <div className="absolute top-[50%] -left-[10cqi] w-[18cqi] h-[18cqi] rounded-full z-0 bg-[#5d554a]" />
      <div className="absolute -bottom-[10cqi] -right-[5cqi] w-[35cqi] h-[35cqi] rounded-full z-0 opacity-80" style={{ backgroundColor: colors.accent }} />

      <h3 className="text-[3cqi] font-sans font-bold tracking-widest uppercase mb-[4cqi] z-10 opacity-70">
        {subtext}
      </h3>
      
      <h1 className="text-[14cqi] text-center leading-[1.1] z-10 mb-[6cqi] w-[80%]">
        {headline.split('\n')[0]}<br/>
        {headline.split('\n')[1]}
      </h1>

      <button className="px-[6cqi] py-[2cqi] border border-current rounded-[3cqi] font-sans text-[3cqi] uppercase tracking-wider z-10 bg-white/50 backdrop-blur-sm">
        {ctaText}
      </button>

      <div className="flex-1 w-full relative z-10 mt-[8cqi]">
        <Image src={productImage} alt="Product" fill className="object-contain object-bottom scale-125" crossOrigin="anonymous" />
      </div>
    </div>
  );
}

const VariantDarkSplit = ({ headline, subtext, badgeText, website, productImage, colors }: MinimalProductProps) => {
  return (
    <div className="@container w-full h-full relative overflow-hidden flex flex-col font-sans p-[4cqi]" style={{ backgroundColor: colors.primary, color: colors.secondary }}>
      <div className="absolute top-[4cqi] left-[4cqi] right-[4cqi] border-t border-white/20 z-10 flex justify-between pt-[3cqi]">
         <div className="w-[40%] h-[0.1cqi] bg-white opacity-40 ml-[4cqi] mt-[1.5cqi]" />
         <div className="text-[2.2cqi] tracking-[0.2em] uppercase font-bold opacity-80 mr-[8cqi]">{subtext}</div>
      </div>

      <div className="absolute right-[4cqi] top-[20cqi] bottom-[4cqi] border-r border-white/40 z-10" />

      <div className="absolute left-[0] top-[0] w-[60%] h-full z-0 overflow-hidden">
        <Image src={productImage} alt="Product" fill className="object-cover" crossOrigin="anonymous" />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#5d6059]" style={{ backgroundImage: `linear-gradient(to right, transparent, ${colors.primary})` }} />
      </div>
      
      <div className="w-full flex-1 relative z-20 flex flex-col pt-[15cqi] pl-[30%]">
        
        <h2 className="text-[10cqi] font-serif italic mb-[-2cqi]" style={{ color: colors.accent, fontFamily: 'cursive' }}>
          {headline.split('\n')[0]}
        </h2>
        
        <h1 className="text-[16cqi] font-black uppercase leading-[0.8] tracking-tighter drop-shadow-xl text-white mix-blend-difference mb-[40%]">
          {headline.split('\n')[1]}<br/>
          {headline.split('\n')[2]}
        </h1>

        <div className="bg-red-500 text-white w-[80%] py-[3cqi] px-[6cqi] ml-[10%] text-center text-[3.5cqi] font-medium tracking-wide shadow-xl relative z-30" style={{ backgroundColor: colors.accent }}>
          {badgeText}
        </div>
        
      </div>
      
      {/* Decorative dot matrix */}
      <div className="absolute bottom-[8cqi] left-[8cqi] grid grid-cols-4 gap-2 z-20 opacity-80">
         {[...Array(16)].map((_, i) => <div key={i} className="w-[1cqi] h-[1cqi] rounded-full bg-white" />)}
      </div>

      <div className="absolute bottom-[4cqi] left-[4cqi] right-[4cqi] border-b border-white/20 z-10 flex justify-between pb-[3cqi] px-[6cqi]">
         <div className="text-[2.5cqi] font-bold opacity-80">{website}</div>
      </div>
    </div>
  );
}
