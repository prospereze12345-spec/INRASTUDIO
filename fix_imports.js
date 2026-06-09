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
  
  // Fix double imports
  content = content.replace(/, Facebook, Instagram(.*?)\, Facebook, Instagram/g, ', Facebook, Instagram$1');
  
  fs.writeFileSync(p, content);
}
console.log('done fixing imports');
