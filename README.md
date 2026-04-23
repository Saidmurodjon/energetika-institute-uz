# Energetika muammolari instituti — Rasmiy veb-sayt

O'zbekiston Respublikasi Fanlar akademiyasi Energetika muammolari institutining rasmiy veb-sayti.

## Tech Stack

| Layer      | Technology                              |
|------------|-----------------------------------------|
| Frontend   | React 18, Vite, TailwindCSS, TypeScript |
| i18n       | react-i18next (uz/en/ru)               |
| Backend    | Bun + Hono, TypeScript                  |
| Database   | Neon PostgreSQL + Prisma ORM            |
| Auth       | JWT                                     |
| Deployment | Cloudflare Pages (web) + Workers (api)  |

## Project Structure

```
/
├── apps/
│   ├── web/          # React + Vite frontend
│   └── api/          # Bun + Hono REST API
├── packages/
│   ├── db/           # Prisma schema + seed
│   └── shared/       # Shared TypeScript types
└── .env.example
```

## Quick Start

```bash
# 1. Copy env file
cp .env.example .env
# Fill in DATABASE_URL, JWT_SECRET

# 2. Install dependencies
npm install

# 3. Generate Prisma client & run migrations
npm run db:generate
npm run db:migrate

# 4. Seed database (creates admin + sample data)
npm run db:seed

# 5. Start development
npm run dev
```

## Admin Credentials (after seed)

- **URL**: http://localhost:5173/admin/login
- **Email**: admin@energetika.uz
- **Password**: Admin123!

> ⚠️ Change the password immediately after first login!

## Deployment

### Cloudflare Workers (API)

```bash
cd apps/api
wrangler secret put DATABASE_URL
wrangler secret put JWT_SECRET
wrangler secret put FRONTEND_URL
wrangler deploy
```

### Cloudflare Pages (Frontend)

```bash
cd apps/web
# Set VITE_API_URL in Cloudflare Pages dashboard
npm run build
# Deploy dist/ folder to Cloudflare Pages
```

## Languages

- 🇺🇿 O'zbek (uz) — default
- 🇬🇧 English (en)
- 🇷🇺 Русский (ru)
