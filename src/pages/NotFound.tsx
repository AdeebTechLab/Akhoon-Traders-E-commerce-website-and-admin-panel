import { Link } from 'react-router-dom';
import { Star8 } from '../components/ui/Ornament';

export function NotFound() {
  return (
    <div className="container-x py-24 text-center">
      <Star8 className="mx-auto size-14 text-gold-400" />
      <h1 className="mt-4 font-display text-6xl font-bold text-brand-900">404</h1>
      <p className="mt-2 text-stone-600">Sorry, we couldn't find that page.</p>
      <p lang="ur" className="font-urdu text-stone-500">
        معذرت، یہ صفحہ موجود نہیں ہے
      </p>
      <Link to="/" className="btn btn-primary mt-6">
        Back to Home
      </Link>
    </div>
  );
}
