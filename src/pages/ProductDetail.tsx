import { BadgeCheck, MessageCircle, ShoppingCart, Truck, Wallet, Zap } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ProductCard } from '../components/ProductCard';
import { ProductVisual } from '../components/ProductVisual';
import { OrnamentDivider } from '../components/ui/Ornament';
import { Price } from '../components/ui/Price';
import { QuantityInput } from '../components/ui/QuantityInput';
import { SectionHeading } from '../components/ui/SectionHeading';
import { CATEGORY_INFO, subcategoryUrdu } from '../config/site';
import { useCart } from '../context/CartContext';
import { useStore } from '../context/StoreContext';
import { useToast } from '../context/ToastContext';
import { discountPercent, effectivePrice, formatPKR, whatsappLink } from '../utils/format';
import { NotFound } from './NotFound';

export function ProductDetail() {
  const { slug = '' } = useParams();
  const { getProduct, products, settings } = useStore();
  const { add } = useCart();
  const toast = useToast();
  const navigate = useNavigate();
  const product = getProduct(slug);
  const [qty, setQty] = useState(1);
  useEffect(() => {
    setQty(1);
  }, [slug]);

  if (!product) return <NotFound />;

  const outOfStock = product.stock <= 0;
  const off = discountPercent(product);
  const related = products
    .filter((p) => p.id !== product.id && p.category === product.category)
    .sort((a, b) => Number(b.subcategory === product.subcategory) - Number(a.subcategory === product.subcategory))
    .slice(0, 4);

  const details: [string, string | number | undefined][] =
    product.category === 'books'
      ? [
          ['Author', product.author],
          ['Publisher', product.publisher],
          ['Language', product.language],
          ['Binding', product.binding],
          ['Volumes', product.volumes],
          ['Pages', product.pages],
        ]
      : [
          ['Type', product.subcategory],
          ['Bottle size', product.size],
        ];

  const waText = `Assalamu Alaikum, I want to order:\n${product.name} (${product.nameUrdu})\nQuantity: ${qty}\nPrice: ${formatPKR(
    effectivePrice(product) * qty,
  )}`;

  return (
    <div className="container-x py-8">
      <nav className="mb-6 text-xs text-stone-500">
        <Link to="/" className="hover:text-brand-800">
          Home
        </Link>{' '}
        /{' '}
        <Link to={`/shop?category=${product.category}`} className="hover:text-brand-800">
          {CATEGORY_INFO[product.category].label}
        </Link>{' '}
        /{' '}
        <Link to={`/shop?sub=${encodeURIComponent(product.subcategory)}`} className="hover:text-brand-800">
          {product.subcategory}
        </Link>
      </nav>

      <div className="grid gap-10 lg:grid-cols-[minmax(0,460px)_1fr]">
        <div className="relative">
          <div className="overflow-hidden rounded-3xl border border-stone-200 bg-white shadow-sm lg:sticky lg:top-20">
            <ProductVisual product={product} />
            {off > 0 && (
              <span className="absolute top-4 left-4 rounded-lg bg-red-600 px-2.5 py-1 text-sm font-bold text-white">
                -{off}% OFF
              </span>
            )}
          </div>
        </div>

        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-800">
              {product.subcategory}
            </span>
            {subcategoryUrdu(product.subcategory) && (
              <span lang="ur" className="font-urdu text-xs text-gold-700" style={{ lineHeight: 1.8 }}>
                {subcategoryUrdu(product.subcategory)}
              </span>
            )}
          </div>
          <h1 className="mt-3 font-display text-4xl leading-tight font-bold text-brand-900 sm:text-5xl">{product.name}</h1>
          <p dir="rtl" lang="ur" className="mt-1 font-urdu text-3xl text-brand-800" style={{ lineHeight: 2 }}>
            {product.nameUrdu}
          </p>
          {product.author && (
            <p className="text-stone-600">
              by <span className="font-semibold text-stone-800">{product.author}</span>
              {product.authorUrdu && (
                <span lang="ur" className="mr-2 ml-2 font-urdu text-sm text-stone-500">
                  ({product.authorUrdu})
                </span>
              )}
            </p>
          )}

          <OrnamentDivider className="my-5 max-w-md" />

          <Price product={product} size="lg" />
          <p className={`mt-2 text-sm font-medium ${outOfStock ? 'text-red-600' : product.stock <= 5 ? 'text-gold-700' : 'text-brand-600'}`}>
            {outOfStock ? 'Out of stock' : product.stock <= 5 ? `Only ${product.stock} left in stock` : 'In stock'}
          </p>

          {!outOfStock && (
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <QuantityInput value={qty} max={product.stock} onChange={setQty} />
              <button
                className="btn btn-primary flex-1 py-3 sm:flex-none sm:px-8"
                onClick={() => {
                  add(product.id, qty);
                  toast(`${qty} × ${product.name} added to cart`);
                }}
              >
                <ShoppingCart className="size-5" /> Add to Cart
              </button>
              <button
                className="btn btn-gold flex-1 py-3 sm:flex-none sm:px-8"
                onClick={() => {
                  add(product.id, qty);
                  navigate('/checkout');
                }}
              >
                <Zap className="size-5" /> Buy Now
              </button>
            </div>
          )}
          <a
            href={whatsappLink(settings.whatsapp, waText)}
            target="_blank"
            rel="noreferrer"
            className="btn btn-whatsapp mt-3 w-full py-3 sm:w-auto sm:px-8"
          >
            <MessageCircle className="size-5" /> Order on WhatsApp
          </a>

          <div className="mt-6 grid gap-3 rounded-2xl border border-gold-200 bg-gold-50/60 p-4 text-sm sm:grid-cols-3">
            <p className="flex items-center gap-2">
              <Wallet className="size-4 text-brand-700" /> Cash on Delivery
            </p>
            <p className="flex items-center gap-2">
              <Truck className="size-4 text-brand-700" /> 2–5 days delivery
            </p>
            <p className="flex items-center gap-2">
              <BadgeCheck className="size-4 text-brand-700" />
              {product.category === 'books' ? 'Original edition' : '100% pure'}
            </p>
          </div>

          <div className="mt-8">
            <h2 className="font-display text-2xl font-bold text-brand-900">Description</h2>
            <p className="mt-2 leading-relaxed text-stone-700">{product.description}</p>
            {product.descriptionUrdu && (
              <p dir="rtl" lang="ur" className="mt-3 rounded-xl bg-parchment p-4 font-urdu text-brand-900">
                {product.descriptionUrdu}
              </p>
            )}
          </div>

          <div className="mt-8">
            <h2 className="font-display text-2xl font-bold text-brand-900">Details</h2>
            <dl className="mt-3 divide-y divide-stone-200 overflow-hidden rounded-xl border border-stone-200 bg-white text-sm">
              {details
                .filter(([, v]) => v !== undefined && v !== '')
                .map(([k, v]) => (
                  <div key={k} className="grid grid-cols-[140px_1fr] px-4 py-2.5">
                    <dt className="text-stone-500">{k}</dt>
                    <dd className="font-medium text-stone-800">{v}</dd>
                  </div>
                ))}
            </dl>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-20">
          <SectionHeading title="You may also like" urdu="مزید دیکھیں" />
          <div className="grid grid-cols-2 gap-4 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
