import { Search } from 'lucide-react';
import { useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useStore } from '../../context/StoreContext';
import { ORDER_STATUSES, type OrderStatus } from '../../types';
import { formatDateTime, formatPKR } from '../../utils/format';
import { PageHeader, StatusBadge } from '../components/ui';

export function AdminOrders() {
  const { orders } = useStore();
  const [params, setParams] = useSearchParams();
  const status = (params.get('status') as OrderStatus | null) ?? null;
  const q = params.get('q') ?? '';

  const update = (key: string, value: string | null) => {
    const next = new URLSearchParams(params);
    if (value) next.set(key, value);
    else next.delete(key);
    setParams(next, { replace: true });
  };

  const list = useMemo(() => {
    const term = q.trim().toLowerCase();
    return [...orders]
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
      .filter((o) => {
        if (status && o.status !== status) return false;
        if (term) {
          const hay = [o.id, o.customer.name, o.customer.phone, o.customer.city].join(' ').toLowerCase();
          if (!hay.includes(term)) return false;
        }
        return true;
      });
  }, [orders, status, q]);

  return (
    <div>
      <PageHeader title="Orders" subtitle={`${orders.length} orders in total`} />

      <div className="mb-4 flex gap-2 overflow-x-auto pb-1">
        {[null, ...ORDER_STATUSES].map((s) => {
          const count = s ? orders.filter((o) => o.status === s).length : orders.length;
          const active = status === s;
          return (
            <button
              key={s ?? 'all'}
              onClick={() => update('status', s)}
              className={`flex shrink-0 items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium ${
                active ? 'bg-brand-800 text-white' : 'bg-white text-stone-600 ring-1 ring-stone-200 hover:bg-stone-50'
              }`}
            >
              {s ?? 'All'}
              <span className={`rounded-full px-1.5 text-xs ${active ? 'bg-white/20' : 'bg-stone-100'}`}>{count}</span>
            </button>
          );
        })}
      </div>

      <div className="card mb-4 p-3">
        <label className="relative block">
          <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-stone-400" />
          <input
            className="input pl-9"
            placeholder="Search by order number, name, phone or city…"
            value={q}
            onChange={(e) => update('q', e.target.value)}
          />
        </label>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[820px] text-sm">
            <thead className="bg-stone-50 text-left text-xs text-stone-500 uppercase">
              <tr>
                <th className="px-4 py-3 font-semibold">Order</th>
                <th className="px-4 py-3 font-semibold">Customer</th>
                <th className="px-4 py-3 font-semibold">Items</th>
                <th className="px-4 py-3 font-semibold">Payment</th>
                <th className="px-4 py-3 font-semibold">Total</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {list.map((o) => (
                <tr key={o.id} className="hover:bg-stone-50">
                  <td className="px-4 py-3">
                    <Link to={`/admin/orders/${o.id}`} className="font-mono font-semibold text-brand-800 hover:underline">
                      {o.id}
                    </Link>
                    <p className="text-xs text-stone-400">{formatDateTime(o.createdAt)}</p>
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-medium text-stone-800">{o.customer.name}</p>
                    <p className="text-xs text-stone-500">
                      {o.customer.phone} · {o.customer.city}
                    </p>
                  </td>
                  <td className="px-4 py-3 text-stone-600">{o.items.reduce((s, i) => s + i.quantity, 0)} items</td>
                  <td className="px-4 py-3 text-stone-600">{o.paymentMethod}</td>
                  <td className="px-4 py-3 font-semibold">{formatPKR(o.total)}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={o.status} />
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link to={`/admin/orders/${o.id}`} className="btn btn-outline btn-sm">
                      View
                    </Link>
                  </td>
                </tr>
              ))}
              {list.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-stone-500">
                    No orders found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
