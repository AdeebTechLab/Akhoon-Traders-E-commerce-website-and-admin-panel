import { createContext, useCallback, useContext, useMemo, type ReactNode } from 'react';
import { DEFAULT_SETTINGS } from '../config/site';
import { SEED_PRODUCTS } from '../data/products';
import { generateSeedMessages, generateSeedOrders } from '../data/seedOrders';
import { clearStorage, useLocalStorage } from '../hooks/useLocalStorage';
import type {
  CartItem,
  ContactMessage,
  Customer,
  Order,
  OrderStatus,
  PaymentMethod,
  Product,
  StoreSettings,
} from '../types';
import { effectivePrice, uid } from '../utils/format';

export interface PlaceOrderInput {
  customer: Customer;
  items: CartItem[];
  paymentMethod: PaymentMethod;
  transactionId?: string;
  notes?: string;
}

interface StoreContextValue {
  products: Product[];
  orders: Order[];
  messages: ContactMessage[];
  settings: StoreSettings;
  getProduct: (idOrSlug: string) => Product | undefined;
  addProduct: (p: Omit<Product, 'id' | 'createdAt'>) => Product;
  updateProduct: (id: string, patch: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  deliveryFor: (subtotal: number) => number;
  placeOrder: (input: PlaceOrderInput) => Order;
  updateOrderStatus: (id: string, status: OrderStatus) => void;
  addMessage: (m: Omit<ContactMessage, 'id' | 'read' | 'createdAt'>) => void;
  setMessageRead: (id: string, read: boolean) => void;
  deleteMessage: (id: string) => void;
  updateSettings: (patch: Partial<StoreSettings>) => void;
  resetDemoData: () => void;
}

const StoreContext = createContext<StoreContextValue | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useLocalStorage<Product[]>('products', SEED_PRODUCTS);
  const [settings, setSettings] = useLocalStorage<StoreSettings>('settings', DEFAULT_SETTINGS);
  const [orders, setOrders] = useLocalStorage<Order[]>('orders', () =>
    generateSeedOrders(SEED_PRODUCTS, DEFAULT_SETTINGS.deliveryCharge, DEFAULT_SETTINGS.freeDeliveryOver),
  );
  const [messages, setMessages] = useLocalStorage<ContactMessage[]>('messages', generateSeedMessages);

  const getProduct = useCallback(
    (idOrSlug: string) => products.find((p) => p.id === idOrSlug || p.slug === idOrSlug),
    [products],
  );

  const addProduct = useCallback(
    (p: Omit<Product, 'id' | 'createdAt'>) => {
      const product: Product = { ...p, id: uid('p-'), createdAt: new Date().toISOString() };
      setProducts((prev) => [product, ...prev]);
      return product;
    },
    [setProducts],
  );

  const updateProduct = useCallback(
    (id: string, patch: Partial<Product>) =>
      setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, ...patch } : p))),
    [setProducts],
  );

  const deleteProduct = useCallback(
    (id: string) => setProducts((prev) => prev.filter((p) => p.id !== id)),
    [setProducts],
  );

  const deliveryFor = useCallback(
    (subtotal: number) => (subtotal === 0 || subtotal >= settings.freeDeliveryOver ? 0 : settings.deliveryCharge),
    [settings.deliveryCharge, settings.freeDeliveryOver],
  );

  const placeOrder = useCallback(
    (input: PlaceOrderInput): Order => {
      const items = input.items
        .map((ci) => {
          const p = products.find((x) => x.id === ci.productId);
          if (!p) return null;
          return {
            productId: p.id,
            name: p.name,
            nameUrdu: p.nameUrdu,
            price: effectivePrice(p),
            quantity: Math.min(ci.quantity, p.stock),
          };
        })
        .filter((x): x is NonNullable<typeof x> => x !== null && x.quantity > 0);

      const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);
      const delivery = deliveryFor(subtotal);
      const lastNumber = orders.reduce((max, o) => Math.max(max, Number(o.id.replace(/\D/g, '')) || 0), 10230);
      const now = new Date().toISOString();

      const order: Order = {
        id: `AT-${lastNumber + 1}`,
        customer: input.customer,
        items,
        subtotal,
        delivery,
        total: subtotal + delivery,
        paymentMethod: input.paymentMethod,
        transactionId: input.transactionId || undefined,
        notes: input.notes || undefined,
        status: 'Pending',
        createdAt: now,
        updatedAt: now,
      };

      setOrders((prev) => [order, ...prev]);
      // reduce stock for the ordered items
      setProducts((prev) =>
        prev.map((p) => {
          const line = items.find((i) => i.productId === p.id);
          return line ? { ...p, stock: Math.max(0, p.stock - line.quantity) } : p;
        }),
      );
      return order;
    },
    [products, orders, deliveryFor, setOrders, setProducts],
  );

  const updateOrderStatus = useCallback(
    (id: string, status: OrderStatus) => {
      const order = orders.find((o) => o.id === id);
      if (!order || order.status === status) return;
      // put stock back when an order is cancelled (and take it again if it is re-opened)
      if (status === 'Cancelled' || order.status === 'Cancelled') {
        const sign = status === 'Cancelled' ? 1 : -1;
        setProducts((ps) =>
          ps.map((p) => {
            const line = order.items.find((i) => i.productId === p.id);
            return line ? { ...p, stock: Math.max(0, p.stock + sign * line.quantity) } : p;
          }),
        );
      }
      const updatedAt = new Date().toISOString();
      setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status, updatedAt } : o)));
    },
    [orders, setOrders, setProducts],
  );

  const addMessage = useCallback(
    (m: Omit<ContactMessage, 'id' | 'read' | 'createdAt'>) =>
      setMessages((prev) => [{ ...m, id: uid('m-'), read: false, createdAt: new Date().toISOString() }, ...prev]),
    [setMessages],
  );

  const setMessageRead = useCallback(
    (id: string, read: boolean) => setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, read } : m))),
    [setMessages],
  );

  const deleteMessage = useCallback(
    (id: string) => setMessages((prev) => prev.filter((m) => m.id !== id)),
    [setMessages],
  );

  const updateSettings = useCallback(
    (patch: Partial<StoreSettings>) => setSettings((prev) => ({ ...prev, ...patch })),
    [setSettings],
  );

  const resetDemoData = useCallback(() => {
    clearStorage(['products', 'orders', 'messages', 'settings', 'cart']);
    setProducts(SEED_PRODUCTS);
    setSettings(DEFAULT_SETTINGS);
    setOrders(generateSeedOrders(SEED_PRODUCTS, DEFAULT_SETTINGS.deliveryCharge, DEFAULT_SETTINGS.freeDeliveryOver));
    setMessages(generateSeedMessages());
  }, [setProducts, setSettings, setOrders, setMessages]);

  const value = useMemo<StoreContextValue>(
    () => ({
      products,
      orders,
      messages,
      settings,
      getProduct,
      addProduct,
      updateProduct,
      deleteProduct,
      deliveryFor,
      placeOrder,
      updateOrderStatus,
      addMessage,
      setMessageRead,
      deleteMessage,
      updateSettings,
      resetDemoData,
    }),
    [
      products,
      orders,
      messages,
      settings,
      getProduct,
      addProduct,
      updateProduct,
      deleteProduct,
      deliveryFor,
      placeOrder,
      updateOrderStatus,
      addMessage,
      setMessageRead,
      deleteMessage,
      updateSettings,
      resetDemoData,
    ],
  );

  return <StoreContext value={value}>{children}</StoreContext>;
}

export function useStore(): StoreContextValue {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used inside <StoreProvider>');
  return ctx;
}
