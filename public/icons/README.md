
Place these in /public/icons (and one apple-touch-icon at /public root level works too):

- icon-192.png        192x192  (any)
- icon-512.png        512x512  (any)
- icon-maskable-192.png 192x192 (safe zone padding ~20% for maskable)
- icon-maskable-512.png 512x512 (safe zone padding ~20% for maskable)
- apple-touch-icon.png 180x180 (no transparency, iOS ignores alpha)

Generate from one 1024x1024 source logo with:
  npx pwa-asset-generator logo.png ./public/icons --background "#0B0B0E" --padding "12%" --maskable true
