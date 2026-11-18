interface Props {
  className?: string;
}

/** Eight-pointed star (Rub el Hizb style) used as a decorative motif. */
export function Star8({ className = '' }: Props) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <g fill="currentColor">
        <rect x="5" y="5" width="14" height="14" />
        <rect x="5" y="5" width="14" height="14" transform="rotate(45 12 12)" />
      </g>
      <circle cx="12" cy="12" r="3.2" fill="none" stroke="rgba(0,0,0,0.25)" strokeWidth="1" />
    </svg>
  );
}

/** Crescent & star seal used as the store emblem. */
export function Emblem({ className = '' }: Props) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
      <circle cx="32" cy="32" r="31" fill="#01411c" />
      <circle cx="32" cy="32" r="27.5" fill="none" stroke="#d9ae32" strokeWidth="1.2" strokeDasharray="2 2.4" />
      <circle cx="29" cy="33" r="15" fill="#ffffff" />
      <circle cx="34.5" cy="29.5" r="13.2" fill="#01411c" />
      <path
        d="M43 20.5l1.9 3.9 4.3.6-3.1 3 .7 4.3-3.8-2-3.8 2 .7-4.3-3.1-3 4.3-.6z"
        fill="#d9ae32"
      />
    </svg>
  );
}

/** Thin gold divider with a star in the middle. */
export function OrnamentDivider({ className = '' }: Props) {
  return (
    <div className={`flex items-center gap-3 ${className}`} aria-hidden="true">
      <span className="h-px flex-1 bg-gradient-to-r from-transparent to-gold-400/70" />
      <Star8 className="size-3.5 text-gold-400" />
      <span className="h-px flex-1 bg-gradient-to-l from-transparent to-gold-400/70" />
    </div>
  );
}
