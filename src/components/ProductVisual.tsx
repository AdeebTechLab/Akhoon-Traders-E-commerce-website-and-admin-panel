import { useState } from 'react';
import type { Product } from '../types';
import { Star8 } from './ui/Ornament';

type VisualProduct = Pick<Product, 'name' | 'nameUrdu' | 'category' | 'color' | 'image' | 'authorUrdu' | 'size'>;

interface Props {
  product: VisualProduct;
  className?: string;
  /** Draw only the book / bottle, without the cream backdrop */
  bare?: boolean;
}

/**
 * Shows the product photo if one is set, otherwise draws a styled
 * book cover or oil bottle so the shop looks complete without photos.
 */
export function ProductVisual({ product, className = '', bare = false }: Props) {
  const [broken, setBroken] = useState(false);

  if (product.image && !broken) {
    return (
      <div className={`aspect-[3/4] w-full overflow-hidden bg-parchment ${className}`}>
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          onError={() => setBroken(true)}
          className="size-full object-cover"
        />
      </div>
    );
  }
  return product.category === 'books' ? (
    <BookCover product={product} className={className} bare={bare} />
  ) : (
    <OilBottle product={product} className={className} bare={bare} />
  );
}

function BookCover({ product, className, bare }: Props) {
  return (
    <div
      className={`@container flex aspect-[3/4] w-full items-center justify-center ${bare ? '' : 'bg-parchment p-[9%]'} ${className}`}
    >
      <div
        className="relative h-full w-[82%] overflow-hidden rounded-r-md rounded-l-sm shadow-[6px_8px_18px_-6px_rgba(0,0,0,0.45)]"
        style={{ backgroundColor: product.color }}
      >
        {/* texture */}
        <div className="bg-pattern-dark absolute inset-0 opacity-60" />
        {/* spine */}
        <div className="absolute inset-y-0 left-0 w-[8%] bg-black/30" />
        <div className="absolute inset-y-0 left-[8%] w-px bg-white/20" />
        {/* frame */}
        <div className="absolute inset-y-[7%] right-[8%] left-[16%] rounded-sm border border-gold-300/70">
          <div className="absolute inset-[3px] rounded-sm border border-gold-300/25" />
        </div>
        {/* text */}
        <div className="absolute inset-y-[7%] right-[8%] left-[16%] flex flex-col items-center justify-between px-[6%] py-[12%] text-center">
          <Star8 className="w-[16%] text-gold-300" />
          <p
            dir="rtl"
            lang="ur"
            className="font-urdu font-bold text-gold-100 [text-shadow:0_1px_2px_rgba(0,0,0,0.4)]"
            style={{ fontSize: '9.5cqw', lineHeight: 2 }}
          >
            {product.nameUrdu}
          </p>
          <p dir="rtl" lang="ur" className="font-urdu text-gold-200/85" style={{ fontSize: '4.6cqw', lineHeight: 1.9 }}>
            {product.authorUrdu || 'آخون ٹریڈرز'}
          </p>
        </div>
      </div>
    </div>
  );
}

function OilBottle({ product, className, bare }: Props) {
  const gid = `liquid-${product.color.replace('#', '')}`;
  return (
    <div
      className={`@container relative aspect-[3/4] w-full overflow-hidden ${
        bare ? '' : 'bg-[radial-gradient(circle_at_50%_40%,#fffdf6_0%,#f1ead7_70%)]'
      } ${className}`}
    >
      <svg viewBox="0 0 120 160" className="absolute inset-0 size-full" aria-hidden="true">
        <defs>
          <linearGradient id={gid} x1="0" x2="1">
            <stop offset="0" stopColor={product.color} stopOpacity="0.95" />
            <stop offset="0.45" stopColor={product.color} stopOpacity="0.75" />
            <stop offset="1" stopColor={product.color} />
          </linearGradient>
        </defs>
        <ellipse cx="60" cy="151" rx="33" ry="3.2" fill="rgba(0,0,0,0.14)" />
        {/* cap */}
        <rect x="47" y="12" width="26" height="19" rx="3" fill="#1d1a16" />
        <g stroke="#3a342c" strokeWidth="0.8">
          {[51, 55, 59, 63, 67].map((x) => (
            <line key={x} x1={x} y1="14" x2={x} y2="29" />
          ))}
        </g>
        <rect x="45" y="29" width="30" height="4" rx="1.5" fill="#c19520" />
        {/* neck + body */}
        <rect x="52" y="33" width="16" height="9" fill={`url(#${gid})`} />
        <path
          d="M52 42 C52 50 30 51 30 63 L30 141 Q30 149 38 149 L82 149 Q90 149 90 141 L90 63 C90 51 68 50 68 42 Z"
          fill={`url(#${gid})`}
          stroke="rgba(0,0,0,0.18)"
          strokeWidth="0.6"
        />
        {/* glass highlight */}
        <rect x="34.5" y="64" width="4.5" height="74" rx="2.25" fill="#ffffff" opacity="0.32" />
        {/* label */}
        <rect x="33" y="80" width="54" height="56" rx="3" fill="#fbf8f1" stroke="#c19520" strokeWidth="0.9" />
        <rect x="33" y="80" width="54" height="9" rx="3" fill="#01411c" />
        <rect x="33" y="85" width="54" height="4" fill="#01411c" />
      </svg>
      {/* label text, positioned over the label rect (x 33–87, y 80–136 of 120×160) */}
      <div className="absolute top-[50%] right-[27.5%] left-[27.5%] flex h-[5.6%] items-center justify-center">
        <span className="font-semibold tracking-[0.18em] text-gold-300" style={{ fontSize: '3.2cqw' }}>
          AKHOON
        </span>
      </div>
      <div className="absolute top-[56%] right-[28.5%] bottom-[15%] left-[28.5%] flex flex-col items-center justify-center text-center">
        <p
          dir="rtl"
          lang="ur"
          className="font-urdu font-bold text-brand-900"
          style={{ fontSize: '5.4cqw', lineHeight: 1.85 }}
        >
          {product.nameUrdu}
        </p>
        {product.size && (
          <p className="mt-0.5 font-semibold text-gold-700" style={{ fontSize: '3.6cqw' }}>
            {product.size}
          </p>
        )}
      </div>
    </div>
  );
}
