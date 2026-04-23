import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';
import { prisma } from '@energetika/db';
import { requireAuth } from '../middleware/auth';

export const contactRouter = new Hono();

const messageSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  phone: z.string().optional(),
  subject: z.string().min(2).max(200),
  message: z.string().min(10).max(2000),
});

// Public: submit contact message
contactRouter.post('/', zValidator('json', messageSchema), async (c) => {
  const data = c.req.valid('json');
  const msg = await prisma.contactMessage.create({ data });
  return c.json({ data: msg, message: 'Message sent successfully' }, 201);
});

// Admin: list messages
contactRouter.get('/', requireAuth, async (c) => {
  const page = parseInt(c.req.query('page') ?? '1');
  const limit = parseInt(c.req.query('limit') ?? '20');
  const skip = (page - 1) * limit;

  const [items, total] = await Promise.all([
    prisma.contactMessage.findMany({
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    }),
    prisma.contactMessage.count(),
  ]);

  return c.json({ data: items, total, page, limit, totalPages: Math.ceil(total / limit) });
});

// Admin: mark as read
contactRouter.patch('/:id/read', requireAuth, async (c) => {
  const id = c.req.param('id');
  await prisma.contactMessage.update({ where: { id }, data: { read: true } });
  return c.json({ message: 'Marked as read' });
});

// Admin: delete message
contactRouter.delete('/:id', requireAuth, async (c) => {
  const id = c.req.param('id');
  await prisma.contactMessage.delete({ where: { id } });
  return c.json({ message: 'Deleted successfully' });
});
