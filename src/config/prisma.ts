import { PrismaClient } from '@prisma/client';

// Explicitly connecting using the direct database URL to bypass engine type issues
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
  log: ['query', 'error', 'warn'],
});

export default prisma;