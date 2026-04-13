/**
 * Applies the Phase 12/13 schema migrations directly to the DB.
 * Safe — uses ADD COLUMN IF NOT EXISTS.
 *
 * Usage: npx tsx scripts/apply-migrations.ts
 */
import { config } from "dotenv";
import path from "path";
config({ path: path.resolve(__dirname, "../.env.local") });

import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const adapter = new PrismaPg(pool as any);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const prisma = new PrismaClient({ adapter } as any);

async function main() {
  console.log("Applying schema migrations…\n");

  await prisma.$executeRawUnsafe(
    `ALTER TABLE "Job" ADD COLUMN IF NOT EXISTS "applyUrl" TEXT`
  );
  console.log("✓ Job.applyUrl");

  await prisma.$executeRawUnsafe(
    `ALTER TABLE "Job" ADD COLUMN IF NOT EXISTS "paymentStatus" TEXT NOT NULL DEFAULT 'free'`
  );
  console.log("✓ Job.paymentStatus");

  // Postgres: ALTER TYPE ADD VALUE must not be in a transaction block
  // pg driver runs statements outside explicit transactions by default
  await prisma.$executeRawUnsafe(`
    DO $$
    BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM pg_enum
        WHERE enumlabel = 'PAID_LISTING'
          AND enumtypid = (SELECT oid FROM pg_type WHERE typname = 'ActivityEventType')
      ) THEN
        ALTER TYPE "ActivityEventType" ADD VALUE 'PAID_LISTING';
      END IF;
    END
    $$
  `);
  console.log("✓ ActivityEventType.PAID_LISTING");

  console.log("\nAll migrations applied.");
  await prisma.$disconnect();
}

main().catch((err) => {
  console.error(err);
  prisma.$disconnect();
  process.exit(1);
});
