import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';
import { requireAuth } from '../middleware/auth';
import type { AppContext } from '../index';

export const contactRouter = new Hono<AppContext>();

const messageSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  phone: z.string().optional(),
  subject: z.string().min(2).max(200),
  message: z.string().min(10).max(2000),
});

contactRouter.post('/', zValidator('json', messageSchema), async (c) => {
  const db = c.get('db');
  const msg = await db.contactMessage.create({ data: c.req.valid('json') });
  return c.json({ data: msg, message: 'Message sent successfully' }, 201);
});

contactRouter.get('/', requireAuth, async (c) => {
  const db = c.get('db');
  const page = parseInt(c.req.query('page') ?? '1');
  const limit = parseInt(c.req.query('limit') ?? '20');
  const skip = (page - 1) * limit;
  const [items, total] = await Promise.all([
    db.contactMessage.findMany({ orderBy: { createdAt: 'desc' }, skip, take: limit }),
    db.contactMessage.count(),
  ]);
  return c.json({ data: items, total, page, limit, totalPages: Math.ceil(total / limit) });
});

contactRouter.patch('/:id/read', requireAuth, async (c) => {
  const db = c.get('db');
  await db.contactMessage.update({ where: { id: c.req.param('id') }, data: { read: true } });
  return c.json({ message: 'Marked as read' });
});

contactRouter.delete('/:id', requireAuth, async (c) => {
  const db = c.get('db');
  await db.contactMessage.delete({ where: { id: c.req.param('id') } });
  return c.json({ message: 'Deleted successfully' });
});
