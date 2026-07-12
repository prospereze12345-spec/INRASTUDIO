import React from "react";
import {
  registerRoot,
  Composition,
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Sequence,
} from "remotion";



type PromoColors = {
  primary: string;
  secondary: string;
  accent: string;
};

export type PromoVideoProps = {
  headline: string;
  subtext: string;
  ctaText: string;
  price: string;
  brandName: string;
  website: string;
  productImage: string;
  colors: PromoColors;
};

const DEFAULT_PROPS: PromoVideoProps = {
  headline: "Timeless Elegance Guaranteed",
  subtext: "Elevate your space with our Classic Analog Wall Clock.",
  ctaText: "DM to order now",
  price: "From ₦4,500",
  brandName: "Premium Brand",
  website: "your-store.com",
  productImage: "",
  colors: { primary: "#0a0a0a", secondary: "#ffffff", accent: "#c9a84c" },
};

// ────────────────────────────────────────────────────────────────────────────
// Composition — mirrors the editor's live preview component 1:1, with a
// continuous Ken Burns pan/zoom on the product image so the clip still
// reads as a moving video after the entrance animation finishes, instead
// of freezing on a static frame for the rest of the duration.
// ────────────────────────────────────────────────────────────────────────────

export function PromoVideo({
  headline, subtext, ctaText, price, brandName, website, productImage, colors,
}: PromoVideoProps) {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
// Resolve product image URL.
//
// Supports:
// - Full URLs from Django (http://127.0.0.1:8000/media/...)
// - Relative media paths (/media/...)
// - Static assets in Remotion's public folder (nobg/... or logo.png)
const MEDIA_ORIGIN = process.env.REMOTION_MEDIA_ORIGIN || "http://127.0.0.1:8000";

const resolvedProductImage = (() => {
  if (!productImage) return "";
  if (productImage.startsWith("http://") || productImage.startsWith("https://")) {
    return productImage;
  }
  if (productImage.startsWith("/media/")) {
    return `${MEDIA_ORIGIN}${productImage}`;
  }
  // bare relative path like "nobg/xxx.png" → Django media, not a Remotion public asset
  return `${MEDIA_ORIGIN}/media/${productImage.replace(/^\/+/, "")}`;
})();
  const sp = (f: number, delay = 0, mass = 1) =>
    spring({ frame: f - delay, fps, config: { damping: 18, stiffness: 80, mass } });

  // Brand intro — scale up from 0.6, fade in
  const brandScale   = interpolate(frame, [0, 20], [0.6, 1], { extrapolateRight: "clamp" });
  const brandOpacity = interpolate(frame, [0, 20], [0, 1],   { extrapolateRight: "clamp" });

  // Product entrance — slide up + scale in
  const productY = interpolate(sp(frame, 15), [0, 1], [60, 0]);
  const productS = interpolate(sp(frame, 15), [0, 1], [0.85, 1]);
  const productO = interpolate(frame, [15, 45], [0, 1], { extrapolateRight: "clamp" });

  // Ken Burns — slow continuous pan/zoom across the entire clip, applied
  // on top of the entrance transform above. Runs on the placeholder box
  // too, so there's always visible motion even with no product image.
  const kbScale = interpolate(frame, [15, durationInFrames], [1, 1.15], { extrapolateRight: "clamp" });
  const kbX     = interpolate(frame, [15, durationInFrames], [0, -14],  { extrapolateRight: "clamp" });
  const kbY     = interpolate(frame, [15, durationInFrames], [0, 8],    { extrapolateRight: "clamp" });

  // Headline — word-by-word stagger
  const words = (headline || "").split(" ").filter(Boolean).slice(0, 6);

  // Price badge pop
  const priceS = spring({ frame: frame - 90, fps, config: { damping: 12, stiffness: 200, mass: 0.5 } });
  const priceO = interpolate(frame, [90, 105], [0, 1], { extrapolateRight: "clamp" });

  // Subtext slide in
  const subO = interpolate(frame, [110, 130], [0, 1], { extrapolateRight: "clamp" });
  const subY = interpolate(sp(frame, 110), [0, 1], [20, 0]);

  // CTA reveal
  const ctaO = interpolate(frame, [145, 165], [0, 1], { extrapolateRight: "clamp" });
  const ctaW = interpolate(frame, [165, 195], [0, 100], { extrapolateRight: "clamp" });

  // Outro fade
  const outroO = interpolate(
    frame,
    [durationInFrames - 20, durationInFrames - 5],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  const accent  = colors?.accent    || "#c9a84c";
  const primary = colors?.primary   || "#0a0a0a";
  const textCol = colors?.secondary || "#ffffff";

    return (
      <AbsoluteFill style={{ background: primary, fontFamily: "-apple-system,'Helvetica Neue',sans-serif", overflow: "hidden" }}>

        {/* Ambient background circles */}
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{
            position: "absolute", width: 600, height: 600, borderRadius: "50%",
            background: `radial-gradient(circle, ${accent}18 0%, transparent 70%)`,
            top: -200, right: -150,
            transform: `scale(${interpolate(frame, [0, durationInFrames], [1, 1.15])})`,
          }}/>
          <div style={{
            position: "absolute", width: 400, height: 400, borderRadius: "50%",
            background: `radial-gradient(circle, ${accent}0d 0%, transparent 70%)`,
            bottom: -100, left: -100,
          }}/>
        </AbsoluteFill>

        {/* Brand intro (frames 0-25) */}
        <Sequence from={0} durationInFrames={25}>
          <AbsoluteFill style={{
            alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 8,
            opacity: frame > 18 ? interpolate(frame, [18, 25], [1, 0]) : 1,
          }}>
            <div style={{
              fontSize: 13, fontWeight: 800, letterSpacing: "0.3em",
              textTransform: "uppercase", color: textCol,
              opacity: brandOpacity, transform: `scale(${brandScale})`,
            }}>
              {brandName}
            </div>
            <div style={{
              width: interpolate(frame, [0, 20], [0, 40]), height: 1, background: accent,
            }}/>
          </AbsoluteFill>
        </Sequence>

        {/* Main content */}
        <Sequence from={15} durationInFrames={Math.max(durationInFrames - 35, 1)}>
          <AbsoluteFill style={{ flexDirection: "column", padding: "8% 9%" }}>

            <div style={{
              fontSize: 10, fontWeight: 700, letterSpacing: "0.2em",
              textTransform: "uppercase", color: textCol, opacity: 0.4, marginBottom: 16,
            }}>
              {brandName}
            </div>

            {/* Product image — entrance transform on the wrapper, Ken Burns on the image itself */}
            <div style={{
              flex: 1, display: "flex", alignItems: "center", justifyContent: "center",
              opacity: productO, overflow: "hidden",
              transform: `translateY(${productY}px) scale(${productS})`,
            }}>
              {productImage
                ? (
                 <img
      src={resolvedProductImage}
      alt="Product"
      crossOrigin="anonymous"
      onError={(e) => {
        console.error("Failed to load image:", resolvedProductImage);
        console.error(e);
      }}
      style={{
        maxWidth: "70%",
        maxHeight: "55%",
        objectFit: "contain",
        filter: "drop-shadow(0 24px 40px rgba(0,0,0,0.6))",
        transform: `scale(${kbScale}) translate(${kbX}px, ${kbY}px)`,
      }}
    />
                )
                : (
                  <div style={{
                    width: 120, height: 120, borderRadius: 16,
                    background: `${accent}22`, border: `1px solid ${accent}44`,
                    transform: `scale(${kbScale})`,
                  }}/>
                )
              }
            </div>

            {/* Headline — word-by-word slide */}
            <div style={{ marginTop: 16, marginBottom: 10 }}>
              {words.map((word, i) => {
                const delay = 40 + i * 7;
                const wO = interpolate(frame, [delay, delay + 15], [0, 1], { extrapolateRight: "clamp" });
                const wY = interpolate(
                  spring({ frame: frame - delay, fps, config: { damping: 20, stiffness: 120 } }),
                  [0, 1], [20, 0],
                );
                return (
                  <span key={i} style={{
                    display: "inline-block", marginRight: 8,
                    fontSize: 28, fontWeight: 800, letterSpacing: "-0.02em",
                    color: i === 0 ? accent : textCol,
                    opacity: wO, transform: `translateY(${wY}px)`,
                  }}>
                    {word}
                  </span>
                );
              })}
            </div>

            {/* Price badge */}
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              opacity: priceO,
              transform: `scale(${interpolate(priceS, [0, 1], [0.6, 1])})`,
              transformOrigin: "left center", marginBottom: 10,
            }}>
              <span style={{ fontSize: 36, fontWeight: 900, letterSpacing: "-0.04em", color: accent }}>
                {price}
              </span>
            </div>

            {/* Subtext */}
            <div style={{
              fontSize: 12, lineHeight: 1.55, color: textCol, opacity: subO * 0.6,
              transform: `translateY(${subY}px)`, maxWidth: "80%", marginBottom: 20,
            }}>
              {subtext}
            </div>

            {/* CTA with animated underline */}
            <div style={{ opacity: ctaO }}>
              <div style={{ display: "inline-flex", flexDirection: "column", gap: 4 }}>
                <span style={{
                  fontSize: 14, fontWeight: 700, letterSpacing: "0.04em",
                  color: textCol, textTransform: "uppercase",
                }}>
                  {ctaText}
                </span>
                <div style={{ height: 2, background: accent, width: `${ctaW}%`, borderRadius: 1 }}/>
              </div>
            </div>

            {/* Website */}
            <div style={{
              fontSize: 9, letterSpacing: "0.14em", color: textCol, opacity: ctaO * 0.3,
              marginTop: 6, textTransform: "lowercase",
            }}>
              {website}
            </div>

          </AbsoluteFill>
        </Sequence>

        {/* Brand outro (last 20 frames) */}
        <Sequence from={Math.max(durationInFrames - 20, 0)}>
          <AbsoluteFill style={{
            background: primary, opacity: outroO,
            alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 8,
          }}>
            <div style={{
              fontSize: 18, fontWeight: 900, letterSpacing: "0.2em",
              textTransform: "uppercase", color: accent,
            }}>
              {brandName}
            </div>
            <div style={{ fontSize: 9, letterSpacing: "0.16em", color: textCol, opacity: 0.4 }}>
              {website}
            </div>
          </AbsoluteFill>
        </Sequence>

      </AbsoluteFill>
    );
  }

// ────────────────────────────────────────────────────────────────────────────
// Root registration — this file IS the bundle entry point that render.mjs
// points bundle() at, so there's no separate index.ts calling registerRoot()
// somewhere else to keep in sync. The width/height/fps/durationInFrames set
// here are just Remotion Studio defaults for local preview — render.mjs
// always overrides them per-request via renderMedia()'s composition object,
// using whatever format the job actually asked for.
// ────────────────────────────────────────────────────────────────────────────

function RemotionRoot() {
  return (
    <Composition
      id="PromoVideo"
      component={PromoVideo}
      durationInFrames={360}
      fps={30}
      width={1080}
      height={1350}
      defaultProps={DEFAULT_PROPS}
    />
  );
}

registerRoot(RemotionRoot);
