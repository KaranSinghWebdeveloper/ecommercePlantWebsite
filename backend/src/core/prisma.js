const { PrismaClient } = require('../generated/prisma');

// Initialize Prisma Client normally. The previous adapter-based setup
// expected an external `@prisma/adapter-mysql` package which isn't available.
// Using the standard PrismaClient with DATABASE_URL is compatible with
// the generated client and works for local development.
const globalForPrisma = global;

const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ['query', 'error', 'warn'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

module.exports = prisma;
