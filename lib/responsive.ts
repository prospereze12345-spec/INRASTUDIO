import type { CSSProperties } from "react";

/**
 * Responsive scale for flyer templates.
 *
 * `cqi` (container query inline-size units) requires `@container`,
 * supported from iOS 16 / Chrome 105 onward. On iOS 15.8 and older
 * Android WebViews, `cqi` is an unrecognized unit — the whole CSS
 * declaration using it is dropped, so font-sizes/widths/paddings built
 * from it silently collapse (text falls back to default size, empty
 * decorative divs collapse to 0 width/height).
 *
 * clamp() + vw has been supported since Safari 13.1 (iOS 13) and every
 * Android browser for years. It gives the same "scales with screen
 * width" behavior cqi did, with a min/max band so nothing gets
 * illegibly small or absurdly large.
 *
 *   min = |n| * 3px   → floor on narrow phones
 *   |n|vw             → proportional scaling (same numeric feel as Ncqi)
 *   max = |n| * 6px   → ceiling on tablets/desktop canvases
 *
 * Negative values (used for negative offsets like -bottom-[2cqi]) are
 * handled by clamping the positive magnitude and negating the result —
 * clamp(min, val, max) requires min <= max, which breaks if you just
 * multiply negative numbers directly.
 */
export const px = (n: number): string => {
  if (n === 0) return "0px";
  const sign = n < 0 ? -1 : 1;
  const abs = Math.abs(n);
  const clampExpr = `clamp(${abs * 3}px, ${abs}vw, ${abs * 6}px)`;
  return sign < 0 ? `calc(-1 * ${clampExpr})` : clampExpr;
};

/**
 * Apple HIG and Android Material both require a minimum 44x44px
 * (48x48dp) touch target for primary tappable elements. clamp()'s low
 * end alone can't guarantee that on narrow phones, so primary CTAs
 * should spread this into their style object.
 *
 * Not applied to small secondary controls (e.g. remove-item buttons in
 * a dense list) — forcing 44px there would break row layout. Those get
 * a smaller, deliberate hit-area bump instead (see FlyerContentBlocks).
 */
export const touchTarget: CSSProperties = {
  minHeight: "44px",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
};