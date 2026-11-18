import { ArrowLeft, ImagePlus, Save, X } from 'lucide-react';
import { useState, type ChangeEvent, type FormEvent, type ReactNode } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ProductVisual } from '../../components/ProductVisual';
import { Price } from '../../components/ui/Price';
import { BOOK_COLORS, CATEGORY_INFO, OIL_COLORS } from '../../config/site';
import { useStore } from '../../context/StoreContext';
import { useToast } from '../../context/ToastContext';
import type { Category, Product } from '../../types';
import { slugify } from '../../utils/format';
import { PageHeader } from '../components/ui';

interface FormState {
  category: Category;
  subcategory: string;
  name: string;
  nameUrdu: string;
  slug: string;
  author: string;
  authorUrdu: string;
  publisher: string;
  language: string;
  binding: '' | 'Hardcover' | 'Paperback';
  volumes: string;
  pages: string;
  size: string;
  price: string;
  salePrice: string;
  stock: string;
  description: string;
  descriptionUrdu: string;
  image: string;
  color: string;
  featured: boolean;
  isNew: boolean;
}

const fromProduct = (p?: Product): FormState => ({
  category: p?.category ?? 'books',
  subcategory: p?.subcategory ?? CATEGORY_INFO.books.subcategories[0].name,
  name: p?.name ?? '',
  nameUrdu: p?.nameUrdu ?? '',
  slug: p?.slug ?? '',
  author: p?.author ?? '',
  authorUrdu: p?.authorUrdu ?? '',
  publisher: p?.publisher ?? '',
  language: p?.language ?? 'Urdu',
  binding: p?.binding ?? 'Hardcover',
  volumes: p?.volumes?.toString() ?? '',
  pages: p?.pages?.toString() ?? '',
  size: p?.size ?? '',
  price: p?.price.toString() ?? '',
  salePrice: p?.salePrice?.toString() ?? '',
  stock: p?.stock.toString() ?? '10',
  description: p?.description ?? '',
  descriptionUrdu: p?.descriptionUrdu ?? '',
  image: p?.image ?? '',
  color: p?.color ?? BOOK_COLORS[0],
  featured: p?.featured ?? false,
  isNew: p?.isNew ?? true,
});

const MAX_IMAGE_BYTES = 400 * 1024;

export function ProductForm() {
  const { id } = useParams();
  const { getProduct, products, addProduct, updateProduct } = useStore();
  const toast = useToast();
  const navigate = useNavigate();
  const existing = id ? getProduct(id) : undefined;
  const [form, setForm] = useState<FormState>(() => fromProduct(existing));
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [slugTouched, setSlugTouched] = useState(!!existing);

  if (id && !existing) {
    return (
      <div className="card p-10 text-center">
        <p className="text-stone-600">Product not found.</p>
        <Link to="/admin/products" className="btn btn-primary mt-4">
          Back to products
        </Link>
      </div>
    );
  }

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((f) => {
      const next = { ...f, [key]: value };
      if (key === 'name' && !slugTouched) next.slug = slugify(String(value));
      if (key === 'category') {
        const cat = value as Category;
        next.subcategory = CATEGORY_INFO[cat].subcategories[0].name;
        next.color = (cat === 'books' ? BOOK_COLORS : OIL_COLORS)[0];
      }
      return next;
    });
    setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const onImage = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    if (!file.type.startsWith('image/')) return toast('Please choose an image file', 'error');
    if (file.size > MAX_IMAGE_BYTES)
      return toast('Image is larger than 400 KB — please compress it or paste an image URL instead', 'error');
    const reader = new FileReader();
    reader.onload = () => set('image', String(reader.result));
    reader.readAsDataURL(file);
  };

  const num = (v: string) => (v.trim() === '' ? undefined : Number(v));

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const errs: typeof errors = {};
    if (form.name.trim().length < 2) errs.name = 'Name is required';
    if (form.nameUrdu.trim().length < 2) errs.nameUrdu = 'Urdu name is required';
    const slug = slugify(form.slug || form.name);
    if (!slug) errs.slug = 'URL slug is required';
    else if (products.some((p) => p.slug === slug && p.id !== existing?.id)) errs.slug = 'Another product already uses this slug';
    const price = Number(form.price);
    if (!form.price || !(price > 0)) errs.price = 'Enter a price greater than 0';
    const sale = num(form.salePrice);
    if (sale !== undefined && (sale <= 0 || sale >= price)) errs.salePrice = 'Sale price must be less than the price';
    const stock = Number(form.stock);
    if (form.stock === '' || !Number.isInteger(stock) || stock < 0) errs.stock = 'Enter a whole number (0 or more)';
    if (form.description.trim().length < 10) errs.description = 'Add a short description';
    setErrors(errs);
    if (Object.keys(errs).length) return toast('Please fix the highlighted fields', 'error');

    const isBook = form.category === 'books';
    const data: Omit<Product, 'id' | 'createdAt'> = {
      category: form.category,
      subcategory: form.subcategory,
      name: form.name.trim(),
      nameUrdu: form.nameUrdu.trim(),
      slug,
      author: isBook ? form.author.trim() || undefined : undefined,
      authorUrdu: isBook ? form.authorUrdu.trim() || undefined : undefined,
      publisher: isBook ? form.publisher.trim() || undefined : undefined,
      language: isBook ? form.language || undefined : undefined,
      binding: isBook ? form.binding || undefined : undefined,
      volumes: isBook ? num(form.volumes) : undefined,
      pages: isBook ? num(form.pages) : undefined,
      size: isBook ? undefined : form.size.trim() || undefined,
      price,
      salePrice: sale,
      stock,
      description: form.description.trim(),
      descriptionUrdu: form.descriptionUrdu.trim() || undefined,
      image: form.image.trim() || undefined,
      color: form.color,
      featured: form.featured,
      isNew: form.isNew,
    };

    if (existing) {
      updateProduct(existing.id, data);
      toast('Product updated');
    } else {
      addProduct(data);
      toast('Product added');
    }
    navigate('/admin/products');
  };

  const cls = (key: keyof FormState, extra = '') =>
    `input ${extra} ${errors[key] ? 'border-red-400 focus:border-red-500 focus:ring-red-500/20' : ''}`;
  const Field = ({ k, label, children, hint }: { k: keyof FormState; label: string; children: ReactNode; hint?: string }) => (
    <div>
      <label className="label" htmlFor={`p-${k}`}>
        {label}
      </label>
      {children}
      {errors[k] ? <p className="mt-1 text-xs text-red-600">{errors[k]}</p> : hint && <p className="mt-1 text-xs text-stone-400">{hint}</p>}
    </div>
  );

  const colors = form.category === 'books' ? BOOK_COLORS : OIL_COLORS;
  const preview = {
    name: form.name || 'Product name',
    nameUrdu: form.nameUrdu || 'پروڈکٹ کا نام',
    category: form.category,
    color: form.color,
    image: form.image || undefined,
    authorUrdu: form.authorUrdu || undefined,
    size: form.size || undefined,
  };

  return (
    <div>
      <Link to="/admin/products" className="mb-3 inline-flex items-center gap-1 text-sm text-stone-500 hover:text-brand-700">
        <ArrowLeft className="size-4" /> Back to products
      </Link>
      <PageHeader title={existing ? 'Edit Product' : 'Add New Product'} subtitle={existing?.name} />

      <form onSubmit={submit} noValidate className="grid gap-6 xl:grid-cols-[1fr_320px]">
        <div className="space-y-6">
          <section className="card p-6">
            <h2 className="mb-4 font-semibold text-stone-900">Basic information</h2>
            <div className="mb-5 inline-flex rounded-lg bg-stone-100 p-1">
              {(['books', 'oils'] as Category[]).map((c) => (
                <button
                  type="button"
                  key={c}
                  onClick={() => set('category', c)}
                  className={`rounded-md px-4 py-1.5 text-sm font-medium ${form.category === c ? 'bg-white text-brand-800 shadow-sm' : 'text-stone-600'}`}
                >
                  {c === 'books' ? 'Book' : 'Oil'}
                </button>
              ))}
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {Field({
                k: 'name',
                label: 'Name (English) *',
                children: <input id="p-name" className={cls('name')} value={form.name} onChange={(e) => set('name', e.target.value)} />,
              })}
              {Field({
                k: 'nameUrdu',
                label: 'Name (Urdu) *',
                children: (
                  <input
                    id="p-nameUrdu"
                    dir="rtl"
                    lang="ur"
                    className={cls('nameUrdu', 'font-urdu')}
                    value={form.nameUrdu}
                    onChange={(e) => set('nameUrdu', e.target.value)}
                  />
                ),
              })}
              {Field({
                k: 'subcategory',
                label: 'Type',
                children: (
                  <select id="p-subcategory" className={cls('subcategory')} value={form.subcategory} onChange={(e) => set('subcategory', e.target.value)}>
                    {CATEGORY_INFO[form.category].subcategories.map((s) => (
                      <option key={s.name} value={s.name}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                ),
              })}
              {Field({
                k: 'slug',
                label: 'URL slug',
                hint: `Page address: /product/${form.slug || '…'}`,
                children: (
                  <input
                    id="p-slug"
                    className={cls('slug')}
                    value={form.slug}
                    onChange={(e) => {
                      setSlugTouched(true);
                      set('slug', e.target.value);
                    }}
                  />
                ),
              })}
            </div>
          </section>

          {form.category === 'books' ? (
            <section className="card p-6">
              <h2 className="mb-4 font-semibold text-stone-900">Book details</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                {Field({ k: 'author', label: 'Author', children: <input id="p-author" className={cls('author')} value={form.author} onChange={(e) => set('author', e.target.value)} /> })}
                {Field({
                  k: 'authorUrdu',
                  label: 'Author (Urdu)',
                  children: (
                    <input id="p-authorUrdu" dir="rtl" lang="ur" className={cls('authorUrdu', 'font-urdu')} value={form.authorUrdu} onChange={(e) => set('authorUrdu', e.target.value)} />
                  ),
                })}
                {Field({ k: 'publisher', label: 'Publisher', children: <input id="p-publisher" className={cls('publisher')} value={form.publisher} onChange={(e) => set('publisher', e.target.value)} /> })}
                {Field({
                  k: 'language',
                  label: 'Language',
                  children: (
                    <select id="p-language" className={cls('language')} value={form.language} onChange={(e) => set('language', e.target.value)}>
                      {['Urdu', 'Arabic', 'Arabic-Urdu', 'English', 'Pashto', 'Sindhi'].map((l) => (
                        <option key={l}>{l}</option>
                      ))}
                    </select>
                  ),
                })}
                {Field({
                  k: 'binding',
                  label: 'Binding',
                  children: (
                    <select id="p-binding" className={cls('binding')} value={form.binding} onChange={(e) => set('binding', e.target.value as FormState['binding'])}>
                      <option value="Hardcover">Hardcover</option>
                      <option value="Paperback">Paperback</option>
                    </select>
                  ),
                })}
                <div className="grid grid-cols-2 gap-4">
                  {Field({ k: 'volumes', label: 'Volumes', children: <input id="p-volumes" type="number" min={1} className={cls('volumes')} value={form.volumes} onChange={(e) => set('volumes', e.target.value)} /> })}
                  {Field({ k: 'pages', label: 'Pages', children: <input id="p-pages" type="number" min={1} className={cls('pages')} value={form.pages} onChange={(e) => set('pages', e.target.value)} /> })}
                </div>
              </div>
            </section>
          ) : (
            <section className="card p-6">
              <h2 className="mb-4 font-semibold text-stone-900">Oil details</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                {Field({
                  k: 'size',
                  label: 'Bottle size',
                  hint: 'e.g. 100 ml, 250 ml, 500 ml',
                  children: <input id="p-size" className={cls('size')} value={form.size} onChange={(e) => set('size', e.target.value)} />,
                })}
              </div>
            </section>
          )}

          <section className="card p-6">
            <h2 className="mb-4 font-semibold text-stone-900">Pricing & stock</h2>
            <div className="grid gap-4 sm:grid-cols-3">
              {Field({ k: 'price', label: 'Price (Rs.) *', children: <input id="p-price" type="number" min={1} className={cls('price')} value={form.price} onChange={(e) => set('price', e.target.value)} /> })}
              {Field({
                k: 'salePrice',
                label: 'Sale price (Rs.)',
                hint: 'Leave empty if not on sale',
                children: <input id="p-salePrice" type="number" min={1} className={cls('salePrice')} value={form.salePrice} onChange={(e) => set('salePrice', e.target.value)} />,
              })}
              {Field({ k: 'stock', label: 'Stock quantity *', children: <input id="p-stock" type="number" min={0} className={cls('stock')} value={form.stock} onChange={(e) => set('stock', e.target.value)} /> })}
            </div>
          </section>

          <section className="card p-6">
            <h2 className="mb-4 font-semibold text-stone-900">Description</h2>
            <div className="grid gap-4">
              {Field({
                k: 'description',
                label: 'Description (English) *',
                children: <textarea id="p-description" rows={4} className={cls('description')} value={form.description} onChange={(e) => set('description', e.target.value)} />,
              })}
              {Field({
                k: 'descriptionUrdu',
                label: 'Description (Urdu)',
                children: (
                  <textarea
                    id="p-descriptionUrdu"
                    dir="rtl"
                    lang="ur"
                    rows={3}
                    className={cls('descriptionUrdu', 'font-urdu')}
                    value={form.descriptionUrdu}
                    onChange={(e) => set('descriptionUrdu', e.target.value)}
                  />
                ),
              })}
            </div>
          </section>
        </div>

        {/* side column */}
        <div className="space-y-6">
          <section className="card overflow-hidden xl:sticky xl:top-24">
            <div className="border-b border-stone-100 px-5 py-3 text-xs font-semibold tracking-wider text-stone-500 uppercase">Preview</div>
            <div className="p-5">
              <div className="overflow-hidden rounded-xl border border-stone-200">
                <ProductVisual product={preview} />
              </div>
              <p className="mt-3 font-semibold text-stone-900">{preview.name}</p>
              <p lang="ur" className="font-urdu text-right text-sm text-brand-800">
                {preview.nameUrdu}
              </p>
              <Price product={{ price: Number(form.price) || 0, salePrice: num(form.salePrice) }} />
            </div>

            <div className="space-y-4 border-t border-stone-100 p-5">
              <div>
                <p className="label">Photo</p>
                {form.image ? (
                  <div className="flex items-center gap-2">
                    <span className="flex-1 truncate text-xs text-stone-500">{form.image.startsWith('data:') ? 'Uploaded image' : form.image}</span>
                    <button type="button" onClick={() => set('image', '')} className="btn btn-ghost btn-sm">
                      <X className="size-4" /> Remove
                    </button>
                  </div>
                ) : (
                  <>
                    <label className="btn btn-outline btn-sm w-full cursor-pointer">
                      <ImagePlus className="size-4" /> Upload image
                      <input type="file" accept="image/*" className="sr-only" onChange={onImage} />
                    </label>
                    <input
                      className="input mt-2"
                      placeholder="…or paste an image URL"
                      value={form.image}
                      onChange={(e) => set('image', e.target.value)}
                    />
                    <p className="mt-1 text-xs text-stone-400">Without a photo, a styled cover is drawn automatically.</p>
                  </>
                )}
              </div>

              {!form.image && (
                <div>
                  <p className="label">{form.category === 'books' ? 'Cover colour' : 'Oil colour'}</p>
                  <div className="flex flex-wrap gap-2">
                    {colors.map((c) => (
                      <button
                        type="button"
                        key={c}
                        onClick={() => set('color', c)}
                        className={`size-8 rounded-full ring-offset-2 ${form.color === c ? 'ring-2 ring-brand-700' : ''}`}
                        style={{ backgroundColor: c }}
                        aria-label={`Colour ${c}`}
                      />
                    ))}
                  </div>
                </div>
              )}

              <label className="flex items-center gap-2.5 text-sm">
                <input type="checkbox" className="size-4 accent-brand-800" checked={form.featured} onChange={(e) => set('featured', e.target.checked)} />
                Show on home page (featured)
              </label>
              <label className="flex items-center gap-2.5 text-sm">
                <input type="checkbox" className="size-4 accent-brand-800" checked={form.isNew} onChange={(e) => set('isNew', e.target.checked)} />
                Mark as “New”
              </label>
            </div>
            <div className="border-t border-stone-100 p-5">
              <button className="btn btn-primary w-full py-3">
                <Save className="size-4" /> {existing ? 'Save Changes' : 'Add Product'}
              </button>
            </div>
          </section>
        </div>
      </form>
    </div>
  );
}
