import { Menu, MessageCircle, Phone, Search, ShoppingCart, Truck, X } from 'lucide-react';
import { useEffect, useState, type FormEvent } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useStore } from '../../context/StoreContext';
import { whatsappLink } from '../../utils/format';
import { Emblem } from '../ui/Ornament';

const NAV = [
  { to: '/', label: 'Home', urdu: 'ہوم' },
  { to: '/shop', label: 'Shop All', urdu: 'تمام مصنوعات' },
  { to: '/shop?category=books', label: 'Books', urdu: 'کتب' },
  { to: '/shop?category=oils', label: 'Oils', urdu: 'تیل' },
  { to: '/track-order', label: 'Track Order', urdu: 'آرڈر ٹریک' },
  { to: '/about', label: 'About', urdu: 'ہمارے بارے میں' },
  { to: '/contact', label: 'Contact', urdu: 'رابطہ' },
];

export function Header() {
  const { settings } = useStore();
  const { count } = useCart();
  const location = useLocation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [query, setQuery] = useState('');

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname, location.search]);

  const isActive = (to: string) => {
    const [path, search] = to.split('?');
    if (search) return location.pathname === path && location.search === `?${search}`;
    if (path === '/shop') return location.pathname === '/shop' && !location.search.includes('category=');
    return location.pathname === path;
  };

  const onSearch = (e: FormEvent) => {
    e.preventDefault();
    navigate(query.trim() ? `/shop?q=${encodeURIComponent(query.trim())}` : '/shop');
  };

  return (
    <>
      <header>
        {/* Top strip */}
        <div className="bg-brand-950 text-[13px] text-brand-100">
          <div className="container-x flex h-9 items-center justify-between gap-4">
            <p className="flex min-w-0 items-center gap-2">
              <Truck className="size-4 shrink-0 text-gold-400" />
              <span className="truncate">{settings.announcement}</span>
            </p>
            <div className="hidden shrink-0 items-center gap-5 md:flex">
              <a href={`tel:${settings.phone.replace(/\D/g, '')}`} className="flex items-center gap-1.5 hover:text-gold-300">
                <Phone className="size-3.5" /> {settings.phone}
              </a>
              <a
                href={whatsappLink(settings.whatsapp, 'Assalamu Alaikum, I want to place an order.')}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 hover:text-gold-300"
              >
                <MessageCircle className="size-3.5" /> WhatsApp
              </a>
            </div>
          </div>
        </div>

        {/* Name row — English on one side, Urdu on the other */}
        <div className="bg-pattern-light border-b-2 border-gold-400 bg-white">
          <div className="container-x flex items-center justify-between gap-3 py-3 sm:grid sm:grid-cols-[1fr_auto_1fr] sm:py-4">
            <Link to="/" className="justify-self-start">
              <span className="block font-display text-[1.45rem] leading-none font-bold whitespace-nowrap text-brand-800 sm:text-4xl lg:text-[2.75rem]">
                {settings.storeName}
              </span>
              <span className="mt-1.5 hidden text-[10px] font-semibold tracking-[0.25em] text-gold-700 uppercase sm:block sm:text-xs">
                {settings.tagline}
              </span>
            </Link>
            <Link to="/" aria-label="Home" className="hidden sm:block">
              <Emblem className="size-14 lg:size-16" />
            </Link>
            <Link to="/" dir="rtl" lang="ur" className="justify-self-end text-right">
              <span
                className="block font-urdu text-[1.45rem] font-bold whitespace-nowrap text-brand-800 sm:text-4xl lg:text-[2.6rem]"
                style={{ lineHeight: 1.75 }}
              >
                {settings.storeNameUrdu}
              </span>
              <span className="mt-1 hidden font-urdu text-xs text-gold-700 sm:block sm:text-sm" style={{ lineHeight: 1.6 }}>
                {settings.taglineUrdu}
              </span>
            </Link>
          </div>
        </div>
      </header>

      {/* Green navigation bar (sticky) */}
      <nav className="sticky top-0 z-40 bg-brand-800 text-white shadow-md">
        <div className="container-x flex h-14 items-center gap-2">
          <button
            className="-ml-2 flex size-10 items-center justify-center rounded-lg hover:bg-white/10 lg:hidden"
            onClick={() => setMenuOpen((o) => !o)}
            aria-label="Menu"
            aria-expanded={menuOpen}
          >
            {menuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>

          <ul className="hidden h-full items-stretch lg:flex">
            {NAV.map((item) => (
              <li key={item.to}>
                <Link
                  to={item.to}
                  className={`flex h-full items-center border-b-[3px] px-3.5 text-sm font-medium transition xl:px-4 ${
                    isActive(item.to)
                      ? 'border-gold-400 text-gold-300'
                      : 'border-transparent text-white/90 hover:text-gold-300'
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>

          <form onSubmit={onSearch} className="ml-auto hidden md:block">
            <label className="relative block">
              <span className="sr-only">Search</span>
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search books, oils, authors…"
                className="h-9 w-56 rounded-full border border-white/20 bg-white/10 pr-10 pl-4 text-sm text-white placeholder:text-white/60 focus:border-gold-400 focus:bg-white/15 focus:outline-none xl:w-64"
              />
              <button type="submit" className="absolute top-1/2 right-1 flex size-7 -translate-y-1/2 items-center justify-center rounded-full text-white/80 hover:text-gold-300" aria-label="Search">
                <Search className="size-4" />
              </button>
            </label>
          </form>

          <Link
            to="/cart"
            className="relative ml-auto flex h-10 items-center gap-2 rounded-lg bg-gold-400 px-3 text-sm font-semibold text-brand-950 hover:bg-gold-300 md:ml-2"
          >
            <ShoppingCart className="size-5" />
            <span className="hidden sm:inline">Cart</span>
            {count > 0 && (
              <span className="absolute -top-1.5 -right-1.5 flex min-w-5 items-center justify-center rounded-full bg-red-600 px-1 text-[11px] font-bold text-white ring-2 ring-brand-800">
                {count}
              </span>
            )}
          </Link>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="border-t border-white/10 bg-brand-900 lg:hidden">
            <div className="container-x py-3">
              <form onSubmit={onSearch} className="mb-3 md:hidden">
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search books, oils, authors…"
                  className="h-10 w-full rounded-lg border border-white/20 bg-white/10 px-4 text-sm text-white placeholder:text-white/60 focus:border-gold-400 focus:outline-none"
                />
              </form>
              <ul className="grid gap-1">
                {NAV.map((item) => (
                  <li key={item.to}>
                    <Link
                      to={item.to}
                      className={`flex items-center justify-between rounded-lg px-3 py-2.5 text-sm ${
                        isActive(item.to) ? 'bg-white/10 text-gold-300' : 'text-white/90 hover:bg-white/5'
                      }`}
                    >
                      <span>{item.label}</span>
                      <span lang="ur" className="font-urdu text-xs text-white/60" style={{ lineHeight: 1.6 }}>
                        {item.urdu}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </nav>
    </>
  );
}
