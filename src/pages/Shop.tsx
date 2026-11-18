import { Search, SlidersHorizontal, X } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ProductCard } from '../components/ProductCard';
import { CATEGORY_INFO } from '../config/site';
import { useStore } from '../context/StoreContext';
import type { Category } from '../types';
import { effectivePrice } from '../utils/format';

const PRICE_RANGES = [
  { id: 'u1000', label: 'Under Rs. 1,000', test: (n: number) => n < 1000 },
  { id: '1000-5000', label: 'Rs. 1,000 – 5,000', test: (n: number) => n >= 1000 && n <= 5000 },
  { id: 'o5000', label: 'Above Rs. 5,000', test: (n: number) => n > 5000 },
];

const SORTS = [
  { id: 'featured', label: 'Featured' },
  { id: 'newest', label: 'Newest first' },
  { id: 'price-asc', label: 'Price: low to high' },
  { id: 'price-desc', label: 'Price: high to low' },
  { id: 'name', label: 'Name A–Z' },
];

export function Shop() {
  const { products } = useStore();
  const [params, setParams] = useSearchParams();
  const [filtersOpen, setFiltersOpen] = useState(false);

  const category = (params.get('category') as Category | null) ?? null;
  const sub = params.get('sub');
  const q = params.get('q') ?? '';
  const price = params.get('price');
  const inStock = params.get('stock') === '1';
  const sort = params.get('sort') ?? 'featured';

  const update = (key: string, value: string | null) => {
    const next = new URLSearchParams(params);
    if (value === null || value === '') next.delete(key);
    else next.set(key, value);
    if (key === 'category') next.delete('sub');
    setParams(next, { replace: true });
  };

  const results = useMemo(() => {
    const term = q.trim().toLowerCase();
    const range = PRICE_RANGES.find((r) => r.id === price);
    const list = products.filter((p) => {
      if (category && p.category !== category) return false;
      if (sub && p.subcategory !== sub) return false;
      if (inStock && p.stock <= 0) return false;
      if (range && !range.test(effectivePrice(p))) return false;
      if (term) {
        const hay = [p.name, p.nameUrdu, p.author, p.authorUrdu, p.publisher, p.subcategory].join(' ').toLowerCase();
        if (!hay.includes(term)) return false;
      }
      return true;
    });
    const sorted = [...list];
    switch (sort) {
      case 'newest':
        sorted.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
        break;
      case 'price-asc':
        sorted.sort((a, b) => effectivePrice(a) - effectivePrice(b));
        break;
      case 'price-desc':
        sorted.sort((a, b) => effectivePrice(b) - effectivePrice(a));
        break;
      case 'name':
        sorted.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        sorted.sort((a, b) => Number(!!b.featured) - Number(!!a.featured) || (b.stock > 0 ? 1 : 0) - (a.stock > 0 ? 1 : 0));
    }
    return sorted;
  }, [products, category, sub, q, price, inStock, sort]);

  const title = sub ?? (category ? CATEGORY_INFO[category].label : q ? `Search: “${q}”` : 'All Products');
  const titleUrdu = category && !sub ? CATEGORY_INFO[category].urdu : sub ? undefined : 'تمام مصنوعات';
  const hasFilters = !!(category || sub || q || price || inStock);
  const groups = category ? [category] : (['books', 'oils'] as Category[]);

  const filters = (
    <div className="space-y-7">
      <div>
        <h3 className="mb-3 text-xs font-bold tracking-wider text-stone-500 uppercase">Category</h3>
        <div className="space-y-1">
          {[
            { id: null, label: 'All Products' },
            { id: 'books', label: 'Islamic Books' },
            { id: 'oils', label: 'Sunnah & Ruqyah Oils' },
          ].map((c) => (
            <button
              key={c.label}
              onClick={() => update('category', c.id)}
              className={`block w-full rounded-lg px-3 py-2 text-left text-sm ${
                category === c.id ? 'bg-brand-800 font-semibold text-white' : 'text-stone-700 hover:bg-stone-100'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {groups.map((g) => (
        <div key={g}>
          <h3 className="mb-3 text-xs font-bold tracking-wider text-stone-500 uppercase">
            {g === 'books' ? 'Book Types' : 'Oil Types'}
          </h3>
          <div className="space-y-1">
            {CATEGORY_INFO[g].subcategories.map((s) => {
              const count = products.filter((p) => p.subcategory === s.name).length;
              const active = sub === s.name;
              return (
                <button
                  key={s.name}
                  onClick={() => update('sub', active ? null : s.name)}
                  className={`flex w-full items-center justify-between rounded-lg px-3 py-1.5 text-left text-sm ${
                    active ? 'bg-brand-50 font-semibold text-brand-800 ring-1 ring-brand-200' : 'text-stone-700 hover:bg-stone-100'
                  }`}
                >
                  <span>{s.name}</span>
                  <span className="text-xs text-stone-400">{count}</span>
                </button>
              );
            })}
          </div>
        </div>
      ))}

      <div>
        <h3 className="mb-3 text-xs font-bold tracking-wider text-stone-500 uppercase">Price</h3>
        <div className="space-y-2">
          {PRICE_RANGES.map((r) => (
            <label key={r.id} className="flex cursor-pointer items-center gap-2.5 text-sm text-stone-700">
              <input
                type="radio"
                name="price"
                checked={price === r.id}
                onChange={() => update('price', r.id)}
                className="size-4 accent-brand-800"
              />
              {r.label}
            </label>
          ))}
          {price && (
            <button onClick={() => update('price', null)} className="text-xs font-medium text-brand-700 hover:underline">
              Clear price
            </button>
          )}
        </div>
      </div>

      <label className="flex cursor-pointer items-center gap-2.5 text-sm text-stone-700">
        <input
          type="checkbox"
          checked={inStock}
          onChange={(e) => update('stock', e.target.checked ? '1' : null)}
          className="size-4 rounded accent-brand-800"
        />
        In stock only
      </label>
    </div>
  );

  return (
    <div>
      {/* page banner */}
      <div className="bg-pattern-light border-b border-stone-200 bg-parchment">
        <div className="container-x flex items-end justify-between gap-4 py-8">
          <div>
            <nav className="text-xs text-stone-500">
              <Link to="/" className="hover:text-brand-800">
                Home
              </Link>{' '}
              / Shop
            </nav>
            <h1 className="mt-1 font-display text-4xl font-bold text-brand-900">{title}</h1>
          </div>
          {titleUrdu && (
            <p lang="ur" className="font-urdu text-2xl text-gold-700" style={{ lineHeight: 2 }}>
              {titleUrdu}
            </p>
          )}
        </div>
      </div>

      <div className="container-x grid gap-8 py-8 lg:grid-cols-[240px_1fr]">
        {/* sidebar */}
        <aside className="hidden lg:block">{filters}</aside>

        {/* mobile filters drawer */}
        {filtersOpen && (
          <div className="fixed inset-0 z-50 bg-black/40 lg:hidden" onClick={() => setFiltersOpen(false)}>
            <div className="h-full w-80 max-w-[85%] overflow-y-auto bg-white p-5" onClick={(e) => e.stopPropagation()}>
              <div className="mb-5 flex items-center justify-between">
                <h2 className="font-semibold">Filters</h2>
                <button onClick={() => setFiltersOpen(false)} aria-label="Close filters">
                  <X className="size-5" />
                </button>
              </div>
              {filters}
            </div>
          </div>
        )}

        <div>
          <div className="mb-6 flex flex-wrap items-center gap-3">
            <button className="btn btn-outline btn-sm lg:hidden" onClick={() => setFiltersOpen(true)}>
              <SlidersHorizontal className="size-4" /> Filters
            </button>
            <label className="relative min-w-48 flex-1">
              <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-stone-400" />
              <input
                value={q}
                onChange={(e) => update('q', e.target.value)}
                placeholder="Search by title, author or Urdu name…"
                className="input pl-9"
              />
            </label>
            <select value={sort} onChange={(e) => update('sort', e.target.value)} className="input w-auto">
              {SORTS.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4 flex items-center justify-between text-sm text-stone-500">
            <p>
              Showing <span className="font-semibold text-stone-800">{results.length}</span> product
              {results.length === 1 ? '' : 's'}
            </p>
            {hasFilters && (
              <button onClick={() => setParams({}, { replace: true })} className="font-medium text-brand-700 hover:underline">
                Clear all filters
              </button>
            )}
          </div>

          {results.length === 0 ? (
            <div className="card py-16 text-center">
              <p className="font-display text-2xl font-bold text-brand-900">No products found</p>
              <p lang="ur" className="font-urdu text-stone-500">
                کوئی پروڈکٹ نہیں ملی
              </p>
              <button onClick={() => setParams({}, { replace: true })} className="btn btn-primary mt-4">
                Show all products
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:gap-5 md:grid-cols-3 xl:grid-cols-4">
              {results.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
