import { PrismaClient } from '@prisma/client';
import { seedDatabase } from '../src/lib/seed-data';

const prisma = new PrismaClient();

async function main() {
  await seedDatabase(prisma);
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
