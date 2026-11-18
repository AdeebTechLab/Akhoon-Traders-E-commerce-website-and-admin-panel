import { ShoppingCart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import type { Product } from '../types';
import { discountPercent } from '../utils/format';
import { ProductVisual } from './ProductVisual';
import { Price } from './ui/Price';

export function ProductCard({ product }: { product: Product }) {
  const { add } = useCart();
  const toast = useToast();
  const off = discountPercent(product);
  const outOfStock = product.stock <= 0;

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-stone-200/80 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg">
      <Link to={`/product/${product.slug}`} className="relative block">
        <ProductVisual product={product} className="transition duration-300 group-hover:scale-[1.03]" />
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {off > 0 && <span className="rounded-md bg-red-600 px-2 py-0.5 text-[11px] font-bold text-white">-{off}%</span>}
          {product.isNew && (
            <span className="rounded-md bg-gold-400 px-2 py-0.5 text-[11px] font-bold text-brand-950">NEW</span>
          )}
        </div>
        {outOfStock && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/60">
            <span className="rounded-full bg-stone-900 px-3 py-1 text-xs font-semibold text-white">Out of stock</span>
          </div>
        )}
      </Link>

      <div className="flex flex-1 flex-col p-4">
        <p className="text-[11px] font-semibold tracking-wider text-gold-700 uppercase">{product.subcategory}</p>
        <Link to={`/product/${product.slug}`} className="mt-1">
          <h3 className="line-clamp-2 font-semibold text-stone-900 group-hover:text-brand-800">{product.name}</h3>
        </Link>
        <p dir="rtl" lang="ur" className="font-urdu text-right text-sm text-brand-800" style={{ lineHeight: 2.2 }}>
          {product.nameUrdu}
        </p>
        {product.author && <p className="line-clamp-1 text-xs text-stone-500">{product.author}</p>}
        {product.size && <p className="text-xs text-stone-500">{product.size}</p>}

        <div className="mt-auto flex items-end justify-between gap-2 pt-3">
          <Price product={product} />
          <button
            className="btn btn-primary btn-sm shrink-0"
            disabled={outOfStock}
            onClick={() => {
              add(product.id);
              toast(`${product.name} added to cart`);
            }}
            aria-label={`Add ${product.name} to cart`}
          >
            <ShoppingCart className="size-4" />
            <span className="hidden sm:inline">Add</span>
          </button>
        </div>
      </div>
    </article>
  );
}
