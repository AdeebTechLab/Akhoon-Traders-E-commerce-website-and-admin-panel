import { ArrowLeft, MessageCircle, Phone, Printer } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { OrderTimeline } from '../../components/OrderTimeline';
import { useStore } from '../../context/StoreContext';
import { useToast } from '../../context/ToastContext';
import { ORDER_STATUSES } from '../../types';
import { formatDateTime, formatPKR, whatsappLink } from '../../utils/format';
import { StatusBadge } from '../components/ui';

export function AdminOrderDetail() {
  const { id = '' } = useParams();
  const { orders, updateOrderStatus, settings } = useStore();
  const toast = useToast();
  const order = orders.find((o) => o.id === id);

  if (!order) {
    return (
      <div className="card p-10 text-center">
        <p className="text-stone-600">Order not found.</p>
        <Link to="/admin/orders" className="btn btn-primary mt-4">
          Back to orders
        </Link>
      </div>
    );
  }

  const customerWa = order.customer.phone.replace(/\D/g, '').replace(/^0/, '92');
  const waText = `Assalamu Alaikum ${order.customer.name}, your order ${order.id} (${formatPKR(order.total)}) from ${settings.storeName} is now: ${order.status}.`;

  return (
    <div>
      <Link to="/admin/orders" className="no-print mb-3 inline-flex items-center gap-1 text-sm text-stone-500 hover:text-brand-700">
        <ArrowLeft className="size-4" /> Back to orders
      </Link>

      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="font-mono text-2xl font-bold text-stone-900">{order.id}</h1>
            <StatusBadge status={order.status} />
          </div>
          <p className="text-sm text-stone-500">Placed {formatDateTime(order.createdAt)} · Updated {formatDateTime(order.updatedAt)}</p>
        </div>
        <div className="no-print flex flex-wrap gap-2">
          <a href={whatsappLink(customerWa, waText)} target="_blank" rel="noreferrer" className="btn btn-whatsapp btn-sm">
            <MessageCircle className="size-4" /> WhatsApp customer
          </a>
          <a href={`tel:${order.customer.phone.replace(/\D/g, '')}`} className="btn btn-outline btn-sm">
            <Phone className="size-4" /> Call
          </a>
          <button onClick={() => window.print()} className="btn btn-outline btn-sm">
            <Printer className="size-4" /> Print invoice
          </button>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_340px]">
        <div className="space-y-6">
          <section className="card p-6">
            <OrderTimeline status={order.status} />
          </section>

          <section className="card overflow-hidden">
            <h2 className="border-b border-stone-100 px-6 py-4 font-semibold text-stone-900">Items</h2>
            <table className="w-full text-sm">
              <thead className="bg-stone-50 text-left text-xs text-stone-500 uppercase">
                <tr>
                  <th className="px-6 py-2.5 font-semibold">Product</th>
                  <th className="px-6 py-2.5 text-right font-semibold">Price</th>
                  <th className="px-6 py-2.5 text-right font-semibold">Qty</th>
                  <th className="px-6 py-2.5 text-right font-semibold">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {order.items.map((i) => (
                  <tr key={i.productId}>
                    <td className="px-6 py-3">
                      <p className="font-medium">{i.name}</p>
                      <p lang="ur" className="font-urdu text-xs text-stone-500" style={{ lineHeight: 1.9 }}>
                        {i.nameUrdu}
                      </p>
                    </td>
                    <td className="px-6 py-3 text-right">{formatPKR(i.price)}</td>
                    <td className="px-6 py-3 text-right">{i.quantity}</td>
                    <td className="px-6 py-3 text-right font-semibold">{formatPKR(i.price * i.quantity)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="border-t border-stone-200 text-sm">
                <tr>
                  <td colSpan={3} className="px-6 pt-3 text-right text-stone-500">
                    Subtotal
                  </td>
                  <td className="px-6 pt-3 text-right">{formatPKR(order.subtotal)}</td>
                </tr>
                <tr>
                  <td colSpan={3} className="px-6 pt-1 text-right text-stone-500">
                    Delivery
                  </td>
                  <td className="px-6 pt-1 text-right">{order.delivery === 0 ? 'Free' : formatPKR(order.delivery)}</td>
                </tr>
                <tr>
                  <td colSpan={3} className="px-6 py-3 text-right font-semibold">
                    Total
                  </td>
                  <td className="px-6 py-3 text-right text-lg font-bold text-brand-800">{formatPKR(order.total)}</td>
                </tr>
              </tfoot>
            </table>
          </section>
        </div>

        <div className="space-y-6">
          <section className="card no-print p-6">
            <h2 className="font-semibold text-stone-900">Update status</h2>
            <div className="mt-4 grid grid-cols-2 gap-2">
              {ORDER_STATUSES.map((s) => (
                <button
                  key={s}
                  onClick={() => {
                    updateOrderStatus(order.id, s);
                    toast(`Order ${order.id} marked as ${s}`);
                  }}
                  disabled={order.status === s}
                  className={`rounded-lg border px-3 py-2 text-sm font-medium transition ${
                    order.status === s
                      ? 'border-brand-700 bg-brand-800 text-white disabled:opacity-100'
                      : s === 'Cancelled'
                        ? 'border-red-200 text-red-600 hover:bg-red-50'
                        : 'border-stone-200 text-stone-700 hover:border-brand-300 hover:bg-brand-50'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
            <p className="mt-3 text-xs text-stone-500">Cancelling an order returns its items to stock.</p>
          </section>

          <section className="card p-6">
            <h2 className="font-semibold text-stone-900">Customer</h2>
            <dl className="mt-3 space-y-2 text-sm">
              <div>
                <dt className="text-xs text-stone-500">Name</dt>
                <dd className="font-medium">{order.customer.name}</dd>
              </div>
              <div>
                <dt className="text-xs text-stone-500">Phone</dt>
                <dd className="font-medium">{order.customer.phone}</dd>
              </div>
              {order.customer.email && (
                <div>
                  <dt className="text-xs text-stone-500">Email</dt>
                  <dd className="font-medium">{order.customer.email}</dd>
                </div>
              )}
              <div>
                <dt className="text-xs text-stone-500">Address</dt>
                <dd className="font-medium">
                  {order.customer.address}, {order.customer.city}
                </dd>
              </div>
            </dl>
          </section>

          <section className="card p-6">
            <h2 className="font-semibold text-stone-900">Payment</h2>
            <dl className="mt-3 space-y-2 text-sm">
              <div>
                <dt className="text-xs text-stone-500">Method</dt>
                <dd className="font-medium">{order.paymentMethod}</dd>
              </div>
              {order.transactionId && (
                <div>
                  <dt className="text-xs text-stone-500">Transaction ID</dt>
                  <dd className="font-mono font-medium">{order.transactionId}</dd>
                </div>
              )}
              {order.notes && (
                <div>
                  <dt className="text-xs text-stone-500">Customer notes</dt>
                  <dd className="font-medium">{order.notes}</dd>
                </div>
              )}
            </dl>
          </section>
        </div>
      </div>
    </div>
  );
}
