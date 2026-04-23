import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { prettyJSON } from 'hono/pretty-json';
import { authRouter } from './routes/auth';
import { newsRouter } from './routes/news';
import { publicationsRouter } from './routes/publications';
import { structureRouter } from './routes/structure';
import { settingsRouter } from './routes/settings';
import { contactRouter } from './routes/contact';

const app = new Hono();

// Middleware
app.use('*', logger());
app.use('*', prettyJSON());
app.use(
  '*',
  cors({
    origin: [
      'http://localhost:5173',
      'https://energetika-site.pages.dev',
      process.env.FRONTEND_URL ?? '',
    ].filter(Boolean),
    allowMethods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  })
);

// Health check
app.get('/', (c) => c.json({ status: 'ok', service: 'Energetika API', version: '1.0.0' }));

// Routes
app.route('/api/auth', authRouter);
app.route('/api/news', newsRouter);
app.route('/api/publications', publicationsRouter);
app.route('/api/structure', structureRouter);
app.route('/api/settings', settingsRouter);
app.route('/api/contact', contactRouter);

// 404 handler
app.notFound((c) => c.json({ error: 'Not found' }, 404));

// Error handler
app.onError((err, c) => {
  console.error(err);
  return c.json({ error: 'Internal server error' }, 500);
});

const port = parseInt(process.env.PORT ?? '3000');
console.log(`🚀 API server running on http://localhost:${port}`);

export default { port, fetch: app.fetch };
