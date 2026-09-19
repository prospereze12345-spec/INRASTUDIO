import Image from "next/image";

const WORDMARK_SIZES = {
  sm: "text-base",
  md: "text-lg",
  lg: "text-2xl",
} as const;

export function Logo({
  size = "md",
  showWordmark = true,
  className = "h-10 w-auto",
}: {
  size?: keyof typeof WORDMARK_SIZES;
  showWordmark?: boolean;
  className?: string;
}) {
  return (
    <span className="inline-flex items-center gap-2.5">
      <Image
        src="/images/inra-logo.png"
        alt="INRASTUDIO logo"
        width={248}
        height={95}
        priority
        className={`shrink-0 object-contain ${className}`}
      />

      {showWordmark && (
        <span
          className={`font-semibold tracking-tight text-[#16140F] ${WORDMARK_SIZES[size]}`}
        >
          INRASTUDIO
        </span>
      )}
    </span>
  );
}
