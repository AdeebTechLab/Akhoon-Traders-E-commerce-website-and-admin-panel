import { MessageCircle } from 'lucide-react';
import { Outlet } from 'react-router-dom';
import { useStore } from '../../context/StoreContext';
import { whatsappLink } from '../../utils/format';
import { Footer } from './Footer';
import { Header } from './Header';

export function StoreLayout() {
  const { settings } = useStore();
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <a
        href={whatsappLink(settings.whatsapp, 'Assalamu Alaikum, I have a question about an order.')}
        target="_blank"
        rel="noreferrer"
        className="fixed right-5 bottom-5 z-30 flex size-14 items-center justify-center rounded-full bg-[#25d366] text-white shadow-lg ring-4 ring-white transition hover:scale-105"
        aria-label="Chat on WhatsApp"
      >
        <MessageCircle className="size-7" />
      </a>
    </div>
  );
}
