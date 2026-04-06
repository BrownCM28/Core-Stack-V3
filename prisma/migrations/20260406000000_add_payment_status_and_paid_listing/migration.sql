-- Add paymentStatus to Job
ALTER TABLE "Job" ADD COLUMN "paymentStatus" TEXT NOT NULL DEFAULT 'free';

-- Add PAID_LISTING to ActivityEventType enum
ALTER TYPE "ActivityEventType" ADD VALUE 'PAID_LISTING';
