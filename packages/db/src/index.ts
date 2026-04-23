import { PrismaClient } from '@prisma/client';

// For local development: standard PrismaClient
// For Cloudflare Workers: use createWorkerClient from ./worker-client
export function createPrismaClient(databaseUrl: string): PrismaClient {
  return new PrismaClient({
    datasources: { db: { url: databaseUrl } },
  });
}

// Singleton for local dev / Node.js environments
declare global {
  // eslint-disable-next-line no-var
  var __prisma: PrismaClient | undefined;
}

export function getPrisma(databaseUrl?: string): PrismaClient {
  if (!globalThis.__prisma) {
    globalThis.__prisma = new PrismaClient({
      datasources: { db: { url: databaseUrl ?? process.env.DATABASE_URL } },
    });
  }
  return globalThis.__prisma;
}

export { PrismaClient };
export * from '@prisma/client';
