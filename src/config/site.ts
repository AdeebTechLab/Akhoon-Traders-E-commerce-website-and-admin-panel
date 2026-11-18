import type { Category, StoreSettings } from '../types';

/**
 * Default store details. Everything here can also be changed later from
 * Admin → Settings (saved in the browser until a backend is connected).
 * Replace the placeholder phone numbers, email and address with the client's real ones.
 */
export const DEFAULT_SETTINGS: StoreSettings = {
  storeName: 'Akhoon Traders',
  storeNameUrdu: 'آخون ٹریڈرز',
  tagline: 'Islamic Books & Sunnah Oils',
  taglineUrdu: 'اسلامی کتب و سنت تیل',
  phone: '0300-1234567',
  whatsapp: '923001234567',
  email: 'info@akhoontraders.pk',
  address: 'Shop No. 12, Urdu Bazaar, Karachi, Pakistan',
  addressUrdu: 'دکان نمبر ۱۲، اردو بازار، کراچی',
  deliveryCharge: 250,
  freeDeliveryOver: 5000,
  jazzcashNumber: '0300-1234567',
  easypaisaNumber: '0345-1234567',
  accountTitle: 'Akhoon Traders',
  bankDetails: 'Meezan Bank — A/C 0000-0000000000 — IBAN PK00MEZN0000000000000000',
  announcement: 'Free delivery on orders above Rs. 5,000 — Cash on Delivery all over Pakistan',
};

/**
 * Admin login (frontend only — replace with real auth from the backend).
 * The password is never stored in the source: set these in `.env.local`
 * (see `.env.example`). Only a salted PBKDF2 hash ends up in the bundle.
 * If they are missing, admin login is disabled.
 */
export const ADMIN_CONFIG = {
  email: ((import.meta.env.VITE_ADMIN_EMAIL as string | undefined) ?? '').trim().toLowerCase(),
  /** format: <salt-hex>:<pbkdf2-sha256-hash-hex> */
  passwordHash: ((import.meta.env.VITE_ADMIN_PASSWORD_HASH as string | undefined) ?? '').trim(),
  name: (import.meta.env.VITE_ADMIN_NAME as string | undefined) || 'Admin',
};

/** Admin session lifetime and login lockout policy. */
export const ADMIN_SESSION_MS = 8 * 60 * 60 * 1000; // 8 hours
export const LOGIN_MAX_ATTEMPTS = 5;
export const LOGIN_LOCKOUT_MS = 5 * 60 * 1000; // 5 minutes

export const CATEGORY_INFO: Record<Category, { label: string; urdu: string; subcategories: { name: string; urdu: string }[] }> = {
  books: {
    label: 'Islamic Books',
    urdu: 'اسلامی کتب',
    subcategories: [
      { name: 'Quran', urdu: 'قرآن مجید' },
      { name: 'Tafseer', urdu: 'تفسیر' },
      { name: 'Hadith', urdu: 'حدیث' },
      { name: 'Fiqh', urdu: 'فقہ و مسائل' },
      { name: 'Seerat & History', urdu: 'سیرت و تاریخ' },
      { name: 'Islahi', urdu: 'اصلاحی کتب' },
      { name: 'Duas & Azkar', urdu: 'دعائیں و اذکار' },
      { name: 'Children', urdu: 'بچوں کی کتب' },
    ],
  },
  oils: {
    label: 'Sunnah & Ruqyah Oils',
    urdu: 'سنت و دم شدہ تیل',
    subcategories: [
      { name: 'Ruqyah Oils', urdu: 'دم شدہ تیل' },
      { name: 'Sunnah Oils', urdu: 'سنت تیل' },
      { name: 'Herbal Oils', urdu: 'جڑی بوٹیوں کا تیل' },
    ],
  },
};

export const subcategoryUrdu = (name: string): string => {
  for (const cat of Object.values(CATEGORY_INFO)) {
    const found = cat.subcategories.find((s) => s.name === name);
    if (found) return found.urdu;
  }
  return '';
};

export const PAKISTAN_CITIES = [
  'Karachi',
  'Lahore',
  'Islamabad',
  'Rawalpindi',
  'Faisalabad',
  'Multan',
  'Peshawar',
  'Quetta',
  'Hyderabad',
  'Gujranwala',
  'Sialkot',
  'Bahawalpur',
  'Bahawalnagar',
  'Sargodha',
  'Sukkur',
  'Larkana',
  'Abbottabad',
  'Mardan',
  'Swat',
  'Dera Ismail Khan',
  'Rahim Yar Khan',
  'Sahiwal',
  'Gujrat',
  'Jhelum',
  'Mirpur (AJK)',
  'Muzaffarabad',
  'Gilgit',
  'Skardu',
  'Other',
];

export const BOOK_COLORS = ['#01411c', '#6b1d2a', '#13294b', '#4a2c17', '#0f4c4c', '#1c1c1c', '#3d2a5c', '#7a4a12'];
export const OIL_COLORS = ['#a9b836', '#2b2118', '#c99a2e', '#d8b46a', '#5d7a1f', '#8a5a1c'];
