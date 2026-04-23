import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';
import { compare, hash } from 'bcryptjs';
import { prisma } from '@energetika/db';
import { signToken } from '../lib/jwt';
import { requireAuth } from '../middleware/auth';

export const authRouter = new Hono();

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

authRouter.post('/login', zValidator('json', loginSchema), async (c) => {
  const { email, password } = c.req.valid('json');

  const admin = await prisma.admin.findUnique({ where: { email } });
  if (!admin) {
    return c.json({ error: 'Invalid credentials' }, 401);
  }

  const valid = await compare(password, admin.password);
  if (!valid) {
    return c.json({ error: 'Invalid credentials' }, 401);
  }

  const token = signToken({ adminId: admin.id, email: admin.email });

  return c.json({
    data: {
      token,
      admin: { id: admin.id, email: admin.email, name: admin.name },
    },
  });
});

authRouter.get('/me', requireAuth, async (c) => {
  const adminId = c.get('adminId');
  const admin = await prisma.admin.findUnique({
    where: { id: adminId },
    select: { id: true, email: true, name: true, createdAt: true },
  });

  if (!admin) return c.json({ error: 'Not found' }, 404);
  return c.json({ data: admin });
});

authRouter.put('/password', requireAuth, zValidator('json', z.object({
  currentPassword: z.string(),
  newPassword: z.string().min(8),
})), async (c) => {
  const adminId = c.get('adminId');
  const { currentPassword, newPassword } = c.req.valid('json');

  const admin = await prisma.admin.findUnique({ where: { id: adminId } });
  if (!admin) return c.json({ error: 'Not found' }, 404);

  const valid = await compare(currentPassword, admin.password);
  if (!valid) return c.json({ error: 'Current password is incorrect' }, 400);

  const hashed = await hash(newPassword, 12);
  await prisma.admin.update({ where: { id: adminId }, data: { password: hashed } });

  return c.json({ message: 'Password updated successfully' });
});
