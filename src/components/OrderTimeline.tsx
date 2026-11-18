import { Ban, Check, ClipboardList, PackageCheck, Truck, type LucideIcon } from 'lucide-react';
import type { OrderStatus } from '../types';

const STEPS: { status: OrderStatus; label: string; urdu: string; icon: LucideIcon }[] = [
  { status: 'Pending', label: 'Order placed', urdu: 'آرڈر موصول', icon: ClipboardList },
  { status: 'Confirmed', label: 'Confirmed', urdu: 'تصدیق شدہ', icon: Check },
  { status: 'Shipped', label: 'Shipped', urdu: 'روانہ', icon: Truck },
  { status: 'Delivered', label: 'Delivered', urdu: 'موصول', icon: PackageCheck },
];

export function OrderTimeline({ status }: { status: OrderStatus }) {
  if (status === 'Cancelled') {
    return (
      <div className="flex items-center gap-3 rounded-xl bg-red-50 p-4 text-red-700">
        <Ban className="size-5" />
        <p className="font-medium">This order has been cancelled.</p>
      </div>
    );
  }
  const current = STEPS.findIndex((s) => s.status === status);
  return (
    <ol className="grid grid-cols-4">
      {STEPS.map((step, i) => {
        const done = i <= current;
        const Icon = step.icon;
        return (
          <li key={step.status} className="relative flex flex-col items-center text-center">
            {i > 0 && (
              <span
                className={`absolute top-5 right-1/2 h-0.5 w-full ${i <= current ? 'bg-brand-600' : 'bg-stone-200'}`}
                aria-hidden="true"
              />
            )}
            <span
              className={`relative z-10 flex size-10 items-center justify-center rounded-full border-2 ${
                done ? 'border-brand-600 bg-brand-600 text-white' : 'border-stone-300 bg-white text-stone-400'
              } ${i === current ? 'ring-4 ring-brand-100' : ''}`}
            >
              <Icon className="size-5" />
            </span>
            <span className={`mt-2 text-xs font-semibold sm:text-sm ${done ? 'text-brand-800' : 'text-stone-400'}`}>
              {step.label}
            </span>
            <span lang="ur" className="font-urdu text-[11px] text-stone-500" style={{ lineHeight: 1.9 }}>
              {step.urdu}
            </span>
          </li>
        );
      })}
    </ol>
  );
}
