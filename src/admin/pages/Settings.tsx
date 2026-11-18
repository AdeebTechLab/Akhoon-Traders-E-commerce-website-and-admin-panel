import { RotateCcw, Save } from 'lucide-react';
import { useState, type FormEvent, type ReactNode } from 'react';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { useStore } from '../../context/StoreContext';
import { useToast } from '../../context/ToastContext';
import type { StoreSettings } from '../../types';
import { PageHeader } from '../components/ui';

type TextKey = { [K in keyof StoreSettings]: StoreSettings[K] extends string ? K : never }[keyof StoreSettings];

export function AdminSettings() {
  const { settings, updateSettings, resetDemoData } = useStore();
  const toast = useToast();
  const [form, setForm] = useState<StoreSettings>(settings);
  const [confirmReset, setConfirmReset] = useState(false);

  const text = (key: TextKey, label: string, opts: { urdu?: boolean; hint?: string; wide?: boolean } = {}) => (
    <div className={opts.wide ? 'sm:col-span-2' : ''}>
      <label className="label" htmlFor={`s-${key}`}>
        {label}
      </label>
      <input
        id={`s-${key}`}
        className={`input ${opts.urdu ? 'font-urdu' : ''}`}
        dir={opts.urdu ? 'rtl' : undefined}
        lang={opts.urdu ? 'ur' : undefined}
        value={form[key]}
        onChange={(e) => setForm({ ...form, [key]: e.target.value })}
      />
      {opts.hint && <p className="mt-1 text-xs text-stone-400">{opts.hint}</p>}
    </div>
  );

  const section = (title: string, children: ReactNode) => (
    <section className="card p-6">
      <h2 className="mb-4 font-semibold text-stone-900">{title}</h2>
      <div className="grid gap-4 sm:grid-cols-2">{children}</div>
    </section>
  );

  const submit = (e: FormEvent) => {
    e.preventDefault();
    updateSettings({
      ...form,
      deliveryCharge: Math.max(0, Number(form.deliveryCharge) || 0),
      freeDeliveryOver: Math.max(0, Number(form.freeDeliveryOver) || 0),
      whatsapp: form.whatsapp.replace(/\D/g, ''),
    });
    toast('Settings saved');
  };

  return (
    <div>
      <PageHeader title="Settings" subtitle="Store details shown on the website" />
      <form onSubmit={submit} className="max-w-4xl space-y-6">
        {section(
          'Store identity',
          <>
            {text('storeName', 'Store name (English)')}
            {text('storeNameUrdu', 'Store name (Urdu)', { urdu: true })}
            {text('tagline', 'Tagline (English)')}
            {text('taglineUrdu', 'Tagline (Urdu)', { urdu: true })}
            {text('announcement', 'Announcement bar text', { wide: true })}
          </>,
        )}

        {section(
          'Contact details',
          <>
            {text('phone', 'Phone')}
            {text('whatsapp', 'WhatsApp number', { hint: 'International format without +, e.g. 923001234567' })}
            {text('email', 'Email')}
            {text('address', 'Address (English)')}
            {text('addressUrdu', 'Address (Urdu)', { urdu: true, wide: true })}
          </>,
        )}

        {section(
          'Delivery',
          <>
            <div>
              <label className="label" htmlFor="s-delivery">
                Delivery charge (Rs.)
              </label>
              <input
                id="s-delivery"
                type="number"
                min={0}
                className="input"
                value={form.deliveryCharge}
                onChange={(e) => setForm({ ...form, deliveryCharge: Number(e.target.value) })}
              />
            </div>
            <div>
              <label className="label" htmlFor="s-free">
                Free delivery on orders above (Rs.)
              </label>
              <input
                id="s-free"
                type="number"
                min={0}
                className="input"
                value={form.freeDeliveryOver}
                onChange={(e) => setForm({ ...form, freeDeliveryOver: Number(e.target.value) })}
              />
            </div>
          </>,
        )}

        {section(
          'Online payments',
          <>
            {text('accountTitle', 'Account title')}
            {text('jazzcashNumber', 'JazzCash number')}
            {text('easypaisaNumber', 'EasyPaisa number')}
            {text('bankDetails', 'Bank details', { wide: true })}
          </>,
        )}

        <div className="flex flex-wrap items-center justify-between gap-3">
          <button type="button" onClick={() => setConfirmReset(true)} className="btn btn-ghost text-red-600 hover:bg-red-50">
            <RotateCcw className="size-4" /> Reset demo data
          </button>
          <button className="btn btn-primary px-8">
            <Save className="size-4" /> Save Settings
          </button>
        </div>
      </form>

      <ConfirmDialog
        open={confirmReset}
        title="Reset all store data?"
        message="Products, orders, messages and settings will go back to the original demo data."
        confirmLabel="Reset"
        onCancel={() => setConfirmReset(false)}
        onConfirm={() => {
          resetDemoData();
          setConfirmReset(false);
          toast('Demo data restored', 'info');
          window.setTimeout(() => window.location.reload(), 400);
        }}
      />
    </div>
  );
}
