import { BadgeCheck, BookOpen, Droplets, HeartHandshake, Truck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Emblem, OrnamentDivider } from '../components/ui/Ornament';
import { SectionHeading } from '../components/ui/SectionHeading';
import { useStore } from '../context/StoreContext';

const VALUES = [
  { icon: BookOpen, title: 'Authentic knowledge', text: 'We stock original editions from established Pakistani publishers — no photocopies or misprints.' },
  { icon: Droplets, title: 'Pure Sunnah oils', text: 'Zaitoon and kalonji oils are sourced pure, and our ruqyah oils are recited with Quranic ayaat and masnoon duas.' },
  { icon: Truck, title: 'Delivered nationwide', text: 'From Karachi to Gilgit, parcels go out through trusted couriers with Cash on Delivery.' },
  { icon: HeartHandshake, title: 'Honest dealing', text: 'Fair prices, clear policies and a real person on WhatsApp to answer your questions.' },
];

export function About() {
  const { settings } = useStore();
  return (
    <div>
      <section className="bg-pattern-dark bg-brand-900 py-16 text-center text-white">
        <div className="container-x">
          <Emblem className="mx-auto size-20" />
          <h1 className="mt-4 font-display text-5xl font-bold">About {settings.storeName}</h1>
          <p lang="ur" className="font-urdu text-2xl text-gold-300" style={{ lineHeight: 2 }}>
            {settings.storeNameUrdu} کے بارے میں
          </p>
        </div>
      </section>

      <section className="container-x max-w-4xl py-14">
        <div className="grid gap-10 md:grid-cols-2">
          <div>
            <h2 className="font-display text-3xl font-bold text-brand-900">Our story</h2>
            <p className="mt-3 leading-relaxed text-stone-700">
              {settings.storeName} was started with a simple aim: to make authentic Islamic books and pure Sunnah oils
              easy to buy for every household in Pakistan. Whether you are a student of Dars-e-Nizami, an imam setting up
              a masjid library, or a family looking for a good tafseer to read together, we want you to get the right
              book at a fair price.
            </p>
            <p className="mt-3 leading-relaxed text-stone-700">
              Alongside books we offer zaitoon and kalonji oils mentioned in the ahadith, and ruqyah oils prepared with
              the recitation of Quranic ayaat — packed with care and delivered to your door.
            </p>
          </div>
          <div dir="rtl" lang="ur" className="rounded-2xl bg-parchment p-6 font-urdu text-brand-900">
            <h2 className="text-2xl font-bold">ہمارا مقصد</h2>
            <p className="mt-2">
              آخون ٹریڈرز کا مقصد پاکستان کے ہر گھر تک مستند اسلامی کتب اور خالص سنت تیل آسانی سے پہنچانا ہے۔ طلبہ، ائمہ
              کرام، مدارس اور عام قارئین سب کے لیے مناسب قیمت پر معیاری کتب۔
            </p>
          </div>
        </div>

        <OrnamentDivider className="my-14" />

        <SectionHeading title="What we stand for" urdu="ہماری خصوصیات" />
        <div className="grid gap-5 sm:grid-cols-2">
          {VALUES.map(({ icon: Icon, title, text }) => (
            <div key={title} className="card flex gap-4 p-5">
              <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-800">
                <Icon className="size-5" />
              </div>
              <div>
                <h3 className="font-semibold text-stone-900">{title}</h3>
                <p className="mt-1 text-sm text-stone-600">{text}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-wrap items-center justify-center gap-3">
          <BadgeCheck className="size-5 text-gold-600" />
          <span className="text-stone-600">Have a question before you order?</span>
          <Link to="/contact" className="btn btn-primary">
            Contact us
          </Link>
        </div>
      </section>
    </div>
  );
}
