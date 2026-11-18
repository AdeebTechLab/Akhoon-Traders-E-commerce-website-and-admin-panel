import { PackageSearch } from 'lucide-react';
import { useState, type FormEvent } from 'react';
import { useSearchParams } from 'react-router-dom';
import { OrderTimeline } from '../components/OrderTimeline';
import { useStore } from '../context/StoreContext';
import type { Order } from '../types';
import { formatDateTime, formatPKR } from '../utils/format';

const digits = (s: string) => s.replace(/\D/g, '').replace(/^92/, '0');

export function TrackOrder() {
  const { orders } = useStore();
  const [params] = useSearchParams();
  const [orderId, setOrderId] = useState(params.get('id') ?? '');
  const [phone, setPhone] = useState('');
  const [result, setResult] = useState<Order | null | undefined>(undefined);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const id = orderId.trim().toUpperCase().replace(/^(\d)/, 'AT-$1');
    const found = orders.find((o) => o.id.toUpperCase() === id && digits(o.customer.phone) === digits(phone));
    setResult(found ?? null);
  };

  return (
    <div className="container-x max-w-2xl py-12">
      <div className="text-center">
        <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-brand-50">
          <PackageSearch className="size-8 text-brand-700" />
        </div>
        <h1 className="mt-4 font-display text-4xl font-bold text-brand-900">Track Your Order</h1>
        <p lang="ur" className="font-urdu text-xl text-gold-700" style={{ lineHeight: 2 }}>
          اپنے آرڈر کی صورتحال معلوم کریں
        </p>
      </div>

      <form onSubmit={submit} className="card mt-8 grid gap-4 p-6 sm:grid-cols-[1fr_1fr_auto] sm:items-end">
        <div>
          <label className="label" htmlFor="t-id">
            Order number
          </label>
          <input id="t-id" className="input" value={orderId} onChange={(e) => setOrderId(e.target.value)} placeholder="AT-10243" required />
        </div>
        <div>
          <label className="label" htmlFor="t-phone">
            Mobile number
          </label>
          <input id="t-phone" className="input" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="0300-1234567" required />
        </div>
        <button className="btn btn-primary py-2.5">Track</button>
      </form>

      {result === null && (
        <p className="mt-6 rounded-xl bg-red-50 p-4 text-center text-sm text-red-700">
          No order found with this order number and mobile number. Please check and try again.
        </p>
      )}

      {result && (
        <div className="card mt-6 p-6">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-2">
            <div>
              <p className="font-mono text-lg font-bold text-brand-900">{result.id}</p>
              <p className="text-xs text-stone-500">Placed {formatDateTime(result.createdAt)}</p>
            </div>
            <p className="text-lg font-bold text-brand-800">{formatPKR(result.total)}</p>
          </div>
          <OrderTimeline status={result.status} />
          <ul className="mt-6 space-y-1 border-t border-stone-100 pt-4 text-sm text-stone-600">
            {result.items.map((i) => (
              <li key={i.productId} className="flex justify-between">
                <span>
                  {i.name} × {i.quantity}
                </span>
                <span>{formatPKR(i.price * i.quantity)}</span>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-xs text-stone-500">Last updated {formatDateTime(result.updatedAt)}</p>
        </div>
      )}
    </div>
  );
}
