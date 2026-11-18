import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';
import type { OrderStatus } from '../../types';

const STATUS_STYLES: Record<OrderStatus, string> = {
  Pending: 'bg-amber-50 text-amber-700 ring-amber-200',
  Confirmed: 'bg-sky-50 text-sky-700 ring-sky-200',
  Shipped: 'bg-violet-50 text-violet-700 ring-violet-200',
  Delivered: 'bg-brand-50 text-brand-700 ring-brand-200',
  Cancelled: 'bg-red-50 text-red-700 ring-red-200',
};

export function StatusBadge({ status }: { status: OrderStatus }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset ${STATUS_STYLES[status]}`}>
      {status}
    </span>
  );
}

export function StockBadge({ stock }: { stock: number }) {
  const style =
    stock <= 0
      ? 'bg-red-50 text-red-700 ring-red-200'
      : stock <= 5
        ? 'bg-amber-50 text-amber-700 ring-amber-200'
        : 'bg-brand-50 text-brand-700 ring-brand-200';
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset ${style}`}>
      {stock <= 0 ? 'Out of stock' : `${stock} in stock`}
    </span>
  );
}

export function PageHeader({ title, subtitle, action }: { title: string; subtitle?: string; action?: ReactNode }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold text-stone-900">{title}</h1>
        {subtitle && <p className="mt-0.5 text-sm text-stone-500">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

export function StatCard({
  icon: Icon,
  label,
  value,
  hint,
  tone = 'green',
}: {
  icon: LucideIcon;
  label: string;
  value: string | number;
  hint?: string;
  tone?: 'green' | 'gold' | 'blue' | 'red';
}) {
  const tones = {
    green: 'bg-brand-50 text-brand-700',
    gold: 'bg-gold-50 text-gold-700',
    blue: 'bg-sky-50 text-sky-700',
    red: 'bg-red-50 text-red-700',
  };
  return (
    <div className="card min-w-0 p-4 sm:p-5">
      <div className="flex items-start justify-between gap-2">
        <p className="text-sm font-medium text-stone-500">{label}</p>
        <span className={`flex size-9 shrink-0 items-center justify-center rounded-lg ${tones[tone]}`}>
          <Icon className="size-5" />
        </span>
      </div>
      <p className="mt-2 truncate text-xl font-bold text-stone-900 sm:text-2xl">{value}</p>
      {hint && <p className="mt-1 text-xs text-stone-500">{hint}</p>}
    </div>
  );
}
