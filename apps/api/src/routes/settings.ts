import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';
import { requireAuth } from '../middleware/auth';
import type { AppContext } from '../index';

export const settingsRouter = new Hono<AppContext>();

settingsRouter.get('/', async (c) => {
  const db = c.get('db');
  const settings = await db.siteSetting.findMany();
  return c.json({ data: Object.fromEntries(settings.map((s) => [s.key, s.value])) });
});

settingsRouter.put('/:key', requireAuth, zValidator('json', z.object({ value: z.string() })), async (c) => {
  const db = c.get('db');
  const key = c.req.param('key');
  const { value } = c.req.valid('json');
  const setting = await db.siteSetting.upsert({ where: { key }, update: { value }, create: { key, value } });
  return c.json({ data: setting });
});

settingsRouter.post('/bulk', requireAuth, zValidator('json', z.record(z.string())), async (c) => {
  const db = c.get('db');
  const data = c.req.valid('json');
  await Promise.all(
    Object.entries(data).map(([key, value]) =>
      db.siteSetting.upsert({ where: { key }, update: { value }, create: { key, value } })
    )
  );
  return c.json({ message: 'Settings updated' });
});
