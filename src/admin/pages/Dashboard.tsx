import { ArrowRight, ClipboardList, Clock, Package, TrendingUp } from 'lucide-react';
import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../../context/StoreContext';
import { ORDER_STATUSES } from '../../types';
import { formatDateTime, formatPKR } from '../../utils/format';
import { PageHeader, StatCard, StatusBadge } from '../components/ui';

const dayKey = (d: Date) => `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;

export function Dashboard() {
  const { orders, products } = useStore();

  const stats = useMemo(() => {
    const valid = orders.filter((o) => o.status !== 'Cancelled');
    const revenue = valid.reduce((s, o) => s + o.total, 0);
    const today = dayKey(new Date());
    const todayOrders = orders.filter((o) => dayKey(new Date(o.createdAt)) === today);

    // last 7 days
    const days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      const key = dayKey(d);
      const dayOrders = valid.filter((o) => dayKey(new Date(o.createdAt)) === key);
      return {
        label: d.toLocaleDateString('en-PK', { weekday: 'short' }),
        date: d.toLocaleDateString('en-PK', { day: 'numeric', month: 'short' }),
        total: dayOrders.reduce((s, o) => s + o.total, 0),
        count: dayOrders.length,
      };
    });
    const weekTotal = days.reduce((s, d) => s + d.total, 0);

    const byStatus = ORDER_STATUSES.map((s) => ({ status: s, count: orders.filter((o) => o.status === s).length }));

    const sold = new Map<string, { name: string; qty: number; revenue: number }>();
    valid.forEach((o) =>
      o.items.forEach((i) => {
        const cur = sold.get(i.productId) ?? { name: i.name, qty: 0, revenue: 0 };
        cur.qty += i.quantity;
        cur.revenue += i.price * i.quantity;
        sold.set(i.productId, cur);
      }),
    );
    const topProducts = [...sold.values()].sort((a, b) => b.qty - a.qty).slice(0, 5);

    return {
      revenue,
      todayCount: todayOrders.length,
      pending: orders.filter((o) => o.status === 'Pending').length,
      avgOrder: valid.length ? revenue / valid.length : 0,
      days,
      weekTotal,
      byStatus,
      topProducts,
    };
  }, [orders]);

  const lowStock = products.filter((p) => p.stock <= 5).sort((a, b) => a.stock - b.stock);
  const maxDay = Math.max(1, ...stats.days.map((d) => d.total));
  const recent = [...orders].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 6);

  return (
    <div>
      <PageHeader title="Dashboard" subtitle="Overview of your store" />

      <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
        <StatCard icon={TrendingUp} label="Total revenue" value={formatPKR(stats.revenue)} hint={`Avg. order ${formatPKR(stats.avgOrder)}`} />
        <StatCard icon={ClipboardList} label="Total orders" value={orders.length} hint={`${stats.todayCount} placed today`} tone="blue" />
        <StatCard icon={Clock} label="Pending orders" value={stats.pending} hint="Waiting for confirmation" tone="gold" />
        <StatCard
          icon={Package}
          label="Products"
          value={products.length}
          hint={`${lowStock.length} low or out of stock`}
          tone={lowStock.length ? 'red' : 'green'}
        />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-3">
        {/* sales chart */}
        <div className="card min-w-0 p-5 xl:col-span-2">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="font-semibold text-stone-900">Sales — last 7 days</h2>
              <p className="text-sm text-stone-500">{formatPKR(stats.weekTotal)} total (excluding cancelled)</p>
            </div>
          </div>
          <div className="mt-6 flex h-56 items-end gap-2 sm:gap-4">
            {stats.days.map((d) => (
              <div key={d.date} className="group flex h-full flex-1 flex-col items-center justify-end">
                <span className="mb-1 text-[11px] font-semibold text-stone-600 opacity-0 transition group-hover:opacity-100 sm:opacity-100">
                  {d.total ? `${Math.round(d.total / 1000)}k` : ''}
                </span>
                <div
                  className="w-full max-w-12 rounded-t-md bg-brand-700 transition group-hover:bg-gold-500"
                  style={{ height: `${Math.max(d.total ? 4 : 1, (d.total / maxDay) * 100)}%` }}
                  title={`${d.date}: ${formatPKR(d.total)} (${d.count} orders)`}
                />
                <span className="mt-2 text-xs font-medium text-stone-600">{d.label}</span>
                <span className="text-[10px] text-stone-400">{d.date}</span>
              </div>
            ))}
          </div>
        </div>

        {/* status breakdown */}
        <div className="card p-5">
          <h2 className="font-semibold text-stone-900">Orders by status</h2>
          <ul className="mt-5 space-y-4">
            {stats.byStatus.map(({ status, count }) => (
              <li key={status}>
                <div className="mb-1 flex items-center justify-between text-sm">
                  <StatusBadge status={status} />
                  <span className="font-semibold text-stone-700">{count}</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-stone-100">
                  <div
                    className="h-full rounded-full bg-brand-600"
                    style={{ width: `${orders.length ? (count / orders.length) * 100 : 0}%` }}
                  />
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-3">
        {/* recent orders */}
        <div className="card min-w-0 overflow-hidden xl:col-span-2">
          <div className="flex items-center justify-between border-b border-stone-100 px-5 py-4">
            <h2 className="font-semibold text-stone-900">Recent orders</h2>
            <Link to="/admin/orders" className="flex items-center gap-1 text-sm font-medium text-brand-700 hover:underline">
              View all <ArrowRight className="size-4" />
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[520px] text-sm">
              <thead className="bg-stone-50 text-left text-xs text-stone-500 uppercase">
                <tr>
                  <th className="px-5 py-3 font-semibold">Order</th>
                  <th className="px-5 py-3 font-semibold">Customer</th>
                  <th className="px-5 py-3 font-semibold">Total</th>
                  <th className="px-5 py-3 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {recent.map((o) => (
                  <tr key={o.id} className="hover:bg-stone-50">
                    <td className="px-5 py-3">
                      <Link to={`/admin/orders/${o.id}`} className="font-mono font-semibold text-brand-800 hover:underline">
                        {o.id}
                      </Link>
                      <p className="text-xs text-stone-400">{formatDateTime(o.createdAt)}</p>
                    </td>
                    <td className="px-5 py-3">
                      <p className="font-medium text-stone-800">{o.customer.name}</p>
                      <p className="text-xs text-stone-500">{o.customer.city}</p>
                    </td>
                    <td className="px-5 py-3 font-semibold">{formatPKR(o.total)}</td>
                    <td className="px-5 py-3">
                      <StatusBadge status={o.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="space-y-6">
          <div className="card p-5">
            <h2 className="font-semibold text-stone-900">Top selling</h2>
            <ol className="mt-4 space-y-3">
              {stats.topProducts.map((p, i) => (
                <li key={p.name} className="flex items-center gap-3 text-sm">
                  <span className="flex size-6 items-center justify-center rounded-full bg-gold-100 text-xs font-bold text-gold-800">
                    {i + 1}
                  </span>
                  <span className="min-w-0 flex-1 truncate text-stone-700">{p.name}</span>
                  <span className="font-semibold text-stone-900">{p.qty} sold</span>
                </li>
              ))}
            </ol>
          </div>

          <div className="card p-5">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-stone-900">Low stock</h2>
              <Link to="/admin/products?stock=low" className="text-sm font-medium text-brand-700 hover:underline">
                Manage
              </Link>
            </div>
            {lowStock.length === 0 ? (
              <p className="mt-3 text-sm text-stone-500">All products are well stocked.</p>
            ) : (
              <ul className="mt-4 space-y-2.5">
                {lowStock.slice(0, 6).map((p) => (
                  <li key={p.id} className="flex items-center justify-between gap-3 text-sm">
                    <Link to={`/admin/products/${p.id}/edit`} className="min-w-0 truncate text-stone-700 hover:text-brand-700">
                      {p.name}
                    </Link>
                    <span className={`shrink-0 font-semibold ${p.stock === 0 ? 'text-red-600' : 'text-amber-600'}`}>
                      {p.stock === 0 ? 'Out' : `${p.stock} left`}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
