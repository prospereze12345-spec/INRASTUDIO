export function Logo({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} xmlns="http://www.w3.org/2000/svg">
      <rect width="100" height="100" rx="24" fill="#32D9CB" />
      <path d="M 32 37 h 7 v 26 h -7 z" fill="#374151" />
      <path d="M 42 63 L 51 37 h 7 l 12 26 h -7 l -2 -6 c -5 -3 -12 0 -13 6 z" fill="#374151" />
      <path d="M 42 53 Q 56 42 70 53 l -2 -4 Q 56 38 43 49 z" fill="#374151" />
    </svg>
  );
}
