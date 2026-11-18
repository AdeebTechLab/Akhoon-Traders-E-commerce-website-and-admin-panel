export type Category = 'books' | 'oils';

export interface Product {
  id: string;
  slug: string;
  /** English name */
  name: string;
  /** Urdu name, shown in Nastaliq */
  nameUrdu: string;
  category: Category;
  /** e.g. "Tafseer", "Hadith", "Ruqyah Oils" */
  subcategory: string;
  /* ---- books ---- */
  author?: string;
  authorUrdu?: string;
  publisher?: string;
  language?: string;
  binding?: 'Hardcover' | 'Paperback';
  volumes?: number;
  pages?: number;
  /* ---- oils ---- */
  /** Bottle size, e.g. "100 ml" */
  size?: string;
  /* ---- common ---- */
  price: number;
  salePrice?: number;
  stock: number;
  description: string;
  descriptionUrdu?: string;
  /** Optional photo URL. When empty a styled cover / bottle is drawn instead. */
  image?: string;
  /** Colour used for the generated cover / bottle label */
  color: string;
  featured?: boolean;
  isNew?: boolean;
  createdAt: string;
}

export interface CartItem {
  productId: string;
  quantity: number;
}

export type OrderStatus = 'Pending' | 'Confirmed' | 'Shipped' | 'Delivered' | 'Cancelled';
export const ORDER_STATUSES: OrderStatus[] = ['Pending', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled'];

export type PaymentMethod = 'COD' | 'JazzCash' | 'EasyPaisa' | 'Bank Transfer';

export interface OrderItem {
  productId: string;
  name: string;
  nameUrdu: string;
  price: number;
  quantity: number;
}

export interface Customer {
  name: string;
  phone: string;
  email?: string;
  city: string;
  address: string;
}

export interface Order {
  /** e.g. AT-10245 */
  id: string;
  customer: Customer;
  items: OrderItem[];
  subtotal: number;
  delivery: number;
  total: number;
  paymentMethod: PaymentMethod;
  /** Transaction ID for JazzCash / EasyPaisa / bank payments */
  transactionId?: string;
  status: OrderStatus;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  phone: string;
  email?: string;
  subject: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export interface StoreSettings {
  storeName: string;
  storeNameUrdu: string;
  tagline: string;
  taglineUrdu: string;
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  addressUrdu: string;
  deliveryCharge: number;
  freeDeliveryOver: number;
  jazzcashNumber: string;
  easypaisaNumber: string;
  accountTitle: string;
  bankDetails: string;
  announcement: string;
}
