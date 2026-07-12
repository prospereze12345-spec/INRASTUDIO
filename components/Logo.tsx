import Image from "next/image";

// ────────────────────────────────────────────────────────────────────────────
// IMPORTANT: this component never renders its own <Link>. Your Navbar.tsx
// already wraps <Logo /> in <Link href="/"> itself (both the desktop and
// mobile versions). If Logo also wrapped itself in a Link, you'd get
// <a><a>...</a></a> — invalid HTML, which is exactly the hydration error
// you hit. Do not add a Link back into this file. If some other page needs
// the logo to be clickable, wrap it from the outside instead:
//   <Link href="/"><Logo size="sm" /></Link>
// ────────────────────────────────────────────────────────────────────────────

const WORDMARK_SIZES = {
  sm: "text-base",
  md: "text-lg",
  lg: "text-2xl",
} as const;

export function Logo({
  size = "md",
  showWordmark = true,
  className = "h-9 w-9",
}: {
  size?: keyof typeof WORDMARK_SIZES;
  showWordmark?: boolean;
  /** Sizes the icon directly, e.g. "w-10 h-10" — matches how Navbar.tsx already calls this */
  className?: string;
}) {
  return (
    <span className="inline-flex items-center gap-2.5">
      <Image
        src="/images/logo-icon.png"
        alt="INRASTUDIO logo"
        width={40}
        height={40}
        className={`shrink-0 object-contain ${className}`}
        priority
      />
      {showWordmark && (
        <span
          className={`font-display ${WORDMARK_SIZES[size]} font-bold tracking-widest text-white`}
        >
          INRASTUDIO
        </span>
      )}
    </span>
  );
}
