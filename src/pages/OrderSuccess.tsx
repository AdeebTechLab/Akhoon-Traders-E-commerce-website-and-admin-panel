import { CheckCircle2, MessageCircle, PackageSearch } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { OrderTimeline } from '../components/OrderTimeline';
import { OrnamentDivider } from '../components/ui/Ornament';
import { useStore } from '../context/StoreContext';
import { formatDateTime, formatPKR, whatsappLink } from '../utils/format';
import { NotFound } from './NotFound';

export function OrderSuccess() {
  const { id = '' } = useParams();
  const { orders, settings } = useStore();
  const order = orders.find((o) => o.id === id);
  if (!order) return <NotFound />;

  const waText = `Assalamu Alaikum, I have placed order ${order.id} for ${formatPKR(order.total)}. Please confirm.`;

  return (
    <div className="container-x max-w-3xl py-12">
      <div className="card overflow-hidden">
        <div className="bg-pattern-dark bg-brand-800 px-6 py-10 text-center text-white">
          <CheckCircle2 className="mx-auto size-14 text-gold-300" />
          <h1 className="mt-3 font-display text-4xl font-bold">JazakAllah Khair!</h1>
          <p lang="ur" className="font-urdu text-xl text-gold-200" style={{ lineHeight: 2.1 }}>
            آپ کا آرڈر کامیابی سے موصول ہو گیا ہے
          </p>
          <p className="mt-2 text-brand-100/90">
            Your order number is <span className="rounded bg-white/15 px-2 py-0.5 font-mono font-bold text-white">{order.id}</span>
          </p>
        </div>

        <div className="p-6 sm:p-8">
          <OrderTimeline status={order.status} />
          <OrnamentDivider className="my-8" />

          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <h2 className="text-xs font-bold tracking-wider text-stone-500 uppercase">Delivering to</h2>
              <p className="mt-2 font-semibold">{order.customer.name}</p>
              <p className="text-sm text-stone-600">{order.customer.phone}</p>
              <p className="text-sm text-stone-600">
                {order.customer.address}, {order.customer.city}
              </p>
            </div>
            <div>
              <h2 className="text-xs font-bold tracking-wider text-stone-500 uppercase">Payment</h2>
              <p className="mt-2 font-semibold">{order.paymentMethod}</p>
              <p className="text-sm text-stone-600">Placed on {formatDateTime(order.createdAt)}</p>
            </div>
          </div>

          <table className="mt-6 w-full text-sm">
            <tbody className="divide-y divide-stone-100">
              {order.items.map((i) => (
                <tr key={i.productId}>
                  <td className="py-2.5">
                    {i.name} <span className="text-stone-400">× {i.quantity}</span>
                  </td>
                  <td className="py-2.5 text-right font-medium">{formatPKR(i.price * i.quantity)}</td>
                </tr>
              ))}
              <tr>
                <td className="py-2.5 text-stone-600">Delivery</td>
                <td className="py-2.5 text-right">{order.delivery === 0 ? 'Free' : formatPKR(order.delivery)}</td>
              </tr>
              <tr>
                <td className="py-3 font-semibold">Total</td>
                <td className="py-3 text-right text-lg font-bold text-brand-800">{formatPKR(order.total)}</td>
              </tr>
            </tbody>
          </table>

          <p className="mt-4 rounded-lg bg-gold-50 p-3 text-sm text-gold-900">
            Our team will call you on <strong>{order.customer.phone}</strong> to confirm the order. Please keep your phone
            available.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <a href={whatsappLink(settings.whatsapp, waText)} target="_blank" rel="noreferrer" className="btn btn-whatsapp">
              <MessageCircle className="size-4" /> Confirm on WhatsApp
            </a>
            <Link to={`/track-order?id=${order.id}`} className="btn btn-outline">
              <PackageSearch className="size-4" /> Track Order
            </Link>
            <Link to="/shop" className="btn btn-ghost">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
