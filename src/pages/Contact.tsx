import { Clock, Mail, MapPin, MessageCircle, Phone, Send } from 'lucide-react';
import { useState, type FormEvent } from 'react';
import { useStore } from '../context/StoreContext';
import { useToast } from '../context/ToastContext';
import { isValidPakPhone, whatsappLink } from '../utils/format';

export function Contact() {
  const { settings, addMessage } = useStore();
  const toast = useToast();
  const [form, setForm] = useState({ name: '', phone: '', email: '', subject: '', message: '' });
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (form.name.trim().length < 3) return setError('Please enter your name.');
    if (!isValidPakPhone(form.phone)) return setError('Please enter a valid mobile number, e.g. 0300-1234567.');
    if (form.message.trim().length < 10) return setError('Please write a short message (at least 10 characters).');
    addMessage({
      name: form.name.trim(),
      phone: form.phone.trim(),
      email: form.email.trim() || undefined,
      subject: form.subject.trim() || 'General enquiry',
      message: form.message.trim(),
    });
    setError('');
    setSent(true);
    setForm({ name: '', phone: '', email: '', subject: '', message: '' });
    toast('Message sent — we will get back to you soon, in sha Allah.');
  };

  const info = [
    { icon: Phone, label: 'Phone', value: settings.phone, href: `tel:${settings.phone.replace(/\D/g, '')}` },
    { icon: MessageCircle, label: 'WhatsApp', value: `+${settings.whatsapp}`, href: whatsappLink(settings.whatsapp, 'Assalamu Alaikum') },
    { icon: Mail, label: 'Email', value: settings.email, href: `mailto:${settings.email}` },
    { icon: MapPin, label: 'Address', value: settings.address },
    { icon: Clock, label: 'Timings', value: 'Sat – Thu, 10:00 am – 8:00 pm (closed for Jumu‘ah)' },
  ];

  return (
    <div className="container-x py-12">
      <div className="mb-10 text-center">
        <h1 className="font-display text-5xl font-bold text-brand-900">Contact Us</h1>
        <p lang="ur" className="font-urdu text-2xl text-gold-700" style={{ lineHeight: 2 }}>
          ہم سے رابطہ کریں
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[380px_1fr]">
        <div className="space-y-3">
          {info.map(({ icon: Icon, label, value, href }) => (
            <div key={label} className="card flex items-start gap-4 p-4">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-brand-800 text-gold-300">
                <Icon className="size-5" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold tracking-wider text-stone-500 uppercase">{label}</p>
                {href ? (
                  <a href={href} target={href.startsWith('http') ? '_blank' : undefined} rel="noreferrer" className="font-medium break-words text-stone-800 hover:text-brand-700">
                    {value}
                  </a>
                ) : (
                  <p className="font-medium text-stone-800">{value}</p>
                )}
              </div>
            </div>
          ))}
          <p dir="rtl" lang="ur" className="rounded-xl bg-parchment p-4 font-urdu text-sm text-brand-900">
            {settings.addressUrdu}
          </p>
        </div>

        <form onSubmit={submit} noValidate className="card p-6 sm:p-8">
          <h2 className="font-display text-2xl font-bold text-brand-900">Send us a message</h2>
          <p className="text-sm text-stone-500">For bulk orders, questions about a book, or help with an order.</p>
          {sent && (
            <p className="mt-4 rounded-lg bg-brand-50 p-3 text-sm text-brand-800">
              JazakAllah! Your message has been received. We usually reply within a few hours.
            </p>
          )}
          {error && <p className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <div>
              <label className="label" htmlFor="c-name">
                Name *
              </label>
              <input id="c-name" className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div>
              <label className="label" htmlFor="c-phone">
                Mobile *
              </label>
              <input id="c-phone" className="input" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="0300-1234567" />
            </div>
            <div>
              <label className="label" htmlFor="c-email">
                Email
              </label>
              <input id="c-email" type="email" className="input" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </div>
            <div>
              <label className="label" htmlFor="c-subject">
                Subject
              </label>
              <input id="c-subject" className="input" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} placeholder="e.g. Bulk order" />
            </div>
            <div className="sm:col-span-2">
              <label className="label" htmlFor="c-message">
                Message *
              </label>
              <textarea id="c-message" rows={5} className="input" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
            </div>
          </div>
          <button className="btn btn-primary mt-5">
            <Send className="size-4" /> Send Message
          </button>
        </form>
      </div>
    </div>
  );
}
