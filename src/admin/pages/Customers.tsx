import { MessageCircle, Search } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../../context/StoreContext';
import { formatDate, formatPKR, whatsappLink } from '../../utils/format';
import { PageHeader } from '../components/ui';

interface CustomerRow {
  name: string;
  phone: string;
  city: string;
  orders: number;
  spent: number;
  lastOrder: string;
  lastOrderId: string;
}

export function AdminCustomers() {
  const { orders } = useStore();
  const [q, setQ] = useState('');

  const customers = useMemo(() => {
    const map = new Map<string, CustomerRow>();
    [...orders]
      .sort((a, b) => a.createdAt.localeCompare(b.createdAt))
      .forEach((o) => {
        const key = o.customer.phone.replace(/\D/g, '');
        const row = map.get(key) ?? {
          name: o.customer.name,
          phone: o.customer.phone,
          city: o.customer.city,
          orders: 0,
          spent: 0,
          lastOrder: o.createdAt,
          lastOrderId: o.id,
        };
        row.orders += 1;
        if (o.status !== 'Cancelled') row.spent += o.total;
        row.lastOrder = o.createdAt;
        row.lastOrderId = o.id;
        row.name = o.customer.name;
        row.city = o.customer.city;
        map.set(key, row);
      });
    return [...map.values()].sort((a, b) => b.spent - a.spent);
  }, [orders]);

  const list = customers.filter((c) => [c.name, c.phone, c.city].join(' ').toLowerCase().includes(q.toLowerCase()));

  return (
    <div>
      <PageHeader title="Customers" subtitle={`${customers.length} customers have ordered from your store`} />
      <div className="card mb-4 p-3">
        <label className="relative block">
          <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-stone-400" />
          <input className="input pl-9" placeholder="Search by name, phone or city…" value={q} onChange={(e) => setQ(e.target.value)} />
        </label>
      </div>
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-sm">
            <thead className="bg-stone-50 text-left text-xs text-stone-500 uppercase">
              <tr>
                <th className="px-4 py-3 font-semibold">Customer</th>
                <th className="px-4 py-3 font-semibold">City</th>
                <th className="px-4 py-3 font-semibold">Orders</th>
                <th className="px-4 py-3 font-semibold">Total spent</th>
                <th className="px-4 py-3 font-semibold">Last order</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {list.map((c) => (
                <tr key={c.phone} className="hover:bg-stone-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <span className="flex size-9 items-center justify-center rounded-full bg-brand-50 text-sm font-bold text-brand-800">
                        {c.name.charAt(0)}
                      </span>
                      <div>
                        <p className="font-medium text-stone-800">{c.name}</p>
                        <p className="text-xs text-stone-500">{c.phone}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-stone-600">{c.city}</td>
                  <td className="px-4 py-3">{c.orders}</td>
                  <td className="px-4 py-3 font-semibold">{formatPKR(c.spent)}</td>
                  <td className="px-4 py-3">
                    <Link to={`/admin/orders/${c.lastOrderId}`} className="font-mono text-brand-700 hover:underline">
                      {c.lastOrderId}
                    </Link>
                    <p className="text-xs text-stone-400">{formatDate(c.lastOrder)}</p>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <a
                      href={whatsappLink(c.phone.replace(/\D/g, '').replace(/^0/, '92'), `Assalamu Alaikum ${c.name}`)}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex rounded-md p-2 text-[#1ebe5b] hover:bg-green-50"
                      title="WhatsApp"
                    >
                      <MessageCircle className="size-4" />
                    </a>
                  </td>
                </tr>
              ))}
              {list.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-stone-500">
                    No customers found.
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
