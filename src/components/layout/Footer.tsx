import { Mail, MapPin, MessageCircle, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';
import { CATEGORY_INFO } from '../../config/site';
import { useStore } from '../../context/StoreContext';
import { whatsappLink } from '../../utils/format';
import { Emblem, OrnamentDivider } from '../ui/Ornament';

export function Footer() {
  const { settings } = useStore();
  const year = new Date().getFullYear();

  return (
    <footer className="bg-pattern-dark relative mt-20 bg-brand-900 text-brand-100">
      <div className="h-1.5 bg-gradient-to-r from-gold-600 via-gold-300 to-gold-600" />
      <div className="container-x grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="flex items-center gap-3">
            <Emblem className="size-12" />
            <div>
              <p className="font-display text-2xl leading-none font-bold text-white">{settings.storeName}</p>
              <p lang="ur" className="font-urdu text-lg text-gold-300" style={{ lineHeight: 1.9 }}>
                {settings.storeNameUrdu}
              </p>
            </div>
          </div>
          <p className="mt-4 text-sm leading-relaxed text-brand-100/80">
            Authentic Islamic books from trusted publishers and pure, dam-shuda Sunnah oils — delivered to your door
            anywhere in Pakistan.
          </p>
          <p dir="rtl" lang="ur" className="mt-2 font-urdu text-sm text-brand-100/70">
            مستند اسلامی کتب اور خالص سنت تیل، پورے پاکستان میں گھر بیٹھے۔
          </p>
        </div>

        <div>
          <h4 className="font-display text-xl font-bold text-gold-300">Quick Links</h4>
          <ul className="mt-4 space-y-2.5 text-sm">
            {[
              ['/shop', 'Shop All Products'],
              ['/track-order', 'Track Your Order'],
              ['/cart', 'Shopping Cart'],
              ['/about', 'About Us'],
              ['/contact', 'Contact Us'],
            ].map(([to, label]) => (
              <li key={to}>
                <Link to={to} className="hover:text-gold-300">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-display text-xl font-bold text-gold-300">Categories</h4>
          <ul className="mt-4 space-y-2.5 text-sm">
            {[...CATEGORY_INFO.books.subcategories.slice(0, 5), ...CATEGORY_INFO.oils.subcategories.slice(0, 2)].map(
              (s) => (
                <li key={s.name}>
                  <Link to={`/shop?sub=${encodeURIComponent(s.name)}`} className="flex items-center justify-between gap-3 hover:text-gold-300">
                    <span>{s.name}</span>
                    <span lang="ur" className="font-urdu text-xs whitespace-nowrap text-brand-100/50" style={{ lineHeight: 1.6 }}>
                      {s.urdu}
                    </span>
                  </Link>
                </li>
              ),
            )}
          </ul>
        </div>

        <div>
          <h4 className="font-display text-xl font-bold text-gold-300">Contact Us</h4>
          <ul className="mt-4 space-y-3 text-sm">
            <li className="flex gap-3">
              <MapPin className="mt-0.5 size-4 shrink-0 text-gold-400" />
              <span>{settings.address}</span>
            </li>
            <li>
              <a href={`tel:${settings.phone.replace(/\D/g, '')}`} className="flex gap-3 hover:text-gold-300">
                <Phone className="mt-0.5 size-4 shrink-0 text-gold-400" />
                {settings.phone}
              </a>
            </li>
            <li>
              <a
                href={whatsappLink(settings.whatsapp, 'Assalamu Alaikum')}
                target="_blank"
                rel="noreferrer"
                className="flex gap-3 hover:text-gold-300"
              >
                <MessageCircle className="mt-0.5 size-4 shrink-0 text-gold-400" />
                WhatsApp: +{settings.whatsapp}
              </a>
            </li>
            <li>
              <a href={`mailto:${settings.email}`} className="flex gap-3 hover:text-gold-300">
                <Mail className="mt-0.5 size-4 shrink-0 text-gold-400" />
                {settings.email}
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="container-x">
        <OrnamentDivider />
      </div>
      <div className="container-x flex flex-col items-center justify-between gap-4 py-6 text-xs text-brand-100/70 md:flex-row">
        <div className="flex flex-wrap items-center justify-center gap-2">
          <span className="mr-1">We accept:</span>
          {['Cash on Delivery', 'JazzCash', 'EasyPaisa', 'Bank Transfer'].map((m) => (
            <span key={m} className="rounded-md border border-white/15 bg-white/5 px-2.5 py-1 font-semibold text-white/90">
              {m}
            </span>
          ))}
        </div>
        <p>
          © {year} {settings.storeName}. All rights reserved.
          <Link to="/admin" className="ml-3 text-brand-100/40 hover:text-gold-300">
            Admin
          </Link>
        </p>
      </div>
    </footer>
  );
}
