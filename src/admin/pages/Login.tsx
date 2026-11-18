import { Lock } from 'lucide-react';
import { useState, type FormEvent } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { Emblem } from '../../components/ui/Ornament';
import { useAuth } from '../../context/AuthContext';

/** Only allow redirects back into the admin panel — never to another site or arbitrary path. */
function safeRedirect(target: unknown): string {
  if (typeof target !== 'string') return '/admin';
  if (!/^\/admin(\/[A-Za-z0-9\-_/]*)?$/.test(target) || target.includes('//')) return '/admin';
  return target;
}

export function AdminLogin() {
  const { isAdmin, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = safeRedirect((location.state as { from?: unknown } | null)?.from);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  if (isAdmin) return <Navigate to={from} replace />;

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    try {
      const result = await login(email, password);
      if (result.ok) navigate(from, { replace: true });
      else {
        setError(result.error);
        setPassword('');
      }
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="bg-pattern-dark flex min-h-screen items-center justify-center bg-brand-900 p-4">
      <div className="w-full max-w-md">
        <div className="mb-6 text-center text-white">
          <Emblem className="mx-auto size-16" />
          <h1 className="mt-3 font-display text-4xl font-bold">Akhoon Traders</h1>
          <p lang="ur" className="font-urdu text-xl text-gold-300" style={{ lineHeight: 2 }}>
            ایڈمن پینل
          </p>
        </div>
        <form onSubmit={submit} className="rounded-2xl bg-white p-7 shadow-2xl">
          <h2 className="text-lg font-semibold text-stone-900">Sign in to manage your store</h2>
          {error && <p className="mt-3 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
          <div className="mt-5 space-y-4">
            <div>
              <label className="label" htmlFor="a-email">
                Email
              </label>
              <input id="a-email" type="email" className="input" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="username" required />
            </div>
            <div>
              <label className="label" htmlFor="a-pass">
                Password
              </label>
              <input id="a-pass" type="password" className="input" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" required />
            </div>
          </div>
          <button className="btn btn-primary mt-6 w-full py-3" disabled={busy}>
            <Lock className="size-4" /> {busy ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
        <Link to="/" className="mt-5 block text-center text-sm text-brand-100/80 hover:text-gold-300">
          ← Back to store
        </Link>
      </div>
    </div>
  );
}
