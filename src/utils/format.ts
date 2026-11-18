import type { Product } from '../types';

export const formatPKR = (amount: number): string => `Rs. ${Math.round(amount).toLocaleString('en-PK')}`;

export const formatDate = (iso: string): string =>
  new Date(iso).toLocaleDateString('en-PK', { day: 'numeric', month: 'short', year: 'numeric' });

export const formatDateTime = (iso: string): string =>
  new Date(iso).toLocaleString('en-PK', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });

export const effectivePrice = (p: Pick<Product, 'price' | 'salePrice'>): number =>
  p.salePrice && p.salePrice > 0 && p.salePrice < p.price ? p.salePrice : p.price;

export const discountPercent = (p: Pick<Product, 'price' | 'salePrice'>): number =>
  p.salePrice && p.salePrice < p.price ? Math.round(((p.price - p.salePrice) / p.price) * 100) : 0;

export const slugify = (text: string): string =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');

/** Pakistani mobile: 03XXXXXXXXX, with or without dash, or +92 / 92 prefix */
export const isValidPakPhone = (phone: string): boolean => /^(\+?92|0)3\d{2}-?\d{7}$/.test(phone.replace(/\s/g, ''));

export const whatsappLink = (number: string, text: string): string =>
  `https://wa.me/${number.replace(/\D/g, '')}?text=${encodeURIComponent(text)}`;

export const uid = (prefix = ''): string => `${prefix}${Date.now().toString(36)}${Math.random().toString(36).slice(2, 7)}`;
