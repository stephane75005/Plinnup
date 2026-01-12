// app/lib/prisma.ts

import { PrismaClient } from "@/app/generated/prisma";

// ---------- Prisma singleton pour éviter les erreurs dev ----------
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({ log: ["warn", "error", "query"] });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
