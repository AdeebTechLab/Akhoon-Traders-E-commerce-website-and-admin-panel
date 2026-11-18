# Akhoon Traders — آخون ٹریڈرز

E-commerce frontend for **Akhoon Traders**, a Pakistani store selling **Islamic books** and **Sunnah & Ruqyah oils**.
Built with **React 19 + TypeScript + Vite + Tailwind CSS v4**.

The store name appears in English on one side of the header and in Urdu (Nastaliq) on the other.
The design uses Pakistani green, white and gold, Islamic geometric patterns, Urdu labels throughout,
PKR pricing, Cash on Delivery, JazzCash/EasyPaisa/bank payments and WhatsApp ordering.

---

## Getting started

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # type-check + production build into dist/
npm run preview    # serve the production build
```

### Admin panel

Open **`/admin`** (there's also a small "Admin" link in the footer).

Admin login is set with environment variables. No password is stored in the source code.

1. Copy `.env.example` to `.env.local`.
2. Run `node scripts/hash-admin-password.mjs "your-strong-password"` and paste the printed `VITE_ADMIN_PASSWORD_HASH=...` line into `.env.local`.
3. Restart `npm run dev`. On Vercel, add the same variables under **Project → Settings → Environment Variables**.

Sessions expire after 8 hours. Five wrong passwords lock the login for 5 minutes.

> This is still a frontend-only login: anyone who controls the browser can bypass it, and all store data lives in localStorage. Replace it with server-side authentication when the backend is ready.

---

## Features

**Storefront**
- Home: hero with Bismillah, bilingual headings, category tiles, featured books, Sunnah oils section with ahadith, new arrivals, bulk-order (madaris/masajid) WhatsApp CTA
- Shop with filters (category, book/oil type, price range, in-stock), search (English or Urdu), sorting
- Product page with Urdu + English details, quantity, Add to Cart, Buy Now and **Order on WhatsApp**
- Cart with free-delivery progress
- Checkout with Pakistani phone validation, city list, and payment methods: **COD, JazzCash, EasyPaisa, Bank Transfer** (transaction ID required for online payments)
- Order confirmation page and **Track Order** (order number + mobile number)
- About and Contact (contact messages appear in the admin panel)
- Floating WhatsApp button, mobile menu, responsive on all screen sizes
- Product images are optional: if a product has no photo, a styled **book cover** or **oil bottle** is drawn automatically with the Urdu title

**Admin panel**
- Dashboard: revenue, orders, pending orders, stock alerts, 7-day sales chart, orders by status, recent orders, top sellers, low stock
- Products: search/filter, add, edit, delete, mark as featured, upload a photo or paste an image URL, live preview
- Orders: filter by status, search, order details, change status (cancelling returns stock), print invoice, WhatsApp/call customer
- Customers: built automatically from orders, with total spent
- Messages: contact-form inbox with read/unread, reply on WhatsApp
- Settings: store name (English & Urdu), phone, WhatsApp, email, address, delivery charges, free-delivery limit, JazzCash/EasyPaisa/bank details, announcement bar; reset demo data

---

## Project structure

```
src/
  admin/                 Admin panel (layout, pages, small UI pieces)
  components/            Shared components (header, footer, product card, cover/bottle art…)
  config/site.ts         ← Store details, admin login, categories, Pakistani cities
  context/               StoreContext (products/orders/messages/settings), Cart, Auth, Toasts
  data/products.ts       ← Starter catalogue (books & oils, PKR prices)
  data/seedOrders.ts     Demo orders & messages for the dashboard
  hooks/useLocalStorage  Persistence helper
  pages/                 Storefront pages
  types/                 TypeScript types (Product, Order, …)
  utils/format.ts        PKR formatting, phone validation, WhatsApp links
```

### Things to replace before going live
- Phone, WhatsApp, email, address and bank/JazzCash/EasyPaisa details in `src/config/site.ts`
  (or from **Admin → Settings**). The current values are placeholders.
- Product list and prices in `src/data/products.ts` (or manage from **Admin → Products**). Prices are sample values.
- Admin credentials in `.env.local` (see `.env.example`).

---

## Connecting a backend

Right now all data is saved in the browser's `localStorage`, so the site works fully without a server.
Every read/write goes through **`src/context/StoreContext.tsx`**, so connecting an API only means
replacing the functions there:

| Function in StoreContext | Suggested endpoint            |
| ------------------------ | ----------------------------- |
| `products` (load)        | `GET /api/products`           |
| `addProduct`             | `POST /api/products`          |
| `updateProduct`          | `PUT /api/products/:id`       |
| `deleteProduct`          | `DELETE /api/products/:id`    |
| `placeOrder`             | `POST /api/orders`            |
| `orders` (load)          | `GET /api/orders` (admin)     |
| `updateOrderStatus`      | `PATCH /api/orders/:id`       |
| `addMessage`             | `POST /api/messages`          |
| `settings` / `updateSettings` | `GET/PUT /api/settings`  |

Auth lives in `src/context/AuthContext.tsx` — swap `login` for an API call that returns a token.

---

## Deployment

The app uses clean URLs (`/shop`, `/admin`), so the host must send every path to `index.html`.
`public/_redirects` (Netlify) and `vercel.json` (Vercel) are included for that.

If the host can't do rewrites (e.g. some shared hosting), build with hash URLs instead:

```bash
VITE_ROUTER=hash npm run build
```

Fonts (Noto Nastaliq Urdu, Cormorant Garamond, DM Sans) are bundled locally via `@fontsource`, so no
external font requests are made.
