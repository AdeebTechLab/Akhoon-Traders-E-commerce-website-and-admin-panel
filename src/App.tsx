import { useEffect } from 'react';
import { BrowserRouter, HashRouter, MemoryRouter, Route, Routes, useLocation, useParams } from 'react-router-dom';
import { AdminLayout } from './admin/AdminLayout';
import { AdminCustomers } from './admin/pages/Customers';
import { Dashboard } from './admin/pages/Dashboard';
import { AdminLogin } from './admin/pages/Login';
import { AdminMessages } from './admin/pages/Messages';
import { AdminOrderDetail } from './admin/pages/OrderDetail';
import { AdminOrders } from './admin/pages/Orders';
import { ProductForm } from './admin/pages/ProductForm';
import { AdminProducts } from './admin/pages/Products';
import { AdminSettings } from './admin/pages/Settings';
import { StoreLayout } from './components/layout/StoreLayout';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { StoreProvider } from './context/StoreContext';
import { ToastProvider } from './context/ToastContext';
import { About } from './pages/About';
import { Cart } from './pages/Cart';
import { Checkout } from './pages/Checkout';
import { Contact } from './pages/Contact';
import { Home } from './pages/Home';
import { NotFound } from './pages/NotFound';
import { OrderSuccess } from './pages/OrderSuccess';
import { ProductDetail } from './pages/ProductDetail';
import { Shop } from './pages/Shop';
import { TrackOrder } from './pages/TrackOrder';

/**
 * BrowserRouter gives clean URLs (/shop, /admin). Static hosts that can't
 * rewrite every path to index.html can build with VITE_ROUTER=hash.
 * (VITE_ROUTER=memory is only used for embedded previews.)
 */
const ROUTER_MODE = import.meta.env.VITE_ROUTER as string | undefined;
const Router = ROUTER_MODE === 'hash' ? HashRouter : ROUTER_MODE === 'memory' ? MemoryRouter : BrowserRouter;

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

/** Remount the form when switching between products so it loads fresh values. */
function EditProductRoute() {
  const { id } = useParams();
  return <ProductForm key={id} />;
}

export default function App() {
  return (
    <Router>
      <ToastProvider>
        <StoreProvider>
          <CartProvider>
            <AuthProvider>
              <ScrollToTop />
              <Routes>
                <Route element={<StoreLayout />}>
                  <Route index element={<Home />} />
                  <Route path="shop" element={<Shop />} />
                  <Route path="product/:slug" element={<ProductDetail />} />
                  <Route path="cart" element={<Cart />} />
                  <Route path="checkout" element={<Checkout />} />
                  <Route path="order-success/:id" element={<OrderSuccess />} />
                  <Route path="track-order" element={<TrackOrder />} />
                  <Route path="about" element={<About />} />
                  <Route path="contact" element={<Contact />} />
                  <Route path="*" element={<NotFound />} />
                </Route>

                <Route path="admin/login" element={<AdminLogin />} />
                <Route path="admin" element={<AdminLayout />}>
                  <Route index element={<Dashboard />} />
                  <Route path="products" element={<AdminProducts />} />
                  <Route path="products/new" element={<ProductForm key="new" />} />
                  <Route path="products/:id/edit" element={<EditProductRoute />} />
                  <Route path="orders" element={<AdminOrders />} />
                  <Route path="orders/:id" element={<AdminOrderDetail />} />
                  <Route path="customers" element={<AdminCustomers />} />
                  <Route path="messages" element={<AdminMessages />} />
                  <Route path="settings" element={<AdminSettings />} />
                </Route>
              </Routes>
            </AuthProvider>
          </CartProvider>
        </StoreProvider>
      </ToastProvider>
    </Router>
  );
}
