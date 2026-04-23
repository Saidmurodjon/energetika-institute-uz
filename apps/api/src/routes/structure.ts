import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';
import { prisma } from '@energetika/db';
import { requireAuth } from '../middleware/auth';

export const structureRouter = new Hono();

const unitSchema = z.object({
  nameUz: z.string().min(1),
  nameEn: z.string().min(1),
  nameRu: z.string().min(1),
  descriptionUz: z.string().default(''),
  descriptionEn: z.string().default(''),
  descriptionRu: z.string().default(''),
  head: z.string().optional(),
  type: z.enum(['department', 'laboratory', 'division', 'center', 'sector']).default('department'),
  order: z.number().int().default(0),
  parentId: z.string().optional().nullable(),
});

// Build nested tree from flat list
function buildTree(units: any[], parentId: string | null = null): any[] {
  return units
    .filter((u) => u.parentId === parentId)
    .sort((a, b) => a.order - b.order)
    .map((u) => ({ ...u, children: buildTree(units, u.id) }));
}

// Public: get full structure tree
structureRouter.get('/', async (c) => {
  const units = await prisma.structureUnit.findMany({
    orderBy: { order: 'asc' },
  });
  const tree = buildTree(units, null);
  return c.json({ data: tree });
});

// Public: get single unit
structureRouter.get('/:id', async (c) => {
  const id = c.req.param('id');
  const unit = await prisma.structureUnit.findUnique({ where: { id } });
  if (!unit) return c.json({ error: 'Not found' }, 404);
  return c.json({ data: unit });
});

// Admin: create
structureRouter.post('/', requireAuth, zValidator('json', unitSchema), async (c) => {
  const data = c.req.valid('json');
  const unit = await prisma.structureUnit.create({ data });
  return c.json({ data: unit }, 201);
});

// Admin: update
structureRouter.put('/:id', requireAuth, zValidator('json', unitSchema.partial()), async (c) => {
  const id = c.req.param('id');
  const data = c.req.valid('json');
  const unit = await prisma.structureUnit.update({ where: { id }, data });
  return c.json({ data: unit });
});

// Admin: delete
structureRouter.delete('/:id', requireAuth, async (c) => {
  const id = c.req.param('id');
  // Move children to parent before deleting
  const unit = await prisma.structureUnit.findUnique({ where: { id } });
  if (unit) {
    await prisma.structureUnit.updateMany({
      where: { parentId: id },
      data: { parentId: unit.parentId },
    });
  }
  await prisma.structureUnit.delete({ where: { id } });
  return c.json({ message: 'Deleted successfully' });
});
