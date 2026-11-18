import { Minus, Plus } from 'lucide-react';

interface Props {
  value: number;
  max: number;
  onChange: (value: number) => void;
  min?: number;
  size?: 'sm' | 'md';
}

export function QuantityInput({ value, max, onChange, min = 1, size = 'md' }: Props) {
  const btn = size === 'sm' ? 'size-8' : 'size-10';
  return (
    <div className="inline-flex items-center rounded-lg border border-stone-300 bg-white">
      <button
        type="button"
        className={`${btn} flex items-center justify-center text-stone-600 hover:text-brand-800 disabled:opacity-40`}
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
        aria-label="Decrease quantity"
      >
        <Minus className="size-4" />
      </button>
      <span className={`min-w-8 text-center font-semibold ${size === 'sm' ? 'text-sm' : ''}`}>{value}</span>
      <button
        type="button"
        className={`${btn} flex items-center justify-center text-stone-600 hover:text-brand-800 disabled:opacity-40`}
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
        aria-label="Increase quantity"
      >
        <Plus className="size-4" />
      </button>
    </div>
  );
}
