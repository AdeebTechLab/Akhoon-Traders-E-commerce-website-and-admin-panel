import { createContext, useCallback, useContext, useMemo, type ReactNode } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import type { CartItem, Product } from '../types';
import { effectivePrice } from '../utils/format';
import { useStore } from './StoreContext';

export interface CartLine extends CartItem {
  product: Product;
  lineTotal: number;
}

interface CartContextValue {
  items: CartItem[];
  lines: CartLine[];
  count: number;
  subtotal: number;
  delivery: number;
  total: number;
  add: (productId: string, quantity?: number) => void;
  setQuantity: (productId: string, quantity: number) => void;
  remove: (productId: string) => void;
  clear: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const { products, deliveryFor } = useStore();
  const [items, setItems] = useLocalStorage<CartItem[]>('cart', []);

  const stockOf = useCallback((id: string) => products.find((p) => p.id === id)?.stock ?? 0, [products]);

  const add = useCallback(
    (productId: string, quantity = 1) =>
      setItems((prev) => {
        const max = stockOf(productId);
        const existing = prev.find((i) => i.productId === productId);
        if (existing) {
          return prev.map((i) =>
            i.productId === productId ? { ...i, quantity: Math.min(max, i.quantity + quantity) } : i,
          );
        }
        return max > 0 ? [...prev, { productId, quantity: Math.min(max, quantity) }] : prev;
      }),
    [setItems, stockOf],
  );

  const setQuantity = useCallback(
    (productId: string, quantity: number) =>
      setItems((prev) =>
        quantity <= 0
          ? prev.filter((i) => i.productId !== productId)
          : prev.map((i) => (i.productId === productId ? { ...i, quantity: Math.min(stockOf(productId), quantity) } : i)),
      ),
    [setItems, stockOf],
  );

  const remove = useCallback(
    (productId: string) => setItems((prev) => prev.filter((i) => i.productId !== productId)),
    [setItems],
  );

  const clear = useCallback(() => setItems([]), [setItems]);

  const value = useMemo<CartContextValue>(() => {
    const lines: CartLine[] = items
      .map((i) => {
        const product = products.find((p) => p.id === i.productId);
        return product ? { ...i, product, lineTotal: effectivePrice(product) * i.quantity } : null;
      })
      .filter((x): x is CartLine => x !== null);
    const subtotal = lines.reduce((s, l) => s + l.lineTotal, 0);
    const delivery = deliveryFor(subtotal);
    return {
      items,
      lines,
      count: lines.reduce((s, l) => s + l.quantity, 0),
      subtotal,
      delivery,
      total: subtotal + delivery,
      add,
      setQuantity,
      remove,
      clear,
    };
  }, [items, products, deliveryFor, add, setQuantity, remove, clear]);

  return <CartContext value={value}>{children}</CartContext>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside <CartProvider>');
  return ctx;
}
