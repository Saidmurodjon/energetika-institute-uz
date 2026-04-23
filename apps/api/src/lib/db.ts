import { neon } from '@neondatabase/serverless';
import { PrismaNeon } from '@prisma/adapter-neon';
import { PrismaClient } from '@prisma/client';

let _prisma: PrismaClient | null = null;

export function getDb(databaseUrl: string): PrismaClient {
  if (!_prisma) {
    const sql = neon(databaseUrl);
    const adapter = new PrismaNeon(sql);
    _prisma = new PrismaClient({ adapter } as ConstructorParameters<typeof PrismaClient>[0]);
  }
  return _prisma;
}
