import {
  ClipboardList,
  ExternalLink,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageSquare,
  Package,
  Settings,
  Users,
  X,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, Navigate, NavLink, Outlet, useLocation } from 'react-router-dom';
import { Emblem } from '../components/ui/Ornament';
import { useAuth } from '../context/AuthContext';
import { useStore } from '../context/StoreContext';

export function AdminLayout() {
  const { isAdmin, logout, adminName } = useAuth();
  const { orders, messages, products, settings } = useStore();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  if (!isAdmin) return <Navigate to="/admin/login" replace state={{ from: location.pathname }} />;

  const pending = orders.filter((o) => o.status === 'Pending').length;
  const unread = messages.filter((m) => !m.read).length;
  const lowStock = products.filter((p) => p.stock <= 5).length;

  const links = [
    { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
    { to: '/admin/products', label: 'Products', icon: Package, badge: lowStock, badgeTone: 'bg-amber-500' },
    { to: '/admin/orders', label: 'Orders', icon: ClipboardList, badge: pending, badgeTone: 'bg-gold-400 text-brand-950' },
    { to: '/admin/customers', label: 'Customers', icon: Users },
    { to: '/admin/messages', label: 'Messages', icon: MessageSquare, badge: unread, badgeTone: 'bg-red-500' },
    { to: '/admin/settings', label: 'Settings', icon: Settings },
  ];

  const sidebar = (
    <div className="bg-pattern-dark flex h-full flex-col bg-brand-900 text-brand-100">
      <Link to="/admin" className="flex items-center gap-3 border-b border-white/10 px-5 py-5">
        <Emblem className="size-10" />
        <div>
          <p className="font-display text-xl leading-none font-bold text-white">{settings.storeName}</p>
          <p lang="ur" className="font-urdu text-sm text-gold-300" style={{ lineHeight: 1.8 }}>
            ایڈمن پینل
          </p>
        </div>
      </Link>
      <nav className="flex-1 space-y-1 p-3">
        {links.map(({ to, label, icon: Icon, end, badge, badgeTone }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                isActive ? 'bg-white/10 text-gold-300' : 'text-brand-100/80 hover:bg-white/5 hover:text-white'
              }`
            }
          >
            <Icon className="size-5" />
            <span className="flex-1">{label}</span>
            {!!badge && (
              <span className={`min-w-5 rounded-full px-1.5 text-center text-[11px] font-bold text-white ${badgeTone}`}>
                {badge}
              </span>
            )}
          </NavLink>
        ))}
      </nav>
      <div className="space-y-1 border-t border-white/10 p-3">
        <Link to="/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-brand-100/80 hover:bg-white/5 hover:text-white">
          <ExternalLink className="size-5" /> View Store
        </Link>
        <button
          onClick={logout}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-brand-100/80 hover:bg-white/5 hover:text-white"
        >
          <LogOut className="size-5" /> Logout
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-stone-100">
      <aside className="no-print fixed inset-y-0 left-0 hidden w-64 lg:block">{sidebar}</aside>
      {open && (
        <div className="no-print fixed inset-0 z-50 bg-black/40 lg:hidden" onClick={() => setOpen(false)}>
          <div className="h-full w-64" onClick={(e) => e.stopPropagation()}>
            {sidebar}
          </div>
        </div>
      )}

      <div className="lg:pl-64">
        <header className="no-print sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-stone-200 bg-white/90 px-4 backdrop-blur sm:px-6">
          <button className="flex size-9 items-center justify-center rounded-lg hover:bg-stone-100 lg:hidden" onClick={() => setOpen(!open)} aria-label="Menu">
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
          <p className="text-sm text-stone-500">
            Assalamu Alaikum, <span className="font-semibold text-stone-800">{adminName}</span>
          </p>
          <div className="ml-auto flex size-9 items-center justify-center rounded-full bg-brand-800 text-sm font-bold text-gold-300">
            {adminName.charAt(0)}
          </div>
        </header>
        <main className="p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
