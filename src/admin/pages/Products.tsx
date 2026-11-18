import { Eye, Pencil, Plus, Search, Star, Trash2 } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ProductVisual } from '../../components/ProductVisual';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { useStore } from '../../context/StoreContext';
import { useToast } from '../../context/ToastContext';
import type { Product } from '../../types';
import { formatPKR } from '../../utils/format';
import { PageHeader, StockBadge } from '../components/ui';

export function AdminProducts() {
  const { products, deleteProduct, updateProduct } = useStore();
  const toast = useToast();
  const [params, setParams] = useSearchParams();
  const [toDelete, setToDelete] = useState<Product | null>(null);

  const q = params.get('q') ?? '';
  const category = params.get('category') ?? '';
  const stock = params.get('stock') ?? '';

  const update = (key: string, value: string) => {
    const next = new URLSearchParams(params);
    if (value) next.set(key, value);
    else next.delete(key);
    setParams(next, { replace: true });
  };

  const list = useMemo(() => {
    const term = q.toLowerCase();
    return products.filter((p) => {
      if (category && p.category !== category) return false;
      if (stock === 'low' && p.stock > 5) return false;
      if (stock === 'out' && p.stock > 0) return false;
      if (term && ![p.name, p.nameUrdu, p.author, p.subcategory].join(' ').toLowerCase().includes(term)) return false;
      return true;
    });
  }, [products, q, category, stock]);

  return (
    <div>
      <PageHeader
        title="Products"
        subtitle={`${products.length} products in your store`}
        action={
          <Link to="/admin/products/new" className="btn btn-primary">
            <Plus className="size-4" /> Add Product
          </Link>
        }
      />

      <div className="card mb-4 flex flex-wrap gap-3 p-3">
        <label className="relative min-w-52 flex-1">
          <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-stone-400" />
          <input className="input pl-9" placeholder="Search products…" value={q} onChange={(e) => update('q', e.target.value)} />
        </label>
        <select className="input w-auto" value={category} onChange={(e) => update('category', e.target.value)}>
          <option value="">All categories</option>
          <option value="books">Books</option>
          <option value="oils">Oils</option>
        </select>
        <select className="input w-auto" value={stock} onChange={(e) => update('stock', e.target.value)}>
          <option value="">All stock levels</option>
          <option value="low">Low stock (≤ 5)</option>
          <option value="out">Out of stock</option>
        </select>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-sm">
            <thead className="bg-stone-50 text-left text-xs text-stone-500 uppercase">
              <tr>
                <th className="px-4 py-3 font-semibold">Product</th>
                <th className="px-4 py-3 font-semibold">Category</th>
                <th className="px-4 py-3 font-semibold">Price</th>
                <th className="px-4 py-3 font-semibold">Stock</th>
                <th className="px-4 py-3 text-center font-semibold">Featured</th>
                <th className="px-4 py-3 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {list.map((p) => (
                <tr key={p.id} className="hover:bg-stone-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-11 shrink-0 overflow-hidden rounded-md border border-stone-200">
                        <ProductVisual product={p} />
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-stone-900">{p.name}</p>
                        <p lang="ur" className="font-urdu text-xs text-stone-500" style={{ lineHeight: 1.9 }}>
                          {p.nameUrdu}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <p className="capitalize">{p.category}</p>
                    <p className="text-xs text-stone-500">{p.subcategory}</p>
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-semibold">{formatPKR(p.salePrice ?? p.price)}</p>
                    {p.salePrice && <p className="text-xs text-stone-400 line-through">{formatPKR(p.price)}</p>}
                  </td>
                  <td className="px-4 py-3">
                    <StockBadge stock={p.stock} />
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => updateProduct(p.id, { featured: !p.featured })}
                      className={`rounded-md p-1.5 ${p.featured ? 'text-gold-500' : 'text-stone-300 hover:text-stone-500'}`}
                      aria-label={p.featured ? 'Remove from featured' : 'Mark as featured'}
                      title={p.featured ? 'Featured on home page' : 'Not featured'}
                    >
                      <Star className="size-5" fill={p.featured ? 'currentColor' : 'none'} />
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-1">
                      <Link to={`/product/${p.slug}`} target="_blank" rel="noopener noreferrer" className="rounded-md p-2 text-stone-500 hover:bg-stone-100" title="View in store">
                        <Eye className="size-4" />
                      </Link>
                      <Link to={`/admin/products/${p.id}/edit`} className="rounded-md p-2 text-stone-500 hover:bg-stone-100 hover:text-brand-700" title="Edit">
                        <Pencil className="size-4" />
                      </Link>
                      <button onClick={() => setToDelete(p)} className="rounded-md p-2 text-stone-500 hover:bg-red-50 hover:text-red-600" title="Delete">
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {list.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-stone-500">
                    No products match these filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <ConfirmDialog
        open={!!toDelete}
        title="Delete product?"
        message={`“${toDelete?.name}” will be removed from your store. This cannot be undone.`}
        onCancel={() => setToDelete(null)}
        onConfirm={() => {
          if (toDelete) {
            deleteProduct(toDelete.id);
            toast(`${toDelete.name} deleted`, 'info');
          }
          setToDelete(null);
        }}
      />
    </div>
  );
}
