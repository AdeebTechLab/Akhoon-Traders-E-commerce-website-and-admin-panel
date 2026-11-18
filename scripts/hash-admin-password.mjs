// Usage: node scripts/hash-admin-password.mjs "your-strong-password"
// Prints a VITE_ADMIN_PASSWORD_HASH value (salt:hash) to put in .env.local
import { pbkdf2Sync, randomBytes } from 'node:crypto';

const password = process.argv[2];
if (!password || password.length < 12) {
  console.error('Please pass a strong password (at least 12 characters).');
  process.exit(1);
}
const salt = randomBytes(16).toString('hex');
const hash = pbkdf2Sync(password, Buffer.from(salt, 'hex'), 210000, 32, 'sha256').toString('hex');
console.log(`VITE_ADMIN_PASSWORD_HASH=${salt}:${hash}`);
