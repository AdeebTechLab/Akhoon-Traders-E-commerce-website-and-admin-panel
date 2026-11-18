import { Banknote, Building2, Lock, Smartphone, Wallet } from 'lucide-react';
import { useState, type FormEvent } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { ProductVisual } from '../components/ProductVisual';
import { PAKISTAN_CITIES } from '../config/site';
import { useCart } from '../context/CartContext';
import { useStore } from '../context/StoreContext';
import type { PaymentMethod } from '../types';
import { formatPKR, isValidPakPhone } from '../utils/format';

interface FormState {
  name: string;
  phone: string;
  email: string;
  city: string;
  address: string;
  notes: string;
  paymentMethod: PaymentMethod;
  transactionId: string;
}

type Errors = Partial<Record<keyof FormState, string>>;

export function Checkout() {
  const { lines, subtotal, delivery, total, items, clear } = useCart();
  const { placeOrder, settings } = useStore();
  const navigate = useNavigate();
  const [placed, setPlaced] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [form, setForm] = useState<FormState>({
    name: '',
    phone: '',
    email: '',
    city: '',
    address: '',
    notes: '',
    paymentMethod: 'COD',
    transactionId: '',
  });

  if (lines.length === 0 && !placed) return <Navigate to="/cart" replace />;

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const PAYMENTS: { id: PaymentMethod; label: string; urdu: string; icon: typeof Wallet; info: string }[] = [
    { id: 'COD', label: 'Cash on Delivery', urdu: 'پارسل ملنے پر ادائیگی', icon: Banknote, info: 'Pay in cash to the rider when your parcel arrives.' },
    {
      id: 'JazzCash',
      label: 'JazzCash',
      urdu: 'جاز کیش',
      icon: Smartphone,
      info: `Send ${formatPKR(total)} to JazzCash ${settings.jazzcashNumber} (${settings.accountTitle}) and enter the transaction ID below.`,
    },
    {
      id: 'EasyPaisa',
      label: 'EasyPaisa',
      urdu: 'ایزی پیسہ',
      icon: Wallet,
      info: `Send ${formatPKR(total)} to EasyPaisa ${settings.easypaisaNumber} (${settings.accountTitle}) and enter the transaction ID below.`,
    },
    {
      id: 'Bank Transfer',
      label: 'Bank Transfer',
      urdu: 'بینک ٹرانسفر',
      icon: Building2,
      info: `Transfer ${formatPKR(total)} to ${settings.bankDetails} (Title: ${settings.accountTitle}) and enter the reference number below.`,
    },
  ];
  const needsTx = form.paymentMethod !== 'COD';

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const errs: Errors = {};
    if (form.name.trim().length < 3) errs.name = 'Please enter your full name';
    if (!isValidPakPhone(form.phone)) errs.phone = 'Enter a valid mobile number, e.g. 0300-1234567';
    if (form.email && !/^\S+@\S+\.\S+$/.test(form.email)) errs.email = 'Enter a valid email or leave it empty';
    if (!form.city) errs.city = 'Please select your city';
    if (form.address.trim().length < 10) errs.address = 'Please enter your complete address';
    if (needsTx && form.transactionId.trim().length < 4) errs.transactionId = 'Transaction ID is required for this payment method';
    setErrors(errs);
    if (Object.keys(errs).length > 0) {
      document.getElementById(`f-${Object.keys(errs)[0]}`)?.focus();
      return;
    }

    const order = placeOrder({
      customer: {
        name: form.name.trim(),
        phone: form.phone.trim(),
        email: form.email.trim() || undefined,
        city: form.city,
        address: form.address.trim(),
      },
      items,
      paymentMethod: form.paymentMethod,
      transactionId: needsTx ? form.transactionId.trim() : undefined,
      notes: form.notes.trim(),
    });
    setPlaced(true);
    navigate(`/order-success/${order.id}`, { replace: true });
    clear();
  };

  const field = (key: keyof FormState) => ({
    id: `f-${key}`,
    'aria-invalid': !!errors[key],
    className: `input ${errors[key] ? 'border-red-400 focus:border-red-500 focus:ring-red-500/20' : ''}`,
  });
  const err = (key: keyof FormState) => errors[key] && <p className="mt-1 text-xs text-red-600">{errors[key]}</p>;

  return (
    <div className="container-x py-10">
      <div className="mb-8 flex items-end justify-between">
        <div>
          <nav className="text-xs text-stone-500">
            <Link to="/cart" className="hover:text-brand-800">
              Cart
            </Link>{' '}
            / Checkout
          </nav>
          <h1 className="mt-1 font-display text-4xl font-bold text-brand-900">Checkout</h1>
        </div>
        <p lang="ur" className="font-urdu text-2xl text-gold-700" style={{ lineHeight: 2 }}>
          آرڈر مکمل کریں
        </p>
      </div>

      <form onSubmit={submit} noValidate className="grid gap-8 lg:grid-cols-[1fr_380px]">
        <div className="space-y-6">
          <section className="card p-6">
            <h2 className="font-display text-2xl font-bold text-brand-900">Delivery Details</h2>
            <p lang="ur" className="font-urdu text-sm text-stone-500">
              ترسیل کی معلومات
            </p>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div>
                <label className="label" htmlFor="f-name">
                  Full name *
                </label>
                <input {...field('name')} value={form.name} onChange={(e) => set('name', e.target.value)} placeholder="Muhammad Ali" />
                {err('name')}
              </div>
              <div>
                <label className="label" htmlFor="f-phone">
                  Mobile number *
                </label>
                <input
                  {...field('phone')}
                  type="tel"
                  inputMode="tel"
                  value={form.phone}
                  onChange={(e) => set('phone', e.target.value)}
                  placeholder="0300-1234567"
                />
                {err('phone')}
              </div>
              <div>
                <label className="label" htmlFor="f-email">
                  Email <span className="font-normal text-stone-400">(optional)</span>
                </label>
                <input {...field('email')} type="email" value={form.email} onChange={(e) => set('email', e.target.value)} placeholder="you@example.com" />
                {err('email')}
              </div>
              <div>
                <label className="label" htmlFor="f-city">
                  City *
                </label>
                <select {...field('city')} value={form.city} onChange={(e) => set('city', e.target.value)}>
                  <option value="">Select city</option>
                  {PAKISTAN_CITIES.map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
                {err('city')}
              </div>
              <div className="sm:col-span-2">
                <label className="label" htmlFor="f-address">
                  Complete address *
                </label>
                <textarea
                  {...field('address')}
                  rows={3}
                  value={form.address}
                  onChange={(e) => set('address', e.target.value)}
                  placeholder="House #, street, area / mohallah, nearest landmark"
                />
                {err('address')}
              </div>
              <div className="sm:col-span-2">
                <label className="label" htmlFor="f-notes">
                  Order notes <span className="font-normal text-stone-400">(optional)</span>
                </label>
                <input
                  {...field('notes')}
                  value={form.notes}
                  onChange={(e) => set('notes', e.target.value)}
                  placeholder="e.g. call before delivery"
                />
              </div>
            </div>
          </section>

          <section className="card p-6">
            <h2 className="font-display text-2xl font-bold text-brand-900">Payment Method</h2>
            <p lang="ur" className="font-urdu text-sm text-stone-500">
              ادائیگی کا طریقہ
            </p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {PAYMENTS.map(({ id, label, urdu, icon: Icon }) => (
                <label
                  key={id}
                  className={`flex cursor-pointer items-center gap-3 rounded-xl border-2 p-4 transition ${
                    form.paymentMethod === id ? 'border-brand-700 bg-brand-50' : 'border-stone-200 hover:border-stone-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    className="size-4 accent-brand-800"
                    checked={form.paymentMethod === id}
                    onChange={() => set('paymentMethod', id)}
                  />
                  <Icon className="size-5 text-brand-700" />
                  <span className="flex-1">
                    <span className="block text-sm font-semibold">{label}</span>
                    <span lang="ur" className="block font-urdu text-xs text-stone-500" style={{ lineHeight: 1.9 }}>
                      {urdu}
                    </span>
                  </span>
                </label>
              ))}
            </div>
            <p className="mt-4 rounded-lg bg-parchment p-3 text-sm text-stone-700">
              {PAYMENTS.find((p) => p.id === form.paymentMethod)?.info}
            </p>
            {needsTx && (
              <div className="mt-4">
                <label className="label" htmlFor="f-transactionId">
                  Transaction ID / Reference *
                </label>
                <input
                  {...field('transactionId')}
                  value={form.transactionId}
                  onChange={(e) => set('transactionId', e.target.value)}
                  placeholder="e.g. 0123456789"
                />
                {err('transactionId')}
              </div>
            )}
          </section>
        </div>

        <aside className="card h-fit p-6 lg:sticky lg:top-20">
          <h2 className="font-display text-2xl font-bold text-brand-900">Your Order</h2>
          <ul className="mt-4 max-h-72 space-y-3 overflow-y-auto pr-1">
            {lines.map(({ product, quantity, lineTotal }) => (
              <li key={product.id} className="flex items-center gap-3">
                <div className="relative w-12 shrink-0 overflow-hidden rounded-md">
                  <ProductVisual product={product} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{product.name}</p>
                  <p className="text-xs text-stone-500">Qty {quantity}</p>
                </div>
                <p className="text-sm font-semibold">{formatPKR(lineTotal)}</p>
              </li>
            ))}
          </ul>
          <dl className="mt-4 space-y-2 border-t border-stone-200 pt-4 text-sm">
            <div className="flex justify-between">
              <dt className="text-stone-600">Subtotal</dt>
              <dd>{formatPKR(subtotal)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-stone-600">Delivery</dt>
              <dd>{delivery === 0 ? 'Free' : formatPKR(delivery)}</dd>
            </div>
            <div className="flex justify-between border-t border-stone-200 pt-3 text-base">
              <dt className="font-semibold">Total</dt>
              <dd className="font-bold text-brand-800">{formatPKR(total)}</dd>
            </div>
          </dl>
          <button type="submit" className="btn btn-primary mt-5 w-full py-3 text-base">
            <Lock className="size-4" /> Place Order
          </button>
          <p lang="ur" className="mt-2 text-center font-urdu text-xs text-stone-500">
            آرڈر کی تصدیق کے لیے ہم آپ سے فون پر رابطہ کریں گے
          </p>
        </aside>
      </form>
    </div>
  );
}
