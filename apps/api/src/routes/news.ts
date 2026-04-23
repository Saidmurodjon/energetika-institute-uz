import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';
import { prisma } from '@energetika/db';
import { requireAuth } from '../middleware/auth';

export const newsRouter = new Hono();

const newsSchema = z.object({
  slug: z.string().min(1),
  titleUz: z.string().min(1),
  titleEn: z.string().min(1),
  titleRu: z.string().min(1),
  summaryUz: z.string().min(1),
  summaryEn: z.string().min(1),
  summaryRu: z.string().min(1),
  contentUz: z.string().min(1),
  contentEn: z.string().min(1),
  contentRu: z.string().min(1),
  imageUrl: z.string().url().optional().or(z.literal('')),
  publishedAt: z.string().optional(),
});

// Public: list news
newsRouter.get('/', async (c) => {
  const page = parseInt(c.req.query('page') ?? '1');
  const limit = parseInt(c.req.query('limit') ?? '10');
  const skip = (page - 1) * limit;

  const [items, total] = await Promise.all([
    prisma.news.findMany({
      orderBy: { publishedAt: 'desc' },
      skip,
      take: limit,
      select: {
        id: true, slug: true, imageUrl: true, publishedAt: true,
        titleUz: true, titleEn: true, titleRu: true,
        summaryUz: true, summaryEn: true, summaryRu: true,
      },
    }),
    prisma.news.count(),
  ]);

  return c.json({
    data: items,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  });
});

// Public: get single news by slug
newsRouter.get('/:slug', async (c) => {
  const slug = c.req.param('slug');
  const item = await prisma.news.findUnique({ where: { slug } });
  if (!item) return c.json({ error: 'Not found' }, 404);
  return c.json({ data: item });
});

// Admin: create
newsRouter.post('/', requireAuth, zValidator('json', newsSchema), async (c) => {
  const data = c.req.valid('json');
  const item = await prisma.news.create({
    data: {
      ...data,
      imageUrl: data.imageUrl || null,
      publishedAt: data.publishedAt ? new Date(data.publishedAt) : new Date(),
    },
  });
  return c.json({ data: item }, 201);
});

// Admin: update
newsRouter.put('/:id', requireAuth, zValidator('json', newsSchema.partial()), async (c) => {
  const id = c.req.param('id');
  const data = c.req.valid('json');

  const item = await prisma.news.update({
    where: { id },
    data: {
      ...data,
      imageUrl: data.imageUrl || null,
      publishedAt: data.publishedAt ? new Date(data.publishedAt) : undefined,
    },
  });
  return c.json({ data: item });
});

// Admin: delete
newsRouter.delete('/:id', requireAuth, async (c) => {
  const id = c.req.param('id');
  await prisma.news.delete({ where: { id } });
  return c.json({ message: 'Deleted successfully' });
});
