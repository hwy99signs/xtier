import { PrismaClient } from '@prisma/client';

let _prisma: PrismaClient | null = null;

const getPrisma = () => {
  if (!_prisma) {
    _prisma = new PrismaClient({
      log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    });
  }
  return _prisma;
};

export const prisma = new Proxy({} as PrismaClient, {
  get: (target, prop) => {
    return (getPrisma() as any)[prop];
  },
});
