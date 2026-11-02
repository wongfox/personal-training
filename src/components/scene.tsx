import { cn } from "@/lib/cn";

/**
 * Hand-drawn landscape for hero cards: warm dawn sky, sun, layered green
 * ridges and a mist band. Pure SVG (no image requests), scales to any card.
 */
export function DawnScene({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 400 260" preserveAspectRatio="xMidYMid slice" className={cn("h-full w-full", className)} aria-hidden>
      <defs>
        <linearGradient id="sky" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#f6e6d2" />
          <stop offset="0.55" stopColor="#efd4b8" />
          <stop offset="1" stopColor="#e4c8a8" />
        </linearGradient>
        <linearGradient id="mist" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#fff8ef" stopOpacity="0" />
          <stop offset="1" stopColor="#fff8ef" stopOpacity="0.55" />
        </linearGradient>
      </defs>
      <rect width="400" height="260" fill="url(#sky)" />
      <circle cx="292" cy="78" r="30" fill="#e8955a" />
      <circle cx="292" cy="78" r="44" fill="#e8955a" opacity="0.12" />
      <path d="M0 150 L60 112 L105 136 L170 82 L232 128 L282 98 L340 130 L400 104 L400 260 L0 260 Z" fill="#b9c2a9" />
      <rect y="120" width="400" height="60" fill="url(#mist)" />
      <path d="M0 176 L48 150 L96 168 L150 130 L214 172 L262 146 L318 170 L366 144 L400 160 L400 260 L0 260 Z" fill="#8ea288" />
      <path d="M0 206 L70 178 L128 198 L196 168 L268 202 L330 182 L400 198 L400 260 L0 260 Z" fill="#5f7b63" />
      <path d="M0 236 Q90 208 180 226 T400 222 L400 260 L0 260 Z" fill="#3e5a47" />
    </svg>
  );
}

/** Decorative leaf sprig for the corner of dark green cards. */
export function LeafSprig({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 120" className={cn("pointer-events-none", className)} aria-hidden>
      <g fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
        <path d="M18 112 C46 84 66 58 100 14" />
        <path d="M44 84 C30 70 30 54 40 44 C52 54 54 70 44 84Z" fill="currentColor" fillOpacity="0.18" />
        <path d="M62 62 C72 46 88 42 100 46 C94 60 80 66 62 62Z" fill="currentColor" fillOpacity="0.18" />
        <path d="M74 44 C66 30 70 18 80 10 C88 22 86 34 74 44Z" fill="currentColor" fillOpacity="0.18" />
        <path d="M30 98 C18 92 12 80 14 70 C26 74 32 86 30 98Z" fill="currentColor" fillOpacity="0.18" />
      </g>
    </svg>
  );
}
