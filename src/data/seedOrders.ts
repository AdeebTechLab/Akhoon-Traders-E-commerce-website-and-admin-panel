import type { ContactMessage, Order, OrderStatus, PaymentMethod, Product } from '../types';

/**
 * Demo orders & messages so the admin dashboard has something to show.
 * Dates are generated relative to "now" so the 7-day chart is always filled.
 */
const daysAgo = (days: number, hour = 11): string => {
  const d = new Date();
  d.setDate(d.getDate() - days);
  d.setHours(hour, (days * 17) % 60, 0, 0);
  return d.toISOString();
};

type SeedRow = {
  name: string;
  phone: string;
  city: string;
  address: string;
  items: [string, number][];
  payment: PaymentMethod;
  status: OrderStatus;
  days: number;
};

const ROWS: SeedRow[] = [
  { name: 'Muhammad Usman', phone: '0301-4567890', city: 'Lahore', address: 'House 45, Block C, Johar Town', items: [['b-013', 2], ['o-001', 1]], payment: 'COD', status: 'Pending', days: 0 },
  { name: 'Ayesha Siddiqa', phone: '0321-9876543', city: 'Karachi', address: 'Flat 7, Gulshan-e-Iqbal Block 13', items: [['b-008', 1], ['b-016', 2]], payment: 'EasyPaisa', status: 'Pending', days: 0 },
  { name: 'Hafiz Abdul Rehman', phone: '0333-1122334', city: 'Peshawar', address: 'Mohallah Jangi, Qissa Khwani', items: [['b-002', 1]], payment: 'Bank Transfer', status: 'Confirmed', days: 1 },
  { name: 'Bilal Ahmed', phone: '0345-6677889', city: 'Islamabad', address: 'Street 12, G-9/2', items: [['o-002', 2], ['o-004', 1]], payment: 'JazzCash', status: 'Confirmed', days: 1 },
  { name: 'Fatima Zahra', phone: '0300-2233445', city: 'Multan', address: 'Near Ghanta Ghar, Hussain Agahi', items: [['b-010', 1], ['b-015', 3]], payment: 'COD', status: 'Shipped', days: 2 },
  { name: 'Hamza Qureshi', phone: '0312-5566778', city: 'Rawalpindi', address: 'Satellite Town, Block B', items: [['b-005', 1]], payment: 'COD', status: 'Shipped', days: 3 },
  { name: 'Maryam Javed', phone: '0322-3344556', city: 'Faisalabad', address: 'Peoples Colony No. 1', items: [['o-001', 2], ['o-003', 1]], payment: 'COD', status: 'Delivered', days: 4 },
  { name: 'Qari Imran Ali', phone: '0346-7788990', city: 'Bahawalnagar', address: 'Madni Masjid Road', items: [['b-001', 3], ['b-017', 5]], payment: 'COD', status: 'Delivered', days: 5 },
  { name: 'Sana Tariq', phone: '0331-4455667', city: 'Hyderabad', address: 'Latifabad Unit 6', items: [['b-003', 1], ['o-005', 1]], payment: 'EasyPaisa', status: 'Delivered', days: 6 },
  { name: 'Zainab Noor', phone: '0302-8899001', city: 'Quetta', address: 'Jinnah Road, near Meezan Chowk', items: [['b-006', 1]], payment: 'COD', status: 'Cancelled', days: 6 },
  { name: 'Muhammad Usman', phone: '0301-4567890', city: 'Lahore', address: 'House 45, Block C, Johar Town', items: [['b-012', 1]], payment: 'COD', status: 'Delivered', days: 9 },
  { name: 'Abdullah Khan', phone: '0315-1239876', city: 'Mardan', address: 'Bank Road, Sheikh Maltoon Town', items: [['o-004', 2], ['b-018', 1]], payment: 'COD', status: 'Delivered', days: 12 },
];

export function generateSeedOrders(products: Product[], deliveryCharge: number, freeOver: number): Order[] {
  return ROWS.map((row, index) => {
    const items = row.items
      .map(([id, quantity]) => {
        const p = products.find((x) => x.id === id);
        if (!p) return null;
        return { productId: p.id, name: p.name, nameUrdu: p.nameUrdu, price: p.salePrice ?? p.price, quantity };
      })
      .filter((x): x is NonNullable<typeof x> => x !== null);
    const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);
    const delivery = subtotal >= freeOver ? 0 : deliveryCharge;
    const createdAt = daysAgo(row.days, 9 + (index % 9));
    return {
      id: `AT-${10230 + ROWS.length - index}`,
      customer: { name: row.name, phone: row.phone, city: row.city, address: row.address },
      items,
      subtotal,
      delivery,
      total: subtotal + delivery,
      paymentMethod: row.payment,
      transactionId: row.payment === 'COD' ? undefined : `TX${(784512 + index * 7919).toString()}`,
      status: row.status,
      createdAt,
      updatedAt: createdAt,
    };
  });
}

export function generateSeedMessages(): ContactMessage[] {
  return [
    {
      id: 'm-1',
      name: 'Rashid Mehmood',
      phone: '0300-7654321',
      subject: 'Bulk order for madrasa',
      message: 'Assalamu Alaikum, we need 40 copies of 15-line Hafizi Quran for our madrasa in Sargodha. Is there a discount on bulk orders?',
      read: false,
      createdAt: daysAgo(0, 10),
    },
    {
      id: 'm-2',
      name: 'Nadia Pervaiz',
      phone: '0323-1112223',
      email: 'nadia@example.com',
      subject: 'Ruqyah oil usage',
      message: 'How should the dam shuda zaitoon oil be used? Can it be used for children as well?',
      read: false,
      createdAt: daysAgo(1, 16),
    },
    {
      id: 'm-3',
      name: 'Kamran Shah',
      phone: '0334-9988776',
      subject: 'Delivery to Gilgit',
      message: 'Do you deliver to Gilgit, and how many days does it take?',
      read: true,
      createdAt: daysAgo(3, 13),
    },
  ];
}
