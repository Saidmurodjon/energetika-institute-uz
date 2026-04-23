import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';
import { prisma } from '@energetika/db';
import { requireAuth } from '../middleware/auth';

export const publicationsRouter = new Hono();

const pubSchema = z.object({
  titleUz: z.string().min(1),
  titleEn: z.string().min(1),
  titleRu: z.string().min(1),
  authors: z.string().min(1),
  journal: z.string().optional(),
  year: z.number().int().min(1900).max(2100),
  doi: z.string().optional(),
  fileUrl: z.string().url().optional().or(z.literal('')),
  category: z.enum(['article', 'monograph', 'conference', 'patent', 'report']).default('article'),
});

// Public: list
publicationsRouter.get('/', async (c) => {
  const page = parseInt(c.req.query('page') ?? '1');
  const limit = parseInt(c.req.query('limit') ?? '20');
  const category = c.req.query('category');
  const skip = (page - 1) * limit;

  const where = category ? { category } : {};

  const [items, total] = await Promise.all([
    prisma.publication.findMany({
      where,
      orderBy: { year: 'desc' },
      skip,
      take: limit,
    }),
    prisma.publication.count({ where }),
  ]);

  return c.json({ data: items, total, page, limit, totalPages: Math.ceil(total / limit) });
});

// Public: single
publicationsRouter.get('/:id', async (c) => {
  const id = c.req.param('id');
  const item = await prisma.publication.findUnique({ where: { id } });
  if (!item) return c.json({ error: 'Not found' }, 404);
  return c.json({ data: item });
});

// Admin: create
publicationsRouter.post('/', requireAuth, zValidator('json', pubSchema), async (c) => {
  const data = c.req.valid('json');
  const item = await prisma.publication.create({
    data: { ...data, doi: data.doi || null, fileUrl: data.fileUrl || null, journal: data.journal || null },
  });
  return c.json({ data: item }, 201);
});

// Admin: update
publicationsRouter.put('/:id', requireAuth, zValidator('json', pubSchema.partial()), async (c) => {
  const id = c.req.param('id');
  const data = c.req.valid('json');
  const item = await prisma.publication.update({ where: { id }, data });
  return c.json({ data: item });
});

// Admin: delete
publicationsRouter.delete('/:id', requireAuth, async (c) => {
  const id = c.req.param('id');
  await prisma.publication.delete({ where: { id } });
  return c.json({ message: 'Deleted successfully' });
});
