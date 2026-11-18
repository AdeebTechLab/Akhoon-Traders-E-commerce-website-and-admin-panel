import { createContext, useCallback, useContext, useEffect, useMemo, type ReactNode } from 'react';
import { ADMIN_CONFIG, ADMIN_SESSION_MS, LOGIN_LOCKOUT_MS, LOGIN_MAX_ATTEMPTS } from '../config/site';
import { useLocalStorage } from '../hooks/useLocalStorage';

export type LoginResult = { ok: true } | { ok: false; error: string };

interface AuthContextValue {
  isAdmin: boolean;
  adminName: string;
  login: (email: string, password: string) => Promise<LoginResult>;
  logout: () => void;
}

interface AdminSession {
  token: string;
  expiresAt: number;
}

interface LoginThrottle {
  failures: number;
  lockedUntil: number;
}

const PBKDF2_ITERATIONS = 210_000;

const AuthContext = createContext<AuthContextValue | null>(null);

const toHex = (buf: ArrayBuffer) => Array.from(new Uint8Array(buf), (b) => b.toString(16).padStart(2, '0')).join('');
const fromHex = (hex: string) => new Uint8Array((hex.match(/.{2}/g) ?? []).map((h) => parseInt(h, 16)));

async function pbkdf2(password: string, saltHex: string): Promise<string> {
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(password), 'PBKDF2', false, ['deriveBits']);
  const bits = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', hash: 'SHA-256', salt: fromHex(saltHex), iterations: PBKDF2_ITERATIONS },
    key,
    256,
  );
  return toHex(bits);
}

/** Constant-time string comparison so timing doesn't leak how much of the hash matched. */
function safeEqual(a: string, b: string): boolean {
  let diff = a.length ^ b.length;
  for (let i = 0; i < Math.max(a.length, b.length); i++) diff |= (a.charCodeAt(i) || 0) ^ (b.charCodeAt(i) || 0);
  return diff === 0;
}

function newToken(): string {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  return toHex(bytes.buffer);
}

const isValidSession = (s: AdminSession | null): s is AdminSession =>
  !!s && typeof s === 'object' && typeof s.token === 'string' && s.token.length === 64 && typeof s.expiresAt === 'number' && s.expiresAt > Date.now();

/**
 * Frontend-only auth. NOTE: anything in the browser can be tampered with by the
 * person using it, so this only protects the demo UI. When the backend is ready,
 * replace `login` with an API call and keep the session in an httpOnly cookie.
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useLocalStorage<AdminSession | null>('admin-session', null);
  const [throttle, setThrottle] = useLocalStorage<LoginThrottle>('admin-login-throttle', { failures: 0, lockedUntil: 0 });

  const isAdmin = isValidSession(session);

  // Drop expired or malformed sessions, and log out automatically when the session expires.
  useEffect(() => {
    if (!session) return;
    if (!isValidSession(session)) {
      setSession(null);
      return;
    }
    const t = window.setTimeout(() => setSession(null), session.expiresAt - Date.now());
    return () => window.clearTimeout(t);
  }, [session, setSession]);

  const login = useCallback(
    async (email: string, password: string): Promise<LoginResult> => {
      const now = Date.now();
      if (throttle.lockedUntil > now) {
        const mins = Math.ceil((throttle.lockedUntil - now) / 60000);
        return { ok: false, error: `Too many failed attempts. Try again in ${mins} minute${mins > 1 ? 's' : ''}.` };
      }

      const [salt, expected] = ADMIN_CONFIG.passwordHash.split(':');
      if (!ADMIN_CONFIG.email || !salt || !expected) {
        return { ok: false, error: 'Admin login is not configured. Set VITE_ADMIN_EMAIL and VITE_ADMIN_PASSWORD_HASH.' };
      }

      const actual = await pbkdf2(password, salt);
      const ok = safeEqual(email.trim().toLowerCase(), ADMIN_CONFIG.email) && safeEqual(actual, expected.toLowerCase());

      if (ok) {
        setThrottle({ failures: 0, lockedUntil: 0 });
        setSession({ token: newToken(), expiresAt: now + ADMIN_SESSION_MS });
        return { ok: true };
      }

      const failures = throttle.failures + 1;
      if (failures >= LOGIN_MAX_ATTEMPTS) {
        setThrottle({ failures: 0, lockedUntil: now + LOGIN_LOCKOUT_MS });
        return { ok: false, error: 'Too many failed attempts. Login is locked for 5 minutes.' };
      }
      setThrottle({ failures, lockedUntil: 0 });
      return { ok: false, error: 'Incorrect email or password.' };
    },
    [throttle, setThrottle, setSession],
  );

  const logout = useCallback(() => setSession(null), [setSession]);

  const value = useMemo(
    () => ({ isAdmin, adminName: ADMIN_CONFIG.name, login, logout }),
    [isAdmin, login, logout],
  );

  return <AuthContext value={value}>{children}</AuthContext>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}
