import { ArrowRight, BadgeCheck, BookOpen, Droplets, HandHeart, MessageCircle, ShieldCheck, Truck, Wallet } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ProductCard } from '../components/ProductCard';
import { ProductVisual } from '../components/ProductVisual';
import { OrnamentDivider, Star8 } from '../components/ui/Ornament';
import { SectionHeading } from '../components/ui/SectionHeading';
import { CATEGORY_INFO } from '../config/site';
import { useStore } from '../context/StoreContext';
import { whatsappLink } from '../utils/format';

const FEATURES = [
  { icon: Wallet, title: 'Cash on Delivery', urdu: 'کیش آن ڈیلیوری', text: 'Pay when you receive' },
  { icon: Truck, title: 'All Over Pakistan', urdu: 'پورے پاکستان میں', text: 'Delivery in 2–5 working days' },
  { icon: BadgeCheck, title: 'Authentic Editions', urdu: 'مستند ایڈیشن', text: 'From trusted publishers' },
  { icon: ShieldCheck, title: 'Pure & Dam Shuda', urdu: 'خالص و دم شدہ', text: 'Oils recited with Ruqyah' },
];

export function Home() {
  const { products, settings } = useStore();
  const books = products.filter((p) => p.category === 'books');
  const oils = products.filter((p) => p.category === 'oils');
  const featuredBooks = books.filter((p) => p.featured).slice(0, 8);
  const newArrivals = products.filter((p) => p.isNew).slice(0, 4);
  const heroItems = [books[1], books[12] ?? books[0], books[9] ?? books[2], oils[0]].filter(Boolean);

  return (
    <>
      {/* ---------------- HERO ---------------- */}
      <section className="bg-pattern-dark relative overflow-hidden bg-brand-900 text-white">
        <div className="pointer-events-none absolute -top-40 -right-40 size-[32rem] rounded-full bg-brand-600/30 blur-3xl" />
        <div className="container-x relative grid items-center gap-12 py-14 lg:grid-cols-[1.1fr_1fr] lg:py-20">
          <div>
            <p dir="rtl" lang="ar" className="text-left font-urdu text-2xl text-gold-300 sm:text-3xl" style={{ lineHeight: 2 }}>
              بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيْمِ
            </p>
            <h1 className="mt-4 font-display text-4xl leading-[1.05] font-bold sm:text-5xl lg:text-6xl">
              Authentic Islamic Books
              <span className="block text-gold-300">& Pure Sunnah Oils</span>
            </h1>
            <p dir="rtl" lang="ur" className="mt-4 text-left font-urdu text-xl text-brand-100 sm:text-2xl" style={{ lineHeight: 2.2 }}>
              مستند اسلامی کتب اور دم شدہ سنت تیل — اب گھر بیٹھے منگوائیں
            </p>
            <p className="mt-4 max-w-xl text-brand-100/80">
              Tafseer, Hadith, Fiqh, Seerat and Islahi books from Pakistan's leading publishers, along with zaitoon and
              kalonji oils recited with Ruqyah Shar'iyyah. Cash on Delivery to every city.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/shop?category=books" className="btn btn-gold px-6 py-3 text-base">
                <BookOpen className="size-5" /> Shop Books
              </Link>
              <Link to="/shop?category=oils" className="btn border border-white/30 px-6 py-3 text-base text-white hover:bg-white/10">
                <Droplets className="size-5" /> Shop Oils
              </Link>
            </div>
          </div>

          {/* product composition */}
          <div className="relative mx-auto aspect-[10/9] w-full max-w-[20rem] sm:max-w-md">
            <div className="absolute inset-x-8 bottom-0 h-10 rounded-[50%] bg-black/35 blur-xl" />
            {heroItems[0] && (
              <div className="absolute top-[9%] left-0 w-[40%] -rotate-[9deg] drop-shadow-2xl">
                <ProductVisual bare product={heroItems[0]} />
              </div>
            )}
            {heroItems[2] && (
              <div className="absolute top-[9%] right-0 w-[40%] rotate-[9deg] drop-shadow-2xl">
                <ProductVisual bare product={heroItems[2]} />
              </div>
            )}
            {heroItems[1] && (
              <div className="absolute top-0 left-1/2 w-[48%] -translate-x-1/2 drop-shadow-2xl">
                <ProductVisual bare product={heroItems[1]} />
              </div>
            )}
            {heroItems[3] && (
              <div className="absolute right-[4%] -bottom-[4%] w-[36%] drop-shadow-2xl">
                <ProductVisual bare product={heroItems[3]} />
              </div>
            )}
            <Star8 className="absolute top-[2%] left-[6%] size-5 text-gold-400/70" />
            <Star8 className="absolute right-[8%] bottom-[34%] size-3 text-gold-300/60" />
          </div>
        </div>
        <div className="h-1.5 bg-gradient-to-r from-gold-600 via-gold-300 to-gold-600" />
      </section>

      {/* ---------------- FEATURES ---------------- */}
      <section className="container-x relative z-10 -mt-1 pt-8">
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {FEATURES.map(({ icon: Icon, title, urdu, text }) => (
            <div key={title} className="card flex items-center gap-3 p-4 sm:gap-4 sm:p-5">
              <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-800 sm:size-12">
                <Icon className="size-5 sm:size-6" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-stone-900 sm:text-base">{title}</p>
                <p className="hidden text-xs text-stone-500 sm:block">{text}</p>
                <p lang="ur" className="font-urdu text-xs text-gold-700" style={{ lineHeight: 1.9 }}>
                  {urdu}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ---------------- CATEGORIES ---------------- */}
      <section className="container-x mt-16">
        <SectionHeading title="Shop by Category" urdu="زمرہ جات" />
        <div className="grid gap-5 md:grid-cols-2">
          {(['books', 'oils'] as const).map((cat) => {
            const info = CATEGORY_INFO[cat];
            const count = products.filter((p) => p.category === cat).length;
            return (
              <div
                key={cat}
                className={`bg-pattern-dark relative overflow-hidden rounded-3xl p-7 text-white sm:p-8 ${
                  cat === 'books' ? 'bg-brand-800' : 'bg-[#5a3d12]'
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold tracking-[0.2em] text-gold-300 uppercase">{count} products</p>
                    <h3 className="mt-1 font-display text-3xl font-bold">{info.label}</h3>
                  </div>
                  <p lang="ur" className="font-urdu text-2xl text-gold-300" style={{ lineHeight: 1.9 }}>
                    {info.urdu}
                  </p>
                </div>
                <div className="mt-5 flex flex-wrap gap-2">
                  {info.subcategories.map((s) => (
                    <Link
                      key={s.name}
                      to={`/shop?category=${cat}&sub=${encodeURIComponent(s.name)}`}
                      className="rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-medium hover:border-gold-400 hover:bg-white/15"
                    >
                      {s.name}
                    </Link>
                  ))}
                </div>
                <Link to={`/shop?category=${cat}`} className="btn btn-gold mt-6">
                  Browse {cat === 'books' ? 'Books' : 'Oils'} <ArrowRight className="size-4" />
                </Link>
                {cat === 'books' ? (
                  <BookOpen className="absolute -right-6 -bottom-8 size-40 text-white/[0.06]" />
                ) : (
                  <Droplets className="absolute -right-6 -bottom-8 size-40 text-white/[0.06]" />
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* ---------------- FEATURED BOOKS ---------------- */}
      <section className="container-x mt-16">
        <SectionHeading
          title="Featured Books"
          urdu="منتخب کتب"
          subtitle="Most loved titles in Pakistani homes and madaris"
          action={
            <Link to="/shop?category=books" className="flex items-center gap-1 text-sm font-semibold text-brand-800 hover:text-gold-700">
              View all <ArrowRight className="size-4" />
            </Link>
          }
        />
        <div className="grid grid-cols-2 gap-4 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
          {featuredBooks.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* ---------------- OILS ---------------- */}
      <section className="bg-pattern-dark mt-20 bg-brand-900 py-16 text-white">
        <div className="container-x">
          <SectionHeading
            light
            title="Sunnah & Ruqyah Oils"
            urdu="سنت و دم شدہ تیل"
            subtitle="Pure zaitoon and kalonji oils — recited with Quranic ayaat and masnoon duas"
          />
          <div className="mb-10 grid gap-4 md:grid-cols-2">
            <blockquote className="rounded-2xl border border-gold-400/30 bg-white/5 p-6">
              <p dir="rtl" lang="ur" className="font-urdu text-lg text-gold-200" style={{ lineHeight: 2.2 }}>
                ”زیتون کا تیل کھاؤ اور اسے لگاؤ، کیونکہ یہ مبارک درخت سے ہے۔“
              </p>
              <p className="mt-2 text-sm text-brand-100/80">
                “Eat olive oil and anoint yourselves with it, for it is from a blessed tree.”{' '}
                <span className="text-gold-300">— Jami' at-Tirmidhi</span>
              </p>
            </blockquote>
            <blockquote className="rounded-2xl border border-gold-400/30 bg-white/5 p-6">
              <p dir="rtl" lang="ur" className="font-urdu text-lg text-gold-200" style={{ lineHeight: 2.2 }}>
                ”اس کلونجی میں موت کے سوا ہر بیماری کی شفا ہے۔“
              </p>
              <p className="mt-2 text-sm text-brand-100/80">
                “In the black seed there is healing for every disease except death.”{' '}
                <span className="text-gold-300">— Sahih al-Bukhari</span>
              </p>
            </blockquote>
          </div>
          <div className="grid grid-cols-2 gap-4 text-stone-800 sm:gap-5 md:grid-cols-3">
            {oils.slice(0, 6).map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- NEW ARRIVALS ---------------- */}
      {newArrivals.length > 0 && (
        <section className="container-x mt-16">
          <SectionHeading title="New Arrivals" urdu="نئی آمد" />
          <div className="grid grid-cols-2 gap-4 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
            {newArrivals.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      {/* ---------------- BULK ORDER CTA ---------------- */}
      <section className="container-x mt-16">
        <div className="bg-pattern-light relative overflow-hidden rounded-3xl border-2 border-gold-300 bg-gold-50 p-8 sm:p-10">
          <Star8 className="absolute -top-10 -right-10 size-48 text-gold-200/60" />
          <div className="relative grid items-center gap-6 md:grid-cols-[1fr_auto]">
            <div>
              <div className="flex items-center gap-2 text-gold-700">
                <HandHeart className="size-5" />
                <span className="text-xs font-bold tracking-[0.2em] uppercase">For Madaris, Masajid & Libraries</span>
              </div>
              <h3 className="mt-2 font-display text-3xl font-bold text-brand-900 sm:text-4xl">Bulk orders at special rates</h3>
              <p dir="rtl" lang="ur" className="font-urdu text-lg text-brand-800" style={{ lineHeight: 2.1 }}>
                مدارس اور مساجد کے لیے خصوصی رعایت — واٹس ایپ پر رابطہ کریں
              </p>
              <OrnamentDivider className="my-3 max-w-xs" />
              <p className="max-w-xl text-sm text-stone-600">
                Need Qurans for a hifz class or a full set of Dars-e-Nizami books? Send us your list and we'll share a
                quotation with delivery to your city.
              </p>
            </div>
            <a
              href={whatsappLink(settings.whatsapp, 'Assalamu Alaikum, I want a quotation for a bulk order.')}
              target="_blank"
              rel="noreferrer"
              className="btn btn-whatsapp px-6 py-3 text-base"
            >
              <MessageCircle className="size-5" /> Get a Quote on WhatsApp
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
