import { PrismaClient } from "@/app/generated/prisma";
import bcrypt from "bcryptjs";

// ⚠️ Utilisation du singleton pour Next.js
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };
export const prisma =
  globalForPrisma.prisma ?? new PrismaClient({ log: ["info", "error"] });
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

async function main() {
  console.log("Seeding database...");

  // ✅ Hash du mot de passe admin
  const adminPassword = await bcrypt.hash("1234", 10);

  // 🔹 Création de l'utilisateur admin
  const adminUser = await prisma.user.upsert({
    where: { email: "admin@test.com" },
    update: {},
    create: {
      name: "Admin",
      email: "admin@test.com",
      password: adminPassword,
    },
  });

  console.log("Admin user created:", adminUser.email);

  // 🔹 Optionnel : un utilisateur test
  const testPassword = await bcrypt.hash("test", 10);
  const testUser = await prisma.user.upsert({
    where: { email: "test@test.com" },
    update: {},
    create: {
      name: "Test User",
      email: "test@test.com",
      password: testPassword,
    },
  });

  console.log("Test user created:", testUser.email);

  console.log("✅ Seeding completed.");
}

// Exécution
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
