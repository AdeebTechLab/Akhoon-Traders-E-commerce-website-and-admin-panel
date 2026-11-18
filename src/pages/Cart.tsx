import { ArrowLeft, ArrowRight, ShoppingBag, Trash2, Truck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ProductVisual } from '../components/ProductVisual';
import { QuantityInput } from '../components/ui/QuantityInput';
import { useCart } from '../context/CartContext';
import { useStore } from '../context/StoreContext';
import { effectivePrice, formatPKR } from '../utils/format';

export function Cart() {
  const { lines, subtotal, delivery, total, setQuantity, remove, count } = useCart();
  const { settings } = useStore();
  const remainingForFree = settings.freeDeliveryOver - subtotal;

  if (lines.length === 0) {
    return (
      <div className="container-x py-20 text-center">
        <div className="mx-auto flex size-20 items-center justify-center rounded-full bg-brand-50">
          <ShoppingBag className="size-9 text-brand-700" />
        </div>
        <h1 className="mt-5 font-display text-4xl font-bold text-brand-900">Your cart is empty</h1>
        <p lang="ur" className="font-urdu text-lg text-stone-500">
          آپ کی ٹوکری خالی ہے
        </p>
        <Link to="/shop" className="btn btn-primary mt-6">
          Start Shopping <ArrowRight className="size-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="container-x py-10">
      <div className="mb-8 flex items-end justify-between">
        <h1 className="font-display text-4xl font-bold text-brand-900">Shopping Cart</h1>
        <p lang="ur" className="font-urdu text-2xl text-gold-700" style={{ lineHeight: 2 }}>
          خریداری کی ٹوکری
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
        <div className="card divide-y divide-stone-100">
          {lines.map(({ product, quantity, lineTotal }) => (
            <div key={product.id} className="flex gap-4 p-4 sm:p-5">
              <Link to={`/product/${product.slug}`} className="w-20 shrink-0 overflow-hidden rounded-lg sm:w-24">
                <ProductVisual product={product} />
              </Link>
              <div className="flex min-w-0 flex-1 flex-col">
                <div className="flex justify-between gap-3">
                  <div className="min-w-0">
                    <Link to={`/product/${product.slug}`} className="font-semibold text-stone-900 hover:text-brand-800">
                      {product.name}
                    </Link>
                    <p lang="ur" className="font-urdu text-sm text-brand-800" style={{ lineHeight: 2 }}>
                      {product.nameUrdu}
                    </p>
                    <p className="text-xs text-stone-500">{formatPKR(effectivePrice(product))} each</p>
                  </div>
                  <p className="shrink-0 font-bold text-brand-800">{formatPKR(lineTotal)}</p>
                </div>
                <div className="mt-auto flex items-center justify-between pt-3">
                  <QuantityInput size="sm" value={quantity} max={product.stock} onChange={(n) => setQuantity(product.id, n)} />
                  <button
                    onClick={() => remove(product.id)}
                    className="flex items-center gap-1 text-sm text-stone-500 hover:text-red-600"
                  >
                    <Trash2 className="size-4" /> <span className="hidden sm:inline">Remove</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <aside className="card h-fit p-6 lg:sticky lg:top-20">
          <h2 className="font-display text-2xl font-bold text-brand-900">Order Summary</h2>
          {remainingForFree > 0 ? (
            <p className="mt-3 flex items-start gap-2 rounded-lg bg-gold-50 p-3 text-xs text-gold-800">
              <Truck className="size-4 shrink-0" />
              Add {formatPKR(remainingForFree)} more for FREE delivery
            </p>
          ) : (
            <p className="mt-3 flex items-center gap-2 rounded-lg bg-brand-50 p-3 text-xs font-medium text-brand-800">
              <Truck className="size-4" /> You get FREE delivery!
            </p>
          )}
          <dl className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-stone-600">Subtotal ({count} items)</dt>
              <dd className="font-medium">{formatPKR(subtotal)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-stone-600">Delivery</dt>
              <dd className="font-medium">{delivery === 0 ? 'Free' : formatPKR(delivery)}</dd>
            </div>
            <div className="flex justify-between border-t border-stone-200 pt-3 text-base">
              <dt className="font-semibold">Total</dt>
              <dd className="font-bold text-brand-800">{formatPKR(total)}</dd>
            </div>
          </dl>
          <Link to="/checkout" className="btn btn-primary mt-5 w-full py-3">
            Proceed to Checkout <ArrowRight className="size-4" />
          </Link>
          <Link to="/shop" className="mt-3 flex items-center justify-center gap-1 text-sm text-stone-600 hover:text-brand-800">
            <ArrowLeft className="size-4" /> Continue shopping
          </Link>
        </aside>
      </div>
    </div>
  );
}
