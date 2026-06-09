const fs = require('fs');

const pages = [
  'app/page.tsx',
  'app/pricing/page.tsx',
  'app/privacy/page.tsx',
  'app/terms/page.tsx',
  'app/disclosure/page.tsx',
  'app/contact/page.tsx'
];

for (const p of pages) {
  let content = fs.readFileSync(p, 'utf8');
  
  // They might not have imported Facebook, Instagram, etc. at the top, since it was just removed by prior edits
  if (!content.includes('import { Facebook')) {
    content = content.replace(/(import { [A-Za-z0-9, \n]+) } from "lucide-react";/, '$1, Facebook, Instagram } from "lucide-react";');
  }

  const replacementFooterBlock = `         <div className="flex flex-wrap gap-12 sm:gap-24 uppercase text-xs tracking-widest font-mono shrink-0">
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
         </div>`;

  const regex = /<div className="flex flex-wrap gap-12 sm:gap-24 uppercase text-xs tracking-widest font-mono shrink-0">\s*<div className="flex flex-col gap-5">\s*<span className="text-slate-600 mb-2 font-bold">\(EXPLORE\)<\/span>[\s\S]*?<\/div>[\s]*<\/div>/;
  content = content.replace(regex, replacementFooterBlock);

  fs.writeFileSync(p, content);
}
console.log('done fixing footer');
