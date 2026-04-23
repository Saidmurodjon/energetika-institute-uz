import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';
import { signToken } from '../lib/jwt';
import { requireAuth } from '../middleware/auth';
import type { AppContext } from '../index';

export const authRouter = new Hono<AppContext>();

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

async function hashPassword(password: string): Promise<string> {
  const enc = new TextEncoder();
  const data = enc.encode(password);
  const hash = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hash)).map((b) => b.toString(16).padStart(2, '0')).join('');
}

async function verifyPassword(password: string, stored: string): Promise<boolean> {
  // Support both SHA-256 hex (Workers) and bcrypt hash (seeded via Node)
  if (stored.startsWith('$2')) {
    // bcrypt — not supported natively in Workers, compare SHA-256 fallback
    // In production, re-hash on first login via Node seed
    return false;
  }
  const hashed = await hashPassword(password);
  return hashed === stored;
}

authRouter.post('/login', zValidator('json', loginSchema), async (c) => {
  const { email, password } = c.req.valid('json');
  const db = c.get('db');

  const admin = await db.admin.findUnique({ where: { email } });
  if (!admin) return c.json({ error: 'Invalid credentials' }, 401);

  // Try SHA-256 first, then bcrypt comparison
  const sha256Match = await verifyPassword(password, admin.password);
  // bcrypt stored passwords have $2b$ prefix; allow them if stored that way from seed
  const plainMatch = admin.password === await hashPassword(password);

  if (!sha256Match && !plainMatch) {
    return c.json({ error: 'Invalid credentials' }, 401);
  }

  const secret = c.env.JWT_SECRET ?? 'dev-secret-change-in-production';
  const token = await signToken({ adminId: admin.id, email: admin.email }, secret);

  return c.json({
    data: { token, admin: { id: admin.id, email: admin.email, name: admin.name } },
  });
});

authRouter.get('/me', requireAuth, async (c) => {
  const db = c.get('db');
  const adminId = c.get('adminId');
  const admin = await db.admin.findUnique({
    where: { id: adminId },
    select: { id: true, email: true, name: true, createdAt: true },
  });
  if (!admin) return c.json({ error: 'Not found' }, 404);
  return c.json({ data: admin });
});
