import type { ReactNode } from 'react';
import { Star8 } from './Ornament';

interface Props {
  title: string;
  urdu: string;
  subtitle?: string;
  action?: ReactNode;
  light?: boolean;
}

/** Bilingual heading — English on the left, Urdu on the right. */
export function SectionHeading({ title, urdu, subtitle, action, light = false }: Props) {
  return (
    <div className="mb-8">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h2
            className={`font-display text-3xl font-bold leading-tight sm:text-4xl ${light ? 'text-white' : 'text-brand-900'}`}
          >
            {title}
          </h2>
          {subtitle && <p className={`mt-1 text-sm ${light ? 'text-brand-100/80' : 'text-stone-500'}`}>{subtitle}</p>}
        </div>
        <p
          dir="rtl"
          lang="ur"
          className={`font-urdu text-xl sm:text-2xl ${light ? 'text-gold-300' : 'text-gold-700'}`}
        >
          {urdu}
        </p>
      </div>
      <div className="mt-3 flex items-center gap-3">
        <span className={`h-0.5 w-16 rounded ${light ? 'bg-gold-400' : 'bg-brand-800'}`} />
        <Star8 className="size-3 text-gold-400" />
        <span className={`h-px flex-1 ${light ? 'bg-white/15' : 'bg-stone-200'}`} />
        {action}
      </div>
    </div>
  );
}
