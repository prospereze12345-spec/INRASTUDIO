"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useInView } from "motion/react";
import { Menu, X, Play, Sparkles, Image as ImageIcon, Video, Type, CheckCircle, Upload, Zap, ArrowRight, Star, LayoutTemplate, Facebook, Instagram } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Logo } from "@/components/Logo";
import { Navbar } from "@/components/Navbar";



function Hero() {
  return (
    <section className="pt-40 pb-20 md:pt-48 md:pb-32 px-6 max-w-7xl mx-auto relative z-10 flex flex-col lg:flex-row items-center gap-16">
      {/* Background Glow */}
      <div className="absolute top-0 w-[800px] h-[500px] bg-cyan-500/10 blur-[120px] rounded-full pointer-events-none -left-20" />
      
      {/* Left Content */}
      <div className="flex-1 text-center lg:text-left z-10 w-full">
        <motion.div initial={{opacity:0, y:20}} animate={{opacity:1,y:0}} transition={{duration:0.8}} className="inline-flex items-center justify-center lg:justify-start gap-2 px-4 py-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-400 text-sm font-medium mb-6">
          <Sparkles className="w-4 h-4" />
          <span>African AI Marketing Studio</span>
        </motion.div>
        
        <motion.h1 initial={{opacity:0, y:20}} animate={{opacity:1,y:0}} transition={{duration:0.8, delay:0.1}} className="text-5xl md:text-6xl lg:text-7xl font-display font-bold tracking-tight text-white leading-[1.1] mb-6">
          Create Flyers, Captions & Promo Videos in Minutes with AI
        </motion.h1>

        <motion.p initial={{opacity:0, y:20}} animate={{opacity:1,y:0}} transition={{duration:0.8, delay:0.2}} className="text-lg md:text-xl text-slate-400 font-light leading-relaxed max-w-2xl mx-auto lg:mx-0 mb-10">
          Upload your product once and let AI create everything you need to market and sell across WhatsApp, Instagram, Facebook and TikTok.
        </motion.p>
        
        <motion.div initial={{opacity:0, y:20}} animate={{opacity:1,y:0}} transition={{duration:0.8, delay:0.3}} className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
          <Link href="/signup" className="w-full sm:w-auto px-8 py-4 rounded-full bg-cyan-400 text-[#0a1128] font-bold text-lg hover:bg-cyan-300 transition-colors shadow-[0_0_30px_rgba(34,211,238,0.3)] hover:shadow-[0_0_50px_rgba(34,211,238,0.5)] flex items-center justify-center gap-2">
            Start Free Trial <ArrowRight className="w-5 h-5" />
          </Link>
          <a href="#demo" className="w-full sm:w-auto px-8 py-4 rounded-full bg-white/5 border border-white/10 text-white font-medium text-lg hover:bg-white/10 transition-colors flex items-center justify-center gap-2">
            <Play className="w-5 h-5 fill-white/50" /> Watch Demo
          </a>
        </motion.div>

        <motion.div initial={{opacity:0, y:20}} animate={{opacity:1,y:0}} transition={{duration:0.8, delay:0.4}} className="mt-10 inline-flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 text-sm font-medium bg-white/5 backdrop-blur-xl border border-white/10 rounded-full px-6 py-3 shadow-2xl">
             <div className="flex -space-x-3 shrink-0">
               {[
                 "https://images.unsplash.com/photo-1531384441138-2736e62e0919?w=100&h=100&fit=crop&q=80",
                 "https://images.unsplash.com/photo-1531123897727-8f129e1bf98c?w=100&h=100&fit=crop&q=80",
                 "https://images.unsplash.com/photo-1543269865-cbf427effbad?w=100&h=100&fit=crop&q=80",
                 "https://images.unsplash.com/photo-1506803682981-6e718a9dd3ee?w=100&h=100&fit=crop&q=80",
                 "https://images.unsplash.com/photo-1522529599102-193c0d76b5b6?w=100&h=100&fit=crop&q=80"
               ].map((src, i) => (
                 <div key={i}>
                   {/* eslint-disable-next-line @next/next/no-img-element */}
                   <img src={src} alt={`User ${i + 1}`} className="w-8 h-8 rounded-full border-2 border-[#0a1128] object-cover shadow-sm" />
                 </div>
               ))}
             </div>
             <div className="text-slate-300 tracking-wide">
               <span className="text-white font-semibold">Trusted by 1,000+</span> smart business owners
             </div>
        </motion.div>
      </div>

      {/* Right Content - Mockup */}
      <motion.div initial={{opacity:0, scale:0.95}} animate={{opacity:1, scale:1}} transition={{duration:1, delay:0.4}} className="flex-1 w-full max-w-lg lg:max-w-none relative z-10">
        <div className="bg-[#0a1128]/80 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 shadow-2xl relative">
           <div className="absolute top-4 left-4 flex gap-1.5">
             <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
             <div className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
             <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
           </div>
           
           <div className="mt-8 flex flex-col gap-6">
             {/* Upload Step */}
             <div className="flex items-center gap-4 bg-white/5 border border-white/10 border-dashed rounded-2xl p-4">
               <div className="w-12 h-12 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0">
                 <Upload className="w-6 h-6" />
               </div>
               <div>
                  <h4 className="font-medium text-white">Product Upload</h4>
                  <p className="text-xs text-slate-400">sneaker_photo.jpg</p>
               </div>
               <div className="ml-auto shrink-0">
                 <div className="w-6 h-6 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center"><CheckCircle className="w-4 h-4" /></div>
               </div>
             </div>

             <div className="flex justify-center -my-2"><ArrowRight className="w-5 h-5 text-slate-500 rotate-90" /></div>

             {/* Output Grid */}
             <div className="grid grid-cols-2 gap-4">
               <div className="bg-white/5 rounded-2xl p-4 border border-white/5 relative overflow-hidden group">
                 <div className="absolute inset-0 bg-cyan-400/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                 <ImageIcon className="w-6 h-6 text-cyan-400 mb-3" />
                 <h4 className="font-medium text-sm text-white">Instagram Flyer</h4>
                 <div className="w-full h-2 rounded bg-white/10 mt-2"></div>
                 <div className="w-2/3 h-2 rounded bg-white/10 mt-1"></div>
               </div>
               <div className="bg-white/5 rounded-2xl p-4 border border-white/5 relative overflow-hidden group">
                 <div className="absolute inset-0 bg-cyan-400/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                 <Video className="w-6 h-6 text-cyan-400 mb-3" />
                 <h4 className="font-medium text-sm text-white">Promo Video</h4>
                 <div className="w-full h-2 rounded bg-white/10 mt-2"></div>
                 <div className="w-3/4 h-2 rounded bg-white/10 mt-1"></div>
               </div>
               <div className="col-span-2 bg-white/5 rounded-2xl p-4 border border-white/5 text-sm font-medium">
                 <Type className="w-5 h-5 text-cyan-400 inline mr-2 shrink-0 align-text-bottom" />
                 <span className="text-slate-300 leading-snug">&quot;Step up your game with our new premium drop! 🔥👟 #SneakerHead #FreshKicks&quot;</span>
               </div>
             </div>

           </div>
        </div>
      </motion.div>
    </section>
  );
}

function AnimatedCounter({ target, suffix = "+" }: { target: number, suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  useEffect(() => {
    if (isInView) {
      let startTimestamp: number | null = null;
      const duration = 2000;
      const step = (timestamp: number) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        const easeOut = 1 - Math.pow(1 - progress, 3);
        setCount(Math.floor(easeOut * target));
        if (progress < 1) {
          window.requestAnimationFrame(step);
        }
      };
      window.requestAnimationFrame(step);
    }
  }, [isInView, target]);

  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
}

function Stats() {
  return (
    <section className="py-12 border-y border-white/5 flex bg-white/[0.01]">
       <div className="max-w-7xl mx-auto px-6 w-full flex flex-col items-center">
         <p className="text-center text-slate-400 uppercase tracking-widest text-sm font-medium mb-8">Built for African Businesses</p>
         <div className="flex flex-col items-center justify-center text-center">
           <div className="text-5xl md:text-6xl font-display font-medium text-white mb-2"><AnimatedCounter target={1000} /></div>
           <div className="text-cyan-400 text-sm md:text-base font-medium tracking-wide">AI CAMPAIGNS GENERATED</div>
         </div>
       </div>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    { icon: Upload, title: "Upload Product", desc: "Upload a photo of your product." },
    { icon: LayoutTemplate, title: "Pick Template", desc: "Pick a template from the flow." },
    { icon: Sparkles, title: "AI Analysis", desc: "The AI analyzes them together to compose the best design." },
    { icon: ImageIcon, title: "Generate Campaign", desc: "Get a flyer, caption and promo video instantly." }
  ];

  return (
    <section className="py-24 px-6 max-w-7xl mx-auto">
       <div className="text-center mb-16">
         <h2 className="text-4xl md:text-5xl font-display font-medium text-white mb-4">How It Works</h2>
         <p className="text-lg text-slate-400 max-w-2xl mx-auto">From a single raw product photo to a full marketing campaign in seconds.</p>
       </div>
       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
         {steps.map((step, i) => (
           <div key={i} className="relative p-8 rounded-3xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-colors group text-center flex flex-col items-center">
             <div className="w-16 h-16 rounded-full bg-cyan-400/10 flex items-center justify-center text-cyan-400 mb-6 group-hover:scale-110 group-hover:bg-cyan-400/20 transition-all">
                <step.icon className="w-8 h-8" />
             </div>
             <h3 className="text-xl font-semibold text-white mb-3">{step.title}</h3>
             <p className="text-slate-400 text-sm leading-relaxed">{step.desc}</p>
             {i !== steps.length - 1 && (
               <ArrowRight className="hidden lg:block absolute -right-6 top-1/2 -translate-y-1/2 text-white/20 w-8 h-8 z-10" />
             )}
           </div>
         ))}
       </div>
    </section>
  );
}

function Testimonials() {
  const reviews = [
    {
      name: "Chukwudi N.",
      location: "Lagos, NG",
      text: "INRASTUDIO completely changed how I run my boutique. I create professional promos in seconds without paying a designer."
    },
    {
      name: "Amara S.",
      location: "Accra, GH",
      text: "The AI captions are incredibly accurate. It knows exactly how to pitch my luxury perfumes. Sales have doubled!"
    },
    {
      name: "Kwame K.",
      location: "Nairobi, KE",
      text: "I used to struggle with Canva for hours. With this, I just upload a picture of my food, and the flyer is ready."
    },
    {
      name: "Sarah M.",
      location: "Johannesburg, SA",
      text: "The templates are perfectly suited for the African market. My collection launches look like a premium brand now."
    },
    {
      name: "Femi O.",
      location: "Abuja, NG",
      text: "Unbelievably fast. The flash sale templates generate so much engagement on my WhatsApp statuses."
    }
  ];

  const carouselRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    if (carouselRef.current) {
      setWidth(carouselRef.current.scrollWidth - carouselRef.current.offsetWidth);
    }
  }, []);

  return (
    <section className="py-24 relative overflow-hidden bg-[#0a1128] border-t border-white/5">
       <div className="max-w-7xl mx-auto relative z-10 w-full overflow-hidden">
         <div className="text-center mb-16 px-6">
            <h2 className="text-4xl md:text-6xl font-display font-medium text-white mb-6 tracking-tight drop-shadow-md">Enjoyed by Many</h2>
            <div className="w-3/4 max-w-lg mx-auto h-[1px] bg-gradient-to-r from-transparent via-white/50 to-transparent mb-6" />
            <p className="text-lg text-slate-200 font-medium tracking-wide drop-shadow-md max-w-2xl mx-auto">Real Stories, Real Growth - Hear from Businesses Who&apos;ve Transformed Their Marketing</p>
         </div>

         <div ref={carouselRef} className="cursor-grab active:cursor-grabbing w-full overflow-hidden px-6 md:px-12">
            <motion.div 
               drag="x" 
               dragConstraints={{ right: 0, left: -width }} 
               className="flex gap-6 pb-12 pt-4 w-max"
            >
              {reviews.map((review, i) => (
                <div key={i} className="w-[320px] md:w-[420px] bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-colors p-8 rounded-[2rem] flex flex-col justify-between shadow-lg pointer-events-none">
                   <div>
                     <div className="flex items-center justify-between mb-8">
                       <div>
                         <h3 className="text-white font-medium text-xl leading-tight">{review.name}</h3>
                         <p className="text-slate-400 text-sm font-light">{review.location}</p>
                       </div>
                       <div className="flex items-center gap-1">
                          {[1, 2, 3, 4, 5].map(star => (
                             <Star key={star} className="w-5 h-5 text-amber-300 fill-amber-300 drop-shadow" />
                          ))}
                       </div>
                     </div>
                     <p className="text-slate-300 text-base md:text-lg font-medium leading-relaxed drop-shadow-sm">&quot;{review.text}&quot;</p>
                   </div>
                </div>
              ))}
            </motion.div>
         </div>
       </div>
    </section>
  );
}

function Workflow() {
  return (
    <section id="dashboards" className="py-32 px-6 bg-[#0a1128] border-y border-cyan-500/10 relative overflow-hidden">
       {/* Ambient background */}
       <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-cyan-900/10 via-[#0a1128] to-[#0a1128] pointer-events-none" />
       
       <div className="max-w-5xl mx-auto text-center relative z-10">
         <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-medium text-white mb-6 tracking-tight">One Upload.<br/>Everything Generated.</h2>
         <p className="text-xl text-slate-400 mb-20 max-w-2xl mx-auto font-light">The ultimate workflow engine built for speed and perfection.</p>
         
         <div className="flex flex-col items-center">
            <div className="w-full max-w-2xl relative">
               
               {/* Upload Node */}
               <div className="bg-white/5 border border-white/20 p-5 rounded-full max-w-xs mx-auto flex items-center justify-center gap-3 backdrop-blur shadow-xl relative z-10">
                 <Upload className="text-cyan-400 w-6 h-6"/> <span className="font-semibold text-lg text-white">Upload Product</span>
               </div>
               
               <div className="h-12 w-px bg-cyan-500/50 mx-auto" />
               
               {/* Analysis Node */}
               <div className="bg-cyan-500/10 border border-cyan-400 text-cyan-300 p-5 rounded-full max-w-sm mx-auto flex items-center justify-center gap-3 shadow-[0_0_30px_rgba(34,211,238,0.2)] relative z-10">
                 <Sparkles className="w-6 h-6"/> <span className="font-semibold text-lg">AI Analysis & Composition</span>
               </div>
               
               <div className="h-12 w-px bg-cyan-500/50 mx-auto" />
               
               {/* 3 branches line */}
               <div className="w-full max-w-md mx-auto flex justify-between h-px bg-cyan-500/50 relative mt-4 z-10">
                  <div className="w-px h-6 bg-cyan-500/50 absolute left-0 top-0" />
                  <div className="w-px h-6 bg-cyan-500/50 absolute left-1/2 -ml-px top-0" />
                  <div className="w-px h-6 bg-cyan-500/50 absolute right-0 top-0" />
               </div>

               {/* Outputs */}
               <div className="grid grid-cols-3 gap-6 max-w-md mx-auto pt-6 relative z-10">
                  <div className="bg-white/5 border border-white/10 p-6 rounded-3xl flex flex-col items-center gap-4 hover:bg-white/10 hover:border-cyan-500/30 transition-all shadow-xl">
                     <ImageIcon className="text-white w-8 h-8" />
                     <span className="font-medium text-white">Flyer</span>
                  </div>
                  <div className="bg-white/5 border border-white/10 p-6 rounded-3xl flex flex-col items-center gap-4 hover:bg-white/10 hover:border-cyan-500/30 transition-all shadow-xl">
                     <Type className="text-white w-8 h-8" />
                     <span className="font-medium text-white">Caption</span>
                  </div>
                  <div className="bg-white/5 border border-white/10 p-6 rounded-3xl flex flex-col items-center gap-4 hover:bg-white/10 hover:border-cyan-500/30 transition-all shadow-xl">
                     <Video className="text-white w-8 h-8" />
                     <span className="font-medium text-white">Video</span>
                  </div>
               </div>
            </div>
         </div>
       </div>
    </section>
  );
}

function VideoDemo() {
  return (
    <section id="demo" className="py-24 px-6 max-w-5xl mx-auto">
       <div className="text-center mb-12">
         <h2 className="text-4xl md:text-5xl font-display font-medium text-white mb-4">See INRASTUDIO in Action</h2>
         <p className="text-lg text-slate-400 font-light max-w-2xl mx-auto">Watch how fast you can go from a single photo to a ready campaign.</p>
       </div>
       <div className="aspect-video w-full rounded-3xl bg-[#0a1128] border border-white/10 relative overflow-hidden flex items-center justify-center group cursor-pointer shadow-2xl">
          <Image src="https://picsum.photos/seed/apppreview/1200/675" fill className="object-cover opacity-50 group-hover:opacity-70 transition-opacity duration-700" alt="Demo" />
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
             <div className="w-24 h-24 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center group-hover:scale-110 group-hover:bg-cyan-500 shadow-[0_0_30px_rgba(255,255,255,0.1)] group-hover:shadow-[0_0_40px_rgba(34,211,238,0.4)] transition-all duration-300">
                <Play className="w-10 h-10 fill-white text-white ml-2 group-hover:text-[#0a1128] group-hover:fill-[#0a1128] transition-colors" />
             </div>
          </div>
          {/* Steps Overlay */}
          <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-4 px-6 pointer-events-none">
             <span className="bg-black/60 backdrop-blur-md px-5 py-2.5 rounded-full text-sm font-medium border border-white/10 text-cyan-400 shadow-lg">1. Upload</span>
             <span className="bg-black/60 backdrop-blur-md px-5 py-2.5 rounded-full text-sm font-medium border border-white/10 text-white shadow-lg">2. Generate</span>
             <span className="bg-black/60 backdrop-blur-md px-5 py-2.5 rounded-full text-sm font-medium border border-white/10 text-white shadow-lg">3. Download</span>
          </div>
       </div>
    </section>
  );
}

function FAQ() {
  const faqs = [
    { q: "Do I need design experience?", a: "Not at all. Just upload a photo, and the AI handles the design, colors, and layouts automatically." },
    { q: "Can I use my own colors?", a: "Yes, you can specify your brand colors, and the AI will adapt the templates to match." },
    { q: "Can I upload my logo?", a: "Absolutely. Once uploaded, your logo will be perfectly positioned on all generated assets." },
    { q: "What countries are supported?", a: "We proudly support businesses globally, with specialized local templates tailored for Nigeria, Kenya, Ghana, South Africa, and Egypt." },
    { q: "Can I download videos?", a: "Yes, all promo videos can be downloaded as MP4 files directly to your device." }
  ];
  return (
     <section id="resources" className="py-24 px-6 max-w-3xl mx-auto border-t border-white/5">
        <h2 className="text-4xl md:text-5xl font-display font-medium tracking-tight text-white mb-12 text-center">Frequently asked questions</h2>
        <div className="space-y-6">
          {faqs.map((faq,i) => (
             <div key={i} className="p-8 bg-white/[0.02] border border-white/5 rounded-3xl hover:bg-white/[0.04] transition-colors">
               <h3 className="font-semibold text-lg text-white mb-3">{faq.q}</h3>
               <p className="text-slate-400 leading-relaxed font-light">{faq.a}</p>
             </div>
          ))}
        </div>
     </section>
  );
}

function CallToAction() {
  return (
    <section className="py-12 px-6 max-w-7xl mx-auto">
      <div className="w-full overflow-hidden rounded-[3rem] bg-[#0c0c0c] border border-white/10 shadow-2xl relative">
         <div className="absolute inset-0 pointer-events-none" style={{background: 'linear-gradient(135deg, rgba(34,211,238,0.15) 0%, rgba(236,72,153,0.1) 100%)'}} />
         <div className="flex flex-col md:flex-row items-center justify-between p-12 md:p-24 relative z-10 gap-16">
            <div className="flex-1 text-center md:text-left z-20">
              <div className="inline-block mb-8">
                 <div className="px-5 py-2.5 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-300 text-xs font-bold uppercase tracking-widest">
                   Join the future
                 </div>
              </div>
              <h2 className="text-5xl md:text-6xl lg:text-7xl font-display font-medium text-white mb-10 leading-[1.1] tracking-tight">
                Ready to Create Your<br className="hidden lg:block"/> Next Campaign?
              </h2>
              <Link href="/signup" className="inline-block px-10 py-5 rounded-full bg-cyan-400 text-[#0a1128] font-bold text-lg hover:bg-cyan-300 transition-all shadow-[0_0_40px_rgba(34,211,238,0.3)] hover:scale-105 active:scale-95">
                Start Free Trial
              </Link>
            </div>
            
            {/* Visual Art portion inspired by the crazy creative graphic */}
            <div className="hidden lg:flex w-[400px] h-[350px] shrink-0 items-center justify-center relative z-10">
               <div className="absolute inset-0 flex items-center justify-center">
                  <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-2xl">
                    {/* Starburst backdrop */}
                    <path d="M 150 100 Q 180 100 180 70 C 200 100 150 140 150 100" fill="#22d3ee" className="animate-pulse" />
                    {/* Dark void shape */}
                    <path d="M 120 70 A 30 30 0 0 1 180 70 L 180 150 A 30 30 0 0 1 120 150 Z" fill="#030712" />
                    <circle cx="160" cy="110" r="2" fill="#fff" />
                    <circle cx="140" cy="130" r="1.5" fill="#fff" />
                    <circle cx="145" cy="85" r="2.5" fill="#fff" />
                    {/* Stylized arms touching the void */}
                    <path d="M 150 90 L 80 90 A 10 10 0 0 0 80 110 L 150 110 Z" fill="#f8fafc" />
                    <path d="M 150 130 L 80 130 A 10 10 0 0 0 80 150 L 150 150 Z" fill="#f8fafc" />
                    {/* Abstract lightning strikes */}
                    <path d="M 20 60 L 60 100 L 40 110 L 80 150" stroke="#22d3ee" strokeWidth="3" fill="none" />
                    <path d="M 40 30 L 80 70 L 60 80 L 100 120" stroke="#ec4899" strokeWidth="3" fill="none" />
                    <path d="M 10 120 L 40 150 L 25 160 L 60 195" stroke="#fde047" strokeWidth="3" fill="none" />
                  </svg>
               </div>
            </div>
         </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="pt-24 pb-12 px-6 bg-[#030712] border-t border-white/5 relative overflow-hidden mt-12 w-full">
       <div className="max-w-7xl mx-auto flex flex-col lg:flex-row justify-between items-start gap-16 pb-40 relative z-20">
         {/* Big Text Block */}
         <div className="flex-1 max-w-3xl">
           <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-medium text-slate-200 tracking-tight leading-tight">
             Ready to create something cool together, or just explore our solutions.
           </h2>
         </div>

         {/* Navigation Links */}
                  <div className="flex flex-wrap gap-12 sm:gap-24 uppercase text-xs tracking-widest font-mono shrink-0">
            <div className="flex flex-col gap-5">
              <span className="text-slate-600 mb-2 font-bold">(EXPLORE)</span>
              <Link href="/privacy" className="text-slate-300 hover:text-white transition-colors">Privacy Policy</Link>
              <Link href="/terms" className="text-slate-300 hover:text-white transition-colors">Terms and Condition</Link>
              <Link href="/disclosure" className="text-slate-300 hover:text-white transition-colors">Disclosure</Link>
            </div>
            <div className="flex flex-col gap-5">
              <span className="text-slate-600 mb-2 font-bold">(CONNECT)</span>
              <a href="#" className="text-slate-300 hover:text-white transition-colors flex items-center gap-2 group"><Facebook className="w-4 h-4 text-slate-400" /> FACEBOOK <ArrowRight className="w-3 h-3 -rotate-45 group-hover:text-cyan-400 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" /></a>
              <a href="#" className="text-slate-300 hover:text-white transition-colors flex items-center gap-2 group"><Instagram className="w-4 h-4 text-slate-400" /> INSTAGRAM <ArrowRight className="w-3 h-3 -rotate-45 group-hover:text-cyan-400 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" /></a>
            </div>
         </div>
       </div>

       <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between pt-12 border-t border-white/5 mt-12 text-sm text-slate-500 font-mono z-30 relative gap-4">
          <div className="flex items-center gap-3">
             <Logo className="w-8 h-8 rounded-lg" />
             <span className="font-bold text-white tracking-widest text-sm">INRASTUDIO</span>
          </div>
          <p>© 2026 INRASTUDIO AI Marketing Studio.</p>
       </div>
    </footer>
  );
}

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#030712] text-slate-50 relative selection:bg-cyan-500 selection:text-white font-sans overflow-x-hidden">
      <Navbar />
      <main>
        <Hero />
        <Stats />
        <HowItWorks />
        <Workflow />
        <VideoDemo />
        <Testimonials />
        <FAQ />
        <CallToAction />
      </main>
      <Footer />
    </div>
  );
}

