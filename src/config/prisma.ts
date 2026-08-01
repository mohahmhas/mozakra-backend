import { PrismaClient } from '../generated/prisma/client.js';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

import { env } from './env.js';

const createPrismaClient = () => {
  const pool = new Pool({
    connectionString: env.DATABASE_URL,
  });

  return new PrismaClient({
    adapter: new PrismaPg(pool),
    log: env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
  });
};

const globalForPrisma = globalThis as {
  prisma?: PrismaClient;
};

export const prisma =
  globalForPrisma.prisma ?? createPrismaClient();

if (env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}