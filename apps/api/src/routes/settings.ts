import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';
import { prisma } from '@energetika/db';
import { requireAuth } from '../middleware/auth';

export const settingsRouter = new Hono();

// Public: get all settings as key-value map
settingsRouter.get('/', async (c) => {
  const settings = await prisma.siteSetting.findMany();
  const map = Object.fromEntries(settings.map((s) => [s.key, s.value]));
  return c.json({ data: map });
});

// Admin: upsert setting
settingsRouter.put('/:key', requireAuth, zValidator('json', z.object({ value: z.string() })), async (c) => {
  const key = c.req.param('key');
  const { value } = c.req.valid('json');

  const setting = await prisma.siteSetting.upsert({
    where: { key },
    update: { value },
    create: { key, value },
  });

  return c.json({ data: setting });
});

// Admin: bulk update settings
settingsRouter.post('/bulk', requireAuth, zValidator('json', z.record(z.string())), async (c) => {
  const data = c.req.valid('json');

  await Promise.all(
    Object.entries(data).map(([key, value]) =>
      prisma.siteSetting.upsert({
        where: { key },
        update: { value },
        create: { key, value },
      })
    )
  );

  return c.json({ message: 'Settings updated' });
});
